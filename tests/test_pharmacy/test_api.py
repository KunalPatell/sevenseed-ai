# -*- coding: utf-8 -*-
"""
Integration tests for apps/decode-forest-pharmacy/backend/main.py
All AI agents mocked. Tests every public endpoint matching main.py routes.
"""
from __future__ import annotations
import sys, os
import pytest
from unittest.mock import patch, MagicMock

BACKEND = os.path.join(os.path.dirname(__file__), "..", "..", "apps", "decode-forest-pharmacy", "backend")
sys.path.insert(0, BACKEND)

MOCK_ASSISTANT = {"reply": "Drink water and rest well."}
MOCK_PROVIDER = "offline"
MOCK_RAG_BACK = "local"
MOCK_RAG_CNT = {"docs": 0}
MOCK_MEDICINES = [{"name": "Paracetamol", "price_inr": "20"}]


@pytest.fixture(scope="module")
def client(tmp_path_factory):
    tmp = tmp_path_factory.mktemp("pharmacy_api")
    db_file = str(tmp / "pharmacy_api_test.sqlite3")
    os.environ["DB_PATH"] = db_file
    for k in ("GROQ_API_KEY", "GEMINI_API_KEY", "OPENAI_API_KEY"):
        os.environ.pop(k, None)

    from conftest import load_isolated_app

    agents_mock = MagicMock()
    agents_mock.active_provider.return_value = MOCK_PROVIDER
    agents_mock.run_assistant.return_value = dict(MOCK_ASSISTANT)
    agents_mock.run_assistant_demo.return_value = dict(MOCK_ASSISTANT)
    agents_mock.read_prescription.return_value = {"result": "Take 1 pill daily"}
    agents_mock.check_interactions.return_value = {"result": "Safe"}
    agents_mock.find_substitutes.return_value = {"substitutes": []}
    agents_mock.predict_refill.return_value = {"refill_date": "2026-08-01", "reminder_date": "2026-07-28"}
    agents_mock.symptom_guide.return_value = {"advice": "Rest"}

    rag_mock = MagicMock()
    rag_mock.backend_name.return_value = MOCK_RAG_BACK
    rag_mock.counts.return_value = MOCK_RAG_CNT
    rag_mock.search_medicines.return_value = []

    pharm_data_mock = MagicMock()
    pharm_data_mock.MEDICINES = MOCK_MEDICINES
    pharm_data_mock.CAMPS = []
    pharm_data_mock.SCHEMES = []
    pharm_data_mock.HOSPITALS = [{"city": "Ahmedabad", "name": "Civil Hospital"}]

    from fastapi import APIRouter
    sys.modules["agents"] = agents_mock
    sys.modules["rag"] = rag_mock
    sys.modules["features"] = MagicMock(router=APIRouter())
    sys.modules["pharmacy_data"] = pharm_data_mock
    sys.modules["prescription_ocr"] = MagicMock()
    sys.modules["pypdf"] = MagicMock()
    sys.modules["cv2"] = MagicMock()

    app = load_isolated_app("decode-forest-pharmacy")

    from fastapi.testclient import TestClient
    yield TestClient(app, raise_server_exceptions=False)


class TestHealth:
    def test_health_ok(self, client):
        r = client.get("/api/health")
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "ok"


class TestAssistant:
    def test_assistant_valid(self, client):
        r = client.post("/api/assistant", json={"message": "What helps with fever?"})
        assert r.status_code == 200
        assert "reply" in r.json()

    def test_assistant_demo_valid(self, client):
        r = client.post("/api/assistant/demo", json={"message": "Fever advice"})
        assert r.status_code == 200

    def test_assistant_demo_empty(self, client):
        r = client.post("/api/assistant/demo", json={"message": ""})
        assert r.status_code == 400

    def test_assistant_demo_too_long(self, client):
        r = client.post("/api/assistant/demo", json={"message": "A" * 301})
        assert r.status_code == 400


class TestInteractionsAndSubstitutes:
    def test_interactions_valid(self, client):
        r = client.post("/api/interactions", json={"drugs": ["Paracetamol", "Ibuprofen"]})
        assert r.status_code == 200

    def test_substitutes_valid(self, client):
        r = client.post("/api/substitutes", json={"medicine": "Paracetamol"})
        assert r.status_code == 200

    def test_symptoms_valid(self, client):
        r = client.post("/api/symptoms", json={"symptom": "Headache"})
        assert r.status_code == 200


class TestPublicEndpoints:
    def test_medicines_list(self, client):
        r = client.get("/api/medicines")
        assert r.status_code == 200

    def test_nearby_hospitals(self, client):
        r = client.post("/api/hospitals/nearby", json={"city": "Ahmedabad"})
        assert r.status_code == 200

    def test_health_camps(self, client):
        r = client.get("/api/health-camps")
        assert r.status_code == 200

    def test_free_schemes(self, client):
        r = client.get("/api/free-schemes")
        assert r.status_code == 200


class TestRefillPredictor:
    def test_refill_valid(self, client):
        r = client.post("/api/refill", json={
            "medicine": "Metformin",
            "quantity": 30,
            "dose_per_day": 2.0,
            "start_date": "2026-07-01"
        })
        assert r.status_code == 200

    def test_get_refills(self, client):
        r = client.get("/api/refills")
        assert r.status_code == 200
