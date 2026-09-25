# -*- coding: utf-8 -*-
"""
Breakdown Factor Portal Generator Module - AI Construction Vision & BOQ Costing
"""

def get_breakdown_data():
    nav_items = [
        ("safety", "Site Safety Radar", "fas fa-helmet-safety", "98.4%"),
        ("defect", "CV Crack & Defect Scanner", "fas fa-camera", "CV"),
        ("boq", "Automated BOQ Cost Estimator", "fas fa-calculator", "CPWD"),
        ("delays", "Critical Path Delay Risk", "fas fa-chart-gantt", "Gantt"),
        ("drones", "Drone Volumetric Survey", "fas fa-helicopter", "3D"),
    ]

    stats_items = [
        ("98.4%", "PPE Safety Compliance", "Zero OSHA Violations", "green"),
        ("142 Days", "Zero Lost Time Incidents", "Tower B & C Phase", "blue"),
        ("₹18.4 Cr", "Managed BOQ Inventory", "Real-Time CPWD Rates", "purple"),
        ("0.35 mm", "Min Crack Resolution", "YOLOv10 Defect Engine", "green"),
    ]

    main_content = """
    <!-- TAB 1: SITE SAFETY RADAR -->
    <div id="tab-safety" class="tab-content active">
      <div class="welcome-box mb-8 p-8 rounded-2xl border border-white/10 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent relative overflow-hidden">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold mb-3">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Site Vision Surveillance Mesh Online — Project Apex Tower
            </div>
            <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight">AI Construction Vision & Safety Cockpit</h2>
            <p class="text-sm text-slate-300 mt-2 max-w-[680px] leading-relaxed">
              Autonomous computer vision monitoring 14 high-definition site camera feeds. Real-time PPE hardhat enforcement, structural shear crack detection, automated CPWD BOQ schedule generation, and weather-adjusted project delay projections.
            </p>
          </div>
          <div class="flex items-center gap-3">
            <button onclick="switchTab('defect')" class="run-btn px-5 py-3 rounded-xl text-xs font-bold text-white flex items-center gap-2">
              <i class="fas fa-camera"></i> Run CV Crack Scan
            </button>
            <button onclick="switchTab('boq')" class="px-4 py-3 rounded-xl text-xs font-bold text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2">
              <i class="fas fa-calculator"></i> BOQ Calculator
            </button>
          </div>
        </div>
      </div>

      <!-- Safety Camera Feeds & Violations -->
      <div class="workbench-grid">
        <div class="workbench-card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-extrabold text-white flex items-center gap-2">
              <i class="fas fa-video text-amber-400"></i> Active Site Surveillance Feeds
            </h3>
            <span class="text-xs text-emerald-400 font-mono font-bold">14 Feeds Live</span>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="p-3 rounded-xl bg-black/50 border border-white/10 relative overflow-hidden">
              <div class="aspect-video bg-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                <i class="fas fa-building text-3xl text-slate-700"></i>
                <div class="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-red-600/80 text-[10px] font-mono text-white flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> REC
                </div>
                <div class="absolute bottom-2 left-2 text-[10px] text-white/80 font-mono bg-black/60 px-1 rounded">CAM-01: Tower A Scaffolding</div>
              </div>
              <div class="mt-2 flex justify-between items-center text-[11px]">
                <span class="text-emerald-400">✓ 100% Hardhat & Vest Compliant</span>
                <span class="text-slate-400 font-mono">30 FPS</span>
              </div>
            </div>

            <div class="p-3 rounded-xl bg-black/50 border border-white/10 relative overflow-hidden">
              <div class="aspect-video bg-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                <i class="fas fa-truck text-3xl text-slate-700"></i>
                <div class="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-red-600/80 text-[10px] font-mono text-white flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> REC
                </div>
                <div class="absolute bottom-2 left-2 text-[10px] text-white/80 font-mono bg-black/60 px-1 rounded">CAM-04: Concrete Batching Plant</div>
              </div>
              <div class="mt-2 flex justify-between items-center text-[11px]">
                <span class="text-emerald-400">✓ Slump Test Sensor Active</span>
                <span class="text-slate-400 font-mono">30 FPS</span>
              </div>
            </div>
          </div>

          <div class="mt-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
            <span class="text-slate-300">Total Workers On Site: <strong class="text-white">184 Personnel</strong></span>
            <span class="text-emerald-400 font-bold">OSHA Class-A Certified</span>
          </div>
        </div>

        <div class="workbench-card">
          <h3 class="text-base font-extrabold text-white mb-4 flex items-center gap-2">
            <i class="fas fa-triangle-exclamation text-amber-400"></i> Environmental & Hazard Sensors
          </h3>
          <div class="space-y-3">
            <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div>
                <div class="text-xs font-bold text-white">Dust Pollution (PM 2.5 / PM 10)</div>
                <div class="text-[11px] text-slate-400">Mist Sprinkler Anti-Smog Gun: Activated</div>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-mono font-bold">42 µg/m³ (Safe)</span>
            </div>

            <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div>
                <div class="text-xs font-bold text-white">Crane Radius Proximity Warning</div>
                <div class="text-[11px] text-slate-400">Tower Crane #2 Load: 4.8T (Under 10T Limit)</div>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-mono font-bold">Clear Zone</span>
            </div>

            <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div>
                <div class="text-xs font-bold text-white">Concrete Curing Hydration Temp</div>
                <div class="text-[11px] text-slate-400">Embedded IoT Thermocouple in 4th Floor Slab</div>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-300 text-xs font-mono font-bold">28.4°C (Optimal)</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: CV CRACK & DEFECT SCANNER -->
    <div id="tab-defect" class="tab-content">
      <div class="workbench-grid">
        <div class="workbench-card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-extrabold text-white flex items-center gap-2">
              <i class="fas fa-microscope text-amber-400"></i> YOLOv10 Concrete Defect Scanner
            </h3>
            <span class="text-xs text-amber-400 font-mono font-bold">Sub-millimeter Vision</span>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-white/70 mb-1.5 uppercase">Structural Element Inspected</label>
              <select id="defect-element" class="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white outline-none focus:border-amber-500">
                <option value="beam_b4">Reinforced Concrete Beam #B4-Level 3 (Tensile Zone)</option>
                <option value="column_c12">Shear Wall Column #C12-Basement 2 (Axial Load)</option>
                <option value="slab_s8">Post-Tensioned Slab #S8-Podium Deck</option>
              </select>
            </div>

            <div class="p-4 rounded-xl bg-black/50 border border-white/10 text-center">
              <div class="relative inline-block border-2 border-dashed border-amber-500/40 rounded-xl p-6 w-full">
                <i class="fas fa-camera text-4xl text-amber-400/60 mb-2"></i>
                <div class="text-xs font-bold text-white">Target Image: Concrete_Shear_Zone_042.raw</div>
                <div class="text-[11px] text-slate-400">4032 x 3024 HDR Macro Optical Capture</div>
                <div class="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono">
                  [Simulated 120µm Optical Inspection Bounding Box]
                </div>
              </div>
            </div>

            <button onclick="scanConcreteDefect()" class="run-btn w-full py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2">
              <i class="fas fa-bolt"></i> Run Computer Vision Defect Segmentation
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
            <span class="text-xs font-mono text-slate-400">structural_defect_telemetry.json</span>
            <button onclick="copyResult('defect-console')" class="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer">
              <i class="fas fa-copy"></i> Copy
            </button>
          </div>
          <div class="terminal-body" id="defect-console">
[VISION PIPELINE STANDBY] Click 'Run Computer Vision Defect Segmentation' to execute YOLOv10-Defect weights and compute crack width, depth, and structural safety margin (IS 456:2000).
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 3: AUTOMATED BOQ COST ESTIMATOR -->
    <div id="tab-boq" class="tab-content">
      <div class="workbench-grid">
        <div class="workbench-card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-extrabold text-white flex items-center gap-2">
              <i class="fas fa-calculator text-amber-400"></i> CPWD Automated BOQ Cost Estimator
            </h3>
            <span class="text-xs text-emerald-400 font-mono font-bold">Delhi Schedule of Rates (DSR 2025)</span>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-white/70 mb-1.5 uppercase">Built-Up Area (Sq. Ft)</label>
                <input type="number" id="boq-area" oninput="calculateBoq()" class="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-amber-500" value="25000"/>
              </div>
              <div>
                <label class="block text-xs font-bold text-white/70 mb-1.5 uppercase">Construction Grade</label>
                <select id="boq-grade" onchange="calculateBoq()" class="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-amber-500">
                  <option value="luxury">Luxury High-Rise (₹3,200/sq.ft)</option>
                  <option value="premium" selected>Premium Commercial (₹2,450/sq.ft)</option>
                  <option value="standard">Standard Residential (₹1,850/sq.ft)</option>
                  <option value="industrial">Pre-Engineered Industrial (₹1,400/sq.ft)</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-white/70 mb-1.5 uppercase">Concrete Grade</label>
                <select id="boq-concrete" onchange="calculateBoq()" class="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-amber-500">
                  <option value="m25">M25 Ready-Mix</option>
                  <option value="m30" selected>M30 High-Strength</option>
                  <option value="m40">M40 Self-Compacting</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-white/70 mb-1.5 uppercase">Steel Reinforcement</label>
                <select id="boq-steel" onchange="calculateBoq()" class="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-amber-500">
                  <option value="fe500" selected>Fe500D TMT Bars (Tata/JSW)</option>
                  <option value="fe550">Fe550D Corrosion Resistant</option>
                </select>
              </div>
            </div>

            <button onclick="calculateBoq()" class="run-btn w-full py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2">
              <i class="fas fa-file-invoice-dollar"></i> Generate Detailed Schedule of Rates
            </button>
          </div>
        </div>

        <div class="workbench-card">
          <h3 class="text-base font-extrabold text-white mb-4 flex items-center gap-2">
            <i class="fas fa-receipt text-amber-400"></i> Estimated Bill of Quantities (BOQ)
          </h3>
          <div class="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-4">
            <div class="flex items-baseline justify-between border-b border-white/10 pb-3">
              <span class="text-xs text-slate-300 font-medium">Estimated Civil & Finishing Budget</span>
              <span class="text-2xl font-black text-amber-400 font-mono" id="boq-total">₹6,12,50,000</span>
            </div>

            <div class="space-y-2 text-xs">
              <div class="flex justify-between">
                <span class="text-slate-400">Substructure & Foundation (22%):</span>
                <span class="text-white font-mono font-bold" id="boq-foundation">₹1,34,75,000</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">RCC Superstructure Frame (34%):</span>
                <span class="text-amber-300 font-mono font-bold" id="boq-superstructure">₹2,08,25,000</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Brickwork & External Facade (16%):</span>
                <span class="text-slate-300 font-mono font-bold" id="boq-masonry">₹98,00,000</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">MEP Electrical & Plumbing (18%):</span>
                <span class="text-sky-300 font-mono font-bold" id="boq-mep">₹1,10,25,000</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Internal Finishes & Flooring (10%):</span>
                <span class="text-emerald-300 font-mono font-bold" id="boq-finishing">₹61,25,000</span>
              </div>
            </div>

            <div class="pt-3 border-t border-white/10 text-[11px] text-slate-400">
              <i class="fas fa-shield-halved text-amber-400 mr-1"></i> Rates indexed to CPWD Schedule 2025 with 8% escalation buffer included.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 4: CRITICAL PATH DELAY RISK -->
    <div id="tab-delays" class="tab-content">
      <div class="workbench-card">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-base font-extrabold text-white flex items-center gap-2">
              <i class="fas fa-triangle-exclamation text-amber-400"></i> AI Delay Risk Forecasting & Critical Path
            </h3>
            <p class="text-xs text-slate-400 mt-1">Multi-variable projection factoring monsoon forecasts, cement truck supply logs, and labor availability</p>
          </div>
          <span class="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">On Track (-2 Days Ahead)</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div class="text-xs font-bold text-amber-400 mb-1">WEATHER IMPACT</div>
            <div class="text-sm font-bold text-white mb-2">0 Rain Delay Days in Next 15 Days</div>
            <p class="text-[11px] text-slate-300">Dry weather window allows double-shift casting for 5th floor transfer slab.</p>
          </div>

          <div class="p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div class="text-xs font-bold text-sky-400 mb-1">MATERIAL SUPPLY CHAIN</div>
            <div class="text-sm font-bold text-white mb-2">320T Fe500D Steel In Stock</div>
            <p class="text-[11px] text-slate-300">Guaranteed 28-day inventory buffer on site. No price surge exposure.</p>
          </div>

          <div class="p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div class="text-xs font-bold text-emerald-400 mb-1">MILESTONE HANDOVER</div>
            <div class="text-sm font-bold text-white mb-2">Podium Completion: Dec 14</div>
            <p class="text-[11px] text-slate-300">Critical path float: 6 days. Zero penalty risk under RERA clause 18.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 5: DRONE VOLUMETRIC SURVEY -->
    <div id="tab-drones" class="tab-content">
      <div class="workbench-card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-extrabold text-white flex items-center gap-2">
            <i class="fas fa-satellite text-amber-400"></i> Autonomous Drone Volumetric Survey Logs
          </h3>
          <span class="text-xs text-amber-400 font-mono font-bold">Survey Drone #DJI-M300</span>
        </div>

        <div class="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3 font-mono text-xs">
          <div class="text-slate-300">LAST MISSION: 2026-09-24 07:30 AM • 45 Flight Minutes</div>
          <div class="text-emerald-400">✓ Basements Excavation Volumetric Cut: 14,820 m³ (99.2% of target design)</div>
          <div class="text-emerald-400">✓ Earthwork Fill Stockpile: 3,410 m³ stored in West Yard</div>
          <div class="text-sky-400">✓ 3D Point Cloud Resolution: 1.2 cm GSD (Ground Sampling Distance)</div>
          <div class="text-slate-400 pt-2 border-t border-white/10">NEXT SCHEDULED FLIGHT: Tomorrow at 07:00 AM (Automated Waypoint #WP-104)</div>
        </div>
      </div>
    </div>
    """

    script_content = """
    function scanConcreteDefect() {
      const element = document.getElementById('defect-element').value;
      const consoleEl = document.getElementById('defect-console');

      consoleEl.innerHTML = `<span class="text-yellow-400">>> [INSPECTING] YOLOv10 segmentation model loading high-res scan...</span>\\n>> Applying edge filters and computing crack width in millimeters...`;

      setTimeout(() => {
        consoleEl.innerHTML = `========================================================================
BREAKDOWN FACTOR — STRUCTURAL DEFECT VISION ANALYSIS
========================================================================
TARGET: ${element}
TIMESTAMP: 2026-09-25 15:42:09 IST

[DETECTION SUMMARY]:
• Crack Detected: Hairline surface shrinkage crack (0.18 mm width)
• Depth Estimation (Ultrasound Acoustic Echo): 4.2 mm (Non-structural surface)
• IS 456:2000 Permissible Width Limit: 0.30 mm for moderate exposure

[SEVERITY CLASSIFICATION]: LEVEL 1 — COSMETIC / NEGLIGIBLE RISK
  ✓ Does not compromise rebar passivation layer.
  ✓ No signs of water seepage or chemical efflorescence.

[REMEDIATION RECOMMENDATION]:
  Apply low-viscosity epoxy injection / elastomeric acrylic coating prior to plastering.
  Structural stability clearance: APPROVED.`;
      }, 700);
    }

    function calculateBoq() {
      const area = parseFloat(document.getElementById('boq-area').value) || 25000;
      const grade = document.getElementById('boq-grade').value;

      let rate = 2450;
      if (grade === 'luxury') rate = 3200;
      else if (grade === 'standard') rate = 1850;
      else if (grade === 'industrial') rate = 1400;

      const total = Math.round(area * rate);
      const foundation = Math.round(total * 0.22);
      const superstructure = Math.round(total * 0.34);
      const masonry = Math.round(total * 0.16);
      const mep = Math.round(total * 0.18);
      const finishing = Math.round(total * 0.10);

      const fmt = (v) => '₹' + (Math.round(v / 100000 * 10) / 10).toLocaleString() + ' L (' + (Math.round(v / 10000000 * 100) / 100) + ' Cr)';

      document.getElementById('boq-total').innerText = '₹' + (Math.round(total / 10000000 * 100) / 100) + ' Crores';
      document.getElementById('boq-foundation').innerText = fmt(foundation);
      document.getElementById('boq-superstructure').innerText = fmt(superstructure);
      document.getElementById('boq-masonry').innerText = fmt(masonry);
      document.getElementById('boq-mep').innerText = fmt(mep);
      document.getElementById('boq-finishing').innerText = fmt(finishing);
    }
    """

    return nav_items, stats_items, main_content, script_content
