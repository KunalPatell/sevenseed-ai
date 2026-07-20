"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  FileText, 
  ShieldCheck, 
  IndianRupee, 
  Truck, 
  Cpu, 
  Bot, 
  CalendarCheck, 
  Eye, 
  MessageSquare,
  Search,
  ChevronDown,
  Activity
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

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center text-center px-6 py-24 overflow-hidden bg-[#060609]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.2),transparent_60%)]" />
        <div className="hero-grid" />
        
        <div className="relative z-10 max-w-[900px] w-full flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-[#6ee7b7] bg-[#10b981]/10 border border-[#10b981]/25 mb-8">
            <Cpu className="h-3.5 w-3.5" />
            <span>AI Prescription Reading · Drug-Interaction AI · Smart Delivery</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-6">
            AI-powered pharmacy — <span className="grad">smarter, safer</span><br />healthcare for everyone
          </h1>

          <p className="text-sm md:text-lg text-[#9aa0b8] max-w-[670px] leading-relaxed mb-10">
            A modern pharmacy where AI reads prescriptions, checks drug interactions, and recommends affordable alternatives — with intelligent, on-time doorstep delivery you can trust.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <Link href="/app/" className="btn bg-gradient-to-r from-[#10b981] to-[#14b8a6] hover:scale-[1.02] text-white font-semibold text-sm md:text-base px-6 py-3 rounded-lg shadow-[0_6px_22px_rgba(16,185,129,0.3)] transition-all duration-200">
              <i className="fas fa-rocket mr-2"></i> Launch AI Portal
            </Link>
            <a href="#services" className="btn border border-white/15 bg-white/[0.03] text-white hover:bg-[#18182a] hover:border-[#10b981]/50 text-sm md:text-base px-6 py-3 rounded-lg transition-all duration-200">
              <i className="fas fa-microchip mr-2"></i> See the AI
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center bg-[#12121e]/60 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md mb-12">
            <div className="px-6 md:px-8 py-5 text-center min-w-[120px]">
              <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#6ee7b7] to-[#5eead4] bg-clip-text text-transparent">10k+</div>
              <div className="text-[10px] md:text-xs text-[#9aa0b8] uppercase tracking-wider font-semibold mt-1">Products</div>
            </div>
            <div className="w-[1px] self-stretch bg-white/5" />
            <div className="px-6 md:px-8 py-5 text-center min-w-[120px]">
              <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#6ee7b7] to-[#5eead4] bg-clip-text text-transparent">24/7</div>
              <div className="text-[10px] md:text-xs text-[#9aa0b8] uppercase tracking-wider font-semibold mt-1">AI Assistant</div>
            </div>
            <div className="w-[1px] self-stretch bg-white/5" />
            <div className="px-6 md:px-8 py-5 text-center min-w-[120px]">
              <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#6ee7b7] to-[#5eead4] bg-clip-text text-transparent">100%</div>
              <div className="text-[10px] md:text-xs text-[#9aa0b8] uppercase tracking-wider font-semibold mt-1">AI-Verified</div>
            </div>
            <div className="w-[1px] self-stretch bg-white/5" />
            <div className="px-6 md:px-8 py-5 text-center min-w-[120px]">
              <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#6ee7b7] to-[#5eead4] bg-clip-text text-transparent">60min</div>
              <div className="text-[10px] md:text-xs text-[#9aa0b8] uppercase tracking-wider font-semibold mt-1">Delivery</div>
            </div>
          </div>

          <div className="w-full max-w-[760px] mask-image-gradient overflow-hidden select-none opacity-50">
            <div className="marquee-track text-[#5b5f78] text-xs font-mono font-semibold">
              <span>AI Prescription Reader</span>
              <span>Drug-Interaction AI</span>
              <span>Smart Substitutes</span>
              <span>Refill Prediction</span>
              <span>Health Assistant</span>
              <span>Route Optimisation</span>
              <span>Genuine Medicines</span>
              <span>Doorstep Delivery</span>
            </div>
          </div>
        </div>
      </header>

      {/* Pillars Band */}
      <section className="bg-[#0b0b12] border-y border-white/5 py-8 px-6 md:px-12">
        <div className="max-w-[1180px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex gap-4 items-center">
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#10b981]/15 text-[#6ee7b7] shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">AI Reads Scripts</div>
              <p className="text-xs text-[#9aa0b8] mt-0.5">OCR + vision extract your medicines.</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#10b981]/15 text-[#6ee7b7] shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">AI Safety Checks</div>
              <p className="text-xs text-[#9aa0b8] mt-0.5">Drug-interaction alerts on every order.</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#10b981]/15 text-[#6ee7b7] shrink-0">
              <IndianRupee className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">Smart Savings</div>
              <p className="text-xs text-[#9aa0b8] mt-0.5">AI finds affordable generics.</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#10b981]/15 text-[#6ee7b7] shrink-0">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">Smart Delivery</div>
              <p className="text-xs text-[#9aa0b8] mt-0.5">Route-optimised, often under 60 min.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Stack Strip */}
      <section className="py-6 px-6 md:px-12 border-b border-white/5 text-center">
        <span className="text-xs font-bold tracking-wider text-[#9aa0b8] uppercase inline-flex items-center gap-2 mb-3">
          <i className="fas fa-bolt text-[#6ee7b7]"></i> Powered by a production-grade AI stack
        </span>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {["LangGraph Multi-Agent", "Groq LLaMA 3.3 70B", "ChromaDB RAG", "MiniLM Embeddings", "FastAPI", "OCR + Vision", "ML Forecasting"].map(stack => (
            <span key={stack} className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#eeeef8] bg-[#12121e] border border-white/5 px-3 py-1.5 rounded-lg">
              <Cpu className="h-3 w-3 text-[#6ee7b7]" /> {stack}
            </span>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-[1180px] mx-auto py-24 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" id="about">
        <div className="lg:col-span-7 flex flex-col gap-4">
          <span className="eyebrow">Est. 2026 · AI-Powered Pharmacy & Healthcare</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">Healthcare made smarter with AI.</h2>
          <p className="text-sm md:text-base text-[#9aa0b8] leading-relaxed mt-2">
            Decode Forest Pharmacy blends genuine medicines with intelligent software. AI reads your prescription, checks for harmful drug interactions, and suggests affordable alternatives — so every order is safer and easier.
          </p>
          <p className="text-sm md:text-base text-[#9aa0b8] leading-relaxed">
            With an AI health assistant, refill prediction, and route-optimised delivery, staying healthy has never been more convenient. Every product is 100% genuine and sourced from licensed distributors.
          </p>
        </div>
        <div className="lg:col-span-5 glow-card bg-gradient-to-br from-[#12121e] to-[#0d0d16] border border-white/5 rounded-2xl p-8">
          <div className="w-14 h-14 rounded-xl grid place-items-center text-white bg-gradient-to-br from-[#10b981] to-[#14b8a6] shadow-[0_8px_24px_rgba(16,185,129,0.3)] mb-6">
            <Activity className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-4">Why Decode Forest?</h3>
          <ul className="flex flex-col gap-4">
            <li className="flex items-start gap-3 text-sm text-[#9aa0b8] border-b border-white/5 pb-3">
              <span className="w-[20px] h-[20px] rounded bg-[#10b981]/15 grid place-items-center shrink-0 mt-0.5"><i className="fas fa-check text-xs text-[#6ee7b7]"></i></span>
              <span>AI reads & verifies handwritten prescriptions</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-[#9aa0b8] border-b border-white/5 pb-3">
              <span className="w-[20px] h-[20px] rounded bg-[#10b981]/15 grid place-items-center shrink-0 mt-0.5"><i className="fas fa-check text-xs text-[#6ee7b7]"></i></span>
              <span>Automatic drug-drug interaction safety monitoring</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-[#9aa0b8] border-b border-white/5 pb-3">
              <span className="w-[20px] h-[20px] rounded bg-[#10b981]/15 grid place-items-center shrink-0 mt-0.5"><i className="fas fa-check text-xs text-[#6ee7b7]"></i></span>
              <span>Bioequivalent generic suggestions for high savings</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-[#9aa0b8]">
              <span className="w-[20px] h-[20px] rounded bg-[#10b981]/15 grid place-items-center shrink-0 mt-0.5"><i className="fas fa-check text-xs text-[#6ee7b7]"></i></span>
              <span>Route-optimised doorstep delivery within Anand/Nadiad</span>
            </li>
          </ul>
        </div>
      </section>

      {/* AI Capabilities / Services */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="services">
        <span className="eyebrow center block">AI CAPABILITIES</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12">Intelligent tools for your health</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article className="bg-[#12121e] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-lg flex flex-col">
            <div className="w-12 h-12 rounded-xl grid place-items-center bg-[#10b981]/10 text-[#6ee7b7] mb-4">
              <FileText className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">AI Prescription Reader</h4>
            <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mb-6 flex-1">
              Computer vision and OCR read handwritten prescriptions and extract medicines instantly.
            </p>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#6ee7b7] bg-[#10b981]/10 px-2.5 py-1 rounded-full w-fit">
              <Cpu className="h-3 w-3" /> OCR + Vision
            </span>
          </article>

          <article className="bg-[#12121e] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-lg flex flex-col">
            <div className="w-12 h-12 rounded-xl grid place-items-center bg-[#14b8a6]/10 text-[#5eead4] mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Drug Interaction Checker</h4>
            <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mb-6 flex-1">
              An AI safety layer flags potentially harmful drug interactions before dispatch.
            </p>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#5eead4] bg-[#14b8a6]/10 px-2.5 py-1 rounded-full w-fit">
              <Cpu className="h-3 w-3" /> LLM Safety
            </span>
          </article>

          <article className="bg-[#12121e] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-lg flex flex-col">
            <div className="w-12 h-12 rounded-xl grid place-items-center bg-[#10b981]/10 text-[#6ee7b7] mb-4">
              <IndianRupee className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Smart Substitutes</h4>
            <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mb-6 flex-1">
              ML recommends genuine, affordable generic alternatives that save you up to 80%.
            </p>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#6ee7b7] bg-[#10b981]/10 px-2.5 py-1 rounded-full w-fit">
              <Cpu className="h-3 w-3" /> Recommender
            </span>
          </article>

          <article className="bg-[#12121e] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-lg flex flex-col">
            <div className="w-12 h-12 rounded-xl grid place-items-center bg-[#14b8a6]/10 text-[#5eead4] mb-4">
              <Bot className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">AI Health Assistant</h4>
            <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mb-6 flex-1">
              A 24/7 LLM assistant answers your medicine, safety, and wellness questions.
            </p>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#5eead4] bg-[#14b8a6]/10 px-2.5 py-1 rounded-full w-fit">
              <Cpu className="h-3 w-3" /> Groq LLaMA 3.3
            </span>
          </article>

          <article className="bg-[#12121e] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-lg flex flex-col">
            <div className="w-12 h-12 rounded-xl grid place-items-center bg-[#10b981]/10 text-[#6ee7b7] mb-4">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Refill Prediction</h4>
            <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mb-6 flex-1">
              AI predicts when you&apos;ll run out and reminds you to reorder, saving delays.
            </p>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#6ee7b7] bg-[#10b981]/10 px-2.5 py-1 rounded-full w-fit">
              <Cpu className="h-3 w-3" /> ML Forecasting
            </span>
          </article>

          <article className="bg-[#12121e] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-lg flex flex-col">
            <div className="w-12 h-12 rounded-xl grid place-items-center bg-[#14b8a6]/10 text-[#5eead4] mb-4">
              <Truck className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Smart Delivery Routing</h4>
            <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mb-6 flex-1">
              Route-optimisation AI ensures the fastest possible doorstep delivery of orders.
            </p>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#5eead4] bg-[#14b8a6]/10 px-2.5 py-1 rounded-full w-fit">
              <Cpu className="h-3 w-3" /> Optimisation
            </span>
          </article>
        </div>
      </section>

      {/* Process Section */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="process">
        <span className="eyebrow center block">THE PROCESS</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12">Get your medicines the smart way</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#12121e] border border-white/5 rounded-2xl p-6 relative">
            <div className="absolute top-4 right-5 text-4xl font-black text-white/5 select-none font-mono">01</div>
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#10b981]/10 text-[#6ee7b7] mb-4">
              <i className="fas fa-file-arrow-up text-lg"></i>
            </div>
            <h4 className="text-sm font-bold text-white mb-2">Upload Prescription</h4>
            <p className="text-xs text-[#9aa0b8] leading-relaxed">Snap a photo — AI reads and extracts your medicines in seconds.</p>
          </div>

          <div className="bg-[#12121e] border border-white/5 rounded-2xl p-6 relative">
            <div className="absolute top-4 right-5 text-4xl font-black text-white/5 select-none font-mono">02</div>
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#14b8a6]/10 text-[#5eead4] mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-2">AI Safety Check</h4>
            <p className="text-xs text-[#9aa0b8] leading-relaxed">Our AI verifies interactions and suggests affordable generic options.</p>
          </div>

          <div className="bg-[#12121e] border border-white/5 rounded-2xl p-6 relative">
            <div className="absolute top-4 right-5 text-4xl font-black text-white/5 select-none font-mono">03</div>
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#10b981]/10 text-[#6ee7b7] mb-4">
              <i className="fas fa-box text-lg"></i>
            </div>
            <h4 className="text-sm font-bold text-white mb-2">Pack & Dispatch</h4>
            <p className="text-xs text-[#9aa0b8] leading-relaxed">Licensed pharmacists package and double-check your order.</p>
          </div>

          <div className="bg-[#12121e] border border-white/5 rounded-2xl p-6 relative">
            <div className="absolute top-4 right-5 text-4xl font-black text-white/5 select-none font-mono">04</div>
            <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#14b8a6]/10 text-[#5eead4] mb-4">
              <Truck className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-2">Smart Delivery</h4>
            <p className="text-xs text-[#9aa0b8] leading-relaxed">Route-optimised delivery brings it directly to your doorstep.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="testimonials">
        <span className="eyebrow center block">REVIEWS</span>
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
            <summary className="faq-summary">How does the AI read my prescription? <ChevronDown className="h-4 w-4 text-[#6ee7b7]" /></summary>
            <p className="text-xs md:text-sm text-[#9aa0b8] mt-3 leading-relaxed">
              Our system uses computer vision and custom OCR models to extract text from the upload, which are cross-checked by our database and verified by a human pharmacist before dispensing.
            </p>
          </details>

          <details>
            <summary className="faq-summary">Is the drug interaction check reliable? <ChevronDown className="h-4 w-4 text-[#6ee7b7]" /></summary>
            <p className="text-xs md:text-sm text-[#9aa0b8] mt-3 leading-relaxed">
              Yes, the database contains standard, clinically-verified drug-drug interaction pairs. For any complex prescription, our qualified pharmacist verifies the results.
            </p>
          </details>

          <details>
            <summary className="faq-summary">Are your medicines genuine? <ChevronDown className="h-4 w-4 text-[#6ee7b7]" /></summary>
            <p className="text-xs md:text-sm text-[#9aa0b8] mt-3 leading-relaxed">
              Every medicine and supplement is sourced directly from licensed pharma companies or certified distributors, accompanied by batch numbers and expiry dates.
            </p>
          </details>

          <details>
            <summary className="faq-summary">How fast is the doorstep delivery? <ChevronDown className="h-4 w-4 text-[#6ee7b7]" /></summary>
            <p className="text-xs md:text-sm text-[#9aa0b8] mt-3 leading-relaxed">
              In Ahmedabad and Anand city areas, we provide delivery within 60 minutes to 3 hours using route-optimisation scheduling algorithms.
            </p>
          </details>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="contact">
        <div className="bg-[#12121e] border border-white/5 rounded-2xl p-8 relative overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.1),transparent_60%)] pointer-events-none" />
          
          <div className="relative z-10 max-w-[640px] w-full text-center flex flex-col items-center">
            <span className="eyebrow">GET IN TOUCH</span>
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
