"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PersonaAvatar } from "@/components/PersonaAvatar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { GlowCard } from "@/components/GlowCard";
import { AIDemoWidget } from "@/components/AIDemoWidget";
import { CustomCursor } from "@/components/CustomCursor";
import { StarCanvas } from "@/components/StarCanvas";
import { TextScramble } from "@/components/TextScramble";
import { Tilt } from "@/components/Tilt";
import { submitContact, type ContactStatus } from "@/lib/contact";
import {
  Rocket, Layers, Cpu,
  ChevronDown, ArrowRight, ExternalLink,
  HardHat, HeartPulse, ShoppingCart, GraduationCap,
  Heart, FileText, Server,
} from "lucide-react";

// Live 8-Startup Orbit Visual
// link = the real path each venture is actually served at by the FastAPI
// orchestrator. Children live at their own prefixes (/breakdown/, /avpu/, ...),
// NOT under /app/<folder>/ (those 404). Comonk is the externally-deployed app
// embedded at /comonk-ai/; "Sevenseed Engine" is the hub's own Studio dashboard
// at /app/.
const STARTUPS = [
  { name: "Breakdown Factor", tag: "Construction AI", icon: HardHat,       color: "#f59e0b", link: "/breakdown/",
    desc: "Scans site photos for structural defects and turns drawings into costed material breakdowns." },
  { name: "Decode Pharmacy",  tag: "Free Healthcare",  icon: HeartPulse,    color: "#10b981", link: "/pharmacy/",
    desc: "Reads handwritten prescriptions, explains each medicine in plain language, and finds free alternatives." },
  { name: "AVP Emart",        tag: "Price Matrix",     icon: ShoppingCart,  color: "#6366f1", link: "/avp-emart/",
    desc: "Compares the same product across sellers and shows the real landed price, not the sticker price." },
  { name: "AVPU",             tag: "AI University",    icon: GraduationCap, color: "#38bdf8", link: "/avpu/",
    desc: "Builds a personal syllabus, tutors over WhatsApp, and verifies attendance with face recognition." },
  { name: "AVP Trust",        tag: "80G Philanthropy", icon: Heart,         color: "#f97316", link: "/trust/",
    desc: "Runs donation campaigns end to end and issues 80G-compliant receipts automatically." },
  { name: "Sevenforce",       tag: "7 AI Employees",   icon: Cpu,           color: "#a855f7", link: "/sevenforce/",
    desc: "Ten agents covering sales, content, research and ops — 25 tools that produce finished work, not chat." },
  // Corrected 2026-08-03. This card previously said Comonk "screens résumés
  // against a job description, scores fit, and drafts the interview kit" — that
  // describes an employer-side ATS, and Comonk is the opposite side of the market.
  // Its endpoints are all candidate-facing: ATS-optimize, cover letter, LinkedIn
  // optimize, mock interview, career roadmap, salary insights. The user IS the
  // job seeker. The wrong description also sent a whole research pass down the
  // wrong path, so keep this accurate.
  { name: "Comonk",           tag: "Career Copilot",   icon: FileText,      color: "#06b6d4", link: "/comonk-ai/",
    desc: "For job seekers: gets your résumé past the ATS, finds matching companies, and runs mock interviews." },
  { name: "Sevenseed Engine", tag: "Venture Backbone",icon: Server,        color: "#eab308", link: "/app/",
    desc: "The shared platform every venture runs on — BYOK keys, model routing, and one deployment." },
];

function StartupOrbitVisual() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  // Auto-rotation stops for good once the visitor picks a tile themselves —
  // otherwise the panel they just opened is swapped out from under them a
  // couple of seconds later. Hovering pauses it too, so a tile can be read.
  const [paused, setPaused] = useState(false);
  const [userPicked, setUserPicked] = useState(false);
  const activeStartup = STARTUPS[selectedIdx];

  useEffect(() => {
    if (paused || userPicked) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      setSelectedIdx(i => (i + 1) % STARTUPS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [paused, userPicked]);

  return (
    <Tilt className="w-full">
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="w-full rounded-2xl overflow-hidden border border-[rgba(245,158,11,0.25)] bg-[#090914] shadow-[0_0_80px_rgba(245,158,11,0.1)]"
      >
        <div className="flex items-center justify-between px-4 py-3 bg-[#0f0f22] border-b border-[rgba(245,158,11,0.12)]">
          <div className="flex items-center gap-2">
            <Rocket className="h-4 w-4 text-[#f59e0b]" />
            <span className="text-[10px] font-mono font-bold text-[#f59e0b] uppercase tracking-widest">
              SEVENSEED VENTURE STUDIO · 8 PORTFOLIO LABS
            </span>
          </div>
          <span className="text-[9px] font-mono text-[#06b6d4]">SUBPROCESS ENGINE ACTIVE</span>
        </div>

        <div className="p-4 bg-[#030308]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
            {STARTUPS.map((s, i) => {
              const Icon = s.icon;
              const isSelected = i === selectedIdx;
              return (
                <div
                  key={i}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onClick={() => { setSelectedIdx(i); setUserPicked(true); }}
                  onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedIdx(i);
                      setUserPicked(true);
                    }
                  }}
                  className={`cursor-pointer rounded-xl p-2.5 border transition-all duration-300 flex flex-col gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f59e0b] ${
                    isSelected
                      ? "bg-[#0f0f22] border-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                      : "bg-[#090914]/80 border-[rgba(255,255,255,0.06)] hover:border-[#f59e0b]/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className="h-4 w-4" style={{ color: s.color }} />
                    <span className="text-[8px] font-mono text-[#64748b]">0{i+1}</span>
                  </div>
                  <div className="text-[11px] font-bold text-white leading-tight truncate">{s.name}</div>
                  <div className="text-[9px] font-mono text-[#cbd5e1] opacity-75">{s.tag}</div>
                </div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="rounded-xl p-4 bg-[#0f0f22] border border-[rgba(245,158,11,0.2)] flex items-center justify-between flex-wrap gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl grid place-items-center bg-black/40 border border-white/10" style={{ color: activeStartup.color }}>
                  {React.createElement(activeStartup.icon, { className: "h-5 w-5" })}
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    {activeStartup.name}
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase" style={{ background:`${activeStartup.color}20`, color: activeStartup.color }}>
                      {activeStartup.tag}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#94a3b8] mt-1 leading-relaxed max-w-[46ch]">{activeStartup.desc}</div>
                </div>
              </div>

              <a
                href={activeStartup.link}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#fef08a] hover:underline bg-black/40 border border-white/10 px-3 py-1.5 rounded-lg"
              >
                Launch Site <ExternalLink className="h-3 w-3" />
              </a>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="px-4 py-2.5 bg-[#0f0f22] border-t border-[rgba(245,158,11,0.12)] flex items-center justify-between text-[9px] font-mono text-[#64748b]">
          <span>SINGLE FASTAPI SUBPROCESS ORCHESTRATOR</span>
          <span>BYOK KEY MANAGER READY</span>
        </div>
      </div>
    </Tilt>
  );
}

export default function Home() {
  const [scrollPct, setScrollPct] = useState(0);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [contactStatus, setContactStatus] = useState<ContactStatus>("idle");
  const [honeypot, setHoneypot] = useState("");

  useEffect(() => {
    const onScroll = () => {
      const s = document.body.scrollTop || document.documentElement.scrollTop;
      const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollPct(h > 0 ? (s / h) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus("sending");
    setFeedbackMsg("Sending…");
    try {
      await submitContact({
        name: contactName,
        email: contactEmail,
        subject: "Venture proposal / partnership enquiry",
        message: contactMsg,
        website: honeypot,
      });
      setContactStatus("sent");
      setFeedbackMsg("Thank you! Your venture inquiry has been received — we reply within 48 hours.");
      setContactName(""); setContactEmail(""); setContactMsg("");
    } catch (err) {
      setContactStatus("error");
      setFeedbackMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <>
      <CustomCursor />
      <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />
      <Navbar />

      {/* HERO */}
      <header className="relative min-h-screen flex items-center overflow-hidden bg-[#030308] pt-[var(--nav-h)]">
        <StarCanvas />
        <div className="venture-mesh" />

        <div className="relative z-10 w-full max-w-[var(--maxw)] mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-7">
            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
              <span className="eyebrow">
                <Rocket className="h-3.5 w-3.5 text-[#f59e0b]" />
                Sevenseed Venture Studio & AI Platform
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity:0, y:28 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.7, delay:0.08, ease:[0.22,1,0.36,1] }}
              className="text-4xl sm:text-5xl xl:text-[4.2rem] font-black leading-[1.04] tracking-tighter text-white"
            >
              8 AI Startups.<br/>
              <span className="grad"><TextScramble text="1 Unified Studio." /></span>
            </motion.h1>

            <motion.p
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.6, delay:0.18, ease:[0.22,1,0.36,1] }}
              className="text-base md:text-lg text-[#cbd5e1] leading-relaxed max-w-[480px]"
            >
              Sevenseed Studio incubates and powers 8 domain-specific AI platforms — spanning construction diagnostics, free healthcare, price matrix engines, AI edtech, and HR intelligence.
            </motion.p>

            <motion.div
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.6, delay:0.26 }}
              className="flex flex-wrap gap-4"
            >
              {/* Labels kept short so the pair sits on one row — the left column is
                  ~480px and longer text wrapped them into an awkward stack. */}
              <a href="#portfolio" className="btn-primary">
                <Layers className="h-4 w-4" />
                Explore Portfolio
              </a>
              <a href="#tools" className="btn-ghost">
                <Cpu className="h-4 w-4" />
                Try the AI Engine
              </a>
            </motion.div>

            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.42 }}
              className="flex flex-wrap gap-2.5">
              {["YOLOv8 Computer Vision", "Prescription OCR", "Groq LLaMA 3.3", "BYOK Key Manager", "Python FastAPI Subprocesses"].map((tag, i) => (
                <span key={i} className="text-[10px] font-mono font-semibold px-3 py-1.5 rounded-full bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.25)] text-[#fef08a]">
                  ✦ {tag}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity:0, x:40 }}
            animate={{ opacity:1, x:0 }}
            transition={{ duration:0.8, delay:0.35, ease:[0.22,1,0.36,1] }}
            className="flex flex-col items-center gap-7"
          >
            <div className="relative flex items-center gap-4">
              <PersonaAvatar size={200} primary="#f59e0b" secondary="#06b6d4" accessory="seed" name="Sena" role="Studio Orchestrator" />
              <div className="hidden xl:block relative rounded-2xl rounded-bl-none border border-[rgba(245,158,11,0.28)] bg-[rgba(9,9,20,0.85)] px-4 py-3 text-sm text-[#cbd5e1] max-w-[205px] backdrop-blur">
                <span className="text-[#fef08a] font-semibold">Hi, I&apos;m Sena 👋</span><br />
                I run the shared AI backbone behind all 8 ventures.
              </div>
            </div>
            <StartupOrbitVisual />
          </motion.div>
        </div>

        <a href="#stats" className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[#64748b] hover:text-[#f59e0b] transition-colors">
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </a>
      </header>

      {/* STATS BAND */}
      <section id="stats" className="bg-[#090914] border-y border-[rgba(245,158,11,0.12)]">
        <div className="max-w-[var(--maxw)] mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[rgba(245,158,11,0.12)]">
          {/* Every figure here is countable from the codebase — 87 is the number of
              distinct /api routes across the seven backends. Keep it that way. */}
          {[
            { val: "8",    lbl: "Live AI ventures, each with its own domain model" },
            { val: "87",   lbl: "Production API endpoints across the portfolio" },
            { val: "1",    lbl: "Container runs all of them, via subprocess orchestration" },
            { val: "BYOK", lbl: "Your own API keys — never stored on our servers" },
          ].map((s, i) => (
            <div key={i} className="px-6 md:px-10 py-9 flex flex-col gap-1.5">
              <div className="text-3xl md:text-4xl font-black tracking-tight text-white">{s.val}</div>
              <div className="text-xs text-[#64748b] leading-snug">{s.lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PORTFOLIO GRID */}
      <section className="max-w-[var(--maxw)] mx-auto py-24 md:py-28 px-6 md:px-12" id="portfolio">
        <RevealOnScroll>
          <div className="text-center mb-14">
            <span className="eyebrow center mb-4">VENTURE PORTFOLIO</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-4">
              Our 8 specialized AI ventures
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {STARTUPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <RevealOnScroll key={i} delay={i * 0.05}>
                <Tilt className="h-full">
                  <GlowCard className="glow-card bg-[#090914] border border-[rgba(245,158,11,0.1)] rounded-2xl p-6 h-full flex flex-col justify-between gap-5">
                    <div>
                      <div className="w-11 h-11 rounded-xl grid place-items-center mb-4" style={{ background: `${s.color}15`, color: s.color }}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-base font-bold text-white mb-2">{s.name}</h3>
                      <span className="text-[9px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full" style={{ background: `${s.color}15`, color: s.color }}>
                        {s.tag}
                      </span>
                      <p className="text-[13px] leading-relaxed text-[#94a3b8] mt-3.5">{s.desc}</p>
                    </div>
                    <a
                      href={s.link}
                      className="inline-flex items-center justify-between text-xs font-mono font-bold text-white hover:text-[#f59e0b] border-t border-white/5 pt-3 transition-colors"
                    >
                      Open Platform <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </GlowCard>
                </Tilt>
              </RevealOnScroll>
            );
          })}
        </div>
      </section>

      {/* AI DEMO WIDGET */}
      <section className="bg-[#090914] py-24 md:py-28 px-6 md:px-12" id="tools">
        <div className="max-w-[var(--maxw)] mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <span className="eyebrow center mb-4">PLATFORM DEMO</span>
              <h2 className="text-3xl md:text-4xl font-black text-white mt-3">Try the Sevenseed AI Engine</h2>
              <p className="text-[#cbd5e1] mt-3 max-w-[460px] mx-auto text-sm opacity-80">
                Plug in your Gemini or Groq API key and test any venture tool in real-time.
              </p>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <AIDemoWidget />
          </RevealOnScroll>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="max-w-[var(--maxw)] mx-auto py-24 md:py-28 px-6 md:px-12" id="contact">
        <RevealOnScroll>
          <GlowCard className="glow-card bg-[#090914] border border-[rgba(245,158,11,0.1)] rounded-2xl p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(245,158,11,0.1),transparent_55%)] pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f59e0b]/50 to-transparent" />
            <div className="relative z-10 max-w-[520px] mx-auto text-center">
              <span className="eyebrow center mb-5">INVEST & PARTNER</span>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 mt-4">Build with Sevenseed</h2>
              <p className="text-sm text-[#cbd5e1] mb-8 opacity-80">
                Interested in co-founding, investing, or licensing our domain-specific AI engines? Reach out.
              </p>
              <form onSubmit={onContact} className="flex flex-col gap-3 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" value={contactName} onChange={e => setContactName(e.target.value)}
                    placeholder="Your Name / Org" required
                    className="px-4 py-3 bg-[#030308] border border-[rgba(245,158,11,0.15)] rounded-xl text-sm text-white focus:outline-none focus:border-[#f59e0b] transition-colors placeholder:text-[#64748b]" />
                  <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)}
                    placeholder="Your Email" required
                    className="px-4 py-3 bg-[#030308] border border-[rgba(245,158,11,0.15)] rounded-xl text-sm text-white focus:outline-none focus:border-[#f59e0b] transition-colors placeholder:text-[#64748b]" />
                </div>
                <textarea rows={3} value={contactMsg} onChange={e => setContactMsg(e.target.value)}
                  placeholder="Tell us about your venture proposal or enquiry…" required
                  className="px-4 py-3 bg-[#030308] border border-[rgba(245,158,11,0.15)] rounded-xl text-sm text-white focus:outline-none focus:border-[#f59e0b] transition-colors placeholder:text-[#64748b] resize-none" />
                {/* Honeypot — visually hidden, never focusable. Bots fill it, users don't. */}
                <input
                  type="text" tabIndex={-1} autoComplete="off" aria-hidden="true"
                  value={honeypot} onChange={e => setHoneypot(e.target.value)}
                  className="absolute -left-[9999px] h-0 w-0 opacity-0" />
                <button
                  type="submit"
                  disabled={contactStatus === "sending"}
                  className="btn-primary w-full text-base disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {contactStatus === "sending" ? "Sending…" : "Submit Proposal"}
                </button>
                {feedbackMsg && (
                  <p
                    role="status"
                    className={`text-xs font-semibold text-center ${
                      contactStatus === "error" ? "text-red-400"
                        : contactStatus === "sent" ? "text-emerald-400"
                        : "text-[#f59e0b]"
                    }`}
                  >
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
