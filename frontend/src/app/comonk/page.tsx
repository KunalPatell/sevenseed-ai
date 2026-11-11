"use client";

import React from "react";
import Link from "next/link";
import { Spotlight, NeuralSynapseNetwork3D, AuroraBackground, CyberButton, SmoothScrollProvider } from "@main/ui-core";
import { Brain, FileText, Mic, Wallet, Building2, NotebookPen, ArrowRight } from "lucide-react";

// Comonk home. The old page showed invented "verified" salary percentiles, a "98.4% ATS
// accuracy" badge, a fixed "94/100" score and quotes from interviews that never happened,
// and described itself through other companies' products.

const TOOLS = [
  { href: "/comonk/resume-analyzer/", icon: FileText, title: "Resume analyzer", desc: "Paste a job description and your resume to see which keywords you're missing." },
  { href: "/comonk/interview-arena/", icon: Mic, title: "Mock interview", desc: "Practise answering interview questions with an AI interviewer and get feedback." },
  { href: "/comonk/salary-insights/", icon: Wallet, title: "Take-home calculator", desc: "Turn an offer's CTC into monthly in-hand pay under the new tax regime." },
  { href: "/comonk/company-reviews/", icon: Building2, title: "Offer scorecard", desc: "Score two or more offers on what matters to you and see which comes out ahead." },
  { href: "/comonk/interview-experiences/", icon: NotebookPen, title: "Interview journal", desc: "Note down each round's questions and lessons, then search them before the next one." },
];

export default function ComonkAIPage() {
  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#090314] text-slate-100 px-4 py-8 md:p-10 space-y-12 overflow-hidden font-sans">
        <AuroraBackground className="!bg-transparent absolute inset-0 -z-0 opacity-35 pointer-events-none" />
        <Spotlight className="-top-40 left-20" fill="rgba(168, 85, 247, 0.35)" />

        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-purple-300"><Brain className="w-4 h-4" /> Comonk Technology</div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Get the job,{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-300 to-pink-400">and the right offer</span>
            </h1>
            <p className="text-slate-300 text-base leading-relaxed max-w-xl">
              Comonk is Sevenseed's career company. Its free tools help you tailor your resume to a job, practise interviews, and compare offers on what you'll actually take home.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <CyberButton href="/comonk/resume-analyzer" icon={FileText} className="from-purple-600 via-fuchsia-600 to-pink-600 border-purple-400/30 shadow-purple-500/25">Check my resume</CyberButton>
              <CyberButton href="/comonk/interview-arena" icon={Mic} className="from-indigo-600 via-purple-600 to-fuchsia-600 border-indigo-400/30 shadow-indigo-500/25">Practise an interview</CyberButton>
            </div>
          </div>
          <div className="lg:col-span-5 w-full aspect-square relative flex items-center justify-center">
            <div className="absolute inset-0 bg-purple-500/15 blur-[100px] rounded-full pointer-events-none" />
            <NeuralSynapseNetwork3D />
          </div>
        </div>

        <section className="relative z-10 max-w-6xl mx-auto" aria-labelledby="comonk-tools">
          <h2 id="comonk-tools" className="text-2xl font-bold text-white mb-4">Comonk tools</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((t) => (
              <Link key={t.href} href={t.href} className="group p-5 rounded-2xl bg-purple-950/40 border border-purple-900/50 hover:border-fuchsia-400/60 transition-colors">
                <t.icon className="w-6 h-6 text-fuchsia-300" />
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
