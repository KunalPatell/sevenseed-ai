"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
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

export default function Home() {
  const [scrollPct, setScrollPct] = useState(0);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");

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
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFeedbackMsg("Thank you! Your message has been sent successfully.");
      setContactName("");
      setContactEmail("");
      setContactSubject("");
      setContactMsg("");
    } catch (err) {
      setFeedbackMsg("Could not send message. Please try again.");
    }
  };

  return (
    <>
      <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />
      <Navbar />

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center text-center px-6 py-24 overflow-hidden bg-[#060609]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.18),transparent_60%)]" />
        <div className="hero-grid" />
        
        <div className="relative z-10 max-w-[900px] w-full flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-[#ddd6fe] bg-[#8b5cf6]/10 border border-[#8b5cf6]/25 mb-8">
            <Cpu className="h-3.5 w-3.5" />
            <span>AI Venture Ideation · Incubation Hub · Shared AI Backbone</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-6">
            We plant the seeds of <br /><span className="grad">AI-first startups</span>
          </h1>

          <p className="text-sm md:text-lg text-[#9aa0b8] max-w-[670px] leading-relaxed mb-10">
            Sevenseed is an AI startup studio. We ideate, incubate, and scale enterprise AI products using a shared vector RAG & LLM backend.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <Link href="/app/" className="btn bg-gradient-to-r from-[#8b5cf6] to-[#10b981] hover:scale-[1.02] text-white font-semibold text-sm md:text-base px-6 py-3 rounded-lg shadow-[0_6px_22px_rgba(139,92,246,0.3)] transition-all duration-200">
              <i className="fas fa-rocket mr-2"></i> Launch Studio Hub
            </Link>
            <a href="#portfolio" className="btn border border-white/15 bg-white/[0.03] text-white hover:bg-[#18182a] hover:border-[#8b5cf6]/50 text-sm md:text-base px-6 py-3 rounded-lg transition-all duration-200">
              <i className="fas fa-seedling mr-2"></i> View Startups Portfolio
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center bg-[#12121e]/60 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md mb-12">
            <div className="px-6 md:px-8 py-5 text-center min-w-[120px]">
              <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#ddd6fe] to-[#6ee7b7] bg-clip-text text-transparent">7</div>
              <div className="text-[10px] md:text-xs text-[#9aa0b8] uppercase tracking-wider font-semibold mt-1">Ventures Incubated</div>
            </div>
            <div className="w-[1px] self-stretch bg-white/5" />
            <div className="px-6 md:px-8 py-5 text-center min-w-[120px]">
              <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#ddd6fe] to-[#6ee7b7] bg-clip-text text-transparent">₹1.5Cr+</div>
              <div className="text-[10px] md:text-xs text-[#9aa0b8] uppercase tracking-wider font-semibold mt-1">Studio GMV</div>
            </div>
            <div className="w-[1px] self-stretch bg-white/5" />
            <div className="px-6 md:px-8 py-5 text-center min-w-[120px]">
              <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#ddd6fe] to-[#6ee7b7] bg-clip-text text-transparent">2 weeks</div>
              <div className="text-[10px] md:text-xs text-[#9aa0b8] uppercase tracking-wider font-semibold mt-1">MVP Sprint</div>
            </div>
            <div className="w-[1px] self-stretch bg-white/5" />
            <div className="px-6 md:px-8 py-5 text-center min-w-[120px]">
              <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#ddd6fe] to-[#6ee7b7] bg-clip-text text-transparent">100%</div>
              <div className="text-[10px] md:text-xs text-[#9aa0b8] uppercase tracking-wider font-semibold mt-1">AI-Native</div>
            </div>
          </div>

          <div className="w-full max-w-[760px] mask-image-gradient overflow-hidden select-none opacity-50">
            <div className="marquee-track text-[#5b5f78] text-xs font-mono font-semibold">
              <span>AI Startup Studio</span>
              <span>Venture Ideator</span>
              <span>Incubation Sandbox</span>
              <span>Shared AI Platform</span>
              <span>Comonk Technology</span>
              <span>AVP University</span>
              <span>AVP Emart</span>
              <span>Decode Forest Pharmacy</span>
              <span>Breakdown Factor</span>
              <span>AVP Charitable Trust</span>
            </div>
          </div>
        </div>
      </header>

      {/* Pillars Band */}
      <section className="bg-[#0b0b12] border-y border-white/5 py-8 px-6 md:px-12">
        <div className="max-w-[1180px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
        </div>
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
        <div className="lg:col-span-7 flex flex-col gap-4">
          <span className="eyebrow">Est. 2026 · Startup Studio Hub</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">We build and scale AI-native SaaS companies.</h2>
          <p className="text-sm md:text-base text-[#9aa0b8] leading-relaxed mt-2">
            Sevenseed is an AI Venture Studio based in Ahmedabad. We don&apos;t just fund startups; we write their code, design their AI multi-agent workflows, and deploy their containers. Every startup we launch shares a central RAG database architecture and LLM gateway.
          </p>
          <p className="text-sm md:text-base text-[#9aa0b8] leading-relaxed">
            By building on top of pre-integrated stacks, we cut average development time down from 6 months to 2 weeks. Check our active ventures below or pitch your idea to receive instant automated AI feedback.
          </p>
        </div>
        <div className="lg:col-span-5 glow-card bg-gradient-to-br from-[#12121e] to-[#0d0d16] border border-white/5 rounded-2xl p-8">
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
        </div>
      </section>

      {/* Startups Portfolio */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="portfolio">
        <span className="eyebrow center block">STARTUPS PORTFOLIO</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12">Startups we have launched</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#12121e] border border-white/5 rounded-2xl p-6 hover:border-[#8b5cf6]/50 transition-all flex flex-col">
            <span className="text-[10px] text-[#8b5cf6] font-mono font-bold tracking-wider uppercase">Live · B2B</span>
            <h4 className="text-base font-bold text-white mt-1">Comonk Technology</h4>
            <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mt-2 mb-6 flex-1">
              Enterprise AI career platform — multi-agent counselors, ATS optimizer, mock interviews.
            </p>
            <Link href="/comonk-ai" className="text-xs text-[#6ee7b7] font-semibold flex items-center gap-1.5 w-fit hover:underline">
              Launch App <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          <div className="bg-[#12121e] border border-white/5 rounded-2xl p-6 hover:border-[#8b5cf6]/50 transition-all flex flex-col">
            <span className="text-[10px] text-[#3b82f6] font-mono font-bold tracking-wider uppercase">Live · EdTech</span>
            <h4 className="text-base font-bold text-white mt-1">AVP University (AVPU)</h4>
            <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mt-2 mb-6 flex-1">
              AI-powered digital learning — personal AI tutor, adaptive assessments, placement matcher.
            </p>
            <Link href="/avpu" className="text-xs text-[#6ee7b7] font-semibold flex items-center gap-1.5 w-fit hover:underline">
              Launch App <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          <div className="bg-[#12121e] border border-white/5 rounded-2xl p-6 hover:border-[#8b5cf6]/50 transition-all flex flex-col">
            <span className="text-[10px] text-[#10b981] font-mono font-bold tracking-wider uppercase">Live · HealthTech</span>
            <h4 className="text-base font-bold text-white mt-1">Decode Forest Pharmacy</h4>
            <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mt-2 mb-6 flex-1">
              AI pharmacy — OCR prescription reader, drug compatibility check, refill tracker.
            </p>
            <Link href="/pharmacy" className="text-xs text-[#6ee7b7] font-semibold flex items-center gap-1.5 w-fit hover:underline">
              Launch App <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          <div className="bg-[#12121e] border border-white/5 rounded-2xl p-6 hover:border-[#8b5cf6]/50 transition-all flex flex-col">
            <span className="text-[10px] text-[#f59e0b] font-mono font-bold tracking-wider uppercase">Live · ConTech</span>
            <h4 className="text-base font-bold text-white mt-1">Breakdown Factor</h4>
            <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mt-2 mb-6 flex-1">
              AI-driven construction — site safety monitors, cost predictors, structural crack defect detectors.
            </p>
            <Link href="/breakdown" className="text-xs text-[#6ee7b7] font-semibold flex items-center gap-1.5 w-fit hover:underline">
              Launch App <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          <div className="bg-[#12121e] border border-white/5 rounded-2xl p-6 hover:border-[#8b5cf6]/50 transition-all flex flex-col">
            <span className="text-[10px] text-[#ec4899] font-mono font-bold tracking-wider uppercase">Live · Impact</span>
            <h4 className="text-base font-bold text-white mt-1">AVP Charitable Trust</h4>
            <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mt-2 mb-6 flex-1">
              AI social impact — finds regional needs, matches beneficiaries, transparent reporting.
            </p>
            <Link href="/trust" className="text-xs text-[#6ee7b7] font-semibold flex items-center gap-1.5 w-fit hover:underline">
              Launch App <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          <div className="bg-[#12121e] border border-white/5 rounded-2xl p-6 hover:border-[#8b5cf6]/50 transition-all flex flex-col">
            <span className="text-[10px] text-[#f97316] font-mono font-bold tracking-wider uppercase">Live · E-Commerce</span>
            <h4 className="text-base font-bold text-white mt-1">AVP Emart</h4>
            <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mt-2 mb-6 flex-1">
              AI price comparison — compares live prices across 4 online stores, ML value scoring.
            </p>
            <Link href="/avp-emart" className="text-xs text-[#6ee7b7] font-semibold flex items-center gap-1.5 w-fit hover:underline">
              Launch App <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          <div className="bg-[#12121e] border border-white/5 rounded-2xl p-6 hover:border-[#8b5cf6]/50 transition-all flex flex-col">
            <span className="text-[10px] text-[#f43f5e] font-mono font-bold tracking-wider uppercase">Live · B2B</span>
            <h4 className="text-base font-bold text-white mt-1">Sevenforce</h4>
            <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mt-2 mb-6 flex-1">
              AI-driven sales CRM — automated lead scoring, speech sentiment analyzer, smart pipelines tracker.
            </p>
            <Link href="/sevenforce" className="text-xs text-[#6ee7b7] font-semibold flex items-center gap-1.5 w-fit hover:underline">
              Launch App <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Venture Ideation Band */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="ideate">
        <span className="eyebrow center block">STUDIO sandbox</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12">Venture Ideation & Incubation</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#12121e] border border-white/5 rounded-2xl p-6 relative">
            <div className="absolute top-4 right-5 text-4xl font-black text-white/5 select-none font-mono">01</div>
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#8b5cf6]/10 text-[#ddd6fe] mb-4 font-bold text-sm">
              I
            </div>
            <h4 className="text-sm font-bold text-white mb-2">Ideation Sandbox</h4>
            <p className="text-xs text-[#9aa0b8] leading-relaxed">Enter your business domain & problem, and our generator will draft 3 distinct AI venture pitches.</p>
          </div>

          <div className="bg-[#12121e] border border-white/5 rounded-2xl p-6 relative">
            <div className="absolute top-4 right-5 text-4xl font-black text-white/5 select-none font-mono">02</div>
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#10b981]/10 text-[#6ee7b7] mb-4 font-bold text-sm">
              II
            </div>
            <h4 className="text-sm font-bold text-white mb-2">Technical Feasibility</h4>
            <p className="text-xs text-[#9aa0b8] leading-relaxed">AI analyzes integration Moat, outlines exact model architecture and training strategies.</p>
          </div>

          <div className="bg-[#12121e] border border-white/5 rounded-2xl p-6 relative">
            <div className="absolute top-4 right-5 text-4xl font-black text-white/5 select-none font-mono">03</div>
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#8b5cf6]/10 text-[#ddd6fe] mb-4 font-bold text-sm">
              III
            </div>
            <h4 className="text-sm font-bold text-white mb-2">90-Day MVP Plan</h4>
            <p className="text-xs text-[#9aa0b8] leading-relaxed">Studio framework exports step-by-step sprint guidelines to ship your SaaS product quickly.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="testimonials">
        <span className="eyebrow center block">REVIEWS</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12">What our partners say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <figure className="tcard flex flex-col gap-4">
            <div className="text-[#ddd6fe] flex gap-1"><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /></div>
            <blockquote className="text-sm text-[#9aa0b8] italic flex-1 leading-relaxed">
              &ldquo;The shared AI backend saved us months of coding. We shipped AVP Emart price comparators in less than two weeks.&rdquo;
            </blockquote>
            <figcaption className="flex items-center gap-3 border-t border-white/5 pt-4">
              <div className="w-9 h-9 rounded-full bg-[#12121e] border border-white/10 flex items-center justify-center font-bold text-[#ddd6fe] text-xs">V</div>
              <div className="text-xs">
                <strong className="block text-white">Venture Founder</strong>
                <span className="text-[#5b5f78]">Ahmedabad</span>
              </div>
            </figcaption>
          </figure>

          <figure className="tcard flex flex-col gap-4">
            <div className="text-[#ddd6fe] flex gap-1"><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /></div>
            <blockquote className="text-sm text-[#9aa0b8] italic flex-1 leading-relaxed">
              &ldquo;Ideating with Sevenseed sandbox drafted full architecture pitches. Moat and weekly sprint checklists are extremely clear.&rdquo;
            </blockquote>
            <figcaption className="flex items-center gap-3 border-t border-white/5 pt-4">
              <div className="w-9 h-9 rounded-full bg-[#12121e] border border-white/10 flex items-center justify-center font-bold text-[#ddd6fe] text-xs">A</div>
              <div className="text-xs">
                <strong className="block text-white">Incubated Partner</strong>
                <span className="text-[#5b5f78]">Sanand</span>
              </div>
            </figcaption>
          </figure>

          <figure className="tcard flex flex-col gap-4">
            <div className="text-[#ddd6fe] flex gap-1"><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /></div>
            <blockquote className="text-sm text-[#9aa0b8] italic flex-1 leading-relaxed">
              &ldquo;We share data vectors across companies. Recommenders can suggest campus pharmacy drugs directly to students.&rdquo;
            </blockquote>
            <figcaption className="flex items-center gap-3 border-t border-white/5 pt-4">
              <div className="w-9 h-9 rounded-full bg-[#12121e] border border-white/10 flex items-center justify-center font-bold text-[#ddd6fe] text-xs">M</div>
              <div className="text-xs">
                <strong className="block text-white">SaaS Developer</strong>
                <span className="text-[#5b5f78]">Ahmedabad</span>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="faq">
        <span className="eyebrow center block">FAQ</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12">Studio questions, answered</h2>
        
        <div className="max-w-[760px] mx-auto faq-list">
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
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="contact">
        <div className="bg-[#12121e] border border-white/5 rounded-2xl p-8 relative overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(139,92,246,0.1),transparent_60%)] pointer-events-none" />
          
          <div className="relative z-10 max-w-[640px] w-full text-center flex flex-col items-center">
            <span className="eyebrow">GET IN TOUCH</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Build the next AI giant with us.</h2>
            <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mb-8">
              Access automatic venture ideators, pitch drafts checkers, and founder counseling helpers. Let&apos;s build together.
            </p>

            <form onSubmit={handleContactSubmit} className="w-full flex flex-col gap-3">
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
              {feedbackMsg && <p className="text-xs text-[#6ee7b7] font-semibold mt-2">{feedbackMsg}</p>}
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
