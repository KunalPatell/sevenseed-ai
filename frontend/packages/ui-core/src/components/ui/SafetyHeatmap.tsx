"use client";

import React, { useEffect, useState } from "react";
import { MapPinned, Phone, ShieldCheck, Plus, Trash2, ExternalLink } from "lucide-react";

// Personal safety planner. Sevenseed has no crime-report feed, so this does not show
// risk scores for places. It gives real helplines, situation checklists, and a private
// list of places the visitor wants to remember (stored only on their device).

const HELPLINES = [
  { n: "112", label: "All emergencies (police, fire, ambulance)" },
  { n: "1091", label: "Women's helpline" },
  { n: "1930", label: "Cyber fraud / UPI scam (report within hours)" },
  { n: "1098", label: "Childline" },
  { n: "108", label: "Ambulance (most states)" },
];

const SITUATIONS: Record<string, string[]> = {
  "Walking alone at night": [
    "Share your live location with someone you trust before you leave.",
    "Stay on lit, busy roads even if the route is longer.",
    "Keep your phone charged and one hand free; avoid headphones in both ears.",
    "If you feel followed, walk into a shop, petrol pump or ATM with a guard and call 112.",
  ],
  "Taking a cab or auto": [
    "Check the number plate and driver photo match the app before getting in.",
    "Use the app's 'share trip' feature and sit in the back seat.",
    "Keep the child lock in mind: if a door won't open, ask the driver to stop in a public place.",
    "If the route changes without reason, call 112 and say where you are.",
  ],
  "Someone asks for an OTP or UPI PIN": [
    "Never share an OTP or UPI PIN: no bank, courier or police officer will ask for it.",
    "You never need a PIN to receive money. A 'collect request' takes money from you.",
    "If money has already gone, call 1930 at once and report at cybercrime.gov.in.",
    "Note the caller's number, UPI ID and transaction ID before blocking.",
  ],
  "Travelling to a new city": [
    "Save the local police station and your hotel's number offline.",
    "Keep a photo of your ID and tickets in a second place (email or cloud).",
    "Arrive in daylight if you can, and pre-book your first ride.",
    "Tell someone your plans for each day.",
  ],
};

type Place = { name: string; note: string; at: string };
const KEY = "ss-rakshak-safety-places";

export function SafetyHeatmap() {
  const [situation, setSituation] = useState(Object.keys(SITUATIONS)[0]);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [places, setPlaces] = useState<Place[]>([]);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => { try { setPlaces(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch { /* ignore */ } }, []);
  const store = (p: Place[]) => { setPlaces(p); try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* ignore */ } };
  const steps = SITUATIONS[situation];
  const ticked = steps.filter((s) => done[situation + s]).length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="rounded-2xl border border-red-900/40 bg-red-950/10 p-5 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2"><MapPinned className="w-6 h-6 text-red-400" /> Personal Safety Planner</h1>
        <p className="mt-2 text-slate-300 text-sm max-w-2xl">Plan ahead for common situations, keep emergency numbers one tap away, and note places you want to avoid or remember. Your notes stay on this device.</p>
      </div>

      <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 sm:p-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2"><Phone className="w-5 h-5 text-red-400" /> Emergency numbers (India)</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {HELPLINES.map((h) => (
            <a key={h.n} href={`tel:${h.n}`} className="flex items-center gap-3 p-3 rounded-xl border border-slate-800 hover:border-red-500/60 bg-slate-900/60">
              <span className="text-2xl font-black font-mono text-red-300 w-16">{h.n}</span>
              <span className="text-sm text-slate-200">{h.label}</span>
            </a>
          ))}
        </div>
        <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm text-red-200 underline">Report cyber crime online at cybercrime.gov.in <ExternalLink className="w-3.5 h-3.5" /></a>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 sm:p-6">
        <h2 className="text-lg font-bold text-white">What's your situation?</h2>
        <div className="mt-3 flex flex-wrap gap-2" role="tablist">
          {Object.keys(SITUATIONS).map((s) => (
            <button key={s} type="button" role="tab" aria-selected={s === situation} onClick={() => setSituation(s)}
              className={`px-3 py-2 rounded-lg text-sm border ${s === situation ? "border-red-400 bg-red-500/15 text-white" : "border-slate-700 text-slate-300 hover:border-slate-500"}`}>{s}</button>
          ))}
        </div>
        <ul className="mt-4 space-y-2">
          {steps.map((s) => (
            <li key={s}>
              <label className="flex gap-3 items-start p-3 rounded-lg bg-slate-900/60 border border-slate-800 cursor-pointer">
                <input type="checkbox" className="mt-1 accent-red-500" checked={!!done[situation + s]} onChange={(e) => setDone((d) => ({ ...d, [situation + s]: e.target.checked }))} />
                <span className={`text-sm ${done[situation + s] ? "text-slate-400 line-through" : "text-slate-200"}`}>{s}</span>
              </label>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-slate-300 flex items-center gap-2" aria-live="polite"><ShieldCheck className="w-4 h-4 text-emerald-400" /> {ticked} of {steps.length} done{ticked === steps.length ? ": you're prepared." : ""}</p>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 sm:p-6">
        <h2 className="text-lg font-bold text-white">My places</h2>
        <p className="text-sm text-slate-400 mt-1">Note a spot to avoid after dark, a safe café, or a well-lit route. Only you can see this list.</p>
        <form className="mt-4 grid gap-2 sm:grid-cols-[1fr_1.4fr_auto]" onSubmit={(e) => { e.preventDefault(); if (!name.trim()) return; store([{ name: name.trim(), note: note.trim(), at: new Date().toISOString() }, ...places].slice(0, 50)); setName(""); setNote(""); }}>
          <label className="sr-only" htmlFor="place-name">Place</label>
          <input id="place-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Place (e.g. Station back gate)" className="px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-red-400" />
          <label className="sr-only" htmlFor="place-note">Note</label>
          <input id="place-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (e.g. poorly lit after 9 pm)" className="px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-red-400" />
          <button type="submit" className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-400 text-black font-bold text-sm"><Plus className="w-4 h-4" /> Add</button>
        </form>
        <ul className="mt-4 divide-y divide-slate-900">
          {places.length === 0 && <li className="text-sm text-slate-500 py-2">No places yet.</li>}
          {places.map((p, i) => (
            <li key={p.at + i} className="py-2.5 flex items-start justify-between gap-3">
              <div><div className="text-sm font-semibold text-slate-100">{p.name}</div>{p.note && <div className="text-sm text-slate-400">{p.note}</div>}</div>
              <button type="button" aria-label={`Delete ${p.name}`} onClick={() => store(places.filter((_, j) => j !== i))} className="p-2 text-slate-500 hover:text-rose-300"><Trash2 className="w-4 h-4" /></button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
