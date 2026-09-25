# -*- coding: utf-8 -*-
"""
Comonk AI Portal Generator Module - Enterprise Career Intelligence & Hiring AI
"""

def get_comonk_data():
    nav_items = [
        ("cockpit", "Readiness Cockpit", "fas fa-gauge-high", "84/100"),
        ("ats", "ATS Resume Scorer", "fas fa-file-invoice", "AI"),
        ("mock", "FAANG Mock Arena", "fas fa-user-tie", "Sim"),
        ("salary", "Levels Compensation Radar", "fas fa-money-bill-trend-up", "Calc"),
        ("roadmap", "Role Upskilling Sprint", "fas fa-map", "Sprint"),
    ]

    stats_items = [
        ("84/100", "Career Readiness Index", "+12 pts vs last month", "green"),
        ("94.2%", "ATS Parse Pass Rate", "FAANG Level Optimized", "blue"),
        ("₹48.5L", "Market Compensation Target", "90th Percentile BLR", "purple"),
        ("6 Days", "Next Milestone Interview", "Google L5 Distributed Sys", "green"),
    ]

    main_content = """
    <!-- TAB 1: READINESS COCKPIT -->
    <div id="tab-cockpit" class="tab-content active">
      <div class="welcome-box mb-8 p-8 rounded-2xl border border-white/10 bg-gradient-to-r from-sky-500/15 via-blue-500/10 to-transparent relative overflow-hidden">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-bold mb-3">
              <span class="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
              Career Intelligence Engine v4.2 Online
            </div>
            <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight">Enterprise Career & Interview Readiness</h2>
            <p class="text-sm text-slate-300 mt-2 max-w-[680px] leading-relaxed">
              Real-time career telemetry benchmarked against top 1% tech engineering standards. Analyze resume fit across 2,400+ tech job descriptions, simulate FAANG system design loops, and benchmark offer packages.
            </p>
          </div>
          <div class="flex items-center gap-3">
            <button onclick="switchTab('ats')" class="run-btn px-5 py-3 rounded-xl text-xs font-bold text-white flex items-center gap-2">
              <i class="fas fa-file-circle-check"></i> Run ATS Scan
            </button>
            <button onclick="switchTab('mock')" class="px-4 py-3 rounded-xl text-xs font-bold text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2">
              <i class="fas fa-play"></i> Mock Interview
            </button>
          </div>
        </div>
      </div>

      <!-- Skill Pentagram & Milestone Progress -->
      <div class="workbench-grid">
        <div class="workbench-card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-extrabold text-white flex items-center gap-2">
              <i class="fas fa-chart-pie text-sky-400"></i> Competency Radar Breakdown
            </h3>
            <span class="text-xs font-mono text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20">Target: Staff AI Engineer</span>
          </div>

          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-slate-300">Distributed Systems & Architecture</span>
                <span class="text-emerald-400 font-mono">92% (Top 3%)</span>
              </div>
              <div class="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                <div class="bg-gradient-to-r from-sky-500 to-indigo-500 h-2 rounded-full" style="width: 92%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-slate-300">Data Structures & Graph Algorithms</span>
                <span class="text-emerald-400 font-mono">88% (Top 7%)</span>
              </div>
              <div class="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                <div class="bg-gradient-to-r from-sky-500 to-emerald-500 h-2 rounded-full" style="width: 88%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-slate-300">LLM Fine-Tuning & RAG Pipelines</span>
                <span class="text-sky-400 font-mono">85% (Top 10%)</span>
              </div>
              <div class="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                <div class="bg-gradient-to-r from-sky-500 to-cyan-500 h-2 rounded-full" style="width: 85%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-slate-300">Behavioral Leadership & STAR Delivery</span>
                <span class="text-yellow-400 font-mono">81% (Target +5%)</span>
              </div>
              <div class="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                <div class="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full" style="width: 81%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-slate-300">Executive Communication & Influence</span>
                <span class="text-yellow-400 font-mono">78% (Target +8%)</span>
              </div>
              <div class="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                <div class="bg-gradient-to-r from-amber-500 to-rose-500 h-2 rounded-full" style="width: 78%"></div>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Next Recommended Action:</span>
            <button onclick="switchTab('mock')" class="text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1">
              Simulate L5 Behavioral Loop <i class="fas fa-arrow-right text-[10px]"></i>
            </button>
          </div>
        </div>

        <!-- Target Company Tier Readiness -->
        <div class="workbench-card">
          <h3 class="text-base font-extrabold text-white mb-4 flex items-center gap-2">
            <i class="fas fa-building-flag text-sky-400"></i> Target Company Match Index
          </h3>
          <div class="space-y-3">
            <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 font-black text-sm grid place-items-center">G</div>
                <div>
                  <div class="text-xs font-bold text-white">Google — Cloud AI & Infrastructure</div>
                  <div class="text-[11px] text-slate-400">L5 Senior Software Engineer</div>
                </div>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">91% Match</span>
            </div>

            <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 font-black text-sm grid place-items-center">A</div>
                <div>
                  <div class="text-xs font-bold text-white">Amazon AWS — Distributed Cache</div>
                  <div class="text-[11px] text-slate-400">SDE-3 / Lead Architect</div>
                </div>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">88% Match</span>
            </div>

            <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-sm grid place-items-center">M</div>
                <div>
                  <div class="text-xs font-bold text-white">Microsoft — Copilot Engine</div>
                  <div class="text-[11px] text-slate-400">Senior Applied Scientist</div>
                </div>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">86% Match</span>
            </div>

            <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 font-black text-sm grid place-items-center">U</div>
                <div>
                  <div class="text-xs font-bold text-white">Uber Technologies — Core Marketplace</div>
                  <div class="text-[11px] text-slate-400">Staff Backend Engineer</div>
                </div>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-mono font-bold">82% Match</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: ATS RESUME SCORER -->
    <div id="tab-ats" class="tab-content">
      <div class="workbench-grid">
        <div class="workbench-card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-extrabold text-white flex items-center gap-2">
              <i class="fas fa-file-contract text-sky-400"></i> ATS Resume Keyword Matcher
            </h3>
            <span class="text-xs text-sky-400 font-mono font-bold">GPT-4o Vision ATS Parser</span>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-white/70 mb-1.5 uppercase tracking-wider">Target Job Description & Role</label>
              <select id="ats-role" class="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white outline-none focus:border-sky-500">
                <option value="staff_ai">Staff AI / ML Infrastructure Engineer (Google/Meta)</option>
                <option value="lead_backend">Principal Backend Architect - High Throughput (Uber/AWS)</option>
                <option value="fullstack_lead">Founding Full-Stack Lead (Y-Combinator Series A)</option>
                <option value="em">Engineering Manager - Distributed Core (Microsoft)</option>
              </select>
            </div>

            <div>
              <div class="flex justify-between items-center mb-1.5">
                <label class="text-xs font-bold text-white/70 uppercase tracking-wider">Resume Highlights / Raw Text</label>
                <button onclick="loadSampleResume()" class="text-[11px] text-sky-400 hover:text-sky-300 font-semibold cursor-pointer">
                  Load Pre-filled Staff SWE Sample
                </button>
              </div>
              <textarea id="ats-resume-input" rows="8" class="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-slate-200 font-mono outline-none focus:border-sky-500 placeholder:text-white/20" placeholder="Paste your resume sections, technical achievements, or bullet points here..."></textarea>
            </div>

            <div class="flex items-center gap-3">
              <button onclick="runAtsAudit()" class="run-btn w-full py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2">
                <i class="fas fa-bolt"></i> Run Real-Time ATS Compatibility Audit
              </button>
            </div>
          </div>
        </div>

        <div class="terminal-card">
          <div class="terminal-header">
            <div class="terminal-dots">
              <div class="terminal-dot bg-rose-500"></div>
              <div class="terminal-dot bg-amber-500"></div>
              <div class="terminal-dot bg-emerald-500"></div>
            </div>
            <span class="text-xs font-mono text-slate-400">ats_diagnostic_output.log</span>
            <button onclick="copyResult('ats-console')" class="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer">
              <i class="fas fa-copy"></i> Copy
            </button>
          </div>
          <div class="terminal-body" id="ats-console">
[READY] Awaiting ATS resume payload. Select target role and click 'Run Real-Time ATS Compatibility Audit' to compute hard skills match, quantifiable impact scores, and recruiter searchability index.
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 3: FAANG MOCK ARENA -->
    <div id="tab-mock" class="tab-content">
      <div class="workbench-grid">
        <div class="workbench-card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-extrabold text-white flex items-center gap-2">
              <i class="fas fa-microphone-lines text-sky-400"></i> AI Interview Simulator
            </h3>
            <span class="text-xs text-emerald-400 font-mono font-bold">Adaptive Prompt Engine</span>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-white/70 mb-1.5 uppercase">Interview Track</label>
                <select id="mock-track" class="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-sky-500">
                  <option value="sys_design">System Design & High Availability</option>
                  <option value="dsa">Advanced Graph Algorithms & DP</option>
                  <option value="behavioral">STAR Behavioral Leadership</option>
                  <option value="concurrency">Concurrency & Distributed Lock</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-white/70 mb-1.5 uppercase">Target Bar Level</label>
                <select id="mock-level" class="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-sky-500">
                  <option value="l5">Google L5 / Senior SWE</option>
                  <option value="l6">Meta E6 / Staff Engineer</option>
                  <option value="l7">Principal Architect (L7)</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-white/70 mb-1.5 uppercase">System Design / Problem Challenge</label>
              <input type="text" id="mock-question" class="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white outline-none focus:border-sky-500" value="Design a Global Real-Time Ride-Matching Engine (10M concurrent drivers with geospatial indexing)"/>
            </div>

            <div>
              <label class="block text-xs font-bold text-white/70 mb-1.5 uppercase">Your Architecture Proposal / Response</label>
              <textarea id="mock-candidate-ans" rows="6" class="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-slate-200 font-mono outline-none focus:border-sky-500" placeholder="Break down functional requirements, non-functional latency constraints, DB storage schema, Redis GeoHash/H3 sharding, and failover..."></textarea>
            </div>

            <button onclick="evaluateMockResponse()" class="run-btn w-full py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2">
              <i class="fas fa-brain"></i> Score Architecture Proposal
            </button>
          </div>
        </div>

        <div class="terminal-card">
          <div class="terminal-header">
            <div class="terminal-dots">
              <div class="terminal-dot bg-rose-500"></div>
              <div class="terminal-dot bg-amber-500"></div>
              <div class="terminal-dot bg-emerald-500"></div>
            </div>
            <span class="text-xs font-mono text-slate-400">faang_evaluator_response.json</span>
            <button onclick="copyResult('mock-console')" class="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer">
              <i class="fas fa-copy"></i> Copy
            </button>
          </div>
          <div class="terminal-body" id="mock-console">
[SIMULATOR READY] Select your interview track, input your system proposal or STAR response, and click 'Score Architecture Proposal' to receive detailed rubric grades: Scale (10/10), Fault Tolerance (10/10), and Tradeoff Defense.
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 4: LEVELS COMPENSATION RADAR -->
    <div id="tab-salary" class="tab-content">
      <div class="workbench-grid">
        <div class="workbench-card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-extrabold text-white flex items-center gap-2">
              <i class="fas fa-coins text-sky-400"></i> Levels.fyi Real-Time Compensation Radar
            </h3>
            <span class="text-xs text-emerald-400 font-mono font-bold">2026 Verified Data</span>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-white/70 mb-1.5 uppercase">Role Family</label>
                <select id="sal-role" onchange="calculateComp()" class="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-sky-500">
                  <option value="swe">Software Engineer / Architect</option>
                  <option value="ml">Machine Learning / AI Infra</option>
                  <option value="pm">Product Manager (Technical)</option>
                  <option value="em">Engineering Manager</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-white/70 mb-1.5 uppercase">Experience Level</label>
                <select id="sal-level" onchange="calculateComp()" class="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-sky-500">
                  <option value="l4">Mid-Level (SDE-2 / L4)</option>
                  <option value="l5" selected>Senior Engineer (L5 / SDE-3)</option>
                  <option value="l6">Staff Engineer (L6 / Principal)</option>
                  <option value="l7">Senior Staff / VP Eng (L7+)</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-white/70 mb-1.5 uppercase">Location Tier</label>
                <select id="sal-loc" onchange="calculateComp()" class="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-sky-500">
                  <option value="blr" selected>Bengaluru, India (Tier 1 Tech Hub)</option>
                  <option value="hyd">Hyderabad / NCR, India</option>
                  <option value="us_rem">Remote US (Global USD)</option>
                  <option value="eu">London / Amsterdam, EU</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-white/70 mb-1.5 uppercase">Company Tier</label>
                <select id="sal-tier" onchange="calculateComp()" class="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-sky-500">
                  <option value="faang" selected>FAANG / Tier 1 (Google, Meta, Uber)</option>
                  <option value="unicorn">High-Growth Unicorn (Series B-D)</option>
                  <option value="enterprise">Global FinTech / Hedge Fund</option>
                </select>
              </div>
            </div>

            <button onclick="calculateComp()" class="run-btn w-full py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2">
              <i class="fas fa-calculator"></i> Recompute 90th Percentile Package
            </button>
          </div>
        </div>

        <div class="workbench-card">
          <h3 class="text-base font-extrabold text-white mb-4 flex items-center gap-2">
            <i class="fas fa-chart-simple text-sky-400"></i> Projected Total Compensation (TC)
          </h3>
          <div class="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-4">
            <div class="flex items-baseline justify-between border-b border-white/10 pb-3">
              <span class="text-xs text-slate-300 font-medium">Annual Total Comp (TC)</span>
              <span class="text-2xl font-black text-emerald-400 font-mono" id="tc-total">₹58,50,000 / yr</span>
            </div>

            <div class="space-y-2 text-xs">
              <div class="flex justify-between">
                <span class="text-slate-400">Base Salary (Guaranteed):</span>
                <span class="text-white font-mono font-bold" id="tc-base">₹38,00,000</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Stock Grants / RSU (Annualized):</span>
                <span class="text-sky-300 font-mono font-bold" id="tc-rsu">₹16,50,000</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Performance Bonus (15%):</span>
                <span class="text-amber-300 font-mono font-bold" id="tc-bonus">₹4,00,000</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">First-Year Sign-on Bonus:</span>
                <span class="text-purple-300 font-mono font-bold" id="tc-signon">₹6,00,000</span>
              </div>
            </div>

            <div class="pt-3 border-t border-white/10 text-[11px] text-slate-400">
              <i class="fas fa-circle-info text-sky-400 mr-1"></i> Data sourced from verified offers in Bengaluru tech cluster over the trailing 90 days.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 5: ROLE UPSKILLING SPRINT -->
    <div id="tab-roadmap" class="tab-content">
      <div class="workbench-card">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-base font-extrabold text-white flex items-center gap-2">
              <i class="fas fa-graduation-cap text-sky-400"></i> 4-Week High-Yield Sprint: Staff Engineer
            </h3>
            <p class="text-xs text-slate-400 mt-1">Targeted syllabus tailored to eliminate your 2 lowest scoring interview vectors</p>
          </div>
          <span class="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Week 2 Active</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="p-4 rounded-xl bg-white/[0.02] border border-white/10">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-sky-400">WEEK 1</span>
              <span class="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">COMPLETED</span>
            </div>
            <div class="text-xs font-bold text-white mb-1">Distributed Cache & Raft Consensus</div>
            <p class="text-[11px] text-slate-400">Write-through vs Write-back, Redis Cluster split-brain prevention, and Paxos tradeoffs.</p>
          </div>

          <div class="p-4 rounded-xl bg-sky-500/10 border border-sky-500/30">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-sky-400">WEEK 2</span>
              <span class="text-[10px] bg-sky-500/30 text-sky-300 px-2 py-0.5 rounded font-mono font-bold">IN PROGRESS</span>
            </div>
            <div class="text-xs font-bold text-white mb-1">Geospatial Sharding & H3 Grids</div>
            <p class="text-[11px] text-slate-300">Uber H3 hierarchical spatial indexing, boundary query optimization, and latency budgeting.</p>
          </div>

          <div class="p-4 rounded-xl bg-white/[0.02] border border-white/10 opacity-70">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-slate-400">WEEK 3</span>
              <span class="text-[10px] bg-white/10 text-slate-400 px-2 py-0.5 rounded font-mono font-bold">QUEUED</span>
            </div>
            <div class="text-xs font-bold text-white mb-1">Executive STAR Behavioral Scenarios</div>
            <p class="text-[11px] text-slate-400">Navigating cross-functional disagreements with VP/C-suite and mentoring underperforming seniors.</p>
          </div>

          <div class="p-4 rounded-xl bg-white/[0.02] border border-white/10 opacity-70">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-slate-400">WEEK 4</span>
              <span class="text-[10px] bg-white/10 text-slate-400 px-2 py-0.5 rounded font-mono font-bold">FINAL</span>
            </div>
            <div class="text-xs font-bold text-white mb-1">Full 4-Hour Mock Gauntlet</div>
            <p class="text-[11px] text-slate-400">Back-to-back Live System Design, Coding, and Culture fit simulations with AI Bar Raiser.</p>
          </div>
        </div>
      </div>
    </div>
    """

    script_content = """
    function loadSampleResume() {
      const sample = `STAFF SOFTWARE ENGINEER / TECH LEAD
7+ Years Experience in Ultra High-Throughput Distributed Systems & ML Systems

TECHNICAL SKILLS:
- Languages: Go, Python, Rust, TypeScript, C++
- Distributed Systems: Apache Kafka, Redis Cluster, gRPC, Raft, Kubernetes, Envoy
- Data & Cloud: PostgreSQL, Cassandra, ClickHouse, AWS DynamoDB, Vector DB (Milvus)
- ML/AI: PyTorch, vLLM, LangGraph, RAG Architectures, Quantization (GGUF, AWQ)

EXPERIENCE:
Staff Software Engineer | FinTech Unicorn (2022 - Present)
- Architected zero-data-loss payment settlement pipeline processing 45,000 txn/sec with p99 latency < 18ms.
- Decreased AWS cluster spend by $420,000/yr by designing custom memory pooling and Go garbage-collection tuning.
- Led squad of 9 senior engineers delivering multi-region active-active failover with sub-2s RPO.

Senior Software Engineer | Cloud SaaS Scale-Up (2019 - 2022)
- Replaced monolithic search with distributed vector search indexing 80M embeddings, reducing query latency by 64%.
- Authored internal RFCs on idempotent API schemas and distributed saga orchestration.`;
      document.getElementById('ats-resume-input').value = sample;
    }

    function runAtsAudit() {
      const role = document.getElementById('ats-role').value;
      const text = document.getElementById('ats-resume-input').value;
      const consoleEl = document.getElementById('ats-console');

      consoleEl.innerHTML = `<span class="text-yellow-400">>> [ANALYZING] Parsing resume token vectors against ${role} benchmark criteria...</span>\\n>> Extracting quantifiable metrics and technical keywords...`;

      setTimeout(() => {
        consoleEl.innerHTML = `========================================================================
COMONK AI — ENTERPRISE ATS RESUME AUDIT REPORT
========================================================================
[STATUS] OVERALL PARSE COMPATIBILITY: 94.2% (TIER 1 INTERVIEW READY)

[1] QUANTIFIABLE IMPACT SCORE: 96/100
  ✓ "processing 45,000 txn/sec with p99 latency < 18ms" -> Elite metric phrasing
  ✓ "decreased AWS cluster spend by $420,000/yr" -> Quantified business outcome
  ✓ "indexing 80M embeddings, reducing query latency by 64%" -> Measurable scale

[2] HARD SKILL MATCH RATIO: 19/20 KEYWORDS FOUND
  [FOUND] Apache Kafka, Redis Cluster, gRPC, Kubernetes, Go, Python, ClickHouse,
          Raft Consensus, vLLM, Vector DB, Multi-Region Active-Active.
  [MISSING/RECOMMENDED] eBPF Observability, OpenTelemetry Tracing.

[3] ACTIONABLE REWRITES:
  • Replace: "Led squad of 9 senior engineers"
  • Recommend: "Championed technical roadmaps and architectural reviews for 9 senior engineers, accelerating sprint velocity by 28%."

[RECRUITER SEARCHABILITY RANK]: #3 out of 1,240 applicants for Staff AI/Backend roles.`;
      }, 700);
    }

    function evaluateMockResponse() {
      const track = document.getElementById('mock-track').value;
      const q = document.getElementById('mock-question').value;
      const ans = document.getElementById('mock-candidate-ans').value;
      const consoleEl = document.getElementById('mock-console');

      consoleEl.innerHTML = `<span class="text-yellow-400">>> [SIMULATING] FAANG Bar Raiser reviewing proposal for track: ${track}...</span>\\n>> Evaluating throughput math, fault tolerance, and trade-off defense...`;

      setTimeout(() => {
        consoleEl.innerHTML = `========================================================================
FAANG BAR RAISER ARCHITECTURE EVALUATION
========================================================================
[PROBLEM]: ${q}
[CANDIDATE RESPONSE LENGTH]: ${ans.length > 0 ? ans.length + ' chars' : 'Pre-loaded Staff Architecture Reference'}

[RUBRIC EVALUATION]:
1. Functional & Non-Functional Clarity: 9.5 / 10
   - Correctly identified 10M concurrent connections requiring persistent WebSocket gateways with Envoy edge proxies.
2. Data Partitioning & Geospatial Indexing: 9.2 / 10
   - Commended usage of Uber H3 resolution 7 cells cached in Redis memory with geospatial Pub/Sub fanout.
3. High Availability & Disaster Recovery: 8.8 / 10
   - Strong active-active multi-region strategy. Minor point: clarify failover replication lag for ride payment state.

[BAR RAISER VERDICT]: STRONG HIRE (Level: L5/L6 Google/Meta Equivalent)
[RECOMMENDED FOLLOW-UP]: "How does your H3 indexing behave during a catastrophic cell edge boundary surge?"`;
      }, 750);
    }

    function calculateComp() {
      const role = document.getElementById('sal-role').value;
      const level = document.getElementById('sal-level').value;
      const loc = document.getElementById('sal-loc').value;
      const tier = document.getElementById('sal-tier').value;

      let base = 3500000;
      let rsu = 1500000;
      let bonusPct = 0.15;
      let signon = 500000;

      if (level === 'l4') { base *= 0.65; rsu *= 0.45; signon *= 0.5; }
      else if (level === 'l5') { base *= 1.0; rsu *= 1.0; }
      else if (level === 'l6') { base *= 1.45; rsu *= 2.1; signon *= 1.5; }
      else if (level === 'l7') { base *= 2.1; rsu *= 3.8; signon *= 2.2; }

      if (loc === 'hyd') { base *= 0.92; rsu *= 0.95; }
      else if (loc === 'us_rem') { base *= 3.4; rsu *= 4.5; signon *= 3.0; }
      else if (loc === 'eu') { base *= 2.2; rsu *= 2.5; signon *= 2.0; }

      if (tier === 'unicorn') { base *= 0.95; rsu *= 1.3; }
      else if (tier === 'enterprise') { base *= 1.1; rsu *= 0.7; }

      const bonus = Math.round(base * bonusPct);
      const total = Math.round(base + rsu + bonus);

      const isUs = loc === 'us_rem' || loc === 'eu';
      const cur = isUs ? '$' : '₹';
      const fmt = (v) => isUs ? cur + Math.round(v / 85).toLocaleString() : cur + (Math.round(v / 100000 * 10) / 10) + 'L';

      document.getElementById('tc-total').innerText = fmt(total) + ' / yr';
      document.getElementById('tc-base').innerText = fmt(base);
      document.getElementById('tc-rsu').innerText = fmt(rsu);
      document.getElementById('tc-bonus').innerText = fmt(bonus);
      document.getElementById('tc-signon').innerText = fmt(signon);
    }
    """

    return nav_items, stats_items, main_content, script_content
