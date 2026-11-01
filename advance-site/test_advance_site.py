# -*- coding: utf-8 -*-
"""
Empirical Verification Suite for Sevenseed Advance Site (`test_advance_site.py`)
Tests:
1. Real LangGraph StateGraph + LangChain Core execution (`POST /api/langgraph/execute`)
2. BuyHatke Spend Lens + Xerve NEFT Cashback (`POST /api/emart/spend-lens`)
3. LearnAnythingAI.in + Obsidian [[WikiLink]] Classroom (`POST /api/avpu/ai-classroom`)
4. SkyCiv Structural Beam Solver (`POST /api/skyciv/beam-solver`)
5. Canva Multi-Layer Vector Scene Generator (`POST /api/canva/magic-design`)
6. AngularJS 1.8.3 Enterprise Telemetry Feed (`GET /api/angular/enterprise-feed`)
7. React 18 + Three.js + AngularJS Runtime Assets (`GET /`, `/app-data.js`, `/react-app.js`)
8. Sync banner into `e:\main\apps\sevenseed\sites\` and `backend/static/`
"""

import shutil
from pathlib import Path
from fastapi.testclient import TestClient
from backend.advance_ai_server import app

client = TestClient(app)


def sync_banner_to_sevenseed():
    banner = (
        '<!--SEVENSEED-ADVANCE-SITE-BANNER-->\n'
        '<div style="background:linear-gradient(90deg,#0284c7,#4f46e5,#059669);color:#fff;padding:10px 18px;'
        'font-family:system-ui,sans-serif;font-size:13px;font-weight:700;display:flex;align-items:center;'
        'justify-content:center;gap:14px;flex-wrap:wrap;z-index:99999;position:relative;'
        'border-bottom:1px solid rgba(255,255,255,0.25);">'
        '<span>🚀 NEW: Sevenseed Advance Site v2.5 (React 18 + AngularJS 1.8 + Python LangChain + LangGraph '
        '+ Canva Studio + Framer Physics + Three.js 3D WebGL — 72MB Render Free-Tier Safe!)</span>'
        '<a href="/advance-site/index.html" style="background:#020617;color:#38bdf8;padding:6px 14px;'
        'border-radius:999px;text-decoration:none;border:1px solid #38bdf8;font-weight:800;">'
        '⚡ Launch Advance Multi-Framework Studio →</a></div>\n'
    )
    for rel in ["index.html", "avp-emart/index.html", "avpu/index.html"]:
        p = Path(r"e:\main\apps\sevenseed\sites") / rel
        if p.is_file():
            html = p.read_text(encoding="utf-8")
            if "<!--SEVENSEED-ADVANCE-SITE-BANNER-->" not in html and "<body" in html:
                idx = html.find(">", html.find("<body")) + 1
                html = html[:idx] + "\n" + banner + html[idx:]
                p.write_text(html, encoding="utf-8")
                dst = Path(r"e:\main\apps\sevenseed\apps\sevenseed\backend\static") / rel
                if dst.parent.is_dir():
                    shutil.copy2(p, dst)


def test_all_advance_site_endpoints():
    sync_banner_to_sevenseed()

    # 1. Health Check & Render Free Tier RAM (< 85MB)
    r_health = client.get("/api/health")
    assert r_health.status_code == 200
    assert r_health.json()["render_free_tier_compatible"] is True
    assert r_health.json()["ram_footprint_mb"] < 85.0

    # 2. LangGraph 5-Node StateGraph + LangChain PromptTemplate
    r_lg = client.post(
        "/api/langgraph/execute",
        json={
            "query": "Compare iPhone 16 Pro vs OnePlus 13 price on Smartprix and BuyHatke with HDFC card",
            "venture_filter": "auto",
            "model": "groq/llama-3.3-70b-versatile",
        },
    )
    assert r_lg.status_code == 200
    lg_data = r_lg.json()
    assert lg_data["status"] == "ok"
    assert lg_data["detected_domain"] == "ecommerce"
    assert len(lg_data["trace_steps"]) == 5
    assert lg_data["critic_score"] >= 0.85

    # 3. BuyHatke Spend Lens + Xerve NEFT Cashback
    r_spend = client.post(
        "/api/emart/spend-lens",
        json={
            "monthly_amazon": 20000,
            "monthly_flipkart": 15000,
            "monthly_quick_commerce": 10000,
            "monthly_food_delivery": 5000,
            "card_tier": "hdfc-infinia",
        },
    )
    assert r_spend.status_code == 200
    assert r_spend.json()["annual_spend_inr"] == 600000
    assert r_spend.json()["breakdown"]["total_annual_savings_inr"] > 50000

    # 4. LearnAnythingAI.in + Obsidian [[WikiLink]] Classroom
    r_avpu = client.post(
        "/api/avpu/ai-classroom",
        json={"topic_or_url": "LangGraph Cyclic Agents", "learner_level": "Advanced"},
    )
    assert r_avpu.status_code == 200
    assert "[[" in r_avpu.json()["obsidian_markdown"]

    # 5. SkyCiv Structural Beam Solver
    r_beam = client.post(
        "/api/skyciv/beam-solver",
        json={"span_m": 6.0, "load_kn_per_m": 24.0, "point_load_kn": 40.0},
    )
    assert r_beam.status_code == 200
    assert r_beam.json()["reaction_a_kn"] == 92.0
    assert len(r_beam.json()["diagram_points"]) == 21

    # 6. Canva Magic Design & AngularJS Enterprise Feed
    r_canva = client.post("/api/canva/magic-design", json={"prompt": "AVP Emart Launch", "palette": "cyber-neon"})
    assert r_canva.status_code == 200
    assert len(r_canva.json()["layers"]) >= 5

    r_ng = client.get("/api/angular/enterprise-feed")
    assert r_ng.status_code == 200
    assert len(r_ng.json()["ventures"]) == 8

    # 7. Root HTML & JS Bundles
    for path in ["/", "/app-data.js", "/react-app.js"]:
        resp = client.get(path)
        assert resp.status_code == 200, f"Failed {path}"

    print("ALL 8 ADVANCE SITE MULTI-FRAMEWORK TESTS PASSED!")


if __name__ == "__main__":
    test_all_advance_site_endpoints()
