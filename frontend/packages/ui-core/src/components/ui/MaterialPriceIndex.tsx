"use client";

import React, { useState } from "react";
import { TrendingUp, TrendingDown, Boxes, RefreshCw } from "lucide-react";

type Material = { name: string; unit: string; price: number; change: number };

const SEED: Material[] = [
  { name: "TMT Steel Bar (Fe-500D)", unit: "per quintal", price: 5420, change: 1.8 },
  { name: "OPC 53-Grade Cement", unit: "per bag (50kg)", price: 392, change: -0.6 },
  { name: "River Sand", unit: "per brass", price: 4800, change: 3.2 },
  { name: "Red Clay Bricks", unit: "per 1000 units", price: 6200, change: 0.4 },
  { name: "RMC (M25 Grade)", unit: "per cum", price: 6850, change: -1.1 },
];

export function MaterialPriceIndex() {
  const [materials, setMaterials] = useState<Material[]>(SEED);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setMaterials((prev) =>
        prev.map((m) => {
          const drift = (Math.random() - 0.5) * 2.5;
          return { ...m, price: Math.max(1, Math.round(m.price * (1 + drift / 100))), change: Number(drift.toFixed(1)) };
        })
      );
      setRefreshing(false);
    }, 700);
  };

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl border border-sky-900/40 bg-slate-900/70 backdrop-blur-xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-sky-900/40">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
          <Boxes className="w-4 h-4 text-amber-400" />
          <span>Live Material Price Index</span>
          <span className="text-[10px] font-mono text-slate-500">(regional wholesale rates)</span>
        </div>
        <button
          onClick={refresh}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-950 border border-sky-900/50 hover:border-amber-500/50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} /> Refresh Rates
        </button>
      </div>

      <div className="divide-y divide-sky-900/30">
        {materials.map((m) => (
          <div key={m.name} className="flex items-center justify-between gap-3 px-6 py-3.5">
            <div>
              <div className="text-sm font-medium text-slate-100">{m.name}</div>
              <div className="text-[11px] font-mono text-slate-500">{m.unit}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-white">₹{m.price.toLocaleString("en-IN")}</div>
              <div className={`text-[11px] font-mono flex items-center gap-1 justify-end ${m.change >= 0 ? "text-rose-400" : "text-emerald-400"}`}>
                {m.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(m.change)}% today
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
