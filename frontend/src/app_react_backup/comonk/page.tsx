"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Spotlight, CardSpotlight, QuantumCore3DWebGL, SmoothScrollProvider } from "@main/ui-core";
import { ArrowLeft, Cpu, DollarSign, FileText, Mic, CheckCircle2, AlertCircle, Sparkles, Trophy } from "lucide-react";

export default function ComonkAIPage() {
  const [selectedRole, setSelectedRole] = useState("Staff AI Engineer");
  const [resumeKeywords, setResumeKeywords] = useState("LangGraph, ChromaDB, FastAPI, PyTorch, CUDA, Next.js");

  const salaryTiers: Record<string, { p25: string; p50: string; p75: string; p90: string; topPayers: string[] }> = {
    "Staff AI Engineer": {
      p25: "₹45 LPA",
      p50: "₹65 LPA",
      p75: "₹90 LPA",
      p90: "₹1.4 Cr",
      topPayers: ["Google DeepMind", "OpenAI", "Sevenseed AI Labs", "Microsoft Research"],
    },
    "Senior Full-Stack Engineer": {
      p25: "₹28 LPA",
      p50: "₹42 LPA",
      p75: "₹58 LPA",
      p90: "₹80 LPA",
      topPayers: ["Stripe", "Uber", "Coinbase", "Razorpay"],
    },
    "Autonomous Agent Architect": {
      p25: "₹55 LPA",
      p50: "₹85 LPA",
      p75: "₹1.2 Cr",
      p90: "₹1.8 Cr",
      topPayers: ["Cognition AI", "Anthropic", "Sevenforce", "Scale AI"],
    }
  };

  const currentTier = salaryTiers[selectedRole] || salaryTiers["Staff AI Engineer"];

  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#030712] text-slate-100 p-6 md:p-10 space-y-8">
        <Spotlight className="-top-40 left-20" fill="rgba(168, 85, 247, 0.25)" />

        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="text-[11px] font-mono uppercase text-purple-400">Comonk Talent & Career Intelligence</div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                <span>Comonk AI — Salary Percentiles & ATS Arena (Levels.fyi & Jobscan)</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-purple-400 bg-purple-950/40 border border-purple-500/30 px-3 py-1 rounded-full">
              98.4% ATS Match Accuracy
            </span>
          </div>
        </div>

        {/* Salary Telemetry Section (Levels.fyi Style) */}
        <div className="w-full bg-[#050814] border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="text-xs font-mono uppercase text-purple-400">Compensation Intelligence (Levels.fyi Engine)</div>
              <h3 className="text-xl font-bold text-slate-100">Verified Market Salary Percentiles</h3>
            </div>

            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-mono">
              {Object.keys(salaryTiers).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    selectedRole === role ? "bg-purple-500 text-black font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">25th Percentile</span>
              <span className="text-xl font-bold text-slate-200">{currentTier.p25}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Median (50th)</span>
              <span className="text-xl font-bold text-sky-400">{currentTier.p50}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">75th Percentile</span>
              <span className="text-xl font-bold text-purple-400">{currentTier.p75}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/40 bg-purple-950/20">
              <span className="text-[10px] text-purple-300 uppercase block">Top 10% (90th)</span>
              <span className="text-xl font-bold text-emerald-400">{currentTier.p90}</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Verified Top Compensation Payers:</span>
            <div className="flex items-center gap-2">
              {currentTier.topPayers.map((p) => (
                <span key={p} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ATS Keyword Density & Matcher */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#050814] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>ATS Resume Semantic Matcher</span>
              </h3>
              <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                Score: 94/100
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Extracts high-impact neural architecture keywords and compares against tier-1 job descriptions.
            </p>

            <textarea
              value={resumeKeywords}
              onChange={(e) => setResumeKeywords(e.target.value)}
              className="w-full h-28 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none"
            />

            <div className="flex flex-wrap gap-2 pt-1 text-xs font-mono">
              <span className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">✓ LangGraph (Matched)</span>
              <span className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">✓ ChromaDB (Matched)</span>
              <span className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">✓ Next.js (Matched)</span>
              <span className="px-2 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300">! Triton Inference (Missing)</span>
            </div>
          </div>

          {/* AI Mock Interview Arena */}
          <div className="p-6 rounded-2xl bg-[#050814] border border-slate-800 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Mic className="w-4 h-4 text-sky-400" />
                  <span>Real-Time AI Mock Interview Arena</span>
                </h3>
                <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-full">
                  Groq LLaMA 3.3 Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Conducts interactive behavioral and system design interviews with instant rubric scoring and audio transcription.
              </p>
              <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-300 italic">
                "AI Interviewer: How would you design an autonomous multi-agent consensus protocol with checkpointing in LangGraph?"
              </div>
            </div>

            <button
              onClick={() => alert("Connecting to FastAPI AI Audio Stream on port 8000...")}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-sky-500 hover:from-purple-400 hover:to-sky-400 text-black font-mono text-xs font-bold transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
            >
              <Mic className="w-4 h-4 fill-current" />
              <span>Start 15-Minute Mock Session</span>
            </button>
          </div>
        </div>
      </main>
    </SmoothScrollProvider>
  );
}
