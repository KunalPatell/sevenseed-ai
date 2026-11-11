"use client";

import React from "react";
import Link from "next/link";
import { Spotlight, AutonomousDevinOrb3D, TerminalScanlineBackground, CyberButton, SmoothScrollProvider } from "@main/ui-core";
import { Bot, Terminal, Store, Calculator, GitBranch, ArrowRight } from "lucide-react";

// Sevenforce home. The old page claimed "450k tasks/day", ran a scripted terminal that
// pretended to deploy code, and described itself through another company's product.

const TOOLS = [
  { href: "/sevenforce/devin-terminal/", icon: Terminal, title: "AI coding assistant", desc: "Describe a coding task or paste an error and get a plan, the code and how to test it." },
  { href: "/sevenforce/marketplace/", icon: Store, title: "AI employees", desc: "Agents we can set up for your business: content, lead follow-up, support, screening and more." },
  { href: "/sevenforce/roi-calculator/", icon: Calculator, title: "Automation savings calculator", desc: "Estimate the hours and money an AI agent could save on a repetitive task." },
  { href: "/sevenforce/workflows/", icon: GitBranch, title: "How agents work together", desc: "A step-by-step illustration of a team of AI agents splitting up one job." },
];

export default function SevenforcePage() {
  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#0c0a09] text-slate-100 px-4 py-8 md:p-10 space-y-12 overflow-hidden font-sans">
        <TerminalScanlineBackground />
        <Spotlight className="-top-40 left-20" fill="rgba(245, 158, 11, 0.28)" />

        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-amber-300"><Bot className="w-4 h-4" /> Sevenforce</div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              AI employees{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-200">for repetitive work</span>
            </h1>
            <p className="text-slate-300 text-base leading-relaxed max-w-xl">
              Sevenforce is Sevenseed's automation company. We set up AI agents that take over repetitive tasks, such as writing first drafts, following up leads or sorting support emails, and connect them to the tools your team already uses.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <CyberButton href="/sevenforce/marketplace" icon={Store} className="from-amber-500 via-orange-500 to-yellow-500 border-amber-400/30 shadow-amber-500/25">See AI employees</CyberButton>
              <CyberButton href="/sevenforce/roi-calculator" icon={Calculator} className="from-orange-600 via-amber-600 to-yellow-600 border-orange-400/30 shadow-orange-500/25">Estimate savings</CyberButton>
            </div>
          </div>
          <div className="lg:col-span-5 w-full aspect-square relative flex items-center justify-center">
            <div className="absolute inset-0 bg-amber-500/15 blur-[100px] rounded-full pointer-events-none" />
            <AutonomousDevinOrb3D />
          </div>
        </div>

        <section className="relative z-10 max-w-6xl mx-auto" aria-labelledby="sf-tools">
          <h2 id="sf-tools" className="text-2xl font-bold text-white mb-4">Try Sevenforce</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {TOOLS.map((t) => (
              <Link key={t.href} href={t.href} className="group p-5 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-400/60 transition-colors">
                <t.icon className="w-6 h-6 text-amber-300" />
                <h3 className="mt-3 font-bold text-white flex items-center gap-1.5">{t.title} <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" /></h3>
                <p className="mt-1 text-sm text-slate-300 leading-relaxed">{t.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </SmoothScrollProvider>
  );
}
