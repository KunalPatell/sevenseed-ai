# -*- coding: utf-8 -*-
"""
Unit tests for apps/avpu/backend/app/ratelimit.py
Tests: per-IP limit, global limit, window reset, multiple buckets,
       X-Forwarded-For parsing, unknown client.
"""
from __future__ import annotations
import sys, os, time
import pytest
from unittest.mock import MagicMock

BACKEND = os.path.join(os.path.dirname(__file__), "..", "..", "apps", "avpu", "backend")
sys.path.insert(0, BACKEND)


def fresh_ratelimit():
    """Return a freshly imported ratelimit module (clears in-memory state)."""
    for mod in list(sys.modules.keys()):
        if "ratelimit" in mod:
            del sys.modules[mod]
    from app import ratelimit
    return ratelimit


def mock_request(ip: str = "192.168.1.1", forwarded: str | None = None):
    req = MagicMock()
    req.client.host = ip
    if forwarded:
        req.headers.get = lambda k, d="": forwarded if k == "x-forwarded-for" else d
    else:
        req.headers.get = lambda k, d="": d
    return req


# ─────────────────────────────────────────────────────────────────────────────
# PER-IP RATE LIMIT
# ─────────────────────────────────────────────────────────────────────────────
class TestPerIPLimit:
    def test_allows_under_limit(self):
        rl = fresh_ratelimit()
        req = mock_request("10.0.0.1")
        from fastapi import HTTPException
        # 3 calls under limit=5 should not raise
        for _ in range(3):
            rl.check_rate_limit(req, bucket="test", limit=5, window_s=60)

    def test_blocks_at_limit(self):
        rl = fresh_ratelimit()
        req = mock_request("10.0.0.2")
        from fastapi import HTTPException
        for _ in range(5):
            rl.check_rate_limit(req, bucket="ip_block", limit=5, window_s=60)
        with pytest.raises(HTTPException) as exc:
            rl.check_rate_limit(req, bucket="ip_block", limit=5, window_s=60)
        assert exc.value.status_code == 429

    def test_different_ips_independent(self):
        rl = fresh_ratelimit()
        from fastapi import HTTPException
        req1 = mock_request("10.0.1.1")
        req2 = mock_request("10.0.1.2")
        # Exhaust limit for req1
        for _ in range(5):
            rl.check_rate_limit(req1, bucket="multi_ip", limit=5, window_s=60)
        # req2 should still be allowed
        rl.check_rate_limit(req2, bucket="multi_ip", limit=5, window_s=60)

    def test_multiple_buckets_independent(self):
        rl = fresh_ratelimit()
        from fastapi import HTTPException
        req = mock_request("10.0.2.1")
        # Exhaust bucket A
        for _ in range(5):
            rl.check_rate_limit(req, bucket="bucket_a", limit=5, window_s=60)
        # Bucket B for same IP should still work
        rl.check_rate_limit(req, bucket="bucket_b", limit=5, window_s=60)


# ─────────────────────────────────────────────────────────────────────────────
# GLOBAL LIMIT
# ─────────────────────────────────────────────────────────────────────────────
class TestGlobalLimit:
    def test_global_limit_blocks_after_threshold(self):
        rl = fresh_ratelimit()
        from fastapi import HTTPException
        # Use different IPs (per-IP limit is 100, global is 3)
        for i in range(3):
            req = mock_request(f"10.10.{i}.1")
            rl.check_rate_limit(req, bucket="global_test", limit=100, window_s=60, global_limit=3)
        # 4th request from a different IP should hit global limit
        req_new = mock_request("10.10.99.1")
        with pytest.raises(HTTPException) as exc:
            rl.check_rate_limit(req_new, bucket="global_test", limit=100, window_s=60, global_limit=3)
        assert exc.value.status_code == 429
        assert "high traffic" in exc.value.detail.lower()

    def test_no_global_limit_when_none(self):
        rl = fresh_ratelimit()
        # Should not raise even with many requests when global_limit=None
        for i in range(10):
            req = mock_request(f"172.16.{i}.1")
            rl.check_rate_limit(req, bucket="no_global", limit=100, window_s=60, global_limit=None)


# ─────────────────────────────────────────────────────────────────────────────
# X-FORWARDED-FOR
# ─────────────────────────────────────────────────────────────────────────────
class TestXForwardedFor:
    def test_uses_first_forwarded_ip(self):
        rl = fresh_ratelimit()
        from fastapi import HTTPException
        # Simulate proxy with multiple hops
        req = mock_request("10.0.0.100", forwarded="203.0.113.5, 10.0.0.100, 10.0.0.1")
        # Hit limit for forwarded IP
        for _ in range(5):
            rl.check_rate_limit(req, bucket="fwd_test", limit=5, window_s=60)
        # Same forwarded IP should be blocked
        with pytest.raises(HTTPException):
            rl.check_rate_limit(req, bucket="fwd_test", limit=5, window_s=60)

    def test_unknown_client_handled(self):
        rl = fresh_ratelimit()
        req = MagicMock()
        req.client = None
        req.headers.get = lambda k, d="": d
        # Should use "unknown" as IP, not crash
        rl.check_rate_limit(req, bucket="no_client", limit=5, window_s=60)


# ─────────────────────────────────────────────────────────────────────────────
# WINDOW RESET (fast test with tiny window)
# ─────────────────────────────────────────────────────────────────────────────
class TestWindowReset:
    def test_window_resets_after_expiry(self, monkeypatch):
        rl = fresh_ratelimit()
        from fastapi import HTTPException

        fake_time = [0.0]

        def mock_time():
            return fake_time[0]

        monkeypatch.setattr("app.ratelimit.time.time", mock_time)

        req = mock_request("10.5.5.5")
        # Send 3 requests at t=0
        for _ in range(3):
            rl.check_rate_limit(req, bucket="window_reset", limit=3, window_s=10)

        # Advance time past the window
        fake_time[0] = 11.0
        # Should be allowed again
        rl.check_rate_limit(req, bucket="window_reset", limit=3, window_s=10)
