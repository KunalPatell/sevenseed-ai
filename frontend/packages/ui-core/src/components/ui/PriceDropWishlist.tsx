"use client";

import React, { useState } from "react";
import { Heart, Bell, TrendingDown, Trash2, Plus } from "lucide-react";

type WishItem = {
  id: string;
  name: string;
  currentPrice: number;
  targetPrice: number;
  store: string;
};

const SEED: WishItem[] = [
  { id: "w1", name: "Sony WH-1000XM5 Headphones", currentPrice: 26990, targetPrice: 22000, store: "Amazon" },
  { id: "w2", name: "iPhone 16 (128GB)", currentPrice: 74900, targetPrice: 68000, store: "Flipkart" },
  { id: "w3", name: "Dyson V15 Detect", currentPrice: 52900, targetPrice: 45000, store: "Reliance Digital" },
];

export function PriceDropWishlist() {
  const [items, setItems] = useState<WishItem[]>(SEED);
  const [form, setForm] = useState({ name: "", currentPrice: "", targetPrice: "", store: "Amazon" });

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.currentPrice || !form.targetPrice) return;
    setItems((prev) => [
      ...prev,
      { id: `w-${Date.now()}`, name: form.name, currentPrice: Number(form.currentPrice), targetPrice: Number(form.targetPrice), store: form.store },
    ]);
    setForm({ name: "", currentPrice: "", targetPrice: "", store: "Amazon" });
  };

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl border border-emerald-800/40 bg-emerald-950/20 backdrop-blur-xl overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-emerald-800/40 text-sm font-bold text-slate-100">
        <Heart className="w-4 h-4 text-emerald-400" />
        <span>Price Drop Wishlist &amp; Alerts</span>
        <span className="text-[10px] font-mono text-slate-500">(smartprix/buyhatke-style)</span>
      </div>

      <form onSubmit={addItem} className="flex flex-wrap gap-2 p-4 border-b border-emerald-800/40">
        <input
          placeholder="Product name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="flex-1 min-w-[160px] px-3 py-2 rounded-lg bg-[#012018] border border-emerald-900/50 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
        <input
          type="number"
          placeholder="Current ₹"
          value={form.currentPrice}
          onChange={(e) => setForm({ ...form, currentPrice: e.target.value })}
          className="w-28 px-3 py-2 rounded-lg bg-[#012018] border border-emerald-900/50 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
        <input
          type="number"
          placeholder="Alert at ₹"
          value={form.targetPrice}
          onChange={(e) => setForm({ ...form, targetPrice: e.target.value })}
          className="w-28 px-3 py-2 rounded-lg bg-[#012018] border border-emerald-900/50 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
        <button type="submit" className="p-2.5 rounded-lg bg-emerald-500 text-black hover:opacity-90 transition-opacity" aria-label="Add to wishlist">
          <Plus className="w-4 h-4" />
        </button>
      </form>

      <div className="divide-y divide-emerald-900/30">
        {items.map((i) => {
          const dropPct = Math.round(((i.currentPrice - i.targetPrice) / i.currentPrice) * 100);
          const triggered = i.currentPrice <= i.targetPrice;
          return (
            <div key={i.id} className="flex items-center justify-between gap-3 px-5 py-4">
              <div>
                <div className="text-sm font-bold text-slate-100">{i.name}</div>
                <div className="text-[11px] font-mono text-slate-500">{i.store} · current ₹{i.currentPrice.toLocaleString("en-IN")}</div>
              </div>
              <div className="flex items-center gap-3">
                {triggered ? (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400">
                    <Bell className="w-3 h-3" /> Target hit!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                    <TrendingDown className="w-3 h-3" /> {dropPct}% to go
                  </span>
                )}
                <button onClick={() => remove(i.id)} className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors" aria-label="Remove">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
