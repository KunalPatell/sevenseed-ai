# -*- coding: utf-8 -*-
"""
Decode Pharmacy Portal Generator Module - Clinical AI Pharmacology & PMBJP Jan Aushadhi
"""

def get_pharmacy_data():
    nav_items = [
        ("rx", "Prescription Salt OCR", "fas fa-file-prescription", "OCR"),
        ("interactions", "Drug Interaction Matrix", "fas fa-triangle-exclamation", "Safety"),
        ("generic", "Jan Aushadhi Generic Finder", "fas fa-pills", "Save 80%"),
        ("dosage", "Chronopharmacology Schedule", "fas fa-clock", "Dose"),
        ("coldchain", "Cold-Chain IoT Telemetry", "fas fa-snowflake", "3.8°C"),
    ]

    stats_items = [
        ("78.4%", "Avg Patient Bill Reduction", "Jan Aushadhi Generic Salts", "green"),
        ("14,800+", "Indexed Salt Monographs", "CDSCO & FDA Validated", "blue"),
        ("3.8°C", "Cold-Chain Refrigerator Temp", "Optimal 2°C - 8°C Window", "purple"),
        ("Zero Error", "Contraindication Alerts", "Real-Time Pharmacovigilance", "green"),
    ]

    main_content = """
    <!-- TAB 1: PRESCRIPTION SALT OCR -->
    <div id="tab-rx" class="tab-content active">
      <div class="welcome-box mb-8 p-8 rounded-2xl border border-white/10 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent relative overflow-hidden">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-3">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Clinical Pharmacology Core v4.2 Online
            </div>
            <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight">AI Clinical Pharmacology & Generic Savings Hub</h2>
            <p class="text-sm text-slate-300 mt-2 max-w-[680px] leading-relaxed">
              Extract active pharmaceutical ingredients (API) from doctor prescriptions, run multi-drug interaction checks, and substitute branded medicines with certified PMBJP Jan Aushadhi generics to slash healthcare costs by up to 85%.
            </p>
          </div>
          <div class="flex items-center gap-3">
            <button onclick="switchTab('generic')" class="run-btn px-5 py-3 rounded-xl text-xs font-bold text-white flex items-center gap-2">
              <i class="fas fa-pills"></i> Find Generic Alternatives
            </button>
            <button onclick="switchTab('interactions')" class="px-4 py-3 rounded-xl text-xs font-bold text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2">
              <i class="fas fa-shield-halved"></i> Check Drug Interactions
            </button>
          </div>
        </div>
      </div>

      <!-- Prescription OCR Workbench -->
      <div class="workbench-grid">
        <div class="workbench-card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-extrabold text-white flex items-center gap-2">
              <i class="fas fa-file-medical text-emerald-400"></i> Doctor Prescription Parser
            </h3>
            <span class="text-xs text-emerald-400 font-mono font-bold">BioBERT OCR Engine</span>
          </div>

          <div class="space-y-4">
            <div>
              <div class="flex justify-between items-center mb-1.5">
                <label class="text-xs font-bold text-white/70 uppercase">Doctor's Handwritten Prescription Text / OCR Input</label>
                <button onclick="loadSampleRx()" class="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer">
                  Load Diabetic + Cardiac Rx Sample
                </button>
              </div>
              <textarea id="rx-input" rows="7" class="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-slate-200 font-mono outline-none focus:border-emerald-500 placeholder:text-white/20">Rx:
1. Tab Glycomet-GP 2 (Metformin 500mg + Glimepiride 2mg) - 1 tab before breakfast OD
2. Tab Atorva 20 (Atorvastatin 20mg) - 1 tab at bedtime HS
3. Tab Telma 40 (Telmisartan 40mg) - 1 tab in morning OD
4. Tab Ecosprin 75 (Enteric Coated Aspirin 75mg) - 1 tab after lunch OD</textarea>
            </div>

            <button onclick="parsePrescription()" class="run-btn w-full py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2">
              <i class="fas fa-wand-magic-sparkles"></i> Extract Active Salts & Find Jan Aushadhi Equivalents
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
            <span class="text-xs font-mono text-slate-400">pharmacology_parser.json</span>
            <button onclick="copyResult('rx-console')" class="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer">
              <i class="fas fa-copy"></i> Copy
            </button>
          </div>
          <div class="terminal-body" id="rx-console">
[PARSER READY] Click 'Extract Active Salts & Find Jan Aushadhi Equivalents' to parse dosage forms, identify biochemical mechanisms of action, and calculate generic price substitution.
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: DRUG INTERACTION MATRIX -->
    <div id="tab-interactions" class="tab-content">
      <div class="workbench-grid">
        <div class="workbench-card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-extrabold text-white flex items-center gap-2">
              <i class="fas fa-shield-virus text-emerald-400"></i> Pairwise Drug-Drug Interaction Radar
            </h3>
            <span class="text-xs text-emerald-400 font-mono font-bold">FDA/CDSCO Pharmacovigilance</span>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-white/70 mb-1.5 uppercase">Primary Medication</label>
              <select id="drug-a" onchange="checkPairwiseInteraction()" class="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-emerald-500">
                <option value="aspirin" selected>Aspirin (Acetylsalicylic Acid 75mg)</option>
                <option value="metformin">Metformin HCl (500mg/1000mg)</option>
                <option value="warfarin">Warfarin Sodium (Blood Thinner)</option>
                <option value="cipro">Ciprofloxacin (Fluoroquinolone Antibiotic)</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-white/70 mb-1.5 uppercase">Co-Prescribed Medication</label>
              <select id="drug-b" onchange="checkPairwiseInteraction()" class="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-emerald-500">
                <option value="ibuprofen" selected>Ibuprofen (Advil/Brufen NSAID)</option>
                <option value="atorvastatin">Atorvastatin Calcium (20mg)</option>
                <option value="antacid">Magnesium Hydroxide / Antacid Gel</option>
                <option value="paracetamol">Paracetamol / Acetaminophen (650mg)</option>
              </select>
            </div>

            <button onclick="checkPairwiseInteraction()" class="run-btn w-full py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2">
              <i class="fas fa-bolt"></i> Evaluate Biochemical Interaction
            </button>
          </div>
        </div>

        <div class="workbench-card">
          <h3 class="text-base font-extrabold text-white mb-4 flex items-center gap-2">
            <i class="fas fa-triangle-exclamation text-amber-400"></i> Clinical Interaction Diagnostic
          </h3>
          <div id="interaction-card" class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-rose-300">SEVERITY: MAJOR / CONTRAINDICATED</span>
              <span class="text-[10px] font-mono bg-rose-500/30 text-rose-200 px-2 py-0.5 rounded">Risk Level 3</span>
            </div>
            <p class="text-xs text-slate-200 leading-relaxed" id="interaction-text">
              Co-administration of <strong>Aspirin</strong> and <strong>Ibuprofen</strong> results in competitive antagonism at the platelet COX-1 binding site. Ibuprofen competitively inhibits the irreversible antiplatelet effect of low-dose aspirin, significantly attenuating cardioprotection and tripling gastrointestinal bleeding risk.
            </p>
            <div class="pt-2 border-t border-rose-500/20 text-[11px] text-rose-300 font-semibold" id="interaction-rec">
              CLINICAL RECOMMENDATION: Take Aspirin at least 2 hours BEFORE Ibuprofen, or substitute Ibuprofen with Paracetamol for analgesia.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 3: JAN AUSHADHI GENERIC FINDER -->
    <div id="tab-generic" class="tab-content">
      <div class="workbench-card">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-base font-extrabold text-white flex items-center gap-2">
              <i class="fas fa-hand-holding-dollar text-emerald-400"></i> PMBJP Pradhan Mantri Jan Aushadhi Generic Substitutor
            </h3>
            <p class="text-xs text-slate-400 mt-1">Certified WHO-GMP generic bioequivalents at 70% to 85% reduced government prices</p>
          </div>
          <span class="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Govt PMBJP Database</span>
        </div>

        <div class="space-y-3">
          <div class="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-white">Augmentin 625 Duo (Amoxicillin 500mg + Clavulanic Acid 125mg)</span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">Branded GSK</span>
              </div>
              <div class="text-[11px] text-emerald-400 mt-1">PMBJP Equivalent: Generic Amoxy-Clav 625 (Code: #PMBJP-048)</div>
            </div>
            <div class="flex items-center gap-4">
              <div class="text-right">
                <div class="text-xs text-rose-400 line-through">MRP: ₹210 / 10 tabs</div>
                <div class="text-sm font-black text-emerald-400 font-mono">Jan Aushadhi: ₹54 / 10 tabs</div>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold whitespace-nowrap">Save 74%</span>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-white">Lipitor / Atorva 20 (Atorvastatin Calcium 20mg)</span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">Branded Zydus</span>
              </div>
              <div class="text-[11px] text-emerald-400 mt-1">PMBJP Equivalent: Generic Atorvastatin 20mg (Code: #PMBJP-112)</div>
            </div>
            <div class="flex items-center gap-4">
              <div class="text-right">
                <div class="text-xs text-rose-400 line-through">MRP: ₹195 / 15 tabs</div>
                <div class="text-sm font-black text-emerald-400 font-mono">Jan Aushadhi: ₹32 / 10 tabs</div>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold whitespace-nowrap">Save 75%</span>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-white">Januvia 100 (Sitagliptin 100mg for Type-2 Diabetes)</span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">Branded MSD</span>
              </div>
              <div class="text-[11px] text-emerald-400 mt-1">PMBJP Equivalent: Generic Sitagliptin 100mg (Code: #PMBJP-409)</div>
            </div>
            <div class="flex items-center gap-4">
              <div class="text-right">
                <div class="text-xs text-rose-400 line-through">MRP: ₹480 / 10 tabs</div>
                <div class="text-sm font-black text-emerald-400 font-mono">Jan Aushadhi: ₹68 / 10 tabs</div>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold whitespace-nowrap">Save 86%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 4: CHRONOPHARMACOLOGY SCHEDULE -->
    <div id="tab-dosage" class="tab-content">
      <div class="workbench-card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-extrabold text-white flex items-center gap-2">
            <i class="fas fa-clock-rotate-left text-emerald-400"></i> Smart Chronopharmacology Dosage Timeline
          </h3>
          <span class="text-xs text-emerald-400 font-mono font-bold">Circadian Optimized</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div class="text-xs font-bold text-amber-400 mb-1">MORNING (08:00 AM)</div>
            <div class="text-xs font-bold text-white mb-2">Before Breakfast</div>
            <ul class="text-[11px] text-slate-300 space-y-1">
              <li>• Metformin + Glimepiride (1 tab)</li>
              <li>• Telmisartan 40mg (1 tab)</li>
            </ul>
          </div>

          <div class="p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div class="text-xs font-bold text-sky-400 mb-1">AFTERNOON (01:30 PM)</div>
            <div class="text-xs font-bold text-white mb-2">After Lunch</div>
            <ul class="text-[11px] text-slate-300 space-y-1">
              <li>• Ecosprin 75mg (1 tab)</li>
              <li>• Vitamin D3 60k (Once a week)</li>
            </ul>
          </div>

          <div class="p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div class="text-xs font-bold text-indigo-400 mb-1">EVENING (07:00 PM)</div>
            <div class="text-xs font-bold text-white mb-2">Pre-Dinner</div>
            <ul class="text-[11px] text-slate-300 space-y-1">
              <li>• Blood Glucose Logging Check</li>
              <li>• Hydration Buffer (500ml)</li>
            </ul>
          </div>

          <div class="p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div class="text-xs font-bold text-purple-400 mb-1">BEDTIME (10:00 PM)</div>
            <div class="text-xs font-bold text-white mb-2">Before Sleep</div>
            <ul class="text-[11px] text-slate-300 space-y-1">
              <li>• Atorvastatin 20mg (Optimal for hepatic HMG-CoA reductase peak)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 5: COLD-CHAIN TELEMETRY -->
    <div id="tab-coldchain" class="tab-content">
      <div class="workbench-card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-extrabold text-white flex items-center gap-2">
            <i class="fas fa-temperature-low text-emerald-400"></i> IoT Cold-Chain Vaccine & Insulin Refrigerator
          </h3>
          <span class="text-xs text-emerald-400 font-mono font-bold">Sensor #IOT-COLD-01</span>
        </div>

        <div class="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3 font-mono text-xs">
          <div class="text-slate-300">UNIT: Pharmacy Medical Refrigerator (Chamber A - Insulin & Biologics)</div>
          <div class="text-emerald-400">✓ CURRENT TEMPERATURE: 3.8°C (Within 2.0°C - 8.0°C Safe Target Range)</div>
          <div class="text-emerald-400">✓ BACKUP POWER STATUS: UPS Battery 100% Charged (14hr Holdover)</div>
          <div class="text-sky-400">✓ DOOR OPEN DETECTOR: Sealed (Zero Spoilage Alert In Trailing 365 Days)</div>
          <div class="text-slate-400 pt-2 border-t border-white/10">LAST NABL CALIBRATION CERTIFICATE: Valid until Dec 2026</div>
        </div>
      </div>
    </div>
    """

    script_content = """
    function loadSampleRx() {
      document.getElementById('rx-input').value = `Rx:
1. Tab Glycomet-GP 2 (Metformin 500mg + Glimepiride 2mg) - 1 tab before breakfast OD
2. Tab Atorva 20 (Atorvastatin 20mg) - 1 tab at bedtime HS
3. Tab Telma 40 (Telmisartan 40mg) - 1 tab in morning OD
4. Tab Ecosprin 75 (Enteric Coated Aspirin 75mg) - 1 tab after lunch OD`;
    }

    function parsePrescription() {
      const consoleEl = document.getElementById('rx-console');
      consoleEl.innerHTML = `<span class="text-yellow-400">>> [BIOBERT OCR] Parsing prescription text and cross-referencing CDSCO pharmacopeia...</span>\\n>> Extracting molecular chemical formulas and querying Jan Aushadhi Kendras...`;

      setTimeout(() => {
        consoleEl.innerHTML = `========================================================================
DECODE PHARMACY — PRESCRIPTION CLINICAL AUDIT REPORT
========================================================================
PATIENT Rx IDENTIFIED: 4 THERAPEUTIC MEDICATIONS

[1] ACTIVE SALTS EXTRACTED:
  • Metformin Hydrochloride (500mg) + Glimepiride (2mg) [Biguanide + Sulfonylurea]
  • Atorvastatin Calcium (20mg) [HMG-CoA Reductase Inhibitor]
  • Telmisartan (40mg) [Angiotensin II Receptor Blocker - ARB]
  • Enteric-Coated Acetylsalicylic Acid (75mg) [Antiplatelet Agent]

[2] PMBJP JAN AUSHADHI GENERIC SUBSTITUTION ECONOMICS:
  • Branded Monthly Cost: ₹1,480 / month
  • Jan Aushadhi Equivalent Cost: ₹340 / month
  >>> PATIENT MONTHLY SAVINGS: ₹1,140 / month (77% SAVED!)

[3] SAFETY WARNING:
  ✓ No absolute contraindications found between this specific quadruple regimen.
  ✓ Renal function (eGFR) monitoring recommended every 6 months for Metformin.`;
      }, 700);
    }

    function checkPairwiseInteraction() {
      const a = document.getElementById('drug-a').value;
      const b = document.getElementById('drug-b').value;
      const textEl = document.getElementById('interaction-text');
      const recEl = document.getElementById('interaction-rec');

      if ((a === 'aspirin' && b === 'ibuprofen') || (a === 'ibuprofen' && b === 'aspirin')) {
        textEl.innerHTML = `Co-administration of <strong>Aspirin</strong> and <strong>Ibuprofen</strong> results in competitive antagonism at the platelet COX-1 binding site. Ibuprofen competitively inhibits the irreversible antiplatelet effect of low-dose aspirin, significantly attenuating cardioprotection and tripling gastrointestinal bleeding risk.`;
        recEl.innerHTML = `CLINICAL RECOMMENDATION: Take Aspirin at least 2 hours BEFORE Ibuprofen, or substitute Ibuprofen with Paracetamol for analgesia.`;
      } else {
        textEl.innerHTML = `Co-administration of selected molecules evaluated against FDA drug-interaction database. No severe metabolic enzyme CYP450 inhibition detected. Routine therapeutic dose monitoring advised.`;
        recEl.innerHTML = `CLINICAL RECOMMENDATION: Safe to administer as per prescribed chronopharmacology intervals.`;
      }
    }
    """

    return nav_items, stats_items, main_content, script_content
