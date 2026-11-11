"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ShoppingCart, Check, Plus, Trash2, RotateCcw } from "lucide-react";

// Grocery basket comparer. Sevenseed can't read prices from quick-commerce apps, so the
// shopper types the prices and fees they see in each app (the old version showed fixed
// "real-time" prices). Starts from clearly labelled sample prices; saved on this device.

const STORES = ["Zepto", "Blinkit", "Instamart", "BigBasket"] as const;
type Store = (typeof STORES)[number];
type Item = { id: string; name: string; qty: number; prices: Record<Store, string> };
type Fees = Record<Store, string>;

const SAMPLE_ITEMS: Item[] = [
  { id: "1", name: "Milk 500 ml", qty: 2, prices: { Zepto: "33", Blinkit: "34", Instamart: "34", BigBasket: "32" } },
  { id: "2", name: "Bread 400 g", qty: 1, prices: { Zepto: "45", Blinkit: "45", Instamart: "48", BigBasket: "42" } },
  { id: "3", name: "Eggs (6)", qty: 1, prices: { Zepto: "58", Blinkit: "60", Instamart: "62", BigBasket: "55" } },
];
const SAMPLE_FEES: Fees = { Zepto: "20", Blinkit: "21", Instamart: "25", BigBasket: "10" };
const KEY = "ss-emart-basket";
const num = (s: string) => parseFloat(s) || 0;

export function QuickCommerceOptimizer() {
  const [items, setItems] = useState<Item[]>(SAMPLE_ITEMS);
  const [fees, setFees] = useState<Fees>(SAMPLE_FEES);
  const [sample, setSample] = useState(true);
  useEffect(() => { try { const v = JSON.parse(localStorage.getItem(KEY) || "null"); if (v?.items) { setItems(v.items); setFees(v.fees); setSample(!!v.sample); } } catch { /* ignore */ } }, []);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify({ items, fees, sample })); } catch { /* ignore */ } }, [items, fees, sample]);

  const totals = useMemo(() => STORES.map((s) => {
    const missing = items.some((it) => it.qty > 0 && !num(it.prices[s]));
    const itemsTotal = items.reduce((a, it) => a + num(it.prices[s]) * it.qty, 0);
    return { store: s, itemsTotal, fee: num(fees[s]), grand: itemsTotal > 0 ? itemsTotal + num(fees[s]) : 0, missing };
  }), [items, fees]);
  const valid = totals.filter((t) => t.grand > 0 && !t.missing);
  const best = valid.length ? valid.reduce((a, b) => (b.grand < a.grand ? b : a)) : null;
  const edit = (f: () => void) => { setSample(false); f(); };
  const cell = "w-full px-2 py-1.5 rounded-md bg-slate-950 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-amber-400";

  return (
    <div className="w-full max-w-5xl mx-auto p-5 md:p-8 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2"><ShoppingCart className="w-6 h-6 text-amber-400" /> Grocery Basket Comparer</h1>
        <p className="mt-1 text-sm text-slate-300 max-w-2xl">Type the prices you see in each app and their delivery + handling fees. We add it all up and show which app is really cheapest for your whole basket.</p>
        {sample && <p className="mt-2 text-sm text-amber-200">Showing sample prices. Replace them with what each app shows you today.</p>}
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="text-left text-slate-400 bg-slate-950/60">
            <tr><th className="p-2.5">Item</th><th className="p-2.5 w-20">Qty</th>{STORES.map((s) => <th key={s} className="p-2.5 w-28">{s} ₹</th>)}<th className="p-2.5"><span className="sr-only">Remove</span></th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {items.map((it) => (
              <tr key={it.id}>
                <td className="p-2"><input aria-label="Item name" className={cell + " font-sans"} value={it.name} onChange={(e) => edit(() => setItems((xs) => xs.map((x) => (x.id === it.id ? { ...x, name: e.target.value } : x))))} /></td>
                <td className="p-2"><input aria-label={`Quantity of ${it.name}`} inputMode="numeric" className={cell} value={it.qty} onChange={(e) => edit(() => setItems((xs) => xs.map((x) => (x.id === it.id ? { ...x, qty: parseInt(e.target.value) || 0 } : x))))} /></td>
                {STORES.map((s) => (
                  <td key={s} className="p-2"><input aria-label={`${it.name} price on ${s}`} inputMode="decimal" className={cell} value={it.prices[s]} onChange={(e) => edit(() => setItems((xs) => xs.map((x) => (x.id === it.id ? { ...x, prices: { ...x.prices, [s]: e.target.value.replace(/[^\d.]/g, "") } } : x))))} /></td>
                ))}
                <td className="p-2"><button type="button" aria-label={`Remove ${it.name}`} onClick={() => edit(() => setItems((xs) => xs.filter((x) => x.id !== it.id)))} className="p-1.5 text-slate-500 hover:text-rose-300"><Trash2 className="w-4 h-4" /></button></td>
              </tr>
            ))}
            <tr className="bg-slate-950/40">
              <td className="p-2 text-slate-300" colSpan={2}>Delivery + handling fees</td>
              {STORES.map((s) => <td key={s} className="p-2"><input aria-label={`Fees on ${s}`} inputMode="decimal" className={cell} value={fees[s]} onChange={(e) => edit(() => setFees((f) => ({ ...f, [s]: e.target.value.replace(/[^\d.]/g, "") })))} /></td>)}
              <td />
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => edit(() => setItems((xs) => [...xs, { id: `i-${Date.now()}`, name: "", qty: 1, prices: { Zepto: "", Blinkit: "", Instamart: "", BigBasket: "" } }]))} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 text-sm text-slate-200 hover:border-amber-400"><Plus className="w-4 h-4" /> Add item</button>
        <button type="button" onClick={() => { setItems(SAMPLE_ITEMS); setFees(SAMPLE_FEES); setSample(true); }} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 text-sm text-slate-200 hover:border-amber-400"><RotateCcw className="w-4 h-4" /> Reset to samples</button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-live="polite">
        {totals.map((t) => (
          <div key={t.store} className={`p-4 rounded-xl border ${best?.store === t.store ? "border-emerald-500 bg-emerald-950/30" : "border-slate-800 bg-slate-950/70"}`}>
            <div className="flex items-center justify-between"><span className="font-bold text-white">{t.store}</span>{best?.store === t.store && <span className="text-xs font-bold text-emerald-300 inline-flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Cheapest</span>}</div>
            <div className="mt-2 text-xs text-slate-400 font-mono">Items ₹{Math.round(t.itemsTotal)} + fees ₹{t.fee}</div>
            <div className="text-2xl font-black font-mono text-white">{t.grand ? `₹${Math.round(t.grand)}` : "—"}</div>
            {t.missing && <div className="text-xs text-amber-300 mt-1">Some prices missing</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
