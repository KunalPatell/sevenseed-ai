"use client";

import React, { useState, useEffect } from "react";
import {
  Spotlight,
  CardSpotlight,
  QuantumCore3DWebGL,
  CyberButton,
  SmoothScrollProvider,
} from "@main/ui-core";
import {
  Sparkles,
  Cpu,
  GraduationCap,
  ShoppingBag,
  HeartPulse,
  Wrench,
  Shield,
  Layers,
  ArrowUpRight,
  Activity,
  Server,
  Zap,
} from "lucide-react";

interface VentureCard {
  id: string;
  name: string;
  category: string;
  tagline: string;
  icon: any;
  color: string;
  stats: string;
  link: string;
}

const ventures: VentureCard[] = [
  {
    id: "avpu",
    name: "AVP University",
    category: "EdTech & Skills",
    tagline: "AI-Augmented curriculum, neural course roadmaps & autonomous certification engines.",
    icon: GraduationCap,
    color: "#38bdf8",
    stats: "18+ AI Specializations",
    link: "/avpu",
  },
  {
    id: "avp-emart",
    name: "AVP E-Mart",
    category: "Q-Commerce & Retail",
    tagline: "Ultra-fast 10-minute automated fulfillment with live deals radar and dynamic pricing.",
    icon: ShoppingBag,
    color: "#10b981",
    stats: "10-Min Delivery Engine",
    link: "/avp-emart",
  },
  {
    id: "comonk",
    name: "Comonk AI",
    category: "Career & Intelligence",
    tagline: "Autonomous ATS matching, real-time salary telemetry & predictive job hunting agent.",
    icon: Cpu,
    color: "#a855f7",
    stats: "98.4% Match Accuracy",
    link: "/comonk",
  },
  {
    id: "sevenforce",
    name: "Sevenforce",
    category: "Enterprise Automation",
    tagline: "High-throughput robotic process workflows & autonomous micro-agent swarms.",
    icon: Zap,
    color: "#f59e0b",
    stats: "450k+ Tasks / Day",
    link: "/sevenforce",
  },
  {
    id: "decode-forest-pharmacy",
    name: "Decode Forest Pharmacy",
    category: "HealthTech & Bio",
    tagline: "Deep biochemical alternative finder, instant generic equivalents & molecular lookup.",
    icon: HeartPulse,
    color: "#ec4899",
    stats: "12,000+ Verified Molecules",
    link: "/pharmacy",
  },
  {
    id: "breakdown-factor",
    name: "Breakdown Factor",
    category: "Industrial & Diagnostics",
    tagline: "Predictive asset telemetry, MTBF failure analytics & automated field service dispatch.",
    icon: Wrench,
    color: "#ef4444",
    stats: "0.02% Failure Prediction",
    link: "/breakdown",
  },
  {
    id: "rakshak-ai",
    name: "Rakshak AI",
    category: "Autonomous Security",
    tagline: "Computer vision surveillance, weapon detection & edge anomaly neural networks.",
    icon: Shield,
    color: "#06b6d4",
    stats: "30 FPS Edge Inference",
    link: "/rakshak-ai",
  },
];

export default function SevenseedHomePage() {
  const [backendStatus, setBackendStatus] = useState<"connecting" | "online" | "offline">("connecting");

  useEffect(() => {
    fetch("http://localhost:8000/api/health")
      .then((res) => (res.ok ? setBackendStatus("online") : setBackendStatus("offline")))
      .catch(() => setBackendStatus("offline"));
  }, []);

  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#030712] text-slate-100 overflow-hidden">
        {/* Aceternity Spotlight Hero Lighting */}
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(56, 189, 248, 0.25)" />

        {/* Top Telemetry Bar */}
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/80 bg-[#030712]/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center font-bold text-black shadow-lg shadow-sky-500/30">
                7S
              </div>
              <span className="font-bold tracking-wider text-lg bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-sky-200 to-slate-400">
                SEVENSEED
              </span>
              <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-sky-400/80 bg-sky-500/10 border border-sky-500/20 px-2.5 py-0.5 rounded-full font-mono">
                Master Workspace
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 font-mono text-xs text-slate-400 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-full">
                <span
                  className={`w-2 h-2 rounded-full ${
                    backendStatus === "online"
                      ? "bg-emerald-400 animate-pulse"
                      : backendStatus === "connecting"
                      ? "bg-amber-400 animate-pulse"
                      : "bg-rose-500"
                  }`}
                />
                <span>AI Engine : {backendStatus.toUpperCase()}</span>
              </div>

              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1 bg-sky-950/50 border border-sky-800/40 px-3 py-1.5 rounded-full"
              >
                <span>Portfolio</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative pt-36 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-6 z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-sky-500/30 text-xs font-mono text-sky-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Unified Monorepo Ecosystem · F:\main</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
              Ecosystem of <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400">
                Intelligent Ventures
              </span>
            </h1>

            <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Seven autonomous high-throughput ventures sharing a master 3D WebGL core, predictive AI engines, and unified high-performance design architecture.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <CyberButton
                onClick={() => {
                  document.getElementById("ventures-grid")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Explore Ventures
              </CyberButton>
              <CyberButton
                onClick={() => {
                  alert("FastAPI AI Backend: http://localhost:8000 (LangGraph + ChromaDB active)");
                }}
              >
                Launch AI Diagnostic
              </CyberButton>
            </div>
          </div>

          {/* Master 3D Quantum Core WebGL Visualizer */}
          <div className="flex-1 w-full max-w-lg aspect-square relative flex items-center justify-center">
            <div className="absolute inset-0 bg-sky-500/10 blur-[100px] rounded-full" />
            <div className="relative w-full h-full border border-slate-800/80 rounded-3xl overflow-hidden bg-slate-950/60 backdrop-blur-md shadow-2xl">
              <QuantumCore3DWebGL />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl backdrop-blur-md">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-sky-400 animate-spin" />
                  Shared @main/ui-core 3D WebGL
                </span>
                <span className="text-emerald-400">60 FPS</span>
              </div>
            </div>
          </div>
        </section>

        {/* Ventures Grid */}
        <section id="ventures-grid" className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-sky-400 mb-2">
                Portfolio Ventures
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Active Platforms & Engines</h2>
            </div>
            <p className="text-sm text-slate-400 max-w-md mt-4 md:mt-0 font-mono">
              Consolidated from static templates into a high-octane React 18 / Next.js 15 master workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ventures.map((v) => {
              const IconComp = v.icon;
              return (
                <CardSpotlight
                  key={v.id}
                  className="p-6 rounded-2xl border border-slate-800/80 bg-slate-950/70 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${v.color}15`, color: v.color }}
                      >
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full">
                        {v.category}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
                      {v.name}
                    </h3>
                    <p className="text-sm text-slate-400 mt-2 leading-relaxed">{v.tagline}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between">
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      {v.stats}
                    </span>
                    <span className="text-xs font-mono text-sky-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Enter Platform <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </CardSpotlight>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-900 bg-slate-950/80 py-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
            <div>© 2026 Sevenseed Ecosystem. Master Architecture running in F:\main.</div>
            <div className="flex items-center gap-6">
              <span>Next.js 15</span>
              <span>FastAPI Backend</span>
              <span>Tailwind CSS</span>
              <span>Three.js WebGL</span>
            </div>
          </div>
        </footer>
      </main>
    </SmoothScrollProvider>
  );
}
