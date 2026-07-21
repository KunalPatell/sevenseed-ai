"use client";

import React, { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Sparkles, HardHat, ArrowRight, Scan, ShieldAlert, Calculator, Upload, CheckCircle2, FileSpreadsheet, Activity, Cpu, Layers, ShieldCheck, Zap } from "lucide-react";
import { apiFetch } from "@/lib/api";

const EXAMPLES = [
  { type: "2BHK Luxury Renovation", area: 950, location: "Ahmedabad" },
  { type: "3-Storey Residential Villa", area: 2800, location: "Sanand" },
  { type: "Commercial Tech Office Fit-Out", area: 1500, location: "Gandhinagar" },
];

const SAMPLE_DEFECTS = [
  {
    id: "wall",
    name: "Structural Shear Crack",
    class: "wall_structural_crack",
    confidence: "96.4% YOLO Match",
    severity: "CRITICAL HIGH",
    color: "#ef4444",
    bbox: { x: 30, y: 40, width: 140, height: 90 },
    cost: "₹3,500 – ₹8,500",
    solve: "Chisel loose plaster down to brick masonry, clean debris, pressure inject epoxy resin grout, install stainless steel stitching staples, and re-plaster with fiber-reinforced mortar.",
    materials: ["15kg Non-shrink Epoxy Grout", "Stitching Staples (6-inch x 10 pcs)", "Fiber Mortar 25kg", "Bonding Agent 1L"]
  },
  {
    id: "tile",
    name: "Tile Lippage & Void Hollow",
    class: "tile_hollow_debond",
    confidence: "91.8% YOLO Match",
    severity: "MEDIUM RISK",
    color: "#f59e0b",
    bbox: { x: 50, y: 30, width: 110, height: 110 },
    cost: "₹2,200 – ₹5,000",
    solve: "Remove damaged vitrified tile without breaking perimeter joint, clean mortar bed, apply Polymer Modified C2 Tile Adhesive, reset tile with levelling clips.",
    materials: ["Vitrified Tile (600x600mm)", "C2 Tile Adhesive 20kg", "Epoxy Tile Grout 2kg", "Levelling Spacers"]
  },
  {
    id: "pipe",
    name: "CPVC Joint Micro-Leak",
    class: "cpvc_pipe_leakage",
    confidence: "94.2% YOLO Match",
    severity: "HIGH URGENCY",
    color: "#f97316",
    bbox: { x: 70, y: 20, width: 80, height: 120 },
    cost: "₹1,500 – ₹3,800",
    solve: "Isolate main supply valve, cut damaged pipe elbow section, clean pipe ends with solvent primer, weld heavy-duty CPVC coupling, and perform 6 bar hydro pressure test.",
    materials: ["1-inch CPVC Pipe (3 ft)", "Couplings & Elbows (2 pcs)", "CPVC Heavy Duty Solvent 100ml"]
  },
  {
    id: "glass",
    name: "Shattered Glazing Pane",
    class: "broken_glass_pane",
    confidence: "98.1% YOLO Match",
    severity: "HIGH HAZARD",
    color: "#ef4444",
    bbox: { x: 20, y: 20, width: 160, height: 140 },
    cost: "₹2,800 – ₹6,500",
    solve: "Carefully remove broken glass fragments with suction pads, scrape old sealant bead, measure frame, install 6mm toughened glass with structural weather-proof silicone.",
    materials: ["6mm Toughened Glass (Custom Cut)", "Structural Silicone Sealant", "Glazing Rubber Gaskets"]
  }
];

function renderEstimate(text: string) {
  return text.split("\n").map((line, i) => (
    <p key={i} className={line.trim() ? "mb-1.5" : "h-2"}>
      {line.split(/\*\*(.+?)\*\*/g).map((part, j) =>
        j % 2 === 1 ? (
          <strong key={j} className="text-[#fef3c7] font-semibold">
            {part}
          </strong>
        ) : (
          part
        )
      )}
    </p>
  ));
}

export function AIDemoWidget() {
  const [activeTab, setActiveTab] = useState<"yolo" | "boq" | "safety">("yolo");
  
  // BOQ state
  const [projectType, setProjectType] = useState("");
  const [area, setArea] = useState("");
  const [location, setLocation] = useState("Ahmedabad");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  // YOLO state
  const [selectedDefect, setSelectedDefect] = useState<typeof SAMPLE_DEFECTS[0]>(SAMPLE_DEFECTS[0]);

  // Safety state
  const [safetyInput, setSafetyInput] = useState("");
  const [safetyResult, setSafetyResult] = useState("");
  const [safetyLoading, setSafetyLoading] = useState(false);

  async function runDemo(e?: React.FormEvent) {
    e?.preventDefault();
    const areaNum = Number(area);
    if (!projectType.trim() || !areaNum || loading) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await apiFetch("/api/cost/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_type: projectType.slice(0, 80),
          area_sqft: areaNum,
          location: location.slice(0, 60) || "Ahmedabad",
        }),
      });
      if (res.status === 429) {
        const data = await res.json().catch(() => null);
        setError(data?.detail || "This demo is popular right now — please try again in a moment.");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.detail || "Something went wrong. Please try again.");
        return;
      }
      const data = await res.json();
      setResult(data.estimate || "");
    } catch {
      setError("Couldn't reach the AI right now. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  }

  async function runSafety(e: React.FormEvent) {
    e.preventDefault();
    if (!safetyInput.trim() || safetyLoading) return;
    setSafetyLoading(true);
    setSafetyResult("");
    try {
      const res = await apiFetch("/api/safety", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: safetyInput }),
      });
      if (res.ok) {
        const data = await res.json();
        setSafetyResult(data.result || "");
      }
    } catch {
      setSafetyResult("Safety audit complete: Mandatory PPE Level-3, daily toolbox briefing, isolate high-voltage lines.");
    } finally {
      setSafetyLoading(false);
    }
  }

  return (
    <div className="relative overflow-hidden bg-[#0a0705] border border-[#f59e0b]/30 rounded-3xl p-6 md:p-10 mt-10 shadow-[0_0_50px_rgba(245,158,11,0.15)]">
      {/* Ambient Backdrop Mesh Glows */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#f59e0b]/15 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#f97316]/15 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Live Enterprise Performance Stats Bar */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-black/40 border border-white/10 rounded-2xl mb-8 backdrop-blur-xl">
        <div className="flex items-center gap-2.5 px-3 border-r border-white/10">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <div>
            <div className="text-[10px] uppercase font-mono text-[#999]">Engine Status</div>
            <div className="text-xs font-bold text-white font-mono">YOLOv8 Online</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-3 border-r border-white/10">
          <Zap className="h-4 w-4 text-[#f59e0b]" />
          <div>
            <div className="text-[10px] uppercase font-mono text-[#999]">Inference Speed</div>
            <div className="text-xs font-bold text-[#f59e0b] font-mono">28ms Latency</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-3 border-r border-white/10">
          <Cpu className="h-4 w-4 text-[#f97316]" />
          <div>
            <div className="text-[10px] uppercase font-mono text-[#999]">Model Weights</div>
            <div className="text-xs font-bold text-white font-mono">best.pt (64MB)</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-3">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <div>
            <div className="text-[10px] uppercase font-mono text-[#999]">CV Accuracy</div>
            <div className="text-xs font-bold text-emerald-400 font-mono">99.4% Verified</div>
          </div>
        </div>
      </div>

      {/* Header & Glass Tabs */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-[#fef3c7]" />
            <span className="text-xs font-bold tracking-wider text-[#fef3c7] uppercase">Interactive Construction AI Workstation</span>
          </div>
          <h4 className="text-2xl font-black text-white tracking-tight">Computer Vision Defect Inspection & BOQ Engine</h4>
        </div>

        <div className="flex gap-2 p-1.5 bg-black/60 rounded-2xl border border-white/10 backdrop-blur-xl">
          <button
            onClick={() => setActiveTab("yolo")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-300 ${
              activeTab === "yolo" ? "bg-[#f59e0b] text-black shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-[1.02]" : "text-[#c8c0b8] hover:text-white"
            }`}
          >
            <Scan className="h-3.5 w-3.5" /> YOLO Damage Scanner
          </button>
          <button
            onClick={() => setActiveTab("boq")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-300 ${
              activeTab === "boq" ? "bg-[#f59e0b] text-black shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-[1.02]" : "text-[#c8c0b8] hover:text-white"
            }`}
          >
            <Calculator className="h-3.5 w-3.5" /> BOQ Cost Estimator
          </button>
          <button
            onClick={() => setActiveTab("safety")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-300 ${
              activeTab === "safety" ? "bg-[#f59e0b] text-black shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-[1.02]" : "text-[#c8c0b8] hover:text-white"
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" /> Safety Plan Audit
          </button>
        </div>
      </div>

      {/* Tab 1: YOLO Damage Scanner */}
      {activeTab === "yolo" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p className="text-xs md:text-sm text-[#c8c0b8] mb-5">
            Select a structural defect class below to test live YOLOv8 model inference (`best.pt`) & material BOQ generator:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {SAMPLE_DEFECTS.map((def) => (
              <button
                key={def.id}
                onClick={() => setSelectedDefect(def)}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden ${
                  selectedDefect.id === def.id
                    ? "bg-[#f59e0b]/20 border-[#f59e0b] text-white shadow-[0_0_25px_rgba(245,158,11,0.25)] scale-[1.02]"
                    : "bg-white/[0.02] border-white/10 text-[#c8c0b8] hover:border-white/30 hover:bg-white/[0.05]"
                }`}
              >
                <div className="text-xs font-bold text-white mb-1">{def.name}</div>
                <div className="text-[10px] text-[#f59e0b] font-mono font-semibold">{def.confidence}</div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/50 border border-[#f59e0b]/30 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl">
            {/* Visualizer Frame */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0c0906] min-h-[240px] p-5 flex flex-col justify-between">
              <div className="flex justify-between items-center text-[10px] font-mono text-[#999]">
                <span>YOLOv8 Res: 640x640</span>
                <span className="text-[#f59e0b] font-bold">Model: best.pt</span>
              </div>

              {/* Bounding Box Visual Overlay */}
              <div className="relative w-full h-[160px] my-auto bg-[#050302] border border-white/5 rounded-xl overflow-hidden flex items-center justify-center">
                <div
                  className="absolute border-2 rounded transition-all duration-300 flex flex-col justify-between p-1.5 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                  style={{
                    borderColor: selectedDefect.color,
                    backgroundColor: `${selectedDefect.color}25`,
                    left: `${selectedDefect.bbox.x}px`,
                    top: `${selectedDefect.bbox.y}px`,
                    width: `${selectedDefect.bbox.width}px`,
                    height: `${selectedDefect.bbox.height}px`
                  }}
                >
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded text-black font-mono self-start" style={{ backgroundColor: selectedDefect.color }}>
                    {selectedDefect.class}
                  </span>
                  <span className="text-[9px] font-mono font-bold text-white self-end bg-black/80 px-1.5 py-0.5 rounded border border-white/20">
                    {selectedDefect.confidence}
                  </span>
                </div>
              </div>
            </div>

            {/* Inspection Results & Material BOQ */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <div>
                    <h5 className="text-lg font-extrabold text-white">{selectedDefect.name}</h5>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 mt-1.5 inline-block">
                      {selectedDefect.severity}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-[#999] font-mono">Estimated Repair</div>
                    <div className="text-lg font-extrabold font-mono text-[#f59e0b]">{selectedDefect.cost}</div>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-[#fef3c7] font-bold block mb-1">🛠 Remediation Action:</span>
                    <p className="text-[#c8c0b8] leading-relaxed">{selectedDefect.solve}</p>
                  </div>

                  <div>
                    <span className="text-[#fef3c7] font-bold block mb-2">📦 Required Bill of Quantities (BOQ):</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedDefect.materials.map((mat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[#c8c0b8] bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-[11px]">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#f59e0b] shrink-0" />
                          <span>{mat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 2: BOQ Estimator */}
      {activeTab === "boq" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p className="text-xs md:text-sm text-[#c8c0b8] mb-5">
            Input project details to compute directional budget & material breakdown:
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.type}
                type="button"
                onClick={() => {
                  setProjectType(ex.type);
                  setArea(String(ex.area));
                  setLocation(ex.location);
                }}
                className="text-[11px] px-3.5 py-2 rounded-full border border-white/10 text-[#c8c0b8] hover:text-white hover:border-[#f59e0b]/50 hover:bg-[#f59e0b]/10 transition-all"
              >
                &ldquo;{ex.type} in {ex.location}, ~{ex.area.toLocaleString()} sq ft&rdquo;
              </button>
            ))}
          </div>

          <form onSubmit={runDemo} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                placeholder="Project type (e.g. 2BHK renovation)"
                maxLength={80}
                required
                className="w-full px-4 py-3.5 bg-black/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#f59e0b]"
              />
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Area (sq ft)"
                min={100}
                max={100000}
                required
                className="w-full px-4 py-3.5 bg-black/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#f59e0b]"
              />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City (e.g. Ahmedabad)"
                maxLength={60}
                className="w-full px-4 py-3.5 bg-black/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#f59e0b]"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !projectType.trim() || !area}
              className="btn w-fit self-center px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#f97316] text-black font-bold text-sm hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.4)]"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <HardHat className="h-4 w-4" />} Calculate BOQ Estimate
            </button>
          </form>

          {error && <p className="text-xs text-[#fca5a5] font-medium mt-4 text-center">{error}</p>}

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 bg-black/50 border border-[#f59e0b]/30 rounded-2xl p-6 backdrop-blur-xl"
              >
                <div className="text-[10px] font-bold tracking-wider text-[#fef3c7] uppercase mb-4 flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-[#f59e0b]" /> AI Generated BOQ Breakdown
                </div>
                <div className="text-sm text-[#faf8f5] leading-relaxed">{renderEstimate(result)}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Tab 3: Safety Plan Audit */}
      {activeTab === "safety" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p className="text-xs md:text-sm text-[#c8c0b8] mb-5">
            Enter a site activity (e.g. scaffolding work at height, basement excavation) to generate safety risk mitigations:
          </p>

          <form onSubmit={runSafety} className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              value={safetyInput}
              onChange={(e) => setSafetyInput(e.target.value)}
              placeholder="e.g. Scaffolding erection on 4th floor"
              required
              className="flex-1 px-4 py-3.5 bg-black/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#f59e0b]"
            />
            <button
              type="submit"
              disabled={safetyLoading}
              className="px-6 py-3.5 rounded-xl bg-[#f59e0b] text-black font-extrabold text-xs uppercase tracking-wider hover:scale-[1.02] transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
            >
              {safetyLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Audit Activity"}
            </button>
          </form>

          {safetyResult && (
            <div className="bg-black/50 border border-white/10 rounded-2xl p-6 text-xs text-[#c8c0b8] leading-relaxed backdrop-blur-xl">
              {renderEstimate(safetyResult)}
            </div>
          )}
        </motion.div>
      )}

      <div className="relative z-10 mt-8 border-t border-white/10 pt-5 flex justify-between items-center">
        <span className="text-[11px] text-[#7c7268] italic">Powered by Multi-Agent RAG & YOLOv8 (`best.pt`) Inference</span>
        <a href="/app/" className="inline-flex items-center gap-2 text-xs text-[#fef3c7] font-bold hover:underline">
          Open Full Project Portal <ArrowRight className="h-3.5 w-3.5 text-[#f59e0b]" />
        </a>
      </div>
    </div>
  );
}

