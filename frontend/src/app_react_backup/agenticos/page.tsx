import React from "react";
import Link from "next/link";
import { ArrowLeft, Cpu, Activity, Shield, Terminal } from "lucide-react";

export default function AgenticOSPage() {
  return (
    <main className="min-h-screen py-12 px-4 max-w-6xl mx-auto space-y-8">
      <div className="mb-4">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-teal-400 hover:text-teal-300 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Hub
        </Link>
      </div>

      <div className="text-center space-y-2">
        <span className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold uppercase">
          Agent Kernel OS
        </span>
        <h1 className="text-4xl font-extrabold text-white">AgenticOS Autonomous Control Plane</h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Real-time kernel monitoring agent memory heaps, process locks, and multi-agent IPC message queues.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-slate-400 flex items-center gap-2 font-sans font-bold text-white">
            <Cpu className="w-4 h-4 text-teal-400" /> Active Agent Processes
          </div>
          <div className="text-2xl font-black text-teal-400">18 Workers</div>
          <p className="text-slate-500">Kernel PID 1 - Supervisor Thread Active</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-slate-400 flex items-center gap-2 font-sans font-bold text-white">
            <Activity className="w-4 h-4 text-teal-400" /> Context Window Load
          </div>
          <div className="text-2xl font-black text-amber-400">42.8% Capacity</div>
          <p className="text-slate-500">54,210 tokens in active KV cache</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-slate-400 flex items-center gap-2 font-sans font-bold text-white">
            <Shield className="w-4 h-4 text-teal-400" /> Security Sandboxing
          </div>
          <div className="text-2xl font-black text-emerald-400">SECCOMP ON</div>
          <p className="text-slate-500">Zero network escape privileges</p>
        </div>
      </div>
    </main>
  );
}
