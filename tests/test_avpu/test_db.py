# -*- coding: utf-8 -*-
"""
Unit tests for apps/avpu/backend/app/db.py
Tests: table creation, CRUD for sessions, roadmaps, and assessments,
       JSON round-trips, limit param, idempotent init, graceful degradation.
"""
from __future__ import annotations
import sys, os, json, threading, importlib
import pytest

# ── inject app into path ──────────────────────────────────────────────────────
BACKEND = os.path.join(os.path.dirname(__file__), "..", "..", "apps", "avpu", "backend")
sys.path.insert(0, BACKEND)


@pytest.fixture(autouse=True)
def isolate_db(tmp_path, monkeypatch):
    """Each test gets a fresh temp SQLite file."""
    db_file = str(tmp_path / "avpu_test.sqlite3")
    monkeypatch.setenv("DB_PATH", db_file)
    # Force reimport so config / db pick up the new env var
    for mod in list(sys.modules.keys()):
        if mod.startswith("app.") or mod == "app":
            del sys.modules[mod]
    yield db_file


def _get_db():
    from app import db, config
    db._available = True
    db.init()
    return db


# ─────────────────────────────────────────────────────────────────────────────
# 1. TABLE CREATION / INIT
# ─────────────────────────────────────────────────────────────────────────────
class TestInit:
    def test_init_creates_tables(self, isolate_db):
        db = _get_db()
        import sqlite3
        conn = sqlite3.connect(isolate_db)
        tables = {r[0] for r in conn.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()}
        conn.close()
        assert "learning_sessions" in tables
        assert "study_roadmaps" in tables
        assert "assessments" in tables

    def test_init_idempotent(self, isolate_db):
        """Calling init() twice must not raise or duplicate tables."""
        db = _get_db()
        db.init()  # second call
        import sqlite3
        conn = sqlite3.connect(isolate_db)
        count = conn.execute(
            "SELECT count(*) FROM sqlite_master WHERE type='table' AND name='learning_sessions'"
        ).fetchone()[0]
        conn.close()
        assert count == 1

    def test_init_bad_path_disables_db(self, monkeypatch):
        """If DB path is invalid, _available should become False."""
        monkeypatch.setenv("DB_PATH", "/nonexistent_dir/test.sqlite3")
        for mod in list(sys.modules.keys()):
            if mod.startswith("app.") or mod == "app":
                del sys.modules[mod]
        from app import db
        db._available = True
        db.init()
        assert db._available is False


# ─────────────────────────────────────────────────────────────────────────────
# 2. LEARNING SESSIONS CRUD
# ─────────────────────────────────────────────────────────────────────────────
class TestLearningSessions:
    def test_save_and_get_session(self, isolate_db):
        db = _get_db()
        msgs = [{"role": "user", "text": "Hello"}, {"role": "ai", "text": "Hi!"}]
        db.save_session("sess-001", "Mathematics", msgs)
        result = db.get_session("sess-001")
        assert result is not None
        assert result["session_id"] == "sess-001"
        assert result["subject"] == "Mathematics"
        assert result["messages"] == msgs

    def test_save_session_upsert(self, isolate_db):
        """Second save to same session_id updates messages (upsert)."""
        db = _get_db()
        db.save_session("sess-upsert", "Physics", [{"role": "user", "text": "Q1"}])
        new_msgs = [{"role": "user", "text": "Q1"}, {"role": "ai", "text": "A1"}]
        db.save_session("sess-upsert", "Physics", new_msgs)
        result = db.get_session("sess-upsert")
        assert len(result["messages"]) == 2

    def test_get_nonexistent_session(self, isolate_db):
        db = _get_db()
        assert db.get_session("does-not-exist") is None

    def test_list_sessions(self, isolate_db):
        db = _get_db()
        for i in range(5):
            db.save_session(f"s{i}", f"Subject{i}", [{"role": "user", "text": f"msg{i}"}])
        result = db.list_sessions(limit=3)
        assert len(result) == 3

    def test_list_sessions_empty(self, isolate_db):
        db = _get_db()
        assert db.list_sessions() == []

    def test_delete_session(self, isolate_db):
        db = _get_db()
        db.save_session("sess-del", "Chemistry", [])
        assert db.delete_session("sess-del") is True
        assert db.get_session("sess-del") is None

    def test_delete_nonexistent_session_returns_false(self, isolate_db):
        db = _get_db()
        assert db.delete_session("ghost-session") is False

    def test_messages_json_roundtrip(self, isolate_db):
        """Unicode, emoji, nested dicts must survive JSON round-trip."""
        db = _get_db()
        msgs = [{"role": "user", "text": "नमस्ते 🎓", "meta": {"nested": True}}]
        db.save_session("sess-unicode", "Hindi", msgs)
        result = db.get_session("sess-unicode")
        assert result["messages"][0]["text"] == "नमस्ते 🎓"
        assert result["messages"][0]["meta"]["nested"] is True


# ─────────────────────────────────────────────────────────────────────────────
# 3. STUDY ROADMAPS CRUD
# ─────────────────────────────────────────────────────────────────────────────
class TestStudyRoadmaps:
    def test_save_and_list_roadmap(self, isolate_db):
        db = _get_db()
        rid = db.save_roadmap("ML Engineer", "beginner", 8, {"weeks": ["Week 1: Python"]})
        assert isinstance(rid, int)
        items = db.list_roadmaps()
        assert len(items) == 1
        assert items[0]["goal"] == "ML Engineer"
        assert items[0]["roadmap"]["weeks"][0] == "Week 1: Python"

    def test_delete_roadmap(self, isolate_db):
        db = _get_db()
        rid = db.save_roadmap("Data Science", "intermediate", 12, {})
        assert db.delete_roadmap(rid) is True
        assert db.list_roadmaps() == []

    def test_delete_nonexistent_roadmap(self, isolate_db):
        db = _get_db()
        assert db.delete_roadmap(9999) is False

    def test_roadmap_limit(self, isolate_db):
        db = _get_db()
        for i in range(10):
            db.save_roadmap(f"Goal{i}", "beginner", 4, {})
        assert len(db.list_roadmaps(limit=3)) == 3


# ─────────────────────────────────────────────────────────────────────────────
# 4. ASSESSMENTS CRUD
# ─────────────────────────────────────────────────────────────────────────────
class TestAssessments:
    def test_save_and_list_assessment(self, isolate_db):
        db = _get_db()
        aid = db.save_assessment("What is AI?", "Artificial Intelligence", {"score": 9})
        assert isinstance(aid, int)
        items = db.list_assessments()
        assert items[0]["question"] == "What is AI?"
        assert items[0]["feedback"]["score"] == 9

    def test_delete_assessment(self, isolate_db):
        db = _get_db()
        aid = db.save_assessment("Q?", "A", {"score": 7})
        assert db.delete_assessment(aid) is True
        assert db.list_assessments() == []

    def test_delete_nonexistent_assessment(self, isolate_db):
        db = _get_db()
        assert db.delete_assessment(9999) is False


# ─────────────────────────────────────────────────────────────────────────────
# 5. GRACEFUL DEGRADATION
# ─────────────────────────────────────────────────────────────────────────────
class TestGracefulDegradation:
    def test_save_returns_false_when_unavailable(self, isolate_db):
        db = _get_db()
        db._available = False
        assert db.save_session("x", "y", []) is False

    def test_list_returns_empty_when_unavailable(self, isolate_db):
        db = _get_db()
        db._available = False
        assert db.list_sessions() == []
        assert db.list_roadmaps() == []
        assert db.list_assessments() == []

    def test_get_returns_none_when_unavailable(self, isolate_db):
        db = _get_db()
        db._available = False
        assert db.get_session("any") is None

    def test_delete_returns_false_when_unavailable(self, isolate_db):
        db = _get_db()
        db._available = False
        assert db.delete_session("any") is False
        assert db.delete_roadmap(1) is False
        assert db.delete_assessment(1) is False


# ─────────────────────────────────────────────────────────────────────────────
# 6. CONCURRENCY
# ─────────────────────────────────────────────────────────────────────────────
class TestConcurrency:
    def test_concurrent_session_writes(self, isolate_db):
        """Multiple threads writing to different session IDs must not corrupt data."""
        db = _get_db()
        errors = []

        def write(i):
            try:
                db.save_session(f"concurrent-{i}", "Subject", [{"role": "user", "text": str(i)}])
            except Exception as e:
                errors.append(e)

        threads = [threading.Thread(target=write, args=(i,)) for i in range(20)]
        for t in threads:
            t.start()
        for t in threads:
            t.join()

        assert errors == [], f"Thread errors: {errors}"
        all_sessions = db.list_sessions(limit=100)
        assert len(all_sessions) == 20
