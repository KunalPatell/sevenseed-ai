# -*- coding: utf-8 -*-
import os
import sys
import json
import base64
import unittest

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# Ensure backend path is in sys.path
BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "apps", "sevenseed", "backend"))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

PE_B64 = base64.b64encode(b"MZ\x90\x00" + b"\x00" * 200).decode("ascii")
TEXT_B64 = base64.b64encode(b"HelloWorld this is a sample text blob for reverse engineering").decode("ascii")


class Wave11FeaturesTests(unittest.TestCase):

    # ── WAVE 11A — ATS Score + Job Matching ──────────────────────────

    def test_11a_01_ats_score(self):
        r = client.post("/api/ats/score", json={
            "student_id": "s11a",
            "resume_text": "John Doe, email john@example.com, phone 9999999999, linkedin.com/in/johndoe, worked at Acme Corp as python developer for 4 years, bachelor of technology in computer science, skills: python, sql, aws, docker",
            "job_description": "python developer sql aws experience docker"
        })
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("id", data)
        self.assertIn("ats_score", data)
        self.assertIn("keyword_match_pct", data)
        self.assertIn("section_scores", data)

    def test_11a_02_ats_get(self):
        r = client.post("/api/ats/score", json={
            "student_id": "s11b",
            "resume_text": "Jane Smith, email jane@example.com, phone 8888888888, linkedin.com/in/janesmith, worked as senior engineer 5 years, master of science, skills: python, java, sql",
            "job_description": "python java engineer"
        })
        self.assertEqual(r.status_code, 200)
        rid = r.json().get("id")
        r2 = client.get(f"/api/ats/score/{rid}")
        self.assertEqual(r2.status_code, 200)
        self.assertIn("ats_score", r2.json())

    def test_11a_03_ats_job_match(self):
        r = client.post("/api/ats/score", json={
            "student_id": "s11c",
            "resume_text": "Bob Lee, email bob@example.com, worked as python developer 3 years, bachelor degree, skills: python, sql, aws",
            "job_description": "python aws cloud developer"
        })
        self.assertEqual(r.status_code, 200)
        rid = r.json().get("id")
        r2 = client.post("/api/ats/job-match", json={
            "resume_id": rid,
            "job_title": "Python Developer",
            "company": "TechCo",
            "job_description": "python aws cloud developer docker kubernetes"
        })
        self.assertEqual(r2.status_code, 200)
        data = r2.json()
        self.assertIn("match_pct", data)
        self.assertIn("missing_keywords", data)

    def test_11a_04_ats_get_not_found(self):
        r = client.get("/api/ats/score/99999999")
        self.assertEqual(r.status_code, 404)

    # ── WAVE 11B — BOQ + Drawing Takeoff ─────────────────────────────

    def test_11b_01_boq_upload(self):
        r = client.post("/api/boq/upload", json={
            "project_name": "Wave11 Office Block",
            "file_name": "boq_office.pdf",
            "file_type": "pdf",
            "line_items": [
                {"item_name": "Concrete", "quantity": 10, "rate": 100, "unit": "cum", "category": "material"},
                {"item_name": "Labor", "quantity": 40, "rate": 500, "unit": "hr", "category": "labor"},
            ]
        })
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("id", data)
        self.assertIn("total_hours", data)
        self.assertIn("total_cost", data)

    def test_11b_02_boq_reprice(self):
        r = client.post("/api/boq/upload", json={
            "project_name": "Reprice Project",
            "file_name": "boq_reprice.pdf",
            "line_items": [
                {"item_name": "Steel", "quantity": 5, "rate": 2000, "unit": "ton", "category": "material"},
            ]
        })
        self.assertEqual(r.status_code, 200)
        boq_id = r.json().get("id")
        r2 = client.post("/api/boq/reprice", json={"boq_id": boq_id, "region": "West", "state": "MH", "sor_year": "2025"})
        self.assertEqual(r2.status_code, 200)
        data = r2.json()
        self.assertIn("total_revised_cost", data)
        self.assertIn("state_multiplier", data)

    def test_11b_03_boq_get(self):
        r = client.post("/api/boq/upload", json={
            "project_name": "Get BOQ Project",
            "file_name": "boq_get.pdf",
            "line_items": [
                {"item_name": "Paint", "quantity": 20, "rate": 300, "unit": "liter", "category": "material"},
            ]
        })
        self.assertEqual(r.status_code, 200)
        boq_id = r.json().get("id")
        r2 = client.get(f"/api/boq/{boq_id}")
        self.assertEqual(r2.status_code, 200)
        data = r2.json()
        self.assertIn("project_name", data)
        self.assertIn("line_items", data)

    def test_11b_04_drawing_takeoff(self):
        r = client.post("/api/drawing/takeoff", json={
            "project_name": "Drawing Takeoff Proj",
            "file_name": "drawing.dwg",
            "drawing_type": "structural",
        })
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("quantities", data)
        self.assertIn("areas", data)
        self.assertIn("counts", data)
        self.assertIn("total_measurements", data)

    def test_11b_05_drawing_get(self):
        r = client.post("/api/drawing/takeoff", json={
            "project_name": "Get Drawing Proj",
            "file_name": "drawing_get.dwg",
        })
        self.assertEqual(r.status_code, 200)
        takeoff_id = r.json().get("id")
        r2 = client.get(f"/api/drawing/{takeoff_id}")
        self.assertEqual(r2.status_code, 200)
        self.assertIn("project_name", r2.json())

    def test_11b_06_boq_reprice_not_found(self):
        r = client.post("/api/boq/reprice", json={"boq_id": 99999999, "state": "MH"})
        self.assertEqual(r.status_code, 404)

    def test_11b_07_boq_get_not_found(self):
        r = client.get("/api/boq/99999999")
        self.assertEqual(r.status_code, 404)

    def test_11b_08_drawing_get_not_found(self):
        r = client.get("/api/drawing/99999999")
        self.assertEqual(r.status_code, 404)

    # ── WAVE 11C — Donations + FIR+BNS ───────────────────────────────

    def test_11c_01_donation_add(self):
        r = client.post("/api/donations/add", json={
            "donor_email": "donor11@example.com",
            "donation_type": "cash",
            "amount": 1000.0,
            "category": "education",
            "item_description": "",
            "tax_year": "2025-26",
        })
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("id", data)
        self.assertIn("tax_savings_estimate", data)

    def test_11c_02_donation_list(self):
        r = client.get("/api/donations/list", params={"donor_email": "donor11@example.com"})
        self.assertEqual(r.status_code, 200)
        self.assertIn("donations", r.json())

    def test_11c_03_donation_summary(self):
        r = client.get("/api/donations/tax-summary", params={"donor_email": "donor11@example.com", "tax_year": "2025-26"})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("total_donated", data)
        self.assertIn("estimated_savings", data)

    def test_11c_04_fir_generate(self):
        r = client.post("/api/fir/generate", json={
            "complainant_name": "Rahul Verma",
            "complainant_contact": "9999900000",
            "incident_date": "2025-01-15",
            "incident_location": "MG Road, Ahmedabad",
            "crime_description": "Theft of mobile phone from shop",
        })
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("case_number", data)
        self.assertIn("bns_sections", data)
        self.assertIn("fir_text", data)

    def test_11c_05_bns_list(self):
        r = client.get("/api/bns-sections")
        self.assertEqual(r.status_code, 200)
        self.assertIn("sections", r.json())

    def test_11c_06_bns_lookup(self):
        r = client.post("/api/bns-sections/lookup", json={"crime_keyword": "theft"})
        self.assertEqual(r.status_code, 200)
        self.assertIn("matching_sections", r.json())

    def test_11c_07_fir_get(self):
        r = client.post("/api/fir/generate", json={
            "complainant_name": "Anita Desai",
            "complainant_contact": "8888800000",
            "incident_date": "2025-02-20",
            "incident_location": "CG Road",
            "crime_description": "Fraud case involving online payment",
        })
        self.assertEqual(r.status_code, 200)
        case_number = r.json().get("case_number")
        r2 = client.get(f"/api/fir/{case_number}")
        self.assertEqual(r2.status_code, 200)
        self.assertEqual(r2.json().get("case_number"), case_number)

    def test_11c_08_fir_get_not_found(self):
        r = client.get("/api/fir/FIR-NOTFOUND-0000")
        self.assertEqual(r.status_code, 404)

    # ── WAVE 11D — Coupons + Cashback + SelfVerify ───────────────────

    def test_11d_01_coupon_stack(self):
        r = client.post("/api/coupons/stack", json={
            "query": "laptop deals",
            "store": "Amazon",
            "base_price": 1000.0,
        })
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("final_price", data)
        self.assertIn("savings_pct", data)

    def test_11d_02_cashback_rates(self):
        r = client.get("/api/cashback/rates", params={"store": "Amazon"})
        self.assertEqual(r.status_code, 200)
        self.assertIn("cashback_pct", r.json())

    def test_11d_03_self_verify(self):
        r = client.post("/api/code/self-verify", json={
            "challenge_id": "ch11",
            "code": "x = 1 + 1\nprint(x)",
            "tests": [],
        })
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("self_review_findings", data)
        self.assertIn("final_passed", data)

    def test_11d_04_self_verify_get(self):
        r = client.post("/api/code/self-verify", json={
            "challenge_id": "ch11b",
            "code": "print('hello')",
            "tests": [],
        })
        self.assertEqual(r.status_code, 200)
        run_id = r.json().get("id")
        r2 = client.get(f"/api/code/verify/{run_id}")
        self.assertEqual(r2.status_code, 200)
        self.assertIn("final_passed", r2.json())

    def test_11d_05_coupon_test(self):
        r = client.post("/api/coupons/test", json={"coupon_code": "SAVE20", "store": "Amazon"})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("valid", data)
        self.assertIn("discount_pct", data)

    def test_11d_06_coupon_history(self):
        r = client.get("/api/coupons/history")
        self.assertEqual(r.status_code, 200)
        self.assertIn("stacks", r.json())

    def test_11d_07_coupon_delete(self):
        r = client.post("/api/coupons/stack", json={
            "query": "delete me",
            "store": "TestStore",
            "base_price": 100.0,
        })
        self.assertEqual(r.status_code, 200)
        stack_id = r.json().get("id")
        r2 = client.delete(f"/api/coupons/stack/{stack_id}")
        self.assertEqual(r2.status_code, 200)
        data = r2.json()
        self.assertIn("ok", data)
        self.assertIn("removed", data)

    def test_11d_08_self_verify_get_not_found(self):
        r = client.get("/api/code/verify/99999999")
        self.assertEqual(r.status_code, 404)

    def test_11d_09_coupon_delete_missing(self):
        r = client.delete("/api/coupons/stack/99999999")
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertTrue(data.get("ok"))
        self.assertFalse(data.get("removed"))

    # ── WAVE 11E — Clinical + Board ──────────────────────────────────

    def test_11e_01_clinical_bmr(self):
        r = client.post("/api/clinical/calculate", json={
            "tool_name": "bmr",
            "inputs": {"weight_kg": 70, "height_cm": 175, "age": 30, "gender": "male"},
        })
        self.assertEqual(r.status_code, 200)
        self.assertIn("result", r.json())
        self.assertIn("bmr", r.json()["result"])

    def test_11e_02_clinical_bsa(self):
        r = client.post("/api/clinical/calculate", json={
            "tool_name": "bsa",
            "inputs": {"weight_kg": 70, "height_cm": 175},
        })
        self.assertEqual(r.status_code, 200)
        self.assertIn("result", r.json())
        self.assertIn("bsa", r.json()["result"])

    def test_11e_03_clinical_tdee(self):
        r = client.post("/api/clinical/calculate", json={
            "tool_name": "tdee",
            "inputs": {"bmr": 1600, "activity_level": "moderate"},
        })
        self.assertEqual(r.status_code, 200)
        self.assertIn("result", r.json())
        self.assertIn("tdee", r.json()["result"])

    def test_11e_04_clinical_tools(self):
        r = client.get("/api/clinical/tools")
        self.assertEqual(r.status_code, 200)
        self.assertIn("tools", r.json())

    def test_11e_05_board_risk(self):
        r = client.post("/api/board/risk", json={
            "org_name": "Wave11 Org",
            "risk_category": "Financial",
            "risk_description": "Budget overrun risk",
            "risk_score": 7,
            "owner": "CFO",
        })
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("id", data)
        self.assertIn("risk_score", data)

    def test_11e_06_board_risks(self):
        r = client.get("/api/board/risks", params={"org_name": "Wave11 Org"})
        self.assertEqual(r.status_code, 200)
        self.assertIn("risks", r.json())

    def test_11e_07_board_minutes(self):
        r = client.post("/api/board/minutes", json={
            "org_name": "Wave11 Org",
            "meeting_date": "2025-03-01",
            "attendees": ["Alice", "Bob"],
            "actions": [{"item": "Review budget", "due": "2025-03-15"}],
            "decisions": [{"item": "Approve Q1 plan"}],
        })
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("id", data)
        self.assertIn("actions_count", data)

    def test_11e_08_board_summary(self):
        r = client.get("/api/board/risk-summary")
        self.assertEqual(r.status_code, 200)
        self.assertIn("total_risks", r.json())

    # ── WAVE 11F — Reverse Engineering ───────────────────────────────

    def test_11f_01_binary_analyze(self):
        r = client.post("/api/re/binary/analyze", json={"file_data_b64": PE_B64, "file_name": "sample.exe"})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("id", data)
        self.assertIn("file_type", data)
        self.assertIn("risk_score", data)

    def test_11f_02_triage(self):
        r = client.post("/api/re/triage", json={"file_data_b64": PE_B64})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("format", data)
        self.assertIn("entropy", data)

    def test_11f_03_strings(self):
        r = client.post("/api/re/strings", json={"file_data_b64": TEXT_B64, "min_length": 4})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("strings", data)
        self.assertIn("total_count", data)

    def test_11f_04_disassemble(self):
        r = client.post("/api/re/disassemble", json={"file_data_b64": PE_B64, "architecture": "x64"})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("id", data)
        self.assertIn("instructions", data)
        self.assertIn("functions", data)

    def test_11f_05_pe_parse(self):
        r = client.post("/api/re/pe-parse", json={"file_data_b64": PE_B64})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("pe_headers", data)
        self.assertIn("imports", data)

    def test_11f_06_deobfuscate(self):
        r = client.post("/api/re/deobfuscate", json={"file_data_b64": TEXT_B64, "technique": "xor"})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("technique_used", data)
        self.assertIn("confidence_pct", data)

    def test_11f_07_anti_analysis(self):
        r = client.post("/api/re/anti-analysis", json={"file_data_b64": PE_B64})
        self.assertEqual(r.status_code, 200)
        self.assertIn("risk_level", r.json())

    def test_11f_08_yara_scan(self):
        r = client.post("/api/re/yara-scan", json={
            "file_data_b64": PE_B64,
            "rules": [{"name": "rule-mz", "pattern": "MZ"}],
        })
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("matches", data)
        self.assertIn("score", data)

    def test_11f_09_malware_scan(self):
        r = client.post("/api/re/malware-scan", json={"file_data_b64": base64.b64encode(b"CreateFile WriteFile socket Connect").decode("ascii")})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("threat_type", data)
        self.assertIn("confidence_pct", data)

    def test_11f_10_apk_analyze(self):
        r = client.post("/api/re/apk-analyze", json={"apk_data_b64": TEXT_B64})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("package_name", data)
        self.assertIn("permissions", data)

    def test_11f_11_dotnet_decompile(self):
        r = client.post("/api/re/dotnet-decompile", json={"dotnet_data_b64": TEXT_B64})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("classes", data)
        self.assertIn("methods", data)

    def test_11f_12_protocol_analyze(self):
        r = client.post("/api/re/protocol-analyze", json={
            "capture_data_b64": base64.b64encode(b"GET /index.html HTTP/1.1\r\nHost: example.com\r\n").decode("ascii"),
            "protocol": "auto",
        })
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("packets", data)
        self.assertIn("protocols_detected", data)

    def test_11f_13_binary_diff(self):
        r = client.post("/api/re/binary-diff", json={
            "binary_a_b64": PE_B64,
            "binary_b_b64": PE_B64,
        })
        self.assertEqual(r.status_code, 200)
        self.assertIn("similarity_pct", r.json())

    def test_11f_14_symbolic_exec(self):
        r = client.post("/api/re/symbolic-exec", json={"file_data_b64": PE_B64, "entry_address": "0x1000"})
        self.assertEqual(r.status_code, 200)
        self.assertIn("paths_explored", r.json())

    def test_11f_15_format_parse(self):
        r = client.post("/api/re/format-parse", json={"file_data_b64": PE_B64, "format_schema": "pe"})
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIn("parsed_fields", data)
        self.assertIn("confidence_pct", data)

    def test_11z_invalid_json_body(self):
        r = client.post("/api/ats/score", content=b"{invalid json")
        self.assertEqual(r.status_code, 422)


if __name__ == "__main__":
    unittest.main()
