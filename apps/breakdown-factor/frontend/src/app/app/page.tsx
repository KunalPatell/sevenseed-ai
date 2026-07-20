"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Bot,
  HardHat,
  Activity,
  Search,
  Menu,
  X,
  Send,
  Loader2,
  Trash2,
  ArrowLeft,
  Cpu,
  ChevronDown,
  ExternalLink,
  BookMarked,
  Briefcase,
  Layers,
  Calculator,
  Calendar,
  ShieldCheck,
  Percent,
  Upload,
  FileText,
  Settings,
  Building2,
  UserRound,
  Wallet,
  TrendingUp,
  Camera,
  ScanText,
  CheckCircle2,
  AlertTriangle,
  ListChecks,
  MessageSquare,
  Sparkles,
  ImageIcon,
  Clock,
  ReceiptText,
  ClipboardCheck
} from "lucide-react";

type PanelType = "dashboard" | "copilot" | "boq" | "defect" | "timeline" | "tender" | "safety" | "financials" | "sitedoc";

interface CopilotSession {
  session_id: string;
  created_at: string;
  messages: { role: "user" | "ai"; text: string }[];
}

interface DefectScan {
  id: number;
  created_at: string;
  filename: string;
  detected_list: string[];
  cost_range: string;
  guidance: string;
}

export default function ConstructionPortal() {
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

  // Auth/Session simulation
  const [token, setToken] = useState<string>("");
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [authName, setAuthName] = useState("Admin Builder");
  const [authEmail, setAuthEmail] = useState("builder@breakdown.com");
  const [authPassword, setAuthPassword] = useState("123456");
  const [authFeedback, setAuthFeedback] = useState("");

  // Projects list
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [remindersList, setRemindersList] = useState<any[]>([]);
  const [projName, setProjName] = useState("Sanand Warehouse");
  const [projType, setProjType] = useState("industrial");
  const [projArea, setProjArea] = useState(15000);
  const [projNotes, setProjNotes] = useState("Requires high-load RCC flooring.");

  // Copilot Chat
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "🏗️ Welcome to Breakdown Factor Copilot! I can advise you on cost estimates, safety guidelines, and IS standards (IS 456, IS 800)." }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // BOQ state
  const [boqArea, setBoqArea] = useState(1200);
  const [boqQuality, setBoqQuality] = useState("standard");
  const [boqResult, setBoqResult] = useState<any>(null);
  const [boqLoading, setBoqLoading] = useState(false);

  // Defect Scanner state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [defectScanResult, setDefectScanResult] = useState<any>(null);
  const [scanLoading, setScanLoading] = useState(false);

  // Timeline Generator
  const [timelineType, setTimelineType] = useState("residential");
  const [timelineArea, setTimelineArea] = useState(2500);
  const [timelineResult, setTimelineResult] = useState<any>(null);
  const [timelineLoading, setTimelineLoading] = useState(false);

  // Tender Writer
  const [tenderScope, setTenderScope] = useState("Piling and RCC superstructure work for commercial office");
  const [tenderBudget, setTenderBudget] = useState("₹1.2 Cr");
  const [tenderResult, setTenderResult] = useState("");
  const [tenderLoading, setTenderLoading] = useState(false);

  // Site Doc OCR state
  const [siteDocFile, setSiteDocFile] = useState<File | null>(null);
  const [siteDocResult, setSiteDocResult] = useState<any>(null);
  const [siteDocLoading, setSiteDocLoading] = useState(false);
  const [siteDocError, setSiteDocError] = useState("");

  // Safety gear vision scan state
  const [safetyImgFile, setSafetyImgFile] = useState<File | null>(null);
  const [safetyImgResult, setSafetyImgResult] = useState<any>(null);
  const [safetyImgLoading, setSafetyImgLoading] = useState(false);
  const [safetyImgError, setSafetyImgError] = useState("");

  // Financials state
  const [emiPrincipal, setEmiPrincipal] = useState(3500000);
  const [emiRate, setEmiRate] = useState(8.5);
  const [emiYears, setEmiYears] = useState(20);
  const [emiResult, setEmiResult] = useState<any>(null);

  const [roiCost, setRoiCost] = useState(5000000);
  const [roiRent, setRoiRent] = useState(22000);
  const [roiResult, setRoiResult] = useState<any>(null);

  // Safety checklist
  const [safetyType, setSafetyType] = useState("commercial");
  const [safetyResult, setSafetyResult] = useState("");
  const [safetyLoading, setSafetyLoading] = useState(false);

  // Histories
  const [historySessions, setHistorySessions] = useState<CopilotSession[]>([]);
  const [historyScans, setHistoryScans] = useState<DefectScan[]>([]);

  useEffect(() => {
    loadHealthAndData();
    loadDbHistory();
    // Load auth token if saved
    const savedToken = localStorage.getItem("breakdown_token");
    if (savedToken) {
      setToken(savedToken);
      fetchUser(savedToken);
    }
  }, []);

  const handleSiteDocOCR = async (fileToUpload?: File) => {
    const targetFile = fileToUpload || siteDocFile;
    if (!targetFile) {
      setSiteDocError("Please select or drop an image file first.");
      return;
    }
    setSiteDocLoading(true);
    setSiteDocError("");
    setSiteDocResult(null);
    try {
      const formData = new FormData();
      formData.append("file", targetFile);
      const res = await fetch("/api/tools/site-doc-ocr", {
        method: "POST",
        body: formData
      });
      const d = await res.json();
      if (res.ok && d.success) {
        setSiteDocResult(d);
      } else {
        setSiteDocError(d.error || "Failed to parse document text.");
      }
    } catch (e) {
      setSiteDocError("⚠️ Server offline. Please run the backend.");
    } finally {
      setSiteDocLoading(false);
    }
  };

  const handleLoadMockSiteDoc = (type: "permit" | "load_limit" | "delivery") => {
    const dummyBlob = new Blob([" "], { type: "image/jpeg" });
    let filename = "permit_sample.jpg";
    if (type === "load_limit") filename = "load_limit_sample.jpg";
    else if (type === "delivery") filename = "delivery_sample.jpg";
    
    const dummyFile = new File([dummyBlob], filename, { type: "image/jpeg" });
    setSiteDocFile(dummyFile);
    handleSiteDocOCR(dummyFile);
  };

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const loadHealthAndData = async () => {
    try {
      const hRes = await fetch("/api/health");
      if (hRes.ok) {
        const hData = await hRes.json();
        setLlmEnabled(hData.llm_enabled);
        setProviderName(hData.provider);
        setRagBackend(hData.rag_backend || "Vector RAG");
      }
      fetchProjects();
    } catch (e) {
      setDbStatus("offline");
    }
  };

  const loadDbHistory = async () => {
    try {
      const sRes = await fetch("/api/history/copilot");
      if (sRes.ok) {
        const sData = await sRes.json();
        setHistorySessions(sData.sessions || []);
      }

      const dRes = await fetch("/api/history/scans");
      if (dRes.ok) {
        const dData = await dRes.json();
        setHistoryScans(dData.scans || []);
      }
    } catch (e) {}
  };

  const fetchUser = async (tok: string) => {
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${tok}` }
      });
      if (res.ok) {
        const d = await res.json();
        if (d.user) setUser(d.user);
      }
    } catch (e) {}
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const d = await res.json();
        setProjectsList(d.projects || []);
      }

      const rRes = await fetch("/api/reminders");
      if (rRes.ok) {
        const rd = await rRes.json();
        setRemindersList(rd.reminders || []);
      }
    } catch (e) {}
  };

  // Auth Operations
  const handleSignup = async () => {
    setAuthFeedback("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: authName, email: authEmail, password: authPassword })
      });
      const d = await res.json();
      if (d.error) {
        setAuthFeedback(d.error);
      } else {
        setToken(d.token);
        setUser(d.user);
        localStorage.setItem("breakdown_token", d.token);
        setAuthFeedback("Account created successfully!");
      }
    } catch (e) {
      setAuthFeedback("Authentication server error.");
    }
  };

  const handleLogin = async () => {
    setAuthFeedback("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authEmail, password: authPassword })
      });
      const d = await res.json();
      if (d.error) {
        setAuthFeedback(d.error);
      } else {
        setToken(d.token);
        setUser(d.user);
        localStorage.setItem("breakdown_token", d.token);
        setAuthFeedback("Welcome back!");
      }
    } catch (e) {
      setAuthFeedback("Authentication server error.");
    }
  };

  const handleLogout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("breakdown_token");
    setAuthFeedback("");
  };

  // Project Logging
  const handleSaveProject = async () => {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user ? user.email : "guest@breakdown.com",
          name: projName,
          ptype: projType,
          area: projArea,
          status: "planning",
          notes: projNotes
        })
      });
      if (res.ok) {
        fetchProjects();
        setProjName("");
        setProjNotes("");
      }
    } catch (e) {}
  };

  // Copilot Send
  const handleCopilotSend = async () => {
    const text = chatInput.trim();
    if (!text || chatLoading) return;
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", text }]);
    setChatLoading(true);

    const sid = activeSessionId || Math.random().toString(36).substring(2, 15);
    if (!activeSessionId) setActiveSessionId(sid);

    try {
      const res = await fetch("/api/copilot", {
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

  const handleSelectSession = (session: CopilotSession) => {
    setActiveSessionId(session.session_id);
    setChatMessages(session.messages.map(m => ({
      role: m.role,
      text: m.text
    })));
    setActivePanel("copilot");
    setSidebarOpen(false);
  };

  const handleNewSession = () => {
    setActiveSessionId("");
    setChatMessages([
      { role: "ai", text: "🏗️ Welcome to Breakdown Factor Copilot! Ask me about cost estimates, safety guidelines, and IS standards (IS 456, IS 800)." }
    ]);
    setActivePanel("copilot");
  };

  // BOQ Calculator
  const handleBOQCalculate = async () => {
    if (!boqArea || boqLoading) return;
    setBoqLoading(true);
    try {
      const res = await fetch("/api/tools/boq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ area: boqArea, quality: boqQuality })
      });
      if (res.ok) {
        const d = await res.json();
        setBoqResult(d);
      }
    } catch (e) {
    } finally {
      setBoqLoading(false);
    }
  };

  // Defect Scanner
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDefectScan = async () => {
    if (!selectedFile || scanLoading) return;
    setScanLoading(true);
    setDefectScanResult(null);
    
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("/api/defect/scan", {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        const d = await res.json();
        setDefectScanResult(d);
        loadDbHistory();
      }
    } catch (e) {
    } finally {
      setScanLoading(false);
    }
  };

  const handleDeleteScan = async (id: number) => {
    try {
      const res = await fetch(`/api/history/scans/${id}`, { method: "DELETE" });
      if (res.ok) {
        setHistoryScans(prev => prev.filter(s => s.id !== id));
      }
    } catch (e) {}
  };

  // Timeline Generator
  const handleTimelineGenerate = async () => {
    if (!timelineArea || timelineLoading) return;
    setTimelineLoading(true);
    try {
      const res = await fetch("/api/tools/timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_type: timelineType, area: timelineArea })
      });
      if (res.ok) {
        const d = await res.json();
        setTimelineResult(d);
      }
    } catch (e) {
    } finally {
      setTimelineLoading(false);
    }
  };

  // Tender Writer
  const handleTenderWrite = async () => {
    if (!tenderScope.trim() || tenderLoading) return;
    setTenderLoading(true);
    setTenderResult("");
    try {
      const res = await fetch("/api/tools/tender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope: tenderScope, budget: tenderBudget })
      });
      if (res.ok) {
        const d = await res.json();
        setTenderResult(d.result || "");
      }
    } catch (e) {
    } finally {
      setTenderLoading(false);
    }
  };

  // Financials
  const handleEMICalculate = async () => {
    try {
      const res = await fetch("/api/tools/emi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ principal: emiPrincipal, rate: emiRate, years: emiYears })
      });
      if (res.ok) {
        const d = await res.json();
        setEmiResult(d);
      }
    } catch (e) {}
  };

  const handleROICalculate = async () => {
    try {
      const res = await fetch("/api/tools/roi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cost: roiCost, monthly_rent: roiRent })
      });
      if (res.ok) {
        const d = await res.json();
        setRoiResult(d);
      }
    } catch (e) {}
  };

  // Safety Checklist
  const handleSafetyChecklist = async () => {
    if (safetyLoading) return;
    setSafetyLoading(true);
    setSafetyResult("");
    try {
      const res = await fetch("/api/tools/safety-checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site_type: safetyType })
      });
      if (res.ok) {
        const d = await res.json();
        setSafetyResult(d.checklist || "");
      }
    } catch (e) {
    } finally {
      setSafetyLoading(false);
    }
  };

  const handleSafetyDetect = async (fileToUpload?: File) => {
    const targetFile = fileToUpload || safetyImgFile;
    if (!targetFile) {
      setSafetyImgError("Please select a site photo first.");
      return;
    }
    setSafetyImgLoading(true);
    setSafetyImgError("");
    setSafetyImgResult(null);
    try {
      const image_base64: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(targetFile);
      });
      const res = await fetch("/api/tools/safety-detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_base64 })
      });
      const d = await res.json();
      if (res.ok && d.success !== false) {
        setSafetyImgResult(d);
      } else {
        setSafetyImgError(d.error || "Failed to analyze the photo.");
      }
    } catch (e) {
      setSafetyImgError("⚠️ Server offline. Please run the backend.");
    } finally {
      setSafetyImgLoading(false);
    }
  };

  const formatMd = (s: string) => {
    return s
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .split("\n")
      .map((line, idx) => <span key={idx} className="block mt-1">{line}</span>);
  };

  const formatCost = (val: number) => "₹" + val.toLocaleString("en-IN");

  const panels = {
    dashboard: (
      <div className="flex flex-col gap-8 animate-[fade_0.3s_ease]">
        <div className="welcome relative overflow-hidden bg-gradient-to-r from-[#f59e0b]/15 to-[#f97316]/5 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#f97316] flex items-center justify-center shrink-0 shadow-[0_6px_18px_rgba(245,158,11,0.35)]">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white font-mono">Workspace Overview</h2>
              <p className="text-sm text-[#c8c0b8] mt-1 max-w-[620px] leading-relaxed">
                Access shared AI tools, calculate material quantities, audit building site safety, or consult structural engineers.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/20 shrink-0 w-fit">
            <Sparkles className="h-3 w-3" /> AI-Assisted
          </span>
        </div>

        {/* User auth card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-[#0e0a07] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#f59e0b]/20 to-[#f97316]/10 flex items-center justify-center shrink-0">
                <UserRound className="h-4 w-4 text-[#f59e0b]" />
              </div>
              <h4 className="font-extrabold text-[#faf8f5] text-sm">Client Session Manager</h4>
            </div>
            {user ? (
              <div className="flex flex-col gap-2">
                <div className="bg-[#14100b] border border-white/5 rounded-xl p-4">
                  <p className="text-[10px] uppercase font-bold text-[#7c7268]">Logged in as</p>
                  <p className="text-sm text-white font-bold mt-1">{user.name}</p>
                  <p className="text-xs text-[#c8c0b8] mt-0.5">{user.email}</p>
                </div>
                <button onClick={handleLogout} className="btn bg-white/5 border border-white/10 text-xs text-white py-2.5 rounded-lg hover:bg-white/10 mt-1 cursor-pointer">
                  Logout Session
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#7c7268] tracking-wider block mb-1.5">Name</label>
                    <input
                      type="text"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full bg-[#14100b] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#f59e0b]/50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#7c7268] tracking-wider block mb-1.5">Email</label>
                    <input
                      type="email"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="builder@breakdown.com"
                      className="w-full bg-[#14100b] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#f59e0b]/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#7c7268] tracking-wider block mb-1.5">Password</label>
                  <input
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Password (6+ chars)"
                    className="w-full bg-[#14100b] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#f59e0b]/50"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleLogin} className="btn flex-1 bg-white/5 border border-white/10 text-white text-xs font-semibold py-2.5 px-4 rounded-lg hover:bg-white/10 cursor-pointer">Login</button>
                  <button onClick={handleSignup} className="btn flex-1 bg-gradient-to-r from-[#f59e0b] to-[#f97316] text-white text-xs font-semibold py-2.5 px-4 rounded-lg cursor-pointer">Sign Up</button>
                </div>
                {authFeedback && <p className="text-[10px] text-[#f59e0b] font-semibold">{authFeedback}</p>}
              </div>
            )}
          </div>

          <div className="lg:col-span-7 bg-[#0e0a07] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#f59e0b]/20 to-[#f97316]/10 flex items-center justify-center shrink-0">
                <Building2 className="h-4 w-4 text-[#f59e0b]" />
              </div>
              <h4 className="font-extrabold text-[#faf8f5] text-sm">Log Construction Project</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#7c7268] tracking-wider block mb-1.5">Project Name</label>
                <input
                  type="text"
                  value={projName}
                  onChange={(e) => setProjName(e.target.value)}
                  placeholder="Project Name"
                  className="w-full bg-[#14100b] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#f59e0b]/50"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[#7c7268] tracking-wider block mb-1.5">Project Type</label>
                <select
                  value={projType}
                  onChange={(e) => setProjType(e.target.value)}
                  className="w-full bg-[#14100b] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#f59e0b]/50"
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[#7c7268] tracking-wider block mb-1.5">Area (sqft)</label>
                <input
                  type="number"
                  value={projArea}
                  onChange={(e) => setProjArea(Number(e.target.value))}
                  placeholder="Area (sqft)"
                  className="w-full bg-[#14100b] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#f59e0b]/50"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[#7c7268] tracking-wider block mb-1.5">Notes</label>
                <input
                  type="text"
                  value={projNotes}
                  onChange={(e) => setProjNotes(e.target.value)}
                  placeholder="Project Notes..."
                  className="w-full bg-[#14100b] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#f59e0b]/50"
                />
              </div>
            </div>
            <button onClick={handleSaveProject} className="btn bg-gradient-to-r from-[#f59e0b] to-[#f97316] text-white text-xs font-semibold py-2.5 rounded-lg cursor-pointer">
              Add Project Log
            </button>
          </div>
        </div>

        {/* Projects List */}
        <div className="flex flex-col gap-3">
          <h4 className="font-extrabold text-[#faf8f5] text-sm uppercase tracking-wider">Active construction logs {projectsList.length > 0 && `(${projectsList.length})`}</h4>
          {projectsList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectsList.map((p, idx) => (
                <div key={idx} className="bg-[#14100b] border border-white/5 rounded-2xl p-5">
                  <span className="text-[10px] text-[#f59e0b] font-mono font-bold uppercase">{p.ptype} · {p.status}</span>
                  <h5 className="font-bold text-white text-sm mt-1">{p.name}</h5>
                  <p className="text-xs text-[#c8c0b8] mt-2 leading-relaxed">Area: {p.area} sqft</p>
                  <p className="text-xs text-[#7c7268] mt-1 leading-normal italic">{p.notes}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-14 text-center border border-dashed border-white/10 rounded-2xl">
              <Building2 className="h-8 w-8 text-white/20" />
              <p className="text-xs text-[#7c7268]">No projects logged yet — add one above to start tracking.</p>
            </div>
          )}
        </div>
      </div>
    ),
    copilot: (
      <div className="chat-wrap flex flex-col h-[calc(100vh-170px)] max-w-[840px] animate-[fade_0.3s_ease]">
        <div className="flex items-center justify-between gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-4 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f59e0b]/20 to-[#f97316]/10 flex items-center justify-center shrink-0">
              <MessageSquare className="h-5 w-5 text-[#f59e0b]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white">AI Construction Copilot</h3>
              <p className="text-xs text-[#7c7268] mt-0.5 truncate">LangGraph agent · IS 456 / IS 800 structural standards</p>
            </div>
          </div>
          <button onClick={handleNewSession} className="btn bg-white/5 border border-white/10 text-xs text-white px-3 py-1.5 rounded-lg hover:bg-[#1c150f] shrink-0 cursor-pointer">
            + New Session
          </button>
        </div>

        <div ref={chatScrollRef} className="chat-scroll flex-1 overflow-y-auto flex flex-col gap-4 p-2">
          {chatMessages.map((m, i) => (
            <div key={i} className={`msg flex gap-3 max-w-[90%] ${m.role === "user" ? "self-end flex-row-reverse" : "self-start"}`}>
              <div className={`msg-ic w-[33px] h-[33px] rounded-lg flex items-center justify-center shrink-0 text-white ${
                m.role === "user" ? "bg-white/10" : "bg-gradient-to-br from-[#f59e0b] to-[#f97316]"
              }`}>
                {m.role === "user" ? <X className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={`msg-body text-sm px-4 py-3 rounded-2xl border ${
                m.role === "user" ? "bg-[#f59e0b]/10 border-[#f59e0b]/25" : "bg-[#14100b] border-white/5"
              }`}>
                {formatMd(m.text)}
              </div>
            </div>
          ))}
          {chatLoading && (
            <div className="msg flex gap-3 self-start">
              <div className="msg-ic w-[33px] h-[33px] rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br from-[#f59e0b] to-[#f97316] text-white">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
              <div className="msg-body text-sm bg-[#14100b] border border-white/5 px-4 py-3 rounded-2xl flex items-center gap-2">
                Consulting structural blueprints...
              </div>
            </div>
          )}
        </div>

        <div className="chat-input flex gap-2 border-t border-white/5 pt-4 mt-2">
          <input 
            type="text" 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCopilotSend()}
            placeholder="Ask about Indian standards (IS 456, IS 800) or site safety..." 
            className="flex-1 bg-[#0e0a07] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f59e0b]"
          />
          <button onClick={handleCopilotSend} className="btn bg-gradient-to-br from-[#f59e0b] to-[#f97316] text-white px-5 rounded-xl cursor-pointer">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    ),
    boq: (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-[fade_0.3s_ease]">
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4 bg-white/[0.02] border border-white/5 rounded-2xl p-5 backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f59e0b]/20 to-[#f97316]/10 flex items-center justify-center shrink-0 border border-white/10">
              <Calculator className="h-6 w-6 text-[#f59e0b]" />
            </div>
            <div>
              <h3 className="text-base font-black text-white font-mono">Smart BOQ Estimator</h3>
              <p className="text-xs text-[#c8c0b8] mt-1.5 leading-relaxed">Input your built-up area and construction quality class to generate a Bill of Quantities (BOQ) with rates.</p>
            </div>
          </div>

          <div className="bg-[#0e0a07] border border-white/5 rounded-2xl p-6 flex flex-col gap-5 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#7c7268] tracking-wider block mb-2">Area (sqft)</label>
                <input
                  type="number"
                  value={boqArea}
                  onChange={(e) => setBoqArea(Number(e.target.value))}
                  className="w-full bg-[#14100b] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#f59e0b]/50"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[#7c7268] tracking-wider block mb-2">Quality Class</label>
                <select
                  value={boqQuality}
                  onChange={(e) => setBoqQuality(e.target.value)}
                  className="w-full bg-[#14100b] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#f59e0b]/50"
                >
                  <option value="economy">Economy (Basic materials)</option>
                  <option value="standard">Standard (Standard brickwork/masonry)</option>
                  <option value="premium">Premium (Top-grade vitrified tiles & finishes)</option>
                </select>
              </div>
            </div>
            <button onClick={handleBOQCalculate} disabled={boqLoading} className="btn w-full bg-gradient-to-r from-[#f59e0b] to-[#f97316] text-white font-extrabold py-4 rounded-xl cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-60 shadow-[0_4px_20px_rgba(245,158,11,0.25)]">
              {boqLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Estimating...</> : <><Calculator className="h-4 w-4" /> Calculate BOQ</>}
            </button>
          </div>
        </div>

        <div className="console-panel bg-[#0d0f0e] border border-white/5 rounded-2xl p-6 min-h-[480px] flex flex-col shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
            <span className="text-xs font-bold text-[#7c7268] uppercase tracking-wider font-mono flex items-center gap-2"><Cpu className="h-4 w-4 text-[#f59e0b]" /> BOQ Estimator Console</span>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${boqLoading ? "bg-amber-500 animate-pulse" : "bg-emerald-500"} shadow-lg`}></span>
              <span className="text-[10px] uppercase text-[#5b5f78] font-bold">{boqLoading ? "estimating" : "ready"}</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            {boqLoading ? (
              <div className="flex flex-col items-center justify-center gap-3 text-[#9aa0b8] font-mono text-xs">
                <Loader2 className="h-8 w-8 animate-spin text-[#f59e0b]" />
                <p>Computing quantities and rates...</p>
              </div>
            ) : boqResult ? (
              <div className="flex flex-col gap-5 animate-[fade_0.3s_ease]">
                <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3">
                  <div>
                    <h5 className="font-bold text-white text-xs md:text-sm">Estimated Total Cost</h5>
                    <p className="text-[10px] text-[#7c7268] mt-0.5">Per-sqft rate: {boqResult.per_sqft}</p>
                  </div>
                  <div className="text-2xl font-black text-[#f59e0b]">{boqResult.total_str}</div>
                </div>
                <div className="overflow-x-auto max-h-[300px]">
                  <table className="w-full text-left text-xs text-[#c8c0b8]">
                    <thead>
                      <tr className="border-b border-white/5 text-white uppercase tracking-wider text-[10px]">
                        <th className="py-2">Material / Item</th>
                        <th className="py-2">Quantity</th>
                        <th className="py-2">Base Rate</th>
                        <th className="py-2 text-right">Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {boqResult.items.map((it: any, idx: number) => (
                        <tr key={idx} className="border-b border-white/5 last:border-b-0">
                          <td className="py-2.5 font-semibold text-white">{it.item}</td>
                          <td className="py-2.5">{it.qty} {it.unit}</td>
                          <td className="py-2.5">₹{it.rate}</td>
                          <td className="py-2.5 text-right text-white font-semibold">{it.cost_str}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 text-[#7c7268]">
                <Calculator className="h-10 w-10 opacity-20" />
                <p className="text-xs text-center max-w-[220px]">Fill in built-up area and quality class to run cost estimates.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    defect: (
      <div className="flex flex-col gap-6 max-w-[820px] animate-[fade_0.3s_ease]">
        <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f59e0b]/20 to-[#f97316]/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5 text-[#f59e0b]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Defect Detection Scanner</h3>
            <p className="text-xs text-[#c8c0b8] mt-1 leading-relaxed">
              Upload concrete structures or plaster pictures to detect defects (wall cracks, switch damage, tile damage, pipe leakage) and retrieve step-by-step repair guides.
            </p>
          </div>
        </div>

        <div className="form-card bg-[#0e0a07] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch">
            <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl p-8 hover:border-[#f59e0b]/50 transition-all cursor-pointer text-center">
              <Camera className="h-8 w-8 text-[#f59e0b] mb-2" />
              <span className="text-xs text-white font-semibold">
                {selectedFile ? selectedFile.name : "Click to select a photo"}
              </span>
              <span className="text-[10px] text-[#7c7268] mt-1">JPG, PNG — cracks, leakage, tile/switch damage</span>
              <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
            </label>
            {selectedFile && (
              <div className="w-full md:w-[140px] h-[140px] rounded-2xl overflow-hidden border border-white/10 shrink-0 bg-[#14100b]">
                <img src={URL.createObjectURL(selectedFile)} alt="Selected preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          <button onClick={handleDefectScan} disabled={scanLoading || !selectedFile} className="btn w-full bg-gradient-to-r from-[#f59e0b] to-[#f97316] text-white font-semibold py-3.5 rounded-xl cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-50">
            {scanLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing image...</> : <><ShieldCheck className="h-4 w-4" /> Analyze Defect Image</>}
          </button>
        </div>

        {!defectScanResult && !scanLoading && (
          <div className="flex flex-col items-center justify-center gap-3 py-14 text-center border border-dashed border-white/10 rounded-2xl">
            <ImageIcon className="h-8 w-8 text-white/20" />
            <p className="text-xs text-[#7c7268]">Upload a photo above to detect structural defects</p>
          </div>
        )}

        {defectScanResult && (
          <div className="bg-[#14100b] border border-white/5 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.02]">
              <span className="text-[11px] uppercase font-bold text-[#c8c0b8] tracking-wider">Detected Faults</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f59e0b]/15 text-[#f59e0b]">AI Generated</span>
            </div>
            <div className="p-6 flex flex-col gap-4 text-sm leading-relaxed">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <p className="text-xs text-[#7c7268]">Scan Complete</p>
                <div className="text-sm font-mono text-[#f59e0b] bg-[#f59e0b]/10 px-3 py-1.5 rounded-lg border border-[#f59e0b]/20">
                  {defectScanResult.cost_range}
                </div>
              </div>
              <div>
                {formatMd(defectScanResult.guidance)}
              </div>
            </div>
          </div>
        )}

        {/* History scans */}
        <div className="flex flex-col gap-3 mt-4">
          <h4 className="font-extrabold text-[#faf8f5] text-xs uppercase tracking-wider">Defect Diagnosis History {historyScans.length > 0 && `(${historyScans.length})`}</h4>
          {historyScans.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {historyScans.map(scan => (
                <div key={scan.id} className="bg-[#14100b] border border-white/5 rounded-2xl p-5 flex flex-col gap-3">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <div>
                      <span className="text-[10px] text-[#7c7268] font-mono">{scan.created_at.substring(0, 10)}</span>
                      <h6 className="font-bold text-white text-xs mt-0.5">{scan.filename}</h6>
                    </div>
                    <button onClick={() => handleDeleteScan(scan.id)} className="btn bg-rose-500/10 text-rose-400 p-2 rounded-lg hover:bg-rose-500/20 cursor-pointer">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="text-xs text-[#c8c0b8] font-mono">
                    Detected: {scan.detected_list.join(", ") || "No defects detected"}
                  </div>
                  <div className="text-xs text-[#c8c0b8] leading-relaxed max-h-[120px] overflow-y-auto whitespace-pre-wrap font-sans">
                    {scan.guidance}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center border border-dashed border-white/10 rounded-2xl">
              <p className="text-xs text-[#7c7268]">No past scans yet — your diagnosis history will appear here.</p>
            </div>
          )}
        </div>
      </div>
    ),
    timeline: (
      <div className="flex flex-col gap-6 max-w-[820px] animate-[fade_0.3s_ease]">
        <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f59e0b]/20 to-[#f97316]/10 flex items-center justify-center shrink-0">
            <Calendar className="h-5 w-5 text-[#f59e0b]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Timeline Scheduler</h3>
            <p className="text-xs text-[#c8c0b8] mt-1 leading-relaxed">
              Estimate timelines and phasing for residential, commercial, or industrial building constructions.
            </p>
          </div>
        </div>

        <div className="form-card bg-[#0e0a07] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#7c7268] tracking-wider block mb-2">Project Type</label>
              <select
                value={timelineType}
                onChange={(e) => setTimelineType(e.target.value)}
                className="w-full bg-[#14100b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f59e0b]/50"
              >
                <option value="residential">Residential Villa</option>
                <option value="commercial">Commercial Office</option>
                <option value="industrial">Industrial Factory / Warehouse</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-[#7c7268] tracking-wider block mb-2">Area (sqft)</label>
              <input
                type="number"
                value={timelineArea}
                onChange={(e) => setTimelineArea(Number(e.target.value))}
                className="w-full bg-[#14100b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f59e0b]/50"
              />
            </div>
          </div>
          <button onClick={handleTimelineGenerate} disabled={timelineLoading} className="btn w-full bg-gradient-to-r from-[#f59e0b] to-[#f97316] text-white font-semibold py-3.5 rounded-xl cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-60">
            {timelineLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</> : <><Calendar className="h-4 w-4" /> Generate Schedule</>}
          </button>
        </div>

        {!timelineResult && !timelineLoading && (
          <div className="flex flex-col items-center justify-center gap-3 py-14 text-center border border-dashed border-white/10 rounded-2xl">
            <Clock className="h-8 w-8 text-white/20" />
            <p className="text-xs text-[#7c7268]">Fill the form above to generate a phased construction schedule</p>
          </div>
        )}

        {timelineResult && (
          <div className="bg-[#14100b] border border-white/5 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.02]">
              <span className="text-[11px] uppercase font-bold text-[#c8c0b8] tracking-wider">Timeline Summary</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f59e0b]/15 text-[#f59e0b]">Computed</span>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <p className="text-xs text-[#7c7268]">Total Duration</p>
                <div className="text-xl font-black text-[#f59e0b]">{timelineResult.total_weeks} Weeks (~{timelineResult.total_months} Months)</div>
              </div>
              <div className="flex flex-col gap-3">
                {timelineResult.phases.map((ph: any, idx: number) => (
                  <div key={idx} className="flex flex-col gap-1 border-b border-white/5 pb-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-white">{ph.phase}</span>
                      <span className="text-[#f59e0b] font-mono">Week {ph.start_week} - {ph.end_week} ({ph.weeks} w)</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-gradient-to-r from-[#f59e0b] to-[#f97316]"
                        style={{
                          marginLeft: `${(ph.start_week / timelineResult.total_weeks) * 100}%`,
                          width: `${(ph.weeks / timelineResult.total_weeks) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    ),
    tender: (
      <div className="flex flex-col gap-6 max-w-[820px] animate-[fade_0.3s_ease]">
        <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f59e0b]/20 to-[#f97316]/10 flex items-center justify-center shrink-0">
            <Briefcase className="h-5 w-5 text-[#f59e0b]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Tender Proposal Writer</h3>
            <p className="text-xs text-[#c8c0b8] mt-1 leading-relaxed">
              Draft a structured tender or bidding proposal summary for construction procurement.
            </p>
          </div>
        </div>

        <div className="form-card bg-[#0e0a07] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-[#7c7268] tracking-wider block mb-2">Scope of Work</label>
            <textarea
              rows={3}
              value={tenderScope}
              onChange={(e) => setTenderScope(e.target.value)}
              className="w-full bg-[#14100b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f59e0b]/50 resize-none"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-[#7c7268] tracking-wider block mb-2">Estimated Budget</label>
            <input
              type="text"
              value={tenderBudget}
              onChange={(e) => setTenderBudget(e.target.value)}
              className="w-full bg-[#14100b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f59e0b]/50"
            />
          </div>
          <button onClick={handleTenderWrite} disabled={tenderLoading} className="btn w-full bg-gradient-to-r from-[#f59e0b] to-[#f97316] text-white font-semibold py-3.5 rounded-xl cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-60">
            {tenderLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Drafting proposal...</> : <><Briefcase className="h-4 w-4" /> Draft Proposal</>}
          </button>
        </div>

        {!tenderResult && !tenderLoading && (
          <div className="flex flex-col items-center justify-center gap-3 py-14 text-center border border-dashed border-white/10 rounded-2xl">
            <Briefcase className="h-8 w-8 text-white/20" />
            <p className="text-xs text-[#7c7268]">Fill in the scope and budget above to draft a tender proposal</p>
          </div>
        )}

        {tenderResult && (
          <div className="bg-[#14100b] border border-white/5 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.02]">
              <span className="text-[11px] uppercase font-bold text-[#c8c0b8] tracking-wider">Draft Proposal</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f59e0b]/15 text-[#f59e0b]"><Sparkles className="h-3 w-3" /> AI Generated</span>
            </div>
            <div className="p-6 text-sm leading-relaxed whitespace-pre-wrap font-mono">
              {formatMd(tenderResult)}
            </div>
          </div>
        )}
      </div>
    ),
    safety: (
      <div className="flex flex-col gap-6 max-w-[820px] animate-[fade_0.3s_ease]">
        <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f59e0b]/20 to-[#f97316]/10 flex items-center justify-center shrink-0">
            <HardHat className="h-5 w-5 text-[#f59e0b]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Site Safety Auditing</h3>
            <p className="text-xs text-[#c8c0b8] mt-1 leading-relaxed">
              Generate OSHA/NBC compliant safety checklists, or run a live computer-vision PPE compliance scan on site photos.
            </p>
          </div>
        </div>

        {/* Sub-section: checklist generator */}
        <div className="flex items-center gap-2 mt-2">
          <ListChecks className="h-4 w-4 text-[#f59e0b]" />
          <h4 className="text-xs font-extrabold text-[#faf8f5] uppercase tracking-wider">Safety Audit Checklist Generator</h4>
        </div>
        <div className="form-card bg-[#0e0a07] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-[#7c7268] tracking-wider block mb-2">Site Type</label>
            <select
              value={safetyType}
              onChange={(e) => setSafetyType(e.target.value)}
              className="w-full bg-[#14100b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f59e0b]/50"
            >
              <option value="residential">Residential Housing</option>
              <option value="commercial">Commercial Highrise Office</option>
              <option value="industrial">Industrial Infrastructure / Warehouse</option>
            </select>
          </div>
          <button onClick={handleSafetyChecklist} disabled={safetyLoading} className="btn w-full bg-gradient-to-r from-[#f59e0b] to-[#f97316] text-white font-semibold py-3.5 rounded-xl cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-60">
            {safetyLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating checklist...</> : <><ListChecks className="h-4 w-4" /> Generate Safety Audit Checklist</>}
          </button>
        </div>

        {!safetyResult && !safetyLoading && (
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-center border border-dashed border-white/10 rounded-2xl">
            <ListChecks className="h-7 w-7 text-white/20" />
            <p className="text-xs text-[#7c7268]">Pick a site type above to generate a safety checklist</p>
          </div>
        )}

        {safetyResult && (
          <div className="bg-[#14100b] border border-white/5 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.02]">
              <span className="text-[11px] uppercase font-bold text-[#c8c0b8] tracking-wider">Safety Audit Checklist</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f59e0b]/15 text-[#f59e0b]"><Sparkles className="h-3 w-3" /> AI Generated</span>
            </div>
            <div className="p-6 text-sm leading-relaxed font-mono whitespace-pre-wrap">
              {formatMd(safetyResult)}
            </div>
          </div>
        )}

        {/* Sub-section: PPE vision scan */}
        <div className="flex items-center gap-2 mt-4 pt-6 border-t border-white/5">
          <Camera className="h-4 w-4 text-[#f59e0b]" />
          <h4 className="text-xs font-extrabold text-[#faf8f5] uppercase tracking-wider">PPE Compliance Vision Scan</h4>
        </div>
        <p className="text-xs text-[#c8c0b8] leading-relaxed -mt-3">
          Upload a site photo to scan for PPE compliance (helmets, masks) — real computer-vision check, uses a YOLO model when one is installed and degrades to a safe heuristic otherwise.
        </p>
        <div className="form-card bg-[#0e0a07] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch">
            <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl p-8 hover:border-[#f59e0b]/50 transition-all cursor-pointer text-center">
              <Camera className="h-8 w-8 text-[#f59e0b] mb-2" />
              <span className="text-xs text-white font-semibold">
                {safetyImgFile ? safetyImgFile.name : "Click to select a site photo"}
              </span>
              {safetyImgFile ? (
                <span className="text-[10px] text-[#f59e0b] mt-1">{(safetyImgFile.size / 1024).toFixed(1)} KB</span>
              ) : (
                <span className="text-[10px] text-[#7c7268] mt-1">JPG, PNG — workers wearing helmets & masks</span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSafetyImgFile(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
            </label>
            {safetyImgFile && (
              <div className="w-full md:w-[140px] h-[140px] rounded-2xl overflow-hidden border border-white/10 shrink-0 bg-[#14100b]">
                <img src={URL.createObjectURL(safetyImgFile)} alt="Selected preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          <button onClick={() => handleSafetyDetect()} disabled={safetyImgLoading} className="btn w-full bg-gradient-to-r from-[#f59e0b] to-[#f97316] text-white font-semibold py-3.5 rounded-xl disabled:opacity-50 cursor-pointer inline-flex items-center justify-center gap-2">
            {safetyImgLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Scanning for PPE...</> : <><Camera className="h-4 w-4" /> Scan Photo for Safety Compliance</>}
          </button>
        </div>

        {safetyImgError && (
          <div className="flex items-start gap-3 bg-rose-500/10 border border-rose-500/25 rounded-2xl p-5 text-sm text-rose-400">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            {safetyImgError}
          </div>
        )}

        {!safetyImgResult && !safetyImgLoading && !safetyImgError && (
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-center border border-dashed border-white/10 rounded-2xl">
            <Camera className="h-7 w-7 text-white/20" />
            <p className="text-xs text-[#7c7268]">Upload a site photo above to run a PPE compliance scan</p>
          </div>
        )}

        {safetyImgResult && (
          <div className="bg-[#14100b] border border-white/5 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.02]">
              <span className="text-[11px] uppercase font-bold text-[#c8c0b8] tracking-wider">PPE Compliance Report</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f59e0b]/15 text-[#f59e0b]">AI Vision Scan</span>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${
                  safetyImgResult.status === "COMPLIANT" ? "bg-[#10b981]/10 text-[#6ee7b7] border-[#10b981]/25" :
                  safetyImgResult.status === "WARNING" ? "bg-[#f59e0b]/10 text-[#fdba74] border-[#f59e0b]/25" :
                  "bg-rose-500/10 text-rose-300 border-rose-500/25"
                }`}>
                  {safetyImgResult.status === "COMPLIANT" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                  {safetyImgResult.status} — {safetyImgResult.compliance_score}%
                </span>
                {!safetyImgResult.yolo_active && (
                  <span className="text-[10px] text-[#7c7268]">(heuristic mode — no YOLO weights installed)</span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <span className="text-[10px] uppercase font-bold text-[#7c7268]">Workers Detected</span>
                  <div className="text-xl font-black text-white mt-1">{safetyImgResult.workers_detected}</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <span className="text-[10px] uppercase font-bold text-[#7c7268]">Wearing Helmets</span>
                  <div className="text-xl font-black text-white mt-1">{safetyImgResult.wearing_helmets}</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <span className="text-[10px] uppercase font-bold text-[#7c7268]">Wearing Masks</span>
                  <div className="text-xl font-black text-white mt-1">{safetyImgResult.wearing_masks}</div>
                </div>
              </div>
              {safetyImgResult.violations && safetyImgResult.violations.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase font-bold text-[#7c7268]">Violations</span>
                  {safetyImgResult.violations.map((v: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-rose-300 bg-rose-500/5 border border-rose-500/15 rounded-lg px-3 py-2">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" /> {v}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    ),
    financials: (
      <div className="flex flex-col gap-6 max-w-[760px] animate-[fade_0.3s_ease]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Home Loan EMI */}
          <div className="bg-[#0e0a07] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider">Home Loan EMI</h4>
            <label className="text-[10px] text-[#c8c0b8] uppercase font-bold">Principal Amount (₹)</label>
            <input 
              type="number"
              value={emiPrincipal}
              onChange={(e) => setEmiPrincipal(Number(e.target.value))}
              className="w-full bg-[#14100b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            />
            <label className="text-[10px] text-[#c8c0b8] uppercase font-bold">Interest Rate (% p.a.)</label>
            <input 
              type="number"
              value={emiRate}
              onChange={(e) => setEmiRate(Number(e.target.value))}
              className="w-full bg-[#14100b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            />
            <label className="text-[10px] text-[#c8c0b8] uppercase font-bold">Tenure (Years)</label>
            <input 
              type="number"
              value={emiYears}
              onChange={(e) => setEmiYears(Number(e.target.value))}
              className="w-full bg-[#14100b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            />
            <button onClick={handleEMICalculate} className="btn bg-[#f59e0b]/20 text-[#f59e0b] text-xs font-semibold py-2 rounded-lg">Calculate EMI</button>

            {emiResult && (
              <div className="mt-3 bg-[#14100b] p-4 rounded-xl border border-white/5 text-xs text-[#c8c0b8] flex flex-col gap-1.5 font-mono">
                <div>EMI Amount: <strong className="text-[#f59e0b]">{emiResult.emi_str}</strong> / month</div>
                <div>Total Payable: {emiResult.total_str}</div>
                <div>Total Interest: {emiResult.total_interest}</div>
              </div>
            )}
          </div>

          {/* Rental ROI yield */}
          <div className="bg-[#0e0a07] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider">Gross Yield (ROI)</h4>
            <label className="text-[10px] text-[#c8c0b8] uppercase font-bold">Total Property Cost (₹)</label>
            <input 
              type="number"
              value={roiCost}
              onChange={(e) => setRoiCost(Number(e.target.value))}
              className="w-full bg-[#14100b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            />
            <label className="text-[10px] text-[#c8c0b8] uppercase font-bold">Expected Monthly Rent (₹)</label>
            <input 
              type="number"
              value={roiRent}
              onChange={(e) => setRoiRent(Number(e.target.value))}
              className="w-full bg-[#14100b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            />
            <button onClick={handleROICalculate} className="btn bg-[#f59e0b]/20 text-[#f59e0b] text-xs font-semibold py-2 rounded-lg">Calculate ROI</button>

            {roiResult && (
              <div className="mt-3 bg-[#14100b] p-4 rounded-xl border border-white/5 text-xs text-[#c8c0b8] flex flex-col gap-1.5 font-mono">
                <div>Annual rent: {roiResult.annual_rent}</div>
                <div>Gross Yield: <strong className="text-[#f59e0b]">{roiResult.gross_yield_pct}%</strong></div>
                <div>Payback: {roiResult.payback_years} Years</div>
                <div className="text-[#f59e0b] text-[10px] uppercase font-bold mt-1">{roiResult.verdict}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    sitedoc: (
      <div className="flex flex-col gap-6 max-w-[760px] animate-[fade_0.3s_ease]">
        <div className="tool-intro text-sm text-[#c8c0b8] leading-relaxed">
          Upload photo or scan site documents, delivery notes, or safety signs. The OCR extracts all readable text, and the AI classifies the document and highlights safety alerts.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Custom Upload */}
          <div className="form-card bg-[#0e0a07] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <label className="text-[11.5px] font-bold uppercase tracking-wider text-[#c8c0b8] mb-1.5 block">Upload Document Image</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSiteDocFile(e.target.files[0]);
                  }
                }}
                className="w-full bg-[#14100b] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#f59e0b] mb-4"
              />
              {siteDocFile && (
                <p className="text-xs text-[#f59e0b] font-semibold mb-4 truncate">
                  Selected: {siteDocFile.name} ({(siteDocFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>
            <button onClick={() => handleSiteDocOCR()} disabled={siteDocLoading} className="btn w-full bg-gradient-to-r from-[#f59e0b] to-[#f97316] text-white font-semibold py-3.5 rounded-xl cursor-pointer">
              {siteDocLoading ? <span className="flex items-center gap-2 justify-center"><Loader2 className="h-4 w-4 animate-spin" /> Performing OCR...</span> : "Analyze Document"}
            </button>
          </div>

          {/* Presets */}
          <div className="form-card bg-[#0e0a07] border border-white/5 rounded-2xl p-6 flex flex-col gap-3">
            <label className="text-[11.5px] font-bold uppercase tracking-wider text-[#c8c0b8] mb-1 block">Try Mock Samples</label>
            <button onClick={() => handleLoadMockSiteDoc("permit")} className="flex items-center justify-between text-left bg-[#14100b] hover:bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-white transition-all cursor-pointer">
              <div>
                <p className="font-bold">📝 Excavation Permit</p>
                <p className="text-[10px] text-[#c8c0b8] mt-0.5">Safety requirements & validation dates.</p>
              </div>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">Permit</span>
            </button>
            <button onClick={() => handleLoadMockSiteDoc("load_limit")} className="flex items-center justify-between text-left bg-[#14100b] hover:bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-white transition-all cursor-pointer">
              <div>
                <p className="font-bold">⚠️ Load Limit Sign</p>
                <p className="text-[10px] text-[#c8c0b8] mt-0.5">Maximum weight warnings on steel bridges.</p>
              </div>
              <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded">Signage</span>
            </button>
            <button onClick={() => handleLoadMockSiteDoc("delivery")} className="flex items-center justify-between text-left bg-[#14100b] hover:bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-white transition-all cursor-pointer">
              <div>
                <p className="font-bold">🚚 Ambuja Cement DN</p>
                <p className="text-[10px] text-[#c8c0b8] mt-0.5">Invoice scan tracking concrete delivery note.</p>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">Invoice</span>
            </button>
          </div>
        </div>

        {siteDocError && (
          <div className="bg-rose-500/10 border border-rose-500/25 rounded-2xl p-6 text-sm text-rose-400">
            {siteDocError}
          </div>
        )}

        {siteDocResult && (
          <div className="bg-[#14100b] border border-white/5 rounded-2xl p-6 flex flex-col gap-6">
            <div className="border-b border-white/5 pb-4">
              <h4 className="font-extrabold text-white text-base">Document Classification & Safety Insights</h4>
              <p className="text-xs text-[#c8c0b8] mt-1">Processed using local EasyOCR + LangGraph analysis</p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#7c7268]">Extracted Text (OCR)</span>
              <pre className="text-xs text-white whitespace-pre-wrap mt-1 bg-white/5 p-4 rounded-xl border border-white/5 leading-relaxed font-mono">
                {siteDocResult.raw_text}
              </pre>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#7c7268]">AI Safety Analysis Summary</span>
              <div className="text-sm text-[#c8c0b8] mt-1 bg-[#0e0a07] p-4 rounded-xl border border-white/5 leading-relaxed">
                {formatMd(siteDocResult.summary)}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  };

  return (
    <div className="app-shell flex min-h-screen">
      {/* Sidebar */}
      <aside className={`sidebar w-[255px] shrink-0 bg-[#0e0a07] border-r border-white/5 flex flex-col p-[18px_14px] fixed top-0 bottom-0 z-50 h-screen transition-transform duration-300 md:sticky ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="side-logo flex items-center gap-3 font-extrabold text-[15px] tracking-tight">
            <span className="logo-icon w-[34px] h-[34px] rounded-[10px] grid place-items-center text-white bg-gradient-to-br from-[#f59e0b] to-[#f97316] shadow-[0_6px_16px_rgba(245,158,11,0.3)]">
              <HardHat className="h-4 w-4" />
            </span>
            <span className="text-white">Breakdown<span className="text-[#f59e0b]">Factor</span></span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/50 hover:text-white transition-all cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="side-nav flex flex-col gap-1.5 flex-1">
          <button onClick={() => { setActivePanel("dashboard"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-semibold border-none cursor-pointer transition-all ${activePanel === "dashboard" ? "bg-[#f59e0b]/15 text-[#f59e0b]" : "text-[#c8c0b8] hover:bg-[#14100b] hover:text-white"}`}>
            <LayoutDashboard className="h-4 w-4" /> Dashboard Overview
          </button>

          <button onClick={() => { setActivePanel("copilot"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-semibold border-none cursor-pointer transition-all ${activePanel === "copilot" ? "bg-[#f59e0b]/15 text-[#f59e0b]" : "text-[#c8c0b8] hover:bg-[#14100b] hover:text-white"}`}>
            <Bot className="h-4 w-4" /> AI Copilot chat
          </button>

          <button onClick={() => { setActivePanel("boq"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-semibold border-none cursor-pointer transition-all ${activePanel === "boq" ? "bg-[#f59e0b]/15 text-[#f59e0b]" : "text-[#c8c0b8] hover:bg-[#14100b] hover:text-white"}`}>
            <Calculator className="h-4 w-4" /> Smart BOQ Estimator
          </button>

          <button onClick={() => { setActivePanel("defect"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-semibold border-none cursor-pointer transition-all ${activePanel === "defect" ? "bg-[#f59e0b]/15 text-[#f59e0b]" : "text-[#c8c0b8] hover:bg-[#14100b] hover:text-white"}`}>
            <ShieldCheck className="h-4 w-4" /> Defect scan logs
          </button>

          <button onClick={() => { setActivePanel("timeline"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-semibold border-none cursor-pointer transition-all ${activePanel === "timeline" ? "bg-[#f59e0b]/15 text-[#f59e0b]" : "text-[#c8c0b8] hover:bg-[#14100b] hover:text-white"}`}>
            <Calendar className="h-4 w-4" /> Timeline Schedulers
          </button>

          <button onClick={() => { setActivePanel("tender"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-semibold border-none cursor-pointer transition-all ${activePanel === "tender" ? "bg-[#f59e0b]/15 text-[#f59e0b]" : "text-[#c8c0b8] hover:bg-[#14100b] hover:text-white"}`}>
            <Briefcase className="h-4 w-4" /> Tender Proposal
          </button>

          <button onClick={() => { setActivePanel("safety"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-semibold border-none cursor-pointer transition-all ${activePanel === "safety" ? "bg-[#f59e0b]/15 text-[#f59e0b]" : "text-[#c8c0b8] hover:bg-[#14100b] hover:text-white"}`}>
            <HardHat className="h-4 w-4" /> Site Safety Auditing
          </button>

          <button onClick={() => { setActivePanel("financials"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-semibold border-none cursor-pointer transition-all ${activePanel === "financials" ? "bg-[#f59e0b]/15 text-[#f59e0b]" : "text-[#c8c0b8] hover:bg-[#14100b] hover:text-white"}`}>
            <Percent className="h-4 w-4" /> Loan EMI & Yield
          </button>

          <button onClick={() => { setActivePanel("sitedoc"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-semibold border-none cursor-pointer transition-all ${activePanel === "sitedoc" ? "bg-[#f59e0b]/15 text-[#f59e0b]" : "text-[#c8c0b8] hover:bg-[#14100b] hover:text-white"}`}>
            <FileText className="h-4 w-4" /> Site Signage & OCR
          </button>

          {historySessions.length > 0 && (
            <div className="flex flex-col gap-1 mt-4">
              <span className="text-[10px] text-[#7c7268] uppercase font-bold px-4 mb-1">Recent copilot chats</span>
              {historySessions.slice(0, 4).map(s => (
                <button 
                  key={s.session_id} 
                  onClick={() => handleSelectSession(s)}
                  className="flex items-center gap-2 text-left text-[11px] text-[#c8c0b8] hover:text-white px-4 py-1.5 rounded-lg border-none bg-transparent cursor-pointer line-clamp-1 w-full truncate"
                >
                  <BookMarked className="h-3 w-3 shrink-0" /> Session {s.session_id.substring(0, 6)}...
                </button>
              ))}
            </div>
          )}
        </nav>

        <div className="side-foot flex flex-col gap-3 pt-4 border-t border-white/5 mt-auto"><button onClick={() => setSettingsOpen(true)} className="nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-semibold border-none cursor-pointer transition-all text-[#8890aa] hover:bg-[#12121e] hover:text-white"> <Settings className="h-4 w-4" /> API Settings </button>
          <div className={`sysbadge flex items-center gap-2 text-[10.5px] font-mono rounded-lg border p-2.5 transition-all duration-300 ${
            llmEnabled ? "text-[#f59e0b] border-[#f59e0b]/30 bg-[#f59e0b]/5" : "text-[#7c7268] border-white/5 bg-[#14100b]"
          }`}>
            <i className={`fas fa-circle ${llmEnabled ? "text-[#f59e0b]" : "text-[#7c7268]"} text-[6px]`}></i>
            {llmEnabled ? "AI Core Active" : "Offline Sandbox"}
          </div>
          <Link href="/" className="side-back flex items-center gap-2 text-xs text-[#c8c0b8] hover:text-white py-1 transition-all">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to landing page
          </Link>
        </div>
      </aside>

      {/* Main Panel Area */}
      <div className="main flex-1 flex flex-col min-w-0">
        <header className="topbar sticky top-0 bg-[#060503]/95 backdrop-blur-md border-b border-white/5 z-20 flex items-center gap-4 px-6 md:px-12 py-4">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden w-10 h-10 rounded-lg bg-[#14100b] border border-white/10 flex items-center justify-center text-white cursor-pointer">
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-black text-white capitalize font-mono">{activePanel} Workspace</h1>
            <p className="text-xs text-[#c8c0b8] mt-0.5">Breakdown Factor Construction Workspace Portal</p>
          </div>
          <div className="ml-auto hidden md:block">
            <span className="prov-chip font-mono text-[11px] font-semibold text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/25 px-3 py-1.5 rounded-full">
              <Cpu className="h-3 w-3 inline mr-1.5" />
              {llmEnabled ? providerName : "Offline Core Engine"} · {ragBackend.split(" ")[0]} RAG
            </span>
          </div>
        </header>

        <main className="panels p-6 md:p-12 max-w-[1180px] w-full flex-1">
          {panels[activePanel]}
        </main>
      </div>

      {settingsOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d0f0e] border border-white/10 rounded-2xl p-6 max-w-md w-full flex flex-col gap-4 animate-[fade_0.2s_ease]">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Configure API Keys</h3>
              <button onClick={() => setSettingsOpen(false)} className="text-white/50 hover:text-white transition-all cursor-pointer bg-transparent border-none">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-col gap-3 text-xs text-[#9aa0b8]">
              <p>Keys are stored locally in your browser (localStorage) and sent only in the request headers.</p>
              <div>
                <label className="block mb-1 text-[10px] uppercase font-bold text-[#8890aa]">Groq API Key</label>
                <input type="password" value={groqKey} onChange={(e) => setGroqKey(e.target.value)} placeholder="gsk_..." className="w-full bg-[#12121e] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]" />
              </div>
              <div>
                <label className="block mb-1 text-[10px] uppercase font-bold text-[#8890aa]">Gemini API Key</label>
                <input type="password" value={geminiKey} onChange={(e) => setGeminiKey(e.target.value)} placeholder="AIzaSy..." className="w-full bg-[#12121e] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]" />
              </div>
              <div>
                <label className="block mb-1 text-[10px] uppercase font-bold text-[#8890aa]">OpenAI API Key</label>
                <input type="password" value={openaiKey} onChange={(e) => setOpenaiKey(e.target.value)} placeholder="sk-proj-..." className="w-full bg-[#12121e] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]" />
              </div>
              <div>
                <label className="block mb-1 text-[10px] uppercase font-bold text-[#8890aa]">SerpAPI Key</label>
                <input type="password" value={serpapiKey} onChange={(e) => setSerpapiKey(e.target.value)} placeholder="..." className="w-full bg-[#12121e] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]" />
              </div>
              <div>
                <label className="block mb-1 text-[10px] uppercase font-bold text-[#8890aa]">HuggingFace Token</label>
                <input type="password" value={huggingfaceKey} onChange={(e) => setHuggingfaceKey(e.target.value)} placeholder="hf_..." className="w-full bg-[#12121e] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]" />
              </div>
              <div>
                <label className="block mb-1 text-[10px] uppercase font-bold text-[#8890aa]">Mistral API Key</label>
                <input type="password" value={mistralKey} onChange={(e) => setMistralKey(e.target.value)} placeholder="..." className="w-full bg-[#12121e] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#6366f1]" />
              </div>
            </div>
            <div className="flex gap-3 justify-end border-t border-white/5 pt-4">
              <button onClick={() => setSettingsOpen(false)} className="btn bg-white/5 border border-white/10 text-xs text-white px-4 py-2 rounded-lg hover:bg-[#18182a] cursor-pointer">
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
              }} className="btn bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer border-none">
                Save & Reload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
