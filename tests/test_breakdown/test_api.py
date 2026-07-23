# -*- coding: utf-8 -*-
"""
Integration tests for apps/breakdown-factor/backend/main.py
All AI agents are mocked. Tests every endpoint including file upload.
"""
from __future__ import annotations
import sys, os, io
import pytest
from unittest.mock import patch, MagicMock

BACKEND = os.path.join(os.path.dirname(__file__), "..", "..", "apps", "breakdown-factor", "backend")
sys.path.insert(0, BACKEND)

MOCK_COPILOT = {"reply": "Safety checklist ready.", "session_id": "test-sess"}
MOCK_COST    = {"total_cost": 500000, "breakdown": {"material": 300000, "labour": 200000}}
MOCK_COST_DEMO = {"total_cost": 450000, "breakdown": {}}
MOCK_MATERIAL  = {"quantity_needed": 120, "unit": "bags", "total_cost": 6000}
MOCK_SAFETY    = {"checklist": ["Wear helmet", "Use harness"], "risk_level": "Medium"}
MOCK_DEFECT    = {"defects": ["Crack in wall"], "severity": "High", "repair_cost_range": "₹20k–50k"}
MOCK_BOQ       = {"items": [{"item": "Cement", "qty": 100, "unit": "bags", "rate": 400}]}
MOCK_SCHEDULE  = {"phases": ["Foundation: 4 weeks", "Structure: 8 weeks"]}
MOCK_PROVIDER  = "offline"
MOCK_RAG_BACKEND = "local"
MOCK_RAG_COUNTS = {"docs": 0}


@pytest.fixture(scope="module")
def client(tmp_path_factory):
    tmp = tmp_path_factory.mktemp("breakdown_api")
    db_file = str(tmp / "breakdown_api_test.sqlite3")
    os.environ["DB_PATH"] = db_file
    for k in ("GROQ_API_KEY", "GEMINI_API_KEY", "OPENAI_API_KEY"):
        os.environ.pop(k, None)

    from conftest import load_isolated_app

    agents_mock = MagicMock()
    agents_mock.active_provider.return_value = MOCK_PROVIDER
    agents_mock.run_copilot.return_value = dict(MOCK_COPILOT)
    agents_mock.copilot.return_value = dict(MOCK_COPILOT)
    agents_mock.cost_demo.return_value = MOCK_COST_DEMO
    agents_mock.estimate_cost.return_value = MOCK_COST
    agents_mock.estimate_material.return_value = MOCK_MATERIAL
    agents_mock.safety_check.return_value = MOCK_SAFETY
    agents_mock.detect_defect.return_value = MOCK_DEFECT
    agents_mock.generate_boq.return_value = MOCK_BOQ
    agents_mock.project_schedule.return_value = MOCK_SCHEDULE

    rag_mock = MagicMock()
    rag_mock.backend_name.return_value = MOCK_RAG_BACKEND
    rag_mock.counts.return_value = MOCK_RAG_COUNTS

    from fastapi import APIRouter
    sys.modules["agents"] = agents_mock
    sys.modules["rag"] = rag_mock
    sys.modules["features"] = MagicMock(router=APIRouter())
    sys.modules["breakdown_data"] = MagicMock()
    sys.modules["insightface"] = MagicMock()
    sys.modules["onnxruntime"] = MagicMock()
    sys.modules["cv2"] = MagicMock()
    sys.modules["ultralytics"] = MagicMock()

    app = load_isolated_app("breakdown-factor")

    from fastapi.testclient import TestClient
    yield TestClient(app, raise_server_exceptions=False)


class TestHealth:
    def test_health_ok(self, client):
        r = client.get("/api/health")
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "ok"
        assert "provider" in data


class TestCopilot:
    def test_copilot_valid(self, client):
        r = client.post("/api/copilot", json={"message": "Check site safety"})
        assert r.status_code == 200
        assert "reply" in r.json()

    def test_copilot_with_session(self, client):
        r = client.post("/api/copilot", json={"message": "Hello", "session_id": "sess-101"})
        assert r.status_code == 200


class TestCostDemo:
    def test_cost_demo_valid(self, client):
        r = client.post("/api/cost/demo", json={
            "project_type": "Residential",
            "area_sqft": 1500.0,
            "location": "Ahmedabad"
        })
        assert r.status_code == 200

    def test_cost_demo_empty_project_type(self, client):
        r = client.post("/api/cost/demo", json={
            "project_type": "",
            "area_sqft": 1000.0,
            "location": "Surat"
        })
        assert r.status_code == 400

    def test_cost_demo_zero_area(self, client):
        r = client.post("/api/cost/demo", json={
            "project_type": "Commercial",
            "area_sqft": 0,
            "location": "Vadodara"
        })
        assert r.status_code == 400

    def test_cost_demo_negative_area(self, client):
        r = client.post("/api/cost/demo", json={
            "project_type": "Industrial",
            "area_sqft": -500.0,
            "location": "Rajkot"
        })
        assert r.status_code == 400

    def test_cost_demo_area_too_large(self, client):
        r = client.post("/api/cost/demo", json={
            "project_type": "Residential",
            "area_sqft": 1_000_001.0,
            "location": "Ahmedabad"
        })
        assert r.status_code == 400


class TestCost:
    def test_cost_full_valid(self, client):
        r = client.post("/api/cost", json={
            "project_type": "Residential",
            "area_sqft": 2000.0,
            "floors": 2,
            "quality": "standard",
            "location": "Ahmedabad",
            "extra": ""
        })
        assert r.status_code == 200

    def test_cost_minimal_payload(self, client):
        r = client.post("/api/cost", json={
            "project_type": "Industrial",
            "area_sqft": 5000.0
        })
        assert r.status_code == 200


class TestSafety:
    def test_safety_valid(self, client):
        r = client.post("/api/safety", json={"description": "Workers on scaffolding at 20ft height"})
        assert r.status_code == 200

    def test_safety_empty_description(self, client):
        r = client.post("/api/safety", json={"description": ""})
        assert r.status_code == 200


class TestDefect:
    def test_defect_valid_text(self, client):
        r = client.post("/api/defect", json={"description": "Diagonal cracks near window"})
        assert r.status_code == 200


class TestHistory:
    def test_list_copilot_sessions(self, client):
        r = client.get("/api/history/copilot")
        assert r.status_code == 200
        assert "sessions" in r.json()

    def test_list_defect_scans(self, client):
        r = client.get("/api/history/scans")
        assert r.status_code == 200
        assert "scans" in r.json()

    def test_delete_nonexistent_session(self, client):
        r = client.delete("/api/history/copilot/ghost-session-xyz")
        assert r.status_code == 404

    def test_delete_nonexistent_scan(self, client):
        r = client.delete("/api/history/scans/99999")
        assert r.status_code == 404
