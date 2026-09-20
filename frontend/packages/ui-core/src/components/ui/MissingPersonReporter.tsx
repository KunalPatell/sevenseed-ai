"use client";

import React, { useState } from "react";
import { UserSearch, Send, ShieldAlert, MapPin, Clock } from "lucide-react";

type Report = {
  id: string;
  type: "Missing Person" | "Lost Article";
  name: string;
  lastSeen: string;
  description: string;
  status: "Active" | "Resolved";
  filedAt: string;
};

const SEED: Report[] = [
  { id: "r1", type: "Missing Person", name: "Male, ~14 yrs, school uniform", lastSeen: "Maninagar Bus Depot, Ahmedabad", description: "Last seen boarding a city bus around 5:30 PM. Height ~5'2\", grey backpack.", status: "Active", filedAt: "2026-09-19" },
  { id: "r2", type: "Lost Article", name: "Black leather wallet", lastSeen: "Kankaria Lakefront", description: "Contains Aadhaar card and debit card. Lost near the food court entrance.", status: "Resolved", filedAt: "2026-09-14" },
];

export function MissingPersonReporter() {
  const [reports, setReports] = useState<Report[]>(SEED);
  const [form, setForm] = useState({ type: "Missing Person" as Report["type"], name: "", lastSeen: "", description: "" });
  const [submitted, setSubmitted] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.lastSeen.trim()) return;
    const id = `FIR-LR-${Math.floor(1000 + Math.random() * 9000)}`;
    setReports((prev) => [{ id, ...form, status: "Active", filedAt: new Date().toISOString().slice(0, 10) }, ...prev]);
    setSubmitted(id);
    setForm({ type: "Missing Person", name: "", lastSeen: "", description: "" });
    setTimeout(() => setSubmitted(null), 5000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl border border-red-900/40 bg-red-950/10 backdrop-blur-xl overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-red-900/40 text-sm font-bold text-slate-100">
        <UserSearch className="w-4 h-4 text-red-400" />
        <span>Missing Person & Lost Article Report</span>
        <span className="text-[10px] font-mono text-slate-500">(citizenCOP-style)</span>
      </div>

      <form onSubmit={submit} className="p-5 space-y-3 border-b border-red-900/40 bg-red-950/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as Report["type"] })}
            className="px-3.5 py-2.5 rounded-xl bg-[#1a0505] border border-red-900/50 text-xs text-white focus:outline-none"
          >
            <option>Missing Person</option>
            <option>Lost Article</option>
          </select>
          <input
            placeholder={form.type === "Missing Person" ? "Description (age, build, clothing)" : "Item name"}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="px-3.5 py-2.5 rounded-xl bg-[#1a0505] border border-red-900/50 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
            required
          />
        </div>
        <input
          placeholder="Last seen location"
          value={form.lastSeen}
          onChange={(e) => setForm({ ...form, lastSeen: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a0505] border border-red-900/50 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
          required
        />
        <textarea
          placeholder="Additional details..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
          className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a0505] border border-red-900/50 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 resize-none"
        />
        <div className="flex items-center justify-between">
          <button type="submit" className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-red-500 text-black hover:opacity-90 transition-opacity">
            <Send className="w-3.5 h-3.5" /> File Report
          </button>
          {submitted && (
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" /> Filed as {submitted} — nearest station notified.
            </span>
          )}
        </div>
      </form>

      <div className="divide-y divide-red-900/30 max-h-72 overflow-y-auto">
        {reports.map((r) => (
          <div key={r.id} className="px-5 py-4 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 border border-red-800 text-red-300">{r.type}</span>
                <span>{r.name}</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${r.status === "Active" ? "text-amber-400 border-amber-500/30 bg-amber-500/10" : "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"}`}>
                {r.status}
              </span>
            </div>
            {r.description && <p className="text-xs text-slate-400 leading-relaxed">{r.description}</p>}
            <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {r.lastSeen}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {r.filedAt}</span>
              <span className="text-slate-600">{r.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
