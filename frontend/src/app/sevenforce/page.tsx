"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Spotlight,
  CardSpotlight,
  AutonomousDevinOrb3D,
  TerminalScanlineBackground,
  BorderBeam,
  CyberButton,
  SmoothScrollProvider,
} from "@main/ui-core";
import {
  ArrowLeft,
  Zap,
  Terminal,
  Play,
  CheckCircle2,
  GitBranch,
  Cpu,
  Activity,
  ArrowRight,
  Bot,
  Sparkles,
  Command,
  Store,
  Calculator,
} from "lucide-react";

export default function SevenforcePage() {
  const [terminalLogs, setTerminalLogs] = useState([
    "[$] Initializing Sevenforce Autonomous Devin Agent...",
    "[$] Cloning repository: github.com/sevenseed/platform",
    "[$] Planning: 1. Scan codebase, 2. Construct DAG, 3. Run unit tests",
    "[$] Analysis: Detected 9 venture routes. Hoisting dependencies to @main/ui-core.",
    "[$] Compiling Next.js 15 App Router... [100% OK]",
    "[$] Ready for task instruction.",
  ]);

  const [prompt, setPrompt] = useState("");

  const handleRunTask = () => {
    if (!prompt.trim()) return;
    setTerminalLogs((prev) => [
      ...prev,
      `> User Command: ${prompt}`,
      `[$] Agent Devin dispatched: Executing autonomous reasoning...`,
      `[$] Generated artifact: PR #42 approved with 0 regressions.`,
    ]);
    setPrompt("");
  };

  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#0c0a09] text-slate-100 p-6 md:p-10 space-y-10 overflow-hidden font-sans">
        {/* Authentic CRT Scanline & Falling Amber Matrix Code Stream */}
        <TerminalScanlineBackground />
        <Spotlight className="-top-40 left-20" fill="rgba(245, 158, 11, 0.28)" />

        {/* Navigation Bar */}
        <div className="relative z-10 flex items-center justify-between border-b border-amber-900/40 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-amber-950/60 border border-amber-800/40 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="text-[11px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                <Command className="w-3.5 h-3.5 text-amber-400" />
                <span>Sevenforce Autonomous Studio</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <span>Sevenforce — Devin-Style Autonomous Code Agent (Cognition AI & LangGraph)</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Agent Cluster: Online (450k Tasks/Day)
            </span>
          </div>
        </div>

        {/* Hero Section with Dedicated 3D Devin Gyro Core */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-400 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack Autonomous Software Engineering · 0 Human Friction</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Self-Directed <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-400">
                Autonomous AI Employees
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Cognition Devin-style sandboxed execution environments combined with LangGraph cyclic multi-agent choreography state graphs. Real-time bash shells, browser testing, and git operations.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <CyberButton href="/sevenforce/workflows" icon={GitBranch} className="from-amber-600 via-orange-600 to-yellow-600 border-amber-400/30 shadow-amber-500/25">
                LangGraph State Machine
              </CyberButton>
              <CyberButton href="/sevenforce/devin-terminal" icon={Terminal} className="from-slate-800 via-zinc-800 to-amber-900 border-amber-600/40 shadow-amber-950/50">
                Devin Virtual Terminal
              </CyberButton>
              <CyberButton href="/sevenforce/marketplace" icon={Store} className="from-orange-600 via-amber-600 to-yellow-600 border-orange-400/30 shadow-orange-500/25">
                Agent Marketplace
              </CyberButton>
              <CyberButton href="/sevenforce/roi-calculator" icon={Calculator} className="from-yellow-600 via-amber-600 to-orange-700 border-yellow-400/30 shadow-yellow-500/25">
                Automation ROI Calculator
              </CyberButton>
            </div>
          </div>

          <div className="lg:col-span-5 w-full aspect-square relative flex items-center justify-center">
            <div className="absolute inset-0 bg-amber-500/15 blur-[100px] rounded-full pointer-events-none" />
            <AutonomousDevinOrb3D />
          </div>
        </div>

        {/* Live Devin Interactive Terminal Simulation with 21st.dev BorderBeam */}
        <div className="relative z-10 rounded-2xl overflow-hidden border border-amber-900/40 bg-zinc-950/90 backdrop-blur-xl p-6 space-y-4 shadow-2xl">
          <BorderBeam size={220} duration={8} colorFrom="#f59e0b" colorTo="#d97706" borderWidth={1.5} />

          <div className="flex items-center justify-between border-b border-amber-900/40 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/90 shadow-sm shadow-rose-500/50" />
              <div className="w-3 h-3 rounded-full bg-amber-500/90 shadow-sm shadow-amber-500/50" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/90 shadow-sm shadow-emerald-500/50" />
              <span className="text-xs font-mono text-slate-300 ml-2 font-bold">devin-agent@sevenforce-core: ~</span>
            </div>
            <span className="text-[11px] font-mono text-amber-400 font-medium">Node: v24.18.0 &bull; Sandbox: Isolated &bull; Memory: 64GB</span>
          </div>

          <div className="space-y-1 font-mono text-xs text-slate-300 min-h-[140px] bg-black/50 p-4 rounded-xl border border-zinc-900">
            {terminalLogs.map((log, idx) => (
              <div key={idx} className={log.startsWith(">") ? "text-amber-400 font-bold" : log.includes("PR #42") ? "text-emerald-400 font-bold" : "text-slate-400"}>
                {log}
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-2 border-t border-amber-900/40">
            <span className="text-amber-400 font-mono text-sm self-center font-bold">$</span>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRunTask()}
              placeholder="Give instruction to Devin agent (e.g., 'Refactor Next.js App Router subpages with Aceternity Spotlight')..."
              className="flex-1 bg-transparent border-none text-xs font-mono text-white focus:outline-none placeholder:text-slate-600"
            />
            <button
              onClick={handleRunTask}
              className="px-4 py-2 rounded-lg bg-amber-500 text-black font-bold text-xs font-mono hover:bg-amber-400 transition-colors flex items-center gap-1.5 shadow-lg shadow-amber-500/25"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Dispatch Agent</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 border-t border-amber-900/40 py-8 px-6 text-center text-xs font-mono text-slate-500">
          <p>© 2026 Sevenforce Autonomous Workforce · A Sevenseed AI Venture</p>
        </footer>
      </main>
    </SmoothScrollProvider>
  );
}
