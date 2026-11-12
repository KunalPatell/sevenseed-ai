"use client";

import React, { useState } from "react";
import { Terminal, GitPullRequest, CheckCircle2, Play } from "lucide-react";

export function DevinVirtualTerminal() {
  const [logs, setLogs] = useState<string[]>([
    "$ devin init --repo main/sevenseed",
    "Initializing autonomous environment in isolated Docker sandbox...",
    "Cloning repository branch: feature/modern-ui",
    "Running test assertions: 42 passed in 1.4s."
  ]);
  const [prCreated, setPrCreated] = useState(false);

  const runTest = () => {
    setLogs((prev) => [
      ...prev,
      "$ pytest tests/ -v",
      "tests/test_agents.py::test_orchestrator PASSED",
      "tests/test_waterfall.py::test_ruv_calc PASSED",
      "✨ All tests passed! Ready to submit pull request."
    ]);
  };

  const createPR = () => {
    setPrCreated(true);
    setLogs((prev) => [
      ...prev,
      "$ devin create-pr --title 'feat: complete React & Node migration'",
      "🔗 Pull Request #142 created: https://github.com/sevenseed/platform/pull/142"
    ]);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-8 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Terminal className="w-4 h-4" /> Autonomous Software Engineer Workspace
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Devin AI Sandboxed Terminal
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
          Sandboxed developer environment executing shell commands, git diff inspections, and automated PR dispatches.
        </p>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
        <div className="bg-slate-900/80 px-4 py-2.5 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span className="text-slate-400 ml-2">devin@container:~#</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={runTest}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-sans font-semibold flex items-center gap-1 transition"
            >
              <Play className="w-3 h-3" /> Run Pytest
            </button>
            <button
              onClick={createPR}
              disabled={prCreated}
              className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded text-[11px] font-sans font-semibold flex items-center gap-1 transition"
            >
              <GitPullRequest className="w-3 h-3" /> {prCreated ? "PR #142 Merged" : "Create PR"}
            </button>
          </div>
        </div>

        <div className="p-4 text-slate-300 space-y-1.5 h-64 overflow-y-auto leading-relaxed">
          {logs.map((log, idx) => (
            <div key={idx} className={log.startsWith("$") ? "text-cyan-400 font-bold" : "text-slate-400"}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
