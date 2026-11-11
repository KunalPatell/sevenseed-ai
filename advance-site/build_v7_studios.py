# -*- coding: utf-8 -*-
"""
Generator for all 11 v7.0 Frontier Studios, New Ventures & Promoted Reference Workstations
inside `e:/main/apps/sevenseed/advance-site/build_v7_studios.py`.

Design & Engineering Guarantees:
- Zero secondary `position: fixed` top bars (`quantum-enhancer.js` injects `#ss-bar` as the single top bar).
- Prominent semantic `<h1>` and 100% unique `<title>` per route.
- Zero external blocking CDN scripts; 100% self-contained HTML5 Canvas, WebGL/2D fallback, and Fetch JS.
- Mobile-safe responsive CSS (`375px` viewport -> `0` horizontal overflow).
- Live FastAPI integration against `/api/*` endpoints in `advance_site_router.py`.
"""

from pathlib import Path
from typing import Dict, Tuple

SHARED_CSS = """
  :root {
    --v7-bg: #070b14;
    --v7-panel: #0f172a;
    --v7-panel-2: #131e35;
    --v7-border: rgba(148, 163, 184, 0.2);
    --v7-text: #f8fafc;
    --v7-muted: #94a3b8;
    --v7-accent: #6366f1;
    --v7-cyan: #06b6d4;
    --v7-emerald: #10b981;
    --v7-amber: #f59e0b;
    --v7-rose: #f43f5e;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: radial-gradient(circle at 15% 0%, rgba(99, 102, 241, 0.14), transparent 42%),
                radial-gradient(circle at 85% 10%, rgba(6, 182, 212, 0.12), transparent 38%),
                var(--v7-bg);
    color: var(--v7-text);
    font-family: "Inter Variable", system-ui, -apple-system, sans-serif;
    line-height: 1.55;
  }
  main.v7-shell {
    max-width: 1180px;
    margin: 0 auto;
    padding: 28px 18px 64px;
  }
  .v7-hero {
    margin-bottom: 24px;
    padding: 24px;
    border-radius: 22px;
    background: linear-gradient(145deg, rgba(15, 23, 42, 0.94), rgba(9, 14, 28, 0.94));
    border: 1px solid var(--v7-border);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.38);
  }
  .v7-kicker {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 999px;
    background: rgba(99, 102, 241, 0.16);
    border: 1px solid rgba(99, 102, 241, 0.42);
    color: #a5b4fc;
    margin-bottom: 10px;
  }
  .v7-hero h1 {
    margin: 0 0 8px;
    font-family: "Plus Jakarta Sans Variable", "Inter Variable", system-ui, sans-serif;
    font-size: clamp(24px, 3.6vw, 36px);
    font-weight: 800;
    letter-spacing: -0.025em;
    color: #ffffff;
  }
  .v7-hero p {
    margin: 0;
    max-width: 780px;
    color: #cbd5e1;
    font-size: 15px;
  }
  .v7-grid-2 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr));
    gap: 18px;
    align-items: start;
  }
  .v7-grid-3 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
    gap: 14px;
  }
  .adv-v7-card {
    background: rgba(15, 23, 42, 0.9);
    border: 1px solid var(--v7-border);
    border-radius: 18px;
    padding: 20px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  }
  .adv-v7-card h2 {
    margin: 0 0 12px;
    font-size: 17px;
    font-weight: 700;
    color: #f8fafc;
  }
  .v7-field { margin-bottom: 12px; }
  .v7-field label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #cbd5e1;
    margin-bottom: 5px;
  }
  .v7-input, .v7-select, .v7-textarea {
    width: 100%;
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid rgba(148, 163, 184, 0.28);
    background: #090e1c;
    color: #f8fafc;
    font-size: 13.5px;
    font-family: inherit;
  }
  .v7-btn-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
  .v7-btn {
    padding: 9px 15px;
    border-radius: 10px;
    border: 1px solid rgba(99, 102, 241, 0.5);
    background: linear-gradient(135deg, #4f46e5, #6366f1);
    color: #ffffff;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.14s ease, filter 0.14s ease;
  }
  .v7-btn:hover { transform: translateY(-1px); filter: brightness(1.08); }
  .v7-btn-ghost {
    background: rgba(30, 41, 59, 0.85);
    border-color: rgba(148, 163, 184, 0.3);
    color: #e2e8f0;
  }
  .v7-stat {
    padding: 14px;
    border-radius: 14px;
    background: rgba(9, 14, 28, 0.85);
    border: 1px solid rgba(148, 163, 184, 0.16);
  }
  .v7-stat .k { font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--v7-muted); }
  .v7-stat .v { font-size: 22px; font-weight: 800; color: #ffffff; margin-top: 4px; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; }
  .v7-pre {
    background: #050811;
    border: 1px solid rgba(148, 163, 184, 0.2);
    border-radius: 12px;
    padding: 14px;
    font-size: 12px;
    font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
    color: #a7f3d0;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
  }
  canvas.v7-canvas {
    width: 100%;
    height: auto;
    display: block;
    background: #060a15;
    border: 1px solid rgba(148, 163, 184, 0.22);
    border-radius: 14px;
  }
  .v7-note {
    margin-top: 12px;
    padding: 10px 12px;
    border-radius: 10px;
    background: rgba(245, 158, 11, 0.1);
    border: 1px solid rgba(245, 158, 11, 0.3);
    color: #fde68a;
    font-size: 12px;
  }
"""


def _wrap_page(title: str, kicker: str, h1: str, subtitle: str, body_html: str, script_js: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
  <style>{SHARED_CSS}</style>
</head>
<body data-v7-studio="1">
  <main class="v7-shell">
    <header class="v7-hero">
      <div class="v7-kicker">{kicker}</div>
      <h1>{h1}</h1>
      <p>{subtitle}</p>
    </header>
    {body_html}
  </main>
  <script>
  (function() {{
    "use strict";
    {script_js}
  }})();
  </script>
</body>
</html>
"""


def page_perplexity_research() -> str:
    body = """
    <div class="v7-grid-2">
      <section class="adv-v7-card">
        <h2>Query & Multi-Hop Focus</h2>
        <div class="v7-field">
          <label for="px-query">Research Question</label>
          <textarea id="px-query" class="v7-textarea" rows="3">Compare Delaware C-Corp vs India Pvt Ltd for AI SaaS startups raising seed capital</textarea>
        </div>
        <div class="v7-field">
          <label for="px-focus">Domain Corpus Filter</label>
          <select id="px-focus" class="v7-select">
            <option value="all">All Sources (Cross-Domain Synthesis)</option>
            <option value="finance">Finance, Venture & Tax (IRS / SEC / Quant)</option>
            <option value="india_legal">India Legal, MCA & FEMA</option>
            <option value="medical">Clinical & Pharmacology (NIH LactMed / FDA)</option>
            <option value="engineering">Systems & Civil Engineering (FAO / Queueing)</option>
            <option value="academic">AI Agents & Computer Science</option>
          </select>
        </div>
        <div class="v7-btn-row">
          <button type="button" id="px-run" class="v7-btn">🔎 Run Cited Research</button>
          <button type="button" class="v7-btn v7-btn-ghost px-preset" data-q="Black-Scholes option Greeks hedging vs Kelly criterion sizing">Quant Greeks</button>
          <button type="button" class="v7-btn v7-btn-ghost px-preset" data-q="Relative Infant Dose RID% pharmacokinetics and CYP3A4 grapefruit interactions">Clinical PK</button>
          <button type="button" id="px-copy" class="v7-btn v7-btn-ghost">📋 Copy Markdown</button>
        </div>
        <h2 style="margin-top:20px;">Reasoning Decomposition Plan</h2>
        <ol id="px-steps" style="margin:0;padding-left:18px;color:#cbd5e1;font-size:13px;"></ol>
      </section>

      <section class="adv-v7-card">
        <h2>Synthesized Brief & Inline Citations</h2>
        <div id="px-answer" class="v7-pre" style="color:#f1f5f9;font-family:inherit;font-size:14px;line-height:1.65;">Running initial research synthesis...</div>
        <h2 style="margin-top:18px;">Verified Sources</h2>
        <div id="px-sources" style="display:grid;gap:10px;"></div>
        <h2 style="margin-top:18px;">Follow-Up Threads</h2>
        <div id="px-followups" class="v7-btn-row"></div>
      </section>
    </div>
    """
    js = """
    const qEl = document.getElementById('px-query');
    const fEl = document.getElementById('px-focus');
    const stepsEl = document.getElementById('px-steps');
    const ansEl = document.getElementById('px-answer');
    const srcEl = document.getElementById('px-sources');
    const folEl = document.getElementById('px-followups');
    let lastMarkdown = '';

    async function runSearch() {
      ansEl.textContent = 'Decomposing query and retrieving cited sources...';
      try {
        const res = await fetch('/api/perplexity/research', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: qEl.value, focus: fEl.value })
        });
        const d = await res.json();
        lastMarkdown = d.cited_answer_markdown || '';
        stepsEl.innerHTML = (d.plan_steps || []).map(s => '<li style="margin-bottom:6px;">' + s.replace(/</g,'&lt;') + '</li>').join('');
        ansEl.textContent = lastMarkdown;
        srcEl.innerHTML = (d.sources || []).map(s => `
          <a href="${s.url}" target="_blank" rel="noopener noreferrer" style="display:block;padding:12px;border-radius:12px;background:#090e1c;border:1px solid rgba(148,163,184,0.22);text-decoration:none;color:#f8fafc;">
            <div style="display:flex;justify-content:space-between;gap:8px;font-size:12px;color:#38bdf8;font-weight:700;">
              <span>[${s.id}] ${s.title}</span>
              <span>Match ${s.relevance_score}%</span>
            </div>
            <div style="font-size:12.5px;color:#cbd5e1;margin-top:4px;">${s.snippet}</div>
          </a>
        `).join('');
        folEl.innerHTML = '';
        (d.follow_up_questions || []).forEach(fq => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'v7-btn v7-btn-ghost';
          b.textContent = fq;
          b.addEventListener('click', () => { qEl.value = fq; runSearch(); });
          folEl.appendChild(b);
        });
      } catch (e) {
        ansEl.textContent = 'Error: ' + String(e);
      }
    }

    document.getElementById('px-run').addEventListener('click', runSearch);
    document.querySelectorAll('.px-preset').forEach(b => b.addEventListener('click', () => {
      qEl.value = b.getAttribute('data-q');
      runSearch();
    }));
    document.getElementById('px-copy').addEventListener('click', function() {
      if (navigator.clipboard && lastMarkdown) navigator.clipboard.writeText(lastMarkdown).catch(() => {});
      this.textContent = 'Copied ✓';
      setTimeout(() => { this.textContent = '📋 Copy Markdown'; }, 1400);
    });
    runSearch();
    """
    return _wrap_page(
        "Perplexity Cited Deep-Research Copilot | Sevenseed Frontier Studio",
        "Frontier AI Studio · Perplexity + Exa Reference",
        "Cited Deep-Research Copilot",
        "Multi-hop query decomposition with inline [1]–[5] citations across finance, engineering, clinical pharmacology, India legal, and Sevenseed knowledge indices.",
        body,
        js,
    )


def page_ai_ui_builder() -> str:
    body = """
    <div class="v7-grid-2">
      <section class="adv-v7-card">
        <h2>Prompt & Design Tokens</h2>
        <div class="v7-field">
          <label for="v0-prompt">Component Prompt</label>
          <textarea id="v0-prompt" class="v7-textarea" rows="3">SaaS usage-based pricing tier cards with monthly and annual billing toggle</textarea>
        </div>
        <div class="v7-grid-3">
          <div class="v7-field">
            <label for="v0-theme">Color Theme</label>
            <select id="v0-theme" class="v7-select">
              <option value="midnight">Midnight Indigo</option>
              <option value="emerald">Emerald Cyber</option>
              <option value="light">Clean Light</option>
              <option value="amber">Solar Amber</option>
            </select>
          </div>
          <div class="v7-field">
            <label for="v0-preset">Layout Preset</label>
            <select id="v0-preset" class="v7-select">
              <option value="pricing">Pricing Tiers</option>
              <option value="kpi-bento">FinTech KPI Bento</option>
              <option value="agent-console">AI Agent Console</option>
            </select>
          </div>
          <div class="v7-field">
            <label for="v0-radius">Border Radius (px)</label>
            <input id="v0-radius" type="number" class="v7-input" value="16" min="4" max="32" />
          </div>
        </div>
        <div class="v7-btn-row">
          <button type="button" id="v0-gen" class="v7-btn">✨ Synthesize Live UI</button>
          <button type="button" id="v0-tab-prev" class="v7-btn v7-btn-ghost">Live Preview</button>
          <button type="button" id="v0-tab-tsx" class="v7-btn v7-btn-ghost">React .tsx</button>
          <button type="button" id="v0-dl" class="v7-btn v7-btn-ghost">⬇ Download .html</button>
        </div>
        <div id="v0-meta" class="v7-note" style="margin-top:16px;">WCAG AA Contrast Verified · Self-contained HTML + React 18 TSX</div>
      </section>

      <section class="adv-v7-card">
        <h2>Interactive Sandbox / Code Inspector</h2>
        <iframe id="v0-frame" title="Synthesized UI Preview" sandbox="allow-scripts" style="width:100%;height:420px;border:1px solid rgba(148,163,184,0.25);border-radius:14px;background:#090d16;"></iframe>
        <pre id="v0-code" class="v7-pre" style="display:none;max-height:420px;"></pre>
      </section>
    </div>
    """
    js = """
    const pEl = document.getElementById('v0-prompt');
    const tEl = document.getElementById('v0-theme');
    const prEl = document.getElementById('v0-preset');
    const rEl = document.getElementById('v0-radius');
    const frame = document.getElementById('v0-frame');
    const codeEl = document.getElementById('v0-code');
    let latestHtml = '', latestTsx = '';

    async function generate() {
      const res = await fetch('/api/v0/generate-ui', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: pEl.value,
          theme: tEl.value,
          preset: prEl.value,
          radius_px: Number(rEl.value || 16)
        })
      });
      const d = await res.json();
      latestHtml = d.html_code || '';
      latestTsx = d.tsx_code || '';
      frame.srcdoc = latestHtml;
      codeEl.textContent = latestTsx;
    }

    document.getElementById('v0-gen').addEventListener('click', generate);
    document.getElementById('v0-tab-prev').addEventListener('click', () => {
      frame.style.display = 'block';
      codeEl.style.display = 'none';
    });
    document.getElementById('v0-tab-tsx').addEventListener('click', () => {
      frame.style.display = 'none';
      codeEl.style.display = 'block';
    });
    document.getElementById('v0-dl').addEventListener('click', () => {
      if (!latestHtml) return;
      const blob = new Blob([latestHtml], { type: 'text/html' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'sevenseed-generated-ui.html';
      a.click();
    });
    generate();
    """
    return _wrap_page(
        "v0 + Bolt Prompt-to-Live-UI Synthesizer | Sevenseed Studio",
        "Frontier AI Studio · v0.dev + Bolt.new + Lovable Reference",
        "Prompt-to-Live-UI Synthesizer",
        "Generate interactive, sandboxed UI components with live theme tokens, instant HTML5 preview, and downloadable React .tsx / HTML source.",
        body,
        js,
    )


def page_infinite_canvas() -> str:
    body = """
    <div class="v7-grid-2">
      <section class="adv-v7-card">
        <h2>System Prompt & Queueing Load</h2>
        <div class="v7-field">
          <label for="cv-prompt">Architecture Description</label>
          <input id="cv-prompt" class="v7-input" value="Multi-region AI RAG API with Redis cache, Kafka stream, and Postgres pgvector" />
        </div>
        <div class="v7-field">
          <label for="cv-rps">Target Arrival Traffic (Requests / Sec)</label>
          <input id="cv-rps" type="number" class="v7-input" value="3500" min="50" max="45000" step="250" />
        </div>
        <div class="v7-btn-row">
          <button type="button" id="cv-gen" class="v7-btn">⚡ Generate & Simulate Load</button>
          <button type="button" id="cv-add" class="v7-btn v7-btn-ghost">+ Add Service Node</button>
          <button type="button" id="cv-export" class="v7-btn v7-btn-ghost">📋 Copy Graph JSON</button>
        </div>
        <div class="v7-grid-3" style="margin-top:16px;">
          <div class="v7-stat"><div class="k">Critical Path p99</div><div id="cv-p99" class="v">-- ms</div></div>
          <div class="v7-stat"><div class="k">Est. Cloud Spend</div><div id="cv-cost" class="v">$--/mo</div></div>
          <div class="v7-stat"><div class="k">Active Nodes</div><div id="cv-cnt" class="v">0</div></div>
        </div>
        <div id="cv-warn" class="v7-note">Drag any node directly on the canvas to rearrange topology.</div>
      </section>

      <section class="adv-v7-card">
        <h2>Interactive Architecture Whiteboard (Drag Nodes)</h2>
        <canvas id="cv-board" class="v7-canvas" width="900" height="440"></canvas>
      </section>
    </div>
    """
    js = """
    const canvas = document.getElementById('cv-board');
    const ctx = canvas.getContext('2d');
    let nodes = [], edges = [], dragNode = null, dragOffX = 0, dragOffY = 0;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(148,163,184,0.08)';
      for (let x = 0; x < canvas.width; x += 36) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); ctx.stroke(); }
      for (let y = 0; y < canvas.height; y += 36) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); ctx.stroke(); }

      edges.forEach(e => {
        const a = nodes.find(n => n.id === e.from), b = nodes.find(n => n.id === e.to);
        if (!a || !b) return;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(a.x + 85, a.y + 32);
        ctx.lineTo(b.x + 85, b.y + 32);
        ctx.stroke();
        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px monospace';
        ctx.fillText(e.label || '', (a.x + b.x)/2 + 55, (a.y + b.y)/2 + 26);
      });

      nodes.forEach(n => {
        const hot = (n.utilization_pct || 0) >= 80;
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = hot ? '#f43f5e' : '#6366f1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(n.x, n.y, 175, 66, 12);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText((n.label || '').slice(0, 22), n.x + 10, n.y + 24);
        ctx.fillStyle = hot ? '#fda4af' : '#6ee7b7';
        ctx.font = '11px monospace';
        ctx.fillText(`Util: ${n.utilization_pct || 12}% · ${n.effective_ms || 5}ms`, n.x + 10, n.y + 46);
      });
    }

    function toCanvasCoords(ev) {
      const r = canvas.getBoundingClientRect();
      return {
        x: (ev.clientX - r.left) * (canvas.width / r.width),
        y: (ev.clientY - r.top) * (canvas.height / r.height)
      };
    }

    canvas.addEventListener('pointerdown', ev => {
      const p = toCanvasCoords(ev);
      dragNode = nodes.find(n => p.x >= n.x && p.x <= n.x + 175 && p.y >= n.y && p.y <= n.y + 66) || null;
      if (dragNode) { dragOffX = p.x - dragNode.x; dragOffY = p.y - dragNode.y; }
    });
    canvas.addEventListener('pointermove', ev => {
      if (!dragNode) return;
      const p = toCanvasCoords(ev);
      dragNode.x = Math.max(8, Math.min(canvas.width - 183, p.x - dragOffX));
      dragNode.y = Math.max(8, Math.min(canvas.height - 74, p.y - dragOffY));
      draw();
    });
    window.addEventListener('pointerup', () => { dragNode = null; });

    async function loadGraph() {
      const res = await fetch('/api/canvas/architecture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: document.getElementById('cv-prompt').value,
          target_rps: Number(document.getElementById('cv-rps').value || 2500)
        })
      });
      const d = await res.json();
      nodes = d.nodes || [];
      edges = d.edges || [];
      document.getElementById('cv-p99').textContent = d.estimated_p99_ms + ' ms';
      document.getElementById('cv-cost').textContent = '$' + d.monthly_infra_estimate_usd;
      document.getElementById('cv-cnt').textContent = String(nodes.length);
      document.getElementById('cv-warn').textContent = (d.bottleneck_warnings || []).join(' | ');
      draw();
    }

    document.getElementById('cv-gen').addEventListener('click', loadGraph);
    document.getElementById('cv-add').addEventListener('click', () => {
      const id = 'svc_' + (nodes.length + 1);
      nodes.push({ id, label: 'Replica Worker #' + (nodes.length + 1), x: 300, y: 330, utilization_pct: 24, effective_ms: 9.4 });
      if (nodes.length > 1) edges.push({ from: nodes[0].id, to: id, label: 'gRPC' });
      document.getElementById('cv-cnt').textContent = String(nodes.length);
      draw();
    });
    document.getElementById('cv-export').addEventListener('click', function() {
      if (navigator.clipboard) navigator.clipboard.writeText(JSON.stringify({ nodes, edges }, null, 2)).catch(() => {});
      this.textContent = 'Copied JSON ✓';
      setTimeout(() => { this.textContent = '📋 Copy Graph JSON'; }, 1400);
    });
    loadGraph();
    """
    return _wrap_page(
        "Infinite System Architecture Whiteboard | Sevenseed Studio",
        "Frontier AI Studio · Excalidraw + Eraser.io Reference",
        "Infinite System Architecture Whiteboard",
        "Interactive HTML5 node-edge architecture canvas with M/M/1 queueing latency inflation, saturation bottleneck detection, and JSON graph export.",
        body,
        js,
    )


def page_linear_os() -> str:
    body = """
    <div class="v7-grid-2">
      <section class="adv-v7-card">
        <h2>Issue Tracker & Keyboard Triage</h2>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
          <input id="ln-title" class="v7-input" style="flex:1;min-width:180px;" placeholder="New engineering issue title..." value="Add WebAuthn passkey session rotation" />
          <select id="ln-prio" class="v7-select" style="width:110px;">
            <option value="P0">P0 Urgent</option>
            <option value="P1" selected>P1 High</option>
            <option value="P2">P2 Normal</option>
          </select>
          <button type="button" id="ln-add" class="v7-btn">+ Create Issue</button>
        </div>
        <div id="ln-board" style="display:grid;gap:10px;"></div>
      </section>

      <section class="adv-v7-card">
        <h2>1,000-Trial Monte Carlo Sprint Burnup</h2>
        <div class="v7-grid-3">
          <div class="v7-field">
            <label for="ln-pts">Backlog Points</label>
            <input id="ln-pts" type="number" class="v7-input" value="140" min="20" max="600" />
          </div>
          <div class="v7-field">
            <label for="ln-sp">Target Sprints</label>
            <input id="ln-sp" type="number" class="v7-input" value="4" min="1" max="12" />
          </div>
          <div class="v7-field">
            <label for="ln-vel">Past Velocities</label>
            <input id="ln-vel" class="v7-input" value="32,38,29,41,36,35" />
          </div>
        </div>
        <div class="v7-btn-row" style="margin-bottom:14px;">
          <button type="button" id="ln-sim" class="v7-btn">🎲 Run 1,000 Monte Carlo Trials</button>
        </div>
        <div class="v7-grid-3" style="margin-bottom:14px;">
          <div class="v7-stat"><div class="k">On-Time Prob</div><div id="ln-prob" class="v">--%</div></div>
          <div class="v7-stat"><div class="k">Median (P50)</div><div id="ln-p50" class="v">-- sprints</div></div>
          <div class="v7-stat"><div class="k">Safe (P85)</div><div id="ln-p85" class="v">-- sprints</div></div>
        </div>
        <canvas id="ln-chart" class="v7-canvas" width="640" height="240"></canvas>
      </section>
    </div>
    """
    js = """
    const states = ['Backlog', 'Todo', 'In Progress', 'Done'];
    let issues = [
      { id: 'SEV-101', title: 'Zero-downtime pgvector HNSW index build', prio: 'P0', state: 2, pts: 8 },
      { id: 'SEV-102', title: 'Global Cmd+K omnibox keyboard navigation', prio: 'P1', state: 3, pts: 5 },
      { id: 'SEV-103', title: 'Strict CSP & rate-limit audit on /api/llm', prio: 'P1', state: 1, pts: 5 },
      { id: 'SEV-104', title: 'Mobile 375px viewport regression suite', prio: 'P2', state: 0, pts: 3 }
    ];

    function renderIssues() {
      const el = document.getElementById('ln-board');
      el.innerHTML = issues.map((it, idx) => `
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 14px;border-radius:12px;background:#090e1c;border:1px solid rgba(148,163,184,0.2);">
          <div>
            <span style="font-family:monospace;font-size:11px;color:#38bdf8;margin-right:6px;">${it.id} · ${it.prio}</span>
            <strong style="font-size:13.5px;">${it.title.replace(/</g,'&lt;')}</strong>
          </div>
          <button type="button" data-idx="${idx}" class="v7-btn v7-btn-ghost ln-step" style="padding:5px 10px;font-size:11.5px;">
            ${states[it.state]} →
          </button>
        </div>
      `).join('');
      el.querySelectorAll('.ln-step').forEach(b => b.addEventListener('click', () => {
        const i = Number(b.getAttribute('data-idx'));
        issues[i].state = (issues[i].state + 1) % states.length;
        renderIssues();
      }));
    }

    document.getElementById('ln-add').addEventListener('click', () => {
      const inp = document.getElementById('ln-title');
      const title = (inp.value || '').trim();
      if (!title) return;
      issues.unshift({ id: 'SEV-' + (101 + issues.length), title, prio: document.getElementById('ln-prio').value, state: 1, pts: 5 });
      inp.value = '';
      renderIssues();
    });

    async function runForecast() {
      const vels = document.getElementById('ln-vel').value.split(',').map(x => parseFloat(x.trim())).filter(x => x > 0);
      const res = await fetch('/api/linear/sprint-forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          backlog_points: Number(document.getElementById('ln-pts').value || 140),
          target_sprints: Number(document.getElementById('ln-sp').value || 4),
          historical_velocities: vels
        })
      });
      const d = await res.json();
      document.getElementById('ln-prob').textContent = d.on_time_probability_pct + '%';
      document.getElementById('ln-p50').textContent = d.p50_sprints + ' sprints';
      document.getElementById('ln-p85').textContent = d.p85_sprints + ' sprints';

      const c = document.getElementById('ln-chart'), ctx = c.getContext('2d');
      ctx.clearRect(0, 0, c.width, c.height);
      const ser = d.burnup_series || [];
      if (!ser.length) return;
      const maxY = Math.max(d.backlog_points * 1.15, ...ser.map(s => s.p85_optimistic));
      const px = i => 48 + (i / Math.max(1, ser.length - 1)) * (c.width - 76);
      const py = v => c.height - 28 - (v / maxY) * (c.height - 48);

      // Target line
      ctx.strokeStyle = '#f59e0b'; ctx.setLineDash([5, 5]);
      ctx.beginPath(); ctx.moveTo(48, py(d.backlog_points)); ctx.lineTo(c.width - 28, py(d.backlog_points)); ctx.stroke();
      ctx.setLineDash([]);

      [['p85_optimistic', '#10b981'], ['p50_median', '#6366f1'], ['p15_conservative', '#f43f5e']].forEach(([k, col]) => {
        ctx.strokeStyle = col; ctx.lineWidth = 2.4; ctx.beginPath();
        ser.forEach((s, i) => { i === 0 ? ctx.moveTo(px(i), py(s[k])) : ctx.lineTo(px(i), py(s[k])); });
        ctx.stroke();
      });
      ctx.fillStyle = '#94a3b8'; ctx.font = '11px monospace';
      ser.forEach((s, i) => ctx.fillText(s.sprint, px(i) - 8, c.height - 8));
    }

    document.getElementById('ln-sim').addEventListener('click', runForecast);
    renderIssues();
    runForecast();
    """
    return _wrap_page(
        "Linear + Raycast Engineering Sprint OS | Sevenseed Studio",
        "Frontier AI Studio · Linear.app + Raycast + Plane Reference",
        "Keyboard-First Engineering OS & Monte Carlo Forecast",
        "Triage engineering issues across workflow states and run 1,000-trial probabilistic sprint velocity burnup simulations.",
        body,
        js,
    )


def page_quant_terminal() -> str:
    body = """
    <div class="v7-grid-2">
      <section class="adv-v7-card">
        <h2>Black-Scholes-Merton & Kelly Inputs</h2>
        <div class="v7-grid-3">
          <div class="v7-field"><label for="qt-spot">Spot Price (S)</label><input id="qt-spot" type="number" class="v7-input" value="22450" /></div>
          <div class="v7-field"><label for="qt-strike">Strike Price (K)</label><input id="qt-strike" type="number" class="v7-input" value="22500" /></div>
          <div class="v7-field"><label for="qt-days">Days to Expiry</label><input id="qt-days" type="number" class="v7-input" value="30" min="1" /></div>
          <div class="v7-field"><label for="qt-vol">Implied Vol (σ)</label><input id="qt-vol" type="number" step="0.01" class="v7-input" value="0.16" /></div>
          <div class="v7-field"><label for="qt-rate">Risk-Free Rate (r)</label><input id="qt-rate" type="number" step="0.005" class="v7-input" value="0.068" /></div>
          <div class="v7-field"><label for="qt-win">Strategy Win Rate</label><input id="qt-win" type="number" step="0.02" class="v7-input" value="0.56" /></div>
        </div>
        <div class="v7-btn-row">
          <button type="button" id="qt-run" class="v7-btn">📈 Solve Option Greeks & Bollinger Chart</button>
        </div>
        <div id="qt-stats" class="v7-grid-3" style="margin-top:16px;"></div>
        <div class="v7-note">Analytical closed-form Black-Scholes European valuation & Kelly sizing for quantitative education — not investment advice.</div>
      </section>

      <section class="adv-v7-card">
        <h2>30-Bar Candlesticks + Bollinger Bands (±2σ)</h2>
        <canvas id="qt-chart" class="v7-canvas" width="760" height="360"></canvas>
      </section>
    </div>
    """
    js = """
    async function solveQuant() {
      const res = await fetch('/api/quant/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spot: Number(document.getElementById('qt-spot').value),
          strike: Number(document.getElementById('qt-strike').value),
          days_to_expiry: Number(document.getElementById('qt-days').value),
          volatility: Number(document.getElementById('qt-vol').value),
          risk_free_rate: Number(document.getElementById('qt-rate').value),
          win_rate: Number(document.getElementById('qt-win').value)
        })
      });
      const d = await res.json();
      const g = d.greeks || {}, p = d.option_prices || {}, k = d.kelly_sizing || {};
      const cards = [
        ['Call / Put', `${p.call} / ${p.put}`],
        ['Delta (C / P)', `${g.delta_call} / ${g.delta_put}`],
        ['Gamma', `${g.gamma}`],
        ['Theta / Day', `${g.theta_call_per_day}`],
        ['Vega (1% IV)', `${g.vega_per_1pct_vol}`],
        ['Half-Kelly / RSI', `${k.half_kelly_pct}% · RSI ${d.rsi_14}`]
      ];
      document.getElementById('qt-stats').innerHTML = cards.map(([lbl, val]) =>
        `<div class="v7-stat"><div class="k">${lbl}</div><div class="v" style="font-size:16px;">${val}</div></div>`
      ).join('');

      const bars = d.series_30d || [];
      const c = document.getElementById('qt-chart'), ctx = c.getContext('2d');
      ctx.clearRect(0, 0, c.width, c.height);
      if (!bars.length) return;
      const hi = Math.max(...bars.map(b => b.bb_upper || b.high));
      const lo = Math.min(...bars.map(b => b.bb_lower || b.low));
      const rng = Math.max(1, hi - lo);
      const xOf = i => 30 + (i / (bars.length - 1)) * (c.width - 54);
      const yOf = v => c.height - 24 - ((v - lo) / rng) * (c.height - 48);

      // Bollinger bands
      [['bb_upper', 'rgba(56,189,248,0.6)'], ['sma', 'rgba(245,158,11,0.75)'], ['bb_lower', 'rgba(56,189,248,0.6)']].forEach(([key, col]) => {
        ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.beginPath();
        bars.forEach((b, i) => { i === 0 ? ctx.moveTo(xOf(i), yOf(b[key])) : ctx.lineTo(xOf(i), yOf(b[key])); });
        ctx.stroke();
      });

      bars.forEach((b, i) => {
        const x = xOf(i), up = b.close >= b.open;
        ctx.strokeStyle = up ? '#10b981' : '#f43f5e';
        ctx.fillStyle = up ? '#10b981' : '#f43f5e';
        ctx.beginPath(); ctx.moveTo(x, yOf(b.high)); ctx.lineTo(x, yOf(b.low)); ctx.stroke();
        const top = yOf(Math.max(b.open, b.close)), bot = yOf(Math.min(b.open, b.close));
        ctx.fillRect(x - 4, top, 8, Math.max(2, bot - top));
      });
    }
    document.getElementById('qt-run').addEventListener('click', solveQuant);
    solveQuant();
    """
    return _wrap_page(
        "Sevenseed Quant & Options Greeks Terminal | FinTech Venture",
        "New Frontier Venture · TradingView + OpenBB + Koyfin Reference",
        "Sevenseed Quant & Options Greeks Terminal",
        "Analytical Black-Scholes-Merton European option pricing, Delta/Gamma/Theta/Vega/Rho Greeks, Kelly criterion sizing, and Bollinger/RSI charting.",
        body,
        js,
    )


def page_climate_agritech() -> str:
    body = """
    <div class="v7-grid-2">
      <section class="adv-v7-card">
        <h2>Carbon Scope 1–3, Crop & Solar Parameters</h2>
        <div class="v7-grid-3">
          <div class="v7-field"><label for="cl-diesel">Fleet Diesel (L/yr)</label><input id="cl-diesel" type="number" class="v7-input" value="18000" /></div>
          <div class="v7-field"><label for="cl-kwh">Grid Power (kWh/yr)</label><input id="cl-kwh" type="number" class="v7-input" value="240000" /></div>
          <div class="v7-field"><label for="cl-spend">Supply Spend ($/yr)</label><input id="cl-spend" type="number" class="v7-input" value="350000" /></div>
          <div class="v7-field">
            <label for="cl-crop">Crop Type (FAO Kc)</label>
            <select id="cl-crop" class="v7-select">
              <option value="wheat">Wheat (Kc 1.15)</option>
              <option value="rice">Rice Paddy (Kc 1.20)</option>
              <option value="cotton">Cotton (Kc 1.18)</option>
              <option value="sugarcane">Sugarcane (Kc 1.25)</option>
              <option value="drip-vegetables">Drip Vegetables (Kc 1.05)</option>
            </select>
          </div>
          <div class="v7-field"><label for="cl-temp">Ambient Temp (°C)</label><input id="cl-temp" type="number" step="0.5" class="v7-input" value="33.5" /></div>
          <div class="v7-field"><label for="cl-solar">Rooftop Solar (kWp)</label><input id="cl-solar" type="number" class="v7-input" value="50" /></div>
        </div>
        <div class="v7-btn-row">
          <button type="button" id="cl-run" class="v7-btn">🌱 Compute GHG, FAO-56 ETc & Solar LCOE</button>
        </div>
        <div id="cl-stats" class="v7-grid-3" style="margin-top:16px;"></div>
      </section>

      <section class="adv-v7-card">
        <h2>Scope 1 / 2 / 3 Emissions Breakdown (tCO2e/yr)</h2>
        <canvas id="cl-chart" class="v7-canvas" width="640" height="280"></canvas>
        <div class="v7-note">Emission factors: Diesel 2.68 kg CO2e/L (EPA), India Grid 0.716 kg CO2e/kWh (CEA baseline), FAO-56 vapour pressure deficit crop evapotranspiration.</div>
      </section>
    </div>
    """
    js = """
    async function solveClimate() {
      const res = await fetch('/api/climate/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diesel_liters_yr: Number(document.getElementById('cl-diesel').value),
          electricity_kwh_yr: Number(document.getElementById('cl-kwh').value),
          supply_chain_spend_usd: Number(document.getElementById('cl-spend').value),
          crop: document.getElementById('cl-crop').value,
          temp_c: Number(document.getElementById('cl-temp').value),
          solar_kwp: Number(document.getElementById('cl-solar').value)
        })
      });
      const d = await res.json();
      const e = d.emissions_tco2e || {}, ir = d.precision_irrigation || {}, so = d.solar_rooftop || {};
      const items = [
        ['Total GHG', e.total_tco2e_yr + ' tCO2e'],
        ['EU CBAM Exposure', '€' + e.eu_cbam_illustrative_eur],
        ['Crop Water (ETc)', ir.etc_crop_mm_per_day + ' mm/d'],
        ['Farm Irrigation', (ir.total_farm_liters_per_day || 0).toLocaleString() + ' L/d'],
        ['Solar LCOE', '₹' + so.lcoe_inr_per_kwh + '/kWh'],
        ['Solar Payback', so.simple_payback_years + ' yrs']
      ];
      document.getElementById('cl-stats').innerHTML = items.map(([k, v]) =>
        `<div class="v7-stat"><div class="k">${k}</div><div class="v" style="font-size:16px;">${v}</div></div>`
      ).join('');

      const c = document.getElementById('cl-chart'), ctx = c.getContext('2d');
      ctx.clearRect(0, 0, c.width, c.height);
      const bars = [
        ['Scope 1 (Fleet)', e.scope_1_direct, '#f59e0b'],
        ['Scope 2 (Grid CEA)', e.scope_2_grid_cea, '#06b6d4'],
        ['Scope 3 (Supply)', e.scope_3_value_chain, '#10b981']
      ];
      const mx = Math.max(1, ...bars.map(b => b[1]));
      bars.forEach(([lbl, val, col], idx) => {
        const y = 38 + idx * 74;
        const w = Math.max(8, (val / mx) * (c.width - 220));
        ctx.fillStyle = col;
        ctx.beginPath(); ctx.roundRect(160, y, w, 38, 8); ctx.fill();
        ctx.fillStyle = '#e2e8f0'; ctx.font = '13px sans-serif';
        ctx.fillText(lbl, 18, y + 24);
        ctx.font = 'bold 13px monospace';
        ctx.fillText(val + ' t', 168 + w, y + 24);
      });
    }
    document.getElementById('cl-run').addEventListener('click', solveClimate);
    solveClimate();
    """
    return _wrap_page(
        "TerraPulse Climate & AgriTech AI | Carbon, Irrigation & Solar Studio",
        "New Frontier Venture · ElectricityMaps + ClimateTrace + FAO-56 Reference",
        "TerraPulse Climate & AgriTech AI",
        "Account for Scope 1/2/3 GHG emissions and EU CBAM exposure, solve FAO-56 crop evapotranspiration demand, and size commercial rooftop solar LCOE.",
        body,
        js,
    )


def page_proptech_studio() -> str:
    body = """
    <div class="v7-grid-2">
      <section class="adv-v7-card">
        <h2>Property DCF, Mortgage EMI & FSI Inputs</h2>
        <div class="v7-grid-3">
          <div class="v7-field"><label for="pt-price">Property Price (₹)</label><input id="pt-price" type="number" class="v7-input" value="12500000" step="250000" /></div>
          <div class="v7-field"><label for="pt-rent">Monthly Rent (₹)</label><input id="pt-rent" type="number" class="v7-input" value="42000" step="2000" /></div>
          <div class="v7-field"><label for="pt-rate">Loan Rate (% p.a.)</label><input id="pt-rate" type="number" step="0.1" class="v7-input" value="8.65" /></div>
          <div class="v7-field"><label for="pt-down">Down Payment (%)</label><input id="pt-down" type="number" class="v7-input" value="20" /></div>
          <div class="v7-field"><label for="pt-plot">Plot Area (sq.m)</label><input id="pt-plot" type="number" class="v7-input" value="1200" /></div>
          <div class="v7-field"><label for="pt-fsi">Permissible FSI</label><input id="pt-fsi" type="number" step="0.1" class="v7-input" value="2.7" /></div>
        </div>
        <div class="v7-btn-row">
          <button type="button" id="pt-run" class="v7-btn">🏙️ Compute DCF Cap-Rate & Massing</button>
        </div>
        <div id="pt-stats" class="v7-grid-3" style="margin-top:16px;"></div>
      </section>

      <section class="adv-v7-card">
        <h2>15-Year Rent vs Buy Crossover & Isometric Massing</h2>
        <canvas id="pt-chart" class="v7-canvas" width="680" height="320"></canvas>
      </section>
    </div>
    """
    js = """
    async function solvePropTech() {
      const res = await fetch('/api/proptech/valuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property_price_inr: Number(document.getElementById('pt-price').value),
          monthly_rent_inr: Number(document.getElementById('pt-rent').value),
          loan_rate_pct: Number(document.getElementById('pt-rate').value),
          down_payment_pct: Number(document.getElementById('pt-down').value),
          plot_area_sqm: Number(document.getElementById('pt-plot').value),
          fsi: Number(document.getElementById('pt-fsi').value)
        })
      });
      const d = await res.json();
      const v = d.valuation || {}, z = d.zoning_massing || {};
      const cards = [
        ['10-Yr DCF Value', '₹' + (v.Intrinsic_dcf_value_inr || 0).toLocaleString()],
        ['Net Cap Rate', v.net_cap_rate_pct + '%'],
        ['Monthly EMI', '₹' + (v.monthly_emi_inr || 0).toLocaleString()],
        ['Buy Beats Rent', 'Year ' + v.rent_vs_buy_crossover_year],
        ['Max Built-up', (z.max_builtup_sqft || 0).toLocaleString() + ' sqft'],
        ['Zoning Floors', z.suggested_floors + ' Floors']
      ];
      document.getElementById('pt-stats').innerHTML = cards.map(([k, val]) =>
        `<div class="v7-stat"><div class="k">${k}</div><div class="v" style="font-size:15px;">${val}</div></div>`
      ).join('');

      const c = document.getElementById('pt-chart'), ctx = c.getContext('2d');
      ctx.clearRect(0, 0, c.width, c.height);
      const curve = d.rent_vs_buy_curve || [];
      if (curve.length) {
        const vals = curve.flatMap(p => [p.cumulative_rent_cost_inr, p.net_buy_cost_inr]);
        const hi = Math.max(...vals, 1), lo = Math.min(...vals, 0);
        const xOf = i => 28 + (i / (curve.length - 1)) * 390;
        const yOf = val => c.height - 28 - ((val - lo) / Math.max(1, hi - lo)) * (c.height - 56);

        [['cumulative_rent_cost_inr', '#f43f5e'], ['net_buy_cost_inr', '#10b981']].forEach(([key, col]) => {
          ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.beginPath();
          curve.forEach((pt, i) => { i === 0 ? ctx.moveTo(xOf(i), yOf(pt[key])) : ctx.lineTo(xOf(i), yOf(pt[key])); });
          ctx.stroke();
        });
        ctx.fillStyle = '#94a3b8'; ctx.font = '11px monospace';
        ctx.fillText('Red: Cum. Rent | Green: Net Buy Cost (15 Yrs)', 28, 20);
      }

      // Isometric building massing tower on right side of canvas
      const floors = Math.min(18, Math.max(1, Number(z.suggested_floors || 6)));
      const cx = 555, baseY = c.height - 36, fh = Math.min(13, 210 / floors);
      for (let f = 0; f < floors; f++) {
        const y = baseY - f * fh;
        ctx.fillStyle = 'rgba(99,102,241,0.55)';
        ctx.strokeStyle = '#a5b4fc';
        ctx.beginPath();
        ctx.moveTo(cx, y); ctx.lineTo(cx + 68, y - 22); ctx.lineTo(cx + 68, y - 22 - fh + 2); ctx.lineTo(cx, y - fh + 2);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(6,182,212,0.45)';
        ctx.beginPath();
        ctx.moveTo(cx, y); ctx.lineTo(cx - 68, y - 22); ctx.lineTo(cx - 68, y - 22 - fh + 2); ctx.lineTo(cx, y - fh + 2);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      }
      ctx.fillStyle = '#e2e8f0'; ctx.font = 'bold 11px monospace';
      ctx.fillText(`FSI ${z.permissible_fsi} · ${z.suggested_floors}F Massing`, 485, 20);
    }
    document.getElementById('pt-run').addEventListener('click', solvePropTech);
    solvePropTech();
    """
    return _wrap_page(
        "UrbanGrid PropTech & Smart Real Estate AI | DCF & Zoning Massing",
        "New Frontier Venture · Zillow + Matterport + 99acres Reference",
        "UrbanGrid PropTech & Smart Real Estate AI",
        "Evaluate 10-year DCF Cap-Rate intrinsic value, mortgage EMI amortization, 15-year Rent-vs-Buy crossover, and FSI/FAR isometric massing.",
        body,
        js,
    )


def page_shader_3d_lab() -> str:
    body = """
    <div class="v7-grid-2">
      <section class="adv-v7-card">
        <h2>Live GPU Fragment Shader & Uniforms</h2>
        <div class="v7-field">
          <label for="sh-preset">Shader Preset</label>
          <select id="sh-preset" class="v7-select">
            <option value="0">01 · Quantum Plasma Interference</option>
            <option value="1">02 · Cybernetic Horizon Grid</option>
            <option value="2">03 · Chromatic Concentric Rings</option>
          </select>
        </div>
        <div class="v7-grid-3">
          <div class="v7-field"><label for="sh-speed">u_speed</label><input id="sh-speed" type="range" min="0.1" max="3.0" step="0.1" value="1.0" class="v7-input" /></div>
          <div class="v7-field"><label for="sh-warp">u_warp</label><input id="sh-warp" type="range" min="0.5" max="6.0" step="0.2" value="2.4" class="v7-input" /></div>
          <div class="v7-field"><label for="sh-scale">u_scale</label><input id="sh-scale" type="range" min="1.0" max="12.0" step="0.5" value="5.0" class="v7-input" /></div>
        </div>
        <div class="v7-field">
          <label for="sh-glsl">Editable GLSL Fragment Source</label>
          <textarea id="sh-glsl" class="v7-textarea" rows="9" style="font-family:monospace;font-size:12px;"></textarea>
        </div>
        <div class="v7-btn-row">
          <button type="button" id="sh-compile" class="v7-btn">⚡ Compile GLSL Shader</button>
          <button type="button" id="sh-copy" class="v7-btn v7-btn-ghost">📋 Copy Embed Snippet</button>
        </div>
        <div id="sh-status" class="v7-note">Shader compiler ready.</div>
      </section>

      <section class="adv-v7-card">
        <h2>Real-Time Viewport</h2>
        <canvas id="sh-canvas" class="v7-canvas" width="720" height="440"></canvas>
      </section>
    </div>
    """
    js = """
    const presets = [
`precision mediump float;
uniform vec2 u_res;
uniform float u_time, u_speed, u_warp, u_scale;
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y) * u_scale;
  float t = u_time * u_speed;
  for (int i = 0; i < 4; i++) {
    uv += sin(uv.yx * u_warp + t) * 0.35;
  }
  vec3 col = 0.5 + 0.5 * cos(t + uv.xyx + vec3(0.0, 2.1, 4.2));
  gl_FragColor = vec4(col, 1.0);
}`,
`precision mediump float;
uniform vec2 u_res;
uniform float u_time, u_speed, u_warp, u_scale;
void main() {
  vec2 uv = (gl_FragCoord.xy / u_res) * 2.0 - 1.0;
  float z = 1.0 / max(0.08, abs(uv.y));
  vec2 grid = fract(vec2(uv.x * z * u_scale * 0.4, z * u_warp - u_time * u_speed));
  float line = step(0.92, max(grid.x, grid.y));
  vec3 col = mix(vec3(0.03, 0.05, 0.12), vec3(0.22, 0.82, 0.98), line * clamp(1.4 - z * 0.12, 0.1, 1.0));
  gl_FragColor = vec4(col, 1.0);
}`,
`precision mediump float;
uniform vec2 u_res;
uniform float u_time, u_speed, u_warp, u_scale;
void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
  float d = length(p) * u_scale;
  float r = sin(d * u_warp - u_time * u_speed * 2.0);
  vec3 col = vec3(0.38, 0.4, 0.95) * (0.45 / max(0.06, abs(r))) * 0.28;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`
    ];

    const canvas = document.getElementById('sh-canvas');
    const codeEl = document.getElementById('sh-glsl');
    const statusEl = document.getElementById('sh-status');
    const gl = canvas.getContext('webgl');
    let prog = null, startT = performance.now();

    codeEl.value = presets[0];

    function compile(src) {
      if (!gl) {
        statusEl.textContent = 'Running 2D procedural canvas fallback (WebGL disabled in current environment).';
        return;
      }
      const vs = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vs, 'attribute vec2 a_pos; void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }');
      gl.compileShader(vs);
      const fs = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fs, src);
      gl.compileShader(fs);
      if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
        statusEl.textContent = 'GLSL Error: ' + gl.getShaderInfoLog(fs);
        return;
      }
      const p = gl.createProgram();
      gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p);
      prog = p;
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, 'a_pos');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      statusEl.textContent = 'Compiled GLSL fragment shader cleanly (60fps WebGL active).';
    }

    function frame(now) {
      const t = (now - startT) * 0.001;
      const sp = Number(document.getElementById('sh-speed').value || 1);
      const wp = Number(document.getElementById('sh-warp').value || 2.4);
      const sc = Number(document.getElementById('sh-scale').value || 5);
      if (gl && prog) {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(prog);
        gl.uniform2f(gl.getUniformLocation(prog, 'u_res'), canvas.width, canvas.height);
        gl.uniform1f(gl.getUniformLocation(prog, 'u_time'), t);
        gl.uniform1f(gl.getUniformLocation(prog, 'u_speed'), sp);
        gl.uniform1f(gl.getUniformLocation(prog, 'u_warp'), wp);
        gl.uniform1f(gl.getUniformLocation(prog, 'u_scale'), sc);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      } else {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          g.addColorStop(0, `hsl(${(t * 40 * sp) % 360}, 75%, 22%)`);
          g.addColorStop(1, `hsl(${(t * 40 * sp + 140) % 360}, 80%, 14%)`);
          ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
      requestAnimationFrame(frame);
    }

    document.getElementById('sh-preset').addEventListener('change', e => {
      codeEl.value = presets[Number(e.target.value)] || presets[0];
      compile(codeEl.value);
    });
    document.getElementById('sh-compile').addEventListener('click', () => compile(codeEl.value));
    document.getElementById('sh-copy').addEventListener('click', function() {
      if (navigator.clipboard) navigator.clipboard.writeText(codeEl.value).catch(() => {});
      this.textContent = 'Copied GLSL ✓';
      setTimeout(() => { this.textContent = '📋 Copy Embed Snippet'; }, 1400);
    });
    compile(codeEl.value);
    requestAnimationFrame(frame);
    """
    return _wrap_page(
        "Live WebGL / GLSL Fragment Shader Lab | Sevenseed 3D Studio",
        "3D & GPU Studio · Lusion + ShaderToy + Unicorn.studio Reference",
        "Live WebGL & GLSL Fragment Shader Lab",
        "Author, compile, and tune real-time GPU fragment shaders in the browser with interactive uniform sliders and instant GLSL source export.",
        body,
        js,
    )


def page_stripe_atlas() -> str:
    body = """
    <div class="v7-grid-2">
      <section class="adv-v7-card">
        <h2>IRS Section 83(b) & Founder Equity Parameters</h2>
        <div class="v7-grid-3">
          <div class="v7-field"><label for="sa-date">Stock Grant Date</label><input id="sa-date" type="date" class="v7-input" value="2026-11-11" /></div>
          <div class="v7-field"><label for="sa-shares">Founder Shares</label><input id="sa-shares" type="number" class="v7-input" value="4000000" /></div>
          <div class="v7-field"><label for="sa-par">Par Value ($/sh)</label><input id="sa-par" type="number" step="0.0001" class="v7-input" value="0.0001" /></div>
          <div class="v7-field"><label for="sa-fmv">1-Yr Cliff FMV ($)</label><input id="sa-fmv" type="number" step="0.05" class="v7-input" value="0.45" /></div>
          <div class="v7-field"><label for="sa-tax">Marginal Tax Rate</label><input id="sa-tax" type="number" step="0.01" class="v7-input" value="0.35" /></div>
        </div>
        <div class="v7-btn-row">
          <button type="button" id="sa-run" class="v7-btn">⚖️ Calculate 83(b) Deadline & Vesting</button>
        </div>
        <div id="sa-stats" class="v7-grid-3" style="margin-top:16px;"></div>
        <div id="sa-note" class="v7-note"></div>
      </section>

      <section class="adv-v7-card">
        <h2>Jurisdiction Matrix & 48-Month Vesting Schedule</h2>
        <div id="sa-jur" style="display:grid;gap:10px;margin-bottom:14px;"></div>
        <canvas id="sa-chart" class="v7-canvas" width="640" height="190"></canvas>
      </section>
    </div>
    """
    js = """
    async function solveAtlas() {
      const res = await fetch('/api/stripe-atlas/incorporate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_date: document.getElementById('sa-date').value,
          founder_shares: Number(document.getElementById('sa-shares').value),
          par_value_usd: Number(document.getElementById('sa-par').value),
          projected_cliff_fmv_usd: Number(document.getElementById('sa-fmv').value),
          marginal_tax_rate: Number(document.getElementById('sa-tax').value)
        })
      });
      const d = await res.json();
      const b = d.irs_83b_calculator || {};
      document.getElementById('sa-stats').innerHTML = [
        ['30-Day IRS Deadline', b.filing_deadline_30_calendar_days],
        ['Grant Basis ($)', '$' + b.cost_basis_at_grant_usd],
        ['Unfiled Cliff Tax', '$' + (b.year_1_cliff_tax_without_83b_usd || 0).toLocaleString()]
      ].map(([k, v]) => `<div class="v7-stat"><div class="k">${k}</div><div class="v" style="font-size:16px;">${v}</div></div>`).join('');
      document.getElementById('sa-note').textContent = b.disclaimer || '';

      document.getElementById('sa-jur').innerHTML = (d.jurisdictions || []).map(j => `
        <div style="padding:12px;border-radius:12px;background:#090e1c;border:1px solid rgba(148,163,184,0.2);">
          <div style="display:flex;justify-content:space-between;gap:8px;font-weight:700;color:#fff;font-size:13.5px;">
            <span>${j.jurisdiction}</span>
            <span style="color:#38bdf8;font-family:monospace;">~$${j.formation_fee_usd}</span>
          </div>
          <div style="font-size:12px;color:#cbd5e1;margin-top:4px;"><strong>Tax:</strong> ${j.base_corporate_tax} · <strong>Fit:</strong> ${j.best_for}</div>
          <div style="font-size:11.5px;color:#94a3b8;margin-top:3px;">${j.india_founder_note}</div>
        </div>
      `).join('');

      const c = document.getElementById('sa-chart'), ctx = c.getContext('2d');
      ctx.clearRect(0, 0, c.width, c.height);
      const vs = d.vesting_4yr_1yr_cliff || [];
      vs.forEach((pt, i) => {
        const x = 36 + i * 84, h = (pt.vested_pct / 100) * 125;
        ctx.fillStyle = pt.vested_pct === 0 ? '#475569' : '#6366f1';
        ctx.beginPath(); ctx.roundRect(x, 150 - Math.max(6, h), 52, Math.max(6, h), 6); ctx.fill();
        ctx.fillStyle = '#e2e8f0'; ctx.font = '11px monospace';
        ctx.fillText('M' + pt.month, x + 12, 172);
        ctx.fillText(pt.vested_pct + '%', x + 8, 142 - Math.max(6, h));
      });
    }
    document.getElementById('sa-run').addEventListener('click', solveAtlas);
    solveAtlas();
    """
    return _wrap_page(
        "Stripe Atlas Incorporation, IRS 83(b) & Vesting Studio | Sevenseed",
        "Founder Legal & Equity Workstation · Stripe Atlas + Carta Reference",
        "Startup Incorporation, IRS 83(b) & Founder Vesting Studio",
        "Compare Delaware C-Corp, India MCA SPICe+ Pvt Ltd, and GIFT City IFSC structures alongside 30-day Section 83(b) deadlines and 4yr/1yr cliff vesting.",
        body,
        js,
    )


def page_pregnancy_lactation_safety() -> str:
    body = """
    <div class="v7-grid-2">
      <section class="adv-v7-card">
        <h2>Pharmacokinetic RID % & Food-Drug Inputs</h2>
        <div class="v7-grid-3">
          <div class="v7-field">
            <label for="dr-name">Drug / Substrate</label>
            <select id="dr-name" class="v7-select">
              <option value="atorvastatin">Atorvastatin (CYP3A4)</option>
              <option value="warfarin">Warfarin (Vit-K Antagonist)</option>
              <option value="linezolid">Linezolid (Reversible MAOI)</option>
              <option value="ciprofloxacin">Ciprofloxacin (Chelation)</option>
              <option value="lisinopril">Lisinopril (ACE Inhibitor)</option>
            </select>
          </div>
          <div class="v7-field"><label for="dr-milk">Milk Conc (mg/L)</label><input id="dr-milk" type="number" step="0.005" class="v7-input" value="0.045" /></div>
          <div class="v7-field"><label for="dr-mat">Maternal Dose (mg/d)</label><input id="dr-mat" type="number" class="v7-input" value="20" /></div>
          <div class="v7-field"><label for="dr-mw">Maternal Wt (kg)</label><input id="dr-mw" type="number" class="v7-input" value="62" /></div>
          <div class="v7-field"><label for="dr-cw">Child Wt (kg)</label><input id="dr-cw" type="number" class="v7-input" value="14" /></div>
          <div class="v7-field"><label for="dr-mgkg">Ref Dose (mg/kg/d)</label><input id="dr-mgkg" type="number" class="v7-input" value="15" /></div>
        </div>
        <div class="v7-btn-row">
          <button type="button" id="dr-run" class="v7-btn">🩺 Compute RID % & Food-Drug Matrix</button>
        </div>
        <div id="dr-stats" class="v7-grid-3" style="margin-top:16px;"></div>
      </section>

      <section class="adv-v7-card">
        <h2>Food-Drug Interaction & LactMed Reference Notes</h2>
        <div id="dr-food" style="padding:16px;border-radius:14px;background:#090e1c;border:1px solid rgba(244,63,94,0.4);margin-bottom:14px;"></div>
        <div id="dr-bench" class="v7-pre" style="color:#e2e8f0;font-family:inherit;"></div>
        <div id="dr-disc" class="v7-note"></div>
      </section>
    </div>
    """
    js = """
    async function runSafety() {
      const res = await fetch('/api/drugs/safety-matrix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          drug: document.getElementById('dr-name').value,
          milk_concentration_mg_l: Number(document.getElementById('dr-milk').value),
          maternal_dose_mg_day: Number(document.getElementById('dr-mat').value),
          maternal_weight_kg: Number(document.getElementById('dr-mw').value),
          child_weight_kg: Number(document.getElementById('dr-cw').value),
          mg_per_kg_day: Number(document.getElementById('dr-mgkg').value)
        })
      });
      const d = await res.json();
      const r = d.lactation_rid_calculation || {}, w = d.weight_arithmetic_check || {}, f = d.food_drug_interaction || {};
      document.getElementById('dr-stats').innerHTML = [
        ['Computed RID %', r.relative_infant_dose_pct + '%'],
        ['Infant Intake', r.infant_dose_mg_kg_day + ' mg/kg/d'],
        ['mg/kg Arithmetic', w.computed_per_dose_mg + ' mg × ' + w.doses_per_day + '/d']
      ].map(([k, v]) => `<div class="v7-stat"><div class="k">${k}</div><div class="v" style="font-size:16px;">${v}</div></div>`).join('');

      document.getElementById('dr-food').innerHTML = `
        <div style="font-size:11.5px;font-family:monospace;color:#fda4af;font-weight:700;">SEVERITY: ${f.severity} · CONTRAINDICATED FOOD: ${f.food}</div>
        <div style="font-size:13.5px;color:#f8fafc;margin-top:6px;">${f.mechanism}</div>
      `;
      document.getElementById('dr-bench').textContent = r.benchmark_note || '';
      document.getElementById('dr-disc').textContent = d.disclaimer || '';
    }
    document.getElementById('dr-run').addEventListener('click', runSafety);
    document.getElementById('dr-name').addEventListener('change', runSafety);
    runSafety();
    """
    return _wrap_page(
        "Pregnancy, LactMed RID % & Food-Drug Safety Workstation | Decode Forest Pharmacy",
        "Decode Forest Pharmacy · Drugs.com + NIH LactMed Reference",
        "Lactation RID % & Food-Drug Interaction Workstation",
        "Pharmacokinetic Relative Infant Dose (RID %) calculator, food-drug interaction screening, and weight-based dosing arithmetic verifier.",
        body,
        js,
    )


def page_crowdfunding_milestones() -> str:
    body = """
    <div class="v7-grid-2">
      <section class="adv-v7-card">
        <h2>Campaign Goal & CSR Matching Pool</h2>
        <div class="v7-grid-3">
          <div class="v7-field"><label for="kt-goal">Campaign Goal (₹)</label><input id="kt-goal" type="number" class="v7-input" value="1500000" step="50000" /></div>
          <div class="v7-field"><label for="kt-raised">Donor Raised (₹)</label><input id="kt-raised" type="number" class="v7-input" value="420000" step="25000" /></div>
          <div class="v7-field"><label for="kt-match">CSR Match Ratio</label><input id="kt-match" type="number" step="0.5" class="v7-input" value="1.0" /></div>
          <div class="v7-field"><label for="kt-cap">CSR Pool Cap (₹)</label><input id="kt-cap" type="number" class="v7-input" value="300000" step="50000" /></div>
        </div>
        <div class="v7-btn-row">
          <button type="button" id="kt-run" class="v7-btn">🤝 Plan Verified Escrow Tranches</button>
        </div>
        <div id="kt-stats" class="v7-grid-3" style="margin-top:16px;"></div>
        <div class="v7-note">Tranche planner models invoice-backed disbursement milestones so funds release directly against verified hospital or disaster-relief bills.</div>
      </section>

      <section class="adv-v7-card">
        <h2>4-Stage Verification Tranche Schedule</h2>
        <div id="kt-tranches" style="display:grid;gap:10px;"></div>
      </section>
    </div>
    """
    js = """
    async function runMilestones() {
      const res = await fetch('/api/ketto/milestone-escrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal_inr: Number(document.getElementById('kt-goal').value),
          current_raised_inr: Number(document.getElementById('kt-raised').value),
          csr_match_ratio: Number(document.getElementById('kt-match').value),
          match_pool_inr: Number(document.getElementById('kt-cap').value)
        })
      });
      const d = await res.json();
      const mix = d.donor_mix_to_close_gap || {};
      document.getElementById('kt-stats').innerHTML = [
        ['Effective Funded', '₹' + (d.effective_total_inr || 0).toLocaleString()],
        ['Goal Progress', d.progress_pct + '%'],
        ['CSR Unlocked', '₹' + (d.csr_match_unlocked_inr || 0).toLocaleString()],
        ['Remaining Gap', '₹' + (d.remaining_needed_inr || 0).toLocaleString()],
        ['₹500 Micro Donors', String(mix.micro_donors_500_inr || 0)],
        ['₹2,500 Supporters', String(mix.community_donors_2500_inr || 0)]
      ].map(([k, v]) => `<div class="v7-stat"><div class="k">${k}</div><div class="v" style="font-size:15px;">${v}</div></div>`).join('');

      document.getElementById('kt-tranches').innerHTML = (d.tranches || []).map(t => {
        const col = t.status === 'FUNDED_READY' ? '#10b981' : (t.status === 'PARTIAL' ? '#f59e0b' : '#64748b');
        return `
          <div style="padding:13px;border-radius:12px;background:#090e1c;border:1px solid ${col}66;">
            <div style="display:flex;justify-content:space-between;gap:8px;font-size:13.5px;font-weight:700;">
              <span>${t.milestone} (${t.share_pct}%)</span>
              <span style="color:${col};font-family:monospace;">₹${(t.amount_inr || 0).toLocaleString()} · ${t.status}</span>
            </div>
            <div style="font-size:12px;color:#94a3b8;margin-top:4px;">Required proof: ${t.verification_artifact}</div>
          </div>
        `;
      }).join('');
    }
    document.getElementById('kt-run').addEventListener('click', runMilestones);
    runMilestones();
    """
    return _wrap_page(
        "Medical & Relief Crowdfunding Milestone Planner | AVP Charitable Trust",
        "AVP Charitable Trust · Ketto + GoFundMe + Milaap Reference",
        "Invoice-Verified Crowdfunding Milestone Planner",
        "Structure medical and disaster-relief campaigns into 4 audited disbursement tranches with CSR matching multipliers and donor-tier modeling.",
        body,
        js,
    )


def build_all_v7_pages(out_dir: Path) -> int:
    """Writes all v7.0 studio, venture, and promoted reference pages (both `<slug>/index.html` and `<slug>.html`)."""
    routes: Dict[str, Tuple[str, str]] = {
        "perplexity-research": ("Perplexity Research", page_perplexity_research()),
        "ai-ui-builder": ("AI UI Builder", page_ai_ui_builder()),
        "infinite-canvas": ("Infinite Architecture Canvas", page_infinite_canvas()),
        "linear-os": ("Linear Engineering OS", page_linear_os()),
        "quant-terminal": ("Quant Terminal", page_quant_terminal()),
        "climate-agritech": ("TerraPulse Climate AgriTech", page_climate_agritech()),
        "proptech-studio": ("UrbanGrid PropTech Studio", page_proptech_studio()),
        "shader-3d-lab": ("WebGL Shader Lab", page_shader_3d_lab()),
        "stripe-atlas": ("Stripe Atlas Incorporation", page_stripe_atlas()),
        "pharmacy/pregnancy-lactation-safety": ("Pharmacy Pregnancy & Lactation Safety", page_pregnancy_lactation_safety()),
        "decode-forest-pharmacy/pregnancy-lactation-safety": (
            "Decode Forest Pharmacy Pregnancy & Lactation Safety",
            page_pregnancy_lactation_safety().replace(
                "<title>Pregnancy, LactMed RID % & Food-Drug Safety Workstation | Decode Forest Pharmacy</title>",
                "<title>Decode Forest Pharmacy — LactMed RID % & Food-Drug Safety Workstation</title>",
            ),
        ),
        "trust/crowdfunding-milestones": ("Trust Crowdfunding Milestones", page_crowdfunding_milestones()),
        "avp-charitable-trust/crowdfunding-milestones": (
            "AVP Charitable Trust Crowdfunding Milestones",
            page_crowdfunding_milestones().replace(
                "<title>Medical & Relief Crowdfunding Milestone Planner | AVP Charitable Trust</title>",
                "<title>AVP Charitable Trust — Medical & Relief Crowdfunding Milestone Planner</title>",
            ),
        ),
    }
    count = 0
    for slug, (_, html_content) in routes.items():
        idx_p = out_dir / slug / "index.html"
        flat_p = out_dir / f"{slug}.html"
        idx_p.parent.mkdir(parents=True, exist_ok=True)
        flat_p.parent.mkdir(parents=True, exist_ok=True)
        idx_p.write_text(html_content, encoding="utf-8")
        flat_p.write_text(html_content, encodin