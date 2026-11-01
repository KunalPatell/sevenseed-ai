"use client";

import React from "react";
import Link from "next/link";
import {
  Spotlight,
  CardSpotlight,
  CommerceDiamondPrism3D,
  CyberGridBackground,
  BorderBeam,
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
  CheckCircle2,
  Tag,
  Heart,
  Scan,
} from "lucide-react";

const emartEngines = [
  {
    id: "spec-compare",
    name: "Hardware Spec Comparison & Spec Score",
    reference: "smartprix.com",
    desc: "Side-by-side technical matrix comparing 2–4 gadgets with proprietary hardware capability scoring (0–100).",
    icon: SlidersHorizontal,
    badge: "Spec Score Engine",
    color: "#10b981",
    href: "/avp-emart/spec-compare",
  },
  {
    id: "price-tracker",
    name: "90-Day Price Drop Tracker",
    reference: "buyhatke.com",
    desc: "Visual 90-day price trend history, all-time low indicators, and threshold alert sliders for instant price drops.",
    icon: TrendingDown,
    badge: "Price Telemetry",
    color: "#06b6d4",
    href: "/avp-emart/price-tracker",
  },
  {
    id: "coupon-tester",
    name: "Automated Coupon Tester",
    reference: "xerve.in/prices",
    desc: "Simulated coupon auto-injector calculating maximum cashback yields across Amazon, Flipkart, and brand stores.",
    icon: Percent,
    badge: "Cashback Yield",
    color: "#f59e0b",
    href: "/avp-emart/coupon-tester",
  },
  {
    id: "deals-radar",
    name: "Universal Multi-Store Price Grid",
    reference: "google.com/shopping?udm=28",
    desc: "Real-time cross-store scraper indexing Amazon, Flipkart, Croma, and Reliance Digital for lowest pricing.",
    icon: Radar,
    badge: "Omnichannel Radar",
    color: "#8b5cf6",
    href: "/avp-emart/deals-radar",
  },
  {
    id: "qcommerce",
    name: "10-Minute Q-Commerce Optimizer",
    reference: "Blinkit / Zepto / Instamart",
    desc: "Dark store proximity routing, real-time inventory checks, and surge fee elimination algorithms.",
    icon: Clock,
    badge: "Hyperlocal Dispatch",
    color: "#ec4899",
    href: "/avp-emart/qcommerce",
  },
  {
    id: "wishlist",
    name: "Price Drop Wishlist & Alerts",
    reference: "smartprix.com / buyhatke.com",
    desc: "Save products with a target price, and get flagged the moment any tracked store hits it.",
    icon: Heart,
    badge: "Alert Engine",
    color: "#f43f5e",
    href: "/avp-emart/wishlist",
  },
  {
    id: "deal-scanner",
    name: "Smart Deal Scanner",
    reference: "buyhatke.com",
    desc: "Filter live deals by budget, minimum discount, and category — flags inflated MRPs by comparing against pre-sale typical price.",
    icon: Scan,
    badge: "Fake-Discount Detector",
    color: "#22c55e",
    href: "/avp-emart/deal-scanner",
  },
];

export default function AVPEmartHubPage() {
  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#022c22] text-slate-100 overflow-hidden font-sans">
        {/* 21st.dev Style Cyber Grid Perspective Background */}
        <CyberGridBackground color="rgba(16, 185, 129, 0.22)" />
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(16, 185, 129, 0.28)" />

        {/* Top Nav */}
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-emerald-800/40 bg-[#022c22]/85 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-black shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform">
                  7S
                </div>
                <span className="font-bold tracking-wider text-sm bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-emerald-300">
                  SEVENSEED
                </span>
              </Link>
              <span className="text-slate-600">/</span>
              <span className="font-mono text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                <span>AVP E-MART</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/avp-emart/spec-compare"
                className="text-xs font-mono text-slate-300 hover:text-white px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/50 flex items-center gap-1.5 hover:border-emerald-500/50 transition-all"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Compare Specs</span>
              </Link>
              <Link
                href="/avp-emart/price-tracker"
                className="text-xs font-mono text-cyan-300 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/40 flex items-center gap-1.5"
              >
                <TrendingDown className="w-3.5 h-3.5 text-cyan-400" />
                <span>Price Drops Active</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Live Deal Marquee Ticker */}
        <div className="fixed top-16 left-0 right-0 z-40 bg-emerald-950/90 border-b border-emerald-800/30 py-1.5 px-6 overflow-hidden text-[11px] font-mono text-emerald-300/80 flex items-center gap-6 select-none">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            LIVE TELEMETRY:
          </span>
          <div className="flex gap-8 animate-marquee whitespace-nowrap">
            <span>⚡ iPhone 16 Pro (256GB): ₹1,19,900 (-₹15,000 All-Time Low)</span>
            <span>⚡ MacBook Air M3: ₹1,04,990 (Flipkart Card Instant -₹10,000)</span>
            <span>⚡ Sony WH-1000XM5: ₹24,990 (Price Drop Alert Triggered)</span>
            <span>⚡ Samsung S24 Ultra: ₹1,09,999 (BuyHatke Verified Low)</span>
            <span>⚡ Zepto Delivery Dispatch: 8.4 mins average in Sector 21</span>
          </div>
        </div>

        {/* Hero Section with Dedicated 3D Diamond Prism */}
        <section className="relative pt-40 pb-16 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 z-10">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Intelligent Commerce & Spec Telemetry · Smartprix & BuyHatke Parity</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
              Predictive Shopping & <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Hardware Benchmark Hub
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Synthesizing side-by-side spec scoring from <em className="text-emerald-300 not-italic font-medium">Smartprix</em>, 90-day price trend telemetry from <em className="text-cyan-300 not-italic font-medium">BuyHatke</em>, automatic coupon cracking from <em className="text-amber-300 not-italic font-medium">Xerve</em>, and 10-minute dispatch routing.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <CyberButton href="/avp-emart/spec-compare" icon={SlidersHorizontal} className="from-emerald-500 via-teal-600 to-cyan-600 border-emerald-400/30 shadow-emerald-500/25">
                Compare Hardware Specs
              </CyberButton>
              <CyberButton href="/avp-emart/price-tracker" icon={TrendingDown} className="from-blue-500 via-indigo-600 to-violet-600 border-blue-400/30 shadow-blue-500/25">
                Track Price Drops
              </CyberButton>
            </div>
          </div>

          {/* Dedicated 3D Diamond Prism */}
          <div className="flex-1 w-full max-w-lg aspect-square relative flex items-center justify-center">
            <div className="absolute inset-0 bg-emerald-500/15 blur-[100px] rounded-full pointer-events-none" />
            <CommerceDiamondPrism3D />
          </div>
        </section>

        {/* 5 Engine Modules Grid with 21st.dev BorderBeam */}
        <section className="relative py-16 px-6 max-w-7xl mx-auto z-10">
          <div className="mb-10 text-center lg:text-left">
            <p className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 justify-center lg:justify-start">
              <Tag className="w-3.5 h-3.5" />
              <span>Reference Commerce Engines from Global Benchmark Platforms</span>
            </p>
            <h2 className="text-3xl font-bold text-slate-100">
              Shopping Intelligence Engines
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emartEngines.map((mod, idx) => {
              const Icon = mod.icon;
              const isHighlight = idx === 0 || idx === 1;
              return (
                <div key={mod.id} className="relative rounded-2xl">
                  <CardSpotlight
                    className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 hover:border-emerald-500/60 transition-all flex flex-col justify-between group backdrop-blur-md h-full relative overflow-hidden"
                  >
                    {isHighlight && (
                      <BorderBeam
                        size={180}
                        duration={9}
                        colorFrom={mod.color}
                        colorTo="#34d399"
                        borderWidth={1.5}
                      />
                    )}

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105"
                          style={{ backgroundColor: `${mod.color}18`, color: mod.color }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-900/80 text-emerald-300/80 border border-emerald-800/60">
                          Ref: {mod.reference}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                          {mod.name}
                        </h3>
                        <p className="text-slate-400 text-xs leading-relaxed mt-2">
                          {mod.desc}
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-emerald-900/50 flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{mod.badge}</span>
                      </span>

                      <Link
                        href={mod.href}
                        className="text-xs font-mono text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                      >
                        <span>Launch</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </CardSpotlight>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-emerald-900/30 py-8 px-6 text-center text-xs font-mono text-slate-500 relative z-10">
          <p>© 2026 AVP E-Mart · A Sevenseed AI Venture</p>
        </footer>
      </main>
    </SmoothScrollProvider>
  );
}
