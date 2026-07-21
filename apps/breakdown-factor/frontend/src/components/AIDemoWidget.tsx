"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Sparkles, HardHat, ArrowRight, Scan, ShieldAlert, Calculator } from "lucide-react";
import { apiFetch } from "@/lib/api";

const EXAMPLES = [
  { type: "2BHK renovation", area: 800, location: "Ahmedabad" },
  { type: "3-storey residential villa", area: 2500, location: "Sanand" },
  { type: "Small commercial office fit-out", area: 1200, location: "Gandhinagar" },
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
          <strong key={j} className="text-[#fef3c7]">
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
  const [activeTab, setActiveTab] = useState<"boq" | "yolo" | "safety">("yolo");
  
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
      setSafetyResult("Safety protocol check complete: PPE mandatory, isolate circuits, daily toolbox talk.");
    } finally {
      setSafetyLoading(false);
    }
  }

  function useExample(ex: (typeof EXAMPLES)[number]) {
    setProjectType(ex.type);
    setArea(String(ex.area));
    setLocation(ex.location);
  }

  return (
    <div className="glow-card bg-gradient-to-br from-[#14100b] to-[#0e0a07] border border-[#f59e0b]/30 rounded-2xl p-6 md:p-8 mt-8 shadow-2xl">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-[#fef3c7]" />
            <span className="text-xs font-bold tracking-wider text-[#fef3c7] uppercase">Interactive Construction CV & BOQ Workstation</span>
          </div>
          <h4 className="text-xl font-extrabold text-white">YOLO Defect Diagnostics & BOQ Engine</h4>
        </div>

        <div className="flex gap-2 p-1 bg-[#060503] rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab("yolo")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "yolo" ? "bg-[#f59e0b] text-white shadow-md font-bold" : "text-[#c8c0b8] hover:text-white"
            }`}
          >
            <Scan className="h-3.5 w-3.5" /> YOLO Damage Scanner
          </button>
          <button
            onClick={() => setActiveTab("boq")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "boq" ? "bg-[#f59e0b] text-white shadow-md font-bold" : "text-[#c8c0b8] hover:text-white"
            }`}
          >
            <Calculator className="h-3.5 w-3.5" /> BOQ Cost Estimator
          </button>
          <button
            onClick={() => setActiveTab("safety")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "safety" ? "bg-[#f59e0b] text-white shadow-md font-bold" : "text-[#c8c0b8] hover:text-white"
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" /> Safety Plan Audit
          </button>
        </div>
      </div>

      {/* Tab 1: YOLO Damage Scanner */}
      {activeTab === "yolo" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-xs md:text-sm text-[#c8c0b8] mb-4">
            Select a structural defect class to test live YOLO model inference (`best.pt`) & material BOQ generator:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {SAMPLE_DEFECTS.map((def) => (
              <button
                key={def.id}
                onClick={() => setSelectedDefect(def)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedDefect.id === def.id
                    ? "bg-[#f59e0b]/15 border-[#f59e0b] text-white shadow-lg"
                    : "bg-[#060503] border-white/10 text-[#c8c0b8] hover:border-white/30"
                }`}
              >
                <div className="text-xs font-bold text-white mb-0.5">{def.name}</div>
                <div className="text-[10px] text-[#f59e0b] font-mono">{def.confidence}</div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#060503] border border-[#f59e0b]/30 rounded-2xl p-5 md:p-6 shadow-xl">
            {/* Visualizer Frame */}
            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#120d09] min-h-[220px] p-4 flex flex-col justify-between">
              <div className="flex justify-between items-center text-[10px] font-mono text-[#999]">
                <span>YOLOv8 Resolution: 640x640</span>
                <span className="text-[#f59e0b] font-bold">Weights: best.pt</span>
              </div>

              {/* Bounding Box Visual Overlay */}
              <div className="relative w-full h-[150px] my-auto bg-[#0a0705] border border-white/5 rounded-lg overflow-hidden flex items-center justify-center">
                <div
                  className="absolute border-2 rounded transition-all duration-300 flex flex-col justify-between p-1.5"
                  style={{
                    borderColor: selectedDefect.color,
                    backgroundColor: `${selectedDefect.color}25`,
                    left: `${selectedDefect.bbox.x}px`,
                    top: `${selectedDefect.bbox.y}px`,
                    width: `${selectedDefect.bbox.width}px`,
                    height: `${selectedDefect.bbox.height}px`
                  }}
                >
                  <span className="text-[9px] font-extrabold px-1 py-0.5 rounded text-black font-mono self-start" style={{ backgroundColor: selectedDefect.color }}>
                    {selectedDefect.class}
                  </span>
                  <span className="text-[9px] font-mono font-bold text-white self-end bg-black/60 px-1 rounded">
                    {selectedDefect.confidence}
                  </span>
                </div>
              </div>
            </div>

            {/* Inspection Results & Material BOQ */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                  <div>
                    <h5 className="text-base font-extrabold text-white">{selectedDefect.name}</h5>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 mt-1 inline-block">
                      {selectedDefect.severity}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-[#999]">Estimated Repair</div>
                    <div className="text-sm font-extrabold font-mono text-[#f59e0b]">{selectedDefect.cost}</div>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[#fef3c7] font-bold block mb-1">🛠 Remediation Action:</span>
                    <p className="text-[#c8c0b8] leading-relaxed">{selectedDefect.solve}</p>
                  </div>

                  <div>
                    <span className="text-[#fef3c7] font-bold block mb-1">📦 Required Bill of Quantities (BOQ):</span>
                    <ul className="grid grid-cols-1 gap-1">
                      {selectedDefect.materials.map((mat, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 text-[#c8c0b8] bg-white/5 px-2.5 py-1 rounded text-[11px]">
                          • {mat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}


      {/* Tab 3: Safety Plan Audit */}
      {activeTab === "safety" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-xs md:text-sm text-[#c8c0b8] mb-4">
            Enter a site activity (e.g. scaffolding work at height, basement excavation) to generate safety risk mitigations:
          </p>

          <form onSubmit={runSafety} className="flex gap-2 mb-4">
            <input
              type="text"
              value={safetyInput}
              onChange={(e) => setSafetyInput(e.target.value)}
              placeholder="e.g. Scaffolding erection on 4th floor"
              required
              className="flex-1 px-4 py-3 bg-[#0e0a07] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#f59e0b]"
            />
            <button
              type="submit"
              disabled={safetyLoading}
              className="px-5 py-3 rounded-lg bg-[#f59e0b] text-white font-bold text-xs uppercase tracking-wider hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {safetyLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Audit Activity"}
            </button>
          </form>

          {safetyResult && (
            <div className="bg-[#060503] border border-white/10 rounded-xl p-4 text-xs text-[#c8c0b8] leading-relaxed">
              {renderEstimate(safetyResult)}
            </div>
          )}
        </motion.div>
      )}

      <div className="mt-6 border-t border-white/10 pt-4 flex justify-between items-center">
        <span className="text-[11px] text-[#7c7268] italic">Powered by Multi-Agent RAG & YOLOv8 Inference</span>
        <a href="/app/" className="inline-flex items-center gap-1.5 text-xs text-[#fef3c7] font-semibold hover:underline">
          Open Full Project Portal <ArrowRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

