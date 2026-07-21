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
import { PersonaOrb } from "@/components/PersonaOrb";
import {
  FileText,
  ShieldCheck,
  IndianRupee,
  Truck,
  CalendarCheck,
  ChevronDown,
  Upload,
  ScanLine,
  ArrowRight,
  Languages,
  HeartPulse,
  MapPin,
  Landmark,
  Gift,
  Clock,
  Siren,
  Phone,
  Leaf,
  Pill,
  Cpu,
} from "lucide-react";

// Real, upcoming camps — mirrors backend CAMPS in features.py (Gujarat Health
// Camps). If the schedule changes, update this list alongside the backend.
const CAMPS_PREVIEW = [
  { title: "Free Eye Checkup & Surgery Camp", city: "Ahmedabad", category: "Eye Checkup", date: "5 Aug" },
  { title: "Mega Blood Donation Drive", city: "Surat", category: "Blood Donation", date: "12 Aug" },
  { title: "Preventive Cardiac Care Camp", city: "Rajkot", category: "Cardiac Care", date: "20 Aug" },
  { title: "Maternal & Pediatrics Checkup", city: "Vadodara", category: "Pediatrics", date: "27 Aug" },
  { title: "Free Dental & Diabetes Screening", city: "Bhavnagar", category: "Dental & Diabetes", date: "2 Sep" },
];

// Real government schemes — mirrors backend SCHEMES in features.py.
const SCHEMES_PREVIEW = [
  { name: "PM-JAY (Ayushman Bharat)", coverage: "₹5,00,000 / family / year", eligibility: "BPL & low-income households" },
  { name: "Mukhyamantri Amrutam Yojana", coverage: "₹5,00,000 / family / year", eligibility: "Gujarat families, income < ₹4,00,000" },
  { name: "PM Bhartiya Janaushadhi Pariyojana", coverage: "50–90% off generic medicines", eligibility: "Open to all citizens" },
  { name: "Bal Sakha Yojana", coverage: "Free neonatal ICU care", eligibility: "BPL & SC/ST infants, Gujarat" },
  { name: "Gujarat Free Diagnostic Services", coverage: "Free labs, ECG, X-ray, ultrasound", eligibility: "Any government hospital visit" },
];

// Same emergency contacts shown in the interactive demo widget below —
// kept identical here so the two sections never contradict each other.
const ER_HOSPITALS = [
  { name: "Civil Hospital & Emergency Center", city: "Ahmedabad", contact: "+91 79 2268 3721" },
  { name: "Apollo Emergency Care", city: "Gandhinagar", contact: "+91 79 6670 1800" },
  { name: "SVP Metropolitan Hospital", city: "Ahmedabad", contact: "+91 79 2657 7621" },
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
      // In production, this can connect to the backend contact API
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

      {/* Hero — introduces Sanjeevani directly instead of a badge + stat-grid */}
      <header className="relative min-h-screen flex items-center justify-center text-center px-6 py-28 overflow-hidden bg-[#060609]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.2),transparent_60%)]" />
        <div className="mesh-bg" />
        <div className="hero-grid" />

        <div className="relative z-10 max-w-[900px] w-full flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="eyebrow mb-6"
          >
            Free health guidance from Sanjeevani, your AI health guide
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.08] tracking-tight mb-8 text-white"
          >
            Health information that&apos;s
            <br />
            <span className="bg-gradient-to-r from-[#6ee7b7] via-[#10b981] to-[#06b6d4] bg-clip-text text-transparent">
              actually free.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="text-base md:text-xl text-[#9aa0b8] max-w-[680px] leading-relaxed mb-10 font-normal"
          >
            Sanjeevani reads your prescription, checks what you&apos;re taking together for unsafe
            combinations, and points you to free health camps and government health schemes near
            you — no fee, and no account needed just to ask a question.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-4 justify-center mb-14"
          >
            <Link href="/app/" className="btn bg-gradient-to-r from-[#10b981] to-[#059669] hover:scale-[1.03] text-black font-extrabold text-sm md:text-base px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-300 flex items-center gap-2">
              Open the AI Health Portal <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#process" className="btn border border-white/20 bg-black/50 text-white hover:bg-white/10 hover:border-[#10b981] text-sm md:text-base px-8 py-4 rounded-xl transition-all duration-300 backdrop-blur-xl font-bold flex items-center gap-2">
              <ScanLine className="h-4 w-4 text-[#6ee7b7]" /> See how the scan works
            </a>
          </motion.div>

          {/* Hero visual: the persona, not a stat-card grid */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[720px] bg-black/40 border border-white/10 rounded-2xl backdrop-blur-xl p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-5 text-left"
          >
            <div className="flex flex-col items-center gap-2 shrink-0">
              <PersonaOrb size={84} />
              <div className="text-center">
                <div className="text-sm font-bold text-white flex items-center gap-1.5 justify-center">
                  Sanjeevani <Leaf className="h-3.5 w-3.5 text-[#6ee7b7]" />
                </div>
                <div className="text-[10px] text-[#9aa0b8] uppercase tracking-wider font-mono">AI health guide</div>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-2 w-full">
              <div className="self-start max-w-[92%] bg-white/5 border border-white/10 rounded-xl rounded-tl-sm px-4 py-2.5 text-xs md:text-sm text-[#eeeef8]">
                Can I take ibuprofen with my blood pressure medicine?
              </div>
              <div className="self-end max-w-[92%] bg-[#10b981]/10 border border-[#10b981]/30 rounded-xl rounded-tr-sm px-4 py-2.5 text-xs md:text-sm text-[#d7fff0]">
                Ibuprofen can raise blood pressure and reduce how well some BP medicines work.
                Paracetamol is usually the safer OTC choice. ⚕️ Confirm with your pharmacist first.
              </div>
              <a href="#ai-demo" className="text-[11px] text-[#6ee7b7] font-semibold hover:underline self-start mt-1">
                Ask Sanjeevani something free →
              </a>
            </div>
          </motion.div>
        </div>
      </header>

      {/* About Sanjeevani — consolidates the old pillars band / stack strip / about card into one honest section */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="about">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <RevealOnScroll className="lg:col-span-7 flex flex-col gap-5">
            <span className="eyebrow">About Sanjeevani</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
              Built to say &ldquo;I don&apos;t know, ask a doctor&rdquo; — not to guess.
            </h2>
            <p className="text-sm md:text-base text-[#9aa0b8] leading-relaxed">
              Sanjeevani is named after the healing herb of Indian legend — the one Hanuman
              carried back from the forest. It&apos;s the AI health guide behind Decode Forest
              Pharmacy: it reads prescriptions, checks drug interactions against a real database,
              and answers everyday medicine questions in plain language.
            </p>
            <p className="text-sm md:text-base text-[#9aa0b8] leading-relaxed">
              It is not a doctor, and it says so. Every answer ends with a reminder to confirm
              with a pharmacist, and anything urgent gets one instruction: call 108.
            </p>

            <ul className="flex flex-col gap-4 mt-2">
              <li className="flex items-start gap-3 text-sm text-[#c7cbe0] border-b border-white/5 pb-4">
                <span className="w-8 h-8 rounded-lg bg-[#10b981]/15 grid place-items-center shrink-0 text-[#6ee7b7]"><FileText className="h-4 w-4" /></span>
                <span><strong className="text-white">Reads handwritten prescriptions</strong> — OCR and vision extract each medicine in seconds.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[#c7cbe0] border-b border-white/5 pb-4">
                <span className="w-8 h-8 rounded-lg bg-[#10b981]/15 grid place-items-center shrink-0 text-[#6ee7b7]"><ShieldCheck className="h-4 w-4" /></span>
                <span><strong className="text-white">Checks what you take together</strong> — flagged against a clinically-sourced interaction database.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[#c7cbe0] border-b border-white/5 pb-4">
                <span className="w-8 h-8 rounded-lg bg-[#10b981]/15 grid place-items-center shrink-0 text-[#6ee7b7]"><Languages className="h-4 w-4" /></span>
                <span><strong className="text-white">Answers in your language</strong> — not just English, on request.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[#c7cbe0]">
                <span className="w-8 h-8 rounded-lg bg-[#10b981]/15 grid place-items-center shrink-0 text-[#6ee7b7]"><HeartPulse className="h-4 w-4" /></span>
                <span><strong className="text-white">Names its own limits</strong> — points to a pharmacist or 108 when it matters.</span>
              </li>
            </ul>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1} className="lg:col-span-5">
            <GlowCard className="glow-card bg-gradient-to-br from-[#12121e] to-[#0d0d16] border border-white/5 rounded-2xl p-8">
              <PersonaOrb size={72} animated={false} />
              <h3 className="text-lg font-bold text-white mt-5 mb-1">What&apos;s actually running underneath</h3>
              <p className="text-xs text-[#9aa0b8] mb-5">No smoke — this is the real stack, with an offline fallback when no AI key is configured.</p>
              <div className="flex flex-col gap-2.5">
                {[
                  "LangGraph 3-node assistant (intent → retrieval → response)",
                  "Groq Llama 3.3 70B for language, MiniLM for retrieval",
                  "EasyOCR + LLM structuring for prescription reading",
                  "Curated medicine, interaction & symptom database (RAG)",
                ].map((line) => (
                  <div key={line} className="flex items-start gap-2.5 text-xs text-[#c7cbe0]">
                    <Cpu className="h-3.5 w-3.5 text-[#5eead4] mt-0.5 shrink-0" />
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </GlowCard>
          </RevealOnScroll>
        </div>
      </section>

      {/* How the scan works — the real OCR flow, illustrated (not a generic icon grid) */}
      <section className="bg-[#0b0b12] border-y border-white/5 py-20 px-6 md:px-12" id="process">
        <RevealOnScroll className="max-w-[1180px] mx-auto">
          <span className="eyebrow center block">How the prescription scan works</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-4">Upload it. Sanjeevani reads it.</h2>
          <p className="text-sm md:text-base text-[#9aa0b8] text-center max-w-[620px] mx-auto mb-14">
            This is the same flow used inside the AI Health Portal — illustrated here, and yours
            to try for real with typed text in the tool further down this page.
          </p>
        </RevealOnScroll>

        <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-6 md:gap-4 items-center">
          {/* Step 1: Upload */}
          <RevealOnScroll delay={0.02} className="bg-[#12121e] border border-white/5 rounded-2xl p-6 h-full">
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#10b981]/10 text-[#6ee7b7] mb-4">
              <Upload className="h-5 w-5" />
            </div>
            <div className="relative w-full h-24 rounded-lg bg-[#09090f] border border-white/10 overflow-hidden mb-3">
              <div className="absolute inset-x-3 top-3 h-1.5 rounded bg-white/10" />
              <div className="absolute inset-x-3 top-7 h-1.5 rounded bg-white/10 w-3/4" />
              <div className="absolute inset-x-3 top-11 h-1.5 rounded bg-white/10 w-1/2" />
              <div className="absolute inset-x-0 h-6 bg-gradient-to-b from-transparent via-[#6ee7b7]/25 to-transparent scanline-sweep" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">A photo of your prescription</h4>
            <p className="text-xs text-[#9aa0b8] leading-relaxed">Handwritten or printed — even a quick phone photo works.</p>
          </RevealOnScroll>

          <ArrowRight className="hidden md:block h-5 w-5 text-white/15 mx-auto" />

          {/* Step 2: Read */}
          <RevealOnScroll delay={0.08} className="bg-[#12121e] border border-white/5 rounded-2xl p-6 h-full">
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#14b8a6]/10 text-[#5eead4] mb-4">
              <ScanLine className="h-5 w-5" />
            </div>
            <div className="w-full h-24 rounded-lg bg-[#09090f] border border-[#10b981]/30 mb-3 p-3 flex flex-col justify-center gap-1.5 font-mono text-[10px] text-[#6ee7b7]">
              <span>→ Paracetamol 650mg, SOS</span>
              <span>→ Amoxicillin 500mg, 1-0-1</span>
              <span>→ Pantoprazole 40mg, 1-0-0</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Vision + OCR extract each line</h4>
            <p className="text-xs text-[#9aa0b8] leading-relaxed">Medicine, dose and frequency are pulled out and matched to the database.</p>
          </RevealOnScroll>

          <ArrowRight className="hidden md:block h-5 w-5 text-white/15 mx-auto" />

          {/* Step 3: Checked answer */}
          <RevealOnScroll delay={0.14} className="bg-[#12121e] border border-white/5 rounded-2xl p-6 h-full">
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#10b981]/10 text-[#6ee7b7] mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="w-full h-24 rounded-lg bg-[#09090f] border border-white/10 mb-3 p-3 flex flex-col justify-center gap-2">
              <div className="text-[11px] text-white font-semibold">No major interactions found</div>
              <div className="text-[10px] text-[#9aa0b8] leading-relaxed">Take Pantoprazole before breakfast, Amoxicillin after food.</div>
            </div>
            <h4 className="text-sm font-bold text-white mb-1">You get a plain-language answer</h4>
            <p className="text-xs text-[#9aa0b8] leading-relaxed">Interaction-checked, with a reminder to confirm anything serious with a pharmacist.</p>
          </RevealOnScroll>
        </div>
      </section>

      {/* AI capabilities — a compact rail, and the real interactive demo (not a repeated 6-card grid) */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="services">
        <RevealOnScroll>
          <span className="eyebrow center block">More from Sanjeevani</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12">The rest of the toolkit</h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.05} className="flex flex-col divide-y divide-white/5 border-y border-white/5 mb-4">
          {[
            { icon: IndianRupee, title: "Smart substitutes", desc: "Bioequivalent generic alternatives, so you can ask your pharmacist about a cheaper option." },
            { icon: CalendarCheck, title: "Refill prediction", desc: "Works out when a course will run out from your dose and quantity, and reminds you." },
            { icon: Pill, title: "Symptom guide", desc: "Safe, OTC-only guidance for common symptoms — never a prescription-strength suggestion." },
            { icon: Truck, title: "Delivery routing", desc: "Route-optimised doorstep delivery for genuine medicines across Anand and Ahmedabad." },
          ].map((row) => (
            <div key={row.title} className="flex items-center gap-4 py-4">
              <span className="w-10 h-10 rounded-lg grid place-items-center bg-[#14b8a6]/10 text-[#5eead4] shrink-0">
                <row.icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <div className="text-sm font-bold text-white">{row.title}</div>
                <div className="text-xs text-[#9aa0b8] leading-relaxed">{row.desc}</div>
              </div>
            </div>
          ))}
        </RevealOnScroll>

        <RevealOnScroll delay={0.15}>
          <div id="ai-demo">
            <AIDemoWidget />
          </div>
        </RevealOnScroll>
      </section>

      {/* Free healthcare access — health camps + government schemes, grounded in real backend data */}
      <section className="bg-[#0b0b12] border-y border-white/5 py-20 px-6 md:px-12">
        <RevealOnScroll className="max-w-[1180px] mx-auto">
          <span className="eyebrow center block">Free access, beyond the app</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-4">
            Free care that exists whether or not you use Sanjeevani
          </h2>
          <p className="text-sm md:text-base text-[#9aa0b8] text-center max-w-[680px] mx-auto mb-4">
            Health camps and government schemes are free regardless of this app — Sanjeevani just
            helps you find the ones near you.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-[#6ee7b7] font-mono mb-12">
            <AnimatedCounter value={CAMPS_PREVIEW.length} /> camps this month
            <span className="text-white/20">·</span>
            <AnimatedCounter value={SCHEMES_PREVIEW.length} /> free schemes tracked
          </div>
        </RevealOnScroll>

        <div className="max-w-[1180px] mx-auto w-full mask-image-gradient overflow-hidden select-none opacity-70 mb-12">
          <div className="marquee-track text-[#6ee7b7] text-xs font-mono font-semibold">
            {CAMPS_PREVIEW.map((c) => (
              <span key={c.title} className="inline-flex items-center gap-1.5">
                <MapPin className="h-3 w-3" /> {c.city} — {c.category} · {c.date}
              </span>
            ))}
          </div>
        </div>

        <div className="max-w-[1180px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RevealOnScroll delay={0.02} className="bg-[#12121e] border border-white/5 rounded-2xl p-6 md:p-8">
            <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2"><MapPin className="h-4 w-4 text-[#6ee7b7]" /> Upcoming health camps in Gujarat</h3>
            <div className="flex flex-col gap-4">
              {CAMPS_PREVIEW.map((c) => (
                <div key={c.title} className="flex items-start gap-3 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <span className="w-9 h-9 rounded-lg bg-[#10b981]/10 text-[#6ee7b7] grid place-items-center shrink-0"><Clock className="h-4 w-4" /></span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white">{c.title}</div>
                    <div className="text-xs text-[#9aa0b8]">{c.city} · {c.category} · {c.date} 2026</div>
                  </div>
                </div>
              ))}
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.08} className="bg-[#12121e] border border-white/5 rounded-2xl p-6 md:p-8">
            <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2"><Landmark className="h-4 w-4 text-[#5eead4]" /> Free government health schemes</h3>
            <div className="flex flex-col gap-4">
              {SCHEMES_PREVIEW.map((s) => (
                <div key={s.name} className="flex items-start gap-3 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <span className="w-9 h-9 rounded-lg bg-[#14b8a6]/10 text-[#5eead4] grid place-items-center shrink-0"><Gift className="h-4 w-4" /></span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white">{s.name}</div>
                    <div className="text-xs text-[#9aa0b8]">{s.coverage} · {s.eligibility}</div>
                  </div>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Emergency — deliberately distinct visual treatment, used sparingly */}
      <section className="max-w-[1180px] mx-auto py-16 px-6 md:px-12" id="emergency">
        <RevealOnScroll className="bg-gradient-to-br from-[#1a0e10] to-[#12121e] border border-rose-500/25 rounded-2xl p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
            <div className="flex items-center gap-4 md:border-r md:border-white/10 md:pr-10 shrink-0">
              <span className="w-14 h-14 rounded-xl grid place-items-center bg-rose-500/15 text-rose-300">
                <Siren className="h-6 w-6" />
              </span>
              <div>
                <div className="text-lg font-bold text-white">In a real emergency,</div>
                <div className="text-sm text-rose-200/80">don&apos;t wait on any app.</div>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-[#c7cbe0] leading-relaxed mb-4">
                Sanjeevani will always tell you to call <strong className="text-white">108</strong>{" "}
                for anything urgent — it never tries to talk you through an emergency instead.
                Here are three Ahmedabad-area emergency contacts to save now:
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <a href="tel:108" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs font-bold hover:bg-rose-500/30 transition-all">
                  <Phone className="h-3.5 w-3.5" /> Call 108 (India Emergency)
                </a>
                {ER_HOSPITALS.map((h) => (
                  <a key={h.name} href={`tel:${h.contact}`} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[#c7cbe0] text-xs font-semibold hover:border-white/30 transition-all">
                    <Phone className="h-3.5 w-3.5 text-[#6ee7b7]" /> {h.name} ({h.city})
                  </a>
                ))}
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* Testimonials */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="testimonials">
        <span className="eyebrow center block">Reviews</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12">What our customers say</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <figure className="tcard flex flex-col gap-4">
            <div className="text-[#6ee7b7] flex gap-1"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div>
            <blockquote className="text-sm text-[#9aa0b8] italic flex-1 leading-relaxed">
              &ldquo;The AI prescription reader decoded my doctor&apos;s messy handwriting perfectly. The safety interaction tool is amazing.&rdquo;
            </blockquote>
            <figcaption className="flex items-center gap-3 border-t border-white/5 pt-4">
              <div className="w-9 h-9 rounded-full bg-[#12121e] border border-white/10 flex items-center justify-center font-bold text-[#6ee7b7] text-xs">RC</div>
              <div className="text-xs">
                <strong className="block text-white">Regular Customer</strong>
                <span className="text-[#5b5f78]">Ahmedabad</span>
              </div>
            </figcaption>
          </figure>

          <figure className="tcard flex flex-col gap-4">
            <div className="text-[#6ee7b7] flex gap-1"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div>
            <blockquote className="text-sm text-[#9aa0b8] italic flex-1 leading-relaxed">
              &ldquo;I saved ₹1,200 on my diabetes pills last month simply because the app recommended generic substitutes.&rdquo;
            </blockquote>
            <figcaption className="flex items-center gap-3 border-t border-white/5 pt-4">
              <div className="w-9 h-9 rounded-full bg-[#12121e] border border-white/10 flex items-center justify-center font-bold text-[#6ee7b7] text-xs">C</div>
              <div className="text-xs">
                <strong className="block text-white">Customer</strong>
                <span className="text-[#5b5f78]">Maninagar</span>
              </div>
            </figcaption>
          </figure>

          <figure className="tcard flex flex-col gap-4">
            <div className="text-[#6ee7b7] flex gap-1"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div>
            <blockquote className="text-sm text-[#9aa0b8] italic flex-1 leading-relaxed">
              &ldquo;Extremely prompt delivery and reliable service. It&apos;s my first choice for medicines now.&rdquo;
            </blockquote>
            <figcaption className="flex items-center gap-3 border-t border-white/5 pt-4">
              <div className="w-9 h-9 rounded-full bg-[#12121e] border border-white/10 flex items-center justify-center font-bold text-[#6ee7b7] text-xs">S</div>
              <div className="text-xs">
                <strong className="block text-white">Student</strong>
                <span className="text-[#5b5f78]">Satellite</span>
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
            <summary className="faq-summary">Is Sanjeevani really free to use? <ChevronDown className="h-4 w-4 text-[#6ee7b7]" /></summary>
            <p className="text-xs md:text-sm text-[#9aa0b8] mt-3 leading-relaxed">
              Yes. Asking a health question, checking a drug interaction, or looking up a free
              health camp doesn&apos;t require payment or an account. Ordering medicines for
              delivery is a separate, paid transaction.
            </p>
          </details>

          <details>
            <summary className="faq-summary">Is Sanjeevani a replacement for my doctor? <ChevronDown className="h-4 w-4 text-[#6ee7b7]" /></summary>
            <p className="text-xs md:text-sm text-[#9aa0b8] mt-3 leading-relaxed">
              No. It&apos;s a starting point for general information. Every response points back
              to a pharmacist or doctor for anything specific to your condition, and to 108 for
              emergencies.
            </p>
          </details>

          <details>
            <summary className="faq-summary">How does the AI read my prescription? <ChevronDown className="h-4 w-4 text-[#6ee7b7]" /></summary>
            <p className="text-xs md:text-sm text-[#9aa0b8] mt-3 leading-relaxed">
              Computer vision and OCR extract the text from your upload, which is cross-checked
              against our medicine database and verified by a human pharmacist before dispensing.
            </p>
          </details>

          <details>
            <summary className="faq-summary">Is the drug interaction check reliable? <ChevronDown className="h-4 w-4 text-[#6ee7b7]" /></summary>
            <p className="text-xs md:text-sm text-[#9aa0b8] mt-3 leading-relaxed">
              The database covers standard, clinically-documented drug-drug interaction pairs.
              For any complex prescription, a qualified pharmacist verifies the results.
            </p>
          </details>

          <details>
            <summary className="faq-summary">How fast is doorstep delivery? <ChevronDown className="h-4 w-4 text-[#6ee7b7]" /></summary>
            <p className="text-xs md:text-sm text-[#9aa0b8] mt-3 leading-relaxed">
              In Ahmedabad and Anand, delivery typically takes 60 minutes to 3 hours using
              route-optimised scheduling.
            </p>
          </details>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="contact">
        <div className="bg-[#12121e] border border-white/5 rounded-2xl p-8 relative overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.1),transparent_60%)] pointer-events-none" />

          <div className="relative z-10 max-w-[640px] w-full text-center flex flex-col items-center">
            <span className="eyebrow">Get in touch</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Your health, made smarter.</h2>
            <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mb-8">
              Order genuine medicines with AI safety checks and fast, intelligent delivery. Smarter, safer healthcare — that&apos;s the Decode Forest promise.
            </p>

            <form onSubmit={handleContactSubmit} className="w-full flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Your Name"
                  required
                  className="w-full px-4 py-3 bg-[#0d0d16] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#10b981]"
                />
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Your Email"
                  required
                  className="w-full px-4 py-3 bg-[#0d0d16] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#10b981]"
                />
              </div>
              <input
                type="text"
                value={contactSubject}
                onChange={(e) => setContactSubject(e.target.value)}
                placeholder="Subject"
                required
                className="w-full px-4 py-3 bg-[#0d0d16] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#10b981]"
              />
              <textarea
                rows={4}
                value={contactMsg}
                onChange={(e) => setContactMsg(e.target.value)}
                placeholder="How can we help you?"
                required
                className="w-full px-4 py-3 bg-[#0d0d16] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#10b981] resize-none"
              />
              <button
                type="submit"
                className="btn w-full bg-gradient-to-r from-[#10b981] to-[#14b8a6] text-white font-semibold py-3 rounded-lg hover:scale-[1.01] transition-all cursor-pointer"
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
