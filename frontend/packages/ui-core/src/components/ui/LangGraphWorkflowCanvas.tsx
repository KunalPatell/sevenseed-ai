"use client";

import React, { useState } from "react";
import { GitBranch, Play, Cpu, ArrowDown, Check, Activity } from "lucide-react";

export function LangGraphWorkflowCanvas() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { name: "Supervisor Orchestrator", role: "Choreographs execution plan and delegates tasks.", icon: "👑" },
    { name: "Research & Retrieval Agent", role: "Looks up your documents and the web for the facts it needs.", icon: "🔍" },
    { name: "Code Synthesis Agent", role: "Writes sandboxed Python/TypeScript solution.", icon: "💻" },
    { name: "Automated QA & Unit Test Agent", role: "Runs assertions and coverage metrics.", icon: "🧪" },
    { name: "Executive Critic Node", role: "Reviews final output against user requirements.", icon: "⚖️" }
  ];

  const advanceWorkflow = () => {
    setActiveStep((s) => (s + 1) % steps.length);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-8 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <GitBranch className="w-4 h-4" /> How it works · illustration
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          How a team of AI agents works together
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
          Step through how Sevenforce splits a job between a planner, a researcher, a coder, a tester and a reviewer. This is an illustration, not a live run.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Visual Graph Diagram */}
        <div className="md:col-span-7 bg-slate-950/60 border border-slate-800 p-6 rounded-xl space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800 text-xs">
            <span className="font-bold text-white uppercase">State Graph Flow</span>
            <span className="font-mono text-indigo-400 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> Step {activeStep + 1} of {steps.length}
            </span>
          </div>

          <div className="space-y-3">
            {steps.map((st, idx) => {
              const isActive = activeStep === idx;
              const isDone = activeStep > idx;
              return (
                <div
                  key={st.name}
                  className={`p-4 rounded-xl border transition-all flex items-center gap-4 ${
                    isActive
                      ? "bg-indigo-500/15 border-indigo-500 text-white shadow-lg shadow-indigo-500/20 scale-[1.02]"
                      : isDone
                      ? "bg-slate-950/80 border-emerald-500/40 text-slate-300"
                      : "bg-slate-950/40 border-slate-800 text-slate-500"
                  }`}
                >
                  <span className="text-2xl">{st.icon}</span>
                  <div className="flex-1">
                    <div className="text-xs font-bold uppercase">{st.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{st.role}</div>
                  </div>
                  {isDone && <Check className="w-4 h-4 text-emerald-400" />}
                  {isActive && <span className="px-2 py-0.5 rounded bg-indigo-500 text-white font-mono text-[10px] uppercase font-bold animate-pulse">Running</span>}
                </div>
              );
            })}
          </div>

          <button
            onClick={advanceWorkflow}
            className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition mt-2"
          >
            <Play className="w-3.5 h-3.5" /> Step Next Node In Graph
          </button>
        </div>

        {/* Telemetry & State Inspector */}
        <div className="md:col-span-5 bg-slate-950 border border-slate-800 p-6 rounded-xl space-y-4 font-mono text-xs">
          <span className="text-xs font-bold text-slate-400 uppercase font-sans">This step</span>
          <div className="p-3 bg-slate-900 rounded-lg text-slate-300 space-y-1">
            <div><strong>Active Node:</strong> {steps[activeStep].name}</div>
            <div>{steps[activeStep].role}</div>
          </div>

        </div>
      </div>
    </div>
  );
}
