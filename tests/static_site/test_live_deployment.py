# -*- coding: utf-8 -*-
"""Comprehensive live production testing suite against https://sevenseed.onrender.com"""
import os
import urllib.request
import urllib.error
import json
import time

BASE_URL = os.environ.get("BASE_URL", "https://sevenseed.onrender.com")

TEST_ROUTES = [
    # 1. Core & Hub
    ("GET", "/", "Sevenseed Hub Home"),
    ("GET", "/app/", "Vite v7.0 Unified /app Portal"),
    ("GET", "/avpu/app/", "AVPU Vite v7.0 /app Portal"),
    ("GET", "/manifest.json", "PWA Web App Manifest"),
    ("GET", "/byok.html", "Universal BYOK Vault"),
    ("GET", "/workstations.html", "Workstations Directory"),

    # 2. 8 Ventures Landing Pages
    ("GET", "/comonk/", "Comonk AI Career"),
    ("GET", "/sevenforce/", "Sevenforce Enterprise Agents"),
    ("GET", "/avp-emart/", "AVP Emart Smart Commerce"),
    ("GET", "/avpu/", "AVPU AI University"),
    ("GET", "/decode-forest-pharmacy/", "Decode Forest Pharmacy"),
    ("GET", "/pharmacy/", "Pharmacy Alias Mirror"),
    ("GET", "/breakdown-factor/", "Breakdown Factor AEC"),
    ("GET", "/breakdown/", "Breakdown Alias Mirror"),
    ("GET", "/rakshak-ai/", "Rakshak AI Safety"),
    ("GET", "/avp-charitable-trust/", "AVP Charitable Trust"),
    ("GET", "/trust/", "Trust Alias Mirror"),
    ("GET", "/sevenseed/", "Sevenseed Studio"),

    # 3. Interactive Workstations
    ("GET", "/outreach-sequence-studio.html", "Outreach Sequence Studio"),
    ("GET", "/price-comparator.html", "Price Comparator Studio"),
    ("GET", "/resume-matcher.html", "Resume Matcher Studio"),
    ("GET", "/damage-vision.html", "Damage Vision Studio"),
    ("GET", "/vision-security.html", "Vision Security Sentinel"),
    ("GET", "/pharmacy-studio.html", "Pharmacy Clinical Studio"),
    ("GET", "/charitable-trust.html", "Charitable Trust Studio"),
    ("GET", "/operations-intelligence.html", "Operations Intelligence Studio"),
    ("GET", "/coding-agent-studio.html", "Coding Agent Studio"),
    ("GET", "/interview-radar.html", "Interview Radar Studio"),

    # 4. Power & Agent APIs
    ("GET", "/api/power/outreach/sequences", "Outreach Sequences API"),
    ("GET", "/api/power/outreach/leads", "Outreach Leads API"),
    ("GET", "/api/power/outreach/stats", "Outreach Live Stats API"),
    ("GET", "/api/power/outreach/t/lead-001/1", "Live Tracking Pixel GIF"),
    ("POST", "/api/power/outreach/classify-reply", "Outreach NLP Classifier", {"reply_text": "Let's schedule a call on Thursday at 2pm"}),
    ("POST", "/api/power/resume/generate-bullet", "ATS Resume Bullet Generator", {"skill": "Kubernetes", "role_context": "Platform Lead"}),
    ("GET", "/api/power/operations/timesheets", "Operations Timesheets API"),
    ("GET", "/api/power/operations/attendance", "Operations Attendance API"),
    ("GET", "/api/power/operations/sprints", "Operations Sprints API"),
    ("GET", "/api/comonk/skill-taxonomy", "Comonk Taxonomy API"),
    ("POST", "/api/comonk/match-resume-jd", "Comonk Resume Matcher API", {"resume_text": "Python FastAPI Docker PostgreSQL", "jd_text": "Python FastAPI Kubernetes Docker PostgreSQL Kafka"}),
    ("POST", "/api/rakshak/detect-safety-ppe", "Rakshak PPE Vision API", {"image_base64": "dummy", "scenario_preset": "compliant_worker"}),
    ("POST", "/api/power/pharmacy/health-advice", "Clinical Triage & Health Advice API", {"query": "High fever 102F and chills for 2 days"}),
    ("GET", "/api/power/pharmacy/schemes", "Free Healthcare & Ayushman Schemes API"),
    ("POST", "/api/power/outreach/enrich-lead", "Autonomous Prospect Intelligence API", {"company_name": "Datadog", "role": "VP Engineering"}),
    ("POST", "/api/power/breakdown/estimate-repair", "Structural Damage Repair BOQ Estimator API", {"damage_type": "shear_crack", "area_sqft": 30.0}),

    # 5. v7.0 Frontier AI Studios, New Ventures & Promoted Reference Workstations
    ("GET", "/perplexity-research/", "Perplexity Cited Deep-Research Studio"),
    ("GET", "/ai-ui-builder/", "v0 + Bolt Live UI Synthesizer"),
    ("GET", "/infinite-canvas/", "Infinite System Architecture Whiteboard"),
    ("GET", "/linear-os/", "Linear + Raycast Engineering OS"),
    ("GET", "/quant-terminal/", "Sevenseed Quant & Options Greeks Terminal"),
    ("GET", "/climate-agritech/", "TerraPulse Climate & AgriTech AI"),
    ("GET", "/proptech-studio/", "UrbanGrid PropTech & Real Estate AI"),
    ("GET", "/shader-3d-lab/", "Live WebGL & GLSL Fragment Shader Lab"),
    ("GET", "/stripe-atlas/", "Stripe Atlas & IRS 83(b) Incorporation Studio"),
    ("GET", "/pharmacy/pregnancy-lactation-safety/", "LactMed RID% & Food-Drug Safety Workstation"),
    ("GET", "/decode-forest-pharmacy/pregnancy-lactation-safety/", "Decode Forest Pharmacy LactMed Twin"),
    ("GET", "/trust/crowdfunding-milestones/", "Ketto & GoFundMe Milestone Escrow Planner"),
    ("GET", "/avp-charitable-trust/crowdfunding-milestones/", "AVP Charitable Trust Milestone Twin"),

    # 6. v7.0 Reference Registry & Mathematical/AI APIs
    ("GET", "/api/reference-sites/registry", "126-Platform Master Reference Registry"),
    ("POST", "/api/perplexity/research", "Perplexity Multi-Hop Research API", {"query": "Delaware C-Corp vs India Pvt Ltd"}),
    ("POST", "/api/v0/generate-ui", "v0 Live UI Code Synthesizer API", {"prompt": "Pricing tier bento", "theme": "midnight"}),
    ("POST", "/api/canvas/architecture", "M/M/1 Queueing Architecture Graph API", {"prompt": "AI RAG API", "target_rps": 3000}),
    ("POST", "/api/linear/sprint-forecast", "Monte Carlo Sprint Burnup API", {"backlog_points": 140, "target_sprints": 4}),
    ("POST", "/api/quant/analyze", "Black-Scholes Greeks & Kelly API", {"spot": 22450, "strike": 22500, "days_to_expiry": 30}),
    ("POST", "/api/climate/analyze", "Scope 1-3 GHG & FAO-56 Irrigation API", {"diesel_liters_yr": 15000, "crop": "wheat"}),
    ("POST", "/api/proptech/valuation", "DCF Cap-Rate & FSI Massing API", {"property_price_inr": 12500000, "monthly_rent_inr": 42000}),
    ("POST", "/api/stripe-atlas/incorporate", "Stripe Atlas & 83(b) Deadline API", {"grant_date": "2026-11-11", "founder_shares": 4000000}),
    ("POST", "/api/drugs/safety-matrix", "Pharmacokinetic RID% & Food-Drug API", {"drug": "atorvastatin", "maternal_dose_mg_day": 20}),
    ("POST", "/api/ketto/milestone-escrow", "Crowdfunding Milestone Tranche API", {"goal_inr": 1500000, "current_raised_inr": 420000}),
]

import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

print("=" * 70)
print(f"TESTING LIVE PRODUCTION DEPLOYMENT: {BASE_URL}")
print("=" * 70)

passed = 0
failed = 0
results = []

for item in TEST_ROUTES:
    method = item[0]
    path = item[1]
    name = item[2]
    payload = item[3] if len(item) > 3 else None

    url = f"{BASE_URL}{path}"
    headers = {
        "User-Agent": "SevenseedProductionVerifier/2.0",
        "Accept": "*/*"
    }
    data = None
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"

    t0 = time.time()
    try:
        req = urllib.request.Request(url, data=data, headers=headers, method=method)
        with urllib.request.urlopen(req, timeout=40) as resp:
            status = resp.status
            content = resp.read()
            duration = int((time.time() - t0) * 1000)

            is_ok = 200 <= status < 400
            if is_ok:
                passed += 1
                msg = f"[PASS] ({status}) {method:4s} {path:35s} - {duration:4d}ms | {name}"
            else:
                failed += 1
                msg = f"[FAIL] ({status}) {method:4s} {path:35s} - {duration:4d}ms | {name}"
            print(msg)
            results.append((is_ok, status, path, name, duration, len(content)))
    except urllib.error.HTTPError as e:
        duration = int((time.time() - t0) * 1000)
        failed += 1
        msg = f"[FAIL] ({e.code}) {method:4s} {path:35s} - {duration:4d}ms | {name} ({e.reason})"
        print(msg)
        results.append((False, e.code, path, name, duration, 0))
    except Exception as e:
        duration = int((time.time() - t0) * 1000)
        failed += 1
        msg = f"[ERR ] {method:4s} {path:35s} - {duration:4d}ms | {name}: {type(e).__name__} {e}"
        print(msg)
        results.append((False, 0, path, name, duration, 0))


print("\n" + "=" * 70)
print(f"LIVE TEST SUMMARY: {passed} PASSED, {failed} FAILED (Total: {len(TEST_ROUTES)})")
print("=" * 70)
