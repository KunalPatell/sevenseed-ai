# -*- coding: utf-8 -*-
"""
Tiny SQLite database helper for saving prescription history, drug checks, and refills.
"""
from __future__ import annotations
import datetime
import json
import sqlite3
import threading
import logging
from . import config

log = logging.getLogger("pharmacy.db")
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
            # Prescriptions table
            c.execute(
                """
                CREATE TABLE IF NOT EXISTS prescriptions (
                    id         INTEGER PRIMARY KEY AUTOINCREMENT,
                    created_at TEXT    NOT NULL,
                    text       TEXT    NOT NULL,
                    result     TEXT    NOT NULL
                )
                """
            )
            # Interactions table
            c.execute(
                """
                CREATE TABLE IF NOT EXISTS interactions (
                    id         INTEGER PRIMARY KEY AUTOINCREMENT,
                    created_at TEXT    NOT NULL,
                    drugs      TEXT    NOT NULL,
                    result     TEXT    NOT NULL
                )
                """
            )
            # Refills table
            c.execute(
                """
                CREATE TABLE IF NOT EXISTS refills (
                    id            INTEGER PRIMARY KEY AUTOINCREMENT,
                    created_at    TEXT    NOT NULL,
                    medicine      TEXT    NOT NULL,
                    quantity      INTEGER NOT NULL,
                    dose_per_day  REAL    NOT NULL,
                    start_date    TEXT    NOT NULL,
                    refill_date   TEXT    NOT NULL,
                    reminder_date TEXT    NOT NULL
                )
                """
            )
        log.info("Database initialized successfully at %s", config.DB_PATH)
    except Exception as exc:
        _available = False
        log.warning("Database unavailable (%s) — persistence disabled", exc)


# ── Prescriptions CRUD ────────────────────────────────────────────────────────
def save_prescription(text: str, result: str) -> int | None:
    if not _available: return None
    now = datetime.datetime.utcnow().isoformat() + "Z"
    try:
        with _lock, _conn() as c:
            cur = c.execute(
                "INSERT INTO prescriptions (created_at, text, result) VALUES (?, ?, ?)",
                (now, text, result),
            )
            return int(cur.lastrowid)
    except Exception as e:
        log.warning("Failed to save prescription: %s", e)
        return None

def list_prescriptions(limit: int = 50) -> list[dict]:
    if not _available: return []
    try:
        with _conn() as c:
            rows = c.execute("SELECT * FROM prescriptions ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
            return [dict(r) for r in rows]
    except Exception:
        return []


# ── Interactions CRUD ─────────────────────────────────────────────────────────
def save_interaction(drugs: list[str], result: str) -> int | None:
    if not _available: return None
    now = datetime.datetime.utcnow().isoformat() + "Z"
    try:
        with _lock, _conn() as c:
            cur = c.execute(
                "INSERT INTO interactions (created_at, drugs, result) VALUES (?, ?, ?)",
                (now, json.dumps(drugs), result),
            )
            return int(cur.lastrowid)
    except Exception as e:
        log.warning("Failed to save interaction: %s", e)
        return None

def list_interactions(limit: int = 50) -> list[dict]:
    if not _available: return []
    try:
        with _conn() as c:
            rows = c.execute("SELECT * FROM interactions ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
            out = []
            for r in rows:
                d = dict(r)
                d["drugs"] = json.loads(d["drugs"])
                out.append(d)
            return out
    except Exception:
        return []


# ── Refills CRUD ──────────────────────────────────────────────────────────────
def save_refill(medicine: str, quantity: int, dose_per_day: float, start_date: str, refill_date: str, reminder_date: str) -> int | None:
    if not _available: return None
    now = datetime.datetime.utcnow().isoformat() + "Z"
    try:
        with _lock, _conn() as c:
            cur = c.execute(
                """
                INSERT INTO refills (created_at, medicine, quantity, dose_per_day, start_date, refill_date, reminder_date)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (now, medicine, quantity, dose_per_day, start_date, refill_date, reminder_date),
            )
            return int(cur.lastrowid)
    except Exception as e:
        log.warning("Failed to save refill: %s", e)
        return None

def list_refills(limit: int = 50) -> list[dict]:
    if not _available: return []
    try:
        with _conn() as c:
            rows = c.execute("SELECT * FROM refills ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
            return [dict(r) for r in rows]
    except Exception:
        return []

def delete_refill(item_id: int) -> bool:
    if not _available: return False
    try:
        with _lock, _conn() as c:
            cur = c.execute("DELETE FROM refills WHERE id = ?", (item_id,))
            return cur.rowcount > 0
    except Exception:
        return False
