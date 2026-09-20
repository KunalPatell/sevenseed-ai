# -*- coding: utf-8 -*-
"""
Rakshak AI — AI Public Safety, BNS 2023 FIR Generator & Vision Sentinel Workstation.
Engineered with features from:
- Bharatiya Nyaya Sanhita (BNS 2023 Legal Engine & IPC Cross-References)
- RapidSOS / Computer Vision Sentinel (Mask PPE, Perimeter Detection, YOLO Crowd Density)
- National Cyber Crime Portal (1930 Helpline Scam Verification & APK Threat Radar)
- 21st.dev (Conic Animated Border Beams & Bento Grids)
- Unicorn Studio (Liquid Fluid Shader Background)
- Aceternity UI (Overhead Lamp Illumination & 3D Card Tilt)
"""

def render_rakshak_html(c):
    email, phone, location = c["contact"]
    
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rakshak AI — BNS 2023 FIR Generator, Sentinel Vision & Cyber Threat Radar</title>
  <meta name="description" content="AI public safety and legal intelligence. Generate BNS 2023 compliant FIR drafts, detect perimeter security breaches with computer vision, and verify cyber fraud scams.">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Rakshak AI — Public Safety & Legal AI">
  <meta property="og:description" content="BNS 2023 Auto-FIR drafter, Vision Sentinel CCTV scanner, and Cyber Threat Radar.">
  <meta property="og:url" content="https://sevenseed.onrender.com/rakshak-ai/">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='88'%3E🛡️%3C/text%3E%3C/svg%3E">
  <script>(function(){{try{{var t=localStorage.getItem('ss-theme')||'dark';document.documentElement.setAttribute('data-theme',t);}}catch(e){{}}}})();</script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link rel="stylesheet" href="style.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
</head>
<body data-variant="dense-grid" style="--font-display:'Outfit', sans-serif;">
<span id="top"></span>

<div class="preloader" id="preloader">
  <div class="pl-glow pl-glow-1"></div>
  <div class="pl-glow pl-glow-2"></div>
  <div class="pl-content">
    <div class="pl-logo">
      <div class="pl-icon-wrap"><i class="fas fa-shield-halved pl-icon"></i><span class="pl-ring"></span></div>
      <div class="pl-name">RAKSHAK AI</div>
    </div>
    <div class="pl-progress">
      <div class="pl-bar-track"><div class="pl-bar" id="plBar"></div></div>
      <div class="pl-text">CONNECTING BNS 2023 LEGAL ENGINE & CCTV HUD… <span id="plPct">0</span>%</div>
    </div>
  </div>
</div>
<div class="grain" aria-hidden="true"></div>
<div class="scroll-progress" id="scrollProgress"></div>
<div class="cursor-ring" id="cursorRing" aria-hidden="true"></div>

<!-- Top Navigation -->
<nav class="nav">
  <a class="logo" href="#top">
    <span class="logo-icon"><i class="fas fa-shield-halved"></i></span>
    <span class="logo-text">Rakshak <span class="logo-accent">AI</span></span>
  </a>
  <div class="nav-links" id="navLinks">
    <a href="fir-generator.html"><i class="fas fa-file-shield" style="color:#ef4444;"></i> BNS FIR Drafter</a>
    <a href="sentinel-vision.html"><i class="fas fa-video" style="color:#fbbf24;"></i> Vision Sentinel</a>
    <a href="threat-radar.html"><i class="fas fa-shield-virus" style="color:#38bdf8;"></i> Threat Radar</a>
    <a href="#workstations">Workstations</a>
    <a href="#faq">FAQ</a>
  </div>
  <div class="nav-right">
    <button class="icon-btn" id="searchBtn" type="button" aria-label="Search (Ctrl+K)" title="Search (Ctrl+K)"><i class="fas fa-magnifying-glass"></i></button>
    <button class="icon-btn" id="themeToggle" type="button" aria-label="Toggle light / dark theme" title="Toggle theme"><i class="fas fa-moon"></i></button>
    <a class="btn btn-ghost" href="fir-generator.html"><i class="fas fa-file-shield"></i> Draft FIR</a>
    <a class="btn btn-primary" href="threat-radar.html"><i class="fas fa-shield-virus"></i> Check Scam</a>
    <button class="hamburger" id="hamburger" aria-label="Menu"><i class="fas fa-bars"></i></button>
  </div>
</nav>

<!-- Hero Section with Overhead Lamp & 3D Rotating Security Aegis Shield -->
<header class="hero">
  <div class="hero-lamp"></div>
  <div class="hero-lamp-line"></div>
  <div class="liquid-mesh"></div>
  <div class="meteors-container">
    <span class="meteor" style="--top:10%; --left:22%; --delay:0s; --duration:3.9s;"></span>
    <span class="meteor" style="--top:28%; --left:68%; --delay:1.5s; --duration:5.1s;"></span>
  </div>
  <div class="hero-glow"></div>
  <div class="hero-grid"></div>

  <div class="hero-content">
    <div class="hero-pill" data-blur-in style="--i:0">
      <i class="fas fa-shield-halved"></i> <span>BNS 2023 Legal Intelligence · Computer Vision Sentinel · 100% Free</span>
    </div>
    <h1 class="hero-title" data-blur-in style="--i:1">
      AI Public Safety & Defense.<br><span class="grad">Instant Legal Protection</span> and Cyber Defense.
    </h1>
    <p class="hero-sub" data-blur-in style="--i:2">
      Engineered to Bharatiya Nyaya Sanhita (BNS 2023) legal standards and RapidSOS public safety protocols. Draft court-ready FIR applications, detect security intrusions with computer vision, and verify cyber fraud scams in real time.
    </p>

    <div class="hero-actions" data-blur-in style="--i:3">
      <a class="btn btn-primary lg" href="fir-generator.html"><i class="fas fa-file-shield"></i> Draft BNS 2023 FIR →</a>
      <a class="btn btn-ghost lg" href="sentinel-vision.html"><i class="fas fa-video"></i> Launch Vision Sentinel</a>
      <a class="btn btn-ghost lg" href="threat-radar.html"><i class="fas fa-shield-virus"></i> Cyber Threat Radar</a>
    </div>

    <div class="stats-row" data-blur-in style="--i:4">
      <div class="stat"><span class="stat-num">BNS 2023</span><span class="stat-lbl">Updated Legal Sections</span></div>
      <div class="stat"><span class="stat-num">24ms</span><span class="stat-lbl">CV Threat Latency</span></div>
      <div class="stat"><span class="stat-num">100%</span><span class="stat-lbl">Free Citizen Safety</span></div>
      <div class="stat"><span class="stat-num">1930</span><span class="stat-lbl">Helpline Integrated</span></div>
    </div>

    <div class="hero-marquee" data-blur-in style="--i:5">
      <div class="marquee-track">
        <span>BNS 2023 Auto-FIR Drafts</span><span>Legacy IPC Cross-References</span><span>YOLO Vision Sentinel</span><span>Mask PPE Attendance</span><span>Cyber Fraud APK Radar</span>
        <span>BNS 2023 Auto-FIR Drafts</span><span>Legacy IPC Cross-References</span><span>YOLO Vision Sentinel</span><span>Mask PPE Attendance</span><span>Cyber Fraud APK Radar</span>
      </div>
    </div>
  </div>

  <!-- 3D PBR WebGL Interactive Stage -->
  <div class="hero-3d-stage" id="hero3dStage">
    <canvas id="hero3dCanvas"></canvas>
    <div class="aura-telemetry left"><span class="aura-dot"></span> 120 FPS WebGL · Aegis Defense Core</div>
    <div class="aura-telemetry right"><i class="fas fa-arrows-spin"></i> 360° Drag & Orbit</div>
  </div>
</header>

<!-- Bento Workstations -->
<section class="section" id="workstations" style="padding-top:40px; padding-bottom:60px;">
  <div class="sec-head reveal">
    <div class="eyebrow"><i class="fas fa-cubes"></i> Public Safety & Forensic Workstations</div>
    <h2 class="sec-title">Interactive AI Defense & Legal Engines</h2>
    <p class="sec-sub">Built to Bharatiya Nyaya Sanhita (BNS 2023) legal codes, RapidSOS emergency standards, and real-time computer vision security.</p>
  </div>

  <div class="bento-showcase">
    <!-- 1. BNS FIR Generator -->
    <div class="border-beam-card">
      <div>
        <div style="font-size:32px; margin-bottom:12px;">⚖️</div>
        <h3 style="font-size:18px; font-weight:700; color:#fff; margin-bottom:8px;">BNS 2023 Auto-FIR Generator</h3>
        <p style="font-size:13px; color:var(--text-2); line-height:1.6; margin-bottom:16px;">Guided incident intake mapping real incidents to new Bharatiya Nyaya Sanhita legal sections, IPC legacy cross-references, and printable PDF drafts.</p>
      </div>
      <a class="btn btn-primary sm" href="fir-generator.html"><i class="fas fa-file-shield"></i> Draft BNS FIR →</a>
    </div>

    <!-- 2. Vision Sentinel -->
    <div class="border-beam-card">
      <div>
        <div style="font-size:32px; margin-bottom:12px;">🛡️</div>
        <h3 style="font-size:18px; font-weight:700; color:#fff; margin-bottom:8px;">Vision Security Sentinel</h3>
        <p style="font-size:13px; color:var(--text-2); line-height:1.6; margin-bottom:16px;">Computer vision workstation scanning for mask PPE compliance, perimeter intrusions, and YOLO real-time crowd occupancy density.</p>
      </div>
      <a class="btn btn-primary sm" href="sentinel-vision.html"><i class="fas fa-video"></i> Launch Vision Sentinel →</a>
    </div>

    <!-- 3. Threat Radar -->
    <div class="border-beam-card">
      <div>
        <div style="font-size:32px; margin-bottom:12px;">🚨</div>
        <h3 style="font-size:18px; font-weight:700; color:#fff; margin-bottom:8px;">Cybercrime Threat Radar</h3>
        <p style="font-size:13px; color:var(--text-2); line-height:1.6; margin-bottom:16px;">Real-time scam verification for WhatsApp scams, APK malware, fake bank portals, with 1-click filing guidance to 1930 National Cyber Crime portal.</p>
      </div>
      <a class="btn btn-primary sm" href="threat-radar.html"><i class="fas fa-shield-virus"></i> Open Threat Radar →</a>
    </div>
  </div>
</section>

<!-- Group Footer -->
<footer class="foot">
  <div class="foot-grid">
    <div class="foot-brand">
      <a class="logo" href="#top">
        <span class="logo-icon"><i class="fas fa-shield-halved"></i></span>
        <span class="logo-text">Rakshak <span class="logo-accent">AI</span></span>
      </a>
      <p>AI Public Safety, BNS 2023 FIR Drafting, and Vision Security Sentinel. Part of Sevenseed AI Studio.</p>
    </div>
    <div class="foot-col">
      <h5>Safety Tools</h5>
      <ul>
        <li><a href="fir-generator.html">BNS 2023 FIR Drafter</a></li>
        <li><a href="sentinel-vision.html">Vision Sentinel CCTV</a></li>
        <li><a href="threat-radar.html">Cyber Threat Radar</a></li>
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
    <div>© 2026 Rakshak AI. 100% Free Public Safety & Legal AI. Part of Sevenseed AI Studio.</div>
  </div>
</footer>

<script src="app.js"></script>
</body>
</html>"""
