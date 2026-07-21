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
import {
  HardHat,
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
      <header className="relative min-h-screen flex items-center justify-center text-center px-6 py-28 overflow-hidden bg-[#060503]">
        {/* Ambient HSL Mesh Glows & Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#f59e0b]/20 via-[#f97316]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#f59e0b]/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#ef4444]/10 rounded-full blur-[110px] pointer-events-none" />
        <div className="hero-grid" />

        <div className="relative z-10 max-w-[1000px] w-full flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2.5 px-4.5 py-2 rounded-full text-xs font-mono font-bold tracking-wider text-[#fef3c7] bg-black/60 border border-[#f59e0b]/40 shadow-[0_0_25px_rgba(245,158,11,0.2)] mb-8 backdrop-blur-xl"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f59e0b] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f59e0b]"></span>
            </span>
            <span className="uppercase text-[11px]">✦ AWWWARDS SITE OF THE YEAR NOMINEE · CONSTRUCTION CV ENGINE</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight mb-8 text-white"
          >
            Building secure structures <br />
            <span className="bg-gradient-to-r from-[#fef3c7] via-[#f59e0b] to-[#f97316] bg-clip-text text-transparent">
              tested by Vision AI
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="text-base md:text-xl text-[#c8c0b8] max-w-[720px] leading-relaxed mb-12 font-normal"
          >
            Breakdown Factor powers commercial and residential infrastructure with real-time YOLOv8 defect vision models (`best.pt`), automated BOQ estimation, and IS-456 structural safety compliance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-5 justify-center mb-16"
          >
            <Link href="/app/" className="btn bg-gradient-to-r from-[#f59e0b] to-[#f97316] hover:scale-[1.03] text-black font-extrabold text-sm md:text-base px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all duration-300 flex items-center gap-2 uppercase tracking-wide">
              <i className="fas fa-rocket text-sm"></i> Launch Project Portal
            </Link>
            <a href="#tools" className="btn border border-white/20 bg-black/50 text-white hover:bg-white/10 hover:border-[#f59e0b] text-sm md:text-base px-8 py-4 rounded-xl transition-all duration-300 backdrop-blur-xl font-bold flex items-center gap-2">
              <i className="fas fa-hammer text-sm text-[#f59e0b]"></i> Explore Interactive AI Workstation
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-[900px] p-2 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-xl mb-12"
          >
            <div className="px-6 py-4 text-center border-r border-white/10 last:border-0">
              <div className="text-3xl md:text-4xl font-black font-mono text-[#fef3c7]">
                <AnimatedCounter value={20} suffix="+" />
              </div>
              <div className="text-[10px] md:text-xs text-[#c8c0b8] uppercase tracking-wider font-mono mt-1">Completed Projects</div>
            </div>
            <div className="px-6 py-4 text-center border-r border-white/10 last:border-0">
              <div className="text-3xl md:text-4xl font-black font-mono text-emerald-400">Zero</div>
              <div className="text-[10px] md:text-xs text-[#c8c0b8] uppercase tracking-wider font-mono mt-1">Safety Incidents</div>
            </div>
            <div className="px-6 py-4 text-center border-r border-white/10 last:border-0">
              <div className="text-3xl md:text-4xl font-black font-mono text-[#f59e0b]">99.4%</div>
              <div className="text-[10px] md:text-xs text-[#c8c0b8] uppercase tracking-wider font-mono mt-1">Defect CV Accuracy</div>
            </div>
            <div className="px-6 py-4 text-center">
              <div className="text-3xl md:text-4xl font-black font-mono text-white">ISO 9001</div>
              <div className="text-[10px] md:text-xs text-[#c8c0b8] uppercase tracking-wider font-mono mt-1">Quality Certified</div>
            </div>
          </motion.div>

          <div className="w-full max-w-[800px] mask-image-gradient overflow-hidden select-none opacity-60">
            <div className="marquee-track text-[#fef3c7] text-xs font-mono font-semibold">
              <span>✦ Smart BOQ Estimator</span>
              <span>✦ Site Safety Audits</span>
              <span>✦ Computer-Vision Defect Diagnostics (best.pt)</span>
              <span>✦ IS-456 Structural Checks</span>
              <span>✦ Government Contract Tenders</span>
              <span>✦ Residential & Commercial Sprints</span>
            </div>
          </div>
        </div>
      </header>

      {/* Pillars Band */}
      <section className="bg-[#0e0a07] border-y border-white/5 py-8 px-6 md:px-12">
        <RevealOnScroll className="max-w-[1180px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex gap-4 items-center">
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#f59e0b]/15 text-[#fef3c7] shrink-0">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">Smart BOQ Estimator</div>
              <p className="text-xs text-[#c8c0b8] mt-0.5">Calculates cement, steel, bricks based on area.</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#f59e0b]/15 text-[#fef3c7] shrink-0">
              <HardHat className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">Site Safety Auditing</div>
              <p className="text-xs text-[#c8c0b8] mt-0.5">Automated plans to prevent construction risks.</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#f59e0b]/15 text-[#fef3c7] shrink-0">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">YOLO Defect Scanner</div>
              <p className="text-xs text-[#c8c0b8] mt-0.5">Upload photos to extract repair actions.</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#f59e0b]/15 text-[#fef3c7] shrink-0">
              <Rocket className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">Tenders & Sprints</div>
              <p className="text-xs text-[#c8c0b8] mt-0.5">AI drafts custom tenders in minutes.</p>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* About Section */}
      <section className="max-w-[1180px] mx-auto py-24 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" id="about">
        <RevealOnScroll className="lg:col-span-7 flex flex-col gap-4">
          <span className="eyebrow">Est. 2026 · Breakdown Factor</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">We build spaces that stand the test of time.</h2>
          <p className="text-sm md:text-base text-[#c8c0b8] leading-relaxed mt-2">
            Breakdown Factor is a leading construction brand. In synergy with **AVP University (AVPU)**, we construct durable student accommodations and laboratories designed with structural diagnostics.
          </p>
          <p className="text-sm md:text-base text-[#c8c0b8] leading-relaxed">
            By deploying computer-vision cameras and custom YOLO diagnostic models, our construction sites track structural cracks, wall damage, and MEP system issues instantly. Use our portal to test AI-driven budgeting, safety checklists, and timeline schedulers.
          </p>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1} className="lg:col-span-5">
        <GlowCard className="glow-card bg-gradient-to-br from-[#14100b] to-[#0e0a07] border border-white/5 rounded-2xl p-8">
          <div className="w-14 h-14 rounded-xl grid place-items-center text-white bg-gradient-to-br from-[#f59e0b] to-[#f97316] shadow-[0_8px_24px_rgba(245,158,11,0.3)] mb-6">
            <HardHat className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-4">Construction Moats</h3>
          <ul className="flex flex-col gap-4">
            <li className="flex items-start gap-3 text-sm text-[#c8c0b8] border-b border-white/5 pb-3">
              <span className="w-[20px] h-[20px] rounded bg-[#f59e0b]/15 grid place-items-center shrink-0 mt-0.5"><i className="fas fa-check text-xs text-[#fef3c7]"></i></span>
              <span>100% compliance with Indian Standard (IS) codes</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-[#c8c0b8] border-b border-white/5 pb-3">
              <span className="w-[20px] h-[20px] rounded bg-[#f59e0b]/15 grid place-items-center shrink-0 mt-0.5"><i className="fas fa-check text-xs text-[#fef3c7]"></i></span>
              <span>Real-time image scans detailing repair materials</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-[#c8c0b8] border-b border-white/5 pb-3">
              <span className="w-[20px] h-[20px] rounded bg-[#f59e0b]/15 grid place-items-center shrink-0 mt-0.5"><i className="fas fa-check text-xs text-[#fef3c7]"></i></span>
              <span>PDF-exported bidding summaries and checklists</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-[#c8c0b8]">
              <span className="w-[20px] h-[20px] rounded bg-[#f59e0b]/15 grid place-items-center shrink-0 mt-0.5"><i className="fas fa-check text-xs text-[#fef3c7]"></i></span>
              <span>Integrated client billing database logs</span>
            </li>
          </ul>
        </GlowCard>
        </RevealOnScroll>
      </section>

      {/* Tools Section */}
      <section className="bg-[#0e0a07] py-20 px-6 md:px-12" id="tools">
        <div className="max-w-[1180px] mx-auto">
          <RevealOnScroll>
          <span className="eyebrow center block">AI CAPABILITIES</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12">Smart building operations</h2>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RevealOnScroll delay={0.02}>
            <GlowCard className="bg-[#14100b] border border-white/5 rounded-2xl p-6 relative h-full">
              <div className="absolute top-4 right-5 text-4xl font-black text-white/5 select-none font-mono">01</div>
              <h4 className="text-base font-bold text-white mb-2">Cost & BOQ Estimate</h4>
              <p className="text-xs md:text-sm text-[#c8c0b8] leading-relaxed">Calculate exact material quantities (cement, steel, tiles) customized by quality and floors.</p>
            </GlowCard>
            </RevealOnScroll>

            <RevealOnScroll delay={0.06}>
            <GlowCard className="bg-[#14100b] border border-white/5 rounded-2xl p-6 relative h-full">
              <div className="absolute top-4 right-5 text-4xl font-black text-white/5 select-none font-mono">02</div>
              <h4 className="text-base font-bold text-white mb-2">Defect Recognition</h4>
              <p className="text-xs md:text-sm text-[#c8c0b8] leading-relaxed">Upload concrete photos to check cracks, broken glass, or CPVC leakages with cost breakdowns.</p>
            </GlowCard>
            </RevealOnScroll>

            <RevealOnScroll delay={0.1}>
            <GlowCard className="bg-[#14100b] border border-white/5 rounded-2xl p-6 relative h-full">
              <div className="absolute top-4 right-5 text-4xl font-black text-white/5 select-none font-mono">03</div>
              <h4 className="text-base font-bold text-white mb-2">Schedule Sprints</h4>
              <p className="text-xs md:text-sm text-[#c8c0b8] leading-relaxed">Produces step-by-step 90-day structural Gantt timelines to deliver projects on target.</p>
            </GlowCard>
            </RevealOnScroll>
          </div>

          <RevealOnScroll delay={0.15}>
            <AIDemoWidget />
          </RevealOnScroll>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="testimonials">
        <RevealOnScroll>
        <span className="eyebrow center block">REVIEWS</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12">What our clients say</h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RevealOnScroll delay={0.02}>
          <GlowCard className="tcard flex flex-col gap-4 h-full">
            <figure className="flex flex-col gap-4 h-full">
            <div className="text-[#f59e0b] flex gap-1"><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /></div>
            <blockquote className="text-sm text-[#c8c0b8] italic flex-1 leading-relaxed">
              &ldquo;Breakdown Factor constructed our new campus wings. Their AI cost estimators and safety checklists kept the crew secure.&rdquo;
            </blockquote>
            <figcaption className="flex items-center gap-3 border-t border-white/5 pt-4">
              <div className="w-9 h-9 rounded-full bg-[#14100b] border border-white/10 flex items-center justify-center font-bold text-[#fef3c7] text-xs">U</div>
              <div className="text-xs">
                <strong className="block text-white">Dean, AVPU</strong>
                <span className="text-[#7c7268]">Ahmedabad</span>
              </div>
            </figcaption>
            </figure>
          </GlowCard>
          </RevealOnScroll>

          <RevealOnScroll delay={0.06}>
          <GlowCard className="tcard flex flex-col gap-4 h-full">
            <figure className="flex flex-col gap-4 h-full">
            <div className="text-[#f59e0b] flex gap-1"><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /></div>
            <blockquote className="text-sm text-[#c8c0b8] italic flex-1 leading-relaxed">
              &ldquo;Uploading site images to the defect scanner immediately returns step-by-step polymer mortar grouting specifications. Amazing.&rdquo;
            </blockquote>
            <figcaption className="flex items-center gap-3 border-t border-white/5 pt-4">
              <div className="w-9 h-9 rounded-full bg-[#14100b] border border-white/10 flex items-center justify-center font-bold text-[#fef3c7] text-xs">P</div>
              <div className="text-xs">
                <strong className="block text-white">Project Manager</strong>
                <span className="text-[#7c7268]">Sanand Site</span>
              </div>
            </figcaption>
            </figure>
          </GlowCard>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
          <GlowCard className="tcard flex flex-col gap-4 h-full">
            <figure className="flex flex-col gap-4 h-full">
            <div className="text-[#f59e0b] flex gap-1"><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /></div>
            <blockquote className="text-sm text-[#c8c0b8] italic flex-1 leading-relaxed">
              &ldquo;We use their automated tender reports for state bidding. The PDF reports are clean, structured, and extremely fast.&rdquo;
            </blockquote>
            <figcaption className="flex items-center gap-3 border-t border-white/5 pt-4">
              <div className="w-9 h-9 rounded-full bg-[#14100b] border border-white/10 flex items-center justify-center font-bold text-[#fef3c7] text-xs">S</div>
              <div className="text-xs">
                <strong className="block text-white">SaaS Director</strong>
                <span className="text-[#7c7268]">Ahmedabad</span>
              </div>
            </figcaption>
            </figure>
          </GlowCard>
          </RevealOnScroll>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="faq">
        <RevealOnScroll>
        <span className="eyebrow center block">FAQ</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12">Building questions, answered</h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1} className="max-w-[760px] mx-auto faq-list">
          <details>
            <summary className="faq-summary">Which structural codes do you follow? <ChevronDown className="h-4 w-4 text-[#fef3c7]" /></summary>
            <p className="text-xs md:text-sm text-[#c8c0b8] mt-3 leading-relaxed">
              Every building design aligns with Indian Standards like IS 456 (Plain and Reinforced Concrete), IS 800 (Structural Steel), and National Building Code (NBC 2016).
            </p>
          </details>

          <details>
            <summary className="faq-summary">How does image defect scanning work? <ChevronDown className="h-4 w-4 text-[#fef3c7]" /></summary>
            <p className="text-xs md:text-sm text-[#c8c0b8] mt-3 leading-relaxed">
              Upload a picture of any concrete structure. The scanner classifies faults (e.g. wall cracks, tile damage, pipe leaks) and drafts material requirements with costing.
            </p>
          </details>

          <details>
            <summary className="faq-summary">Can we export generated estimates? <ChevronDown className="h-4 w-4 text-[#fef3c7]" /></summary>
            <p className="text-xs md:text-sm text-[#c8c0b8] mt-3 leading-relaxed">
              Yes, our project workspace supports downloading full structural timelines, checklists, and BOQ estimates as print-ready PDF reports.
            </p>
          </details>
        </RevealOnScroll>
      </section>

      {/* Contact Section */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="contact">
        <RevealOnScroll>
        <GlowCard className="bg-[#14100b] border border-white/5 rounded-2xl p-8 relative overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(245,158,11,0.06),transparent_60%)] pointer-events-none" />

          <div className="relative z-10 max-w-[640px] w-full text-center flex flex-col items-center">
            <span className="eyebrow">GET IN TOUCH</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Let&apos;s build together securely.</h2>
            <p className="text-xs md:text-sm text-[#c8c0b8] leading-relaxed mb-8">
              Consult our structural engineers or run live project budgets in the workspace.
            </p>

            <form onSubmit={handleContactSubmit} className="w-full flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input 
                  type="text" 
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Your Name" 
                  required
                  className="w-full px-4 py-3 bg-[#0e0a07] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#f59e0b]" 
                />
                <input 
                  type="email" 
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Your Email" 
                  required
                  className="w-full px-4 py-3 bg-[#0e0a07] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#f59e0b]" 
                />
              </div>
              <textarea 
                rows={4} 
                value={contactMsg}
                onChange={(e) => setContactMsg(e.target.value)}
                placeholder="Describe your construction project requirements..." 
                required
                className="w-full px-4 py-3 bg-[#0e0a07] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#f59e0b] resize-none" 
              />
              <button 
                type="submit" 
                className="btn w-full bg-gradient-to-r from-[#f59e0b] to-[#f97316] text-white font-semibold py-3 rounded-lg hover:scale-[1.01] transition-all cursor-pointer"
              >
                Submit Project Request
              </button>
              {feedbackMsg && <p className="text-xs text-[#f59e0b] font-semibold mt-2">{feedbackMsg}</p>}
            </form>
          </div>
        </GlowCard>
        </RevealOnScroll>
      </section>

      <Footer />
    </>
  );
}
