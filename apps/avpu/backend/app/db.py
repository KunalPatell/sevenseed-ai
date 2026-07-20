# -*- coding: utf-8 -*-
"""
SQLite database helper for saving learning sessions, assessments, and custom study roadmaps.
"""
from __future__ import annotations
import datetime
import json
import sqlite3
import threading
import logging
from . import config

log = logging.getLogger("avpu.db")
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
            # Learning sessions (tutor chat history)
            c.execute(
                """
                CREATE TABLE IF NOT EXISTS learning_sessions (
                    id            INTEGER PRIMARY KEY AUTOINCREMENT,
                    created_at    TEXT    NOT NULL,
                    session_id    TEXT    NOT NULL UNIQUE,
                    subject       TEXT    NOT NULL,
                    messages_json TEXT    NOT NULL
                )
                """
            )
            # Custom study roadmaps
            c.execute(
                """
                CREATE TABLE IF NOT EXISTS study_roadmaps (
                    id           INTEGER PRIMARY KEY AUTOINCREMENT,
                    created_at   TEXT    NOT NULL,
                    goal         TEXT    NOT NULL,
                    level        TEXT    NOT NULL,
                    weeks        INTEGER NOT NULL,
                    roadmap_json TEXT    NOT NULL
                )
                """
            )
            # Student assessments log
            c.execute(
                """
                CREATE TABLE IF NOT EXISTS assessments (
                    id             INTEGER PRIMARY KEY AUTOINCREMENT,
                    created_at     TEXT    NOT NULL,
                    question       TEXT    NOT NULL,
                    student_answer TEXT    NOT NULL,
                    feedback_json  TEXT    NOT NULL
                )
                """
            )
        log.info("Database initialized successfully at %s", config.DB_PATH)
    except Exception as exc:
        _available = False
        log.warning("Database unavailable (%s) — persistence disabled", exc)


# ── Learning Sessions CRUD ───────────────────────────────────────────────────
def save_session(session_id: str, subject: str, messages: list[dict]) -> bool:
    if not _available: return False
    now = datetime.datetime.utcnow().isoformat() + "Z"
    try:
        with _lock, _conn() as c:
            c.execute(
                """
                INSERT INTO learning_sessions (created_at, session_id, subject, messages_json)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(session_id) DO UPDATE SET
                    messages_json = excluded.messages_json
                """,
                (now, session_id, subject, json.dumps(messages)),
            )
            return True
    except Exception as e:
        log.warning("Failed to save learning session: %s", e)
        return False

def get_session(session_id: str) -> dict | None:
    if not _available: return None
    try:
        with _conn() as c:
            row = c.execute("SELECT * FROM learning_sessions WHERE session_id = ?", (session_id,)).fetchone()
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
            rows = c.execute("SELECT * FROM learning_sessions ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
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
            cur = c.execute("DELETE FROM learning_sessions WHERE session_id = ?", (session_id,))
            return cur.rowcount > 0
    except Exception:
        return False


# ── Study Roadmaps CRUD ───────────────────────────────────────────────────────
def save_roadmap(goal: str, level: str, weeks: int, roadmap_data: dict) -> int | None:
    if not _available: return None
    now = datetime.datetime.utcnow().isoformat() + "Z"
    try:
        with _lock, _conn() as c:
            cur = c.execute(
                """
                INSERT INTO study_roadmaps (created_at, goal, level, weeks, roadmap_json)
                VALUES (?, ?, ?, ?, ?)
                """,
                (now, goal, level, weeks, json.dumps(roadmap_data)),
            )
            return int(cur.lastrowid)
    except Exception as e:
        log.warning("Failed to save roadmap: %s", e)
        return None

def list_roadmaps(limit: int = 50) -> list[dict]:
    if not _available: return []
    try:
        with _conn() as c:
            rows = c.execute("SELECT * FROM study_roadmaps ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
            out = []
            for r in rows:
                d = dict(r)
                d["roadmap"] = json.loads(d["roadmap_json"])
                out.append(d)
            return out
    except Exception:
        return []

def delete_roadmap(item_id: int) -> bool:
    if not _available: return False
    try:
        with _lock, _conn() as c:
            cur = c.execute("DELETE FROM study_roadmaps WHERE id = ?", (item_id,))
            return cur.rowcount > 0
    except Exception:
        return False


# ── Assessments CRUD ──────────────────────────────────────────────────────────
def save_assessment(question: str, student_answer: str, feedback: dict) -> int | None:
    if not _available: return None
    now = datetime.datetime.utcnow().isoformat() + "Z"
    try:
        with _lock, _conn() as c:
            cur = c.execute(
                """
                INSERT INTO assessments (created_at, question, student_answer, feedback_json)
                VALUES (?, ?, ?, ?)
                """,
                (now, question, student_answer, json.dumps(feedback)),
            )
            return int(cur.lastrowid)
    except Exception as e:
        log.warning("Failed to save assessment: %s", e)
        return None

def list_assessments(limit: int = 50) -> list[dict]:
    if not _available: return []
    try:
        with _conn() as c:
            rows = c.execute("SELECT * FROM assessments ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
            out = []
            for r in rows:
                d = dict(r)
                d["feedback"] = json.loads(d["feedback_json"])
                out.append(d)
            return out
    except Exception:
        return []

def delete_assessment(item_id: int) -> bool:
    if not _available: return False
    try:
        with _lock, _conn() as c:
            cur = c.execute("DELETE FROM assessments WHERE id = ?", (item_id,))
            return cur.rowcount > 0
    except Exception:
        return False
