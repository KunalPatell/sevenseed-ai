"use client";

import React from "react";
import Link from "next/link";
import { PriceHistoryGraph, Spotlight, SmoothScrollProvider } from "@main/ui-core";
import { ArrowLeft, TrendingDown, Bell, Sparkles } from "lucide-react";

export default function PriceTrackerRoute() {
  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#030712] text-slate-100 p-6 md:p-10 space-y-6">
        <Spotlight className="-top-40 left-20" fill="rgba(16, 185, 129, 0.2)" />

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
              <div className="text-[11px] font-mono uppercase text-emerald-400">AVP E-Mart Price Intelligence</div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-emerald-400" />
                <span>90-Day Price Drop Tracker & Alert Trigger (buyhatke.com)</span>
              </h1>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 font-mono text-xs text-slate-400">
            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
              Live Price Tracking Across Amazon, Flipkart & AVP E-Mart
            </span>
          </div>
        </div>

        {/* Price History Graph Component */}
        <div className="relative">
          <PriceHistoryGraph />
        </div>

        {/* Info Banner */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Automated web crawlers inspect prices hourly. Instant alert notifications dispatch via Email/SMS.</span>
          </div>
          <div>Never overpay during fake festival discounts</div>
        </div>
      </main>
    </SmoothScrollProvider>
  );
}
