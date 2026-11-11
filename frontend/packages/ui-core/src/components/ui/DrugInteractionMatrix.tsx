"use client";

import React, { useState } from "react";
import { AlertTriangle, ShieldCheck, HelpCircle, Search } from "lucide-react";

// Drug interaction checker backed by /api/pharmacy/check-interaction (curated pairs plus
// an AI pharmacology check that must answer UNKNOWN when unsure). The old version only
// knew one pair and called every other combination safe.

type Result = { severity: string; mechanism: string; precautions: string; dietary_advice: string; generic_alternative: string; source: string };
const EXAMPLES: [string, string][] = [["Warfarin", "Aspirin"], ["Paracetamol", "Alcohol"], ["Atorvastatin", "Clarithromycin"], ["Metformin", "Ibuprofen"]];

const look = (sev: string) => {
  const s = sev.toUpperCase();
  if (["CRITICAL", "HIGH", "MAJOR", "FATAL CONTRAINDICATION"].includes(s)) return { box: "bg-rose-500/10 border-rose-500/40", text: "text-rose-200", Icon: AlertTriangle, title: "Serious interaction: don't combine without your doctor's advice" };
  if (s === "MODERATE") return { box: "bg-amber-500/10 border-amber-500/40", text: "text-amber-200", Icon: AlertTriangle, title: "Moderate interaction: take care and ask your pharmacist" };
  if (s === "SAFE" || s === "LOW") return { box: "bg-emerald-500/10 border-emerald-500/40", text: "text-emerald-200", Icon: ShieldCheck, title: "No significant interaction known" };
  return { box: "bg-slate-800/60 border-slate-600", text: "text-slate-200", Icon: HelpCircle, title: "We couldn't assess this combination" };
};

export function DrugInteractionMatrix() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [res, setRes] = useState<Result | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  const check = async (x = a, y = b) => {
    if (!x.trim() || !y.trim()) return;
    setState("loading"); setRes(null);
    try {
      const r = await fetch("/api/pharmacy/check-interaction", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ drug_a: x.trim(), drug_b: y.trim() }) });
      if (!r.ok) throw new Error();
      setRes(await r.json()); setState("idle");
    } catch { setState("error"); }
  };
  const L = res ? look(res.severity) : null;
  const input = "mt-1 w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-400";

  return (
    <div className="w-full max-w-4xl mx-auto p-5 md:p-8 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Medicine Interaction Checker</h1>
        <p className="text-slate-300 text-sm mt-2 max-w-xl mx-auto">Check whether two medicines, or a medicine and a food or drink, are risky together. Use the name on the strip or the salt name.</p>
      </div>

      <form className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end" onSubmit={(e) => { e.preventDefault(); check(); }}>
        <label className="text-sm font-semibold text-slate-300">First medicine<input className={input} value={a} onChange={(e) => setA(e.target.value)} placeholder="e.g. Warfarin" /></label>
        <label className="text-sm font-semibold text-slate-300">Second medicine, food or drink<input className={input} value={b} onChange={(e) => setB(e.target.value)} placeholder="e.g. Aspirin" /></label>
        <button type="submit" disabled={state === "loading" || !a.trim() || !b.trim()} className="px-5 py-3 rounded-xl bg-rose-500 hover:bg-rose-400 disabled:opacity-50 text-black font-bold inline-flex items-center justify-center gap-2">
          <Search className="w-4 h-4" /> {state === "loading" ? "Checking…" : "Check"}
        </button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="text-slate-400 self-center">Try:</span>
        {EXAMPLES.map(([x, y]) => (
          <button key={x + y} type="button" onClick={() => { setA(x); setB(y); check(x, y); }} className="px-3 py-1.5 rounded-full border border-slate-700 text-slate-300 hover:border-rose-400">{x} + {y}</button>
        ))}
      </div>

      <div className="mt-6" aria-live="polite">
        {state === "loading" && <p className="text-slate-300 text-sm">Checking… this can take up to 20 seconds.</p>}
        {state === "error" && <p className="text-amber-300 text-sm">The checker didn't respond. Please try again, and ask your pharmacist in the meantime.</p>}
        {res && L && (
          <div className={`p-5 rounded-xl border ${L.box}`}>
            <div className="flex items-start gap-3">
              <L.Icon className={`w-7 h-7 shrink-0 ${L.text}`} />
              <div className="space-y-2 text-sm text-slate-200">
                <h2 className={`text-lg font-bold ${L.text}`}>{L.title}</h2>
                <p><b>What happens:</b> {res.mechanism}</p>
                <p className="whitespace-pre-line"><b>What to do:</b> {res.precautions}</p>
                {res.dietary_advice && <p className="whitespace-pre-line"><b>Food and drink:</b> {res.dietary_advice}</p>}
                <p className="text-xs text-slate-400">Source: {res.source}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <p className="mt-6 text-xs text-slate-400">General information only, not medical advice. Never stop or change a prescribed medicine without talking to your doctor. Poison emergency: call 1800-116-117 (AIIMS poison centre) or 108.</p>
    </div>
  );
}
