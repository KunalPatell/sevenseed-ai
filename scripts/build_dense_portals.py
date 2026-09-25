# -*- coding: utf-8 -*-
"""
Master Builder: Ultra-Premium, High-Density Command Centers for All 9 Ventures.
Compiles and generates all 9 /app portals with TailwindCSS + Glassmorphic portal.css tokens.
"""
import os
import sys
import shutil

HERE = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.dirname(HERE) if os.path.basename(HERE) == "scripts" else HERE
SITES_DIR = os.path.join(REPO_ROOT, "sites")
BACKEND_STATIC_DIR = os.path.join(REPO_ROOT, "apps", "sevenseed", "backend", "static")

# Import all 9 venture modules
from generate_portal_css import generate_portal_css
from portal_hub import get_hub_data
from portal_sevenforce import get_sevenforce_data
from portal_comonk import get_comonk_data
from portal_avpu import get_avpu_data
from portal_emart import get_emart_data
from portal_breakdown import get_breakdown_data
from portal_pharmacy import get_pharmacy_data
from portal_rakshak import get_rakshak_data
from portal_trust import get_trust_data

VENTURES_CONFIG = {
    "sevenseed": {
        "name": "Sevenseed",
        "tag": "AI Venture Studio & SaaS Hub",
        "icon": "🌿",
        "primary": "#6366f1",
        "primary_rgb": "99, 102, 241",
        "secondary": "#a855f7",
        "secondary_rgb": "168, 85, 247",
        "bg": "#040612",
        "home_url": "/ventures.html",
        "dirs": ["app", "sevenseed/app"],
        "data_fn": get_hub_data,
        "title": "Sevenseed Studio Hub — AI Venture Studio & Incubation Workstation",
        "desc": "High-density command center for Sevenseed's 8 incubated AI ventures. Launch autonomous models, simulate SPV carry waterfalls, and run RAG pipelines."
    },
    "sevenforce": {
        "name": "Sevenforce",
        "tag": "AI Autonomous Workforce Suite",
        "icon": "🤖",
        "primary": "#06b6d4",
        "primary_rgb": "6, 182, 212",
        "secondary": "#8b5cf6",
        "secondary_rgb": "139, 92, 246",
        "bg": "#020510",
        "home_url": "/sevenforce/",
        "dirs": ["sevenforce/app"],
        "data_fn": get_sevenforce_data,
        "title": "Sevenforce Cockpit — Autonomous Multi-Agent Workforce Suite",
        "desc": "Orchestrate, supervise, and dispatch 9 autonomous AI employees for sales, code shipping, competitor teardowns, and multi-agent workflows."
    },
    "comonk": {
        "name": "Comonk AI",
        "tag": "Enterprise Career Intelligence",
        "icon": "💼",
        "primary": "#0ea5e9",
        "primary_rgb": "14, 165, 233",
        "secondary": "#6366f1",
        "secondary_rgb": "99, 102, 241",
        "bg": "#040714",
        "home_url": "/comonk-ai/",
        "dirs": ["comonk-ai/app", "comonk/app"],
        "data_fn": get_comonk_data,
        "title": "Comonk AI Workstation — Career Intelligence & FAANG Mock Arena",
        "desc": "Real-time ATS resume keyword scorer, FAANG system design mock evaluator, and Levels.fyi compensation radar."
    },
    "avpu": {
        "name": "AVP University",
        "tag": "AI Higher Education & Labs",
        "icon": "🎓",
        "primary": "#3b82f6",
        "primary_rgb": "59, 130, 246",
        "secondary": "#8b5cf6",
        "secondary_rgb": "139, 92, 246",
        "bg": "#020617",
        "home_url": "/avpu/",
        "dirs": ["avpu/app"],
        "data_fn": get_avpu_data,
        "title": "AVP University Portal — Autonomous Academic & Placement Workstation",
        "desc": "Autonomous learning portal powered by Gyan AI Socratic syllabus tutor, adaptive quiz arena, and campus placement shortlisting."
    },
    "emart": {
        "name": "AVP Emart",
        "tag": "AI Smart-Shopping & Price Radar",
        "icon": "🛒",
        "primary": "#f97316",
        "primary_rgb": "249, 115, 22",
        "secondary": "#fbbf24",
        "secondary_rgb": "251, 191, 36",
        "bg": "#0b0502",
        "home_url": "/avp-emart/",
        "dirs": ["avp-emart/app"],
        "data_fn": get_emart_data,
        "title": "AVP Emart Radar — Multi-Store Price Comparison & Deal Scraper",
        "desc": "Scan prices across Amazon, Flipkart, Blinkit, and Zepto in real time with automated multi-cart optimization."
    },
    "breakdown": {
        "name": "Breakdown Factor",
        "tag": "AI Construction Vision & BOQ Costing",
        "icon": "🏗️",
        "primary": "#f59e0b",
        "primary_rgb": "245, 158, 11",
        "secondary": "#ea580c",
        "secondary_rgb": "234, 88, 12",
        "bg": "#0b0702",
        "home_url": "/breakdown-factor/",
        "dirs": ["breakdown-factor/app", "breakdown/app"],
        "data_fn": get_breakdown_data,
        "title": "Breakdown Factor Workstation — AI Construction Vision & BOQ Costing",
        "desc": "OSHA site safety surveillance, YOLOv10 sub-millimeter concrete crack inspection, and CPWD automated BOQ estimation."
    },
    "pharmacy": {
        "name": "Decode Pharmacy",
        "tag": "Clinical AI Pharmacology & Jan Aushadhi",
        "icon": "💊",
        "primary": "#10b981",
        "primary_rgb": "16, 185, 129",
        "secondary": "#14b8a6",
        "secondary_rgb": "20, 184, 166",
        "bg": "#020907",
        "home_url": "/decode-forest-pharmacy/",
        "dirs": ["decode-forest-pharmacy/app", "pharmacy/app"],
        "data_fn": get_pharmacy_data,
        "title": "Decode Pharmacy — Clinical AI Pharmacology & Jan Aushadhi Hub",
        "desc": "Prescription active salt extraction, drug-to-drug contraindication radar, and PMBJP Jan Aushadhi generic substitution."
    },
    "rakshak": {
        "name": "Rakshak AI",
        "tag": "AI Vision Security & BNS FIR Workstations",
        "icon": "🛡️",
        "primary": "#ef4444",
        "primary_rgb": "239, 68, 68",
        "secondary": "#f43f5e",
        "secondary_rgb": "244, 63, 94",
        "bg": "#0b0305",
        "home_url": "/rakshak-ai/",
        "dirs": ["rakshak-ai/app"],
        "data_fn": get_rakshak_data,
        "title": "Rakshak AI — AI Vision Security & BNS 2024 Legal FIR Workstation",
        "desc": "Real-time 4-camera CCTV stream analytics, Bharatiya Nyaya Sanhita (BNS 2024) FIR drafting, and biometric face attendance."
    },
    "trust": {
        "name": "AVP Charitable Trust",
        "tag": "AI Social Impact & 80G Governance Ledger",
        "icon": "🤝",
        "primary": "#f43f5e",
        "primary_rgb": "244, 63, 94",
        "secondary": "#fb7185",
        "secondary_rgb": "251, 113, 133",
        "bg": "#0b0307",
        "home_url": "/avp-charitable-trust/",
        "dirs": ["avp-charitable-trust/app", "trust/app"],
        "data_fn": get_trust_data,
        "title": "AVP Charitable Trust — AI Social Impact & 80G Tax Exemption Ledger",
        "desc": "Transparent CSR grant ledger, beneficiary RAG need allocation, and Section 80G digital tax receipt issuance."
    },
}

ALL_VENTURE_LINKS = [
    ("Sevenseed Studio Hub", "/app/"),
    ("Sevenforce AI Workforce", "/sevenforce/app/"),
    ("Comonk Career AI", "/comonk-ai/app/"),
    ("AVP University", "/avpu/app/"),
    ("AVP Emart Price Radar", "/avp-emart/app/"),
    ("Breakdown Factor", "/breakdown-factor/app/"),
    ("Decode Pharmacy", "/decode-forest-pharmacy/app/"),
    ("Rakshak AI Security", "/rakshak-ai/app/"),
    ("AVP Charitable Trust", "/avp-charitable-trust/app/"),
]

def build_complete_html(cfg):
    p = cfg["primary"]
    p_rgb = cfg["primary_rgb"]
    s = cfg["secondary"]
    s_rgb = cfg["secondary_rgb"]
    bg = cfg["bg"]
    brand_name = cfg["name"]
    brand_tag = cfg["tag"]
    brand_icon = cfg["icon"]
    home_url = cfg["home_url"]
    title = cfg["title"]
    description = cfg["desc"]

    nav_items, stats_items, main_content, script_content = cfg["data_fn"]()

    nav_html = ""
    for idx, (item_id, item_label, item_icon, item_badge) in enumerate(nav_items):
        active_cls = "active" if idx == 0 else ""
        badge_html = f'<span class="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/80">{item_badge}</span>' if item_badge else ""
        nav_html += f"""
        <button class="nav-item {active_cls}" onclick="switchTab('{item_id}')" id="nav-btn-{item_id}">
          <i class="{item_icon}" style="width:18px; text-align:center;"></i>
          <span class="truncate">{item_label}</span>
          {badge_html}
        </button>
        """

    stats_html = ""
    for num, label, pill, pill_color in stats_items:
        pill_cls = f"stat-pill-{pill_color}"
        stats_html += f"""
        <div class="stat-card">
          <div class="stat-num">{num}</div>
          <div class="stat-label">{label}</div>
          <div class="stat-pill {pill_cls}">
            <i class="fas fa-arrow-trend-up text-[10px]"></i>
            <span>{pill}</span>
          </div>
        </div>
        """

    switcher_options = ""
    for vname, vurl in ALL_VENTURE_LINKS:
        selected = "selected" if vname.startswith(brand_name) else ""
        switcher_options += f'<option value="{vurl}" {selected}>{vname}</option>'

    return f"""<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
  <title>{title}</title>
  <meta name="description" content="{description}"/>
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='88'%3E{brand_icon}%3C/text%3E%3C/svg%3E"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {{
      darkMode: 'class',
      theme: {{
        extend: {{
          colors: {{
            brand: '{p}',
            brandSec: '{s}',
            darkBg: '{bg}'
          }}
        }}
      }}
    }};
  </script>
  <link rel="stylesheet" href="portal.css"/>
</head>
<body class="antialiased text-slate-100 bg-[{bg}]">
  <!-- Aceternity Overhead Glow Lamp -->
  <div class="hero-lamp"></div>
  <div class="hero-lamp-line"></div>

  <!-- Mobile Drawer Overlay -->
  <div id="mobile-sidebar-overlay" onclick="toggleSidebar()" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.75); backdrop-filter:blur(6px); z-index:45;"></div>

  <div class="app-shell flex min-h-screen">
    <!-- Sidebar Navigation -->
    <aside class="sidebar w-[270px] shrink-0 border-r border-white/5 flex flex-col p-4 fixed top-0 bottom-0 z-50 h-screen transition-transform duration-300 md:sticky -translate-x-full md:translate-x-0" id="main-sidebar">
      <!-- Logo Header -->
      <div class="flex items-center justify-between mb-4 px-2">
        <a class="side-logo flex items-center gap-3 no-underline" href="{home_url}">
          <span class="w-10 h-10 rounded-xl grid place-items-center text-white font-bold text-xl bg-gradient-to-br from-[{p}] to-[{s}] shadow-lg shadow-black/40 border border-white/10">{brand_icon}</span>
          <div>
            <div class="text-white font-extrabold text-[15px] tracking-tight">{brand_name}</div>
            <div class="text-[10px] text-white/50 uppercase font-semibold tracking-wider">{brand_tag}</div>
          </div>
        </a>
        <button class="md:hidden text-white/60 hover:text-white p-1 cursor-pointer" onclick="toggleSidebar()" aria-label="Close menu">
          <i class="fas fa-xmark text-lg"></i>
        </button>
      </div>

      <!-- Venture Switcher -->
      <div class="mb-4 px-1">
        <label class="block text-[10px] uppercase font-bold text-white/40 mb-1.5 px-1 tracking-wider">Switch Venture Console</label>
        <select onchange="if(this.value) window.location.href=this.value;" class="w-full bg-white/[0.04] border border-white/10 rounded-xl py-2 px-2.5 text-xs text-white/80 font-medium outline-none cursor-pointer hover:border-white/20 transition-all">
          {switcher_options}
        </select>
      </div>

      <!-- Navigation Links -->
      <nav class="side-nav flex flex-col gap-1.5 flex-1 overflow-y-auto pr-1">
        {nav_html}
      </nav>

      <!-- Sidebar Footer -->
      <div class="side-foot flex flex-col gap-3 pt-4 border-t border-white/10 mt-auto">
        <div class="flex items-center justify-between text-xs px-2.5 py-2 rounded-xl bg-white/[0.03] border border-white/5">
          <span class="inline-flex items-center gap-2 text-white/70 font-mono text-[11px]">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            AI Engine Online
          </span>
          <span class="text-[10px] font-bold text-emerald-400 font-mono">v4.2-PROD</span>
        </div>
        <a class="side-back flex items-center justify-center gap-2 text-xs font-semibold text-white/70 hover:text-white py-2 px-3 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all no-underline" href="{home_url}">
          <i class="fas fa-arrow-left text-[11px]"></i>
          <span>Back to Landing Page</span>
        </a>
      </div>
    </aside>

    <!-- Main Workspace -->
    <div class="main flex-1 flex flex-col min-w-0">
      <!-- Topbar Header -->
      <header class="topbar sticky top-0 border-b border-white/5 z-20 flex items-center justify-between px-6 md:px-10 py-3.5 backdrop-blur-xl bg-black/40">
        <div class="flex items-center gap-4">
          <button class="md:hidden w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white cursor-pointer" onclick="toggleSidebar()" aria-label="Open menu">
            <i class="fas fa-bars text-sm"></i>
          </button>
          <div>
            <div class="text-xs text-white/50 flex items-center gap-1.5 font-medium">
              <span>{brand_name}</span>
              <span>/</span>
              <span class="text-white/80" id="topbar-crumb">Workspace Console</span>
            </div>
            <h1 class="text-base font-extrabold text-white tracking-tight" id="topbar-title">Active Workstation</h1>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white/80">
            <i class="fas fa-shield-halved text-emerald-400 text-xs"></i>
            <span>Verified Founder VIP</span>
          </div>
          <button class="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[{p}] to-[{s}] hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-black/40 flex items-center gap-1.5" onclick="triggerQuickAction()">
            <i class="fas fa-bolt text-xs"></i>
            <span>Quick Run</span>
          </button>
        </div>
      </header>

      <!-- Main Scrollable Panels -->
      <main class="panels p-6 md:p-10 max-w-[1360px] w-full mx-auto flex-1">
        <!-- Top KPI Stats Row -->
        <div class="stats-grid">
          {stats_html}
        </div>

        <!-- Tab Contents -->
        {main_content}
      </main>
    </div>
  </div>

  <!-- Global Script -->
  <script>
    function toggleSidebar() {{
      const sb = document.getElementById('main-sidebar');
      const ov = document.getElementById('mobile-sidebar-overlay');
      if (sb.classList.contains('-translate-x-full')) {{
        sb.classList.remove('-translate-x-full');
        sb.classList.add('translate-x-0');
        ov.style.display = 'block';
      }} else {{
        sb.classList.add('-translate-x-full');
        sb.classList.remove('translate-x-0');
        ov.style.display = 'none';
      }}
    }}

    function switchTab(tabId) {{
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

      const target = document.getElementById('tab-' + tabId);
      if (target) target.classList.add('active');

      const btn = document.getElementById('nav-btn-' + tabId);
      if (btn) btn.classList.add('active');

      const crumb = document.getElementById('topbar-crumb');
      if (crumb && btn) {{
        const span = btn.querySelector('span');
        if (span) crumb.textContent = span.textContent;
      }}
      window.location.hash = tabId;
      window.scrollTo({{ top: 0, behavior: 'smooth' }});
      if (window.innerWidth < 768) toggleSidebar();
    }}

    function copyResult(elementId) {{
      const el = document.getElementById(elementId);
      if (!el) return;
      navigator.clipboard.writeText(el.innerText || el.textContent);
      const notif = document.createElement('div');
      notif.className = 'fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2';
      notif.innerHTML = '<i class="fas fa-check"></i> Output copied to clipboard!';
      document.body.appendChild(notif);
      setTimeout(() => notif.remove(), 2500);
    }}

    function triggerQuickAction() {{
      const activeTab = document.querySelector('.tab-content.active');
      if (!activeTab) return;
      const firstBtn = activeTab.querySelector('.run-btn');
      if (firstBtn) firstBtn.click();
    }}

    window.addEventListener('DOMContentLoaded', () => {{
      const hash = window.location.hash.replace('#', '');
      if (hash && document.getElementById('tab-' + hash)) {{
        switchTab(hash);
      }}
    }});

    {script_content}
  </script>
</body>
</html>"""

def build_all():
    print("=========================================================================")
    print("BUILDING ALL 9 HIGH-DENSITY ENTERPRISE PORTALS")
    print("=========================================================================")

    total_files = 0
    for vkey, vcfg in VENTURES_CONFIG.items():
        print(f"\\n>> Processing venture: {vcfg['name']} ({vkey})")
        css_content = generate_portal_css(
            p_color=vcfg["primary"],
            s_color=vcfg["secondary"],
            p_rgb=vcfg["primary_rgb"],
            s_rgb=vcfg["secondary_rgb"],
            bg=vcfg["bg"],
            brand_name=vcfg["name"]
        )
        html_content = build_complete_html(vcfg)

        for rel_dir in vcfg["dirs"]:
            # Destination 1: sites/
            dest1 = os.path.join(SITES_DIR, rel_dir)
            os.makedirs(dest1, exist_ok=True)
            with open(os.path.join(dest1, "index.html"), "w", encoding="utf-8") as f:
                f.write(html_content)
            with open(os.path.join(dest1, "portal.css"), "w", encoding="utf-8") as f:
                f.write(css_content)

            # Destination 2: apps/sevenseed/backend/static/
            dest2 = os.path.join(BACKEND_STATIC_DIR, rel_dir)
            os.makedirs(dest2, exist_ok=True)
            with open(os.path.join(dest2, "index.html"), "w", encoding="utf-8") as f:
                f.write(html_content)
            with open(os.path.join(dest2, "portal.css"), "w", encoding="utf-8") as f:
                f.write(css_content)

            print(f"  [OK] -> {rel_dir} (sites & backend static synced)")
            total_files += 4

    print(f"\\nSUCCESS: All 9 venture portals built and synced! ({total_files} files written)")

if __name__ == "__main__":
    build_all()
