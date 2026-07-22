"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MayaDemo } from "@/components/MayaDemo";
import { PersonaAvatar } from "@/components/PersonaAvatar";
import { RevealOnScroll } from "@/components/RevealOnScroll";

const PILLARS = [
  { icon: "fa-users-gear", title: "7 AI Employees", sub: "A specialist for every core business job." },
  { icon: "fa-rocket", title: "Growth AI Suite", sub: "Content, social & campaigns that compound." },
  { icon: "fa-building", title: "Agency AI Suite", sub: "Proposals, meetings, hiring & delivery." },
  { icon: "fa-plug", title: "One Platform", sub: "Every agent on Sevenseed's shared AI stack." },
];

const STACK = [
  "LangGraph Multi-Agent", "Groq LLaMA 3.3 70B", "ChromaDB RAG",
  "MiniLM Embeddings", "FastAPI", "Multi-Agent Orchestration", "NL-to-SQL",
];

// The seven named AI employees. These names are used across the site and the
// portal — keep them in sync with backend/agents.py.
const TEAM = [
  { tone: "p", icon: "fa-pen-nib", name: "Maya — Content & SEO", suite: "Growth AI", desc: "Builds a brand profile from any URL, then generates SEO topics and full long-form articles." },
  { tone: "s", icon: "fa-hashtag", name: "Vibe — Social Media", suite: "Growth AI", desc: "Writes platform-perfect captions and posts, schedules them, and tracks engagement." },
  { tone: "p", icon: "fa-comment-dots", name: "Wave — Sales & Comms", suite: "Growth AI", desc: "Runs WhatsApp broadcasts, an auto-reply chatbot, and personalised bulk-email campaigns." },
  { tone: "s", icon: "fa-file-signature", name: "Nova — Business Analyst", suite: "Agency AI", desc: "Turns a brief into proposals, BRD/PRD docs (Word export), user stories and test cases." },
  { tone: "p", icon: "fa-microphone-lines", name: "Echo — Meeting Assistant", suite: "Agency AI", desc: "Turns any transcript into a clean summary, decisions, and owner-tagged action items." },
  { tone: "s", icon: "fa-user-tie", name: "Scout — AI Recruiter", suite: "Agency AI", desc: "Screens resumes, generates interview questions, and scores answers on seven dimensions." },
  { tone: "p", icon: "fa-chart-column", name: "Sage — Data Analyst", suite: "Agency AI", desc: "Answers questions about your data in plain English with a safe, instant NL-to-SQL engine." },
];

const PROCESS = [
  { n: "01", icon: "fa-user-plus", title: "Hire an AI employee", desc: "Pick the agents your business needs — all from one dashboard." },
  { n: "02", icon: "fa-sliders", title: "Brief them once", desc: "Give context once; they learn your brand, data, and goals." },
  { n: "03", icon: "fa-robot", title: "They do the work", desc: "Content, campaigns, docs, meetings, hiring and analytics — automated." },
  { n: "04", icon: "fa-chart-line", title: "You scale", desc: "Ship more with a lean team and an AI workforce that never sleeps." },
];

const METRICS = [
  { num: "7", lbl: "AI Employees", sub: "Across two suites" },
  { num: "2", lbl: "AI Suites", sub: "Growth AI + Agency AI" },
  { num: "24/7", lbl: "Always On", sub: "Hours a day, no downtime" },
];

const REVIEWS = [
  { avatar: "F", who: "Founder", org: "Growth-Stage SaaS", quote: "We replaced five disconnected tools with Sevenforce's AI team — and now move twice as fast." },
  { avatar: "O", who: "Owner", org: "Digital Agency", quote: "Nova drafted our client proposal and Echo handled the meeting notes. Unreal." },
  { avatar: "OL", who: "Operations Lead", org: "D2C Brand", quote: "Sage answers our data questions in plain English — no analyst required." },
];

const FAQS = [
  { q: "What is Sevenforce?", a: "An AI workforce platform — hire specialised AI employees for marketing, sales, hiring, meetings, documents and data, all from one dashboard." },
  { q: "What are the Growth AI and Agency AI suites?", a: "Growth AI covers content, social and campaigns (Maya, Vibe, Wave). Agency AI covers proposals & docs, meetings, hiring and data (Nova, Echo, Scout, Sage)." },
  { q: "Do I have to hire all seven?", a: "No — start with the AI employees you need most and add more anytime. Each works on its own or together with the rest." },
  { q: "What powers Sevenforce?", a: "Sevenseed's shared AI backbone — LangGraph multi-agent orchestration, Groq LLaMA 3.3 70B, RAG, and a safe NL-to-SQL engine." },
];

const MARQUEE = [
  "Content AI", "Social AI", "WhatsApp AI", "Proposals & BRD", "Meeting Notes",
  "AI Recruiter", "Ask-Your-Data", "Campaigns", "Test Cases", "Automation",
];

export default function Home() {
  const [scrollPct, setScrollPct] = useState(0);
  const [sent, setSent] = useState("");

  useEffect(() => {
    const onScroll = () => {
      const s = document.documentElement.scrollTop || document.body.scrollTop;
      const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollPct(h > 0 ? (s / h) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onContact = (e: React.FormEvent) => {
    e.preventDefault();
    setSent("Thanks — your message has been noted. We'll get back to you at the email you provided.");
  };

  return (
    <>
      <span id="top" />
      <div className="grain" aria-hidden />
      <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <header className="hero">
        <div className="hero-glow" />
        <div className="hero-grid" />
        <div className="hero-orb orb-1" />
        <div className="hero-orb orb-2" />

        <div className="hero-content">
          <div className="persona-wrap">
            <PersonaAvatar
              size={200}
              primary="#06b6d4"
              secondary="#67e8f9"
              accessory="headset"
              name="Maya"
              role="Content & SEO AI"
            />
          </div>

          <div className="hero-pill">
            <i className="fas fa-microchip" /> ✦ 100% FREE · NO CREDIT CARD REQUIRED · TACTICAL COMMAND CENTER
          </div>

          <h1 className="hero-title">
            Hire your autonomous <span className="grad">AI workforce</span>
            <br />— 7 specialized agents, one platform
          </h1>

          <p className="hero-sub">
            Sevenforce gives every enterprise a team of autonomous AI employees — for
            marketing, sales, hiring, meetings, documents, and data — powered by
            Sevenseed&apos;s shared multi-agent backbone.
          </p>

          <div className="hero-actions">
            <a className="btn btn-primary lg" href="#contact"><i className="fas fa-paper-plane" /> Hire Your AI Team</a>
            <a className="btn btn-ghost lg" href="#services"><i className="fas fa-microchip" /> See the AI</a>
          </div>

          <div className="stats-row">
            <div className="hs"><div className="hs-num">7</div><div className="hs-lbl">AI Employees</div></div>
            <div className="hs-sep" />
            <div className="hs"><div className="hs-num">2</div><div className="hs-lbl">AI Suites</div></div>
            <div className="hs-sep" />
            <div className="hs"><div className="hs-num">24/7</div><div className="hs-lbl">Always On</div></div>
            <div className="hs-sep" />
            <div className="hs"><div className="hs-num">1</div><div className="hs-lbl">Unified Dashboard</div></div>
          </div>

          <div className="hero-marquee">
            <div className="marquee-track">
              {[...MARQUEE, ...MARQUEE].map((m, i) => <span key={i}>{m}</span>)}
            </div>
          </div>
        </div>
      </header>

      {/* ── PILLARS ──────────────────────────────────────────── */}
      <section className="pillars-band">
        <div className="pillars-inner">
          {PILLARS.map((p) => (
            <div className="pillar" key={p.title}>
              <div className="pillar-ic"><i className={`fas ${p.icon}`} /></div>
              <div className="pillar-txt"><strong>{p.title}</strong><span>{p.sub}</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI STACK STRIP ───────────────────────────────────── */}
      <section className="ai-strip">
        <span className="ai-strip-label"><i className="fas fa-bolt" /> Powered by a production-grade AI stack</span>
        <div className="ai-chips">
          {STACK.map((s) => (
            <span className="ai-chip" key={s}><i className="fas fa-microchip" />{s}</span>
          ))}
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────── */}
      <section className="section about" id="about">
        <div className="about-grid">
          <RevealOnScroll>
            <div className="about-copy">
              <div className="eyebrow">Est. 2026 · AI Workforce &amp; Business Automation</div>
              <h2 className="sec-title left">Don&apos;t just use AI — hire an AI team.</h2>
              <p>
                Sevenforce turns AI into your team. Instead of juggling a dozen disconnected
                tools, you hire specialised AI employees — each an expert at one job — that
                work together from a single dashboard, around the clock.
              </p>
              <p>
                Two suites cover the whole business: Growth AI runs your content, social
                media, and campaigns, while Agency AI handles proposals, documents, meetings,
                hiring, and data — every agent powered by Sevenseed&apos;s shared AI backbone.
              </p>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <aside className="about-card glow">
              <div className="about-card-ic"><i className="fas fa-users-gear" /></div>
              <h3>Why Seven?</h3>
              <ul className="hl-list">
                <li><i className="fas fa-check" />7 specialised AI employees</li>
                <li><i className="fas fa-check" />Growth AI: content, social &amp; campaigns</li>
                <li><i className="fas fa-check" />Agency AI: proposals, meetings &amp; hiring</li>
                <li><i className="fas fa-check" />One dashboard, always on</li>
              </ul>
            </aside>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── THE TEAM ─────────────────────────────────────────── */}
      <section className="section" id="services">
        <div className="eyebrow center">YOUR AI EMPLOYEES</div>
        <h2 className="sec-title">Meet the team that never sleeps</h2>
        <div className="svc-grid">
          {TEAM.map((t, i) => (
            <RevealOnScroll key={t.name} delay={i * 0.04}>
              <article className="svc-card glow">
                <div className={`svc-ic ${t.tone}`}><i className={`fas ${t.icon}`} /></div>
                <h4>{t.name}</h4>
                <p>{t.desc}</p>
                <span className="svc-tag"><i className="fas fa-bolt" />{t.suite}</span>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* ── LIVE DEMO ────────────────────────────────────────── */}
      <MayaDemo />

      {/* ── PROCESS ──────────────────────────────────────────── */}
      <section className="section process" id="process">
        <div className="eyebrow center">THE PROCESS</div>
        <h2 className="sec-title">How Sevenforce works</h2>
        <div className="proc-grid">
          {PROCESS.map((p, i) => (
            <RevealOnScroll key={p.n} delay={i * 0.05}>
              <div className="proc-step glow">
                <div className="proc-num">{p.n}</div>
                <div className="proc-ic"><i className={`fas ${p.icon}`} /></div>
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* ── IMPACT ───────────────────────────────────────────── */}
      <section className="impact" id="impact">
        <div className="impact-inner">
          <div className="eyebrow center">BY THE NUMBERS</div>
          <h2 className="sec-title">An AI team, at a fraction of the cost</h2>
          <div className="impact-grid">
            {METRICS.map((m, i) => (
              <RevealOnScroll key={m.lbl} delay={i * 0.06}>
                <div className="metric glow">
                  <div className="metric-num">{m.num}</div>
                  <div className="metric-lbl">{m.lbl}</div>
                  <div className="metric-sub">{m.sub}</div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="section" id="testimonials">
        <div className="eyebrow center">WHAT PEOPLE SAY</div>
        <h2 className="sec-title">Trusted by the people we serve</h2>
        <div className="tgrid">
          {REVIEWS.map((r, i) => (
            <RevealOnScroll key={r.who} delay={i * 0.06}>
              <figure className="tcard glow">
                <div className="tstars">
                  {Array.from({ length: 5 }).map((_, s) => <i className="fas fa-star" key={s} />)}
                </div>
                <blockquote>&ldquo;{r.quote}&rdquo;</blockquote>
                <figcaption>
                  <span className="tavatar">{r.avatar}</span>
                  <span className="tmeta"><strong>{r.who}</strong><small>{r.org}</small></span>
                </figcaption>
              </figure>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="section faq-sec" id="faq">
        <div className="eyebrow center">FAQ</div>
        <h2 className="sec-title">Questions, answered</h2>
        <div className="faq-list">
          {FAQS.map((f) => (
            <details className="faq" key={f.q}>
              <summary>{f.q}<i className="fas fa-plus" /></summary>
              <div className="faq-a">{f.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* ── CONTACT / CTA ────────────────────────────────────── */}
      <section className="cta" id="contact">
        <div className="cta-glow" />
        <div className="cta-content">
          <div className="cta-badge"><i className="fas fa-microchip" /> Est. 2026 · AI Workforce &amp; Business Automation</div>
          <h2>Ready to hire your AI workforce?</h2>
          <p>
            Give your business a team of AI employees for marketing, sales, hiring, meetings
            and data — all on Sevenseed&apos;s shared AI stack. Start with the agents you need most.
          </p>
          <div className="cta-actions">
            <a className="btn btn-primary lg" href="mailto:hello@sevenforce.ai"><i className="fas fa-paper-plane" /> Hire Your AI Team</a>
            <a className="btn btn-ghost lg" href="tel:+918490861586"><i className="fas fa-phone" /> +91 84908 61586</a>
          </div>

          <form className="contact-form" onSubmit={onContact}>
            <div className="cf-row">
              <input type="text" placeholder="Your name" autoComplete="name" required />
              <input type="email" placeholder="Your email" autoComplete="email" required />
            </div>
            <input type="text" placeholder="Subject" />
            <textarea rows={4} placeholder="How can we help you?" required />
            <button type="submit" className="btn btn-primary lg"><i className="fas fa-paper-plane" /> Send message</button>
            {sent && <p className="cf-note" role="status">{sent}</p>}
          </form>

          <div className="cta-contact">
            <span><i className="fas fa-envelope" /> hello@sevenforce.ai</span>
            <span><i className="fas fa-location-dot" /> Ahmedabad, Gujarat, India</span>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
