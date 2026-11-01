"use client";

import React from "react";
import Link from "next/link";
import {
  Spotlight,
  CardSpotlight,
  KnowledgeOctahedron3D,
  ConstellationWaveBackground,
  BorderBeam,
  CyberButton,
  SmoothScrollProvider,
} from "@main/ui-core";
import {
  GraduationCap,
  Network,
  Code2,
  Flame,
  Scale,
  Brain,
  ArrowUpRight,
  Sparkles,
  BookOpen,
  CalendarCheck2,
  TrendingUp,
  Bot,
  CheckCircle2,
  Compass,
  Layers,
} from "lucide-react";

const avpuModules = [
  {
    id: "learn-dag",
    name: "Interactive Knowledge DAG",
    reference: "learn-anything.xyz",
    desc: "Graph-structured visual curriculum with prerequisite dependency links, topic mind-maps & curated resources.",
    icon: Network,
    badge: "Curriculum Graph",
    color: "#38bdf8",
    href: "/avpu/learn-dag",
  },
  {
    id: "code-lab",
    name: "In-Browser Code Lab",
    reference: "freecodecamp.org",
    desc: "Interactive sandboxed compiler with real-time test assertions, console logs, hints, and unit assertions.",
    icon: Code2,
    badge: "Live Runner",
    color: "#10b981",
    href: "/avpu/code-lab",
  },
  {
    id: "duo-league",
    name: "Gamified Streak & Leagues",
    reference: "duolingo.com",
    desc: "Daily streak flames, heart deduction mechanics, XP scoring, and Bronze-to-Diamond weekly leaderboards.",
    icon: Flame,
    badge: "Duolingo Mechanics",
    color: "#f59e0b",
    href: "/avpu/duo-league",
  },
  {
    id: "laws-of-ux",
    name: "Interactive Laws of UX",
    reference: "lawsofux.com",
    desc: "Cognitive psychology heuristics (Fitts's, Hick's, Miller's, Jakob's) with live physics & latency simulation cards.",
    icon: Scale,
    badge: "Cognitive Heuristics",
    color: "#a855f7",
    href: "/avpu/laws-of-ux",
  },
  {
    id: "challenge-100days",
    name: "100 Days of AI Habit Challenge",
    reference: "100daysofnocode.com / 100daysai.com",
    desc: "Day 1 to 100 roadmap with daily prompt check-ins, project submission cards, and completion certificates.",
    icon: CalendarCheck2,
    badge: "Habit Tracker",
    color: "#06b6d4",
    href: "/avpu/challenge-100days",
  },
  {
    id: "marketing-teardowns",
    name: "Marketing Examples & Growth Teardowns",
    reference: "marketingexamples.com / growthinreverse.com",
    desc: "Annotated visual before/after case studies, viral hook formulas, copywriting audits, and newsletter funnels.",
    icon: TrendingUp,
    badge: "Growth Teardowns",
    color: "#f43f5e",
    href: "/avpu/marketing-teardowns",
  },
  {
    id: "mental-models",
    name: "Latticework of Mental Models",
    reference: "fs.blog/mental-models",
    desc: "First-principles thinking, inversion, second-order effects & Pareto decision dilemma simulators.",
    icon: Brain,
    badge: "Decision Science",
    color: "#ec4899",
    href: "/avpu/mental-models",
  },
  {
    id: "ai-tutor",
    name: "Socratic AI Tutor Dialogue",
    reference: "learnanythingai.in",
    desc: "Conversational pedagogical agent that guides through inquiry rather than spoon-feeding solutions.",
    icon: Bot,
    badge: "Pedagogy AI",
    color: "#6366f1",
    href: "/avpu/ai-tutor",
  },
  {
    id: "flashcards",
    name: "Spaced Repetition Flashcards",
    reference: "Anki / learn-anything.xyz",
    desc: "Leitner-box style flashcard review — cards you know move up a box, cards you miss reset for extra practice.",
    icon: Layers,
    badge: "Memory Retention",
    color: "#22c55e",
    href: "/avpu/flashcards",
  },
];

export default function AVPUHubPage() {
  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#020617] text-slate-100 overflow-hidden font-sans">
        {/* Unicorn Studio Style Constellation Wave Interactive Background */}
        <ConstellationWaveBackground color="#38bdf8" maxNodes={65} />
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(56, 189, 248, 0.22)" />

        {/* Top Nav */}
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-sky-900/40 bg-[#020617]/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center font-bold text-black shadow-lg shadow-sky-500/30 group-hover:scale-105 transition-transform">
                  7S
                </div>
                <span className="font-bold tracking-wider text-sm bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-sky-300">
                  SEVENSEED
                </span>
              </Link>
              <span className="text-slate-600">/</span>
              <span className="font-mono text-xs text-sky-400 font-bold flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-sky-400" />
                <span>AVP UNIVERSITY</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/avpu/learn-dag"
                className="text-xs font-mono text-slate-300 hover:text-white px-3 py-1.5 rounded-full bg-sky-950/60 border border-sky-800/40 hover:border-sky-500/50 flex items-center gap-1.5 transition-all"
              >
                <Network className="w-3.5 h-3.5 text-sky-400" />
                <span>Knowledge Graph</span>
              </Link>
              <Link
                href="/avpu/duo-league"
                className="text-xs font-mono text-amber-300 px-3 py-1.5 rounded-full bg-amber-950/40 border border-amber-500/40 flex items-center gap-1.5"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
                <span>14 Day Streak</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section with Dedicated 3D Knowledge Octahedron */}
        <section className="relative pt-36 pb-16 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 z-10">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-xs font-mono text-sky-400 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen EdTech Hub · 8 Deep Reference Workstations</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
              Autonomous Intelligence <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400">
                Cognitive Learning Sanctum
              </span>
            </h1>

            <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Synthesizing graph learning paths from <em className="text-sky-300 not-italic font-medium">learn-anything</em>, in-browser compilation from <em className="text-emerald-300 not-italic font-medium">freeCodeCamp</em>, gamification from <em className="text-amber-300 not-italic font-medium">Duolingo</em>, and cognitive psychology from <em className="text-purple-300 not-italic font-medium">Laws of UX</em>.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <CyberButton href="/avpu/learn-dag" icon={Network}>
                Explore Knowledge DAG
              </CyberButton>
              <CyberButton href="/avpu/duo-league" icon={Flame} className="from-amber-500 via-orange-600 to-red-600 border-amber-400/30 shadow-amber-500/25">
                Daily Streak Arena
              </CyberButton>
            </div>
          </div>

          {/* Dedicated 3D Knowledge Octahedron Model */}
          <div className="flex-1 w-full max-w-lg aspect-square relative flex items-center justify-center">
            <div className="absolute inset-0 bg-sky-500/15 blur-[100px] rounded-full pointer-events-none" />
            <KnowledgeOctahedron3D />
          </div>
        </section>

        {/* 8 Engine Modules Grid with 21st.dev Style BorderBeam on Featured Cards */}
        <section className="relative py-16 px-6 max-w-7xl mx-auto z-10">
          <div className="mb-10 text-center lg:text-left">
            <p className="font-mono text-xs text-sky-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 justify-center lg:justify-start">
              <Compass className="w-3.5 h-3.5" />
              <span>Full Reference Engines from Global Standard Websites</span>
            </p>
            <h2 className="text-3xl font-bold text-slate-100">
              Flagship Learning Workstations
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {avpuModules.map((mod, idx) => {
              const Icon = mod.icon;
              const isHighlight = idx === 0 || idx === 2; // DAG and DuoLeague have BorderBeam
              return (
                <div key={mod.id} className="relative rounded-2xl">
                  <CardSpotlight
                    className="p-6 rounded-2xl bg-slate-900/70 border border-sky-900/40 hover:border-sky-500/50 transition-all flex flex-col justify-between group backdrop-blur-md h-full relative overflow-hidden"
                  >
                    {isHighlight && (
                      <BorderBeam
                        size={180}
                        duration={10}
                        colorFrom={mod.color}
                        colorTo="#6366f1"
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
                        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/80">
                          Ref: {mod.reference}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
                          {mod.name}
                        </h3>
                        <p className="text-slate-400 text-xs leading-relaxed mt-2">
                          {mod.desc}
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{mod.badge}</span>
                      </span>

                      <Link
                        href={mod.href}
                        className="text-xs font-mono text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
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
        <footer className="border-t border-sky-900/30 py-8 px-6 text-center text-xs font-mono text-slate-500 relative z-10">
          <p>© 2026 Alpaben Vipulbhai Patel University (AVPU) · A Sevenseed AI Venture</p>
        </footer>
      </main>
    </SmoothScrollProvider>
  );
}
