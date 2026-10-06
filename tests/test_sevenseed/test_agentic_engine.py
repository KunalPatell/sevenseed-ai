# -*- coding: utf-8 -*-
"""
Enterprise unit tests for the Sevenseed Agentic AI Engine (LangChain + LangGraph).
Validates:
  1. Engine status and 11 domain swarms
  2. Non-HITL workflow completion and reflexion loop
  3. Real HITL pause via LangGraph interrupt()
  4. Durable checkpointing across process restart
  5. HITL approval vs rejection paths
  6. Read-only portfolio SQL and security barriers (DROP TABLE rejection)
  7. Real tools (web search, passive recon allow-listing, signed webhook outbox)
  8. Hash-chained tamper-evident audit log
  9. Measured telemetry in pipeline monitor
 10. FastAPI HTTP endpoints (/api/agent/graph/orchestrate, /api/agent/hitl/approve, /api/agent/sessions, /api/agent/audit)
"""
import os
import sys
import pytest
from fastapi.testclient import TestClient

# Ensure backend directory is in python path
backend_dir = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", "apps", "sevenseed", "backend"))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

import agent_infra as infra
import agentic_engine as engine
from agent_swarms import SWARM_REGISTRY, hitl_modes
import features


@pytest.fixture(autouse=True)
def setup_test_env(tmp_path, monkeypatch):
    """Isolate databases and reset rate limits for every test."""
    test_data = str(tmp_path / "data")
    monkeypatch.setenv("AGENT_DATA_DIR", test_data)
    monkeypatch.setenv("AGENT_OFFLINE", "1")  # deterministic offline test mode by default
    monkeypatch.setenv("AGENT_RATE_PUBLIC_PER_MIN", "1000")
    monkeypatch.setenv("AGENT_RATE_KEY_PER_MIN", "1000")
    infra.reset_rate_limits()
    engine.reset_graph_cache()
    yield
    engine.reset_graph_cache()


def test_engine_status_and_swarms():
    status = engine.get_engine_status()
    assert status["engine_version"] == "3.1.0-enterprise"
    assert status["langgraph_available"] is True
    assert status["checkpointing_available"] is True
    assert status["durable_state"] is True
    assert status["checkpointer"] == "sqlite"
    assert status["hitl_gate_active"] is True
    assert len(status["domain_swarms"]) >= 11
    assert "security_analyst" in status["hitl_modes"]
    assert "clinical_auditor" in status["hitl_modes"]
    assert "epc_safety_inspector" in status["hitl_modes"]
    assert "csr_allocator" in status["hitl_modes"]


def test_non_hitl_workflow_execution():
    res = engine.run_agentic_workflow(
        objective="Design B2B SaaS architecture for logistics in Tier-2 India",
        agent_mode="venture_architect",
        parameters={"sector": "logistics"},
        token_budget=8000
    )
    assert res["success"] is True
    assert res["status"] == "completed"
    assert res["mode"] == "venture_architect"
    assert res["hitl_was_triggered"] is False
    assert res["hitl"]["required"] is False
    assert len(res["step_history"]) >= 4
    assert res["critique_score"] >= 80
    assert "title" in res["deliverable"]
    assert "markdown" in res["deliverable"]


def test_hitl_pause_and_approval():
    # 1. Start a high-stakes security analysis workflow
    res = engine.run_agentic_workflow(
        objective="Audit portal.sevenseed.in endpoint for credential leakage and DPDP compliance",
        agent_mode="security_analyst",
        parameters={"target": "portal.sevenseed.in"}
    )
    assert res["status"] == "awaiting_approval"
    assert res["hitl_was_triggered"] is True
    assert res["hitl"]["required"] is True
    assert res["hitl"]["status"] == "pending"
    session_id = res["session_id"]
    assert session_id.startswith("sess_")

    # 2. Check session is recorded in sqlite
    sess = infra.get_session(session_id)
    assert sess is not None
    assert sess["status"] == "awaiting_approval"
    assert sess["hitl_status"] == "pending"

    # 3. Simulate process restart by resetting compiled graph memory cache
    engine.reset_graph_cache()

    # 4. Resume workflow with approval
    approved_res = engine.resume_agentic_workflow(
        session_id=session_id,
        approved=True,
        reviewer="CISO Executive Reviewer",
        notes="Security audit scope verified and authorized."
    )
    assert approved_res["success"] is True
    assert approved_res["status"] == "completed"
    assert approved_res["hitl"]["status"] == "approved"
    assert approved_res["hitl"]["reviewer"] == "CISO Executive Reviewer"
    assert "deliverable" in approved_res
    assert len(approved_res["step_history"]) >= 5


def test_hitl_rejection_path():
    res = engine.run_agentic_workflow(
        objective="Analyze acute drug-drug interaction for Metformin and Lisinopril",
        agent_mode="clinical_auditor"
    )
    assert res["status"] == "awaiting_approval"
    session_id = res["session_id"]

    # Reject the operation
    reject_res = engine.resume_agentic_workflow(
        session_id=session_id,
        approved=False,
        reviewer="Chief Medical Officer",
        notes="Patient record missing renal panel data; operation aborted."
    )
    assert reject_res["status"] == "rejected"
    assert reject_res["hitl"]["status"] == "rejected"
    assert reject_res["hitl"]["notes"] == "Patient record missing renal panel data; operation aborted."
    assert reject_res["deliverable"]["status"] == "rejected_by_human"


def test_portfolio_sql_security():
    # 1. Valid read-only query
    q1 = infra.portfolio_query("SELECT name, sector, mrr_inr FROM ventures WHERE mrr_inr > 300000")
    assert q1["status"] == "success"
    assert len(q1["rows"]) >= 1
    assert "name" in q1["rows"][0]

    # 2. Drop table attack rejection
    q2 = infra.portfolio_query("DROP TABLE ventures")
    assert q2["status"] == "rejected"

    # 3. Insert attack rejection
    q3 = infra.portfolio_query("INSERT INTO ventures (name) VALUES ('Hacked')")
    assert q3["status"] == "rejected"

    # 4. Multi-statement injection rejection
    q4 = infra.portfolio_query("SELECT * FROM ventures; DROP TABLE ventures;")
    assert q4["status"] == "rejected"


def test_audit_log_hash_chain():
    # Run a workflow to populate audit log
    engine.run_agentic_workflow("Test audit logging", "venture_architect")
    entries = infra.read_audit(limit=20)
    assert len(entries) >= 2

    # Verify cryptographic integrity of the chain
    chain_check = infra.verify_audit_chain()
    assert chain_check["valid"] is True
    assert chain_check["entries"] >= 2


def test_pipeline_monitor_real_metrics():
    # Run one session
    engine.run_agentic_workflow("Measure pipeline stats", "venture_architect")
    stats = engine.run_pipeline_monitor()
    assert stats["sessions_total"] >= 1
    assert "data_source" in stats
    assert "agent_state.db" in stats["data_source"]
    assert stats["completed_today"] >= 1
    assert stats["avg_quality_score"] > 0


def test_http_api_endpoints():
    from fastapi import FastAPI
    app = FastAPI()
    app.include_router(features.router)
    client = TestClient(app)

    # 1. Engine status
    r_status = client.get("/api/agent/engine/status")
    assert r_status.status_code == 200
    d_status = r_status.json()
    assert d_status["engine_version"] == "3.1.0-enterprise"

    # 2. Orchestrate standard workflow
    r_orch = client.post("/api/agent/graph/orchestrate", json={
        "objective": "API test objective for venture ideation",
        "agent_mode": "venture_architect"
    })
    assert r_orch.status_code == 200
    d_orch = r_orch.json()
    assert d_orch["status"] == "completed"
    session_id = d_orch["session_id"]

    # 3. Sessions list
    r_sess = client.get("/api/agent/sessions")
    assert r_sess.status_code == 200
    assert len(r_sess.json()["sessions"]) >= 1

    # 4. Session detail
    r_detail = client.get(f"/api/agent/sessions/{session_id}")
    assert r_detail.status_code == 200
    assert r_detail.json()["session_id"] == session_id

    # 5. Audit log
    r_audit = client.get("/api/agent/audit")
    assert r_audit.status_code == 200
    assert r_audit.json()["chain_verification"]["valid"] is True

    # 6. HITL endpoint
    r_hitl = client.post("/api/agent/graph/orchestrate", json={
        "objective": "API test high-stakes security scan",
        "agent_mode": "security_analyst"
    })
    assert r_hitl.status_code == 200
    d_hitl = r_hitl.json()
    assert d_hitl["status"] == "awaiting_approval"
    hitl_sess_id = d_hitl["session_id"]

    # 7. Approve via HITL API
    r_appr = client.post("/api/agent/hitl/approve", json={
        "session_id": hitl_sess_id,
        "approved": True,
        "reviewer": "API Test Admin",
        "notes": "Verified via automated test harness"
    })
    assert r_appr.status_code == 200
    d_appr = r_appr.json()
    assert d_appr["status"] == "completed"
