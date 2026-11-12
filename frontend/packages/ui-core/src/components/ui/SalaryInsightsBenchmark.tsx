"use client";

import React, { useState } from "react";
import { DollarSign, BarChart3, TrendingUp, Building2, MapPin } from "lucide-react";

export function SalaryInsightsBenchmark() {
  const [level, setLevel] = useState<"sde1" | "sde2" | "senior" | "staff">("sde2");
  const [region, setRegion] = useState<"india" | "us">("india");

  const SALARY_DATA = {
    india: {
      sde1: { base: "₹18-24 LPA", stock: "₹6 LPA", bonus: "₹2 LPA", total: "₹28 LPA" },
      sde2: { base: "₹34-45 LPA", stock: "₹15 LPA", bonus: "₹5 LPA", total: "₹58 LPA" },
      senior: { base: "₹55-75 LPA", stock: "₹30 LPA", bonus: "₹8 LPA", total: "₹1.05 Cr" },
      staff: { base: "₹90-1.2 Cr", stock: "₹65 LPA", bonus: "₹15 LPA", total: "₹1.85 Cr" }
    },
    us: {
      sde1: { base: "$140,000", stock: "$45,000", bonus: "$15,000", total: "$200,000" },
      sde2: { base: "$185,000", stock: "$90,000", bonus: "$25,000", total: "$300,000" },
      senior: { base: "$230,000", stock: "$160,000", bonus: "$35,000", total: "$425,000" },
      staff: { base: "$290,000", stock: "$280,000", bonus: "$50,000", total: "$620,000" }
    }
  };

  const current = SALARY_DATA[region][level];

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-8 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <BarChart3 className="w-4 h-4" /> Levels.fyi Verified Compensation Benchmarks
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Tech Compensation & Salary Intelligence
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
          Explore total compensation percentiles split by Base, Annual Equity (RSUs), and Performance Bonus across Tier 1 GCCs and Startups.
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <div className="inline-flex p-1 bg-slate-950 border border-slate-800 rounded-xl">
          <button
            onClick={() => setRegion("india")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${region === "india" ? "bg-emerald-600 text-white" : "text-slate-400"}`}
          >
            <MapPin className="w-3.5 h-3.5" /> India (BLR / HYD / GGN)
          </button>
          <button
            onClick={() => setRegion("us")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${region === "us" ? "bg-emerald-600 text-white" : "text-slate-400"}`}
          >
            <Building2 className="w-3.5 h-3.5" /> US Remote / SF Bay Area
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {(["sde1", "sde2", "senior", "staff"] as const).map((lvl) => (
          <button
            key={lvl}
            onClick={() => setLevel(lvl)}
            className={`p-4 rounded-xl border text-center transition ${
              level === lvl
                ? "bg-slate-950 border-emerald-500 text-white shadow-lg shadow-emerald-500/10"
                : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            <div className="text-xs uppercase font-bold text-slate-400">{lvl.toUpperCase()}</div>
            <div className="text-lg font-black font-mono text-emerald-400 mt-1">{SALARY_DATA[region][lvl].total}</div>
          </button>
        ))}
      </div>

      <div className="p-6 rounded-xl bg-slate-950/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center font-mono">
        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-sans">Base Salary</span>
          <div className="text-2xl font-bold text-white mt-1">{current.base}</div>
        </div>
        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-sans">Annual Stock / RSUs</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">{current.stock}</div>
        </div>
        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-sans">Target Annual Bonus</span>
          <div className="text-2xl font-bold text-sky-400 mt-1">{current.bonus}</div>
        </div>
      </div>
    </div>
  );
}
