"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Spotlight, SmoothScrollProvider } from "@main/ui-core";
import { ArrowLeft, Palette, Sparkles, Layers, Download, Wand2, Move } from "lucide-react";

export default function CanvaStudioRoute() {
  const [headline, setHeadline] = useState("Sevenseed Quantum AI — 10x Multi-Framework Cloud");
  const [subhead, setSubhead] = useState("React 18 · AngularJS 1.8 · LangChain · LangGraph · Framer Motion · Three.js");
  const [ctaText, setCtaText] = useState("Launch Interactive Studio →");
  const [paletteKey, setPaletteKey] = useState<"cyber-neon" | "sunset-gold" | "emerald-bio">("cyber-neon");
  const [orbX, setOrbX] = useState(560);
  const [orbY, setOrbY] = useState(185);
  const [orbRadius, setOrbRadius] = useState(125);
  const [badgeText, setBadgeText] = useState("✨ CANVA VECTOR STUDIO × SPLINE 3D HALO");

  const palettes = {
    "cyber-neon": { bg1: "#030712", bg2: "#1e1b4b", accent: "#38bdf8", badge: "#10b981", text: "#ffffff" },
    "sunset-gold": { bg1: "#180a1c", bg2: "#4c1d95", accent: "#f59e0b", badge: "#ec4899", text: "#fef3c7" },
    "emerald-bio": { bg1: "#022c22", bg2: "#0f172a", accent: "#34d399", badge: "#38bdf8", text: "#ecfdf5" },
  };
  const pal = palettes[paletteKey];

  const exportSvgPoster = () => {
    const svgEl = document.getElementById("canva-vector-svg");
    if (!svgEl) return;
    const xml = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sevenseed-canva-${paletteKey}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#030712] text-slate-100 p-6 md:p-10 space-y-6">
        <Spotlight className="-top-40 left-20" fill="rgba(56, 189, 248, 0.22)" />

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="text-[11px] font-mono uppercase text-sky-400">Canva.com Multi-Layer Vector Engine</div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
                <Palette className="w-5 h-5 text-sky-400" />
                <span>Canva Interactive Multi-Layer Vector & Brand Poster Studio</span>
              </h1>
            </div>
          </div>

          <button
            onClick={exportSvgPoster}
            className="px-4 py-2 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs flex items-center gap-2 hover:bg-sky-400 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export Vector Poster (.SVG)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Layer Controls */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-sky-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> Scene Graph Layers
              </span>
              <span className="text-[11px] font-mono text-emerald-400">6 Active Vector Layers</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Brand Kit Color Palette</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["cyber-neon", "sunset-gold", "emerald-bio"] as const).map((k) => (
                    <button
                      key={k}
                      onClick={() => setPaletteKey(k)}
                      className={`py-2 px-2 rounded-lg font-bold capitalize border ${
                        paletteKey === k
                          ? "bg-sky-500/20 border-sky-400 text-sky-300"
                          : "bg-slate-950 border-slate-800 text-slate-400"
                      }`}
                    >
                      {k.replace("-", " ")}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Layer 1: Eyebrow Badge</label>
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Layer 2: Hero Headline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Layer 3: Value Subtitle</label>
                <input
                  type="text"
                  value={subhead}
                  onChange={(e) => setSubhead(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Layer 4: CTA Button Label</label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Move className="w-3.5 h-3.5 text-amber-400" /> Spline 3D Halo Orb Coordinates
                </div>
                <label className="block text-slate-400">
                  X Position ({orbX}px)
                  <input
                    type="range"
                    min={80}
                    max={680}
                    value={orbX}
                    onChange={(e) => setOrbX(Number(e.target.value))}
                    className="w-full"
                  />
                </label>
                <label className="block text-slate-400">
                  Y Position ({orbY}px)
                  <input
                    type="range"
                    min={60}
                    max={360}
                    value={orbY}
                    onChange={(e) => setOrbY(Number(e.target.value))}
                    className="w-full"
                  />
                </label>
                <label className="block text-slate-400">
                  Radius ({orbRadius}px)
                  <input
                    type="range"
                    min={50}
                    max={220}
                    value={orbRadius}
                    onChange={(e) => setOrbRadius(Number(e.target.value))}
                    className="w-full"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Interactive Vector Canvas */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Wand2 className="w-4 h-4 text-purple-400" /> Live 760×420 Vector Artboard (Real-Time DOM/SVG Sync)
              </span>
              <span className="font-mono text-slate-400">60fps GPU Accelerated</span>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
              <svg id="canva-vector-svg" viewBox="0 0 760 420" className="w-full h-auto">
                <defs>
                  <linearGradient id="canvaBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={pal.bg1} />
                    <stop offset="100%" stopColor={pal.bg2} />
                  </linearGradient>
                </defs>
                <rect width="760" height="420" fill="url(#canvaBgGrad)" />
                <circle cx={orbX} cy={orbY} r={orbRadius} fill={pal.accent} opacity="0.24" />
                <circle cx={orbX - 40} cy={orbY + 30} r={orbRadius * 0.6} fill={pal.badge} opacity="0.16" />
                <rect x="48" y="48" width="340" height="32" rx="16" fill={pal.badge} opacity="0.22" />
                <text x="64" y="68" fill={pal.badge} fontSize="11" fontWeight="bold">
                  {badgeText}
                </text>
                <text x="48" y="145" fill={pal.text} fontSize="28" fontWeight="bold">
                  {headline.slice(0, 44)}
                </text>
                <text x="48" y="192" fill="#94a3b8" fontSize="14">
                  {subhead}
                </text>
                <rect x="48" y="250" width="240" height="50" rx="14" fill={pal.accent} />
                <text x="168" y="280" fill="#020617" fontSize="14" fontWeight="bold" textAnchor="middle">
                  {ctaText}
                </text>
              </svg>
            </div>
          </div>
        </div>
      </main>
    </SmoothScrollProvider>
  );
}

