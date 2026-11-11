"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PortfolioHealthMonitor } from "../components/PortfolioHealthMonitor";
import { StudioChangelog } from "../components/StudioChangelog";
import { ProductFilm } from "../components/ProductFilm";
import { HomeMotion } from "../components/HomeMotion";
import { SeedCharacter } from "../components/SeedCharacter";
import { CAST, VentureTeam } from "../components/VentureTeam";
import {
  Cpu,
  GraduationCap,
  ShoppingBag,
  HeartPulse,
  Wrench,
  Shield,
  ArrowRight,
  ArrowUpRight,
  Zap,
  CheckCircle2,
  Circle,
  ChevronDown,
  Send,
  Search,
  X,
  MessageSquare,
  BarChart3,
  Calculator,
  Key,
  Layers,
  Mail,
  Phone,
  MapPin,
  Terminal,
  Building2,
} from "lucide-react";

interface Venture {
  id: string;
  name: string;
  sector: string;
  desc: string;
  metrics: string;
  tool: string;
  toolLabel: string;
  tech: string;
  href: string;
  icon: any;
  color: string;
}

const ventures: Venture[] = [
  {
    id: "avpu",
    name: "Alpaben Vipulbhai Patel University",
    sector: "EdTech & Higher Education",
    desc: "AI-powered university education adapting to every learner with adaptive DAG knowledge trees and gamified leagues.",
    metrics: "Adaptive knowledge graph · Leagues",
    tool: "/avpu/learn-dag",
    toolLabel: "Knowledge graph",
    tech: "LangGraph · EdgeDB · Canvas DAG",
    href: "/avpu",
    icon: GraduationCap,
    color: "#38bdf8"
  },
  {
    id: "avp-emart",
    name: "AVP E-Mart",
    sector: "Q-Commerce & Price Intelligence",
    desc: "AI shopping engine that compares products and tracks prices across major Indian marketplaces.",
    metrics: "Spec compare · Price tracking",
    tool: "/avp-emart/spec-compare",
    toolLabel: "Spec compare",
    tech: "Spec comparison · Deal checker",
    href: "/avp-emart",
    icon: ShoppingBag,
    color: "#10b981"
  },
  {
    id: "comonk",
    name: "Comonk Technology",
    sector: "Career & Talent Intelligence",
    desc: "AI career copilot for tech jobs featuring ATS resume scoring, FAANG mock interview rooms, and salary insights.",
    metrics: "ATS scoring · Mock interviews · Free",
    tool: "/comonk/resume-analyzer",
    toolLabel: "ATS resume scorer",
    tech: "Resume analyzer · Mock interviews",
    href: "/comonk",
    icon: Cpu,
    color: "#a855f7"
  },
  {
    id: "sevenforce",
    name: "Sevenforce",
    sector: "Autonomous Enterprise Workforce",
    desc: "Team of specialized AI employees for marketing, sales, hiring, meetings, and code execution running 24/7.",
    metrics: "7 AI employees · Workflow studio",
    tool: "/sevenforce/workflows",
    toolLabel: "Agent workflows",
    tech: "AI employees · Coding assistant",
    href: "/sevenforce",
    icon: Zap,
    color: "#f59e0b"
  },
  {
    id: "pharmacy",
    name: "Decode Forest Pharmacy",
    sector: "HealthTech & Tele-Pharmacy",
    desc: "AI prescription OCR scanner, Jan Aushadhi generic alternative finder, and critical drug-drug interaction matrix.",
    metrics: "Generic finder · Interaction checker",
    tool: "/pharmacy/generic-finder",
    toolLabel: "Generic finder",
    tech: "Tesseract OCR · RxNorm Clinical RAG",
    href: "/pharmacy",
    icon: HeartPulse,
    color: "#ec4899"
  },
  {
    id: "breakdown",
    name: "Breakdown Factor",
    sector: "Civil Engineering & Safety",
    desc: "AI-driven construction management with CPWD DSR BOQ estimation, computer-vision site PPE monitoring, and defect audit.",
    metrics: "CPWD DSR 2023 rates · PPE vision",
    tool: "/breakdown/boq-estimator",
    toolLabel: "BOQ estimator",
    tech: "YOLOv8 Vision · CPWD BOQ Engine",
    href: "/breakdown",
    icon: Wrench,
    color: "#ef4444"
  },
  {
    id: "trust",
    name: "AVP Charitable Trust",
    sector: "Social Impact & Philanthropy",
    desc: "Non-profit platform using AI for rural community needs assessment, mobile health camps, and instant 80G tax receipts.",
    metrics: "80G receipts · Health camps",
    tool: "/trust/campaigns",
    toolLabel: "Campaigns",
    tech: "Form 10BE Generator · QR Verification",
    href: "/trust",
    icon: Building2,
    color: "#06b6d4"
  },
  {
    id: "rakshak-ai",
    name: "Rakshak AI Safety",
    sector: "Public Safety & Law Enforcement",
    desc: "Citizen safety copilot with automated BNS 2023 FIR drafting, cybercrime scam detector, and crowd security analytics.",
    metrics: "BNS clause mapping · Helpline 1930",
    tool: "/rakshak-ai/fir-generator",
    toolLabel: "Complaint drafter",
    tech: "Legal RAG · Surveillance Vision",
    href: "/rakshak-ai",
    icon: Shield,
    color: "#8b5cf6"
  },
  {
    id: "agenticos",
    name: "AgenticOS",
    sector: "Agent Infrastructure & Kernel OS",
    desc: "The operating system kernel coordinating every autonomous agent cluster across the portfolio — memory heaps, process locks, and IPC message queues.",
    metrics: "Agent kernel · Sandboxed workers",
    tool: "/agenticos",
    toolLabel: "Control plane",
    tech: "Agent Kernel · Multi-Process IPC",
    href: "/agenticos",
    icon: Terminal,
    color: "#14b8a6"
  }
];

const faqs = [
  {
    q: "What makes Sevenseed fundamentally AI-native?",
    a: "Every venture is engineered on a shared AI backbone — LangGraph multi-agent orchestration, Groq-hosted open-model inference, and ChromaDB vector retrieval — so AI isn't an afterthought, it's the core engine from day one."
  },
  {
    q: "How do external founders partner with the studio?",
    a: "We incubate in-house but selectively co-found with exceptional domain leaders. We provide capital, shared AI infrastructure, and a dedicated team of engineers to build and launch within 90 days."
  },
  {
    q: "Are the tools free?",
    a: "Tools that don't use AI, like the market sizer, BOQ estimator and spec comparison, are free for everyone. AI features are free when you add your own AI key, because the AI cost is then on your key. Without a key you can try them 15 times an hour. If you'd rather not manage a key, our paid Sevenseed AI plan runs the AI for you: see Pricing."
  },
  {
    q: "How does the Zero-Margin BYOK Vault work?",
    a: "Your API keys (Groq, OpenAI, Anthropic) are AES-GCM encrypted in your browser's local storage and never touch our servers, giving you zero SaaS markup on model tokens."
  }
];


const pillars = [
  { title: "AI from day one", desc: "Every venture starts with agents and retrieval in the core product, not added later." },
  { title: "One shared backbone", desc: "Models, vector search and tooling are built once and reused across the portfolio." },
  { title: "Founders first", desc: "Hands-on engineering and a weekly shipping rhythm, without the red tape." },
  { title: "Six industries", desc: "Learning from education, health, retail, construction and more feeds every venture." },
];

const studioTools = [
  { title: "Syndicate & RUV simulator", desc: "Model SPV returns, carry, management fees, LP waterfalls and exit multiples.", href: "/syndicate-ruv", icon: BarChart3 },
  { title: "TAM / SAM / SOM sizer", desc: "Size a market bottom-up and top-down, ready for your pitch deck.", href: "/market-sizing", icon: Calculator },
  { title: "Portfolio directory", desc: "Browse every venture, its AI stack and all of its tools in one place.", href: "/ventures", icon: Layers },
  { title: "BYOK key vault", desc: "Use your own Groq, OpenAI, Anthropic or Gemini keys, encrypted in your browser.", href: "/byok", icon: Key },
];

const stages = [
  { title: "Find the bottleneck", desc: "We study real workflows and look for painful, expensive steps where AI changes the economics." },
  { title: "Plug into the stack", desc: "New ventures start on our existing agents, vector search and model gateway." },
  { title: "Ship in 90 days", desc: "Studio engineers pair with domain founders to get a production MVP live inside 12 weeks." },
  { title: "Compound", desc: "Each venture shares tooling and lessons with the rest of the portfolio as it grows." },
];

// A transparent checklist, so the result is explainable and identical for identical input.
const fitChecks = [
  { label: "Names who it is for", test: /\b(for|students?|patients?|doctors?|teachers?|engineers?|contractors?|shops?|retailers?|farmers?|founders?|teams?|citizens?|recruiters?|donors?)\b/i },
  { label: "Describes the problem", test: /\b(problem|pain|slow|manual|costly|expensive|delay|waste|hard|error|missing|balanc\w*|reduc\w*|sav\w*)\b/i },
  { label: "Says what the AI does", test: /\b(ai|agents?|llm|model|vision|forecast\w*|predict\w*|automat\w*|classif\w*|rag|ocr|autonomous)\b/i },
  { label: "Uses a specific data source", test: /\b(data|real-time|realtime|records?|sensors?|images?|documents?|logs?|telemetry|prices?|forecast\w*)\b/i },
];

const heroCast = ["avp-emart", "comonk", "pharmacy", "sevenforce", "avpu"];

const steps = [
  { title: "Pick a tool", desc: "Choose from career, learning, health, shopping, construction, safety and more. No account needed to look around." },
  { title: "Add your own AI key, if you want", desc: "Some tools work straight away. For AI features, add your own key. It stays encrypted in your browser." },
  { title: "Free with your key, or let us run it", desc: "With your own key we charge nothing and add no markup. Prefer not to manage a key? Our paid Sevenseed AI plan provides the AI for you." },
];

const comparison = [
  ["Price to use the tools", "Free with your own AI key, or a paid plan", "Monthly subscription"],
  ["AI usage", "Your own key with no markup, or provided by us", "Bundled, with limits or markup"],
  ["Where your AI key lives", "Encrypted in your browser", "No key needed; the vendor runs the AI"],
  ["Range", "Nine ventures on one platform", "Usually one product"],
];

export default function SevenseedHomePage() {
  // Evaluator Sandbox State
  const [evalName, setEvalName] = useState("EcoFlow AI");
  const [evalSector, setEvalSector] = useState("CleanTech & Energy");
  const [evalIdea, setEvalIdea] = useState("Autonomous smart microgrid balancing agent using real-time solar forecasting.");

  // Contact Form State
  const [cName, setCName] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [cCompany, setCCompany] = useState("");
  const [cType, setCType] = useState("Venture Co-Founding");
  const [cMessage, setCMessage] = useState("");
  const [cStatus, setCStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Command Palette & Chat Drawer
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const [cmdkSearch, setCmdkSearch] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ role: "bot" | "user"; text: string }>>([
    { role: "bot", text: "Hello! I am the Sevenseed guide. Ask me about our 9 incubated ventures, investment syndicates, or how to launch an AI startup with us." }
  ]);

  // Keyboard shortcut for CmdK
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdkOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setCmdkOpen(false);
        setChatOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fitResults = fitChecks.map((check) => ({ label: check.label, passed: check.test.test(evalIdea) }));
  const fitPassed = fitResults.filter((check) => check.passed).length;

  // Submit Contact Form
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cName,
          email: cEmail,
          company: cCompany,
          type: cType,
          message: cMessage
        })
      });
      if (res.ok) {
        setCStatus("success");
        setCName("");
        setCEmail("");
        setCCompany("");
        setCMessage("");
      } else {
        setCStatus("error");
      }
    } catch {
      setCStatus("error");
    }
  };

  // Chat Submission
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatInput("");

    setTimeout(() => {
      let reply = "Sevenseed is an AI-first venture studio. You can explore all our interactive subpages: AVP University (/avpu), AVP E-Mart (/avp-emart), Comonk Career (/comonk), and Sevenforce Enterprise (/sevenforce). How can we assist your venture?";
      const lower = userMsg.toLowerCase();
      if (lower.includes("avpu") || lower.includes("university")) {
        reply = "AVPU features interactive learning tools like the Knowledge DAG (/avpu/learn-dag), the learning league (/avpu/duo-league), and Code Lab (/avpu/code-lab).";
      } else if (lower.includes("emart") || lower.includes("shopping") || lower.includes("price")) {
        reply = "AVP E-Mart offers our 3-Way Flagship Spec Comparator (/avp-emart/spec-compare) and 90-day price tracker across Amazon, Flipkart, and Reliance.";
      } else if (lower.includes("comonk") || lower.includes("job") || lower.includes("resume")) {
        reply = "Comonk AI provides automated ATS resume match scoring and FAANG mock interviews (/comonk/resume-analyzer).";
      }
      setChatMessages((prev) => [...prev, { role: "bot", text: reply }]);
    }, 400);
  };

  const filteredVentures = ventures.filter(
    (v) =>
      v.name.toLowerCase().includes(cmdkSearch.toLowerCase()) ||
      v.sector.toLowerCase().includes(cmdkSearch.toLowerCase())
  );

  const input =
    "w-full rounded-lg border border-[#d0d5dd] bg-white px-3.5 py-2.5 text-[15px] text-[#0f172a] placeholder:text-[#667085] shadow-sm transition focus:border-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20";
  const label = "mb-1.5 block text-sm font-medium text-[#344054]";
  const eyebrow = "text-sm font-bold uppercase tracking-[0.08em] text-[#7c3aed]";
  const sectionTitle = "mt-3 text-[2rem] font-bold leading-[1.12] tracking-[-0.025em] text-[#0f172a] sm:text-5xl";
  const sectionLead = "mt-4 text-lg leading-relaxed text-[#475467]";

  return (
    <div className="ss-home relative min-h-screen bg-white text-[#475467] selection:bg-[#0f172a] selection:text-white">
      <HomeMotion />
      {/* Hero */}
      <header className="relative -mt-16 overflow-hidden bg-[linear-gradient(160deg,#fde8f3_0%,#efe9ff_42%,#dff3ff_78%,#e4fbf0_100%)] pt-16">
        <div className="ss-mesh pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-5 pb-12 pt-16 sm:px-8 lg:grid-cols-12 lg:pb-20 lg:pt-24">
          <div className="lg:col-span-6">
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-[#7c3aed]">AI venture studio, Ahmedabad</p>
            <h1 className="mt-4 text-[2.5rem] font-bold leading-[1.08] tracking-[-0.03em] text-[#0f172a] sm:text-[3.75rem]">
              <span className="block">Nine AI companies.</span>
              <span className="block">One studio.</span>
              <span className="block">Free with your own AI key.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#344054] sm:text-xl">
              Sevenseed builds and runs nine AI companies on one shared platform: career, learning, health, shopping, construction, safety and more.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href="#team" className="ss-btn-primary">Meet the team <ArrowRight className="h-4 w-4" /></a>
              <a href="#contact" className="ss-btn-ghost">Partner with us</a>
            </div>
            <p className="mt-6 text-sm font-medium text-[#475467]"><span data-count="9">9</span> ventures · <span data-count="6">6</span> industries · <span data-count="1">1</span> shared AI platform</p>
          </div>
          <div className="lg:col-span-6">
            <div className="mx-auto flex max-w-[620px] items-end justify-center">
              {heroCast.map((id, index) => {
                const c = CAST[id];
                const venture = ventures.find((item) => item.id === id);
                const sizes = ["w-[21%] -mr-[3%]", "w-[26%] -mr-[4%] z-10", "w-[32%] z-20", "w-[26%] -ml-[4%] z-10", "w-[21%] -ml-[3%]"];
                return (
                  <SeedCharacter key={id} id={`hero-${id}`} color={c.color} shade={c.shade} icon={venture?.icon} gaze={index < 2 ? 3 : index > 2 ? -3 : 0} mood={c.mood} tall={c.tall} className={`ss-float ${sizes[index]}`} />
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Industries */}
      <section aria-label="Industries" className="border-b border-[#e4e7ec]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 sm:px-8 lg:flex-row lg:items-center lg:gap-10">
          <p className="shrink-0 text-sm font-medium text-[#475467]">Building across</p>
          <ul className="flex flex-wrap gap-x-8 gap-y-2 text-[15px] font-semibold text-[#344054]">
            {["Education", "Healthcare", "Retail", "Construction", "Public safety", "Social impact"].map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8 lg:py-28">
        <div data-reveal className="mx-auto max-w-3xl text-center">
          <p className={eyebrow}>Meet the team</p>
          <h2 className={sectionTitle}>One AI helper for every part of life and work</h2>
          <p className={sectionLead}>Each venture does one job well. Pick one to see what it does, then try the real tool.</p>
        </div>
        <div data-reveal className="mt-10"><VentureTeam ventures={ventures} /></div>
      </section>

      {/* Product film */}
      <section id="tour" className="scroll-mt-24 bg-[#f6f5fb]">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
          <div data-reveal className="mx-auto max-w-3xl text-center">
            <p className={eyebrow}>See it in action</p>
            <h2 className={sectionTitle}>Real tools, doing real work</h2>
            <p className={sectionLead}>A 36-second tour of seven products. Choose one below to jump straight to it.</p>
          </div>
          <div data-reveal className="mt-10"><ProductFilm /></div>
        </div>
      </section>

      {/* How it works */}
      <section id="platform" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8 lg:py-28">
        <div data-reveal className="mx-auto max-w-3xl text-center">
          <p className={eyebrow}>How it works</p>
          <h2 className={sectionTitle}>Up and running in three steps</h2>
        </div>
        <ol data-reveal className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          <div className="absolute left-[16%] right-[16%] top-7 hidden h-0.5 bg-gradient-to-r from-[#c4b5fd] via-[#f9a8d4] to-[#7dd3fc] md:block" aria-hidden="true" />
          {steps.map((step, index) => (
            <li key={step.title} className="relative text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#0f172a] text-lg font-bold text-white shadow-lg">{index + 1}</span>
              <h3 className="mt-5 text-xl font-bold text-[#0f172a]">{step.title}</h3>
              <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed">{step.desc}</p>
            </li>
          ))}
        </ol>

        <div className="mx-auto mt-20 max-w-4xl overflow-hidden rounded-3xl border border-[#e4e7ec] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left text-[15px]">
              <caption className="sr-only">How Sevenseed compares with typical paid AI tools</caption>
              <thead>
                <tr className="border-b border-[#e4e7ec]">
                  <th scope="col" className="p-5 font-medium text-[#475467]">&nbsp;</th>
                  <th scope="col" className="bg-[#f5f3ff] p-5 font-bold text-[#0f172a]">Sevenseed</th>
                  <th scope="col" className="p-5 font-semibold text-[#475467]">Typical paid AI tool</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map(([rowName, ours, theirs]) => (
                  <tr key={rowName} className="border-b border-[#f2f4f7] last:border-0">
                    <th scope="row" className="p-5 font-medium text-[#344054]">{rowName}</th>
                    <td className="bg-[#f5f3ff] p-5 font-semibold text-[#0f172a]"><span className="inline-flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#16a34a]" />{ours}</span></td>
                    <td className="p-5">{theirs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How we work */}
      <section id="how" className="scroll-mt-24 px-3 sm:px-5">
        <div className="mx-auto max-w-[88rem] rounded-[2.5rem] bg-[linear-gradient(140deg,#0f172a,#2b1d5c)] px-5 py-16 text-[#cdd5e4] sm:px-12 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-[#c4b5fd]">For founders</p>
            <h2 className="mt-3 max-w-3xl text-[2rem] font-bold leading-[1.12] tracking-[-0.025em] text-white sm:text-5xl">Have an idea? We build companies with you in four stages.</h2>
            <ol data-reveal className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {stages.map((stage, index) => (
                <li key={stage.title} className="rounded-3xl bg-white/[0.07] p-6">
                  <span className="text-sm font-bold text-[#c4b5fd]">Stage {index + 1}</span>
                  <h3 className="mt-2 text-lg font-bold text-white">{stage.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed">{stage.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Founder tools */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
        <div data-reveal className="max-w-2xl">
          <p className={eyebrow}>For founders and investors</p>
          <h2 className={sectionTitle}>Tools to plan your next venture</h2>
        </div>
        <div data-reveal className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {studioTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.href} href={tool.href} className="group flex flex-col rounded-3xl border border-[#e4e7ec] bg-white p-6 shadow-sm transition hover:border-[#c4b5fd] hover:shadow-[0_12px_32px_-12px_rgba(16,24,40,0.2)]">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#f3efff] text-[#6d28d9]"><Icon className="h-5 w-5" /></span>
                <h3 className="mt-4 text-base font-semibold text-[#0f172a]">{tool.title}</h3>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed">{tool.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#6d28d9]">Open tool <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Idea checklist */}
      <section id="sandbox" className="scroll-mt-20 border-y border-[#e4e7ec] bg-[#f9fafb]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <div>
            <p className={eyebrow}>Idea checklist</p>
            <h2 className={sectionTitle}>Is your idea ready to pitch?</h2>
            <p className={sectionLead}>Describe your idea in a sentence or two. The checklist updates as you type and shows what a stronger pitch would include.</p>
            <div className="mt-8 space-y-4">
              <div>
                <label htmlFor="eval-name" className={label}>Project name</label>
                <input id="eval-name" type="text" value={evalName} onChange={(e) => setEvalName(e.target.value)} className={input} />
              </div>
              <div>
                <label htmlFor="eval-sector" className={label}>Industry</label>
                <select id="eval-sector" value={evalSector} onChange={(e) => setEvalSector(e.target.value)} className={input}>
                  <option>CleanTech & Energy</option>
                  <option>EdTech & Higher Ed</option>
                  <option>Q-Commerce & Retail</option>
                  <option>HealthTech & Pharma</option>
                  <option>Industrial Telemetry & Civil</option>
                  <option>GovTech & Citizen Safety</option>
                </select>
              </div>
              <div>
                <label htmlFor="eval-idea" className={label}>The problem and your AI solution</label>
                <textarea id="eval-idea" rows={4} value={evalIdea} onChange={(e) => setEvalIdea(e.target.value)} className={input} />
              </div>
            </div>
          </div>
          <div className="self-start rounded-3xl border border-[#e4e7ec] bg-white p-6 shadow-sm sm:p-8 lg:sticky lg:top-24" aria-live="polite">
            <p className="text-sm">{evalName || "Your idea"} · {evalSector}</p>
            <p className="mt-2 text-5xl font-semibold tracking-[-0.02em] text-[#0f172a]">{fitPassed}<span className="text-[#667085]"> / {fitChecks.length}</span></p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#f2f4f7]">
              <div className="h-full rounded-full bg-[#0f172a] transition-all" style={{ width: `${(fitPassed / fitChecks.length) * 100}%` }} />
            </div>
            <ul className="mt-6 space-y-3">
              {fitResults.map((check) => (
                <li key={check.label} className={`flex items-center gap-3 text-[15px] ${check.passed ? "font-medium text-[#0f172a]" : ""}`}>
                  {check.passed ? <CheckCircle2 className="h-5 w-5 shrink-0 text-[#6d28d9]" /> : <Circle className="h-5 w-5 shrink-0 text-[#98a2b3]" />}
                  {check.label}
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-[#e4e7ec] pt-4 text-[13px] leading-relaxed">A simple keyword check, not an AI review or an investment decision.</p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold text-[#6d28d9]">
              <Link href="/market-sizing" className="inline-flex items-center gap-1 py-1 hover:underline">Size the market <ArrowUpRight className="h-4 w-4" /></Link>
              <a href="#contact" className="inline-flex items-center gap-1 py-1 hover:underline">Talk to us <ArrowRight className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
      </section>

      {/* Status */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
        <div data-reveal className="max-w-2xl">
          <p className={eyebrow}>Transparency</p>
          <h2 className={sectionTitle}>Live status and recent releases</h2>
          <p className={sectionLead}>These checks run in your browser against every venture right now, next to a log of what we recently shipped.</p>
        </div>
        <div data-reveal className="mt-10 grid gap-6 lg:grid-cols-2">
          <PortfolioHealthMonitor ventures={ventures} />
          <StudioChangelog />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 border-t border-[#e4e7ec]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-4">
            <p className={eyebrow}>FAQ</p>
            <h2 className={sectionTitle}>Frequently asked questions</h2>
          </div>
          <div className="divide-y divide-[#e4e7ec] border-y border-[#e4e7ec] lg:col-span-8">
            {faqs.map((faq, index) => {
              const open = openFaq === index;
              return (
                <div key={faq.q}>
                  <h3>
                    <button type="button" onClick={() => setOpenFaq(open ? null : index)} aria-expanded={open} className="flex w-full items-center justify-between gap-4 py-5 text-left text-[17px] font-semibold text-[#0f172a] transition hover:text-[#6d28d9]">
                      {faq.q}
                      <ChevronDown className={`h-5 w-5 shrink-0 text-[#667085] transition-transform ${open ? "rotate-180" : ""}`} />
                    </button>
                  </h3>
                  {open && <p className="max-w-2xl pb-6 text-[15px] leading-relaxed">{faq.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-24 bg-[linear-gradient(160deg,#fde8f3,#efe9ff_55%,#dff3ff)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <div>
            <p className={eyebrow}>Contact</p>
            <h2 className={sectionTitle}>Have a bold idea? Let&apos;s build it together.</h2>
            <p className={`${sectionLead} max-w-md`}>Co-found a venture, invest alongside us, or get help building your own AI product.</p>
            <ul className="mt-8 space-y-2 text-[15px] text-[#344054]">
              <li><a href="mailto:hello@sevenseed.in" className="inline-flex items-center gap-3 py-1 hover:text-[#6d28d9]"><Mail className="h-4 w-4 text-[#6d28d9]" /> hello@sevenseed.in</a></li>
              <li><a href="tel:+918490861586" className="inline-flex items-center gap-3 py-1 hover:text-[#6d28d9]"><Phone className="h-4 w-4 text-[#6d28d9]" /> +91 84908 61586</a></li>
              <li className="flex items-center gap-3 py-1"><MapPin className="h-4 w-4 text-[#6d28d9]" /> Ahmedabad, Gujarat, India</li>
            </ul>
          </div>
          {cStatus === "success" ? (
            <div className="self-start rounded-xl border border-[#c4b5fd] bg-white p-8 shadow-sm" role="status">
              <CheckCircle2 className="h-8 w-8 text-[#6d28d9]" />
              <h3 className="mt-4 text-xl font-semibold text-[#0f172a]">Message received.</h3>
              <p className="mt-2 text-[15px] leading-relaxed">Thank you. We&apos;ll reply to the email address you gave us.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4 rounded-3xl border border-[#e4e7ec] bg-white p-6 shadow-sm sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className={label}>Your name</label>
                  <input id="c-name" type="text" autoComplete="name" value={cName} onChange={(e) => setCName(e.target.value)} className={input} required />
                </div>
                <div>
                  <label htmlFor="c-email" className={label}>Work email</label>
                  <input id="c-email" type="email" autoComplete="email" value={cEmail} onChange={(e) => setCEmail(e.target.value)} placeholder="you@company.com" className={input} required />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-company" className={label}>Company (optional)</label>
                  <input id="c-company" type="text" autoComplete="organization" value={cCompany} onChange={(e) => setCCompany(e.target.value)} className={input} />
                </div>
                <div>
                  <label htmlFor="c-type" className={label}>What is this about?</label>
                  <select id="c-type" value={cType} onChange={(e) => setCType(e.target.value)} className={input}>
                    <option>Venture Co-Founding</option>
                    <option>Online syndicate / SPV</option>
                    <option>Enterprise AI Consultation</option>
                    <option>General Media / Press</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="c-message" className={label}>Message</label>
                <textarea id="c-message" rows={5} value={cMessage} onChange={(e) => setCMessage(e.target.value)} placeholder="What do you want to build or invest in?" className={input} required />
              </div>
              {cStatus === "error" && (
                <p className="text-[15px] text-[#b42318]" role="alert">That didn&apos;t send. Please try again, or email hello@sevenseed.in. Your message is still here.</p>
              )}
              <button type="submit" disabled={cStatus === "submitting"} className="ss-btn-primary w-full disabled:opacity-60">
                {cStatus === "submitting" ? "Sending…" : "Send message"} <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e4e7ec] bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-lg font-semibold tracking-[-0.01em] text-[#0f172a]">Sevenseed</p>
            <p className="mt-3 max-w-xs text-[15px] leading-relaxed">An AI venture studio building companies across education, healthcare, retail, construction, public safety and social impact.</p>
          </div>
          <nav aria-label="Ventures" className="lg:col-span-5">
            <p className="text-sm font-semibold text-[#0f172a]">Ventures</p>
            <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 text-[15px] sm:grid-cols-2">
              {ventures.map((venture) => (
                <li key={venture.id}><Link href={venture.href} className="inline-block py-1 hover:text-[#6d28d9]">{venture.name}</Link></li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Company" className="lg:col-span-3">
            <p className="text-sm font-semibold text-[#0f172a]">Company</p>
            <ul className="mt-3 space-y-1 text-[15px]">
              {studioTools.map((tool) => (
                <li key={tool.href}><Link href={tool.href} className="inline-block py-1 hover:text-[#6d28d9]">{tool.title}</Link></li>
              ))}
              <li><Link href="/pricing" className="inline-block py-1 hover:text-[#6d28d9]">Pricing & terms</Link></li>
            </ul>
          </nav>
        </div>
        <div className="mx-auto max-w-7xl border-t border-[#e4e7ec] px-5 py-6 pr-24 text-[13px] sm:px-8">© {new Date().getFullYear()} Sevenseed. All rights reserved.</div>
      </footer>

      {/* Guide */}
      <button type="button" onClick={() => setChatOpen((prev) => !prev)} aria-label={chatOpen ? "Close the guide" : "Open the guide"} aria-expanded={chatOpen} className="fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-[#0f172a] text-white shadow-lg transition hover:bg-[#1e293b]">
        {chatOpen ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
      </button>

      {chatOpen && (
        <div className="fixed bottom-20 right-5 z-40 flex h-[460px] max-h-[calc(100dvh-7rem)] w-[360px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-3xl border border-[#e4e7ec] bg-white shadow-2xl">
          <div className="border-b border-[#e4e7ec] px-4 py-3">
            <p className="text-[15px] font-semibold text-[#0f172a]">Sevenseed guide</p>
            <p className="text-[13px]">Quick pointers to the right venture</p>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm" aria-live="polite">
            {chatMessages.map((message, index) => (
              <div key={index} className={`max-w-[85%] rounded-lg p-3 leading-relaxed ${message.role === "bot" ? "mr-auto bg-[#f2f4f7] text-[#344054]" : "ml-auto bg-[#0f172a] text-white"}`}>{message.text}</div>
            ))}
          </div>
          <form onSubmit={handleSendChat} className="flex gap-2 border-t border-[#e4e7ec] p-3">
            <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask about a venture…" aria-label="Your question" className="min-w-0 flex-1 rounded-lg border border-[#d0d5dd] px-3 py-2 text-sm text-[#0f172a] placeholder:text-[#667085] focus:border-[#7c3aed] focus:outline-none" />
            <button type="submit" aria-label="Send" className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#0f172a] text-white"><Send className="h-4 w-4" /></button>
          </form>
        </div>
      )}

      {/* Ctrl+K search */}
      {cmdkOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-[#101828]/50 p-4 pt-[15vh]" onClick={(e) => { if (e.target === e.currentTarget) setCmdkOpen(false); }}>
          <div role="dialog" aria-modal="true" aria-label="Search ventures" className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#e4e7ec] bg-white shadow-2xl">
            <div className="flex items-center gap-3 border-b border-[#e4e7ec] p-3">
              <Search className="h-4 w-4" />
              <input type="text" autoFocus value={cmdkSearch} onChange={(e) => setCmdkSearch(e.target.value)} placeholder="Search ventures…" aria-label="Search ventures" className="w-full bg-transparent text-[15px] text-[#0f172a] placeholder:text-[#667085] focus:outline-none" />
              <button type="button" onClick={() => setCmdkOpen(false)} aria-label="Close search" className="hover:text-[#0f172a]"><X className="h-4 w-4" /></button>
            </div>
            <div className="max-h-72 space-y-1 overflow-y-auto p-2">
              {filteredVentures.map((venture) => (
                <Link key={venture.id} href={venture.href} onClick={() => setCmdkOpen(false)} className="flex items-center justify-between gap-3 rounded-lg p-2.5 text-sm transition-colors hover:bg-[#f2f4f7]">
                  <span className="font-medium text-[#0f172a]">{venture.name}</span>
                  <span className="truncate text-[13px]">{venture.sector}</span>
                </Link>
              ))}
              {filteredVentures.length === 0 && <p className="p-3 text-sm">No venture matches that search.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
