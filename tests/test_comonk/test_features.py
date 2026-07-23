# -*- coding: utf-8 -*-
"""
Integration tests for extended Sevenseed Platform feature modules in comonk/main.py.
Tests: BYOK Key Vault, Email & WhatsApp Outreach, AI Business Analyst, AI Hiring Screener, AI Meeting Notetaker.
"""
from __future__ import annotations
import sys, os
import pytest
from fastapi.testclient import TestClient

BACKEND = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", "apps", "comonk"))
if BACKEND not in sys.path:
    sys.path.insert(0, BACKEND)


@pytest.fixture(scope="module")
def client():
    from conftest import load_isolated_app
    app = load_isolated_app("comonk")
    return TestClient(app, raise_server_exceptions=False)


class TestKeyVault:
    def test_verify_api_key_valid(self, client):
        r = client.post("/api/keys/verify", json={"provider": "groq", "api_key": "gsk_valid_key_sample_test"})
        assert r.status_code == 200
        data = r.json()
        assert data["provider"] == "groq"
        assert "valid" in data

    def test_verify_api_key_empty(self, client):
        r = client.post("/api/keys/verify", json={"provider": "groq", "api_key": ""})
        assert r.status_code == 400

    def test_keys_status(self, client):
        r = client.get("/api/keys/status")
        assert r.status_code == 200
        assert "mode" in r.json()


class TestOutreachEngine:
    def test_verify_email_deliverability(self, client):
        r = client.post("/api/outreach/verify-email", json={"email": "founder@sevenseed.com"})
        assert r.status_code == 200
        data = r.json()
        assert data["domain"] == "sevenseed.com"
        assert data["deliverability_score"] > 0

    def test_verify_email_invalid(self, client):
        r = client.post("/api/outreach/verify-email", json={"email": "invalid-email"})
        assert r.status_code == 400

    def test_generate_outreach_sequence(self, client):
        r = client.post("/api/outreach/sequence", json={
            "product_name": "Sevenseed AI",
            "target_audience": "SaaS Founders"
        })
        assert r.status_code == 200
        assert len(r.json()["sequence"]) == 3


class TestBusinessAnalystSuite:
    def test_generate_ba_prd(self, client):
        r = client.post("/api/ba/prd", json={
            "product_name": "Zero-Cost Hiring Portal",
            "concept_description": "AI candidate voice interviewer for early startups"
        })
        assert r.status_code == 200
        data = r.json()
        assert "prd_title" in data
        assert len(data["functional_requirements"]) > 0

    def test_generate_ba_prd_empty(self, client):
        r = client.post("/api/ba/prd", json={"product_name": "", "concept_description": ""})
        assert r.status_code == 400


class TestHiringScreener:
    def test_generate_hiring_questions(self, client):
        r = client.post("/api/hiring/questions", json={"role": "Backend Engineer"})
        assert r.status_code == 200
        assert len(r.json()["question_set"]) == 3

    def test_evaluate_candidate_answer(self, client):
        r = client.post("/api/hiring/evaluate", json={
            "question": "Explain database indexing in PostgreSQL",
            "candidate_answer": "Indexes B-tree data structures that accelerate SELECT queries by reducing disk I/O."
        })
        assert r.status_code == 200
        assert r.json()["score"] > 0


class TestMeetingNotetaker:
    def test_summarize_meeting_transcript(self, client):
        r = client.post("/api/meeting/summarize", json={
            "meeting_title": "Investor Pitch Sync",
            "transcript_text": "Founder: We built 7 free apps.\nInvestor: Great model, let us proceed."
        })
        assert r.status_code == 200
        data = r.json()
        assert data["meeting_title"] == "Investor Pitch Sync"
        assert len(data["action_items"]) > 0


class TestBackupFeatures:
    def test_create_crm_lead(self, client):
        r = client.post('/api/crm/lead', json={'contact_name': 'Rahul Founder', 'email': 'rahul@startup.com'})
        assert r.status_code == 200
        assert r.json()['lead_score'] > 0

    def test_list_crm_pipeline(self, client):
        r = client.get('/api/crm/leads')
        assert r.status_code == 200
        assert 'pipeline_stages' in r.json()

    def test_employee_check_in(self, client):
        r = client.post('/api/attendance/check-in', json={'employee_id': 'EMP-101', 'location': 'Remote'})
        assert r.status_code == 200
        assert r.json()['status'] == 'Checked In'

    def test_get_attendance_summary(self, client):
        r = client.get('/api/attendance/summary')
        assert r.status_code == 200
        assert r.json()['total_employees'] == 42

    def test_create_meetair_room(self, client):
        r = client.post('/api/meetair/create-room', json={'room_name': 'Investor Sync'})
        assert r.status_code == 200
        assert 'webrtc_url' in r.json()

    def test_generate_brain_quiz(self, client):
        r = client.post('/api/quiz/generate', json={'topic': 'System Architecture', 'num_questions': 3})
        assert r.status_code == 200
        assert len(r.json()['quiz_set']) == 3
