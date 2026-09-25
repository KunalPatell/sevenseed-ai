# -*- coding: utf-8 -*-
"""
AVP Charitable Trust Portal Generator Module - AI Social Impact & 80G Governance Ledger
"""

def get_trust_data():
    nav_items = [
        ("impact", "Impact Transparency", "fas fa-heart-pulse", "48.2k Lives"),
        ("rag", "Beneficiary RAG Engine", "fas fa-hands-holding-child", "RAG"),
        ("ledger", "80G Tax Exemption Ledger", "fas fa-receipt", "80G"),
        ("camps", "Medical Camp Scheduler", "fas fa-truck-medical", "Camps"),
        ("audit", "Statutory Audit & FCRA", "fas fa-clipboard-check", "Audit"),
    ]

    stats_items = [
        ("48,200+", "Lives Uplifted", "Across 64 Rural Districts", "green"),
        ("98.2%", "Program Spend Ratio", "Only 1.8% Admin Overhead", "blue"),
        ("₹4.8 Cr", "CSR Grants Distributed", "100% On-Chain Transparent", "purple"),
        ("100% Tax", "80G Certified Exemption", "Sec 80G(5)(vi) Income Tax", "green"),
    ]

    main_content = """
    <!-- TAB 1: IMPACT TRANSPARENCY -->
    <div id="tab-impact" class="tab-content active">
      <div class="welcome-box mb-8 p-8 rounded-2xl border border-white/10 bg-gradient-to-r from-rose-500/15 via-pink-500/10 to-transparent relative overflow-hidden">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold mb-3">
              <span class="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
              Social Impact Ledger v4.2 Active — 100% Public Audit
            </div>
            <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight">AI Social Impact & Governance Ledger</h2>
            <p class="text-sm text-slate-300 mt-2 max-w-[680px] leading-relaxed">
              Transparent philanthropic execution powered by AI. Allocate corporate CSR capital, prioritize high-need rural medical beneficiaries with vector intelligence, and instantly issue Section 80G tax exemption certificates.
            </p>
          </div>
          <div class="flex items-center gap-3">
            <button onclick="switchTab('ledger')" class="run-btn px-5 py-3 rounded-xl text-xs font-bold text-white flex items-center gap-2">
              <i class="fas fa-hand-holding-heart"></i> Donate & Get 80G
            </button>
            <button onclick="switchTab('rag')" class="px-4 py-3 rounded-xl text-xs font-bold text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2">
              <i class="fas fa-magnifying-glass"></i> Beneficiary RAG
            </button>
          </div>
        </div>
      </div>

      <!-- CSR Fund Distribution Breakdown -->
      <div class="workbench-grid">
        <div class="workbench-card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-extrabold text-white flex items-center gap-2">
              <i class="fas fa-chart-pie text-rose-400"></i> CSR Capital Allocation by Sector
            </h3>
            <span class="text-xs text-rose-400 font-mono font-bold">FY 2025-2026</span>
          </div>

          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-slate-300">Rural Education & STEM Digital Labs</span>
                <span class="text-rose-300 font-mono">42% (₹2,01,60,000)</span>
              </div>
              <div class="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                <div class="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full" style="width: 42%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-slate-300">Dialysis & Rural Cardiac Medical Camps</span>
                <span class="text-rose-300 font-mono">28% (₹1,34,40,000)</span>
              </div>
              <div class="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                <div class="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full" style="width: 28%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-slate-300">Solar RO Drinking Water Filtration Plants</span>
                <span class="text-rose-300 font-mono">18% (₹86,40,000)</span>
              </div>
              <div class="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                <div class="bg-gradient-to-r from-rose-400 to-amber-500 h-2 rounded-full" style="width: 18%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="text-slate-300">Women Livelihood & Textile Micro-Enterprises</span>
                <span class="text-rose-300 font-mono">12% (₹57,60,000)</span>
              </div>
              <div class="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                <div class="bg-gradient-to-r from-amber-500 to-emerald-500 h-2 rounded-full" style="width: 12%"></div>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Admin & Overhead Expense:</span>
            <span class="text-emerald-400 font-bold">1.8% (Exceeds Global 5% Efficiency Standard)</span>
          </div>
        </div>

        <div class="workbench-card">
          <h3 class="text-base font-extrabold text-white mb-4 flex items-center gap-2">
            <i class="fas fa-hand-holding-heart text-rose-400"></i> Real-Time Field Deployments
          </h3>
          <div class="space-y-3">
            <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div>
                <div class="text-xs font-bold text-white">42 Solar RO Plants Commissioned</div>
                <div class="text-[11px] text-slate-400">Dharwad & Gadag Districts • 18,000 villagers served</div>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-mono font-bold">Operational</span>
            </div>

            <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div>
                <div class="text-xs font-bold text-white">12,400 Free Dialysis Sessions Funded</div>
                <div class="text-[11px] text-slate-400">AVP Memorial Hospital Wing • 100% Subsidy</div>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-mono font-bold">Ongoing</span>
            </div>

            <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div>
                <div class="text-xs font-bold text-white">3,200 High School STEM Tablets</div>
                <div class="text-[11px] text-slate-400">Loaded with Gyan AI Offline Syllabus Core</div>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-mono font-bold">Distributed</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: BENEFICIARY RAG ENGINE -->
    <div id="tab-rag" class="tab-content">
      <div class="workbench-grid">
        <div class="workbench-card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-extrabold text-white flex items-center gap-2">
              <i class="fas fa-brain text-rose-400"></i> Beneficiary Need Vector Matcher
            </h3>
            <span class="text-xs text-rose-400 font-mono font-bold">Fair Priority RAG</span>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-white/70 mb-1.5 uppercase">Search Need Description / Location / Medical Urgency</label>
              <input type="text" id="rag-need-query" class="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white outline-none focus:border-rose-500" value="Urgent pediatric open heart surgery subsidy for BPL family in Raichur"/>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-white/70 mb-1.5 uppercase">Annual Income Cap</label>
                <select class="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-xs text-white outline-none">
                  <option>Below Poverty Line (BPL - Under ₹1.5L)</option>
                  <option>Antyodaya Anna Yojana (AAY)</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-white/70 mb-1.5 uppercase">Verification Level</label>
                <select class="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-xs text-white outline-none">
                  <option>Gram Panchayat & Hospital Verified</option>
                  <option>District Health Officer Endorsed</option>
                </select>
              </div>
            </div>

            <button onclick="queryBeneficiaryRag()" class="run-btn w-full py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2">
              <i class="fas fa-magnifying-glass"></i> Match Grants from CSR Allocation Pool
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
            <span class="text-xs font-mono text-slate-400">beneficiary_allocation.json</span>
            <button onclick="copyResult('rag-console')" class="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer">
              <i class="fas fa-copy"></i> Copy
            </button>
          </div>
          <div class="terminal-body" id="rag-console">
[RAG MATCHING POOL STANDBY] Click 'Match Grants from CSR Allocation Pool' to calculate priority index across 1,420 pending community health requests.
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 3: 80G TAX EXEMPTION LEDGER -->
    <div id="tab-ledger" class="tab-content">
      <div class="workbench-grid">
        <div class="workbench-card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-extrabold text-white flex items-center gap-2">
              <i class="fas fa-calculator text-rose-400"></i> Section 80G Tax Exemption Calculator
            </h3>
            <span class="text-xs text-emerald-400 font-mono font-bold">100% Verifiable</span>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-white/70 mb-1.5 uppercase">Donation Amount (INR)</label>
              <input type="number" id="donation-amount" oninput="calculate80G()" class="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white outline-none focus:border-rose-500" value="50000"/>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-white/70 mb-1.5 uppercase">Donor Type</label>
                <select id="donor-type" onchange="calculate80G()" class="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-rose-500">
                  <option value="individual" selected>Individual (Resident Indian)</option>
                  <option value="corporate">Corporate CSR Entity</option>
                  <option value="nri">NRI (Indian Passport Holder)</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-white/70 mb-1.5 uppercase">Tax Bracket</label>
                <select id="donor-bracket" onchange="calculate80G()" class="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-rose-500">
                  <option value="30" selected>30% (Old/New Slab > ₹15L)</option>
                  <option value="20">20% (Income ₹10L - ₹15L)</option>
                  <option value="personal">Corporate Tax (25%)</option>
                </select>
              </div>
            </div>

            <button onclick="issue80GReceipt()" class="run-btn w-full py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2">
              <i class="fas fa-file-invoice"></i> Issue Digital 80G Certificate (Form 10BE)
            </button>
          </div>
        </div>

        <div class="workbench-card">
          <h3 class="text-base font-extrabold text-white mb-4 flex items-center gap-2">
            <i class="fas fa-receipt text-rose-400"></i> Tax Deduction Breakdown
          </h3>
          <div class="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-4">
            <div class="flex items-baseline justify-between border-b border-white/10 pb-3">
              <span class="text-xs text-slate-300 font-medium">Net Tax Savings on Donation</span>
              <span class="text-2xl font-black text-emerald-400 font-mono" id="tax-saved">₹7,800</span>
            </div>

            <div class="space-y-2 text-xs">
              <div class="flex justify-between">
                <span class="text-slate-400">Total Philanthropic Donation:</span>
                <span class="text-white font-mono font-bold" id="tax-donation">₹50,000</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Qualifying Deduction (50% u/s 80G):</span>
                <span class="text-rose-300 font-mono font-bold" id="tax-deduction">₹25,000</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Income Tax Saved (incl 4% Cess):</span>
                <span class="text-emerald-300 font-mono font-bold" id="tax-savings-calc">₹7,800</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Effective Out-of-Pocket Cost:</span>
                <span class="text-sky-300 font-mono font-bold" id="tax-effective">₹42,200</span>
              </div>
            </div>

            <div class="pt-3 border-t border-white/10 text-[11px] text-slate-400">
              <i class="fas fa-stamp text-rose-400 mr-1"></i> AVP Charitable Trust PAN: AAATA1234F • 80G Unique Reg: CIT(E)/BLR/80G/2021/10492
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 4: MEDICAL CAMP SCHEDULER -->
    <div id="tab-camps" class="tab-content">
      <div class="workbench-card">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-base font-extrabold text-white flex items-center gap-2">
              <i class="fas fa-truck-medical text-rose-400"></i> Upcoming Rural Health & Eye Surgery Camps
            </h3>
            <p class="text-xs text-slate-400 mt-1">Free consultations, cataract screenings, and diagnostic blood work across tier-3 villages</p>
          </div>
          <span class="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">3 Camps Scheduled</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div class="text-xs font-bold text-rose-400 mb-1">OCTOBER 10, 2026</div>
            <div class="text-sm font-bold text-white mb-2">Raichur Rural Community Hall</div>
            <p class="text-[11px] text-slate-300">Pediatric cardiology screening & nutrition kits for 600 children.</p>
          </div>

          <div class="p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div class="text-xs font-bold text-rose-400 mb-1">OCTOBER 24, 2026</div>
            <div class="text-sm font-bold text-white mb-2">Gadag Primary Health Centre</div>
            <p class="text-[11px] text-slate-300">Free cataract laser surgeries & distribution of 1,200 prescription glasses.</p>
          </div>

          <div class="p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div class="text-xs font-bold text-rose-400 mb-1">NOVEMBER 08, 2026</div>
            <div class="text-sm font-bold text-white mb-2">Bidar Tribal Taluk Camp</div>
            <p class="text-[11px] text-slate-300">Diabetes detection, HbA1c screening, and Jan Aushadhi generic kits.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 5: STATUTORY AUDIT & FCRA -->
    <div id="tab-audit" class="tab-content">
      <div class="workbench-card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-extrabold text-white flex items-center gap-2">
            <i class="fas fa-file-shield text-rose-400"></i> Statutory Governance & Independent Audit Reports
          </h3>
          <span class="text-xs text-emerald-400 font-mono font-bold">Unqualified Audit Opinion</span>
        </div>

        <div class="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3 font-mono text-xs">
          <div class="text-slate-300">AUDITOR: M/s Raman & Associates, Chartered Accountants (Firm Reg: 004128S)</div>
          <div class="text-emerald-400">✓ SECTION 12A REGISTRATION: Granted & Permanent (Order #CIT/12A/2019)</div>
          <div class="text-emerald-400">✓ SECTION 80G EXEMPTION: Re-validated under New IT System (Form 10AC)</div>
          <div class="text-emerald-400">✓ FCRA CLEARANCE: Ministry of Home Affairs Reg #094421890 (Valid till 2029)</div>
          <div class="text-slate-400 pt-2 border-t border-white/10">100% OF CSR FUNDS ROUTED VIA PUBLIC DIGITAL LEDGERS WITH ZERO INTERMEDIARY COMMISSIONS</div>
        </div>
      </div>
    </div>
    """

    script_content = """
    function queryBeneficiaryRag() {
      const q = document.getElementById('rag-need-query').value;
      const consoleEl = document.getElementById('rag-console');

      consoleEl.innerHTML = `<span class="text-yellow-400">>> [RAG ENGINE] Vector similarity search across 1,420 beneficiary applications...</span>\\n>> Verifying income certificates against state BPL database...`;

      setTimeout(() => {
        consoleEl.innerHTML = `========================================================================
AVP CHARITABLE TRUST — BENEFICIARY ALLOCATION MATCH
========================================================================
MATCHED CASE: #BEN-2026-0892
PATIENT: Master Aarav Kumar (Age: 7) • Location: Raichur District, Karnataka
DIAGNOSIS: Congenital Ventricular Septal Defect (VSD)

[FINANCIAL VERIFICATION]:
• Family Annual Income: ₹72,000 (Ration Card: BPL #2940-KA-1102)
• Total Hospital Package Cost: ₹1,85,000 (Narayana Hrudayalaya BLR)
• State Ayushman Bharat Scheme: ₹90,000 Approved

[AVP TRUST CSR ALLOCATION]:
✓ MATCH GRANTED: ₹95,000 (100% of remaining co-pay funded)
✓ Direct hospital settlement code: #CSR-HOSP-NH-4091
✓ Case worker assigned: Sister Mary D'Souza (Medical Camp Lead)

STATUS: ALLOCATED & CLEARED FOR SURGERY ON 14 OCT 2026.`;
      }, 700);
    }

    function calculate80G() {
      const don = parseFloat(document.getElementById('donation-amount').value) || 50000;
      const ded = don * 0.50; // 50% under 80G
      const taxRate = 0.312; // 30% + 4% cess = 31.2%
      const saved = Math.round(ded * taxRate);
      const effective = Math.round(don - saved);

      const fmt = (v) => '₹' + v.toLocaleString();

      document.getElementById('tax-donation').innerText = fmt(don);
      document.getElementById('tax-deduction').innerText = fmt(ded);
      document.getElementById('tax-saved').innerText = fmt(saved);
      document.getElementById('tax-savings-calc').innerText = fmt(saved);
      document.getElementById('tax-effective').innerText = fmt(effective);
    }

    function issue80GReceipt() {
      const don = document.getElementById('donation-amount').value;
      alert(`Digital 80G Certificate (Form 10BE) issued for donation of ₹${don}! Stamped with Trust PAN and sent to your email with income-tax filing acknowledgement number.`);
    }
    """

    return nav_items, stats_items, main_content, script_content
