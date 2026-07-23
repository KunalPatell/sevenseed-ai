# -*- coding: utf-8 -*-
"""
Integration tests for apps/avp-emart/backend/main.py
Full API endpoint coverage using FastAPI TestClient.
Agents and comparator are mocked for offline testing.
"""
from __future__ import annotations
import sys, os
import pytest
from unittest.mock import patch, MagicMock

BACKEND = os.path.join(os.path.dirname(__file__), "..", "..", "apps", "avp-emart", "backend")
sys.path.insert(0, BACKEND)

MOCK_PRODUCTS = [
    {"title": "iPhone 15", "price": 79999, "platform": "Amazon",
     "url": "https://amazon.in", "rating": 4.5, "reviews_count": 1200,
     "in_stock": True, "delivery_days": 2, "best_value_score": 85.0,
     "positioning": "Standard", "z_score": 0.1},
]
MOCK_ASSISTANT = {"reply": "Here are the best deals!"}
MOCK_REVIEW = {"verdict": "Recommended", "pros": ["Fast"], "cons": ["Pricey"]}
MOCK_RECOMMEND = {"products": [{"name": "Featured Item", "price": 999}]}
MOCK_TREND = {"direction": "falling", "summary": "Price dropping", "points": [10000, 9500, 9000]}
MOCK_PROVIDER = "offline"
MOCK_MODE = "sample data"


@pytest.fixture(scope="module")
def client(tmp_path_factory):
    tmp = tmp_path_factory.mktemp("emart_api")
    db_file = str(tmp / "emart_api_test.sqlite3")
    os.environ["DB_PATH"] = db_file
    for k in ("GROQ_API_KEY", "GEMINI_API_KEY", "OPENAI_API_KEY", "SERPAPI_KEY"):
        os.environ.pop(k, None)

    from conftest import load_isolated_app

    agents_mock = MagicMock()
    agents_mock.active_provider.return_value = MOCK_PROVIDER
    agents_mock.assistant.return_value = MOCK_ASSISTANT
    agents_mock.assistant_demo.return_value = MOCK_ASSISTANT
    agents_mock.review_intel.return_value = MOCK_REVIEW
    agents_mock.recommend.return_value = MOCK_RECOMMEND
    agents_mock.trend.return_value = MOCK_TREND

    comparator_mock = MagicMock()
    comparator_mock.mode.return_value = MOCK_MODE
    comparator_mock.PLATFORMS = {"amazon.in": "Amazon", "flipkart.com": "Flipkart"}
    comparator_mock.compare.return_value = {
        "products": [
            {"name": "iPhone 15", "price": 79999, "platform": "Amazon",
             "link": "https://amazon.in", "rating": 4.5, "reviews": 1200,
             "in_stock": True, "value_score": 85.0, "positioning": "Standard",
             "z_score": 0.1},
        ]
    }

    from fastapi import APIRouter
    sys.modules["agents"] = agents_mock
    sys.modules["comparator"] = comparator_mock
    sys.modules["features"] = MagicMock(router=APIRouter())

    app = load_isolated_app("avp-emart")

    from fastapi.testclient import TestClient
    yield TestClient(app, raise_server_exceptions=False)


class TestHealth:
    def test_health_200(self, client):
        r = client.get("/api/health")
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "ok"
        assert "provider" in data
        assert "mode" in data


class TestCompare:
    def test_compare_valid(self, client):
        r = client.post("/api/compare", json={"query": "iPhone 15", "n": 4})
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)

    def test_compare_response_fields(self, client):
        r = client.post("/api/compare", json={"query": "laptop"})
        assert r.status_code == 200
        if r.json():
            item = r.json()[0]
            assert "title" in item
            assert "price" in item
            assert "platform" in item


class TestAssistant:
    def test_assistant_valid(self, client):
        r = client.post("/api/assistant", json={"message": "Find me a good laptop"})
        assert r.status_code == 200
        assert "reply" in r.json()

    def test_assistant_demo_valid(self, client):
        r = client.post("/api/assistant/demo", json={"message": "Best phone under 20000"})
        assert r.status_code == 200

    def test_assistant_demo_empty_message(self, client):
        r = client.post("/api/assistant/demo", json={"message": ""})
        assert r.status_code == 400

    def test_assistant_demo_whitespace_message(self, client):
        r = client.post("/api/assistant/demo", json={"message": "   "})
        assert r.status_code == 400

    def test_assistant_demo_too_long(self, client):
        r = client.post("/api/assistant/demo", json={"message": "A" * 201})
        assert r.status_code == 400


class TestReviews:
    def test_reviews_valid(self, client):
        r = client.post("/api/reviews", json={
            "product": "iPhone 15",
            "reviews_text": "Great phone, fast delivery",
            "rating": 4.5
        })
        assert r.status_code == 200
        assert "summary" in r.json()

    def test_reviews_empty_product(self, client):
        r = client.post("/api/reviews", json={"product": "", "reviews_text": "", "rating": 0})
        assert r.status_code == 200  # graceful


class TestRecommend:
    def test_recommend_with_category(self, client):
        r = client.get("/api/recommend?category=electronics")
        assert r.status_code == 200

    def test_recommend_without_category(self, client):
        r = client.get("/api/recommend")
        assert r.status_code == 200


class TestTrend:
    def test_trend_valid(self, client):
        r = client.post("/api/trend", json={"query": "iPhone", "weeks": 12})
        assert r.status_code == 200

    def test_trend_empty_points(self, client):
        """When no points returned, message field should be present."""
        from unittest.mock import patch
        import sys
        agents_mod = sys.modules["agents"]
        original = agents_mod.trend
        agents_mod.trend = lambda q, w: {"points": [], "direction": "stable", "summary": ""}
        r = client.post("/api/trend", json={"query": "xyz", "weeks": 12})
        agents_mod.trend = original
        assert r.status_code == 200
        data = r.json()
        assert "message" in data or "trend" in data


class TestWishlist:
    def test_get_wishlist_empty(self, client):
        r = client.get("/api/wishlist")
        assert r.status_code == 200
        assert "wishlist" in r.json()

    def test_add_and_get_wishlist(self, client):
        r = client.post("/api/wishlist", json={
            "title": "AirPods Pro",
            "price": 18990.0,
            "platform": "Apple Store",
            "url": "https://apple.com"
        })
        assert r.status_code == 200
        assert r.json()["success"] is True
        item_id = r.json()["id"]
        # Verify in list
        items = client.get("/api/wishlist").json()["wishlist"]
        assert any(i["id"] == item_id for i in items)

    def test_delete_wishlist_item(self, client):
        # Add first
        add = client.post("/api/wishlist", json={
            "title": "Samsung Galaxy", "price": 55000.0,
            "platform": "Flipkart", "url": "https://flipkart.com"
        })
        item_id = add.json()["id"]
        # Delete
        r = client.delete(f"/api/wishlist/{item_id}")
        assert r.status_code == 200
        assert r.json()["success"] is True

    def test_delete_nonexistent_wishlist_item(self, client):
        r = client.delete("/api/wishlist/999999")
        assert r.status_code == 404


class TestAlerts:
    def test_get_alerts_empty(self, client):
        r = client.get("/api/alerts")
        assert r.status_code == 200
        assert "alerts" in r.json()

    def test_add_and_get_alert(self, client):
        r = client.post("/api/alerts", json={
            "title": "MacBook Air",
            "target_price": 80000.0,
            "current_price": 95000.0,
            "platform": "Amazon"
        })
        assert r.status_code == 200
        assert r.json()["success"] is True

    def test_delete_nonexistent_alert(self, client):
        r = client.delete("/api/alerts/999999")
        assert r.status_code == 404


class TestSearchHistory:
    def test_get_searches(self, client):
        r = client.get("/api/searches")
        assert r.status_code == 200
        assert "searches" in r.json()
