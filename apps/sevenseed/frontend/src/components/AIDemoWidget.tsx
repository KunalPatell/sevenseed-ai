"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Sparkles, ArrowRight, Lightbulb, Cpu, Grid } from "lucide-react";
import { apiFetch } from "@/lib/api";

const EXAMPLES = [
  { domain: "Rural healthcare", problem: "Clinics lose patients to missed follow-up appointments" },
  { domain: "College placements", problem: "Students don't know which skills recruiters actually want" },
  { domain: "Local pharmacies", problem: "Handwritten prescriptions cause dangerous dispensing errors" },
];

const VENTURES = [
  { name: "Breakdown Factor", tag: "AI Construction & Damage CV", status: "Active (YOLO v8)", port: "8001" },
  { name: "Decode Forest Pharmacy", tag: "AI HealthTech & Rx Reader", status: "Active (OCR RAG)", port: "8002" },
  { name: "AVP Emart", tag: "AI E-Commerce & Matrix", status: "Active (4-Store)", port: "8003" },
  { name: "AVP University", tag: "AI EdTech & Tutor", status: "Active (LangGraph)", port: "8004" },
  { name: "AVP Charitable Trust", tag: "AI Social Impact", status: "Active (80G)", port: "8005" },
  { name: "Sevenforce", tag: "AI Workforce Automation", status: "Active (7 Agents)", port: "8006" },
  { name: "Comonk Technology", tag: "AI Career Platform", status: "Active (ATS)", port: "8007" },
  { name: "Sevenseed Hub", tag: "AI Venture Incubator Studio", status: "Active (Core)", port: "8000" },
];

function renderIdea(text: string) {
  return text.split("\n").map((line, i) => (
    <p key={i} className={line.trim() ? "mb-1.5" : "h-2"}>
      {line.split(/\*\*(.+?)\*\*/g).map((part, j) =>
        j % 2 === 1 ? (
          <strong key={j} className="text-[#ddd6fe]">
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
  const [activeTab, setActiveTab] = useState<"ideate" | "arch" | "matrix">("ideate");

  // Ideate State
  const [domain, setDomain] = useState("");
  const [problem, setProblem] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  async function runDemo(e?: React.FormEvent) {
    e?.preventDefault();
    if (!domain.trim() || loading) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await apiFetch("/api/ideate/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domain.slice(0, 80), problem: problem.slice(0, 400) }),
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
      setResult(data.idea || "");
    } catch {
      setError("Couldn't reach the AI right now. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glow-card bg-gradient-to-br from-[#12121e] to-[#0d0d16] border border-[#8b5cf6]/25 rounded-2xl p-6 md:p-8 mt-8 shadow-2xl">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-[#8b5cf6]" />
            <span className="text-xs font-bold tracking-wider text-[#ddd6fe] uppercase">AI Venture Incubator Studio</span>
          </div>
          <h4 className="text-xl font-extrabold text-white">Sevenseed Studio Intelligence</h4>
        </div>

        <div className="flex gap-2 p-1 bg-[#08080f] rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab("ideate")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "ideate" ? "bg-[#8b5cf6] text-white shadow-md" : "text-[#9aa0b8] hover:text-white"
            }`}
          >
            <Lightbulb className="h-3.5 w-3.5" /> Venture Ideator
          </button>
          <button
            onClick={() => setActiveTab("arch")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "arch" ? "bg-[#8b5cf6] text-white shadow-md" : "text-[#9aa0b8] hover:text-white"
            }`}
          >
            <Cpu className="h-3.5 w-3.5" /> Agent Architecture
          </button>
          <button
            onClick={() => setActiveTab("matrix")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "matrix" ? "bg-[#8b5cf6] text-white shadow-md" : "text-[#9aa0b8] hover:text-white"
            }`}
          >
            <Grid className="h-3.5 w-3.5" /> 8-Venture Matrix
          </button>
        </div>
      </div>

      {/* Tab 1: Venture Ideator */}
      {activeTab === "ideate" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-xs md:text-sm text-[#9aa0b8] mb-5">
            Describe a business domain and problem — our multi-agent studio will draft an AI-native startup pitch:
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.domain}
                type="button"
                onClick={() => {
                  setDomain(ex.domain);
                  setProblem(ex.problem);
                }}
                className="text-[11px] px-3 py-1.5 rounded-full border border-white/10 text-[#9aa0b8] hover:text-white hover:border-[#8b5cf6]/50 hover:bg-[#8b5cf6]/10 transition-all"
              >
                &ldquo;{ex.domain}: {ex.problem}&rdquo;
              </button>
            ))}
          </div>

          <form onSubmit={runDemo} className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Business domain (e.g. rural healthcare)"
                maxLength={80}
                required
                className="w-full px-4 py-3 bg-[#0d0d16] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#8b5cf6]"
              />
              <input
                type="text"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="The problem (optional)"
                maxLength={400}
                className="w-full px-4 py-3 bg-[#0d0d16] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#8b5cf6]"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !domain.trim()}
              className="btn w-full sm:w-fit px-6 py-3 rounded-lg bg-gradient-to-r from-[#8b5cf6] to-[#10b981] text-white font-semibold text-sm hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate AI Venture Idea"}
            </button>
          </form>

          {error && <p className="text-xs text-[#fca5a5] font-medium mt-4 text-center">{error}</p>}

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-[#0d0d16] border border-[#8b5cf6]/25 rounded-xl p-5"
              >
                <div className="text-[10px] font-bold tracking-wider text-[#6ee7b7] uppercase mb-3">AI Generated Venture Concept</div>
                <div className="text-sm text-[#eeeef8] leading-relaxed">{renderIdea(result)}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Tab 2: Interactive Multi-Agent Architecture Graph */}
      {activeTab === "arch" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-xs md:text-sm text-[#9aa0b8] mb-4">
            Interactive multi-agent orchestration stack powering all 8 Sevenseed ventures:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#08080f] border border-[#8b5cf6]/30 rounded-2xl p-5 shadow-xl">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#8b5cf6]">LangGraph 0.2 Engine</span>
                <span className="text-[9px] bg-[#8b5cf6]/20 text-[#ddd6fe] px-1.5 py-0.5 rounded font-mono">Stateful Graph</span>
              </div>
              <p className="text-[11px] text-[#9aa0b8] leading-relaxed">
                Orchestrates autonomous multi-agent delegation across HR recruiters, SEO writers, and customer support.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#10b981]">ChromaDB Vector RAG</span>
                <span className="text-[9px] bg-[#10b981]/20 text-[#6ee7b7] px-1.5 py-0.5 rounded font-mono">Embedding Store</span>
              </div>
              <p className="text-[11px] text-[#9aa0b8] leading-relaxed">
                Sub-50ms semantic document retrieval powering medical prescription OCR, student Q&A, and resume matching.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#f59e0b]">YOLO v8 PyTorch</span>
                <span className="text-[9px] bg-[#f59e0b]/20 text-[#fef3c7] px-1.5 py-0.5 rounded font-mono">best.pt Weights</span>
              </div>
              <p className="text-[11px] text-[#9aa0b8] leading-relaxed">
                Real-time structural defect bounding-box detection & BOQ material repair cost generation.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 3: 8-Venture Matrix */}
      {activeTab === "matrix" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-xs md:text-sm text-[#9aa0b8] mb-4">
            Active 8 incubation ventures running on the shared Sevenseed stack:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {VENTURES.map((v, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#08080f] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-white truncate">{v.name}</div>
                  <div className="text-[10px] text-[#ddd6fe] mt-0.5">{v.tag}</div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[9px] bg-[#10b981]/20 text-[#6ee7b7] font-mono px-1.5 py-0.5 rounded font-bold">{v.status}</span>
                  <span className="text-[9px] text-[#9aa0b8] font-mono">:{v.port}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="mt-6 border-t border-white/10 pt-4 flex justify-between items-center">
        <span className="text-[11px] text-[#9aa0b8] italic">Incubating 8 AI startups under Sevenseed Group</span>
        <a href="/app/" className="inline-flex items-center gap-1.5 text-xs text-[#6ee7b7] font-semibold hover:underline">
          Open Studio Hub <ArrowRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

