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
  GraduationCap,
  Network,
  Code2,
  Flame,
  Scale,
  Brain,
  ArrowUpRight,
  Sparkles,
  BookOpen,
  Award,
  Layers,
  CheckCircle2,
} from "lucide-react";

const avpuModules = [
  {
    id: "learn-dag",
    name: "Interactive Knowledge DAG",
    reference: "learn-anything.xyz",
    desc: "Graph-structured visual curriculum with prerequisite links, topic mind-maps & curated learning paths.",
    icon: Network,
    badge: "Graph Engine",
    color: "#38bdf8",
    href: "/avpu/learn-dag",
  },
  {
    id: "code-lab",
    name: "In-Browser Code Lab",
    reference: "freecodecamp.org",
    desc: "Interactive JavaScript/Python sandbox with automated unit test assertions, console logs & solution hints.",
    icon: Code2,
    badge: "Live Runner",
    color: "#10b981",
    href: "/avpu/code-lab",
  },
  {
    id: "duo-league",
    name: "Gamified Streak & League",
    reference: "duolingo.com",
    desc: "Daily streak flames, heart deduction mechanics, XP scoring, and Bronze-to-Diamond weekly leaderboards.",
    icon: Flame,
    badge: "Gamification",
    color: "#f59e0b",
    href: "/avpu/duo-league",
  },
  {
    id: "laws-of-ux",
    name: "Interactive Laws of UX",
    reference: "lawsofux.com",
    desc: "Cognitive psychology heuristics (Fitts's, Hick's, Miller's, Jakob's) with live physics & latency simulation cards.",
    icon: Scale,
    badge: "UX Psychology",
    color: "#a855f7",
    href: "/avpu/laws-of-ux",
  },
  {
    id: "mental-models",
    name: "Latticework of Mental Models",
    reference: "fs.blog/mental-models",
    desc: "First-principles thinking, inversion, second-order effects & Pareto decision simulators.",
    icon: Brain,
    badge: "Decision Science",
    color: "#ec4899",
    href: "/avpu/mental-models",
  },
];

export default function AVPUHubPage() {
  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#030712] text-slate-100 overflow-hidden">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(56, 189, 248, 0.25)" />

        {/* Top Nav */}
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/80 bg-[#030712]/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center font-bold text-black shadow-lg shadow-sky-500/30">
                  7S
                </div>
                <span className="font-bold tracking-wider text-sm bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-sky-300">
                  SEVENSEED
                </span>
              </Link>
              <span className="text-slate-600">/</span>
              <span className="font-mono text-xs text-sky-400 font-bold flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" />
                <span>AVP UNIVERSITY</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/avpu/learn-dag"
                className="text-xs font-mono text-slate-300 hover:text-white px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 flex items-center gap-1.5"
              >
                <Network className="w-3.5 h-3.5 text-sky-400" />
                <span>Launch Knowledge DAG</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative pt-36 pb-16 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-6 z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-xs font-mono text-sky-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen EdTech Hub · 11 Deep Systems</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
              Autonomous Intelligence <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400">
                Learning Ecosystem
              </span>
            </h1>

            <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Synthesizing graph learning paths from <em>learn-anything</em>, in-browser compilation from <em>freeCodeCamp</em>, gamification from <em>Duolingo</em>, and psychology from <em>Laws of UX</em>.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="/avpu/learn-dag">
                <CyberButton>
                  Explore Knowledge DAG
                </CyberButton>
              </Link>
              <Link href="/avpu/duo-league">
                <CyberButton>
                  Daily Streak Arena
                </CyberButton>
              </Link>
            </div>
          </div>

          {/* 3D Quantum Knowledge Core */}
          <div className="flex-1 w-full max-w-md aspect-square relative flex items-center justify-center">
            <div className="absolute inset-0 bg-sky-500/15 blur-[90px] rounded-full" />
            <div className="relative w-full h-full border border-slate-800/80 rounded-3xl overflow-hidden bg-slate-950/60 backdrop-blur-md shadow-2xl">
              <QuantumCore3DWebGL />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl backdrop-blur-md">
                <span className="flex items-center gap-1.5 text-sky-300">
                  <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                  Quantum Knowledge Octahedron
                </span>
                <span className="text-emerald-400">WebGL PBR</span>
              </div>
            </div>
          </div>
        </section>

        {/* Modules Grid */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="mb-10">
            <div className="text-xs font-mono uppercase text-sky-400 tracking-wider mb-1">
              Engine Modules
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">Flagship Learning Engines</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {avpuModules.map((m) => {
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

                      <h3 className="text-lg font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
                        {m.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{m.desc}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between">
                      <span className="text-xs font-mono text-sky-400/80 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        {m.badge}
                      </span>
                      <span className="text-xs font-mono text-sky-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
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
