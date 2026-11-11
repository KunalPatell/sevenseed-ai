"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Spotlight, SmoothScrollProvider } from "@main/ui-core";
import { ArrowLeft, Sparkles, Sliders, Copy, Check, Box } from "lucide-react";

export default function FramerStudioRoute() {
  const [stiffness, setStiffness] = useState(260);
  const [damping, setDamping] = useState(20);
  const [mass, setMass] = useState(1.0);
  const [tiltX, setTiltX] = useState(10);
  const [tiltY, setTiltY] = useState(-12);
  const [scale, setScale] = useState(1.03);
  const [copied, setCopied] = useState(false);

  const naturalFreq = Math.sqrt(stiffness / mass).toFixed(1);
  const dampingRatio = (damping / (2 * Math.sqrt(stiffness * mass))).toFixed(2);

  const tsxSnippet = `import { motion } from "framer-motion";

export function AceternityQuantumCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotateX: ${tiltX} }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      whileHover={{ scale: ${scale}, rotateX: ${tiltX}, rotateY: ${tiltY} }}
      transition={{
        type: "spring",
        stiffness: ${stiffness},
        damping: ${damping},
        mass: ${mass}
      }}
      className="rounded-3xl p-8 bg-slate-950/90 border border-sky-500/40 shadow-2xl"
    >
      <h4>21st.dev × Aceternity × Unicorn Studio Shader</h4>
    </motion.div>
  );
}`;

  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#030712] text-slate-100 p-6 md:p-10 space-y-6">
        <Spotlight className="-top-40 left-20" fill="rgba(168, 85, 247, 0.22)" />

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="text-[11px] font-mono uppercase text-purple-400">
                Framer.com × 21st.dev × Aceternity UI × Unicorn.Studio
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-purple-400" />
                <span>Framer Spring Physics Solver & 3D Shader Component Codegen</span>
              </h1>
            </div>
          </div>

          <button
            onClick={() => {
              if (navigator.clipboard) navigator.clipboard.writeText(tsxSnippet);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="px-4 py-2 rounded-xl bg-purple-500 text-white font-bold text-xs flex items-center gap-2 hover:bg-purple-400 transition"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Copied React + Framer TSX!" : "Copy Production .TSX Code"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold uppercase text-purple-300">Spring Differential Equation Parameters</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
              <label>
                Stiffness k ({stiffness} N/m)
                <input type="range" min={50} max={500} value={stiffness} onChange={(e) => setStiffness(Number(e.target.value))} className="w-full" />
              </label>
              <label>
                Damping c ({damping} Ns/m)
                <input type="range" min={5} max={60} value={damping} onChange={(e) => setDamping(Number(e.target.value))} className="w-full" />
              </label>
              <label>
                Mass m ({mass} kg)
                <input type="range" min={0.5} max={5} step={0.5} value={mass} onChange={(e) => setMass(Number(e.target.value))} className="w-full" />
              </label>
              <label>
                Hover Scale ({scale}x)
                <input type="range" min={1.0} max={1.15} step={0.01} value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-full" />
              </label>
              <label>
                3D RotateX ({tiltX}°)
                <input type="range" min={-25} max={25} value={tiltX} onChange={(e) => setTiltX(Number(e.target.value))} className="w-full" />
              </label>
              <label>
                3D RotateY ({tiltY}°)
                <input type="range" min={-25} max={25} value={tiltY} onChange={(e) => setTiltY(Number(e.target.value))} className="w-full" />
              </label>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-around text-xs font-mono">
              <div>
                Natural Freq ω₀: <strong className="text-sky-400">{naturalFreq} rad/s</strong>
              </div>
              <div>
                Damping Ratio ζ: <strong className="text-emerald-400">{dampingRatio}</strong>
              </div>
              <div>
                Regime: <strong className="text-amber-400">{Number(dampingRatio) < 1 ? "Underdamped" : "Critically Damped"}</strong>
              </div>
            </div>

            <div
              style={{
                transform: `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scale})`,
                transition: `transform ${Math.round((damping / stiffness) * 600 + 180)}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
              }}
              className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border border-purple-500/50 shadow-2xl space-y-2"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                <Box className="w-4 h-4" />
                <span>21ST.DEV · ACETERNITY · UNICORN.STUDIO · AURA.BUILD</span>
              </div>
              <h3 className="text-lg font-extrabold text-white">Interactive 3D Perspective & Spring Physics Card</h3>
              <p className="text-xs text-slate-300">
                Adjust stiffness, damping, mass, and 3D perspective sliders above to preview real-time spring response.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h2 className="text-sm font-bold uppercase text-emerald-400">Generated React 18 + Framer Motion Code</h2>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
              {tsxSnippet}
            </pre>
          </div>
        </div>
      </main>
    </SmoothScrollProvider>
  );
}

