"use client";

import React from "react";
import Link from "next/link";
import {
  Spotlight,
  CardSpotlight,
  QuantumCore3DWebGL,
  CyberButton,
  SmoothScrollProvider,
} from "@main/ui-core";
import {
  ShoppingBag,
  SlidersHorizontal,
  TrendingDown,
  Percent,
  Radar,
  Clock,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

const emartEngines = [
  {
    id: "spec-compare",
    name: "Hardware Spec Comparison & Spec Score",
    reference: "smartprix.com",
    desc: "Side-by-side technical matrix comparing 2–4 gadgets with proprietary hardware capability scoring (0–100).",
    icon: SlidersHorizontal,
    badge: "Spec Matrix",
    color: "#38bdf8",
    href: "/avp-emart/spec-compare",
  },
  {
    id: "price-tracker",
    name: "90-Day Price Drop Tracker",
    reference: "buyhatke.com",
    desc: "Visual 90-day price trend history, all-time low indicators, and threshold alert sliders for instant price drops.",
    icon: TrendingDown,
    badge: "Price Intelligence",
    color: "#10b981",
    href: "/avp-emart/price-tracker",
  },
  {
    id: "coupon-tester",
    name: "Automated Coupon Tester & Cashback",
    reference: "xerve.in (SuperDost AI)",
    desc: "Instant single-click promo code testing and direct bank cashback withdrawal tracking.",
    icon: Percent,
    badge: "Auto Discount",
    color: "#f59e0b",
    href: "/avp-emart/coupon-tester",
  },
  {
    id: "deals-radar",
    name: "Live Deals Radar & Quick Commerce Rates",
    reference: "google.com/shopping & Blinkit/Zepto",
    desc: "Real-time deal radar monitoring price errors and comparing basket delivery totals across 10-minute dark stores.",
    icon: Radar,
    badge: "Q-Commerce",
    color: "#ec4899",
    href: "/avp-emart/deals-radar",
  },
];

export default function AVPEmartHubPage() {
  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#030712] text-slate-100 overflow-hidden">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(16, 185, 129, 0.25)" />

        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/80 bg-[#030712]/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-black shadow-lg shadow-emerald-500/30">
                  7S
                </div>
                <span className="font-bold tracking-wider text-sm bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-emerald-300">
                  SEVENSEED
                </span>
              </Link>
              <span className="text-slate-600">/</span>
              <span className="font-mono text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4" />
                <span>AVP E-MART</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/avp-emart/spec-compare"
                className="text-xs font-mono text-slate-300 hover:text-white px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Compare Specs</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative pt-36 pb-16 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-6 z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Intelligent Commerce & Spec Telemetry</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
              Predictive Shopping & <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">
                Hardware Benchmark Hub
              </span>
            </h1>

            <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Synthesizing side-by-side spec scoring from <em>Smartprix</em>, 90-day price trend history from <em>BuyHatke</em>, and automatic cashback testing from <em>Xerve</em>.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="/avp-emart/spec-compare">
                <CyberButton>
                  Compare Hardware Specs
                </CyberButton>
              </Link>
              <Link href="/avp-emart/price-tracker">
                <CyberButton>
                  Track Price Drops
                </CyberButton>
              </Link>
            </div>
          </div>

          {/* 3D Visualizer */}
          <div className="flex-1 w-full max-w-md aspect-square relative flex items-center justify-center">
            <div className="absolute inset-0 bg-emerald-500/15 blur-[90px] rounded-full" />
            <div className="relative w-full h-full border border-slate-800/80 rounded-3xl overflow-hidden bg-slate-950/60 backdrop-blur-md shadow-2xl">
              <QuantumCore3DWebGL />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl backdrop-blur-md">
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  Hyper-Prism Diamond WebGL
                </span>
                <span className="text-emerald-400">10-Min Dispatch</span>
              </div>
            </div>
          </div>
        </section>

        {/* Modules Grid */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="mb-10">
            <div className="text-xs font-mono uppercase text-emerald-400 tracking-wider mb-1">
              Commerce Engines
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">Shopping Intelligence Engines</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emartEngines.map((m) => {
              const IconComp = m.icon;
              return (
                <Link key={m.id} href={m.href}>
                  <CardSpotlight className="h-full p-6 rounded-2xl border border-slate-800/80 bg-slate-950/70 hover:border-slate-700 transition-all flex flex-col justify-between group">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${m.color}15`, color: m.color }}
                        >
                          <IconComp className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full">
                          Ref: {m.reference}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                        {m.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{m.desc}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between">
                      <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {m.badge}
                      </span>
                      <span className="text-xs font-mono text-emerald-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Open Engine <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </CardSpotlight>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </SmoothScrollProvider>
  );
}
