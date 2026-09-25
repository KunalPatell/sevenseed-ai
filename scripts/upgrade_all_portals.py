# -*- coding: utf-8 -*-
"""
Portal Design System Generator for All Sevenseed Portfolio Ventures.
Generates ultra-premium, modern, responsive glassmorphic stylesheets and patches
all static and source /app pages for all 9 ventures.
"""
import os
import re
import shutil
import sys
import io

# Fix Windows console encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

HERE = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.dirname(HERE) if os.path.basename(HERE) == "scripts" else HERE

VENTURE_THEMES = {
    "sevenforce": {
        "name": "Sevenforce",
        "tag": "AI Autonomous Workforce",
        "primary": "#06b6d4",
        "primary_rgb": "6, 182, 212",
        "secondary": "#8b5cf6",
        "secondary_rgb": "139, 92, 246",
        "accent": "#10b981",
        "bg": "#020510",
        "home_url": "/sevenforce/",
        "chunk_path": "sevenforce/_next/static/chunks/0cr_9svx6639k.css",
    },
    "comonk-ai": {
        "name": "Comonk AI",
        "tag": "Enterprise Career Intelligence",
        "primary": "#0ea5e9",
        "primary_rgb": "14, 165, 233",
        "secondary": "#6366f1",
        "secondary_rgb": "99, 102, 241",
        "accent": "#10b981",
        "bg": "#040714",
        "home_url": "/comonk-ai/",
        "chunk_path": "comonk-ai/_next/static/chunks/3rkxhf6skph-q.css",
    },
    "sevenseed": {
        "name": "Sevenseed",
        "tag": "AI Venture Studio & SaaS Hub",
        "primary": "#6366f1",
        "primary_rgb": "99, 102, 241",
        "secondary": "#a855f7",
        "secondary_rgb": "168, 85, 247",
        "accent": "#10b981",
        "bg": "#040612",
        "home_url": "/ventures.html",
        "chunk_path": "_next/static/chunks/1o_p57r7c3x44.css",
    },
    "avpu": {
        "name": "AVP University",
        "tag": "AI-Powered Higher Education & Labs",
        "primary": "#3b82f6",
        "primary_rgb": "59, 130, 246",
        "secondary": "#f59e0b",
        "secondary_rgb": "245, 158, 11",
        "accent": "#38bdf8",
        "bg": "#020514",
        "home_url": "/avpu/",
        "chunk_path": "avpu/_next/static/chunks/1p5sa-6nycix0.css",
    },
    "avp-emart": {
        "name": "AVP Emart",
        "tag": "AI Price Intelligence & Smart Commerce",
        "primary": "#f97316",
        "primary_rgb": "249, 115, 22",
        "secondary": "#a855f7",
        "secondary_rgb": "168, 85, 247",
        "accent": "#10b981",
        "bg": "#08040f",
        "home_url": "/avp-emart/",
        "chunk_path": "avp-emart/_next/static/chunks/0v2kqneptnxhl.css",
    },
    "breakdown-factor": {
        "name": "Breakdown Factor",
        "tag": "AI AEC Safety & CPWD BOQ Workstations",
        "primary": "#f59e0b",
        "primary_rgb": "245, 158, 11",
        "secondary": "#eab308",
        "secondary_rgb": "234, 179, 8",
        "accent": "#06b6d4",
        "bg": "#0a0702",
        "home_url": "/breakdown-factor/",
        "chunk_path": "breakdown/_next/static/chunks/29h7skjyqp-d3.css",
    },
    "decode-forest-pharmacy": {
        "name": "Decode Pharmacy",
        "tag": "AI Clinical Pharmacology & PMBJP Finder",
        "primary": "#10b981",
        "primary_rgb": "16, 185, 129",
        "secondary": "#06b6d4",
        "secondary_rgb": "6, 182, 212",
        "accent": "#3b82f6",
        "bg": "#020907",
        "home_url": "/decode-forest-pharmacy/",
        "chunk_path": "pharmacy/_next/static/chunks/3-4ymmqc24lj-.css",
    },
    "rakshak-ai": {
        "name": "Rakshak AI",
        "tag": "AI Vision Security & BNS FIR Workstations",
        "primary": "#ef4444",
        "primary_rgb": "239, 68, 68",
        "secondary": "#f43f5e",
        "secondary_rgb": "244, 63, 94",
        "accent": "#f59e0b",
        "bg": "#0b0305",
        "home_url": "/rakshak-ai/",
        "chunk_path": "rakshak-ai/_next/static/chunks/118f2bu900uvl.css",
    },
    "avp-charitable-trust": {
        "name": "AVP Charitable Trust",
        "tag": "AI Social Impact & 80G Governance Ledger",
        "primary": "#f43f5e",
        "primary_rgb": "244, 63, 94",
        "secondary": "#fb7185",
        "secondary_rgb": "251, 113, 133",
        "accent": "#8b5cf6",
        "bg": "#0b0307",
        "home_url": "/avp-charitable-trust/",
        "chunk_path": "trust/_next/static/chunks/1r2x3jfngzn0t.css",
    },
}

def generate_portal_css(theme: dict) -> str:
    """Generate the complete, responsive, modern glassmorphic portal CSS for a venture."""
    p = theme["primary"]
    p_rgb = theme["primary_rgb"]
    s = theme["secondary"]
    s_rgb = theme["secondary_rgb"]
    acc = theme["accent"]
    bg = theme["bg"]
    name = theme["name"]

    return f"""/* ═══════════════════════════════════════════════════════════════════════════
   SEVENSEED PORTAL SYSTEM v3.0 — {name.upper()}
   Next-Gen Glassmorphism • Aceternity Glow • Responsive Modern Workspace
   ═══════════════════════════════════════════════════════════════════════════ */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

:root {{
  /* Brand Tokens */
  --portal-primary:       {p};
  --portal-primary-rgb:   {p_rgb};
  --portal-secondary:     {s};
  --portal-secondary-rgb: {s_rgb};
  --portal-accent:        {acc};
  --portal-danger:        #f87171;
  --portal-success:       #10b981;
  --portal-warning:       #f59e0b;

  /* Surfaces & Glassmorphism */
  --portal-bg:            {bg};
  --portal-panel:         rgba(10, 16, 32, 0.72);
  --portal-panel-hi:      rgba(18, 28, 54, 0.88);
  --portal-glass:         rgba(255, 255, 255, 0.04);
  --portal-glass-hover:   rgba(255, 255, 255, 0.08);

  /* Lines & Borders */
  --portal-line:          rgba(255, 255, 255, 0.08);
  --portal-line-hover:    rgba({p_rgb}, 0.45);
  --portal-line-glow:     rgba({p_rgb}, 0.25);

  /* Typography */
  --portal-tx:            #f8fafc;
  --portal-tx-2:          #94a3b8;
  --portal-tx-3:          #64748b;

  /* Gradients */
  --portal-grd-brand:     linear-gradient(135deg, {p} 0%, {s} 100%);
  --portal-grd-glow:      radial-gradient(ellipse 80% 50% at 50% 0%, rgba({p_rgb}, 0.22) 0%, rgba({s_rgb}, 0.08) 50%, transparent 75%);
  --portal-grd-btn:       linear-gradient(135deg, {p} 0%, {s} 100%);

  /* Shadows */
  --portal-shadow-sm:     0 4px 14px rgba(0, 0, 0, 0.35);
  --portal-shadow-md:     0 10px 30px rgba(0, 0, 0, 0.5);
  --portal-shadow-glow:   0 0 28px rgba({p_rgb}, 0.32);

  /* Dimensions & Radius */
  --portal-radius-sm:     8px;
  --portal-radius-md:     14px;
  --portal-radius-lg:     20px;
  --portal-radius-full:   9999px;
  --portal-ease:          cubic-bezier(0.4, 0, 0.2, 1);
}}

/* ── Global Base Enhancements ────────────────────────────────────────────── */
html, body {{
  background-color: var(--portal-bg) !important;
  color: var(--portal-tx) !important;
  font-family: 'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif !important;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}}

body::before {{
  content: '';
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 480px;
  background: var(--portal-grd-glow);
  pointer-events: none;
  z-index: 0;
}}

/* Custom Scrollbar */
::-webkit-scrollbar {{ width: 7px; height: 7px; }}
::-webkit-scrollbar-track {{ background: rgba(0, 0, 0, 0.3); }}
::-webkit-scrollbar-thumb {{
  background: rgba(255, 255, 255, 0.16);
  border-radius: 99px;
  transition: background .2s;
}}
::-webkit-scrollbar-thumb:hover {{
  background: var(--portal-primary);
}}

/* ── App Shell & Layout ─────────────────────────────────────────────────── */
.app-shell, .layout {{
  display: flex;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}}

/* ── Sidebar System ─────────────────────────────────────────────────────── */
.sidebar, aside.sidebar {{
  background: rgba(6, 10, 22, 0.85) !important;
  backdrop-filter: blur(28px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(28px) saturate(180%) !important;
  border-right: 1px solid var(--portal-line) !important;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.4) !important;
  transition: transform 0.3s var(--portal-ease), width 0.3s var(--portal-ease);
  z-index: 50;
}}

/* Logo Brand Header */
.side-logo, .console-brand {{
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  font-weight: 800 !important;
  letter-spacing: -0.02em !important;
  color: #ffffff !important;
  text-decoration: none !important;
}}
.side-logo .logo-icon, .console-brand-em {{
  width: 36px !important;
  height: 36px !important;
  border-radius: 10px !important;
  display: grid !important;
  place-items: center !important;
  background: var(--portal-grd-brand) !important;
  box-shadow: 0 4px 16px rgba({p_rgb}, 0.4) !important;
  font-size: 16px !important;
  color: #ffffff !important;
}}

/* Navigation Items */
.nav-item, .sidebar-item {{
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  padding: 10px 14px !important;
  border-radius: var(--portal-radius-md) !important;
  color: var(--portal-tx-2) !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  border: 1px solid transparent !important;
  background: transparent !important;
  cursor: pointer !important;
  transition: all 0.22s var(--portal-ease) !important;
  text-decoration: none !important;
  position: relative !important;
}}

.nav-item:hover, .sidebar-item:hover {{
  color: #ffffff !important;
  background: var(--portal-glass-hover) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
  transform: translateX(3px) !important;
}}

.nav-item.active, .sidebar-item.active,
.nav-item[class*="border-[#6366f1]"], .nav-item[class*="bg-[#6366f1]"] {{
  background: rgba({p_rgb}, 0.15) !important;
  color: #ffffff !important;
  border-color: rgba({p_rgb}, 0.5) !important;
  box-shadow: 0 0 20px rgba({p_rgb}, 0.2) !important;
}}
.nav-item.active::before, .sidebar-item.active::before {{
  content: '';
  position: absolute;
  left: 0;
  top: 18%;
  bottom: 18%;
  width: 3.5px;
  border-radius: 4px;
  background: var(--portal-primary);
  box-shadow: 0 0 10px var(--portal-primary);
}}

/* Sidebar Foot & Back Link */
.side-foot, .sidebar-foot {{
  border-top: 1px solid var(--portal-line) !important;
  padding-top: 16px !important;
}}

.side-back {{
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  color: var(--portal-tx-2) !important;
  padding: 8px 12px !important;
  border-radius: var(--portal-radius-sm) !important;
  border: 1px solid var(--portal-line) !important;
  background: rgba(255, 255, 255, 0.02) !important;
  text-decoration: none !important;
  transition: all 0.2s var(--portal-ease) !important;
}}
.side-back:hover {{
  color: #ffffff !important;
  border-color: var(--portal-primary) !important;
  background: rgba({p_rgb}, 0.12) !important;
  box-shadow: 0 0 14px rgba({p_rgb}, 0.25) !important;
  transform: translateX(-2px) !important;
}}

/* ── Topbar Navigation ──────────────────────────────────────────────────── */
.topbar, header.topbar {{
  background: rgba(6, 10, 22, 0.78) !important;
  backdrop-filter: blur(24px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
  border-bottom: 1px solid var(--portal-line) !important;
  position: sticky !important;
  top: 0 !important;
  z-index: 40 !important;
}}

/* ── Workstation Panels & Generic Cards ─────────────────────────────────── */
.console-panel, .form-card, .result-card, .glow-card,
.stat-card, div[class*="bg-[#12121e]"], div[class*="bg-[#0e1320]"] {{
  background: var(--portal-panel) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  border: 1px solid var(--portal-line) !important;
  border-radius: var(--portal-radius-md) !important;
  box-shadow: var(--portal-shadow-sm) !important;
  transition: all 0.25s var(--portal-ease) !important;
  position: relative !important;
  overflow: hidden !important;
}}

.console-panel:hover, .form-card:hover, .result-card:hover,
.glow-card:hover, .stat-card:hover {{
  border-color: var(--portal-line-hover) !important;
  box-shadow: var(--portal-shadow-md), 0 0 24px rgba({p_rgb}, 0.14) !important;
  transform: translateY(-2px) !important;
}}

/* Top Gradient Line Accent on Hover */
.console-panel::before, .form-card::before, .stat-card::before {{
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: var(--portal-grd-brand);
  opacity: 0;
  transition: opacity 0.25s;
}}
.console-panel:hover::before, .form-card:hover::before, .stat-card:hover::before {{
  opacity: 1;
}}

/* ── Agent Grid & Sintra.ai-style Character Persona Cards ────────────────── */
.agents-grid {{
  display: grid !important;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)) !important;
  gap: 22px !important;
  margin: 28px 0 !important;
  width: 100% !important;
}}

.agent-card {{
  display: flex !important;
  flex-direction: column !important;
  align-items: flex-start !important;
  text-align: left !important;
  padding: 26px !important;
  border-radius: var(--portal-radius-md) !important;
  background: var(--portal-panel) !important;
  backdrop-filter: blur(28px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(28px) saturate(180%) !important;
  border: 1px solid var(--portal-line) !important;
  box-shadow: var(--portal-shadow-sm) !important;
  cursor: pointer !important;
  transition: all 0.28s var(--portal-ease) !important;
  position: relative !important;
  overflow: hidden !important;
  width: 100% !important;
  text-decoration: none !important;
  box-sizing: border-box !important;
}}

.agent-card:hover {{
  transform: translateY(-5px) !important;
  border-color: var(--portal-line-hover) !important;
  box-shadow: var(--portal-shadow-md), 0 0 32px rgba({p_rgb}, 0.28) !important;
  background: var(--portal-panel-hi) !important;
}}

.agent-card::after {{
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: var(--portal-grd-brand);
  opacity: 0;
  transition: opacity 0.25s;
}}
.agent-card:hover::after {{
  opacity: 1;
}}

.agent-em {{
  width: 58px !important;
  height: 58px !important;
  border-radius: 16px !important;
  display: grid !important;
  place-items: center !important;
  font-size: 28px !important;
  background: linear-gradient(135deg, rgba({p_rgb}, 0.22), rgba({s_rgb}, 0.12)) !important;
  border: 1px solid rgba({p_rgb}, 0.35) !important;
  box-shadow: 0 4px 18px rgba({p_rgb}, 0.25) !important;
  margin-bottom: 16px !important;
  transition: transform 0.25s var(--portal-ease) !important;
}}

.agent-card:hover .agent-em {{
  transform: scale(1.08) rotate(3deg) !important;
  box-shadow: 0 6px 24px rgba({p_rgb}, 0.45) !important;
}}

.agent-name {{
  display: block !important;
  font-size: 19px !important;
  font-weight: 800 !important;
  color: #ffffff !important;
  letter-spacing: -0.02em !important;
  margin-bottom: 4px !important;
  line-height: 1.2 !important;
}}

.agent-role {{
  display: block !important;
  font-size: 13.5px !important;
  font-weight: 500 !important;
  color: var(--portal-tx-2) !important;
  line-height: 1.4 !important;
  margin-bottom: 18px !important;
}}

.agent-role-badge {{
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.06em !important;
  padding: 5px 12px !important;
  border-radius: var(--portal-radius-full) !important;
  background: rgba({p_rgb}, 0.12) !important;
  color: var(--portal-primary) !important;
  border: 1px solid rgba({p_rgb}, 0.32) !important;
  margin-top: auto !important;
}}

/* ── Selected Agent Workspace Header ───────────────────────────────────── */
.agent-header {{
  display: flex !important;
  align-items: center !important;
  gap: 24px !important;
  padding: 26px 32px !important;
  background: rgba(10, 16, 32, 0.85) !important;
  backdrop-filter: blur(28px) saturate(180%) !important;
  border: 1px solid rgba({p_rgb}, 0.25) !important;
  border-radius: var(--portal-radius-lg) !important;
  box-shadow: 0 14px 44px rgba(0, 0, 0, 0.5), 0 0 35px rgba({p_rgb}, 0.18) !important;
  margin-bottom: 32px !important;
}}

.agent-em-big {{
  width: 76px !important;
  height: 76px !important;
  border-radius: 20px !important;
  display: grid !important;
  place-items: center !important;
  font-size: 40px !important;
  background: var(--portal-grd-brand) !important;
  box-shadow: 0 8px 30px rgba({p_rgb}, 0.45) !important;
  flex-shrink: 0 !important;
}}

.agent-hinfo {{
  flex: 1 !important;
  min-width: 0 !important;
}}

.agent-htitle {{
  display: flex !important;
  align-items: center !important;
  gap: 14px !important;
  margin-bottom: 8px !important;
  flex-wrap: wrap !important;
}}

.agent-htitle h2 {{
  font-size: 24px !important;
  font-weight: 900 !important;
  color: #ffffff !important;
  letter-spacing: -0.025em !important;
  margin: 0 !important;
  line-height: 1.2 !important;
}}

.agent-hdesc {{
  font-size: 14px !important;
  color: var(--portal-tx-2) !important;
  line-height: 1.55 !important;
  margin: 0 !important;
  max-width: 780px !important;
}}

/* ── Interactive Tool Workbench ─────────────────────────────────────────── */
.tools-list {{
  display: flex !important;
  flex-direction: column !important;
  gap: 26px !important;
}}

.tool-card {{
  background: var(--portal-panel) !important;
  backdrop-filter: blur(24px) !important;
  border: 1px solid var(--portal-line) !important;
  border-radius: var(--portal-radius-lg) !important;
  padding: 30px !important;
  box-shadow: var(--portal-shadow-sm) !important;
  transition: all 0.25s var(--portal-ease) !important;
  box-sizing: border-box !important;
}}

.tool-card:hover {{
  border-color: var(--portal-line-hover) !important;
  box-shadow: var(--portal-shadow-md), 0 0 28px rgba({p_rgb}, 0.15) !important;
}}

.tool-header {{
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  margin-bottom: 24px !important;
  padding-bottom: 18px !important;
  border-bottom: 1px solid var(--portal-line) !important;
}}

.tool-title {{
  font-size: 18px !important;
  font-weight: 800 !important;
  color: #ffffff !important;
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
}}

.tool-ep {{
  font-family: 'JetBrains Mono', monospace !important;
  font-size: 11.5px !important;
  font-weight: 600 !important;
  padding: 5px 12px !important;
  border-radius: 8px !important;
  background: rgba(255, 255, 255, 0.05) !important;
  color: var(--portal-tx-2) !important;
  border: 1px solid var(--portal-line) !important;
  margin-left: 12px !important;
}}

.input-group {{
  display: flex !important;
  flex-direction: column !important;
  gap: 8px !important;
  margin-bottom: 20px !important;
}}

.input-label {{
  font-size: 13px !important;
  font-weight: 700 !important;
  color: #e2e8f0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
}}

.input-wrapper {{
  position: relative !important;
  width: 100% !important;
  display: flex !important;
  align-items: center !important;
}}

.input-wrapper i.fas {{
  position: absolute !important;
  left: 16px !important;
  color: var(--portal-tx-3) !important;
  font-size: 14px !important;
  pointer-events: none !important;
  z-index: 2 !important;
}}

.input-wrapper:has(i.fas) input {{
  padding-left: 44px !important;
}}

.input-wrapper input,
.input-wrapper textarea,
.input-wrapper select {{
  width: 100% !important;
  background: rgba(5, 9, 22, 0.78) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: var(--portal-radius-sm) !important;
  color: #f8fafc !important;
  font-size: 14px !important;
  padding: 13px 16px !important;
  font-family: inherit !important;
  transition: all 0.2s var(--portal-ease) !important;
  outline: none !important;
  box-sizing: border-box !important;
}}

.input-wrapper input:focus,
.input-wrapper textarea:focus,
.input-wrapper select:focus {{
  border-color: var(--portal-primary) !important;
  box-shadow: 0 0 0 3px rgba({p_rgb}, 0.25), 0 0 24px rgba({p_rgb}, 0.2) !important;
  background: rgba(8, 14, 30, 0.95) !important;
}}

.run-btn {{
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 10px !important;
  background: var(--portal-grd-btn) !important;
  color: #ffffff !important;
  font-size: 14px !important;
  font-weight: 800 !important;
  padding: 13px 28px !important;
  border-radius: var(--portal-radius-sm) !important;
  border: 0 !important;
  cursor: pointer !important;
  box-shadow: 0 6px 22px rgba({p_rgb}, 0.4) !important;
  transition: all 0.22s var(--portal-ease) !important;
}}

.run-btn:hover {{
  transform: translateY(-2px) !important;
  box-shadow: 0 10px 30px rgba({p_rgb}, 0.6) !important;
  filter: brightness(1.1) !important;
}}

.run-btn:active {{
  transform: scale(0.98) !important;
}}

.run-btn:disabled {{
  opacity: 0.6 !important;
  cursor: not-allowed !important;
  transform: none !important;
}}

.tool-result {{
  margin-top: 24px !important;
  padding-top: 20px !important;
  border-top: 1px solid var(--portal-line) !important;
}}

.result-box {{
  background: #020512 !important;
  border: 1px solid rgba({p_rgb}, 0.3) !important;
  border-radius: var(--portal-radius-md) !important;
  padding: 22px !important;
  font-family: 'JetBrains Mono', monospace !important;
  font-size: 13px !important;
  line-height: 1.6 !important;
  color: #38bdf8 !important;
  overflow-x: auto !important;
  box-shadow: inset 0 2px 14px rgba(0, 0, 0, 0.7) !important;
  max-height: 480px !important;
}}

.result-box pre {{
  margin: 0 !important;
  white-space: pre-wrap !important;
  word-break: break-word !important;
}}

.result-error {{
  border-color: rgba(248, 113, 113, 0.4) !important;
  color: #f87171 !important;
  background: rgba(248, 113, 113, 0.08) !important;
}}

/* ── Auth Gate & Modals ─────────────────────────────────────────────────── */
.modal-overlay {{
  position: fixed !important;
  inset: 0 !important;
  background: rgba(2, 5, 16, 0.82) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 1000 !important;
  padding: 20px !important;
}}

.modal {{
  background: rgba(10, 16, 34, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: var(--portal-radius-lg) !important;
  padding: 36px !important;
  width: 100% !important;
  max-width: 480px !important;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 50px rgba({p_rgb}, 0.22) !important;
  position: relative !important;
}}

.modal-close {{
  position: absolute !important;
  top: 20px !important;
  right: 20px !important;
  width: 34px !important;
  height: 34px !important;
  border-radius: 10px !important;
  background: rgba(255, 255, 255, 0.06) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: var(--portal-tx-2) !important;
  display: grid !important;
  place-items: center !important;
  cursor: pointer !important;
  transition: all 0.2s !important;
}}
.modal-close:hover {{
  background: rgba(255, 255, 255, 0.12) !important;
  color: #ffffff !important;
}}

.modal h3 {{
  font-size: 22px !important;
  font-weight: 800 !important;
  color: #ffffff !important;
  margin-top: 0 !important;
  margin-bottom: 8px !important;
}}

.modal-sub {{
  font-size: 13.5px !important;
  color: var(--portal-tx-2) !important;
  line-height: 1.5 !important;
  margin-bottom: 24px !important;
}}

.auth-tabs {{
  display: flex !important;
  gap: 8px !important;
  background: rgba(0, 0, 0, 0.35) !important;
  padding: 4px !important;
  border-radius: 12px !important;
  margin-bottom: 24px !important;
}}

.auth-tab {{
  flex: 1 !important;
  padding: 10px !important;
  font-size: 13.5px !important;
  font-weight: 700 !important;
  border-radius: 10px !important;
  border: 0 !important;
  cursor: pointer !important;
  color: var(--portal-tx-2) !important;
  background: transparent !important;
  transition: all 0.2s !important;
}}

.auth-tab.active {{
  background: rgba({p_rgb}, 0.22) !important;
  color: #ffffff !important;
  box-shadow: 0 2px 10px rgba({p_rgb}, 0.3) !important;
}}

.auth-back {{
  display: inline-block !important;
  margin-top: 20px !important;
  font-size: 12.5px !important;
  color: var(--portal-tx-2) !important;
  text-decoration: none !important;
  transition: color 0.2s !important;
}}
.auth-back:hover {{
  color: #ffffff !important;
}}

.sidebar-toggle {{
  display: none !important;
  width: 40px !important;
  height: 40px !important;
  border-radius: 10px !important;
  background: var(--portal-panel) !important;
  border: 1px solid var(--portal-line) !important;
  color: #ffffff !important;
  cursor: pointer !important;
  margin-bottom: 20px !important;
}}

@media (max-width: 900px) {{
  .sidebar-toggle {{
    display: inline-grid !important;
    place-items: center !important;
  }}
}}

/* ── Sleek Floating Cold-Start Status Indicator ─────────────────────────── */
#cold-start-banner {{
  position: fixed !important;
  top: 18px !important;
  right: 18px !important;
  left: auto !important;
  width: auto !important;
  max-width: 380px !important;
  border-radius: var(--portal-radius-full) !important;
  padding: 9px 18px !important;
  backdrop-filter: blur(20px) !important;
  font-size: 12px !important;
  font-weight: 700 !important;
  z-index: 99999 !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(245, 158, 11, 0.3) !important;
  border: 1px solid rgba(245, 158, 11, 0.4) !important;
}}

"""

def update_static_and_source():
    print("=" * 60)
    print("  🚀 UPGRADING ALL 9 VENTURE PORTALS (CSS + HTML + MIRRORS)")
    print("=" * 60)

    # 1. Process each venture theme
    for slug, theme in VENTURE_THEMES.items():
        print(f"\nProcessing venture: {theme['name']} ({slug})...")
        css_content = generate_portal_css(theme)

        # A. Write portal.css in source frontend (if directory exists)
        src_app_dir = os.path.join(REPO_ROOT, "apps", slug, "frontend", "src", "app", "app")
        if os.path.isdir(src_app_dir):
            pcss = os.path.join(src_app_dir, "portal.css")
            with open(pcss, "w", encoding="utf-8") as f:
                f.write(css_content)
            print(f"  [OK] Created source portal.css -> {os.path.relpath(pcss, REPO_ROOT)}")

        # B. Append to source globals.css (if exists)
        src_globals = os.path.join(REPO_ROOT, "apps", slug, "frontend", "src", "app", "globals.css")
        if os.path.isfile(src_globals):
            with open(src_globals, "r", encoding="utf-8") as f:
                orig_globals = f.read()
            marker = f"/* SEVENSEED_PORTAL_ENHANCEMENT_{slug.upper()} */"
            if marker in orig_globals:
                orig_globals = orig_globals.split(marker)[0].strip()
            new_globals = orig_globals + f"\n\n{marker}\n" + css_content
            with open(src_globals, "w", encoding="utf-8") as f:
                f.write(new_globals)
            print(f"  [OK] Appended to source globals.css -> {os.path.relpath(src_globals, REPO_ROOT)}")

        # C. Write static portal.css in backend/static/<slug>/app/ and sites/<slug>/app/
        static_targets = []
        if slug == "sevenseed":
            # If backend/static/app/index.html exists but sites/app/index.html doesn't, sync it first
            src_root_app = os.path.join(REPO_ROOT, "apps", "sevenseed", "backend", "static", "app")
            for dst_folder in [os.path.join(REPO_ROOT, "sites", "app"), os.path.join(REPO_ROOT, "sites", "sevenseed", "app")]:
                os.makedirs(dst_folder, exist_ok=True)
                if os.path.isdir(src_root_app):
                    for item in os.listdir(src_root_app):
                        s = os.path.join(src_root_app, item)
                        d = os.path.join(dst_folder, item)
                        if os.path.isfile(s) and not os.path.isfile(d):
                            shutil.copy2(s, d)

            static_targets.extend([
                os.path.join(REPO_ROOT, "apps", "sevenseed", "backend", "static", "app"),
                os.path.join(REPO_ROOT, "apps", "sevenseed", "backend", "static", "sevenseed", "app"),
                os.path.join(REPO_ROOT, "sites", "app"),
                os.path.join(REPO_ROOT, "sites", "sevenseed", "app"),
            ])
        else:
            static_targets.extend([
                os.path.join(REPO_ROOT, "apps", "sevenseed", "backend", "static", slug, "app"),
                os.path.join(REPO_ROOT, "sites", slug, "app"),
            ])

        for target_dir in static_targets:
            os.makedirs(target_dir, exist_ok=True)
            pcss_static = os.path.join(target_dir, "portal.css")
            with open(pcss_static, "w", encoding="utf-8") as f:
                f.write(css_content)
            print(f"  [OK] Wrote distribution portal.css -> {os.path.relpath(pcss_static, REPO_ROOT)}")

        # D. In each target app/index.html, ensure portal.css is linked in <head> and back link is clean
        for target_dir in static_targets:
            index_path = os.path.join(target_dir, "index.html")
            if os.path.isfile(index_path):
                with open(index_path, "r", encoding="utf-8") as f:
                    html = f.read()

                # Add portal.css link tag if not already there
                if '<link rel="stylesheet" href="portal.css"' not in html and '<link rel="stylesheet" href="./portal.css"' not in html:
                    link_tag = '<link rel="stylesheet" href="portal.css"/>'
                    # Inject right before </head>
                    if "</head>" in html:
                        html = html.replace("</head>", f"  {link_tag}\n</head>")
                    else:
                        html = f"{link_tag}\n" + html

                # Fix back landing page link if present in static HTML
                home_url = theme["home_url"]
                # Replace href="/" on back buttons with actual home_url
                html = re.sub(r'href="/"(\s+class="[^"]*side-back[^"]*")', f'href="{home_url}"\\1', html)

                with open(index_path, "w", encoding="utf-8") as f:
                    f.write(html)
                print(f"  [OK] Patched <head> & links in {os.path.relpath(index_path, REPO_ROOT)}")

        # E. Also append compiled CSS to the Next.js chunk file for zero-latency hydration
        chunk_rel = theme.get("chunk_path")
        if chunk_rel:
            for base_dir in [os.path.join(REPO_ROOT, "apps", "sevenseed", "backend", "static"), os.path.join(REPO_ROOT, "sites")]:
                chunk_file = os.path.join(base_dir, chunk_rel)
                if os.path.isfile(chunk_file):
                    with open(chunk_file, "r", encoding="utf-8") as f:
                        chunk_css = f.read()
                    marker = f"/* PORTAL_UPGRADE_{slug.upper()} */"
                    if marker in chunk_css:
                        chunk_css = chunk_css.split(marker)[0].strip()
                    new_chunk = chunk_css + f"\n\n{marker}\n" + css_content
                    with open(chunk_file, "w", encoding="utf-8") as f:
                        f.write(new_chunk)
                    print(f"  [OK] Appended enhancements to chunk: {os.path.relpath(chunk_file, REPO_ROOT)}")

    # 2. Mirror synchronization for aliases
    print("\nSynchronizing alias mirrors (pharmacy, breakdown, trust, comonk)...")
    alias_pairs = [
        ('decode-forest-pharmacy', 'pharmacy'),
        ('breakdown-factor', 'breakdown'),
        ('comonk-ai', 'comonk'),
        ('avp-charitable-trust', 'trust'),
        ('app', 'sevenseed/app'),
    ]

    for base in ['sites', os.path.join('apps', 'sevenseed', 'backend', 'static')]:
        for src_name, dst_name in alias_pairs:
            src_app = os.path.join(REPO_ROOT, base, src_name)
            dst_app = os.path.join(REPO_ROOT, base, dst_name)
            if src_name == 'app':
                # special case for root app
                src_app_folder = os.path.join(REPO_ROOT, base, 'app')
                dst_app_folder = os.path.join(REPO_ROOT, base, 'sevenseed', 'app')
                if os.path.isdir(src_app_folder):
                    os.makedirs(dst_app_folder, exist_ok=True)
                    for item in os.listdir(src_app_folder):
                        s = os.path.join(src_app_folder, item)
                        d = os.path.join(dst_app_folder, item)
                        if os.path.isfile(s):
                            shutil.copy2(s, d)
                    print(f"  [OK] Synced {base}/app -> {base}/sevenseed/app")
            else:
                src_sub = os.path.join(REPO_ROOT, base, src_name, 'app')
                dst_sub = os.path.join(REPO_ROOT, base, dst_name, 'app')
                if os.path.isdir(src_sub):
                    os.makedirs(dst_sub, exist_ok=True)
                    for item in os.listdir(src_sub):
                        s = os.path.join(src_sub, item)
                        d = os.path.join(dst_sub, item)
                        if os.path.isfile(s):
                            shutil.copy2(s, d)
                    print(f"  [OK] Synced {base}/{src_name}/app -> {base}/{dst_name}/app")

    # 3. Generate rich, responsive HTML for all 9 venture /app portals
    print("\nGenerating rich, responsive HTML for all 9 venture /app portals...")
    try:
        from generate_portal_pages import generate_all_portal_pages
        generate_all_portal_pages()
    except Exception as e:
        print(f"  [WARN] Failed to run generate_portal_pages: {e}")

    # 4. Ensure apps/sevenseed/backend/static root has all updated files copied from sites
    print("\nFinalizing sync of sites/ into apps/sevenseed/backend/static/...")
    static_hub = os.path.join(REPO_ROOT, "apps", "sevenseed", "backend", "static")
    sites_src = os.path.join(REPO_ROOT, "sites")
    synced = 0
    for root, dirs, files in os.walk(sites_src):
        dirs[:] = [d for d in dirs if d != '_next']
        rel = os.path.relpath(root, sites_src)
        target = os.path.join(static_hub, rel)
        os.makedirs(target, exist_ok=True)
        for f in files:
            if f.endswith(('.html', '.js', '.css', '.svg', '.png', '.jpg', '.ico', '.json')):
                src_file = os.path.join(root, f)
                dst_file = os.path.join(target, f)
                shutil.copy2(src_file, dst_file)
                synced += 1
    print(f"  [OK] Fully synced {synced} files across static distributions.")
    print("\n✅ ALL 9 VENTURE PORTALS SUCCESSFULLY UPGRADED & SYNCHRONIZED!")

if __name__ == "__main__":
    update_static_and_source()

