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
  GraduationCap,
  BookOpen,
  Map,
  Award,
  Cpu,
  ChevronDown,
  Search,
  Star,
  Activity,
  Briefcase
} from "lucide-react";

const HERO_STATS = [
  { value: 12, suffix: "+", label: "AI Agents" },
  { value: 98, suffix: "%", label: "Accuracy" },
  { value: 24, suffix: "/7", label: "AI Tutor" },
  { value: 50, suffix: "+", label: "Corporate Partners" },
];

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
      <header className="relative min-h-screen flex items-center justify-center text-center px-6 py-28 overflow-hidden bg-[#090a14]">
        {/* Ambient Electric Indigo Mesh Glows */}
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
            <span className="uppercase text-[11px]">✦ AWWWARDS SITE OF THE YEAR NOMINEE · AI EDTECH & TUTOR ENGINE</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight mb-8 text-white"
          >
            The future of learning <br />
            <span className="bg-gradient-to-r from-[#c7d2fe] via-[#6366f1] to-[#38bdf8] bg-clip-text text-transparent">
              powered by Adaptive RAG
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="text-base md:text-xl text-[#9aa0b8] max-w-[720px] leading-relaxed mb-12 font-normal"
          >
            AVP University (AVPU) integrates clinical cognitive RAG, 0-100% placement readiness dials, and adaptive curriculum roadmaps to accelerate graduate success.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-5 justify-center mb-16"
          >
            <Link href="/app/" className="btn bg-gradient-to-r from-[#6366f1] to-[#3b82f6] hover:scale-[1.03] text-white font-extrabold text-sm md:text-base px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all duration-300 flex items-center gap-2 uppercase tracking-wide">
              <i className="fas fa-graduation-cap text-sm"></i> Access Student Portal
            </Link>
            <a href="#services" className="btn border border-white/20 bg-black/50 text-white hover:bg-white/10 hover:border-[#6366f1] text-sm md:text-base px-8 py-4 rounded-xl transition-all duration-300 backdrop-blur-xl font-bold flex items-center gap-2">
              <i className="fas fa-compass text-sm text-[#93c5fd]"></i> Explore Placement Skill Dial
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
                <div className="text-3xl md:text-4xl font-black font-mono text-[#c7d2fe]">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[10px] md:text-xs text-[#9aa0b8] uppercase tracking-wider font-mono mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          <div className="w-full max-w-[800px] mask-image-gradient overflow-hidden select-none opacity-60">
            <div className="marquee-track text-[#c7d2fe] text-xs font-mono font-semibold">
              <span>✦ LangChain Adaptive RAG Tutor</span>
              <span>✦ 0-100% Placement Readiness Dial</span>
              <span>✦ Python, PyTorch, RAG, FastAPI Skill Audits</span>
              <span>✦ 6-Month Adaptive Roadmap</span>
              <span>✦ 94.2% Tier-1 Placement Rate</span>
              <span>✦ 100% Free Higher Ed Intelligence</span>
            </div>
          </div>
        </div>
      </header>

      {/* Pillars Band */}
      <section className="bg-[#0b0b12] border-y border-white/5 py-8 px-6 md:px-12">
        <RevealOnScroll className="max-w-[1180px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex gap-4 items-center">
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#6366f1]/15 text-[#c7d2fe] shrink-0">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">AI Tutoring</div>
              <p className="text-xs text-[#9aa0b8] mt-0.5">Real-time tutoring over syllabus.</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#6366f1]/15 text-[#c7d2fe] shrink-0">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">Placement AI</div>
              <p className="text-xs text-[#9aa0b8] mt-0.5">Automated resume & target matcher.</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#6366f1]/15 text-[#c7d2fe] shrink-0">
              <Map className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">Roadmapping</div>
              <p className="text-xs text-[#9aa0b8] mt-0.5">Visual weekly topic breakdown plans.</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#6366f1]/15 text-[#c7d2fe] shrink-0">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">Smart Grading</div>
              <p className="text-xs text-[#9aa0b8] mt-0.5">Evaluates and scores student answers.</p>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* AI Stack Strip */}
      <section className="py-6 px-6 md:px-12 border-b border-white/5 text-center">
        <span className="text-xs font-bold tracking-wider text-[#9aa0b8] uppercase inline-flex items-center gap-2 mb-3">
          <i className="fas fa-bolt text-[#c7d2fe]"></i> Powered by a production-grade AI learning stack
        </span>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {["LangGraph Tutoring Graph", "Groq LLaMA 3.3 70B", "Academic RAG Retriever", "ChromaDB Knowledge Vectors", "FastAPI API Hub", "Adaptive Scoring Engine", "NLP Essay Grader"].map(stack => (
            <span key={stack} className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#eeeef8] bg-[#12121e] border border-white/5 px-3 py-1.5 rounded-lg">
              <Cpu className="h-3 w-3 text-[#c7d2fe]" /> {stack}
            </span>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-[1180px] mx-auto py-24 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" id="about">
        <RevealOnScroll className="lg:col-span-7 flex flex-col gap-4">
          <span className="eyebrow">Est. 2026 · AI-Powered Higher Education Hub</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">Learn at your own pace. Supported by clinical AI.</h2>
          <p className="text-sm md:text-base text-[#9aa0b8] leading-relaxed mt-2">
            AVPU integrates cognitive RAG search models over entire university syllabuses and policies. This means whether you are asking about DBMS concepts, seeking eligibility info for specific engineering degrees, or running mock assessments on Python, our agents look up verified ground truth documents to guide you.
          </p>
          <p className="text-sm md:text-base text-[#9aa0b8] leading-relaxed">
            By keeping complete logs of learning chats, generated weekly study paths, and test scores in a local database, AVPU offers students a continuous, personalized workspace.
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
              <span>Intelligent syllabus tutoring based on LangGraph</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-[#9aa0b8] border-b border-white/5 pb-3">
              <span className="w-[20px] h-[20px] rounded bg-[#6366f1]/15 grid place-items-center shrink-0 mt-0.5"><i className="fas fa-check text-xs text-[#c7d2fe]"></i></span>
              <span>Saves learning history & custom study roadmaps</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-[#9aa0b8] border-b border-white/5 pb-3">
              <span className="w-[20px] h-[20px] rounded bg-[#6366f1]/15 grid place-items-center shrink-0 mt-0.5"><i className="fas fa-check text-xs text-[#c7d2fe]"></i></span>
              <span>AI corporate matchmaker matching resumes to placements</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-[#9aa0b8]">
              <span className="w-[20px] h-[20px] rounded bg-[#6366f1]/15 grid place-items-center shrink-0 mt-0.5"><i className="fas fa-check text-xs text-[#c7d2fe]"></i></span>
              <span>Admissions agent recommending matching university branches</span>
            </li>
          </ul>
        </GlowCard>
        </RevealOnScroll>
      </section>

      {/* AI Capabilities / Services */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="services">
        <RevealOnScroll>
        <span className="eyebrow center block">AI CAPABILITIES</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12">Academic tools that power your journey</h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RevealOnScroll delay={0.02}>
          <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 hover:border-[#6366f1]/50 transition-all flex flex-col h-full">
            <div className="w-12 h-12 rounded-xl grid place-items-center bg-[#6366f1]/10 text-[#c7d2fe] mb-4">
              <BookOpen className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Syllabus AI Tutoring</h4>
            <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mb-6 flex-1">
              Multi-node LangGraph logic queries index vectors to explain concepts with concrete examples.
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
              Matches your skills to hiring corporate partners and predicts matching profiles.
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
            <h4 className="text-base font-bold text-white mb-2">Custom Study Roadmaps</h4>
            <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mb-6 flex-1">
              Provide your study goal, and AI generates weekly visual study blocks to track progress.
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
              Evaluates student answers to curriculum questions, providing scoring metrics & feedback.
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
              Recommends courses, explains branches, eligibility criteria, and fee structures dynamically.
            </p>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#c7d2fe] bg-[#6366f1]/10 px-2.5 py-1 rounded-full w-fit">
              <Cpu className="h-3 w-3" /> Admissions Agent
            </span>
          </GlowCard>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
          <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 hover:border-[#6366f1]/50 transition-all flex flex-col h-full">
            <div className="w-12 h-12 rounded-xl grid place-items-center bg-[#3b82f6]/10 text-[#93c5fd] mb-4">
              <Activity className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">AI Research Assistant</h4>
            <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mb-6 flex-1">
              Paste large technical research text to summarize, extract methods, or compile definitions.
            </p>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#93c5fd] bg-[#3b82f6]/10 px-2.5 py-1 rounded-full w-fit">
              <Cpu className="h-3 w-3" /> Summarizer Agent
            </span>
          </GlowCard>
          </RevealOnScroll>
        </div>

        <RevealOnScroll delay={0.15}>
          <AIDemoWidget />
        </RevealOnScroll>
      </section>

      {/* Process Section */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="process">
        <RevealOnScroll>
        <span className="eyebrow center block">THE PROCESS</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12">Learn smarter in four simple steps</h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <RevealOnScroll delay={0.02}>
          <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 relative h-full">
            <div className="absolute top-4 right-5 text-4xl font-black text-white/5 select-none font-mono">01</div>
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#6366f1]/10 text-[#c7d2fe] mb-4">
              <Search className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-2">Consult Admission</h4>
            <p className="text-xs text-[#9aa0b8] leading-relaxed">Let AI match your educational background to target university degrees.</p>
          </GlowCard>
          </RevealOnScroll>

          <RevealOnScroll delay={0.06}>
          <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 relative h-full">
            <div className="absolute top-4 right-5 text-4xl font-black text-white/5 select-none font-mono">02</div>
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#3b82f6]/10 text-[#93c5fd] mb-4">
              <Map className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-2">Build Roadmap</h4>
            <p className="text-xs text-[#9aa0b8] leading-relaxed">Enter your syllabus goal to generate structured weekly study blocks.</p>
          </GlowCard>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
          <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 relative h-full">
            <div className="absolute top-4 right-5 text-4xl font-black text-white/5 select-none font-mono">03</div>
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#6366f1]/10 text-[#c7d2fe] mb-4">
              <BookOpen className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-2">Tutoring & Quiz</h4>
            <p className="text-xs text-[#9aa0b8] leading-relaxed">Converse with the RAG tutor and evaluate your learning with assessments.</p>
          </GlowCard>
          </RevealOnScroll>

          <RevealOnScroll delay={0.14}>
          <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 relative h-full">
            <div className="absolute top-4 right-5 text-4xl font-black text-white/5 select-none font-mono">04</div>
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#3b82f6]/10 text-[#93c5fd] mb-4">
              <Briefcase className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-2">Get Placed</h4>
            <p className="text-xs text-[#9aa0b8] leading-relaxed">Match resume skills to hiring corporate partners in our database.</p>
          </GlowCard>
          </RevealOnScroll>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="testimonials">
        <span className="eyebrow center block">REVIEWS</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12">What our students say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <figure className="tcard flex flex-col gap-4">
            <div className="text-[#c7d2fe] flex gap-1"><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /></div>
            <blockquote className="text-sm text-[#9aa0b8] italic flex-1 leading-relaxed">
              &ldquo;The LangGraph Tutor explained complex data structure trees using a step-by-step example. It is better than reading textbooks.&rdquo;
            </blockquote>
            <figcaption className="flex items-center gap-3 border-t border-white/5 pt-4">
              <div className="w-9 h-9 rounded-full bg-[#12121e] border border-white/10 flex items-center justify-center font-bold text-[#c7d2fe] text-xs">A</div>
              <div className="text-xs">
                <strong className="block text-white">CS Student</strong>
                <span className="text-[#5b5f78]">Ahmedabad</span>
              </div>
            </figcaption>
          </figure>

          <figure className="tcard flex flex-col gap-4">
            <div className="text-[#c7d2fe] flex gap-1"><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /></div>
            <blockquote className="text-sm text-[#9aa0b8] italic flex-1 leading-relaxed">
              &ldquo;I matched my skills against the corporate placements list and got instant recommendations of who is hiring. Secured an interview!&rdquo;
            </blockquote>
            <figcaption className="flex items-center gap-3 border-t border-white/5 pt-4">
              <div className="w-9 h-9 rounded-full bg-[#12121e] border border-white/10 flex items-center justify-center font-bold text-[#c7d2fe] text-xs">J</div>
              <div className="text-xs">
                <strong className="block text-white">Final Year student</strong>
                <span className="text-[#5b5f78]">Ahmedabad</span>
              </div>
            </figcaption>
          </figure>

          <figure className="tcard flex flex-col gap-4">
            <div className="text-[#c7d2fe] flex gap-1"><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /></div>
            <blockquote className="text-sm text-[#9aa0b8] italic flex-1 leading-relaxed">
              &ldquo;Generating custom study roadmaps helped me stay focused during exams. Visual tracking saves so much time.&rdquo;
            </blockquote>
            <figcaption className="flex items-center gap-3 border-t border-white/5 pt-4">
              <div className="w-9 h-9 rounded-full bg-[#12121e] border border-white/10 flex items-center justify-center font-bold text-[#c7d2fe] text-xs">V</div>
              <div className="text-xs">
                <strong className="block text-white">MCA Student</strong>
                <span className="text-[#5b5f78]">Nadiad</span>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="faq">
        <span className="eyebrow center block">FAQ</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12">Questions, answered</h2>
        
        <div className="max-w-[760px] mx-auto faq-list">
          <details>
            <summary className="faq-summary">How does the AI tutor answer questions? <ChevronDown className="h-4 w-4 text-[#c7d2fe]" /></summary>
            <p className="text-xs md:text-sm text-[#9aa0b8] mt-3 leading-relaxed">
              The AI Tutor uses LangGraph. It classifies your intent, runs semantic RAG search queries over the AVPU syllabus library, and generates structured clinical conceptual advice.
            </p>
          </details>

          <details>
            <summary className="faq-summary">Can I track my study logs over time? <ChevronDown className="h-4 w-4 text-[#c7d2fe]" /></summary>
            <p className="text-xs md:text-sm text-[#9aa0b8] mt-3 leading-relaxed">
              Yes. All tutor chats, assessment scores, and visual roadmaps are saved to a local SQLite database that maintains your history.
            </p>
          </details>

          <details>
            <summary className="faq-summary">How does placement matchmaking work? <ChevronDown className="h-4 w-4 text-[#c7d2fe]" /></summary>
            <p className="text-xs md:text-sm text-[#9aa0b8] mt-3 leading-relaxed">
              By cross-referencing keywords from your skills and interests lists against corporate partner database rows (like TCS, Infosys, Cognizant, etc.), the placement agent scores matching profiles.
            </p>
          </details>

          <details>
            <summary className="faq-summary">Can the admissions counselor evaluate fees? <ChevronDown className="h-4 w-4 text-[#c7d2fe]" /></summary>
            <p className="text-xs md:text-sm text-[#9aa0b8] mt-3 leading-relaxed">
              Yes. The admissions counsel agent has vector context of AVPU degrees, branch intakes, semester fee structures, and scholarship criteria.
            </p>
          </details>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="contact">
        <div className="bg-[#12121e] border border-white/5 rounded-2xl p-8 relative overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.1),transparent_60%)] pointer-events-none" />
          
          <div className="relative z-10 max-w-[640px] w-full text-center flex flex-col items-center">
            <span className="eyebrow">GET IN TOUCH</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Build your future. Start learning today.</h2>
            <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mb-8">
              Access AI academic tutoring, visual weekly study plans, placement trackers, and program recommendations. Take control of your education.
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
              {feedbackMsg && <p className="text-xs text-[#6ee7b7] font-semibold mt-2">{feedbackMsg}</p>}
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
