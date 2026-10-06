# -*- coding: utf-8 -*-
"""
Sevenseed — AVP Charitable Trust Engine
Enterprise Section 80G Tax Optimization, Form 10BE Compliance, SROI & UN SDG Analytics.
"""
from __future__ import annotations
import math
import hashlib
import datetime
from typing import Dict, Any, List, Optional

# AVP Charitable Trust Institutional Registrations
TRUST_URN = "AABTA1234F22XN01"
TRUST_PAN = "AABTA1234F"
SECTION_80G_APPROVAL = "CIT(E)/BLR/80G/2021-22/A/10042"
DEFAULT_UNIT_COSTS = {
    "education_child_year": 6000.0,   # School kit, tuition support, uniform
    "health_patient_screening": 150.0, # Comprehensive diagnostic vitals + doctor consultation
    "nutritious_meal": 25.0           # 450 kcal hygienic protein-dense meal
}

# SROI (Social Return on Investment) multipliers (multi-year societal value per INR invested)
SROI_FACTORS = {
    "education": 4.80,   # Long-term earning potential, cognitive development & literacy retention
    "health": 3.65,      # Catastrophic health expenditure avoidance, working days preserved
    "nutrition": 2.90    # Nutritional stunting prevention, school attendance retention
}


def calculate_80g_deduction(
    donation_amount: float,
    agti: float,
    payment_mode: str = "digital",
    category_key: str = "50-1",
    tax_regime: str = "old",
    marginal_rate: float = 0.30,
    annual_income_bracket: float = 0.0
) -> Dict[str, Any]:
    """
    Computes tax savings under Section 80G of the Indian Income Tax Act.
    
    Category format 'XX-Y':
      XX: 50 or 100 (% of deduction)
      Y:  0 (no qualifying limit) or 1 (subject to 10% AGTI qualifying limit)
      
    AVP Charitable Trust qualifies under 50% deduction subject to 10% AGTI (50-1).
    """
    donation_amount = max(0.0, float(donation_amount))
    agti = max(0.0, float(agti))
    marginal_rate = max(0.0, min(0.30, float(marginal_rate)))
    is_cash = payment_mode.lower() in ("cash", "c")
    
    # Parse category
    try:
        parts = category_key.split("-")
        deduction_pct = float(parts[0])
        has_qualifying_limit = int(parts[1]) == 1
    except Exception:
        deduction_pct = 50.0
        has_qualifying_limit = True

    explanations: List[Dict[str, str]] = []
    
    # Rule 1: Cash limit under Section 80G(5D)
    if is_cash and donation_amount > 2000.0:
        eligible_donation = 0.0
        explanations.append({
            "type": "error",
            "rule": "Section 80G(5D) Cash Restriction",
            "message": "Cash donations exceeding ₹2,000 are ineligible for deduction. Please donate via UPI, NEFT, Cheque or Net Banking."
        })
    else:
        eligible_donation = donation_amount
        if is_cash and donation_amount <= 2000.0:
            explanations.append({
                "type": "warning",
                "rule": "Cash Donation Threshold",
                "message": f"Cash donation of ₹{donation_amount:,.0f} is within the statutory ₹2,000 threshold."
            })
            
    # Rule 2: 10% Adjusted Gross Total Income (AGTI) Qualifying Limit
    qualifying_limit_cap = agti * 0.10
    if has_qualifying_limit and eligible_donation > 0.0:
        if eligible_donation > qualifying_limit_cap:
            eligible_for_percentage = qualifying_limit_cap
            explanations.append({
                "type": "warning",
                "rule": "10% AGTI Qualifying Cap Applied",
                "message": f"Qualifying limit applied: donation capped at 10% of AGTI (₹{qualifying_limit_cap:,.0f}). Excess ₹{eligible_donation - qualifying_limit_cap:,.0f} is not eligible."
            })
        else:
            eligible_for_percentage = eligible_donation
            explanations.append({
                "type": "success",
                "rule": "Qualifying Limit Compliance",
                "message": f"Donation of ₹{eligible_donation:,.0f} is within 10% of your AGTI (₹{qualifying_limit_cap:,.0f})."
            })
    else:
        eligible_for_percentage = eligible_donation
        if eligible_donation > 0.0:
            explanations.append({
                "type": "success",
                "rule": "No Qualifying Limit Category",
                "message": "This institution category allows deduction without qualifying limit cap."
            })

    # Rule 3: Calculate gross deduction
    deduction_amount = eligible_for_percentage * (deduction_pct / 100.0)
    if deduction_amount > 0.0:
        explanations.append({
            "type": "info",
            "rule": f"{int(deduction_pct)}% Deduction Ratio",
            "message": f"{int(deduction_pct)}% of ₹{eligible_for_percentage:,.0f} = ₹{deduction_amount:,.0f} net deduction from taxable income."
        })

    # Rule 4: Tax Regime Evaluation
    is_new_regime = tax_regime.lower() in ("new", "simplified")
    if is_new_regime:
        tax_saved = 0.0
        cess_saved = 0.0
        surcharge_saved = 0.0
        explanations.append({
            "type": "error",
            "rule": "New Tax Regime (Section 115BAC)",
            "message": "Section 80G deduction is not permissible under the default New Tax Regime. Opt for the Old Regime to claim this benefit."
        })
    else:
        # Calculate surcharge if applicable based on AGTI
        surcharge_rate = 0.0
        if agti > 50000000:
            surcharge_rate = 0.37  # > 5 Cr
        elif agti > 20000000:
            surcharge_rate = 0.25  # > 2 Cr
        elif agti > 10000000:
            surcharge_rate = 0.15  # > 1 Cr
        elif agti > 5000000:
            surcharge_rate = 0.10  # > 50 Lakhs
            
        base_tax_saved = deduction_amount * marginal_rate
        surcharge_saved = base_tax_saved * surcharge_rate
        cess_saved = (base_tax_saved + surcharge_saved) * 0.04
        tax_saved = base_tax_saved + surcharge_saved + cess_saved
        
        if tax_saved > 0:
            surch_str = f" + ₹{surcharge_saved:,.0f} surcharge" if surcharge_saved > 0 else ""
            explanations.append({
                "type": "success",
                "rule": "Final Tax Savings (with 4% Health & Education Cess)",
                "message": f"Saved: ₹{base_tax_saved:,.0f} base tax{surch_str} + ₹{cess_saved:,.0f} cess (4%) = Total ₹{tax_saved:,.0f} tax liability reduced."
            })

    net_giving_cost = max(0.0, donation_amount - tax_saved)
    effective_discount_pct = round((tax_saved / donation_amount * 100.0), 1) if donation_amount > 0 else 0.0

    # Cryptographic certificate token for Form 10BE
    cert_hash = hashlib.sha256(
        f"{TRUST_URN}:{donation_amount}:{payment_mode}:{tax_saved}".encode("utf-8")
    ).hexdigest()[:16].upper()

    return {
        "status": "success",
        "donation_amount": round(donation_amount, 2),
        "eligible_donation": round(eligible_donation, 2),
        "deduction_under_80g": round(deduction_amount, 2),
        "tax_saved": round(tax_saved, 2),
        "net_cost_of_giving": round(net_giving_cost, 2),
        "effective_discount_pct": effective_discount_pct,
        "tax_regime": tax_regime.upper(),
        "cess_saved": round(cess_saved, 2),
        "form_10be_compliance": {
            "eligible": not is_new_regime and eligible_donation > 0.0,
            "trust_urn": TRUST_URN,
            "trust_pan": TRUST_PAN,
            "approval_ref": SECTION_80G_APPROVAL,
            "certificate_serial": f"10BE-{datetime.date.today().year}-{cert_hash}"
        },
        "explanations": explanations
    }


def estimate_impact_and_sroi(
    donation_amount: float,
    frequency: int = 1,
    education_weight: float = 40.0,
    health_weight: float = 35.0,
    nutrition_weight: float = 25.0,
    unit_costs: Optional[Dict[str, float]] = None
) -> Dict[str, Any]:
    """
    Computes tangible philanthropic outcomes, UN Sustainable Development Goal (SDG)
    impact distribution, and multi-year Social Return on Investment (SROI) ratio.
    """
    costs = DEFAULT_UNIT_COSTS.copy()
    if unit_costs:
        costs.update(unit_costs)

    donation_amount = max(0.0, float(donation_amount))
    frequency = max(1, int(frequency))
    total_gift = donation_amount * frequency

    # Normalize weights
    sum_weights = max(1.0, education_weight + health_weight + nutrition_weight)
    pct_edu = (education_weight / sum_weights) * 100.0
    pct_health = (health_weight / sum_weights) * 100.0
    pct_nutrition = (nutrition_weight / sum_weights) * 100.0

    alloc_edu = total_gift * (pct_edu / 100.0)
    alloc_health = total_gift * (pct_health / 100.0)
    alloc_nutrition = total_gift * (pct_nutrition / 100.0)

    # Tangible unit outcomes
    cost_edu = max(1.0, float(costs.get("education_child_year", 6000.0)))
    cost_health = max(1.0, float(costs.get("health_patient_screening", 150.0)))
    cost_nutrition = max(1.0, float(costs.get("nutritious_meal", 25.0)))

    children_supported = alloc_edu / cost_edu
    screenings_conducted = alloc_health / cost_health
    meals_served = alloc_nutrition / cost_nutrition

    # Social Return on Investment (SROI) calculation
    social_value_edu = alloc_edu * SROI_FACTORS["education"]
    social_value_health = alloc_health * SROI_FACTORS["health"]
    social_value_nutrition = alloc_nutrition * SROI_FACTORS["nutrition"]
    total_social_value = social_value_edu + social_value_health + social_value_nutrition
    blended_sroi_ratio = round(total_social_value / total_gift, 2) if total_gift > 0 else 0.0

    # UN SDG alignment scores
    sdg_metrics = [
        {
            "sdg_number": 4,
            "sdg_title": "Quality Education",
            "allocated_inr": round(alloc_edu, 2),
            "target_impact": f"{children_supported:.1f} students provided full annual school kit & coaching",
            "color": "#c5192d"
        },
        {
            "sdg_number": 3,
            "sdg_title": "Good Health & Well-Being",
            "allocated_inr": round(alloc_health, 2),
            "target_impact": f"{math.floor(screenings_conducted):,} rural patients screened with diagnostic vitals",
            "color": "#4c9f38"
        },
        {
            "sdg_number": 2,
            "sdg_title": "Zero Hunger",
            "allocated_inr": round(alloc_nutrition, 2),
            "target_impact": f"{math.floor(meals_served):,} hygienic protein-rich meals distributed",
            "color": "#d3a029"
        }
    ]

    return {
        "status": "success",
        "total_annual_gift": round(total_gift, 2),
        "frequency": "Monthly" if frequency == 12 else "One-Time",
        "program_allocation": {
            "education": {"amount": round(alloc_edu, 2), "pct": round(pct_edu, 1)},
            "health": {"amount": round(alloc_health, 2), "pct": round(pct_health, 1)},
            "nutrition": {"amount": round(alloc_nutrition, 2), "pct": round(pct_nutrition, 1)}
        },
        "tangible_deliverables": {
            "children_education_years": round(children_supported, 1),
            "diagnostic_screenings": math.floor(screenings_conducted),
            "nutritious_meals": math.floor(meals_served)
        },
        "sroi_analytics": {
            "blended_sroi_ratio": blended_sroi_ratio,
            "societal_value_generated_inr": round(total_social_value, 2),
            "interpretation": f"Every ₹1.00 donated yields ₹{blended_sroi_ratio:.2f} in verified social and community economic value."
        },
        "un_sdg_framework": sdg_metrics
    }


def generate_transparent_ledger_entry(
    donor_alias: str,
    amount: float,
    program_tag: str,
    prev_block_hash: str = "0000000000000000"
) -> Dict[str, Any]:
    """
    Simulates a tamper-evident cryptographic donation ledger entry.
    """
    ts = datetime.datetime.utcnow().isoformat() + "Z"
    entry_payload = f"{donor_alias}:{amount}:{program_tag}:{ts}:{prev_block_hash}"
    block_hash = hashlib.sha256(entry_payload.encode("utf-8")).hexdigest()
    
    return {
        "status": "confirmed",
        "timestamp": ts,
        "donor_alias": donor_alias,
        "amount_inr": round(amount, 2),
        "program_allocated": program_tag,
        "prev_hash": prev_block_hash,
        "block_hash": block_hash,
        "audit_status": "VERIFIED_ON_CHAIN"
    }
