# -*- coding: utf-8 -*-
"""
Unit tests for apps/sevenforce/backend/app/db.py
Tests: founder_sessions CRUD, ideated_pitches CRUD, company_context CRUD.
"""
from __future__ import annotations
import sys, os
import pytest

BACKEND = os.path.join(os.path.dirname(__file__), "..", "..", "apps", "sevenforce", "backend")
sys.path.insert(0, BACKEND)


@pytest.fixture(autouse=True)
def isolate_db(tmp_path, monkeypatch):
    db_file = str(tmp_path / "sevenforce_test.sqlite3")
    monkeypatch.setenv("DB_PATH", db_file)
    from conftest import load_isolated_app
    load_isolated_app("sevenforce")
    from app import db
    db._available = True
    db.init()
    yield db


class TestSevenforceInit:
    def test_tables_created(self, isolate_db, tmp_path):
        import sqlite3
        db_path = str(tmp_path / "sevenforce_test.sqlite3")
        conn = sqlite3.connect(db_path)
        tables = {r[0] for r in conn.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()}
        conn.close()
        assert "founder_sessions" in tables
        assert "ideated_pitches" in tables
        assert "company_context" in tables


class TestFounderSessions:
    def test_save_and_get_session(self, isolate_db):
        db = isolate_db
        msgs = [{"role": "user", "text": "Pitch deck advice"}]
        assert db.save_session("sf-001", msgs) is True
        res = db.get_session("sf-001")
        assert res is not None
        assert res["messages"] == msgs

    def test_delete_session(self, isolate_db):
        db = isolate_db
        db.save_session("sf-del", [])
        assert db.delete_session("sf-del") is True
        assert db.get_session("sf-del") is None
