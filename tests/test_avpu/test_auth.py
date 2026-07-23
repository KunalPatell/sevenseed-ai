# -*- coding: utf-8 -*-
"""
Unit tests for apps/avpu/backend/app/auth.py
Tests: signup, login, token verify, duplicate email, bad password,
       expired token, token tampering, edge cases.
"""
from __future__ import annotations
import sys, os
import pytest

BACKEND = os.path.join(os.path.dirname(__file__), "..", "..", "apps", "avpu", "backend")
sys.path.insert(0, BACKEND)


@pytest.fixture(autouse=True)
def isolate_auth_db(tmp_path, monkeypatch):
    db_file = str(tmp_path / "auth_test.sqlite3")
    monkeypatch.setenv("DB_PATH", db_file)
    monkeypatch.setenv("AUTH_SECRET", "test-secret-key-123")
    for mod in list(sys.modules.keys()):
        if mod.startswith("app.") or mod == "app":
            del sys.modules[mod]
    from app import auth
    auth.init()
    yield auth


# ─────────────────────────────────────────────────────────────────────────────
# SIGNUP
# ─────────────────────────────────────────────────────────────────────────────
class TestSignup:
    def test_signup_success(self, isolate_auth_db):
        auth = isolate_auth_db
        result = auth.signup("Ravi Patel", "ravi@test.com", "securepass")
        assert "token" in result
        assert "user" in result
        assert result["user"]["email"] == "ravi@test.com"
        assert result["user"]["name"] == "Ravi Patel"

    def test_signup_lowercases_email(self, isolate_auth_db):
        auth = isolate_auth_db
        result = auth.signup("Test User", "TEST@EXAMPLE.COM", "password123")
        assert result["user"]["email"] == "test@example.com"

    def test_signup_duplicate_email_returns_error(self, isolate_auth_db):
        auth = isolate_auth_db
        auth.signup("User One", "dup@test.com", "pass123")
        result = auth.signup("User Two", "dup@test.com", "different")
        assert "error" in result
        assert "already exists" in result["error"].lower()

    def test_signup_invalid_email_returns_error(self, isolate_auth_db):
        auth = isolate_auth_db
        result = auth.signup("User", "not-an-email", "password123")
        assert "error" in result

    def test_signup_short_password_returns_error(self, isolate_auth_db):
        auth = isolate_auth_db
        result = auth.signup("User", "user@test.com", "abc")
        assert "error" in result
        assert "6" in result["error"]

    def test_signup_empty_name_defaults_to_student(self, isolate_auth_db):
        auth = isolate_auth_db
        result = auth.signup("", "noname@test.com", "password123")
        assert result["user"]["name"] == "Student"

    def test_signup_returns_token(self, isolate_auth_db):
        auth = isolate_auth_db
        result = auth.signup("Valid User", "valid@test.com", "validpass")
        assert isinstance(result["token"], str)
        assert len(result["token"]) > 20


# ─────────────────────────────────────────────────────────────────────────────
# LOGIN
# ─────────────────────────────────────────────────────────────────────────────
class TestLogin:
    def test_login_success(self, isolate_auth_db):
        auth = isolate_auth_db
        auth.signup("Login User", "login@test.com", "mypassword")
        result = auth.login("login@test.com", "mypassword")
        assert "token" in result
        assert result["user"]["email"] == "login@test.com"

    def test_login_wrong_password(self, isolate_auth_db):
        auth = isolate_auth_db
        auth.signup("User", "pw@test.com", "correct")
        result = auth.login("pw@test.com", "wrong")
        assert "error" in result
        assert "password" in result["error"].lower()

    def test_login_nonexistent_email(self, isolate_auth_db):
        auth = isolate_auth_db
        result = auth.login("ghost@test.com", "anypassword")
        assert "error" in result
        assert "no account" in result["error"].lower()

    def test_login_case_insensitive_email(self, isolate_auth_db):
        auth = isolate_auth_db
        auth.signup("Case User", "case@test.com", "password")
        result = auth.login("CASE@TEST.COM", "password")
        assert "token" in result


# ─────────────────────────────────────────────────────────────────────────────
# TOKEN VERIFICATION
# ─────────────────────────────────────────────────────────────────────────────
class TestTokenVerify:
    def test_verify_valid_token(self, isolate_auth_db):
        auth = isolate_auth_db
        signup = auth.signup("Token User", "token@test.com", "password123")
        user = auth.verify_token(signup["token"])
        assert user is not None
        assert user["email"] == "token@test.com"

    def test_verify_none_token(self, isolate_auth_db):
        auth = isolate_auth_db
        assert auth.verify_token(None) is None

    def test_verify_empty_token(self, isolate_auth_db):
        auth = isolate_auth_db
        assert auth.verify_token("") is None

    def test_verify_tampered_token(self, isolate_auth_db):
        auth = isolate_auth_db
        signup = auth.signup("Tamper User", "tamper@test.com", "password123")
        token = signup["token"]
        # flip some chars to tamper with the signature
        tampered = token[:-5] + "XXXXX"
        assert auth.verify_token(tampered) is None

    def test_verify_garbage_token(self, isolate_auth_db):
        auth = isolate_auth_db
        assert auth.verify_token("not.a.real.token.at.all") is None

    def test_verify_expired_token(self, isolate_auth_db, monkeypatch):
        """Simulate an expired token by setting max_age to 0."""
        auth = isolate_auth_db
        signup = auth.signup("Expire User", "expire@test.com", "password123")
        token = signup["token"]
        # Patch TOKEN_MAX_AGE to -1 to force expiry
        import app.auth as auth_mod
        monkeypatch.setattr(auth_mod, "TOKEN_MAX_AGE", -1)
        assert auth_mod.verify_token(token) is None


# ─────────────────────────────────────────────────────────────────────────────
# USER COUNT
# ─────────────────────────────────────────────────────────────────────────────
class TestUserCount:
    def test_user_count_starts_at_zero(self, isolate_auth_db):
        auth = isolate_auth_db
        assert auth.user_count() == 0

    def test_user_count_increments(self, isolate_auth_db):
        auth = isolate_auth_db
        auth.signup("A", "a@test.com", "password1")
        auth.signup("B", "b@test.com", "password2")
        assert auth.user_count() == 2


# ─────────────────────────────────────────────────────────────────────────────
# SECURITY / EDGE CASES
# ─────────────────────────────────────────────────────────────────────────────
class TestAuthSecurity:
    def test_sql_injection_in_email(self, isolate_auth_db):
        """SQL injection in email should not crash the DB."""
        auth = isolate_auth_db
        result = auth.signup("Hacker", "'; DROP TABLE users; --@test.com", "password123")
        # Either returns error (invalid email) or succeeds but is sanitized
        assert "error" in result or "token" in result

    def test_sql_injection_in_login(self, isolate_auth_db):
        auth = isolate_auth_db
        result = auth.login("' OR 1=1 --", "anything")
        assert "error" in result

    def test_unicode_in_name(self, isolate_auth_db):
        auth = isolate_auth_db
        result = auth.signup("अभिषेक 🎓", "unicode@test.com", "password123")
        assert "token" in result
        assert result["user"]["name"] == "अभिषेक 🎓"

    def test_very_long_password(self, isolate_auth_db):
        auth = isolate_auth_db
        long_pass = "A" * 1000
        result = auth.signup("LongPass", "long@test.com", long_pass)
        assert "token" in result
        # Should also be able to login
        login = auth.login("long@test.com", long_pass)
        assert "token" in login

    def test_password_hashing_not_plaintext(self, isolate_auth_db, tmp_path, monkeypatch):
        """Raw password must never be stored in DB."""
        import sqlite3
        db_file = str(tmp_path / "auth_test.sqlite3")
        auth = isolate_auth_db
        auth.signup("Secure", "secure@test.com", "mysecretpassword")
        import app.config as cfg
        conn = sqlite3.connect(cfg.DB_PATH)
        rows = conn.execute("SELECT pw_hash, pw_salt FROM users").fetchall()
        conn.close()
        for row in rows:
            assert "mysecretpassword" not in row[0]
            assert "mysecretpassword" not in row[1]
