"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { GlowCard } from "@/components/GlowCard";
import { AIDemoWidget } from "@/components/AIDemoWidget";
import {
  HeartPulse, Pill, ShieldCheck, MapPin, Phone, Siren,
  IndianRupee, CalendarCheck, ScanLine, Languages, Leaf,
  ChevronDown, ArrowRight, Star, Clock, Gift,
} from "lucide-react";

// ── Data (mirrors backend features.py) ─────────────────────
const CAMPS_PREVIEW = [
  { title: "Free Eye Checkup & Surgery Camp", city: "Ahmedabad", date: "5 Aug",  cat: "Eye Care"   },
  { title: "Mega Blood Donation Drive",        city: "Surat",     date: "12 Aug", cat: "Blood"      },
  { title: "Preventive Cardiac Care Camp",     city: "Rajkot",    date: "20 Aug", cat: "Cardiology" },
  { title: "Maternal & Pediatrics Checkup",    city: "Vadodara",  date: "27 Aug", cat: "Pediatrics" },
  { title: "Free Dental & Diabetes Screening", city: "Bhavnagar", date: "2 Sep",  cat: "Dental"     },
];

const SCHEMES_PREVIEW = [
  { name: "PM-JAY (Ayushman Bharat)",             coverage: "₹5,00,000 / family / year",      elig: "BPL & low-income households"     },
  { name: "Mukhyamantri Amrutam Yojana",          coverage: "₹5,00,000 / family / year",      elig: "Gujarat families, income < ₹4L"  },
  { name: "PM Bhartiya Janaushadhi Pariyojana",   coverage: "50–90% off generic medicines",   elig: "Open to all citizens"             },
  { name: "Bal Sakha Yojana",                     coverage: "Free neonatal ICU care",          elig: "BPL & SC/ST infants, Gujarat"    },
  { name: "Gujarat Free Diagnostic Services",     coverage: "Free labs, ECG, X-ray, ultrasound", elig: "Any government hospital visit" },
];

const ER_HOSPITALS = [
  { name: "Civil Hospital & Emergency Center", city: "Ahmedabad", ph: "+91 79 2268 3721" },
  { name: "Apollo Emergency Care",              city: "Gandhinagar", ph: "+91 79 6670 1800" },
  { name: "SVP Metropolitan Hospital",          city: "Ahmedabad", ph: "+91 79 2657 7621" },
];

// ════════════════════════════════════════════════════════════
//  ECG HEALTH MONITOR VISUAL
// ════════════════════════════════════════════════════════════
function ECGMonitor() {
  const [t, setT] = useState(0);
  const rafRef = useRef<number>(0);
  const t0Ref = useRef<number | null>(null);

  // Animate t from 0→1 in 2.5s on repeat
  useEffect(() => {
    const tick = (now: number) => {
      if (!t0Ref.current) t0Ref.current = now;
      const elapsed = ((now - t0Ref.current) % 2500) / 2500;
      setT(elapsed);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // ECG SVG path: P wave → QRS complex → T wave, width 400, y-center 50
  const W = 400; const H = 100;
  const ecgPoints = (offset: number) => {
    const x0 = offset * W;
    // Build a simplified ECG shape
    const pts = [
      [0,    50],
      [30,   50],
      [40,   42],   // P wave start
      [50,   42],   // P wave top
      [60,   50],   // P wave end
      [80,   50],
      [85,   60],   // Q
      [90,   15],   // R peak
      [95,   65],   // S
      [100,  50],
      [120,  50],
      [130,  38],   // T wave
      [145,  36],
      [160,  50],
      [200,  50],   // back to baseline
    ];
    return pts.map(([px, py]) => `${(x0 + px) % W},${py}`).join(" ");
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-[rgba(16,185,129,0.2)] bg-[#020d06] shadow-[0_0_80px_rgba(16,185,129,0.06)]">
      {/* Monitor header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#061a0c] border-b border-[rgba(16,185,129,0.12)]">
        <div className="flex items-center gap-2">
          <div className="heartbeat-dot">
            <HeartPulse className="h-4 w-4 text-[#10b981]" />
          </div>
          <span className="text-[10px] font-mono font-bold text-[#10b981] uppercase tracking-widest">
            SANJEEVANI · HEALTH MONITOR
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute h-full w-full rounded-full bg-[#10b981] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]" />
          </span>
          <span className="text-[9px] font-mono text-[#6ee7b7]">LIVE</span>
        </div>
      </div>

      {/* ECG display */}
      <div className="relative bg-[#030e07] px-4 py-2">
        <svg width="100%" viewBox="0 0 400 100" preserveAspectRatio="xMidYMid meet" className="block">
          {/* Grid lines */}
          <defs>
            <pattern id="ecg-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(16,185,129,0.08)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="400" height="100" fill="url(#ecg-grid)" />

          {/* ECG trace – two copies for seamless loop */}
          <polyline
            points={ecgPoints(-t)}
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeLinejoin="round"
            style={{ filter: "drop-shadow(0 0 4px rgba(16,185,129,0.8))" }}
          />
          <polyline
            points={ecgPoints(1-t)}
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeLinejoin="round"
            opacity="0.5"
            style={{ filter: "drop-shadow(0 0 2px rgba(16,185,129,0.4))" }}
          />

          {/* Scanning cursor */}
          <line
            x1={t * W} y1="0" x2={t * W} y2="100"
            stroke="rgba(16,185,129,0.35)"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Vitals row */}
      <div className="grid grid-cols-4 border-t border-[rgba(16,185,129,0.12)] bg-[#061a0c]">
        {[
          { label: "Heart Rate", value: "72", unit: "bpm", color: "#ef4444" },
          { label: "SpO₂",       value: "98", unit: "%",   color: "#10b981" },
          { label: "BP",         value: "118/76", unit: "",  color: "#3b82f6" },
          { label: "Temp",       value: "36.8", unit: "°C",  color: "#f59e0b" },
        ].map((v, i) => (
          <div key={i} className="py-2.5 px-2 border-r border-[rgba(16,185,129,0.1)] last:border-0 text-center">
            <div className="text-[8px] font-mono text-[#4d7a60] uppercase tracking-wider mb-0.5">{v.label}</div>
            <div className="text-[12px] font-mono font-bold" style={{ color: v.color }}>
              {v.value}<span className="text-[9px] ml-0.5 opacity-70">{v.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Prescription scanner demo */}
      <div className="p-4 border-t border-[rgba(16,185,129,0.1)]">
        <div className="text-[9px] font-mono text-[#4d7a60] uppercase tracking-wider mb-2">PRESCRIPTION SCANNER · OCR ACTIVE</div>
        <div className="rounded-lg border border-[rgba(16,185,129,0.15)] bg-[#030e07] p-3 text-xs font-mono">
          <div className="flex items-start gap-2">
            <ScanLine className="h-4 w-4 text-[#10b981] flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-[#6ee7b7] font-semibold">Detected: </span>
              <span className="text-[#a7f3d0]">Metformin 500mg + Lisinopril 10mg</span>
              <br/>
              <span className="text-[#ef4444] text-[10px]">⚠ Interaction alert: monitor kidney function</span>
            </div>
          </div>
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
    setFeedbackMsg("Message received! A volunteer will respond shortly.");
    setContactName(""); setContactEmail(""); setContactMsg("");
  };

  return (
    <>
      <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />
      <Navbar />

      {/* ────────────────────────────────────────────────────
          HERO  –  Split: text ← | → ECG monitor
      ──────────────────────────────────────────────────── */}
      <header className="relative min-h-screen flex items-center overflow-hidden bg-[#020d06] pt-[var(--nav-h)]">
        <div className="forest-grid" />

        {/* Nature orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-20 w-[600px] h-[600px] rounded-full bg-[#10b981]/6 blur-[130px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[#14b8a6]/4 blur-[120px]" />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-[#10b981]/3 blur-[80px]" />
        </div>

        <div className="relative z-10 w-full max-w-[var(--maxw)] mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* LEFT */}
          <div className="flex flex-col gap-7">
            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
              <span className="eyebrow">
                <Leaf className="h-3 w-3" />
                Free Healthcare · No Account Needed
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity:0, y:28 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.7, delay:0.08, ease:[0.22,1,0.36,1] }}
              className="text-4xl sm:text-5xl xl:text-[4.2rem] font-black leading-[1.04] tracking-tighter text-white"
            >
              Healthcare that&apos;s<br/>
              finally <span className="grad">actually free.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.6, delay:0.18, ease:[0.22,1,0.36,1] }}
              className="text-base md:text-lg text-[#a7f3d0] leading-relaxed max-w-[480px]"
            >
              Sanjeevani reads your prescription, flags unsafe drug interactions, finds free health 
              camps near you, and connects you with government schemes — completely free, no account needed.
            </motion.p>

            <motion.div
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.6, delay:0.26 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/app/" className="btn-primary">
                <HeartPulse className="h-4 w-4" />
                Open Health Portal
              </Link>
              <a href="#camps" className="btn-ghost">
                <CalendarCheck className="h-4 w-4" />
                Find free health camps
              </a>
            </motion.div>

            {/* Feature chips */}
            <motion.div
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              transition={{ delay:0.42 }}
              className="flex flex-wrap gap-2.5"
            >
              {["Prescription OCR","Drug Interactions","Free Camps","Govt Schemes","Emergency SOS","Multilingual"].map((tag, i) => (
                <span key={i} className="text-[10px] font-mono font-semibold px-3 py-1.5 rounded-full bg-[rgba(16,185,129,0.06)] border border-[rgba(16,185,129,0.2)] text-[#6ee7b7]">
                  ✦ {tag}
                </span>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: ECG monitor */}
          <motion.div
            initial={{ opacity:0, x:40 }}
            animate={{ opacity:1, x:0 }}
            transition={{ duration:0.8, delay:0.35, ease:[0.22,1,0.36,1] }}
          >
            <ECGMonitor />
          </motion.div>
        </div>

        <a href="#stats" className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[#4d7a60] hover:text-[#10b981] transition-colors">
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </a>
      </header>

      {/* ── STATS BAND ─────────────────────────────────────── */}
      <section id="stats" className="bg-[#061a0c] border-y border-[rgba(16,185,129,0.1)]">
        <div className="max-w-[var(--maxw)] mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[rgba(16,185,129,0.1)]">
          {[
            { val:"100%", lbl:"Free — always, forever" },
            { val:"5+",   lbl:"Government schemes linked" },
            { val:"50+",  lbl:"Free health camps per month" },
            { val:"BYOK", lbl:"Your API key, unlimited use" },
          ].map((s, i) => (
            <div key={i} className="px-6 md:px-10 py-8 flex flex-col gap-1">
              <div className="text-2xl md:text-3xl font-black text-white">{s.val}</div>
              <div className="text-xs text-[#4d7a60] leading-snug">{s.lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className="max-w-[var(--maxw)] mx-auto py-24 px-6 md:px-12" id="features">
        <RevealOnScroll>
          <div className="text-center mb-14">
            <span className="eyebrow center mb-4">CAPABILITIES</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-4">
              Everything healthcare,<br className="hidden md:block"/> completely free
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon:Pill,          color:"#10b981", badge:"AI OCR",     title:"Prescription Scanner",   desc:"Upload a photo of any prescription. Sanjeevani reads it, explains each drug in plain language, and checks for dangerous interactions." },
            { icon:ShieldCheck,   color:"#3b82f6", badge:"Safety",     title:"Drug Interaction Check", desc:"Cross-references your medications against a real database. Flags unsafe combinations with clear explanations and alternatives." },
            { icon:MapPin,        color:"#f59e0b", badge:"Nearby",     title:"Health Camp Locator",    desc:"Find free health camps, blood donation drives, and eye checkup camps near you — updated monthly for Gujarat districts." },
            { icon:IndianRupee,   color:"#a855f7", badge:"Govt",       title:"Scheme Eligibility",     desc:"Check which PM-JAY, Amrutam, or other government health schemes you qualify for. Instant eligibility assessment in your language." },
            { icon:Siren,         color:"#ef4444", badge:"Emergency",  title:"Emergency SOS",          desc:"One-tap access to the nearest emergency hospital, their contact numbers, and directions. Works without login." },
            { icon:Languages,     color:"#14b8a6", badge:"Multilingual",title:"Hindi & Gujarati",      desc:"Full support in Hindi, Gujarati, and English. Ask health questions in your language and get answers you can actually understand." },
          ].map(({ icon: Icon, color, badge, title, desc }, i) => (
            <RevealOnScroll key={i} delay={i * 0.06}>
              <GlowCard className="glow-card bg-[#061a0c] border border-[rgba(16,185,129,0.08)] rounded-2xl p-6 h-full flex flex-col gap-4">
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
                  <p className="text-sm text-[#a7f3d0] leading-relaxed opacity-80">{desc}</p>
                </div>
              </GlowCard>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* ── UPCOMING HEALTH CAMPS ─────────────────────────── */}
      <section className="bg-[#061a0c] py-20 px-6 md:px-12" id="camps">
        <div className="max-w-[var(--maxw)] mx-auto">
          <RevealOnScroll>
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="eyebrow mb-3">UPCOMING EVENTS</span>
                <h2 className="text-3xl md:text-4xl font-black text-white mt-3">Free health camps near you</h2>
              </div>
              <Link href="/app/" className="hidden md:inline-flex btn-ghost text-sm">
                View all camps <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CAMPS_PREVIEW.map((camp, i) => (
              <RevealOnScroll key={i} delay={i * 0.05}>
                <GlowCard className="glow-card bg-[#030e07] border border-[rgba(16,185,129,0.1)] rounded-2xl p-5 flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-[rgba(16,185,129,0.1)] flex items-center justify-center flex-shrink-0 border border-[rgba(16,185,129,0.2)]">
                    <CalendarCheck className="h-5 w-5 text-[#10b981]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[rgba(16,185,129,0.12)] text-[#10b981] uppercase">{camp.cat}</span>
                      <span className="text-[9px] font-mono text-[#4d7a60]">{camp.date}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-white leading-snug">{camp.title}</h3>
                    <p className="text-[11px] text-[#4d7a60] mt-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {camp.city}
                    </p>
                  </div>
                </GlowCard>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── GOVERNMENT SCHEMES ───────────────────────────── */}
      <section className="max-w-[var(--maxw)] mx-auto py-20 px-6 md:px-12" id="schemes">
        <RevealOnScroll>
          <div className="text-center mb-10">
            <span className="eyebrow center mb-4">GOVERNMENT SCHEMES</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">Benefits you may be missing</h2>
            <p className="text-[#a7f3d0] mt-3 max-w-[500px] mx-auto text-sm opacity-80">
              Most families qualify for ₹5 lakh+ in free coverage. Sanjeevani checks your eligibility instantly.
            </p>
          </div>
        </RevealOnScroll>

        <div className="flex flex-col gap-3">
          {SCHEMES_PREVIEW.map((s, i) => (
            <RevealOnScroll key={i} delay={i * 0.04}>
              <GlowCard className="glow-card bg-[#061a0c] border border-[rgba(16,185,129,0.1)] rounded-2xl p-5 flex items-center gap-5 flex-wrap">
                <div className="w-10 h-10 rounded-lg bg-[rgba(245,158,11,0.1)] flex items-center justify-center flex-shrink-0">
                  <Gift className="h-5 w-5 text-[#f59e0b]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm">{s.name}</h3>
                  <p className="text-[11px] text-[#4d7a60] mt-0.5">{s.elig}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-[#6ee7b7]">{s.coverage}</span>
                </div>
              </GlowCard>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* ── AI DEMO WIDGET ────────────────────────────────── */}
      <section className="bg-[#061a0c] py-20 px-6 md:px-12" id="ai-demo">
        <div className="max-w-[var(--maxw)] mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <span className="eyebrow center mb-4">ASK SANJEEVANI</span>
              <h2 className="text-3xl md:text-4xl font-black text-white mt-3">Try it free, right now</h2>
              <p className="text-[#a7f3d0] mt-3 max-w-[460px] mx-auto text-sm opacity-80">
                Add your API key and ask any health question — drug interactions, camp locations, scheme eligibility.
              </p>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <AIDemoWidget />
          </RevealOnScroll>
        </div>
      </section>

      {/* ── EMERGENCY CONTACTS ───────────────────────────── */}
      <section className="max-w-[var(--maxw)] mx-auto py-16 px-6 md:px-12" id="emergency">
        <RevealOnScroll>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[rgba(239,68,68,0.12)] flex items-center justify-center">
              <Siren className="h-5 w-5 text-[#ef4444]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Emergency Hospitals</h2>
              <p className="text-sm text-[#4d7a60]">Verified contacts — available 24/7</p>
            </div>
          </div>
        </RevealOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ER_HOSPITALS.map((h, i) => (
            <RevealOnScroll key={i} delay={i * 0.05}>
              <GlowCard className="glow-card bg-[#061a0c] border border-[rgba(239,68,68,0.15)] rounded-2xl p-5">
                <h3 className="font-semibold text-white text-sm mb-1">{h.name}</h3>
                <p className="text-[11px] text-[#4d7a60] mb-3 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {h.city}
                </p>
                <a href={`tel:${h.ph.replace(/\s/g,'')}`}
                  className="inline-flex items-center gap-2 text-[#ef4444] font-mono font-bold text-sm hover:underline">
                  <Phone className="h-4 w-4" /> {h.ph}
                </a>
              </GlowCard>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* ── CONTACT CTA ──────────────────────────────────── */}
      <section className="max-w-[var(--maxw)] mx-auto py-16 px-6 md:px-12" id="contact">
        <RevealOnScroll>
          <GlowCard className="glow-card bg-[#061a0c] border border-[rgba(16,185,129,0.1)] rounded-2xl p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(16,185,129,0.08),transparent_55%)] pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#10b981]/40 to-transparent" />
            <div className="relative z-10 max-w-[540px] mx-auto text-center">
              <span className="eyebrow center mb-5">CONTACT US</span>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 mt-4">Have health questions?</h2>
              <p className="text-sm text-[#a7f3d0] mb-8 opacity-80">
                Our team of healthcare volunteers responds to queries and helps you find the right scheme or camp.
              </p>
              <form onSubmit={onContact} className="flex flex-col gap-3 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" value={contactName} onChange={e => setContactName(e.target.value)}
                    placeholder="Your Name" required
                    className="px-4 py-3 bg-[#020d06] border border-[rgba(16,185,129,0.15)] rounded-xl text-sm text-white focus:outline-none focus:border-[#10b981] transition-colors placeholder:text-[#4d7a60]" />
                  <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)}
                    placeholder="Your Email" required
                    className="px-4 py-3 bg-[#020d06] border border-[rgba(16,185,129,0.15)] rounded-xl text-sm text-white focus:outline-none focus:border-[#10b981] transition-colors placeholder:text-[#4d7a60]" />
                </div>
                <textarea rows={3} value={contactMsg} onChange={e => setContactMsg(e.target.value)}
                  placeholder="Your health question or request for assistance…" required
                  className="px-4 py-3 bg-[#020d06] border border-[rgba(16,185,129,0.15)] rounded-xl text-sm text-white focus:outline-none focus:border-[#10b981] transition-colors placeholder:text-[#4d7a60] resize-none" />
                <button type="submit" className="btn-primary w-full text-base">
                  Send Message
                </button>
                {feedbackMsg && <p className="text-xs text-[#10b981] font-semibold text-center">{feedbackMsg}</p>}
              </form>
            </div>
          </GlowCard>
        </RevealOnScroll>
      </section>

      <Footer />
    </>
  );
}
