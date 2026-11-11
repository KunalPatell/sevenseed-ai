"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Spotlight, SmoothScrollProvider } from "@main/ui-core";
import { ArrowLeft, SlidersHorizontal, Trophy, Plus, Trash2, ExternalLink, RotateCcw } from "lucide-react";

// Side-by-side spec comparison on the shopper's own products. Each row says whether a
// higher or lower number wins; the tool picks the winner per row from the first number
// in each cell, totals the wins, and links to real store searches.

type Better = "higher" | "lower" | "info";
type Row = { label: string; better: Better; values: string[] };
type State = { names: string[]; prices: string[]; rows: Row[] };

const EXAMPLE: State = {
  names: ["Laptop A", "Laptop B"],
  prices: ["64990", "58990"],
  rows: [
    { label: "RAM (GB)", better: "higher", values: ["16", "8"] },
    { label: "Storage (GB)", better: "higher", values: ["512", "1024"] },
    { label: "Weight (kg)", better: "lower", values: ["1.4", "1.8"] },
    { label: "Battery (hours)", better: "higher", values: ["12", "9"] },
    { label: "Screen", better: "info", values: ["14\" IPS", "15.6\" IPS"] },
  ],
};
const BLANK: State = {
  names: ["", ""],
  prices: ["", ""],
  rows: [
    { label: "", better: "higher", values: ["", ""] },
    { label: "", better: "higher", values: ["", ""] },
  ],
};
const KEY = "ss-emart-spec-compare";
const num = (s: string) => { const m = (s || "").replace(/,/g, "").match(/-?\d+(\.\d+)?/); return m ? parseFloat(m[0]) : NaN; };
const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

export default function SpecCompareRoute() {
  const [s, setS] = useState<State>(BLANK);
  useEffect(() => { try { const v = localStorage.getItem(KEY); if (v) setS(JSON.parse(v)); } catch { /* ignore */ } }, []);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ } }, [s]);

  const n = s.names.length;
  const label = (i: number) => s.names[i]?.trim() || `Product ${i + 1}`;

  const analysis = useMemo(() => {
    const wins = Array(n).fill(0);
    const rowWinners = s.rows.map((r) => {
      if (r.better === "info") return [] as number[];
      const vals = r.values.map(num);
      if (vals.filter((v) => !isNaN(v)).length < 2) return [];
      const best = r.better === "higher" ? Math.max(...vals.filter((v) => !isNaN(v))) : Math.min(...vals.filter((v) => !isNaN(v)));
      const w = vals.map((v, i) => (v === best ? i : -1)).filter((i) => i >= 0);
      if (w.length === vals.filter((v) => !isNaN(v)).length) return []; // all tied
      w.forEach((i) => wins[i]++);
      return w;
    });
    const counted = rowWinners.filter((w) => w.length).length;
    const prices = s.prices.map(num);
    let pick = -1;
    if (counted) { const top = Math.max(...wins); const tied = wins.map((w, i) => (w === top ? i : -1)).filter((i) => i >= 0); pick = tied.length === 1 ? tied[0] : tied.sort((a, b) => (prices[a] || Infinity) - (prices[b] || Infinity))[0]; }
    return { wins, rowWinners, counted, prices, pick };
  }, [s, n]);

  const update = (f: (d: State) => void) => setS((p) => { const d: State = JSON.parse(JSON.stringify(p)); f(d); return d; });
  const addProduct = () => update((d) => { d.names.push(""); d.prices.push(""); d.rows.forEach((r) => r.values.push("")); });
  const removeProduct = (i: number) => update((d) => { d.names.splice(i, 1); d.prices.splice(i, 1); d.rows.forEach((r) => r.values.splice(i, 1)); });
  const cell = "w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-500";

  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#030712] text-slate-100 px-4 py-8 md:p-10">
        <Spotlight className="-top-40 left-20" fill="rgba(56, 189, 248, 0.2)" />
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <Link href="/avp-emart" aria-label="Back to AVP E-Mart" className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-sky-400">AVP E-Mart</div>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2"><SlidersHorizontal className="w-6 h-6 text-sky-400" /> Spec Compare</h1>
            </div>
          </div>
          <p className="text-slate-300 max-w-2xl">
            Put the products you're deciding between side by side. For each spec, choose whether a higher or lower number is better, and we'll mark the winner on every row and tell you which one comes out ahead. Your table is saved on this device.
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setS(EXAMPLE)} className="px-3 py-2 rounded-lg border border-slate-700 text-sm hover:border-sky-500">Load an example</button>
            <button type="button" onClick={() => setS(BLANK)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 text-sm hover:border-sky-500"><RotateCcw className="w-4 h-4" /> Start over</button>
            <button type="button" onClick={addProduct} disabled={n >= 4} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 text-sm hover:border-sky-500 disabled:opacity-40"><Plus className="w-4 h-4" /> Add product</button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th scope="col" className="p-3 text-left font-semibold text-slate-300 w-56">Spec</th>
                  {s.names.map((nm, i) => (
                    <th key={i} scope="col" className="p-3 text-left align-top">
                      <div className="flex gap-1.5">
                        <input aria-label={`Name of product ${i + 1}`} value={nm} placeholder={`Product ${i + 1}`} onChange={(e) => update((d) => { d.names[i] = e.target.value; })} className={cell + " font-semibold"} />
                        {n > 2 && <button type="button" aria-label={`Remove ${label(i)}`} onClick={() => removeProduct(i)} className="p-2 text-slate-500 hover:text-rose-300"><Trash2 className="w-4 h-4" /></button>}
                      </div>
                      <input aria-label={`Price of ${label(i)} in rupees`} inputMode="decimal" value={s.prices[i]} placeholder="Price ₹" onChange={(e) => update((d) => { d.prices[i] = e.target.value.replace(/[^\d.]/g, ""); })} className={cell + " mt-1.5 font-mono"} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {s.rows.map((r, ri) => (
                  <tr key={ri} className="border-b border-slate-900">
                    <td className="p-3 align-top">
                      <input aria-label={`Spec ${ri + 1} name`} value={r.label} placeholder="e.g. RAM (GB)" onChange={(e) => update((d) => { d.rows[ri].label = e.target.value; })} className={cell} />
                      <div className="mt-1.5 flex gap-1.5">
                        <select aria-label={`Which is better for ${r.label || "this spec"}`} value={r.better} onChange={(e) => update((d) => { d.rows[ri].better = e.target.value as Better; })} className={cell + " py-1.5"}>
                          <option value="higher">Higher is better</option>
                          <option value="lower">Lower is better</option>
                          <option value="info">Just for info</option>
                        </select>
                        <button type="button" aria-label={`Remove spec ${r.label || ri + 1}`} onClick={() => update((d) => { d.rows.splice(ri, 1); })} className="p-2 text-slate-500 hover:text-rose-300"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                    {r.values.map((v, ci) => {
                      const win = analysis.rowWinners[ri]?.includes(ci);
                      return (
                        <td key={ci} className="p-3 align-top">
                          <input aria-label={`${r.label || "Spec"} for ${label(ci)}`} value={v} onChange={(e) => update((d) => { d.rows[ri].values[ci] = e.target.value; })} className={cell + (win ? " border-emerald-500 bg-emerald-950/40" : "")} />
                          {win && <div className="mt-1 text-xs text-emerald-300 flex items-center gap-1"><Trophy className="w-3 h-3" /> Better</div>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-3">
              <button type="button" onClick={() => update((d) => { d.rows.push({ label: "", better: "higher", values: Array(n).fill("") }); })} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 text-sm hover:border-sky-500"><Plus className="w-4 h-4" /> Add spec</button>
            </div>
          </div>

          <section className="grid gap-4 md:grid-cols-[1.2fr_1fr]" aria-live="polite">
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
              <h2 className="text-lg font-bold">Result</h2>
              {!analysis.counted ? (
                <p className="mt-2 text-sm text-slate-400">Fill in at least one spec with numbers for two products to see a winner.</p>
              ) : (
                <>
                  <p className="mt-2 text-slate-200"><b className="text-emerald-300">{label(analysis.pick)}</b> wins {analysis.wins[analysis.pick]} of {analysis.counted} compared specs.</p>
                  <ul className="mt-3 space-y-1.5 text-sm">
                    {s.names.map((_, i) => {
                      const p = analysis.prices[i];
                      return (
                        <li key={i} className="flex justify-between font-mono">
                          <span className="font-sans text-slate-300">{label(i)}</span>
                          <span>{analysis.wins[i]} wins{p > 0 ? ` · ${inr(p)}` : ""}{p > 0 && analysis.wins[i] ? ` · ${inr(p / analysis.wins[i])} per win` : ""}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <p className="mt-3 text-xs text-slate-400">Wins only count specs you marked higher/lower is better. Weigh the specs that matter most to you; a win on weight may matter more than a win on storage.</p>
                </>
              )}
            </div>
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
              <h2 className="text-lg font-bold">Check today's prices</h2>
              <ul className="mt-3 space-y-2">
                {s.names.map((nm, i) => nm.trim() ? (
                  <li key={i} className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-slate-300 w-full sm:w-auto sm:min-w-[7rem]">{nm}</span>
                    {[["Amazon", `https://www.amazon.in/s?k=`], ["Flipkart", `https://www.flipkart.com/search?q=`], ["Google", `https://www.google.com/search?tbm=shop&q=`]].map(([st, u]) => (
                      <a key={st} href={u + encodeURIComponent(nm)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-700 hover:border-sky-500">{st} <ExternalLink className="w-3 h-3" /></a>
                    ))}
                  </li>
                ) : null)}
                {!s.names.some((x) => x.trim()) && <li className="text-sm text-slate-400">Name your products to get store links.</li>}
              </ul>
            </div>
          </section>
        </div>
      </main>
    </SmoothScrollProvider>
  );
}
