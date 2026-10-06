# -*- coding: utf-8 -*-
"""
Tests for AVP E-Mart Price Comparator and Comonk Recruitment Intelligence Engines.
Validates multi-site arbitrage, deal integrity, skill taxonomy ATS matching,
company search, and Sevenforce digital employee dispatch.
"""
import os
import sys
import pytest
from fastapi.testclient import TestClient

backend_dir = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", "apps", "sevenseed", "backend"))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from main import app
import emart_engine
import recruitment_engine


@pytest.fixture
def client():
    return TestClient(app)


def test_emart_compare_products_offline():
    res = emart_engine.compare_ecommerce_products("iPhone 16")
    assert res["status"] == "success"
    assert res["total_stores_compared"] >= 4
    assert "best_recommendation" in res
    assert res["best_recommendation"] is not None
    assert "price" in res["best_recommendation"]
    assert "final_score" in res["best_recommendation"]
    assert "price_range" in res
    assert len(res["qcommerce_radar"]) >= 1


def test_emart_dynamic_query_fallback():
    res = emart_engine.compare_ecommerce_products("Sony Wireless Headphones")
    assert res["status"] == "success"
    assert len(res["all_results"]) >= 4
    for item in res["all_results"]:
        assert item["price"] > 0
        assert item["deal_integrity"] in ("HIGH", "CAUTION (Inflated MRP)")


def test_recruitment_canonical_skills():
    engine = recruitment_engine.get_recruitment_engine()
    resume = "Senior AI Engineer skilled in Python, FastAPI, Docker, LangGraph, and PostgreSQL."
    jd = "Seeking Backend AI Engineer with Python, FastAPI, Docker, Kubernetes, and AWS Cloud Architecture."

    analysis = engine.analyze_resume_fit(resume, jd)
    assert analysis["status"] == "success"
    assert analysis["ats_score"] > 50
    assert "Python" in analysis["matched_skills"]
    assert "FastAPI" in analysis["matched_skills"]
    assert "Docker & Containers" in analysis["matched_skills"]
    assert "Kubernetes" in analysis["missing_skills"]
    assert len(analysis["google_xyz_recommendations"]) > 0


def test_recruitment_company_search():
    engine = recruitment_engine.get_recruitment_engine()
    ahmedabad_companies = engine.search_companies(city="Ahmedabad")
    assert len(ahmedabad_companies) >= 5

    simform = [c for c in ahmedabad_companies if "Simform" in c["name"]]
    assert len(simform) == 1
    assert "careers@simform.com" in simform[0]["hr_email"]

    infosys = engine.search_companies(query="Infosys")
    assert len(infosys) == 1
    assert "GIFT City" in infosys[0]["location"]


def test_recruitment_ctc_salary_breakdown():
    engine = recruitment_engine.get_recruitment_engine()
    res_new = engine.calculate_in_hand_salary(1200000.0, regime="new")
    assert res_new["status"] == "success"
    assert res_new["monthly_in_hand_numeric"] > 70000
    assert "breakdown" in res_new

    res_old = engine.calculate_in_hand_salary(1200000.0, regime="old")
    assert res_old["status"] == "success"
    assert res_old["monthly_in_hand_numeric"] > 60000


def test_api_endpoints_emart_and_recruitment(client):
    # E-Mart compare endpoint
    resp = client.post("/api/emart/compare", json={"query": "MacBook Air M3"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert "best_recommendation" in data

    # E-Mart trending endpoint
    resp = client.get("/api/emart/trending")
    assert resp.status_code == 200
    assert len(resp.json()["trending_queries"]) >= 4

    # Recruitment companies endpoint
    resp = client.get("/api/recruitment/companies?location=Ahmedabad")
    assert resp.status_code == 200
    assert len(resp.json()["companies"]) >= 5

    # Recruitment ATS match endpoint
    resp = client.post("/api/recruitment/resume-match", json={
        "resume_text": "Experienced Python and LangChain developer.",
        "job_description": "We need Python, LangChain, and Docker."
    })
    assert resp.status_code == 200
    assert resp.json()["ats_score"] > 40

    # Recruitment CTC calculator endpoint
    resp = client.post("/api/recruitment/ctc-calculate", json={
        "ctc_annual": 1500000.0,
        "regime": "new"
    })
    assert resp.status_code == 200
    assert resp.json()["monthly_in_hand_numeric"] > 80000

    # Sevenforce Digital Employee Dispatch endpoint
    resp = client.post("/api/sevenforce/dispatch-employee", json={
        "employee_name": "Dexter",
        "role": "Full-Stack Engineer",
        "objective": "Build a REST endpoint for real-time price comparison"
    })
    assert resp.status_code == 200
    assert resp.json()["status"] == "success"
    assert "deliverable" in resp.json()
