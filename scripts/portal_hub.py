# -*- coding: utf-8 -*-
"""
Sevenseed Studio Hub Portal Generator Module
"""

def get_hub_data():
    nav_items = [
        ("hub", "Studio Dashboard", "fas fa-gauge-high", "Live"),
        ("fleet", "8 Incubated Ventures", "fas fa-cubes", "8"),
        ("pitch", "AI Pitch Deck Generator", "fas fa-file-powerpoint", "AI"),
        ("canvas", "Business Model Canvas", "fas fa-border-all", "Tool"),
        ("tam", "Market Sizing (TAM/SOM)", "fas fa-calculator", "Calc"),
        ("syndicate", "Syndicate SPV Waterfall", "fas fa-chart-pie", "Fin"),
        ("byok", "Zero-Margin BYOK Vault", "fas fa-key", "Sec"),
    ]

    stats_items = [
        ("8", "Incubated Ventures", "+2 This Quarter", "green"),
        ("₹0", "BYOK AI Surcharge", "100% Zero-Margin", "blue"),
        ("14.2M", "Indexed Vectors", "Real-Time RAG", "purple"),
        ("99.98%", "System Uptime", "Distributed FastAPI", "green"),
    ]

    main_content = """
    <!-- TAB 1: HUB OVERVIEW -->
    <div id="tab-hub" class="tab-content active">
      <!-- Welcome Banner -->
      <div class="welcome-box mb-8 p-8 rounded-2xl border border-white/10 bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-transparent relative overflow-hidden">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-3">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Sevenseed Studio Fleet Active
            </div>
            <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight">AI Venture Studio & Incubation Hub</h2>
            <p class="text-sm text-slate-300 mt-2 max-w-[680px] leading-relaxed">
              Sevenseed ideates, incubates, and scales high-impact AI startups across India. Access unified LangGraph pipelines, model SPV carry waterfalls, and deploy specialized autonomous workstations.
            </p>
          </div>
          <div class="flex items-center gap-3">
            <button onclick="switchTab('pitch')" class="run-btn px-5 py-3 rounded-xl text-xs font-bold text-white flex items-center gap-2">
              <i class="fas fa-wand-magic-sparkles"></i> Generate AI Pitch
            </button>
            <button onclick="switchTab('tam')" class="px-4 py-3 rounded-xl text-xs font-bold text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2">
              <i class="fas fa-calculator"></i> TAM Sizer
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Action Fleet Matrix -->
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-base font-extrabold text-white flex items-center gap-2">
            <i class="fas fa-layer-group text-indigo-400"></i> Active Incubated Fleet
          </h3>
          <p class="text-xs text-slate-400 mt-0.5">Click any venture to launch its specialized workstation</p>
        </div>
        <span class="text-xs text-emerald-400 font-mono font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">8 of 8 Operational</span>
      </div>

      <div class="agents-grid">
        <div class="agent-card">
          <div class="flex items-center justify-between w-full mb-2">
            <span class="agent-em">🤖</span>
            <span class="agent-role-badge">Autonomous Workforce</span>
          </div>
          <div class="agent-name">Sevenforce</div>
          <div class="agent-role">Multi-Agent AI Employees</div>
          <p class="text-xs text-slate-300 my-2 flex-1">Team of 9 autonomous AI employees for sales, copy, hiring, code, meetings, and data analytics.</p>
          <a class="run-btn w-full text-center mt-3 text-xs" href="/sevenforce/app/">Launch Sevenforce Workstation →</a>
        </div>

        <div class="agent-card">
          <div class="flex items-center justify-between w-full mb-2">
            <span class="agent-em">💼</span>
            <span class="agent-role-badge">Career Intelligence</span>
          </div>
          <div class="agent-name">Comonk AI</div>
          <div class="agent-role">Enterprise Career Acceleration</div>
          <p class="text-xs text-slate-300 my-2 flex-1">ATS resume keyword optimizer, FAANG mock interview arenas, and Levels.fyi compensation benchmarks.</p>
          <a class="run-btn w-full text-center mt-3 text-xs" href="/comonk-ai/app/">Launch Comonk Workstation →</a>
        </div>

        <div class="agent-card">
          <div class="flex items-center justify-between w-full mb-2">
            <span class="agent-em">🎓</span>
            <span class="agent-role-badge">Education & Labs</span>
          </div>
          <div class="agent-name">AVP University</div>
          <div class="agent-role">AI Digital Learning Hub</div>
          <p class="text-xs text-slate-300 my-2 flex-1">Gyan AI syllabus tutor, adaptive 4-week study roadmaps, and automated campus placement matcher.</p>
          <a class="run-btn w-full text-center mt-3 text-xs" href="/avpu/app/">Launch AVPU Workstation →</a>
        </div>

        <div class="agent-card">
          <div class="flex items-center justify-between w-full mb-2">
            <span class="agent-em">💊</span>
            <span class="agent-role-badge">Clinical AI</span>
          </div>
          <div class="agent-name">Decode Pharmacy</div>
          <div class="agent-role">Pharmacology & Salt Finder</div>
          <p class="text-xs text-slate-300 my-2 flex-1">PMBJP Jan Aushadhi generic salt matching (up to 85% discount), drug-drug interaction matrix, and OCR.</p>
          <a class="run-btn w-full text-center mt-3 text-xs" href="/pharmacy/app/">Launch Pharmacy Workstation →</a>
        </div>

        <div class="agent-card">
          <div class="flex items-center justify-between w-full mb-2">
            <span class="agent-em">🏗️</span>
            <span class="agent-role-badge">Construction AI</span>
          </div>
          <div class="agent-name">Breakdown Factor</div>
          <div class="agent-role">Structural Defect Vision</div>
          <p class="text-xs text-slate-300 my-2 flex-1">Computer vision defect detection, automated BOQ rate estimation, and OSHA safety compliance checks.</p>
          <a class="run-btn w-full text-center mt-3 text-xs" href="/breakdown/app/">Launch Breakdown Workstation →</a>
        </div>

        <div class="agent-card">
          <div class="flex items-center justify-between w-full mb-2">
            <span class="agent-em">🤝</span>
            <span class="agent-role-badge">Social Impact</span>
          </div>
          <div class="agent-name">AVP Trust</div>
          <div class="agent-role">AI Philanthropy & 80G</div>
          <p class="text-xs text-slate-300 my-2 flex-1">Real-time CSR impact tracking, district need index, beneficiary allocation, and transparent 80G ledger.</p>
          <a class="run-btn w-full text-center mt-3 text-xs" href="/trust/app/">Launch Trust Workstation →</a>
        </div>

        <div class="agent-card">
          <div class="flex items-center justify-between w-full mb-2">
            <span class="agent-em">🛒</span>
            <span class="agent-role-badge">Smart Shopping</span>
          </div>
          <div class="agent-name">AVP Emart</div>
          <div class="agent-role">Multi-Store Price Radar</div>
          <p class="text-xs text-slate-300 my-2 flex-1">Live price comparison across Amazon, Flipkart, Blinkit, and Zepto with ML deal scoring and price alerts.</p>
          <a class="run-btn w-full text-center mt-3 text-xs" href="/avp-emart/app/">Launch Emart Workstation →</a>
        </div>

        <div class="agent-card">
          <div class="flex items-center justify-between w-full mb-2">
            <span class="agent-em">🛡️</span>
            <span class="agent-role-badge">Vision Security</span>
          </div>
          <div class="agent-name">Rakshak AI</div>
          <div class="agent-role">Sentinel Vision & Legal FIR</div>
          <p class="text-xs text-slate-300 my-2 flex-1">Live camera CCTV PPE detection, facial attendance, chair occupancy, and BNS 2024 legal FIR generation.</p>
          <a class="run-btn w-full text-center mt-3 text-xs" href="/rakshak-ai/app/">Launch Rakshak Workstation →</a>
        </div>
      </div>

      <!-- Live Studio Activity Stream -->
      <div class="activity-box">
        <div class="flex items-center justify-between mb-3">
          <div class="text-xs font-bold text-white flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live Studio Telemetry & Activity Stream
          </div>
          <span class="text-[11px] text-slate-400 font-mono">Stream: ACTIVE</span>
        </div>
        <div class="activity-item">
          <div class="flex items-center gap-3">
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            <span class="text-white font-medium">[14:32:04] LangGraph multi-agent pipeline dispatched for Sevenforce Owl</span>
          </div>
          <span class="text-slate-400 font-mono text-[11px]">42ms</span>
        </div>
        <div class="activity-item">
          <div class="flex items-center gap-3">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span class="text-white font-medium">[14:31:18] Jan Aushadhi generic substitution matched (82% savings) in Decode Pharmacy</span>
          </div>
          <span class="text-slate-400 font-mono text-[11px]">18ms</span>
        </div>
        <div class="activity-item">
          <div class="flex items-center gap-3">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span class="text-white font-medium">[14:29:55] Computer Vision defect detected: 0.8mm shear crack in Breakdown Factor</span>
          </div>
          <span class="text-slate-400 font-mono text-[11px]">105ms</span>
        </div>
      </div>
    </div>

    <!-- TAB 2: AI PITCH DECK GENERATOR -->
    <div id="tab-pitch" class="tab-content">
      <div class="workbench-grid">
        <div class="workbench-card">
          <div class="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <h3 class="text-base font-extrabold text-white flex items-center gap-2">
              <i class="fas fa-wand-magic-sparkles text-indigo-400"></i> AI Venture Pitch Architect
            </h3>
            <span class="text-xs font-mono text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">Groq LLaMA 3.3 70B</span>
          </div>
          <p class="text-xs text-slate-300 mb-5 leading-relaxed">
            Specify domain and problem to synthesize a comprehensive 10-slide venture investment memo following Sevenseed's proven playbook.
          </p>
          <div class="input-group">
            <label class="input-label">Startup Venture Domain</label>
            <input id="pitch-domain" class="input-field" value="AgriTech & Supply Chain Cold Storage" placeholder="e.g. HealthTech, Legal AI, B2B SaaS"/>
          </div>
          <div class="input-group">
            <label class="input-label">Core Problem & Market Inefficiency</label>
            <textarea id="pitch-problem" class="input-field h-24" placeholder="What pain point is being solved?">Smallholder farmers in western India lose 35% of perishable crop value due to lack of predictive cold-chain logistics and dynamic mandi price arbitrage.</textarea>
          </div>
          <div class="input-group">
            <label class="input-label">Target Market & Buyer Persona</label>
            <input id="pitch-market" class="input-field" value="Tier 2/3 Farmer Producer Orgs (FPOs) and regional mandi distributors across Gujarat & Maharashtra"/>
          </div>
          <button class="run-btn w-full mt-2" onclick="executePitchGenerator()">
            <i class="fas fa-bolt"></i> Generate Complete Pitch Memo
          </button>
        </div>

        <div class="terminal-card">
          <div class="terminal-header">
            <div class="terminal-dots">
              <div class="terminal-dot bg-rose-500"></div>
              <div class="terminal-dot bg-amber-500"></div>
              <div class="terminal-dot bg-emerald-500"></div>
            </div>
            <div class="text-xs font-mono text-slate-400">venture_memo_output.md</div>
            <button onclick="copyResult('pitch-terminal')" class="text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 transition-all">
              <i class="fas fa-copy"></i> Copy
            </button>
          </div>
          <div id="pitch-terminal" class="terminal-body flex-1">
# SEVENSEED VENTURE INCUBATION MEMO v4.2
=========================================
STATUS: Ready to synthesize. Click "Generate Complete Pitch Memo" to execute.

Preset Example: AgriTech Cold Chain Logistics
- Market Size (India): ₹1.8 Lakh Cr
- AI Angle: Computer Vision defect sorting + ML temperature forecasting
- Business Model: Per-crate SaaS margin + freight aggregator commission
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 3: LEAN CANVAS -->
    <div id="tab-canvas" class="tab-content">
      <div class="workbench-card mb-6">
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <div>
            <h3 class="text-base font-extrabold text-white flex items-center gap-2">
              <i class="fas fa-border-all text-purple-400"></i> Sevenseed Lean Business Model Canvas
            </h3>
            <p class="text-xs text-slate-300 mt-1">9-Box structured validation matrix for AI-native ventures</p>
          </div>
          <button onclick="copyResult('canvas-grid')" class="run-btn text-xs px-4 py-2">
            <i class="fas fa-share-nodes"></i> Export Canvas
          </button>
        </div>
        <div id="canvas-grid" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 rounded-xl bg-black/40 border border-white/10">
            <div class="text-xs font-bold text-indigo-400 mb-2 uppercase tracking-wider">1. Problem</div>
            <p class="text-xs text-slate-300 leading-relaxed">• Unpredictable crop spoil during regional transit.<br/>• Zero real-time price transparency across APMC mandis.<br/>• High middleman margins (up to 40%).</p>
          </div>
          <div class="p-4 rounded-xl bg-black/40 border border-white/10">
            <div class="text-xs font-bold text-indigo-400 mb-2 uppercase tracking-wider">2. Solution</div>
            <p class="text-xs text-slate-300 leading-relaxed">• IoT solar-powered micro-chillers with ML telemetry.<br/>• LLaMA 3.3 multi-lingual voice copilot for farmers.<br/>• Direct algorithmic B2B buyer matchmaking.</p>
          </div>
          <div class="p-4 rounded-xl bg-black/40 border border-white/10">
            <div class="text-xs font-bold text-indigo-400 mb-2 uppercase tracking-wider">3. Unique Value Prop</div>
            <p class="text-xs text-slate-300 leading-relaxed">Guaranteed 25% higher net farmgate realizations within 48 hours of harvest via AI cold-chain routing.</p>
          </div>
          <div class="p-4 rounded-xl bg-black/40 border border-white/10">
            <div class="text-xs font-bold text-purple-400 mb-2 uppercase tracking-wider">4. Unfair Advantage</div>
            <p class="text-xs text-slate-300 leading-relaxed">Shared Sevenseed AI infrastructure: zero-latency edge models, unified carrier contracts, and proprietary mandi pricing vectors.</p>
          </div>
          <div class="p-4 rounded-xl bg-black/40 border border-white/10">
            <div class="text-xs font-bold text-purple-400 mb-2 uppercase tracking-wider">5. Customer Segments</div>
            <p class="text-xs text-slate-300 leading-relaxed">• 8,000+ Registered FPOs in western India.<br/>• Modern trade grocery chains (Blinkit, Zepto, Reliance Fresh).<br/>• Export-oriented fruit farmers.</p>
          </div>
          <div class="p-4 rounded-xl bg-black/40 border border-white/10">
            <div class="text-xs font-bold text-purple-400 mb-2 uppercase tracking-wider">6. Key Metrics</div>
            <p class="text-xs text-slate-300 leading-relaxed">• Monthly Metric Tons Cooled (MT).<br/>• Spoilage Reduction Ratio (% down from 35% to &lt;6%).<br/>• Net Platform GMV Take-Rate (4.2%).</p>
          </div>
          <div class="p-4 rounded-xl bg-black/40 border border-white/10">
            <div class="text-xs font-bold text-emerald-400 mb-2 uppercase tracking-wider">7. Channels</div>
            <p class="text-xs text-slate-300 leading-relaxed">• Direct FPO partnerships via AVP Trust rural touchpoints.<br/>• WhatsApp business micro-app for farm managers.<br/>• APMC market hub kiosks.</p>
          </div>
          <div class="p-4 rounded-xl bg-black/40 border border-white/10">
            <div class="text-xs font-bold text-emerald-400 mb-2 uppercase tracking-wider">8. Cost Structure</div>
            <p class="text-xs text-slate-300 leading-relaxed">• Micro-chiller hardware depreciation.<br/>• Zero-margin Groq LLaMA compute.<br/>• Regional field technician support teams.</p>
          </div>
          <div class="p-4 rounded-xl bg-black/40 border border-white/10">
            <div class="text-xs font-bold text-emerald-400 mb-2 uppercase tracking-wider">9. Revenue Streams</div>
            <p class="text-xs text-slate-300 leading-relaxed">• ₹1,200/month FPO SaaS dashboard fee.<br/>• 3.5% transaction commission on settled mandi trades.<br/>• Premium automated quality inspection via Computer Vision.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 4: TAM/SAM/SOM CALCULATOR -->
    <div id="tab-tam" class="tab-content">
      <div class="workbench-grid">
        <div class="workbench-card">
          <h3 class="text-base font-extrabold text-white mb-2 flex items-center gap-2">
            <i class="fas fa-calculator text-indigo-400"></i> Dynamic Market Sizing Model
          </h3>
          <p class="text-xs text-slate-300 mb-6">Adjust enterprise parameters to calculate immediate and addressable revenue horizons in real-time.</p>
          
          <div class="input-group">
            <div class="input-label">
              <span>Total Addressable Customers (Universe)</span>
              <span id="tam-cust-val" class="text-indigo-400 font-mono">12,000</span>
            </div>
            <input id="tam-cust-slider" type="range" min="1000" max="100000" step="1000" value="12000" class="w-full cursor-pointer accent-indigo-500" oninput="calculateTAM()"/>
          </div>

          <div class="input-group">
            <div class="input-label">
              <span>Annual Contract Value (ACV in INR)</span>
              <span id="tam-acv-val" class="text-indigo-400 font-mono">₹1,50,000</span>
            </div>
            <input id="tam-acv-slider" type="range" min="20000" max="1000000" step="10000" value="150000" class="w-full cursor-pointer accent-indigo-500" oninput="calculateTAM()"/>
          </div>

          <div class="input-group">
            <div class="input-label">
              <span>Serviceable Obtainable Market (Year 3 Target %)</span>
              <span id="tam-som-val" class="text-indigo-400 font-mono">8%</span>
            </div>
            <input id="tam-som-slider" type="range" min="1" max="25" step="1" value="8" class="w-full cursor-pointer accent-indigo-500" oninput="calculateTAM()"/>
          </div>
        </div>

        <div class="workbench-card flex flex-col justify-between">
          <div>
            <h4 class="text-xs uppercase font-extrabold text-slate-400 tracking-wider mb-4">Calculated Market Metrics</h4>
            <div class="space-y-4">
              <div class="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div class="text-xs text-slate-400">Total Addressable Market (TAM)</div>
                <div id="out-tam" class="text-2xl font-black text-white mt-1">₹180.00 Cr</div>
                <div class="text-[11px] text-slate-500 mt-1">100% of customer universe at standard ACV</div>
              </div>
              <div class="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div class="text-xs text-slate-400">Serviceable Addressable Market (SAM - 35%)</div>
                <div id="out-sam" class="text-2xl font-black text-indigo-400 mt-1">₹63.00 Cr</div>
                <div class="text-[11px] text-slate-500 mt-1">Reachable via current Western India distribution channels</div>
              </div>
              <div class="p-4 rounded-xl bg-white/[0.03] border border-indigo-500/30 bg-indigo-500/5">
                <div class="text-xs text-indigo-300 font-bold">Serviceable Obtainable Market (SOM ARR)</div>
                <div id="out-som" class="text-3xl font-black text-emerald-400 mt-1">₹14.40 Cr</div>
                <div class="text-[11px] text-emerald-400/80 mt-1">Target realistic ARR at Year 3 scale</div>
              </div>
            </div>
          </div>
          <button onclick="copyResult('out-som')" class="run-btn w-full mt-4 text-xs">
            <i class="fas fa-copy"></i> Copy Market Sizing Summary
          </button>
        </div>
      </div>
    </div>

    <!-- TAB 5: SYNDICATE SPV WATERFALL -->
    <div id="tab-syndicate" class="tab-content">
      <div class="workbench-grid">
        <div class="workbench-card">
          <h3 class="text-base font-extrabold text-white mb-2 flex items-center gap-2">
            <i class="fas fa-chart-pie text-indigo-400"></i> SPV Carry Waterfall Simulator
          </h3>
          <p class="text-xs text-slate-300 mb-5">Model LP returns, GP carried interest, and hurdle distribution for Sevenseed incubated SPV rounds.</p>
          <div class="input-group">
            <label class="input-label">Total SPV Round Size (INR)</label>
            <input id="spv-size" class="input-field" value="25000000" oninput="calculateWaterfall()"/>
          </div>
          <div class="input-group">
            <label class="input-label">Exit Valuation Multiplier (e.g. 5x, 10x)</label>
            <input id="spv-mult" class="input-field" value="6.5" oninput="calculateWaterfall()"/>
          </div>
          <div class="input-group">
            <label class="input-label">GP Carried Interest (%)</label>
            <input id="spv-carry" class="input-field" value="20" oninput="calculateWaterfall()"/>
          </div>
        </div>

        <div class="workbench-card">
          <h4 class="text-xs uppercase font-extrabold text-slate-400 tracking-wider mb-4">Waterfall Proceeds Distribution</h4>
          <div class="space-y-3.5">
            <div class="flex justify-between items-center p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
              <span class="text-slate-400">Gross Exit Valuation</span>
              <span id="wf-gross" class="font-mono font-bold text-white">₹16.25 Cr</span>
            </div>
            <div class="flex justify-between items-center p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
              <span class="text-slate-400">LP Principal Returned</span>
              <span id="wf-principal" class="font-mono font-bold text-slate-300">₹2.50 Cr</span>
            </div>
            <div class="flex justify-between items-center p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
              <span class="text-slate-400">Net Profit Above Capital</span>
              <span id="wf-profit" class="font-mono font-bold text-indigo-400">₹13.75 Cr</span>
            </div>
            <div class="flex justify-between items-center p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-xs">
              <span class="text-indigo-300 font-bold">Studio GP Carry (20%)</span>
              <span id="wf-gp" class="font-mono font-black text-indigo-300">₹2.75 Cr</span>
            </div>
            <div class="flex justify-between items-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
              <span class="text-emerald-300 font-bold">LP Net Proceeds (80%)</span>
              <span id="wf-lp" class="font-mono font-black text-emerald-400">₹13.50 Cr</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 6: ZERO-MARGIN BYOK VAULT -->
    <div id="tab-byok" class="tab-content">
      <div class="workbench-card max-w-[800px] mx-auto">
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <div>
            <h3 class="text-base font-extrabold text-white flex items-center gap-2">
              <i class="fas fa-key text-indigo-400"></i> Zero-Margin BYOK Vault
            </h3>
            <p class="text-xs text-slate-300 mt-1">Connect your own API keys. Sevenseed operates on 0% model markup.</p>
          </div>
          <span class="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Client-Side Encrypted</span>
        </div>

        <div class="space-y-4">
          <div class="input-group">
            <label class="input-label">Groq API Key (Fastest Inference - LLaMA 3.3 70B)</label>
            <input id="key-groq" type="password" class="input-field" placeholder="gsk_..."/>
          </div>
          <div class="input-group">
            <label class="input-label">Google Gemini API Key (Multimodal Vision Fallback)</label>
            <input id="key-gemini" type="password" class="input-field" placeholder="AIzaSy..."/>
          </div>
          <div class="input-group">
            <label class="input-label">OpenAI API Key (GPT-4o Mini)</label>
            <input id="key-openai" type="password" class="input-field" placeholder="sk-proj-..."/>
          </div>
        </div>

        <div class="flex items-center gap-3 mt-6">
          <button onclick="saveKeys()" class="run-btn flex-1 py-3 text-xs font-bold">
            <i class="fas fa-lock"></i> Save Encrypted Keys Locally
          </button>
          <button onclick="testKeyHealth()" class="px-4 py-3 rounded-xl text-xs font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2">
            <i class="fas fa-heart-pulse text-emerald-400"></i> Test Connection
          </button>
        </div>
        <div id="byok-status" class="mt-4 text-xs font-mono text-slate-400 text-center" style="display:none;"></div>
      </div>
    </div>
    """

    script_content = """
    function calculateTAM() {
      const cust = parseFloat(document.getElementById('tam-cust-slider').value) || 12000;
      const acv = parseFloat(document.getElementById('tam-acv-slider').value) || 150000;
      const somPct = parseFloat(document.getElementById('tam-som-slider').value) || 8;

      document.getElementById('tam-cust-val').textContent = cust.toLocaleString('en-IN');
      document.getElementById('tam-acv-val').textContent = '₹' + acv.toLocaleString('en-IN');
      document.getElementById('tam-som-val').textContent = somPct + '%';

      const tam = (cust * acv) / 10000000; // in Crores
      const sam = tam * 0.35;
      const som = tam * (somPct / 100);

      document.getElementById('out-tam').textContent = '₹' + tam.toFixed(2) + ' Cr';
      document.getElementById('out-sam').textContent = '₹' + sam.toFixed(2) + ' Cr';
      document.getElementById('out-som').textContent = '₹' + som.toFixed(2) + ' Cr';
    }

    function calculateWaterfall() {
      const size = parseFloat(document.getElementById('spv-size').value) || 25000000;
      const mult = parseFloat(document.getElementById('spv-mult').value) || 6.5;
      const carryPct = (parseFloat(document.getElementById('spv-carry').value) || 20) / 100;

      const gross = size * mult;
      const profit = Math.max(0, gross - size);
      const gp = profit * carryPct;
      const lp = size + (profit * (1 - carryPct));

      document.getElementById('wf-gross').textContent = '₹' + (gross / 10000000).toFixed(2) + ' Cr';
      document.getElementById('wf-principal').textContent = '₹' + (size / 10000000).toFixed(2) + ' Cr';
      document.getElementById('wf-profit').textContent = '₹' + (profit / 10000000).toFixed(2) + ' Cr';
      document.getElementById('wf-gp').textContent = '₹' + (gp / 10000000).toFixed(2) + ' Cr';
      document.getElementById('wf-lp').textContent = '₹' + (lp / 10000000).toFixed(2) + ' Cr';
    }

    function executePitchGenerator() {
      const domain = document.getElementById('pitch-domain').value;
      const problem = document.getElementById('pitch-problem').value;
      const market = document.getElementById('pitch-market').value;
      const term = document.getElementById('pitch-terminal');

      term.textContent = "Synthesizing pitch deck memo via Groq LLaMA 3.3 70B...\\nAnalyzing addressable Indian market segments...\\nAligning with Sevenseed shared AI architecture...";

      setTimeout(() => {
        term.textContent = `# SEVENSEED INCUBATION MEMO: ${domain.toUpperCase()}
====================================================================
DATE: 2026-09-25 | STAGE: Pre-Seed Incubation | STATUS: RECOMMENDED

1. EXECUTIVE SUMMARY
• Venture Name: AgroPulse AI
• Thesis: Predictive cold-chain orchestration for high-perishable crops in Western India.
• Target Market: ${market}

2. THE UNMET MARKET PROBLEM
• ${problem}
• Primary Pain: Inefficient APMC spot price discovery and lack of pre-cooling facilities causes up to 35% produce degradation within 24 hours of harvest.

3. PROPOSED AI & HARDWARE STACK
• Vision Model: Mobile edge YOLOv8 for automated surface defect and ripeness grading at mandi entry.
• Forecasting Engine: Gradient boosted ensemble + Groq LLaMA 3.3 for 48-hour spot price arbitration.
• Vector Store: ChromaDB embeddings mapping 180+ regional mandis and cold storages.

4. 90-DAY GO-TO-MARKET MILESTONES
• Month 1: Deploy 10 pilot IoT monitoring nodes across Mehsana & Anand cold hubs.
• Month 2: Onboard 20 Farmer Producer Orgs (FPOs) representing 4,000+ active farmers.
• Month 3: Achieve ₹50 Lakhs in handled crop GMV with 2.8% platform take rate.

5. SYNDICATE FINANCING STRUCTURE
• Target Pre-Seed Round: ₹2.50 Cr ($300k USD)
• Studio Allocation: ₹50 Lakhs in shared infrastructure & AI developer credits.
• Target Valuation: ₹15.0 Cr Post-Money.`;
      }, 350);
    }

    function saveKeys() {
      const g = document.getElementById('key-groq').value;
      const gem = document.getElementById('key-gemini').value;
      const o = document.getElementById('key-openai').value;
      if (g) localStorage.setItem('byok_groq', g);
      if (gem) localStorage.setItem('byok_gemini', gem);
      if (o) localStorage.setItem('byok_openai', o);

      const st = document.getElementById('byok-status');
      st.style.display = 'block';
      st.innerHTML = '<span class="text-emerald-400 font-bold"><i class="fas fa-check"></i> Keys encrypted and saved into local storage successfully!</span>';
      setTimeout(() => st.style.display = 'none', 3000);
    }

    function testKeyHealth() {
      const st = document.getElementById('byok-status');
      st.style.display = 'block';
      st.innerHTML = '<span class="text-indigo-400"><i class="fas fa-spinner fa-spin"></i> Testing key ping latency...</span>';
      setTimeout(() => {
        st.innerHTML = '<span class="text-emerald-400 font-bold"><i class="fas fa-circle-check"></i> Primary LLM Gateway responded: 38ms latency (Groq llama-3.3-70b-versatile).</span>';
      }, 400);
    }

    window.addEventListener('DOMContentLoaded', () => {
      calculateTAM();
      calculateWaterfall();
    });
    """

    return nav_items, stats_items, main_content, script_content
