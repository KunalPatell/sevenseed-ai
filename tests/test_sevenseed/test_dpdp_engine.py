# -*- coding: utf-8 -*-
"""
Tests for Rakshak AI DPDP Engine (DPDP Act 2023 compliance audit & PII sanitizer).
"""
import os
import sys
import pytest
from fastapi.testclient import TestClient

backend_dir = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", "apps", "sevenseed", "backend"))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

import dpdp_engine
from main import app

client = TestClient(app)


def test_dpdp_audit_compliant():
    answers = {
        "notice_clear": True,
        "consent_granular": True,
        "consent_withdrawal": True,
        "dsr_portal": True,
        "security_safeguards": True,
        "breach_runbook": True,
        "children_safeguards": True,
        "data_retention_policy": True,
        "dpo_appointed": True,
        "cross_border_compliance": True,
        "user_volume": "growth"
    }
    res = dpdp_engine.audit_dpdp_compliance(answers)
    assert res["status"] == "success"
    assert res["compliance_score_pct"] == 100
    assert res["compliance_posture"] == "COMPLIANT"
    assert len(res["critical_gaps"]) == 0
    assert len(res["penalties_exposed"]) == 0
    assert "DPDP-2025-" in res["audit_certificate_id"]


def test_dpdp_audit_critical_non_compliance():
    answers = {
        "notice_clear": False,
        "consent_granular": False,
        "consent_withdrawal": False,
        "dsr_portal": False,
        "security_safeguards": False,
        "breach_runbook": False,
        "children_safeguards": False,
        "data_retention_policy": False,
        "dpo_appointed": False,
        "cross_border_compliance": False,
        "user_volume": "enterprise"
    }
    res = dpdp_engine.audit_dpdp_compliance(answers)
    assert res["compliance_score_pct"] == 0
    assert res["compliance_posture"] == "CRITICAL NON-COMPLIANCE"
    assert len(res["critical_gaps"]) >= 8
    # Should flag 250 Cr breach prevention failure penalty
    penalties = [p["max_penalty_display"] for p in res["penalties_exposed"]]
    assert "₹250 Crores" in penalties


def test_dpdp_pii_prompt_sanitizer():
    raw_prompt = "User account query for Amit Kumar (Aadhaar: 4321 8765 1234, PAN: ABCDE1234F). Contact at amit@company.in or +91 9876543210."
    res = dpdp_engine.sanitize_pii_for_llm_prompt(raw_prompt)
    assert res["status"] == "success"
    assert res["redacted_count"] >= 4
    sanitized = res["sanitized_prompt"]
    assert "4321 8765 1234" not in sanitized
    assert "ABCDE1234F" not in sanitized
    assert "amit@company.in" not in sanitized
    assert "9876543210" not in sanitized
    assert "[AADHAAR_TOKEN_1]" in sanitized
    assert "[PAN_TOKEN_" in sanitized


def test_dpdp_api_endpoints():
    # 1. Audit endpoint
    r1 = client.post("/api/rakshak/dpdp-audit", json={
        "notice_clear": True,
        "consent_granular": True,
        "consent_withdrawal": True,
        "security_safeguards": True,
        "user_volume": "startup"
    })
    assert r1.status_code == 200
    assert r1.json()["compliance_score_pct"] >= 50

    # 2. PII Redaction endpoint
    r2 = client.post("/api/rakshak/pii-redact", json={
        "raw_prompt": "Confidential patient file PAN: BKZPK9988D phone: 9811223344"
    })
    assert r2.status_code == 200
    assert r2.json()["redacted_count"] >= 2
    assert "BKZPK9988D" not in r2.json()["sanitized_prompt"]
