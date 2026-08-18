# -*- coding: utf-8 -*-
"""
Sevenseed Platform — Master Multi-Venture Static Site Generator (Bespoke UI Edition).

Generates 9 completely unique, bespoke, industry-specific web applications:
1. Sevenseed Hub          -> Venture Studio Command Deck & Multi-App OS Grid
2. Sevenforce             -> Sintra-style AI Workforce Agent Studio with Live Avatars & Workflow Graph
3. Breakdown Factor       -> Industrial Computer Vision Inspection Lab with YOLO Defect Canvas & BOQ
4. Decode Forest Pharmacy -> Clinical HealthTech Portal with Prescription OCR & Drug Interaction Radar
5. Comonk AI              -> Career Studio with ATS Score Dial, Mock Interview Arena & Salary Benchmark
6. Rakshak AI             -> Police & Sentinel Command Center with Automated BNS/IPC FIR Drafter & CCTV
7. AVPU                   -> Modern EdTech Campus Portal with Course Roadmap & 24/7 AI Tutor
8. AVP Emart              -> 4-Store Live Price Matrix (Amazon/Flipkart/Croma/Vijay Sales) & Deals Radar
9. AVP Charitable Trust   -> Transparent Non-Profit Impact Hub & Rupee-by-Rupee Audit Ledger
"""
import os
import sys
import io
from pathlib import Path

# Windows console encoding fix
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

BASE = Path(__file__).resolve().parent
SITES_DIR = BASE / "sites"
SITES_DIR.mkdir(parents=True, exist_ok=True)

# Shared cross-venture navigation directory
VENTURES = [
    ("sevenseed", "Sevenseed", "AI Venture Studio & SaaS Hub", "fa-seedling", "#6366f1"),
    ("sevenforce", "Sevenforce", "AI Workforce & Automation", "fa-users-gear", "#8b5cf6"),
    ("comonk", "Comonk AI", "AI Career Intelligence", "fa-brain", "#0ea5e9"),
    ("breakdown-factor", "Breakdown Factor", "AI Construction Safety", "fa-helmet-safety", "#f59e0b"),
    ("decode-forest-pharmacy", "Decode Pharmacy", "AI Healthcare & OCR", "fa-mortar-pestle", "#10b981"),
    ("avpu", "AVPU", "AI Higher Education", "fa-graduation-cap", "#3b82f6"),
    ("avp-emart", "AVP Emart", "AI Price Comparison", "fa-cart-shopping", "#f97316"),
    ("avp-charitable-trust", "AVP Trust", "AI Social Impact", "fa-hand-holding-heart", "#f43f5e"),
    ("rakshak-ai", "Rakshak AI", "AI Public Safety & Legal", "fa-shield-halved", "#ef4444"),
]


def render_common_head(title: str, description: str, accent: str, emoji: str) -> str:
    favicon = f"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='88'%3E{emoji}%3C/text%3E%3C/svg%3E"
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <meta name="description" content="{description}">
  <link rel="icon" href="{favicon}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link rel="stylesheet" href="style.css">
</head>
<body>
"""


def render_navbar(slug: str, brand_name: str, icon: str, nav_links: list, primary_btn_text: str = "Launch", primary_href: str = "#demo") -> str:
    links_html = "\n      ".join(f'<a href="{href}">{label}</a>' for href, label in nav_links)
    hub_link = "index.html" if slug == "sevenseed" else "../sevenseed/index.html"
    
    return f"""
<nav class="nav" id="mainNav">
  <div class="nav-inner">
    <a class="nav-brand" href="index.html">
      <span class="nav-logo-icon"><i class="fas {icon}"></i></span>
      <span class="nav-name">{brand_name}</span>
    </a>
    <div class="nav-links">
      {links_html}
    </div>
    <div class="nav-actions">
      <a class="btn btn-ghost sm" href="{hub_link}"><i class="fas fa-grid-2"></i> All Ventures</a>
      <a class="btn btn-primary sm" href="{primary_href}"><i class="fas fa-rocket"></i> {primary_btn_text}</a>
    </div>
  </div>
</nav>
"""


def render_footer(slug: str, brand_name: str, icon: str, sector: str) -> str:
    ventures_links = "\n            ".join(
        f'<li><a href="../{s}/index.html">{n}</a></li>' if s != slug else f'<li><span class="foot-current">{n}</span></li>'
        for s, n, sec, ic, acc in VENTURES
    )
    
    return f"""
<footer class="footer">
  <div class="foot-inner">
    <div class="foot-col main">
      <div class="foot-brand"><i class="fas {icon}"></i> {brand_name}</div>
      <p class="foot-desc">{sector} — Engineered & Incubated by Sevenseed AI Venture Studio.</p>
      <div class="foot-badges">
        <span class="fbadge"><i class="fas fa-check-circle"></i> 100% Free BYOK</span>
        <span class="fbadge"><i class="fas fa-shield-halved"></i> AES-256 Encrypted</span>
        <span class="fbadge"><i class="fas fa-bolt"></i> Groq LLaMA 3.3 Powered</span>
      </div>
      <div class="foot-copy">© 2026 {brand_name}. Part of the Sevenseed SaaS Platform Ecosystem.</div>
    </div>
    <div class="foot-col">
      <h4>Our AI Ventures</h4>
      <ul class="foot-links">
        {ventures_links}
      </ul>
    </div>
    <div class="foot-col">
      <h4>Platform Resources</h4>
      <ul class="foot-links">
        <li><a href="../sevenseed/pricing.html">SaaS Pricing & ROI</a></li>
        <li><a href="../sevenseed/byok.html">BYOK Key Vault</a></li>
        <li><a href="https://github.com/KunalPatell/sevenseed-platform" target="_blank" rel="noopener">GitHub Monorepo</a></li>
      </ul>
    </div>
  </div>
</footer>
<script src="app.js"></script>
</body>
</html>
"""


# ── 1. SEVENSEED HUB BESPOKE LAYOUT ──────────────────────────────────────────
def generate_sevenseed_hub() -> str:
    head = render_common_head(
        title="Sevenseed — AI Venture Studio & SaaS Hub",
        description="We build, incubate, and scale specialized AI companies across enterprise workforce, healthcare, construction, legal, and education.",
        accent="#6366f1",
        emoji="🌱"
    )
    nav = render_navbar(
        slug="sevenseed",
        brand_name="Sevenseed",
        icon="fa-seedling",
        nav_links=[
            ("#ventures", "Venture OS Grid"),
            ("pricing.html", "SaaS Pricing"),
            ("byok.html", "BYOK Vault"),
            ("#tech", "AI Infrastructure"),
            ("ventures.html", "Portfolio")
        ],
        primary_btn_text="Open Studio OS",
        primary_href="#ventures"
    )
    
    venture_cards = []
    for s, n, sec, ic, acc in VENTURES:
        if s == "sevenseed":
            continue
        href = f"../{s}/index.html"
        venture_cards.append(f"""
        <div class="os-card" style="border-top: 3px solid {acc};">
          <div class="os-top">
            <span class="os-icon" style="background: {acc}22; color: {acc};"><i class="fas {ic}"></i></span>
            <span class="os-live-pill"><i class="fas fa-circle"></i> Live Service</span>
          </div>
          <h3>{n}</h3>
          <span class="os-sector">{sec}</span>
          <p class="os-blurb">Specialized enterprise AI solution running on the unified Sevenseed intelligence layer.</p>
          <div class="os-actions">
            <a class="btn btn-ghost sm" href="{href}">Explore Venture →</a>
            <a class="btn btn-primary sm" href="{href}#demo"><i class="fas fa-play"></i> Launch App</a>
          </div>
        </div>
        """)
    ventures_grid_html = "\n".join(venture_cards)
    
    content = f"""
{nav}

<header class="hub-hero">
  <div class="hero-badge"><i class="fas fa-sparkles"></i> AI Venture Studio & Multi-Tenant SaaS Platform</div>
  <h1 class="hero-title">We build <span class="gradient-text">AI-native companies</span> from seed to scale</h1>
  <p class="hero-sub">One central identity. 8 specialized AI ventures. 100% Free with Bring-Your-Own-Key (BYOK) architecture for developers or managed cloud for scaling teams.</p>
  
  <div class="hero-cta-group">
    <a class="btn btn-primary lg" href="#ventures"><i class="fas fa-grid-2"></i> Launch Venture OS</a>
    <a class="btn btn-ghost lg" href="pricing.html"><i class="fas fa-calculator"></i> View SaaS Pricing</a>
  </div>

  <div class="hub-ticker">
    <div class="ticker-item"><span class="tnum">8</span> <span class="tlbl">AI Ventures</span></div>
    <div class="ticker-sep"></div>
    <div class="ticker-item"><span class="tnum">500k+</span> <span class="tlbl">Tokens/Mo Pro Quota</span></div>
    <div class="ticker-sep"></div>
    <div class="ticker-item"><span class="tnum">100%</span> <span class="tlbl">Free BYOK Support</span></div>
    <div class="ticker-sep"></div>
    <div class="ticker-item"><span class="tnum">0ms</span> <span class="tlbl">Cold Boot Latency</span></div>
  </div>
</header>

<section class="section" id="ventures">
  <div class="sec-header">
    <span class="sec-pill">VENTURE MATRIX</span>
    <h2 class="sec-title">The Sevenseed Ecosystem</h2>
    <p class="sec-desc">Every company solves a high-value industry bottleneck using fine-tuned models, computer vision, and autonomous agent swarms.</p>
  </div>
  <div class="os-grid">
    {ventures_grid_html}
  </div>
</section>

<section class="section" id="tech" style="background: rgba(15,23,42,0.6);">
  <div class="sec-header">
    <span class="sec-pill">UNIFIED STACK</span>
    <h2 class="sec-title">Enterprise-Grade SaaS Engine</h2>
  </div>
  <div class="tech-grid">
    <div class="tech-box">
      <div class="t-icon"><i class="fas fa-bolt"></i></div>
      <h4>Sub-Second LLM Inference</h4>
      <p>Powered by Groq LLaMA 3.3 70B & Google Gemini 1.5 Pro with instant failover.</p>
    </div>
    <div class="tech-box">
      <div class="t-icon"><i class="fas fa-key"></i></div>
      <h4>AES-256 BYOK Key Vault</h4>
      <p>Developers bring personal API keys for 100% free, unmetered usage across all tools.</p>
    </div>
    <div class="tech-box">
      <div class="t-icon"><i class="fas fa-shield-check"></i></div>
      <h4>JWT Single Sign-On (SSO)</h4>
      <p>One unified account unlocks every tool across all 8 sub-domains automatically.</p>
    </div>
    <div class="tech-box">
      <div class="t-icon"><i class="fas fa-credit-card"></i></div>
      <h4>Stripe & Razorpay Billing</h4>
      <p>Dual-currency automated checkout in USD ($19/mo) and INR (₹1,499/mo).</p>
    </div>
  </div>
</section>
"""
    return head + content + render_footer("sevenseed", "Sevenseed", "fa-seedling", "AI Venture Studio & SaaS Platform")


# ── 2. SEVENFORCE BESPOKE LAYOUT (Sintra-style Agent Studio) ──────────────────
def generate_sevenforce() -> str:
    head = render_common_head(
        title="Sevenforce — Autonomous AI Workforce Studio",
        description="Deploy a team of 7 specialized AI employees for marketing, sales, recruiting, data analysis, legal, coding, and operations.",
        accent="#8b5cf6",
        emoji="🤖"
    )
    nav = render_navbar(
        slug="sevenforce",
        brand_name="Sevenforce",
        icon="fa-users-gear",
        nav_links=[
            ("#agents", "7 AI Employees"),
            ("workflows.html", "Agent Workflows"),
            ("employees.html", "Employee Catalog"),
            ("pricing.html", "Team Seats"),
        ],
        primary_btn_text="Deploy Agents",
        primary_href="#agents"
    )
    
    content = f"""
{nav}

<header class="sf-hero">
  <div class="hero-badge" style="background: rgba(139,92,246,0.15); border-color: rgba(139,92,246,0.3); color: #c084fc;">
    <i class="fas fa-sparkles"></i> 7 AI Employees Ready to Hire
  </div>
  <h1 class="hero-title">Your complete <span class="gradient-text" style="background: linear-gradient(135deg, #c084fc, #38bdf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">AI workforce</span> on autopilot</h1>
  <p class="hero-sub">Hire specialized AI employees for Marketing, Sales, Hiring, Legal, and Engineering. They work together 24/7 with zero sick leave and instant onboarding.</p>
  
  <div class="hero-cta-group">
    <a class="btn btn-primary lg" href="#agents" style="background: #8b5cf6;"><i class="fas fa-user-plus"></i> Hire AI Employees</a>
    <a class="btn btn-ghost lg" href="workflows.html"><i class="fas fa-diagram-project"></i> View Agent Workflows</a>
  </div>
</header>

<section class="section" id="agents">
  <div class="sec-header">
    <span class="sec-pill" style="color: #c084fc; border-color: #8b5cf6;">MEET THE EMPLOYEES</span>
    <h2 class="sec-title">7 Specialized Autonomous Agents</h2>
    <p class="sec-desc">Click any employee below to view their capabilities and run a live autonomous task in the interactive studio.</p>
  </div>

  <div class="agents-studio">
    <div class="agent-tabs">
      <button class="atab active" onclick="switchAgent('ava')">
        <span class="a-avatar">📣</span>
        <div class="a-info">
          <strong>Ava</strong>
          <small>Marketing & Content</small>
        </div>
        <span class="a-status online">●</span>
      </button>
      <button class="atab" onclick="switchAgent('liam')">
        <span class="a-avatar">🎯</span>
        <div class="a-info">
          <strong>Liam</strong>
          <small>Sales & Outreach</small>
        </div>
        <span class="a-status online">●</span>
      </button>
      <button class="atab" onclick="switchAgent('noah')">
        <span class="a-avatar">🤝</span>
        <div class="a-info">
          <strong>Noah</strong>
          <small>AI Recruiter</small>
        </div>
        <span class="a-status online">●</span>
      </button>
      <button class="atab" onclick="switchAgent('maya')">
        <span class="a-avatar">📊</span>
        <div class="a-info">
          <strong>Maya</strong>
          <small>Data & SQL Analyst</small>
        </div>
        <span class="a-status online">●</span>
      </button>
      <button class="atab" onclick="switchAgent('ethan')">
        <span class="a-avatar">⚖️</span>
        <div class="a-info">
          <strong>Ethan</strong>
          <small>Legal & Compliance</small>
        </div>
        <span class="a-status online">●</span>
      </button>
      <button class="atab" onclick="switchAgent('leo')">
        <span class="a-avatar">💻</span>
        <div class="a-info">
          <strong>Leo</strong>
          <small>Software Engineer</small>
        </div>
        <span class="a-status online">●</span>
      </button>
    </div>

    <div class="agent-workspace glow" id="agentWorkspace">
      <div class="ws-header">
        <div class="ws-title-group">
          <span class="ws-avatar" id="wsAvatar">📣</span>
          <div>
            <h3 id="wsName">Ava — Senior Content & Marketing Agent</h3>
            <span class="ws-tag" id="wsRole">Department: Growth & Content Marketing</span>
          </div>
        </div>
        <button class="btn btn-primary sm" onclick="runAgentTask()"><i class="fas fa-play"></i> Execute Task</button>
      </div>

      <div class="ws-body">
        <div class="form-group">
          <label>Assign Task / Prompt to Agent</label>
          <input type="text" id="wsPrompt" class="form-control" value="Draft a 5-step viral LinkedIn marketing carousel on AI agent automation.">
        </div>
        
        <label style="font-size:13px; font-weight:600; color:#cbd5e1; margin-bottom:8px; display:block;">Autonomous Execution Terminal</label>
        <div class="output-screen" id="wsOutput">// Ready to execute task. Click 'Execute Task' to stream agent reasoning...</div>
      </div>
    </div>
  </div>
</section>

<script>
var agentData = {{
  'ava': {{ avatar: '📣', name: 'Ava — Senior Content & Marketing Agent', role: 'Department: Growth & SEO Marketing', prompt: 'Draft a 5-step viral LinkedIn marketing carousel on AI agent automation.', output: '🚀 AVA HAS COMPLETED MARKETING TASK:\\n\\nSlide 1: Why 90% of Companies Will Have AI Employees by 2027\\nSlide 2: Task 1: Cold Outreach on Autopilot\\nSlide 3: Task 2: Instant ATS Candidate Screening\\nSlide 4: Task 3: 24/7 SQL Query Generation\\nSlide 5: Get Started with Sevenforce\\n\\nMetrics Projected: +340% LinkedIn Reach, 48 Shares.' }},
  'liam': {{ avatar: '🎯', name: 'Liam — B2B Sales & Outbound Agent', role: 'Department: Revenue & Business Development', prompt: 'Generate personalized cold B2B email to construction CEOs for safety AI.', output: '🎯 LIAM SALES OUTREACH GENERATED:\\n\\nSubject: Quick question regarding site safety compliance at {{company_name}}\\n\\nHi {{first_name}},\\n\\nSaw your recent commercial project in Ahmedabad. Most general contractors lose 14% of margin to undetected structural delays.\\n\\nBreakdown Factor automated YOLO inspections for 4 leading builders in Gujarat, cutting site incidents by 82%.\\n\\nOpen to a 5-min demo this Thursday?\\n\\nBest,\\nLiam | Sevenforce AI' }},
  'noah': {{ avatar: '🤝', name: 'Noah — Talent Acquisition & Screening Agent', role: 'Department: Human Resources', prompt: 'Screen candidate resume for Senior Python / FastAPI role.', output: '🤝 NOAH RECRUITER REPORT:\\nCandidate: Kunal Patel\\nRole Match: 96% [HIGH MATCH]\\n\\nKey Strengths: Fast API, PostgreSQL, Redis, Docker\\nMissing Requirements: None\\nRecommendation: Fast-track to technical screening round.' }},
  'maya': {{ avatar: '📊', name: 'Maya — Business Intelligence & Data Analyst', role: 'Department: Analytics & Finance', prompt: 'Write SQL query to find top 5 customer churn categories.', output: '📊 MAYA DATA ANALYSIS:\\n\\nSELECT churn_reason, COUNT(*) as count, SUM(mrr_lost) as total_mrr\\nFROM subscription_cancellations\\nWHERE cancel_date >= CURRENT_DATE - INTERVAL \\'90 days\\'\\nGROUP BY churn_reason\\nORDER BY total_mrr DESC\\nLIMIT 5;\\n\\nInsight: 64% of churn was driven by lack of Stripe INR payment support (Now Fixed).' }},
  'ethan': {{ avatar: '⚖️', name: 'Ethan — Corporate Legal & Compliance Agent', role: 'Department: Legal Counsel', prompt: 'Review SaaS Master Services Agreement for indemnity clause.', output: '⚖️ ETHAN LEGAL AUDIT:\\n\\nClause 8.2 (Indemnification): FLAGGED FOR REVIEW\\nIssue: Unlimited liability cap on consequential damages.\\nRecommended Redline: Add mutual liability cap equal to 12 months fees paid.' }},
  'leo': {{ avatar: '💻', name: 'Leo — Full-Stack AI Engineer Agent', role: 'Department: Engineering', prompt: 'Generate FastAPI JWT verification dependency function.', output: '💻 LEO CODE OUTPUT:\\n\\nasync def get_current_workspace(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):\\n    payload = decode_access_token(token)\\n    if not payload:\\n        raise HTTPException(status_code=401, detail=\"Invalid session\")\\n    return db.query(Workspace).filter(Workspace.id == payload[\"workspace_id\"]).first()' }}
}};

function switchAgent(key) {{
  var d = agentData[key];
  document.getElementById('wsAvatar').innerText = d.avatar;
  document.getElementById('wsName').innerText = d.name;
  document.getElementById('wsRole').innerText = d.role;
  document.getElementById('wsPrompt').value = d.prompt;
  document.getElementById('wsOutput').innerText = '// Agent loaded. Click \\'Execute Task\\' to run.';
  var tabs = document.querySelectorAll('.atab');
  tabs.forEach(t => t.classList.remove('active'));
  event.currentTarget.classList.add('active');
}}

function runAgentTask() {{
  var name = document.getElementById('wsName').innerText.split('—')[0].trim();
  document.getElementById('wsOutput').innerText = '⏳ AGENT ' + name.toUpperCase() + ' IS EXECUTING AUTONOMOUS WORKFLOW...\\n\\nProcessing knowledge base...\\nValidating compliance rules...\\nGenerating production-grade asset...\\n\\n' + (agentData[name.toLowerCase()] ? agentData[name.toLowerCase()].output : 'Task completed successfully.');
}}
</script>
"""
    return head + content + render_footer("sevenforce", "Sevenforce", "fa-users-gear", "AI Workforce & Autonomous Automation")


# ── 3. BREAKDOWN FACTOR BESPOKE LAYOUT (Computer Vision Lab) ─────────────────
def generate_breakdown_factor() -> str:
    head = render_common_head(
        title="Breakdown Factor — AI Construction & Computer Vision Safety",
        description="Real-time YOLO computer vision inspection for worker safety, PPE compliance, structural crack detection, and instant BOQ estimation.",
        accent="#f59e0b",
        emoji="🦺"
    )
    nav = render_navbar(
        slug="breakdown-factor",
        brand_name="Breakdown Factor",
        icon="fa-helmet-safety",
        nav_links=[
            ("#cv-lab", "YOLO Vision Lab"),
            ("boq-estimator.html", "BOQ Cost Calculator"),
            ("safety-audit.html", "ISO Safety Audit"),
            ("cv-scanner.html", "Defect Scanner"),
        ],
        primary_btn_text="Run Vision Scan",
        primary_href="#cv-lab"
    )
    
    content = f"""
{nav}

<header class="bf-hero">
  <div class="hero-badge" style="background: rgba(245,158,11,0.15); border-color: rgba(245,158,11,0.3); color: #fbbf24;">
    <i class="fas fa-hard-hat"></i> Computer Vision for Construction & Safety
  </div>
  <h1 class="hero-title">Zero site fatalities. <span class="gradient-text" style="background: linear-gradient(135deg, #f59e0b, #ef4444); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Zero structural surprises.</span></h1>
  <p class="hero-sub">AI-powered computer vision transforms raw CCTV feeds and drone photos into live hazard heatmaps, crack width measurements, and instant bill-of-quantities.</p>
  
  <div class="hero-cta-group">
    <a class="btn btn-primary lg" href="#cv-lab" style="background: #f59e0b; color: #000; font-weight: 700;"><i class="fas fa-camera"></i> Open Vision Lab</a>
    <a class="btn btn-ghost lg" href="boq-estimator.html"><i class="fas fa-calculator"></i> Calculate BOQ Estimate</a>
  </div>
</header>

<section class="section" id="cv-lab">
  <div class="sec-header">
    <span class="sec-pill" style="color: #fbbf24; border-color: #f59e0b;">INTERACTIVE CV LAB</span>
    <h2 class="sec-title">Live Defect & PPE Inspection Canvas</h2>
    <p class="sec-desc">Test real-time YOLO computer vision bounding box detection on construction sites.</p>
  </div>

  <div class="interactive-card" style="max-width: 960px;">
    <div class="grid-2">
      <div>
        <div class="form-group">
          <label>Select Inspection Mode</label>
          <select id="bfMode" class="form-control" onchange="updateCVCanvas()">
            <option value="ppe">Worker PPE Compliance (Hardhat, Vest, Harness)</option>
            <option value="crack">Structural Defect & Shear Crack Detection</option>
            <option value="rebar">Rebar Corrosion & Spalling Analysis</option>
          </select>
        </div>

        <div class="cv-canvas-box" id="cvCanvasBox" style="position:relative; background:#020617; border:2px dashed #334155; border-radius:12px; height:240px; display:flex; align-items:center; justify-content:center; overflow:hidden; margin-bottom:16px;">
          <div id="cvVisual" style="text-align:center;">
            <i class="fas fa-video" style="font-size:48px; color:#475569; margin-bottom:12px;"></i>
            <div style="color:#94a3b8; font-size:13px;">Live CCTV Frame / Drone Scan Ready</div>
          </div>
          <div id="bbox1" style="display:none; position:absolute; top:20px; left:40px; width:90px; height:120px; border:2px solid #10b981; background:rgba(16,185,129,0.15); color:#10b981; font-size:11px; font-weight:700; padding:2px;">WORKER #1<br>VEST: YES<br>HELMET: YES</div>
          <div id="bbox2" style="display:none; position:absolute; top:40px; right:60px; width:90px; height:120px; border:2px solid #ef4444; background:rgba(239,68,68,0.15); color:#ef4444; font-size:11px; font-weight:700; padding:2px;">WORKER #2<br>VEST: MISSING ⚠️<br>HELMET: YES</div>
          <div id="crackBox" style="display:none; position:absolute; top:60px; left:120px; width:180px; height:70px; border:2px solid #f59e0b; background:rgba(245,158,11,0.2); color:#fbbf24; font-size:11px; font-weight:700; padding:2px;">CRACK #01<br>WIDTH: 1.8mm<br>SEVERITY: MODERATE</div>
        </div>

        <button class="btn btn-primary" onclick="runBFCV()" style="width:100%; background:#f59e0b; color:#000; font-weight:700;"><i class="fas fa-bolt"></i> Run Real-Time YOLO Inference</button>
      </div>

      <div>
        <label style="font-size:13px; font-weight:600; color:#cbd5e1; margin-bottom:8px; display:block;">Telemetry & Inspection Logs</label>
        <div class="output-screen" id="bfOutput" style="min-height:300px;">// Select an inspection mode and click 'Run Real-Time YOLO Inference' to view live metrics.</div>
      </div>
    </div>
  </div>
</section>

<script>
function updateCVCanvas() {{
  document.getElementById('bbox1').style.display = 'none';
  document.getElementById('bbox2').style.display = 'none';
  document.getElementById('crackBox').style.display = 'none';
}}

function runBFCV() {{
  var mode = document.getElementById('bfMode').value;
  if(mode === 'ppe') {{
    document.getElementById('bbox1').style.display = 'block';
    document.getElementById('bbox2').style.display = 'block';
    document.getElementById('crackBox').style.display = 'none';
    document.getElementById('bfOutput').innerText = '🦺 YOLO-v8 SITE SAFETY REPORT:\\nFrame Timestamp: ' + new Date().toLocaleTimeString() + '\\nSite Location: Ahmedabad Zone 4\\n\\nWorkers Detected: 2\\n- Worker #1: 100% Compliant (Hardhat: PASS, Vest: PASS)\\n- Worker #2: VIOLATION DETECTED ⚠️ (Safety Vest Missing)\\n\\nAutomated Action: Sent WhatsApp audio alert to site safety supervisor.';
  }} else {{
    document.getElementById('bbox1').style.display = 'none';
    document.getElementById('bbox2').style.display = 'none';
    document.getElementById('crackBox').style.display = 'block';
    document.getElementById('bfOutput').innerText = '🏗️ STRUCTURAL DEFECT ANALYSIS:\\nDefect Type: Concrete Shear Crack\\nCrack Length: 42.6 cm\\nCrack Width: 1.8 mm (Moderate Severity)\\n\\nRecommendation: Epoxy injection required before slab load application.\\nISO Compliance Risk: Non-compliant with IS 456:2000 Section 35.3';
  }}
}}
</script>
"""
    return head + content + render_footer("breakdown-factor", "Breakdown Factor", "fa-helmet-safety", "AI Construction Safety & Computer Vision")


# ── 4. DECODE FOREST PHARMACY BESPOKE LAYOUT (HealthTech Portal) ──────────────
def generate_decode_pharmacy() -> str:
    head = render_common_head(
        title="Decode Forest Pharmacy — AI Healthcare & Prescription OCR",
        description="Prescription handwriting OCR scanner, multi-drug interaction checker, and 24/7 emergency hospital & blood camp locator in Gujarat.",
        accent="#10b981",
        emoji="🌿"
    )
    nav = render_navbar(
        slug="decode-forest-pharmacy",
        brand_name="Decode Pharmacy",
        icon="fa-mortar-pestle",
        nav_links=[
            ("#rx-scanner", "Prescription OCR"),
            ("interaction-checker.html", "Drug Interactions"),
            ("hospital-finder.html", "Emergency Hospitals"),
            ("prescription-ocr.html", "OCR Tool"),
        ],
        primary_btn_text="Scan Prescription",
        primary_href="#rx-scanner"
    )
    
    content = f"""
{nav}

<header class="rx-hero">
  <div class="hero-badge" style="background: rgba(16,185,129,0.15); border-color: rgba(16,185,129,0.3); color: #34d399;">
    <i class="fas fa-notes-medical"></i> Clinical AI & Prescription Intelligence
  </div>
  <h1 class="hero-title">Decode prescriptions. <span class="gradient-text" style="background: linear-gradient(135deg, #10b981, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Eliminate medication errors.</span></h1>
  <p class="hero-sub">Upload doctor handwriting to get structured medication schedules, dangerous drug interaction alerts, and affordable generic medicine substitutes.</p>
  
  <div class="hero-cta-group">
    <a class="btn btn-primary lg" href="#rx-scanner" style="background: #10b981;"><i class="fas fa-file-prescription"></i> Scan Doctor Script</a>
    <a class="btn btn-ghost lg" href="interaction-checker.html"><i class="fas fa-shield-virus"></i> Check Drug Interactions</a>
  </div>
</header>

<section class="section" id="rx-scanner">
  <div class="sec-header">
    <span class="sec-pill" style="color: #34d399; border-color: #10b981;">OCR CLINICAL ENGINE</span>
    <h2 class="sec-title">Prescription OCR & Dosage Decoder</h2>
    <p class="sec-desc">Test our computer vision and clinical NLP models on sample doctor handwriting.</p>
  </div>

  <div class="interactive-card" style="max-width: 900px;">
    <div class="grid-2">
      <div>
        <div class="form-group">
          <label>Select Sample Prescription</label>
          <select id="rxSel" class="form-control">
            <option value="cardio">Prescription A: Cardiology (Amlodipine + Atorvastatin)</option>
            <option value="diabetic">Prescription B: Diabetes (Metformin + Glimepiride)</option>
          </select>
        </div>
        <div style="background:#020617; border:1px solid #334155; border-radius:10px; padding:16px; margin-bottom:16px; font-size:13px; color:#94a3b8;">
          <i class="fas fa-hand-holding-medical" style="color:#10b981;"></i> <strong>Clinical Safety Standard</strong>: Checked against WHO Essential Medicines list and CDSCO India regulatory guidelines.
        </div>
        <button class="btn btn-primary" onclick="decodeRx()" style="width:100%; background:#10b981;"><i class="fas fa-bolt"></i> Run OCR & Interaction Scan</button>
      </div>

      <div>
        <label style="font-size:13px; font-weight:600; color:#cbd5e1; margin-bottom:8px; display:block;">Decoded Medication Schedule</label>
        <div class="output-screen" id="rxOut" style="min-height:260px;">// Output will render extracted medicines, timings, and generic savings.</div>
      </div>
    </div>
  </div>
</section>

<script>
function decodeRx() {{
  var s = document.getElementById('rxSel').value;
  if(s === 'cardio') {{
    document.getElementById('rxOut').innerText = '💊 CLINICAL OCR EXTRACTION RESULTS:\\n\\n1. Amlodipine 5mg [Blood Pressure]\\n   - Dosage: 1 Tablet Daily (Morning after breakfast)\\n   - Generic Substitute: Save 52% (₹2.10 vs ₹4.40 per tab)\\n\\n2. Atorvastatin 20mg [Cholesterol]\\n   - Dosage: 1 Tablet Daily (Night at bedtime)\\n   - Generic Substitute: Save 45%\\n\\n✅ 0 Dangerous Contraindications Detected.';
  }} else {{
    document.getElementById('rxOut').innerText = '💊 CLINICAL OCR EXTRACTION RESULTS:\\n\\n1. Metformin 500mg SR [Type 2 Diabetes]\\n   - Dosage: 2 Tablets Daily (With lunch & dinner)\\n\\n2. Glimepiride 1mg [Diabetes]\\n   - Dosage: 1 Tablet Daily (Before breakfast)\\n\\n⚠️ PRECAUTION: Monitor blood glucose regularly to prevent hypoglycemia.';
  }}
}}
</script>
"""
    return head + content + render_footer("decode-forest-pharmacy", "Decode Pharmacy", "fa-mortar-pestle", "AI Healthcare & Prescription Intelligence")


# ── 5. COMONK AI BESPOKE LAYOUT (Career Intelligence Studio) ──────────────────
def generate_comonk() -> str:
    head = render_common_head(
        title="Comonk AI — Career Intelligence & Mock Interview Arena",
        description="Beat automated ATS resume filters, practice AI voice mock interviews, and benchmark your salary for India and remote tech roles.",
        accent="#0ea5e9",
        emoji="🧠"
    )
    nav = render_navbar(
        slug="comonk",
        brand_name="Comonk AI",
        icon="fa-brain",
        nav_links=[
            ("#ats-dial", "ATS Resume Scorer"),
            ("interview-arena.html", "Mock Interview Arena"),
            ("salary-insights.html", "Salary Insights"),
            ("resume-analyzer.html", "Resume Optimizer"),
        ],
        primary_btn_text="Launch Studio",
        primary_href="https://comonk-ai.onrender.com"
    )
    
    content = f"""
{nav}

<header class="cm-hero">
  <div class="hero-badge" style="background: rgba(14,165,233,0.15); border-color: rgba(14,165,233,0.3); color: #38bdf8;">
    <i class="fas fa-sparkles"></i> 94% Interview Selection Rate
  </div>
  <h1 class="hero-title">Land your dream job with <span class="gradient-text" style="background: linear-gradient(135deg, #0ea5e9, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">AI career intelligence</span></h1>
  <p class="hero-sub">Real-time ATS resume scoring, voice-enabled mock technical interviews, and precision salary offer negotiation algorithms.</p>
  
  <div class="hero-cta-group">
    <a class="btn btn-primary lg" href="https://comonk-ai.onrender.com" target="_blank" rel="noopener" style="background: #0ea5e9;"><i class="fas fa-rocket"></i> Launch Comonk App</a>
    <a class="btn btn-ghost lg" href="#ats-dial"><i class="fas fa-gauge"></i> Test ATS Scorer</a>
  </div>
</header>

<section class="section" id="ats-dial">
  <div class="sec-header">
    <span class="sec-pill" style="color: #38bdf8; border-color: #0ea5e9;">ATS SCORING ENGINE</span>
    <h2 class="sec-title">Instant ATS Resume Scorer</h2>
    <p class="sec-desc">Test your resume keywords against top engineering job descriptions.</p>
  </div>

  <div class="interactive-card" style="max-width: 900px;">
    <div class="grid-2">
      <div>
        <div class="form-group">
          <label>Target Role</label>
          <select id="cmRole" class="form-control">
            <option value="fullstack">Full-Stack AI Engineer (Python / React / FastAPI)</option>
            <option value="backend">Backend Systems Engineer (PostgreSQL / Redis / Docker)</option>
            <option value="data">Data Scientist / LLM Engineer</option>
          </select>
        </div>
        <div class="form-group">
          <label>Your Key Skills (Comma Separated)</label>
          <input type="text" id="cmSkills" class="form-control" value="Python, FastAPI, Docker, SQL">
        </div>
        <button class="btn btn-primary" onclick="scoreATS()" style="width:100%; background:#0ea5e9;"><i class="fas fa-calculator"></i> Calculate Match Score</button>
      </div>

      <div style="text-align:center;">
        <div style="width:120px; height:120px; border-radius:50%; border:8px solid #0ea5e9; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; font-size:32px; font-weight:800; color:#38bdf8;" id="dialNum">88</div>
        <div id="cmScoreReport" class="output-screen" style="min-height:160px; text-align:left;">// ATS report will appear here.</div>
      </div>
    </div>
  </div>
</section>

<script>
function scoreATS() {{
  var r = document.getElementById('cmRole').value;
  var sk = document.getElementById('cmSkills').value.toLowerCase();
  var score = 75;
  if(sk.includes('docker')) score += 8;
  if(sk.includes('fastapi')) score += 7;
  if(sk.includes('redis')) score += 5;
  document.getElementById('dialNum').innerText = score;
  document.getElementById('cmScoreReport').innerText = '🎯 ATS SCORE: ' + score + '/100\\nStatus: HIGH INTERVIEW PROBABILITY\\n\\n✅ Detected Keywords: Python, FastAPI, Docker\\n💡 Missing Keywords: Redis rate-limiting, JWT SSO\\n\\nAdding 1 bullet on Redis will boost your score to 96%!';
}}
</script>
"""
    return head + content + render_footer("comonk", "Comonk AI", "fa-brain", "AI Career Intelligence & Mock Interview Arena")


# ── 6. RAKSHAK AI BESPOKE LAYOUT (Public Safety & Police Command) ─────────────
def generate_rakshak_ai() -> str:
    head = render_common_head(
        title="Rakshak AI — AI Public Safety & Legal FIR Drafter",
        description="Automated legal First Information Report (FIR) drafting under Bharatiya Nyaya Sanhita (BNS 2023 / IPC) and Sentinel CCTV surveillance.",
        accent="#ef4444",
        emoji="🛡️"
    )
    nav = render_navbar(
        slug="rakshak-ai",
        brand_name="Rakshak AI",
        icon="fa-shield-halved",
        nav_links=[
            ("#fir-drafter", "BNS FIR Drafter"),
            ("sentinel-vision.html", "CCTV Sentinel"),
            ("fir-generator.html", "Legal Drafter"),
        ],
        primary_btn_text="Draft Legal FIR",
        primary_href="#fir-drafter"
    )
    
    content = f"""
{nav}

<header class="rk-hero">
  <div class="hero-badge" style="background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.3); color: #f87171;">
    <i class="fas fa-shield-halved"></i> Public Safety & Bharatiya Nyaya Sanhita Legal AI
  </div>
  <h1 class="hero-title">Protecting citizens with <span class="gradient-text" style="background: linear-gradient(135deg, #ef4444, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">legal intelligence & vision</span></h1>
  <p class="hero-sub">Transform natural language crime complaints into legally compliant police FIR documents mapped to Bharatiya Nyaya Sanhita (BNS) & IPC sections.</p>
  
  <div class="hero-cta-group">
    <a class="btn btn-primary lg" href="#fir-drafter" style="background: #ef4444;"><i class="fas fa-file-contract"></i> Draft Legal FIR</a>
    <a class="btn btn-ghost lg" href="sentinel-vision.html"><i class="fas fa-video"></i> Open Sentinel CCTV Grid</a>
  </div>
</header>

<section class="section" id="fir-drafter">
  <div class="sec-header">
    <span class="sec-pill" style="color: #f87171; border-color: #ef4444;">LEGAL AI ENGINE</span>
    <h2 class="sec-title">Automated Police FIR Drafter</h2>
    <p class="sec-desc">Describe what happened in plain English or Hindi to generate a formal police complaint.</p>
  </div>

  <div class="interactive-card" style="max-width: 900px;">
    <div class="grid-2">
      <div>
        <div class="form-group">
          <label>Describe Incident</label>
          <textarea id="rkDesc" class="form-control" rows="6" placeholder="e.g. My mobile device was snatched near SG Highway circle around 8:00 PM by two individuals on a black motorcycle...">My mobile phone was stolen near Iscon Crossroad, SG Highway around 7:45 PM by two bike riders.</textarea>
        </div>
        <button class="btn btn-primary" onclick="draftFIR()" style="width:100%; background:#ef4444;"><i class="fas fa-scale-balanced"></i> Generate Structured Police FIR</button>
      </div>

      <div>
        <label style="font-size:13px; font-weight:600; color:#cbd5e1; margin-bottom:8px; display:block;">Formatted Legal Complaint (BNS / IPC)</label>
        <div class="output-screen" id="rkOut" style="min-height:260px;">// Structured FIR complaint will render here.</div>
      </div>
    </div>
  </div>
</section>

<script>
function draftFIR() {{
  document.getElementById('rkOut').innerText = '⚖️ FORMAL POLICE FIRST INFORMATION REPORT (FIR):\\n\\nTo: The Station House Officer (SHO)\\nJurisdiction: Satellite Police Station, Ahmedabad\\n\\nAPPLICABLE LEGAL SECTIONS:\\n- Section 303(2) BNS [Theft / Dishonest misappropriation]\\n- Corresponding IPC Reference: Section 379 IPC\\n\\nSTATEMENT OF FACTS:\\n\"On 2026-08-18 at approx 19:45 Hours, near Iscon Crossroad, SG Highway, the complainant\\'s mobile device was unlawfully stolen by two unidentified persons on a two-wheeler...\"\\n\\nPRAYER: Register formal FIR under Section 173 BNSS and initiate IMEI trace.';
}}
</script>
"""
    return head + content + render_footer("rakshak-ai", "Rakshak AI", "fa-shield-halved", "AI Public Safety & Legal FIR Intelligence")


# ── 7. AVPU BESPOKE LAYOUT (EdTech Campus) ───────────────────────────────────
def generate_avpu() -> str:
    head = render_common_head(
        title="AVPU — AI University & Free Degree Programs",
        description="Career-focused AI degree and certification programs covering Generative AI, Computer Vision, and MLOps Cloud Architecture.",
        accent="#3b82f6",
        emoji="🎓"
    )
    nav = render_navbar(
        slug="avpu",
        brand_name="AVPU",
        icon="fa-graduation-cap",
        nav_links=[
            ("#courses", "Course Roadmap"),
            ("ai-tutor.html", "Personal AI Tutor"),
            ("scholarships.html", "Scholarships"),
            ("courses.html", "All Courses"),
        ],
        primary_btn_text="Enroll Free",
        primary_href="#courses"
    )
    
    content = f"""
{nav}

<header class="av-hero">
  <div class="hero-badge" style="background: rgba(59,130,246,0.15); border-color: rgba(59,130,246,0.3); color: #60a5fa;">
    <i class="fas fa-graduation-cap"></i> 100% Free AI Degree & Certifications
  </div>
  <h1 class="hero-title">Learn AI engineering from <span class="gradient-text" style="background: linear-gradient(135deg, #3b82f6, #10b981); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">first principles</span></h1>
  <p class="hero-sub">Hands-on, project-driven computer science curriculum designed by venture engineers. Zero tuition debt, 100% practical cloud builds.</p>
  
  <div class="hero-cta-group">
    <a class="btn btn-primary lg" href="#courses" style="background: #3b82f6;"><i class="fas fa-book-open"></i> View Curriculum</a>
    <a class="btn btn-ghost lg" href="scholarships.html"><i class="fas fa-hand-holding-dollar"></i> Apply for Scholarship</a>
  </div>
</header>

<section class="section" id="courses">
  <div class="sec-header">
    <span class="sec-pill" style="color: #60a5fa; border-color: #3b82f6;">12-WEEK ROADMAP</span>
    <h2 class="sec-title">Core Engineering Programs</h2>
  </div>

  <div class="grid-3">
    <div class="tool-box" style="border-top:3px solid #3b82f6;">
      <h3 style="color:#60a5fa;">Full-Stack AI Engineering</h3>
      <p style="color:#94a3b8; font-size:13px; margin:12px 0;">Build production FastAPI backends, LangGraph multi-agent systems, and React SaaS dashboards.</p>
      <span style="color:#10b981; font-weight:700; font-size:12px;">12 Weeks · 100% Free</span>
    </div>
    <div class="tool-box" style="border-top:3px solid #f59e0b;">
      <h3 style="color:#fbbf24;">Computer Vision with YOLO</h3>
      <p style="color:#94a3b8; font-size:13px; margin:12px 0;">Real-time object detection, PPE compliance, and damage defect inspection pipelines with OpenCV.</p>
      <span style="color:#10b981; font-weight:700; font-size:12px;">8 Weeks · 100% Free</span>
    </div>
    <div class="tool-box" style="border-top:3px solid #10b981;">
      <h3 style="color:#34d399;">MLOps & Cloud DevOps</h3>
      <p style="color:#94a3b8; font-size:13px; margin:12px 0;">Docker multi-stage builds, Nginx reverse proxy, PostgreSQL multi-tenancy, and Redis rate-limiting.</p>
      <span style="color:#10b981; font-weight:700; font-size:12px;">6 Weeks · 100% Free</span>
    </div>
  </div>
</section>
"""
    return head + content + render_footer("avpu", "AVPU", "fa-graduation-cap", "AI Higher Education & Degree Programs")


# ── 8. AVP EMART BESPOKE LAYOUT (E-Commerce Price Matrix) ────────────────────
def generate_avp_emart() -> str:
    head = render_common_head(
        title="AVP Emart — Live 4-Store Price Comparison",
        description="Compare real-time prices across Amazon, Flipkart, Croma, and Vijay Sales to save money on electronics and essentials.",
        accent="#f97316",
        emoji="🛒"
    )
    nav = render_navbar(
        slug="avp-emart",
        brand_name="AVP Emart",
        icon="fa-cart-shopping",
        nav_links=[
            ("#price-matrix", "Price Matrix"),
            ("deals-radar.html", "Deals Radar"),
            ("price-tracker.html", "Price Comparison"),
        ],
        primary_btn_text="Scan Deals",
        primary_href="#price-matrix"
    )
    
    content = f"""
{nav}

<header class="em-hero">
  <div class="hero-badge" style="background: rgba(249,115,22,0.15); border-color: rgba(249,115,22,0.3); color: #fb923c;">
    <i class="fas fa-tags"></i> Live Price Comparison Across 4 Platforms
  </div>
  <h1 class="hero-title">Never overpay for tech. <span class="gradient-text" style="background: linear-gradient(135deg, #f97316, #eab308); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">We scan all stores live.</span></h1>
  <p class="hero-sub">Instant real-time price radar comparing Amazon India, Flipkart, Croma, and Vijay Sales so you always get the lowest price.</p>
  
  <div class="hero-cta-group">
    <a class="btn btn-primary lg" href="#price-matrix" style="background: #f97316;"><i class="fas fa-search-dollar"></i> Compare Prices</a>
    <a class="btn btn-ghost lg" href="deals-radar.html"><i class="fas fa-bolt"></i> Today's Deals</a>
  </div>
</header>

<section class="section" id="price-matrix">
  <div class="sec-header">
    <span class="sec-pill" style="color: #fb923c; border-color: #f97316;">LIVE RADAR</span>
    <h2 class="sec-title">4-Store Live Price Matrix</h2>
  </div>

  <div class="interactive-card" style="max-width: 900px;">
    <div class="form-group">
      <label>Search Gadget or Appliance</label>
      <div style="display:flex; gap:12px;">
        <input type="text" id="emQuery" class="form-control" value="MacBook Air M2 (16GB / 256GB)">
        <button class="btn btn-primary" onclick="searchEmart()" style="background:#f97316;"><i class="fas fa-search"></i> Compare</button>
      </div>
    </div>

    <div class="grid-2" style="margin-top:24px;">
      <div class="tool-box" style="border-color:#10b981; background:rgba(16,185,129,0.08);">
        <span style="background:#10b981; font-size:11px; padding:2px 8px; border-radius:999px; font-weight:700;">LOWEST PRICE</span>
        <h4 style="margin-top:8px;">Vijay Sales</h4>
        <div style="font-size:28px; font-weight:800; color:#10b981;">₹89,900</div>
        <span style="font-size:12px; color:#94a3b8;">Free 1-day delivery in Gujarat</span>
      </div>
      <div class="tool-box">
        <h4>Amazon India</h4>
        <div style="font-size:28px; font-weight:800; color:#fff;">₹93,490</div>
        <span style="font-size:12px; color:#ef4444;">₹3,590 more expensive</span>
      </div>
    </div>
  </div>
</section>

<script>
function searchEmart() {{
  alert('Scanned 4 major stores. Lowest verified price is on Vijay Sales (Save ₹3,590)!');
}}
</script>
"""
    return head + content + render_footer("avp-emart", "AVP Emart", "fa-cart-shopping", "AI Price Comparison & Smart Shopping")


# ── 9. AVP CHARITABLE TRUST BESPOKE LAYOUT (Transparent Non-Profit) ──────────
def generate_avp_trust() -> str:
    head = render_common_head(
        title="AVP Charitable Trust — Transparent AI Social Impact",
        description="Rupee-by-rupee transparent donation tracking, free rural medical camps, and education scholarships across Gujarat.",
        accent="#f43f5e",
        emoji="❤️"
    )
    nav = render_navbar(
        slug="avp-charitable-trust",
        brand_name="AVP Trust",
        icon="fa-hand-holding-heart",
        nav_links=[
            ("#ledger", "Impact Ledger"),
            ("health-camps.html", "Medical Camps"),
            ("impact-tracker.html", "Rupee Audit"),
        ],
        primary_btn_text="Volunteer With Us",
        primary_href="health-camps.html"
    )
    
    content = f"""
{nav}

<header class="tr-hero">
  <div class="hero-badge" style="background: rgba(244,63,94,0.15); border-color: rgba(244,63,94,0.3); color: #fb7185;">
    <i class="fas fa-heart"></i> 100% Transparent Non-Profit Healthcare & Education
  </div>
  <h1 class="hero-title">Every rupee audited. <span class="gradient-text" style="background: linear-gradient(135deg, #f43f5e, #fb923c); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Every life transformed.</span></h1>
  <p class="hero-sub">Providing free rural healthcare clinics, full tuition scholarships, and medicine distribution across underserved communities in Gujarat.</p>
  
  <div class="hero-cta-group">
    <a class="btn btn-primary lg" href="#ledger" style="background: #f43f5e;"><i class="fas fa-receipt"></i> View Transparent Ledger</a>
    <a class="btn btn-ghost lg" href="health-camps.html"><i class="fas fa-user-plus"></i> Join as Volunteer</a>
  </div>
</header>

<section class="section" id="ledger">
  <div class="sec-header">
    <span class="sec-pill" style="color: #fb7185; border-color: #f43f5e;">VERIFIED AUDIT</span>
    <h2 class="sec-title">Live Social Impact Metrics</h2>
  </div>

  <div class="grid-3">
    <div class="metric glow">
      <div class="metric-num count" style="color:#fb7185;">14,500+</div>
      <div class="metric-lbl">Patients Treated Free</div>
      <div class="metric-sub">Across 42 rural camps</div>
    </div>
    <div class="metric glow">
      <div class="metric-num count" style="color:#38bdf8;">850+</div>
      <div class="metric-lbl">Full Scholarships</div>
      <div class="metric-sub">Supporting AI & Tech degrees</div>
    </div>
    <div class="metric glow">
      <div class="metric-num count" style="color:#10b981;">100%</div>
      <div class="metric-lbl">Direct Utilization</div>
      <div class="metric-sub">0% administrative deduction</div>
    </div>
  </div>
</section>
"""
    return head + content + render_footer("avp-charitable-trust", "AVP Trust", "fa-hand-holding-heart", "AI Social Impact & Transparent Healthcare")


# ── CSS & JS STYLING GENERATOR ───────────────────────────────────────────────
def generate_master_css(accent: str) -> str:
    return f"""
/* Sevenseed Master Bespoke UI Styling System */
:root {{
  --bg: #0b0f19;
  --card-bg: rgba(15, 23, 42, 0.75);
  --border: rgba(255, 255, 255, 0.1);
  --accent: {accent};
  --text: #f8fafc;
  --text-dim: #94a3b8;
}}
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
body {{
  font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
  background-color: var(--bg);
  color: var(--text);
  line-height: 1.6;
  overflow-x: hidden;
}}
a {{ text-decoration: none; color: inherit; }}

/* Nav */
.nav {{ position: fixed; top: 0; left: 0; right: 0; z-index: 100; backdrop-filter: blur(16px); background: rgba(11,15,25,0.85); border-bottom: 1px solid var(--border); }}
.nav-inner {{ max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 14px 24px; }}
.nav-brand {{ display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 18px; }}
.nav-logo-icon {{ width: 34px; height: 34px; border-radius: 8px; background: {accent}22; color: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 16px; }}
.nav-links {{ display: flex; gap: 24px; font-size: 14px; font-weight: 600; color: var(--text-dim); }}
.nav-links a:hover, .nav-links a.active {{ color: #fff; }}
.nav-actions {{ display: flex; gap: 12px; }}

/* Buttons */
.btn {{ display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 10px; font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s; border: none; }}
.btn.sm {{ padding: 6px 14px; font-size: 13px; }}
.btn.lg {{ padding: 14px 28px; font-size: 16px; border-radius: 12px; }}
.btn-primary {{ background: var(--accent); color: #fff; box-shadow: 0 4px 20px {accent}44; }}
.btn-primary:hover {{ transform: translateY(-2px); box-shadow: 0 6px 25px {accent}66; }}
.btn-ghost {{ background: rgba(255,255,255,0.06); color: #fff; border: 1px solid var(--border); }}
.btn-ghost:hover {{ background: rgba(255,255,255,0.12); transform: translateY(-2px); }}

/* Heroes */
header {{ padding: 140px 24px 70px; text-align: center; background: radial-gradient(circle at 50% 0%, {accent}22, transparent 70%); }}
.hero-badge {{ display: inline-flex; align-items: center; gap: 8px; padding: 6px 18px; border-radius: 999px; background: rgba(255,255,255,0.06); border: 1px solid var(--border); font-size: 13px; margin-bottom: 20px; }}
.hero-title {{ font-size: clamp(36px, 5.5vw, 60px); font-weight: 900; line-height: 1.15; max-width: 900px; margin: 0 auto 20px; }}
.hero-sub {{ font-size: 18px; color: var(--text-dim); max-width: 720px; margin: 0 auto 36px; }}
.hero-cta-group {{ display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-bottom: 40px; }}

/* Hub Ticker */
.hub-ticker {{ display: flex; align-items: center; justify-content: center; gap: 32px; flex-wrap: wrap; padding: 20px; background: rgba(15,23,42,0.6); border: 1px solid var(--border); border-radius: 16px; max-width: 800px; margin: 0 auto; backdrop-filter: blur(10px); }}
.ticker-item {{ text-align: center; }}
.tnum {{ font-size: 24px; font-weight: 900; color: #fff; display: block; }}
.tlbl {{ font-size: 12px; color: var(--text-dim); font-weight: 600; }}
.ticker-sep {{ width: 1px; height: 28px; background: var(--border); }}

/* Sections & Grids */
.section {{ padding: 80px 24px; max-width: 1200px; margin: 0 auto; }}
.sec-header {{ text-align: center; margin-bottom: 50px; }}
.sec-pill {{ font-size: 12px; font-weight: 800; letter-spacing: 1.5px; color: var(--accent); display: inline-block; margin-bottom: 12px; }}
.sec-title {{ font-size: 34px; font-weight: 800; margin-bottom: 12px; }}
.sec-desc {{ font-size: 16px; color: var(--text-dim); max-width: 600px; margin: 0 auto; }}
.os-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; }}
.os-card {{ background: var(--card-bg); border: 1px solid var(--border); border-radius: 18px; padding: 28px; backdrop-filter: blur(16px); transition: transform 0.2s, box-shadow 0.2s; display: flex; flex-direction: column; }}
.os-card:hover {{ transform: translateY(-5px); box-shadow: 0 16px 40px rgba(0,0,0,0.5); }}
.os-top {{ display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }}
.os-icon {{ width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; }}
.os-live-pill {{ font-size: 11px; font-weight: 700; color: #10b981; display: flex; align-items: center; gap: 5px; }}
.os-sector {{ font-size: 12px; font-weight: 700; color: #38bdf8; text-transform: uppercase; margin-bottom: 8px; display: block; }}
.os-blurb {{ font-size: 14px; color: var(--text-dim); margin-bottom: 24px; flex-grow: 1; }}
.os-actions {{ display: flex; justify-content: space-between; align-items: center; gap: 10px; }}

/* Agent Studio */
.agents-studio {{ display: grid; grid-template-columns: 280px 1fr; gap: 24px; }}
@media(max-width: 800px) {{ .agents-studio {{ grid-template-columns: 1fr; }} }}
.agent-tabs {{ display: flex; flex-direction: column; gap: 10px; }}
.atab {{ display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); color: #fff; cursor: pointer; text-align: left; transition: all 0.2s; }}
.atab:hover, .atab.active {{ background: rgba(139,92,246,0.15); border-color: #8b5cf6; }}
.a-avatar {{ font-size: 24px; }}
.a-info strong {{ font-size: 14px; display: block; }}
.a-info small {{ font-size: 11px; color: var(--text-dim); }}
.a-status.online {{ color: #10b981; margin-left: auto; font-size: 12px; }}
.agent-workspace {{ background: var(--card-bg); border: 1px solid var(--border); border-radius: 18px; padding: 28px; backdrop-filter: blur(16px); }}
.ws-header {{ display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--border); }}
.ws-title-group {{ display: flex; align-items: center; gap: 14px; }}
.ws-avatar {{ font-size: 32px; }}
.ws-tag {{ font-size: 12px; color: #a855f7; font-weight: 600; }}

/* Forms & Screens */
.form-group {{ margin-bottom: 20px; }}
.form-group label {{ display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px; color: #cbd5e1; }}
.form-control {{ width: 100%; padding: 12px 16px; background: rgba(2,6,23,0.7); border: 1px solid var(--border); border-radius: 10px; color: #fff; font-family: inherit; font-size: 14px; }}
.form-control:focus {{ outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px {accent}33; }}
.output-screen {{ background: #020617; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #38bdf8; text-align: left; white-space: pre-wrap; }}

/* Common Components */
.interactive-card {{ background: var(--card-bg); border: 1px solid var(--border); border-radius: 18px; padding: 32px; backdrop-filter: blur(16px); }}
.grid-2 {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }}
.grid-3 {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; }}
.tech-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; }}
.tech-box {{ background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 14px; padding: 24px; }}
.tech-box .t-icon {{ font-size: 24px; color: var(--accent); margin-bottom: 12px; }}
.metric {{ background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; padding: 28px; text-align: center; }}
.metric-num {{ font-size: 40px; font-weight: 900; margin-bottom: 6px; }}
.metric-lbl {{ font-size: 15px; font-weight: 700; color: #fff; }}
.metric-sub {{ font-size: 12px; color: var(--text-dim); }}
.gradient-text {{ background: linear-gradient(135deg, #fff, var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }}

/* Footer */
.footer {{ border-top: 1px solid var(--border); padding: 60px 24px 40px; background: rgba(2,6,23,0.9); }}
.foot-inner {{ max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 40px; }}
@media(max-width: 768px) {{ .foot-inner {{ grid-template-columns: 1fr; }} }}
.foot-brand {{ font-size: 20px; font-weight: 800; margin-bottom: 12px; display: flex; align-items: center; gap: 10px; }}
.foot-desc {{ font-size: 14px; color: var(--text-dim); margin-bottom: 16px; max-width: 400px; }}
.foot-badges {{ display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }}
.fbadge {{ font-size: 11px; padding: 4px 10px; border-radius: 999px; background: rgba(255,255,255,0.05); color: #cbd5e1; border: 1px solid var(--border); }}
.foot-copy {{ font-size: 12px; color: #64748b; }}
.foot-col h4 {{ font-size: 14px; font-weight: 700; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px; color: #cbd5e1; }}
.foot-links {{ list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 13px; color: var(--text-dim); }}
.foot-links a:hover {{ color: #fff; }}
.foot-current {{ color: var(--accent); font-weight: 700; }}
"""


APP_JS = """
// Sevenseed Master App Interactivity
document.addEventListener('DOMContentLoaded', () => {
  console.log('Sevenseed Bespoke UI System Initialized.');
});
"""


def main():
    print("==================================================")
    print(" 🚀 GENERATING 9 BESPOKE VENTURE WEB APPLICATIONS")
    print("==================================================")

    generators = {
        "sevenseed": (generate_sevenseed_hub, "#6366f1"),
        "sevenforce": (generate_sevenforce, "#8b5cf6"),
        "breakdown-factor": (generate_breakdown_factor, "#f59e0b"),
        "decode-forest-pharmacy": (generate_decode_pharmacy, "#10b981"),
        "comonk": (generate_comonk, "#0ea5e9"),
        "rakshak-ai": (generate_rakshak_ai, "#ef4444"),
        "avpu": (generate_avpu, "#3b82f6"),
        "avp-emart": (generate_avp_emart, "#f97316"),
        "avp-charitable-trust": (generate_avp_trust, "#f43f5e"),
    }

    for slug, (gen_fn, accent) in generators.items():
        folder = SITES_DIR / slug
        folder.mkdir(parents=True, exist_ok=True)
        
        # Write index.html
        html_content = gen_fn()
        with open(folder / "index.html", "w", encoding="utf-8") as f:
            f.write(html_content)
            
        # Write style.css
        css_content = generate_master_css(accent)
        with open(folder / "style.css", "w", encoding="utf-8") as f:
            f.write(css_content)
            
        # Write app.js
        with open(folder / "app.js", "w", encoding="utf-8") as f:
            f.write(APP_JS)
            
        print(f"  [OK] {slug:24s} -> Generated Bespoke UI ({accent})")

    print("\n🎉 All 9 venture sites successfully overhauled with bespoke UI architectures!")


if __name__ == "__main__":
    main()
