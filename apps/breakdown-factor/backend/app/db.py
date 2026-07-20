# -*- coding: utf-8 -*-
"""
SQLite database helper for Breakdown Factor Construction.
Handles copilot sessions and defect diagnostics history.
"""
from __future__ import annotations
import datetime
import json
import sqlite3
import threading
import logging
from . import config

log = logging.getLogger("breakdown.db")
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
            # Table for user copilot chat history
            c.execute(
                """
                CREATE TABLE IF NOT EXISTS copilot_sessions (
                    id            INTEGER PRIMARY KEY AUTOINCREMENT,
                    created_at    TEXT    NOT NULL,
                    session_id    TEXT    NOT NULL UNIQUE,
                    messages_json TEXT    NOT NULL
                )
                """
            )
            # Table for defect scan results
            c.execute(
                """
                CREATE TABLE IF NOT EXISTS defect_scans (
                    id           INTEGER PRIMARY KEY AUTOINCREMENT,
                    created_at   TEXT    NOT NULL,
                    filename     TEXT    NOT NULL,
                    detected     TEXT    NOT NULL,
                    cost_range   TEXT    NOT NULL,
                    guidance     TEXT    NOT NULL
                )
                """
            )
        log.info("Database initialized successfully at %s", config.DB_PATH)
    except Exception as exc:
        _available = False
        log.warning("Database unavailable (%s) — persistence disabled", exc)


# ── Copilot Sessions CRUD ─────────────────────────────────────────────────────
def save_session(session_id: str, messages: list[dict]) -> bool:
    if not _available: return False
    now = datetime.datetime.utcnow().isoformat() + "Z"
    try:
        with _lock, _conn() as c:
            c.execute(
                """
                INSERT INTO copilot_sessions (created_at, session_id, messages_json)
                VALUES (?, ?, ?)
                ON CONFLICT(session_id) DO UPDATE SET
                    messages_json = excluded.messages_json
                """,
                (now, session_id, json.dumps(messages)),
            )
            return True
    except Exception as e:
        log.warning("Failed to save copilot session: %s", e)
        return False

def get_session(session_id: str) -> dict | None:
    if not _available: return None
    try:
        with _conn() as c:
            row = c.execute("SELECT * FROM copilot_sessions WHERE session_id = ?", (session_id,)).fetchone()
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
            rows = c.execute("SELECT * FROM copilot_sessions ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
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
            cur = c.execute("DELETE FROM copilot_sessions WHERE session_id = ?", (session_id,))
            return cur.rowcount > 0
    except Exception:
        return False


# ── Defect Scans CRUD ──────────────────────────────────────────────────────────
def save_scan(filename: str, detected: list[str], cost_range: str, guidance: str) -> int | None:
    if not _available: return None
    now = datetime.datetime.utcnow().isoformat() + "Z"
    try:
        with _lock, _conn() as c:
            cur = c.execute(
                """
                INSERT INTO defect_scans (created_at, filename, detected, cost_range, guidance)
                VALUES (?, ?, ?, ?, ?)
                """,
                (now, filename, json.dumps(detected), cost_range, guidance),
            )
            return int(cur.lastrowid)
    except Exception as e:
        log.warning("Failed to save scan: %s", e)
        return None

def list_scans(limit: int = 50) -> list[dict]:
    if not _available: return []
    try:
        with _conn() as c:
            rows = c.execute("SELECT * FROM defect_scans ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
            out = []
            for r in rows:
                d = dict(r)
                d["detected_list"] = json.loads(d["detected"])
                out.append(d)
            return out
    except Exception:
        return []

def delete_scan(item_id: int) -> bool:
    if not _available: return False
    try:
        with _lock, _conn() as c:
            cur = c.execute("DELETE FROM defect_scans WHERE id = ?", (item_id,))
            return cur.rowcount > 0
    except Exception:
        return False
