"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PersonaAvatar } from "@/components/PersonaAvatar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { GlowCard } from "@/components/GlowCard";
import { AIDemoWidget } from "@/components/AIDemoWidget";
import { ValOrb } from "@/components/ValOrb";
import { CustomCursor } from "@/components/CustomCursor";
import { TextScramble } from "@/components/TextScramble";
import { Tilt } from "@/components/Tilt";
import {
  Scale, PiggyBank, Bot, Truck, Cpu,
  ChevronDown, Search, TrendingUp, Sparkles,
  ShoppingCart, CheckCircle2, Zap, Star,
} from "lucide-react";

// Live Price Comparison Visual
const PRODUCTS = [
  {
    name: "Samsung 65\" Crystal 4K UHD TV",
    cat: "Electronics",
    stores: [
      { name: "Amazon",   price: 54999, rating: 4.3, reviews: 2847, score: 87 },
      { name: "Flipkart", price: 52499, rating: 4.5, reviews: 1923, score: 92 },
      { name: "Reliance", price: 56999, rating: 4.1, reviews:  764, score: 78 },
      { name: "Snapdeal", price: 51999, rating: 3.9, reviews:  412, score: 74 },
    ],
    winner: 1,
  },
  {
    name: "OnePlus 12 5G (256GB)",
    cat: "Smartphones",
    stores: [
      { name: "Amazon",   price: 64999, rating: 4.6, reviews: 5821, score: 94 },
      { name: "Flipkart", price: 67499, rating: 4.4, reviews: 3102, score: 85 },
      { name: "Reliance", price: 65999, rating: 4.2, reviews:  921, score: 80 },
      { name: "Snapdeal", price: 63999, rating: 3.8, reviews:  234, score: 70 },
    ],
    winner: 0,
  },
];

const STORE_COLORS: Record<string, string> = {
  Amazon:   "#f59e0b",
  Flipkart: "#3b82f6",
  Reliance: "#22c55e",
  Snapdeal: "#ec4899",
};

function PriceComparisonVisual() {
  const [productIdx, setProductIdx] = useState(0);
  const [phase, setPhase] = useState<"loading"|"comparing"|"result">("loading");
  const [revealCount, setRevealCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const product = PRODUCTS[productIdx];

  const runComparison = useCallback(() => {
    setPhase("loading"); setRevealCount(0);
    timerRef.current = setTimeout(() => {
      setPhase("comparing"); setRevealCount(0);
      let count = 0;
      const interval = setInterval(() => {
        count++;
        setRevealCount(count);
        if (count >= product.stores.length) {
          clearInterval(interval);
          timerRef.current = setTimeout(() => {
            setPhase("result");
            timerRef.current = setTimeout(() => {
              setProductIdx(i => (i + 1) % PRODUCTS.length);
            }, 3000);
          }, 600);
        }
      }, 350);
    }, 800);
  }, [product.stores.length]);

  useEffect(() => {
    runComparison();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [productIdx, runComparison]);

  return (
    <Tilt className="w-full">
      <div className="w-full rounded-2xl overflow-hidden border border-[rgba(99,102,241,0.25)] bg-[#060618] shadow-[0_0_80px_rgba(99,102,241,0.1)]">
        <div className="flex items-center justify-between px-4 py-3 bg-[#09091e] border-b border-[rgba(99,102,241,0.12)]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute h-full w-full rounded-full bg-[#6366f1] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6366f1]" />
            </span>
            <span className="text-[10px] font-mono font-bold text-[#a5b4fc] uppercase tracking-widest">VAL · PRICE INTELLIGENCE</span>
          </div>
          <span className="text-[9px] font-mono text-[#6471c4]">
            {phase === "loading" ? "FETCHING PRICES..." : phase === "comparing" ? "ANALYZING..." : "WINNER FOUND ✓"}
          </span>
        </div>

        <div className="px-4 py-3 border-b border-[rgba(99,102,241,0.1)] bg-[#080819]">
          <div className="text-[9px] font-mono text-[#6471c4] uppercase tracking-wider mb-1">{product.cat}</div>
          <div className="text-sm font-bold text-white truncate">{product.name}</div>
        </div>

        <div className="flex flex-col divide-y divide-[rgba(99,102,241,0.08)]">
          <AnimatePresence mode="popLayout">
            {product.stores.map((store, i) => {
              const isRevealed = i < revealCount;
              const isWinner = phase === "result" && i === product.winner;
              const color = STORE_COLORS[store.name];
              return (
                <motion.div
                  key={`${productIdx}-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: isRevealed ? 1 : 0.3, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="flex items-center gap-3 px-4 py-3 relative"
                  style={{ background: isWinner ? `${color}08` : "transparent" }}
                >
                  {isWinner && (
                    <div className="absolute right-3 top-3">
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full" style={{ background:`${color}20`, color }}>
                        BEST VALUE ↑
                      </span>
                    </div>
                  )}
                  
                  <div className="w-16 flex-shrink-0">
                    <div className="text-[11px] font-bold" style={{ color }}>{store.name}</div>
                  </div>

                  <div className="w-20 flex-shrink-0">
                    <div className="text-sm font-black text-white">
                      {isRevealed ? `₹${store.price.toLocaleString()}` : "—"}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="h-1.5 bg-[rgba(99,102,241,0.1)] rounded-full overflow-hidden">
                      {isRevealed && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${store.score}%` }}
                          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ background: isWinner ? color : "rgba(99,102,241,0.5)" }}
                        />
                      )}
                    </div>
                  </div>

                  <div className="w-8 text-right flex-shrink-0">
                    <span className="text-[11px] font-mono font-bold" style={{ color: isRevealed ? (isWinner ? color : "rgba(165,180,252,0.7)") : "transparent" }}>
                      {store.score}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {phase === "result" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-[rgba(99,102,241,0.15)] bg-[#080819]"
            >
              <div className="px-4 py-3 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[rgba(99,102,241,0.2)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="h-3.5 w-3.5 text-[#a5b4fc]" />
                </div>
                <p className="text-[11px] text-[#a5b4fc] leading-relaxed">
                  <strong className="text-white">Val recommends {product.stores[product.winner].name}</strong> — best value score ({product.stores[product.winner].score}/100) with ₹{(Math.max(...product.stores.map(s => s.price)) - product.stores[product.winner].price).toLocaleString()} savings vs highest price.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
    setFeedbackMsg("Message received! We'll be in touch.");
    setContactName(""); setContactEmail(""); setContactMsg("");
  };

  return (
    <>
      <CustomCursor />
      <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />
      <Navbar />

      {/* HERO */}
      <header className="relative min-h-screen flex items-center overflow-hidden bg-[#04040c] pt-[var(--nav-h)]">
        <div className="star-field" />
        <div className="space-grid" />

        <div className="relative z-10 w-full max-w-[var(--maxw)] mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-7">
            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
              <span className="eyebrow">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-[#6366f1] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6366f1]" />
                </span>
                4-Store AI Price Intelligence
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity:0, y:28 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.7, delay:0.08, ease:[0.22,1,0.36,1] }}
              className="text-4xl sm:text-5xl xl:text-[4.2rem] font-black leading-[1.04] tracking-tighter text-white"
            >
              Compare 4 stores.<br/>
              <span className="grad"><TextScramble text="Val picks the winner." /></span>
            </motion.h1>

            <motion.p
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.6, delay:0.18, ease:[0.22,1,0.36,1] }}
              className="text-base md:text-lg text-[#a5b4fc] leading-relaxed max-w-[480px]"
            >
              AVP Emart checks live prices across Amazon, Flipkart, Reliance Digital & Snapdeal — 
              then scores each listing on price, rating, and review count. Val tells you exactly 
              which one is worth buying.
            </motion.p>

            <motion.div
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.6, delay:0.26 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/app/" className="btn-primary">
                <ShoppingCart className="h-4 w-4" />
                Launch Price Matrix
              </Link>
              <a href="#how-it-works" className="btn-ghost">
                <TrendingUp className="h-4 w-4" />
                See 30-day forecast
              </a>
            </motion.div>

            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.42 }}
              className="flex flex-wrap gap-2.5">
              {["Amazon","Flipkart","Reliance Digital","Snapdeal","BYOK Free","Offline Scoring"].map((tag, i) => (
                <span key={i} className="text-[10px] font-mono font-semibold px-3 py-1.5 rounded-full bg-[rgba(99,102,241,0.06)] border border-[rgba(99,102,241,0.2)] text-[#a5b4fc]">
                  ✦ {tag}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity:0, x:40 }}
            animate={{ opacity:1, x:0 }}
            transition={{ duration:0.8, delay:0.35, ease:[0.22,1,0.36,1] }}
            className="flex flex-col items-center gap-7"
          >
            <div className="relative flex items-center gap-4">
              <PersonaAvatar size={210} primary="#6366f1" secondary="#a5b4fc" accessory="tag" name="Val" role="Price Scout" />
              <div className="hidden xl:block relative rounded-2xl rounded-bl-none border border-[rgba(99,102,241,0.3)] bg-[rgba(9,9,20,0.85)] px-4 py-3 text-sm text-[#cbd5e1] max-w-[200px] backdrop-blur">
                <span className="text-[#a5b4fc] font-semibold">Hi, I&apos;m Val 👋</span><br />
                Tell me what to buy — I&apos;ll find the cheapest across 4 stores.
              </div>
            </div>
            <PriceComparisonVisual />
          </motion.div>
        </div>

        <a href="#stats" className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[#6471c4] hover:text-[#6366f1] transition-colors">
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </a>
      </header>

      {/* STATS BAND */}
      <section id="stats" className="bg-[#08081a] border-y border-[rgba(99,102,241,0.1)]">
        <div className="max-w-[var(--maxw)] mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[rgba(99,102,241,0.1)]">
          {[
            { val:"4",      lbl:"Major stores compared simultaneously" },
            { val:"40/40",  lbl:"Price + rating scoring formula" },
            { val:"30-day", lbl:"Price history & forecast tracking" },
            { val:"BYOK",   lbl:"Your own API key, unlimited free" },
          ].map((s, i) => (
            <div key={i} className="px-6 md:px-10 py-8 flex flex-col gap-1">
              <div className="text-2xl md:text-3xl font-black text-white">{s.val}</div>
              <div className="text-xs text-[#6471c4] leading-snug">{s.lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MEET VAL */}
      <section className="bg-[#08081a] border-b border-[rgba(99,102,241,0.1)] py-16 px-6 md:px-12">
        <div className="max-w-[var(--maxw)] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <RevealOnScroll className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
            <ValOrb size={112} className="mb-5" />
            <span className="eyebrow mb-2">Your Shopping Agent</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mt-1">
              Meet Val.
            </h2>
            <p className="text-sm text-[#a5b4fc] mt-3 leading-relaxed">
              Val is AVP Emart&apos;s AI shopping agent — she compares, scores, and recommends the best buy in under 5 seconds.
            </p>
          </RevealOnScroll>
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { icon:Scale,     title:"Compares",   desc:"Pulls live listings from all 4 stores for any product you search." },
              { icon:PiggyBank, title:"Scores",     desc:"Weighs each listing: 40% price, 40% rating, 20% review volume." },
              { icon:Bot,       title:"Recommends", desc:"Replies with a specific pick, price, and platform in plain language." },
              { icon:Truck,     title:"Tracks",     desc:"Set a target price and Val watches for the drop and notifies you." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <RevealOnScroll key={i} delay={i * 0.06}>
                <Tilt className="h-full">
                  <div className="flex gap-4 p-4 rounded-xl bg-[#0d0d24] border border-[rgba(99,102,241,0.1)] h-full">
                    <div className="w-10 h-10 rounded-lg grid place-items-center bg-[rgba(99,102,241,0.12)] text-[#a5b4fc] flex-shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white">{title}</div>
                      <p className="text-xs text-[#6471c4] mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </Tilt>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-[var(--maxw)] mx-auto py-24 px-6 md:px-12" id="features">
        <RevealOnScroll>
          <div className="text-center mb-14">
            <span className="eyebrow center mb-4">FEATURES</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-4">
              Shopping intelligence,<br className="hidden md:block"/> not just price tracking
            </h2>
          </div>
        </RevealOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon:Search,       color:"#6366f1", badge:"Real-time",   title:"Live Price Scraping",      desc:"Fetches current prices from all 4 stores at the moment of your search — no cached, stale data." },
            { icon:TrendingUp,   color:"#22d3ee", badge:"History",     title:"30-Day Price Forecast",    desc:"Tracks price history and predicts future price movements. Know if you should buy now or wait." },
            { icon:Sparkles,     color:"#ec4899", badge:"AI",          title:"Smart Recommendations",    desc:"Val explains her pick in 2-3 sentences with reasoning — not just a number comparison table." },
            { icon:CheckCircle2, color:"#22c55e", badge:"Trust",       title:"Review Authenticity",      desc:"Filters out paid reviews and ratings manipulation with NLP sentiment analysis on review patterns." },
            { icon:Cpu,          color:"#f59e0b", badge:"Offline",     title:"No API? No Problem",       desc:"Falls back to an offline scoring engine if no LLM key is provided — Val still works." },
            { icon:Zap,          color:"#6366f1", badge:"Free",        title:"BYOK — Free Forever",      desc:"Bring your own Gemini or Groq key. Run unlimited comparisons at zero cost." },
          ].map(({ icon: Icon, color, badge, title, desc }, i) => (
            <RevealOnScroll key={i} delay={i * 0.06}>
              <Tilt className="h-full">
                <GlowCard className="glow-card bg-[#08081a] border border-[rgba(99,102,241,0.1)] rounded-2xl p-6 h-full flex flex-col gap-4">
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
                    <p className="text-sm text-[#a5b4fc] leading-relaxed opacity-80">{desc}</p>
                  </div>
                </GlowCard>
              </Tilt>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* AI DEMO WIDGET */}
      <section className="bg-[#08081a] py-20 px-6 md:px-12" id="tools">
        <div className="max-w-[var(--maxw)] mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <span className="eyebrow center mb-4">LIVE DEMO</span>
              <h2 className="text-3xl md:text-4xl font-black text-white mt-3">Ask Val right now</h2>
              <p className="text-[#a5b4fc] mt-3 max-w-[460px] mx-auto text-sm opacity-80">
                Search any product and Val will compare prices across all 4 stores and pick the best deal.
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
            <span className="eyebrow center mb-4">REVIEWS</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3">Shoppers love Val</h2>
          </div>
        </RevealOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { t:"Val saved me ₹8,000 on a laptop purchase. She flagged that the 'sale' on one site was actually higher than the original price elsewhere.", a:"Priya M.", c:"Product Designer, Bangalore" },
            { t:"The 30-day price history is a game changer. I waited 10 days and saved ₹3,500 on a refrigerator like Val predicted.", a:"Rohit K.", c:"Software Engineer, Pune" },
            { t:"I was about to buy a product with 4.2 stars until Val showed me the review count was fake. Avoided a terrible purchase.", a:"Ananya S.", c:"Marketing Lead, Delhi" },
          ].map(({ t, a, c }, i) => (
            <RevealOnScroll key={i} delay={i * 0.07}>
              <Tilt className="h-full">
                <GlowCard className="glow-card bg-[#0d0d24] border border-[rgba(99,102,241,0.1)] rounded-2xl p-6 h-full flex flex-col gap-4">
                  <figure className="h-full flex flex-col gap-4">
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 fill-[#f59e0b] text-[#f59e0b]" />)}
                    </div>
                    <blockquote className="text-sm text-[#a5b4fc] italic flex-1 leading-relaxed">"{t}"</blockquote>
                    <figcaption className="flex items-center gap-3 border-t border-[rgba(99,102,241,0.1)] pt-4">
                      <div className="w-9 h-9 rounded-full bg-[rgba(99,102,241,0.15)] border border-[rgba(99,102,241,0.3)] flex items-center justify-center font-bold text-[#a5b4fc] text-xs">
                        {a[0]}
                      </div>
                      <div className="text-xs">
                        <strong className="block text-white">{a}</strong>
                        <span className="text-[#6471c4]">{c}</span>
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
          <GlowCard className="glow-card bg-[#08081a] border border-[rgba(99,102,241,0.1)] rounded-2xl p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(99,102,241,0.1),transparent_55%)] pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6366f1]/50 to-transparent" />
            <div className="relative z-10 max-w-[520px] mx-auto text-center">
              <span className="eyebrow center mb-5">GET IN TOUCH</span>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 mt-4">Questions about Val?</h2>
              <p className="text-sm text-[#a5b4fc] mb-8 opacity-80">
                Request a feature, report a wrong price, or just say hello.
              </p>
              <form onSubmit={onContact} className="flex flex-col gap-3 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" value={contactName} onChange={e => setContactName(e.target.value)}
                    placeholder="Your Name" required
                    className="px-4 py-3 bg-[#04040c] border border-[rgba(99,102,241,0.15)] rounded-xl text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors placeholder:text-[#64748b]" />
                  <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)}
                    placeholder="Your Email" required
                    className="px-4 py-3 bg-[#04040c] border border-[rgba(99,102,241,0.15)] rounded-xl text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors placeholder:text-[#64748b]" />
                </div>
                <textarea rows={3} value={contactMsg} onChange={e => setContactMsg(e.target.value)}
                  placeholder="Your message…" required
                  className="px-4 py-3 bg-[#04040c] border border-[rgba(99,102,241,0.15)] rounded-xl text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors placeholder:text-[#64748b] resize-none" />
                <button type="submit" className="btn-primary w-full text-base">
                  Send Message
                </button>
                {feedbackMsg && <p className="text-xs text-[#6366f1] font-semibold text-center">{feedbackMsg}</p>}
              </form>
            </div>
          </GlowCard>
        </RevealOnScroll>
      </section>

      <Footer />
    </>
  );
}
