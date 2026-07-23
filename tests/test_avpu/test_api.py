# -*- coding: utf-8 -*-
"""
Integration tests for apps/avpu/backend/main.py
Uses FastAPI TestClient — no live API keys, agents are mocked.
Tests: all endpoints, validation, rate limits, 404s, CRUD lifecycle.
"""
from __future__ import annotations
import sys, os, json
import pytest
from unittest.mock import patch, MagicMock

BACKEND = os.path.join(os.path.dirname(__file__), "..", "..", "apps", "avpu", "backend")
sys.path.insert(0, BACKEND)

MOCK_REPLY       = {"reply": "Mocked AI answer.", "sources": [], "traces": []}
MOCK_ROADMAP     = {"reply": "Week 1: Python basics", "weeks": ["Week 1"]}
MOCK_ASSESS      = {"score": 8, "feedback": "Good", "grade": "B+"}
MOCK_PLACEMENT   = {"roles": ["Data Scientist"], "match_score": 85}
MOCK_ADMISSIONS  = {"programs": ["B.Tech AI"], "recommendation": "B.Tech AI"}
MOCK_RESEARCH    = {"summary": "Summarized.", "key_points": []}
MOCK_DEMO_TUTOR  = {"reply": "Demo answer"}
MOCK_DEMO_ROAD   = {"reply": "Demo roadmap"}
MOCK_PROVIDER    = "offline"
MOCK_RAG_BACKEND = "local"
MOCK_RAG_COUNTS  = {"docs": 0}
MOCK_PROGRAMS    = [{"name": "B.Tech AI", "duration": "4 years"}]


@pytest.fixture(scope="module")
def client(tmp_path_factory):
    tmp = tmp_path_factory.mktemp("avpu_api")
    db_file = str(tmp / "avpu_api_test.sqlite3")
    os.environ["DB_PATH"] = db_file
    os.environ.pop("GROQ_API_KEY", None)
    os.environ.pop("GEMINI_API_KEY", None)
    os.environ.pop("OPENAI_API_KEY", None)

    from conftest import load_isolated_app

    from fastapi import APIRouter
    with patch.dict("sys.modules", {
        "whatsapp_tutor": MagicMock(router=APIRouter()),
        "features": MagicMock(router=APIRouter()),
        "insightface": MagicMock(),
        "onnxruntime": MagicMock(),
        "cv2": MagicMock(),
    }):
        agents_mock = MagicMock()
        agents_mock.active_provider.return_value = MOCK_PROVIDER
        agents_mock.run_tutor.return_value = dict(MOCK_REPLY)
        agents_mock.tutor_demo.return_value = MOCK_DEMO_TUTOR
        agents_mock.match_placement.return_value = MOCK_PLACEMENT
        agents_mock.recommend_programs.return_value = MOCK_ADMISSIONS
        agents_mock.assess.return_value = MOCK_ASSESS
        agents_mock.research.return_value = MOCK_RESEARCH
        agents_mock.roadmap.return_value = MOCK_ROADMAP
        agents_mock.roadmap_demo.return_value = MOCK_DEMO_ROAD

        rag_mock = MagicMock()
        rag_mock.backend_name.return_value = MOCK_RAG_BACKEND
        rag_mock.counts.return_value = MOCK_RAG_COUNTS

        avpu_data_mock = MagicMock()
        avpu_data_mock.PROGRAMS = MOCK_PROGRAMS

        sys.modules["agents"] = agents_mock
        sys.modules["rag"] = rag_mock
        sys.modules["avpu_data"] = avpu_data_mock

        app = load_isolated_app("avpu")

        from fastapi.testclient import TestClient
        yield TestClient(app, raise_server_exceptions=False)


# ─────────────────────────────────────────────────────────────────────────────
# HEALTH
# ─────────────────────────────────────────────────────────────────────────────
class TestHealth:
    def test_health_returns_200(self, client):
        r = client.get("/api/health")
        assert r.status_code == 200

    def test_health_schema(self, client):
        data = client.get("/api/health").json()
        assert "status" in data
        assert data["status"] == "ok"
        assert "provider" in data
        assert "rag_backend" in data
        assert "llm_enabled" in data


# ─────────────────────────────────────────────────────────────────────────────
# PROGRAMS
# ─────────────────────────────────────────────────────────────────────────────
class TestPrograms:
    def test_programs_returns_list(self, client):
        r = client.get("/api/programs")
        assert r.status_code == 200
        data = r.json()
        assert "programs" in data
        assert isinstance(data["programs"], list)
        assert "count" in data


# ─────────────────────────────────────────────────────────────────────────────
# TUTOR
# ─────────────────────────────────────────────────────────────────────────────
class TestTutor:
    def test_tutor_valid_request(self, client):
        r = client.post("/api/tutor", json={"message": "What is Python?", "subject": "CS"})
        assert r.status_code == 200
        data = r.json()
        assert "session_id" in data
        assert "reply" in data

    def test_tutor_without_session_generates_id(self, client):
        r = client.post("/api/tutor", json={"message": "Hello"})
        assert r.status_code == 200
        assert r.json()["session_id"] is not None

    def test_tutor_with_session_id(self, client):
        r = client.post("/api/tutor", json={"message": "Hello", "session_id": "test-sess-123"})
        assert r.status_code == 200
        assert r.json()["session_id"] == "test-sess-123"


# ─────────────────────────────────────────────────────────────────────────────
# TUTOR DEMO (rate-limited)
# ─────────────────────────────────────────────────────────────────────────────
class TestTutorDemo:
    def test_tutor_demo_valid(self, client):
        r = client.post("/api/tutor/demo", json={"question": "What is AI?"})
        assert r.status_code == 200

    def test_tutor_demo_empty_question(self, client):
        r = client.post("/api/tutor/demo", json={"question": ""})
        assert r.status_code == 400

    def test_tutor_demo_whitespace_question(self, client):
        r = client.post("/api/tutor/demo", json={"question": "   "})
        assert r.status_code == 400

    def test_tutor_demo_too_long_question(self, client):
        r = client.post("/api/tutor/demo", json={"question": "A" * 301})
        assert r.status_code == 400


# ─────────────────────────────────────────────────────────────────────────────
# PLACEMENT, ADMISSIONS, RESEARCH
# ─────────────────────────────────────────────────────────────────────────────
class TestAI:
    def test_placement_valid(self, client):
        r = client.post("/api/placement", json={"skills": ["Python", "ML"], "interests": "AI"})
        assert r.status_code == 200

    def test_placement_empty_skills(self, client):
        r = client.post("/api/placement", json={"skills": [], "interests": ""})
        assert r.status_code == 200

    def test_admissions_valid(self, client):
        r = client.post("/api/admissions", json={"interests": "AI", "background": "Science", "goal": "Research"})
        assert r.status_code == 200

    def test_research_valid(self, client):
        r = client.post("/api/research", json={"text": "Neural networks are...", "mode": "summarize"})
        assert r.status_code == 200

    def test_research_default_mode(self, client):
        r = client.post("/api/research", json={"text": "Some text"})
        assert r.status_code == 200


# ─────────────────────────────────────────────────────────────────────────────
# ASSESS
# ─────────────────────────────────────────────────────────────────────────────
class TestAssess:
    def test_assess_valid(self, client):
        r = client.post("/api/assess", json={"question": "What is ML?", "answer": "Machine Learning"})
        assert r.status_code == 200
        data = r.json()
        assert "score" in data


# ─────────────────────────────────────────────────────────────────────────────
# ROADMAP
# ─────────────────────────────────────────────────────────────────────────────
class TestRoadmap:
    def test_roadmap_valid(self, client):
        r = client.post("/api/roadmap", json={"goal": "ML Engineer", "level": "beginner", "weeks": 8})
        assert r.status_code == 200

    def test_roadmap_demo_valid(self, client):
        r = client.post("/api/roadmap/demo", json={"goal": "Python Developer"})
        assert r.status_code == 200

    def test_roadmap_demo_empty_goal(self, client):
        r = client.post("/api/roadmap/demo", json={"goal": ""})
        assert r.status_code == 400

    def test_roadmap_demo_goal_too_long(self, client):
        r = client.post("/api/roadmap/demo", json={"goal": "A" * 101})
        assert r.status_code == 400


# ─────────────────────────────────────────────────────────────────────────────
# HISTORY SESSIONS CRUD
# ─────────────────────────────────────────────────────────────────────────────
class TestHistorySessions:
    def test_list_sessions_empty(self, client):
        r = client.get("/api/history/sessions")
        assert r.status_code == 200
        assert "sessions" in r.json()

    def test_delete_nonexistent_session(self, client):
        r = client.delete("/api/history/sessions/nonexistent-id-xyz")
        assert r.status_code == 404

    def test_session_full_lifecycle(self, client):
        # Create via tutor endpoint
        r = client.post("/api/tutor", json={"message": "Test", "session_id": "lifecycle-001"})
        assert r.status_code == 200
        # Delete
        r = client.delete("/api/history/sessions/lifecycle-001")
        assert r.status_code == 200
        assert r.json()["success"] is True


# ─────────────────────────────────────────────────────────────────────────────
# HISTORY ROADMAPS CRUD
# ─────────────────────────────────────────────────────────────────────────────
class TestHistoryRoadmaps:
    def test_list_roadmaps(self, client):
        r = client.get("/api/history/roadmaps")
        assert r.status_code == 200
        assert "roadmaps" in r.json()

    def test_delete_nonexistent_roadmap(self, client):
        r = client.delete("/api/history/roadmaps/99999")
        assert r.status_code == 404


# ─────────────────────────────────────────────────────────────────────────────
# HISTORY ASSESSMENTS CRUD
# ─────────────────────────────────────────────────────────────────────────────
class TestHistoryAssessments:
    def test_list_assessments(self, client):
        r = client.get("/api/history/assessments")
        assert r.status_code == 200
        assert "assessments" in r.json()

    def test_delete_nonexistent_assessment(self, client):
        r = client.delete("/api/history/assessments/99999")
        assert r.status_code == 404
