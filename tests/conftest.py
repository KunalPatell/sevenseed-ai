# -*- coding: utf-8 -*-
"""
Shared pytest fixtures for the Sevenseed platform deep test suite.
All fixtures are offline-safe — no API keys or network calls needed.
"""
from __future__ import annotations
import os
import sys
import tempfile
import sqlite3
import pytest
from unittest.mock import MagicMock

# ── path helpers ──────────────────────────────────────────────────────────────
PLATFORM_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APPS_DIR = os.path.join(PLATFORM_ROOT, "apps")


def app_backend(app_name: str) -> str:
    """Return absolute path to an app's backend directory (or root if no backend subfolder)."""
    backend_path = os.path.normpath(os.path.join(APPS_DIR, app_name, "backend"))
    if os.path.exists(backend_path):
        return backend_path
    return os.path.normpath(os.path.join(APPS_DIR, app_name))


ALL_BACKEND_PATHS = [
    app_backend("avpu"),
    app_backend("avp-emart"),
    app_backend("breakdown-factor"),
    app_backend("decode-forest-pharmacy"),
    app_backend("avp-charitable-trust"),
    app_backend("sevenforce"),
    app_backend("sevenseed"),
    app_backend("comonk"),
    app_backend("rakshak-ai"),
]


def load_isolated_app(app_name: str):
    """Purge local app modules and load target app's FastAPI main.app cleanly."""
    target_dir = app_backend(app_name)

    # 1. Strip all backend paths from sys.path and insert target at index 0
    for b in ALL_BACKEND_PATHS:
        if b in sys.path:
            sys.path.remove(b)
    sys.path.insert(0, target_dir)

    # 2. Purge module cache of local app names ONLY — NEVER C-extensions (numpy, cv2, etc.)
    to_purge = (
        "app", "main", "features",
        "whatsapp_tutor", "avpu_data", "breakdown_data", "pharmacy_data",
        "prescription_ocr", "trust_data", "faceauth", "campaign_manager",
        "site_ocr", "safety_detector", "face_auth", "analytics", "code_executor",
        "ai_engine", "store", "pdf_util", "mock_data", "authdep"
    )
    for mod in list(sys.modules.keys()):
        if any(c in mod for c in ("numpy", "scipy", "cv2", "torch", "onnx", "insightface", "pypdf", "ultralytics")):
            continue
        if isinstance(sys.modules.get(mod), MagicMock):
            continue
        if any(mod == p or mod.startswith(p + ".") for p in to_purge):
            sys.modules.pop(mod, None)

    # 3. Import main from target backend
    import importlib
    main_module = importlib.import_module("main")
    return main_module.app


# ── in-memory / temp-file DB fixtures ─────────────────────────────────────────
@pytest.fixture
def tmp_db(tmp_path):
    """Return path to a fresh temp SQLite file (deleted after test)."""
    return str(tmp_path / "test.sqlite3")


@pytest.fixture
def in_memory_db():
    """Return an open in-memory sqlite3 connection."""
    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    yield conn
    conn.close()


# ── env var helpers ────────────────────────────────────────────────────────────
_LIVE_KEYS = ("GROQ_API_KEY", "GEMINI_API_KEY", "OPENAI_API_KEY", "SERPAPI_KEY")


@pytest.fixture(autouse=True)
def _no_live_api_keys(monkeypatch):
    """Strip real API keys from every test. Autouse, deliberately.

    apps/avp-emart/backend/.env holds a real SERPAPI_KEY, and that app's main.py
    calls load_dotenv() at import. Any test that imported it therefore pushed the
    key into os.environ for the rest of the session — and comparator.compare()
    switches from sample data to live SerpAPI calls whenever SERPAPI_KEY is set.

    So tests/test_avp_emart/test_comparator.py was quietly making paid network
    requests, but only when it happened to run after test_api.py. That is what
    the intermittent failures were: not a bug in the comparator, a live HTTP call
    whose results vary. The suite went 928-pass / 4-fail / 1-fail across three
    consecutive runs with no code change between them.

    A test suite must not depend on the network or spend money. Tests that need a
    key set their own fake one (see with_groq_key), which still works because
    monkeypatch.setenv runs after this fixture.
    """
    for key in _LIVE_KEYS:
        monkeypatch.delenv(key, raising=False)


@pytest.fixture(autouse=False)
def no_api_keys(monkeypatch):
    """Kept for tests that request it explicitly; the autouse fixture above now
    covers every test, so this is a no-op in practice."""
    for key in _LIVE_KEYS:
        monkeypatch.delenv(key, raising=False)


@pytest.fixture(autouse=False)
def with_groq_key(monkeypatch):
    monkeypatch.setenv("GROQ_API_KEY", "gsk_test_fake_key_for_unit_tests")


# ── mock LLM agent responses ──────────────────────────────────────────────────
MOCK_REPLY = {"reply": "This is a mocked AI response.", "sources": [], "traces": []}
MOCK_ROADMAP = {"reply": "Week 1: Basics\nWeek 2: Practice", "weeks": []}
MOCK_ASSESSMENT = {"score": 8, "feedback": "Good answer.", "grade": "B+"}
MOCK_PLACEMENT = {"roles": ["Data Scientist", "ML Engineer"], "match_score": 85}
MOCK_ADMISSIONS = {"programs": ["B.Tech AI", "M.Tech ML"], "recommendation": "B.Tech AI"}
MOCK_RESEARCH = {"summary": "Summarized text.", "key_points": []}
MOCK_ASSISTANT = {"reply": "Here are the best products for you."}
MOCK_REVIEW_INTEL = {"verdict": "Good buy", "pros": ["Fast delivery"], "cons": ["Pricey"]}
MOCK_RECOMMEND = {"products": [{"name": "Test Product", "price": 999}]}
MOCK_TREND = {"direction": "falling", "summary": "Prices dropping", "points": [1000, 950, 900]}
MOCK_COPILOT = {"reply": "Safety checklist generated.", "session_id": "test-session"}
MOCK_COST = {"total_cost": 500000, "breakdown": {"material": 300000, "labour": 200000}}
MOCK_SAFETY = {"checklist": ["Wear helmet", "Use harness"], "risk_level": "Medium"}
MOCK_DEFECT = {"defects": ["Crack in wall", "Leaky pipe"], "severity": "High"}
MOCK_HEALTH_ADVICE = {"advice": "Drink water, rest well.", "urgency": "Low"}
MOCK_DRUG_CHECK = {"safe": True, "interactions": []}
