"use client";

import React, { useState } from "react";
import { Target, FileText, Sparkles, TrendingUp } from "lucide-react";

export function MarketSizingCalculator() {
  const [unitsTotal, setUnitsTotal] = useState(500000);
  const [acv, setAcv] = useState(24000);
  const [samPct, setSamPct] = useState(25);
  const [somPct, setSomPct] = useState(4);

  const tam = unitsTotal * acv;
  const sam = tam * (samPct / 100);
  const som = sam * (somPct / 100);

  const formatCurrency = (val: number) => {
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(1)}M`;
    return `$${val.toLocaleString()}`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-8 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Target className="w-4 h-4" /> Y Combinator Bottom-Up Market Sizing
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          TAM / SAM / SOM Market Sizer
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
          Calculate defensible Total Addressable, Serviceable Addressable, and Serviceable Obtainable markets for pitch decks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Inputs */}
        <div className="md:col-span-5 bg-slate-950/60 border border-slate-800/80 p-6 rounded-xl space-y-5">
          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Unit Economics & Assumptions</h3>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Total Potential Accounts Worldwide</label>
            <input
              type="number"
              value={unitsTotal}
              step={50000}
              onChange={(e) => setUnitsTotal(Number(e.target.value) || 0)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Annual Contract Value / ACV ($ / year)</label>
            <input
              type="number"
              value={acv}
              step={1000}
              onChange={(e) => setAcv(Number(e.target.value) || 0)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Serviceable Target Segment Share (SAM %)</label>
            <input
              type="number"
              value={samPct}
              min={1}
              max={100}
              onChange={(e) => setSamPct(Number(e.target.value) || 0)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Realistic 5-Year Obtainable Share (SOM %)</label>
            <input
              type="number"
              value={somPct}
              min={0.1}
              max={50}
              step={0.5}
              onChange={(e) => setSomPct(Number(e.target.value) || 0)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Results */}
        <div className="md:col-span-7 space-y-4">
          <div className="p-6 rounded-xl bg-slate-950/80 border border-emerald-500/30 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">1. Total Addressable Market (TAM)</span>
                <h4 className="text-3xl font-extrabold text-white font-mono mt-1">{formatCurrency(tam)}</h4>
                <p className="text-xs text-slate-400 mt-1">100% of target accounts ({unitsTotal.toLocaleString()}) × ${acv.toLocaleString()} ACV</p>
              </div>
              <Sparkles className="w-7 h-7 text-emerald-400/50" />
            </div>
          </div>

          <div className="p-6 rounded-xl bg-slate-950/80 border border-amber-500/30 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">2. Serviceable Addressable Market (SAM)</span>
                <h4 className="text-3xl font-extrabold text-white font-mono mt-1">{formatCurrency(sam)}</h4>
                <p className="text-xs text-slate-400 mt-1">{samPct}% addressable by core ICP and regulatory geography</p>
              </div>
              <TrendingUp className="w-7 h-7 text-amber-400/50" />
            </div>
          </div>

          <div className="p-6 rounded-xl bg-slate-950/80 border border-blue-500/30 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">3. Serviceable Obtainable Market (SOM)</span>
                <h4 className="text-3xl font-extrabold text-white font-mono mt-1">{formatCurrency(som)} ARR</h4>
                <p className="text-xs text-slate-400 mt-1">Defensible 5-year venture trajectory ({somPct}% of SAM)</p>
              </div>
              <Target className="w-7 h-7 text-blue-400/50" />
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition"
          >
            <FileText className="w-4 h-4" /> Export YC Pitch Deck Market Slide
          </button>
        </div>
      </div>
    </div>
  );
}
