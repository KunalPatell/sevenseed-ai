"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { GlowCard } from "@/components/GlowCard";
import { AIDemoWidget } from "@/components/AIDemoWidget";
import { RootOrb } from "@/components/RootOrb";
import { apiFetch } from "@/lib/api";
import { CustomCursor } from "@/components/CustomCursor";
import { StarCanvas } from "@/components/StarCanvas";
import {
  Lightbulb,
  Layers,
  Rocket,
  ChevronDown,
  ExternalLink,
  Handshake,
  Network,
  ShieldCheck,
  Scale,
} from "lucide-react";

// ── Real studio facts (mirrors backend/main.py VENTURES + STUDIO_KNOWLEDGE) ──
// Stage reflects what's actually deployed today: 2 ventures are live, the
// rest are mid-build. Sevenseed was founded in 2026, so that split is the
// honest state of a young studio, not a shortfall to hide.
const VENTURES = [
  {
    name: "Comonk Technology",
    sector: "AI Career Intelligence",
    stage: "Live" as const,
    color: "#8b5cf6",
    mechanism: "LangGraph multi-agent · Groq LLaMA 3.3 70B · ChromaDB RAG",
    description: "Career platform with multi-agent counselors, an ATS resume optimizer, and mock interviews.",
    href: "/comonk-ai",
  },
  {
    name: "AVP University",
    sector: "AI Education",
    stage: "Building" as const,
    color: "#3b82f6",
    mechanism: "Adaptive ML · RAG embeddings · NLP assessment agent",
    description: "Personal AI tutor, adaptive assessments, and an AI placement matcher for students.",
    href: "/avpu",
  },
  {
    name: "Decode Forest Pharmacy",
    sector: "AI Healthcare",
    stage: "Building" as const,
    color: "#10b981",
    mechanism: "OCR + vision prescription reader · LLM drug-interaction check",
    description: "Reads handwritten prescriptions, flags drug interactions, and predicts refill timing.",
    href: "/pharmacy",
  },
  {
    name: "Breakdown Factor",
    sector: "AI Construction",
    stage: "Building" as const,
    color: "#f59e0b",
    mechanism: "YOLOv8 vision inspection · ML cost forecasting",
    description: "Site safety monitoring, structural crack detection, and cost forecasting for job sites.",
    href: "/breakdown",
  },
  {
    name: "AVP Charitable Trust",
    sector: "AI Social Impact",
    stage: "Building" as const,
    color: "#ec4899",
    mechanism: "RAG beneficiary matching · LLM impact reporting",
    description: "Finds regional needs, matches beneficiaries, and generates transparent impact reports.",
    href: "/trust",
  },
  {
    name: "AVP Emart",
    sector: "AI E-Commerce",
    stage: "Live" as const,
    color: "#f97316",
    mechanism: "Live 4-store price aggregation · ML value scoring",
    description: "Compares live prices across four online stores with an ML best-value score.",
    href: "/avp-emart",
  },
  {
    name: "Sevenforce",
    sector: "AI Sales & Workforce",
    stage: "Building" as const,
    color: "#f43f5e",
    mechanism: "Automated lead scoring · speech sentiment analysis",
    description: "Sales CRM with automated lead scoring, call sentiment analysis, and pipeline tracking.",
    href: "/sevenforce",
  },
];

const LIVE_COUNT = VENTURES.filter((v) => v.stage === "Live").length;

// ── Root's rotating intro lines — first-person, specific, no filler ──
const ROOT_LINES = [
  "I'm built on Groq's LLaMA 3.3 70B — the same model every venture below runs on.",
  "Ask me to draft a venture pitch in the sandbox below. It's a live call, not a canned demo.",
  "I keep the studio's playbook in a searchable index, so my answers cite real internal docs.",
  "Every tool on this page is free. No account, no card.",
  `${VENTURES.length - LIVE_COUNT} of our ${VENTURES.length} ventures are still building. I won't tell you otherwise.`,
];

const PROCESS_STEPS = [
  {
    n: "01",
    icon: Lightbulb,
    title: "Ideate",
    desc: "Root scans a domain for a real pain point and drafts a structured pitch — market, mechanism, and fit.",
  },
  {
    n: "02",
    icon: Layers,
    title: "Share the backbone",
    desc: "The new venture plugs into the same LLM gateway, vector index, and agent framework every other venture already runs.",
    stack: ["Groq LLaMA 3.3 70B", "LangGraph", "ChromaDB", "FastAPI", "Docker"],
  },
  {
    n: "03",
    icon: Rocket,
    title: "Build",
    desc: "A 2-week sprint turns the idea into a working MVP, because most of the stack is already wired up.",
  },
  {
    n: "04",
    icon: ExternalLink,
    title: "Launch",
    desc: "Ships as a single Docker container on its own domain — one of the ventures in the grid below.",
  },
];

const PLAYBOOK = [
  {
    icon: Handshake,
    title: "How revenue works",
    body: "SaaS subscriptions from each venture, AI consulting through Comonk, CSR partnerships through AVP Trust, and e-commerce GMV through AVP Emart. At the studio level: advisory fees plus equity in each venture.",
  },
  {
    icon: Network,
    title: "Ventures aren't siloed",
    body: "Comonk's AI stack extends to hiring across the whole portfolio. Decode Forest Pharmacy is built to sit on AVP University's campus. Breakdown Factor handles campus construction. AVP Trust funds scholarships there too.",
  },
  {
    icon: ShieldCheck,
    title: "Our AI ethics policy",
    body: "No hallucinated claims presented as fact. Every product is built to work offline without an API key. A human stays in the loop for medical, safety, and financial decisions.",
  },
  {
    icon: Scale,
    title: "What we invest in",
    body: "AI applications, not AI infrastructure — in sectors India's AI wave has mostly skipped: education, pharmacy, construction, and the social sector.",
  },
];

export default function Home() {
  const [scrollPct, setScrollPct] = useState(0);
  const [rootLineIdx, setRootLineIdx] = useState(0);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [contactWebsite, setContactWebsite] = useState(""); // honeypot
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [feedbackOk, setFeedbackOk] = useState(true);

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

  useEffect(() => {
    const t = setInterval(() => setRootLineIdx((i) => (i + 1) % ROOT_LINES.length), 4600);
    return () => clearInterval(t);
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMsg("Sending message...");
    setFeedbackOk(true);
    try {
      const res = await apiFetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          subject: contactSubject,
          message: contactMsg,
          website: contactWebsite,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setFeedbackOk(false);
        setFeedbackMsg(data?.detail || "Could not send message. Please try again.");
        return;
      }
      setFeedbackOk(true);
      setFeedbackMsg("Thank you! Your message has been sent successfully.");
      setContactName("");
      setContactEmail("");
      setContactSubject("");
      setContactMsg("");
    } catch (err) {
      setFeedbackOk(false);
      setFeedbackMsg("Could not send message. Please try again.");
    }
  };

  return (
    <>
      <CustomCursor />
      <StarCanvas />
      <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />
      <Navbar />

      {/* Hero — Root-led, two column. No stat-card grid; the honest numbers
          live inside Root's panel instead of a generic bordered row. */}
      <header className="relative min-h-screen flex items-center px-6 py-32 md:py-28 overflow-hidden bg-[#090710]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#8b5cf6]/20 via-[#10b981]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#8b5cf6]/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#6366f1]/10 rounded-full blur-[110px] pointer-events-none" />
        <div className="hero-grid" />

        <div className="relative z-10 max-w-[1180px] w-full mx-auto grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-14 items-center">
          {/* Left: copy + CTAs */}
          <div className="flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-mono font-bold tracking-wider text-[#ddd6fe] bg-black/60 border border-[#8b5cf6]/40 shadow-[0_0_25px_rgba(139,92,246,0.2)] mb-7 backdrop-blur-xl"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8b5cf6] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8b5cf6]"></span>
              </span>
              <span className="uppercase text-[10px] sm:text-[11px]">100% FREE · NO CREDIT CARD · BUILT IN AHMEDABAD</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-[64px] font-black leading-[1.08] tracking-tight mb-6 text-white"
            >
              Seven startups.{" "}
              <span className="bg-gradient-to-r from-[#ddd6fe] via-[#8b5cf6] to-[#10b981] bg-clip-text text-transparent">
                One shared AI backbone.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="text-base md:text-lg text-[#9aa0b8] max-w-[540px] leading-relaxed mb-9 font-normal"
            >
              Sevenseed is a startup studio in Ahmedabad. We design, build, and ship AI products for seven ventures
              from one shared stack — Groq&apos;s LLaMA 3.3 70B, LangGraph agents, and a ChromaDB vector index —
              so a new venture goes from idea to working MVP in about two weeks instead of six months.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/app/" className="btn bg-gradient-to-r from-[#8b5cf6] to-[#10b981] hover:scale-[1.03] text-white font-extrabold text-sm md:text-base px-7 py-3.5 rounded-xl shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all duration-300 flex items-center gap-2">
                Open the Studio Hub
              </Link>
              <a href="#portfolio" className="btn border border-white/20 bg-black/50 text-white hover:bg-white/10 hover:border-[#8b5cf6] text-sm md:text-base px-7 py-3.5 rounded-xl transition-all duration-300 backdrop-blur-xl font-bold flex items-center gap-2">
                See the 7 Ventures
              </a>
            </motion.div>
          </div>

          {/* Right: Root, the studio AI */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="glass-spotlight rounded-3xl p-6 sm:p-7 w-full"
          >
            <div className="flex items-center gap-4 mb-5">
              <RootOrb size="lg" speaking />
              <div>
                <div className="text-lg font-black text-white leading-none">Root</div>
                <div className="text-xs text-[#9aa0b8] mt-1.5">Sevenseed&apos;s studio AI</div>
              </div>
            </div>

            <div className="min-h-[64px] flex items-center bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 mb-5">
              <AnimatePresence mode="wait">
                <motion.p
                  key={rootLineIdx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35 }}
                  className="text-[13px] sm:text-sm text-[#eeeef8] leading-relaxed"
                >
                  &ldquo;{ROOT_LINES[rootLineIdx]}&rdquo;
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <div className="text-xl sm:text-2xl font-black font-mono text-[#ddd6fe]">
                  <AnimatedCounter value={VENTURES.length} />
                </div>
                <div className="text-[9px] text-[#9aa0b8] uppercase tracking-wider font-mono mt-1">Ventures</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black font-mono text-[#6ee7b7]">
                  <AnimatedCounter value={LIVE_COUNT} />
                </div>
                <div className="text-[9px] text-[#9aa0b8] uppercase tracking-wider font-mono mt-1">Live Now</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black font-mono text-[#ddd6fe]">
                  <AnimatedCounter value={2} suffix=" wk" />
                </div>
                <div className="text-[9px] text-[#9aa0b8] uppercase tracking-wider font-mono mt-1">MVP Sprint</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black font-mono text-[#6ee7b7]">
                  <AnimatedCounter value={100} suffix="%" />
                </div>
                <div className="text-[9px] text-[#9aa0b8] uppercase tracking-wider font-mono mt-1">Free</div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Venture-name marquee — a teaser for the portfolio grid, not a generic
          buzzword ticker. Wrapper stays overflow-hidden so it can never force
          horizontal scroll, even at 375px. */}
      <section className="bg-[#0b0b12] border-y border-white/5 py-4 px-6 overflow-hidden">
        <div className="w-full mask-image-gradient overflow-hidden select-none opacity-70">
          <div className="marquee-track text-[#ddd6fe] text-xs font-mono font-semibold">
            {[...VENTURES, ...VENTURES].map((v, i) => (
              <span key={i}>
                ✦ {v.name} — {v.sector}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How a venture actually gets built — merges the old icon-pillar band
          and stack strip into one connected process, reusing the existing
          node-connector-line token instead of two separate feature grids. */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12">
        <RevealOnScroll>
          <span className="eyebrow center block">Studio Process</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-14">
            How a Sevenseed venture gets built
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-4">
          {PROCESS_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <RevealOnScroll key={step.n} delay={i * 0.06} className="relative">
                {i < PROCESS_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-[26px] left-[calc(50%+34px)] right-[calc(-50%+34px)] node-connector-line rounded-full" />
                )}
                <div className="relative bg-[#12121e] border border-white/5 rounded-2xl p-6 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#8b5cf6]/15 text-[#ddd6fe] shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-2xl font-black text-white/10 font-mono">{step.n}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">{step.title}</h4>
                  <p className="text-xs text-[#9aa0b8] leading-relaxed">{step.desc}</p>
                  {step.stack && (
                    <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-white/5">
                      {step.stack.map((s) => (
                        <span key={s} className="text-[9px] font-mono text-[#ddd6fe] bg-black/40 border border-white/5 px-1.5 py-1 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </section>

      {/* About */}
      <section className="max-w-[1180px] mx-auto py-16 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" id="about">
        <RevealOnScroll className="lg:col-span-7 flex flex-col gap-4">
          <span className="eyebrow">Est. 2026 · Ahmedabad, Gujarat</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            We don&apos;t fund startups. We write their code.
          </h2>
          <p className="text-sm md:text-base text-[#9aa0b8] leading-relaxed mt-2">
            Sevenseed is a venture studio, not an accelerator — we design the product, build the multi-agent
            workflows, and deploy the containers ourselves, alongside each founder. Every venture we launch shares
            the same RAG index and LLM gateway that Root runs on.
          </p>
          <p className="text-sm md:text-base text-[#9aa0b8] leading-relaxed">
            That shared backbone is why a new venture reaches a working MVP in about two weeks instead of six
            months. Look through the seven ventures below, or pitch your own idea to Root in the sandbox.
          </p>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1} className="lg:col-span-5">
          <GlowCard className="glow-card bg-gradient-to-br from-[#12121e] to-[#0d0d16] border border-white/5 rounded-2xl p-8">
            <RootOrb size="md" className="mb-6" />
            <h3 className="text-lg font-bold text-white mb-4">Why found a venture here</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3 text-sm text-[#9aa0b8] border-b border-white/5 pb-3">
                <span className="w-[20px] h-[20px] rounded bg-[#8b5cf6]/15 grid place-items-center shrink-0 mt-0.5 text-[#ddd6fe] text-xs">✓</span>
                <span>A working RAG + LLM gateway on day one, not a six-month build.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[#9aa0b8] border-b border-white/5 pb-3">
                <span className="w-[20px] h-[20px] rounded bg-[#8b5cf6]/15 grid place-items-center shrink-0 mt-0.5 text-[#ddd6fe] text-xs">✓</span>
                <span>Root drafts your first pitch and technical plan for free, in the sandbox below.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[#9aa0b8] border-b border-white/5 pb-3">
                <span className="w-[20px] h-[20px] rounded bg-[#8b5cf6]/15 grid place-items-center shrink-0 mt-0.5 text-[#ddd6fe] text-xs">✓</span>
                <span>Cross-portfolio distribution — six sibling ventures to integrate or refer customers with.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[#9aa0b8]">
                <span className="w-[20px] h-[20px] rounded bg-[#8b5cf6]/15 grid place-items-center shrink-0 mt-0.5 text-[#ddd6fe] text-xs">✓</span>
                <span>Docker-container deploys, so launch day is a `docker run`, not a DevOps project.</span>
              </li>
            </ul>
          </GlowCard>
        </RevealOnScroll>
      </section>

      {/* The Seven Ventures — the actual point of this page: a hub linking
          out, with honest stage badges and real per-venture mechanisms
          instead of a generic feature grid. */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="portfolio">
        <RevealOnScroll>
          <span className="eyebrow center block">The Studio Portfolio</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-4">Seven ventures, one backbone</h2>
          <p className="text-sm md:text-base text-[#9aa0b8] text-center max-w-[600px] mx-auto mb-12">
            {LIVE_COUNT} are live today. The rest are mid-build — every one of them runs on the same stack Root
            uses in the sandbox below.
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {VENTURES.map((v, i) => (
            <RevealOnScroll key={v.name} delay={(i % 3) * 0.06}>
              <GlowCard className="glass-spotlight p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="w-10 h-10 rounded-lg grid place-items-center text-sm font-black shrink-0"
                    style={{ background: `${v.color}22`, color: v.color }}
                  >
                    {v.name.charAt(0)}
                  </span>
                  <span className={`text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full ${v.stage === "Live" ? "stage-live" : "stage-building"}`}>
                    {v.stage}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase" style={{ color: v.color }}>
                  {v.sector}
                </span>
                <h4 className="text-base font-bold text-white mt-1.5">{v.name}</h4>
                <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mt-2 flex-1">{v.description}</p>
                <p className="text-[10px] font-mono text-[#5b5f78] leading-relaxed mt-4 pt-3 border-t border-white/5">
                  {v.mechanism}
                </p>
                <Link href={v.href} className="text-xs text-[#6ee7b7] font-semibold flex items-center gap-1.5 w-fit hover:underline mt-4">
                  Open {v.name.split(" ")[0]} <ExternalLink className="h-3 w-3" />
                </Link>
              </GlowCard>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* Studio Playbook — replaces a generic testimonial carousel (which
          would have meant inventing quotes from customers we don't have yet)
          with real, verifiable facts about how the studio operates. */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="playbook">
        <RevealOnScroll>
          <span className="eyebrow center block">How the Studio Works</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-4">The studio playbook</h2>
          <p className="text-sm md:text-base text-[#9aa0b8] text-center max-w-[600px] mx-auto mb-12">
            Not customer quotes — we&apos;re too early for those to mean much. This is the actual internal
            playbook Root references when it answers questions about the studio.
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {PLAYBOOK.map((item, i) => {
            const Icon = item.icon;
            return (
              <RevealOnScroll key={item.title} delay={i * 0.06}>
                <div className="tcard flex gap-4 h-full">
                  <div className="w-11 h-11 rounded-lg grid place-items-center bg-[#10b981]/10 text-[#6ee7b7] shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed">{item.body}</p>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </section>

      {/* Root Console — the ideation sandbox, straight in, no redundant
          feature-card row duplicating what the widget's own tabs already say. */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="ideate">
        <RevealOnScroll>
          <span className="eyebrow center block">Try Root</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-4">
            Pitch Root your venture idea
          </h2>
          <p className="text-sm md:text-base text-[#9aa0b8] text-center max-w-[600px] mx-auto mb-12">
            Describe a domain and a problem — Root drafts a structured AI-venture pitch using the same model and
            playbook index that runs the rest of the studio. No signup.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <AIDemoWidget />
        </RevealOnScroll>
      </section>

      {/* FAQ */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="faq">
        <RevealOnScroll>
          <span className="eyebrow center block">FAQ</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-12">Studio questions, answered</h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1} className="max-w-[760px] mx-auto faq-list">
          <details>
            <summary className="faq-summary">
              What is a venture studio? <ChevronDown className="h-4 w-4 text-[#ddd6fe]" />
            </summary>
            <p className="text-xs md:text-sm text-[#9aa0b8] mt-3 leading-relaxed">
              Unlike an accelerator or a VC fund, a venture studio builds companies from scratch. We write the
              software, design the product, and deploy the backend containers ourselves.
            </p>
          </details>

          <details>
            <summary className="faq-summary">
              How does the shared AI stack actually help? <ChevronDown className="h-4 w-4 text-[#ddd6fe]" />
            </summary>
            <p className="text-xs md:text-sm text-[#9aa0b8] mt-3 leading-relaxed">
              Every venture is built on the same LangGraph agent templates, FastAPI backend structure, and
              SQLite data layer. That means a new venture&apos;s codebase is ready in days, not the months it
              takes to wire up an LLM gateway and vector store from zero.
            </p>
          </details>

          <details>
            <summary className="faq-summary">
              How can I pitch my startup idea? <ChevronDown className="h-4 w-4 text-[#ddd6fe]" />
            </summary>
            <p className="text-xs md:text-sm text-[#9aa0b8] mt-3 leading-relaxed">
              Use Root in the sandbox above to test domain viability and draft a structured pitch, then send us
              the details through the contact form below.
            </p>
          </details>

          <details>
            <summary className="faq-summary">
              Where are you located? <ChevronDown className="h-4 w-4 text-[#ddd6fe]" />
            </summary>
            <p className="text-xs md:text-sm text-[#9aa0b8] mt-3 leading-relaxed">
              Ahmedabad, Gujarat, India.
            </p>
          </details>
        </RevealOnScroll>
      </section>

      {/* Contact */}
      <section className="max-w-[1180px] mx-auto py-20 px-6 md:px-12" id="contact">
        <RevealOnScroll>
          <GlowCard className="bg-[#12121e] border border-white/5 rounded-2xl p-8 relative overflow-hidden flex flex-col items-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(139,92,246,0.1),transparent_60%)] pointer-events-none" />

            <div className="relative z-10 max-w-[640px] w-full text-center flex flex-col items-center">
              <RootOrb size="sm" className="mb-4" />
              <span className="eyebrow">Get in touch</span>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Bring us your venture idea.</h2>
              <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed mb-8">
                Reaches the founding team directly — not a support queue. Tell us the domain, the problem, and
                what you&apos;ve already tried.
              </p>

              <form onSubmit={handleContactSubmit} className="w-full flex flex-col gap-3">
                {/* Honeypot — hidden from real users, bots tend to fill every field */}
                <input
                  type="text"
                  value={contactWebsite}
                  onChange={(e) => setContactWebsite(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] w-px h-px opacity-0"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Your Name"
                    required
                    className="w-full px-4 py-3 bg-[#0d0d16] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#8b5cf6]"
                  />
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="Your Email"
                    required
                    className="w-full px-4 py-3 bg-[#0d0d16] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#8b5cf6]"
                  />
                </div>
                <input
                  type="text"
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  placeholder="Subject"
                  required
                  className="w-full px-4 py-3 bg-[#0d0d16] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#8b5cf6]"
                />
                <textarea
                  rows={4}
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  placeholder="Tell us about your venture idea..."
                  required
                  className="w-full px-4 py-3 bg-[#0d0d16] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#8b5cf6] resize-none"
                />
                <button
                  type="submit"
                  className="btn w-full bg-gradient-to-r from-[#8b5cf6] to-[#10b981] text-white font-semibold py-3 rounded-lg hover:scale-[1.01] transition-all cursor-pointer"
                >
                  Send Message
                </button>
                {feedbackMsg && (
                  <p className={`text-xs font-semibold mt-2 ${feedbackOk ? "text-[#6ee7b7]" : "text-[#fca5a5]"}`}>
                    {feedbackMsg}
                  </p>
                )}
              </form>
            </div>
          </GlowCard>
        </RevealOnScroll>
      </section>

      <Footer />
    </>
  );
}
