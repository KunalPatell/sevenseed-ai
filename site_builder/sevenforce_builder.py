# -*- coding: utf-8 -*-
"""
Sevenforce — Autonomous Multi-Agent AI Workforce Builder.
Engineered with features from:
- Cognition AI / Devin (Sandboxed Autonomous Developer Terminal & Git Diff Viewer)
- Sintra.ai (7 Named Specialized AI Employees with 1-Click Task Dispatch)
- LangGraph Studio (Visual DAG Workflow Choreography & Node Telemetry)
- 21st.dev (Conic Animated Border Beams & Bento Grids)
- Unicorn Studio (Liquid Fluid Shader Background)
- Aceternity UI (Overhead Lamp Illumination & 3D Card Tilt)
"""

def render_sevenforce_html(c):
    email, phone, location = c["contact"]
    
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sevenforce — Autonomous Multi-Agent AI Workforce</title>
  <meta name="description" content="Deploy a team of 7 autonomous AI employees for marketing, sales, software engineering, and legal review. Powered by LangGraph and Devin-style sandboxes.">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Sevenforce — Autonomous AI Workforce">
  <meta property="og:description" content="Deploy 7 specialized AI employees powered by LangGraph multi-agent choreography.">
  <meta property="og:url" content="https://sevenseed.onrender.com/sevenforce/">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='88'%3E🤖%3C/text%3E%3C/svg%3E">
  <script>(function(){{try{{var t=localStorage.getItem('ss-theme')||'dark';document.documentElement.setAttribute('data-theme',t);}}catch(e){{}}}})();</script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link rel="stylesheet" href="style.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <style>
    :root {{
      --seven-cyan: #06b6d4;
      --seven-cyan-l: #22d3ee;
      --seven-emerald: #10b981;
    }}
    .terminal-teaser-wrap {{
      background: #020617;
      border: 1px solid #1e293b;
      border-radius: 16px;
      padding: 24px;
      margin-top: 32px;
      font-family: 'JetBrains Mono', monospace;
      box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    }}
  </style>
</head>
<body data-variant="dashboard" style="--font-display:'Outfit', sans-serif;">
<span id="top"></span>

<div class="preloader" id="preloader">
  <div class="pl-glow pl-glow-1"></div>
  <div class="pl-glow pl-glow-2"></div>
  <div class="pl-content">
    <div class="pl-logo">
      <div class="pl-icon-wrap"><i class="fas fa-users-gear pl-icon"></i><span class="pl-ring"></span></div>
      <div class="pl-name">SEVENFORCE</div>
    </div>
    <div class="pl-progress">
      <div class="pl-bar-track"><div class="pl-bar" id="plBar"></div></div>
      <div class="pl-text">CONNECTING 7 AUTONOMOUS AGENTS… <span id="plPct">0</span>%</div>
    </div>
  </div>
</div>
<div class="grain" aria-hidden="true"></div>
<div class="scroll-progress" id="scrollProgress"></div>
<div class="cursor-ring" id="cursorRing" aria-hidden="true"></div>

<!-- Top Navigation -->
<nav class="nav">
  <a class="logo" href="#top">
    <span class="logo-icon"><i class="fas fa-users-gear"></i></span>
    <span class="logo-text">Seven<span class="logo-accent">force</span></span>
  </a>
  <div class="nav-links" id="navLinks">
    <a href="workflows.html"><i class="fas fa-diagram-project" style="color:#22d3ee;"></i> LangGraph Studio</a>
    <a href="devin-terminal.html"><i class="fas fa-terminal" style="color:#fbbf24;"></i> Devin AI Terminal</a>
    <a href="employees.html"><i class="fas fa-users" style="color:#34d399;"></i> 7 AI Employees</a>
    <a href="pricing.html"><i class="fas fa-calculator" style="color:#c084fc;"></i> ROI Calculator</a>
    <a href="#feature-suites">Workstations</a>
    <a href="#faq">FAQ</a>
  </div>
  <div class="nav-right">
    <button class="icon-btn" id="searchBtn" type="button" aria-label="Search (Ctrl+K)" title="Search (Ctrl+K)"><i class="fas fa-magnifying-glass"></i></button>
    <button class="icon-btn" id="themeToggle" type="button" aria-label="Toggle light / dark theme" title="Toggle theme"><i class="fas fa-moon"></i></button>
    <a class="btn btn-ghost" href="devin-terminal.html"><i class="fas fa-terminal"></i> Terminal</a>
    <a class="btn btn-primary" href="employees.html"><i class="fas fa-rocket"></i> Deploy Agents</a>
    <button class="hamburger" id="hamburger" aria-label="Menu"><i class="fas fa-bars"></i></button>
  </div>
</nav>

<!-- Hero Section with Overhead Lamp & 3D Multi-Agent Dodecahedron Core -->
<header class="hero">
  <div class="hero-lamp"></div>
  <div class="hero-lamp-line"></div>
  <div class="liquid-mesh"></div>
  <div class="meteors-container">
    <span class="meteor" style="--top:12%; --left:22%; --delay:0s; --duration:4.2s;"></span>
    <span class="meteor" style="--top:28%; --left:66%; --delay:1.5s; --duration:5.4s;"></span>
  </div>
  <div class="hero-glow"></div>
  <div class="hero-grid"></div>

  <div class="hero-content">
    <div class="hero-pill" data-blur-in style="--i:0">
      <i class="fas fa-users-gear"></i> <span>Autonomous Multi-Agent Workforce · LangGraph Engine · 100% Free</span>
    </div>
    <h1 class="hero-title" data-blur-in style="--i:1">
      Deploy a Team of <span class="grad">7 Autonomous AI Employees</span> in 60 Seconds.
    </h1>
    <p class="hero-sub" data-blur-in style="--i:2">
      Built with inspiration from Cognition Devin and Sintra AI. Choreograph multi-agent swarms using LangGraph visual workflows, sandboxed shell execution, and specialized personas for marketing, sales, engineering, and legal compliance.
    </p>

    <div class="hero-actions" data-blur-in style="--i:3">
      <a class="btn btn-primary lg" href="devin-terminal.html"><i class="fas fa-terminal"></i> Launch Devin AI Terminal →</a>
      <a class="btn btn-ghost lg" href="workflows.html"><i class="fas fa-diagram-project"></i> LangGraph Studio</a>
      <a class="btn btn-ghost lg" href="employees.html"><i class="fas fa-users"></i> Inspect 7 Employees</a>
    </div>

    <div class="stats-row" data-blur-in style="--i:4">
      <div class="stat"><span class="stat-num">7 Agents</span><span class="stat-lbl">Full-Time Workforce</span></div>
      <div class="stat"><span class="stat-num">120ms</span><span class="stat-lbl">Dispatch Latency</span></div>
      <div class="stat"><span class="stat-num">100%</span><span class="stat-lbl">Zero SaaS Markup</span></div>
      <div class="stat"><span class="stat-num">24/7</span><span class="stat-lbl">Autonomous Uptime</span></div>
    </div>

    <div class="hero-marquee" data-blur-in style="--i:5">
      <div class="marquee-track">
        <span>Devin Autonomous Terminal</span><span>LangGraph Multi-Agent DAG</span><span>Ava (Marketing)</span><span>Liam (Sales)</span><span>Noah (Recruiting)</span><span>Maya (Data)</span><span>Leo (Engineering)</span>
        <span>Devin Autonomous Terminal</span><span>LangGraph Multi-Agent DAG</span><span>Ava (Marketing)</span><span>Liam (Sales)</span><span>Noah (Recruiting)</span><span>Maya (Data)</span><span>Leo (Engineering)</span>
      </div>
    </div>
  </div>

  <!-- 3D PBR WebGL Interactive Stage -->
  <div class="hero-3d-stage" id="hero3dStage">
    <canvas id="hero3dCanvas"></canvas>
    <div class="aura-telemetry left"><span class="aura-dot"></span> 120 FPS WebGL · Multi-Agent Swarm</div>
    <div class="aura-telemetry right"><i class="fas fa-arrows-spin"></i> 360° Drag & Orbit</div>
  </div>
</header>

<!-- Bento Workstations -->
<section class="section" id="feature-suites" style="padding-top:40px; padding-bottom:60px;">
  <div class="sec-head reveal">
    <div class="eyebrow"><i class="fas fa-cubes"></i> Autonomous Workforce Engines</div>
    <h2 class="sec-title">Interactive AI Agent Workstations</h2>
    <p class="sec-sub">Built with LangGraph multi-agent choreography, sandboxed code execution, and autonomous enterprise workforce dispatch.</p>
  </div>

  <div class="bento-showcase">
    <!-- 1. LangGraph Studio -->
    <div class="border-beam-card">
      <div>
        <div style="font-size:32px; margin-bottom:12px;">🕸️</div>
        <h3 style="font-size:18px; font-weight:700; color:#fff; margin-bottom:8px;">LangGraph Agent Studio</h3>
        <p style="font-size:13px; color:var(--text-2); line-height:1.6; margin-bottom:16px;">Visual DAG workflow designer connecting Supervisor, Researcher, Coder, and Critic nodes with real-time token telemetry.</p>
      </div>
      <a class="btn btn-primary sm" href="workflows.html"><i class="fas fa-diagram-project"></i> Open Agent Studio →</a>
    </div>

    <!-- 2. Devin Terminal -->
    <div class="border-beam-card">
      <div>
        <div style="font-size:32px; margin-bottom:12px;">💻</div>
        <h3 style="font-size:18px; font-weight:700; color:#fff; margin-bottom:8px;">Devin AI Terminal</h3>
        <p style="font-size:13px; color:var(--text-2); line-height:1.6; margin-bottom:16px;">Sandboxed autonomous developer workspace with virtual shell, git diff viewer, test runner, and automated PR generation.</p>
      </div>
      <a class="btn btn-primary sm" href="devin-terminal.html"><i class="fas fa-terminal"></i> Launch Terminal →</a>
    </div>

    <!-- 3. 7 AI Employees -->
    <div class="border-beam-card">
      <div>
        <div style="font-size:32px; margin-bottom:12px;">👥</div>
        <h3 style="font-size:18px; font-weight:700; color:#fff; margin-bottom:8px;">7 AI Employees Suite</h3>
        <p style="font-size:13px; color:var(--text-2); line-height:1.6; margin-bottom:16px;">Complete directory and dispatch console for Ava, Liam, Noah, Maya, Ethan, Leo, and specialized enterprise agents.</p>
      </div>
      <a class="btn btn-primary sm" href="employees.html"><i class="fas fa-users-gear"></i> Inspect Employees →</a>
    </div>

    <!-- 4. ROI Calculator -->
    <div class="border-beam-card">
      <div>
        <div style="font-size:32px; margin-bottom:12px;">📈</div>
        <h3 style="font-size:18px; font-weight:700; color:#fff; margin-bottom:8px;">Enterprise ROI Calculator</h3>
        <p style="font-size:13px; color:var(--text-2); line-height:1.6; margin-bottom:16px;">Transparent pricing tiers, per-seat unit economics, and interactive ROI calculator showing headcount cost displacement.</p>
      </div>
      <a class="btn btn-primary sm" href="pricing.html"><i class="fas fa-calculator"></i> Calculate ROI →</a>
    </div>
  </div>
</section>

<!-- Group Footer -->
<footer class="foot">
  <div class="foot-grid">
    <div class="foot-brand">
      <a class="logo" href="#top">
        <span class="logo-icon"><i class="fas fa-users-gear"></i></span>
        <span class="logo-text">Seven<span class="logo-accent">force</span></span>
      </a>
      <p>Autonomous Multi-Agent AI Workforce. Part of the Sevenseed AI Venture Studio portfolio.</p>
    </div>
    <div class="foot-col">
      <h5>Agent Tools</h5>
      <ul>
        <li><a href="workflows.html">LangGraph Studio</a></li>
        <li><a href="devin-terminal.html">Devin AI Terminal</a></li>
        <li><a href="employees.html">7 AI Employees</a></li>
        <li><a href="pricing.html">ROI Calculator</a></li>
        <li><a href="../index.html">Sevenseed Hub</a></li>
      </ul>
    </div>
    <div class="foot-col">
      <h5>Connect</h5>
      <ul>
        <li><span><i class="fas fa-envelope"></i> {email}</span></li>
        <li><span><i class="fas fa-location-dot"></i> {location}</span></li>
        <li><a href="https://github.com/KunalPatell/sevenseed-ai" target="_blank" rel="noopener"><i class="fab fa-github"></i> Public GitHub</a></li>
      </ul>
    </div>
  </div>
  <div class="foot-bottom">
    <div>© 2026 Sevenforce. 100% Free AI Workforce Automation. Part of Sevenseed AI Studio.</div>
  </div>
</footer>

<script src="app.js"></script>
</body>
</html>"""
