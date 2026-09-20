"use client";

import React, { useState } from "react";
import { ShoppingCart, Zap, TrendingDown, Clock, Check } from "lucide-react";

interface Item {
  id: string;
  name: string;
  qty: number;
  blinkit: number;
  zepto: number;
  instamart: number;
  bigbasket: number;
}

const DEFAULT_ITEMS: Item[] = [
  { id: "1", name: "Amul Gold Milk 500ml", qty: 2, blinkit: 34, zepto: 33, instamart: 34, bigbasket: 32 },
  { id: "2", name: "Harvest Gold Bread 400g", qty: 1, blinkit: 45, zepto: 45, instamart: 48, bigbasket: 42 },
  { id: "3", name: "Farm Fresh Eggs (6 pcs)", qty: 1, blinkit: 60, zepto: 58, instamart: 62, bigbasket: 55 },
  { id: "4", name: "Maggi 2-Min Noodles 280g", qty: 2, blinkit: 56, zepto: 56, instamart: 58, bigbasket: 54 },
  { id: "5", name: "Coca-Cola Zero Can 300ml", qty: 2, blinkit: 40, zepto: 38, instamart: 40, bigbasket: 38 }
];

export function QuickCommerceOptimizer() {
  const [items, setItems] = useState<Item[]>(DEFAULT_ITEMS);

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, qty: Math.max(0, it.qty + delta) } : it))
    );
  };

  const computeStore = (storeKey: "blinkit" | "zepto" | "instamart" | "bigbasket", deliveryFee: number, eta: string) => {
    const itemTotal = items.reduce((sum, it) => sum + it[storeKey] * it.qty, 0);
    const platformFee = 5;
    const grand = itemTotal > 0 ? itemTotal + deliveryFee + platformFee : 0;
    return { itemTotal, deliveryFee, platformFee, grand, eta };
  };

  const stores = [
    { name: "Zepto", icon: "🟣", color: "border-purple-500", ...computeStore("zepto", 15, "8-10 mins") },
    { name: "Blinkit", icon: "🟡", color: "border-yellow-500", ...computeStore("blinkit", 16, "10-12 mins") },
    { name: "Swiggy Instamart", icon: "🟠", color: "border-orange-500", ...computeStore("instamart", 20, "12-15 mins") },
    { name: "BigBasket Now", icon: "🟢", color: "border-emerald-500", ...computeStore("bigbasket", 10, "15-20 mins") }
  ];

  const minTotal = Math.min(...stores.map((s) => s.grand).filter((g) => g > 0));

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-8 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <ShoppingCart className="w-4 h-4" /> Real-Time Quick Commerce Aggregator
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Quick Commerce Cart Optimizer
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
          Compare multi-item grocery baskets across Zepto, Blinkit, Instamart, and BigBasket with delivery surge fees.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Cart Item Builder */}
        <div className="md:col-span-5 bg-slate-950/60 border border-slate-800/80 p-6 rounded-xl space-y-4">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Grocery Basket</h3>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-slate-900/90 border border-slate-800 rounded-lg text-sm">
                <div>
                  <div className="font-semibold text-white text-xs">{item.name}</div>
                  <div className="text-slate-400 font-mono text-xs">~₹{item.zepto} / unit</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    className="w-6 h-6 rounded bg-slate-800 text-white font-bold flex items-center justify-center hover:bg-slate-700"
                  >
                    -
                  </button>
                  <span className="font-mono text-white text-xs font-bold w-4 text-center">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="w-6 h-6 rounded bg-slate-800 text-white font-bold flex items-center justify-center hover:bg-slate-700"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Store Breakdown Cards */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stores.map((store) => {
            const isWinner = store.grand === minTotal && minTotal > 0;
            return (
              <div
                key={store.name}
                className={`p-5 rounded-xl bg-slate-950/80 border ${store.color} relative flex flex-col justify-between transition hover:-translate-y-1`}
              >
                {isWinner && (
                  <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <Check className="w-3 h-3" /> Cheapest Basket
                  </span>
                )}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 font-bold text-white text-base">
                      <span>{store.icon}</span> {store.name}
                    </div>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {store.eta}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-400 font-mono border-t border-slate-800 pt-3">
                    <div className="flex justify-between">
                      <span className="font-sans">Items Total:</span>
                      <span className="text-slate-200">₹{store.itemTotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-sans">Delivery Fee:</span>
                      <span className="text-slate-200">₹{store.deliveryFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-sans">Platform & Surge:</span>
                      <span className="text-slate-200">₹{store.platformFee}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 mt-4 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-300">Total Cart:</span>
                  <span className="text-2xl font-black font-mono text-emerald-400">₹{store.grand}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
