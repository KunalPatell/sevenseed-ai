# -*- coding: utf-8 -*-
"""
Tests for Education Engine & Growth Engine.
Validates Kahn's DAG sort, SuperMemo SM-2, assertion verification,
SHA-256 certificates, copy fluff scoring, and viral flywheel mathematics.
"""
import pytest
import os
import sys

# Ensure backend modules are on path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../apps/sevenseed/backend")))

import education_engine
import growth_engine


def test_topological_dag_resolution():
    # Fresh learner with 0 completions
    res = education_engine.resolve_topological_dag(completed_nodes=[])
    assert res["status"] == "success"
    ready_ids = [n["id"] for n in res["ready_to_learn"]]
    assert "python-basics" in ready_ids
    assert "data-structures" not in ready_ids  # Requires python-basics

    # Learner completes python-basics
    res2 = education_engine.resolve_topological_dag(completed_nodes=["python-basics"])
    ready_ids2 = [n["id"] for n in res2["ready_to_learn"]]
    assert "data-structures" in ready_ids2
    assert "llm-prompting" in ready_ids2
    assert "langchain" not in ready_ids2  # Still locked

    # Target node closure: only ancestors of rag-systems
    res3 = education_engine.resolve_topological_dag(completed_nodes=[], target_node="rag-systems")
    assert res3["target_node"] == "rag-systems"
    assert res3["total_nodes"] <= len(education_engine.TOPIC_CATALOG)


def test_sm2_interval_and_ease_factor():
    # Perfect recall (grade 5) from starting EF 2.5
    res = education_engine.compute_sm2_interval(quality=5, repetition_count=0, ease_factor=2.5, previous_interval=0)
    assert res["status"] == "success"
    assert res["repetition_count"] == 1
    assert res["interval_days"] == 1
    assert res["ease_factor"] >= 2.5
    assert not res["is_lapse"]

    # Subsequent review (grade 4) at repetition 1
    res2 = education_engine.compute_sm2_interval(quality=4, repetition_count=1, ease_factor=res["ease_factor"], previous_interval=1)
    assert res2["repetition_count"] == 2
    assert res2["interval_days"] == 6

    # Subsequent review (grade 5) at repetition 2
    res3 = education_engine.compute_sm2_interval(quality=5, repetition_count=2, ease_factor=res2["ease_factor"], previous_interval=6)
    assert res3["repetition_count"] == 3
    assert res3["interval_days"] >= 14

    # Lapse (grade 1) resets repetition count and forces 1-day interval
    res_lapse = education_engine.compute_sm2_interval(quality=1, repetition_count=5, ease_factor=2.4, previous_interval=30)
    assert res_lapse["is_lapse"]
    assert res_lapse["repetition_count"] == 0
    assert res_lapse["interval_days"] == 1

    # EF floor at 1.3
    res_floor = education_engine.compute_sm2_interval(quality=0, repetition_count=1, ease_factor=1.3, previous_interval=1)
    assert res_floor["ease_factor"] >= 1.3


def test_code_assertion_runner():
    # Valid submission
    good_code = "def calculate_sum(a, b):\n    return a + b\n"
    res = education_engine.verify_code_assertions(good_code)
    assert res["status"] == "success"
    assert res["all_passed"]
    assert res["score_percentage"] == 100.0

    # Insecure submission with eval()
    bad_code = "def insecure(x):\n    eval('2 + 2')\n    return x\n"
    res_bad = education_engine.verify_code_assertions(bad_code)
    assert not res_bad["all_passed"]


def test_verifiable_certificate():
    cert = education_engine.issue_verifiable_certificate(
        student_name="Aarav Sharma",
        course_slug="langgraph-agents",
        student_id="STU-9901"
    )
    assert cert["status"] == "success"
    assert cert["certificate_id"].startswith("AVPU-")
    assert len(cert["certificate_id"]) == 21  # 'AVPU-' + 16 hex chars
    assert "sha256_fingerprint" in cert
    assert "Aarav Sharma" in cert["student_name"]


def test_dynamic_curriculum_sprint():
    sprint = education_engine.dynamic_curriculum_sprint("Autonomous Agents", daily_hours=2.0, total_weeks=4)
    assert sprint["status"] == "success"
    assert sprint["total_curriculum_hours"] == 2.0 * 7 * 4
    assert len(sprint["weekly_schedule"]) == 4
    assert sprint["weekly_schedule"][0]["daily_target_minutes"] == 120


def test_copy_fluff_analyzer():
    # Fluffy marketing copy
    fluff_text = "Our revolutionary, state-of-the-art, game-changing platform provides a seamless, cutting-edge, disruptive next-gen experience."
    res = growth_engine.analyze_copy_and_fluff(fluff_text)
    assert res["status"] == "success"
    assert res["fluff_percentage"] >= 70.0
    assert len(res["buzzwords_detected"]) >= 4

    # High-converting quantified copy
    concrete_text = "Engineered distributed LangGraph microservices that slashed p99 latency by 42% and automated 1,400 daily enterprise tickets."
    res_concrete = growth_engine.analyze_copy_and_fluff(concrete_text)
    assert res_concrete["conversion_score"] >= 60.0
    assert "google_xyz_rewrite" in res_concrete


def test_growth_flywheel_simulation():
    res = growth_engine.simulate_growth_flywheel(
        starting_users=1000,
        monthly_churn_rate=0.04,
        viral_k_factor=0.20,
        monthly_paid_acquisitions=150,
        arpu_monthly=50.0,
        gross_margin=0.85,
        cac=100.0,
        months=12
    )
    assert res["status"] == "success"
    assert res["final_users"] > res["starting_users"]
    assert res["ending_arr"] > 0
    assert len(res["monthly_trajectory"]) == 12

    # Verify LTV math: LTV = (ARPU * GrossMargin) / Churn = (50 * 0.85) / 0.04 = 1062.5
    expected_ltv = (50.0 * 0.85) / 0.04
    assert abs(res["unit_economics"]["customer_lifetime_value_ltv"] - expected_ltv) < 0.1
    assert res["unit_economics"]["ltv_cac_ratio"] >= 3.0


def test_api_endpoints_education_and_growth():
    from fastapi import FastAPI
    from fastapi.testclient import TestClient
    import features

    app = FastAPI()
    app.include_router(features.router)
    client = TestClient(app)

    # 1. Test DAG resolve endpoint
    r1 = client.post("/api/education/dag-resolve", json={"completed_nodes": ["python-basics"]})
    assert r1.status_code == 200
    assert r1.json()["status"] == "success"

    # 2. Test SM2 interval endpoint
    r2 = client.post("/api/education/sm2-interval", json={"quality": 5, "repetition_count": 1, "ease_factor": 2.5, "previous_interval": 1})
    assert r2.status_code == 200
    assert r2.json()["status"] == "success"
    assert r2.json()["interval_days"] == 6

    # 3. Test issue cert endpoint
    r3 = client.post("/api/education/issue-cert", json={"student_name": "Diya Patel", "course_slug": "python-basics"})
    assert r3.status_code == 200
    assert r3.json()["certificate_id"].startswith("AVPU-")

    # 4. Test analyze copy endpoint
    r4 = client.post("/api/growth/analyze-copy", json={"text": "Innovative next-gen revolutionary solution"})
    assert r4.status_code == 200
    assert r4.json()["fluff_percentage"] > 50

    # 5. Test flywheel simulate endpoint
    r5 = client.post("/api/growth/flywheel-simulate", json={"starting_users": 500, "viral_k_factor": 0.3})
    assert r5.status_code == 200
    assert r5.json()["final_users"] > 500
