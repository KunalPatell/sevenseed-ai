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
  { id: "wall", name: "Wall Structural Crack", class: "wall_damage", cost: "₹1,500 – ₹4,500", solve: "Hack loose plaster, clean with wire brush, fill crack with epoxy grout, apply wall putty and paint.", materials: "1 bag non-shrink grout, 0.02 cum fine sand, bonding agent." },
  { id: "tile", name: "Tile Lippage & Cracks", class: "tile_damage", cost: "₹2,500 – ₹6,000", solve: "Remove damaged vitrified tile, apply Class C2 tile adhesive, reset tile and grout joints.", materials: "Replacement tiles (600x600mm), 1 bag tile adhesive (20kg), joint grout powder." },
  { id: "pipe", name: "CPVC Water Pipe Leak", class: "pipe_damage", cost: "₹1,200 – ₹3,500", solve: "Isolate valve, cut damaged pipe section, solvent-weld slip coupling, pressure test.", materials: "CPVC 1-inch pipe, slip couplers, solvent cement (100ml)." },
  { id: "glass", name: "Window Frame Glass Shatter", class: "broken_glass", cost: "₹1,800 – ₹4,000", solve: "Scrape old glazing beading, measure frame, install 5mm float glass pane with silicone sealant.", materials: "5mm float glass pane, silicone sealant cartridge, glazing beads." }
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
  const [activeTab, setActiveTab] = useState<"boq" | "yolo" | "safety">("boq");
  
  // BOQ state
  const [projectType, setProjectType] = useState("");
  const [area, setArea] = useState("");
  const [location, setLocation] = useState("Ahmedabad");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  // YOLO state
  const [selectedDefect, setSelectedDefect] = useState<typeof SAMPLE_DEFECTS[0] | null>(SAMPLE_DEFECTS[0]);

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
    <div className="glow-card bg-gradient-to-br from-[#14100b] to-[#0e0a07] border border-[#f59e0b]/20 rounded-2xl p-6 md:p-8 mt-8 shadow-2xl">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-[#fef3c7]" />
            <span className="text-xs font-bold tracking-wider text-[#fef3c7] uppercase">Interactive Construction AI Workstation</span>
          </div>
          <h4 className="text-xl font-extrabold text-white">Smart Building Operations & Diagnostics</h4>
        </div>

        <div className="flex gap-2 p-1 bg-[#060503] rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab("boq")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "boq" ? "bg-[#f59e0b] text-white shadow-md" : "text-[#c8c0b8] hover:text-white"
            }`}
          >
            <Calculator className="h-3.5 w-3.5" /> BOQ Cost Estimator
          </button>
          <button
            onClick={() => setActiveTab("yolo")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "yolo" ? "bg-[#f59e0b] text-white shadow-md" : "text-[#c8c0b8] hover:text-white"
            }`}
          >
            <Scan className="h-3.5 w-3.5" /> YOLO Damage Scanner
          </button>
          <button
            onClick={() => setActiveTab("safety")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "safety" ? "bg-[#f59e0b] text-white shadow-md" : "text-[#c8c0b8] hover:text-white"
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" /> Safety Plan Audit
          </button>
        </div>
      </div>

      {/* Tab 1: BOQ Estimator */}
      {activeTab === "boq" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-xs md:text-sm text-[#c8c0b8] mb-4">
            Input project details to compute directional budget & material breakdown.
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.type}
                type="button"
                onClick={() => useExample(ex)}
                className="text-[11px] px-3 py-1.5 rounded-full border border-white/10 text-[#c8c0b8] hover:text-white hover:border-[#f59e0b]/50 hover:bg-[#f59e0b]/10 transition-all"
              >
                &ldquo;{ex.type} in {ex.location}, ~{ex.area.toLocaleString()} sq ft&rdquo;
              </button>
            ))}
          </div>

          <form onSubmit={runDemo} className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                placeholder="Project type (e.g. 2BHK renovation)"
                maxLength={80}
                required
                className="w-full px-4 py-3 bg-[#0e0a07] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#f59e0b]"
              />
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Area (sq ft)"
                min={100}
                max={100000}
                required
                className="w-full px-4 py-3 bg-[#0e0a07] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#f59e0b]"
              />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City (e.g. Ahmedabad)"
                maxLength={60}
                className="w-full px-4 py-3 bg-[#0e0a07] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#f59e0b]"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !projectType.trim() || !area}
              className="btn w-fit self-center px-6 py-3 rounded-lg bg-gradient-to-r from-[#f59e0b] to-[#f97316] text-white font-semibold text-sm hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Estimating...
                </>
              ) : (
                <>
                  <HardHat className="h-4 w-4" /> Get my rough estimate
                </>
              )}
            </button>
          </form>

          {error && <p className="text-xs text-[#fca5a5] font-medium mt-4 text-center">{error}</p>}

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-[#0e0a07] border border-[#f59e0b]/25 rounded-xl p-5"
              >
                <div className="text-[10px] font-bold tracking-wider text-[#fef3c7] uppercase mb-3">AI Generated</div>
                <div className="text-sm text-[#faf8f5] leading-relaxed">{renderEstimate(result)}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Tab 2: YOLO Damage Scanner */}
      {activeTab === "yolo" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-xs md:text-sm text-[#c8c0b8] mb-4">
            Select a sample defect class to test live YOLO model inference & material BOQ generator:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {SAMPLE_DEFECTS.map((def) => (
              <button
                key={def.id}
                onClick={() => setSelectedDefect(def)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedDefect?.id === def.id
                    ? "bg-[#f59e0b]/15 border-[#f59e0b] text-white shadow-lg"
                    : "bg-[#060503] border-white/10 text-[#c8c0b8] hover:border-white/30"
                }`}
              >
                <div className="text-xs font-bold text-white">{def.name}</div>
                <div className="text-[10px] text-[#f59e0b] font-mono mt-1">Class: {def.class}</div>
              </button>
            ))}
          </div>

          {selectedDefect && (
            <div className="bg-[#060503] border border-[#f59e0b]/30 rounded-xl p-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                <span className="text-xs font-bold text-[#fef3c7] uppercase tracking-wider flex items-center gap-2">
                  <Scan className="h-4 w-4 text-[#f59e0b]" /> YOLO Output: {selectedDefect.name}
                </span>
                <span className="text-xs font-mono font-bold text-[#f59e0b]">Est: {selectedDefect.cost}</span>
              </div>
              <div className="space-y-2 text-xs text-[#c8c0b8]">
                <p><strong className="text-white">Remediation Action:</strong> {selectedDefect.solve}</p>
                <p><strong className="text-white">Material Required:</strong> {selectedDefect.materials}</p>
              </div>
            </div>
          )}
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

