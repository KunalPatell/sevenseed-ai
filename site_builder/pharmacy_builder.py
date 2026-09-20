# -*- coding: utf-8 -*-
"""
Decode Forest Pharmacy — Next-Gen AI Healthcare & Pharmacology Workstation.
Engineered with features from:
- PMBJP Jan Aushadhi (Bio-Equivalent Generic Medicine Substitution & 85% Savings)
- Drugs.com (Drug-Drug Interaction Contraindication Matrix)
- Clinical OCR (Prescription Handwriting Parser & Dosage Frequency Extractor)
- Emergency Health Radar (Real-Time ICU Bed & Blood Bank Directory)
- 21st.dev (Conic Animated Border Beams & Bento Grids)
- Unicorn Studio (Liquid Fluid Shader Background)
- Aceternity UI (Overhead Lamp Illumination & 3D Card Tilt)
"""

def render_pharmacy_html(c):
    email, phone, location = c["contact"]
    
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Decode Forest Pharmacy — Clinical AI Healthcare & Generic Medicine Intelligence</title>
  <meta name="description" content="AI-native healthcare. Compare expensive branded medicines against 85% cheaper Jan Aushadhi generics, check drug-drug interactions, and scan prescriptions with OCR.">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Decode Forest Pharmacy — AI Healthcare">
  <meta property="og:description" content="Clinical AI pharmacology, Jan Aushadhi generics, and prescription OCR.">
  <meta property="og:url" content="https://sevenseed.onrender.com/pharmacy/">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='88'%3E💊%3C/text%3E%3C/svg%3E">
  <script>(function(){{try{{var t=localStorage.getItem('ss-theme')||'dark';document.documentElement.setAttribute('data-theme',t);}}catch(e){{}}}})();</script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link rel="stylesheet" href="style.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
</head>
<body data-variant="minimal-light" style="--font-display:'Outfit', sans-serif;">
<span id="top"></span>

<div class="preloader" id="preloader">
  <div class="pl-glow pl-glow-1"></div>
  <div class="pl-glow pl-glow-2"></div>
  <div class="pl-content">
    <div class="pl-logo">
      <div class="pl-icon-wrap"><i class="fas fa-mortar-pestle pl-icon"></i><span class="pl-ring"></span></div>
      <div class="pl-name">DECODE PHARMACY</div>
    </div>
    <div class="pl-progress">
      <div class="pl-bar-track"><div class="pl-bar" id="plBar"></div></div>
      <div class="pl-text">INITIALIZING PHARMACOLOGICAL KNOWLEDGE BASE… <span id="plPct">0</span>%</div>
    </div>
  </div>
</div>
<div class="grain" aria-hidden="true"></div>
<div class="scroll-progress" id="scrollProgress"></div>
<div class="cursor-ring" id="cursorRing" aria-hidden="true"></div>

<!-- Top Navigation -->
<nav class="nav">
  <a class="logo" href="#top">
    <span class="logo-icon"><i class="fas fa-mortar-pestle"></i></span>
    <span class="logo-text">Decode <span class="logo-accent">Pharmacy</span></span>
  </a>
  <div class="nav-links" id="navLinks">
    <a href="generic-finder.html"><i class="fas fa-pills" style="color:#34d399;"></i> Generic Finder</a>
    <a href="interaction-checker.html"><i class="fas fa-triangle-exclamation" style="color:#fbbf24;"></i> Interactions</a>
    <a href="prescription-ocr.html"><i class="fas fa-file-prescription" style="color:#38bdf8;"></i> Prescription OCR</a>
    <a href="hospital-finder.html"><i class="fas fa-hospital" style="color:#f472b6;"></i> Hospital Radar</a>
    <a href="#workstations">Workstations</a>
    <a href="#faq">FAQ</a>
  </div>
  <div class="nav-right">
    <button class="icon-btn" id="searchBtn" type="button" aria-label="Search (Ctrl+K)" title="Search (Ctrl+K)"><i class="fas fa-magnifying-glass"></i></button>
    <button class="icon-btn" id="themeToggle" type="button" aria-label="Toggle light / dark theme" title="Toggle theme"><i class="fas fa-moon"></i></button>
    <a class="btn btn-ghost" href="generic-finder.html"><i class="fas fa-pills"></i> Compare Generics</a>
    <a class="btn btn-primary" href="interaction-checker.html"><i class="fas fa-stethoscope"></i> Check Drugs</a>
    <button class="hamburger" id="hamburger" aria-label="Menu"><i class="fas fa-bars"></i></button>
  </div>
</nav>

<!-- Hero Section with Overhead Lamp & 3D Molecular Double Helix -->
<header class="hero">
  <div class="hero-lamp"></div>
  <div class="hero-lamp-line"></div>
  <div class="liquid-mesh"></div>
  <div class="meteors-container">
    <span class="meteor" style="--top:10%; --left:20%; --delay:0s; --duration:3.9s;"></span>
    <span class="meteor" style="--top:24%; --left:68%; --delay:1.4s; --duration:5.1s;"></span>
  </div>
  <div class="hero-glow"></div>
  <div class="hero-grid"></div>

  <div class="hero-content">
    <div class="hero-pill" data-blur-in style="--i:0">
      <i class="fas fa-pills"></i> <span>Clinical AI Healthcare · Jan Aushadhi Generics · 100% Free</span>
    </div>
    <h1 class="hero-title" data-blur-in style="--i:1">
      Clinical AI Healthcare.<br><span class="grad">Save 85% on Medicines</span> with Certified Generics.
    </h1>
    <p class="hero-sub" data-blur-in style="--i:2">
      Engineered with inspiration from PMBJP Jan Aushadhi and Drugs.com. Compare expensive branded medicines against certified bio-equivalent generic salts, detect dangerous multi-drug contraindications, and parse handwritten prescriptions with OCR.
    </p>

    <div class="hero-actions" data-blur-in style="--i:3">
      <a class="btn btn-primary lg" href="generic-finder.html"><i class="fas fa-pills"></i> Compare Generic Salts (85% Off) →</a>
      <a class="btn btn-ghost lg" href="interaction-checker.html"><i class="fas fa-triangle-exclamation"></i> Check Interactions</a>
      <a class="btn btn-ghost lg" href="prescription-ocr.html"><i class="fas fa-file-prescription"></i> Scan Prescription</a>
    </div>

    <div class="stats-row" data-blur-in style="--i:4">
      <div class="stat"><span class="stat-num">85%</span><span class="stat-lbl">Average Savings</span></div>
      <div class="stat"><span class="stat-num">12,000+</span><span class="stat-lbl">Verified Drug Salts</span></div>
      <div class="stat"><span class="stat-num">100%</span><span class="stat-lbl">Free Access</span></div>
      <div class="stat"><span class="stat-num">24/7</span><span class="stat-lbl">Emergency Radar</span></div>
    </div>

    <div class="hero-marquee" data-blur-in style="--i:5">
      <div class="marquee-track">
        <span>PMBJP Generic Salts</span><span>Drug Interaction Matrix</span><span>Prescription OCR</span><span>ICU Bed Availability</span><span>24/7 Blood Bank Radar</span>
        <span>PMBJP Generic Salts</span><span>Drug Interaction Matrix</span><span>Prescription OCR</span><span>ICU Bed Availability</span><span>24/7 Blood Bank Radar</span>
      </div>
    </div>
  </div>

  <!-- 3D PBR WebGL Interactive Stage -->
  <div class="hero-3d-stage" id="hero3dStage">
    <canvas id="hero3dCanvas"></canvas>
    <div class="aura-telemetry left"><span class="aura-dot"></span> 120 FPS WebGL · Molecular Helix</div>
    <div class="aura-telemetry right"><i class="fas fa-arrows-spin"></i> 360° Drag & Orbit</div>
  </div>
</header>

<!-- Bento Workstations -->
<section class="section" id="workstations" style="padding-top:40px; padding-bottom:60px;">
  <div class="sec-head reveal">
    <div class="eyebrow"><i class="fas fa-cubes"></i> Clinical AI Workstations</div>
    <h2 class="sec-title">Interactive Healthcare Engines</h2>
    <p class="sec-sub">Advanced pharmaceutical AI inspired by PMBJP Jan Aushadhi, Drugs.com, and clinical pharmacology interaction matrices.</p>
  </div>

  <div class="bento-showcase">
    <!-- 1. Generic Finder -->
    <div class="border-beam-card">
      <div>
        <div style="font-size:32px; margin-bottom:12px;">💊</div>
        <h3 style="font-size:18px; font-weight:700; color:#fff; margin-bottom:8px;">PMBJP Generic Salt Finder</h3>
        <p style="font-size:13px; color:var(--text-2); line-height:1.6; margin-bottom:16px;">Compare branded medications against Jan Aushadhi certified bio-equivalent generics with 75% to 85% price discounts.</p>
      </div>
      <a class="btn btn-primary sm" href="generic-finder.html"><i class="fas fa-pills"></i> Compare Generics →</a>
    </div>

    <!-- 2. Interaction Checker -->
    <div class="border-beam-card">
      <div>
        <div style="font-size:32px; margin-bottom:12px;">⚠️</div>
        <h3 style="font-size:18px; font-weight:700; color:#fff; margin-bottom:8px;">Drug-Drug Interaction Checker</h3>
        <p style="font-size:13px; color:var(--text-2); line-height:1.6; margin-bottom:16px;">Pharmacological contraindication matrix highlighting Major (QT prolongation, bleeding), Moderate, and Minor drug interactions.</p>
      </div>
      <a class="btn btn-primary sm" href="interaction-checker.html"><i class="fas fa-triangle-exclamation"></i> Check Interactions →</a>
    </div>

    <!-- 3. Prescription OCR -->
    <div class="border-beam-card">
      <div>
        <div style="font-size:32px; margin-bottom:12px;">📑</div>
        <h3 style="font-size:18px; font-weight:700; color:#fff; margin-bottom:8px;">Prescription OCR Scanner</h3>
        <p style="font-size:13px; color:var(--text-2); line-height:1.6; margin-bottom:16px;">Computer vision and LLM parsing of messy doctor handwriting into dosage schedules, frequency tags, and verified salt names.</p>
      </div>
      <a class="btn btn-primary sm" href="prescription-ocr.html"><i class="fas fa-file-prescription"></i> Scan Prescription →</a>
    </div>

    <!-- 4. Hospital Radar -->
    <div class="border-beam-card">
      <div>
        <div style="font-size:32px; margin-bottom:12px;">🏥</div>
        <h3 style="font-size:18px; font-weight:700; color:#fff; margin-bottom:8px;">Hospital & ICU Bed Radar</h3>
        <p style="font-size:13px; color:var(--text-2); line-height:1.6; margin-bottom:16px;">Real-time availability directory of emergency trauma centers, ventilator ICU beds, and 24/7 blood banks in Ahmedabad & Gandhinagar.</p>
      </div>
      <a class="btn btn-primary sm" href="hospital-finder.html"><i class="fas fa-hospital"></i> Open Hospital Radar →</a>
    </div>
  </div>
</section>

<!-- Group Footer -->
<footer class="foot">
  <div class="foot-grid">
    <div class="foot-brand">
      <a class="logo" href="#top">
        <span class="logo-icon"><i class="fas fa-mortar-pestle"></i></span>
        <span class="logo-text">Decode <span class="logo-accent">Pharmacy</span></span>
      </a>
      <p>Clinical AI Healthcare and Affordable Generic Medicine Intelligence. Part of Sevenseed AI Venture Studio.</p>
    </div>
    <div class="foot-col">
      <h5>Healthcare Tools</h5>
      <ul>
        <li><a href="generic-finder.html">Generic Salt Finder</a></li>
        <li><a href="interaction-checker.html">Drug Interaction Checker</a></li>
        <li><a href="prescription-ocr.html">Prescription OCR</a></li>
        <li><a href="hospital-finder.html">Hospital & ICU Radar</a></li>
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
    <div>© 2026 Decode Forest Pharmacy. 100% Free AI Healthcare. Part of Sevenseed AI Studio.</div>
  </div>
</footer>

<script src="app.js"></script>
</body>
</html>"""
