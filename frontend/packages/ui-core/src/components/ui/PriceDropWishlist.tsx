"use client";

import React, { useEffect, useState } from "react";
import { Heart, Bell, TrendingDown, Trash2, Plus, ExternalLink } from "lucide-react";

// Wishlist with target prices, saved on this device. There is no automatic price
// checking or notification: the shopper updates the price when they check, and the list
// shows which items have reached their target.

type WishItem = { id: string; name: string; currentPrice: number; targetPrice: number; store: string };
const KEY = "ss-emart-wishlist";
const SEARCH: Record<string, string> = { Amazon: "https://www.amazon.in/s?k=", Flipkart: "https://www.flipkart.com/search?q=", Croma: "https://www.google.com/search?q=site%3Acroma.com+", "Reliance Digital": "https://www.google.com/search?q=site%3Areliancedigital.in+" };

export function PriceDropWishlist() {
  const [items, setItems] = useState<WishItem[]>([]);
  const [form, setForm] = useState({ name: "", currentPrice: "", targetPrice: "", store: "Amazon" });
  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch { /* ignore */ } }, []);
  const save = (v: WishItem[]) => { setItems(v); try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* ignore */ } };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !(Number(form.currentPrice) > 0) || !(Number(form.targetPrice) > 0)) return;
    save([...items, { id: `w-${Date.now()}`, name: form.name.trim(), currentPrice: Number(form.currentPrice), targetPrice: Number(form.targetPrice), store: form.store }]);
    setForm({ name: "", currentPrice: "", targetPrice: "", store: form.store });
  };
  const input = "px-3 py-2.5 rounded-lg bg-[#012018] border border-emerald-900/50 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500";

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl border border-emerald-800/40 bg-emerald-950/20 overflow-hidden">
      <div className="px-5 sm:px-6 py-5 border-b border-emerald-800/40">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Heart className="w-6 h-6 text-emerald-400" /> Wishlist &amp; Target Prices</h1>
        <p className="mt-1 text-sm text-slate-300">Add things you want and the price you'd happily pay. When you check a store, update the price and we'll tell you when it's time to buy. Saved on this device.</p>
      </div>

      <form onSubmit={addItem} className="grid gap-2 sm:grid-cols-[1.6fr_0.8fr_0.8fr_0.9fr_auto] p-4 border-b border-emerald-800/40">
        <label className="sr-only" htmlFor="wl-name">Product</label>
        <input id="wl-name" placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} />
        <label className="sr-only" htmlFor="wl-now">Price now</label>
        <input id="wl-now" inputMode="decimal" placeholder="Price now ₹" value={form.currentPrice} onChange={(e) => setForm({ ...form, currentPrice: e.target.value.replace(/[^\d.]/g, "") })} className={input + " font-mono"} />
        <label className="sr-only" htmlFor="wl-target">Target price</label>
        <input id="wl-target" inputMode="decimal" placeholder="Buy at ₹" value={form.targetPrice} onChange={(e) => setForm({ ...form, targetPrice: e.target.value.replace(/[^\d.]/g, "") })} className={input + " font-mono"} />
        <label className="sr-only" htmlFor="wl-store">Store</label>
        <select id="wl-store" value={form.store} onChange={(e) => setForm({ ...form, store: e.target.value })} className={input}>{Object.keys(SEARCH).map((s) => <option key={s}>{s}</option>)}</select>
        <button type="submit" className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-500 text-black font-bold text-sm"><Plus className="w-4 h-4" /> Add</button>
      </form>

      <div className="divide-y divide-emerald-900/30" aria-live="polite">
        {items.length === 0 && <p className="px-5 py-6 text-sm text-slate-400">Your wishlist is empty. Add something above.</p>}
        {items.map((i) => {
          const hit = i.currentPrice <= i.targetPrice;
          const togo = Math.round(((i.currentPrice - i.targetPrice) / i.currentPrice) * 100);
          return (
            <div key={i.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-100">{i.name}</div>
                <div className="text-xs text-slate-400">Target ₹{i.targetPrice.toLocaleString("en-IN")} · <a className="underline hover:text-white inline-flex items-center gap-0.5" href={SEARCH[i.store] + encodeURIComponent(i.name)} target="_blank" rel="noopener noreferrer">check on {i.store} <ExternalLink className="w-3 h-3" /></a></div>
              </div>
              <div className="flex items-center gap-2">
                <label className="sr-only" htmlFor={`p-${i.id}`}>Current price of {i.name}</label>
                <input id={`p-${i.id}`} inputMode="decimal" defaultValue={i.currentPrice} onBlur={(e) => { const v = Number(e.target.value.replace(/[^\d.]/g, "")); if (v > 0) save(items.map((x) => (x.id === i.id ? { ...x, currentPrice: v } : x))); }} className="w-24 px-2 py-1.5 rounded-md bg-[#012018] border border-emerald-900/50 text-sm text-white font-mono" />
                {hit ? (
                  <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300"><Bell className="w-3 h-3" /> Buy now</span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300"><TrendingDown className="w-3 h-3" /> {togo}% to go</span>
                )}
                <button type="button" onClick={() => save(items.filter((x) => x.id !== i.id))} className="p-1.5 text-slate-500 hover:text-rose-400" aria-label={`Remove ${i.name}`}><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
