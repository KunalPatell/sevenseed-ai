# -*- coding: utf-8 -*-
"""
SQLite database helper for saving venture ideation pitches, founder advisor sessions, and portfolio stats.
"""
from __future__ import annotations
import datetime
import json
import sqlite3
import threading
import logging
from . import config

log = logging.getLogger("sevenseed.db")
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
            # Founder assistant conversations
            c.execute(
                """
                CREATE TABLE IF NOT EXISTS founder_sessions (
                    id            INTEGER PRIMARY KEY AUTOINCREMENT,
                    created_at    TEXT    NOT NULL,
                    session_id    TEXT    NOT NULL UNIQUE,
                    messages_json TEXT    NOT NULL
                )
                """
            )
            # AI-generated startup ideation pitches
            c.execute(
                """
                CREATE TABLE IF NOT EXISTS ideated_pitches (
                    id           INTEGER PRIMARY KEY AUTOINCREMENT,
                    created_at   TEXT    NOT NULL,
                    domain       TEXT    NOT NULL,
                    problem      TEXT    NOT NULL,
                    market       TEXT    NOT NULL,
                    ideas_output TEXT    NOT NULL
                )
                """
            )
            # Sintra-style Global Brain AI context
            c.execute(
                """
                CREATE TABLE IF NOT EXISTS company_context (
                    id           INTEGER PRIMARY KEY AUTOINCREMENT,
                    company_name TEXT NOT NULL,
                    industry     TEXT NOT NULL,
                    description  TEXT NOT NULL,
                    tone         TEXT NOT NULL DEFAULT 'Professional',
                    updated_at   TEXT NOT NULL
                )
                """
            )
        log.info("Database initialized successfully at %s", config.DB_PATH)
    except Exception as exc:
        _available = False
        log.warning("Database unavailable (%s) — persistence disabled", exc)


# ── Founder Sessions CRUD ─────────────────────────────────────────────────────
def save_session(session_id: str, messages: list[dict]) -> bool:
    if not _available: return False
    now = datetime.datetime.utcnow().isoformat() + "Z"
    try:
        with _lock, _conn() as c:
            c.execute(
                """
                INSERT INTO founder_sessions (created_at, session_id, messages_json)
                VALUES (?, ?, ?)
                ON CONFLICT(session_id) DO UPDATE SET
                    messages_json = excluded.messages_json
                """,
                (now, session_id, json.dumps(messages)),
            )
            return True
    except Exception as e:
        log.warning("Failed to save founder session: %s", e)
        return False

def get_session(session_id: str) -> dict | None:
    if not _available: return None
    try:
        with _conn() as c:
            row = c.execute("SELECT * FROM founder_sessions WHERE session_id = ?", (session_id,)).fetchone()
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
            rows = c.execute("SELECT * FROM founder_sessions ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
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
            cur = c.execute("DELETE FROM founder_sessions WHERE session_id = ?", (session_id,))
            return cur.rowcount > 0
    except Exception:
        return False


# ── Ideated Pitches CRUD ───────────────────────────────────────────────────────
def save_pitch(domain: str, problem: str, market: str, ideas_output: str) -> int | None:
    if not _available: return None
    now = datetime.datetime.utcnow().isoformat() + "Z"
    try:
        with _lock, _conn() as c:
            cur = c.execute(
                """
                INSERT INTO ideated_pitches (created_at, domain, problem, market, ideas_output)
                VALUES (?, ?, ?, ?, ?)
                """,
                (now, domain, problem, market, ideas_output),
            )
            return int(cur.lastrowid)
    except Exception as e:
        log.warning("Failed to save pitch: %s", e)
        return None

def list_pitches(limit: int = 50) -> list[dict]:
    if not _available: return []
    try:
        with _conn() as c:
            rows = c.execute("SELECT * FROM ideated_pitches ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
            return [dict(r) for r in rows]
    except Exception:
        return []

def delete_pitch(item_id: int) -> bool:
    if not _available: return False
    try:
        with _lock, _conn() as c:
            cur = c.execute("DELETE FROM ideated_pitches WHERE id = ?", (item_id,))
            return cur.rowcount > 0
    except Exception:
        return False


# ── Company Context CRUD (Sintra AI style) ────────────────────────────────────
def save_context(company_name: str, industry: str, description: str, tone: str = "Professional") -> bool:
    if not _available: return False
    now = datetime.datetime.utcnow().isoformat() + "Z"
    try:
        with _lock, _conn() as c:
            r = c.execute("SELECT id FROM company_context LIMIT 1").fetchone()
            if r:
                c.execute(
                    """
                    UPDATE company_context 
                    SET company_name = ?, industry = ?, description = ?, tone = ?, updated_at = ?
                    WHERE id = ?
                    """,
                    (company_name, industry, description, tone, now, r["id"])
                )
            else:
                c.execute(
                    """
                    INSERT INTO company_context (company_name, industry, description, tone, updated_at)
                    VALUES (?, ?, ?, ?, ?)
                    """,
                    (company_name, industry, description, tone, now)
                )
            return True
    except Exception as e:
        log.warning("Failed to save context: %s", e)
        return False

def get_context() -> dict | None:
    if not _available: return None
    try:
        with _conn() as c:
            row = c.execute("SELECT * FROM company_context LIMIT 1").fetchone()
            return dict(row) if row else None
    except Exception:
        return None
