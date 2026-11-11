"use client";

import React, { useEffect, useState } from "react";
import { Scan, ShieldAlert, ShieldCheck, Plus, Trash2 } from "lucide-react";

// Fake-discount detector. For each deal the shopper enters the MRP, the sale price and
// what it usually sold for before the sale (from their own price log, a price-history
// extension or memory). A big "% off MRP" with a small real drop means the MRP is padded.
// Starts with clearly labelled examples; saved on this device.

type Deal = { id: string; name: string; mrp: string; sale: string; usual: string };
const EXAMPLES: Deal[] = [
  { id: "e1", name: "Example: wireless earbuds", mrp: "2999", sale: "799", usual: "1099" },
  { id: "e2", name: "Example: 55-inch 4K TV", mrp: "64990", sale: "38990", usual: "41500" },
  { id: "e3", name: "Example: running shoes", mrp: "11995", sale: "6999", usual: "8999" },
];
const KEY = "ss-emart-deal-scanner";
const n = (s: string) => parseFloat(s);

export function SmartDealScanner() {
  const [deals, setDeals] = useState<Deal[]>(EXAMPLES);
  useEffect(() => { try { const v = JSON.parse(localStorage.getItem(KEY) || "null"); if (Array.isArray(v)) setDeals(v); } catch { /* ignore */ } }, []);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(deals)); } catch { /* ignore */ } }, [deals]);
  const set = (id: string, k: keyof Deal, v: string) => setDeals((ds) => ds.map((d) => (d.id === id ? { ...d, [k]: k === "name" ? v : v.replace(/[^\d.]/g, "") } : d)));
  const cell = "w-full px-2.5 py-2 rounded-lg bg-[#012018] border border-emerald-900/50 text-sm text-white focus:outline-none focus:border-emerald-500";

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl border border-emerald-800/40 bg-emerald-950/20 overflow-hidden">
      <div className="px-5 sm:px-6 py-5 border-b border-emerald-800/40">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Scan className="w-6 h-6 text-emerald-400" /> Fake Discount Detector</h1>
        <p className="mt-1 text-sm text-slate-300 max-w-2xl">“70% off!” often means the MRP was padded. Enter the sale price and what the product usually sold for, and see the real discount. Replace the examples with deals you're looking at.</p>
      </div>
      <div className="divide-y divide-emerald-900/30">
        {deals.map((d) => {
          const mrp = n(d.mrp), sale = n(d.sale), usual = n(d.usual);
          const off = mrp > 0 && sale > 0 ? Math.round(((mrp - sale) / mrp) * 100) : null;
          const real = usual > 0 && sale > 0 ? Math.round(((usual - sale) / usual) * 100) : null;
          const padded = off !== null && real !== null && off - real > 15;
          return (
            <div key={d.id} className="p-4 sm:px-6 grid gap-2 sm:grid-cols-[1.6fr_0.8fr_0.8fr_0.8fr_auto] items-end">
              <label className="text-xs text-slate-400">Product<input className={cell + " mt-1"} value={d.name} onChange={(e) => set(d.id, "name", e.target.value)} /></label>
              <label className="text-xs text-slate-400">MRP ₹<input inputMode="decimal" className={cell + " mt-1 font-mono"} value={d.mrp} onChange={(e) => set(d.id, "mrp", e.target.value)} /></label>
              <label className="text-xs text-slate-400">Sale ₹<input inputMode="decimal" className={cell + " mt-1 font-mono"} value={d.sale} onChange={(e) => set(d.id, "sale", e.target.value)} /></label>
              <label className="text-xs text-slate-400">Usual ₹<input inputMode="decimal" className={cell + " mt-1 font-mono"} value={d.usual} onChange={(e) => set(d.id, "usual", e.target.value)} /></label>
              <button type="button" aria-label={`Remove ${d.name}`} onClick={() => setDeals((ds) => ds.filter((x) => x.id !== d.id))} className="p-2.5 text-slate-500 hover:text-rose-300"><Trash2 className="w-4 h-4" /></button>
              <div className="sm:col-span-5 text-sm" aria-live="polite">
                {off === null || real === null ? <span className="text-slate-500">Fill in the sale price and either the MRP or the usual price.</span> : padded ? (
                  <span className="inline-flex items-center gap-1.5 text-rose-200"><ShieldAlert className="w-4 h-4 text-rose-400" /> Says {off}% off, but it's really only {real}% below its usual price. The MRP looks padded.</span>
                ) : real <= 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-amber-200"><ShieldAlert className="w-4 h-4 text-amber-400" /> Not a deal: the “sale” price isn't lower than usual.</span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-emerald-200"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Genuine: {real}% below its usual price.</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-4 sm:px-6 border-t border-emerald-800/40 flex flex-wrap gap-2">
        <button type="button" onClick={() => setDeals((ds) => [...ds, { id: `d-${Date.now()}`, name: "", mrp: "", sale: "", usual: "" }])} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 text-sm text-slate-200 hover:border-emerald-500"><Plus className="w-4 h-4" /> Add a deal</button>
        <button type="button" onClick={() => setDeals([])} className="px-3 py-2 rounded-lg border border-slate-700 text-sm text-slate-300 hover:border-emerald-500">Clear examples</button>
      </div>
    </div>
  );
}
