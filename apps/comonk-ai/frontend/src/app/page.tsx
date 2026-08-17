"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Upload,
  FileText,
  ArrowRight,
  Bot,
  Target,
  TrendingUp,
  Shield,
  Zap,
  Award,
  Users,
  Building2,
  Loader2,
} from "lucide-react";
import { api } from "@/lib/api";
import { AuthModal } from "@/components/AuthModal";
import { PersonaAvatar } from "@/components/PersonaAvatar";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { GlowCard } from "@/components/GlowCard";

interface Stats {
  companies: number;
  hr_contacts: number;
  ai_tools: number;
}

const FEATURES = [
  { icon: Bot, title: "AI Career Counselor", desc: "24/7 chat with an AI that knows your resume, goals, and the job market." },
  { icon: Target, title: "Company Matching", desc: "AI-scored matches across our verified company + HR contact database." },
  { icon: TrendingUp, title: "ATS Optimizer", desc: "Beat applicant tracking systems with keyword + grammar analysis." },
  { icon: Award, title: "Mock Interviews", desc: "Voice and text-based practice interviews with instant AI feedback." },
  { icon: FileText, title: "Resume Studio", desc: "AI resume rewriting, cover letters, and JD gap analysis." },
  { icon: Zap, title: "Autopilot Agent", desc: "Finds companies and drafts outreach emails for your approval." },
  { icon: Shield, title: "Salary Insights", desc: "Real market data by role, experience, and city." },
  { icon: Users, title: "Network Log", desc: "Track every recruiter and contact you've reached out to." },
  { icon: Building2, title: "GitHub Analyzer", desc: "AI-scored portfolio strength from your public repos." },
  { icon: Sparkles, title: "Learning Hub", desc: "Curated courses, roadmaps, and cheat sheets for your stack." },
  { icon: Target, title: "Skill Heatmap", desc: "See which skills are most in-demand right now, live from job data." },
  { icon: Award, title: "Aptitude Test", desc: "Get Comonk Verified and unlock direct HR contact details." },
];

const STEPS = [
  { n: "01", title: "Upload your resume", desc: "Drop a PDF or try our demo profile — no signup needed to see it work." },
  { n: "02", title: "AI parses everything", desc: "Skills, experience, and target role extracted in seconds." },
  { n: "03", title: "Get matched", desc: "See companies, HR contacts, and a personalized career score." },
  { n: "04", title: "Use every tool, free", desc: "Mock interviews, ATS checks, outreach — all 100% free, forever." },
];

export default function LandingPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api("GET", "/api/stats")
      .then((d) => setStats(d))
      .catch(() => setStats({ companies: 500, hr_contacts: 2000, ai_tools: 32 }));
  }, []);

  function goApp() {
    window.location.href = "/app/";
  }

  async function handleFile(file: File) {
    if (file.type !== "application/pdf") {
      setUploadError("Please upload a PDF resume.");
      return;
    }
    setUploading(true);
    setUploadError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const profile = await api("POST", "/api/parse-resume", form, true);
      sessionStorage.setItem("comonk_pending_profile", JSON.stringify(profile));
      if (typeof window !== "undefined" && localStorage.getItem("comonk_token")) {
        goApp();
      } else {
        setAuthTab("register");
        setAuthOpen(true);
      }
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Couldn't parse that resume — try again.");
    } finally {
      setUploading(false);
    }
  }

  function tryDemo() {
    sessionStorage.setItem("comonk_demo_profile", "1");
    if (typeof window !== "undefined" && localStorage.getItem("comonk_token")) {
      goApp();
    } else {
      setAuthTab("register");
      setAuthOpen(true);
    }
  }

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#060609]/80 border-b border-white/5">
        <div className="max-w-[1180px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-lg">
            <span className="grad">Comonk AI</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setAuthTab("login"); setAuthOpen(true); }}
              className="text-sm font-semibold text-[#9090b0] hover:text-white transition-colors cursor-pointer bg-transparent border-none"
            >
              Login
            </button>
            <button
              onClick={() => { setAuthTab("register"); setAuthOpen(true); }}
              className="text-sm font-bold text-white px-4 py-2 rounded-lg cursor-pointer border-none"
              style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-24 px-6">
        <div className="mesh-bg" />
        <div className="hero-grid" />
        <div className="relative max-w-[1180px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex justify-center mb-2"
          >
            <PersonaAvatar size={190} primary="#8b5cf6" secondary="#c4b5fd" accessory="spark" name="Cora" role="Career Copilot" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-[#a78bfa] mb-6"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Meet Cora — 100% Free Career Intelligence, No Catch
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-6"
          >
            Your career,
            <br />
            <span className="grad">upgraded by AI.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-[#9090b0] max-w-2xl mx-auto mb-10"
          >
            Resume parsing, company matching, mock interviews, ATS optimization, and 30+ more
            AI tools — built to get you hired, free forever.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className={`max-w-xl mx-auto rounded-2xl border-2 border-dashed p-10 transition-all cursor-pointer ${
              dragActive ? "border-[#7c3aed] bg-[#7c3aed]/5" : "border-white/15 bg-white/[0.02] hover:border-white/25"
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            {uploading ? (
              <Loader2 className="h-10 w-10 mx-auto mb-3 animate-spin text-[#a78bfa]" />
            ) : (
              <Upload className="h-10 w-10 mx-auto mb-3 text-[#9090b0]" />
            )}
            <p className="font-bold mb-1">{uploading ? "Parsing your resume…" : "Drop your resume (PDF)"}</p>
            <p className="text-sm text-[#55556a]">or click to browse</p>
            {uploadError && <p className="text-sm text-[#fca5a5] mt-3">{uploadError}</p>}
          </motion.div>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            onClick={tryDemo}
            className="mt-4 text-sm font-semibold text-[#93c5fd] hover:underline cursor-pointer bg-transparent border-none inline-flex items-center gap-1.5"
          >
            Or try a demo profile <ArrowRight className="h-3.5 w-3.5" />
          </motion.button>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16">
            <div>
              <div className="text-3xl font-black grad">
                <AnimatedCounter value={stats?.companies ?? 500} />+
              </div>
              <div className="text-xs text-[#55556a] mt-1">Companies</div>
            </div>
            <div>
              <div className="text-3xl font-black grad">
                <AnimatedCounter value={stats?.hr_contacts ?? 2000} />+
              </div>
              <div className="text-xs text-[#55556a] mt-1">HR Contacts</div>
            </div>
            <div>
              <div className="text-3xl font-black grad">
                <AnimatedCounter value={stats?.ai_tools ?? 32} />
              </div>
              <div className="text-xs text-[#55556a] mt-1">AI Tools</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-[1180px] mx-auto">
          <RevealOnScroll>
            <h2 className="text-3xl font-black text-center mb-3">Everything you need to get hired</h2>
            <p className="text-[#9090b0] text-center mb-14">32 AI-powered tools. Zero subscription fees.</p>
          </RevealOnScroll>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <RevealOnScroll key={f.title} delay={i * 0.04}>
                <GlowCard className="tcard h-full">
                  <f.icon className="h-6 w-6 text-[#a78bfa] mb-3" />
                  <h3 className="font-bold mb-1.5">{f.title}</h3>
                  <p className="text-sm text-[#9090b0]">{f.desc}</p>
                </GlowCard>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-[1180px] mx-auto">
          <RevealOnScroll>
            <h2 className="text-3xl font-black text-center mb-14">How it works</h2>
          </RevealOnScroll>
          <div className="grid md:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <RevealOnScroll key={s.n} delay={i * 0.08}>
                <div>
                  <div className="text-4xl font-black text-white/10 mb-2">{s.n}</div>
                  <h3 className="font-bold mb-1.5">{s.title}</h3>
                  <p className="text-sm text-[#9090b0]">{s.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 border-t border-white/5">
        <RevealOnScroll>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-black mb-4">Ready to upgrade your job search?</h2>
            <p className="text-[#9090b0] mb-8">No credit card. No trial period. Just free, forever.</p>
            <button
              onClick={() => { setAuthTab("register"); setAuthOpen(true); }}
              className="text-base font-bold text-white px-8 py-3.5 rounded-xl cursor-pointer border-none inline-flex items-center gap-2"
              style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
            >
              Get Started Free <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </RevealOnScroll>
      </section>

      <footer className="px-6 py-10 border-t border-white/5 text-center text-xs text-[#55556a]">
        Comonk AI — 100% Free Career Intelligence
      </footer>

      {authOpen && (
        <AuthModal
          initialTab={authTab}
          onClose={() => setAuthOpen(false)}
          onSuccess={goApp}
        />
      )}
    </div>
  );
}
