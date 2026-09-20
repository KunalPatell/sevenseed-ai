"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Spotlight, CardSpotlight, SmoothScrollProvider } from "@main/ui-core";
import { ArrowLeft, Brain, Sparkles, Compass, CheckCircle2, ChevronRight, Zap } from "lucide-react";

interface MentalModel {
  id: string;
  name: string;
  domain: string;
  tagline: string;
  explanation: string;
  scenario: {
    dilemma: string;
    action: string;
  };
}

const mentalModels: MentalModel[] = [
  {
    id: "inversion",
    name: "Inversion Principle",
    domain: "Mathematics & Philosophy",
    tagline: '"Invert, always invert." — Carl Jacobi',
    explanation: "Instead of asking how to achieve success, ask how to guarantee failure — and then systematically avoid those mistakes.",
    scenario: {
      dilemma: "How do we build a high-performance 3D WebGL ecosystem without stuttering?",
      action: "Invert: What causes 100% of WebGL crashes? Memory leaks, un-disposed geometries, and duplicate canvas contexts. Eliminate those first."
    }
  },
  {
    id: "first-principles",
    name: "First Principles Thinking",
    domain: "Physics & Engineering",
    tagline: "Boil a problem down to its most fundamental truths.",
    explanation: "Reason upward from basic physics truths rather than reasoning by analogy or copying existing industry templates.",
    scenario: {
      dilemma: "Why do competitor platforms duplicate 2GB of node_modules per project?",
      action: "First principles: All projects use the same React & Three.js binaries. Hoist them to a single master workspace with symlinks."
    }
  },
  {
    id: "second-order-thinking",
    name: "Second-Order Effects",
    domain: "Economics & Systems",
    tagline: '"And then what?" — Howard Marks',
    explanation: "First-order thinking considers only immediate results. Second-order thinking evaluates the consequences of those results over time.",
    scenario: {
      dilemma: "Should we use static HTML/CSS to build fast without a build step?",
      action: "First-order: Easy to start. Second-order: Navigation destroys 3D WebGL canvases, prevents shared state, and blocks scaling. Next.js 15 is required."
    }
  },
  {
    id: "occams-razor",
    name: "Occam's Razor",
    domain: "Epistemology",
    tagline: "The simplest explanation is most likely true.",
    explanation: "When presented with competing hypotheses or over-engineered abstractions, select the one that makes the fewest assumptions.",
    scenario: {
      dilemma: "Do we need a complex Kubernetes cluster for local development?",
      action: "Apply Occam: A clean npm workspace with native Node.js and Next.js is infinitely simpler, faster, and reliable."
    }
  },
  {
    id: "circle-of-competence",
    name: "Circle of Competence",
    domain: "Decision Strategy",
    tagline: "Know what you know, and recognize what you don't.",
    explanation: "Operating inside your circle gives you an asymmetric edge; the danger arises when you deceive yourself about where the perimeter lies.",
    scenario: {
      dilemma: "Should our backend build custom neural networks from scratch?",
      action: "Focus on our core edge: Agentic workflows (LangGraph) and prompt retrieval (ChromaDB), leveraging Groq's high-speed LLaMA inference engine."
    }
  },
  {
    id: "pareto-principle",
    name: "Pareto 80/20 Law",
    domain: "Efficiency & Statistics",
    tagline: "80% of consequences come from 20% of the causes.",
    explanation: "A small fraction of inputs, components, or features drives the overwhelming majority of user delight and performance.",
    scenario: {
      dilemma: "Which UI elements give the highest visual WOW factor?",
      action: "The 20% elements: 3D WebGL PBR materials, Aceternity spotlight cards, and smooth Lenis scrolling deliver 80% of the perceived quality."
    }
  }
];

export default function MentalModelsRoute() {
  const [selectedModel, setSelectedModel] = useState<MentalModel>(mentalModels[0]);

  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#030712] text-slate-100 p-6 md:p-10 space-y-8">
        <Spotlight className="-top-40 left-20" fill="rgba(236, 72, 153, 0.2)" />

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
              <div className="text-[11px] font-mono uppercase text-pink-400">AVPU Decision Sciences</div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
                <Brain className="w-5 h-5 text-pink-400" />
                <span>Latticework of Mental Models (fs.blog/mental-models)</span>
              </h1>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 font-mono text-xs text-slate-400">
            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
              Multi-Disciplinary Reasoning Framework
            </span>
          </div>
        </div>

        {/* Active Model Deep Dive Spotlight */}
        <div className="w-full bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-pink-500/30 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                {selectedModel.domain}
              </span>
              <span className="text-xs font-mono text-slate-400 italic">
                {selectedModel.tagline}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              {selectedModel.name}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {selectedModel.explanation}
            </p>

            {/* Scenario Box */}
            <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono space-y-2">
              <div className="text-slate-400">
                <span className="text-pink-400 font-bold uppercase">Real Scenario: </span>
                {selectedModel.scenario.dilemma}
              </div>
              <div className="text-emerald-300 font-medium">
                <span className="text-emerald-400 font-bold uppercase">Model-Driven Decision: </span>
                {selectedModel.scenario.action}
              </div>
            </div>
          </div>
        </div>

        {/* Mental Models Latticework Grid */}
        <div>
          <div className="text-xs font-mono uppercase text-slate-400 mb-3">Explore the Latticework</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mentalModels.map((m) => {
              const isSelected = selectedModel.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedModel(m)}
                  className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-slate-900 border-pink-400 shadow-lg shadow-pink-500/15"
                      : "bg-slate-950/70 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2">
                      <span>{m.domain}</span>
                      {isSelected && <span className="text-pink-400 font-bold">ACTIVE</span>}
                    </div>
                    <h3 className="text-base font-bold text-slate-100">{m.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{m.explanation}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-xs font-mono text-pink-400">
                    <span>Inspect Scenario</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </SmoothScrollProvider>
  );
}
