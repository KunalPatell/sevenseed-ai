"use client";

import React, { useEffect, useState } from "react";
import { Pill, Search, ShieldCheck, ExternalLink, AlertTriangle } from "lucide-react";

// Searches the hub's generic-medicine catalogue (/api/health/generics). When nothing
// matches it says so; it never shows an unrelated medicine as a substitute.

interface Generic {
  brand_name: string;
  generic_name: string;
  brand_mrp_inr: number;
  jan_aushadhi_price_inr: number;
  savings_pct: number;
  category: string;
  dosage_form: string;
  indications: string;
}

const inr = (n: number) => "₹" + n.toFixed(2);
const SUGGESTIONS = ["Dolo 650", "Pan-D", "Augmentin", "Telma 40", "Thyronorm"];

export function GenericSaltFinder() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState("");
  const [results, setResults] = useState<Generic[] | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  const run = async (q: string) => {
    setState("loading");
    try {
      const r = await fetch(`/api/health/generics?q=${encodeURIComponent(q.trim())}`);
      if (!r.ok) throw new Error(String(r.status));
      const d = await r.json();
      setResults(d.results || []);
      setSearched(q.trim());
      setState("idle");
    } catch {
      setState("error");
    }
  };

  useEffect(() => { run(""); }, []);

  return (
    <div className="w-full max-w-5xl mx-auto p-5 md:p-8 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <Pill className="w-4 h-4" /> Jan Aushadhi generics
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Generic Medicine Savings Finder</h1>
        <p className="text-slate-300 text-sm mt-2 max-w-xl mx-auto">
          Type the brand name on your strip. We show the generic with the same salt and how much less it usually costs at a Jan Aushadhi Kendra.
        </p>
      </div>

      <form className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto" onSubmit={(e) => { e.preventDefault(); run(query); }}>
        <label htmlFor="generic-q" className="sr-only">Brand name of your medicine</label>
        <input id="generic-q" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. Dolo 650, Pan-D, Telma 40"
          className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500" />
        <button type="submit" disabled={state === "loading"} className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-bold text-sm rounded-xl inline-flex items-center justify-center gap-1.5">
          <Search className="w-4 h-4" /> {state === "loading" ? "Searching…" : "Find generic"}
        </button>
      </form>
      <div className="flex flex-wrap justify-center gap-2 mt-3">
        {SUGGESTIONS.map((s) => (
          <button key={s} type="button" onClick={() => { setQuery(s); run(s); }} className="text-xs px-3 py-1.5 rounded-full border border-slate-700 text-slate-300 hover:border-emerald-500 hover:text-white">{s}</button>
        ))}
      </div>

      <div className="mt-8" aria-live="polite">
        {state === "error" && <p className="text-center text-amber-300">Couldn't reach the medicine catalogue. Please try again.</p>}
        {results && state !== "error" && (
          <>
            <h2 className="text-sm font-semibold text-slate-300 mb-3">
              {searched ? (results.length ? `${results.length} match${results.length > 1 ? "es" : ""} for “${searched}”` : "") : "Common medicines"}
            </h2>
            {searched && results.length === 0 && (
              <div className="p-5 rounded-xl border border-amber-500/40 bg-amber-500/5 text-sm text-amber-100 space-y-2">
                <p className="font-semibold flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-400" /> “{searched}” isn't in our list yet.</p>
                <p>Look for the <b>salt name</b> printed under the brand name on your strip (for example “Paracetamol 650 mg”), then search for it on the official Jan Aushadhi product list or ask at your nearest Kendra.</p>
                <a className="inline-flex items-center gap-1 underline text-amber-200" href="https://janaushadhi.gov.in/ProductList.aspx" target="_blank" rel="noopener noreferrer">Official Jan Aushadhi product list <ExternalLink className="w-3.5 h-3.5" /></a>
              </div>
            )}
            <div className="grid gap-4 md:grid-cols-2">
              {results.map((m) => (
                <article key={m.brand_name} className="p-5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-xs uppercase tracking-wide text-slate-400">{m.category} · {m.dosage_form}</div>
                  <h3 className="mt-1 text-lg font-bold text-white">{m.brand_name}</h3>
                  <p className="text-sm text-emerald-300">Generic: {m.generic_name}</p>
                  <p className="text-xs text-slate-400 mt-1">Used for: {m.indications}</p>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30"><div className="text-[11px] text-rose-200">Brand</div><div className="font-mono font-bold text-rose-300">{inr(m.brand_mrp_inr)}</div></div>
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30"><div className="text-[11px] text-emerald-200">Generic</div><div className="font-mono font-bold text-emerald-300">{inr(m.jan_aushadhi_price_inr)}</div></div>
                    <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700"><div className="text-[11px] text-slate-300">You save</div><div className="font-mono font-bold text-white">{Math.round(m.savings_pct)}%</div></div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-6 p-4 rounded-xl border border-slate-800 bg-slate-950/60 text-xs text-slate-400 flex gap-2">
        <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
        <span>Prices are approximate reference prices for one pack; check the pack and the Kendra for today's price. Always confirm a switch with your doctor or pharmacist, especially for diabetes, thyroid, heart and blood-pressure medicines.</span>
      </div>
    </div>
  );
}
