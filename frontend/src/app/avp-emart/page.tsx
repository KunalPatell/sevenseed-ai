"use client";

import React from "react";
import Link from "next/link";
import { Spotlight, CommerceDiamondPrism3D, CyberGridBackground, CyberButton, SmoothScrollProvider } from "@main/ui-core";
import { ShoppingBag, SlidersHorizontal, TrendingDown, Percent, Radar, ShoppingCart, Heart, Scan, ArrowRight } from "lucide-react";

// AVP E-Mart home. The old page ran a ticker of invented "live" prices and delivery times,
// claimed a real-time multi-store scraper, and described each tool by other companies'
// products. Every tool below works on prices the shopper enters or looks up.

const TOOLS = [
  { href: "/avp-emart/spec-compare/", icon: SlidersHorizontal, title: "Spec comparison", desc: "Put up to four products side by side and see which wins on each spec you care about." },
  { href: "/avp-emart/deals-radar/", icon: Radar, title: "Deal checker", desc: "Enter the MRP and each store's price plus fees to find the real cheapest option." },
  { href: "/avp-emart/deal-scanner/", icon: Scan, title: "Fake discount detector", desc: "Check whether a big “% off” is real, by comparing the sale price with the usual price." },
  { href: "/avp-emart/price-tracker/", icon: TrendingDown, title: "Price log", desc: "Write down a product's price each time you check, and see the trend on a chart." },
  { href: "/avp-emart/wishlist/", icon: Heart, title: "Wishlist & target prices", desc: "Keep a list of things you want and the price you'd pay. See when it's time to buy." },
  { href: "/avp-emart/qcommerce/", icon: ShoppingCart, title: "Grocery basket comparer", desc: "Compare a whole basket across quick-delivery apps, including delivery and handling fees." },
  { href: "/avp-emart/coupon-tester/", icon: Percent, title: "Coupon & cashback calculator", desc: "Work out the final price after coupons, card offers and cashback." },
];

export default function AVPEmartHubPage() {
  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#022c22] text-slate-100 px-4 py-8 md:p-10 space-y-12 overflow-hidden font-sans">
        <CyberGridBackground color="rgba(16, 185, 129, 0.22)" />
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(16, 185, 129, 0.28)" />

        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300"><ShoppingBag className="w-4 h-4" /> AVP E-Mart</div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Pay less,{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">and spot fake deals</span>
            </h1>
            <p className="text-slate-300 text-base leading-relaxed max-w-xl">
              AVP E-Mart is Sevenseed's shopping company. Its free tools help you compare products and prices across stores, see through inflated discounts, and track prices until it's the right time to buy.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <CyberButton href="/avp-emart/deals-radar" icon={Radar} className="from-emerald-500 via-teal-600 to-cyan-600 border-emerald-400/30 shadow-emerald-500/25">Check a deal</CyberButton>
              <CyberButton href="/avp-emart/spec-compare" icon={SlidersHorizontal} className="from-blue-500 via-indigo-600 to-violet-600 border-blue-400/30 shadow-blue-500/25">Compare products</CyberButton>
            </div>
          </div>
          <div className="lg:col-span-5 w-full aspect-square relative flex items-center justify-center">
            <div className="absolute inset-0 bg-emerald-500/15 blur-[100px] rounded-full pointer-events-none" />
            <CommerceDiamondPrism3D />
          </div>
        </div>

        <section className="relative z-10 max-w-6xl mx-auto" aria-labelledby="emart-tools">
          <h2 id="emart-tools" className="text-2xl font-bold text-white mb-4">Shopping tools</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((t) => (
              <Link key={t.href} href={t.href} className="group p-5 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 hover:border-emerald-400/60 transition-colors">
                <t.icon className="w-6 h-6 text-emerald-300" />
                <h3 className="mt-3 font-bold text-white flex items-center gap-1.5">{t.title} <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" /></h3>
                <p className="mt-1 text-sm text-slate-300 leading-relaxed">{t.desc}</p>
              </Link>
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-400 max-w-3xl">Sevenseed can't read prices from shopping apps, so these tools work on the prices you see and type in. Your entries are saved only in this browser.</p>
        </section>
      </main>
    </SmoothScrollProvider>
  );
}
