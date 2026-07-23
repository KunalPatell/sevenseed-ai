# -*- coding: utf-8 -*-
"""
Integration tests for apps/avp-charitable-trust/backend/main.py
All AI agents mocked. Tests every public endpoint matching main.py routes.
"""
from __future__ import annotations
import sys, os
import pytest
from unittest.mock import patch, MagicMock

BACKEND = os.path.join(os.path.dirname(__file__), "..", "..", "apps", "avp-charitable-trust", "backend")
sys.path.insert(0, BACKEND)

MOCK_PROVIDER = "offline"
MOCK_DONOR_REPLY = {"reply": "We provide free education and healthcare."}
MOCK_PROGRAMS = [{"name": "Free Medical Camp", "beneficiary": "Poor"}]
MOCK_NEEDS = {"result": "Priority: Primary Schooling"}
MOCK_IMPACT = {"result": "1500 beneficiaries served"}


@pytest.fixture(scope="module")
def client(tmp_path_factory):
    tmp = tmp_path_factory.mktemp("trust_api")
    db_file = str(tmp / "trust_api_test.sqlite3")
    os.environ["DB_PATH"] = db_file
    for k in ("GROQ_API_KEY", "GEMINI_API_KEY", "OPENAI_API_KEY"):
        os.environ.pop(k, None)

    from conftest import load_isolated_app

    agents_mock = MagicMock()
    agents_mock.active_provider.return_value = MOCK_PROVIDER
    agents_mock.run_donor_assistant.return_value = dict(MOCK_DONOR_REPLY)
    agents_mock.donor_assistant_demo.return_value = dict(MOCK_DONOR_REPLY)
    agents_mock.assess_needs.return_value = dict(MOCK_NEEDS)
    agents_mock.generate_impact_report.return_value = dict(MOCK_IMPACT)

    trust_data_mock = MagicMock()
    trust_data_mock.PROGRAMS = MOCK_PROGRAMS
    trust_data_mock.IMPACT_METRICS = [{"metric": "Beneficiaries Served", "value": "1500", "unit": "people"}]
    trust_data_mock.TRUST_KNOWLEDGE = [("Mission", "Serving the underprivileged")]

    from fastapi import APIRouter
    sys.modules["agents"] = agents_mock
    sys.modules["trust_data"] = trust_data_mock
    sys.modules["features"] = MagicMock(router=APIRouter())
    sys.modules["faceauth"] = MagicMock()
    sys.modules["campaign_manager"] = MagicMock()

    app = load_isolated_app("avp-charitable-trust")

    from fastapi.testclient import TestClient
    yield TestClient(app, raise_server_exceptions=False)


class TestHealth:
    def test_health_ok(self, client):
        r = client.get("/api/health")
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "ok"


class TestDonorAssistant:
    def test_donor_valid(self, client):
        r = client.post("/api/donor", json={"message": "How can I donate?"})
        assert r.status_code == 200
        assert "reply" in r.json()

    def test_donor_demo_valid(self, client):
        r = client.post("/api/donor/demo", json={"question": "Tell me about programs"})
        assert r.status_code == 200

    def test_donor_demo_empty(self, client):
        r = client.post("/api/donor/demo", json={"question": ""})
        assert r.status_code == 400

    def test_donor_demo_too_long(self, client):
        r = client.post("/api/donor/demo", json={"question": "X" * 401})
        assert r.status_code == 400


class TestPublicEndpoints:
    def test_programs_list(self, client):
        r = client.get("/api/programs")
        assert r.status_code == 200

    def test_needs_assessment(self, client):
        r = client.post("/api/needs", json={
            "location": "Ahmedabad",
            "population": "5000",
            "issues": "Healthcare",
            "income_level": "Low"
        })
        assert r.status_code == 200

    def test_impact_report(self, client):
        r = client.post("/api/impact", json={"period": "2025-2026"})
        assert r.status_code == 200


class TestHistoryEndpoints:
    def test_get_donor_sessions(self, client):
        r = client.get("/api/history/donor")
        assert r.status_code == 200

    def test_delete_nonexistent_donor_session(self, client):
        r = client.delete("/api/history/donor/nonexistent-session")
        assert r.status_code == 404
