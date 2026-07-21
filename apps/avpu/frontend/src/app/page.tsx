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
import { GyanOrb } from "@/components/GyanOrb";
import { CurriculumPath } from "@/components/CurriculumPath";
import {
  GraduationCap,
  BookOpen,
  Map,
  Award,
  Cpu,
  ChevronDown,
  Search,
  Star,
  Briefcase,
  MessageCircle,
  CheckCircle2,
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
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

      {/* ── Hero: badge, headline, dual CTA, then Gyan's curriculum path ─────── */}
      <header className="relative min-h-screen flex items-center justify-center text-center px-6 py-28 overflow-hidden bg-[#090a14]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#6366f1]/20 via-[#3b82f6]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#6366f1]/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#0284c7]/10 rounded-full blur-[110px] pointer-events-none" />
        <div className="hero-grid" />

        <div className="relative z-10 max-w-[1000px] w-full flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2.5 px-4.5 py-2 rounded-full text-xs font-mono font-bold tracking-wider text-[#c7d2fe] bg-black/60 border border-[#6366f1]/40 shadow-[0_0_25px_rgba(99,102,241,0.2)] mb-8 backdrop-blur-xl"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6366f1] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6366f1]"></span>
            </span>
            <span className="uppercase text-[11px]">✦ 100% FREE · NO CREDIT CARD REQUIRED · AI EDTECH & TUTOR ENGINE</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-black leading-[1.05] tracking-tight mb-8 text-white"
          >
            Ask Gyan. <br />
            <span className="bg-gradient-to-r from-[#c7d2fe] via-[#6366f1] to-[#38bdf8] bg-clip-text text-transparent">
              Get a grounded answer.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="text-base md:text-xl text-[#9aa0b8] max-w-[720px] leading-relaxed mb-10 font-normal"
          >
            Gyan is AVPU&apos;s AI tutor — it classifies what you&apos;re asking, searches AVPU&apos;s own
            syllabus and policy library, then explains the concept with a concrete example instead of
            guessing. The same engine builds study roadmaps, matches your skills to placement partners, and
            grades practice answers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-5 justify-center mb-14"
          >
            <Link href="/app/" className="btn bg-gradient-to-r from-[#6366f1] to-[#3b82f6] hover:scale-[1.03] text-white font-extrabold text-sm md:text-base px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all duration-300 flex items-center gap-2 uppercase tracking-wide">
              <i className="fas fa-graduation-cap text-sm"></i> Access Student Portal
            </Link>
            <a href="#services" className="btn border border-white/20 bg-black/50 text-white hover:bg-white/10 hover:border-[#6366f1] text-sm md:text-base px-8 py-4 rounded-xl transition-all duration-300 backdrop-blur-xl font-bold flex items-center gap-2">
              <i className="fas fa-compass text-sm text-[#93c5fd]"></i> See a Sample Roadmap
            </a>
          </motion.div>

          {/* Curriculum-shaped centerpiece — replaces the generic stat row */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex justify-center"
          >
            <CurriculumPath />
          </motion.div>
        </div>
      </header>

      {/* ── Meet Gyan ──────────────────────────────────────────────────────── */}
      <section className="bg-[#0b0b12] border-y border-white/5 py-16 px-6 md:px-12">
        <RevealOnScroll className="max-w-[1180px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
            <GyanOrb size={112} className="mb-5" />
            <span className="eyebrow">Your AI tutor</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mt-1">Meet Gyan.</h2>
          </div>
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg grid place-items-center bg-[#6366f1]/15 text-[#c7d2fe] shrink-0">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-white">Classifies</div>
                <p className="text-xs text-[#9aa0b8] mt-0.5">Sorts your question into a concept, admissions or placement query first.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg grid place-items-center bg-[#6366f1]/15 text-[#c7d2fe] shrink-0">
                <Search className="h-5 w-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-white">Retrieves</div>
                <p className="text-xs text-[#9aa0b8] mt-0.5">Searches AVPU&apos;s own syllabus and program library for grounding.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg grid place-items-center bg-[#6366f1]/15 text-[#c7d2fe] shrink-0">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-white">Explains</div>
                <p className="text-xs text-[#9aa0b8] mt-0.5">Answers in under 180 words with a concrete example, not a wall of text.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg grid place-items-center bg-[#6366f1]/15 text-[#c7d2fe] shrink-0">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-white">Follows you</div>
                <p className="text-xs text-[#9aa0b8] mt-0.5">Reachable on WhatsApp, not just this page, for quick study questions.</p>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* AI Stack Strip */}
      <section className="py-8 px-6 md:px-12 border-b border-white/5 text-center">
        <span className="text-xs font-bold tracking-wider text-[#9aa0b8] uppercase inline-flex items-center gap-2 mb-3">
          <i className="fas fa-bolt text-[#c7d2fe]"></i> What&apos;s actually running under Gyan
        </span>
        <div className="flex flex-wrap justify-center gap-2 mt-2 mb-6">
          {["3-Node LangGraph Pipeline", "Groq LLaMA 3.3 70B", "AVPU Syllabus RAG Index", "FastAPI API Hub", "Offline grounded fallback", "WhatsApp Cloud API"].map((stack) => (
            <span key={stack} className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#eeeef8] bg-[#12121e] border border-white/5 px-3 py-1.5 rounded-lg">
              <Cpu className="h-3 w-3 text-[#c7d2fe]" /> {stack}
            </span>
          ))}
        </div>
        <div className="w-full max-w-[800px] mx-auto mask-image-gradient overflow-hidden select-none opacity-60">
          <div className="marquee-track text-[#c7d2fe] text-xs font-mono font-semibold">
            <span>✦ Syllabus-Grounded RAG Tutor</span>
            <span>✦ Week-by-Week Study Roadmaps</span>
            <span>✦ Placement Skill Matcher</span>
            <span>✦ Admissions Program Finder</span>
            <span>✦ Adaptive Assessment Grading</span>
            <span>✦ WhatsApp Tutor Access</span>
            <span>✦ Syllabus-Grounded RAG Tutor</span>
            <span>✦ Week-by-Week Study Roadmaps</span>
            <span>✦ Placement Skill Matcher</span>
            <span>✦ Admissions Program Finder</span>
            <span>✦ Adaptive Assessment Grading</span>
            <span>✦ WhatsApp Tutor Access</span>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-[1180px] mx-auto py-24 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" id="about">
        <RevealOnScroll className="lg:col-span-7 flex flex-col gap-4">
          <span className="eyebrow">Est. 2026 · Ahmedabad, Gujarat</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">Answers grounded in your actual syllabus.</h2>
          <p className="text-sm md:text-base text-[#9aa0b8] leading-relaxed mt-2">
            Most chatbots answer from general training data and hope it matches your course. Gyan searches
            AVPU&apos;s own program library first — degree requirements, fee structures, eligibility rules —
            and only reaches for general knowledge when the syllabus doesn&apos;t cover the question, saying
            so when it does.
          </p>
          <p className="text-sm md:text-base text-[#9aa0b8] leading-relaxed">
            Every chat, quiz score and generated roadmap is saved to your account, so a study plan started on
            Monday is still there on Friday. No account is required to try Gyan on this page.
          </p>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1} className="lg:col-span-5">
          <GlowCard className="glow-card bg-gradient-to-br from-[#12121e] to-[#0d0d16] border border-white/5 rounded-2xl p-8">
            <div className="w-14 h-14 rounded-xl grid place-items-center text-white bg-gradient-to-br from-[#6366f1] to-[#3b82f6] shadow-[0_8px_24px_rgba(99,102,241,0.3)] mb-6">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-4">Why AVP University?</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3 text-sm text-[#9aa0b8] border-b border-white/5 pb-3">
                <span className="w-[20px] h-[20px] rounded bg-[#6366f1]/15 grid place-items-center shrink-0 mt-0.5"><i className="fas fa-check text-xs text-[#c7d2fe]"></i></span>
                <span>Syllabus-grounded tutoring, not generic answers</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[#9aa0b8] border-b border-white/5 pb-3">
                <span className="w-[20px] h-[20px] rounded bg-[#6366f1]/15 grid place-items-center shrink-0 mt-0.5"><i className="fas fa-check text-xs text-[#c7d2fe]"></i></span>
                <span>Saves your chats, roadmaps and assessment scores</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[#9aa0b8] border-b border-white/5 pb-3">
                <span className="w-[20px] h-[20px] rounded bg-[#6366f1]/15 grid place-items-center shrink-0 mt-0.5"><i className="fas fa-check text-xs text-[#c7d2fe]"></i></span>
                <span>Placement matcher scored against real hiring skill lists</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[#9aa0b8]">
                <span className="w-[20px] h-[20px] rounded bg-[#6366f1]/15 grid place-items-center shrink-0 mt-0.5"><i className="fas fa-check text-xs text-[#c7d2fe]"></i></span>
                <span>Admissions counsel with real fee and eligibility data</span>
              </li>
            </ul>
          </GlowCard>
        </RevealOnScroll>
      </section>

      {/* AI Capabilities / Services */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="services">
        <RevealOnScroll>
          <span className="eyebrow center block">HOW GYAN ANSWERS A QUESTION</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-6">Three steps, every time.</h2>
          <p className="text-sm md:text-base text-[#9aa0b8] text-center max-w-[640px] mx-auto mb-10">
            Every question runs through the same LangGraph pipeline shown in the curriculum path above —
            no shortcuts, no skipped steps.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.05} className="max-w-[900px] mx-auto mb-16">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 bg-[#12121e] border border-white/5 rounded-2xl p-5 text-center">
              <div className="text-2xl font-black font-mono text-[#c7d2fe]"><AnimatedCounter value={1} /></div>
              <div className="text-xs font-bold text-white mt-1">intent_classifier</div>
              <div className="text-[11px] text-[#9aa0b8] mt-1">Concept, admissions or career question?</div>
            </div>
            <div className="flex-1 bg-[#12121e] border border-white/5 rounded-2xl p-5 text-center">
              <div className="text-2xl font-black font-mono text-[#c7d2fe]"><AnimatedCounter value={2} /></div>
              <div className="text-xs font-bold text-white mt-1">rag_retriever</div>
              <div className="text-[11px] text-[#9aa0b8] mt-1">Pulls matching chunks from AVPU&apos;s knowledge base.</div>
            </div>
            <div className="flex-1 bg-[#12121e] border border-white/5 rounded-2xl p-5 text-center">
              <div className="text-2xl font-black font-mono text-[#c7d2fe]"><AnimatedCounter value={3} /></div>
              <div className="text-xs font-bold text-white mt-1">tutor_advisor</div>
              <div className="text-[11px] text-[#9aa0b8] mt-1">Writes the answer, grounded in what was retrieved.</div>
            </div>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RevealOnScroll delay={0.02}>
            <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 hover:border-[#6366f1]/50 transition-all flex flex-col h-full">
              <div className="w-12 h-12 rounded-xl grid place-items-center bg-[#6366f1]/10 text-[#c7d2fe] mb-4">
                <BookOpen className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Syllabus-Grounded Tutoring</h4>
              <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mb-6 flex-1">
                Ask about DBMS, Python, RAG or any core CS/AI topic and get an explanation with an example.
              </p>
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#c7d2fe] bg-[#6366f1]/10 px-2.5 py-1 rounded-full w-fit">
                <Cpu className="h-3 w-3" /> LangGraph Tutor
              </span>
            </GlowCard>
          </RevealOnScroll>

          <RevealOnScroll delay={0.06}>
            <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 hover:border-[#6366f1]/50 transition-all flex flex-col h-full">
              <div className="w-12 h-12 rounded-xl grid place-items-center bg-[#3b82f6]/10 text-[#93c5fd] mb-4">
                <Briefcase className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Placement Matcher</h4>
              <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mb-6 flex-1">
                Enter your skills and interests — Gyan scores you against real hiring-partner skill lists and shows the gaps.
              </p>
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#93c5fd] bg-[#3b82f6]/10 px-2.5 py-1 rounded-full w-fit">
                <Cpu className="h-3 w-3" /> Career Agent
              </span>
            </GlowCard>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 hover:border-[#6366f1]/50 transition-all flex flex-col h-full">
              <div className="w-12 h-12 rounded-xl grid place-items-center bg-[#6366f1]/10 text-[#c7d2fe] mb-4">
                <Map className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Week-by-Week Roadmaps</h4>
              <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mb-6 flex-1">
                Give a goal and a timeframe — Gyan lays out what to study each week, like the path above.
              </p>
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#c7d2fe] bg-[#6366f1]/10 px-2.5 py-1 rounded-full w-fit">
                <Cpu className="h-3 w-3" /> Roadmapping Agent
              </span>
            </GlowCard>
          </RevealOnScroll>

          <RevealOnScroll delay={0.02}>
            <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 hover:border-[#6366f1]/50 transition-all flex flex-col h-full">
              <div className="w-12 h-12 rounded-xl grid place-items-center bg-[#3b82f6]/10 text-[#93c5fd] mb-4">
                <Award className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Adaptive Assessments</h4>
              <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mb-6 flex-1">
                Answer a practice question and get a score plus specific feedback on what to improve.
              </p>
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#93c5fd] bg-[#3b82f6]/10 px-2.5 py-1 rounded-full w-fit">
                <Cpu className="h-3 w-3" /> Grading Agent
              </span>
            </GlowCard>
          </RevealOnScroll>

          <RevealOnScroll delay={0.06}>
            <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 hover:border-[#6366f1]/50 transition-all flex flex-col h-full">
              <div className="w-12 h-12 rounded-xl grid place-items-center bg-[#6366f1]/10 text-[#c7d2fe] mb-4">
                <Search className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Admissions Counsel</h4>
              <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mb-6 flex-1">
                Ask about branches, eligibility or fees and get answers pulled from AVPU&apos;s real program data.
              </p>
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#c7d2fe] bg-[#6366f1]/10 px-2.5 py-1 rounded-full w-fit">
                <Cpu className="h-3 w-3" /> Admissions Agent
              </span>
            </GlowCard>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 hover:border-[#6366f1]/50 transition-all flex flex-col h-full">
              <div className="w-12 h-12 rounded-xl grid place-items-center bg-[#3b82f6]/10 text-[#93c5fd] mb-4">
                <MessageCircle className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">WhatsApp Tutor Access</h4>
              <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mb-6 flex-1">
                The same tutor answers over WhatsApp, so a quick question doesn&apos;t need the full portal open.
              </p>
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#93c5fd] bg-[#3b82f6]/10 px-2.5 py-1 rounded-full w-fit">
                <Cpu className="h-3 w-3" /> WhatsApp Cloud API
              </span>
            </GlowCard>
          </RevealOnScroll>
        </div>

        <RevealOnScroll delay={0.15}>
          <AIDemoWidget />
        </RevealOnScroll>
      </section>

      {/* Process Section — vertical timeline, deliberately not a 4-card grid */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="process">
        <RevealOnScroll>
          <span className="eyebrow center block">THE PROCESS</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12">From first question to placement-ready</h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.05} className="max-w-[760px] mx-auto relative pl-8">
          <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-[#6366f1]/60 via-[#3b82f6]/40 to-transparent" />
          {[
            { icon: Search, title: "Consult admissions", body: "Gyan matches your background to a target program and explains eligibility." },
            { icon: Map, title: "Build a roadmap", body: "State your goal and timeframe to get a week-by-week study plan." },
            { icon: BookOpen, title: "Tutor & quiz", body: "Work through concepts with the RAG tutor, then check retention with assessments." },
            { icon: Briefcase, title: "Get placement-matched", body: "Run the skill matcher against real hiring-partner requirements before you apply." },
          ].map((step, i) => (
            <div key={step.title} className="relative flex items-start gap-4 mb-8 last:mb-0">
              <div className="absolute -left-8 w-8 h-8 rounded-full bg-[#0b0b12] border-2 border-[#6366f1] grid place-items-center text-[11px] font-mono font-bold text-[#c7d2fe] shrink-0">
                {i + 1}
              </div>
              <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#6366f1]/10 text-[#c7d2fe] shrink-0">
                <step.icon className="h-5 w-5" />
              </div>
              <div className="pt-1.5">
                <h4 className="text-sm font-bold text-white mb-1">{step.title}</h4>
                <p className="text-xs text-[#9aa0b8] leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </RevealOnScroll>
      </section>

      {/* Testimonials */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="testimonials">
        <RevealOnScroll>
          <span className="eyebrow center block">REVIEWS</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12">What our students say</h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RevealOnScroll delay={0.02}>
            <figure className="tcard flex flex-col gap-4 h-full">
              <div className="text-[#c7d2fe] flex gap-1"><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /></div>
              <blockquote className="text-sm text-[#9aa0b8] italic flex-1 leading-relaxed">
                &ldquo;Gyan walked me through tree traversal with an actual worked example instead of a
                textbook definition. That&apos;s what made it click.&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3 border-t border-white/5 pt-4">
                <div className="w-9 h-9 rounded-full bg-[#12121e] border border-white/10 flex items-center justify-center font-bold text-[#c7d2fe] text-xs">A</div>
                <div className="text-xs">
                  <strong className="block text-white">CS Student</strong>
                  <span className="text-[#5b5f78]">Ahmedabad</span>
                </div>
              </figcaption>
            </figure>
          </RevealOnScroll>

          <RevealOnScroll delay={0.06}>
            <figure className="tcard flex flex-col gap-4 h-full">
              <div className="text-[#c7d2fe] flex gap-1"><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /></div>
              <blockquote className="text-sm text-[#9aa0b8] italic flex-1 leading-relaxed">
                &ldquo;Ran the placement matcher against my skills and it told me exactly which two I was
                missing, not just a generic &lsquo;keep learning&rsquo;.&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3 border-t border-white/5 pt-4">
                <div className="w-9 h-9 rounded-full bg-[#12121e] border border-white/10 flex items-center justify-center font-bold text-[#c7d2fe] text-xs">J</div>
                <div className="text-xs">
                  <strong className="block text-white">Final Year Student</strong>
                  <span className="text-[#5b5f78]">Ahmedabad</span>
                </div>
              </figcaption>
            </figure>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <figure className="tcard flex flex-col gap-4 h-full">
              <div className="text-[#c7d2fe] flex gap-1"><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /></div>
              <blockquote className="text-sm text-[#9aa0b8] italic flex-1 leading-relaxed">
                &ldquo;The weekly roadmap kept exam prep from turning into a last-minute scramble. I could
                see exactly what was left.&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3 border-t border-white/5 pt-4">
                <div className="w-9 h-9 rounded-full bg-[#12121e] border border-white/10 flex items-center justify-center font-bold text-[#c7d2fe] text-xs">V</div>
                <div className="text-xs">
                  <strong className="block text-white">MCA Student</strong>
                  <span className="text-[#5b5f78]">Nadiad</span>
                </div>
              </figcaption>
            </figure>
          </RevealOnScroll>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="faq">
        <RevealOnScroll>
          <span className="eyebrow center block">FAQ</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12">Questions, answered</h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1} className="max-w-[760px] mx-auto faq-list">
          <details>
            <summary className="faq-summary">How does Gyan actually answer a question? <ChevronDown className="h-4 w-4 text-[#c7d2fe]" /></summary>
            <p className="text-xs md:text-sm text-[#9aa0b8] mt-3 leading-relaxed">
              It runs a three-step pipeline: classify the intent, retrieve matching chunks from AVPU&apos;s
              syllabus and policy knowledge base, then write an answer grounded in what it found. If nothing
              matches, it says so instead of guessing.
            </p>
          </details>

          <details>
            <summary className="faq-summary">Can I track my study history over time? <ChevronDown className="h-4 w-4 text-[#c7d2fe]" /></summary>
            <p className="text-xs md:text-sm text-[#9aa0b8] mt-3 leading-relaxed">
              Yes. Tutor chats, assessment scores and generated roadmaps are saved to your account so you can
              pick up where you left off.
            </p>
          </details>

          <details>
            <summary className="faq-summary">How does the placement matcher work? <ChevronDown className="h-4 w-4 text-[#c7d2fe]" /></summary>
            <p className="text-xs md:text-sm text-[#9aa0b8] mt-3 leading-relaxed">
              It compares the skills and interests you enter against the skill requirements listed for each
              hiring partner in AVPU&apos;s database, then shows a match score and the specific gaps.
            </p>
          </details>

          <details>
            <summary className="faq-summary">Is the AI Tutor free to try? <ChevronDown className="h-4 w-4 text-[#c7d2fe]" /></summary>
            <p className="text-xs md:text-sm text-[#9aa0b8] mt-3 leading-relaxed">
              Yes — the demo on this page and the WhatsApp tutor are both free to use. An account is only
              needed to save your history and roadmaps.
            </p>
          </details>
        </RevealOnScroll>
      </section>

      {/* Contact Section */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="contact">
        <div className="bg-[#12121e] border border-white/5 rounded-2xl p-8 relative overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.1),transparent_60%)] pointer-events-none" />

          <div className="relative z-10 max-w-[640px] w-full text-center flex flex-col items-center">
            <span className="eyebrow">GET IN TOUCH</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Questions about a program or Gyan?</h2>
            <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mb-8">
              Reach the registrar&apos;s office directly, or tell us what Gyan got wrong — we use every
              report to improve the syllabus grounding.
            </p>

            <form onSubmit={handleContactSubmit} className="w-full flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Your Name"
                  required
                  className="w-full px-4 py-3 bg-[#0d0d16] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#6366f1]"
                />
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Your Email"
                  required
                  className="w-full px-4 py-3 bg-[#0d0d16] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#6366f1]"
                />
              </div>
              <input
                type="text"
                value={contactSubject}
                onChange={(e) => setContactSubject(e.target.value)}
                placeholder="Subject"
                required
                className="w-full px-4 py-3 bg-[#0d0d16] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#6366f1]"
              />
              <textarea
                rows={4}
                value={contactMsg}
                onChange={(e) => setContactMsg(e.target.value)}
                placeholder="Message or Inquiry..."
                required
                className="w-full px-4 py-3 bg-[#0d0d16] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#6366f1] resize-none"
              />
              <button
                type="submit"
                className="btn w-full bg-gradient-to-r from-[#6366f1] to-[#3b82f6] text-white font-semibold py-3 rounded-lg hover:scale-[1.01] transition-all cursor-pointer"
              >
                Send Message
              </button>
              {feedbackMsg && <p className="text-xs text-[#6ee7b7] font-semibold mt-2 flex items-center gap-1.5 justify-center"><CheckCircle2 className="h-3.5 w-3.5" />{feedbackMsg}</p>}
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
