# -*- coding: utf-8 -*-
"""
Database helper for saving venture ideation pitches, founder advisor sessions, and portfolio stats.
Supports PostgreSQL (Supabase / Render) via SQLAlchemy with automatic SQLite fallback.
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

# Detect PostgreSQL via SQLAlchemy engine if configured
_pg_engine = None
try:
    from db.db import engine as _db_engine, DATABASE_URL as _DB_URL
    if _DB_URL and "sqlite" not in _DB_URL:
        _pg_engine = _db_engine
except Exception as e:
    log.debug("SQLAlchemy PostgreSQL engine not loaded: %s", e)


def _conn() -> sqlite3.Connection:
    conn = sqlite3.connect(config.DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init() -> None:
    global _available
    # 1. Initialize PostgreSQL tables if connected to Supabase/PostgreSQL
    if _pg_engine:
        try:
            from sqlalchemy import text
            with _pg_engine.connect() as conn:
                conn.execute(text("""
                    CREATE TABLE IF NOT EXISTS founder_sessions (
                        id SERIAL PRIMARY KEY,
                        created_at TEXT NOT NULL,
                        session_id TEXT NOT NULL UNIQUE,
                        messages_json TEXT NOT NULL
                    );
                    CREATE TABLE IF NOT EXISTS ideated_pitches (
                        id SERIAL PRIMARY KEY,
                        created_at TEXT NOT NULL,
                        domain TEXT NOT NULL,
                        problem TEXT NOT NULL,
                        market TEXT NOT NULL,
                        ideas_output TEXT NOT NULL
                    );
                    CREATE TABLE IF NOT EXISTS contact_messages (
                        id SERIAL PRIMARY KEY,
                        created_at TEXT NOT NULL,
                        name TEXT NOT NULL,
                        email TEXT NOT NULL,
                        subject TEXT NOT NULL,
                        message TEXT NOT NULL,
                        ip TEXT
                    );
                """))
                conn.commit()
            log.info("Cloud PostgreSQL (Supabase) tables initialized successfully")
        except Exception as exc:
            log.warning("Failed to initialize PostgreSQL tables (%s)", exc)

    # 2. Also ensure local SQLite tables are initialized as fallback
    try:
        with _conn() as c:
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
            c.execute(
                """
                CREATE TABLE IF NOT EXISTS contact_messages (
                    id         INTEGER PRIMARY KEY AUTOINCREMENT,
                    created_at TEXT    NOT NULL,
                    name       TEXT    NOT NULL,
                    email      TEXT    NOT NULL,
                    subject    TEXT    NOT NULL,
                    message    TEXT    NOT NULL,
                    ip         TEXT
                )
                """
            )
        log.info("SQLite fallback tables initialized successfully at %s", config.DB_PATH)
    except Exception as exc:
        if not _pg_engine:
            _available = False
            log.warning("Database unavailable (%s) — persistence disabled", exc)


# ── Founder Sessions CRUD ─────────────────────────────────────────────────────
def save_session(session_id: str, messages: list[dict]) -> bool:
    if not _available: return False
    now = datetime.datetime.utcnow().isoformat() + "Z"
    if _pg_engine:
        try:
            from sqlalchemy import text
            with _pg_engine.connect() as conn:
                conn.execute(
                    text("""
                        INSERT INTO founder_sessions (created_at, session_id, messages_json)
                        VALUES (:c, :s, :m)
                        ON CONFLICT (session_id) DO UPDATE SET messages_json = EXCLUDED.messages_json
                    """),
                    {"c": now, "s": session_id, "m": json.dumps(messages)}
                )
                conn.commit()
                return True
        except Exception as e:
            log.warning("PostgreSQL save_session failed (%s), trying SQLite fallback", e)

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
    if _pg_engine:
        try:
            from sqlalchemy import text
            with _pg_engine.connect() as conn:
                res = conn.execute(
                    text("SELECT id, created_at, session_id, messages_json FROM founder_sessions WHERE session_id = :s"),
                    {"s": session_id}
                )
                row = res.fetchone()
                if row:
                    d = dict(row._mapping)
                    d["messages"] = json.loads(d["messages_json"])
                    return d
        except Exception as e:
            log.warning("PostgreSQL get_session failed (%s), trying SQLite fallback", e)

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
    if _pg_engine:
        try:
            from sqlalchemy import text
            with _pg_engine.connect() as conn:
                res = conn.execute(
                    text("SELECT id, created_at, session_id, messages_json FROM founder_sessions ORDER BY id DESC LIMIT :l"),
                    {"l": limit}
                )
                out = []
                for r in res:
                    d = dict(r._mapping)
                    d["messages"] = json.loads(d["messages_json"])
                    out.append(d)
                return out
        except Exception as e:
            log.warning("PostgreSQL list_sessions failed (%s), trying SQLite fallback", e)

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
    if _pg_engine:
        try:
            from sqlalchemy import text
            with _pg_engine.connect() as conn:
                res = conn.execute(
                    text("DELETE FROM founder_sessions WHERE session_id = :s"),
                    {"s": session_id}
                )
                conn.commit()
                return res.rowcount > 0
        except Exception as e:
            log.warning("PostgreSQL delete_session failed (%s), trying SQLite fallback", e)

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
    if _pg_engine:
        try:
            from sqlalchemy import text
            with _pg_engine.connect() as conn:
                res = conn.execute(
                    text("""
                        INSERT INTO ideated_pitches (created_at, domain, problem, market, ideas_output)
                        VALUES (:c, :d, :p, :m, :o)
                        RETURNING id
                    """),
                    {"c": now, "d": domain, "p": problem, "m": market, "o": ideas_output}
                )
                conn.commit()
                row = res.fetchone()
                return int(row[0]) if row else None
        except Exception as e:
            log.warning("PostgreSQL save_pitch failed (%s), trying SQLite fallback", e)

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
    if _pg_engine:
        try:
            from sqlalchemy import text
            with _pg_engine.connect() as conn:
                res = conn.execute(
                    text("SELECT id, created_at, domain, problem, market, ideas_output FROM ideated_pitches ORDER BY id DESC LIMIT :l"),
                    {"l": limit}
                )
                return [dict(r._mapping) for r in res]
        except Exception as e:
            log.warning("PostgreSQL list_pitches failed (%s), trying SQLite fallback", e)

    try:
        with _conn() as c:
            rows = c.execute("SELECT * FROM ideated_pitches ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
            return [dict(r) for r in rows]
    except Exception:
        return []


def delete_pitch(item_id: int) -> bool:
    if not _available: return False
    if _pg_engine:
        try:
            from sqlalchemy import text
            with _pg_engine.connect() as conn:
                res = conn.execute(
                    text("DELETE FROM ideated_pitches WHERE id = :id"),
                    {"id": item_id}
                )
                conn.commit()
                return res.rowcount > 0
        except Exception as e:
            log.warning("PostgreSQL delete_pitch failed (%s), trying SQLite fallback", e)

    try:
        with _lock, _conn() as c:
            cur = c.execute("DELETE FROM ideated_pitches WHERE id = ?", (item_id,))
            return cur.rowcount > 0
    except Exception:
        return False


# ── Contact Messages CRUD ──────────────────────────────────────────────────────
def save_contact_message(name: str, email: str, subject: str, message: str, ip: str = "") -> int | None:
    if not _available: return None
    now = datetime.datetime.utcnow().isoformat() + "Z"
    if _pg_engine:
        try:
            from sqlalchemy import text
            with _pg_engine.connect() as conn:
                res = conn.execute(
                    text("""
                        INSERT INTO contact_messages (created_at, name, email, subject, message, ip)
                        VALUES (:c, :n, :e, :s, :m, :ip)
                        RETURNING id
                    """),
                    {"c": now, "n": name, "e": email, "s": subject, "m": message, "ip": ip}
                )
                conn.commit()
                row = res.fetchone()
                return int(row[0]) if row else None
        except Exception as e:
            log.warning("PostgreSQL save_contact_message failed (%s), trying SQLite fallback", e)

    try:
        with _lock, _conn() as c:
            cur = c.execute(
                """
                INSERT INTO contact_messages (created_at, name, email, subject, message, ip)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (now, name, email, subject, message, ip),
            )
            return int(cur.lastrowid)
    except Exception as e:
        log.warning("Failed to save contact message: %s", e)
        return None


def list_contact_messages(limit: int = 50) -> list[dict]:
    if not _available: return []
    if _pg_engine:
        try:
            from sqlalchemy import text
            with _pg_engine.connect() as conn:
                res = conn.execute(
                    text("SELECT id, created_at, name, email, subject, message, ip FROM contact_messages ORDER BY id DESC LIMIT :l"),
                    {"l": limit}
                )
                return [dict(r._mapping) for r in res]
        except Exception as e:
            log.warning("PostgreSQL list_contact_messages failed (%s), trying SQLite fallback", e)

    try:
        with _conn() as c:
            rows = c.execute("SELECT * FROM contact_messages ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
            return [dict(r) for r in rows]
    except Exception:
        return []
