# -*- coding: utf-8 -*-
"""
Cross-app security tests.
Tests: SQL injection, token tampering, rate limit enforcement,
       input size limits, CORS headers, missing auth protection.
These tests use the AVPU backend as the reference implementation
since it has the most complete security surface.
"""
from __future__ import annotations
import sys, os
import pytest
from unittest.mock import MagicMock, patch

AVPU_BACKEND = os.path.join(os.path.dirname(__file__), "..", "..", "apps", "avpu", "backend")
sys.path.insert(0, AVPU_BACKEND)


# ─────────────────────────────────────────────────────────────────────────────
# AUTH SECURITY
# ─────────────────────────────────────────────────────────────────────────────
class TestAuthSecurity:
    @pytest.fixture(autouse=True)
    def isolate(self, tmp_path, monkeypatch):
        db_file = str(tmp_path / "sec_test.sqlite3")
        monkeypatch.setenv("DB_PATH", db_file)
        monkeypatch.setenv("AUTH_SECRET", "test-secret-for-security-tests")
        from conftest import load_isolated_app
        load_isolated_app("avpu")
        from app import auth
        auth.init()
        self.auth = auth

    def test_token_tampering_rejected(self):
        result = self.auth.signup("User", "sec@test.com", "password123")
        token = result["token"]
        # Replace last 10 chars to tamper
        tampered = token[:-10] + ("X" * 10)
        assert self.auth.verify_token(tampered) is None

    def test_sql_injection_email_field(self):
        """'; DROP TABLE users;-- should not destroy the DB."""
        result = self.auth.signup("Hacker", "'; DROP TABLE users;--@x.com", "pass123")
        # Either error (invalid email) or success (email stored safely)
        assert "error" in result or "token" in result
        # Either way, user_count should still be callable
        count = self.auth.user_count()
        assert isinstance(count, int)

    def test_sql_injection_login_field(self):
        result = self.auth.login("' OR '1'='1", "anything")
        assert "error" in result

    def test_xss_in_name_field_stored_safely(self):
        """<script> in name should be stored as-is (no eval), not crash."""
        result = self.auth.signup("<script>alert(1)</script>", "xss@test.com", "password123")
        # Should succeed (stored as literal string, not executed)
        assert "token" in result

    def test_brute_force_wrong_password(self):
        """10 consecutive wrong passwords should return consistent errors."""
        self.auth.signup("BruteForce", "brute@test.com", "correct")
        for _ in range(10):
            result = self.auth.login("brute@test.com", "wrong_password")
            assert "error" in result

    def test_empty_token_rejected(self):
        assert self.auth.verify_token("") is None

    def test_none_token_rejected(self):
        assert self.auth.verify_token(None) is None

    def test_binary_garbage_token_rejected(self):
        assert self.auth.verify_token("\x00\x01\x02\x03") is None

    def test_password_not_in_db(self, tmp_path, monkeypatch):
        import sqlite3, app.config as cfg
        self.auth.signup("SafePass", "safe@test.com", "secretpassword")
        conn = sqlite3.connect(cfg.DB_PATH)
        rows = conn.execute("SELECT pw_hash FROM users WHERE email='safe@test.com'").fetchall()
        conn.close()
        for row in rows:
            assert "secretpassword" not in row[0]


# ─────────────────────────────────────────────────────────────────────────────
# RATE LIMIT SECURITY
# ─────────────────────────────────────────────────────────────────────────────
class TestRateLimitSecurity:
    def _fresh_rl(self):
        for mod in list(sys.modules.keys()):
            if "ratelimit" in mod:
                del sys.modules[mod]
        from app import ratelimit
        return ratelimit

    def _req(self, ip="127.0.0.1"):
        req = MagicMock()
        req.client.host = ip
        req.headers.get = lambda k, d="": d
        return req

    def test_per_ip_limit_enforced(self):
        rl = self._fresh_rl()
        from fastapi import HTTPException
        req = self._req("10.1.1.1")
        for _ in range(5):
            rl.check_rate_limit(req, "sec_test", 5, 60)
        with pytest.raises(HTTPException) as exc:
            rl.check_rate_limit(req, "sec_test", 5, 60)
        assert exc.value.status_code == 429
        assert "Too many requests" in exc.value.detail

    def test_global_limit_message_helpful(self):
        rl = self._fresh_rl()
        from fastapi import HTTPException
        for i in range(3):
            req = self._req(f"10.2.{i}.1")
            rl.check_rate_limit(req, "global_sec", 100, 60, global_limit=3)
        req_new = self._req("10.2.99.1")
        with pytest.raises(HTTPException) as exc:
            rl.check_rate_limit(req_new, "global_sec", 100, 60, global_limit=3)
        assert exc.value.status_code == 429
        assert "high traffic" in exc.value.detail.lower()

    def test_rate_limit_uses_x_forwarded_for(self):
        rl = self._fresh_rl()
        from fastapi import HTTPException
        req = MagicMock()
        req.client.host = "10.0.0.1"
        req.headers.get = lambda k, d="": "203.0.113.10, 10.0.0.1" if k == "x-forwarded-for" else d
        for _ in range(5):
            rl.check_rate_limit(req, "fwd_sec", 5, 60)
        with pytest.raises(HTTPException):
            rl.check_rate_limit(req, "fwd_sec", 5, 60)


# ─────────────────────────────────────────────────────────────────────────────
# INPUT VALIDATION SECURITY
# ─────────────────────────────────────────────────────────────────────────────
class TestInputValidation:
    @pytest.fixture(scope="class")
    def client(self, tmp_path_factory):
        tmp = tmp_path_factory.mktemp("sec_api")
        db_file = str(tmp / "sec_api_test.sqlite3")
        os.environ["DB_PATH"] = db_file
        for k in ("GROQ_API_KEY", "GEMINI_API_KEY", "OPENAI_API_KEY"):
            os.environ.pop(k, None)

        from conftest import load_isolated_app

        agents_mock = MagicMock()
        agents_mock.active_provider.return_value = "offline"
        agents_mock.run_tutor.return_value = {"reply": "ok", "sources": [], "traces": []}
        agents_mock.tutor_demo.return_value = {"reply": "demo"}
        agents_mock.roadmap_demo.return_value = {"reply": "roadmap"}

        rag_mock = MagicMock()
        rag_mock.backend_name.return_value = "local"
        rag_mock.counts.return_value = {}

        avpu_data_mock = MagicMock()
        avpu_data_mock.PROGRAMS = []

        from fastapi import APIRouter
        sys.modules["agents"] = agents_mock
        sys.modules["rag"] = rag_mock
        sys.modules["avpu_data"] = avpu_data_mock
        sys.modules["whatsapp_tutor"] = MagicMock(router=APIRouter())
        sys.modules["features"] = MagicMock(router=APIRouter())
        sys.modules["insightface"] = MagicMock()
        sys.modules["onnxruntime"] = MagicMock()
        sys.modules["cv2"] = MagicMock()

        app = load_isolated_app("avpu")

        from fastapi.testclient import TestClient
        return TestClient(app, raise_server_exceptions=False)

    def test_empty_tutor_demo_question_rejected(self, client):
        r = client.post("/api/tutor/demo", json={"question": ""})
        assert r.status_code == 400

    def test_whitespace_only_question_rejected(self, client):
        r = client.post("/api/tutor/demo", json={"question": "     "})
        assert r.status_code == 400

    def test_oversized_question_rejected_at_300(self, client):
        r = client.post("/api/tutor/demo", json={"question": "Q" * 301})
        assert r.status_code == 400

    def test_exactly_300_chars_accepted(self, client):
        r = client.post("/api/tutor/demo", json={"question": "Q" * 300})
        assert r.status_code == 200

    def test_oversized_roadmap_goal_rejected(self, client):
        r = client.post("/api/roadmap/demo", json={"goal": "G" * 101})
        assert r.status_code == 400

    def test_exactly_100_chars_goal_accepted(self, client):
        r = client.post("/api/roadmap/demo", json={"goal": "G" * 100})
        assert r.status_code == 200

    def test_unicode_in_valid_fields(self, client):
        """Unicode (Hindi, Emoji) must not crash the endpoint."""
        r = client.post("/api/tutor/demo", json={"question": "क्या आप मुझे Python सिखा सकते हैं? 🐍"})
        assert r.status_code == 200

    def test_null_bytes_in_question(self, client):
        """Null bytes should be handled gracefully (200, 400, or 429 rate limit)."""
        r = client.post("/api/tutor/demo", json={"question": "valid\x00question"})
        assert r.status_code in (200, 400, 429)

    def test_missing_required_field(self, client):
        """Missing 'question' field should return 422 Unprocessable Entity."""
        r = client.post("/api/tutor/demo", json={})
        assert r.status_code == 422
