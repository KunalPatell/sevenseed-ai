# -*- coding: utf-8 -*-
"""
AVPU — user accounts & auth.
Signup / login with pbkdf2 password hashing (stdlib) and itsdangerous signed
tokens. No external auth service needed.
"""
from __future__ import annotations
import datetime
import hashlib
import hmac
import os
import secrets
import sqlite3

from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired

from . import config

_SECRET = os.environ.get("AUTH_SECRET", "avpu-dev-secret-change-in-prod")
_serializer = URLSafeTimedSerializer(_SECRET, salt="avpu-auth-v1")
TOKEN_MAX_AGE = 60 * 60 * 24 * 30  # 30 days


def _conn() -> sqlite3.Connection:
    c = sqlite3.connect(config.DB_PATH)
    c.row_factory = sqlite3.Row
    return c


def init() -> None:
    try:
        with _conn() as c:
            c.execute(
                """
                CREATE TABLE IF NOT EXISTS users (
                    id          INTEGER PRIMARY KEY AUTOINCREMENT,
                    created_at  TEXT NOT NULL,
                    name        TEXT NOT NULL,
                    email       TEXT NOT NULL UNIQUE,
                    pw_hash     TEXT NOT NULL,
                    pw_salt     TEXT NOT NULL,
                    program     TEXT DEFAULT ''
                )
                """
            )
    except Exception as e:
        print(f"[auth] init error: {e}")


def _hash_pw(password: str, salt: str | None = None) -> tuple[str, str]:
    salt = salt or secrets.token_hex(16)
    h = hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt), 200_000).hex()
    return h, salt


def _public(row: sqlite3.Row | dict) -> dict:
    return {"id": row["id"], "name": row["name"], "email": row["email"],
            "program": row["program"] if "program" in row.keys() else ""}


def signup(name: str, email: str, password: str) -> dict:
    email = (email or "").strip().lower()
    if "@" not in email:
        return {"error": "Please enter a valid email address."}
    if len(password or "") < 6:
        return {"error": "Password must be at least 6 characters."}
    h, salt = _hash_pw(password)
    try:
        with _conn() as c:
            cur = c.execute(
                "INSERT INTO users (created_at, name, email, pw_hash, pw_salt) VALUES (?,?,?,?,?)",
                (datetime.datetime.utcnow().isoformat(), (name or "Student").strip(), email, h, salt),
            )
            uid = cur.lastrowid
    except sqlite3.IntegrityError:
        return {"error": "An account with this email already exists. Please log in."}
    user = {"id": uid, "name": (name or "Student").strip(), "email": email, "program": ""}
    return {"token": _serializer.dumps({"uid": uid, "email": email}), "user": user}


def login(email: str, password: str) -> dict:
    email = (email or "").strip().lower()
    with _conn() as c:
        row = c.execute("SELECT * FROM users WHERE email=?", (email,)).fetchone()
    if not row:
        return {"error": "No account found with this email. Please sign up."}
    h, _ = _hash_pw(password, row["pw_salt"])
    if not hmac.compare_digest(h, row["pw_hash"]):
        return {"error": "Incorrect password. Please try again."}
    return {"token": _serializer.dumps({"uid": row["id"], "email": email}), "user": _public(row)}


def verify_token(token: str | None) -> dict | None:
    if not token:
        return None
    try:
        data = _serializer.loads(token, max_age=TOKEN_MAX_AGE)
    except (BadSignature, SignatureExpired, Exception):
        return None
    with _conn() as c:
        row = c.execute("SELECT * FROM users WHERE id=?", (data.get("uid"),)).fetchone()
    return _public(row) if row else None


def user_count() -> int:
    try:
        with _conn() as c:
            return c.execute("SELECT COUNT(*) FROM users").fetchone()[0]
    except Exception:
        return 0
