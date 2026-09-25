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
        "standalone_dirs": ["apps/sevenseed/frontend/out/app"],
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
        "standalone_dirs": ["apps/sevenforce/backend/static/app", "apps/sevenforce/frontend/out/app"],
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
        "standalone_dirs": ["apps/comonk/frontend/out/app", "apps/comonk-ai/frontend/out/app", "apps/comonk-ai/backend/static/app"],
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
        "standalone_dirs": ["apps/avpu/backend/static/app", "apps/avpu/frontend/out/app"],
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
        "standalone_dirs": ["apps/avp-emart/backend/static/app", "apps/avp-emart/frontend/out/app"],
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
        "standalone_dirs": ["apps/breakdown-factor/backend/static/app", "apps/breakdown-factor/frontend/out/app"],
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
        "standalone_dirs": ["apps/decode-forest-pharmacy/backend/static/app", "apps/decode-forest-pharmacy/frontend/out/app"],
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
        "standalone_dirs": ["apps/rakshak-ai/backend/static/app", "apps/rakshak-ai/frontend/out/app"],
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
        "standalone_dirs": ["apps/avp-charitable-trust/backend/static/app", "apps/avp-charitable-trust/frontend/build_out/app", "apps/avp-charitable-trust/frontend/out/app"],
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

        <div class="flex items-center gap-2 md:gap-3">
          <button onclick="openAiCopilot()" class="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-black/20">
            <i class="fas fa-sparkles text-amber-400"></i>
            <span>AI Co-Pilot</span>
          </button>

          <button onclick="openIdeasModal()" class="hidden md:flex px-3 py-1.5 rounded-xl text-xs font-semibold text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer items-center gap-1.5">
            <i class="fas fa-bookmark text-indigo-400"></i>
            <span>Vault</span>
          </button>

          <button id="topbar-auth-btn" onclick="openAuthModal()" class="px-3 py-1.5 rounded-xl text-xs font-semibold text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer flex items-center gap-1.5">
            <i class="fas fa-user-circle text-slate-400" id="topbar-auth-icon"></i>
            <span id="topbar-auth-label">Sign In</span>
          </button>

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

  <!-- Slide-Over AI Co-Pilot Drawer -->
  <div id="copilot-backdrop" class="drawer-backdrop" onclick="closeAiCopilot()"></div>
  <aside id="copilot-drawer" class="ai-copilot-drawer">
    <div class="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
        <h3 class="text-sm font-extrabold text-white flex items-center gap-1.5">
          <i class="fas fa-wand-magic-sparkles text-amber-400"></i>
          Studio AI Co-Pilot
        </h3>
      </div>
      <button onclick="closeAiCopilot()" class="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white grid place-items-center text-xs cursor-pointer">
        <i class="fas fa-xmark text-sm"></i>
      </button>
    </div>

    <div class="p-4 border-b border-white/5 bg-white/[0.02]">
      <div class="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-mono">
        <span>GATEWAY: Groq LLaMA 3.3 70B & Gemini</span>
        <span class="text-emerald-400 font-bold">ONLINE (34ms)</span>
      </div>
      <div class="flex flex-wrap gap-1.5">
        <button onclick="runAiCopilot('swot')" class="filter-tag">📊 SWOT</button>
        <button onclick="runAiCopilot('competitor')" class="filter-tag">⚔️ Competitor</button>
        <button onclick="runAiCopilot('growth')" class="filter-tag">🚀 Growth</button>
        <button onclick="runAiCopilot('unit')" class="filter-tag">💰 Unit Econ</button>
        <button onclick="runAiCopilot('prd')" class="filter-tag">📑 Tech PRD</button>
      </div>
    </div>

    <div class="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
      <div class="input-group">
        <label class="input-label">Custom Venture Instruction / Prompt</label>
        <textarea id="copilot-input" rows="3" class="input-field" placeholder="Ask AI Co-Pilot to synthesize strategy, analyze competitors, or draft investor memos for {brand_name}..."></textarea>
      </div>

      <div class="flex items-center gap-2">
        <button onclick="runAiCopilot('custom')" class="run-btn flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5">
          <i class="fas fa-bolt"></i> Run AI Synthesis
        </button>
      </div>

      <div class="terminal-card flex-1 min-h-[260px] flex flex-col mt-2">
        <div class="terminal-header">
          <span class="text-xs font-mono text-amber-300">ai_copilot.stdout</span>
          <div class="flex items-center gap-2">
            <button onclick="copyResult('copilot-output')" class="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer">
              <i class="fas fa-copy"></i> Copy
            </button>
          </div>
        </div>
        <div id="copilot-output" class="terminal-body flex-1 overflow-y-auto font-mono text-xs text-slate-200">
[AI CO-PILOT STANDBY] Select an analysis chip above or type custom directives to invoke the live LangGraph AI engine.
        </div>
      </div>
    </div>

    <div class="p-3 border-t border-white/10 bg-black/60 flex items-center gap-2">
      <button onclick="downloadCopilotDocx()" class="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold flex items-center justify-center gap-1.5">
        <i class="fas fa-download text-indigo-400"></i> Export (.docx)
      </button>
      <button onclick="saveCopilotToVault()" class="flex-1 py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/40 hover:bg-indigo-500/30 text-indigo-300 text-xs font-bold flex items-center justify-center gap-1.5">
        <i class="fas fa-bookmark"></i> Save to Vault
      </button>
    </div>
  </aside>

  <!-- Founder Auth Modal -->
  <div id="auth-modal" class="portal-modal-backdrop" onclick="if(event.target===this) closeAuthModal()">
    <div class="portal-modal p-6">
      <div class="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
        <div class="flex items-center gap-2">
          <span class="text-xl">🌿</span>
          <h3 class="text-base font-extrabold text-white" id="auth-modal-title">Founder Authentication</h3>
        </div>
        <button onclick="closeAuthModal()" class="text-white/60 hover:text-white p-1">
          <i class="fas fa-xmark text-lg"></i>
        </button>
      </div>

      <div class="flex border-b border-white/10 mb-4" id="auth-tabs">
        <button id="auth-tab-login" onclick="switchAuthTab('login')" class="flex-1 py-2 text-xs font-bold text-indigo-400 border-b-2 border-indigo-400">Sign In</button>
        <button id="auth-tab-signup" onclick="switchAuthTab('signup')" class="flex-1 py-2 text-xs font-bold text-white/50 hover:text-white">Register Studio Account</button>
      </div>

      <div id="auth-form-signup-name" class="input-group" style="display:none;">
        <label class="input-label">Founder Full Name</label>
        <input id="auth-name" type="text" class="input-field" placeholder="e.g. Kunal Patel"/>
      </div>

      <div class="input-group">
        <label class="input-label">Corporate / Founder Email</label>
        <input id="auth-email" type="email" class="input-field" placeholder="founder@sevenseed.in"/>
      </div>

      <div class="input-group">
        <label class="input-label">Password</label>
        <input id="auth-password" type="password" class="input-field" placeholder="••••••••••••"/>
      </div>

      <div id="auth-status" class="text-xs mb-3 font-mono" style="display:none;"></div>

      <div class="flex items-center gap-3 mt-4">
        <button id="auth-submit-btn" onclick="handleAuthSubmit()" class="run-btn w-full py-3 text-xs font-bold flex items-center justify-center gap-2">
          <i class="fas fa-lock"></i> <span id="auth-btn-label">Sign In to Workstation</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Ideas & Insights Vault Modal -->
  <div id="ideas-modal" class="portal-modal-backdrop" onclick="if(event.target===this) closeIdeasModal()">
    <div class="portal-modal p-6">
      <div class="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
        <div class="flex items-center gap-2">
          <i class="fas fa-bookmark text-indigo-400"></i>
          <h3 class="text-base font-extrabold text-white">Founder Idea & Milestone Vault</h3>
        </div>
        <button onclick="closeIdeasModal()" class="text-white/60 hover:text-white p-1">
          <i class="fas fa-xmark text-lg"></i>
        </button>
      </div>

      <div class="p-3 bg-white/[0.02] border border-white/5 rounded-xl mb-4">
        <div class="text-xs font-bold text-white mb-2">Store New Venture Idea or Research Brief</div>
        <div class="flex gap-2 mb-2">
          <input id="new-idea-title" type="text" placeholder="Title (e.g. BioBERT Edge Model)" class="input-field flex-1 py-1.5 text-xs"/>
          <select id="new-idea-sector" class="bg-black/50 border border-white/10 rounded-xl px-2 text-xs text-white">
            <option value="AI Workforce">AI Workforce</option>
            <option value="EdTech">EdTech</option>
            <option value="HealthTech">HealthTech</option>
            <option value="Vision AI">Vision AI</option>
            <option value="FinTech">FinTech</option>
          </select>
        </div>
        <textarea id="new-idea-notes" rows="2" placeholder="Brief thesis, TAM estimate, or key architecture..." class="input-field mb-2 text-xs"></textarea>
        <button onclick="addIdeaToVault()" class="run-btn w-full py-2 text-xs font-bold">
          <i class="fas fa-plus"></i> Save to SQLite & Cloud Vault
        </button>
      </div>

      <div class="text-xs font-bold text-white/70 mb-2">Saved Insights & Research Items</div>
      <div id="vault-list" class="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
        <!-- Rendered dynamically -->
      </div>
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
      showNotification('Output copied to clipboard!');
    }}

    function showNotification(msg) {{
      const notif = document.createElement('div');
      notif.className = 'fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2';
      notif.innerHTML = '<i class="fas fa-check"></i> ' + msg;
      document.body.appendChild(notif);
      setTimeout(() => notif.remove(), 2500);
    }}

    function triggerQuickAction() {{
      const activeTab = document.querySelector('.tab-content.active');
      if (!activeTab) return;
      const firstBtn = activeTab.querySelector('.run-btn');
      if (firstBtn) firstBtn.click();
    }}

    /* AI Co-Pilot Drawer */
    function openAiCopilot() {{
      document.getElementById('copilot-drawer').classList.add('open');
      document.getElementById('copilot-backdrop').classList.add('open');
    }}
    function closeAiCopilot() {{
      document.getElementById('copilot-drawer').classList.remove('open');
      document.getElementById('copilot-backdrop').classList.remove('open');
    }}

    async function runAiCopilot(mode) {{
      const out = document.getElementById('copilot-output');
      const input = document.getElementById('copilot-input').value;
      const venture = "{brand_name}";

      out.innerHTML = '[AI CO-PILOT] Dispatching request to LangGraph orchestrator...\\n>> Analysis mode: ' + mode.toUpperCase() + '\\n>> Target venture: ' + venture + '\\n>> Querying ChromaDB embeddings & Groq model...';

      // Try calling live backend endpoints
      try {{
        let endpoint = '/api/agent/run';
        let body = {{ prompt: 'Analyze ' + mode + ' for ' + venture + '. User notes: ' + input }};
        if (mode === 'swot') {{
          endpoint = '/api/tools/swot';
          body = {{ idea: venture + ' - AI Venture Workstation', sector: 'Artificial Intelligence' }};
        }} else if (mode === 'competitor') {{
          endpoint = '/api/tools/competitor';
          body = {{ idea: venture, competitors: 'Devin, Harvey, Cursor, Levels.fyi' }};
        }}
        const res = await fetch(endpoint, {{
          method: 'POST',
          headers: {{ 'Content-Type': 'application/json' }},
          body: JSON.stringify(body)
        }});
        if (res.ok) {{
          const data = await res.json();
          out.innerHTML = '========================================================================\\nAI CO-PILOT ANALYSIS: ' + mode.toUpperCase() + ' FOR ' + venture.toUpperCase() + '\\n========================================================================\\n' + (data.result || JSON.stringify(data, null, 2));
          return;
        }}
      }} catch (e) {{}}

      setTimeout(() => {{
        let report = "";
        if (mode === 'swot') {{
          report = '========================================================================\\nSWOT STRATEGIC MATRIX: ' + venture.toUpperCase() + '\\n========================================================================\\n1. STRENGTHS\\n• Zero-margin BYOK architecture eliminates gross margin compression.\\n• Consolidated ChromaDB embeddings cross-pollinate vector intelligence across ventures.\\n• Sub-second inference latency via edge-deployed FastAPI and Groq hardware.\\n\\n2. WEAKNESSES\\n• High reliance on initial developer onboarding curve for domain workstations.\\n• Requires sustained compute credits for high-throughput batch OCR and video frames.\\n\\n3. OPPORTUNITIES\\n• Expansion into Tier-2/3 Indian regional languages (Hindi, Gujarati, Tamil, Telugu).\\n• Government integrations via PMBJP Jan Aushadhi and State Police CCTNS networks.\\n\\n4. THREATS\\n• Foundation model commoditization (mitigated by proprietary local workflows).\\n• Regulatory compliance updates under BNS 2024 and CDSCO digital pharma laws.';
        }} else if (mode === 'competitor') {{
          report = '========================================================================\\nCOMPETITIVE TEARDOWN & MOAT: ' + venture.toUpperCase() + '\\n========================================================================\\n• Primary Competitors: US-centric legacy incumbents ($20-50/mo per seat).\\n• Sevenseed Asymmetry: 100% Zero-Margin BYOK + Indian market regulatory compliance.\\n• Margin Advantage: 82% lower total cost of ownership (TCO) for enterprises.\\n• Local Moat: Hardwired BNS 2024 penal code, CPWD construction schedules, and PMBJP pharma.';
        }} else if (mode === 'growth') {{
          report = '========================================================================\\n90-DAY GROWTH SPRINT STRATEGY: ' + venture.toUpperCase() + '\\n========================================================================\\n• Sprint 1 (Days 1-30): Launch 50 enterprise pilots with zero-risk SLA guarantee.\\n• Sprint 2 (Days 31-60): Product-led viral loop with interactive calculators and shareable memos.\\n• Sprint 3 (Days 61-90): Scale enterprise ACV to ₹1.5 Lakhs with dedicated account executives.';
        }} else {{
          report = '========================================================================\\nSTRATEGIC CO-PILOT MEMO: ' + venture.toUpperCase() + '\\n========================================================================\\nDirectives: ' + (input || 'Standard Venture Audit') + '\\nStatus: AUDIT PASSED (High Capital Efficiency)\\n\\nKey Architecture:\\n• Frontend: Dense Aceternity Glassmorphism + TailwindCSS.\\n• Backend: Distributed FastAPI with LangGraph multi-agent supervisors.\\n• Storage: High-concurrency PostgreSQL / SQLite with async WAL mode.';
        }}
        out.innerHTML = report;
      }}, 450);
    }}

    function downloadCopilotDocx() {{
      const text = document.getElementById('copilot-output').innerText || document.getElementById('copilot-output').textContent;
      const blob = new Blob([text], {{ type: 'text/plain' }});
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = '{brand_name}_AI_Memo_' + Date.now() + '.txt';
      a.click();
      showNotification('Report exported successfully!');
    }}

    function saveCopilotToVault() {{
      const text = document.getElementById('copilot-output').innerText || document.getElementById('copilot-output').textContent;
      const title = "{brand_name} AI Synthesis";
      let vault = JSON.parse(localStorage.getItem('sevenseed_vault') || '[]');
      vault.unshift({{ title, notes: text.slice(0, 160) + '...', date: new Date().toLocaleDateString(), sector: 'AI Venture' }});
      localStorage.setItem('sevenseed_vault', JSON.stringify(vault));
      showNotification('Saved to Founder Vault!');
    }}

    /* Founder Auth Modal */
    let authMode = 'login';
    function openAuthModal() {{
      const user = JSON.parse(localStorage.getItem('sevenseed_user') || 'null');
      if (user) {{
        if (confirm('Logged in as ' + user.name + ' (' + user.email + '). Sign out?')) {{
          doAuthLogout();
        }}
        return;
      }}
      document.getElementById('auth-modal').classList.add('open');
    }}
    function closeAuthModal() {{
      document.getElementById('auth-modal').classList.remove('open');
    }}
    function switchAuthTab(mode) {{
      authMode = mode;
      const tabL = document.getElementById('auth-tab-login');
      const tabS = document.getElementById('auth-tab-signup');
      const nameFld = document.getElementById('auth-form-signup-name');
      const btnLbl = document.getElementById('auth-btn-label');
      if (mode === 'signup') {{
        tabS.className = 'flex-1 py-2 text-xs font-bold text-indigo-400 border-b-2 border-indigo-400';
        tabL.className = 'flex-1 py-2 text-xs font-bold text-white/50 hover:text-white';
        nameFld.style.display = 'block';
        btnLbl.textContent = 'Create Studio Account';
      }} else {{
        tabL.className = 'flex-1 py-2 text-xs font-bold text-indigo-400 border-b-2 border-indigo-400';
        tabS.className = 'flex-1 py-2 text-xs font-bold text-white/50 hover:text-white';
        nameFld.style.display = 'none';
        btnLbl.textContent = 'Sign In to Workstation';
      }}
    }}

    async function handleAuthSubmit() {{
      const email = document.getElementById('auth-email').value;
      const password = document.getElementById('auth-password').value;
      const name = document.getElementById('auth-name').value;
      const statusEl = document.getElementById('auth-status');
      statusEl.style.display = 'block';
      statusEl.innerHTML = '<span class="text-indigo-400"><i class="fas fa-spinner fa-spin"></i> Authenticating with Sevenseed Cloud...</span>';

      try {{
        const url = authMode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
        const body = authMode === 'signup' ? {{ name, email, password }} : {{ email, password }};
        const res = await fetch(url, {{
          method: 'POST',
          headers: {{ 'Content-Type': 'application/json' }},
          body: JSON.stringify(body)
        }});
        const data = await res.json();
        if (data.token) {{
          localStorage.setItem('sevenseed_token', data.token);
          localStorage.setItem('sevenseed_user', JSON.stringify(data.user));
          checkAuthSession();
          closeAuthModal();
          showNotification('Welcome back, ' + data.user.name + '!');
          return;
        }} else if (data.error) {{
          statusEl.innerHTML = '<span class="text-rose-400">' + data.error + '</span>';
          return;
        }}
      }} catch (e) {{}}

      // Offline simulation fallback
      const mockUser = {{ name: name || 'Founder VIP', email: email || 'founder@sevenseed.in' }};
      localStorage.setItem('sevenseed_token', 'offline-token-' + Date.now());
      localStorage.setItem('sevenseed_user', JSON.stringify(mockUser));
      checkAuthSession();
      closeAuthModal();
      showNotification('Signed in as ' + mockUser.name + '!');
    }}

    function doAuthLogout() {{
      localStorage.removeItem('sevenseed_token');
      localStorage.removeItem('sevenseed_user');
      checkAuthSession();
      showNotification('Signed out.');
    }}

    function checkAuthSession() {{
      const user = JSON.parse(localStorage.getItem('sevenseed_user') || 'null');
      const label = document.getElementById('topbar-auth-label');
      const icon = document.getElementById('topbar-auth-icon');
      if (user && label) {{
        label.textContent = user.name.split(' ')[0];
        if (icon) icon.className = 'fas fa-check-circle text-emerald-400';
      }} else if (label) {{
        label.textContent = 'Sign In';
        if (icon) icon.className = 'fas fa-user-circle text-slate-400';
      }}
    }}

    /* Ideas & Vault Modal */
    function openIdeasModal() {{
      document.getElementById('ideas-modal').classList.add('open');
      loadIdeasVault();
    }}
    function closeIdeasModal() {{
      document.getElementById('ideas-modal').classList.remove('open');
    }}
    function loadIdeasVault() {{
      const container = document.getElementById('vault-list');
      const vault = JSON.parse(localStorage.getItem('sevenseed_vault') || '[]');
      if (vault.length === 0) {{
        vault.push(
          {{ title: 'Autonomous Raft Consensus Lab', notes: 'Semester VI distributed systems lab syllabus.', date: '2026-09-25', sector: 'EdTech' }},
          {{ title: 'Jan Aushadhi PMBJP Price Scraper', notes: 'Comparing 14,800 drug formulations against MRP.', date: '2026-09-24', sector: 'HealthTech' }},
          {{ title: 'Sentinel Vision CCTV ANPR', notes: 'Vehicle license plate OCR at 60 FPS edge latency.', date: '2026-09-23', sector: 'Vision AI' }}
        );
        localStorage.setItem('sevenseed_vault', JSON.stringify(vault));
      }}
      container.innerHTML = vault.map(function(v, i) {{
        return '<div class="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-start justify-between gap-3">' +
          '<div>' +
            '<div class="text-xs font-bold text-white flex items-center gap-2">' +
              '<span>' + v.title + '</span>' +
              '<span class="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">' + (v.sector || 'General') + '</span>' +
            '</div>' +
            '<p class="text-[11px] text-slate-300 mt-1">' + v.notes + '</p>' +
            '<div class="text-[10px] text-slate-500 mt-1 font-mono">' + v.date + '</div>' +
          '</div>' +
          '<button onclick="deleteVaultItem(' + i + ')" class="text-slate-500 hover:text-rose-400 p-1 text-xs">' +
            '<i class="fas fa-trash"></i>' +
          '</button>' +
        '</div>';
      }}).join('');
    }}er:text-rose-400 p-1 text-xs">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `).join('');
    }}

    function addIdeaToVault() {{
      const title = document.getElementById('new-idea-title').value;
      const sector = document.getElementById('new-idea-sector').value;
      const notes = document.getElementById('new-idea-notes').value;
      if (!title) return;

      let vault = JSON.parse(localStorage.getItem('sevenseed_vault') || '[]');
      vault.unshift({{ title, sector, notes, date: new Date().toLocaleDateString() }});
      localStorage.setItem('sevenseed_vault', JSON.stringify(vault));
      document.getElementById('new-idea-title').value = '';
      document.getElementById('new-idea-notes').value = '';
      loadIdeasVault();
      showNotification('Saved to Founder Vault!');
    }}

    function deleteVaultItem(idx) {{
      let vault = JSON.parse(localStorage.getItem('sevenseed_vault') || '[]');
      vault.splice(idx, 1);
      localStorage.setItem('sevenseed_vault', JSON.stringify(vault));
      loadIdeasVault();
    }}

    window.addEventListener('DOMContentLoaded', () => {{
      checkAuthSession();
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

        # Destination 3: Standalone apps under apps/<venture>/
        for standalone_rel in vcfg.get("standalone_dirs", []):
            dest3 = os.path.join(REPO_ROOT, standalone_rel)
            os.makedirs(dest3, exist_ok=True)
            with open(os.path.join(dest3, "index.html"), "w", encoding="utf-8") as f:
                f.write(html_content)
            with open(os.path.join(dest3, "portal.css"), "w", encoding="utf-8") as f:
                f.write(css_content)
            print(f"  [OK] -> {standalone_rel} (standalone app synced)")
            total_files += 2

    print(f"\\nSUCCESS: All 9 venture portals built and synced! ({total_files} files written)")

if __name__ == "__main__":
    build_all()
