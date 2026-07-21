"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { GlowCard } from "@/components/GlowCard";
import { AIDemoWidget } from "@/components/AIDemoWidget";
import { CustomCursor } from "@/components/CustomCursor";
import { TextScramble } from "@/components/TextScramble";
import { Tilt } from "@/components/Tilt";
import {
  Heart, Shield, Receipt, Award, BookOpen,
  ChevronDown, Star, FileCheck,
  Building2, HandHeart,
} from "lucide-react";

// Live 80G Tax Receipt & Impact Visual
function ImpactGeneratorVisual() {
  const [donationAmt, setDonationAmt] = useState(10000);
  const taxExemption = Math.round(donationAmt * 0.5);
  const mealsProvided = Math.round(donationAmt / 40);
  const healthCheckups = Math.round(donationAmt / 500);

  return (
    <Tilt className="w-full">
      <div className="w-full rounded-2xl overflow-hidden border border-[rgba(245,158,11,0.25)] bg-[#120c06] shadow-[0_0_80px_rgba(245,158,11,0.1)]">
        <div className="flex items-center justify-between px-4 py-3 bg-[#181109] border-b border-[rgba(245,158,11,0.12)]">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-[#f59e0b] fill-[#f59e0b]" />
            <span className="text-[10px] font-mono font-bold text-[#f59e0b] uppercase tracking-widest">
              AVP TRUST · 80G TAX & IMPACT CALCULATOR
            </span>
          </div>
          <span className="text-[9px] font-mono text-[#22c55e]">VERIFIED 80G APPROVED</span>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#a3957f]">Select Donation Amount:</span>
            <span className="text-xl font-black text-white font-mono">₹{donationAmt.toLocaleString()}</span>
          </div>

          <input
            type="range"
            min="1000"
            max="100000"
            step="1000"
            value={donationAmt}
            onChange={e => setDonationAmt(Number(e.target.value))}
            className="w-full h-2 bg-[#20170d] rounded-lg appearance-none cursor-pointer accent-[#f59e0b]"
          />

          <div className="flex justify-between text-[10px] font-mono text-[#a3957f]">
            <span>₹1,000</span>
            <span>₹50,000</span>
            <span>₹1,00,000</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-1">
            <div className="rounded-xl p-3 bg-[#1a120a] border border-[rgba(245,158,11,0.15)]">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#22c55e] mb-1">
                <Receipt className="h-3.5 w-3.5" /> 80G TAX DEDUCTION
              </div>
              <div className="text-lg font-black text-white font-mono">₹{taxExemption.toLocaleString()}</div>
              <div className="text-[9px] text-[#a3957f]">50% Tax Exemption Benefit</div>
            </div>

            <div className="rounded-xl p-3 bg-[#1a120a] border border-[rgba(245,158,11,0.15)]">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#f59e0b] mb-1">
                <HandHeart className="h-3.5 w-3.5" /> COMMUNITY IMPACT
              </div>
              <div className="text-lg font-black text-white font-mono">{mealsProvided} Meals</div>
              <div className="text-[9px] text-[#a3957f]">or {healthCheckups} Free Health Audits</div>
            </div>
          </div>

          <div className="rounded-xl p-3 bg-[#181109] border border-dashed border-[rgba(245,158,11,0.3)] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-[#f59e0b]" />
              <div>
                <div className="font-bold text-white text-[11px]">Instant 80G Certificate PDF</div>
                <div className="text-[9px] text-[#a3957f]">Govt Reg: AABTA1234F20261</div>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-[#f59e0b] bg-[rgba(245,158,11,0.1)] px-2 py-1 rounded">AUTO-GENERATE</span>
          </div>
        </div>

        <div className="px-4 py-2.5 bg-[#181109] border-t border-[rgba(245,158,11,0.12)] flex items-center justify-between text-[9px] font-mono text-[#a3957f]">
          <span>100% TRANSPARENT PUBLIC LEDGER</span>
          <span>0% ADMINISTRATIVE CUT</span>
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
    setFeedbackMsg("Thank you! Your donation enquiry has been logged.");
    setContactName(""); setContactEmail(""); setContactMsg("");
  };

  return (
    <>
      <CustomCursor />
      <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />
      <Navbar />

      {/* HERO */}
      <header className="relative min-h-screen flex items-center overflow-hidden bg-[#0d0905] pt-[var(--nav-h)]">
        <div className="warm-sunburst" />

        <div className="relative z-10 w-full max-w-[var(--maxw)] mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-7">
            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
              <span className="eyebrow">
                <Heart className="h-3.5 w-3.5 text-[#f59e0b] fill-[#f59e0b]" />
                Transparent Philanthropy & 80G Tax Exemptions
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity:0, y:28 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.7, delay:0.08, ease:[0.22,1,0.36,1] }}
              className="text-4xl sm:text-5xl xl:text-[4.2rem] font-black leading-[1.04] tracking-tighter text-white"
            >
              Transform lives.<br/>
              <span className="grad"><TextScramble text="Save on your taxes." /></span>
            </motion.h1>

            <motion.p
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.6, delay:0.18, ease:[0.22,1,0.36,1] }}
              className="text-base md:text-lg text-[#fde68a] leading-relaxed max-w-[480px] opacity-90"
            >
              AVP Charitable Trust funds free medical camps, student scholarships, and rural development across Gujarat. Every donation generates an instant 80G tax receipt.
            </motion.p>

            <motion.div
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.6, delay:0.26 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/app/" className="btn-primary">
                <HandHeart className="h-4 w-4" />
                Make a 80G Tax-Deductible Gift
              </Link>
              <a href="#initiatives" className="btn-ghost">
                <FileCheck className="h-4 w-4" />
                View Public Ledger
              </a>
            </motion.div>

            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.42 }}
              className="flex flex-wrap gap-2.5">
              {["80G Certified", "12A Registered", "Instant PDF Receipts", "0% Admin Fee", "Public Ledger"].map((tag, i) => (
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
          >
            <ImpactGeneratorVisual />
          </motion.div>
        </div>

        <a href="#stats" className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[#a3957f] hover:text-[#f59e0b] transition-colors">
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </a>
      </header>

      {/* STATS BAND */}
      <section id="stats" className="bg-[#161009] border-y border-[rgba(245,158,11,0.12)]">
        <div className="max-w-[var(--maxw)] mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[rgba(245,158,11,0.12)]">
          {[
            { val: "₹2.5Cr+", lbl: "Direct community impact funded" },
            { val: "50%",     lbl: "Tax deduction under Section 80G" },
            { val: "15,000+", lbl: "Patients served in free health camps" },
            { val: "100%",    lbl: "Public financial transparency" },
          ].map((s, i) => (
            <div key={i} className="px-6 md:px-10 py-8 flex flex-col gap-1">
              <div className="text-2xl md:text-3xl font-black text-white">{s.val}</div>
              <div className="text-xs text-[#a3957f] leading-snug">{s.lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* INITIATIVES */}
      <section className="max-w-[var(--maxw)] mx-auto py-24 px-6 md:px-12" id="initiatives">
        <RevealOnScroll>
          <div className="text-center mb-14">
            <span className="eyebrow center mb-4">OUR CAUSES</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-4">
              Where your donation creates change
            </h2>
          </div>
        </RevealOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon:Heart,     color:"#f59e0b", badge:"Healthcare",  title:"Free Rural Medical Camps", desc:"Organizes monthly diagnostic, eye checkup, and surgery camps in underserved villages across Gujarat." },
            { icon:BookOpen,  color:"#f97316", badge:"Education",   title:"AVPU Student Scholarships",desc:"Sponsors full tuition and living expenses for meritorious, underprivileged engineering students." },
            { icon:Receipt,   color:"#22c55e", badge:"Tax Benefit", title:"Instant 80G Receipts",     desc:"Every online donation generates a government-compliant 80G tax receipt PDF sent directly to your email." },
            { icon:Building2, color:"#38bdf8", badge:"Infrastructure",title:"Community Labs & Clinics", desc:"Funds building diagnostic labs and hostel wings in partnership with Breakdown Factor & AVPU." },
            { icon:Shield,    color:"#a855f7", badge:"Audit",       title:"100% Transparent Ledger",  desc:"Public expense tracking — every rupee spent is recorded and audit-verified online." },
            { icon:Award,     color:"#f59e0b", badge:"Recognition", title:"Corporate CSR Matching",   desc:"Enables corporate partners to double their impact with structured CSR allocation and certificates." },
          ].map(({ icon: Icon, color, badge, title, desc }, i) => (
            <RevealOnScroll key={i} delay={i * 0.06}>
              <Tilt className="h-full">
                <GlowCard className="glow-card bg-[#161009] border border-[rgba(245,158,11,0.1)] rounded-2xl p-6 h-full flex flex-col gap-4">
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
                    <p className="text-sm text-[#fde68a] leading-relaxed opacity-80">{desc}</p>
                  </div>
                </GlowCard>
              </Tilt>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* AI DEMO WIDGET */}
      <section className="bg-[#161009] py-20 px-6 md:px-12" id="tools">
        <div className="max-w-[var(--maxw)] mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <span className="eyebrow center mb-4">TRUST ASSISTANT</span>
              <h2 className="text-3xl md:text-4xl font-black text-white mt-3">Interactive Impact Portal</h2>
              <p className="text-[#fde68a] mt-3 max-w-[460px] mx-auto text-sm opacity-80">
                Ask about 80G tax rules, scholarship criteria, or upcoming medical drive dates.
              </p>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <AIDemoWidget />
          </RevealOnScroll>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-[var(--maxw)] mx-auto py-20 px-6 md:px-12" id="testimonials">
        <RevealOnScroll>
          <div className="text-center mb-12">
            <span className="eyebrow center mb-4">DONOR REVIEWS</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">Trusted by donors & partners</h2>
          </div>
        </RevealOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { t:"Received my 80G tax receipt within 2 minutes of donating. Used it directly for my IT returns filing!", a:"Vikram S.", c:"Individual Donor, Ahmedabad" },
            { t:"Our company routed our entire CSR budget through AVP Trust. Complete transparency and real impact reports.", a:"Meera N.", c:"CSR Lead, Tech Corp" },
            { t:"The scholarship sponsored my entire final year engineering fee. Forever grateful to AVP Charitable Trust.", a:"Rahul T.", c:"AVPU Alumnus & Software Engineer" },
          ].map(({ t, a, c }, i) => (
            <RevealOnScroll key={i} delay={i * 0.07}>
              <Tilt className="h-full">
                <GlowCard className="glow-card bg-[#20170d] border border-[rgba(245,158,11,0.1)] rounded-2xl p-6 h-full flex flex-col gap-4">
                  <figure className="h-full flex flex-col gap-4">
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 fill-[#f59e0b] text-[#f59e0b]" />)}
                    </div>
                    <blockquote className="text-sm text-[#fde68a] italic flex-1 leading-relaxed">"{t}"</blockquote>
                    <figcaption className="flex items-center gap-3 border-t border-[rgba(245,158,11,0.1)] pt-4">
                      <div className="w-9 h-9 rounded-full bg-[rgba(245,158,11,0.15)] border border-[rgba(245,158,11,0.3)] flex items-center justify-center font-bold text-[#f59e0b] text-xs">
                        {a[0]}
                      </div>
                      <div className="text-xs">
                        <strong className="block text-white">{a}</strong>
                        <span className="text-[#a3957f]">{c}</span>
                      </div>
                    </figcaption>
                  </figure>
                </GlowCard>
              </Tilt>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="max-w-[var(--maxw)] mx-auto py-16 px-6 md:px-12" id="contact">
        <RevealOnScroll>
          <GlowCard className="glow-card bg-[#161009] border border-[rgba(245,158,11,0.1)] rounded-2xl p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(245,158,11,0.1),transparent_55%)] pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f59e0b]/50 to-transparent" />
            <div className="relative z-10 max-w-[520px] mx-auto text-center">
              <span className="eyebrow center mb-5">SUPPORT US</span>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 mt-4">Partner with AVP Trust</h2>
              <p className="text-sm text-[#fde68a] mb-8 opacity-80">
                Discuss CSR partnerships, large donations, or volunteering for health camps.
              </p>
              <form onSubmit={onContact} className="flex flex-col gap-3 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" value={contactName} onChange={e => setContactName(e.target.value)}
                    placeholder="Your Name / Corp" required
                    className="px-4 py-3 bg-[#0d0905] border border-[rgba(245,158,11,0.15)] rounded-xl text-sm text-white focus:outline-none focus:border-[#f59e0b] transition-colors placeholder:text-[#a3957f]" />
                  <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)}
                    placeholder="Your Email" required
                    className="px-4 py-3 bg-[#0d0905] border border-[rgba(245,158,11,0.15)] rounded-xl text-sm text-white focus:outline-none focus:border-[#f59e0b] transition-colors placeholder:text-[#a3957f]" />
                </div>
                <textarea rows={3} value={contactMsg} onChange={e => setContactMsg(e.target.value)}
                  placeholder="Describe your donation or partnership query…" required
                  className="px-4 py-3 bg-[#0d0905] border border-[rgba(245,158,11,0.15)] rounded-xl text-sm text-white focus:outline-none focus:border-[#f59e0b] transition-colors placeholder:text-[#a3957f] resize-none" />
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
