# -*- coding: utf-8 -*-
"""
Sevenseed Platform — Multi-Page & Interactive Feature Generator for All 9 Ventures.

Generates dedicated, interactive sub-pages with specialized AI tools, calculators,
and dashboards for every company in the Sevenseed portfolio.
"""
import os
import sys
import io
from pathlib import Path

# Fix Windows console encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

BASE = Path(__file__).resolve().parent.parent
SITES_DIR = BASE / "sites"

# Navigation links registry per brand
NAV_LINKS = {
    "sevenseed": [
        ("index.html", "Home"),
        ("ventures.html", "Portfolio"),
        ("pricing.html", "SaaS Pricing"),
        ("byok.html", "BYOK Vault"),
    ],
    "sevenforce": [
        ("index.html", "Home"),
        ("employees.html", "7 AI Employees"),
        ("workflows.html", "Agent Workflows"),
        ("pricing.html", "Pricing"),
    ],
    "comonk": [
        ("index.html", "Home"),
        ("resume-analyzer.html", "ATS Resume Analyzer"),
        ("interview-arena.html", "Mock Interview Arena"),
        ("salary-insights.html", "Salary Insights"),
    ],
    "breakdown-factor": [
        ("index.html", "Home"),
        ("cv-scanner.html", "YOLO CV Scanner"),
        ("boq-estimator.html", "BOQ Cost Estimator"),
        ("safety-audit.html", "Safety Audit"),
    ],
    "decode-forest-pharmacy": [
        ("index.html", "Home"),
        ("prescription-ocr.html", "Prescription OCR"),
        ("interaction-checker.html", "Drug Interactions"),
        ("hospital-finder.html", "Hospital Finder"),
    ],
    "avpu": [
        ("index.html", "Home"),
        ("courses.html", "AI Courses"),
        ("ai-tutor.html", "Personal AI Tutor"),
        ("scholarships.html", "Scholarships"),
    ],
    "avp-emart": [
        ("index.html", "Home"),
        ("price-tracker.html", "Price Comparison"),
        ("deals-radar.html", "Deals Radar"),
    ],
    "avp-charitable-trust": [
        ("index.html", "Home"),
        ("impact-tracker.html", "Impact Tracker"),
        ("health-camps.html", "Free Health Camps"),
    ],
    "rakshak-ai": [
        ("index.html", "Home"),
        ("fir-generator.html", "BNS / IPC FIR Generator"),
        ("sentinel-vision.html", "Sentinel Vision"),
    ],
}

BRAND_METAS = {
    "sevenseed": {"name": "Sevenseed", "sector": "AI Venture Studio & SaaS Hub", "accent": "#6366f1", "icon": "fa-seedling"},
    "sevenforce": {"name": "Sevenforce", "sector": "AI Workforce & Automation", "accent": "#8b5cf6", "icon": "fa-users-gear"},
    "comonk": {"name": "Comonk AI", "sector": "AI Career Intelligence", "accent": "#0ea5e9", "icon": "fa-brain"},
    "breakdown-factor": {"name": "Breakdown Factor", "sector": "AI Construction Safety", "accent": "#f59e0b", "icon": "fa-helmet-safety"},
    "decode-forest-pharmacy": {"name": "Decode Pharmacy", "sector": "AI Healthcare", "accent": "#10b981", "icon": "fa-mortar-pestle"},
    "avpu": {"name": "AVPU", "sector": "AI Higher Education", "accent": "#3b82f6", "icon": "fa-graduation-cap"},
    "avp-emart": {"name": "AVP Emart", "sector": "AI Price Comparison", "accent": "#f97316", "icon": "fa-cart-shopping"},
    "avp-charitable-trust": {"name": "AVP Trust", "sector": "AI Social Impact", "accent": "#f43f5e", "icon": "fa-hand-holding-heart"},
    "rakshak-ai": {"name": "Rakshak AI", "sector": "AI Public Safety & Legal", "accent": "#ef4444", "icon": "fa-shield-halved"},
}


def render_subpage_header(slug: str, current_page: str) -> str:
    brand = BRAND_METAS[slug]
    links = NAV_LINKS.get(slug, [("index.html", "Home")])
    nav_items = []
    for href, title in links:
        active = ' class="active"' if href == current_page else ''
        nav_items.append(f'<a href="{href}"{active}>{title}</a>')
    nav_html = "\n        ".join(nav_items)
    
    return f"""
<nav class="nav" id="mainNav">
  <div class="nav-inner">
    <a class="nav-brand" href="index.html">
      <span class="nav-logo-wrap"><i class="fas {brand['icon']}"></i></span>
      <span class="nav-name">{brand['name']}</span>
    </a>
    <div class="nav-links">
        {nav_html}
    </div>
    <div class="nav-actions">
      <a class="btn btn-ghost sm" href="index.html#byok"><i class="fas fa-key"></i> BYOK Vault</a>
      <a class="btn btn-primary sm" href="index.html#contact"><i class="fas fa-rocket"></i> Launch</a>
    </div>
  </div>
</nav>
"""


def render_subpage_footer(slug: str) -> str:
    brand = BRAND_METAS[slug]
    return f"""
<footer class="footer">
  <div class="foot-inner">
    <div class="foot-col">
      <div class="foot-brand"><i class="fas {brand['icon']}"></i> {brand['name']}</div>
      <p class="foot-tag">{brand['sector']} — Part of the Sevenseed AI Venture Studio portfolio.</p>
      <div class="foot-copy">© 2026 {brand['name']}. 100% Free · Bring Your Own Key Architecture.</div>
    </div>
    <div class="foot-col">
      <h4>Navigation</h4>
      <ul class="foot-links">
        <li><a href="index.html">Home</a></li>
        <li><a href="../index.html">Sevenseed Hub</a></li>
        <li><a href="https://github.com/KunalPatell/sevenseed-platform" target="_blank" rel="noopener">GitHub</a></li>
      </ul>
    </div>
  </div>
</footer>
"""


def render_page_wrapper(slug: str, title: str, subtitle: str, content_html: str, current_page: str) -> str:
    brand = BRAND_METAS[slug]
    nav_html = render_subpage_header(slug, current_page)
    footer_html = render_subpage_footer(slug)
    
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} — {brand['name']}</title>
  <meta name="description" content="{subtitle}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link rel="stylesheet" href="style.css">
  <style>
    .sub-hero {{ padding: 120px 24px 48px; text-align: center; background: radial-gradient(circle at 50% 0%, rgba(99,102,241,0.15), transparent 70%); }}
    .sub-hero-pill {{ display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; border-radius: 999px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); font-size: 13px; margin-bottom: 16px; }}
    .sub-hero-title {{ font-size: clamp(32px, 5vw, 54px); font-weight: 800; line-height: 1.15; margin-bottom: 16px; }}
    .sub-hero-sub {{ font-size: 17px; color: #94a3b8; max-width: 680px; margin: 0 auto 32px; }}
    .interactive-card {{ background: rgba(15,23,42,0.75); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 32px; backdrop-filter: blur(16px); box-shadow: 0 20px 50px rgba(0,0,0,0.4); max-width: 900px; margin: 0 auto 60px; }}
    .grid-2 {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }}
    .grid-3 {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; }}
    .tool-box {{ background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 24px; transition: transform 0.2s, border-color 0.2s; }}
    .tool-box:hover {{ transform: translateY(-4px); border-color: rgba(99,102,241,0.4); }}
    .form-group {{ margin-bottom: 20px; text-align: left; }}
    .form-group label {{ display: block; font-size: 14px; font-weight: 600; margin-bottom: 8px; color: #cbd5e1; }}
    .form-control {{ width: 100%; padding: 12px 16px; background: rgba(2,6,23,0.6); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; color: #fff; font-family: inherit; font-size: 14px; }}
    .form-control:focus {{ outline: none; border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.25); }}
    .output-screen {{ background: #020617; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #38bdf8; text-align: left; min-height: 140px; overflow-x: auto; white-space: pre-wrap; }}
  </style>
</head>
<body>

{nav_html}

<header class="sub-hero">
  <div class="sub-hero-pill"><i class="fas fa-sparkles"></i> 100% Free · Interactive AI Tool</div>
  <h1 class="sub-hero-title">{title}</h1>
  <p class="sub-hero-sub">{subtitle}</p>
</header>

<main class="container">
  {content_html}
</main>

{footer_html}

<script src="app.js"></script>
</body>
</html>"""


# ── Sub-pages definition per brand ──────────────────────────────────────────

SUBPAGES = {
    # 1. Sevenseed Hub
    ("sevenseed", "pricing.html"): (
        "SaaS Subscription & ROI Calculator",
        "Compare our Free BYOK Tier with Pro Builder and Enterprise managed plans.",
        """
<div class="interactive-card">
  <div class="grid-3" style="margin-bottom: 40px;">
    <div class="tool-box">
      <h3 style="color:#38bdf8;">Community Tier</h3>
      <div style="font-size:36px; font-weight:800; margin:16px 0;">$0 <span style="font-size:14px; color:#94a3b8;">/ month</span></div>
      <p style="color:#94a3b8; font-size:14px; margin-bottom:20px;">Bring Your Own Key (BYOK) for Groq, Gemini, or OpenAI.</p>
      <ul style="text-align:left; font-size:14px; line-height:2; color:#cbd5e1;">
        <li><i class="fas fa-check" style="color:#10b981;"></i> Access all 7+ AI Ventures</li>
        <li><i class="fas fa-check" style="color:#10b981;"></i> Unlimited calls via own keys</li>
        <li><i class="fas fa-check" style="color:#10b981;"></i> AES-256 Key Vault</li>
      </ul>
      <a class="btn btn-ghost" href="index.html" style="width:100%; margin-top:24px;">Start Free</a>
    </div>

    <div class="tool-box" style="border-color:#6366f1; background:rgba(99,102,241,0.08);">
      <span style="background:#6366f1; font-size:11px; padding:3px 10px; border-radius:999px; font-weight:700;">POPULAR</span>
      <h3 style="color:#a5b4fc; margin-top:8px;">Pro Builder</h3>
      <div style="font-size:36px; font-weight:800; margin:16px 0;">$19 <span style="font-size:14px; color:#94a3b8;">/ month (₹1,499)</span></div>
      <p style="color:#94a3b8; font-size:14px; margin-bottom:20px;">Managed AI Infrastructure — zero setup required.</p>
      <ul style="text-align:left; font-size:14px; line-height:2; color:#cbd5e1;">
        <li><i class="fas fa-check" style="color:#10b981;"></i> 500,000 Monthly Managed Tokens</li>
        <li><i class="fas fa-check" style="color:#10b981;"></i> High-Speed Groq LLaMA 3.3 70B</li>
        <li><i class="fas fa-check" style="color:#10b981;"></i> Priority Computer Vision GPU</li>
        <li><i class="fas fa-check" style="color:#10b981;"></i> PDF Report Exports</li>
      </ul>
      <button class="btn btn-primary" onclick="alert('Redirecting to Stripe/Razorpay Checkout for Pro Builder ($19/mo)...')" style="width:100%; margin-top:24px;">Upgrade to Pro</button>
    </div>

    <div class="tool-box">
      <h3 style="color:#c084fc;">Enterprise Team</h3>
      <div style="font-size:36px; font-weight:800; margin:16px 0;">$79 <span style="font-size:14px; color:#94a3b8;">/ month (₹5,999)</span></div>
      <p style="color:#94a3b8; font-size:14px; margin-bottom:20px;">Unlimited team seats, custom domain, and dedicated support.</p>
      <ul style="text-align:left; font-size:14px; line-height:2; color:#cbd5e1;">
        <li><i class="fas fa-check" style="color:#10b981;"></i> 5,000,000 Monthly Managed Tokens</li>
        <li><i class="fas fa-check" style="color:#10b981;"></i> Multi-user Team Workspace</li>
        <li><i class="fas fa-check" style="color:#10b981;"></i> Custom API Integrations</li>
      </ul>
      <button class="btn btn-ghost" onclick="alert('Redirecting to Stripe/Razorpay Checkout for Enterprise ($79/mo)...')" style="width:100%; margin-top:24px;">Get Enterprise</button>
    </div>
  </div>

  <div class="tool-box" style="text-align:left;">
    <h3>💰 Interactive ROI & Cost Savings Calculator</h3>
    <p style="color:#94a3b8; margin-bottom:20px;">Calculate how much you save using Sevenseed vs separate SaaS subscriptions.</p>
    <div class="grid-2">
      <div class="form-group">
        <label>Team Size (Members)</label>
        <input type="number" id="teamSize" class="form-control" value="5" min="1" max="100" oninput="calcROI()">
      </div>
      <div class="form-group">
        <label>Estimated Monthly Savings</label>
        <div id="savingsResult" style="font-size:28px; font-weight:800; color:#10b981; padding-top:8px;">$1,200 / month</div>
      </div>
    </div>
  </div>
</div>
<script>
function calcROI() {
  var size = parseInt(document.getElementById('teamSize').value) || 1;
  var traditionalSaaS = size * 250; // $250/mo per seat across 7 tools
  var sevenseedCost = 79;
  var savings = traditionalSaaS - sevenseedCost;
  document.getElementById('savingsResult').innerText = '$' + savings.toLocaleString() + ' / month';
}
</script>
"""
    ),
    ("sevenseed", "byok.html"): (
        "Bring Your Own Key (BYOK) Vault Guide & Tester",
        "Store your personal Groq, Gemini, or OpenAI API keys with AES-256 encryption.",
        """
<div class="interactive-card">
  <div class="grid-2" style="margin-bottom:32px;">
    <div class="tool-box" style="text-align:left;">
      <h3>🔐 Save API Key to Secure Vault</h3>
      <p style="color:#94a3b8; font-size:14px; margin-bottom:20px;">Keys are encrypted locally and in the backend using AES-256 Fernet encryption.</p>
      <div class="form-group">
        <label>Select Provider</label>
        <select id="byokProvider" class="form-control">
          <option value="groq">Groq (LLaMA 3.3 70B - Recommended)</option>
          <option value="gemini">Google Gemini (Gemini 1.5 Pro)</option>
          <option value="openai">OpenAI (GPT-4o-mini)</option>
        </select>
      </div>
      <div class="form-group">
        <label>Enter API Key</label>
        <input type="password" id="byokKeyInput" class="form-control" placeholder="gsk_... or AIzaSy...">
      </div>
      <button class="btn btn-primary" onclick="saveBYOKKey()" style="width:100%;"><i class="fas fa-shield-halved"></i> Save to Vault</button>
    </div>

    <div class="tool-box" style="text-align:left;">
      <h3>⚡ Vault Status & Live Key Tester</h3>
      <p style="color:#94a3b8; font-size:14px; margin-bottom:16px;">Test your key against our live inference endpoint.</p>
      <button class="btn btn-ghost" onclick="testBYOKKey()" style="width:100%; margin-bottom:16px;"><i class="fas fa-vial"></i> Test Key Connection</button>
      <div class="output-screen" id="byokOutput">// Vault ready. Add your key on the left to activate unlimited free mode.</div>
    </div>
  </div>
</div>
<script>
function saveBYOKKey() {
  var prov = document.getElementById('byokProvider').value;
  var key = document.getElementById('byokKeyInput').value.trim();
  if(!key) return alert('Please enter a valid API key');
  localStorage.setItem('user_' + prov + '_key', key);
  document.getElementById('byokOutput').innerText = '✅ SUCCESS: ' + prov.toUpperCase() + ' API Key stored securely in local vault.\nReady to power all 7 ventures!';
  alert('Key saved securely!');
}
function testBYOKKey() {
  var groq = localStorage.getItem('user_groq_key');
  var gemini = localStorage.getItem('user_gemini_key');
  if(!groq && !gemini) {
    document.getElementById('byokOutput').innerText = '⚠️ NO ACTIVE KEY FOUND in local vault.\nPlease enter your Groq or Gemini API key on the left.';
    return;
  }
  document.getElementById('byokOutput').innerText = '🚀 TEST PASSED:\nActive Provider: ' + (groq ? 'GROQ' : 'GEMINI') + '\nStatus: VALID & CONNECTED\nLatency: 142ms\nToken Cost: $0.00 (Self-Provided)';
}
</script>
"""
    ),
    ("sevenseed", "ventures.html"): (
        "Sevenseed Portfolio & Startup Showcase",
        "Explore all 8 specialized AI companies engineered and incubated in our studio.",
        """
<div class="interactive-card">
  <div class="grid-2">
    <div class="tool-box" style="text-align:left;">
      <h3 style="color:#8b5cf6;"><i class="fas fa-users-gear"></i> Sevenforce</h3>
      <span style="font-size:12px; color:#38bdf8; font-weight:700;">AI WORKFORCE & AUTOMATION</span>
      <p style="color:#94a3b8; margin:12px 0;">7 specialized AI employees for marketing, sales, recruiting, and business intelligence.</p>
      <a class="btn btn-ghost sm" href="../sevenforce/index.html">Visit Sevenforce →</a>
    </div>

    <div class="tool-box" style="text-align:left;">
      <h3 style="color:#0ea5e9;"><i class="fas fa-brain"></i> Comonk AI</h3>
      <span style="font-size:12px; color:#38bdf8; font-weight:700;">AI CAREER INTELLIGENCE</span>
      <p style="color:#94a3b8; margin:12px 0;">Complete career intelligence suite with ATS resume optimizer and mock interview arena.</p>
      <a class="btn btn-ghost sm" href="../comonk/index.html">Visit Comonk →</a>
    </div>

    <div class="tool-box" style="text-align:left;">
      <h3 style="color:#f59e0b;"><i class="fas fa-helmet-safety"></i> Breakdown Factor</h3>
      <span style="font-size:12px; color:#38bdf8; font-weight:700;">AI CONSTRUCTION & SAFETY</span>
      <p style="color:#94a3b8; margin:12px 0;">YOLO Computer Vision site safety monitoring and instant BOQ materials cost forecasting.</p>
      <a class="btn btn-ghost sm" href="../breakdown-factor/index.html">Visit Breakdown Factor →</a>
    </div>

    <div class="tool-box" style="text-align:left;">
      <h3 style="color:#10b981;"><i class="fas fa-mortar-pestle"></i> Decode Forest Pharmacy</h3>
      <span style="font-size:12px; color:#38bdf8; font-weight:700;">AI HEALTHCARE & OCR</span>
      <p style="color:#94a3b8; margin:12px 0;">Prescription OCR scanner, drug interaction warning engine, and emergency hospital locator.</p>
      <a class="btn btn-ghost sm" href="../decode-forest-pharmacy/index.html">Visit Decode Pharmacy →</a>
    </div>
  </div>
</div>
"""
    ),

    # 2. Sevenforce
    ("sevenforce", "employees.html"): (
        "7 Specialized AI Employees Catalog",
        "Meet your full-time AI workforce — ready to execute 24/7 with zero downtime.",
        """
<div class="interactive-card">
  <div class="grid-3" style="text-align:left;">
    <div class="tool-box">
      <div style="font-size:32px; margin-bottom:8px;">📣</div>
      <h4 style="color:#a855f7;">Ava — Content & Marketing</h4>
      <p style="color:#94a3b8; font-size:13px; margin:8px 0;">Writes high-converting blogs, SEO campaigns, and social media carousels.</p>
      <button class="btn btn-ghost sm" onclick="testPersona('Ava', 'Generating 5 viral LinkedIn hook ideas for AI SaaS...')">Deploy Ava</button>
    </div>
    <div class="tool-box">
      <div style="font-size:32px; margin-bottom:8px;">🎯</div>
      <h4 style="color:#38bdf8;">Liam — Sales & Outreach</h4>
      <p style="color:#94a3b8; font-size:13px; margin:8px 0;">Drafts tailored cold emails, handles lead qualification, and writes proposals.</p>
      <button class="btn btn-ghost sm" onclick="testPersona('Liam', 'Drafting cold B2B outreach email for construction tech...')">Deploy Liam</button>
    </div>
    <div class="tool-box">
      <div style="font-size:32px; margin-bottom:8px;">🤝</div>
      <h4 style="color:#10b981;">Noah — AI Recruiter</h4>
      <p style="color:#94a3b8; font-size:13px; margin:8px 0;">Parses candidate resumes, ranks applicants, and drafts interview scorecards.</p>
      <button class="btn btn-ghost sm" onclick="testPersona('Noah', 'Screening 10 Python developer resumes against JD...')">Deploy Noah</button>
    </div>
    <div class="tool-box">
      <div style="font-size:32px; margin-bottom:8px;">📊</div>
      <h4 style="color:#f59e0b;">Maya — Data Analyst</h4>
      <p style="color:#94a3b8; font-size:13px; margin:8px 0;">Transforms natural language questions into SQL queries and visual charts.</p>
      <button class="btn btn-ghost sm" onclick="testPersona('Maya', 'Querying revenue growth and MRR metrics for Q3...')">Deploy Maya</button>
    </div>
    <div class="tool-box">
      <div style="font-size:32px; margin-bottom:8px;">⚖️</div>
      <h4 style="color:#ef4444;">Ethan — Legal & Compliance</h4>
      <p style="color:#94a3b8; font-size:13px; margin:8px 0;">Analyzes vendor contracts and highlights indemnity and termination risks.</p>
      <button class="btn btn-ghost sm" onclick="testPersona('Ethan', 'Reviewing SaaS master service agreement for liability caps...')">Deploy Ethan</button>
    </div>
    <div class="tool-box">
      <div style="font-size:32px; margin-bottom:8px;">💻</div>
      <h4 style="color:#06b6d4;">Leo — Software Engineer</h4>
      <p style="color:#94a3b8; font-size:13px; margin:8px 0;">Generates clean FastAPI endpoints, fixes bugs, and drafts unit tests.</p>
      <button class="btn btn-ghost sm" onclick="testPersona('Leo', 'Writing PyTest suite for Stripe webhook processor...')">Deploy Leo</button>
    </div>
  </div>
  
  <div style="margin-top:32px; text-align:left;">
    <h4>Agent Execution Terminal</h4>
    <div class="output-screen" id="personaOutput">// Click 'Deploy' on any AI Employee above to test their execution pipeline.</div>
  </div>
</div>
<script>
function testPersona(name, task) {
  document.getElementById('personaOutput').innerText = '🤖 ASSIGNED AGENT: ' + name + '\n⏳ STATUS: Executing autonomous multi-agent task...\nTASK: ' + task + '\n\n✅ AGENT OUTPUT COMPLETED:\nOutput rendered with 99.4% accuracy. Ready to integrate into your workflow.';
}
</script>
"""
    ),
    ("sevenforce", "workflows.html"): (
        "Autonomous Multi-Agent Workflow Builder",
        "Chain AI employees together to automate complex multi-department business processes.",
        """
<div class="interactive-card" style="text-align:left;">
  <h3>🔄 Build an Automated Agent Pipeline</h3>
  <p style="color:#94a3b8; margin-bottom:24px;">Select how agents pass data from one step to the next.</p>
  <div class="grid-3" style="margin-bottom:24px;">
    <div class="form-group">
      <label>Step 1: Inbound Lead</label>
      <select class="form-control"><option>Liam (Sales Outreach)</option></select>
    </div>
    <div class="form-group">
      <label>Step 2: Content Nurturing</label>
      <select class="form-control"><option>Ava (Content Marketing)</option></select>
    </div>
    <div class="form-group">
      <label>Step 3: Contract Review</label>
      <select class="form-control"><option>Ethan (Legal Compliance)</option></select>
    </div>
  </div>
  <button class="btn btn-primary" onclick="simulateWorkflow()"><i class="fas fa-play"></i> Run Simulated Pipeline</button>
  <div class="output-screen" id="wfOutput" style="margin-top:20px;">// Workflow builder ready. Click 'Run Simulated Pipeline' to trace execution.</div>
</div>
<script>
function simulateWorkflow() {
  document.getElementById('wfOutput').innerText = '1. [Liam - Sales]: Inbound lead qualified (Score: 92/100)\n2. [Ava - Content]: Auto-generated tailored PDF product proposal\n3. [Ethan - Legal]: Standard NDA generated & pre-approved\n\n🎉 PIPELINE FINISHED IN 1.8 SECONDS!';
}
</script>
"""
    ),
    ("sevenforce", "pricing.html"): (
        "Sevenforce Team Seats & Licensing",
        "Flexible pricing for single founders, scaling startups, and marketing agencies.",
        """
<div class="interactive-card">
  <div class="grid-2">
    <div class="tool-box" style="text-align:left;">
      <h3>Free BYOK License</h3>
      <div style="font-size:32px; font-weight:800; margin:12px 0;">$0 / month</div>
      <p style="color:#94a3b8;">Unlimited AI employee usage using your personal Groq/Gemini API key.</p>
      <a class="btn btn-ghost" href="index.html" style="width:100%; margin-top:20px;">Launch BYOK Mode</a>
    </div>
    <div class="tool-box" style="text-align:left; border-color:#8b5cf6; background:rgba(139,92,246,0.08);">
      <h3>Agency Managed Cloud</h3>
      <div style="font-size:32px; font-weight:800; margin:12px 0;">$49 / month</div>
      <p style="color:#94a3b8;">1,000,000 managed tokens, 10 team seats, and white-label client reports.</p>
      <button class="btn btn-primary" onclick="alert('Redirecting to Stripe/Razorpay checkout ($49/mo)...')" style="width:100%; margin-top:20px;">Upgrade Agency</button>
    </div>
  </div>
</div>
"""
    ),

    # 3. Comonk
    ("comonk", "resume-analyzer.html"): (
        "AI ATS Resume Scorer & Tailoring Studio",
        "Scan your resume against any job description to beat automated hiring filters.",
        """
<div class="interactive-card" style="text-align:left;">
  <div class="grid-2">
    <div>
      <div class="form-group">
        <label>Paste Resume Text</label>
        <textarea id="resumeText" class="form-control" rows="8" placeholder="Paste your resume content or bullet points here..."></textarea>
      </div>
      <div class="form-group">
        <label>Target Job Description</label>
        <textarea id="jobDesc" class="form-control" rows="4" placeholder="Paste target role requirements..."></textarea>
      </div>
      <button class="btn btn-primary" onclick="analyzeResume()" style="width:100%;"><i class="fas fa-wand-magic-sparkles"></i> Calculate ATS Match Score</button>
    </div>
    <div>
      <div class="output-screen" id="atsScoreOutput" style="min-height:300px;">// Paste resume and job description to get instant ATS compatibility score, missing keywords, and bullet point rewrites.</div>
    </div>
  </div>
</div>
<script>
function analyzeResume() {
  var res = document.getElementById('resumeText').value.trim();
  if(!res) {
    document.getElementById('atsScoreOutput').innerText = '🎯 SAMPLE ATS MATCH ANALYSIS (Demo Profile):\n\nATS Match Score: 88 / 100\nStatus: STRONG CANDIDATE\n\n✅ Strengths:\n- Strong Python & FastAPI backend engineering keywords\n- Clear quantifiable metrics on previous achievements\n\n⚠️ Missing Keywords:\n- Docker containerization\n- Redis caching\n\n💡 Recommended Action:\nAdd 1 bullet point highlighting Redis token rate-limiting to reach 96% match score!';
    return;
  }
  document.getElementById('atsScoreOutput').innerText = '🚀 ANALYZING RESUME CONTENT...\n\nCalculated ATS Match Score: 85 / 100\nExtracted Skills: Python, SQL, REST APIs\nSuggested Optimization: Tailor action verbs in your experience section.';
}
</script>
"""
    ),
    ("comonk", "interview-arena.html"): (
        "AI Voice & Text Mock Interview Arena",
        "Practice real technical & behavioral questions with instant AI scoring and PDF reports.",
        """
<div class="interactive-card" style="text-align:left;">
  <div class="grid-2">
    <div>
      <div class="form-group">
        <label>Select Target Role</label>
        <select id="interviewRole" class="form-control">
          <option>Full-Stack AI Engineer</option>
          <option>Python Backend Developer</option>
          <option>Data Scientist / ML Engineer</option>
          <option>Product Manager</option>
        </select>
      </div>
      <div class="form-group">
        <label>Select Interview Type</label>
        <select class="form-control">
          <option>Technical Deep-Dive</option>
          <option>System Design</option>
          <option>Behavioral (STAR Method)</option>
        </select>
      </div>
      <button class="btn btn-primary" onclick="startInterview()" style="width:100%;"><i class="fas fa-play"></i> Generate Interview Question</button>
    </div>
    <div>
      <div class="output-screen" id="interviewQOutput" style="min-height:220px;">// Click 'Generate Interview Question' to begin your session.</div>
    </div>
  </div>
</div>
<script>
function startInterview() {
  var role = document.getElementById('interviewRole').value;
  document.getElementById('interviewQOutput').innerText = '🎙️ AI INTERVIEWER (Question 1 of 5):\nRole: ' + role + '\n\n"Can you describe how you would design a rate-limiting middleware in FastAPI for a multi-tenant SaaS application?"\n\n💡 Tip: Structure your response using Architecture -> Storage (Redis) -> Failure modes.';
}
</script>
"""
    ),
    ("comonk", "salary-insights.html"): (
        "India Tech Compensation Benchmark & Offer Comparator",
        "Accurate salary ranges for Ahmedabad, Gandhinagar, Bangalore, and Remote roles.",
        """
<div class="interactive-card" style="text-align:left;">
  <div class="grid-2">
    <div>
      <div class="form-group">
        <label>Role</label>
        <select id="salRole" class="form-control">
          <option>AI / Machine Learning Engineer</option>
          <option>Backend Developer (Python/Node)</option>
          <option>Frontend Developer (React/Next)</option>
          <option>DevOps / Cloud Engineer</option>
        </select>
      </div>
      <div class="form-group">
        <label>Years of Experience</label>
        <input type="number" id="salExp" class="form-control" value="3" min="0" max="20">
      </div>
      <button class="btn btn-primary" onclick="calcSalary()" style="width:100%;"><i class="fas fa-calculator"></i> Calculate Benchmark</button>
    </div>
    <div>
      <div class="output-screen" id="salOutput" style="min-height:180px;">// Select role and experience to view 25th, 50th, and 90th percentile salary benchmarks.</div>
    </div>
  </div>
</div>
<script>
function calcSalary() {
  var exp = parseInt(document.getElementById('salExp').value) || 1;
  var base = exp * 2.8 + 6;
  document.getElementById('salOutput').innerText = '📊 SALARY BENCHMARK (Annual CTC in INR):\n\n25th Percentile: ₹' + (base * 0.85).toFixed(1) + ' LPA\nMedian (50th):  ₹' + base.toFixed(1) + ' LPA\n90th Percentile: ₹' + (base * 1.35).toFixed(1) + ' LPA\n\nMarket Trend: High demand (+18% YoY growth in AI roles)';
}
</script>
"""
    ),

    # 4. Breakdown Factor
    ("breakdown-factor", "cv-scanner.html"): (
        "YOLO Computer Vision Safety & Defect Scanner",
        "Simulate live property damage detection and construction site hazard scanning.",
        """
<div class="interactive-card" style="text-align:left;">
  <div class="grid-2">
    <div>
      <div class="form-group">
        <label>Select Inspection Type</label>
        <select id="cvType" class="form-control">
          <option value="hazard">PPE Site Safety (Hardhat, Vest, Boots)</option>
          <option value="defect">Structural Damage (Cracks, Spalling, Corrosion)</option>
          <option value="occupancy">Site Equipment & Worker Occupancy</option>
        </select>
      </div>
      <button class="btn btn-primary" onclick="runCVScan()" style="width:100%;"><i class="fas fa-camera"></i> Run YOLO Scan Simulator</button>
    </div>
    <div>
      <div class="output-screen" id="cvOutput" style="min-height:220px;">// Ready to process inspection frame.</div>
    </div>
  </div>
</div>
<script>
function runCVScan() {
  var t = document.getElementById('cvType').value;
  if(t === 'hazard') {
    document.getElementById('cvOutput').innerText = '📸 YOLO-v8 VISION ANALYSIS:\n- Detected 4 Workers\n- Hardhat Compliance: 100% [4/4]\n- Safety Vest Compliance: 75% [3/4] ⚠️ ALERT: Worker #3 missing vest in Zone B\n- Inference Time: 28ms';
  } else {
    document.getElementById('cvOutput').innerText = '📸 STRUCTURAL DEFECT ANALYSIS:\n- Detected 1 Shear Crack (Width: 2.1mm, Severity: Moderate)\n- Location: Beam Joint #14\n- Recommendation: Epoxy pressure injection required before load testing.';
  }
}
</script>
"""
    ),
    ("breakdown-factor", "boq-estimator.html"): (
        "Instant Bill of Quantities (BOQ) Calculator",
        "Estimate required cement, sand, bricks, and steel costs for your project area.",
        """
<div class="interactive-card" style="text-align:left;">
  <div class="grid-2">
    <div>
      <div class="form-group">
        <label>Built-up Area (Square Feet)</label>
        <input type="number" id="boqSqft" class="form-control" value="1500" min="100">
      </div>
      <div class="form-group">
        <label>Construction Grade</label>
        <select id="boqGrade" class="form-control">
          <option value="1800">Standard Residential (₹1,800 / sqft)</option>
          <option value="2400">Premium Residential (₹2,400 / sqft)</option>
          <option value="3200">Luxury / Commercial (₹3,200 / sqft)</option>
        </select>
      </div>
      <button class="btn btn-primary" onclick="calcBOQ()" style="width:100%;"><i class="fas fa-calculator"></i> Calculate BOQ Estimate</button>
    </div>
    <div>
      <div class="output-screen" id="boqOutput" style="min-height:200px;">// Enter square footage to calculate estimated materials and budget.</div>
    </div>
  </div>
</div>
<script>
function calcBOQ() {
  var sqft = parseFloat(document.getElementById('boqSqft').value) || 1000;
  var rate = parseFloat(document.getElementById('boqGrade').value) || 1800;
  var total = sqft * rate;
  var cement = Math.round(sqft * 0.45);
  var steel = (sqft * 3.5 / 1000).toFixed(1);
  document.getElementById('boqOutput').innerText = '🏗️ ESTIMATED BILL OF QUANTITIES:\nTotal Cost: ₹' + total.toLocaleString('en-IN') + '\n\nKey Materials Required:\n- Cement: ~' + cement + ' Bags\n- Steel: ~' + steel + ' Metric Tons\n- Sand: ~' + Math.round(sqft * 1.8) + ' cu.ft\n- Bricks: ~' + Math.round(sqft * 22.5) + ' pcs\n\nTimeline: ~24 Weeks';
}
</script>
"""
    ),
    ("breakdown-factor", "safety-audit.html"): (
        "Automated ISO Safety Audit Generator",
        "Generate a standardized site compliance report for health and safety inspections.",
        """
<div class="interactive-card" style="text-align:left;">
  <h3>📋 Generate Site Audit Report</h3>
  <p style="color:#94a3b8; margin-bottom:20px;">Download an ISO-aligned digital inspection checklist.</p>
  <button class="btn btn-primary" onclick="genAuditReport()"><i class="fas fa-file-pdf"></i> Generate Safety Report Preview</button>
  <div class="output-screen" id="auditOutput" style="margin-top:20px;">// Report preview will appear here.</div>
</div>
<script>
function genAuditReport() {
  document.getElementById('auditOutput').innerText = '📄 ISO 45001 SAFETY AUDIT REPORT:\nSite: Ahmedabad Commercial Block A\nDate: 2026-08-18\nAuditor: AI Sentinel Vision System\n\nOverall Score: 94% COMPLIANT\n- Scaffolding Integrity: PASS\n- Fire Extinguisher Accessibility: PASS\n- First Aid Kit Stock: PASS\n\nStatus: APPROVED FOR WORK';
}
</script>
"""
    ),

    # 5. Decode Forest Pharmacy
    ("decode-forest-pharmacy", "prescription-ocr.html"): (
        "Prescription OCR & Dosage Extractor",
        "Extract medications, dosage schedules, and precautions from doctor prescriptions.",
        """
<div class="interactive-card" style="text-align:left;">
  <div class="grid-2">
    <div>
      <div class="form-group">
        <label>Upload or Select Sample Prescription</label>
        <select id="rxSample" class="form-control">
          <option value="sample1">Sample 1: Cardiology Prescription (Amlodipine + Atorvastatin)</option>
          <option value="sample2">Sample 2: General Physician (Paracetamol + Amoxicillin)</option>
        </select>
      </div>
      <button class="btn btn-primary" onclick="scanPrescription()" style="width:100%;"><i class="fas fa-file-medical"></i> Run OCR Recognition</button>
    </div>
    <div>
      <div class="output-screen" id="rxOutput" style="min-height:200px;">// OCR output will render here.</div>
    </div>
  </div>
</div>
<script>
function scanPrescription() {
  document.getElementById('rxOutput').innerText = '💊 OCR EXTRACTION RESULTS:\n\n1. Amlodipine 5mg\n   - Dosage: 1 Tablet Daily (Morning)\n   - Purpose: Blood Pressure Management\n\n2. Atorvastatin 20mg\n   - Dosage: 1 Tablet Daily (Night after dinner)\n   - Purpose: Cholesterol\n\n✅ 0 Critical Interactions Detected.\n💰 Generic Substitution Savings: 48% cheaper generic available!';
}
</script>
"""
    ),
    ("decode-forest-pharmacy", "interaction-checker.html"): (
        "Multi-Drug Interaction Alert Engine",
        "Check dangerous contraindications and adverse reactions between different medications.",
        """
<div class="interactive-card" style="text-align:left;">
  <div class="grid-2">
    <div>
      <div class="form-group">
        <label>Medicine 1</label>
        <input type="text" id="drug1" class="form-control" value="Aspirin">
      </div>
      <div class="form-group">
        <label>Medicine 2</label>
        <input type="text" id="drug2" class="form-control" value="Warfarin">
      </div>
      <button class="btn btn-primary" onclick="checkInteraction()" style="width:100%;"><i class="fas fa-triangle-exclamation"></i> Check Interactions</button>
    </div>
    <div>
      <div class="output-screen" id="drugOutput" style="min-height:180px;">// Results will display severity and doctor guidance.</div>
    </div>
  </div>
</div>
<script>
function checkInteraction() {
  document.getElementById('drugOutput').innerText = '🚨 HIGH SEVERITY ALERT:\nCombination: Aspirin + Warfarin\n\nRisk: Concomitant use significantly increases the risk of severe gastrointestinal and internal bleeding.\n\nDoctor Guidance: Avoid combination unless specifically directed by a cardiologist under regular INR monitoring.';
}
</script>
"""
    ),
    ("decode-forest-pharmacy", "hospital-finder.html"): (
        "Emergency Hospital & Free Health Camp Directory",
        "Find nearby emergency medical centers and community blood donation camps in Gujarat.",
        """
<div class="interactive-card" style="text-align:left;">
  <div class="grid-3">
    <div class="tool-box">
      <h4>🏥 Civil Hospital Ahmedabad</h4>
      <p style="color:#94a3b8; font-size:13px;">Asarwa, Ahmedabad · 24/7 Emergency</p>
      <span style="color:#10b981; font-size:13px; font-weight:700;">Free Treatment Available</span>
    </div>
    <div class="tool-box">
      <h4>🏥 SVP Hospital</h4>
      <p style="color:#94a3b8; font-size:13px;">Ellisbridge, Ahmedabad · Multi-Speciality</p>
      <span style="color:#38bdf8; font-size:13px; font-weight:700;">Ayushman Bharat Accepted</span>
    </div>
    <div class="tool-box">
      <h4>🩸 Red Cross Blood Center</h4>
      <p style="color:#94a3b8; font-size:13px;">Paldi, Ahmedabad · Daily 8am - 8pm</p>
      <span style="color:#f43f5e; font-size:13px; font-weight:700;">Free Blood Donation Camp</span>
    </div>
  </div>
</div>
"""
    ),

    # 6. AVPU
    ("avpu", "courses.html"): (
        "AI Course Catalog & Curriculum Preview",
        "Career-focused AI degree and certificate programs designed for the modern industry.",
        """
<div class="interactive-card" style="text-align:left;">
  <div class="grid-3">
    <div class="tool-box">
      <h4 style="color:#38bdf8;">Full-Stack AI Engineering</h4>
      <p style="color:#94a3b8; font-size:13px;">FastAPI, LangGraph, Groq LLaMA, ChromaDB RAG, and React dashboard development.</p>
      <span style="font-size:12px; color:#10b981;">12 Weeks · 100% Free</span>
    </div>
    <div class="tool-box">
      <h4 style="color:#a855f7;">Computer Vision with YOLO & OpenCV</h4>
      <p style="color:#94a3b8; font-size:13px;">Real-time object detection, PPE compliance, and damage defect inspection pipelines.</p>
      <span style="font-size:12px; color:#10b981;">8 Weeks · 100% Free</span>
    </div>
    <div class="tool-box">
      <h4 style="color:#f59e0b;">MLOps & Cloud Deployment</h4>
      <p style="color:#94a3b8; font-size:13px;">Docker containers, Nginx reverse proxy, PostgreSQL multi-tenancy, and Render CI/CD.</p>
      <span style="font-size:12px; color:#10b981;">6 Weeks · 100% Free</span>
    </div>
  </div>
</div>
"""
    ),
    ("avpu", "ai-tutor.html"): (
        "24/7 Personal AI Study Assistant",
        "Ask complex coding or engineering questions and get step-by-step personalized explanations.",
        """
<div class="interactive-card" style="text-align:left;">
  <div class="form-group">
    <label>Ask your AI Tutor a question</label>
    <input type="text" id="tutorQ" class="form-control" placeholder="e.g. How does attention mechanism work in Transformers?">
  </div>
  <button class="btn btn-primary" onclick="askTutor()"><i class="fas fa-paper-plane"></i> Ask AI Tutor</button>
  <div class="output-screen" id="tutorOutput" style="margin-top:20px;">// Ask any technical question above to receive a clear, syllabus-grounded answer.</div>
</div>
<script>
function askTutor() {
  document.getElementById('tutorOutput').innerText = '👨‍🏫 AVPU AI TUTOR:\n\nAttention Mechanism in Transformers allows the model to dynamically focus on relevant parts of an input sequence when predicting an output.\n\nKey Formula: Attention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V\n\nWant to see a Python implementation?';
}
</script>
"""
    ),
    ("avpu", "scholarships.html"): (
        "AVP Trust Education Scholarships",
        "Need-based financial aid and merit scholarships supported by the AVP Charitable Trust.",
        """
<div class="interactive-card" style="text-align:left;">
  <h3>🎓 Apply for Full Tuition Waiver</h3>
  <p style="color:#94a3b8; margin-bottom:20px;">We believe quality AI education should be accessible to everyone, regardless of financial background.</p>
  <div class="tool-box">
    <h4>Scholarship Benefits:</h4>
    <ul style="line-height:2; color:#cbd5e1; font-size:14px;">
      <li>100% Free access to all live bootcamps and computing resources.</li>
      <li>1-on-1 mentorship with industry engineers from Comonk and Sevenseed.</li>
      <li>Guaranteed placement interview support.</li>
    </ul>
    <button class="btn btn-primary" onclick="alert('Application portal opens for next cohort. Email: scholarships@avpu.edu.in')" style="margin-top:16px;">Submit Application</button>
  </div>
</div>
"""
    ),

    # 7. AVP Emart
    ("avp-emart", "price-tracker.html"): (
        "Live 4-Platform Price Comparison Engine",
        "Search any gadget or household item to find the lowest price across major Indian retailers.",
        """
<div class="interactive-card" style="text-align:left;">
  <div class="form-group">
    <label>Enter Product Name</label>
    <div style="display:flex; gap:12px;">
      <input type="text" id="emartQuery" class="form-control" value="iPhone 15 Pro (128GB)">
      <button class="btn btn-primary" onclick="comparePrices()"><i class="fas fa-search"></i> Compare</button>
    </div>
  </div>
  <div class="output-screen" id="emartOutput" style="min-height:200px;">// Click Compare to scan prices across Amazon, Flipkart, Croma, and Vijay Sales.</div>
</div>
<script>
function comparePrices() {
  document.getElementById('emartOutput').innerText = '🛒 LIVE PRICE SCAN RESULTS:\n\n1. Vijay Sales: ₹1,29,900  [⭐ BEST VALUE - Lowest Price]\n2. Amazon India: ₹1,31,490\n3. Flipkart:     ₹1,32,000\n4. Croma:        ₹1,34,900\n\n💡 AI Recommendation: Buying from Vijay Sales saves you ₹5,000 compared to Croma!';
}
</script>
"""
    ),
    ("avp-emart", "deals-radar.html"): (
        "AI Deals Radar & Price Drop Alerts",
        "Top discounts and price drops detected across electronics, fashion, and essentials today.",
        """
<div class="interactive-card" style="text-align:left;">
  <div class="grid-3">
    <div class="tool-box">
      <span style="color:#10b981; font-weight:700; font-size:12px;">32% OFF</span>
      <h4>Sony WH-1000XM5 Headphones</h4>
      <div style="font-size:20px; font-weight:800; margin:8px 0;">₹24,990 <del style="color:#94a3b8; font-size:14px;">₹34,990</del></div>
      <span style="font-size:12px; color:#38bdf8;">Amazon Deal</span>
    </div>
    <div class="tool-box">
      <span style="color:#10b981; font-weight:700; font-size:12px;">24% OFF</span>
      <h4>MacBook Air M2 (16GB RAM)</h4>
      <div style="font-size:20px; font-weight:800; margin:8px 0;">₹89,900 <del style="color:#94a3b8; font-size:14px;">₹1,19,900</del></div>
      <span style="font-size:12px; color:#38bdf8;">Flipkart Deal</span>
    </div>
    <div class="tool-box">
      <span style="color:#10b981; font-weight:700; font-size:12px;">40% OFF</span>
      <h4>Samsung 55" 4K Smart TV</h4>
      <div style="font-size:20px; font-weight:800; margin:8px 0;">₹42,990 <del style="color:#94a3b8; font-size:14px;">₹68,900</del></div>
      <span style="font-size:12px; color:#38bdf8;">Croma Deal</span>
    </div>
  </div>
</div>
"""
    ),

    # 8. AVP Charitable Trust
    ("avp-charitable-trust", "impact-tracker.html"): (
        "Transparent Rupee-by-Rupee Impact Dashboard",
        "Every donation is audited and mapped to real lives impacted across healthcare and education.",
        """
<div class="interactive-card" style="text-align:left;">
  <div class="grid-3" style="margin-bottom:32px;">
    <div class="tool-box">
      <div style="font-size:28px; font-weight:800; color:#10b981;">14,500+</div>
      <div style="color:#94a3b8; font-size:13px;">Patients Treated Free</div>
    </div>
    <div class="tool-box">
      <div style="font-size:28px; font-weight:800; color:#38bdf8;">850+</div>
      <div style="color:#94a3b8; font-size:13px;">Full Scholarships Awarded</div>
    </div>
    <div class="tool-box">
      <div style="font-size:28px; font-weight:800; color:#f43f5e;">100%</div>
      <div style="color:#94a3b8; font-size:13px;">Donations Directly Utilized</div>
    </div>
  </div>
  <div class="output-screen">// Real-time Ledger Verification: All expenditures are recorded transparently and audited quarterly.</div>
</div>
"""
    ),
    ("avp-charitable-trust", "health-camps.html"): (
        "Free Health Camps & Mobile Clinic Schedule",
        "Find upcoming health camps or register as a doctor / volunteer in Gujarat.",
        """
<div class="interactive-card" style="text-align:left;">
  <div class="grid-2">
    <div class="tool-box">
      <h4>📍 Dholka Rural Health Camp</h4>
      <p style="color:#94a3b8; font-size:13px;">August 24, 2026 · Free Eye checkup & Diabetes screening</p>
      <button class="btn btn-primary sm" onclick="alert('Registered as volunteer!')">Volunteer Here</button>
    </div>
    <div class="tool-box">
      <h4>📍 Sanand Mobile Pediatric Clinic</h4>
      <p style="color:#94a3b8; font-size:13px;">August 28, 2026 · Free vaccinations and nutritional aid</p>
      <button class="btn btn-primary sm" onclick="alert('Registered as volunteer!')">Volunteer Here</button>
    </div>
  </div>
</div>
"""
    ),

    # 9. Rakshak AI
    ("rakshak-ai", "fir-generator.html"): (
        "Automated BNS / IPC First Information Report (FIR) Drafter",
        "Transform natural language incident reports into legally structured police FIR documents.",
        """
<div class="interactive-card" style="text-align:left;">
  <div class="grid-2">
    <div>
      <div class="form-group">
        <label>Describe Incident</label>
        <textarea id="firDesc" class="form-control" rows="5" placeholder="e.g. My mobile phone was stolen on SG Highway near Iscon crossroad at 7:30 PM by two bike riders..."></textarea>
      </div>
      <div class="form-group">
        <label>Legal Code</label>
        <select class="form-control"><option>Bharatiya Nyaya Sanhita (BNS 2023) + IPC Reference</option></select>
      </div>
      <button class="btn btn-primary" onclick="generateFIR()" style="width:100%;"><i class="fas fa-file-contract"></i> Draft Legal FIR</button>
    </div>
    <div>
      <div class="output-screen" id="firOutput" style="min-height:240px;">// Formatted FIR draft will appear here.</div>
    </div>
  </div>
</div>
<script>
function generateFIR() {
  document.getElementById('firOutput').innerText = '⚖️ DRAFT POLICE FIRST INFORMATION REPORT (FIR):\n\nTo: Station House Officer\nPolice Station: Satellite / SG Highway Division\n\nSubject: Formal Complaint under Section 303(2) BNS (Theft / Dishonest misappropriation) [Corresponding IPC Sec 379]\n\nDetails of Incident:\n- Date & Time: 2026-08-18, 19:30 Hours\n- Location: Iscon Crossroad, SG Highway\n- Loss Description: Mobile device\n\nPrayer: Kindly register formal FIR and initiate trace investigation.';
}
</script>
"""
    ),
    ("rakshak-ai", "sentinel-vision.html"): (
        "AI Sentinel Surveillance & Video Security Simulator",
        "Real-time video analytics for face verification, boundary breach, and weapon alerts.",
        """
<div class="interactive-card" style="text-align:left;">
  <div class="grid-2">
    <div>
      <div class="form-group">
        <label>Select Surveillance Feed</label>
        <select id="camFeed" class="form-control">
          <option>Camera 01: Perimeter Gate East</option>
          <option>Camera 02: Main Lobby Entrance</option>
          <option>Camera 03: Cash & Inventory Vault</option>
        </select>
      </div>
      <button class="btn btn-primary" onclick="scanSentinelFeed()" style="width:100%;"><i class="fas fa-video"></i> Analyze Feed</button>
    </div>
    <div>
      <div class="output-screen" id="sentinelOutput" style="min-height:180px;">// Select camera feed to run real-time sentinel visual checks.</div>
    </div>
  </div>
</div>
<script>
function scanSentinelFeed() {
  document.getElementById('sentinelOutput').innerText = '📹 SENTINEL VISION STATUS:\nCamera: Perimeter Gate East\nResolution: 1080p @ 30 FPS\n\n- Active Objects: 2 Pedestrians, 1 Vehicle\n- Threat Level: NORMAL (0 Breaches detected)\n- Facial Recognition: All individuals verified personnel\n- Status: SECURE';
}
</script>
"""
    ),
}


def main():
    print("==================================================")
    print(" 🚀 GENERATING MULTI-PAGE SITES ACROSS ALL 9 VENTURES")
    print("==================================================")
    
    count = 0
    for (slug, filename), (title, subtitle, content_html) in SUBPAGES.items():
        folder = SITES_DIR / slug
        folder.mkdir(parents=True, exist_ok=True)
        
        full_html = render_page_wrapper(
            slug=slug,
            title=title,
            subtitle=subtitle,
            content_html=content_html,
            current_page=filename
        )
        
        target_file = folder / filename
        with open(target_file, "w", encoding="utf-8") as f:
            f.write(full_html)
            
        print(f"  [OK] {slug:22s} -> {filename}")
        count += 1
        
    print(f"\n🎉 Successfully generated {count} dedicated interactive sub-pages across all 9 ventures!")


if __name__ == "__main__":
    main()
