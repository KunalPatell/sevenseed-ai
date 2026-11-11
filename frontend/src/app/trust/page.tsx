"use client";

import React from "react";
import Link from "next/link";
import { Spotlight, GoldenImpactSphere3D, GoldenAuraBackground, CyberButton, SmoothScrollProvider } from "@main/ui-core";
import { HeartHandshake, Calculator, HandCoins, HandHeart, FileSearch, Fingerprint, Stethoscope, ArrowRight } from "lucide-react";

// AVP Charitable Trust home. The old page showed a "Charity Navigator 4-star" rating, an
// invented registration number, made-up donations with fake transaction hashes and a
// generator that printed Form 10BE certificates for anyone. None of that was real.

const TOOLS = [
  { href: "/trust/campaigns/", icon: HandCoins, title: "Pledge a donation", desc: "Tell the Trust what you'd like to give and to which cause. They reply with payment details." },
  { href: "/trust/tax-exemption/", icon: Calculator, title: "80G tax calculator", desc: "Estimate the tax you'd save, and learn how the real Form 10BE certificate reaches you." },
  { href: "/trust/volunteer/", icon: HandHeart, title: "Volunteer", desc: "Offer your time or skills for health camps, teaching and outreach." },
  { href: "/trust/ledger/", icon: FileSearch, title: "Donation records", desc: "Where the Trust will publish what it receives and spends, month by month." },
  { href: "/avp-charitable-trust/health-camps.html", icon: Stethoscope, title: "Health camps", desc: "Find out about free health camps the Trust runs or supports." },
  { href: "/web3-studio/", icon: Fingerprint, title: "Check a report", desc: "Confirm a published report file hasn't been changed, using its fingerprint." },
];

export default function TrustPage() {
  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#021f15] text-slate-100 px-4 py-8 md:p-10 space-y-12 overflow-hidden font-sans">
        <GoldenAuraBackground />
        <Spotlight className="-top-40 left-20" fill="rgba(234, 179, 8, 0.28)" />

        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-amber-300">
              <HeartHandshake className="w-4 h-4" /> AVP Charitable Trust
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Rural healthcare and education,{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-200 to-emerald-300">with open books</span>
            </h1>
            <p className="text-slate-300 text-base leading-relaxed max-w-xl">
              AVP Charitable Trust is the non-profit arm of Sevenseed, based in Ahmedabad. It runs health camps and supports education in rural Gujarat. Each month it will publish what it received and spent, so you can see where your money goes.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <CyberButton href="/trust/campaigns" icon={HandCoins} className="from-amber-500 via-yellow-600 to-emerald-600 border-amber-400/30 shadow-amber-500/25">
                Pledge a donation
              </CyberButton>
              <CyberButton href="/trust/volunteer" icon={HandHeart} className="from-emerald-500 via-teal-600 to-amber-500 border-emerald-400/30 shadow-emerald-500/25">
                Volunteer
              </CyberButton>
            </div>
          </div>
          <div className="lg:col-span-5 w-full aspect-square relative flex items-center justify-center">
            <div className="absolute inset-0 bg-amber-500/15 blur-[100px] rounded-full pointer-events-none" />
            <GoldenImpactSphere3D />
          </div>
        </div>

        <section className="relative z-10 max-w-6xl mx-auto" aria-labelledby="trust-tools">
          <h2 id="trust-tools" className="text-2xl font-bold text-white mb-4">What you can do here</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((t) => (
              <Link key={t.href} href={t.href} className="group p-5 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 hover:border-amber-400/60 transition-colors">
                <t.icon className="w-6 h-6 text-amber-400" />
                <h3 className="mt-3 font-bold text-white flex items-center gap-1.5">{t.title} <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" /></h3>
                <p className="mt-1 text-sm text-slate-300 leading-relaxed">{t.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="relative z-10 max-w-6xl mx-auto p-6 rounded-2xl bg-emerald-950/30 border border-emerald-900/50" aria-labelledby="trust-80g">
          <h2 id="trust-80g" className="text-lg font-bold text-white">About tax receipts</h2>
          <p className="mt-2 text-sm text-slate-300 max-w-3xl leading-relaxed">
            Your 80G deduction is based on Form 10BE, which the Trust issues after it has received your donation and filed its Form 10BD with the Income Tax Department. Ask the Trust for its 80G registration number before you donate. Nothing on this website issues a tax certificate.
          </p>
        </section>
      </main>
    </SmoothScrollProvider>
  );
}
