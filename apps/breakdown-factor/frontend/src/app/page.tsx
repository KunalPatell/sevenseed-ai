"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { GlowCard } from "@/components/GlowCard";
import { AIDemoWidget } from "@/components/AIDemoWidget";
import { ArgusAvatar } from "@/components/ArgusAvatar";
import {
  ChevronDown, Star, Shield, Zap, Clock, ScanLine,
  HardHat, FileText, AlertTriangle, Layers,
} from "lucide-react";

// ════════════════════════════════════════════════════════════
//  LIVE DEFECT SCANNER VISUAL
//  Shows a building elevation being scanned by the Argus model
// ════════════════════════════════════════════════════════════
const DEFECTS = [
  { id: 1, x: 8,  y: 12, w: 22, h: 18, label: "Wall Crack",   conf: 96, sev: "critical" },
  { id: 2, x: 56, y: 25, w: 18, h: 14, label: "Pipe Leak",    conf: 89, sev: "critical" },
  { id: 3, x: 74, y: 54, w: 16, h: 14, label: "Tile Damage",  conf: 94, sev: "medium"   },
  { id: 4, x: 22, y: 60, w: 20, h: 12, label: "Glass Break",  conf: 91, sev: "medium"   },
  { id: 5, x: 44, y: 72, w: 14, h: 12, label: "Wood Rot",     conf: 87, sev: "low"      },
] as const;

const SEV_COLORS: Record<string, string> = {
  critical: "#ef4444",
  medium:   "#f59e0b",
  low:      "#22c55e",
};

function DefectScannerVisual() {
  const [scanY, setScanY]           = useState(-5);
  const [visible, setVisible]       = useState<number[]>([]);
  const [phase, setPhase]           = useState<"scan" | "hold" | "reset">("scan");
  const rafRef  = useRef<number>(0);
  const t0Ref   = useRef<number | null>(null);
  const SCAN_MS = 4200;
  const HOLD_MS = 3000;

  const runScan = useCallback(() => {
    setScanY(-5); setVisible([]); setPhase("scan"); t0Ref.current = null;
    const tick = (now: number) => {
      if (!t0Ref.current) t0Ref.current = now;
      const pct = Math.min((now - t0Ref.current) / SCAN_MS, 1);
      const y = -5 + pct * 112;
      setScanY(y);
      setVisible(DEFECTS.filter(d => y > d.y + d.h).map(d => d.id));
      if (pct < 1) { rafRef.current = requestAnimationFrame(tick); }
      else {
        setPhase("hold");
        setTimeout(() => { setPhase("reset"); setTimeout(runScan, 600); }, HOLD_MS);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => { runScan(); return () => cancelAnimationFrame(rafRef.current); }, [runScan]);

  const found    = visible.length;
  const critical = DEFECTS.filter(d => d.sev === "critical" && visible.includes(d.id)).length;

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-[rgba(245,158,11,0.18)] bg-[#080603] shadow-[0_0_80px_rgba(245,158,11,0.06)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[rgba(255,255,255,0.05)]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute h-full w-full rounded-full bg-[#f59e0b] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f59e0b]" />
          </span>
          <span className="text-[10px] font-mono font-bold text-[#f59e0b] uppercase tracking-widest">ARGUS · YOLOv8 · best.pt</span>
        </div>
        <span className="text-[9px] font-mono text-[#7c7268]">
          {phase === "scan" ? "SCANNING..." : phase === "hold" ? `${found} DEFECTS FOUND` : "RELOADING..."}
        </span>
      </div>

      {/* Viewport */}
      <div className="relative" style={{ aspectRatio: "16/10" }}>
        {/* Blueprint grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(96,165,250,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(96,165,250,0.05) 1px,transparent 1px)`,
          backgroundSize: "28px 28px",
        }} />

        {/* Building elevation SVG */}
        <svg viewBox="0 0 800 500" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
          {/* Main tower */}
          <rect x="30" y="60" width="330" height="430" fill="rgba(20,12,5,0.7)" stroke="rgba(245,158,11,0.25)" strokeWidth="1.5"/>
          {[0,1,2,3,4,5].map(i => (
            <line key={`fl-${i}`} x1="30" y1={140+i*58} x2="360" y2={140+i*58} stroke="rgba(245,158,11,0.12)" strokeWidth="0.8"/>
          ))}
          {[0,1,2,3,4].map(row => [0,1,2].map(col => (
            <rect key={`w${row}-${col}`}
              x={55+col*90} y={78+row*58} width={52} height={38}
              fill="rgba(10,7,4,0.8)" stroke="rgba(245,158,11,0.18)" strokeWidth="0.8" rx="2"/>
          )))}
          {/* Door */}
          <rect x="165" y="430" width="60" height="60" fill="rgba(10,7,4,0.9)" stroke="rgba(245,158,11,0.3)" strokeWidth="1"/>

          {/* Annexe */}
          <rect x="440" y="150" width="310" height="340" fill="rgba(20,12,5,0.6)" stroke="rgba(245,158,11,0.18)" strokeWidth="1.2"/>
          {[0,1,2,3].map(i => (
            <line key={`af-${i}`} x1="440" y1={230+i*64} x2="750" y2={230+i*64} stroke="rgba(245,158,11,0.1)" strokeWidth="0.7"/>
          ))}
          {[0,1,2,3].map(row => [0,1,2].map(col => (
            <rect key={`aw${row}-${col}`}
              x={462+col*86} y={166+row*64} width={48} height={38}
              fill="rgba(10,7,4,0.8)" stroke="rgba(245,158,11,0.14)" strokeWidth="0.7" rx="2"/>
          )))}

          {/* Ground */}
          <line x1="0" y1="492" x2="800" y2="492" stroke="rgba(245,158,11,0.22)" strokeWidth="1.2"/>
          {/* Dimension arrows */}
          <text x="195" y="507" fill="rgba(245,158,11,0.45)" fontSize="9" fontFamily="monospace" textAnchor="middle">18m × 6 floors</text>
          <text x="595" y="507" fill="rgba(245,158,11,0.35)" fontSize="9" fontFamily="monospace" textAnchor="middle">ANNEXE</text>
        </svg>

        {/* Scan beam */}
        {phase === "scan" && (
          <div className="absolute left-0 right-0 pointer-events-none" style={{
            top: `${scanY}%`, height: "3px",
            background: "linear-gradient(90deg,transparent 0%,rgba(245,158,11,0.15) 15%,rgba(245,158,11,1) 50%,rgba(245,158,11,0.15) 85%,transparent 100%)",
            boxShadow: "0 0 18px rgba(245,158,11,0.7),0 0 60px rgba(245,158,11,0.2)",
            zIndex: 20,
          }}/>
        )}
        {/* Scan trail */}
        {phase === "scan" && scanY > 0 && (
          <div className="absolute left-0 right-0 top-0 pointer-events-none" style={{
            height: `${Math.max(0, scanY)}%`,
            background: "linear-gradient(180deg,rgba(245,158,11,0.04) 0%,transparent 100%)",
            zIndex: 5,
          }}/>
        )}

        {/* Defect overlays */}
        <AnimatePresence>
          {DEFECTS.map(d => visible.includes(d.id) && (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute"
              style={{
                left: `${d.x}%`, top: `${d.y}%`,
                width: `${d.w}%`, height: `${d.h}%`,
                border: `1.5px solid ${SEV_COLORS[d.sev]}`,
                boxShadow: `0 0 12px ${SEV_COLORS[d.sev]}40`,
                zIndex: 15,
              }}
            >
              <div className="absolute -top-5 left-0 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-sm whitespace-nowrap"
                style={{ background: `${SEV_COLORS[d.sev]}dd`, color: "#fff" }}>
                {d.label} {d.conf}%
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Status row */}
      <div className="grid grid-cols-4 border-t border-[rgba(255,255,255,0.05)]">
        {[
          { label: "DEFECTS", value: found.toString(), color: found > 0 ? "#ef4444" : "#22c55e" },
          { label: "CRITICAL", value: critical.toString(), color: critical > 0 ? "#ef4444" : "#22c55e" },
          { label: "MODEL", value: "YOLOv8", color: "#f59e0b" },
          { label: "STATUS", value: phase === "scan" ? "LIVE" : phase === "hold" ? "COMPLETE" : "READY", color: "#22c55e" },
        ].map((s, i) => (
          <div key={i} className="py-2 px-2 border-r border-[rgba(255,255,255,0.05)] last:border-0 text-center">
            <div className="text-[8px] font-mono text-[#7c7268] uppercase tracking-wider mb-0.5">{s.label}</div>
            <div className="text-[10px] font-mono font-bold" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
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
    setFeedbackMsg("Message received! We'll be in touch.");
    setContactName(""); setContactEmail(""); setContactMsg("");
  };

  return (
    <>
      <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />
      <Navbar />

      {/* ────────────────────────────────────────────────────
          HERO  –  Split layout: text ← | → live scanner
      ──────────────────────────────────────────────────── */}
      <header className="relative min-h-screen flex items-center overflow-hidden bg-[#060503] pt-[var(--nav-h)]">
        <div className="blueprint-grid" />

        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-[#f59e0b]/6 blur-[140px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[#ef4444]/4 blur-[120px]" />
        </div>

        <div className="relative z-10 w-full max-w-[var(--maxw)] mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div className="flex flex-col gap-7">
            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
              <span className="eyebrow">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-[#f59e0b] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f59e0b]" />
                </span>
                YOLOv8 · IS-456 · NBC 2016
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity:0, y:28 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.7, delay:0.08, ease:[0.22,1,0.36,1] }}
              className="text-4xl sm:text-5xl xl:text-[4.25rem] font-black leading-[1.04] tracking-tighter text-white"
            >
              Site defects,<br/>
              spotted before<br/>
              <span className="grad">they become claims.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.6, delay:0.18, ease:[0.22,1,0.36,1] }}
              className="text-base md:text-lg text-[#c8c0b8] leading-relaxed max-w-[480px]"
            >
              Argus scans construction photos using{" "}
              <code className="text-[#fef3c7] font-mono text-sm bg-white/5 px-1.5 py-0.5 rounded">best.pt</code>{" "}
              — flags cracks, pipe leaks, and MEP issues, then drafts IS-456 compliant repair reports and BOQ estimates instantly.
            </motion.p>

            <motion.div
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.6, delay:0.26 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/app/" className="btn-primary">
                <ScanLine className="h-4 w-4" />
                Launch Defect Scanner
              </Link>
              <a href="#tools" className="btn-ghost">
                <ChevronDown className="h-4 w-4" />
                See live demo
              </a>
            </motion.div>

            {/* Social proof chips */}
            <motion.div
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              transition={{ delay:0.4 }}
              className="flex flex-wrap gap-3"
            >
              {["IS 456 Compliant","Best.pt Model","90-Day Schedules","100% Free BYOK"].map((tag, i) => (
                <span key={i} className="text-[10px] font-mono font-semibold px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[#c8c0b8]">
                  ✦ {tag}
                </span>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: animated scanner */}
          <motion.div
            initial={{ opacity:0, x:40 }}
            animate={{ opacity:1, x:0 }}
            transition={{ duration:0.8, delay:0.35, ease:[0.22,1,0.36,1] }}
          >
            <DefectScannerVisual />
          </motion.div>
        </div>

        <a href="#stats" className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[#7c7268] hover:text-[#f59e0b] transition-colors">
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </a>
      </header>

      {/* ────────────────────────────────────────────────────
          STATS BAND
      ──────────────────────────────────────────────────── */}
      <section id="stats" className="bg-[#0d0a06] border-y border-white/[0.05]">
        <div className="max-w-[var(--maxw)] mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/[0.05]">
          {[
            { val: "10+",     lbl: "Defect classes detected by Argus" },
            { val: "IS-456",  lbl: "Structural code compliance built-in" },
            { val: "90-day",  lbl: "AI-generated project schedules" },
            { val: "BYOK",    lbl: "Free forever with your own key" },
          ].map((s, i) => (
            <div key={i} className="px-6 md:px-10 py-8 flex flex-col gap-1">
              <div className="text-2xl md:text-3xl font-black text-white">{s.val}</div>
              <div className="text-xs text-[#7c7268] leading-snug">{s.lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────
          FEATURES (3-col grid)
      ──────────────────────────────────────────────────── */}
      <section className="max-w-[var(--maxw)] mx-auto py-24 px-6 md:px-12" id="features">
        <RevealOnScroll>
          <div className="text-center mb-14">
            <span className="eyebrow center mb-4">CAPABILITIES</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-4 leading-tight">
              The complete construction<br className="hidden md:block"/> intelligence stack
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: ScanLine,    color:"#f59e0b", badge:"Core",       title:"YOLOv8 Defect Scanner",    desc:"Upload any site photo. Classifies 10 defect types — cracks, tiles, pipes, glass, wood — with confidence scores and repair specs." },
            { icon: FileText,    color:"#22c55e", badge:"Planning",    title:"BOQ Cost Estimator",       desc:"Enter area, floors, quality grade. Get precise material quantities (cement bags, TMT bars, tiles) with live market pricing." },
            { icon: Clock,       color:"#3b82f6", badge:"PM",          title:"90-Day Site Schedules",    desc:"Produces step-by-step Gantt timelines for residential and commercial builds to keep you on budget and on time." },
            { icon: Shield,      color:"#a855f7", badge:"Safety",      title:"Safety Audit Checklists",  desc:"Automated risk assessment and OSHA-aligned checklists for active construction sites to prevent costly accidents." },
            { icon: Layers,      color:"#f97316", badge:"Standards",   title:"IS Code Compliance",       desc:"Every report cross-references IS 456, IS 800, and NBC 2016. Structurally sound, always code-compliant." },
            { icon: Zap,         color:"#f59e0b", badge:"Open",        title:"BYOK — Free Forever",      desc:"Bring your own Gemini or OpenAI API key and run unlimited AI scans, estimates, and reports at zero cost." },
          ].map(({ icon: Icon, color, badge, title, desc }, i) => (
            <RevealOnScroll key={i} delay={i * 0.06}>
              <GlowCard className="glow-card bg-[#0d0a06] border border-white/5 rounded-2xl p-6 h-full flex flex-col gap-4">
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
                  <p className="text-sm text-[#c8c0b8] leading-relaxed">{desc}</p>
                </div>
              </GlowCard>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────
          ABOUT / ARGUS BIO
      ──────────────────────────────────────────────────── */}
      <section className="max-w-[var(--maxw)] mx-auto py-20 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center" id="about">
        <RevealOnScroll className="lg:col-span-7 flex flex-col gap-5">
          <span className="eyebrow">EST. 2026 · BREAKDOWN FACTOR</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            We build spaces that stand the test of time.
          </h2>
          <p className="text-sm md:text-base text-[#c8c0b8] leading-relaxed">
            Breakdown Factor works in synergy with <strong className="text-white">AVP University (AVPU)</strong>, 
            building student accommodation and lab spaces with structural diagnostics built into the process — 
            not bolted on after handover.
          </p>
          <p className="text-sm md:text-base text-[#c8c0b8] leading-relaxed">
            Argus, our inspection AI, scans site photos for structural cracks, wall damage, and MEP issues in 
            real-time. The same portal handles AI-driven budgeting, safety checklists, and timeline scheduling.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1} className="lg:col-span-5">
          <GlowCard className="glow-card bg-[#0d0a06] border border-white/[0.07] rounded-2xl p-7">
            <div className="flex items-center gap-4 mb-6 pb-5 border-b border-white/5">
              <ArgusAvatar size={52} />
              <div>
                <h3 className="text-lg font-bold text-white">Argus</h3>
                <span className="text-[10px] font-mono text-[#f59e0b] uppercase tracking-wider">Site Inspection Agent · v1</span>
              </div>
            </div>
            <dl className="flex flex-col gap-4 text-sm">
              {[
                { dt:"Detects",    dd:"10 defect classes — wall cracks, tile, switches, radiators, pipes, appliances, glass, wood, structural" },
                { dt:"References", dd:"IS 456, IS 800, and NBC 2016 in every remediation report" },
                { dt:"Also runs",  dd:"BOQ cost estimates, 90-day Gantt schedules, and safety risk checklists" },
                { dt:"Offline",    dd:"Falls back to built-in estimator if no LLM key — never goes silent" },
              ].map(({ dt, dd }, i) => (
                <div key={i} className="flex flex-col gap-1 pb-3 border-b border-white/5 last:border-0 last:pb-0">
                  <dt className="text-[9px] font-mono uppercase tracking-wider text-[#7c7268]">{dt}</dt>
                  <dd className="text-[#c8c0b8] leading-relaxed text-sm">{dd}</dd>
                </div>
              ))}
            </dl>
          </GlowCard>
        </RevealOnScroll>
      </section>

      {/* ────────────────────────────────────────────────────
          AI DEMO WIDGET
      ──────────────────────────────────────────────────── */}
      <section className="bg-[#0d0a06] py-20 px-6 md:px-12" id="tools">
        <div className="max-w-[var(--maxw)] mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <span className="eyebrow center mb-4">LIVE DEMO</span>
              <h2 className="text-3xl md:text-5xl font-black text-white mt-4">Try Argus right now</h2>
              <p className="text-[#c8c0b8] mt-3 max-w-[460px] mx-auto text-sm">
                Add your API key, upload a site photo, and get a full defect report in under 10 seconds.
              </p>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <AIDemoWidget />
          </RevealOnScroll>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────
          TESTIMONIALS
      ──────────────────────────────────────────────────── */}
      <section className="max-w-[var(--maxw)] mx-auto py-20 px-6 md:px-12" id="testimonials">
        <RevealOnScroll>
          <div className="text-center mb-12">
            <span className="eyebrow center mb-4">CLIENT REVIEWS</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-4">What site managers say</h2>
          </div>
        </RevealOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { t:"Breakdown Factor constructed our AVPU campus wings. Their AI cost estimators and safety checklists kept the crew secure.", a:"Dean", c:"AVPU, Ahmedabad" },
            { t:"Uploading site images immediately returns polymer mortar grouting specs. The detail level is remarkable.", a:"Project Manager", c:"Sanand Industrial Site" },
            { t:"We use their automated tender reports for state bidding. Clean PDFs, perfectly structured, extremely fast.", a:"Director", c:"Gujarat Infrastructure" },
          ].map(({ t, a, c }, i) => (
            <RevealOnScroll key={i} delay={i * 0.07}>
              <GlowCard className="glow-card tcard h-full flex flex-col gap-4">
                <figure className="h-full flex flex-col gap-4">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 fill-[#f59e0b] text-[#f59e0b]" />)}
                  </div>
                  <blockquote className="text-sm text-[#c8c0b8] italic flex-1 leading-relaxed">"{t}"</blockquote>
                  <figcaption className="flex items-center gap-3 border-t border-white/5 pt-4">
                    <div className="w-9 h-9 rounded-full bg-[#14100b] border border-white/10 flex items-center justify-center font-bold text-[#fef3c7] text-xs">
                      {a[0]}
                    </div>
                    <div className="text-xs">
                      <strong className="block text-white">{a}</strong>
                      <span className="text-[#7c7268]">{c}</span>
                    </div>
                  </figcaption>
                </figure>
              </GlowCard>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────
          FAQ
      ──────────────────────────────────────────────────── */}
      <section className="max-w-[var(--maxw)] mx-auto py-16 px-6 md:px-12" id="faq">
        <RevealOnScroll>
          <div className="text-center mb-10">
            <span className="eyebrow center mb-4">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-4">Building questions, answered</h2>
          </div>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1} className="max-w-[760px] mx-auto faq-list">
          {[
            { q:"Which structural codes do you follow?", a:"Every building design aligns with IS 456, IS 800, and National Building Code (NBC 2016). Defect reports include the relevant code clause." },
            { q:"How does image defect scanning work?", a:"Upload a photo of any concrete structure. YOLOv8 (best.pt) classifies faults across 10 defect classes and drafts material requirements with costing in under 10 seconds." },
            { q:"Do I need an API key?", a:"Yes — Argus uses BYOK. Add a free Gemini or OpenAI key and run unlimited reports. Without a key, the built-in offline estimator stays active." },
            { q:"Can I export estimates?", a:"Yes. Download full structural timelines, BOQ checklists, and estimates as print-ready PDF reports from the project workspace." },
          ].map(({ q, a }, i) => (
            <details key={i}>
              <summary className="faq-summary">
                {q}
                <ChevronDown className="h-4 w-4 text-[#fef3c7] flex-shrink-0" />
              </summary>
              <p className="text-sm text-[#c8c0b8] mt-3 leading-relaxed">{a}</p>
            </details>
          ))}
        </RevealOnScroll>
      </section>

      {/* ────────────────────────────────────────────────────
          CONTACT CTA
      ──────────────────────────────────────────────────── */}
      <section className="max-w-[var(--maxw)] mx-auto py-16 px-6 md:px-12" id="contact">
        <RevealOnScroll>
          <GlowCard className="glow-card bg-[#0d0a06] border border-white/5 rounded-2xl p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(245,158,11,0.09),transparent_60%)] pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f59e0b]/40 to-transparent" />
            <div className="relative z-10 max-w-[560px] mx-auto text-center">
              <span className="eyebrow center mb-5">GET IN TOUCH</span>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 mt-4">Let&apos;s build safely, together.</h2>
              <p className="text-sm text-[#c8c0b8] mb-8 leading-relaxed">
                Connect with our structural engineers or launch the AI workstation right now.
              </p>
              <form onSubmit={onContact} className="flex flex-col gap-3 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" value={contactName} onChange={e => setContactName(e.target.value)}
                    placeholder="Your Name" required
                    className="px-4 py-3 bg-[#0a0704] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#f59e0b] transition-colors placeholder:text-[#7c7268]" />
                  <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)}
                    placeholder="Your Email" required
                    className="px-4 py-3 bg-[#0a0704] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#f59e0b] transition-colors placeholder:text-[#7c7268]" />
                </div>
                <textarea rows={3} value={contactMsg} onChange={e => setContactMsg(e.target.value)}
                  placeholder="Describe your construction project requirements…" required
                  className="px-4 py-3 bg-[#0a0704] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#f59e0b] transition-colors placeholder:text-[#7c7268] resize-none" />
                <button type="submit" className="btn-primary w-full text-base">
                  Submit Project Request
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
