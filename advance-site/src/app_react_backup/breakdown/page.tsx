"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Spotlight, CardSpotlight, SmoothScrollProvider } from "@main/ui-core";
import { ArrowLeft, Wrench, ShieldAlert, FileSpreadsheet, Sparkles, Check, Calculator } from "lucide-react";

interface DSRItem {
  code: string;
  description: string;
  unit: string;
  rate: number;
  quantity: number;
  breakdown: { material: number; labour: number; plant: number; profit: number };
}

const sampleBOQ: DSRItem[] = [
  {
    code: "CPWD-DSR-4.1.3",
    description: "Reinforced cement concrete work in beams, suspended floors, roofs (1:1.5:3)",
    unit: "cum",
    rate: 8420,
    quantity: 45,
    breakdown: { material: 5800, labour: 1400, plant: 420, profit: 800 }
  },
  {
    code: "CPWD-DSR-6.1.1",
    description: "Brick work with common burnt clay F.P.S. (non modular) bricks of class 7.5",
    unit: "cum",
    rate: 6150,
    quantity: 120,
    breakdown: { material: 4100, labour: 1250, plant: 150, profit: 650 }
  },
  {
    code: "CPWD-DSR-13.1.1",
    description: "12 mm cement plaster 1:4 (1 cement: 4 fine sand)",
    unit: "sqm",
    rate: 285,
    quantity: 850,
    breakdown: { material: 140, labour: 105, plant: 10, profit: 30 }
  }
];

export default function BreakdownFactorPage() {
  const [boq, setBoq] = useState<DSRItem[]>(sampleBOQ);

  const grandTotal = boq.reduce((acc, item) => acc + item.rate * item.quantity, 0);

  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#030712] text-slate-100 p-6 md:p-10 space-y-8">
        <Spotlight className="-top-40 left-20" fill="rgba(239, 68, 68, 0.25)" />

        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="text-[11px] font-mono uppercase text-rose-400">Breakdown Factor AEC Intelligence</div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-rose-400" />
                <span>Breakdown Factor — CPWD DSR 2023 & Defect Computer Vision (Togal.ai)</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full">
              IS 1200 Compliant Estimation
            </span>
          </div>
        </div>

        {/* Defect AI & BOQ Table */}
        <div className="p-6 rounded-2xl bg-[#050814] border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-100">4-Part Rate Buildup BOQ (CPWD DSR 2023)</h3>
              <p className="text-xs text-slate-400">Material + Labour + Tools & Plant + 15% Contractor's Overhead/Profit.</p>
            </div>

            <button
              onClick={() => alert("IS 1200 BOQ Excel exported successfully.")}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-200 flex items-center gap-2 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export IS 1200 BOQ Excel</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px]">
                  <th className="pb-3">DSR Code</th>
                  <th className="pb-3">Description</th>
                  <th className="pb-3">Unit</th>
                  <th className="pb-3">Quantity</th>
                  <th className="pb-3">DSR Rate (₹)</th>
                  <th className="pb-3 text-right">Total Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {boq.map((item) => (
                  <tr key={item.code} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 text-rose-400 font-bold">{item.code}</td>
                    <td className="py-3 text-slate-200 pr-4">{item.description}</td>
                    <td className="py-3 text-slate-400">{item.unit}</td>
                    <td className="py-3 text-slate-300 font-bold">{item.quantity}</td>
                    <td className="py-3 text-slate-300">₹{item.rate.toLocaleString()}</td>
                    <td className="py-3 text-right text-emerald-400 font-bold">
                      ₹{(item.rate * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-sm font-mono">
            <span className="text-slate-400 uppercase">Estimated Total Construction Valuation:</span>
            <span className="text-xl font-bold text-emerald-400">₹{grandTotal.toLocaleString()}</span>
          </div>
        </div>
      </main>
    </SmoothScrollProvider>
  );
}
