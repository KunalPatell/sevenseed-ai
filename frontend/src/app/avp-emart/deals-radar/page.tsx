"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Spotlight, SmoothScrollProvider } from "@main/ui-core";
import { ArrowLeft, Radar, ExternalLink, Trash2, Plus, AlertTriangle, CheckCircle2, Save } from "lucide-react";

// Deal Checker. Sevenseed has no live feed of store prices, so this tool works on the
// prices the shopper sees: it computes the real discount, finds the cheapest store,
// flags common tricks, and opens real searches on each store.

type StorePrice = { store: string; price: string; fee: string };
type SavedCheck = { product: string; mrp: number; best: number; bestStore: string; at: string };

const STORES: { name: string; url: (q: string) => string }[] = [
  { name: "Amazon", url: (q) => `https://www.amazon.in/s?k=${encodeURIComponent(q)}` },
  { name: "Flipkart", url: (q) => `https://www.flipkart.com/search?q=${encodeURIComponent(q)}` },
  { name: "Blinkit", url: (q) => `https://blinkit.com/s/?q=${encodeURIComponent(q)}` },
  { name: "Zepto", url: (q) => `https://www.zeptonow.com/search?query=${encodeURIComponent(q)}` },
  { name: "Instamart", url: (q) => `https://www.swiggy.com/instamart/search?query=${encodeURIComponent(q)}` },
  { name: "Google Shopping", url: (q) => `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(q)}` },
];

const EXAMPLE = {
  product: "Sony WH-1000XM5 headphones",
  mrp: "34990",
  rows: [
    { store: "Amazon", price: "26990", fee: "0" },
    { store: "Flipkart", price: "27490", fee: "0" },
    { store: "Croma", price: "29990", fee: "0" },
  ],
};

const STORAGE_KEY = "ss-emart-deal-checks";
const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

export default function DealCheckerRoute() {
  const [product, setProduct] = useState("");
  const [mrp, setMrp] = useState("");
  const [rows, setRows] = useState<StorePrice[]>([
    { store: "Amazon", price: "", fee: "" },
    { store: "Flipkart", price: "", fee: "" },
  ]);
  const [saved, setSaved] = useState<SavedCheck[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    try { setSaved(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")); } catch { /* storage blocked */ }
  }, []);

  const result = useMemo(() => {
    const m = parseFloat(mrp);
    const offers = rows
      .map((r) => ({ store: r.store.trim() || "Store", total: parseFloat(r.price) + (parseFloat(r.fee) || 0), price: parseFloat(r.price) }))
      .filter((r) => r.price > 0);
    if (!offers.length) return null;
    offers.sort((a, b) => a.total - b.total);
    const best = offers[0], worst = offers[offers.length - 1];
    const flags: { bad: boolean; text: string }[] = [];
    const disc = m > 0 ? ((m - best.total) / m) * 100 : null;
    if (m > 0 && best.total > m) flags.push({ bad: true, text: `The cheapest offer is above the MRP you entered (${inr(m)}). Check the MRP on the pack.` });
    if (disc !== null && disc >= 60) flags.push({ bad: true, text: `A ${Math.round(disc)}% discount is unusually high. Sellers sometimes inflate the MRP; compare with the price on the maker's own site.` });
    if (offers.length < 3) flags.push({ bad: false, text: "Compare at least three stores before deciding: the gap between stores is often bigger than the 'discount'." });
    const spread = worst.total - best.total;
    if (offers.length > 1 && spread > 0) flags.push({ bad: false, text: `Choosing ${best.store} over ${worst.store} saves ${inr(spread)}.` });
    rows.forEach((r) => { if ((parseFloat(r.fee) || 0) > 0 && parseFloat(r.price) > 0) flags.push({ bad: false, text: `${r.store || "A store"} adds ${inr(parseFloat(r.fee))} in delivery/handling fees; it is included in the totals.` }); });
    return { offers, best, disc, flags };
  }, [mrp, rows]);

  const setRow = (i: number, k: keyof StorePrice, v: string) => setRows((rs) => rs.map((r, j) => (j === i ? { ...r, [k]: v } : r)));

  const save = () => {
    if (!result || !product.trim()) { setNote("Add a product name and at least one price first."); return; }
    const entry: SavedCheck = { product: product.trim(), mrp: parseFloat(mrp) || 0, best: result.best.total, bestStore: result.best.store, at: new Date().toISOString() };
    const next = [entry, ...saved].slice(0, 30);
    setSaved(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setNote("Saved on this device. Check again later to see if the price moved."); } catch { setNote("Couldn't save: your browser is blocking storage."); }
  };

  const history = saved.filter((s) => product.trim() && s.product.toLowerCase() === product.trim().toLowerCase());
  const q = product.trim();

  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#030712] text-slate-100 px-4 py-8 md:p-10">
        <Spotlight className="-top-40 left-20" fill="rgba(236, 72, 153, 0.2)" />
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <Link href="/avp-emart" aria-label="Back to AVP E-Mart" className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-pink-400">AVP E-Mart</div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 flex items-center gap-2">
                <Radar className="w-6 h-6 text-pink-400" /> Deal Checker
              </h1>
            </div>
          </div>
          <p className="text-slate-300 max-w-2xl">
            Is that sale really a deal? Enter the prices you see in each store. We work out the true discount, the cheapest store once fees are added, and warn you about common pricing tricks. Nothing leaves your device.
          </p>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-bold">1. What are you buying?</h2>
                <button type="button" onClick={() => { setProduct(EXAMPLE.product); setMrp(EXAMPLE.mrp); setRows(EXAMPLE.rows); }} className="text-sm text-pink-300 hover:text-pink-200 underline underline-offset-4">
                  Try an example
                </button>
              </div>
              <label className="block text-sm text-slate-300">Product name
                <input value={product} onChange={(e) => setProduct(e.target.value)} placeholder="e.g. boAt Airdopes 141" className="mt-1 w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-pink-500" />
              </label>
              <label className="block text-sm text-slate-300">MRP printed on the product (₹)
                <input inputMode="decimal" value={mrp} onChange={(e) => setMrp(e.target.value.replace(/[^\d.]/g, ""))} placeholder="e.g. 4490" className="mt-1 w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-pink-500" />
              </label>

              <h2 className="text-lg font-bold pt-2">2. Prices you found</h2>
              <div className="space-y-3">
                {rows.map((r, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_0.8fr_auto] gap-2 items-end">
                    <label className="text-xs text-slate-400">Store
                      <input value={r.store} onChange={(e) => setRow(i, "store", e.target.value)} className="mt-1 w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-pink-500" />
                    </label>
                    <label className="text-xs text-slate-400">Price (₹)
                      <input inputMode="decimal" value={r.price} onChange={(e) => setRow(i, "price", e.target.value.replace(/[^\d.]/g, ""))} className="mt-1 w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-pink-500" />
                    </label>
                    <label className="text-xs text-slate-400">Fees (₹)
                      <input inputMode="decimal" value={r.fee} placeholder="0" onChange={(e) => setRow(i, "fee", e.target.value.replace(/[^\d.]/g, ""))} className="mt-1 w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-pink-500" />
                    </label>
                    <button type="button" aria-label={`Remove ${r.store || "store"}`} onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))} disabled={rows.length < 2} className="p-2.5 rounded-lg border border-slate-800 text-slate-400 hover:text-rose-300 disabled:opacity-30">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => setRows((rs) => [...rs, { store: "", price: "", fee: "" }])} disabled={rows.length >= 8} className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-slate-700 text-slate-200 hover:border-pink-500 disabled:opacity-40">
                <Plus className="w-4 h-4" /> Add a store
              </button>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4" aria-live="polite">
              <h2 className="text-lg font-bold">3. Verdict</h2>
              {!result ? (
                <p className="text-slate-400 text-sm">Enter at least one price to see the verdict.</p>
              ) : (
                <>
                  <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40">
                    <div className="text-xs uppercase tracking-wide text-emerald-300">Cheapest after fees</div>
                    <div className="text-3xl font-bold font-mono text-emerald-300">{inr(result.best.total)}</div>
                    <div className="text-sm text-emerald-200">at {result.best.store}{result.disc !== null ? ` · ${Math.round(result.disc)}% below MRP` : ""}</div>
                  </div>
                  <ul className="space-y-2">
                    {result.offers.map((o, i) => (
                      <li key={i} className="flex justify-between text-sm font-mono border-b border-slate-900 pb-1.5">
                        <span className="text-slate-300 font-sans">{i + 1}. {o.store}</span><span>{inr(o.total)}</span>
                      </li>
                    ))}
                  </ul>
                  <ul className="space-y-2">
                    {result.flags.map((f, i) => (
                      <li key={i} className={`flex gap-2 text-sm ${f.bad ? "text-amber-200" : "text-slate-300"}`}>
                        {f.bad ? <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-amber-400" /> : <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />}
                        <span>{f.text}</span>
                      </li>
                    ))}
                  </ul>
                  <button type="button" onClick={save} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-black text-sm font-bold">
                    <Save className="w-4 h-4" /> Save this check
                  </button>
                  {note && <p className="text-sm text-slate-300">{note}</p>}
                  {history.length > 1 && (
                    <div className="text-sm text-slate-300">
                      <div className="font-semibold mb-1">Your earlier checks for this product</div>
                      {history.slice(0, 5).map((h, i) => (
                        <div key={i} className="flex justify-between font-mono text-xs py-0.5"><span>{new Date(h.at).toLocaleDateString("en-IN")}</span><span>{inr(h.best)} · {h.bestStore}</span></div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          <section className="p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-slate-800">
            <h2 className="text-lg font-bold">Look up current prices</h2>
            <p className="text-sm text-slate-400 mt-1">{q ? `Opens a search for “${q}” in a new tab.` : "Type a product name above, then search each store."}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {STORES.map((s) => (
                <a key={s.name} href={q ? s.url(q) : undefined} target="_blank" rel="noopener noreferrer" aria-disabled={!q}
                  onClick={(e) => { if (!q) { e.preventDefault(); setNote("Type a product name first."); } }}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-sm ${q ? "border-slate-700 text-slate-100 hover:border-pink-500" : "border-slate-800 text-slate-500 cursor-not-allowed"}`}>
                  {s.name} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </section>

          {saved.length > 0 && (
            <section className="p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Saved checks</h2>
                <button type="button" onClick={() => { setSaved([]); try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ } }} className="text-sm text-slate-400 hover:text-rose-300">Clear all</button>
              </div>
              <ul className="mt-3 divide-y divide-slate-900">
                {saved.slice(0, 10).map((s, i) => (
                  <li key={i} className="py-2 flex flex-wrap justify-between gap-2 text-sm">
                    <button type="button" className="text-left text-slate-100 hover:text-pink-300" onClick={() => { setProduct(s.product); setMrp(s.mrp ? String(s.mrp) : ""); }}>{s.product}</button>
                    <span className="font-mono text-slate-300">{inr(s.best)} at {s.bestStore} · {new Date(s.at).toLocaleDateString("en-IN")}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
    </SmoothScrollProvider>
  );
}
