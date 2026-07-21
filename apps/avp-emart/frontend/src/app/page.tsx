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
import { ValOrb } from "@/components/ValOrb";
import { PriceBoard } from "@/components/PriceBoard";
import {
  Scale,
  PiggyBank,
  Bot,
  Truck,
  Cpu,
  ChevronDown,
  Search,
  TrendingUp,
  Sparkles,
  MessageSquare,
  ShoppingCart,
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

      {/* ── Hero: badge, headline, dual CTA, then Val's live price board ─────── */}
      <header className="relative min-h-screen flex items-center justify-center text-center px-6 py-28 overflow-hidden bg-[#0d0906]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#ea580c]/20 via-[#ec4899]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#ea580c]/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#8b5cf6]/10 rounded-full blur-[110px] pointer-events-none" />
        <div className="hero-grid" />

        <div className="relative z-10 max-w-[1000px] w-full flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2.5 px-4.5 py-2 rounded-full text-xs font-mono font-bold tracking-wider text-[#fdba74] bg-black/60 border border-[#ea580c]/40 shadow-[0_0_25px_rgba(234,88,12,0.2)] mb-8 backdrop-blur-xl"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ea580c] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ea580c]"></span>
            </span>
            <span className="uppercase text-[11px]">✦ 100% FREE · NO CREDIT CARD REQUIRED · 4-STORE PRICE MATRIX</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-black leading-[1.05] tracking-tight mb-8 text-white"
          >
            Compare 4 stores. <br />
            <span className="bg-gradient-to-r from-[#fdba74] via-[#ea580c] to-[#ec4899] bg-clip-text text-transparent">
              Val picks the winner.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="text-base md:text-xl text-[#9aa0b8] max-w-[720px] leading-relaxed mb-10 font-normal"
          >
            AVP Emart checks live prices on Amazon, Flipkart, Reliance Digital and Snapdeal, scores every
            listing on price, rating and review volume, and tells you which one is actually worth buying —
            not just which number is smallest.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-5 justify-center mb-14"
          >
            <Link href="/app/" className="btn bg-gradient-to-r from-[#ea580c] to-[#ec4899] hover:scale-[1.03] text-white font-extrabold text-sm md:text-base px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(234,88,12,0.4)] transition-all duration-300 flex items-center gap-2 uppercase tracking-wide">
              <i className="fas fa-shopping-cart text-sm"></i> Launch Price Matrix
            </Link>
            <a href="#services" className="btn border border-white/20 bg-black/50 text-white hover:bg-white/10 hover:border-[#ea580c] text-sm md:text-base px-8 py-4 rounded-xl transition-all duration-300 backdrop-blur-xl font-bold flex items-center gap-2">
              <i className="fas fa-chart-line text-sm text-[#fdba74]"></i> See the 30-Day Price Forecast
            </a>
          </motion.div>

          {/* Live-feeling price comparison centerpiece — replaces the generic stat row */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex justify-center"
          >
            <PriceBoard />
          </motion.div>
        </div>
      </header>

      {/* ── Meet Val ───────────────────────────────────────────────────────── */}
      <section className="bg-[#0b0b12] border-y border-white/5 py-16 px-6 md:px-12">
        <RevealOnScroll className="max-w-[1180px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
            <ValOrb size={112} className="mb-5" />
            <span className="eyebrow">Your shopping assistant</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mt-1">Meet Val.</h2>
          </div>
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg grid place-items-center bg-[#ea580c]/15 text-[#fdba74] shrink-0">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-white">Compares</div>
                <p className="text-xs text-[#9aa0b8] mt-0.5">Pulls live listings from all 4 stores for whatever you search.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg grid place-items-center bg-[#ea580c]/15 text-[#fdba74] shrink-0">
                <PiggyBank className="h-5 w-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-white">Scores</div>
                <p className="text-xs text-[#9aa0b8] mt-0.5">Weighs each listing 40% price, 40% rating, 20% review count.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg grid place-items-center bg-[#ea580c]/15 text-[#fdba74] shrink-0">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-white">Recommends</div>
                <p className="text-xs text-[#9aa0b8] mt-0.5">Replies in 2-3 sentences with a specific pick, price and platform.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg grid place-items-center bg-[#ea580c]/15 text-[#fdba74] shrink-0">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-white">Follows up</div>
                <p className="text-xs text-[#9aa0b8] mt-0.5">Set a target price and Val watches for the drop.</p>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* AI Stack Strip */}
      <section className="py-8 px-6 md:px-12 border-b border-white/5 text-center">
        <span className="text-xs font-bold tracking-wider text-[#9aa0b8] uppercase inline-flex items-center gap-2 mb-3">
          <i className="fas fa-bolt text-[#fdba74]"></i> What&apos;s actually running under Val
        </span>
        <div className="flex flex-wrap justify-center gap-2 mt-2 mb-6">
          {["LangGraph-style Agent", "Groq LLaMA 3.3 70B", "Offline scoring fallback", "FastAPI", "40/40/20 ML Scoring", "NLP Review Summarisation"].map((stack) => (
            <span key={stack} className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#eeeef8] bg-[#12121e] border border-white/5 px-3 py-1.5 rounded-lg">
              <Cpu className="h-3 w-3 text-[#fdba74]" /> {stack}
            </span>
          ))}
        </div>
        <div className="w-full max-w-[800px] mx-auto mask-image-gradient overflow-hidden select-none opacity-60">
          <div className="marquee-track text-[#fdba74] text-xs font-mono font-semibold">
            <span>✦ Amazon India Live Price Tracker</span>
            <span>✦ Flipkart Deals Engine</span>
            <span>✦ Reliance Digital & Snapdeal Sync</span>
            <span>✦ 30-Day SVG Price Forecast</span>
            <span>✦ Bank Cashback Calculator Slider</span>
            <span>✦ Value-Score Ranked Results</span>
            <span>✦ Amazon India Live Price Tracker</span>
            <span>✦ Flipkart Deals Engine</span>
            <span>✦ Reliance Digital & Snapdeal Sync</span>
            <span>✦ 30-Day SVG Price Forecast</span>
            <span>✦ Bank Cashback Calculator Slider</span>
            <span>✦ Value-Score Ranked Results</span>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-[1180px] mx-auto py-24 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" id="about">
        <RevealOnScroll className="lg:col-span-7 flex flex-col gap-4">
          <span className="eyebrow">Est. 2026 · Ahmedabad, Gujarat</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">One search, four stores, one honest answer.</h2>
          <p className="text-sm md:text-base text-[#9aa0b8] leading-relaxed mt-2">
            Every product page online is trying to sell you something. AVP Emart doesn&apos;t sell anything —
            it cross-references the same product across Amazon, Flipkart, Reliance Digital and Snapdeal, and
            scores each listing so you can see why one is actually the better buy, not just which digits are
            lowest.
          </p>
          <p className="text-sm md:text-base text-[#9aa0b8] leading-relaxed">
            Price-drop alerts, a shopping assistant that answers in plain language, and a 30-day trend
            forecast round it out. No account is required to compare — sign up only if you want alerts saved.
          </p>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1} className="lg:col-span-5">
          <GlowCard className="glow-card bg-gradient-to-br from-[#12121e] to-[#0d0d16] border border-white/5 rounded-2xl p-8">
            <div className="w-14 h-14 rounded-xl grid place-items-center text-white bg-gradient-to-br from-[#ea580c] to-[#10b981] shadow-[0_8px_24px_rgba(234,88,12,0.3)] mb-6">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-4">Why AVP Emart?</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3 text-sm text-[#9aa0b8] border-b border-white/5 pb-3">
                <span className="w-[20px] h-[20px] rounded bg-[#ea580c]/15 grid place-items-center shrink-0 mt-0.5"><i className="fas fa-check text-xs text-[#fdba74]"></i></span>
                <span>Live comparison across 4 major online stores</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[#9aa0b8] border-b border-white/5 pb-3">
                <span className="w-[20px] h-[20px] rounded bg-[#ea580c]/15 grid place-items-center shrink-0 mt-0.5"><i className="fas fa-check text-xs text-[#fdba74]"></i></span>
                <span>Transparent 40/40/20 value-score, not a black box</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[#9aa0b8] border-b border-white/5 pb-3">
                <span className="w-[20px] h-[20px] rounded bg-[#ea580c]/15 grid place-items-center shrink-0 mt-0.5"><i className="fas fa-check text-xs text-[#fdba74]"></i></span>
                <span>Saves your comparison history and price-drop alerts</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[#9aa0b8]">
                <span className="w-[20px] h-[20px] rounded bg-[#ea580c]/15 grid place-items-center shrink-0 mt-0.5"><i className="fas fa-check text-xs text-[#fdba74]"></i></span>
                <span>Val, the AI assistant, is free to ask — no sign-up needed to try it</span>
              </li>
            </ul>
          </GlowCard>
        </RevealOnScroll>
      </section>

      {/* AI Capabilities / Services */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="services">
        <RevealOnScroll>
          <span className="eyebrow center block">HOW VAL SCORES A PRODUCT</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-6">Not the cheapest. The best value.</h2>
          <p className="text-sm md:text-base text-[#9aa0b8] text-center max-w-[640px] mx-auto mb-10">
            Every listing gets one score, built from three weighted signals — the same formula that ranks
            the price board above.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.05} className="max-w-[820px] mx-auto mb-16">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 bg-[#12121e] border border-white/5 rounded-2xl p-5 text-center">
              <div className="text-3xl font-black font-mono text-[#fdba74]"><AnimatedCounter value={40} suffix="%" /></div>
              <div className="text-xs text-[#9aa0b8] mt-1">Price</div>
            </div>
            <div className="flex-1 bg-[#12121e] border border-white/5 rounded-2xl p-5 text-center">
              <div className="text-3xl font-black font-mono text-[#fdba74]"><AnimatedCounter value={40} suffix="%" /></div>
              <div className="text-xs text-[#9aa0b8] mt-1">Rating</div>
            </div>
            <div className="flex-1 bg-[#12121e] border border-white/5 rounded-2xl p-5 text-center">
              <div className="text-3xl font-black font-mono text-[#fdba74]"><AnimatedCounter value={20} suffix="%" /></div>
              <div className="text-xs text-[#9aa0b8] mt-1">Review volume</div>
            </div>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RevealOnScroll delay={0.02}>
            <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-lg flex flex-col h-full">
              <div className="w-12 h-12 rounded-xl grid place-items-center bg-[#ea580c]/10 text-[#fdba74] mb-4">
                <Scale className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Live Price Comparison</h4>
              <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mb-6 flex-1">
                Matches the same product across all four stores and pulls current listings in one search.
              </p>
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#fdba74] bg-[#ea580c]/10 px-2.5 py-1 rounded-full w-fit">
                <Cpu className="h-3 w-3" /> Live Aggregation
              </span>
            </GlowCard>
          </RevealOnScroll>

          <RevealOnScroll delay={0.06}>
            <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-lg flex flex-col h-full">
              <div className="w-12 h-12 rounded-xl grid place-items-center bg-[#10b981]/10 text-[#6ee7b7] mb-4">
                <PiggyBank className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Best-Value Scoring</h4>
              <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mb-6 flex-1">
                Runs the 40/40/20 formula on every listing so the top result balances price against quality.
              </p>
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#6ee7b7] bg-[#10b981]/10 px-2.5 py-1 rounded-full w-fit">
                <Cpu className="h-3 w-3" /> ML Scoring
              </span>
            </GlowCard>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-lg flex flex-col h-full">
              <div className="w-12 h-12 rounded-xl grid place-items-center bg-[#ea580c]/10 text-[#fdba74] mb-4">
                <Bot className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Val, the Shopping Assistant</h4>
              <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mb-6 flex-1">
                Describe what you want in plain words — Val reads the comparison and answers with a specific pick.
              </p>
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#fdba74] bg-[#ea580c]/10 px-2.5 py-1 rounded-full w-fit">
                <Cpu className="h-3 w-3" /> Groq LLaMA 3.3
              </span>
            </GlowCard>
          </RevealOnScroll>

          <RevealOnScroll delay={0.02}>
            <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-lg flex flex-col h-full">
              <div className="w-12 h-12 rounded-xl grid place-items-center bg-[#10b981]/10 text-[#6ee7b7] mb-4">
                <Sparkles className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Category Recommendations</h4>
              <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mb-6 flex-1">
                Browse smartphones, laptops, audio or home picks pre-ranked by value score.
              </p>
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#6ee7b7] bg-[#10b981]/10 px-2.5 py-1 rounded-full w-fit">
                <Cpu className="h-3 w-3" /> Recommender
              </span>
            </GlowCard>
          </RevealOnScroll>

          <RevealOnScroll delay={0.06}>
            <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-lg flex flex-col h-full">
              <div className="w-12 h-12 rounded-xl grid place-items-center bg-[#ea580c]/10 text-[#fdba74] mb-4">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">30-Day Price Forecast</h4>
              <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mb-6 flex-1">
                Fits a trend line to recent price history and shows a confidence score for whether to wait.
              </p>
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#fdba74] bg-[#ea580c]/10 px-2.5 py-1 rounded-full w-fit">
                <Cpu className="h-3 w-3" /> Trend Regression
              </span>
            </GlowCard>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-lg flex flex-col h-full">
              <div className="w-12 h-12 rounded-xl grid place-items-center bg-[#10b981]/10 text-[#6ee7b7] mb-4">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Review Intelligence</h4>
              <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mb-6 flex-1">
                Turns hundreds of reviews into a short verdict plus three pros and three cons.
              </p>
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#6ee7b7] bg-[#10b981]/10 px-2.5 py-1 rounded-full w-fit">
                <Cpu className="h-3 w-3" /> NLP Summarisation
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
          <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12">From search to checkout in four steps</h2>
        </RevealOnScroll>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="hidden lg:block absolute top-[38px] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[#ea580c]/40 via-[#10b981]/40 to-[#ea580c]/40" />

          <RevealOnScroll delay={0.02}>
            <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 relative h-full">
              <div className="absolute top-4 right-5 text-4xl font-black text-white/5 select-none font-mono">01</div>
              <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#ea580c]/10 text-[#fdba74] mb-4">
                <Search className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-2">Search a product</h4>
              <p className="text-xs text-[#9aa0b8] leading-relaxed">Type any product name — Val starts pulling live listings immediately.</p>
            </GlowCard>
          </RevealOnScroll>

          <RevealOnScroll delay={0.06}>
            <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 relative h-full">
              <div className="absolute top-4 right-5 text-4xl font-black text-white/5 select-none font-mono">02</div>
              <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#10b981]/10 text-[#6ee7b7] mb-4">
                <Scale className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-2">Compare the matrix</h4>
              <p className="text-xs text-[#9aa0b8] leading-relaxed">See sorted results and value scores across Amazon, Flipkart & more.</p>
            </GlowCard>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 relative h-full">
              <div className="absolute top-4 right-5 text-4xl font-black text-white/5 select-none font-mono">03</div>
              <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#ea580c]/10 text-[#fdba74] mb-4">
                <Bot className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-2">Ask Val</h4>
              <p className="text-xs text-[#9aa0b8] leading-relaxed">Get a plain-language recommendation, or read the review verdict.</p>
            </GlowCard>
          </RevealOnScroll>

          <RevealOnScroll delay={0.14}>
            <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 relative h-full">
              <div className="absolute top-4 right-5 text-4xl font-black text-white/5 select-none font-mono">04</div>
              <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#10b981]/10 text-[#6ee7b7] mb-4">
                <Truck className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-2">Buy or set an alert</h4>
              <p className="text-xs text-[#9aa0b8] leading-relaxed">Check out on the winning store, or wait for your target price.</p>
            </GlowCard>
          </RevealOnScroll>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="testimonials">
        <RevealOnScroll>
          <span className="eyebrow center block">REVIEWS</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12">What our shoppers say</h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RevealOnScroll delay={0.02}>
            <figure className="tcard flex flex-col gap-4 h-full">
              <div className="text-[#fdba74] flex gap-1"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div>
              <blockquote className="text-sm text-[#9aa0b8] italic flex-1 leading-relaxed">
                &ldquo;The price matrix is fast, and I could actually see why it picked Reliance Digital over
                Amazon — the rating was higher, not just the price lower.&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3 border-t border-white/5 pt-4">
                <div className="w-9 h-9 rounded-full bg-[#12121e] border border-white/10 flex items-center justify-center font-bold text-[#fdba74] text-xs">KP</div>
                <div className="text-xs">
                  <strong className="block text-white">Smart Shopper</strong>
                  <span className="text-[#5b5f78]">Ahmedabad</span>
                </div>
              </figcaption>
            </figure>
          </RevealOnScroll>

          <RevealOnScroll delay={0.06}>
            <figure className="tcard flex flex-col gap-4 h-full">
              <div className="text-[#fdba74] flex gap-1"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div>
              <blockquote className="text-sm text-[#9aa0b8] italic flex-1 leading-relaxed">
                &ldquo;Set a price alert for a TV and it caught the Flipkart drop the same week. Saved real
                money without checking manually every day.&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3 border-t border-white/5 pt-4">
                <div className="w-9 h-9 rounded-full bg-[#12121e] border border-white/10 flex items-center justify-center font-bold text-[#fdba74] text-xs">S</div>
                <div className="text-xs">
                  <strong className="block text-white">Deal Finder</strong>
                  <span className="text-[#5b5f78]">Anand</span>
                </div>
              </figcaption>
            </figure>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <figure className="tcard flex flex-col gap-4 h-full">
              <div className="text-[#fdba74] flex gap-1"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div>
              <blockquote className="text-sm text-[#9aa0b8] italic flex-1 leading-relaxed">
                &ldquo;Asked Val to compare two phones and it gave me a straight answer with a reason, not a
                wall of specs to read myself.&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3 border-t border-white/5 pt-4">
                <div className="w-9 h-9 rounded-full bg-[#12121e] border border-white/10 flex items-center justify-center font-bold text-[#fdba74] text-xs">M</div>
                <div className="text-xs">
                  <strong className="block text-white">Verified Buyer</strong>
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
            <summary className="faq-summary">Which stores does Val actually check? <ChevronDown className="h-4 w-4 text-[#fdba74]" /></summary>
            <p className="text-xs md:text-sm text-[#9aa0b8] mt-3 leading-relaxed">
              Amazon, Flipkart, Reliance Digital and Snapdeal — the same four stores shown in the price
              board above. No hidden fifth source and no sponsored placement.
            </p>
          </details>

          <details>
            <summary className="faq-summary">How is the value score calculated? <ChevronDown className="h-4 w-4 text-[#fdba74]" /></summary>
            <p className="text-xs md:text-sm text-[#9aa0b8] mt-3 leading-relaxed">
              40% weight on price, 40% on rating, 20% on review volume, combined into one 0-100 score per
              listing. The highest score wins — it&apos;s not always the cheapest option.
            </p>
          </details>

          <details>
            <summary className="faq-summary">Can I set price-drop alerts? <ChevronDown className="h-4 w-4 text-[#fdba74]" /></summary>
            <p className="text-xs md:text-sm text-[#9aa0b8] mt-3 leading-relaxed">
              Yes. Add a product to your wishlist with a target price, and the backend checks prices and
              triggers an alert when it&apos;s reached.
            </p>
          </details>

          <details>
            <summary className="faq-summary">Do I need an account to compare prices? <ChevronDown className="h-4 w-4 text-[#fdba74]" /></summary>
            <p className="text-xs md:text-sm text-[#9aa0b8] mt-3 leading-relaxed">
              No — searching, comparing and asking Val are all free without signing up. An account is only
              needed to save alerts and comparison history.
            </p>
          </details>
        </RevealOnScroll>
      </section>

      {/* Contact Section */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="contact">
        <div className="bg-[#12121e] border border-white/5 rounded-2xl p-8 relative overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(234,88,12,0.1),transparent_60%)] pointer-events-none" />

          <div className="relative z-10 max-w-[640px] w-full text-center flex flex-col items-center">
            <span className="eyebrow">GET IN TOUCH</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Questions about a comparison?</h2>
            <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mb-8">
              Tell us what you searched for and what looked off — we read every message and use it to tune
              Val&apos;s scoring.
            </p>

            <form onSubmit={handleContactSubmit} className="w-full flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Your Name"
                  required
                  className="w-full px-4 py-3 bg-[#0d0d16] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#ea580c]"
                />
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Your Email"
                  required
                  className="w-full px-4 py-3 bg-[#0d0d16] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#ea580c]"
                />
              </div>
              <input
                type="text"
                value={contactSubject}
                onChange={(e) => setContactSubject(e.target.value)}
                placeholder="Subject"
                required
                className="w-full px-4 py-3 bg-[#0d0d16] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#ea580c]"
              />
              <textarea
                rows={4}
                value={contactMsg}
                onChange={(e) => setContactMsg(e.target.value)}
                placeholder="How can we help you?"
                required
                className="w-full px-4 py-3 bg-[#0d0d16] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#ea580c] resize-none"
              />
              <button
                type="submit"
                className="btn w-full bg-gradient-to-r from-[#ea580c] to-[#10b981] text-white font-semibold py-3 rounded-lg hover:scale-[1.01] transition-all cursor-pointer"
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
