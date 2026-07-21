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
  Activity
} from "lucide-react";

const HERO_STATS = [
  { value: 4, prefix: "", suffix: "", decimals: 0, label: "Platforms Compared" },
  { value: 10, prefix: "", suffix: "k+", decimals: 0, label: "Products" },
  { value: 24, prefix: "", suffix: "/7", decimals: 0, label: "AI Assistant" },
  { value: 1, prefix: "₹", suffix: "Cr", decimals: 0, label: "GMV Year 1" },
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
      <header className="relative min-h-screen flex items-center justify-center text-center px-6 py-24 overflow-hidden bg-[#060609]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(234,88,12,0.18),transparent_60%)]" />
        <div className="mesh-bg" />
        <div className="hero-grid" />

        <div className="relative z-10 max-w-[900px] w-full flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-[#fdba74] bg-[#ea580c]/10 border border-[#ea580c]/25 mb-8"
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>AI Price Comparison · Best-Value Scoring · LLM Shopping Assistant</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-6"
          >
            AI shopping that finds you the<br /><span className="grad">best price</span>, every time
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="text-sm md:text-lg text-[#9aa0b8] max-w-[670px] leading-relaxed mb-10"
          >
            An AI-powered marketplace that compares live prices across Amazon, Flipkart, Reliance Digital, and Snapdeal, scores the best value with ML, and delivers it to your door.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-4 justify-center mb-16"
          >
            <Link href="/app/" className="btn bg-gradient-to-r from-[#ea580c] to-[#10b981] hover:scale-[1.02] text-white font-semibold text-sm md:text-base px-6 py-3 rounded-lg shadow-[0_6px_22px_rgba(234,88,12,0.3)] transition-all duration-200">
              <i className="fas fa-rocket mr-2"></i> Launch Price Comparator
            </Link>
            <a href="#services" className="btn border border-white/15 bg-white/[0.03] text-white hover:bg-[#18182a] hover:border-[#ea580c]/50 text-sm md:text-base px-6 py-3 rounded-lg transition-all duration-200">
              <i className="fas fa-microchip mr-2"></i> See the AI
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center justify-center bg-[#12121e]/60 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md mb-12"
          >
            {HERO_STATS.map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <div className="w-[1px] self-stretch bg-white/5" />}
                <div className="px-6 md:px-8 py-5 text-center min-w-[120px]">
                  <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#fdba74] to-[#6ee7b7] bg-clip-text text-transparent">
                    <AnimatedCounter value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} />
                  </div>
                  <div className="text-[10px] md:text-xs text-[#9aa0b8] uppercase tracking-wider font-semibold mt-1">{s.label}</div>
                </div>
              </React.Fragment>
            ))}
          </motion.div>

          <div className="w-full max-w-[760px] mask-image-gradient overflow-hidden select-none opacity-50">
            <div className="marquee-track text-[#5b5f78] text-xs font-mono font-semibold">
              <span>AI Price Compare</span>
              <span>Best-Value Scoring</span>
              <span>Shopping Assistant</span>
              <span>Smart Recommendations</span>
              <span>Price Forecasting</span>
              <span>Review Intelligence</span>
              <span>Amazon</span>
              <span>Flipkart</span>
              <span>Reliance Digital</span>
              <span>Snapdeal</span>
            </div>
          </div>
        </div>
      </header>

      {/* Pillars Band */}
      <section className="bg-[#0b0b12] border-y border-white/5 py-8 px-6 md:px-12">
        <RevealOnScroll className="max-w-[1180px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex gap-4 items-center">
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#ea580c]/15 text-[#fdba74] shrink-0">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">AI Compare</div>
              <p className="text-xs text-[#9aa0b8] mt-0.5">Live prices across four platforms.</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#ea580c]/15 text-[#fdba74] shrink-0">
              <PiggyBank className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">Best-Value AI</div>
              <p className="text-xs text-[#9aa0b8] mt-0.5">ML scoring on every product.</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#ea580c]/15 text-[#fdba74] shrink-0">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">Shopping Assistant</div>
              <p className="text-xs text-[#9aa0b8] mt-0.5">Ask, and AI finds it for you.</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#ea580c]/15 text-[#fdba74] shrink-0">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">Fast Delivery</div>
              <p className="text-xs text-[#9aa0b8] mt-0.5">Quick, reliable fulfillment.</p>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* AI Stack Strip */}
      <section className="py-6 px-6 md:px-12 border-b border-white/5 text-center">
        <span className="text-xs font-bold tracking-wider text-[#9aa0b8] uppercase inline-flex items-center gap-2 mb-3">
          <i className="fas fa-bolt text-[#fdba74]"></i> Powered by a production-grade AI stack
        </span>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {["LangGraph Multi-Agent", "Groq LLaMA 3.3 70B", "ChromaDB RAG", "MiniLM Embeddings", "FastAPI", "ML Scoring", "NLP Summarisation"].map(stack => (
            <span key={stack} className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#eeeef8] bg-[#12121e] border border-white/5 px-3 py-1.5 rounded-lg">
              <Cpu className="h-3 w-3 text-[#fdba74]" /> {stack}
            </span>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-[1180px] mx-auto py-24 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" id="about">
        <RevealOnScroll className="lg:col-span-7 flex flex-col gap-4">
          <span className="eyebrow">Est. 2026 · AI-Powered E-Commerce & Smart Shopping</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">Shop smart. AI always finds the best price.</h2>
          <p className="text-sm md:text-base text-[#9aa0b8] leading-relaxed mt-2">
            AVP Emart utilizes advanced aggregation scrapers and AI classifiers to pull live data across Amazon, Flipkart, Reliance Digital, and Snapdeal. We cross-reference listings to find identical products, calculate overall savings, and factor in reviews to show you which offer has the best overall value.
          </p>
          <p className="text-sm md:text-base text-[#9aa0b8] leading-relaxed">
            With built-in price-drop alerts, semantic LLM shopping counselors, and delivery routing, AVP Emart takes the stress out of online shopping. Try it out and see how much you save today.
          </p>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1} className="lg:col-span-5">
        <GlowCard className="glow-card bg-gradient-to-br from-[#12121e] to-[#0d0d16] border border-white/5 rounded-2xl p-8">
          <div className="w-14 h-14 rounded-xl grid place-items-center text-white bg-gradient-to-br from-[#ea580c] to-[#10b981] shadow-[0_8px_24px_rgba(234,88,12,0.3)] mb-6">
            <ShoppingCartIcon className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-4">Why AVP Emart?</h3>
          <ul className="flex flex-col gap-4">
            <li className="flex items-start gap-3 text-sm text-[#9aa0b8] border-b border-white/5 pb-3">
              <span className="w-[20px] h-[20px] rounded bg-[#ea580c]/15 grid place-items-center shrink-0 mt-0.5"><i className="fas fa-check text-xs text-[#fdba74]"></i></span>
              <span>Live comparison across 4 major online stores</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-[#9aa0b8] border-b border-white/5 pb-3">
              <span className="w-[20px] h-[20px] rounded bg-[#ea580c]/15 grid place-items-center shrink-0 mt-0.5"><i className="fas fa-check text-xs text-[#fdba74]"></i></span>
              <span>Custom ML best-value index scoring system</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-[#9aa0b8] border-b border-white/5 pb-3">
              <span className="w-[20px] h-[20px] rounded bg-[#ea580c]/15 grid place-items-center shrink-0 mt-0.5"><i className="fas fa-check text-xs text-[#fdba74]"></i></span>
              <span>Saves comparison query logs and price drop alerts</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-[#9aa0b8]">
              <span className="w-[20px] h-[20px] rounded bg-[#ea580c]/15 grid place-items-center shrink-0 mt-0.5"><i className="fas fa-check text-xs text-[#fdba74]"></i></span>
              <span>24/7 LLM Shopping Assistant and Review Summarizer</span>
            </li>
          </ul>
        </GlowCard>
        </RevealOnScroll>
      </section>

      {/* AI Capabilities / Services */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="services">
        <RevealOnScroll>
        <span className="eyebrow center block">AI CAPABILITIES</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12">AI tools that power your shopping</h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RevealOnScroll delay={0.02}>
          <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-lg flex flex-col h-full">
            <div className="w-12 h-12 rounded-xl grid place-items-center bg-[#ea580c]/10 text-[#fdba74] mb-4">
              <Scale className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">AI Price Comparison</h4>
            <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mb-6 flex-1">
              Multi-source aggregation engine matches models and fetches live product listings in seconds.
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
              Evaluates shipping time, product price, and rating weights to score the best value.
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
            <h4 className="text-base font-bold text-white mb-2">LLM Shopping Assistant</h4>
            <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mb-6 flex-1">
              Ask questions about which phone or TV is right for your needs and get structured summaries.
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
            <h4 className="text-base font-bold text-white mb-2">Smart Recommendations</h4>
            <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mb-6 flex-1">
              Recommends matching accessories and related deals based on your wishlist.
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
            <h4 className="text-base font-bold text-white mb-2">Price-Trend Forecasting</h4>
            <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mb-6 flex-1">
              Visualizes price shifts over the past 12 weeks to predict if prices will drop further.
            </p>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#fdba74] bg-[#ea580c]/10 px-2.5 py-1 rounded-full w-fit">
              <Cpu className="h-3 w-3" /> ML Forecasting
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
              Synthesizes thousands of online buyer ratings into pros, cons, and rating score indicators.
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
        <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12">Shop smarter in four simple steps</h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <RevealOnScroll delay={0.02}>
          <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 relative h-full">
            <div className="absolute top-4 right-5 text-4xl font-black text-white/5 select-none font-mono">01</div>
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#ea580c]/10 text-[#fdba74] mb-4">
              <Search className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-2">Search Product</h4>
            <p className="text-xs text-[#9aa0b8] leading-relaxed">Enter any product name — AI will parse and scan online databases immediately.</p>
          </GlowCard>
          </RevealOnScroll>

          <RevealOnScroll delay={0.06}>
          <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 relative h-full">
            <div className="absolute top-4 right-5 text-4xl font-black text-white/5 select-none font-mono">02</div>
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#10b981]/10 text-[#6ee7b7] mb-4">
              <Scale className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-2">Compare Deals</h4>
            <p className="text-xs text-[#9aa0b8] leading-relaxed">View sorted price results and best-value indexes across Amazon, Flipkart, & more.</p>
          </GlowCard>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
          <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 relative h-full">
            <div className="absolute top-4 right-5 text-4xl font-black text-white/5 select-none font-mono">03</div>
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#ea580c]/10 text-[#fdba74] mb-4">
              <Bot className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-2">Consult Assistant</h4>
            <p className="text-xs text-[#9aa0b8] leading-relaxed">Review summaries, pros & cons, or consult the shopping agent on features.</p>
          </GlowCard>
          </RevealOnScroll>

          <RevealOnScroll delay={0.14}>
          <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-6 relative h-full">
            <div className="absolute top-4 right-5 text-4xl font-black text-white/5 select-none font-mono">04</div>
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#10b981]/10 text-[#6ee7b7] mb-4">
              <Truck className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-2">Order & Save</h4>
            <p className="text-xs text-[#9aa0b8] leading-relaxed">Confirm your choice, set custom price-drop alerts, and save more.</p>
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
              &ldquo;The price-compare scanner is lightning fast! Found a laptop deal on Reliance Digital that was ₹3,000 cheaper than Amazon.&rdquo;
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
              &ldquo;I set a price alert for a TV and it notified me the moment the Flipkart price dipped. Saved ₹4,500!&rdquo;
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
              &ldquo;The review summarizer synthesises positive & negative ratings cleanly. Saves me hours of scrolling reviews.&rdquo;
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
            <summary className="faq-summary">Which e-commerce sites do you compare? <ChevronDown className="h-4 w-4 text-[#fdba74]" /></summary>
            <p className="text-xs md:text-sm text-[#9aa0b8] mt-3 leading-relaxed">
              Our AI comparators crawl and cross-reference live prices from Amazon, Flipkart, Reliance Digital, and Snapdeal.
            </p>
          </details>

          <details>
            <summary className="faq-summary">How does the best-value scoring index work? <ChevronDown className="h-4 w-4 text-[#fdba74]" /></summary>
            <p className="text-xs md:text-sm text-[#9aa0b8] mt-3 leading-relaxed">
              We don&apos;t just look at price. Our model factors in shipping costs, delivery speed, seller rating weights, and return policies to score which platform gives you the best overall value.
            </p>
          </details>

          <details>
            <summary className="faq-summary">Can I set price-drop alerts? <ChevronDown className="h-4 w-4 text-[#fdba74]" /></summary>
            <p className="text-xs md:text-sm text-[#9aa0b8] mt-3 leading-relaxed">
              Yes. You can add any product to your wishlist and set a target price limit. Our backend monitors prices and triggers alerts immediately.
            </p>
          </details>

          <details>
            <summary className="faq-summary">Is my data secure? <ChevronDown className="h-4 w-4 text-[#fdba74]" /></summary>
            <p className="text-xs md:text-sm text-[#9aa0b8] mt-3 leading-relaxed">
              Absolutely. We only store search terms and alert rules in our local database. No personal shopping logins are required.
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
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Shop smarter, save instantly.</h2>
            <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mb-8">
              Compare prices across multiple online stores with AI best-value indexes and target price alarms. Take control of your shopping today.
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
              {feedbackMsg && <p className="text-xs text-[#6ee7b7] font-semibold mt-2">{feedbackMsg}</p>}
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

// Icon fallback
function ShoppingCartIcon({ className }: { className?: string }) {
  return <i className={`fas fa-cart-shopping ${className || ""}`} style={{ fontSize: "inherit" }}></i>;
}
