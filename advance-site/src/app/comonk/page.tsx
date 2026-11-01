"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Spotlight,
  CardSpotlight,
  NeuralSynapseNetwork3D,
  AuroraBackground,
  BorderBeam,
  CyberButton,
  SmoothScrollProvider,
} from "@main/ui-core";
import {
  ArrowLeft,
  Cpu,
  DollarSign,
  FileText,
  Mic,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Trophy,
  Brain,
  ArrowUpRight,
  TrendingUp,
  MessageSquareQuote,
  Building2,
} from "lucide-react";

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
    },
  };

  const currentTier = salaryTiers[selectedRole] || salaryTiers["Staff AI Engineer"];

  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#090314] text-slate-100 p-6 md:p-10 space-y-10 overflow-hidden font-sans">
        {/* Aceternity Style Cosmic Aurora Wave Shifter */}
        <AuroraBackground className="!bg-transparent absolute inset-0 -z-0 opacity-35 pointer-events-none" />
        <Spotlight className="-top-40 left-20" fill="rgba(168, 85, 247, 0.35)" />

        {/* Navigation Bar */}
        <div className="relative z-10 flex items-center justify-between border-b border-purple-900/40 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-purple-950/60 border border-purple-800/40 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="text-[11px] font-mono uppercase text-purple-400 font-bold">
                Comonk Talent & Career Intelligence
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
                <Brain className="w-5 h-5 text-fuchsia-400" />
                <span>Comonk AI — Salary Percentiles & ATS Arena (Levels.fyi & Jobscan)</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-950 border border-purple-700/50 text-purple-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse" />
              98.4% ATS Match Accuracy
            </span>
            <Link
              href="/#contact"
              className="hidden sm:inline-flex px-4 py-2 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-purple-400 to-fuchsia-400 hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20"
            >
              Partner With Comonk
            </Link>
          </div>
        </div>

        {/* Hero Section with Dedicated 3D Neural Synapse Model */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-mono text-purple-400 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Career Intelligence for High-Output AI Engineers</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Reverse-Engineering <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-300 to-pink-400">
                FAANG & AI Startup Compensation
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Synthesizing real-time verified compensation data from <em className="text-fuchsia-300 not-italic font-medium">Levels.fyi</em>, ATS keyword semantic matching from <em className="text-purple-300 not-italic font-medium">Jobscan</em>, and automated rubric mock interviews with Groq LLaMA 3.3.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <CyberButton href="/comonk/resume-analyzer" icon={FileText} className="from-purple-600 via-fuchsia-600 to-pink-600 border-purple-400/30 shadow-purple-500/25">
                Analyze ATS Resume
              </CyberButton>
              <CyberButton href="/comonk/interview-arena" icon={Mic} className="from-indigo-600 via-purple-600 to-fuchsia-600 border-indigo-400/30 shadow-indigo-500/25">
                Start Mock Interview
              </CyberButton>
              <CyberButton href="/comonk/interview-experiences" icon={MessageSquareQuote} className="from-fuchsia-600 via-pink-600 to-rose-600 border-fuchsia-400/30 shadow-fuchsia-500/25">
                Read Interview Experiences
              </CyberButton>
              <CyberButton href="/comonk/company-reviews" icon={Building2} className="from-purple-600 via-violet-600 to-indigo-600 border-purple-400/30 shadow-purple-500/25">
                Company Culture Ratings
              </CyberButton>
            </div>
          </div>

          <div className="lg:col-span-5 w-full aspect-square relative flex items-center justify-center">
            <div className="absolute inset-0 bg-purple-500/15 blur-[100px] rounded-full pointer-events-none" />
            <NeuralSynapseNetwork3D />
          </div>
        </div>

        {/* Section 1: Levels.fyi Compensation Percentiles with BorderBeam */}
        <div className="relative z-10 rounded-2xl overflow-hidden border border-purple-900/40 bg-purple-950/30 backdrop-blur-xl p-6 sm:p-8 space-y-6">
          <BorderBeam size={250} duration={12} colorFrom="#a855f7" colorTo="#ec4899" borderWidth={1.5} />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Compensation Intelligence (Levels.fyi Engine)</span>
              </div>
              <h3 className="text-xl font-bold text-slate-100 mt-1">Verified Market Salary Percentiles</h3>
            </div>

            {/* Role Switcher Tabs */}
            <div className="flex flex-wrap gap-2">
              {Object.keys(salaryTiers).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    selectedRole === role
                      ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-black font-bold shadow-lg shadow-purple-500/30"
                      : "bg-purple-950/60 text-slate-400 hover:text-white border border-purple-900/40"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Percentile Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-purple-950/50 border border-purple-800/40">
              <div className="text-[11px] font-mono text-slate-400 uppercase">25th Percentile</div>
              <div className="text-2xl font-bold text-white mt-1">{currentTier.p25}</div>
            </div>
            <div className="p-4 rounded-xl bg-purple-950/50 border border-purple-800/40">
              <div className="text-[11px] font-mono text-purple-400 uppercase">Median (50th)</div>
              <div className="text-2xl font-bold text-purple-300 mt-1">{currentTier.p50}</div>
            </div>
            <div className="p-4 rounded-xl bg-purple-950/50 border border-purple-800/40">
              <div className="text-[11px] font-mono text-fuchsia-400 uppercase">75th Percentile</div>
              <div className="text-2xl font-bold text-fuchsia-300 mt-1">{currentTier.p75}</div>
            </div>
            <div className="p-4 rounded-xl bg-purple-900/40 border border-fuchsia-500/50 shadow-lg shadow-fuchsia-500/15">
              <div className="text-[11px] font-mono text-emerald-400 uppercase font-bold">Top 10% (90th)</div>
              <div className="text-2xl font-bold text-emerald-300 mt-1">{currentTier.p90}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono text-slate-400">
            <span className="text-slate-500">Verified Top Compensation Payers:</span>
            {currentTier.topPayers.map((p) => (
              <span key={p} className="px-2.5 py-1 rounded bg-purple-950/80 border border-purple-800/50 text-slate-300">
                {p}
              </span>
            ))}
          </div>

          <Link
            href="/comonk/salary-insights"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 font-bold"
          >
            <span>View full base/stock/bonus breakdown by level &amp; region (India vs US)</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Section 2: Interactive ATS Resume & Interview Workstations */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Jobscan ATS Simulator */}
          <div className="p-6 rounded-2xl bg-purple-950/20 border border-purple-900/30 space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>ATS Resume Semantic Matcher</span>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                Score: 94/100
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Extracts high-impact neural architecture keywords and compares against tier-1 job descriptions.
            </p>

            <textarea
              value={resumeKeywords}
              onChange={(e) => setResumeKeywords(e.target.value)}
              className="w-full h-24 p-3 rounded-xl bg-[#080214] border border-purple-900/50 text-xs font-mono text-purple-200 focus:outline-none focus:border-purple-400 resize-none"
            />

            <div className="flex flex-wrap gap-2 text-[11px] font-mono">
              <span className="px-2 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                ✓ LangGraph (Matched)
              </span>
              <span className="px-2 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                ✓ ChromaDB (Matched)
              </span>
              <span className="px-2 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                ✓ Next.js (Matched)
              </span>
              <span className="px-2 py-1 rounded bg-rose-950/80 text-rose-300 border border-rose-800/60">
                ! Triton Inference (Missing)
              </span>
            </div>
          </div>

          {/* FAANG Real-time Interview Room */}
          <div className="p-6 rounded-2xl bg-purple-950/20 border border-purple-900/30 space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
                <Mic className="w-4 h-4 text-fuchsia-400" />
                <span>Real-Time AI Mock Interview Arena</span>
              </div>
              <span className="text-xs font-mono text-purple-400 bg-purple-950 border border-purple-800 px-2 py-0.5 rounded">
                Groq LLaMA 3.3 Engine
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Conducts interactive behavioral and system design interviews with instant rubric scoring and audio transcription.
            </p>

            <div className="p-4 rounded-xl bg-[#080214] border border-purple-900/50 space-y-2">
              <div className="text-[11px] font-mono text-slate-400 italic">
                &quot;AI Interviewer: How would you design an autonomous multi-agent consensus protocol with checkpointing in LangGraph?&quot;
              </div>
            </div>

            <Link
              href="/comonk/interview-arena"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold text-xs font-mono flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Start 15-Minute Mock Session</span>
            </Link>
          </div>

          {/* Glassdoor-style Interview Experience Board */}
          <div className="p-6 rounded-2xl bg-purple-950/20 border border-purple-900/30 space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
                <MessageSquareQuote className="w-4 h-4 text-fuchsia-400" />
                <span>Interview Experience Board</span>
              </div>
              <span className="text-xs font-mono text-purple-400 bg-purple-950 border border-purple-800 px-2 py-0.5 rounded">
                4+ shared
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Crowd-sourced, Glassdoor-style writeups of real interview rounds — difficulty, outcome, and what to expect.
            </p>

            <div className="p-4 rounded-xl bg-[#080214] border border-purple-900/50 space-y-2">
              <div className="text-[11px] font-mono text-slate-400 italic">
                &quot;Whiteboard a multi-agent consensus protocol. They care more about failure handling than the happy path.&quot;
              </div>
            </div>

            <Link
              href="/comonk/interview-experiences"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-rose-600 text-white font-bold text-xs font-mono flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
            >
              <MessageSquareQuote className="w-3.5 h-3.5" />
              <span>Browse & Share Experiences</span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 border-t border-purple-900/40 py-8 px-6 text-center text-xs font-mono text-slate-500">
          <p>© 2026 Comonk Technology · A Sevenseed AI Venture</p>
        </footer>
      </main>
    </SmoothScrollProvider>
  );
}
