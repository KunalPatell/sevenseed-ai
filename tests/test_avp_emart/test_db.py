# -*- coding: utf-8 -*-
"""
Unit tests for apps/avp-emart/backend/app/db.py
Tests: all 3 tables (price_searches, wishlist, price_alerts),
       CRUD operations, JSON round-trips, graceful degradation.
"""
from __future__ import annotations
import sys, os, json
import pytest

BACKEND = os.path.normpath(
    os.path.join(os.path.dirname(__file__), "..", "..", "apps", "avp-emart", "backend")
)
# Ensure emart backend is FIRST in path so its 'app' package wins
if BACKEND in sys.path:
    sys.path.remove(BACKEND)
sys.path.insert(0, BACKEND)


@pytest.fixture(autouse=True)
def isolate_db(tmp_path, monkeypatch):
    db_file = str(tmp_path / "emart_test.sqlite3")
    monkeypatch.setenv("DB_PATH", db_file)
    from conftest import load_isolated_app
    load_isolated_app("avp-emart")
    from app import db as emart_db
    emart_db._available = True
    emart_db.init()
    yield emart_db


# ─────────────────────────────────────────────────────────────────────────────
# INIT
# ─────────────────────────────────────────────────────────────────────────────
class TestInit:
    def test_tables_created(self, isolate_db, tmp_path):
        import sqlite3
        db_path = str(tmp_path / "emart_test.sqlite3")
        conn = sqlite3.connect(db_path)
        tables = {r[0] for r in conn.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()}
        conn.close()
        assert "price_searches" in tables
        assert "wishlist" in tables
        assert "price_alerts" in tables

    def test_init_idempotent(self, isolate_db):
        isolate_db.init()  # second call — must not error


# ─────────────────────────────────────────────────────────────────────────────
# PRICE SEARCHES
# ─────────────────────────────────────────────────────────────────────────────
class TestPriceSearches:
    def test_save_and_list_search(self, isolate_db):
        db = isolate_db
        results = [{"name": "iPhone", "price": 79999, "platform": "Amazon"}]
        sid = db.save_search("iPhone 15", 79999.0, "Amazon", results)
        assert isinstance(sid, int)
        searches = db.list_searches()
        assert len(searches) == 1
        assert searches[0]["query"] == "iPhone 15"
        assert searches[0]["best_price"] == 79999.0
        assert searches[0]["results"][0]["name"] == "iPhone"

    def test_list_searches_limit(self, isolate_db):
        db = isolate_db
        for i in range(10):
            db.save_search(f"Product{i}", float(i * 100), "Flipkart", [])
        assert len(db.list_searches(limit=3)) == 3

    def test_list_searches_empty(self, isolate_db):
        assert isolate_db.list_searches() == []

    def test_results_json_roundtrip(self, isolate_db):
        db = isolate_db
        results = [{"name": "🎮 Gaming Laptop", "price": 89999, "meta": {"nested": [1, 2, 3]}}]
        db.save_search("Gaming", 89999.0, "Amazon", results)
        back = db.list_searches()[0]["results"]
        assert back[0]["meta"]["nested"] == [1, 2, 3]


# ─────────────────────────────────────────────────────────────────────────────
# WISHLIST
# ─────────────────────────────────────────────────────────────────────────────
class TestWishlist:
    def test_add_and_list_wishlist(self, isolate_db):
        db = isolate_db
        wid = db.add_to_wishlist("Wireless Headphones", 4999.0, "Amazon",
                                  "https://amazon.in/dp/B123")
        assert isinstance(wid, int)
        items = db.list_wishlist()
        assert len(items) == 1
        assert items[0]["title"] == "Wireless Headphones"
        assert items[0]["price"] == 4999.0

    def test_delete_wishlist_item(self, isolate_db):
        db = isolate_db
        wid = db.add_to_wishlist("Keyboard", 1299.0, "Flipkart", "https://flipkart.com/p/1")
        assert db.delete_wishlist_item(wid) is True
        assert db.list_wishlist() == []

    def test_delete_nonexistent_wishlist(self, isolate_db):
        assert isolate_db.delete_wishlist_item(9999) is False

    def test_multiple_wishlist_items(self, isolate_db):
        db = isolate_db
        for i in range(5):
            db.add_to_wishlist(f"Item{i}", float(i * 500), "Amazon", f"https://url{i}.com")
        assert len(db.list_wishlist()) == 5

    def test_wishlist_limit(self, isolate_db):
        db = isolate_db
        for i in range(10):
            db.add_to_wishlist(f"Item{i}", 100.0, "Amazon", "https://url.com")
        assert len(db.list_wishlist(limit=3)) == 3


# ─────────────────────────────────────────────────────────────────────────────
# PRICE ALERTS
# ─────────────────────────────────────────────────────────────────────────────
class TestPriceAlerts:
    def test_add_and_list_alert(self, isolate_db):
        db = isolate_db
        aid = db.add_price_alert("Smart TV", 25000.0, 30000.0, "Flipkart")
        assert isinstance(aid, int)
        alerts = db.list_price_alerts()
        assert len(alerts) == 1
        assert alerts[0]["title"] == "Smart TV"
        assert alerts[0]["target_price"] == 25000.0
        assert alerts[0]["current_price"] == 30000.0

    def test_delete_price_alert(self, isolate_db):
        db = isolate_db
        aid = db.add_price_alert("Phone", 12000.0, 15000.0, "Amazon")
        assert db.delete_price_alert(aid) is True
        assert db.list_price_alerts() == []

    def test_delete_nonexistent_alert(self, isolate_db):
        assert isolate_db.delete_price_alert(9999) is False

    def test_zero_price_alert(self, isolate_db):
        """Edge: zero prices should be storable."""
        db = isolate_db
        aid = db.add_price_alert("Free Item", 0.0, 0.0, "Snapdeal")
        assert isinstance(aid, int)

    def test_negative_price_alert(self, isolate_db):
        """Edge: negative price (invalid but DB should not crash)."""
        db = isolate_db
        aid = db.add_price_alert("Negative", -100.0, -50.0, "Amazon")
        assert isinstance(aid, int)


# ─────────────────────────────────────────────────────────────────────────────
# GRACEFUL DEGRADATION
# ─────────────────────────────────────────────────────────────────────────────
class TestGracefulDegradation:
    def test_all_ops_return_safe_values_when_unavailable(self, isolate_db):
        db = isolate_db
        db._available = False
        assert db.save_search("q", 100.0, "Amazon", []) is None
        assert db.list_searches() == []
        assert db.add_to_wishlist("x", 1.0, "p", "url") is None
        assert db.list_wishlist() == []
        assert db.delete_wishlist_item(1) is False
        assert db.add_price_alert("t", 1.0, 2.0, "p") is None
        assert db.list_price_alerts() == []
        assert db.delete_price_alert(1) is False
