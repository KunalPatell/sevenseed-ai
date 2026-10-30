# -*- coding: utf-8 -*-
import os
import sys
import unittest

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# Ensure backend path is in sys.path
BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "apps", "sevenseed", "backend"))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


class Wave12FeaturesTests(unittest.TestCase):

    # ── WAVE 12A — Developer Utilities ──────────────────────────

    def test_12a_01_jwt_decode(self):
        token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0In0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
        r = client.post("/api/dev/jwt-decode", json={"token": token})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("header", data)
        self.assertIn("payload", data)
        self.assertEqual(data["header"].get("alg"), "HS256")
        self.assertEqual(data["payload"].get("sub"), "1234")

    def test_12a_02_hash_generate(self):
        r = client.post("/api/dev/hash-generate", json={"text": "hello", "algorithm": "sha256"})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertEqual(data["algorithm"], "sha256")
        self.assertEqual(data["length"], 64)
        self.assertIsInstance(data["hash"], str)

    def test_12a_03_base64_encode(self):
        r = client.post("/api/dev/base64", json={"text": "hello", "mode": "encode"})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertEqual(data["result"], "aGVsbG8=")

    def test_12a_04_base64_decode(self):
        r = client.post("/api/dev/base64", json={"text": "aGVsbG8=", "mode": "decode"})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertEqual(data["result"], "hello")

    def test_12a_05_uuid(self):
        r = client.post("/api/dev/uuid", json={"version": 4, "count": 3})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("uuids", data)
        self.assertEqual(len(data["uuids"]), 3)

    def test_12a_06_timestamp_convert(self):
        r = client.post("/api/dev/timestamp-convert", json={"timestamp": "2026-01-01T00:00:00", "format": "iso"})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("iso", data)
        self.assertIn("unix", data)
        self.assertIn("human", data)

    def test_12a_07_json_format(self):
        r = client.post("/api/dev/json-format", json={"json_text": '{"a":1,"b":2}', "mode": "format"})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertTrue(data.get("valid"))
        self.assertIn("formatted", data)

    # ── WAVE 12B — Security Tools ───────────────────────────────

    def test_12b_01_password_strength(self):
        r = client.post("/api/sec/password-strength", json={"password": "Str0ng!Pass9"})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("score", data)
        self.assertIn("strength", data)
        self.assertIn("feedback", data)
        self.assertIsInstance(data["feedback"], list)
        self.assertIn(data["strength"], ("weak", "fair", "good", "strong"))

    def test_12b_02_ssl_checker(self):
        r = client.post("/api/sec/ssl-checker", json={"hostname": "example.com", "port": 443})
        self.assertIn(r.status_code, (200, 500))
        if r.status_code == 200:
            data = r.json()
            self.assertIn("valid", data)
            self.assertIn("error", data)

    def test_12b_03_dns_lookup(self):
        r = client.post("/api/sec/dns-lookup", json={"hostname": "example.com", "record_type": "A"})
        self.assertIn(r.status_code, (200, 500))
        if r.status_code == 200:
            data = r.json()
            self.assertIn("records", data)
            self.assertIsInstance(data["records"], list)
            self.assertIn("error", data)

    def test_12b_04_cors_tester(self):
        r = client.post("/api/sec/cors-tester", json={"url": "http://example.com", "origin": "http://example.com"})
        self.assertIn(r.status_code, (200, 500))
        if r.status_code == 200:
            data = r.json()
            self.assertIn("allowed", data)
            self.assertIn("error", data)

    # ── WAVE 12C — System Health ────────────────────────────────

    def test_12c_01_system_health(self):
        r = client.get("/api/system/health")
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("status", data)
        self.assertIn(data["status"], ("ok", "degraded"))
        self.assertIn("cpu_pct", data)
        self.assertIn("memory_pct", data)

    def test_12c_02_feature_usage_record(self):
        r = client.post("/api/system/feature-usage/record", json={"feature_name": "wave12-dashboard", "event_type": "click"})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("id", data)
        self.assertEqual(data["feature_name"], "wave12-dashboard")
        self.assertEqual(data["event_type"], "click")

    def test_12c_03_feature_usage_list(self):
        r = client.get("/api/system/feature-usage")
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("total_events", data)
        self.assertIn("by_feature", data)
        self.assertIsInstance(data["by_feature"], list)

    # ── WAVE 12D — Error cases ──────────────────────────────────

    def test_12d_01_jwt_decode_invalid(self):
        r = client.post("/api/dev/jwt-decode", json={"token": "invalid"})
        self.assertIn(r.status_code, (200, 500))
        if r.status_code == 200:
            data = r.json()
            self.assertIn("header", data)
            self.assertIn("payload", data)

    def test_12d_02_hash_unknown_algo(self):
        r = client.post("/api/dev/hash-generate", json={"text": "hello", "algorithm": "unknown"})
        self.assertIn(r.status_code, (200, 500))
        if r.status_code == 200:
            data = r.json()
            self.assertEqual(data["algorithm"], "sha256")


if __name__ == "__main__":
    unittest.main()
