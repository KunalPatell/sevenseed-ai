# -*- coding: utf-8 -*-
"""
Swarm registry — single source of truth for every domain agent swarm.

The engine, the HTTP layer and the presets catalog all read from here so the
HITL policy, persona and tool wiring can never drift apart again.

domain_tool values (consumed by agentic_engine.node_researcher):
  recon       -> cybersecurity recon on the objective's target
  compliance  -> regulatory checker for `framework`
  financial   -> runway / dilution model
  commerce    -> live web search on pricing + financial model
  portfolio   -> read-only portfolio SQL
  none        -> market intel + web only
"""
from __future__ import annotations
from typing import Dict, Any

SWARM_REGISTRY: Dict[str, Dict[str, Any]] = {
    "venture_architect": {
        "name": "Sevenseed Venture Architect", "venture": "Sevenseed",
        "persona": "venture strategist: market size, unit economics, tech stack and a 90-day execution roadmap",
        "domain_tool": "financial", "framework": "DPDP", "hitl": False, "hitl_reason": "",
    },
    "security_analyst": {
        "name": "Rakshak AI Autonomous Defense", "venture": "Rakshak AI",
        "persona": "cyber-defense analyst: threat vectors, credential and endpoint exposure, DPDP Act 2023 / IT Act mitigations",
        "domain_tool": "recon", "framework": "DPDP", "hitl": True,
        "hitl_reason": "Security analysis can authorise scans against live infrastructure; a human must approve before any dispatch.",
    },
    "recruitment_screener": {
        "name": "Comonk AI Talent Screener", "venture": "Comonk",
        "persona": "technical recruiter: competency extraction, structured rubric, salary benchmarking, bias-aware screening",
        "domain_tool": "none", "framework": "DPDP", "hitl": False, "hitl_reason": "",
    },
    "academic_tutor": {
        "name": "AVPU Academic AI Coach", "venture": "AVPU",
        "persona": "learning scientist: week-by-week mastery syllabus, spaced repetition schedule, labs and assessments",
        "domain_tool": "none", "framework": "DPDP", "hitl": False, "hitl_reason": "",
    },
    "clinical_auditor": {
        "name": "Decode Forest Clinical Agent", "venture": "Decode Forest",
        "persona": "clinical pharmacist: drug-drug interactions, dosage and renal considerations, CDSCO / Indian Pharmacopoeia alignment. Advisory only; never a diagnosis",
        "domain_tool": "compliance", "framework": "DPDP", "hitl": True,
        "hitl_reason": "Clinical output affects patient safety; a licensed reviewer must approve before it is released.",
    },
    "sales_automation": {
        "name": "Sevenforce B2B Growth Agent", "venture": "Sevenforce",
        "persona": "B2B growth lead: ICP definition, multi-touch outbound cadence, objection handling, CRM hand-off",
        "domain_tool": "none", "framework": "DPDP", "hitl": False, "hitl_reason": "",
    },
    "epc_safety_inspector": {
        "name": "Breakdown Factor Safety Agent", "venture": "Breakdown Factor",
        "persona": "EPC site-safety engineer: ISO 45001 / OSHA 1926 hazard classification, root-cause analysis and CAPA plans",
        "domain_tool": "compliance", "framework": "ISO27001", "hitl": True,
        "hitl_reason": "Safety findings can halt work on site; a competent person must approve before it is issued.",
    },
    "portfolio_analyst": {
        "name": "Sevenseed Portfolio Analyst", "venture": "Sevenseed",
        "persona": "portfolio analyst: cross-venture runway, burn and KPI review for a board report",
        "domain_tool": "portfolio", "framework": "DPDP", "hitl": False, "hitl_reason": "",
    },
    "ecom_arbitrage": {
        "name": "AVP Emart Price & Cart Arbitrage", "venture": "AVP Emart",
        "persona": "commerce analyst: cross-marketplace price comparison, card-offer stacking and EMI cost, net effective price",
        "domain_tool": "commerce", "framework": "DPDP", "hitl": False, "hitl_reason": "",
    },
    "csr_allocator": {
        "name": "AVP Trust CSR Grant & Impact Allocator", "venture": "AVP Charitable Trust",
        "persona": "CSR programme officer: Companies Act Section 135 / Schedule VII eligibility, Section 80G receipts, beneficiary-level allocation",
        "domain_tool": "compliance", "framework": "DPDP", "hitl": True,
        "hitl_reason": "Fund allocation and tax receipts are financial commitments; an authorised trustee must approve first.",
    },
    "legal_compliance": {
        "name": "Legal & Compliance Reviewer", "venture": "Sevenseed",
        "persona": "compliance counsel: clause risk, DPDP / ISO 27001 / RBI gaps and remediation owners",
        "domain_tool": "compliance", "framework": "DPDP", "hitl": True,
        "hitl_reason": "Legal conclusions require qualified human review before release.",
    },
}

DEFAULT_SWARM = "venture_architect"


def get_swarm(mode: str) -> Dict[str, Any] | None:
    return SWARM_REGISTRY.get(mode)


def hitl_modes() -> list[str]:
    return [k for k, v in SWARM_REGISTRY.items() if v["hitl"]]
