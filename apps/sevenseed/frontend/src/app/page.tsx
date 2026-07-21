"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { GlowCard } from "@/components/GlowCard";
import { AIDemoWidget } from "@/components/AIDemoWidget";
import { Testimonials } from "@/components/Testimonials";
import { apiFetch } from "@/lib/api";
import { CustomCursor } from "@/components/CustomCursor";
import {
  Leaf,
  Layers,
  Lightbulb,
  Rocket,
  Cpu,
  ChevronDown,
  Search,
  Star,
  Activity,
  Briefcase,
  ExternalLink
} from "lucide-react";

const HERO_STATS = [
  { value: 7, suffix: "", label: "Ventures Incubated" },
  { value: 1.5, prefix: "₹", suffix: "Cr+", decimals: 1, label: "Studio GMV" },
  { value: 2, suffix: " weeks", label: "MVP Sprint" },
  { value: 100, suffix: "%", label: "AI-Native" },
];

export default function Home() {
  const [scrollPct, setScrollPct] = useState(0);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [contactWebsite, setContactWebsite] = useState(""); // honeypot
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [feedbackOk, setFeedbackOk] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollPct(scrolled);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMsg("Sending message...");
    setFeedbackOk(true);
    try {
      const res = await apiFetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          subject: contactSubject,
          message: contactMsg,
          website: contactWebsite,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setFeedbackOk(false);
        setFeedbackMsg(data?.detail || "Could not send message. Please try again.");
        return;
      }
      setFeedbackOk(true);
      setFeedbackMsg("Thank you! Your message has been sent successfully.");
      setContactName("");
      setContactEmail("");
      setContactSubject("");
      setContactMsg("");
    } catch (err) {
      setFeedbackOk(false);
      setFeedbackMsg("Could not send message. Please try again.");
    }
  };

  return (
    <>
      <CustomCursor />
      <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />
      <Navbar />      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center text-center px-6 py-28 overflow-hidden bg-[#090710]">
        {/* Ambient Spectrum Mesh Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#8b5cf6]/20 via-[#10b981]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#8b5cf6]/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#6366f1]/10 rounded-full blur-[110px] pointer-events-none" />
        <div className="hero-grid" />

        <div className="relative z-10 max-w-[1000px] w-full flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2.5 px-4.5 py-2 rounded-full text-xs font-mono font-bold tracking-wider text-[#ddd6fe] bg-black/60 border border-[#8b5cf6]/40 shadow-[0_0_25px_rgba(139,92,246,0.2)] mb-8 backdrop-blur-xl"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8b5cf6] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8b5cf6]"></span>
            </span>
            <span className="uppercase text-[11px]">✦ AWWWARDS SITE OF THE YEAR NOMINEE · MULTI-AGENT STUDIO BACKBONE</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight mb-8 text-white"
          >
            We plant the seeds of <br />
            <span className="bg-gradient-to-r from-[#ddd6fe] via-[#8b5cf6] to-[#10b981] bg-clip-text text-transparent">
              AI-first unicorn startups
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="text-base md:text-xl text-[#9aa0b8] max-w-[720px] leading-relaxed mb-12 font-normal"
          >
            Sevenseed is a premier multi-agent AI startup studio. We ideate, incubate, and scale 8 autonomous enterprise AI ventures powered by a shared vector RAG & LLM backbone.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-5 justify-center mb-16"
          >
            <Link href="/app/" className="btn bg-gradient-to-r from-[#8b5cf6] to-[#10b981] hover:scale-[1.03] text-white font-extrabold text-sm md:text-base px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all duration-300 flex items-center gap-2 uppercase tracking-wide">
              <i className="fas fa-cubes text-sm"></i> Explore Venture Ecosystem
            </Link>
            <a href="#portfolio" className="btn border border-white/20 bg-black/50 text-white hover:bg-white/10 hover:border-[#8b5cf6] text-sm md:text-base px-8 py-4 rounded-xl transition-all duration-300 backdrop-blur-xl font-bold flex items-center gap-2">
              <i className="fas fa-microchip text-sm text-[#ddd6fe]"></i> View Studio Architecture
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-[900px] p-2 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-xl mb-12"
          >
            {HERO_STATS.map((stat, i) => (
              <div key={i} className="px-6 py-4 text-center border-r border-white/10 last:border-0">
                <div className="text-3xl md:text-4xl font-black font-mono text-[#ddd6fe]">
                  <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div className="text-[10px] md:text-xs text-[#9aa0b8] uppercase tracking-wider font-mono mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          <div className="w-full max-w-[800px] mask-image-gradient overflow-hidden select-none opacity-60">
            <div className="marquee-track text-[#ddd6fe] text-xs font-mono font-semibold">
              <span>✦ LangGraph Multi-Agent Orchestration</span>
              <span>✦ ChromaDB High-Density Vector Search</span>
              <span>✦ YOLOv8 Vision Inspection Engine (`best.pt`)</span>
              <span>✦ Groq LLaMA 3.3 70B Fast Inference</span>
              <span>✦ 8 Incubated Enterprise Ventures</span>
              <span>✦ 99.98% Global Uptime</span>
            </div>
          </div>
        </div>
      </header>

      {/* Pillars Band */}
      <section className="bg-[#0b0b12] border-y border-white/5 py-8 px-6 md:px-12">
        <RevealOnScroll className="max-w-[1180px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex gap-4 items-center">
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#8b5cf6]/15 text-[#ddd6fe] shrink-0">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">Venture Ideation</div>
              <p className="text-xs text-[#9aa0b8] mt-0.5">Scans pain points to ideate products.</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#8b5cf6]/15 text-[#ddd6fe] shrink-0">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">Shared Backbone</div>
              <p className="text-xs text-[#9aa0b8] mt-0.5">Shared vector stores and models.</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#8b5cf6]/15 text-[#ddd6fe] shrink-0">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">Incubation</div>
              <p className="text-xs text-[#9aa0b8] mt-0.5">2-week sprints to build working MVPs.</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#8b5cf6]/15 text-[#ddd6fe] shrink-0">
              <Rocket className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">Scale & Launch</div>
              <p className="text-xs text-[#9aa0b8] mt-0.5">Dockerized deployments on Render.</p>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* AI Stack Strip */}
      <section className="py-6 px-6 md:px-12 border-b border-white/5 text-center">
        <span className="text-xs font-bold tracking-wider text-[#9aa0b8] uppercase inline-flex items-center gap-2 mb-3">
          <i className="fas fa-bolt text-[#ddd6fe]"></i> Powered by a shared production-grade AI stack
        </span>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {["Venture Analyzer Agent", "Groq LLaMA 3.3 70B", "Studio Knowledge RAG", "ChromaDB Shared Vector Base", "FastAPI Core Gateway", "Docker Single-Container Builds", "Venture Growth Models"].map(stack => (
            <span key={stack} className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#eeeef8] bg-[#12121e] border border-white/5 px-3 py-1.5 rounded-lg">
              <Cpu className="h-3 w-3 text-[#ddd6fe]" /> {stack}
            </span>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-[1180px] mx-auto py-24 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" id="about">
        <RevealOnScroll className="lg:col-span-7 flex flex-col gap-4">
          <span className="eyebrow">Est. 2026 · Startup Studio Hub</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">We build and scale AI-native SaaS companies.</h2>
          <p className="text-sm md:text-base text-[#9aa0b8] leading-relaxed mt-2">
            Sevenseed is an AI Venture Studio based in Ahmedabad. We don&apos;t just fund startups; we write their code, design their AI multi-agent workflows, and deploy their containers. Every startup we launch shares a central RAG database architecture and LLM gateway.
          </p>
          <p className="text-sm md:text-base text-[#9aa0b8] leading-relaxed">
            By building on top of pre-integrated stacks, we cut average development time down from 6 months to 2 weeks. Check our active ventures below or pitch your idea to receive instant automated AI feedback.
          </p>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1} className="lg:col-span-5">
        <GlowCard className="glow-card bg-gradient-to-br from-[#12121e] to-[#0d0d16] border border-white/5 rounded-2xl p-8">
          <div className="w-14 h-14 rounded-xl grid place-items-center text-white bg-gradient-to-br from-[#8b5cf6] to-[#10b981] shadow-[0_8px_24px_rgba(139,92,246,0.3)] mb-6">
            <Leaf className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-4">Why Sevenseed?</h3>
          <ul className="flex flex-col gap-4">
            <li className="flex items-start gap-3 text-sm text-[#9aa0b8] border-b border-white/5 pb-3">
              <span className="w-[20px] h-[20px] rounded bg-[#8b5cf6]/15 grid place-items-center shrink-0 mt-0.5"><i className="fas fa-check text-xs text-[#ddd6fe]"></i></span>
              <span>Fastest build time via shared vector database</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-[#9aa0b8] border-b border-white/5 pb-3">
              <span className="w-[20px] h-[20px] rounded bg-[#8b5cf6]/15 grid place-items-center shrink-0 mt-0.5"><i className="fas fa-check text-xs text-[#ddd6fe]"></i></span>
              <span>Interactive RAG search over studio guidelines</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-[#9aa0b8] border-b border-white/5 pb-3">
              <span className="w-[20px] h-[20px] rounded bg-[#8b5cf6]/15 grid place-items-center shrink-0 mt-0.5"><i className="fas fa-check text-xs text-[#ddd6fe]"></i></span>
              <span>AI venture generator drafting full pitch ideas</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-[#9aa0b8]">
              <span className="w-[20px] h-[20px] rounded bg-[#8b5cf6]/15 grid place-items-center shrink-0 mt-0.5"><i className="fas fa-check text-xs text-[#ddd6fe]"></i></span>
              <span>Live portfolio tracking and developer pipelines</span>
            </li>
          </ul>
        </GlowCard>
        </RevealOnScroll>
      </section>

      {/* Startups Portfolio */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="portfolio">
        <RevealOnScroll>
        <span className="eyebrow center block">STARTUPS PORTFOLIO</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12">Startups we have launched</h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RevealOnScroll delay={0.02}>
          <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 hover:border-[#8b5cf6]/50 transition-all flex flex-col h-full">
            <span className="text-[10px] text-[#8b5cf6] font-mono font-bold tracking-wider uppercase">Live · B2B</span>
            <h4 className="text-base font-bold text-white mt-1">Comonk Technology</h4>
            <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mt-2 mb-6 flex-1">
              Enterprise AI career platform — multi-agent counselors, ATS optimizer, mock interviews.
            </p>
            <Link href="/comonk-ai" className="text-xs text-[#6ee7b7] font-semibold flex items-center gap-1.5 w-fit hover:underline">
              Launch App <ExternalLink className="h-3 w-3" />
            </Link>
          </GlowCard>
          </RevealOnScroll>

          <RevealOnScroll delay={0.06}>
          <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 hover:border-[#8b5cf6]/50 transition-all flex flex-col h-full">
            <span className="text-[10px] text-[#3b82f6] font-mono font-bold tracking-wider uppercase">Live · EdTech</span>
            <h4 className="text-base font-bold text-white mt-1">AVP University (AVPU)</h4>
            <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mt-2 mb-6 flex-1">
              AI-powered digital learning — personal AI tutor, adaptive assessments, placement matcher.
            </p>
            <Link href="/avpu" className="text-xs text-[#6ee7b7] font-semibold flex items-center gap-1.5 w-fit hover:underline">
              Launch App <ExternalLink className="h-3 w-3" />
            </Link>
          </GlowCard>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
          <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 hover:border-[#8b5cf6]/50 transition-all flex flex-col h-full">
            <span className="text-[10px] text-[#10b981] font-mono font-bold tracking-wider uppercase">Live · HealthTech</span>
            <h4 className="text-base font-bold text-white mt-1">Decode Forest Pharmacy</h4>
            <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mt-2 mb-6 flex-1">
              AI pharmacy — OCR prescription reader, drug compatibility check, refill tracker.
            </p>
            <Link href="/pharmacy" className="text-xs text-[#6ee7b7] font-semibold flex items-center gap-1.5 w-fit hover:underline">
              Launch App <ExternalLink className="h-3 w-3" />
            </Link>
          </GlowCard>
          </RevealOnScroll>

          <RevealOnScroll delay={0.02}>
          <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 hover:border-[#8b5cf6]/50 transition-all flex flex-col h-full">
            <span className="text-[10px] text-[#f59e0b] font-mono font-bold tracking-wider uppercase">Live · ConTech</span>
            <h4 className="text-base font-bold text-white mt-1">Breakdown Factor</h4>
            <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mt-2 mb-6 flex-1">
              AI-driven construction — site safety monitors, cost predictors, structural crack defect detectors.
            </p>
            <Link href="/breakdown" className="text-xs text-[#6ee7b7] font-semibold flex items-center gap-1.5 w-fit hover:underline">
              Launch App <ExternalLink className="h-3 w-3" />
            </Link>
          </GlowCard>
          </RevealOnScroll>

          <RevealOnScroll delay={0.06}>
          <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 hover:border-[#8b5cf6]/50 transition-all flex flex-col h-full">
            <span className="text-[10px] text-[#ec4899] font-mono font-bold tracking-wider uppercase">Live · Impact</span>
            <h4 className="text-base font-bold text-white mt-1">AVP Charitable Trust</h4>
            <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mt-2 mb-6 flex-1">
              AI social impact — finds regional needs, matches beneficiaries, transparent reporting.
            </p>
            <Link href="/trust" className="text-xs text-[#6ee7b7] font-semibold flex items-center gap-1.5 w-fit hover:underline">
              Launch App <ExternalLink className="h-3 w-3" />
            </Link>
          </GlowCard>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
          <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 hover:border-[#8b5cf6]/50 transition-all flex flex-col h-full">
            <span className="text-[10px] text-[#f97316] font-mono font-bold tracking-wider uppercase">Live · E-Commerce</span>
            <h4 className="text-base font-bold text-white mt-1">AVP Emart</h4>
            <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mt-2 mb-6 flex-1">
              AI price comparison — compares live prices across 4 online stores, ML value scoring.
            </p>
            <Link href="/avp-emart" className="text-xs text-[#6ee7b7] font-semibold flex items-center gap-1.5 w-fit hover:underline">
              Launch App <ExternalLink className="h-3 w-3" />
            </Link>
          </GlowCard>
          </RevealOnScroll>

          <RevealOnScroll delay={0.14}>
          <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 hover:border-[#8b5cf6]/50 transition-all flex flex-col h-full">
            <span className="text-[10px] text-[#f43f5e] font-mono font-bold tracking-wider uppercase">Live · B2B</span>
            <h4 className="text-base font-bold text-white mt-1">Sevenforce</h4>
            <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mt-2 mb-6 flex-1">
              AI-driven sales CRM — automated lead scoring, speech sentiment analyzer, smart pipelines tracker.
            </p>
            <Link href="/sevenforce" className="text-xs text-[#6ee7b7] font-semibold flex items-center gap-1.5 w-fit hover:underline">
              Launch App <ExternalLink className="h-3 w-3" />
            </Link>
          </GlowCard>
          </RevealOnScroll>
        </div>
      </section>

      {/* Venture Ideation Band */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="ideate">
        <RevealOnScroll>
        <span className="eyebrow center block">STUDIO sandbox</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12">Venture Ideation & Incubation</h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RevealOnScroll delay={0.02}>
          <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 relative h-full">
            <div className="absolute top-4 right-5 text-4xl font-black text-white/5 select-none font-mono">01</div>
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#8b5cf6]/10 text-[#ddd6fe] mb-4 font-bold text-sm">
              I
            </div>
            <h4 className="text-sm font-bold text-white mb-2">Ideation Sandbox</h4>
            <p className="text-xs text-[#9aa0b8] leading-relaxed">Enter your business domain & problem below and try a real AI-generated venture concept — no signup needed.</p>
          </GlowCard>
          </RevealOnScroll>

          <RevealOnScroll delay={0.06}>
          <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 relative h-full">
            <div className="absolute top-4 right-5 text-4xl font-black text-white/5 select-none font-mono">02</div>
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#10b981]/10 text-[#6ee7b7] mb-4 font-bold text-sm">
              II
            </div>
            <h4 className="text-sm font-bold text-white mb-2">Technical Feasibility</h4>
            <p className="text-xs text-[#9aa0b8] leading-relaxed">AI analyzes integration Moat, outlines exact model architecture and training strategies.</p>
          </GlowCard>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
          <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 relative h-full">
            <div className="absolute top-4 right-5 text-4xl font-black text-white/5 select-none font-mono">03</div>
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#8b5cf6]/10 text-[#ddd6fe] mb-4 font-bold text-sm">
              III
            </div>
            <h4 className="text-sm font-bold text-white mb-2">90-Day MVP Plan</h4>
            <p className="text-xs text-[#9aa0b8] leading-relaxed">Studio framework exports step-by-step sprint guidelines to ship your SaaS product quickly.</p>
          </GlowCard>
          </RevealOnScroll>
        </div>

        <RevealOnScroll delay={0.15}>
          <AIDemoWidget />
        </RevealOnScroll>
      </section>

      {/* Testimonials */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="testimonials">
        <RevealOnScroll>
        <span className="eyebrow center block">REVIEWS</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12">What our partners say</h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <Testimonials />
        </RevealOnScroll>
      </section>

      {/* FAQ */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="faq">
        <RevealOnScroll>
        <span className="eyebrow center block">FAQ</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12">Studio questions, answered</h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1} className="max-w-[760px] mx-auto faq-list">
          <details>
            <summary className="faq-summary">What is a venture studio? <ChevronDown className="h-4 w-4 text-[#ddd6fe]" /></summary>
            <p className="text-xs md:text-sm text-[#9aa0b8] mt-3 leading-relaxed">
              Unlike typical accelerators or VC funds, a venture studio builds companies from scratch. We write the software, design the product, and deploy backend containers.
            </p>
          </details>

          <details>
            <summary className="faq-summary">How does the shared AI stack help? <ChevronDown className="h-4 w-4 text-[#ddd6fe]" /></summary>
            <p className="text-xs md:text-sm text-[#9aa0b8] mt-3 leading-relaxed">
              Every venture is built on top of pre-integrated LangGraph agent templates, FastAPI backend structures, and local SQLite data logging helpers. This means codebases are ready in days.
            </p>
          </details>

          <details>
            <summary className="faq-summary">How can I pitch my startup idea? <ChevronDown className="h-4 w-4 text-[#ddd6fe]" /></summary>
            <p className="text-xs md:text-sm text-[#9aa0b8] mt-3 leading-relaxed">
              Use our AI Venture Ideator sandbox in the portal to evaluate domain viability and draft 3 structured SaaS pitches. You can save your pitches to our studio database.
            </p>
          </details>

          <details>
            <summary className="faq-summary">Where are you located? <ChevronDown className="h-4 w-4 text-[#ddd6fe]" /></summary>
            <p className="text-xs md:text-sm text-[#9aa0b8] mt-3 leading-relaxed">
              We are based in Ahmedabad, Gujarat, India.
            </p>
          </details>
        </RevealOnScroll>
      </section>

      {/* Contact Section */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="contact">
        <RevealOnScroll>
        <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-8 relative overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(139,92,246,0.1),transparent_60%)] pointer-events-none" />

          <div className="relative z-10 max-w-[640px] w-full text-center flex flex-col items-center">
            <span className="eyebrow">GET IN TOUCH</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Build the next AI giant with us.</h2>
            <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mb-8">
              Access automatic venture ideators, pitch drafts checkers, and founder counseling helpers. Let&apos;s build together.
            </p>

            <form onSubmit={handleContactSubmit} className="w-full flex flex-col gap-3">
              {/* Honeypot — hidden from real users, bots tend to fill every field */}
              <input
                type="text"
                value={contactWebsite}
                onChange={(e) => setContactWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] w-px h-px opacity-0"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Your Name"
                  required
                  className="w-full px-4 py-3 bg-[#0d0d16] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#8b5cf6]"
                />
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Your Email"
                  required
                  className="w-full px-4 py-3 bg-[#0d0d16] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#8b5cf6]"
                />
              </div>
              <input
                type="text"
                value={contactSubject}
                onChange={(e) => setContactSubject(e.target.value)}
                placeholder="Subject"
                required
                className="w-full px-4 py-3 bg-[#0d0d16] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#8b5cf6]"
              />
              <textarea
                rows={4}
                value={contactMsg}
                onChange={(e) => setContactMsg(e.target.value)}
                placeholder="Tell us about your venture idea..."
                required
                className="w-full px-4 py-3 bg-[#0d0d16] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#8b5cf6] resize-none"
              />
              <button
                type="submit"
                className="btn w-full bg-gradient-to-r from-[#8b5cf6] to-[#10b981] text-white font-semibold py-3 rounded-lg hover:scale-[1.01] transition-all cursor-pointer"
              >
                Send Message
              </button>
              {feedbackMsg && (
                <p className={`text-xs font-semibold mt-2 ${feedbackOk ? "text-[#6ee7b7]" : "text-[#fca5a5]"}`}>
                  {feedbackMsg}
                </p>
              )}
            </form>
          </div>
        </GlowCard>
        </RevealOnScroll>
      </section>

      <Footer />
    </>
  );
}
