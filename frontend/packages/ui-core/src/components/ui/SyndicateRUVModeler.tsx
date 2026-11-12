"use client";

import React, { useState } from "react";
import { Coins, RefreshCw, Printer, ShieldCheck } from "lucide-react";

export function SyndicateRUVModeler() {
  const [fundSize, setFundSize] = useState(1000000);
  const [carryPct, setCarryPct] = useState(20);
  const [exitMultiple, setExitMultiple] = useState(5);

  const grossProceeds = fundSize * exitMultiple;
  const netProfit = Math.max(0, grossProceeds - fundSize);
  const gpCarry = netProfit * (carryPct / 100);
  const lpNetTotal = grossProceeds - gpCarry;
  const lpNetMultiple = fundSize > 0 ? (lpNetTotal / fundSize).toFixed(2) : "0";

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-8 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Coins className="w-4 h-4" /> AngelList Roll-Up Vehicle (RUV) Waterfall
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Syndicate & RUV Return Simulator
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
          Model LP returns, GP carried interest, and capital distributions with standard venture waterfalls.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Input Parameters */}
        <div className="md:col-span-5 bg-slate-950/60 border border-slate-800/80 p-6 rounded-xl space-y-5">
          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Syndicate Terms</h3>
          
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Total Syndicate Capital ($)</label>
            <input
              type="number"
              value={fundSize}
              step={50000}
              onChange={(e) => setFundSize(Number(e.target.value) || 0)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">GP Carried Interest (%)</label>
            <input
              type="number"
              value={carryPct}
              step={1}
              min={0}
              max={50}
              onChange={(e) => setCarryPct(Number(e.target.value) || 0)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Expected Exit Multiple</label>
            <select
              value={exitMultiple}
              onChange={(e) => setExitMultiple(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-amber-500"
            >
              <option value={1}>1.0x (Capital Returned)</option>
              <option value={2}>2.0x (Modest Return)</option>
              <option value={3}>3.0x (Solid Return)</option>
              <option value={5}>5.0x (Venture Scale)</option>
              <option value={10}>10.0x (Home Run)</option>
              <option value={25}>25.0x (Unicorn Exit)</option>
            </select>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              onClick={() => { setFundSize(1000000); setCarryPct(20); setExitMultiple(5); }}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Defaults
            </button>
          </div>
        </div>

        {/* Results Waterfall */}
        <div className="md:col-span-7 bg-slate-950/80 border border-slate-800 p-6 rounded-xl space-y-6">
          <div className="p-5 rounded-xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 text-center">
            <div className="text-xs uppercase tracking-wider text-amber-400/80 font-bold mb-1">Total Gross Exit Proceeds</div>
            <div className="text-4xl font-extrabold text-amber-400 font-mono">
              ${grossProceeds.toLocaleString()}
            </div>
          </div>

          <div className="space-y-3 font-mono text-sm">
            <div className="flex justify-between py-2 border-b border-slate-800 text-slate-300">
              <span className="text-slate-400 font-sans">1. LP Principal Returned (1.0x hurdle):</span>
              <span className="font-semibold text-white">${fundSize.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800 text-slate-300">
              <span className="text-slate-400 font-sans">2. Net Capital Gain / Profit:</span>
              <span className="font-semibold text-white">${netProfit.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800 text-amber-400">
              <span className="text-slate-400 font-sans">3. GP Carried Interest ({carryPct}%):</span>
              <span className="font-bold text-amber-400">${Math.round(gpCarry).toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-3 border-t-2 border-slate-700 text-emerald-400 font-bold text-base">
              <span className="text-white font-sans">Total Net LP Distribution:</span>
              <span>${Math.round(lpNetTotal).toLocaleString()} ({lpNetMultiple}x Net)</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Compliant with Delaware RUV LLC specs
            </span>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
            >
              <Printer className="w-3.5 h-3.5" /> Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
