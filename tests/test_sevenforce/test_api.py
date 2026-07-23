# -*- coding: utf-8 -*-
"""
Integration tests for apps/sevenforce/backend/main.py
"""
from __future__ import annotations
import sys, os
import pytest
from unittest.mock import patch, MagicMock

BACKEND = os.path.join(os.path.dirname(__file__), "..", "..", "apps", "sevenforce", "backend")
sys.path.insert(0, BACKEND)


@pytest.fixture(scope="module")
def client(tmp_path_factory):
    tmp = tmp_path_factory.mktemp("sevenforce_api")
    db_file = str(tmp / "sevenforce_api_test.sqlite3")
    os.environ["DB_PATH"] = db_file
    for k in ("GROQ_API_KEY", "GEMINI_API_KEY", "OPENAI_API_KEY"):
        os.environ.pop(k, None)

    from conftest import load_isolated_app

    agents_mock = MagicMock()
    agents_mock.active_provider.return_value = "offline"
    agents_mock.advisor.return_value = {"reply": "Great startup concept."}
    agents_mock.advisor_demo.return_value = {"reply": "Demo answer"}

    from fastapi import APIRouter
    sys.modules["agents"] = agents_mock
    sys.modules["features"] = MagicMock(router=APIRouter())

    app = load_isolated_app("sevenforce")

    from fastapi.testclient import TestClient
    yield TestClient(app, raise_server_exceptions=False)


class TestHealth:
    def test_health_ok(self, client):
        r = client.get("/api/health")
        assert r.status_code == 200
        assert r.json()["status"] == "ok"
