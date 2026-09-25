# -*- coding: utf-8 -*-
"""
Rakshak AI Portal Generator Module - AI Vision Security & BNS FIR Workstations
"""

def get_rakshak_data():
    nav_items = [
        ("cctv", "Sentinel Vision Streams", "fas fa-video", "Live 4"),
        ("fir", "BNS 2024 Legal FIR", "fas fa-scale-balanced", "Legal"),
        ("attendance", "Biometric Face Audit", "fas fa-user-check", "98.8%"),
        ("incidents", "Incident Risk Matrix", "fas fa-shield-halved", "Low Risk"),
        ("dispatch", "Guard Patrol GPS Mesh", "fas fa-person-military-pointing", "GPS"),
    ]

    stats_items = [
        ("100%", "Perimeter Coverage", "32 Edge Vision Nodes", "green"),
        ("0.4s", "Intrusion Detection Latency", "YOLOv10-Security Core", "blue"),
        ("148 / 148", "Biometric Liveness Validated", "Zero Deepfake Spoofs", "purple"),
        ("BNS 2024", "Compliant Legal Formats", "Sec 303, 318, 329 Codified", "green"),
    ]

    main_content = """
    <!-- TAB 1: SENTINEL VISION STREAMS -->
    <div id="tab-cctv" class="tab-content active">
      <div class="welcome-box mb-8 p-8 rounded-2xl border border-white/10 bg-gradient-to-r from-red-500/15 via-rose-500/10 to-transparent relative overflow-hidden">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-rose-300 text-xs font-bold mb-3">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Sentinel Vision Core v4.2 Active — Sector 9 Facility
            </div>
            <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight">AI Vision Security & Incident Intelligence</h2>
            <p class="text-sm text-slate-300 mt-2 max-w-[680px] leading-relaxed">
              Real-time multi-camera CCTV analytics with neural object tracking, automatic perimeter intrusion deterrence, biometric facial verification with 3D liveness, and instant Bharatiya Nyaya Sanhita (BNS) 2024 FIR drafting.
            </p>
          </div>
          <div class="flex items-center gap-3">
            <button onclick="switchTab('fir')" class="run-btn px-5 py-3 rounded-xl text-xs font-bold text-white flex items-center gap-2">
              <i class="fas fa-file-shield"></i> Draft Legal FIR
            </button>
            <button onclick="switchTab('attendance')" class="px-4 py-3 rounded-xl text-xs font-bold text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2">
              <i class="fas fa-user-check"></i> Face Audit
            </button>
          </div>
        </div>
      </div>

      <!-- 4-Camera Multi-View Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="p-3.5 rounded-2xl bg-black/60 border border-white/10 relative overflow-hidden">
          <div class="aspect-video bg-slate-950 rounded-xl relative flex items-center justify-center overflow-hidden border border-white/5">
            <canvas id="cctv-canvas" width="640" height="360" class="w-full h-full object-cover"></canvas>
            <div class="absolute top-3 left-3 px-2 py-0.5 rounded bg-red-600/90 text-[10px] font-mono font-bold text-white flex items-center gap-1.5 z-10">
              <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span> LIVE: CAM-01 (SYNTHETIC FEED)
            </div>
            <button onclick="toggleNightVision()" class="absolute top-3 right-3 text-[10px] text-white/90 font-mono bg-black/70 hover:bg-black px-2 py-1 rounded border border-white/20 transition-all z-10 flex items-center gap-1.5 cursor-pointer">
              <i class="fas fa-eye text-emerald-400"></i> <span id="nv-label">IR Night Vision: OFF</span>
            </button>
            <div class="absolute bottom-3 left-3 text-xs text-white font-mono bg-black/70 px-2 py-1 rounded border border-white/10 z-10">
              GATE 1: MAIN ENTRY & VEHICLE ANPR
            </div>
            <div class="absolute bottom-3 right-3 text-xs text-emerald-400 font-mono bg-emerald-950/70 px-2 py-1 rounded border border-emerald-500/30 z-10">
              VEHICLE: DL-01-AB-1234 [AUTHORIZED]
            </div>
          </div>
        </div>

        <div class="p-3.5 rounded-2xl bg-black/60 border border-white/10 relative overflow-hidden">
          <div class="aspect-video bg-slate-950 rounded-xl relative flex items-center justify-center overflow-hidden border border-white/5">
            <i class="fas fa-server text-4xl text-slate-800"></i>
            <div class="absolute top-3 left-3 px-2 py-0.5 rounded bg-red-600/90 text-[10px] font-mono font-bold text-white flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span> LIVE: CAM-02
            </div>
            <div class="absolute top-3 right-3 text-[10px] text-white/70 font-mono bg-black/60 px-2 py-0.5 rounded">60 FPS • 4K ULTRA</div>
            <div class="absolute bottom-3 left-3 text-xs text-white font-mono bg-black/70 px-2 py-1 rounded border border-white/10">
              SERVER ROOM & CRYPTO VAULT
            </div>
            <div class="absolute bottom-3 right-3 text-xs text-emerald-400 font-mono bg-emerald-950/60 px-2 py-1 rounded border border-emerald-500/30">
              SECURITY: LOCKED & SEALED
            </div>
          </div>
        </div>

        <div class="p-3.5 rounded-2xl bg-black/60 border border-white/10 relative overflow-hidden">
          <div class="aspect-video bg-slate-950 rounded-xl relative flex items-center justify-center overflow-hidden border border-white/5">
            <i class="fas fa-industry text-4xl text-slate-800"></i>
            <div class="absolute top-3 left-3 px-2 py-0.5 rounded bg-red-600/90 text-[10px] font-mono font-bold text-white flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span> LIVE: CAM-03
            </div>
            <div class="absolute top-3 right-3 text-[10px] text-white/70 font-mono bg-black/60 px-2 py-0.5 rounded">60 FPS • 4K ULTRA</div>
            <div class="absolute bottom-3 left-3 text-xs text-white font-mono bg-black/70 px-2 py-1 rounded border border-white/10">
              CENTRAL WORKSHOP & LOGISTICS
            </div>
            <div class="absolute bottom-3 right-3 text-xs text-emerald-400 font-mono bg-emerald-950/60 px-2 py-1 rounded border border-emerald-500/30">
              PERSONNEL: 12 WORKERS [VERIFIED]
            </div>
          </div>
        </div>

        <div class="p-3.5 rounded-2xl bg-black/60 border border-white/10 relative overflow-hidden">
          <div class="aspect-video bg-slate-950 rounded-xl relative flex items-center justify-center overflow-hidden border border-white/5">
            <i class="fas fa-tree text-4xl text-slate-800"></i>
            <div class="absolute top-3 left-3 px-2 py-0.5 rounded bg-red-600/90 text-[10px] font-mono font-bold text-white flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span> LIVE: CAM-04
            </div>
            <div class="absolute top-3 right-3 text-[10px] text-white/70 font-mono bg-black/60 px-2 py-0.5 rounded">60 FPS • 4K ULTRA</div>
            <div class="absolute bottom-3 left-3 text-xs text-white font-mono bg-black/70 px-2 py-1 rounded border border-white/10">
              NORTH PERIMETER FENCE & TRIPWIRE
            </div>
            <div class="absolute bottom-3 right-3 text-xs text-emerald-400 font-mono bg-emerald-950/60 px-2 py-1 rounded border border-emerald-500/30">
              INFRARED: NO BREACH DETECTED
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: BNS 2024 LEGAL FIR GENERATOR -->
    <div id="tab-fir" class="tab-content">
      <div class="workbench-grid">
        <div class="workbench-card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-extrabold text-white flex items-center gap-2">
              <i class="fas fa-gavel text-rose-400"></i> Bharatiya Nyaya Sanhita (BNS 2024) FIR Generator
            </h3>
            <span class="text-xs text-rose-400 font-mono font-bold">Bharatiya Nagarik Suraksha Sanhita</span>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-white/70 mb-1.5 uppercase">Incident Offense Category</label>
              <select id="fir-offense" class="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-rose-500">
                <option value="bns_303">Theft / Larceny of Corporate Property (BNS Section 303)</option>
                <option value="bns_318">Cheating & Cyber Financial Fraud (BNS Section 318)</option>
                <option value="bns_329">Criminal Trespass & Perimeter Intrusion (BNS Section 329)</option>
                <option value="bns_351">Criminal Intimidation & Workplace Harassment (BNS Section 351)</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-white/70 mb-1.5 uppercase">Date & Time of Occurrence</label>
                <input type="text" id="fir-time" class="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-rose-500" value="2026-09-25 02:40 AM IST"/>
              </div>
              <div>
                <label class="block text-xs font-bold text-white/70 mb-1.5 uppercase">Place of Occurrence</label>
                <input type="text" id="fir-place" class="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-rose-500" value="Sector 9 Warehouse, North Yard"/>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-white/70 mb-1.5 uppercase">Incident Statement & Evidence Hashes</label>
              <textarea id="fir-statement" rows="5" class="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-slate-200 font-mono outline-none focus:border-rose-500">Unidentified intruder attempted to breach North Perimeter Gate via cutting razor wire. Automated Sentinel Vision CAM-04 triggered spotlight and alarm at 02:41 AM. Suspect fled on unnumbered two-wheeler towards Outer Ring Road. SHA-256 optical hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855.</textarea>
            </div>

            <button onclick="generateLegalFir()" class="run-btn w-full py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2">
              <i class="fas fa-file-contract"></i> Generate Court-Admissible BNS Legal FIR Draft
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
            <span class="text-xs font-mono text-slate-400">bns_legal_fir_draft.txt</span>
            <button onclick="copyResult('fir-console')" class="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer">
              <i class="fas fa-copy"></i> Copy
            </button>
          </div>
          <div class="terminal-body" id="fir-console">
[LEGAL DRAFTING CONSOLE] Click 'Generate Court-Admissible BNS Legal FIR Draft' to structure incident facts under Bharatiya Nagarik Suraksha Sanhita (BNSS) Section 173 for police submission.
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 3: BIOMETRIC FACE AUDIT -->
    <div id="tab-attendance" class="tab-content">
      <div class="workbench-grid">
        <div class="workbench-card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-extrabold text-white flex items-center gap-2">
              <i class="fas fa-id-card-clip text-rose-400"></i> Facial Recognition Roster (Today's Shift)
            </h3>
            <span class="text-xs text-emerald-400 font-mono font-bold">142 / 148 Checked In</span>
          </div>

          <div class="space-y-3">
            <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-xs grid place-items-center">VK</div>
                <div>
                  <div class="text-xs font-bold text-white">Vikram Kulkarni (Chief Security Officer)</div>
                  <div class="text-[11px] text-slate-400">Badge #SEC-01 • In: 07:45 AM • Gate 1 Face Scanner</div>
                </div>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-mono font-bold">Verified (99.8% match)</span>
            </div>

            <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-xs grid place-items-center">RS</div>
                <div>
                  <div class="text-xs font-bold text-white">Ritu Sharma (Operations Lead)</div>
                  <div class="text-[11px] text-slate-400">Badge #OPS-14 • In: 08:12 AM • Turnstile B</div>
                </div>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-mono font-bold">Verified (99.4% match)</span>
            </div>

            <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-xs grid place-items-center">AM</div>
                <div>
                  <div class="text-xs font-bold text-white">Anand Mishra (Warehouse Incharge)</div>
                  <div class="text-[11px] text-slate-400">Badge #WH-09 • In: 08:30 AM • Loading Bay Camera</div>
                </div>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-mono font-bold">Verified (99.6% match)</span>
            </div>
          </div>
        </div>

        <div class="workbench-card">
          <h3 class="text-base font-extrabold text-white mb-4 flex items-center gap-2">
            <i class="fas fa-shield-virus text-rose-400"></i> Anti-Spoofing Liveness Diagnostics
          </h3>
          <div class="space-y-3 text-xs">
            <div class="p-3 rounded-lg bg-emerald-500/10 text-emerald-300 flex items-center gap-2">
              <i class="fas fa-check-circle"></i>
              <span>3D Flash Reflection Liveness: Active (Zero photo/screen bypasses)</span>
            </div>
            <div class="p-3 rounded-lg bg-emerald-500/10 text-emerald-300 flex items-center gap-2">
              <i class="fas fa-check-circle"></i>
              <span>Infrared Depth Map Check: 100% Pass Rate</span>
            </div>
            <div class="p-3 rounded-lg bg-emerald-500/10 text-emerald-300 flex items-center gap-2">
              <i class="fas fa-check-circle"></i>
              <span>Blink & Micro-tremor Validation: Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 4: INCIDENT RISK MATRIX -->
    <div id="tab-incidents" class="tab-content">
      <div class="workbench-card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-extrabold text-white flex items-center gap-2">
            <i class="fas fa-chart-pie text-rose-400"></i> Facility Security Threat Assessment
          </h3>
          <span class="text-xs text-emerald-400 font-mono font-bold">DEFCON 4 — LOW THREAT LEVEL</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div class="text-xs font-bold text-emerald-400 mb-1">PERIMETER BREACH RISK</div>
            <div class="text-sm font-bold text-white mb-2">0.2% (Very Low)</div>
            <p class="text-[11px] text-slate-300">Infrared sensors and PTZ cameras patrolling 360-degree perimeter.</p>
          </div>

          <div class="p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div class="text-xs font-bold text-emerald-400 mb-1">INTERNAL ACCESS AUDIT</div>
            <div class="text-sm font-bold text-white mb-2">0 Unauthorized Swipes</div>
            <p class="text-[11px] text-slate-300">All server room and vault entries matched biometric identities.</p>
          </div>

          <div class="p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div class="text-xs font-bold text-emerald-400 mb-1">EMERGENCY RESPONSE TIME</div>
            <div class="text-sm font-bold text-white mb-2">42 Seconds Average</div>
            <p class="text-[11px] text-slate-300">On-site rapid response armed guards stationed at Gate 1 and Gate 3.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 5: GUARD PATROL GPS MESH -->
    <div id="tab-dispatch" class="tab-content">
      <div class="workbench-card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-extrabold text-white flex items-center gap-2">
            <i class="fas fa-location-crosshairs text-rose-400"></i> Guard Patrol GPS Mesh & RFID Checkpoints
          </h3>
          <span class="text-xs text-emerald-400 font-mono font-bold">Patrol Route A Active</span>
        </div>

        <div class="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3 font-mono text-xs">
          <div class="text-slate-300">PATROL SQUAD: Guard Alpha (Officer S. Rao) • GPS Tracked</div>
          <div class="text-emerald-400">✓ CHECKPOINT 1: North Substation RFID Tag - Scanned at 02:15 AM</div>
          <div class="text-emerald-400">✓ CHECKPOINT 2: West Logistics Gate RFID Tag - Scanned at 02:30 AM</div>
          <div class="text-sky-400">▶ CHECKPOINT 3: Diesel Generator Yard - Due in 8 Minutes</div>
          <div class="text-slate-400 pt-2 border-t border-white/10">SOS PANIC BUTTON STATUS: Operational & Test Pings Acknowledged</div>
        </div>
      </div>
    </div>
    """

    script_content = """
    let nightVision = false;
    let cctvAnimId = null;

    function toggleNightVision() {
      nightVision = !nightVision;
      const lbl = document.getElementById('nv-label');
      if (lbl) lbl.textContent = nightVision ? 'IR Night Vision: ON' : 'IR Night Vision: OFF';
    }

    function initCctvCanvas() {
      const canvas = document.getElementById('cctv-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let t = 0;

      function render() {
        t += 0.04;
        const w = canvas.width;
        const h = canvas.height;

        // Background
        if (nightVision) {
          ctx.fillStyle = '#061a0e';
          ctx.fillRect(0, 0, w, h);
          // Green phosphorescent noise grid
          ctx.strokeStyle = 'rgba(34, 197, 94, 0.12)';
          ctx.lineWidth = 1;
          for (let x = 0; x < w; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
          for (let y = 0; y < h; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
        } else {
          ctx.fillStyle = '#0a0e1a';
          ctx.fillRect(0, 0, w, h);
          // Dark surveillance grid
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
          ctx.lineWidth = 1;
          for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
          for (let y = 0; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
        }

        // Animated Vehicle / Pedestrian Tracking Target 1
        const x1 = (Math.sin(t * 0.7) * 0.35 + 0.5) * w;
        const y1 = (Math.cos(t * 0.5) * 0.2 + 0.55) * h;
        const bw1 = 90;
        const bh1 = 70;

        ctx.strokeStyle = nightVision ? '#22c55e' : '#38bdf8';
        ctx.lineWidth = 2;
        ctx.strokeRect(x1 - bw1 / 2, y1 - bh1 / 2, bw1, bh1);

        // Corner ticks
        ctx.fillStyle = nightVision ? '#22c55e' : '#38bdf8';
        ctx.fillRect(x1 - bw1 / 2 - 2, y1 - bh1 / 2 - 2, 8, 3);
        ctx.fillRect(x1 - bw1 / 2 - 2, y1 - bh1 / 2 - 2, 3, 8);
        ctx.fillRect(x1 + bw1 / 2 - 6, y1 - bh1 / 2 - 2, 8, 3);
        ctx.fillRect(x1 + bw1 / 2 - 1, y1 - bh1 / 2 - 2, 3, 8);

        // Label Tag
        ctx.fillStyle = nightVision ? 'rgba(34, 197, 94, 0.2)' : 'rgba(56, 189, 248, 0.2)';
        ctx.fillRect(x1 - bw1 / 2, y1 - bh1 / 2 - 18, bw1, 16);
        ctx.fillStyle = nightVision ? '#86efac' : '#e0f2fe';
        ctx.font = '10px monospace';
        ctx.fillText('ID: AMIT S. 99.4%', x1 - bw1 / 2 + 4, y1 - bh1 / 2 - 6);

        // Secondary Target: Vehicle Gate
        const x2 = w * 0.78;
        const y2 = h * 0.42;
        ctx.strokeStyle = nightVision ? '#86efac' : '#10b981';
        ctx.strokeRect(x2 - 50, y2 - 35, 100, 70);
        ctx.fillStyle = nightVision ? 'rgba(34, 197, 94, 0.2)' : 'rgba(16, 185, 129, 0.2)';
        ctx.fillRect(x2 - 50, y2 - 51, 100, 16);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('ANPR: DL-01-AB', x2 - 46, y2 - 39);

        // Crosshair Center
        ctx.strokeStyle = nightVision ? 'rgba(34, 197, 94, 0.4)' : 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.moveTo(w / 2 - 15, h / 2); ctx.lineTo(w / 2 + 15, h / 2);
        ctx.moveTo(w / 2, h / 2 - 15); ctx.lineTo(w / 2, h / 2 + 15);
        ctx.stroke();

        // HUD Timestamp
        ctx.fillStyle = nightVision ? '#86efac' : 'rgba(255,255,255,0.7)';
        ctx.font = '10px monospace';
        ctx.fillText(`EDGE_FPS: 59.8 | LATENCY: 22ms | SENSORS: 4/4 OK`, 12, h - 14);

        cctvAnimId = requestAnimationFrame(render);
      }
      render();
    }

    function generateLegalFir() {
      const offense = document.getElementById('fir-offense').value;
      const t = document.getElementById('fir-time').value;
      const p = document.getElementById('fir-place').value;
      const stmt = document.getElementById('fir-statement').value;
      const consoleEl = document.getElementById('fir-console');

      consoleEl.innerHTML = `<span class="text-yellow-400">>> [LEGAL CORE] Structuring formal First Information Report under BNSS Section 173...</span>\\n>> Binding digital CCTV evidence hashes and legal clauses...`;

      setTimeout(() => {
        consoleEl.innerHTML = `========================================================================
FIRST INFORMATION REPORT (DRAFT)
[Under Section 173 of Bharatiya Nagarik Suraksha Sanhita, 2023 / 2024]
========================================================================
POLICE STATION JURISDICTION: Cyber & Crime Branch, Sector 9
DISTRICT: Central Industrial Division
DATE & TIME OF REPORT: ${new Date().toLocaleString()}

1. DETAILS OF COMPLAINANT:
   Name: Vikram Kulkarni (Chief Security Officer)
   Entity: Sevenseed Rakshak Autonomous Facility Infrastructure

2. DETAILS OF OCCURRENCE:
   Date & Time: ${t}
   Place of Occurrence: ${p}

3. APPLICABLE STATUTORY SECTIONS:
   • Bharatiya Nyaya Sanhita (BNS), 2023 - Section 329(3) [Criminal Trespass at Night]
   • Section 303(2) [Attempted Theft of Corporate Property]
   • Bharatiya Sakshya Adhiniyam, 2023 - Section 61 (Admissibility of Electronic Records)

4. STATEMENT OF FACTS:
   "${stmt}"

5. DIGITAL FORENSIC EVIDENCE ATTACHMENTS:
   ✓ 4K CCTV Video Hash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
   ✓ Infrared Sensor Log Timestamp: 02:41:12 IST
   ✓ Automated Incident Dispatch Log #INC-2026-9908

STATUS: VERIFIED & READY FOR SUBMISSION TO STATION HOUSE OFFICER (SHO).`;
      }, 500);
    }

    function downloadFirDocx() {
      const text = document.getElementById('fir-console').innerText || document.getElementById('fir-console').textContent;
      const blob = new Blob([text], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'BNS_2024_FIR_Draft_' + Date.now() + '.txt';
      a.click();
    }

    window.addEventListener('DOMContentLoaded', () => {
      initCctvCanvas();
    });
    """

    return nav_items, stats_items, main_content, script_content
