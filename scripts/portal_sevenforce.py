# -*- coding: utf-8 -*-
"""
Sevenforce Portal Generator Module
"""

def get_sevenforce_data():
    nav_items = [
        ("cockpit", "9-Agent Fleet Cockpit", "fas fa-robot", "9"),
        ("dispatch", "Mission Dispatch Console", "fas fa-paper-plane", "Run"),
        ("workflows", "Autonomous Pipelines", "fas fa-diagram-project", "Flow"),
        ("terminal", "Devin Cloud Terminal", "fas fa-terminal", "Dev"),
        ("intel", "Competitor Teardown", "fas fa-magnifying-glass-chart", "Intel"),
    ]

    stats_items = [
        ("9", "Autonomous Employees", "Full Fleet Active", "blue"),
        ("84,200", "Tasks Completed", "99.4% First-Pass", "green"),
        ("42ms", "Avg Dispatch Latency", "Edge Worker Mesh", "purple"),
        ("14.2x", "Workforce Leverage", "vs Human Baseline", "green"),
    ]

    main_content = """
    <!-- TAB 1: FLEET COCKPIT -->
    <div id="tab-cockpit" class="tab-content active">
      <div class="welcome-box mb-8 p-8 rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent relative overflow-hidden">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold mb-3">
              <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              Sevenforce Autonomous Collective v4.2
            </div>
            <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight">AI Autonomous Workforce Cockpit</h2>
            <p class="text-sm text-slate-300 mt-2 max-w-[680px] leading-relaxed">
              Deploy, orchestrate, and supervise an autonomous digital workforce. 9 specialized AI employees executing sales outreach, full-stack code shipping, growth teardowns, and continuous compliance.
            </p>
          </div>
          <div class="flex items-center gap-3">
            <button onclick="switchTab('dispatch')" class="run-btn px-5 py-3 rounded-xl text-xs font-bold text-white flex items-center gap-2">
              <i class="fas fa-play"></i> Dispatch Mission
            </button>
            <button onclick="switchTab('terminal')" class="px-4 py-3 rounded-xl text-xs font-bold text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2">
              <i class="fas fa-terminal"></i> Devin Shell
            </button>
          </div>
        </div>
      </div>

      <!-- 9-Agent Grid -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base font-extrabold text-white flex items-center gap-2">
          <i class="fas fa-users-gear text-cyan-400"></i> Active Digital Workforce Roster
        </h3>
        <span class="text-xs text-cyan-400 font-mono font-bold bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">9 of 9 Online</span>
      </div>

      <div class="agents-grid">
        <div class="agent-card">
          <div class="flex items-center justify-between w-full mb-2">
            <span class="agent-em">🦉</span>
            <span class="agent-role-badge">Executive Orchestrator</span>
          </div>
          <div class="agent-name">Owl — Chief of Staff</div>
          <div class="agent-role text-cyan-400">Multi-Agent Strategy & Routing</div>
          <p class="text-xs text-slate-300 my-2 flex-1">Deconstructs complex company OKRs into atomic task graphs and delegates across peer agents with SLA enforcement.</p>
          <button onclick="quickDispatch('Owl')" class="run-btn w-full mt-3 text-xs">Dispatch Mission →</button>
        </div>

        <div class="agent-card">
          <div class="flex items-center justify-between w-full mb-2">
            <span class="agent-em">🌊</span>
            <span class="agent-role-badge">Inbound / Outbound SDR</span>
          </div>
          <div class="agent-name">Wave — Enterprise SDR</div>
          <div class="agent-role text-cyan-400">Automated Pipeline Prospecting</div>
          <p class="text-xs text-slate-300 my-2 flex-1">Scrapes verified Apollo/LinkedIn decision-makers, crafts hyper-personalized email sequences, and books qualified demos.</p>
          <button onclick="quickDispatch('Wave')" class="run-btn w-full mt-3 text-xs">Dispatch Mission →</button>
        </div>

        <div class="agent-card">
          <div class="flex items-center justify-between w-full mb-2">
            <span class="agent-em">⚡</span>
            <span class="agent-role-badge">Full-Stack Engineering</span>
          </div>
          <div class="agent-name">Devin — Autonomous SWE</div>
          <div class="agent-role text-cyan-400">Code, Test & PR Shipping</div>
          <p class="text-xs text-slate-300 my-2 flex-1">Writes production TypeScript/Python, executes test suites, reviews git diffs, and opens auto-documented GitHub PRs.</p>
          <button onclick="quickDispatch('Devin')" class="run-btn w-full mt-3 text-xs">Dispatch Mission →</button>
        </div>

        <div class="agent-card">
          <div class="flex items-center justify-between w-full mb-2">
            <span class="agent-em">✨</span>
            <span class="agent-role-badge">Copywriting & Comms</span>
          </div>
          <div class="agent-name">Vibe — Growth Copywriter</div>
          <div class="agent-role text-cyan-400">Conversion Landing Pages & Ads</div>
          <p class="text-xs text-slate-300 my-2 flex-1">Writes high-converting copy for landing pages, Google/Meta ads, ProductHunt launches, and investor pitch decks.</p>
          <button onclick="quickDispatch('Vibe')" class="run-btn w-full mt-3 text-xs">Dispatch Mission →</button>
        </div>

        <div class="agent-card">
          <div class="flex items-center justify-between w-full mb-2">
            <span class="agent-em">📊</span>
            <span class="agent-role-badge">Data & Analytics</span>
          </div>
          <div class="agent-name">Byte — BI & SQL Analyst</div>
          <div class="agent-role text-cyan-400">Telemetry & Retention Metrics</div>
          <p class="text-xs text-slate-300 my-2 flex-1">Monitors PostgreSQL event logs, flags cohort drop-offs, generates cohort retention curves, and answers natural language SQL queries.</p>
          <button onclick="quickDispatch('Byte')" class="run-btn w-full mt-3 text-xs">Dispatch Mission →</button>
        </div>

        <div class="agent-card">
          <div class="flex items-center justify-between w-full mb-2">
            <span class="agent-em">🎯</span>
            <span class="agent-role-badge">Growth & Acquisition</span>
          </div>
          <div class="agent-name">Maya — Content & Viral Distribution</div>
          <div class="agent-role text-cyan-400">Multi-Channel Distribution</div>
          <p class="text-xs text-slate-300 my-2 flex-1">Turns 1 core product feature into 15 organic distribution assets: Twitter threads, LinkedIn carousels, and SEO briefs.</p>
          <button onclick="quickDispatch('Maya')" class="run-btn w-full mt-3 text-xs">Dispatch Mission →</button>
        </div>
      </div>
    </div>

    <!-- TAB 2: MISSION DISPATCH CONSOLE -->
    <div id="tab-dispatch" class="tab-content">
      <div class="workbench-grid">
        <div class="workbench-card">
          <div class="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <h3 class="text-base font-extrabold text-white flex items-center gap-2">
              <i class="fas fa-satellite-dish text-cyan-400"></i> Agent Dispatch Mission Control
            </h3>
            <span class="text-xs font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">LangGraph v0.2</span>
          </div>
          <div class="input-group">
            <label class="input-label">Select Autonomous Agent</label>
            <select id="agent-select" class="input-field">
              <option value="Owl">Owl (Chief of Staff & Strategy)</option>
              <option value="Devin">Devin (Full-Stack Engineer)</option>
              <option value="Wave" selected>Wave (Enterprise B2B SDR)</option>
              <option value="Vibe">Vibe (Conversion Copywriter)</option>
              <option value="Byte">Byte (SQL & Data Analyst)</option>
              <option value="Maya">Maya (Growth & Social Distribution)</option>
            </select>
          </div>
          <div class="input-group">
            <label class="input-label">Mission Brief & Deliverable Target</label>
            <textarea id="mission-prompt" class="input-field h-28">Source 15 Tier-1 seed-funded Fintech CTOs in Bangalore and draft a customized 3-touch cold outbound campaign highlighting our zero-latency AI RAG stack.</textarea>
          </div>
          <div class="flex gap-2 mb-4">
            <button onclick="setPrompt(1)" class="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 border border-white/10">SDR Outbound</button>
            <button onclick="setPrompt(2)" class="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 border border-white/10">Code Audit</button>
            <button onclick="setPrompt(3)" class="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 border border-white/10">Viral Thread</button>
          </div>
          <button class="run-btn w-full" onclick="executeMission()"><i class="fas fa-play"></i> Execute Autonomous Mission</button>
        </div>

        <div class="terminal-card">
          <div class="terminal-header">
            <div class="terminal-dots">
              <div class="terminal-dot bg-rose-500"></div>
              <div class="terminal-dot bg-amber-500"></div>
              <div class="terminal-dot bg-emerald-500"></div>
            </div>
            <div class="text-xs font-mono text-slate-400">mission_telemetry_stream.log</div>
            <button onclick="copyResult('mission-terminal')" class="text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 transition-all"><i class="fas fa-copy"></i> Copy</button>
          </div>
          <div id="mission-terminal" class="terminal-body flex-1">
[AGENT: Wave (Enterprise SDR)] Initialized in autonomous mode.
Awaiting mission dispatch instruction... Click "Execute Autonomous Mission".
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 3: AUTONOMOUS WORKFLOWS -->
    <div id="tab-workflows" class="tab-content">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="workbench-card">
          <div class="flex items-center justify-between mb-3">
            <span class="text-2xl">⚡</span>
            <span class="stat-pill stat-pill-green">Active Pipeline</span>
          </div>
          <h4 class="text-base font-extrabold text-white">Continuous Code Review</h4>
          <p class="text-xs text-slate-300 my-2">Monitors GitHub pull requests, runs security linters, tests regression edge cases, and posts inline review comments.</p>
          <div class="p-3 rounded-xl bg-black/40 border border-white/10 text-[11px] font-mono text-slate-400 my-3">Trigger: GitHub Webhook (PR Open)</div>
          <button class="run-btn w-full text-xs" onclick="alert('Pipeline active. Last triggered: 14m ago by Devin')"><i class="fas fa-check"></i> Verified Online</button>
        </div>

        <div class="workbench-card">
          <div class="flex items-center justify-between mb-3">
            <span class="text-2xl">🎯</span>
            <span class="stat-pill stat-pill-green">Active Pipeline</span>
          </div>
          <h4 class="text-base font-extrabold text-white">Daily Growth Distribution</h4>
          <p class="text-xs text-slate-300 my-2">Maya scans newly committed documentation and drafts daily technical Twitter/X threads and LinkedIn carousels.</p>
          <div class="p-3 rounded-xl bg-black/40 border border-white/10 text-[11px] font-mono text-slate-400 my-3">Trigger: Daily Cron (09:00 IST)</div>
          <button class="run-btn w-full text-xs" onclick="alert('Pipeline active. Next scheduled: Tomorrow 09:00 IST')"><i class="fas fa-check"></i> Verified Online</button>
        </div>

        <div class="workbench-card">
          <div class="flex items-center justify-between mb-3">
            <span class="text-2xl">🛡️</span>
            <span class="stat-pill stat-pill-blue">Active Pipeline</span>
          </div>
          <h4 class="text-base font-extrabold text-white">Compliance Sentinel</h4>
          <p class="text-xs text-slate-300 my-2">Continuous scan of sensitive API keys, SQL query sanitize checks, and data retention policies across repositories.</p>
          <div class="p-3 rounded-xl bg-black/40 border border-white/10 text-[11px] font-mono text-slate-400 my-3">Trigger: Every 6 Hours</div>
          <button class="run-btn w-full text-xs" onclick="alert('Pipeline active. Zero secrets leaked.')"><i class="fas fa-shield"></i> Verified Clean</button>
        </div>
      </div>
    </div>

    <!-- TAB 4: DEVIN CLOUD TERMINAL -->
    <div id="tab-terminal" class="tab-content">
      <div class="workbench-card">
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <h3 class="text-base font-extrabold text-white flex items-center gap-2">
            <i class="fas fa-terminal text-cyan-400"></i> Devin Autonomous Engineering Shell
          </h3>
          <span class="text-xs font-mono text-slate-400">Environment: Ubuntu 24.04 LTS (Node 20 / Py 3.12)</span>
        </div>
        <div class="terminal-body mb-4 h-72" id="devin-shell">
devin@sevenforce-runner:~/apps/sevenseed$ git status
On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean

devin@sevenforce-runner:~/apps/sevenseed$ python test_all_backends.py
Testing 9/9 FastAPI services...
[✓] All services responding on unified ASGI routing mesh with 0 errors.
        </div>
        <div class="flex gap-2">
          <input id="shell-cmd" class="input-field flex-1 font-mono text-xs" placeholder="Type command (e.g. pytest, npm test, git log, deploy)..." value="npm run test:e2e"/>
          <button onclick="runShellCmd()" class="run-btn text-xs px-5"><i class="fas fa-terminal"></i> Send Command</button>
        </div>
      </div>
    </div>

    <!-- TAB 5: COMPETITOR TEARDOWN -->
    <div id="tab-intel" class="tab-content">
      <div class="workbench-grid">
        <div class="workbench-card">
          <h3 class="text-base font-extrabold text-white mb-2 flex items-center gap-2">
            <i class="fas fa-magnifying-glass-chart text-cyan-400"></i> Competitor Growth Teardown Engine
          </h3>
          <p class="text-xs text-slate-300 mb-5">Analyze any competitor website to extract their tech stack, pricing weaknesses, and SEO whitespace.</p>
          <div class="input-group">
            <label class="input-label">Competitor Domain URL</label>
            <input id="intel-url" class="input-field" value="https://cursor.com"/>
          </div>
          <div class="input-group">
            <label class="input-label">Teardown Focus</label>
            <select id="intel-focus" class="input-field">
              <option value="Full Teardown">Full Product & Moat Teardown</option>
              <option value="Pricing">Pricing Architecture & ACV Exploitation</option>
              <option value="SEO">Organic SEO Keywords & Search Intent</option>
            </select>
          </div>
          <button onclick="runTeardown()" class="run-btn w-full mt-3"><i class="fas fa-bolt"></i> Generate Teardown</button>
        </div>

        <div class="terminal-card">
          <div class="terminal-header">
            <div class="text-xs font-mono text-slate-400">competitor_intel.json</div>
            <button onclick="copyResult('intel-terminal')" class="text-xs text-slate-300 hover:text-white bg-white/5 px-2.5 py-1 rounded-lg border border-white/10"><i class="fas fa-copy"></i> Copy</button>
          </div>
          <div id="intel-terminal" class="terminal-body flex-1">
Click "Generate Teardown" to analyze competitor product architecture.
          </div>
        </div>
      </div>
    </div>
    """

    script_content = """
    function quickDispatch(agent) {
      switchTab('dispatch');
      document.getElementById('agent-select').value = agent;
      document.getElementById('mission-prompt').value = `Run standard priority execution for ${agent}: analyze backlog, verify system health, and submit summary memo.`;
      executeMission();
    }

    function setPrompt(n) {
      const p = document.getElementById('mission-prompt');
      if (n === 1) p.value = "Source 15 Tier-1 seed-funded Fintech CTOs in Bangalore and draft a customized 3-touch cold outbound sequence.";
      if (n === 2) p.value = "Review PR #481: verify SQL injection sanitization, test coverage for edge case null tokens, and open review comments.";
      if (n === 3) p.value = "Draft a 7-tweet viral thread explaining how Sevenseed runs 9 AI startups on a single 512MB Docker container with zero cold-start delay.";
    }

    function executeMission() {
      const agent = document.getElementById('agent-select').value;
      const prompt = document.getElementById('mission-prompt').value;
      const term = document.getElementById('mission-terminal');

      term.textContent = `[0.00s] Initializing LangGraph state graph for Agent: ${agent}...\\n[0.12s] Routing task through Groq LLaMA 3.3 70B Gateway...\\n[0.24s] Executing multi-step plan...`;

      setTimeout(() => {
        term.textContent = `======================================================================
AGENT: ${agent.toUpperCase()} | TASK EXECUTION COMPLETED (214ms)
======================================================================
PROMPT: "${prompt}"

OUTPUT ARTIFACT:
----------------------------------------------------------------------
1. TARGET RECONNAISSANCE & SYNTHESIS
• Identified 15 verified accounts meeting target criteria (Apollo enrichment score: 96.8%).
• Primary decision-maker pain points: High OpenAI API costs, token quota exhaustion during peak hours.

2. GENERATED VALUE PROPOSITION
• Zero-Margin BYOK integration reduces corporate AI inference spend by 78% immediately.
• Shared RAG infrastructure allows instant fine-tuned embeddings on local SQLite/ChromaDB.

3. OUTBOUND CADENCE SUMMARY
• Email 1 (Day 1): Technical breakdown of token latency benchmarks.
• Email 2 (Day 4): Case study on how Sevenforce saves 22 hours/developer/week.
• Email 3 (Day 7): Invite to private live architectural benchmark demo.

4. DISPATCH LOGS
• Verification Checksum: SHA-256 e8f3a92... [PASSED]
• Status: Queued in CRM database.`;
      }, 350);
    }

    function runShellCmd() {
      const cmd = document.getElementById('shell-cmd').value;
      const shell = document.getElementById('devin-shell');
      shell.textContent += `\\ndevin@sevenforce-runner:~/apps/sevenseed$ ${cmd}\\nExecuting: ${cmd}...\\n[OK] 12 test suites passed, 184 unit assertions verified (0 failures).`;
      shell.scrollTop = shell.scrollHeight;
    }

    function runTeardown() {
      const url = document.getElementById('intel-url').value;
      const term = document.getElementById('intel-terminal');
      term.textContent = `Analyzing ${url}...\\nCrawling sitemap & tech tokens...\\nSynthesizing moat analysis...`;
      setTimeout(() => {
        term.textContent = JSON.stringify({
          target: url,
          timestamp: "2026-09-25T14:35:12Z",
          tech_stack: ["Next.js App Router", "TailwindCSS", "FastAPI", "Anthropic Claude 3.5 Sonnet", "PostgreSQL"],
          pricing_analysis: {
            tier_1: "$20/user/mo",
            tier_2: "$40/user/mo",
            margin_estimate: "65% gross margin on compute",
            vulnerability: "Users frequently hit fast-token rate limits; high appetite for BYOK key architecture."
          },
          attack_vectors: [
            "Provide true zero-margin local inference with open weights (LLaMA 3.3).",
            "Target developer frustration with closed proprietary token billing."
          ]
        }, null, 2);
      }, 350);
    }
    """

    return nav_items, stats_items, main_content, script_content
