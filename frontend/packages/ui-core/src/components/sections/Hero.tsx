"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  ArrowRight,
  Download,
  Mail,
  Sparkles,
  Command,
  Copy,
  Check,
  Cpu,
  Bot,
  Terminal as TerminalIcon,
  Layers,
} from "lucide-react";
import { profile, resumeAction } from "../../lib/data";
import { AnimatedBackground } from "../backgrounds";
import {
  CyberButton,
  AnimatedCounter,
  TextScramble,
  Typewriter,
  SystemTelemetryHUD,
  CardSpotlight,
} from "../ui";
import { Magnetic } from "../motion";
import { sound } from "../../lib/sound";

// Dynamically import the Spline-grade Three.js WebGL 3D Quantum Core
const QuantumCore3DWebGL = dynamic(
  () =>
    import("../3d/QuantumCore3DWebGL").then(
      (mod) => mod.QuantumCore3DWebGL
    ),
  {
    ssr: false,
    loading: () => (
      <div className="relative flex h-[480px] w-full max-w-[460px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-[#080a0f]/80 p-6 backdrop-blur-xl">
        <div className="relative flex h-24 w-24 items-center justify-center">
          <div className="absolute h-full w-full animate-ping rounded-full bg-[#9ed8ff]/20" />
          <div className="h-16 w-16 animate-spin rounded-full border-2 border-[#9ed8ff]/20 border-t-[#9ed8ff]" />
          <Sparkles className="absolute h-6 w-6 text-[#9ed8ff]" />
        </div>
        <p className="mt-4 font-mono text-xs text-[#9ed8ff] tracking-widest uppercase">
          Initializing WebGL 3D Core...
        </p>
      </div>
    ),
  }
);

export function Hero() {
  const resume = resumeAction();

  const roles = [
    "AI & Multi-Agent Systems Engineer",
    "FastAPI & LLM Backend Architect",
    "YOLOv8 & Real-Time Vision Specialist",
    "Autonomous Enterprise Automation",
    "Data Scientist & AI Practitioner",
  ];

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center pt-28 pb-16 bg-[#050505] overflow-hidden"
    >
      {/* 1. Unicorn Studio & Aceternity Cinematic Background */}
      <AnimatedBackground />

      <div className="container-px relative z-10 w-full">
        {/* 2. Aura.build & 21st.dev System Telemetry HUD */}
        <div data-blur-in="subtle" className="mb-8 w-full">
          <SystemTelemetryHUD />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <span data-blur-in="subtle" className="eyebrow">
              <Sparkles className="h-3.5 w-3.5 text-[#9ed8ff]" />
              AI Engineer &amp; Automation Architect
            </span>

            {/* Headline with High-End Cyber Styling */}
            <h1
              data-blur-in="strong"
              className="font-display mt-4 text-4xl font-bold leading-none tracking-widest sm:text-6xl md:text-7xl text-white uppercase"
            >
              <TextScramble text={profile.name} />
            </h1>

            {/* Dynamic Typewriter Sub-headline */}
            <p
              data-blur-in
              className="mt-5 flex items-center gap-2 font-mono text-sm tracking-widest text-[#9ed8ff] uppercase"
            >
              <span className="text-[#cfae6e]">{"//"}</span>
              <Typewriter words={roles} />
            </p>

            <p
              data-blur-in="subtle"
              className="mt-6 max-w-2xl text-sm sm:text-base leading-relaxed text-muted font-normal"
            >
              {profile.subtitle}
            </p>

            {/* Action CTAs with Magnetic Physics & Haptic Sound */}
            <div data-blur-in className="mt-8 flex flex-wrap gap-4">
              <Magnetic>
                <CyberButton href="#ventures" icon={Layers}>
                  Explore Ventures
                </CyberButton>
              </Magnetic>
              <Magnetic>
                <CyberButton href="#projects" icon={ArrowRight}>
                  View Projects
                </CyberButton>
              </Magnetic>
              <Magnetic>
                <CyberButton
                  href={resume.href}
                  external={resume.external}
                  icon={Download}
                >
                  {resume.label}
                </CyberButton>
              </Magnetic>
              <Magnetic>
                <CyberButton href="#ats-matcher" icon={Sparkles}>
                  ATS Matcher
                </CyberButton>
              </Magnetic>
            </div>

            {/* Social Links Bar */}
            <div
              data-blur-in="subtle"
              className="mt-8 flex flex-wrap items-center gap-3 font-mono text-xs text-white/70"
            >
              <span className="text-muted uppercase text-[10px] tracking-widest mr-2">
                // CONNECT:
              </span>
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="group flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 transition-all hover:border-[#9ed8ff]/50 hover:bg-[#9ed8ff]/10 hover:text-white"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 group-hover:animate-ping" />
                <span>GitHub</span>
              </a>
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="group flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 transition-all hover:border-[#9ed8ff]/50 hover:bg-[#9ed8ff]/10 hover:text-white"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400 group-hover:animate-ping" />
                <span>LinkedIn</span>
              </a>
              <a
                href={profile.socials.huggingface}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="group flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 transition-all hover:border-[#9ed8ff]/50 hover:bg-[#9ed8ff]/10 hover:text-white"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 group-hover:animate-ping" />
                <span>HuggingFace</span>
              </a>
            </div>
          </div>

          {/* Right Column: Spline-Grade 3D Quantum Neural Core Centerpiece */}
          <div
            data-blur-in="strong"
            className="flex flex-col items-center justify-center relative my-4 lg:my-0 w-full"
          >
            <QuantumCore3DWebGL />
          </div>
        </div>

        {/* High-Impact Numerical Stats Grid wrapped in CardSpotlight */}
        <div
          data-blur-in="strong"
          className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/5 pt-8"
        >
          {profile.metrics.slice(0, 4).map((s) => (
            <CardSpotlight
              key={s.label}
              radius={220}
              color="rgba(158, 216, 255, 0.15)"
              className="p-4"
            >
              <div className="font-display text-2xl font-bold text-[#cfae6e] transition-colors duration-300">
                {s.value}
              </div>
              <div className="mt-1 text-[11px] font-semibold text-white/90 font-mono">
                {s.label}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-muted font-mono mt-0.5">
                {s.detail}
              </div>
            </CardSpotlight>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted hidden md:block">
        <div className="flex h-8 w-5 items-start justify-center rounded-full border border-white/10 p-1">
          <div className="h-1.5 w-1 rounded-full bg-[#9ed8ff] animate-bounce" />
        </div>
      </div>
    </section>
  );
}
