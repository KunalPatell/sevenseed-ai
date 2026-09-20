# -*- coding: utf-8 -*-
"""
AVP Emart (AVP Mart) — Next-Gen AI E-Commerce & Price Intelligence Workstation.
Engineered with features from:
- Smartprix.com (3-Way Flagship Spec Comparator, Spec Score 0-100, Difference Highlight)
- Google Shopping (Typical Price Range Bar, Multi-Seller Price Comparison Table)
- Buyhatke.com (90-Day Interactive Price History Canvas Chart, AI Buy/Wait Verdict, Drop Alerts)
- Xerve.in (Coupon Auto-Tester Sandbox, Net Effective Cashback Calculator)
- Quick Commerce (Blinkit vs Zepto vs Swiggy Instamart Basket Optimizer & Delivery ETA)
- 21st.dev (Conic Animated Border Beams & Bento Grids)
- Unicorn Studio (Liquid Fluid Shader Background)
- Aceternity UI (Overhead Lamp Illumination & 3D Card Tilt)
"""

def render_emart_html(c):
    email, phone, location = c["contact"]
    
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AVP Emart — AI Price Intelligence, Spec Comparison & Deal Radar</title>
  <meta name="description" content="Never overpay again. Real-time price aggregation across Amazon, Flipkart, Croma, Blinkit, and Zepto with Smartprix spec comparisons and Buyhatke 90-day price trends.">
  <meta property="og:type" content="website">
  <meta property="og:title" content="AVP Emart — AI Price Intelligence & Deal Radar">
  <meta property="og:description" content="Compare live prices across Amazon, Flipkart, Croma, and Quick Commerce with 90-day price trends and coupon testers.">
  <meta property="og:url" content="https://sevenseed.onrender.com/avp-emart/">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='88'%3E🛒%3C/text%3E%3C/svg%3E">
  <script>(function(){{try{{var t=localStorage.getItem('ss-theme')||'dark';document.documentElement.setAttribute('data-theme',t);}}catch(e){{}}}})();</script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link rel="stylesheet" href="style.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <style>
    :root {{
      --emart-purple: #a855f7;
      --emart-gold: #f59e0b;
      --emart-emerald: #10b981;
      --emart-cyan: #06b6d4;
    }}
    .mart-search-wrap {{
      position: relative;
      max-width: 720px;
      margin: 24px 0 28px;
    }}
    .mart-search-input {{
      width: 100%;
      padding: 16px 20px 16px 48px;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(168, 85, 247, 0.4);
      border-radius: 14px;
      color: #fff;
      font-size: 15px;
      font-family: inherit;
      outline: none;
      backdrop-filter: blur(12px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
      transition: all 0.25s ease;
    }}
    .mart-search-input:focus {{
      border-color: #c084fc;
      box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.25), 0 12px 36px rgba(0,0,0,0.6);
    }}
    .mart-search-icon {{
      position: absolute;
      left: 18px;
      top: 50%;
      transform: translateY(-50%);
      color: #c084fc;
      font-size: 16px;
    }}
    .mart-chips {{
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }}
    .m-chip {{
      padding: 5px 12px;
      border-radius: 20px;
      background: rgba(168, 85, 247, 0.12);
      border: 1px solid rgba(168, 85, 247, 0.25);
      color: #d8b4fe;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }}
    .m-chip:hover {{
      background: var(--emart-purple);
      color: #fff;
      border-color: var(--emart-purple);
      transform: translateY(-1px);
    }}
    .deal-drop-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-top: 24px;
    }}
    .deal-card {{
      background: var(--bg-1);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 22px;
      position: relative;
      overflow: hidden;
      transition: transform 0.2s, border-color 0.2s;
    }}
    .deal-card:hover {{
      transform: translateY(-4px);
      border-color: #f59e0b;
    }}
    .drop-badge {{
      position: absolute;
      top: 14px;
      right: 14px;
      padding: 4px 10px;
      border-radius: 999px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid #10b981;
      color: #34d399;
      font-size: 11px;
      font-weight: 700;
    }}
    .price-compare-mini {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px solid var(--border);
      font-size: 13px;
    }}
    .store-pill {{
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
    }}
    .store-amz {{ background: #fef3c7; color: #b45309; }}
    .store-flp {{ background: #dbeafe; color: #1d4ed8; }}
    .store-cro {{ background: #f3e8ff; color: #7e22ce; }}
    .qcom-box {{
      background: #020617;
      border: 1px solid #1e293b;
      border-radius: 14px;
      padding: 20px;
      margin-top: 24px;
    }}
  </style>
</head>
<body data-variant="market-vibrant" style="--font-display:'Outfit', sans-serif;">
<span id="top"></span>

<div class="preloader" id="preloader">
  <div class="pl-glow pl-glow-1"></div>
  <div class="pl-glow pl-glow-2"></div>
  <div class="pl-content">
    <div class="pl-logo">
      <div class="pl-icon-wrap"><i class="fas fa-cart-shopping pl-icon"></i><span class="pl-ring"></span></div>
      <div class="pl-name">AVP EMART</div>
    </div>
    <div class="pl-progress">
      <div class="pl-bar-track"><div class="pl-bar" id="plBar"></div></div>
      <div class="pl-text">INITIALIZING MULTI-STORE PRICE ENGINE… <span id="plPct">0</span>%</div>
    </div>
  </div>
</div>
<div class="grain" aria-hidden="true"></div>
<div class="scroll-progress" id="scrollProgress"></div>
<div class="cursor-ring" id="cursorRing" aria-hidden="true"></div>

<!-- Top Navigation -->
<nav class="nav">
  <a class="logo" href="#top">
    <span class="logo-icon"><i class="fas fa-cart-shopping"></i></span>
    <span class="logo-text">AVP <span class="logo-accent">Emart</span></span>
  </a>
  <div class="nav-links" id="navLinks">
    <a href="spec-compare.html"><i class="fas fa-scale-balanced" style="color:#c084fc;"></i> Smartprix Specs</a>
    <a href="price-tracker.html"><i class="fas fa-chart-line" style="color:#fbbf24;"></i> 90-Day Tracker</a>
    <a href="qcommerce.html"><i class="fas fa-bolt" style="color:#34d399;"></i> Quick Commerce</a>
    <a href="coupon-tester.html"><i class="fas fa-ticket" style="color:#38bdf8;"></i> Coupon Tester</a>
    <a href="deals-radar.html"><i class="fas fa-tags" style="color:#f472b6;"></i> Deals Radar</a>
    <a href="#trending">Price Drops</a>
    <a href="#qcom-battle">Blinkit vs Zepto</a>
    <a href="#faq">FAQ</a>
  </div>
  <div class="nav-right">
    <button class="icon-btn" id="searchBtn" type="button" aria-label="Search (Ctrl+K)" title="Search (Ctrl+K)"><i class="fas fa-magnifying-glass"></i></button>
    <button class="icon-btn" id="themeToggle" type="button" aria-label="Toggle light / dark theme" title="Toggle theme"><i class="fas fa-moon"></i></button>
    <a class="btn btn-ghost" href="spec-compare.html"><i class="fas fa-wand-magic-sparkles"></i> Compare Specs</a>
    <a class="btn btn-primary" href="price-tracker.html"><i class="fas fa-radar"></i> Price Radar</a>
    <button class="hamburger" id="hamburger" aria-label="Menu"><i class="fas fa-bars"></i></button>
  </div>
</nav>

<!-- Hero Section with Overhead Lamp & 3D Holographic Product Scanner -->
<header class="hero">
  <div class="hero-lamp"></div>
  <div class="hero-lamp-line"></div>
  <div class="liquid-mesh"></div>
  <div class="meteors-container">
    <span class="meteor" style="--top:10%; --left:24%; --delay:0s; --duration:4s;"></span>
    <span class="meteor" style="--top:28%; --left:64%; --delay:1.3s; --duration:5.2s;"></span>
    <span class="meteor" style="--top:8%; --left:82%; --delay:2.1s; --duration:3.9s;"></span>
  </div>
  <div class="hero-glow"></div>
  <div class="hero-grid"></div>

  <div class="hero-content">
    <div class="hero-pill" data-blur-in style="--i:0">
      <i class="fas fa-tags"></i> <span>Anti-Scrape Price Intelligence · Zero Commission Bias · 100% Free</span>
    </div>
    <h1 class="hero-title" data-blur-in style="--i:1">
      Never Overpay Again.<br><span class="grad">AI Price Radar</span> Across Every Store.
    </h1>
    <p class="hero-sub" data-blur-in style="--i:2">
      Real-time price comparison and deal intelligence across Amazon, Flipkart, Croma, Reliance Digital, and 10-minute Quick Commerce (Blinkit, Zepto, Swiggy Instamart). Engineered with Smartprix 3-way spec comparisons, Buyhatke 90-day price trend history, and Xerve coupon auto-testers.
    </p>

    <!-- Interactive Live Search Bar -->
    <div class="mart-search-wrap" data-blur-in style="--i:3">
      <i class="fas fa-magnifying-glass mart-search-icon"></i>
      <input type="text" class="mart-search-input" id="heroProdInput" placeholder="Search 50,000+ gadgets & groceries (e.g. iPhone 15 Pro, Sony XM5, MacBook Air M3)..." onkeydown="if(event.key==='Enter') searchProductJump()">
      <div class="mart-chips">
        <span class="m-chip" onclick="fillMartSearch('Apple iPhone 15 Pro (128GB)')">📱 iPhone 15 Pro</span>
        <span class="m-chip" onclick="fillMartSearch('Sony WH-1000XM5')">🎧 Sony XM5</span>
        <span class="m-chip" onclick="fillMartSearch('MacBook Air M3')">💻 MacBook M3</span>
        <span class="m-chip" onclick="fillMartSearch('Samsung Galaxy S24 Ultra')">✨ S24 Ultra</span>
        <span class="m-chip" onclick="fillMartSearch('Quick Commerce Grocery Basket')">⚡ Blinkit vs Zepto</span>
      </div>
    </div>

    <div class="hero-actions" data-blur-in style="--i:4">
      <a class="btn btn-primary lg" href="spec-compare.html"><i class="fas fa-scale-balanced"></i> Smartprix 3-Way Spec Comparator →</a>
      <a class="btn btn-ghost lg" href="price-tracker.html"><i class="fas fa-chart-line"></i> Buyhatke 90-Day Tracker</a>
      <a class="btn btn-ghost lg" href="coupon-tester.html"><i class="fas fa-ticket"></i> Test Coupons</a>
    </div>

    <div class="stats-row" data-blur-in style="--i:5">
      <div class="stat"><span class="stat-num">50,000+</span><span class="stat-lbl">Products Tracked</span></div>
      <div class="stat"><span class="stat-num">12 Stores</span><span class="stat-lbl">Real-Time Crawl</span></div>
      <div class="stat"><span class="stat-num">90 Days</span><span class="stat-lbl">Price History</span></div>
      <div class="stat"><span class="stat-num">₹0 Bias</span><span class="stat-lbl">Neutral Comparison</span></div>
    </div>

    <div class="hero-marquee" data-blur-in style="--i:6">
      <div class="marquee-track">
        <span>Smartprix Spec Comparator</span><span>Buyhatke 90-Day Price Tracker</span><span>Xerve Coupon Tester</span><span>Blinkit vs Zepto Optimizer</span><span>Google Shopping Radar</span>
        <span>Smartprix Spec Comparator</span><span>Buyhatke 90-Day Price Tracker</span><span>Xerve Coupon Tester</span><span>Blinkit vs Zepto Optimizer</span><span>Google Shopping Radar</span>
      </div>
    </div>
  </div>

  <!-- 3D PBR WebGL Interactive Stage -->
  <div class="hero-3d-stage" id="hero3dStage">
    <canvas id="hero3dCanvas"></canvas>
    <div class="aura-telemetry left"><span class="aura-dot"></span> 120 FPS WebGL · PBR Spec Scanner</div>
    <div class="aura-telemetry right"><i class="fas fa-arrows-spin"></i> 360° Drag & Orbit</div>
  </div>
</header>

<!-- Pillars Band -->
<section class="pillars-band">
  <div class="pillars-inner">
    <div class="pillar reveal"><div class="pillar-ic"><i class="fas fa-scale-balanced"></i></div><div class="pillar-txt"><strong>Smartprix Specs</strong><span>Side-by-side hardware spec comparison & score.</span></div></div>
    <div class="pillar reveal"><div class="pillar-ic"><i class="fas fa-chart-line"></i></div><div class="pillar-txt"><strong>Buyhatke 90-Day Radar</strong><span>Interactive Canvas price history & Buy/Wait verdict.</span></div></div>
    <div class="pillar reveal"><div class="pillar-ic"><i class="fas fa-bolt"></i></div><div class="pillar-txt"><strong>Quick Commerce Optimizer</strong><span>Blinkit vs Zepto surge fees and delivery speed.</span></div></div>
    <div class="pillar reveal"><div class="pillar-ic"><i class="fas fa-ticket"></i></div><div class="pillar-txt"><strong>Xerve Coupon Tester</strong><span>Automated promo code verification & net cashback.</span></div></div>
  </div>
</section>

<!-- Comprehensive Interactive Workstation Bento Grid -->
<section class="section" id="feature-suites" style="padding-top:40px; padding-bottom:60px;">
  <div class="sec-head reveal">
    <div class="eyebrow"><i class="fas fa-cubes"></i> E-Commerce Intelligence Engines</div>
    <h2 class="sec-title">Interactive Price & Deal Workstations</h2>
    <p class="sec-sub">Production-grade pricing algorithms inspired by Smartprix, Buyhatke, Xerve, and Google Shopping.</p>
  </div>

  <div class="bento-showcase bento-grid-3">
    <!-- 1. Smartprix Spec Comparator -->
    <div class="border-beam-card bento-wide">
      <div>
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
          <span style="font-size:32px;">📱</span>
          <span style="font-size:11px; padding:4px 10px; border-radius:99px; background:rgba(168,85,247,0.15); color:#c084fc; border:1px solid rgba(168,85,247,0.3);">Smartprix Engine</span>
        </div>
        <h3 style="font-size:22px; font-weight:700; color:#fff; margin-bottom:8px;">Smartprix 3-Way Spec Comparator</h3>
        <p style="font-size:14px; color:var(--text-2); line-height:1.6; margin-bottom:20px;">Side-by-side flagship smartphone comparator featuring dynamic Spec Score (0-100), differential highlight mode, and category breakdown.</p>
      </div>
      <a class="btn btn-primary" href="spec-compare.html"><i class="fas fa-scale-balanced"></i> Compare Specs Now →</a>
    </div>

    <!-- 2. Buyhatke 90-Day Tracker -->
    <div class="border-beam-card bento-wide">
      <div>
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
          <span style="font-size:32px;">📈</span>
          <span style="font-size:11px; padding:4px 10px; border-radius:99px; background:rgba(56,189,248,0.15); color:#38bdf8; border:1px solid rgba(56,189,248,0.3);">Buyhatke.com</span>
        </div>
        <h3 style="font-size:20px; font-weight:700; color:#fff; margin-bottom:8px;">Buyhatke 90-Day Price Trend Tracker</h3>
        <p style="font-size:14px; color:var(--text-2); line-height:1.6; margin-bottom:20px;">Interactive HTML5 Canvas 90-day price trend history, AI 'Buy Now vs Wait' verdict score, and instant price drop alert notifications.</p>
      </div>
      <a class="btn btn-primary" href="price-tracker.html"><i class="fas fa-chart-line"></i> View Price History →</a>
    </div>

    <!-- 3. Quick Commerce Optimizer -->
    <div class="border-beam-card">
      <div>
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
          <span style="font-size:32px;">⚡</span>
          <span style="font-size:11px; padding:4px 10px; border-radius:99px; background:rgba(245,158,11,0.15); color:#fbbf24; border:1px solid rgba(245,158,11,0.3);">Blinkit vs Zepto</span>
        </div>
        <h3 style="font-size:18px; font-weight:700; color:#fff; margin-bottom:8px;">Quick Commerce Basket Optimizer</h3>
        <p style="font-size:13px; color:var(--text-2); line-height:1.6; margin-bottom:20px;">Multi-cart grocery optimizer comparing Blinkit, Zepto, Swiggy Instamart, and BigBasket with surge fees and ETA calculations.</p>
      </div>
      <a class="btn btn-primary sm" href="qcommerce.html"><i class="fas fa-basket-shopping"></i> Optimize Basket →</a>
    </div>

    <!-- 4. Xerve Coupon Tester -->
    <div class="border-beam-card">
      <div>
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
          <span style="font-size:32px;">🎟️</span>
          <span style="font-size:11px; padding:4px 10px; border-radius:99px; background:rgba(16,185,129,0.15); color:#34d399; border:1px solid rgba(16,185,129,0.3);">Xerve.in</span>
        </div>
        <h3 style="font-size:18px; font-weight:700; color:#fff; margin-bottom:8px;">Coupon Auto-Tester & Wallet</h3>
        <p style="font-size:13px; color:var(--text-2); line-height:1.6; margin-bottom:20px;">Automated 5-coupon test runner with instant discount mathematics and UPI cashback wallet simulation.</p>
      </div>
      <a class="btn btn-primary sm" href="coupon-tester.html"><i class="fas fa-ticket"></i> Test Coupons →</a>
    </div>

    <!-- 5. Google Shopping Deals Radar -->
    <div class="border-beam-card">
      <div>
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
          <span style="font-size:32px;">🏷️</span>
          <span style="font-size:11px; padding:4px 10px; border-radius:99px; background:rgba(244,114,182,0.15); color:#f472b6; border:1px solid rgba(244,114,182,0.3);">Google Shopping</span>
        </div>
        <h3 style="font-size:18px; font-weight:700; color:#fff; margin-bottom:8px;">Deals Radar & Price Ranges</h3>
        <p style="font-size:13px; color:var(--text-2); line-height:1.6; margin-bottom:20px;">Typical price range meters across verified authorized retailers with stock verification.</p>
      </div>
      <a class="btn btn-primary sm" href="deals-radar.html"><i class="fas fa-tags"></i> Open Deals Radar →</a>
    </div>
  </div>
</section>

<!-- Live Trending Price Drops Ticker Section -->
<section class="section" id="trending" style="padding-top:20px; padding-bottom:60px;">
  <div class="sec-head reveal">
    <div class="eyebrow"><i class="fas fa-fire" style="color:#ef4444;"></i> Live Deals Ticker</div>
    <h2 class="sec-title">Real-Time Price Drops Across Stores</h2>
    <p class="sec-sub">Verified lowest prices detected in the last 4 hours by our crawler engine.</p>
  </div>

  <div class="deal-drop-grid reveal">
    <div class="deal-card">
      <span class="drop-badge"><i class="fas fa-arrow-down"></i> 90-Day Low</span>
      <div style="font-size:32px; margin-bottom:8px;">📱</div>
      <h4 style="font-size:17px; font-weight:700; color:#fff; margin-bottom:4px;">Apple iPhone 15 Pro (128GB)</h4>
      <div style="font-size:13px; color:var(--text-3); margin-bottom:12px;">Natural Titanium · A17 Pro Chip</div>
      <div style="display:flex; align-items:baseline; gap:8px;">
        <span style="font-size:22px; font-weight:800; color:#34d399; font-family:'JetBrains Mono';">₹1,27,990</span>
        <span style="font-size:14px; color:var(--text-3); text-decoration:line-through;">₹1,34,900</span>
      </div>
      <div class="price-compare-mini">
        <span>Lowest on: <strong style="color:#fff;">Vijay Sales</strong></span>
        <a class="btn btn-primary sm" href="price-tracker.html?p=iphone15pro">View Graph →</a>
      </div>
    </div>

    <div class="deal-card">
      <span class="drop-badge"><i class="fas fa-arrow-down"></i> 17% Drop</span>
      <div style="font-size:32px; margin-bottom:8px;">🎧</div>
      <h4 style="font-size:17px; font-weight:700; color:#fff; margin-bottom:4px;">Sony WH-1000XM5 Wireless</h4>
      <div style="font-size:13px; color:var(--text-3); margin-bottom:12px;">Active Noise Cancelling · 30hr Battery</div>
      <div style="display:flex; align-items:baseline; gap:8px;">
        <span style="font-size:22px; font-weight:800; color:#34d399; font-family:'JetBrains Mono';">₹24,990</span>
        <span style="font-size:14px; color:var(--text-3); text-decoration:line-through;">₹29,990</span>
      </div>
      <div class="price-compare-mini">
        <span>Lowest on: <strong style="color:#fff;">Amazon India</strong></span>
        <a class="btn btn-primary sm" href="price-tracker.html?p=sonyxm5">View Graph →</a>
      </div>
    </div>

    <div class="deal-card">
      <span class="drop-badge"><i class="fas fa-arrow-down"></i> ₹10,000 Off</span>
      <div style="font-size:32px; margin-bottom:8px;">💻</div>
      <h4 style="font-size:17px; font-weight:700; color:#fff; margin-bottom:4px;">Apple MacBook Air M3 (16GB)</h4>
      <div style="font-size:13px; color:var(--text-3); margin-bottom:12px;">13.6-inch Liquid Retina · 512GB SSD</div>
      <div style="display:flex; align-items:baseline; gap:8px;">
        <span style="font-size:22px; font-weight:800; color:#34d399; font-family:'JetBrains Mono';">₹1,14,900</span>
        <span style="font-size:14px; color:var(--text-3); text-decoration:line-through;">₹1,24,900</span>
      </div>
      <div class="price-compare-mini">
        <span>Lowest on: <strong style="color:#fff;">Croma + HDFC</strong></span>
        <a class="btn btn-primary sm" href="price-tracker.html?p=macbookm3">View Graph →</a>
      </div>
    </div>
  </div>
</section>

<!-- Quick Commerce Speed & Surge Battle Section -->
<section class="section" id="qcom-battle" style="padding-top:30px; padding-bottom:60px;">
  <div class="sec-head reveal">
    <div class="eyebrow"><i class="fas fa-bolt" style="color:#f59e0b;"></i> 10-Minute Grocery Battle</div>
    <h2 class="sec-title">Blinkit vs Zepto vs Swiggy Instamart</h2>
    <p class="sec-sub">Simulate cart totals with real-time surge pricing, handling charges, and delivery ETAs.</p>
  </div>

  <div class="qcom-box reveal" style="max-width:980px; margin:0 auto;">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
      <div>
        <h3 style="color:#fff; font-size:18px;">🛒 Sample Basket: Amul Milk (1L) + Bread + Eggs (6) + Butter (100g)</h3>
        <span style="font-size:12px; color:var(--text-3);">Live simulated check in Ahmedabad / Gandhinagar</span>
      </div>
      <a class="btn btn-primary sm" href="qcommerce.html"><i class="fas fa-sliders-h"></i> Custom Cart Builder →</a>
    </div>

    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:16px;">
      <div style="background:var(--bg-2); border:1px solid var(--border); border-radius:12px; padding:18px;">
        <div style="font-weight:700; color:#f59e0b; margin-bottom:6px;">⚡ Zepto</div>
        <div style="font-size:24px; font-weight:800; color:#fff; font-family:'JetBrains Mono';">₹240</div>
        <div style="font-size:12px; color:#34d399; margin:4px 0;">⚡ 8 Mins ETA (Fastest)</div>
        <div style="font-size:11px; color:var(--text-3);">Handling: ₹4 · Surge: ₹0</div>
      </div>

      <div style="background:var(--bg-2); border:1px solid #10b981; border-radius:12px; padding:18px;">
        <div style="font-weight:700; color:#10b981; margin-bottom:6px;">🟡 Blinkit (Best Value)</div>
        <div style="font-size:24px; font-weight:800; color:#34d399; font-family:'JetBrains Mono';">₹235</div>
        <div style="font-size:12px; color:#60a5fa; margin:4px 0;">⏱️ 11 Mins ETA</div>
        <div style="font-size:11px; color:var(--text-3);">Handling: ₹2 · Surge: ₹0</div>
      </div>

      <div style="background:var(--bg-2); border:1px solid var(--border); border-radius:12px; padding:18px;">
        <div style="font-weight:700; color:#f97316; margin-bottom:6px;">🟠 Swiggy Instamart</div>
        <div style="font-size:24px; font-weight:800; color:#fff; font-family:'JetBrains Mono';">₹265</div>
        <div style="font-size:12px; color:#fbbf24; margin:4px 0;">⏱️ 14 Mins ETA</div>
        <div style="font-size:11px; color:#f87171;">Handling: ₹5 · Rain Surge: ₹25</div>
      </div>

      <div style="background:var(--bg-2); border:1px solid var(--border); border-radius:12px; padding:18px;">
        <div style="font-weight:700; color:#38bdf8; margin-bottom:6px;">🔵 BigBasket BB Now</div>
        <div style="font-size:24px; font-weight:800; color:#fff; font-family:'JetBrains Mono';">₹228</div>
        <div style="font-size:12px; color:#94a3b8; margin:4px 0;">⏱️ 22 Mins ETA (Slowest)</div>
        <div style="font-size:11px; color:var(--text-3);">Handling: ₹0 · Free Delivery</div>
      </div>
    </div>
  </div>
</section>

<!-- Call to Action Banner -->
<section class="cta" id="start-tracking">
  <div class="cta-glow"></div>
  <div class="cta-content reveal">
    <div class="cta-badge"><i class="fas fa-radar"></i> 100% Free · No Registration Required</div>
    <h2>Never Miss a Price Drop Again</h2>
    <p>Search any product, view historical 90-day price trends, and test coupon codes before you checkout.</p>
    <div class="cta-actions">
      <a class="btn btn-primary lg" href="spec-compare.html"><i class="fas fa-scale-balanced"></i> Launch Spec Comparator</a>
      <a class="btn btn-ghost lg" href="price-tracker.html"><i class="fas fa-chart-line"></i> Open 90-Day Tracker</a>
    </div>
  </div>
</section>

<!-- Group Footer -->
<footer class="foot">
  <div class="foot-grid">
    <div class="foot-brand">
      <a class="logo" href="#top">
        <span class="logo-icon"><i class="fas fa-cart-shopping"></i></span>
        <span class="logo-text">AVP <span class="logo-accent">Emart</span></span>
      </a>
      <p>Real-Time Price Intelligence, Spec Comparisons, and Quick Commerce Basket Optimization. Part of Sevenseed AI Venture Studio.</p>
    </div>
    <div class="foot-col">
      <h5>Intelligence Engines</h5>
      <ul>
        <li><a href="spec-compare.html">Smartprix Specs</a></li>
        <li><a href="price-tracker.html">90-Day Price Tracker</a></li>
        <li><a href="qcommerce.html">Quick Commerce</a></li>
        <li><a href="coupon-tester.html">Coupon Tester</a></li>
        <li><a href="deals-radar.html">Deals Radar</a></li>
      </ul>
    </div>
    <div class="foot-col">
      <h5>The Studio</h5>
      <ul>
        <li><a href="../index.html">Sevenseed Hub</a></li>
        <li><a href="../avpu/index.html">AVPU University</a></li>
        <li><a href="../sevenforce/index.html">Sevenforce AI</a></li>
        <li><a href="../comonk/index.html">Comonk AI</a></li>
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
    <div>© 2026 AVP Emart. 100% Free AI Price Comparison & Deal Radar. Part of Sevenseed AI Studio.</div>
  </div>
</footer>

<script src="app.js"></script>
<script>
function fillMartSearch(q) {{
  var inp = document.getElementById('heroProdInput');
  if(inp) {{
    inp.value = q;
    searchProductJump();
  }}
}}
function searchProductJump() {{
  var inp = document.getElementById('heroProdInput');
  var val = (inp ? inp.value.trim() : '');
  if(val) {{
    window.location.href = 'price-tracker.html?q=' + encodeURIComponent(val);
  }}
}}
</script>
</body>
</html>"""
