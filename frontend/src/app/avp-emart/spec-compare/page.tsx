"use client";

import React from "react";
import Link from "next/link";
import { SpecComparisonTable, Spotlight, SmoothScrollProvider } from "@main/ui-core";
import { ArrowLeft, SlidersHorizontal, Sparkles, Trophy } from "lucide-react";

export default function SpecCompareRoute() {
  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#030712] text-slate-100 p-6 md:p-10 space-y-6">
        <Spotlight className="-top-40 left-20" fill="rgba(56, 189, 248, 0.2)" />

        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/avp-emart"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="text-[11px] font-mono uppercase text-sky-400">AVP E-Mart Hardware Diagnostics</div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-sky-400" />
                <span>Side-by-Side Spec Compare & Spec Score (smartprix.com)</span>
              </h1>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 font-mono text-xs text-slate-400">
            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
              Proprietary Hardware Benchmark Algorithm (0–100)
            </span>
          </div>
        </div>

        {/* Spec Compare Table Component */}
        <div className="relative">
          <SpecComparisonTable />
        </div>

        {/* Info Banner */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Winner highlighting automatically isolates higher memory bandwidth, core counts, and thermal envelopes.</span>
          </div>
          <div>Integrated with AVP E-Mart 10-Minute Lightning Dispatch</div>
        </div>
      </main>
    </SmoothScrollProvider>
  );
}
