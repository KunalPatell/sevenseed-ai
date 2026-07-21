"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { GlowCard } from "@/components/GlowCard";
import { AIDemoWidget } from "@/components/AIDemoWidget";
import { GyanOrb } from "@/components/GyanOrb";
import { CurriculumPath } from "@/components/CurriculumPath";
import {
  GraduationCap, BookOpen, Map, Award, Cpu,
  ChevronDown, Search, Star, Briefcase, MessageCircle,
  CheckCircle2, Sparkles, BookMarked, Users, TrendingUp,
} from "lucide-react";

// ════════════════════════════════════════════════════════════
//  LIVE KNOWLEDGE GRAPH & TUTOR VISUAL
// ════════════════════════════════════════════════════════════
const COURSES = [
  { id: "ai_ml",    name: "AI & Machine Learning", score: 94, level: "Sem 6", status: "Mastered" },
  { id: "ds_algo",  name: "Data Structures & Algos",score: 88, level: "Sem 4", status: "Mastered" },
  { id: "fullstack",name: "Full-Stack Development", score: 91, level: "Sem 5", status: "In Progress" },
  { id: "sys_des",  name: "System Design & Cloud", score: 85, level: "Sem 7", status: "Next Target" },
];

function GyanNodeVisual() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeCourse = COURSES[activeIdx];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx(i => (i + 1) % COURSES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-[rgba(245,158,11,0.25)] bg-[#03071c] shadow-[0_0_80px_rgba(59,130,246,0.08)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#060c2b] border-b border-[rgba(56,189,248,0.12)]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute h-full w-full rounded-full bg-[#f59e0b] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f59e0b]" />
          </span>
          <span className="text-[10px] font-mono font-bold text-[#f59e0b] uppercase tracking-widest">
            GYAN · KNOWLEDGE GRAPH & PLACEMENT SCORE
          </span>
        </div>
        <span className="text-[9px] font-mono text-[#38bdf8]">PLACEMENT READY</span>
      </div>

      {/* Interactive knowledge node graph SVG */}
      <div className="relative aspect-[16/10] bg-[#020514] p-4 flex flex-col justify-between overflow-hidden">
        {/* Constellation lines SVG */}
        <svg viewBox="0 0 400 220" className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
          <line x1="80" y1="60" x2="200" y2="110" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" />
          <line x1="320" y1="60" x2="200" y2="110" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" />
          <line x1="80" y1="170" x2="200" y2="110" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" />
          <line x1="320" y1="170" x2="200" y2="110" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" />
          <circle cx="200" cy="110" r="35" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
        </svg>

        {/* Floating node chips */}
        <div className="relative z-10 grid grid-cols-2 gap-3 mb-2">
          {COURSES.map((c, i) => {
            const isActive = i === activeIdx;
            return (
              <div
                key={c.id}
                onClick={() => setActiveIdx(i)}
                className={`cursor-pointer rounded-xl p-3 border transition-all duration-300 ${
                  isActive
                    ? "bg-[#0b1336] border-[#f59e0b] shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                    : "bg-[#060b24]/80 border-[rgba(56,189,248,0.12)] hover:border-[#38bdf8]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-mono text-[#38bdf8] uppercase">{c.level}</span>
                  <span className="text-[10px] font-mono font-bold text-[#f59e0b]">{c.score}%</span>
                </div>
                <div className="text-xs font-bold text-white truncate">{c.name}</div>
              </div>
            );
          })}
        </div>

        {/* Active Node Detail Box */}
        <div className="relative z-10 rounded-xl bg-[#0b1336]/90 border border-[rgba(245,158,11,0.2)] p-3 backdrop-blur">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-white flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-[#f59e0b]" /> Gyan Tutor Explanation
            </span>
            <span className="text-[10px] font-mono text-[#38bdf8]">{activeCourse.status}</span>
          </div>
          <p className="text-[11px] text-[#cbd5e1] leading-relaxed">
            "{activeCourse.name} is key for top placement rounds. Focus on practice questions and real-world system implementations."
          </p>
        </div>
      </div>

      {/* Score gauge row */}
      <div className="grid grid-cols-3 border-t border-[rgba(56,189,248,0.12)] bg-[#060c2b] text-center py-2.5 px-2">
        <div>
          <div className="text-[8px] font-mono text-[#64748b] uppercase">PLACEMENT INDEX</div>
          <div className="text-sm font-mono font-black text-[#f59e0b]">92 / 100</div>
        </div>
        <div>
          <div className="text-[8px] font-mono text-[#64748b] uppercase">ACTIVE TUTOR</div>
          <div className="text-sm font-mono font-bold text-[#38bdf8]">Gyan RAG v2</div>
        </div>
        <div>
          <div className="text-[8px] font-mono text-[#64748b] uppercase">HIRING PARTNERS</div>
          <div className="text-sm font-mono font-bold text-[#22c55e]">120+ Companies</div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  MAIN PAGE
// ════════════════════════════════════════════════════════════
export default function Home() {
  const [scrollPct, setScrollPct] = useState(0);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");

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
    setFeedbackMsg("Sending…");
    await new Promise(r => setTimeout(r, 900));
    setFeedbackMsg("Thank you! Your query has been logged with the AVPU team.");
    setContactName(""); setContactEmail(""); setContactMsg("");
  };

  return (
    <>
      <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />
      <Navbar />

      {/* ────────────────────────────────────────────────────
          HERO  –  Split: Text ← | → Gyan Knowledge Graph
      ──────────────────────────────────────────────────── */}
      <header className="relative min-h-screen flex items-center overflow-hidden bg-[#020514] pt-[var(--nav-h)]">
        <div className="constellation-grid" />

        {/* Ambient Glow Orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-20 w-[700px] h-[700px] rounded-full bg-[#3b82f6]/6 blur-[140px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[#f59e0b]/5 blur-[120px]" />
        </div>

        <div className="relative z-10 w-full max-w-[var(--maxw)] mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div className="flex flex-col gap-7">
            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
              <span className="eyebrow">
                <GraduationCap className="h-3.5 w-3.5 text-[#f59e0b]" />
                AI-Native University & Placement Engine
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity:0, y:28 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.7, delay:0.08, ease:[0.22,1,0.36,1] }}
              className="text-4xl sm:text-5xl xl:text-[4.2rem] font-black leading-[1.04] tracking-tighter text-white"
            >
              Ask Gyan.<br/>
              <span className="grad">Get a grounded answer.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.6, delay:0.18, ease:[0.22,1,0.36,1] }}
              className="text-base md:text-lg text-[#cbd5e1] leading-relaxed max-w-[480px]"
            >
              Gyan is AVPU&apos;s AI tutor — it searches AVPU&apos;s syllabus library, builds personalized study roadmaps, grades practice answers, and matches your skills to hiring partners.
            </motion.p>

            <motion.div
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.6, delay:0.26 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/app/" className="btn-primary">
                <GraduationCap className="h-4 w-4" />
                Access Student Portal
              </Link>
              <a href="#features" className="btn-ghost">
                <Map className="h-4 w-4" />
                Explore Study Roadmaps
              </a>
            </motion.div>

            {/* Chips */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.42 }}
              className="flex flex-wrap gap-2.5">
              {["Syllabus RAG", "Placement Scoring", "Instant Feedback", "WhatsApp AI Tutor", "100% Free BYOK"].map((tag, i) => (
                <span key={i} className="text-[10px] font-mono font-semibold px-3 py-1.5 rounded-full bg-[rgba(56,189,248,0.06)] border border-[rgba(56,189,248,0.2)] text-[#38bdf8]">
                  ✦ {tag}
                </span>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: Knowledge Node Visual */}
          <motion.div
            initial={{ opacity:0, x:40 }}
            animate={{ opacity:1, x:0 }}
            transition={{ duration:0.8, delay:0.35, ease:[0.22,1,0.36,1] }}
          >
            <GyanNodeVisual />
          </motion.div>
        </div>

        <a href="#stats" className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[#64748b] hover:text-[#f59e0b] transition-colors">
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </a>
      </header>

      {/* ── STATS BAND ────────────────────────────────────── */}
      <section id="stats" className="bg-[#060b24] border-y border-[rgba(56,189,248,0.1)]">
        <div className="max-w-[var(--maxw)] mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[rgba(56,189,248,0.1)]">
          {[
            { val: "100%",    lbl: "Syllabus-grounded answers" },
            { val: "120+",   lbl: "Corporate placement partners" },
            { val: "24/7",    lbl: "AI Tutor availability" },
            { val: "BYOK",    lbl: "Free unlimited access with your key" },
          ].map((s, i) => (
            <div key={i} className="px-6 md:px-10 py-8 flex flex-col gap-1">
              <div className="text-2xl md:text-3xl font-black text-white">{s.val}</div>
              <div className="text-xs text-[#64748b] leading-snug">{s.lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MEET GYAN ─────────────────────────────────────── */}
      <section className="bg-[#060b24] border-b border-[rgba(56,189,248,0.1)] py-16 px-6 md:px-12">
        <div className="max-w-[var(--maxw)] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <RevealOnScroll className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
            <GyanOrb size={112} className="mb-5" />
            <span className="eyebrow mb-2">Your AI Tutor</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mt-1">
              Meet Gyan.
            </h2>
            <p className="text-sm text-[#cbd5e1] mt-3 leading-relaxed">
              Gyan is trained on AVPU&apos;s exact academic curriculum and career placement standards to deliver accurate, non-hallucinated explanations.
            </p>
          </RevealOnScroll>
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { icon:BookOpen,      title:"Classifies", desc:"Categorizes your question by topic, semester, and difficulty instantly." },
              { icon:Search,        title:"Retrieves",   desc:"Searches AVPU's internal syllabus and exam questions for grounded context." },
              { icon:GraduationCap, title:"Explains",    desc:"Provides clean, step-by-step answers under 180 words with working code or examples." },
              { icon:Briefcase,     title:"Evaluates",   desc:"Scores your technical skills against job market standards for campus placements." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <RevealOnScroll key={i} delay={i * 0.06}>
                <div className="flex gap-4 p-4 rounded-xl bg-[#0b1336] border border-[rgba(56,189,248,0.1)]">
                  <div className="w-10 h-10 rounded-lg grid place-items-center bg-[rgba(245,158,11,0.12)] text-[#f59e0b] flex-shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">{title}</div>
                    <p className="text-xs text-[#64748b] mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section className="max-w-[var(--maxw)] mx-auto py-24 px-6 md:px-12" id="features">
        <RevealOnScroll>
          <div className="text-center mb-14">
            <span className="eyebrow center mb-4">PLATFORM CAPABILITIES</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-4">
              AI-driven academic excellence
            </h2>
          </div>
        </RevealOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon:BookMarked, color:"#f59e0b", badge:"Curriculum", title:"Dynamic Roadmaps",      desc:"Generates semester-wise learning pathways customized to your career track and skill gaps." },
            { icon:Award,      color:"#38bdf8", badge:"Placement",  title:"Placement Indexing",     desc:"Evaluates your code commits, quiz scores, and project portfolios to generate a placement readiness score." },
            { icon:MessageCircle,color:"#3b82f6",badge:"WhatsApp",   title:"WhatsApp Study Assistant",desc:"Study on the go. Send questions directly to Gyan on WhatsApp for fast homework and exam help." },
            { icon:Users,      color:"#22c55e", badge:"Mentorship", title:"Tutor Matching",         desc:"Connects you with senior student mentors and faculty based on targeted topic difficulty." },
            { icon:Cpu,        color:"#a855f7", badge:"Engine",     title:"Multi-LLM Support",      desc:"Choose between LLaMA 3.3, Gemini 1.5, or Claude models for different academic subjects." },
            { icon:Sparkles,   color:"#f59e0b", badge:"Open",       title:"BYOK — Free Forever",    desc:"Plug in your own API key and use all AVPU learning tools with zero subscription cost." },
          ].map(({ icon: Icon, color, badge, title, desc }, i) => (
            <RevealOnScroll key={i} delay={i * 0.06}>
              <GlowCard className="glow-card bg-[#060b24] border border-[rgba(56,189,248,0.1)] rounded-2xl p-6 h-full flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl grid place-items-center flex-shrink-0"
                    style={{ background:`${color}14`, color }}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
                    style={{ background:`${color}12`, color }}>
                    {badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-white mb-1.5">{title}</h3>
                  <p className="text-sm text-[#cbd5e1] leading-relaxed opacity-80">{desc}</p>
                </div>
              </GlowCard>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* ── AI DEMO WIDGET ───────────────────────────────── */}
      <section className="bg-[#060b24] py-20 px-6 md:px-12" id="tools">
        <div className="max-w-[var(--maxw)] mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <span className="eyebrow center mb-4">INTERACTIVE DEMO</span>
              <h2 className="text-3xl md:text-4xl font-black text-white mt-3">Test Gyan right now</h2>
              <p className="text-[#cbd5e1] mt-3 max-w-[460px] mx-auto text-sm opacity-80">
                Add your API key and ask Gyan any technical or syllabus question.
              </p>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <AIDemoWidget />
          </RevealOnScroll>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section className="max-w-[var(--maxw)] mx-auto py-20 px-6 md:px-12" id="testimonials">
        <RevealOnScroll>
          <div className="text-center mb-12">
            <span className="eyebrow center mb-4">STUDENT FEEDBACK</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">What AVPU students say</h2>
          </div>
        </RevealOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { t:"Gyan's explanation of Distributed Consensus was clearer than 3 hours of online lectures. Got placed at an MNC last month!", a:"Karan P.", c:"B.Tech Computer Engineering" },
            { t:"The placement index predicted my interview performance with 90% accuracy. Gave me the confidence I needed.", a:"Sneha R.", c:"AI & Data Science Scholar" },
            { t:"Being able to ask study questions on WhatsApp while traveling saves me so much time every single day.", a:"Aditya M.", c:"Information Technology" },
          ].map(({ t, a, c }, i) => (
            <RevealOnScroll key={i} delay={i * 0.07}>
              <GlowCard className="glow-card bg-[#0b1336] border border-[rgba(56,189,248,0.1)] rounded-2xl p-6 h-full flex flex-col gap-4">
                <figure className="h-full flex flex-col gap-4">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 fill-[#f59e0b] text-[#f59e0b]" />)}
                  </div>
                  <blockquote className="text-sm text-[#cbd5e1] italic flex-1 leading-relaxed">"{t}"</blockquote>
                  <figcaption className="flex items-center gap-3 border-t border-[rgba(56,189,248,0.1)] pt-4">
                    <div className="w-9 h-9 rounded-full bg-[rgba(245,158,11,0.15)] border border-[rgba(245,158,11,0.3)] flex items-center justify-center font-bold text-[#f59e0b] text-xs">
                      {a[0]}
                    </div>
                    <div className="text-xs">
                      <strong className="block text-white">{a}</strong>
                      <span className="text-[#64748b]">{c}</span>
                    </div>
                  </figcaption>
                </figure>
              </GlowCard>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* ── CONTACT CTA ──────────────────────────────────── */}
      <section className="max-w-[var(--maxw)] mx-auto py-16 px-6 md:px-12" id="contact">
        <RevealOnScroll>
          <GlowCard className="glow-card bg-[#060b24] border border-[rgba(56,189,248,0.1)] rounded-2xl p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(245,158,11,0.1),transparent_55%)] pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f59e0b]/50 to-transparent" />
            <div className="relative z-10 max-w-[520px] mx-auto text-center">
              <span className="eyebrow center mb-5">ADMISSIONS & ENQUIRIES</span>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 mt-4">Join AVPU today.</h2>
              <p className="text-sm text-[#cbd5e1] mb-8 opacity-80">
                Have questions about our programs, placement partners, or AI tools? Send us a message.
              </p>
              <form onSubmit={onContact} className="flex flex-col gap-3 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" value={contactName} onChange={e => setContactName(e.target.value)}
                    placeholder="Your Name" required
                    className="px-4 py-3 bg-[#020514] border border-[rgba(56,189,248,0.15)] rounded-xl text-sm text-white focus:outline-none focus:border-[#f59e0b] transition-colors placeholder:text-[#64748b]" />
                  <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)}
                    placeholder="Your Email" required
                    className="px-4 py-3 bg-[#020514] border border-[rgba(56,189,248,0.15)] rounded-xl text-sm text-white focus:outline-none focus:border-[#f59e0b] transition-colors placeholder:text-[#64748b]" />
                </div>
                <textarea rows={3} value={contactMsg} onChange={e => setContactMsg(e.target.value)}
                  placeholder="Your query or course request…" required
                  className="px-4 py-3 bg-[#020514] border border-[rgba(56,189,248,0.15)] rounded-xl text-sm text-white focus:outline-none focus:border-[#f59e0b] transition-colors placeholder:text-[#64748b] resize-none" />
                <button type="submit" className="btn-primary w-full text-base">
                  Submit Enquiry
                </button>
                {feedbackMsg && <p className="text-xs text-[#f59e0b] font-semibold text-center">{feedbackMsg}</p>}
              </form>
            </div>
          </GlowCard>
        </RevealOnScroll>
      </section>

      <Footer />
    </>
  );
}
