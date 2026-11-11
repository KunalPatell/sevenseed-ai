"use client";

import React, { useEffect, useMemo, useState } from "react";
import { TrendingUp, TrendingDown, Boxes, Plus, Trash2, RotateCcw } from "lucide-react";

// Material rate sheet. Sevenseed has no live market-price feed (the old "Refresh Rates"
// button just added random noise). This keeps the contractor's own supplier quotes,
// remembers the previous quote for each material, and shows the change and the cost of
// a quantity. Starts from clearly labelled sample rates.

type Row = { name: string; unit: string; rate: string; prev: string; qty: string; updated: string };
const SAMPLE: Row[] = [
  { name: "TMT steel bar (Fe-500D)", unit: "quintal", rate: "5420", prev: "", qty: "", updated: "" },
  { name: "OPC 53-grade cement", unit: "bag (50 kg)", rate: "392", prev: "", qty: "", updated: "" },
  { name: "River sand", unit: "brass", rate: "4800", prev: "", qty: "", updated: "" },
  { name: "Red clay bricks", unit: "1000 nos", rate: "6200", prev: "", qty: "", updated: "" },
  { name: "Ready-mix concrete (M25)", unit: "cum", rate: "6850", prev: "", qty: "", updated: "" },
];
const KEY = "ss-breakdown-rate-sheet";
const n = (s: string) => parseFloat((s || "").replace(/,/g, ""));
const inr = (x: number) => "₹" + Math.round(x).toLocaleString("en-IN");

export function MaterialPriceIndex() {
  const [rows, setRows] = useState<Row[]>(SAMPLE);
  const [isSample, setIsSample] = useState(true);
  useEffect(() => { try { const v = JSON.parse(localStorage.getItem(KEY) || "null"); if (v?.rows) { setRows(v.rows); setIsSample(!!v.isSample); } } catch { /* ignore */ } }, []);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify({ rows, isSample })); } catch { /* ignore */ } }, [rows, isSample]);

  const set = (i: number, k: keyof Row, v: string) => setRows((rs) => rs.map((r, j) => (j === i ? { ...r, [k]: v } : r)));
  // A new rate keeps the old one as "previous" so the change is visible.
  const commitRate = (i: number, v: string) => { setIsSample(false); setRows((rs) => rs.map((r, j) => (j === i && v !== r.rate ? { ...r, prev: r.rate, rate: v, updated: new Date().toISOString() } : r))); };
  const total = useMemo(() => rows.reduce((a, r) => a + (n(r.rate) * n(r.qty) || 0), 0), [rows]);
  const cell = "w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400";

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl border border-sky-900/40 bg-slate-900/70 overflow-hidden">
      <div className="px-5 sm:px-6 py-5 border-b border-sky-900/40">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Boxes className="w-6 h-6 text-amber-400" /> Material Rate Sheet</h1>
        <p className="mt-1 text-sm text-slate-300">Keep your latest supplier quotes in one place. Change a rate and we keep the old one, so you can see how much it moved. Add quantities to price an order. Saved on this device.</p>
        {isSample && <p className="mt-2 text-sm text-amber-200">These are sample rates for illustration. Replace them with quotes from your suppliers.</p>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-sm">
          <thead className="text-left text-slate-400">
            <tr><th className="p-3 font-semibold">Material</th><th className="p-3 font-semibold">Unit</th><th className="p-3 font-semibold">Rate (₹)</th><th className="p-3 font-semibold">Change</th><th className="p-3 font-semibold">Qty</th><th className="p-3 font-semibold text-right">Cost</th><th className="p-3"><span className="sr-only">Remove</span></th></tr>
          </thead>
          <tbody className="divide-y divide-sky-900/30">
            {rows.map((r, i) => {
              const rate = n(r.rate), prev = n(r.prev);
              const ch = prev > 0 && rate > 0 ? ((rate - prev) / prev) * 100 : null;
              return (
                <tr key={i}>
                  <td className="p-2"><input aria-label="Material name" className={cell} value={r.name} onChange={(e) => set(i, "name", e.target.value)} /></td>
                  <td className="p-2 w-32"><input aria-label={`Unit for ${r.name}`} className={cell} value={r.unit} onChange={(e) => set(i, "unit", e.target.value)} /></td>
                  <td className="p-2 w-32"><input aria-label={`Rate for ${r.name}`} inputMode="decimal" className={cell + " font-mono"} defaultValue={r.rate} key={r.rate + r.updated} onBlur={(e) => commitRate(i, e.target.value.replace(/[^\d.]/g, ""))} onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }} /></td>
                  <td className="p-2 w-28 font-mono">
                    {ch === null ? <span className="text-slate-500">—</span> : (
                      <span className={`inline-flex items-center gap-1 ${ch > 0 ? "text-rose-300" : ch < 0 ? "text-emerald-300" : "text-slate-300"}`}>{ch > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : ch < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : null}{ch > 0 ? "+" : ""}{ch.toFixed(1)}%</span>
                    )}
                    {r.updated && <div className="text-[11px] text-slate-500">{new Date(r.updated).toLocaleDateString("en-IN")}</div>}
                  </td>
                  <td className="p-2 w-24"><input aria-label={`Quantity of ${r.name}`} inputMode="decimal" className={cell + " font-mono"} value={r.qty} onChange={(e) => set(i, "qty", e.target.value.replace(/[^\d.]/g, ""))} /></td>
                  <td className="p-2 w-28 text-right font-mono text-white">{n(r.qty) > 0 && rate > 0 ? inr(rate * n(r.qty)) : ""}</td>
                  <td className="p-2"><button type="button" aria-label={`Remove ${r.name}`} onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))} className="p-2 text-slate-500 hover:text-rose-300"><Trash2 className="w-4 h-4" /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-6 py-4 border-t border-sky-900/40">
        <div className="flex gap-2">
          <button type="button" onClick={() => setRows((rs) => [...rs, { name: "", unit: "", rate: "", prev: "", qty: "", updated: "" }])} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 text-sm text-slate-200 hover:border-amber-400"><Plus className="w-4 h-4" /> Add material</button>
          <button type="button" onClick={() => { setRows(SAMPLE); setIsSample(true); }} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 text-sm text-slate-200 hover:border-amber-400"><RotateCcw className="w-4 h-4" /> Reset to samples</button>
        </div>
        <div className="text-right" aria-live="polite"><div className="text-xs text-slate-400">Order total</div><div className="text-xl font-bold font-mono text-white">{total > 0 ? inr(total) : "—"}</div></div>
      </div>
    </div>
  );
}
