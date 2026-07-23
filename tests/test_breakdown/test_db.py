# -*- coding: utf-8 -*-
"""
Unit tests for apps/breakdown-factor/backend/app/db.py
Tests: copilot_sessions CRUD, defect_scans CRUD, graceful degradation, JSON round-trips.
"""
from __future__ import annotations
import sys, os, json
import pytest

BACKEND = os.path.join(os.path.dirname(__file__), "..", "..", "apps", "breakdown-factor", "backend")
sys.path.insert(0, BACKEND)


@pytest.fixture(autouse=True)
def isolate_db(tmp_path, monkeypatch):
    db_file = str(tmp_path / "breakdown_test.sqlite3")
    monkeypatch.setenv("DB_PATH", db_file)
    from conftest import load_isolated_app
    load_isolated_app("breakdown-factor")
    from app import db as breakdown_db
    breakdown_db._available = True
    breakdown_db.init()
    yield breakdown_db


class TestInit:
    def test_tables_created(self, isolate_db, tmp_path):
        import sqlite3
        db_path = str(tmp_path / "breakdown_test.sqlite3")
        conn = sqlite3.connect(db_path)
        tables = {r[0] for r in conn.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()}
        conn.close()
        assert "copilot_sessions" in tables
        assert "defect_scans" in tables

    def test_init_idempotent(self, isolate_db):
        isolate_db.init()


class TestCopilotSessions:
    def test_save_and_get(self, isolate_db):
        db = isolate_db
        msgs = [{"role": "user", "text": "Check safety"}, {"role": "ai", "text": "Wear PPE"}]
        assert db.save_session("cs-001", msgs) is True
        result = db.get_session("cs-001")
        assert result is not None
        assert result["session_id"] == "cs-001"
        assert result["messages"] == msgs

    def test_upsert_updates_messages(self, isolate_db):
        db = isolate_db
        db.save_session("cs-upsert", [{"role": "user", "text": "Hello"}])
        new = [{"role": "user", "text": "Hello"}, {"role": "ai", "text": "Hi"}]
        db.save_session("cs-upsert", new)
        assert len(db.get_session("cs-upsert")["messages"]) == 2

    def test_get_nonexistent(self, isolate_db):
        assert isolate_db.get_session("ghost") is None

    def test_list_sessions(self, isolate_db):
        db = isolate_db
        for i in range(5):
            db.save_session(f"s{i}", [])
        assert len(db.list_sessions(limit=3)) == 3

    def test_delete_session(self, isolate_db):
        db = isolate_db
        db.save_session("cs-del", [])
        assert db.delete_session("cs-del") is True
        assert db.get_session("cs-del") is None

    def test_delete_nonexistent(self, isolate_db):
        assert isolate_db.delete_session("nope") is False

    def test_unicode_messages(self, isolate_db):
        db = isolate_db
        msgs = [{"role": "user", "text": "दरार देखें 🏗️"}]
        db.save_session("unicode-001", msgs)
        result = db.get_session("unicode-001")
        assert result["messages"][0]["text"] == "दरार देखें 🏗️"


class TestDefectScans:
    def test_save_and_list_scan(self, isolate_db):
        db = isolate_db
        sid = db.save_scan("site_photo.jpg", ["crack", "spalling"],
                           "₹50,000–1,20,000", "Consult structural engineer")
        assert isinstance(sid, int)
        scans = db.list_scans()
        assert len(scans) == 1
        assert scans[0]["filename"] == "site_photo.jpg"
        assert scans[0]["detected_list"] == ["crack", "spalling"]
        assert scans[0]["cost_range"] == "₹50,000–1,20,000"

    def test_delete_scan(self, isolate_db):
        db = isolate_db
        sid = db.save_scan("img.jpg", [], "₹0", "OK")
        assert db.delete_scan(sid) is True
        assert db.list_scans() == []

    def test_delete_nonexistent_scan(self, isolate_db):
        assert isolate_db.delete_scan(9999) is False

    def test_scan_limit(self, isolate_db):
        db = isolate_db
        for i in range(10):
            db.save_scan(f"img{i}.jpg", ["crack"], "₹5,000", "Fix")
        assert len(db.list_scans(limit=4)) == 4

    def test_empty_detected_list(self, isolate_db):
        db = isolate_db
        sid = db.save_scan("clean.jpg", [], "₹0", "No defects found")
        scans = db.list_scans()
        assert scans[0]["detected_list"] == []


class TestGracefulDegradation:
    def test_all_ops_safe_when_unavailable(self, isolate_db):
        db = isolate_db
        db._available = False
        assert db.save_session("x", []) is False
        assert db.get_session("x") is None
        assert db.list_sessions() == []
        assert db.delete_session("x") is False
        assert db.save_scan("f", [], "r", "g") is None
        assert db.list_scans() == []
        assert db.delete_scan(1) is False
