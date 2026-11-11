"use client";

import React from "react";
import Link from "next/link";
import { PriceHistoryGraph, Spotlight, SmoothScrollProvider } from "@main/ui-core";
import { ArrowLeft } from "lucide-react";

export default function PriceTrackerRoute() {
  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#030712] text-slate-100 px-4 py-8 md:p-10">
        <Spotlight className="-top-40 left-20" fill="rgba(16, 185, 129, 0.2)" />
        <div className="max-w-4xl mx-auto space-y-6">
          <Link href="/avp-emart" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-emerald-200">
            <ArrowLeft className="w-4 h-4" /> Back to AVP E-Mart
          </Link>
          <PriceHistoryGraph />
        </div>
      </main>
    </SmoothScrollProvider>
  );
}
