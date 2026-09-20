"use client";

import React, { useEffect, useState } from "react";
import { Pill, Plus, Trash2, Clock, Bell } from "lucide-react";

type Reminder = {
  id: string;
  name: string;
  dosage: string;
  frequencyDays: number;
  lastTaken: string;
};

const STORAGE_KEY = "pharmacy_medicine_reminders";

function daysSince(dateStr: string): number {
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function MedicineReminderScheduler() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [form, setForm] = useState({ name: "", dosage: "500mg", frequencyDays: 1 });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setReminders(JSON.parse(saved));
      else
        setReminders([
          { id: "seed-1", name: "Metformin", dosage: "500mg", frequencyDays: 1, lastTaken: new Date(Date.now() - 86400000).toISOString() },
          { id: "seed-2", name: "Vitamin D3", dosage: "60000 IU", frequencyDays: 7, lastTaken: new Date(Date.now() - 6 * 86400000).toISOString() },
        ]);
    } catch {
      // ignore
    }
  }, []);

  const persist = (next: Reminder[]) => {
    setReminders(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // localStorage unavailable — session-only
    }
  };

  const addReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    persist([...reminders, { id: `r-${Date.now()}`, ...form, lastTaken: new Date().toISOString() }]);
    setForm({ name: "", dosage: "500mg", frequencyDays: 1 });
  };

  const markTaken = (id: string) => {
    persist(reminders.map((r) => (r.id === id ? { ...r, lastTaken: new Date().toISOString() } : r)));
  };

  const remove = (id: string) => persist(reminders.filter((r) => r.id !== id));

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl border border-teal-900/40 bg-teal-950/10 backdrop-blur-xl overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-teal-900/40 text-sm font-bold text-slate-100">
        <Bell className="w-4 h-4 text-teal-400" />
        <span>Medicine Refill & Dose Reminder</span>
        <span className="text-[10px] font-mono text-slate-500">(practo-style)</span>
      </div>

      <form onSubmit={addReminder} className="flex flex-wrap gap-3 p-5 border-b border-teal-900/40 bg-teal-950/10">
        <input
          placeholder="Medicine name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="flex-1 min-w-[140px] px-3.5 py-2.5 rounded-xl bg-[#021512] border border-teal-900/50 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
        />
        <input
          placeholder="Dosage"
          value={form.dosage}
          onChange={(e) => setForm({ ...form, dosage: e.target.value })}
          className="w-24 px-3.5 py-2.5 rounded-xl bg-[#021512] border border-teal-900/50 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
        />
        <select
          value={form.frequencyDays}
          onChange={(e) => setForm({ ...form, frequencyDays: Number(e.target.value) })}
          className="px-3 py-2.5 rounded-xl bg-[#021512] border border-teal-900/50 text-xs text-white focus:outline-none"
        >
          <option value={1}>Every day</option>
          <option value={2}>Every 2 days</option>
          <option value={7}>Every week</option>
          <option value={30}>Every month</option>
        </select>
        <button type="submit" className="p-2.5 rounded-xl bg-teal-500 text-black hover:opacity-90 transition-opacity" aria-label="Add reminder">
          <Plus className="w-4 h-4" />
        </button>
      </form>

      <div className="divide-y divide-teal-900/30">
        {reminders.length === 0 && <div className="p-6 text-center text-xs text-slate-500">No reminders yet — add a medicine above.</div>}
        {reminders.map((r) => {
          const elapsed = daysSince(r.lastTaken);
          const dueIn = r.frequencyDays - elapsed;
          const overdue = dueIn <= 0;
          return (
            <div key={r.id} className="flex items-center justify-between gap-3 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-100">{r.name} <span className="text-slate-500 font-normal text-xs">· {r.dosage}</span></div>
                  <div className={`text-[11px] font-mono flex items-center gap-1 ${overdue ? "text-rose-400" : "text-slate-400"}`}>
                    <Clock className="w-3 h-3" />
                    {overdue ? `Overdue by ${Math.abs(dueIn)} day${Math.abs(dueIn) === 1 ? "" : "s"}` : `Next dose in ${dueIn} day${dueIn === 1 ? "" : "s"}`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => markTaken(r.id)}
                  className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors"
                >
                  Mark Taken
                </button>
                <button onClick={() => remove(r.id)} className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors" aria-label="Remove">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
