"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Bot,
  Lightbulb,
  Leaf,
  Search,
  Menu,
  X,
  Send,
  Loader2,
  Trash2,
  ArrowLeft,
  Cpu,
  BookMarked,
  Briefcase,
  Layers,
  FileText,
  LayoutGrid,
  TrendingUp,
  BarChart2,
  Users,
  Compass,
  Settings,
  Sparkles,
  Database,
  History,
  CheckCircle2,
  Rocket,
  User
} from "lucide-react";

type PanelType =
  | "dashboard"
  | "ideate"
  | "founder"
  | "advisor"
  | "portfolio"
  | "pitches"
  | "pitchdeck"
  | "canvas"
  | "market"
  | "swot"
  | "competitor"
  | "namegen";

interface VenturePitch {
  id: number;
  created_at: string;
  domain: string;
  problem: string;
  market: string;
  ideas_output: string;
}

interface FounderSession {
  session_id: string;
  created_at: string;
  messages: { role: "user" | "ai"; text: string }[];
}

/* ---------- Shared presentational building blocks (visual-only, no state) ---------- */

function PanelHeader({ icon: Icon, title, desc }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5cf6]/20 to-[#10b981]/10 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-[var(--primary)]" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-white">{title}</h3>
        <p className="text-xs text-[var(--text-2)] mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] uppercase font-bold text-[var(--text-2)] tracking-wider block mb-2">{label}</label>
      {children}
    </div>
  );
}

function EmptyState({ icon: Icon, text }: { icon: React.ComponentType<{ className?: string }>; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-[var(--text-3)] border border-dashed border-white/10 rounded-2xl">
      <Icon className="h-8 w-8 opacity-30" />
      <p className="text-xs text-center max-w-[280px]">{text}</p>
    </div>
  );
}

function ResultCard({ title = "Result", children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--bg-2)] border border-white/5 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.02]">
        <span className="text-[11px] uppercase font-bold text-[var(--text-2)] tracking-wider">{title}</span>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8b5cf6]/15 text-[var(--primary-l)] inline-flex items-center gap-1">
          <Sparkles className="h-2.5 w-2.5" /> AI Generated
        </span>
      </div>
      <div className="p-6 text-sm leading-relaxed text-[var(--text-2)]">{children}</div>
    </div>
  );
}

const inputCls = "w-full bg-[var(--bg-2)] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8b5cf6]/60 transition-colors";

export default function StudioHub() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [groqKey, setGroqKey] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [openaiKey, setOpenaiKey] = useState("");
  const [serpapiKey, setSerpapiKey] = useState("");
  const [huggingfaceKey, setHuggingfaceKey] = useState("");
  const [mistralKey, setMistralKey] = useState("");

  useEffect(() => {
    setGroqKey(localStorage.getItem("user_groq_key") || "");
    setGeminiKey(localStorage.getItem("user_gemini_key") || "");
    setOpenaiKey(localStorage.getItem("user_openai_key") || "");
    setSerpapiKey(localStorage.getItem("user_serpapi_key") || "");
    setHuggingfaceKey(localStorage.getItem("user_huggingface_key") || "");
    setMistralKey(localStorage.getItem("user_mistral_key") || "");
  }, []);

  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (input, init) => {
      const path = typeof input === "string" ? input : input instanceof Request ? input.url : "";
      if (path.includes("/api/")) {
        const groq = localStorage.getItem("user_groq_key") || "";
        const gemini = localStorage.getItem("user_gemini_key") || "";
        const openai = localStorage.getItem("user_openai_key") || "";
        const serpapi = localStorage.getItem("user_serpapi_key") || "";
        const huggingface = localStorage.getItem("user_huggingface_key") || "";
        const mistral = localStorage.getItem("user_mistral_key") || "";

        const headers = new Headers(init?.headers || {});
        if (groq) headers.set("X-Groq-API-Key", groq);
        if (gemini) headers.set("X-Gemini-API-Key", gemini);
        if (openai) headers.set("X-OpenAI-API-Key", openai);
        if (serpapi) headers.set("X-SerpAPI-Key", serpapi);
        if (huggingface) headers.set("X-HuggingFace-API-Key", huggingface);
        if (mistral) headers.set("X-Mistral-API-Key", mistral);

        init = { ...init, headers };
      }
      return originalFetch(input, init);
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const [activePanel, setActivePanel] = useState<PanelType>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [llmEnabled, setLlmEnabled] = useState(false);
  const [providerName, setProviderName] = useState("Offline AI");
  const [ragBackend, setRagBackend] = useState("Local");
  const [dbStatus, setDbStatus] = useState("connected");

  // Ventures / Pipeline ideas lists
  const [venturesList, setVenturesList] = useState<any[]>([]);
  const [ideasPipeline, setIdeasPipeline] = useState<any[]>([]);

  // AI Ideator state (Tool 2)
  const [ideateDomain, setIdeateDomain] = useState("Healthcare Logistics");
  const [ideateProblem, setIdeateProblem] = useState("Cold chain delivery delays for vaccines");
  const [ideateMarket, setIdeateMarket] = useState("₹500 Cr Indian clinical vaccine logistics");
  const [ideateResult, setIdeateResult] = useState("");
  const [ideateLoading, setIdeateLoading] = useState(false);

  // Founder chat state (Tool 1)
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "🌱 Welcome to Sevenseed Founder AI! I can advise you on: business models, GTM strategy, product moats, or AI stack design." }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Venture advisor RAG state
  const [ragQuery, setRagQuery] = useState("");
  const [ragResults, setRagResults] = useState<any[]>([]);
  const [ragLoading, setRagLoading] = useState(false);

  // Portfolio Analytics (Tool 3)
  const [portfolioAnalysis, setPortfolioAnalysis] = useState("");
  const [portfolioLoading, setPortfolioLoading] = useState(false);

  // Pitch Deck Generator (Tool 4)
  const [pitchIdea, setPitchIdea] = useState("AI-Powered Cold Chain Logistics for Clinics");
  const [pitchSector, setPitchSector] = useState("Healthcare Supply Chain");
  const [pitchResult, setPitchResult] = useState("");
  const [pitchLoading, setPitchLoading] = useState(false);

  // Business Model Canvas Generator (Tool 5)
  const [canvasIdea, setCanvasIdea] = useState("Direct-to-consumer organic seed supply platform");
  const [canvasResult, setCanvasResult] = useState<any>(null);
  const [canvasLoading, setCanvasLoading] = useState(false);

  // Market Research Snapshots (Tool 6)
  const [marketSector, setMarketSector] = useState("Agri-Tech AI forecasting");
  const [marketResult, setMarketResult] = useState("");
  const [marketLoading, setMarketLoading] = useState(false);

  // SWOT Analyzer (Tool 7)
  const [swotIdea, setSwotIdea] = useState("B2B SaaS for automated construction project tracking");
  const [swotResult, setSwotResult] = useState<any>(null);
  const [swotLoading, setSwotLoading] = useState(false);

  // Competitor Gaps (Tool 8)
  const [competitorIdea, setCompetitorIdea] = useState("E-commerce hyper-personalized recommendation API");
  const [competitorSector, setCompetitorSector] = useState("Retail Tech");
  const [competitorResult, setCompetitorResult] = useState("");
  const [competitorLoading, setCompetitorLoading] = useState(false);

  // Name Generator (Tool 9)
  const [nameIdea, setNameIdea] = useState("Micro-delivery network for organic food items");
  const [nameSector, setNameSector] = useState("Logistics / Agri-Tech");
  const [nameList, setNameList] = useState<string[]>([]);
  const [nameLoading, setNameLoading] = useState(false);

  // DB History lists
  const [historySessions, setHistorySessions] = useState<FounderSession[]>([]);
  const [historyPitches, setHistoryPitches] = useState<VenturePitch[]>([]);

  useEffect(() => {
    loadHealthAndStudioData();
    loadDbHistory();
  }, []);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, chatLoading]);

  const loadHealthAndStudioData = async () => {
    try {
      const hRes = await fetch("/api/health");
      if (hRes.ok) {
        const hData = await hRes.json();
        setLlmEnabled(hData.llm_enabled);
        setProviderName(hData.provider);
        setRagBackend(hData.rag_backend || "Vector RAG");
      }

      const vRes = await fetch("/api/ventures");
      if (vRes.ok) {
        const vData = await vRes.json();
        setVenturesList(vData.ventures || []);
      }

      const iRes = await fetch("/api/ideas");
      if (iRes.ok) {
        const iData = await iRes.json();
        setIdeasPipeline(iData.ideas || []);
      }
    } catch (e) {
      setDbStatus("offline");
    }
  };

  const loadDbHistory = async () => {
    try {
      const sRes = await fetch("/api/history/sessions");
      if (sRes.ok) {
        const sData = await sRes.json();
        setHistorySessions(sData.sessions || []);
      }

      const pRes = await fetch("/api/history/pitches");
      if (pRes.ok) {
        const pData = await pRes.json();
        setHistoryPitches(pData.pitches || []);
      }
    } catch (e) {}
  };

  // Actions
  const handleFounderSend = async () => {
    const text = chatInput.trim();
    if (!text || chatLoading) return;
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", text }]);
    setChatLoading(true);

    const sid = activeSessionId || strRandom();
    if (!activeSessionId) setActiveSessionId(sid);

    try {
      const res = await fetch("/api/founder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, session_id: sid })
      });
      if (res.ok) {
        const d = await res.json();
        setChatMessages(prev => [...prev, { role: "ai", text: d.reply }]);
        loadDbHistory();
      }
    } catch (e) {
      setChatMessages(prev => [...prev, { role: "ai", text: "⚠️ Server offline. Please run the backend." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSelectSession = (session: FounderSession) => {
    setActiveSessionId(session.session_id);
    setChatMessages(session.messages.map(m => ({
      role: m.role,
      text: m.text
    })));
    setActivePanel("founder");
    setSidebarOpen(false);
  };

  const handleNewFounderChat = () => {
    setActiveSessionId("");
    setChatMessages([
      { role: "ai", text: "🌱 Welcome to Sevenseed Founder AI! Ask me about: business models, raising capital, GTM strategy, or our shared portfolio stack." }
    ]);
    setActivePanel("founder");
  };

  const handleIdeateVenture = async () => {
    if (!ideateDomain.trim() || ideateLoading) return;
    setIdeateLoading(true);
    setIdeateResult("");
    try {
      const res = await fetch("/api/ideate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: ideateDomain, problem: ideateProblem, target_market: ideateMarket })
      });
      if (res.ok) {
        const d = await res.json();
        setIdeateResult(d.ideas || "");
        loadDbHistory();
      }
    } catch (e) {
      setIdeateResult("⚠️ Venture ideation failed.");
    } finally {
      setIdeateLoading(false);
    }
  };

  const handleVentureRAGSearch = async () => {
    const q = ragQuery.trim();
    if (!q || ragLoading) return;
    setRagLoading(true);
    setRagResults([]);
    try {
      const res = await fetch("/api/founder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q })
      });
      if (res.ok) {
        const d = await res.json();
        setRagResults([{ title: "AI Advisor Analysis", body: d.reply }]);
      }
    } catch (e) {
    } finally {
      setRagLoading(false);
    }
  };

  const handlePortfolioAnalyze = async () => {
    if (portfolioLoading) return;
    setPortfolioLoading(true);
    setPortfolioAnalysis("");
    try {
      const res = await fetch("/api/portfolio");
      if (res.ok) {
        const d = await res.json();
        setPortfolioAnalysis(d.analysis || "");
      }
    } catch (e) {
    } finally {
      setPortfolioLoading(false);
    }
  };

  // Pitch Deck (Tool 4)
  const handlePitchDeckGenerate = async () => {
    setPitchLoading(true);
    setPitchResult("");
    try {
      const res = await fetch("/api/tools/pitch-deck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: pitchIdea, sector: pitchSector })
      });
      const data = await res.json();
      setPitchResult(data.result);
    } catch {
      setPitchResult("Venture Coach offline.");
    }
    setPitchLoading(false);
  };

  // Canvas (Tool 5)
  const handleCanvasGenerate = async () => {
    setCanvasLoading(true);
    setCanvasResult(null);
    try {
      const res = await fetch("/api/tools/canvas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: canvasIdea })
      });
      const data = await res.json();
      setCanvasResult(data.canvas);
    } catch {
      setCanvasResult({ value_propositions: "Offline: Canvas failed to load." });
    }
    setCanvasLoading(false);
  };

  // Market Research (Tool 6)
  const handleMarketResearch = async () => {
    setMarketLoading(true);
    setMarketResult("");
    try {
      const res = await fetch("/api/tools/market-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sector: marketSector })
      });
      const data = await res.json();
      setMarketResult(data.result);
    } catch {
      setMarketResult("Market research offline.");
    }
    setMarketLoading(false);
  };

  // SWOT (Tool 7)
  const handleSwotGenerate = async () => {
    setSwotLoading(true);
    setSwotResult(null);
    try {
      const res = await fetch("/api/tools/swot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: swotIdea })
      });
      const data = await res.json();
      setSwotResult(data.swot);
    } catch {
      setSwotResult({ strengths: ["Offline mode"] });
    }
    setSwotLoading(false);
  };

  // Competitor (Tool 8)
  const handleCompetitor = async () => {
    setCompetitorLoading(true);
    setCompetitorResult("");
    try {
      const res = await fetch("/api/tools/competitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: competitorIdea, sector: competitorSector })
      });
      const data = await res.json();
      setCompetitorResult(data.result);
    } catch {
      setCompetitorResult("Competitor Analysis offline.");
    }
    setCompetitorLoading(false);
  };

  // Name Generator (Tool 9)
  const handleNameGenerate = async () => {
    setNameLoading(true);
    setNameList([]);
    try {
      const res = await fetch("/api/tools/name-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: nameIdea, sector: nameSector })
      });
      const data = await res.json();
      setNameList(data.names || []);
    } catch {
      setNameList(["OfflineVenture", "SeedName"]);
    }
    setNameLoading(false);
  };

  const handleDeletePitch = async (id: number) => {
    try {
      const res = await fetch(`/api/history/pitches/${id}`, { method: "DELETE" });
      if (res.ok) {
        setHistoryPitches(prev => prev.filter(p => p.id !== id));
      }
    } catch (e) {}
  };

  const strRandom = () => Math.random().toString(36).substring(2, 15);

  const formatMd = (s: string) => {
    return s
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .split("\n")
      .map((line, idx) => <span key={idx} className="block mt-1">{line}</span>);
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "ideate", label: "Venture Sandbox (AI)", icon: Lightbulb },
    { id: "founder", label: "Founder Advisor (AI)", icon: Bot },
    { id: "advisor", label: "RAG Guidelines", icon: BookMarked },
    { id: "portfolio", label: "Portfolio Review (AI)", icon: Layers },
    { id: "pitchdeck", label: "Pitch Deck (AI)", icon: FileText },
    { id: "canvas", label: "Model Canvas (AI)", icon: LayoutGrid },
    { id: "market", label: "Market Research (AI)", icon: TrendingUp },
    { id: "swot", label: "SWOT Analyzer (AI)", icon: BarChart2 },
    { id: "competitor", label: "Competitor Analysis (AI)", icon: Users },
    { id: "namegen", label: "Branding Generator (AI)", icon: Compass },
    { id: "pitches", label: "Saved Pitches", icon: Briefcase },
  ];

  const activeMenuItem = menuItems.find((m) => m.id === activePanel);
  const ActiveIcon = activeMenuItem?.icon || LayoutDashboard;

  const swotTone: Record<string, string> = {
    strengths: "bg-[#10b981]/10 border-[#10b981]/25 text-[var(--secondary-l)]",
    opportunities: "bg-blue-500/10 border-blue-500/25 text-blue-300",
    weaknesses: "bg-amber-500/10 border-amber-500/25 text-amber-300",
    threats: "bg-rose-500/10 border-rose-500/25 text-rose-300",
  };

  return (
    <div className="app-shell flex min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans">
      {/* Sidebar */}
      <aside className={`sidebar w-[255px] shrink-0 bg-[var(--bg-1)] border-r border-white/5 flex flex-col p-[18px_14px] fixed top-0 bottom-0 z-50 h-screen transition-transform duration-300 md:sticky ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="side-logo flex items-center gap-3 font-extrabold text-[15px] tracking-tight">
            <span className="logo-icon w-[34px] h-[34px] rounded-[10px] grid place-items-center text-white bg-gradient-to-br from-[#8b5cf6] to-[#10b981] shadow-[0_6px_16px_rgba(139,92,246,0.3)]">
              <Leaf className="h-4 w-4" />
            </span>
            <span className="text-white">Seven<span className="text-[var(--secondary-l)]">seed</span></span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/50 hover:text-white transition-all cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="side-nav flex flex-col gap-1 flex-1 overflow-y-auto pr-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activePanel === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePanel(item.id as PanelType);
                  setSidebarOpen(false);
                }}
                className={`nav-item relative flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-xl text-left text-xs font-semibold border-none cursor-pointer transition-all ${
                  active
                    ? "bg-[#8b5cf6]/12 text-white"
                    : "text-[#8890aa] hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-gradient-to-b from-[#8b5cf6] to-[#10b981]" />
                )}
                <Icon className={`h-4 w-4 shrink-0 ${active ? "text-[var(--secondary-l)]" : ""}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="side-foot flex flex-col gap-3 pt-4 border-t border-white/5 mt-auto">
          <button onClick={() => setSettingsOpen(true)} className="nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-semibold border-none cursor-pointer transition-all text-[#8890aa] hover:bg-white/[0.04] hover:text-white">
            <Settings className="h-4 w-4" /> API Settings
          </button>
          <div className={`sysbadge flex items-center gap-2 text-[10.5px] font-mono rounded-lg border p-2.5 transition-all duration-300 ${
            llmEnabled ? "text-[var(--primary-l)] border-[#8b5cf6]/30 bg-[#8b5cf6]/5" : "text-[#8890aa] border-white/5 bg-[var(--bg-2)]"
          }`}>
            <Cpu className="h-3 w-3" />
            {llmEnabled ? "Advisor Ready" : "Offline Mode"}
          </div>
          <Link href="/" className="side-back flex items-center gap-2 text-xs text-[#8890aa] hover:text-white py-1 transition-all">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to landing page
          </Link>
        </div>
      </aside>

      {/* Main Panel Area */}
      <div className="main flex-1 flex flex-col min-w-0">
        <header className="topbar sticky top-0 bg-[var(--bg)]/95 backdrop-blur-md border-b border-white/5 z-20 flex items-center gap-4 px-6 md:px-12 py-4">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden w-10 h-10 rounded-lg bg-[var(--bg-2)] border border-white/10 flex items-center justify-center text-white cursor-pointer shrink-0">
            <Menu className="h-5 w-5" />
          </button>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#8b5cf6]/25 to-[#10b981]/10 hidden sm:flex items-center justify-center shrink-0">
            <ActiveIcon className="h-4 w-4 text-[var(--primary-l)]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-black text-white truncate">{activeMenuItem?.label || "Dashboard"}</h1>
            <p className="text-xs text-[#9aa0b8] mt-0.5">Sevenseed AI Venture Studio Hub</p>
          </div>
          <div className="ml-auto hidden md:block shrink-0">
            <span className="prov-chip font-mono text-[11px] font-semibold text-[var(--secondary-l)] bg-[#10b981]/10 border border-[#10b981]/25 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
              <Cpu className="h-3 w-3" />
              {llmEnabled ? providerName : "Offline AI Engine"} · {ragBackend.split(" ")[0]} RAG
            </span>
          </div>
        </header>

        <main className="panels p-6 md:p-12 max-w-[1180px] w-full flex-1">
          {/* Dashboard */}
          {activePanel === "dashboard" && (
            <div className="flex flex-col gap-8 animate-[fade_0.3s_ease]">
              <div className="welcome bg-gradient-to-r from-[#8b5cf6]/15 to-[#10b981]/5 border border-white/5 rounded-2xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#10b981] flex items-center justify-center shrink-0 shadow-[0_8px_24px_rgba(139,92,246,0.35)]">
                    <Rocket className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-black text-white">Welcome to Sevenseed Studio Hub</h2>
                    <p className="text-sm text-[#9aa0b8] mt-1 max-w-[620px] leading-relaxed">
                      Access shared AI stack libraries, model venture structures, analyze competitive markets, and launch targeted branding sequences.
                    </p>
                  </div>
                </div>
              </div>

              {/* Stat row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Incubated Ventures", value: venturesList.length, icon: Layers, tone: "neutral" },
                  { label: "Ideas in Pipeline", value: ideasPipeline.length, icon: Lightbulb, tone: "neutral" },
                  { label: "AI Engine", value: llmEnabled ? "Online" : "Offline", icon: Cpu, tone: llmEnabled ? "good" : "muted" },
                  { label: "Database", value: dbStatus === "connected" ? "Connected" : "Offline", icon: Database, tone: dbStatus === "connected" ? "good" : "bad" },
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="bg-[var(--bg-1)] border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        stat.tone === "good" ? "bg-[#10b981]/15 text-[var(--secondary-l)]" :
                        stat.tone === "bad" ? "bg-rose-500/15 text-rose-400" :
                        "bg-white/5 text-[#9aa0b8]"
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase font-bold tracking-wider text-[#5b5f78] truncate">{stat.label}</p>
                        <p className="text-sm font-black text-white truncate">{stat.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div>
                <h4 className="font-extrabold text-[#eeeef8] text-sm uppercase tracking-wider mb-4">Venture Studio AI Modules</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: "pitchdeck", title: "AI Pitch Deck Generator", desc: "Construct slide outlines for VC investment pitches.", icon: FileText },
                    { id: "canvas", title: "Business Model Canvas", desc: "Analyze value proposition & customer segments.", icon: LayoutGrid },
                    { id: "market", title: "Market Research", desc: "Examine size, trends, and target sectors in India.", icon: TrendingUp },
                    { id: "swot", title: "SWOT Analyzer", desc: "Examine internal strengths vs macro threats.", icon: BarChart2 },
                    { id: "competitor", title: "Competitor Analysis", desc: "Scan competitive landscape & identify product gaps.", icon: Users },
                    { id: "namegen", title: "Startup Name Generator", desc: "Generate short brandable names u/s target domains.", icon: Compass },
                  ].map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.id}
                        onClick={() => setActivePanel(action.id as PanelType)}
                        className="group bg-[var(--bg-1)] border border-white/5 hover:border-[#8b5cf6]/40 text-left rounded-2xl p-5 flex gap-4 transition-all duration-200 cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-lg bg-[#8b5cf6]/10 text-[var(--secondary-l)] grid place-items-center shrink-0 group-hover:bg-[#8b5cf6]/20 transition-all">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h5 className="font-bold text-white text-sm">{action.title}</h5>
                          <p className="text-[11px] text-[#9aa0b8] leading-relaxed mt-1">{action.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Incubated Ventures List */}
              {venturesList.length > 0 ? (
                <div className="flex flex-col gap-3">
                  <h4 className="font-extrabold text-[#eeeef8] text-sm uppercase tracking-wider">Active incubated ventures ({venturesList.length})</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {venturesList.map((prog, idx) => (
                      <div key={idx} className="bg-[var(--bg-1)] border border-white/5 rounded-2xl p-5 hover:border-[#8b5cf6]/50 transition-all">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8b5cf6]/15 text-[var(--primary-l)] uppercase tracking-wider">{prog.stage}</span>
                        <h5 className="font-bold text-white text-sm mt-2">{prog.name}</h5>
                        <p className="text-xs text-[#9aa0b8] mt-2 leading-relaxed line-clamp-3">{prog.description}</p>
                        <p className="text-[10px] font-mono text-[#5b5f78] mt-4 leading-normal border-t border-white/5 pt-3">Stack: {prog.ai_stack}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState icon={Layers} text="No incubated ventures yet — ideate a startup in the AI Sandbox to see it here." />
              )}
            </div>
          )}

          {/* Venture Sandbox */}
          {activePanel === "ideate" && (
            <div className="flex flex-col gap-6 max-w-[820px] animate-[fade_0.3s_ease]">
              <PanelHeader
                icon={Lightbulb}
                title="AI Venture Ideator"
                desc="Input your business domain, target problem, and market. The AI drafts 3 detailed startup pitches with tagline, custom AI stack, GTM, and checklists."
              />

              <div className="form-card bg-[var(--bg-1)] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Business Domain">
                    <input type="text" value={ideateDomain} onChange={(e) => setIdeateDomain(e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Target Market Size">
                    <input type="text" value={ideateMarket} onChange={(e) => setIdeateMarket(e.target.value)} className={inputCls} />
                  </Field>
                </div>
                <Field label="Core Problem to Solve">
                  <input type="text" value={ideateProblem} onChange={(e) => setIdeateProblem(e.target.value)} className={inputCls} />
                </Field>
                <button onClick={handleIdeateVenture} disabled={ideateLoading} className="btn w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold py-3.5 rounded-xl cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-60">
                  {ideateLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Structuring pitches...</> : <><Sparkles className="h-4 w-4" /> Draft Venture Pitches</>}
                </button>
              </div>

              {ideateLoading && !ideateResult && (
                <div className="flex justify-center py-14"><Loader2 className="h-6 w-6 animate-spin text-[#8b5cf6]" /></div>
              )}

              {!ideateLoading && !ideateResult && (
                <EmptyState icon={Lightbulb} text="Fill the form above to draft your first venture pitch set." />
              )}

              {ideateResult && (
                <ResultCard title="Venture Pitches">
                  {formatMd(ideateResult)}
                </ResultCard>
              )}
            </div>
          )}

          {/* Founder Advisor */}
          {activePanel === "founder" && (
            <div className="chat-wrap flex flex-col h-[calc(100vh-170px)] max-w-[860px] animate-[fade_0.3s_ease]">
              <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-4 mb-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8b5cf6]/25 to-[#10b981]/10 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-[var(--primary-l)]" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white uppercase tracking-wider block">Founder Advisory Session</span>
                    <span className="text-[10px] text-[#5b5f78]">Business models · GTM · moats · AI stack</span>
                  </div>
                </div>
                <button onClick={handleNewFounderChat} className="btn bg-white/5 border border-white/10 text-xs text-white px-3 py-1.5 rounded-lg hover:bg-[var(--bg-3)] cursor-pointer shrink-0">
                  + New Session
                </button>
              </div>

              {historySessions.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-1">
                  <span className="text-[10px] uppercase font-bold text-[#5b5f78] tracking-wider inline-flex items-center gap-1 shrink-0">
                    <History className="h-3 w-3" /> History
                  </span>
                  {historySessions.slice(0, 8).map((s) => (
                    <button
                      key={s.session_id}
                      onClick={() => handleSelectSession(s)}
                      className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                        activeSessionId === s.session_id
                          ? "bg-[#8b5cf6]/15 border-[#8b5cf6]/40 text-white"
                          : "bg-white/[0.02] border-white/10 text-[#9aa0b8] hover:text-white hover:border-white/20"
                      }`}
                    >
                      {(s.messages?.[0]?.text || "Session").slice(0, 24)}{(s.messages?.[0]?.text?.length ?? 0) > 24 ? "…" : ""}
                    </button>
                  ))}
                </div>
              )}

              <div ref={chatScrollRef} className="chat-scroll flex-1 overflow-y-auto flex flex-col gap-4 p-2">
                {chatMessages.map((m, i) => (
                  <div key={i} className={`msg flex gap-3 max-w-[90%] ${m.role === "user" ? "self-end flex-row-reverse" : "self-start"}`}>
                    <div className={`msg-ic w-[33px] h-[33px] rounded-lg flex items-center justify-center shrink-0 text-white ${
                      m.role === "user" ? "bg-white/10" : "bg-gradient-to-r from-[#8b5cf6] to-[#10b981]"
                    }`}>
                      {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={`msg-body text-sm px-4 py-3 rounded-2xl border ${
                      m.role === "user" ? "bg-[#8b5cf6]/10 border-[#8b5cf6]/25" : "bg-[var(--bg-2)] border-white/5"
                    }`}>
                      {formatMd(m.text)}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="msg flex gap-3 self-start">
                    <div className="msg-ic w-[33px] h-[33px] rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-r from-[#8b5cf6] to-[#10b981] text-white">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                    <div className="msg-body text-sm bg-[var(--bg-2)] border border-white/5 px-4 py-3 rounded-2xl flex items-center gap-2">
                      Consulting founder core logic...
                    </div>
                  </div>
                )}
              </div>

              <div className="chat-input flex gap-2 border-t border-white/5 pt-4 mt-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleFounderSend()}
                  placeholder="e.g. How do we design an AI product moat for e-commerce?"
                  className="flex-1 bg-[var(--bg-1)] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8b5cf6] transition-colors"
                />
                <button onClick={handleFounderSend} className="btn bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white px-5 rounded-xl cursor-pointer shrink-0">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* RAG Guidelines */}
          {activePanel === "advisor" && (
            <div className="flex flex-col gap-6 max-w-[820px] animate-[fade_0.3s_ease]">
              <PanelHeader
                icon={BookMarked}
                title="RAG Guidelines Advisor"
                desc="Ask specific questions regarding Sevenseed shared architecture guidelines, investment thesis, or incubation sprints."
              />

              <div className="form-card bg-[var(--bg-1)] border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row gap-3 sm:items-center">
                <div className="flex-1 relative">
                  <Search className="h-4 w-4 text-[#5b5f78] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={ragQuery}
                    onChange={(e) => setRagQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleVentureRAGSearch()}
                    placeholder="Search guidelines e.g. shared AI stack models, ethical policies..."
                    className="w-full bg-[var(--bg-2)] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#8b5cf6]/60 transition-colors"
                  />
                </div>
                <button onClick={handleVentureRAGSearch} disabled={ragLoading} className="btn bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white px-6 py-3 rounded-xl cursor-pointer inline-flex items-center justify-center gap-2 shrink-0 disabled:opacity-60">
                  {ragLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Query RAG"}
                </button>
              </div>

              {ragLoading && (
                <div className="flex justify-center py-14"><Loader2 className="h-6 w-6 animate-spin text-[#8b5cf6]" /></div>
              )}

              {!ragLoading && ragResults.length === 0 && (
                <EmptyState icon={BookMarked} text="Search the knowledge base to see AI advisor guidance here." />
              )}

              {ragResults.length > 0 && (
                <div className="flex flex-col gap-4">
                  {ragResults.map((r, idx) => (
                    <ResultCard key={idx} title={r.title}>
                      {formatMd(r.body)}
                    </ResultCard>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Portfolio Review */}
          {activePanel === "portfolio" && (
            <div className="flex flex-col gap-6 max-w-[820px] animate-[fade_0.3s_ease]">
              <PanelHeader
                icon={Layers}
                title="Portfolio Review"
                desc="Trigger a comprehensive portfolio review, evaluating overlaps, operational stages, and developer trajectories across all incubated startups."
              />

              <div className="form-card bg-[var(--bg-1)] border border-white/5 rounded-2xl p-6">
                <button onClick={handlePortfolioAnalyze} disabled={portfolioLoading} className="btn w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold py-3.5 rounded-xl cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-60">
                  {portfolioLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing portfolio...</> : <><Layers className="h-4 w-4" /> Analyze Studio Portfolio Overview</>}
                </button>
              </div>

              {portfolioLoading && !portfolioAnalysis && (
                <div className="flex justify-center py-14"><Loader2 className="h-6 w-6 animate-spin text-[#8b5cf6]" /></div>
              )}

              {!portfolioLoading && !portfolioAnalysis && (
                <EmptyState icon={Layers} text="Run a portfolio review to see cross-venture analysis here." />
              )}

              {portfolioAnalysis && (
                <ResultCard title="Portfolio Analysis">
                  {formatMd(portfolioAnalysis)}
                </ResultCard>
              )}
            </div>
          )}

          {/* Saved Pitches */}
          {activePanel === "pitches" && (
            <div className="flex flex-col gap-6 animate-[fade_0.3s_ease]">
              <PanelHeader
                icon={Briefcase}
                title="Saved Pitches"
                desc="Your saved venture ideation pitches. All drafts are stored locally in the database."
              />

              {historyPitches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {historyPitches.map(pitch => (
                    <div key={pitch.id} className="bg-[var(--bg-1)] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
                      <div className="flex justify-between items-start px-6 pt-6 pb-3 border-b border-white/5">
                        <div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8b5cf6]/15 text-[var(--primary-l)] uppercase tracking-wider">Pitch #{pitch.id}</span>
                          <h4 className="font-black text-white text-sm mt-2">{pitch.domain}</h4>
                        </div>
                        <button onClick={() => handleDeletePitch(pitch.id)} className="btn border-none bg-rose-500/10 text-rose-400 p-2 rounded-lg hover:bg-rose-500/20 cursor-pointer shrink-0">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="px-6 py-4 flex flex-col gap-1.5">
                        <p className="text-xs text-[#9aa0b8] leading-relaxed"><span className="text-[#5b5f78] font-semibold">Problem:</span> {pitch.problem}</p>
                        <p className="text-xs text-[#9aa0b8] leading-relaxed"><span className="text-[#5b5f78] font-semibold">Market:</span> {pitch.market}</p>
                      </div>
                      <div className="mx-6 mb-6 bg-[var(--bg-2)] border border-white/5 rounded-xl p-4 max-h-[220px] overflow-y-auto text-xs text-[#eeeef8] leading-relaxed font-mono whitespace-pre-wrap">
                        {pitch.ideas_output}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState icon={Briefcase} text="No saved pitches yet. Ideate startups in the AI Sandbox to see them here." />
              )}
            </div>
          )}

          {/* Pitch Deck Generator (Tool 4) */}
          {activePanel === "pitchdeck" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-[fade_0.3s_ease]">
              <div className="lg:col-span-5 bg-[var(--bg-1)] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5cf6]/20 to-[#10b981]/10 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Pitch Deck Planner</h4>
                    <p className="text-xs text-[#9aa0b8] mt-1 leading-relaxed">Draft structured slide deck outlines for venture pitches.</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <Field label="Venture Idea">
                    <input value={pitchIdea} onChange={(e) => setPitchIdea(e.target.value)} placeholder="Venture Idea" className={inputCls} />
                  </Field>
                  <Field label="Sector">
                    <input value={pitchSector} onChange={(e) => setPitchSector(e.target.value)} placeholder="Sector" className={inputCls} />
                  </Field>
                </div>
                <button onClick={handlePitchDeckGenerate} disabled={pitchLoading} className="btn w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold py-3.5 rounded-xl cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-60">
                  {pitchLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Structuring Deck...</> : <><Sparkles className="h-4 w-4" /> Generate Slide Outline</>}
                </button>
              </div>
              <div className="lg:col-span-7 bg-[var(--bg-2)] border border-white/5 rounded-2xl overflow-hidden min-h-[300px] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                  <h4 className="font-bold text-white text-sm">Slide Deck Structure</h4>
                  {pitchResult && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8b5cf6]/15 text-[var(--primary-l)] inline-flex items-center gap-1"><Sparkles className="h-2.5 w-2.5" /> AI Generated</span>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  {pitchLoading ? (
                    <div className="flex-1 flex justify-center items-center py-14"><Loader2 className="h-6 w-6 animate-spin text-[#8b5cf6]" /></div>
                  ) : pitchResult ? (
                    <div className="text-sm text-[#9aa0b8] leading-relaxed">{formatMd(pitchResult)}</div>
                  ) : (
                    <EmptyState icon={FileText} text="Submit details to outline deck slides." />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Model Canvas (Tool 5) */}
          {activePanel === "canvas" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-[fade_0.3s_ease]">
              <div className="lg:col-span-5 bg-[var(--bg-1)] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5cf6]/20 to-[#10b981]/10 flex items-center justify-center shrink-0">
                    <LayoutGrid className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Business Model Canvas</h4>
                    <p className="text-xs text-[#9aa0b8] mt-1 leading-relaxed">Model partner resources and value streams instantly.</p>
                  </div>
                </div>
                <Field label="Venture Idea">
                  <input value={canvasIdea} onChange={(e) => setCanvasIdea(e.target.value)} placeholder="Venture Idea" className={inputCls} />
                </Field>
                <button onClick={handleCanvasGenerate} disabled={canvasLoading} className="btn w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold py-3.5 rounded-xl cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-60">
                  {canvasLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Compiling Canvas...</> : <><Sparkles className="h-4 w-4" /> Generate Business Canvas</>}
                </button>
              </div>
              <div className="lg:col-span-7 bg-[var(--bg-2)] border border-white/5 rounded-2xl overflow-hidden min-h-[300px] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                  <h4 className="font-bold text-white text-sm">Model Matrix</h4>
                  {canvasResult && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8b5cf6]/15 text-[var(--primary-l)] inline-flex items-center gap-1"><Sparkles className="h-2.5 w-2.5" /> AI Generated</span>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  {canvasLoading ? (
                    <div className="flex-1 flex justify-center items-center py-14"><Loader2 className="h-6 w-6 animate-spin text-[#8b5cf6]" /></div>
                  ) : canvasResult ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(canvasResult).map(([k, v]: any) => (
                        <div key={k} className="bg-[var(--bg-1)] p-4 rounded-xl border border-white/5 border-t-2 border-t-[#8b5cf6]/40">
                          <span className="text-[10px] uppercase font-bold text-[#5b5f78] tracking-wider block mb-1.5">{k.replace(/_/g, " ")}</span>
                          <p className="text-xs text-[#9aa0b8] leading-relaxed">{v}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState icon={LayoutGrid} text="Click generate to map business resources." />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Market Research (Tool 6) */}
          {activePanel === "market" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-[fade_0.3s_ease]">
              <div className="lg:col-span-5 bg-[var(--bg-1)] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5cf6]/20 to-[#10b981]/10 flex items-center justify-center shrink-0">
                    <TrendingUp className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Market Analyst</h4>
                    <p className="text-xs text-[#9aa0b8] mt-1 leading-relaxed">Evaluate target sizing, competitor gaps, and trends.</p>
                  </div>
                </div>
                <Field label="Target Sector">
                  <input value={marketSector} onChange={(e) => setMarketSector(e.target.value)} placeholder="Target Sector" className={inputCls} />
                </Field>
                <button onClick={handleMarketResearch} disabled={marketLoading} className="btn w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold py-3.5 rounded-xl cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-60">
                  {marketLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing Market...</> : <><Sparkles className="h-4 w-4" /> Get Market Research</>}
                </button>
              </div>
              <div className="lg:col-span-7 bg-[var(--bg-2)] border border-white/5 rounded-2xl overflow-hidden min-h-[300px] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                  <h4 className="font-bold text-white text-sm">Sector Analysis Summary</h4>
                  {marketResult && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8b5cf6]/15 text-[var(--primary-l)] inline-flex items-center gap-1"><Sparkles className="h-2.5 w-2.5" /> AI Generated</span>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  {marketLoading ? (
                    <div className="flex-1 flex justify-center items-center py-14"><Loader2 className="h-6 w-6 animate-spin text-[#8b5cf6]" /></div>
                  ) : marketResult ? (
                    <div className="text-sm text-[#9aa0b8] leading-relaxed">{formatMd(marketResult)}</div>
                  ) : (
                    <EmptyState icon={TrendingUp} text="Submit sector name to fetch analysis report." />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SWOT Analyzer (Tool 7) */}
          {activePanel === "swot" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-[fade_0.3s_ease]">
              <div className="lg:col-span-5 bg-[var(--bg-1)] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5cf6]/20 to-[#10b981]/10 flex items-center justify-center shrink-0">
                    <BarChart2 className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">SWOT Analyzer</h4>
                    <p className="text-xs text-[#9aa0b8] mt-1 leading-relaxed">Identify internal strengths vs macro threats.</p>
                  </div>
                </div>
                <Field label="Venture Idea">
                  <input value={swotIdea} onChange={(e) => setSwotIdea(e.target.value)} placeholder="Venture Idea" className={inputCls} />
                </Field>
                <button onClick={handleSwotGenerate} disabled={swotLoading} className="btn w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold py-3.5 rounded-xl cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-60">
                  {swotLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing SWOT...</> : <><Sparkles className="h-4 w-4" /> Generate SWOT Matrix</>}
                </button>
              </div>
              <div className="lg:col-span-7 bg-[var(--bg-2)] border border-white/5 rounded-2xl overflow-hidden min-h-[300px] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                  <h4 className="font-bold text-white text-sm">SWOT Analysis</h4>
                  {swotResult && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8b5cf6]/15 text-[var(--primary-l)] inline-flex items-center gap-1"><Sparkles className="h-2.5 w-2.5" /> AI Generated</span>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  {swotLoading ? (
                    <div className="flex-1 flex justify-center items-center py-14"><Loader2 className="h-6 w-6 animate-spin text-[#8b5cf6]" /></div>
                  ) : swotResult ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(swotResult).map(([k, v]: any) => {
                        const cls = swotTone[k.toLowerCase()] || "bg-white/5 border-white/10 text-[#9aa0b8]";
                        return (
                          <div key={k} className={`p-4 rounded-xl border ${cls}`}>
                            <span className="font-bold text-white block capitalize mb-2 text-xs tracking-wide">{k}</span>
                            <ul className="flex flex-col gap-1.5 text-xs text-[#9aa0b8]">
                              {Array.isArray(v) && v.map((item: string, i: number) => (
                                <li key={i} className="flex items-start gap-2"><span className="mt-0.5 text-[9px] shrink-0">▸</span><span>{item}</span></li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <EmptyState icon={BarChart2} text="Click generate to map the SWOT matrix." />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Competitor Analysis (Tool 8) */}
          {activePanel === "competitor" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-[fade_0.3s_ease]">
              <div className="lg:col-span-5 bg-[var(--bg-1)] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5cf6]/20 to-[#10b981]/10 flex items-center justify-center shrink-0">
                    <Users className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Competitor Gaps</h4>
                    <p className="text-xs text-[#9aa0b8] mt-1 leading-relaxed">Identify competitor gaps and project AI opportunities.</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <Field label="Venture Idea">
                    <input value={competitorIdea} onChange={(e) => setCompetitorIdea(e.target.value)} placeholder="Venture Idea" className={inputCls} />
                  </Field>
                  <Field label="Sector">
                    <input value={competitorSector} onChange={(e) => setCompetitorSector(e.target.value)} placeholder="Sector" className={inputCls} />
                  </Field>
                </div>
                <button onClick={handleCompetitor} disabled={competitorLoading} className="btn w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold py-3.5 rounded-xl cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-60">
                  {competitorLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Scanning Gaps...</> : <><Sparkles className="h-4 w-4" /> Get Competitor Analysis</>}
                </button>
              </div>
              <div className="lg:col-span-7 bg-[var(--bg-2)] border border-white/5 rounded-2xl overflow-hidden min-h-[300px] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                  <h4 className="font-bold text-white text-sm">Strategic Gaps & Opportunities</h4>
                  {competitorResult && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8b5cf6]/15 text-[var(--primary-l)] inline-flex items-center gap-1"><Sparkles className="h-2.5 w-2.5" /> AI Generated</span>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  {competitorLoading ? (
                    <div className="flex-1 flex justify-center items-center py-14"><Loader2 className="h-6 w-6 animate-spin text-[#8b5cf6]" /></div>
                  ) : competitorResult ? (
                    <div className="text-sm text-[#9aa0b8] leading-relaxed">{formatMd(competitorResult)}</div>
                  ) : (
                    <EmptyState icon={Users} text="Submit details to evaluate market positioning." />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Name Generator (Tool 9) */}
          {activePanel === "namegen" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-[fade_0.3s_ease]">
              <div className="lg:col-span-5 bg-[var(--bg-1)] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5cf6]/20 to-[#10b981]/10 flex items-center justify-center shrink-0">
                    <Compass className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Startup Branding Generator</h4>
                    <p className="text-xs text-[#9aa0b8] mt-1 leading-relaxed">Generate 8 short brandable names based on domain.</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <Field label="Venture Idea">
                    <input value={nameIdea} onChange={(e) => setNameIdea(e.target.value)} placeholder="Venture Idea" className={inputCls} />
                  </Field>
                  <Field label="Sector">
                    <input value={nameSector} onChange={(e) => setNameSector(e.target.value)} placeholder="Sector" className={inputCls} />
                  </Field>
                </div>
                <button onClick={handleNameGenerate} disabled={nameLoading} className="btn w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold py-3.5 rounded-xl cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-60">
                  {nameLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Branding...</> : <><Sparkles className="h-4 w-4" /> Generate Brand Names</>}
                </button>
              </div>
              <div className="lg:col-span-7 bg-[var(--bg-2)] border border-white/5 rounded-2xl overflow-hidden min-h-[300px] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                  <h4 className="font-bold text-white text-sm">Brand Name Ideas</h4>
                  {nameList.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8b5cf6]/15 text-[var(--primary-l)] inline-flex items-center gap-1"><Sparkles className="h-2.5 w-2.5" /> AI Generated</span>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  {nameLoading ? (
                    <div className="flex-1 flex justify-center items-center py-14"><Loader2 className="h-6 w-6 animate-spin text-[#8b5cf6]" /></div>
                  ) : nameList.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {nameList.map((name, i) => (
                        <div key={i} className="bg-[var(--bg-1)] px-4 py-3 rounded-xl border border-white/5 flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-white truncate">{name}</span>
                          <span className="text-[10px] text-[var(--secondary-l)] font-mono inline-flex items-center gap-1 shrink-0"><CheckCircle2 className="h-3 w-3" /> Available</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState icon={Compass} text="Click generate to map brand identities." />
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {settingsOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-1)] border border-white/10 rounded-2xl p-6 max-w-lg w-full flex flex-col gap-4 animate-[fade_0.2s_ease]">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/15 flex items-center justify-center">
                  <Settings className="h-4 w-4 text-[var(--primary)]" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Configure API Keys</h3>
              </div>
              <button onClick={() => setSettingsOpen(false)} className="text-white/50 hover:text-white transition-all cursor-pointer bg-transparent border-none">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-[#9aa0b8] leading-relaxed">Keys are stored locally in your browser (localStorage) and sent only in the request headers.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Groq API Key">
                <input type="password" value={groqKey} onChange={(e) => setGroqKey(e.target.value)} placeholder="gsk_..." className="w-full bg-[var(--bg-2)] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#8b5cf6]/60 transition-colors" />
              </Field>
              <Field label="Gemini API Key">
                <input type="password" value={geminiKey} onChange={(e) => setGeminiKey(e.target.value)} placeholder="AIzaSy..." className="w-full bg-[var(--bg-2)] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#8b5cf6]/60 transition-colors" />
              </Field>
              <Field label="OpenAI API Key">
                <input type="password" value={openaiKey} onChange={(e) => setOpenaiKey(e.target.value)} placeholder="sk-proj-..." className="w-full bg-[var(--bg-2)] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#8b5cf6]/60 transition-colors" />
              </Field>
              <Field label="SerpAPI Key">
                <input type="password" value={serpapiKey} onChange={(e) => setSerpapiKey(e.target.value)} placeholder="..." className="w-full bg-[var(--bg-2)] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#8b5cf6]/60 transition-colors" />
              </Field>
              <Field label="HuggingFace Token">
                <input type="password" value={huggingfaceKey} onChange={(e) => setHuggingfaceKey(e.target.value)} placeholder="hf_..." className="w-full bg-[var(--bg-2)] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#8b5cf6]/60 transition-colors" />
              </Field>
              <Field label="Mistral API Key">
                <input type="password" value={mistralKey} onChange={(e) => setMistralKey(e.target.value)} placeholder="..." className="w-full bg-[var(--bg-2)] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#8b5cf6]/60 transition-colors" />
              </Field>
            </div>
            <div className="flex gap-3 justify-end border-t border-white/5 pt-4">
              <button onClick={() => setSettingsOpen(false)} className="btn bg-white/5 border border-white/10 text-xs text-white px-4 py-2 rounded-lg hover:bg-[var(--bg-3)] cursor-pointer">
                Cancel
              </button>
              <button onClick={() => {
                localStorage.setItem("user_groq_key", groqKey);
                localStorage.setItem("user_gemini_key", geminiKey);
                localStorage.setItem("user_openai_key", openaiKey);
                localStorage.setItem("user_serpapi_key", serpapiKey);
                localStorage.setItem("user_huggingface_key", huggingfaceKey);
                localStorage.setItem("user_mistral_key", mistralKey);
                setSettingsOpen(false);
                window.location.reload();
              }} className="btn bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:opacity-90 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer border-none inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> Save & Reload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
