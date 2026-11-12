"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Spotlight, CardSpotlight, SmoothScrollProvider } from "@main/ui-core";
import { ArrowLeft, Radar, Sparkles, Zap, ShoppingBag, Clock, Percent, ArrowUpRight } from "lucide-react";

interface DealItem {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  discountPct: number;
  dealType: "Lightning 10-Min" | "Price Glitch" | "Clearance";
  vendorComparison: {
    blinkit: number;
    zepto: number;
    instamart: number;
    avpEmart: number;
  };
}

const liveDeals: DealItem[] = [
  {
    id: "deal-1",
    title: "SanDisk Extreme 1TB Portable NVMe SSD (1050MB/s)",
    category: "Storage",
    price: 7499,
    originalPrice: 14500,
    discountPct: 48,
    dealType: "Lightning 10-Min",
    vendorComparison: {
      blinkit: 8299,
      zepto: 8499,
      instamart: 8199,
      avpEmart: 7499
    }
  },
  {
    id: "deal-2",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    category: "Audio",
    price: 24990,
    originalPrice: 34990,
    discountPct: 29,
    dealType: "Price Glitch",
    vendorComparison: {
      blinkit: 26990,
      zepto: 27500,
      instamart: 26490,
      avpEmart: 24990
    }
  },
  {
    id: "deal-3",
    title: "Keychron K2 Pro Wireless Custom Mechanical Keyboard",
    category: "Peripherals",
    price: 7999,
    originalPrice: 11999,
    discountPct: 33,
    dealType: "Clearance",
    vendorComparison: {
      blinkit: 8999,
      zepto: 9200,
      instamart: 8750,
      avpEmart: 7999
    }
  }
];

export default function DealsRadarRoute() {
  const [filter, setFilter] = useState<string>("All");

  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#030712] text-slate-100 p-6 md:p-10 space-y-8">
        <Spotlight className="-top-40 left-20" fill="rgba(236, 72, 153, 0.2)" />

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
              <div className="text-[11px] font-mono uppercase text-pink-400">AVP E-Mart Real-Time Scanner</div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
                <Radar className="w-5 h-5 text-pink-400 animate-spin" />
                <span>Live Deals Radar & Quick Commerce Rates (Google Shopping & Smartprix)</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Dark Store Radar Active
            </span>
          </div>
        </div>

        {/* Deals Cards */}
        <div className="space-y-6">
          {liveDeals.map((deal) => (
            <div
              key={deal.id}
              className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 font-bold">
                    {deal.discountPct}% OFF
                  </span>
                  <span className="text-xs font-mono text-slate-400">{deal.category}</span>
                </div>
                <span className="text-xs font-mono text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2.5 py-1 rounded-full font-bold">
                  {deal.dealType}
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-100">{deal.title}</h3>
                  <div className="mt-1 flex items-baseline gap-2 font-mono">
                    <span className="text-xl font-bold text-emerald-400">₹{deal.price.toLocaleString()}</span>
                    <span className="text-xs text-slate-500 line-through">₹{deal.originalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <button className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-400 text-black text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-pink-500/20 self-start md:self-auto">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>10-Min Lightning Dispatch</span>
                </button>
              </div>

              {/* Quick Commerce Basket Price Comparison Table */}
              <div className="pt-3 border-t border-slate-900">
                <div className="text-[11px] font-mono uppercase text-slate-500 mb-2">
                  Real-time Basket Price Comparison across Quick Commerce Apps:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-400">
                    <span className="block text-[10px] uppercase text-slate-500">Blinkit Total</span>
                    <span>₹{deal.vendorComparison.blinkit.toLocaleString()}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-400">
                    <span className="block text-[10px] uppercase text-slate-500">Zepto Total</span>
                    <span>₹{deal.vendorComparison.zepto.toLocaleString()}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-400">
                    <span className="block text-[10px] uppercase text-slate-500">Instamart Total</span>
                    <span>₹{deal.vendorComparison.instamart.toLocaleString()}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-bold">
                    <span className="block text-[10px] uppercase text-emerald-400">AVP E-Mart (Lowest)</span>
                    <span>₹{deal.vendorComparison.avpEmart.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </SmoothScrollProvider>
  );
}
