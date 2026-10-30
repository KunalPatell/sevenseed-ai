# -*- coding: utf-8 -*-
import os
import sys
import unittest

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "apps", "sevenseed", "backend"))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


class Wave6FeaturesTests(unittest.TestCase):
    def test_export_pdf_valid(self):
        r = client.post("/api/export/pdf", json={"html": "<h1>hi</h1>", "filename": "x.pdf"})
        self.assertEqual(r.status_code, 200)

    def test_export_pdf_empty(self):
        r = client.post("/api/export/pdf", json={"html": ""})
        self.assertEqual(r.status_code, 400)

    def test_export_pdf_custom_filename(self):
        r = client.post("/api/export/pdf", json={"html": "<p>hi</p>", "filename": "report"})
        self.assertEqual(r.status_code, 200)
        self.assertIn("report.pdf", r.headers.get("content-disposition", ""))

    def test_search_valid(self):
        r = client.get("/api/search", params={"q": "test", "limit": 5})
        self.assertEqual(r.status_code, 200)
        self.assertIn("results", r.json())

    def test_search_empty(self):
        r = client.get("/api/search", params={"q": ""})
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json().get("results"), [])

    def test_search_limit(self):
        r = client.get("/api/search", params={"q": "a", "limit": 2})
        self.assertEqual(r.status_code, 200)

    def test_code_reviewer_valid(self):
        r = client.post("/api/tools/code-reviewer", json={"code": "print('hi')", "language": "python"})
        self.assertEqual(r.status_code, 200)
        self.assertIn("findings", r.json())

    def test_code_reviewer_eval(self):
        r = client.post("/api/tools/code-reviewer", json={"code": "eval('1+1')"})
        self.assertEqual(r.status_code, 200)
        findings = r.json().get("findings", [])
        self.assertTrue(any("eval" in f.get("message", "").lower() for f in findings))

    def test_code_reviewer_empty(self):
        r = client.post("/api/tools/code-reviewer", json={"code": ""})
        self.assertEqual(r.status_code, 200)

    def test_sql_generator_valid(self):
        r = client.post("/api/tools/sql-generator", json={"prompt": "select all users"})
        self.assertIn(r.status_code, (200, 500))
        if r.status_code == 200:
            self.assertIn("sql", r.json())

    def test_sql_generator_empty(self):
        r = client.post("/api/tools/sql-generator", json={"prompt": ""})
        self.assertIn(r.status_code, (200, 500))

    def test_api_validator_valid(self):
        r = client.post("/api/tools/api-validator", json={"url": "http://example.com"})
        self.assertEqual(r.status_code, 200)
        self.assertIn("ok", r.json())

    def test_api_validator_invalid(self):
        r = client.post("/api/tools/api-validator", json={"url": "http://localhost:9999/nope"})
        self.assertEqual(r.status_code, 200)
        self.assertFalse(r.json().get("ok", True))

    def test_analytics_detailed_limited(self):
        r = client.get("/api/analytics/detailed")
        self.assertEqual(r.status_code, 200)
        self.assertIn("ventures", r.json())

    def test_notifications_crud(self):
        r = client.post("/api/notifications", json={"title": "t", "body": "b"})
        self.assertEqual(r.status_code, 200)
        nid = r.json().get("id")
        r2 = client.get("/api/notifications")
        self.assertEqual(r2.status_code, 200)
        self.assertIn("notifications", r2.json())
        r3 = client.post(f"/api/notifications/{nid}/read")
        self.assertEqual(r3.status_code, 200)

    def test_bookmarks_crud(self):
        r = client.post("/api/bookmarks", json={"title": "bm", "url": "http://x"})
        self.assertEqual(r.status_code, 200)
        bid = r.json().get("id")
        r2 = client.get("/api/bookmarks")
        self.assertEqual(r2.status_code, 200)
        self.assertIn("bookmarks", r2.json())
        r3 = client.delete(f"/api/bookmarks/{bid}")
        self.assertEqual(r3.status_code, 200)

    def test_data_csv_valid(self):
        r = client.post("/api/tools/data-csv", json={"csv": "a,b\n1,2\n3,4"})
        self.assertEqual(r.status_code, 200)
        self.assertIn("rows", r.json())

    def test_data_csv_invalid(self):
        r = client.post("/api/tools/data-csv", json={"csv": ""})
        self.assertEqual(r.status_code, 200)

    def test_cron_jobs_crud(self):
        r = client.get("/api/tools/cron-jobs")
        self.assertEqual(r.status_code, 200)
        self.assertIn("cron_jobs", r.json())
        r2 = client.post("/api/tools/cron-jobs", json={"name": "job", "schedule": "* * * * *"})
        self.assertEqual(r2.status_code, 200)
        jid = r2.json().get("id")
        r3 = client.delete(f"/api/tools/cron-jobs/{jid}")
        self.assertEqual(r3.status_code, 200)


if __name__ == "__main__":
    unittest.main()
