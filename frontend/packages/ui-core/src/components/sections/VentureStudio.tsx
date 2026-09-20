"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  Database,
  GitBranch,
  Bot,
  Zap,
} from "lucide-react";
import { projects } from "../../lib/data";
import { SectionHeading, CardSpotlight } from "../ui";
import { HoloTilt3D } from "../motion";
import { sound } from "../../lib/sound";

const VENTURE_LIST = projects.filter((p) => p.isStartupVenture);

export function VentureStudio() {
  const [selectedVenture, setSelectedVenture] = useState(VENTURE_LIST[0]);

  const handleSelect = (v: typeof VENTURE_LIST[0]) => {
    setSelectedVenture(v);
    sound.playClick();
  };

  return (
    <section id="ventures" className="section bg-[#050505] border-t border-white/5 relative overflow-hidden">
      <div className="container-px relative z-10">
        <SectionHeading
          eyebrow="Sevenseed Venture Studio"
          title={
            <>
              Architecting <span className="text-[#9ed8ff] drop-shadow-[0_0_8px_rgba(158,216,255,0.4)]">Autonomous AI Startups</span>
            </>
          }
          description="As Lead AI Engineer for the Sevenseed Studio ecosystem, I architected the multi-agent backend, vector RAG backbone, and specialized inference engines powering 7 enterprise software ventures."
        />

        {/* Studio Architecture Flow Overview wrapped in CardSpotlight */}
        <CardSpotlight radius={400} color="rgba(158, 216, 255, 0.14)" className="mb-12 p-6 border border-white/10">
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-5">
            <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#9ed8ff]">
              <Cpu className="h-4 w-4 text-[#9ed8ff]" />
              Unified Studio Architecture &amp; Multi-Agent Mesh
            </span>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] text-emerald-400">
              BYOK Zero-Cost Tier Active
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <Bot className="h-5 w-5 text-[#9ed8ff] mx-auto mb-2" />
              <div className="text-xs font-semibold text-white">LangGraph DAG</div>
              <div className="text-[10px] text-white/40 mt-1">Multi-Agent Committee</div>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <Database className="h-5 w-5 text-[#cfae6e] mx-auto mb-2" />
              <div className="text-xs font-semibold text-white">ChromaDB RAG</div>
              <div className="text-[10px] text-white/40 mt-1">Cosine Vector Embeddings</div>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <Zap className="h-5 w-5 text-emerald-400 mx-auto mb-2" />
              <div className="text-xs font-semibold text-white">Groq LLaMA 3.3</div>
              <div className="text-[10px] text-white/40 mt-1">&lt; 800ms Inference Gateway</div>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <GitBranch className="h-5 w-5 text-purple-400 mx-auto mb-2" />
              <div className="text-xs font-semibold text-white">FastAPI Microservices</div>
              <div className="text-[10px] text-white/40 mt-1">Next.js 15 SSR Client</div>
            </div>
          </div>
        </CardSpotlight>

        {/* Venture Navigation Tabs & Explorer */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Tabs Sidebar */}
          <div data-blur-in className="lg:col-span-4 space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-3 px-1">
              Select Startup Venture:
            </div>
            {VENTURE_LIST.map((v) => {
              const isSelected = v.id === selectedVenture.id;
              return (
                <button
                  key={v.id}
                  onClick={() => handleSelect(v)}
                  className={`w-full text-left rounded-xl p-3.5 font-mono text-xs transition-all duration-200 flex items-center justify-between ${
                    isSelected
                      ? "border border-[#9ed8ff]/50 bg-[#9ed8ff]/10 text-white shadow-[0_0_15px_rgba(158,216,255,0.15)]"
                      : "border border-white/5 bg-white/[0.02] text-white/60 hover:bg-white/5 hover:text-white hover:border-white/10"
                  }`}
                >
                  <div>
                    <div className="font-semibold">{v.title}</div>
                    <div className="text-[10px] text-white/40 mt-0.5">{v.category}</div>
                  </div>
                  <ArrowRight
                    className={`h-4 w-4 transition-transform ${
                      isSelected ? "text-[#9ed8ff] translate-x-1" : "text-white/20"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Selected Venture Deep Dive Display */}
          <HoloTilt3D className="lg:col-span-8" intensity={6} glareOpacity={0.2}>
            <CardSpotlight radius={380} color="rgba(158, 216, 255, 0.12)" className="p-6 sm:p-8 h-full border border-white/10">
              <AnimatePresence mode="wait">
              <motion.div
                key={selectedVenture.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                style={{ transformStyle: "preserve-3d" }}
                className="space-y-6"
              >
                {/* Header */}
                <div style={{ transformStyle: "preserve-3d" }} className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-5">
                  <div style={{ transform: "translateZ(24px)" }}>
                    <span className="rounded-full border border-[#9ed8ff]/30 bg-[#9ed8ff]/10 px-3 py-1 font-mono text-xs text-[#9ed8ff]">
                      {selectedVenture.category}
                    </span>
                    <h3 className="font-mono text-2xl font-bold uppercase tracking-wider text-white mt-3">
                      {selectedVenture.title}
                    </h3>
                  </div>

                  {selectedVenture.liveUrl && (
                    <a
                      style={{ transform: "translateZ(26px)" }}
                      href={selectedVenture.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-[#9ed8ff]/50 bg-[#9ed8ff]/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-[#9ed8ff] transition-all hover:bg-[#9ed8ff]/20 hover:shadow-[0_0_15px_rgba(158,216,255,0.3)]"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Launch Live Software
                    </a>
                  )}
                </div>

                {/* Description */}
                <p style={{ transform: "translateZ(14px)" }} className="text-sm leading-relaxed text-white/80">
                  {selectedVenture.description}
                </p>

                {/* Impact Metrics */}
                <div style={{ transformStyle: "preserve-3d" }} className="grid grid-cols-3 gap-3">
                  {selectedVenture.impactMetrics.map((m) => (
                    <div
                      key={m.label}
                      style={{ transform: "translateZ(18px)" }}
                      className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center transition-transform duration-300 hover:border-[#9ed8ff]/40"
                    >
                      <div className="font-display text-base font-bold text-[#cfae6e]">{m.value}</div>
                      <div className="font-mono text-[9px] uppercase tracking-wider text-white/40 mt-1">{m.label}</div>
                    </div>
                  ))}
                </div>

                {/* Architecture Highlights */}
                <div>
                  <h4 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#9ed8ff] mb-3">
                    <Layers className="h-4 w-4 text-[#9ed8ff]" />
                    Architectural Highlights &amp; Pipelines
                  </h4>
                  <ul className="space-y-2">
                    {selectedVenture.architecture.map((arch) => (
                      <li key={arch} className="flex items-start gap-2.5 text-xs text-white/70 font-mono">
                        <span className="text-[#9ed8ff] mt-0.5 shrink-0">▸</span>
                        <span>{arch}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack */}
                <div className="border-t border-white/5 pt-5">
                  <div className="flex flex-wrap gap-2">
                    {selectedVenture.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-white/90"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
              </AnimatePresence>
            </CardSpotlight>
          </HoloTilt3D>
        </div>
      </div>
    </section>
  );
}
