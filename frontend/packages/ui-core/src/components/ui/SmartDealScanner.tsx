"use client";

import React, { useState } from "react";
import { Scan, ShieldAlert, ShieldCheck, Filter } from "lucide-react";

type Deal = {
  id: string;
  name: string;
  category: "Electronics" | "Fashion" | "Home" | "Grocery";
  mrp: number;
  saleePrice: number;
  preSaleTypicalPrice: number;
};

const DEALS: Deal[] = [
  { id: "d1", name: "boAt Airdopes 141", category: "Electronics", mrp: 2999, saleePrice: 799, preSaleTypicalPrice: 1099 },
  { id: "d2", name: "Levi's 511 Slim Jeans", category: "Fashion", mrp: 3499, saleePrice: 1399, preSaleTypicalPrice: 1450 },
  { id: "d3", name: "Prestige Induction Cooktop", category: "Home", mrp: 2795, saleePrice: 1399, preSaleTypicalPrice: 1899 },
  { id: "d4", name: "Samsung 55\" Crystal 4K TV", category: "Electronics", mrp: 64990, saleePrice: 38990, preSaleTypicalPrice: 41500 },
  { id: "d5", name: "Tata Sampann Toor Dal 1kg", category: "Grocery", mrp: 189, saleePrice: 165, preSaleTypicalPrice: 168 },
  { id: "d6", name: "Nike Air Zoom Pegasus", category: "Fashion", mrp: 11995, saleePrice: 6999, preSaleTypicalPrice: 8999 },
];

const CATEGORIES = ["All", "Electronics", "Fashion", "Home", "Grocery"] as const;

export function SmartDealScanner() {
  const [budget, setBudget] = useState(50000);
  const [minDiscount, setMinDiscount] = useState(40);
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");

  const analyzed = DEALS.map((d) => {
    const discountPct = Math.round(((d.mrp - d.saleePrice) / d.mrp) * 100);
    const realDiscountPct = Math.round(((d.preSaleTypicalPrice - d.saleePrice) / d.preSaleTypicalPrice) * 100);
    const inflatedMrp = discountPct - realDiscountPct > 15;
    return { ...d, discountPct, realDiscountPct, inflatedMrp };
  });

  const filtered = analyzed.filter(
    (d) => d.saleePrice <= budget && d.discountPct >= minDiscount && (category === "All" || d.category === category)
  );

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl border border-emerald-800/40 bg-emerald-950/20 backdrop-blur-xl overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-emerald-800/40 text-sm font-bold text-slate-100">
        <Scan className="w-4 h-4 text-emerald-400" />
        <span>Smart Deal Scanner</span>
        <span className="text-[10px] font-mono text-slate-500">(buyhatke-style, flags inflated MRP)</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 border-b border-emerald-800/40">
        <div>
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>Max budget</span>
            <span className="font-mono text-emerald-400">₹{budget.toLocaleString("en-IN")}</span>
          </div>
          <input type="range" min={500} max={70000} step={500} value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full accent-emerald-500" />
        </div>
        <div>
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>Min. discount off MRP</span>
            <span className="font-mono text-emerald-400">{minDiscount}%</span>
          </div>
          <input type="range" min={0} max={80} step={5} value={minDiscount} onChange={(e) => setMinDiscount(Number(e.target.value))} className="w-full accent-emerald-500" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1"><Filter className="w-3 h-3" /> Category</div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as (typeof CATEGORIES)[number])}
            className="w-full px-3 py-1.5 rounded-lg bg-[#012018] border border-emerald-900/50 text-xs text-white focus:outline-none"
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="divide-y divide-emerald-900/30 max-h-96 overflow-y-auto">
        {filtered.length === 0 && <div className="p-6 text-center text-xs text-slate-500">No deals match these filters — try loosening the discount or budget.</div>}
        {filtered.map((d) => (
          <div key={d.id} className="flex items-center justify-between gap-3 px-6 py-4">
            <div>
              <div className="text-sm font-bold text-slate-100">{d.name}</div>
              <div className="text-[11px] font-mono text-slate-500">{d.category} · MRP ₹{d.mrp.toLocaleString("en-IN")} → ₹{d.saleePrice.toLocaleString("en-IN")} ({d.discountPct}% off)</div>
            </div>
            {d.inflatedMrp ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 shrink-0">
                <ShieldAlert className="w-3 h-3" /> MRP inflated — real discount ~{d.realDiscountPct}%
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
                <ShieldCheck className="w-3 h-3" /> Genuine deal
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
