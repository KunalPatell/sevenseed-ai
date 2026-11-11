"use client";

import React, { useEffect, useState } from "react";
import { Pill, Plus, Trash2, Clock, Bell, CalendarPlus } from "lucide-react";

// Medicine dose tracker. A web page can't reliably alert you when it's closed, so each
// medicine can be added to the phone's own calendar as a repeating reminder (.ics file),
// which does ring. The list itself tracks when you last took each dose. Saved on this device.

type Reminder = { id: string; name: string; dosage: string; frequencyDays: number; time: string; lastTaken: string };
const STORAGE_KEY = "pharmacy_medicine_reminders_v2";

function hoursSince(dateStr: string) { return (Date.now() - new Date(dateStr).getTime()) / 3600000; }
function fmt(h: number) { const d = Math.floor(h / 24), hh = Math.round(h % 24); return d > 0 ? `${d} day${d === 1 ? "" : "s"}${hh ? ` ${hh} h` : ""}` : `${Math.max(1, Math.round(h))} h`; }

function icsFor(r: Reminder) {
  const [hh, mm] = r.time.split(":").map(Number);
  const start = new Date(); start.setHours(hh, mm, 0, 0);
  if (start.getTime() < Date.now()) start.setDate(start.getDate() + 1);
  const pad = (n: number) => String(n).padStart(2, "0");
  const local = `${start.getFullYear()}${pad(start.getMonth() + 1)}${pad(start.getDate())}T${pad(hh)}${pad(mm)}00`;
  const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  const rule = r.frequencyDays === 1 ? "FREQ=DAILY" : r.frequencyDays === 7 ? "FREQ=WEEKLY" : r.frequencyDays === 30 ? "FREQ=MONTHLY" : `FREQ=DAILY;INTERVAL=${r.frequencyDays}`;
  const title = `Take ${r.name}${r.dosage ? ` (${r.dosage})` : ""}`;
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Sevenseed//Medicine reminder//EN", "BEGIN:VEVENT", `UID:${r.id}@sevenseed`, `DTSTAMP:${stamp}`, `DTSTART:${local}`, "DURATION:PT10M", `RRULE:${rule}`, `SUMMARY:${title}`, "BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${title}`, "TRIGGER:PT0M", "END:VALARM", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
}

export function MedicineReminderScheduler() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [form, setForm] = useState({ name: "", dosage: "", frequencyDays: 1, time: "09:00" });

  useEffect(() => { try { setReminders(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")); } catch { /* ignore */ } }, []);
  const persist = (next: Reminder[]) => { setReminders(next); try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ } };

  const addReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    persist([...reminders, { id: `r-${Date.now()}`, ...form, name: form.name.trim(), lastTaken: "" }]);
    setForm({ name: "", dosage: "", frequencyDays: 1, time: form.time });
  };
  const markTaken = (id: string) => persist(reminders.map((r) => (r.id === id ? { ...r, lastTaken: new Date().toISOString() } : r)));
  const remove = (id: string) => persist(reminders.filter((r) => r.id !== id));
  const addToCalendar = (r: Reminder) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([icsFor(r)], { type: "text/calendar" }));
    a.download = `${r.name.replace(/[^\w-]+/g, "-")}-reminder.ics`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };

  const input = "px-3.5 py-2.5 rounded-xl bg-[#021512] border border-teal-900/50 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500";

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl border border-teal-900/40 bg-teal-950/10 overflow-hidden">
      <div className="px-6 py-5 border-b border-teal-900/40">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Bell className="w-6 h-6 text-teal-400" /> Medicine reminders</h1>
        <p className="mt-1 text-sm text-slate-300">Add each medicine, then tap <strong>Add to calendar</strong> so your phone reminds you, even when this page is closed. Tap <strong>Taken</strong> after each dose to keep track. Saved on this device only.</p>
      </div>

      <form onSubmit={addReminder} className="grid gap-3 sm:grid-cols-[1.5fr_1fr_1fr_0.8fr_auto] p-5 border-b border-teal-900/40">
        <label className="sr-only" htmlFor="mr-name">Medicine name</label>
        <input id="mr-name" placeholder="Medicine name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} />
        <label className="sr-only" htmlFor="mr-dose">Dose</label>
        <input id="mr-dose" placeholder="Dose, e.g. 1 tablet" value={form.dosage} onChange={(e) => setForm({ ...form, dosage: e.target.value })} className={input} />
        <label className="sr-only" htmlFor="mr-freq">How often</label>
        <select id="mr-freq" value={form.frequencyDays} onChange={(e) => setForm({ ...form, frequencyDays: Number(e.target.value) })} className={input}>
          <option value={1}>Every day</option><option value={2}>Every 2 days</option><option value={7}>Every week</option><option value={30}>Every month</option>
        </select>
        <label className="sr-only" htmlFor="mr-time">Time</label>
        <input id="mr-time" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className={input} />
        <button type="submit" className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-500 text-black font-bold text-sm"><Plus className="w-4 h-4" /> Add</button>
      </form>

      <div className="divide-y divide-teal-900/30" aria-live="polite">
        {reminders.length === 0 && <div className="p-6 text-center text-sm text-slate-400">No medicines yet. Add one above.</div>}
        {reminders.map((r) => {
          const since = r.lastTaken ? hoursSince(r.lastTaken) : null;
          const dueIn = since === null ? null : r.frequencyDays * 24 - since;
          const overdue = dueIn !== null && dueIn <= 0;
          return (
            <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0"><Pill className="w-4 h-4" /></div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-100">{r.name} {r.dosage && <span className="text-slate-400 font-normal text-xs">· {r.dosage}</span>}</div>
                  <div className={`text-xs flex items-center gap-1 ${overdue ? "text-rose-300" : "text-slate-400"}`}>
                    <Clock className="w-3 h-3" />
                    {since === null ? `${r.frequencyDays === 1 ? "Daily" : `Every ${r.frequencyDays} days`} at ${r.time} · not taken yet` : overdue ? `Due ${fmt(-dueIn!)} ago` : `Next dose in ${fmt(dueIn!)}`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => addToCalendar(r)} className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg border border-teal-700 text-teal-200"><CalendarPlus className="w-3.5 h-3.5" /> Add to calendar</button>
                <button type="button" onClick={() => markTaken(r.id)} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">Taken</button>
                <button type="button" onClick={() => remove(r.id)} className="p-1.5 text-slate-500 hover:text-rose-400" aria-label={`Remove ${r.name}`}><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          );
        })}
      </div>
      <p className="px-6 py-4 text-xs text-slate-500 border-t border-teal-900/40">Take medicines as your doctor prescribed. This list doesn't check doses or interactions.</p>
    </div>
  );
}
