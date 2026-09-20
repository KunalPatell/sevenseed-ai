"use client";

import React, { useState } from "react";
import { CalendarRange, CheckCircle2, Circle, AlertTriangle, Plus } from "lucide-react";

type Milestone = {
  id: string;
  name: string;
  dueDate: string;
  status: "done" | "in-progress" | "delayed" | "upcoming";
};

const SEED: Milestone[] = [
  { id: "m1", name: "Site Survey & Soil Testing", dueDate: "2026-04-10", status: "done" },
  { id: "m2", name: "Foundation & Plinth Work", dueDate: "2026-05-20", status: "done" },
  { id: "m3", name: "RCC Structure (Ground + 2)", dueDate: "2026-08-15", status: "in-progress" },
  { id: "m4", name: "MEP Rough-in (Electrical/Plumbing)", dueDate: "2026-09-05", status: "delayed" },
  { id: "m5", name: "Brickwork & Plastering", dueDate: "2026-10-01", status: "upcoming" },
  { id: "m6", name: "Finishing & Handover", dueDate: "2026-12-15", status: "upcoming" },
];

const STATUS_META: Record<Milestone["status"], { label: string; color: string; icon: typeof CheckCircle2 }> = {
  done: { label: "Complete", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10", icon: CheckCircle2 },
  "in-progress": { label: "In Progress", color: "text-amber-400 border-amber-500/30 bg-amber-500/10", icon: Circle },
  delayed: { label: "Delayed", color: "text-rose-400 border-rose-500/30 bg-rose-500/10", icon: AlertTriangle },
  upcoming: { label: "Upcoming", color: "text-slate-400 border-slate-700 bg-slate-800/50", icon: Circle },
};

export function ProjectTimelineTracker() {
  const [milestones, setMilestones] = useState<Milestone[]>(SEED);
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState("");

  const cycleStatus = (id: string) => {
    const order: Milestone["status"][] = ["upcoming", "in-progress", "delayed", "done"];
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: order[(order.indexOf(m.status) + 1) % order.length] } : m))
    );
  };

  const addMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dueDate) return;
    setMilestones((prev) => [...prev, { id: `m-${Date.now()}`, name, dueDate, status: "upcoming" }]);
    setName("");
    setDueDate("");
  };

  const doneCount = milestones.filter((m) => m.status === "done").length;
  const progressPct = Math.round((doneCount / milestones.length) * 100);

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl border border-sky-900/40 bg-slate-900/70 backdrop-blur-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-sky-900/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
            <CalendarRange className="w-4 h-4 text-amber-400" />
            <span>Project Timeline & Milestone Tracker</span>
          </div>
          <span className="text-xs font-mono text-amber-300">{progressPct}% complete</span>
        </div>
        <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-500" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <div className="divide-y divide-sky-900/30 max-h-80 overflow-y-auto">
        {milestones.map((m) => {
          const meta = STATUS_META[m.status];
          const Icon = meta.icon;
          return (
            <button
              key={m.id}
              onClick={() => cycleStatus(m.id)}
              className="w-full flex items-center justify-between gap-3 px-5 py-3.5 text-left hover:bg-slate-800/60 transition-colors"
              title="Click to cycle status"
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 shrink-0 ${meta.color.split(" ")[0]}`} />
                <div>
                  <div className="text-sm text-slate-100 font-medium">{m.name}</div>
                  <div className="text-[11px] font-mono text-slate-500">Due {m.dueDate}</div>
                </div>
              </div>
              <span className={`text-[10px] font-mono px-2 py-1 rounded border ${meta.color}`}>{meta.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={addMilestone} className="flex flex-wrap gap-3 p-4 border-t border-sky-900/40 bg-slate-900/70">
        <input
          placeholder="New milestone (e.g. Waterproofing)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 min-w-[160px] px-3.5 py-2.5 rounded-xl bg-[#0a0f1a] border border-sky-900/50 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-[#0a0f1a] border border-sky-900/50 text-xs text-white focus:outline-none focus:border-amber-500"
        />
        <button type="submit" className="p-2.5 rounded-xl bg-amber-500 text-black hover:opacity-90 transition-opacity" aria-label="Add milestone">
          <Plus className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
