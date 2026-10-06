# -*- coding: utf-8 -*-
"""
Unit and integration tests for AVP Charitable Trust Engine (Section 80G, SROI, UN SDG, and Ledger).
"""
import os
import sys
import pytest
from fastapi.testclient import TestClient

backend_dir = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", "apps", "sevenseed", "backend"))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

import trust_engine
from main import app

client = TestClient(app)


def test_80g_deduction_digital_old_regime():
    res = trust_engine.calculate_80g_deduction(
        donation_amount=50000.0,
        agti=1500000.0,
        payment_mode="digital",
        category_key="50-1",
        tax_regime="old",
        marginal_rate=0.30
    )
    assert res["status"] == "success"
    assert res["eligible_donation"] == 50000.0
    assert res["deduction_under_80g"] == 25000.0
    # 25,000 * 0.30 = 7,500 base tax + 300 (4% cess) = 7,800
    assert res["tax_saved"] == 7800.0
    assert res["net_cost_of_giving"] == 42200.0
    assert res["form_10be_compliance"]["eligible"] is True
    assert res["form_10be_compliance"]["trust_urn"] == "AABTA1234F22XN01"
    assert "10BE-" in res["form_10be_compliance"]["certificate_serial"]


def test_80g_cash_restriction():
    # Cash donation > 2000 is disallowed
    res = trust_engine.calculate_80g_deduction(
        donation_amount=5000.0,
        agti=1000000.0,
        payment_mode="cash",
        category_key="50-1",
        tax_regime="old"
    )
    assert res["eligible_donation"] == 0.0
    assert res["deduction_under_80g"] == 0.0
    assert res["tax_saved"] == 0.0
    assert res["form_10be_compliance"]["eligible"] is False


def test_80g_new_tax_regime():
    # New tax regime disallows 80G deduction
    res = trust_engine.calculate_80g_deduction(
        donation_amount=50000.0,
        agti=1500000.0,
        payment_mode="digital",
        category_key="50-1",
        tax_regime="new"
    )
    assert res["tax_saved"] == 0.0
    assert res["net_cost_of_giving"] == 50000.0
    assert res["form_10be_compliance"]["eligible"] is False


def test_80g_qualifying_limit_cap():
    # AGTI = 100,000 -> 10% cap is 10,000
    res = trust_engine.calculate_80g_deduction(
        donation_amount=30000.0,
        agti=100000.0,
        payment_mode="digital",
        category_key="50-1",
        tax_regime="old",
        marginal_rate=0.20
    )
    assert res["eligible_donation"] == 30000.0
    assert res["deduction_under_80g"] == 5000.0  # 50% of 10,000 cap
    # 5000 * 0.20 = 1000 + 40 cess = 1040
    assert res["tax_saved"] == 1040.0


def test_impact_and_sroi_calculation():
    res = trust_engine.estimate_impact_and_sroi(
        donation_amount=25000.0,
        frequency=1,
        education_weight=40.0,
        health_weight=35.0,
        nutrition_weight=25.0
    )
    assert res["status"] == "success"
    assert res["total_annual_gift"] == 25000.0
    deliverables = res["tangible_deliverables"]
    assert deliverables["children_education_years"] > 0
    assert deliverables["diagnostic_screenings"] > 0
    assert deliverables["nutritious_meals"] > 0

    sroi = res["sroi_analytics"]
    assert sroi["blended_sroi_ratio"] >= 3.0
    assert sroi["societal_value_generated_inr"] > 25000.0
    assert len(res["un_sdg_framework"]) == 3


def test_transparent_ledger_entry():
    entry = trust_engine.generate_transparent_ledger_entry(
        donor_alias="Sunil Mehta",
        amount=10000.0,
        program_tag="Mobile Rural Healthcare"
    )
    assert entry["status"] == "confirmed"
    assert len(entry["block_hash"]) == 64
    assert entry["amount_inr"] == 10000.0
    assert entry["audit_status"] == "VERIFIED_ON_CHAIN"


def test_trust_api_endpoints():
    # 1. 80G calculation API
    r1 = client.post("/api/trust/80g-calculate", json={
        "donation_amount": 50000.0,
        "agti": 1500000.0,
        "payment_mode": "digital",
        "category_key": "50-1",
        "tax_regime": "old",
        "marginal_rate": 0.30
    })
    assert r1.status_code == 200
    assert r1.json()["deduction_under_80g"] == 25000.0
    assert r1.json()["tax_saved"] == 7800.0

    # 2. Impact & SROI API
    r2 = client.post("/api/trust/impact-sroi", json={
        "donation_amount": 25000.0,
        "frequency": 1,
        "education_weight": 40.0,
        "health_weight": 35.0,
        "nutrition_weight": 25.0
    })
    assert r2.status_code == 200
    assert r2.json()["sroi_analytics"]["blended_sroi_ratio"] > 0

    # 3. Transparent Ledger Block API
    r3 = client.post("/api/trust/ledger-block", json={
        "donor_alias": "Tech For Good Foundation",
        "amount": 50000.0,
        "program_tag": "Mid-Day Meal Support"
    })
    assert r3.status_code == 200
    assert len(r3.json()["block_hash"]) == 64
