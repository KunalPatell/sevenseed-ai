# -*- coding: utf-8 -*-
"""
SQLite database helper for AVP Charitable Trust.
Handles donor assistant sessions, NGO needs assessments, and beneficiary match logs.
"""
from __future__ import annotations
import datetime
import json
import sqlite3
import threading
import logging
from . import config

log = logging.getLogger("trust.db")
_lock = threading.Lock()
_available = True


def _conn() -> sqlite3.Connection:
    conn = sqlite3.connect(config.DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init() -> None:
    global _available
    try:
        with _conn() as c:
            # Table for user donor assistant chat history
            c.execute(
                """
                CREATE TABLE IF NOT EXISTS donor_sessions (
                    id            INTEGER PRIMARY KEY AUTOINCREMENT,
                    created_at    TEXT    NOT NULL,
                    session_id    TEXT    NOT NULL UNIQUE,
                    messages_json TEXT    NOT NULL
                )
                """
            )
            # Table for NGO needs assessments
            c.execute(
                """
                CREATE TABLE IF NOT EXISTS needs_assessments (
                    id           INTEGER PRIMARY KEY AUTOINCREMENT,
                    created_at   TEXT    NOT NULL,
                    location     TEXT    NOT NULL,
                    population   TEXT    NOT NULL,
                    issues       TEXT    NOT NULL,
                    result       TEXT    NOT NULL
                )
                """
            )
            # Table for matched beneficiaries
            c.execute(
                """
                CREATE TABLE IF NOT EXISTS beneficiary_matches (
                    id           INTEGER PRIMARY KEY AUTOINCREMENT,
                    created_at   TEXT    NOT NULL,
                    name         TEXT    NOT NULL,
                    age          TEXT    NOT NULL,
                    location     TEXT    NOT NULL,
                    issues       TEXT    NOT NULL,
                    result       TEXT    NOT NULL
                )
                """
            )
        log.info("Database initialized successfully at %s", config.DB_PATH)
    except Exception as exc:
        _available = False
        log.warning("Database unavailable (%s) — persistence disabled", exc)


# ── Donor Sessions CRUD ───────────────────────────────────────────────────────
def save_session(session_id: str, messages: list[dict]) -> bool:
    if not _available: return False
    now = datetime.datetime.utcnow().isoformat() + "Z"
    try:
        with _lock, _conn() as c:
            c.execute(
                """
                INSERT INTO donor_sessions (created_at, session_id, messages_json)
                VALUES (?, ?, ?)
                ON CONFLICT(session_id) DO UPDATE SET
                    messages_json = excluded.messages_json
                """,
                (now, session_id, json.dumps(messages)),
            )
            return True
    except Exception as e:
        log.warning("Failed to save donor session: %s", e)
        return False

def get_session(session_id: str) -> dict | None:
    if not _available: return None
    try:
        with _conn() as c:
            row = c.execute("SELECT * FROM donor_sessions WHERE session_id = ?", (session_id,)).fetchone()
            if row:
                d = dict(row)
                d["messages"] = json.loads(d["messages_json"])
                return d
            return None
    except Exception:
        return None

def list_sessions(limit: int = 50) -> list[dict]:
    if not _available: return []
    try:
        with _conn() as c:
            rows = c.execute("SELECT * FROM donor_sessions ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
            out = []
            for r in rows:
                d = dict(r)
                d["messages"] = json.loads(d["messages_json"])
                out.append(d)
            return out
    except Exception:
        return []

def delete_session(session_id: str) -> bool:
    if not _available: return False
    try:
        with _lock, _conn() as c:
            cur = c.execute("DELETE FROM donor_sessions WHERE session_id = ?", (session_id,))
            return cur.rowcount > 0
    except Exception:
        return False


# ── Needs Assessments CRUD ────────────────────────────────────────────────────
def save_needs_assessment(location: str, population: str, issues: str, result: str) -> int | None:
    if not _available: return None
    now = datetime.datetime.utcnow().isoformat() + "Z"
    try:
        with _lock, _conn() as c:
            cur = c.execute(
                """
                INSERT INTO needs_assessments (created_at, location, population, issues, result)
                VALUES (?, ?, ?, ?, ?)
                """,
                (now, location, population, issues, result),
            )
            return int(cur.lastrowid)
    except Exception as e:
        log.warning("Failed to save needs assessment: %s", e)
        return None

def list_needs_assessments(limit: int = 50) -> list[dict]:
    if not _available: return []
    try:
        with _conn() as c:
            rows = c.execute("SELECT * FROM needs_assessments ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
            return [dict(r) for r in rows]
    except Exception:
        return []

def delete_needs_assessment(item_id: int) -> bool:
    if not _available: return False
    try:
        with _lock, _conn() as c:
            cur = c.execute("DELETE FROM needs_assessments WHERE id = ?", (item_id,))
            return cur.rowcount > 0
    except Exception:
        return False


# ── Beneficiary Matches CRUD ──────────────────────────────────────────────────
def save_beneficiary_match(name: str, age: str, location: str, issues: str, result: str) -> int | None:
    if not _available: return None
    now = datetime.datetime.utcnow().isoformat() + "Z"
    try:
        with _lock, _conn() as c:
            cur = c.execute(
                """
                INSERT INTO beneficiary_matches (created_at, name, age, location, issues, result)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (now, name, age, location, issues, result),
            )
            return int(cur.lastrowid)
    except Exception as e:
        log.warning("Failed to save beneficiary match: %s", e)
        return None

def list_beneficiary_matches(limit: int = 50) -> list[dict]:
    if not _available: return []
    try:
        with _conn() as c:
            rows = c.execute("SELECT * FROM beneficiary_matches ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
            return [dict(r) for r in rows]
    except Exception:
        return []

def delete_beneficiary_match(item_id: int) -> bool:
    if not _available: return False
    try:
        with _lock, _conn() as c:
            cur = c.execute("DELETE FROM beneficiary_matches WHERE id = ?", (item_id,))
            return cur.rowcount > 0
    except Exception:
        return False
