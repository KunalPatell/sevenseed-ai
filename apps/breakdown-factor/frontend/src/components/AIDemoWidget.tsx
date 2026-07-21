"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Sparkles, HardHat, ArrowRight } from "lucide-react";
import { apiFetch } from "@/lib/api";

const EXAMPLES = [
  { type: "2BHK renovation", area: 800, location: "Ahmedabad" },
  { type: "3-storey residential villa", area: 2500, location: "Sanand" },
  { type: "Small commercial office fit-out", area: 1200, location: "Gandhinagar" },
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
  const [projectType, setProjectType] = useState("");
  const [area, setArea] = useState("");
  const [location, setLocation] = useState("Ahmedabad");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

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

  function useExample(ex: (typeof EXAMPLES)[number]) {
    setProjectType(ex.type);
    setArea(String(ex.area));
    setLocation(ex.location);
  }

  return (
    <div className="glow-card bg-gradient-to-br from-[#14100b] to-[#0e0a07] border border-white/5 rounded-2xl p-6 md:p-8 mt-8">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="h-4 w-4 text-[#fef3c7]" />
        <span className="text-xs font-bold tracking-wider text-[#fef3c7] uppercase">Live demo · Real AI, no signup</span>
      </div>
      <h4 className="text-lg font-bold text-white mb-1">Get a rough cost & timeline direction</h4>
      <p className="text-xs md:text-sm text-[#c8c0b8] mb-1">
        Describe your project type, area, and city — our AI cost estimator will draft a live directional range.
      </p>
      <p className="text-[11px] text-[#7c7268] italic mb-5">
        This is a rough directional estimate only, not a binding quote. For a tender-ready BOQ, use the full Project Portal.
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
            className="w-full px-4 py-3 bg-[#0e0a07] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#f59e0b] sm:col-span-1"
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
          className="btn w-fit self-center px-6 py-3 rounded-lg bg-gradient-to-r from-[#f59e0b] to-[#f97316] text-white font-semibold text-sm hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
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

      {error && (
        <p className="text-xs text-[#fca5a5] font-medium mt-4 text-center">{error}</p>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6 bg-[#0e0a07] border border-[#f59e0b]/25 rounded-xl p-5"
          >
            <div className="text-[10px] font-bold tracking-wider text-[#fef3c7] uppercase mb-3">AI Generated</div>
            <div className="text-sm text-[#faf8f5] leading-relaxed">{renderEstimate(result)}</div>
            <a
              href="/app/"
              className="inline-flex items-center gap-1.5 text-xs text-[#fef3c7] font-semibold mt-4 hover:underline"
            >
              Get a full tender-ready BOQ in the Project Portal <ArrowRight className="h-3 w-3" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
