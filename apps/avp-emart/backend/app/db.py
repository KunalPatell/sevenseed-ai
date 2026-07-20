# -*- coding: utf-8 -*-
"""
SQLite database helper for saving price comparison searches, wishlists, and target price alerts.
"""
from __future__ import annotations
import datetime
import json
import sqlite3
import threading
import logging
from . import config

log = logging.getLogger("emart.db")
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
            # Price searches history
            c.execute(
                """
                CREATE TABLE IF NOT EXISTS price_searches (
                    id            INTEGER PRIMARY KEY AUTOINCREMENT,
                    created_at    TEXT    NOT NULL,
                    query         TEXT    NOT NULL,
                    best_price    REAL    NOT NULL,
                    best_platform TEXT    NOT NULL,
                    results_json  TEXT    NOT NULL
                )
                """
            )
            # Wishlist items
            c.execute(
                """
                CREATE TABLE IF NOT EXISTS wishlist (
                    id         INTEGER PRIMARY KEY AUTOINCREMENT,
                    created_at TEXT    NOT NULL,
                    title      TEXT    NOT NULL,
                    price      REAL    NOT NULL,
                    platform   TEXT    NOT NULL,
                    url        TEXT    NOT NULL
                )
                """
            )
            # Price alerts
            c.execute(
                """
                CREATE TABLE IF NOT EXISTS price_alerts (
                    id           INTEGER PRIMARY KEY AUTOINCREMENT,
                    created_at   TEXT    NOT NULL,
                    title        TEXT    NOT NULL,
                    target_price REAL    NOT NULL,
                    current_price REAL    NOT NULL,
                    platform     TEXT    NOT NULL
                )
                """
            )
        log.info("Database initialized successfully at %s", config.DB_PATH)
    except Exception as exc:
        _available = False
        log.warning("Database unavailable (%s) — persistence disabled", exc)


# ── Price Searches CRUD ───────────────────────────────────────────────────────
def save_search(query: str, best_price: float, best_platform: str, results: list[dict]) -> int | None:
    if not _available: return None
    now = datetime.datetime.utcnow().isoformat() + "Z"
    try:
        with _lock, _conn() as c:
            cur = c.execute(
                """
                INSERT INTO price_searches (created_at, query, best_price, best_platform, results_json)
                VALUES (?, ?, ?, ?, ?)
                """,
                (now, query, best_price, best_platform, json.dumps(results)),
            )
            return int(cur.lastrowid)
    except Exception as e:
        log.warning("Failed to save search: %s", e)
        return None

def list_searches(limit: int = 50) -> list[dict]:
    if not _available: return []
    try:
        with _conn() as c:
            rows = c.execute("SELECT * FROM price_searches ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
            out = []
            for r in rows:
                d = dict(r)
                d["results"] = json.loads(d["results_json"])
                out.append(d)
            return out
    except Exception:
        return []


# ── Wishlist CRUD ─────────────────────────────────────────────────────────────
def add_to_wishlist(title: str, price: float, platform: str, url: str) -> int | None:
    if not _available: return None
    now = datetime.datetime.utcnow().isoformat() + "Z"
    try:
        with _lock, _conn() as c:
            cur = c.execute(
                """
                INSERT INTO wishlist (created_at, title, price, platform, url)
                VALUES (?, ?, ?, ?, ?)
                """,
                (now, title, price, platform, url),
            )
            return int(cur.lastrowid)
    except Exception as e:
        log.warning("Failed to add to wishlist: %s", e)
        return None

def list_wishlist(limit: int = 50) -> list[dict]:
    if not _available: return []
    try:
        with _conn() as c:
            rows = c.execute("SELECT * FROM wishlist ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
            return [dict(r) for r in rows]
    except Exception:
        return []

def delete_wishlist_item(item_id: int) -> bool:
    if not _available: return False
    try:
        with _lock, _conn() as c:
            cur = c.execute("DELETE FROM wishlist WHERE id = ?", (item_id,))
            return cur.rowcount > 0
    except Exception:
        return False


# ── Price Alerts CRUD ─────────────────────────────────────────────────────────
def add_price_alert(title: str, target_price: float, current_price: float, platform: str) -> int | None:
    if not _available: return None
    now = datetime.datetime.utcnow().isoformat() + "Z"
    try:
        with _lock, _conn() as c:
            cur = c.execute(
                """
                INSERT INTO price_alerts (created_at, title, target_price, current_price, platform)
                VALUES (?, ?, ?, ?, ?)
                """,
                (now, title, target_price, current_price, platform),
            )
            return int(cur.lastrowid)
    except Exception as e:
        log.warning("Failed to add price alert: %s", e)
        return None

def list_price_alerts(limit: int = 50) -> list[dict]:
    if not _available: return []
    try:
        with _conn() as c:
            rows = c.execute("SELECT * FROM price_alerts ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
            return [dict(r) for r in rows]
    except Exception:
        return []

def delete_price_alert(item_id: int) -> bool:
    if not _available: return False
    try:
        with _lock, _conn() as c:
            cur = c.execute("DELETE FROM price_alerts WHERE id = ?", (item_id,))
            return cur.rowcount > 0
    except Exception:
        return False
