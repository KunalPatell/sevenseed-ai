"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Spotlight,
  CardSpotlight,
  ArchitecturalPavilion3D,
  BlueprintGridBackground,
  BorderBeam,
  CyberButton,
  SmoothScrollProvider,
} from "@main/ui-core";
import {
  ArrowLeft,
  Wrench,
  ShieldAlert,
  FileSpreadsheet,
  Sparkles,
  Check,
  Calculator,
  HardHat,
  Ruler,
  ArrowUpRight,
  Compass,
} from "lucide-react";

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
    breakdown: { material: 5800, labour: 1400, plant: 420, profit: 800 },
  },
  {
    code: "CPWD-DSR-6.1.1",
    description: "Brick work with common burnt clay F.P.S. (non modular) bricks of class 7.5",
    unit: "cum",
    rate: 6150,
    quantity: 120,
    breakdown: { material: 4100, labour: 1250, plant: 150, profit: 650 },
  },
  {
    code: "CPWD-DSR-13.1.1",
    description: "12 mm cement plaster 1:4 (1 cement: 4 fine sand)",
    unit: "sqm",
    rate: 285,
    quantity: 850,
    breakdown: { material: 140, labour: 105, plant: 10, profit: 30 },
  },
];

export default function BreakdownFactorPage() {
  const [boq, setBoq] = useState<DSRItem[]>(sampleBOQ);

  const subtotal = boq.reduce((acc, item) => acc + item.rate * item.quantity, 0);
  const contractorProfit = Math.round(subtotal * 0.15);
  const gst = Math.round((subtotal + contractorProfit) * 0.18);
  const grandTotal = subtotal + contractorProfit + gst;

  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#061124] text-slate-100 p-6 md:p-10 space-y-10 overflow-hidden font-sans">
        {/* Precision CAD Blueprint Grid & Crosshair Coordinates Background */}
        <BlueprintGridBackground />
        <Spotlight className="-top-40 left-20" fill="rgba(14, 165, 233, 0.25)" />

        {/* Navigation Bar */}
        <div className="relative z-10 flex items-center justify-between border-b border-sky-900/50 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="text-[11px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Breakdown Factor Civil AI</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
                <HardHat className="w-5 h-5 text-amber-400" />
                <span>Breakdown Factor — CPWD DSR Civil BOQ & Safety Takeoff (Procore & OSHA)</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-amber-400 bg-amber-950/40 border border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5" />
              <span>CPWD DSR 2023 Verified</span>
            </span>
          </div>
        </div>

        {/* Hero Section with Dedicated 3D Architectural Pavilion */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-400 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Civil Construction Intelligence & Cost Engineering</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Algorithmic Civil BOQ & <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-400">
                Site Safety Compliance
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Synthesizing official CPWD Delhi Schedule of Rates (DSR 2023), automated 15% contractor profit and 18% statutory GST takeoff computations, with computer vision PPE compliance.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <CyberButton href="/breakdown/boq-estimator" icon={Calculator} className="from-amber-600 via-orange-600 to-yellow-600 border-amber-400/30 shadow-amber-500/25">
                Launch BOQ Estimator
              </CyberButton>
            </div>
          </div>

          <div className="lg:col-span-5 w-full aspect-square relative flex items-center justify-center">
            <div className="absolute inset-0 bg-sky-500/15 blur-[100px] rounded-full pointer-events-none" />
            <ArchitecturalPavilion3D />
          </div>
        </div>

        {/* Interactive BOQ Takeoff Table with 21st.dev BorderBeam */}
        <div className="relative z-10 rounded-2xl overflow-hidden border border-sky-900/40 bg-slate-900/70 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <BorderBeam size={220} duration={10} colorFrom="#f59e0b" colorTo="#0ea5e9" borderWidth={1.5} />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-amber-400" />
                <span>CPWD DSR 2023 Bill of Quantities (Takeoff Analysis)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Includes labor, material, machinery, 15% contractor profit, and 18% statutory GST index.</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-3 py-1 rounded-lg bg-amber-950/80 border border-amber-700/60 text-amber-300">
                DSR Revision: 2023-Q4
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-sky-900/40 text-slate-400">
                  <th className="pb-3 px-2">DSR CODE</th>
                  <th className="pb-3 px-2">ITEM DESCRIPTION</th>
                  <th className="pb-3 px-2">UNIT</th>
                  <th className="pb-3 px-2">RATE (₹)</th>
                  <th className="pb-3 px-2">QUANTITY</th>
                  <th className="pb-3 px-2 text-right">TOTAL (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-950/40">
                {boq.map((item, idx) => (
                  <tr key={idx} className="hover:bg-sky-950/30 transition-colors">
                    <td className="py-3 px-2 text-amber-400 font-bold">{item.code}</td>
                    <td className="py-3 px-2 text-slate-300 max-w-xs truncate">{item.description}</td>
                    <td className="py-3 px-2 text-slate-400">{item.unit}</td>
                    <td className="py-3 px-2 text-slate-300">₹{item.rate.toLocaleString("en-IN")}</td>
                    <td className="py-3 px-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const val = Number(e.target.value) || 0;
                          setBoq((prev) =>
                            prev.map((it, i) => (i === idx ? { ...it, quantity: val } : it))
                          );
                        }}
                        className="w-20 px-2 py-1 rounded bg-[#070b14] border border-sky-900/60 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                      />
                    </td>
                    <td className="py-3 px-2 text-right font-bold text-white">
                      ₹{(item.rate * item.quantity).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Grand Total Summary */}
          <div className="pt-4 border-t border-sky-900/40 grid grid-cols-1 sm:grid-cols-4 gap-4 text-center sm:text-left">
            <div className="p-3.5 rounded-xl bg-[#070b14] border border-sky-950">
              <div className="text-[10px] font-mono text-slate-500 uppercase">Subtotal Basic Cost</div>
              <div className="text-lg font-bold text-slate-200 mt-0.5">₹{subtotal.toLocaleString("en-IN")}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#070b14] border border-sky-950">
              <div className="text-[10px] font-mono text-slate-500 uppercase">Contractor Profit (15%)</div>
              <div className="text-lg font-bold text-amber-400 mt-0.5">₹{contractorProfit.toLocaleString("en-IN")}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#070b14] border border-sky-950">
              <div className="text-[10px] font-mono text-slate-500 uppercase">Statutory GST (18%)</div>
              <div className="text-lg font-bold text-orange-400 mt-0.5">₹{gst.toLocaleString("en-IN")}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-500/40 shadow-lg shadow-amber-500/10">
              <div className="text-[10px] font-mono text-amber-400 uppercase font-bold">Grand Project Estimate</div>
              <div className="text-xl font-extrabold text-amber-300 mt-0.5">₹{grandTotal.toLocaleString("en-IN")}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 border-t border-sky-900/40 py-8 px-6 text-center text-xs font-mono text-slate-500">
          <p>© 2026 Breakdown Factor · A Sevenseed AI Venture</p>
        </footer>
      </main>
    </SmoothScrollProvider>
  );
}
