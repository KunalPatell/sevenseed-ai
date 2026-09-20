"use client";

import React, { useState } from "react";
import { Calculator, FileSpreadsheet, Printer, IndianRupee } from "lucide-react";

interface DSRItem {
  code: string;
  desc: string;
  unit: string;
  rate: number;
  qty: number;
}

const DEFAULT_DSR: DSRItem[] = [
  { code: "DSR 2.8.1", desc: "Earthwork in excavation for foundation trenches in ordinary soil", unit: "m³", rate: 245.0, qty: 120 },
  { code: "DSR 5.2.2", desc: "Reinforced cement concrete (RCC M25) in columns, beams, slabs", unit: "m³", rate: 7850.0, qty: 85 },
  { code: "DSR 5.22.6", desc: "Thermo-Mechanically Treated (TMT Fe-550D) steel bar reinforcement", unit: "kg", rate: 78.5, qty: 6500 },
  { code: "DSR 6.1.2", desc: "Brickwork with common burnt clay bricks in cement mortar 1:4", unit: "m³", rate: 5620.0, qty: 45 }
];

export function BOQTakeoffCalculator() {
  const [items, setItems] = useState<DSRItem[]>(DEFAULT_DSR);

  const updateQty = (index: number, val: number) => {
    setItems((prev) => {
      const next = [...prev];
      next[index].qty = Math.max(0, val);
      return next;
    });
  };

  const subtotal = items.reduce((sum, item) => sum + item.rate * item.qty, 0);
  const contractorProfit = subtotal * 0.15; // 15% CPWD standard
  const gst = (subtotal + contractorProfit) * 0.18; // 18% GST
  const grandTotal = Math.round(subtotal + contractorProfit + gst);

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-8 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Calculator className="w-4 h-4" /> CPWD Delhi Schedule of Rates (DSR 2023)
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Civil Construction BOQ Estimator
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
          Quantity takeoff rate analysis calculating basic costs, 15% contractor profit index, and 18% statutory GST.
        </p>
      </div>

      <div className="bg-slate-950/60 border border-slate-800 rounded-xl overflow-x-auto mb-6">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[11px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-3.5">DSR Code</th>
              <th className="p-3.5">Description</th>
              <th className="p-3.5">Unit</th>
              <th className="p-3.5">Rate (₹)</th>
              <th className="p-3.5">Quantity</th>
              <th className="p-3.5 text-right">Total Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-mono">
            {items.map((it, idx) => (
              <tr key={it.code} className="hover:bg-slate-900/50">
                <td className="p-3.5 text-amber-400 font-bold">{it.code}</td>
                <td className="p-3.5 font-sans text-white text-xs">{it.desc}</td>
                <td className="p-3.5 text-slate-400">{it.unit}</td>
                <td className="p-3.5">₹{it.rate.toFixed(2)}</td>
                <td className="p-3.5">
                  <input
                    type="number"
                    value={it.qty}
                    onChange={(e) => updateQty(idx, Number(e.target.value) || 0)}
                    className="w-24 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </td>
                <td className="p-3.5 text-right font-bold text-white">
                  ₹{Math.round(it.rate * it.qty).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="p-6 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-wrap justify-between items-center gap-6">
        <div className="space-y-1 text-xs text-slate-400 font-mono">
          <div>Subtotal Basic Cost: ₹{Math.round(subtotal).toLocaleString()}</div>
          <div>Contractor Profit (15%): ₹{Math.round(contractorProfit).toLocaleString()}</div>
          <div>Statutory GST (18%): ₹{Math.round(gst).toLocaleString()}</div>
        </div>

        <div className="text-right">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Grand Project Estimate</span>
          <div className="text-3xl md:text-4xl font-black font-mono text-amber-400">
            ₹{grandTotal.toLocaleString()}
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 transition"
        >
          <Printer className="w-4 h-4" /> Export Bill of Quantities (BOQ)
        </button>
      </div>
    </div>
  );
}
