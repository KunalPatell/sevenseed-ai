"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Spotlight, CardSpotlight, SmoothScrollProvider } from "@main/ui-core";
import { ArrowLeft, Zap, Terminal, Play, CheckCircle2, GitBranch, Cpu, Activity, ArrowRight } from "lucide-react";

export default function SevenforcePage() {
  const [terminalLogs, setTerminalLogs] = useState([
    "[$] Initializing Sevenforce Autonomous Devin Agent...",
    "[$] Cloning repository: github.com/sevenseed/platform",
    "[$] Planning: 1. Scan codebase, 2. Construct DAG, 3. Run unit tests",
    "[$] Analysis: Detected 9 venture routes. Hoisting dependencies to @main/ui-core.",
    "[$] Compiling Next.js 15 App Router... [100% OK]",
    "[$] Ready for task instruction."
  ]);

  const [prompt, setPrompt] = useState("");

  const handleRunTask = () => {
    if (!prompt.trim()) return;
    setTerminalLogs((prev) => [
      ...prev,
      `> User Command: ${prompt}`,
      `[$] Agent Devin dispatched: Executing autonomous reasoning...`,
      `[$] Generated artifact: PR #42 approved with 0 regressions.`
    ]);
    setPrompt("");
  };

  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#030712] text-slate-100 p-6 md:p-10 space-y-8">
        <Spotlight className="-top-40 left-20" fill="rgba(245, 158, 11, 0.25)" />

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
              <div className="text-[11px] font-mono uppercase text-amber-400">Sevenforce Autonomous Studio</div>
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

        {/* Devin Terminal Simulator */}
        <div className="w-full h-[550px] bg-[#02050f] border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xl">
          {/* Window Chrome */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="ml-2 text-slate-300 font-semibold">devin-agent@sevenforce-core: ~</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-500">Node: v24.18.0</span>
              <span className="text-slate-500">Sandbox: Isolated</span>
            </div>
          </div>

          {/* Terminal Output */}
          <div className="flex-1 p-4 font-mono text-xs text-slate-300 overflow-y-auto space-y-2 selection:bg-amber-500/30">
            {terminalLogs.map((log, i) => (
              <div key={i} className={log.startsWith(">") ? "text-amber-400 font-bold" : "text-slate-300"}>
                {log}
              </div>
            ))}
          </div>

          {/* Input Prompt Box */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-3">
            <span className="text-amber-400 font-mono text-xs font-bold">$</span>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRunTask()}
              placeholder="Give instruction to Devin agent (e.g., 'Refactor Next.js App Router subpages with Aceternity Spotlight')..."
              className="flex-1 bg-transparent text-xs font-mono text-slate-200 focus:outline-none placeholder:text-slate-600"
            />
            <button
              onClick={handleRunTask}
              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Dispatch Agent</span>
            </button>
          </div>
        </div>
      </main>
    </SmoothScrollProvider>
  );
}
