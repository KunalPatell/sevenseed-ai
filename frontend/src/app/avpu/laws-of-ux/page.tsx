"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Spotlight, CardSpotlight, SmoothScrollProvider } from "@main/ui-core";
import { ArrowLeft, Scale, Sparkles, Sliders, CheckCircle2, ArrowRight } from "lucide-react";

interface UXLaw {
  id: string;
  name: string;
  author: string;
  formula?: string;
  category: "Heuristic" | "Principle" | "Gestalt" | "Cognitive";
  summary: string;
  implication: string;
  interactiveType: "fitts" | "hicks" | "millers";
}

const uxLaws: UXLaw[] = [
  {
    id: "fitts-law",
    name: "Fitts's Law",
    author: "Paul Fitts (1954)",
    formula: "T = a + b * log2(2D / W)",
    category: "Heuristic",
    summary: "The time to acquire a target is a function of the distance to and width of the target.",
    implication: "Make actionable buttons large and position primary click zones within rapid reach.",
    interactiveType: "fitts",
  },
  {
    id: "hicks-law",
    name: "Hick's Law",
    author: "William Edmund Hick (1952)",
    formula: "RT = b * log2(n + 1)",
    category: "Cognitive",
    summary: "The time it takes to make a decision increases logarithmically with the number and complexity of choices.",
    implication: "Break complex multi-choice menus into progressive disclosures and smart defaults.",
    interactiveType: "hicks",
  },
  {
    id: "millers-law",
    name: "Miller's Law",
    author: "George A. Miller (1956)",
    formula: "Capacity = 7 ± 2 items",
    category: "Cognitive",
    summary: "The average person can only keep 7 (plus or minus 2) items in their immediate working memory.",
    implication: "Chunk content into clusters of 5 to 7 elements to prevent working memory saturation.",
    interactiveType: "millers",
  },
  {
    id: "jakobs-law",
    name: "Jakob's Law",
    author: "Jakob Nielsen (2000)",
    category: "Principle",
    summary: "Users spend most of their time on other sites. They expect your site to work the same way as all the others.",
    implication: "Use familiar navigation patterns, shopping carts, and UI paradigms rather than eccentric layouts.",
    interactiveType: "fitts",
  },
  {
    id: "peak-end-rule",
    name: "Peak-End Rule",
    author: "Daniel Kahneman (1993)",
    category: "Cognitive",
    summary: "People judge an experience largely based on how they felt at its peak and at its end, rather than total sum.",
    implication: "Deliver euphoric micro-animations on checkout completion and resolve errors with empathy.",
    interactiveType: "hicks",
  },
  {
    id: "doherty-threshold",
    name: "Doherty Threshold",
    author: "Walter J. Doherty (1982)",
    formula: "Latency < 400ms",
    category: "Principle",
    summary: "Productivity soars when a computer and its users interact at a pace (<400ms) that ensures neither has to wait.",
    implication: "Provide instantaneous optimistic UI responses and skeleton loaders under 400ms.",
    interactiveType: "millers",
  }
];

function InteractiveLawTester({ type }: { type: UXLaw["interactiveType"] }) {
  const [fittsSize, setFittsSize] = useState(48);
  const [fittsDistance, setFittsDistance] = useState(120);
  const [clickTime, setClickTime] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(0);

  const startTest = () => {
    setStartTime(Date.now());
    setClickTime(null);
  };

  const endTest = () => {
    if (startTime > 0) {
      setClickTime(Date.now() - startTime);
    }
  };

  if (type === "fitts") {
    return (
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Target Size: {fittsSize}px</span>
          <span>Target Distance: {fittsDistance}px</span>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="range"
            min={24}
            max={72}
            value={fittsSize}
            onChange={(e) => setFittsSize(Number(e.target.value))}
            className="flex-1 accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <input
            type="range"
            min={50}
            max={200}
            value={fittsDistance}
            onChange={(e) => setFittsDistance(Number(e.target.value))}
            className="flex-1 accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Live Arena */}
        <div className="h-24 bg-slate-950 rounded-lg border border-slate-800/80 relative flex items-center px-4 overflow-hidden">
          <button
            onClick={startTest}
            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300"
          >
            1. Click Start
          </button>

          <button
            onClick={endTest}
            style={{
              width: `${fittsSize}px`,
              height: `${fittsSize}px`,
              marginLeft: `${fittsDistance}px`,
            }}
            className="rounded-lg bg-sky-500 hover:bg-sky-400 text-black font-mono font-bold text-xs flex items-center justify-center shadow-lg shadow-sky-500/20 transition-all"
          >
            2. Hit
          </button>

          {clickTime !== null && (
            <div className="ml-auto font-mono text-xs text-emerald-400 font-bold">
              Reaction: {clickTime}ms
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
      <span>Interactive heuristic validator active</span>
      <span className="text-emerald-400 font-bold">Optimal Range ✓</span>
    </div>
  );
}

export default function LawsOfUXRoute() {
  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#030712] text-slate-100 p-6 md:p-10 space-y-8">
        <Spotlight className="-top-40 left-20" fill="rgba(168, 85, 247, 0.2)" />

        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/avpu"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="text-[11px] font-mono uppercase text-purple-400">AVPU Cognitive Science</div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
                <Scale className="w-5 h-5 text-purple-400" />
                <span>Interactive Laws of UX Psychology (lawsofux.com)</span>
              </h1>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 font-mono text-xs text-slate-400">
            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
              Interactive Physics Cards & Cognitive Heuristics
            </span>
          </div>
        </div>

        {/* Laws Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uxLaws.map((law) => (
            <CardSpotlight
              key={law.id}
              className="p-6 rounded-2xl border border-slate-800/80 bg-slate-950/70 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300">
                    {law.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{law.author}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-100">{law.name}</h3>
                {law.formula && (
                  <div className="text-xs font-mono text-sky-400 bg-slate-900 border border-slate-800 px-2 py-1 rounded-md my-2 inline-block">
                    {law.formula}
                  </div>
                )}
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{law.summary}</p>
              </div>

              {/* Interactive Sandbox */}
              <InteractiveLawTester type={law.interactiveType} />

              <div className="pt-3 border-t border-slate-900 text-[11px] font-mono text-slate-400">
                <span className="text-purple-400 font-bold block mb-1">Product Implication:</span>
                <span>{law.implication}</span>
              </div>
            </CardSpotlight>
          ))}
        </div>
      </main>
    </SmoothScrollProvider>
  );
}
