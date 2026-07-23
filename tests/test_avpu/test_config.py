# -*- coding: utf-8 -*-
"""
Unit tests for apps/avpu/backend/app/config.py
Tests: provider detection with env var mocking, path resolution.
"""
from __future__ import annotations
import sys, os
import pytest

BACKEND = os.path.join(os.path.dirname(__file__), "..", "..", "apps", "avpu", "backend")
sys.path.insert(0, BACKEND)


def fresh_config(monkeypatch, **env_vars):
    """Reload config with specific env vars set."""
    for key in ("GROQ_API_KEY", "GEMINI_API_KEY", "OPENAI_API_KEY", "GROQ_MODEL", "DB_PATH"):
        monkeypatch.delenv(key, raising=False)
    for k, v in env_vars.items():
        monkeypatch.setenv(k, v)
    for mod in list(sys.modules.keys()):
        if mod.startswith("app.") or mod == "app":
            del sys.modules[mod]
    from app import config
    return config


class TestProviderDetection:
    def test_offline_when_no_keys(self, monkeypatch):
        cfg = fresh_config(monkeypatch)
        assert cfg.active_provider() == "offline"

    def test_groq_provider_when_groq_key_set(self, monkeypatch):
        cfg = fresh_config(monkeypatch, GROQ_API_KEY="gsk_test_key")
        provider = cfg.active_provider()
        assert "Groq" in provider

    def test_groq_custom_model(self, monkeypatch):
        cfg = fresh_config(monkeypatch, GROQ_API_KEY="gsk_key", GROQ_MODEL="llama-3-8b-8192")
        assert "llama-3-8b-8192" in cfg.active_provider()

    def test_gemini_provider_when_only_gemini_key(self, monkeypatch):
        cfg = fresh_config(monkeypatch, GEMINI_API_KEY="AIza_test_key")
        assert "Gemini" in cfg.active_provider()

    def test_openai_provider_when_only_openai_key(self, monkeypatch):
        cfg = fresh_config(monkeypatch, OPENAI_API_KEY="sk-test_key")
        assert "OpenAI" in cfg.active_provider()

    def test_groq_takes_priority_over_gemini(self, monkeypatch):
        cfg = fresh_config(monkeypatch, GROQ_API_KEY="gsk_key", GEMINI_API_KEY="AIza_key")
        assert "Groq" in cfg.active_provider()

    def test_empty_key_treated_as_offline(self, monkeypatch):
        """Whitespace-only keys must not trigger a provider."""
        cfg = fresh_config(monkeypatch, GROQ_API_KEY="   ")
        assert cfg.active_provider() == "offline"


class TestConfigPaths:
    def test_db_path_defaults_to_backend_dir(self, monkeypatch):
        # Only valid when DB_PATH env var is not set externally
        cfg = fresh_config(monkeypatch)
        # fresh_config does not set DB_PATH, so config should use default
        assert "avpu" in cfg.DB_PATH.lower() or "backend" in cfg.DB_PATH.lower() or \
               cfg.DB_PATH.endswith(".sqlite3")

    def test_db_path_overridable_via_env(self, monkeypatch):
        cfg = fresh_config(monkeypatch, DB_PATH="/tmp/custom_test.sqlite3")
        assert cfg.DB_PATH == "/tmp/custom_test.sqlite3"

    def test_allowed_origins_includes_localhost(self, monkeypatch):
        cfg = fresh_config(monkeypatch)
        origins = cfg.ALLOWED_ORIGINS
        assert any("localhost" in o for o in origins)
