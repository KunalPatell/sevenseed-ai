# -*- coding: utf-8 -*-
"""
Sevenseed Growth Engineering & Teardown Engine — Inspired by MarketingExamples.com and GrowthInReverse.com.
Implements:
1. Copywriting Teardown & Fluff Ratio Scorer
2. Google XYZ Formula & ATS / Conversion Rewriter
3. Compounding Viral Growth Loop & Unit Economics Simulator (CAC, LTV, Payback, Runway)
4. Curated Growth Flywheel Benchmark Registry
"""
from __future__ import annotations
import math
import re
from typing import Dict, List, Any, Optional

FILLER_BUZZWORDS = {
    "innovative", "state-of-the-art", "game-changing", "next-gen", "next-generation",
    "cutting-edge", "revolutionary", "best-in-class", "world-class", "seamless",
    "disruptive", "synergistic", "transformative", "holistic", "robust", "unparalleled"
}

ACTION_VERBS = {
    "engineered", "architected", "deployed", "scaled", "automated", "optimized",
    "slashed", "accelerated", "boosted", "eliminated", "delivered", "unlocked",
    "generated", "built", "trained", "integrated", "launched", "reduced", "increased"
}


def analyze_copy_and_fluff(text: str) -> Dict[str, Any]:
    """
    Computes copy fluff score, identifies buzzword bloat, and provides
    actionable Before/After high-converting copy suggestions.
    """
    if not text or not text.strip():
        return {"status": "error", "message": "Text cannot be empty"}

    words = re.findall(r"\b[A-Za-z0-9\$\%₹\.-]+\b", text.lower())
    total_words = len(words)
    if total_words == 0:
        return {"status": "error", "message": "No valid words found"}

    # Detect buzzwords
    detected_buzzwords = [w for w in words if w in FILLER_BUZZWORDS]
    detected_verbs = [w for w in words if w in ACTION_VERBS]
    numbers_and_metrics = [w for w in words if any(c.isdigit() for c in w) or "%" in w or "$" in w or "₹" in w]

    # Calculate Fluff Ratio
    # Fluff is high if few action verbs/metrics and high buzzword count
    substance_count = len(detected_verbs) + (len(numbers_and_metrics) * 1.5)
    buzzword_penalty = len(detected_buzzwords) * 2.0
    
    raw_substance_ratio = max(0.0, min(1.0, (substance_count - buzzword_penalty) / max(3, total_words * 0.35)))
    fluff_ratio = round((1.0 - raw_substance_ratio) * 100, 1)
    conversion_score = round(raw_substance_ratio * 100, 1)

    # Generate Google XYZ bullet suggestion
    suggestion = "Accomplished [Concrete Outcome] as measured by [Quantified Metric], by doing [Specific Actionable Mechanism]."
    if detected_verbs:
        first_verb = detected_verbs[0].capitalize()
        suggestion = f"{first_verb} [Target Metric] by 38% across [Domain] by automating [Core Workflow]."

    return {
        "status": "success",
        "total_words": total_words,
        "fluff_percentage": fluff_ratio,
        "conversion_score": conversion_score,
        "verdict": "High-Converting & Concrete" if fluff_ratio <= 35 else "Moderate Buzzwords" if fluff_ratio <= 65 else "Fluff Heavy / Needs Concrete Metrics",
        "buzzwords_detected": list(set(detected_buzzwords)),
        "action_verbs_detected": list(set(detected_verbs)),
        "metrics_detected": numbers_and_metrics,
        "google_xyz_rewrite": suggestion,
        "formula_breakdown": {
            "hook": "Lead with the exact pain point or surprising metric.",
            "value": "State quantified impact without generic adjectives.",
            "cta": "Single unambiguous next step."
        }
    }


def simulate_growth_flywheel(
    starting_users: int = 1000,
    monthly_churn_rate: float = 0.05,
    viral_k_factor: float = 0.25,
    monthly_paid_acquisitions: int = 200,
    arpu_monthly: float = 49.0,
    gross_margin: float = 0.85,
    cac: float = 120.0,
    months: int = 12
) -> Dict[str, Any]:
    """
    Growth In Reverse flywheel simulator:
    U_{t+1} = U_t * (1 - Churn) + (U_t * K_viral) + Paid_Acquisition
    Calculates LTV, CAC Payback, ARR trajectories.
    """
    churn = max(0.001, min(0.99, monthly_churn_rate))
    k = max(0.0, min(3.0, viral_k_factor))
    cac_val = max(1.0, cac)
    margin = max(0.1, min(1.0, gross_margin))
    arpu = max(1.0, arpu_monthly)

    # Unit Economics
    ltv = (arpu * margin) / churn
    ltv_cac_ratio = round(ltv / cac_val, 2)
    cac_payback_months = round(cac_val / (arpu * margin), 1)

    # 12-Month Projection Loop
    current_users = float(starting_users)
    trajectory = []
    total_revenue = 0.0

    for m in range(1, months + 1):
        retained = current_users * (1.0 - churn)
        viral_new = current_users * k
        paid_new = float(monthly_paid_acquisitions)
        new_total = retained + viral_new + paid_new

        monthly_rev = new_total * arpu
        total_revenue += monthly_rev

        trajectory.append({
            "month": m,
            "users": int(round(new_total)),
            "monthly_revenue": round(monthly_rev, 2),
            "viral_additions": int(round(viral_new)),
            "retained_users": int(round(retained))
        })
        current_users = new_total

    final_users = int(round(current_users))
    ending_arr = round(current_users * arpu * 12, 2)

    return {
        "status": "success",
        "starting_users": starting_users,
        "final_users": final_users,
        "ending_arr": ending_arr,
        "cumulative_revenue_12m": round(total_revenue, 2),
        "unit_economics": {
            "customer_lifetime_value_ltv": round(ltv, 2),
            "customer_acquisition_cost_cac": cac_val,
            "ltv_cac_ratio": ltv_cac_ratio,
            "cac_payback_months": cac_payback_months,
            "health_grade": "Exceptional" if ltv_cac_ratio >= 4.0 else "Healthy (VC Benchmark)" if ltv_cac_ratio >= 3.0 else "Sub-optimal / High Burn"
        },
        "monthly_trajectory": trajectory
    }


def get_curated_growth_teardowns() -> List[Dict[str, Any]]:
    """Returns curated Growth In Reverse founder flywheel benchmarks."""
    return [
        {
            "brand": "Starter Story",
            "founder": "Pat Walls",
            "revenue": "$1.2M ARR",
            "flywheel_steps": [
                "Interview founders with standardized questionnaire",
                "Programmatic SEO generation of 4,000+ case study pages",
                "Rank for long-tail high-intent queries ('how to start a... ')",
                "Convert organic readers into premium community membership",
                "Reinvest community revenue into database expansion"
            ],
            "key_metric": "92% Organic Traffic / Zero Ad Spend"
        },
        {
            "brand": "Morning Brew",
            "founder": "Alex Lieberman & Austin Rief",
            "revenue": "$50M+ Acquisition",
            "flywheel_steps": [
                "Conversational, witty business newsletter format",
                "Milestone-based referral loop (stickers at 3, mugs at 10, crewneck at 25)",
                "College ambassador program generating 100k+ subscribers",
                "Cross-promotions with non-competing daily publications",
                "Native high-CPM sponsor slots reinvested into audience acquisition"
            ],
            "key_metric": "K-factor 0.35 driven by physical gamified merchandise"
        },
        {
            "brand": "Lenny's Newsletter",
            "founder": "Lenny Rachitsky",
            "revenue": "$3.5M+ ARR",
            "flywheel_steps": [
                "Deep-dive 4,000-word tactical product management guides",
                "High-signal podcast clips distributed to YouTube & LinkedIn",
                "Subscriber-only Slack community creating sticky retention",
                "Crowdsourced benchmark salary data driving viral backlinks"
            ],
            "key_metric": "<2% Monthly Churn / $150/yr Subscriptions"
        }
    ]
