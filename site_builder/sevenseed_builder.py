# -*- coding: utf-8 -*-
"""
Sevenseed Studio Hub — AI Venture Studio & Incubator Platform.
Engineered with features from:
- AngelList / Carta (Syndicate Waterfall Simulator, 20% Carry, LP Payouts)
- Y Combinator (TAM / SAM / SOM Bottom-Up Market Sizing Calculator)
- Zero-Margin BYOK Vault (Client-Side Encrypted API Key Manager)
- Venture Portfolio Explorer (All 8 Incubated Enterprises)
- 21st.dev (Conic Animated Border Beams & Bento Grids)
- Unicorn Studio (Liquid Fluid Shader Background)
- Aceternity UI (Overhead Lamp Illumination & 3D Card Tilt)
"""

def render_sevenseed_html(c):
    email, phone, location = c["contact"]
    
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sevenseed — AI Venture Studio & Startup Incubator</title>
  <meta name="description" content="An AI-first startup studio that ideates, incubates, and launches AI ventures powered by LLM agents, RAG, and computer vision on a shared AI infrastructure.">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Sevenseed — AI Venture Studio">
  <meta property="og:description" content="We engineer AI-native companies from seed to scale on shared infrastructure.">
  <meta property="og:url" content="https://sevenseed.onrender.com/">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='88'%3E🌱%3C/text%3E%3C/svg%3E">
  <script>(function(){{try{{var t=localStorage.getItem('ss-theme')||'dark';document.documentElement.setAttribute('data-theme',t);}}catch(e){{}}}})();</script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link rel="stylesheet" href="style.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
</head>
<body data-variant="bold-centered" style="--font-display:'Outfit', sans-serif;">
<span id="top"></span>

<div class="preloader" id="preloader">
  <div class="pl-glow pl-glow-1"></div>
  <div class="pl-glow pl-glow-2"></div>
  <div class="pl-content">
    <div class="pl-logo">
      <div class="pl-icon-wrap"><i class="fas fa-seedling pl-icon"></i><span class="pl-ring"></span></div>
      <div class="pl-name">SEVENSEED</div>
    </div>
    <div class="pl-progress">
      <div class="pl-bar-track"><div class="pl-bar" id="plBar"></div></div>
      <div class="pl-text">INITIALIZING SHARED AI BACKBONE… <span id="plPct">0</span>%</div>
    </div>
  </div>
</div>
<div class="grain" aria-hidden="true"></div>
<div class="scroll-progress" id="scrollProgress"></div>
<div class="cursor-ring" id="cursorRing" aria-hidden="true"></div>

<!-- Top Navigation -->
<nav class="nav">
  <a class="logo" href="#top">
    <span class="logo-icon"><i class="fas fa-seedling"></i></span>
    <span class="logo-text">Seven<span class="logo-accent">seed</span></span>
  </a>
  <div class="nav-links" id="navLinks">
    <a href="syndicate-ruv.html"><i class="fas fa-chart-pie" style="color:#6366f1;"></i> Syndicate & RUV</a>
    <a href="market-sizing.html"><i class="fas fa-calculator" style="color:#a855f7;"></i> TAM / SAM / SOM</a>
    <a href="ventures.html"><i class="fas fa-cubes" style="color:#38bdf8;"></i> Portfolio</a>
    <a href="pricing.html"><i class="fas fa-tag" style="color:#34d399;"></i> Pricing</a>
    <a href="byok.html"><i class="fas fa-key" style="color:#fbbf24;"></i> BYOK Vault</a>
    <a href="#portfolio">Ventures</a>
    <a href="#faq">FAQ</a>
  </div>
  <div class="nav-right">
    <button class="icon-btn" id="searchBtn" type="button" aria-label="Search (Ctrl+K)" title="Search (Ctrl+K)"><i class="fas fa-magnifying-glass"></i></button>
    <button class="icon-btn" id="themeToggle" type="button" aria-label="Toggle light / dark theme" title="Toggle theme"><i class="fas fa-moon"></i></button>
    <a class="btn btn-ghost" href="ventures.html"><i class="fas fa-cubes"></i> Portfolio</a>
    <a class="btn btn-primary" href="#contact"><i class="fas fa-paper-plane"></i> Pitch Studio</a>
    <button class="hamburger" id="hamburger" aria-label="Menu"><i class="fas fa-bars"></i></button>
  </div>
</nav>

<!-- Hero Section with Overhead Lamp & 3D Venture Seed Core -->
<header class="hero">
  <div class="hero-lamp"></div>
  <div class="hero-lamp-line"></div>
  <div class="liquid-mesh"></div>
  <div class="meteors-container">
    <span class="meteor" style="--top:8%; --left:22%; --delay:0s; --duration:3.8s;"></span>
    <span class="meteor" style="--top:26%; --left:68%; --delay:1.2s; --duration:5.2s;"></span>
  </div>
  <div class="hero-glow"></div>
  <div class="hero-grid"></div>

  <div class="hero-content">
    <div class="hero-pill" data-blur-in style="--i:0">
      <i class="fas fa-seedling"></i> <span>AI-Native Venture Studio · 8 Startups · Shared AI Platform</span>
    </div>
    <h1 class="hero-title" data-blur-in style="--i:1">
      We Build <span class="grad">AI-Native Companies</span><br>from Seed to Scale.
    </h1>
    <p class="hero-sub" data-blur-in style="--i:2">
      Sevenseed is an AI-first startup studio that ideates, incubates, and scales high-impact companies across career intelligence, higher education, price intelligence, clinical healthcare, construction safety, and social welfare — powered by a shared LLM and multi-agent infrastructure.
    </p>

    <div class="hero-actions" data-blur-in style="--i:3">
      <a class="btn btn-primary lg" href="ventures.html"><i class="fas fa-cubes"></i> Explore 8 Studio Ventures →</a>
      <a class="btn btn-ghost lg" href="syndicate-ruv.html"><i class="fas fa-chart-pie"></i> AngelList Syndicate Model</a>
      <a class="btn btn-ghost lg" href="byok.html"><i class="fas fa-key"></i> BYOK Vault</a>
    </div>

    <div class="stats-row" data-blur-in style="--i:4">
      <div class="stat"><span class="stat-num">8 Ventures</span><span class="stat-lbl">Active Incubations</span></div>
      <div class="stat"><span class="stat-num">6 Sectors</span><span class="stat-lbl">Broad Coverage</span></div>
      <div class="stat"><span class="stat-num">1 Shared Brain</span><span class="stat-lbl">Unified AI Backbone</span></div>
      <div class="stat"><span class="stat-num">100%</span><span class="stat-lbl">Free BYOK Delivery</span></div>
    </div>

    <div class="hero-marquee" data-blur-in style="--i:5">
      <div class="marquee-track">
        <span>AVPU (AI University)</span><span>AVP Emart (Price Radar)</span><span>Sevenforce (AI Workforce)</span><span>Comonk AI (Career Copilot)</span><span>Decode Pharmacy</span><span>Breakdown Factor</span><span>AVP Charitable Trust</span><span>Rakshak AI</span>
        <span>AVPU (AI University)</span><span>AVP Emart (Price Radar)</span><span>Sevenforce (AI Workforce)</span><span>Comonk AI (Career Copilot)</span><span>Decode Pharmacy</span><span>Breakdown Factor</span><span>AVP Charitable Trust</span><span>Rakshak AI</span>
      </div>
    </div>
  </div>

  <!-- 3D PBR WebGL Interactive Stage -->
  <div class="hero-3d-stage" id="hero3dStage">
    <canvas id="hero3dCanvas"></canvas>
    <div class="aura-telemetry left"><span class="aura-dot"></span> 120 FPS WebGL · Studio Seed Core</div>
    <div class="aura-telemetry right"><i class="fas fa-arrows-spin"></i> 360° Drag & Orbit</div>
  </div>
</header>

<!-- Bento Workstations -->
<section class="section" id="workstations" style="padding-top:40px; padding-bottom:60px;">
  <div class="sec-head reveal">
    <div class="eyebrow"><i class="fas fa-cubes"></i> Studio & Investment Workstations</div>
    <h2 class="sec-title">Interactive Venture Architecture Engines</h2>
    <p class="sec-sub">Built to AngelList syndicate waterfall standards, Y Combinator market-sizing methodologies, and zero-margin BYOK security.</p>
  </div>

  <div class="bento-showcase">
    <!-- 1. Syndicate RUV -->
    <div class="border-beam-card">
      <div>
        <div style="font-size:32px; margin-bottom:12px;">📊</div>
        <h3 style="font-size:18px; font-weight:700; color:#fff; margin-bottom:8px;">AngelList Syndicate & RUV Simulator</h3>
        <p style="font-size:13px; color:var(--text-2); line-height:1.6; margin-bottom:16px;">Model SPV investment returns, 20% carry splits, 2% management fees, LP payout waterfalls, and exit MOIC multiples.</p>
      </div>
      <a class="btn btn-primary sm" href="syndicate-ruv.html"><i class="fas fa-chart-pie"></i> Model Syndicate →</a>
    </div>

    <!-- 2. TAM / SAM / SOM -->
    <div class="border-beam-card">
      <div>
        <div style="font-size:32px; margin-bottom:12px;">🎯</div>
        <h3 style="font-size:18px; font-weight:700; color:#fff; margin-bottom:8px;">YC TAM / SAM / SOM Calculator</h3>
        <p style="font-size:13px; color:var(--text-2); line-height:1.6; margin-bottom:16px;">Bottom-up & top-down market sizing with ARPU, serviceable obtainable market share, and investor pitch deck export.</p>
      </div>
      <a class="btn btn-primary sm" href="market-sizing.html"><i class="fas fa-calculator"></i> Calculate TAM/SOM →</a>
    </div>

    <!-- 3. Portfolio Showcase -->
    <div class="border-beam-card">
      <div>
        <div style="font-size:32px; margin-bottom:12px;">🏢</div>
        <h3 style="font-size:18px; font-weight:700; color:#fff; margin-bottom:8px;">Venture Portfolio Showcase</h3>
        <p style="font-size:13px; color:var(--text-2); line-height:1.6; margin-bottom:16px;">Explore live metrics, AI stacks, target markets, and interactive features across all 8 incubated studio enterprises.</p>
      </div>
      <a class="btn btn-primary sm" href="ventures.html"><i class="fas fa-cubes"></i> View Portfolio →</a>
    </div>

    <!-- 4. BYOK Vault -->
    <div class="border-beam-card">
      <div>
        <div style="font-size:32px; margin-bottom:12px;">🔑</div>
        <h3 style="font-size:18px; font-weight:700; color:#fff; margin-bottom:8px;">Zero-Margin BYOK Vault</h3>
        <p style="font-size:13px; color:var(--text-2); line-height:1.6; margin-bottom:16px;">Client-side AES-GCM encrypted API key manager for Groq, OpenAI, Anthropic, and Gemini with zero SaaS markup.</p>
      </div>
      <a class="btn btn-primary sm" href="byok.html"><i class="fas fa-key"></i> Open Key Vault →</a>
    </div>
  </div>
</section>

<!-- Group Footer -->
<footer class="foot">
  <div class="foot-grid">
    <div class="foot-brand">
      <a class="logo" href="#top">
        <span class="logo-icon"><i class="fas fa-seedling"></i></span>
        <span class="logo-text">Seven<span class="logo-accent">seed</span></span>
      </a>
      <p>AI Venture Studio & Incubation Platform. Engineering AI-native companies from seed to scale.</p>
    </div>
    <div class="foot-col">
      <h5>Studio Platforms</h5>
      <ul>
        <li><a href="ventures.html">Portfolio Ventures</a></li>
        <li><a href="syndicate-ruv.html">Syndicate Calculator</a></li>
        <li><a href="market-sizing.html">TAM / SAM / SOM</a></li>
        <li><a href="byok.html">BYOK Vault</a></li>
        <li><a href="pricing.html">SaaS Pricing</a></li>
      </ul>
    </div>
    <div class="foot-col">
      <h5>8 Venture Portals</h5>
      <ul>
        <li><a href="/avpu/">AVPU (AI University)</a></li>
        <li><a href="/avp-emart/">AVP Emart (Price Radar)</a></li>
        <li><a href="/sevenforce/">Sevenforce (AI Workforce)</a></li>
        <li><a href="/comonk-ai/">Comonk AI (Careers)</a></li>
        <li><a href="/pharmacy/">Decode Pharmacy</a></li>
        <li><a href="/breakdown/">Breakdown Factor</a></li>
        <li><a href="/trust/">AVP Charitable Trust</a></li>
        <li><a href="/rakshak-ai/">Rakshak AI</a></li>
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
    <div>© 2026 Sevenseed Venture Studio. All Rights Reserved. Shared AI Platform Architecture.</div>
  </div>
</footer>

<script src="app.js"></script>
</body>
</html>"""
