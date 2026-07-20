"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.18),transparent_60%)]" />
        <div className="hero-grid" />
        
        <div className="relative z-10 max-w-[900px] w-full flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-[#c7d2fe] bg-[#6366f1]/10 border border-[#6366f1]/25 mb-8">
            <Cpu className="h-3.5 w-3.5" />
            <span>AI Tutoring · Placement Matching · Career Roadmaps · Adaptive Assessments</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-6">
            The future of learning powered by <br /><span className="grad">adaptive AI</span>
          </h1>

          <p className="text-sm md:text-lg text-[#9aa0b8] max-w-[670px] leading-relaxed mb-10">
            AVP University (AVPU) integrates clinical cognitive RAG, real-time code execution matching, and automated career counseling agents to deliver tailored academic success.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <Link href="/app/" className="btn bg-gradient-to-r from-[#6366f1] to-[#3b82f6] hover:scale-[1.02] text-white font-semibold text-sm md:text-base px-6 py-3 rounded-lg shadow-[0_6px_22px_rgba(99,102,241,0.3)] transition-all duration-200">
              <i className="fas fa-rocket mr-2"></i> Access Student Portal
            </Link>
            <a href="#services" className="btn border border-white/15 bg-white/[0.03] text-white hover:bg-[#18182a] hover:border-[#6366f1]/50 text-sm md:text-base px-6 py-3 rounded-lg transition-all duration-200">
              <i className="fas fa-microchip mr-2"></i> Explore AI Agents
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center bg-[#12121e]/60 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md mb-12">
            <div className="px-6 md:px-8 py-5 text-center min-w-[120px]">
              <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#c7d2fe] to-[#93c5fd] bg-clip-text text-transparent">12+</div>
              <div className="text-[10px] md:text-xs text-[#9aa0b8] uppercase tracking-wider font-semibold mt-1">AI Agents</div>
            </div>
            <div className="w-[1px] self-stretch bg-white/5" />
            <div className="px-6 md:px-8 py-5 text-center min-w-[120px]">
              <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#c7d2fe] to-[#93c5fd] bg-clip-text text-transparent">98%</div>
              <div className="text-[10px] md:text-xs text-[#9aa0b8] uppercase tracking-wider font-semibold mt-1">Accuracy</div>
            </div>
            <div className="w-[1px] self-stretch bg-white/5" />
            <div className="px-6 md:px-8 py-5 text-center min-w-[120px]">
              <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#c7d2fe] to-[#93c5fd] bg-clip-text text-transparent">24/7</div>
              <div className="text-[10px] md:text-xs text-[#9aa0b8] uppercase tracking-wider font-semibold mt-1">AI Tutor</div>
            </div>
            <div className="w-[1px] self-stretch bg-white/5" />
            <div className="px-6 md:px-8 py-5 text-center min-w-[120px]">
              <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#c7d2fe] to-[#93c5fd] bg-clip-text text-transparent">50+</div>
              <div className="text-[10px] md:text-xs text-[#9aa0b8] uppercase tracking-wider font-semibold mt-1">Corporate Partners</div>
            </div>
          </div>

          <div className="w-full max-w-[760px] mask-image-gradient overflow-hidden select-none opacity-50">
            <div className="marquee-track text-[#5b5f78] text-xs font-mono font-semibold">
              <span>AI Learning Companion</span>
              <span>Placement Matcher</span>
              <span>Admissions Recommender</span>
              <span>Adaptive Assessments</span>
              <span>Custom Roadmaps</span>
              <span>Research Assistant</span>
              <span>Computer Science</span>
              <span>Business Administration</span>
              <span>AI & ML Specialization</span>
              <span>Data Science</span>
            </div>
          </div>
        </div>
      </header>

      {/* Pillars Band */}
      <section className="bg-[#0b0b12] border-y border-white/5 py-8 px-6 md:px-12">
        <div className="max-w-[1180px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
        </div>
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
        <div className="lg:col-span-7 flex flex-col gap-4">
          <span className="eyebrow">Est. 2026 · AI-Powered Higher Education Hub</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">Learn at your own pace. Supported by clinical AI.</h2>
          <p className="text-sm md:text-base text-[#9aa0b8] leading-relaxed mt-2">
            AVPU integrates cognitive RAG search models over entire university syllabuses and policies. This means whether you are asking about DBMS concepts, seeking eligibility info for specific engineering degrees, or running mock assessments on Python, our agents look up verified ground truth documents to guide you.
          </p>
          <p className="text-sm md:text-base text-[#9aa0b8] leading-relaxed">
            By keeping complete logs of learning chats, generated weekly study paths, and test scores in a local database, AVPU offers students a continuous, personalized workspace.
          </p>
        </div>
        <div className="lg:col-span-5 glow-card bg-gradient-to-br from-[#12121e] to-[#0d0d16] border border-white/5 rounded-2xl p-8">
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
        </div>
      </section>

      {/* AI Capabilities / Services */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="services">
        <span className="eyebrow center block">AI CAPABILITIES</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12">Academic tools that power your journey</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article className="bg-[#12121e] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-lg flex flex-col">
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
          </article>

          <article className="bg-[#12121e] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-lg flex flex-col">
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
          </article>

          <article className="bg-[#12121e] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-lg flex flex-col">
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
          </article>

          <article className="bg-[#12121e] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-lg flex flex-col">
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
          </article>

          <article className="bg-[#12121e] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-lg flex flex-col">
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
          </article>

          <article className="bg-[#12121e] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-lg flex flex-col">
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
          </article>
        </div>
      </section>

      {/* Process Section */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="process">
        <span className="eyebrow center block">THE PROCESS</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12">Learn smarter in four simple steps</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#12121e] border border-white/5 rounded-2xl p-6 relative">
            <div className="absolute top-4 right-5 text-4xl font-black text-white/5 select-none font-mono">01</div>
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#6366f1]/10 text-[#c7d2fe] mb-4">
              <Search className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-2">Consult Admission</h4>
            <p className="text-xs text-[#9aa0b8] leading-relaxed">Let AI match your educational background to target university degrees.</p>
          </div>

          <div className="bg-[#12121e] border border-white/5 rounded-2xl p-6 relative">
            <div className="absolute top-4 right-5 text-4xl font-black text-white/5 select-none font-mono">02</div>
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#3b82f6]/10 text-[#93c5fd] mb-4">
              <Map className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-2">Build Roadmap</h4>
            <p className="text-xs text-[#9aa0b8] leading-relaxed">Enter your syllabus goal to generate structured weekly study blocks.</p>
          </div>

          <div className="bg-[#12121e] border border-white/5 rounded-2xl p-6 relative">
            <div className="absolute top-4 right-5 text-4xl font-black text-white/5 select-none font-mono">03</div>
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#6366f1]/10 text-[#c7d2fe] mb-4">
              <BookOpen className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-2">Tutoring & Quiz</h4>
            <p className="text-xs text-[#9aa0b8] leading-relaxed">Converse with the RAG tutor and evaluate your learning with assessments.</p>
          </div>

          <div className="bg-[#12121e] border border-white/5 rounded-2xl p-6 relative">
            <div className="absolute top-4 right-5 text-4xl font-black text-white/5 select-none font-mono">04</div>
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#3b82f6]/10 text-[#93c5fd] mb-4">
              <Briefcase className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-2">Get Placed</h4>
            <p className="text-xs text-[#9aa0b8] leading-relaxed">Match resume skills to hiring corporate partners in our database.</p>
          </div>
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
