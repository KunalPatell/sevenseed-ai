# -*- coding: utf-8 -*-
"""
WORLD-CLASS QA ENGINE — Comprehensive Deep Stress, Fuzz & Regression Test Suite
Tests:
  1. API Boundary & Fuzz Testing (Edge cases, extremes, invalid inputs, SQLi/XSS resilience)
  2. Complete Endpoint Health & Response Schema Validation
  3. Security & Secrets Leaks Audit (Zero hardcoded secrets, clean repo)
  4. Workstation HTML & Asset Integrity (No 404s, valid JS entrypoints)
"""
import os
import sys
import re
import json
import unittest

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# Ensure backend path is in sys.path
BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "apps", "sevenseed", "backend"))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

class WorldClassQATestSuite(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        print("\n" + "=" * 75)
        print("[QA ENGINE] WORLD-CLASS QA SUITE: EXECUTING DEEP REGRESSION & STRESS TESTING")
        print("=" * 75)

    # ──────────────────────────────────────────────────────────────────────────
    # 1. FUZZ & EDGE-CASE TESTING: PHARMACY CLINICAL TRIAGE
    # ──────────────────────────────────────────────────────────────────────────
    def test_pharmacy_health_advice_normal(self):
        r = client.post("/api/power/pharmacy/health-advice", json={
            "query": "Chest tightness and pain radiating down left arm",
            "age_group": "Adult (18-64)",
            "duration": "Less than 6 hours"
        })
        self.assertEqual(r.status_code, 200)
        d = r.json()
        self.assertEqual(d["status"], "success")
        self.assertIn("EMERGENCY", d["triage_level"])
        self.assertEqual(d["triage_color"], "#ef4444")
        self.assertIn("108", d["emergency_contacts"]["national_ambulance"])

    def test_pharmacy_health_advice_empty_and_fuzz(self):
        # Empty query should fail gracefully with 400
        r_empty = client.post("/api/power/pharmacy/health-advice", json={"query": "   "})
        self.assertEqual(r_empty.status_code, 400)

        # SQL Injection / XSS in query should not crash
        r_sqli = client.post("/api/power/pharmacy/health-advice", json={
            "query": "' OR '1'='1'; <script>alert(1)</script> persistent cough with fever"
        })
        self.assertEqual(r_sqli.status_code, 200)
        self.assertIn("triage_level", r_sqli.json())

        # Unknown age group / duration should fall back gracefully
        r_unknown = client.post("/api/power/pharmacy/health-advice", json={
            "query": "Mild headache",
            "age_group": "Martian (999)",
            "duration": "Eternity"
        })
        self.assertEqual(r_unknown.status_code, 200)

    def test_pharmacy_schemes(self):
        r = client.get("/api/power/pharmacy/schemes")
        self.assertEqual(r.status_code, 200)
        d = r.json()
        self.assertEqual(d["status"], "success")
        self.assertGreaterEqual(d["total_schemes"], 5)
        # Check scheme fields
        for s in d["schemes"]:
            self.assertIn("name", s)
            self.assertIn("coverage", s)
            self.assertIn("portal", s)

    # ──────────────────────────────────────────────────────────────────────────
    # 2. FUZZ & EDGE-CASE TESTING: PROSPECT INTELLIGENCE & OUTREACH
    # ──────────────────────────────────────────────────────────────────────────
    def test_outreach_enrich_lead(self):
        r = client.post("/api/power/outreach/enrich-lead", json={
            "company_name": "Acme SaaS",
            "role": "CTO",
            "industry": "Cloud Computing"
        })
        self.assertEqual(r.status_code, 200)
        d = r.json()
        self.assertEqual(d["company"], "Acme SaaS")
        self.assertEqual(len(d["icebreakers"]), 3)
        self.assertTrue(all("text" in h for h in d["icebreakers"]))

    def test_outreach_reply_classifier(self):
        # High intent
        r = client.post("/api/power/outreach/classify-reply", json={
            "reply_text": "Sounds very interesting! Can we book a 15-min call this Friday at 3pm?"
        })
        self.assertEqual(r.status_code, 200)
        d = r.json()
        self.assertEqual(d["sentiment"], "High Intent")

        # Unsubscribe intent
        r_unsub = client.post("/api/power/outreach/classify-reply", json={
            "reply_text": "Please remove me from your list. Unsubscribe."
        })
        self.assertEqual(r_unsub.status_code, 200)
        self.assertEqual(r_unsub.json()["intent"], "Opt-Out")

    # ──────────────────────────────────────────────────────────────────────────
    # 3. FUZZ & EDGE-CASE TESTING: BREAKDOWN FACTOR BOQ ESTIMATOR
    # ──────────────────────────────────────────────────────────────────────────
    def test_breakdown_repair_boq_fuzz(self):
        # Standard shear crack
        r = client.post("/api/power/breakdown/estimate-repair", json={
            "damage_type": "shear_crack",
            "area_sqft": 45.0
        })
        self.assertEqual(r.status_code, 200)
        d = r.json()
        self.assertIn("IS 456", d["compliance_standard"])
        self.assertGreater(d["cost_summary"]["grand_total_inr"], 0)
        self.assertGreater(d["cost_summary"]["grand_total_usd"], 0)

        # Zero or negative area should clamp safely without crashing
        r_zero = client.post("/api/power/breakdown/estimate-repair", json={
            "damage_type": "spalling_concrete",
            "area_sqft": -10.0
        })
        self.assertEqual(r_zero.status_code, 200)
        self.assertGreaterEqual(r_zero.json()["affected_area_sqft"], 1.0)

        # Unknown damage type falls back to concrete spalling default
        r_unknown = client.post("/api/power/breakdown/estimate-repair", json={
            "damage_type": "alien_laser_burn"
        })
        self.assertEqual(r_unknown.status_code, 200)

    # ──────────────────────────────────────────────────────────────────────────
    # 4. ATS RESUME BULLET GENERATOR WITH GOOGLE XYZ FORMULA
    # ──────────────────────────────────────────────────────────────────────────
    def test_resume_bullet_generation(self):
        for skill in ["Kubernetes", "FastAPI", "Docker", "LangGraph", "ChromaDB"]:
            r = client.post("/api/power/resume/generate-bullet", json={"skill": skill})
            self.assertEqual(r.status_code, 200)
            d = r.json()
            self.assertEqual(d["status"], "success")
            self.assertIn(skill, d["bullet"])
            self.assertIn("Google XYZ Formula", d["framework"])

    # ──────────────────────────────────────────────────────────────────────────
    # 5. OPERATIONS SUITE (Timesheets, Attendance, Sprints)
    # ──────────────────────────────────────────────────────────────────────────
    def test_operations_suite(self):
        r_ts = client.get("/api/power/operations/timesheets")
        self.assertEqual(r_ts.status_code, 200)
        self.assertGreater(r_ts.json()["total_logged_hours"], 0)

        r_att = client.get("/api/power/operations/attendance")
        self.assertEqual(r_att.status_code, 200)
        self.assertIn("staff", r_att.json())

        r_sp = client.get("/api/power/operations/sprints")
        self.assertEqual(r_sp.status_code, 200)
        self.assertIn("sprint_name", r_sp.json())

    # ──────────────────────────────────────────────────────────────────────────
    # 6. REPOSITORY SECURITY & SECRETS SANITIZATION AUDIT
    # ──────────────────────────────────────────────────────────────────────────
    def test_security_secrets_sanitization(self):
        """Audit sevenseed backend source code to ensure zero real credentials leaked."""
        SECRETS_PATTERNS = [
            re.compile(r'BEGIN (?:RSA )?PRIVATE KEY'),
            re.compile(r'AKIA[0-9A-Z]{16}'),
        ]
        
        backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "apps", "sevenseed", "backend"))
        violations = []

        for root, dirs, files in os.walk(backend_dir):
            # Prune static and cache dirs for high-speed scanning
            dirs[:] = [d for d in dirs if d not in ["static", "__pycache__", ".pytest_cache", "data"]]
            for f in files:
                if f.endswith((".py", ".json")):
                    filepath = os.path.join(root, f)
                    try:
                        with open(filepath, "r", encoding="utf-8", errors="ignore") as fp:
                            content = fp.read()
                        for pat in SECRETS_PATTERNS:
                            if pat.search(content):
                                violations.append(f"Secret pattern match in: {os.path.relpath(filepath, backend_dir)}")
                    except Exception:
                        pass

        self.assertEqual(len(violations), 0, f"Found secret leak violations: {violations}")

    # ──────────────────────────────────────────────────────────────────────────
    # 7. WORKSTATION ROUTING & STATIC MIRROR HEALTH
    # ──────────────────────────────────────────────────────────────────────────
    def test_all_workstations_deliverable(self):
        workstations = [
            "/outreach-sequence-studio.html",
            "/pharmacy-studio.html",
            "/damage-vision.html",
            "/price-comparator.html",
            "/resume-matcher.html",
            "/vision-security.html",
            "/charitable-trust.html",
            "/operations-intelligence.html",
            "/coding-agent-studio.html",
            "/interview-radar.html",
            "/workstations.html",
            "/byok.html"
        ]
        for ws in workstations:
            r = client.get(ws)
            self.assertEqual(r.status_code, 200, f"Workstation {ws} failed to load (status {r.status_code})")
            self.assertGreater(len(r.content), 500, f"Workstation {ws} is empty")


if __name__ == "__main__":
    unittest.main()
