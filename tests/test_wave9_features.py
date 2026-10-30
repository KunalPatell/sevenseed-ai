# -*- coding: utf-8 -*-
import os
import sys
import unittest
import json

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "apps", "sevenseed", "backend"))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


class Wave9FeaturesTests(unittest.TestCase):
    def test_course_generate(self):
        r = client.post("/api/course/generate", json={"youtube_url": "https://youtube.com/watch?v=test", "duration_days": 7, "hours_per_day": 2.0})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("id", data)
        self.assertIn("title", data)
        self.assertIn("modules", data)
        self.assertIn("total_hours", data)

    def test_course_get(self):
        r_gen = client.post("/api/course/generate", json={"youtube_url": "https://youtube.com/watch?v=test2"})
        self.assertEqual(r_gen.status_code, 200)
        course_id = r_gen.json().get("id")
        r = client.get(f"/api/course/{course_id}")
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("course", data)
        self.assertIn("modules", data)

    def test_course_quiz(self):
        r_gen = client.post("/api/course/generate", json={"youtube_url": "https://youtube.com/watch?v=test3"})
        course_id = r_gen.json().get("id")
        r = client.post(f"/api/course/{course_id}/quiz", json={"lesson_index": 0, "answers": [True, False, True]})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("score", data)
        self.assertIn("passed", data)

    def test_challenge_run(self):
        r = client.post("/api/challenge/run", json={"code": "print('hello')", "tests": [{"input": "1", "expected": "1"}, {"input": "2", "expected": "2"}], "language": "python"})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("passed", data)
        self.assertIn("total", data)
        self.assertIn("results", data)

    def test_challenge_certify(self):
        r = client.post("/api/challenge/certify", json={"student_id": "student123", "course_slug": "python-basics"})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("cert_id", data)
        self.assertIn("verify_url", data)

    def test_challenge_verify(self):
        r_cert = client.post("/api/challenge/certify", json={"student_id": "student456", "course_slug": "js-basics"})
        self.assertEqual(r_cert.status_code, 200)
        cert_id = r_cert.json().get("cert_id")
        r = client.get(f"/api/challenge/verify/{cert_id}")
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("valid", data)

    def test_srs_review(self):
        r = client.post("/api/srs/review", json={"card_id": 1, "grade": 4})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("next_interval", data)
        self.assertIn("ease_factor", data)
        self.assertIn("due_date", data)

    def test_srs_due(self):
        r = client.get("/api/srs/due")
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("cards", data)

    def test_srs_stats(self):
        r = client.get("/api/srs/stats")
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("retention_pct", data)
        self.assertIn("streak", data)

    def test_ux_law_record(self):
        r = client.post("/api/ux-law/record", json={"law_name": "FittsLaw", "trial_index": 1, "distance": 100.0, "width": 10.0, "movement_time": 500.0})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("theoretical_mt", data)
        self.assertIn("ratio", data)

    def test_ux_laws(self):
        r = client.get("/api/ux-laws")
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("laws", data)

    def test_growth_simulate(self):
        r = client.post("/api/growth/simulate", json={"name": "TestSim", "users_start": 1000, "churn_rate": 0.05, "k_viral": 0.1, "acquisition_budget": 500, "months": 12})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("projection", data)
        self.assertIn("final_users", data)

    def test_growth_flywheels(self):
        r = client.get("/api/growth/flywheels")
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("flywheels", data)

    def test_price_aggregate_search(self):
        r = client.post("/api/price-aggregate/search", json={"query": "laptop", "stores": ["store1", "store2"]})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("results", data)
        self.assertIn("store_count", data)

    def test_price_aggregate_coupon(self):
        r = client.post("/api/price-aggregate/coupon", json={"coupon_code": "SAVE10", "store": "store1"})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("valid", data)
        self.assertIn("discount_pct", data)

    def test_teardowns_list(self):
        r = client.get("/api/teardowns")
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("teardowns", data)

    def test_teardowns_create(self):
        r = client.post("/api/teardowns", json={"title": "Test Teardown", "category": "growth", "original_copy": "old", "rewritten_copy": "new", "formula": "PAS", "read_time": 5})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("id", data)

    def test_sprint_start(self):
        r = client.post("/api/sprint/start", json={"name": "My Sprint", "start_date": "2026-01-01", "total_days": 100})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("id", data)
        self.assertIn("bitmask", data)
        self.assertIn("completed_days", data)

    def test_sprint_complete_day(self):
        r_start = client.post("/api/sprint/start", json={"name": "Sprint2", "total_days": 100})
        self.assertEqual(r_start.status_code, 200)
        sprint_id = r_start.json().get("id")
        r = client.post(f"/api/sprint/{sprint_id}/day/1/complete")
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("completed", data)
        self.assertIn("progress_pct", data)

    def test_sprint_progress(self):
        r_start = client.post("/api/sprint/start", json={"name": "Sprint3", "total_days": 100})
        self.assertEqual(r_start.status_code, 200)
        sprint_id = r_start.json().get("id")
        r = client.get(f"/api/sprint/{sprint_id}/progress")
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("bitmask", data)
        self.assertIn("completed_days", data)
        self.assertIn("progress_pct", data)


if __name__ == "__main__":
    unittest.main()
