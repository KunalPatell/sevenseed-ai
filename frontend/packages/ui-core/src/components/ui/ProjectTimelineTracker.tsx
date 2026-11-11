"use client";

import React, { useEffect, useState } from "react";
import { CalendarRange, CheckCircle2, Circle, AlertTriangle, Plus, Trash2, RotateCcw } from "lucide-react";

type Milestone = {
  id: string;
  name: string;
  dueDate: string;
  status: "done" | "in-progress" | "delayed" | "upcoming";
};

// A typical house-construction sequence to start from. The visitor sets their own dates
// and statuses; nothing here describes a real project. Saved on this device.
const TEMPLATE: Milestone[] = [
  { id: "m1", name: "Site survey & soil testing", dueDate: "", status: "upcoming" },
  { id: "m2", name: "Foundation & plinth", dueDate: "", status: "upcoming" },
  { id: "m3", name: "RCC structure", dueDate: "", status: "upcoming" },
  { id: "m4", name: "Electrical & plumbing rough-in", dueDate: "", status: "upcoming" },
  { id: "m5", name: "Brickwork & plastering", dueDate: "", status: "upcoming" },
  { id: "m6", name: "Finishing & handover", dueDate: "", status: "upcoming" },
];
const KEY = "breakdown_project_timeline";

const STATUS_META: Record<Milestone["status"], { label: string; color: string; icon: typeof CheckCircle2 }> = {
  done: { label: "Complete", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10", icon: CheckCircle2 },
  "in-progress": { label: "In Progress", color: "text-amber-400 border-amber-500/30 bg-amber-500/10", icon: Circle },
  delayed: { label: "Delayed", color: "text-rose-400 border-rose-500/30 bg-rose-500/10", icon: AlertTriangle },
  upcoming: { label: "Upcoming", color: "text-slate-400 border-slate-700 bg-slate-800/50", icon: Circle },
};

export function ProjectTimelineTracker() {
  const [milestones, setMilestones] = useState<Milestone[]>(TEMPLATE);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { try { const v = JSON.parse(localStorage.getItem(KEY) || "null"); if (Array.isArray(v)) setMilestones(v); } catch { /* ignore */ } setLoaded(true); }, []);
  useEffect(() => { if (loaded) { try { localStorage.setItem(KEY, JSON.stringify(milestones)); } catch { /* ignore */ } } }, [milestones, loaded]);
  const setDate = (id: string, d: string) => setMilestones((prev) => prev.map((m) => (m.id === id ? { ...m, dueDate: d } : m)));
  const remove = (id: string) => setMilestones((prev) => prev.filter((m) => m.id !== id));
  const today = new Date().toISOString().slice(0, 10);
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
  const progressPct = milestones.length ? Math.round((doneCount / milestones.length) * 100) : 0;
  const lateCount = milestones.filter((m) => m.status !== "done" && m.dueDate && m.dueDate < today).length;

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl border border-sky-900/40 bg-slate-900/70 backdrop-blur-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-sky-900/40 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-xl font-bold text-slate-100">
            <CalendarRange className="w-5 h-5 text-amber-400" />
            <span>Project timeline</span>
          </h1>
          <span className="text-xs font-mono text-amber-300">{progressPct}% complete</span>
        </div>
        <p className="text-sm text-slate-300">Start from these typical stages or add your own. Set a due date for each and tap the status to change it. {lateCount > 0 && <strong className="text-rose-300">{lateCount} past due.</strong>} Saved on this device.</p>
        <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-500" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <div className="divide-y divide-sky-900/30 max-h-80 overflow-y-auto">
        {milestones.map((m) => {
          const meta = STATUS_META[m.status];
          const Icon = meta.icon;
          return (
            <div key={m.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${meta.color.split(" ")[0]}`} />
                <div className="min-w-0">
                  <div className="text-sm text-slate-100 font-medium">{m.name}</div>
                  <label className="text-[11px] text-slate-400">Due <input type="date" aria-label={`Due date for ${m.name}`} value={m.dueDate} onChange={(e) => setDate(m.id, e.target.value)} className={`ml-1 bg-transparent border-b border-slate-700 text-[11px] font-mono ${m.status !== "done" && m.dueDate && m.dueDate < today ? "text-rose-300" : "text-slate-300"}`} /></label>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => cycleStatus(m.id)} title="Change status" className={`text-[11px] font-semibold px-2.5 py-1 rounded border ${meta.color}`}>{meta.label}</button>
                <button type="button" onClick={() => remove(m.id)} aria-label={`Remove ${m.name}`} className="p-1 text-slate-500 hover:text-rose-300"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
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
        <button type="button" onClick={() => setMilestones(TEMPLATE)} className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl border border-slate-700 text-xs text-slate-300" title="Start again from the typical stages"><RotateCcw className="w-3.5 h-3.5" /> Reset</button>
      </form>
    </div>
  );
}
