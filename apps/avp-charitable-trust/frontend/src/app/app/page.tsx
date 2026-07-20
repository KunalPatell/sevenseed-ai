"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Bot,
  Heart,
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
  Award,
  Users,
  UserPlus,
  HandCoins,
  Receipt,
  FileSpreadsheet,
  PhoneCall,
  Mic,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Settings
} from "lucide-react";

type PanelType = "dashboard" | "donor" | "needs" | "beneficiary" | "grant" | "volunteers" | "ledger" | "reporter" | "finance" | "emergency";

interface DonorSession {
  session_id: string;
  created_at: string;
  messages: { role: "user" | "ai"; text: string }[];
}

interface NeedsAssessment {
  id: number;
  created_at: string;
  location: string;
  population: string;
  issues: string;
  result: string;
}

interface BeneficiaryMatch {
  id: number;
  created_at: string;
  name: string;
  age: string;
  location: string;
  issues: string;
  result: string;
}

export default function NGOStatusHub() {
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

  // Program metrics
  const [programsList, setProgramsList] = useState<any[]>([]);
  const [impactMetrics, setImpactMetrics] = useState<any[]>([]);

  // Auth / Session simulation
  const [token, setToken] = useState<string>("");
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [authName, setAuthName] = useState("Corporate Sponsor");
  const [authEmail, setAuthEmail] = useState("csr@sponsor.com");
  const [authPassword, setAuthPassword] = useState("123456");
  const [authFeedback, setAuthFeedback] = useState("");

  // AI Donor chatbot
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "💚 Welcome to AVP Charitable Trust! I can help you understand our programs, how to volunteer, or how 80G tax exemptions apply to your donation." }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Needs Assessor
  const [needsLocation, setNeedsLocation] = useState("Mandal Village, Ahmedabad");
  const [needsPopulation, setNeedsPopulation] = useState("450 families");
  const [needsIssues, setNeedsIssues] = useState("Lack of clean water and computer education facilities");
  const [needsIncome, setNeedsIncome] = useState("low");
  const [needsResult, setNeedsResult] = useState("");
  const [needsLoading, setNeedsLoading] = useState(false);

  // Beneficiary Matcher
  const [benName, setBenName] = useState("Ramesh Solanki");
  const [benAge, setBenAge] = useState("19");
  const [benLocation, setBenLocation] = useState("Viramgam");
  const [benIssues, setBenIssues] = useState("Needs scholarship for AVPU technical courses");
  const [benIncome, setBenIncome] = useState("Under ₹1.5L p.a.");
  const [benResult, setBenResult] = useState("");
  const [benLoading, setBenLoading] = useState(false);

  // Grant Writer
  const [grantProg, setGrantProg] = useState("Gyan Sarovar rural digital literacy program");
  const [grantFunder, setGrantFunder] = useState("Reliance CSR Foundation");
  const [grantAmount, setGrantAmount] = useState("₹5,00,000");
  const [grantResult, setGrantResult] = useState("");
  const [grantLoading, setGrantLoading] = useState(false);

  // Volunteer Registry
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [volName, setVolName] = useState("");
  const [volEmail, setVolEmail] = useState("");
  const [volSkills, setVolSkills] = useState("Teaching/Mentorship");
  const [volAvail, setVolAvail] = useState("Weekends");

  // Donations Ledger & 80G
  const [donations, setDonations] = useState<any[]>([]);
  const [totalRaised, setTotalRaised] = useState(0);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorAmount, setDonorAmount] = useState(25000);
  const [donorPAN, setDonorPAN] = useState("ABCDE1234F");
  const [donorPurpose, setDonorPurpose] = useState("Scholarships Fund");
  const [receiptFeedback, setReceiptFeedback] = useState("");

  // Quarterly reporter
  const [reportPeriod, setReportPeriod] = useState("Q2 2026");
  const [reportResult, setReportResult] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  // Ask Your Data (finance/impact NL->SQL)
  const [financeQuestion, setFinanceQuestion] = useState("");
  const [financeResult, setFinanceResult] = useState<any>(null);
  const [financeLoading, setFinanceLoading] = useState(false);

  // Emergency Triage
  const [emergencyFile, setEmergencyFile] = useState<File | null>(null);
  const [emergencyResult, setEmergencyResult] = useState<any>(null);
  const [emergencyLoading, setEmergencyLoading] = useState(false);
  const [emergencyError, setEmergencyError] = useState("");

  // History tables
  const [historySessions, setHistorySessions] = useState<DonorSession[]>([]);
  const [historyNeeds, setHistoryNeeds] = useState<NeedsAssessment[]>([]);
  const [historyBeneficiaries, setHistoryBeneficiaries] = useState<BeneficiaryMatch[]>([]);

  useEffect(() => {
    loadHealthAndData();
    loadDbHistory();
    const savedToken = localStorage.getItem("trust_token");
    if (savedToken) {
      setToken(savedToken);
      fetchUser(savedToken);
    }
  }, []);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleFinanceAsk = async () => {
    if (!financeQuestion.trim() || financeLoading) return;
    setFinanceLoading(true);
    setFinanceResult(null);
    try {
      const res = await fetch("/api/tools/ask-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: financeQuestion })
      });
      const d = await res.json();
      if (res.ok && !d.error) {
        setFinanceResult(d);
      } else {
        setFinanceResult({ error: d.error || "Could not answer that question." });
      }
    } catch (e) {
      setFinanceResult({ error: "⚠️ Server offline. Please run the backend." });
    } finally {
      setFinanceLoading(false);
    }
  };

  const handleEmergencyUpload = async (fileToUpload?: File) => {
    const targetFile = fileToUpload || emergencyFile;
    if (!targetFile) {
      setEmergencyError("Please select or record an audio file first.");
      return;
    }
    setEmergencyLoading(true);
    setEmergencyError("");
    setEmergencyResult(null);
    try {
      const formData = new FormData();
      formData.append("file", targetFile);
      const res = await fetch("/api/tools/emergency-voice-prioritize", {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        const d = await res.json();
        setEmergencyResult(d);
      } else {
        const d = await res.json();
        setEmergencyError(d.error || "Failed to prioritize emergency call.");
      }
    } catch (e) {
      setEmergencyError("⚠️ Server offline. Please run the backend.");
    } finally {
      setEmergencyLoading(false);
    }
  };

  const handleLoadMockEmergency = (type: "flood" | "accident" | "donation") => {
    const dummyBlob = new Blob([" "], { type: "audio/wav" });
    const filename = `${type}_distress_sample.wav`;
    const dummyFile = new File([dummyBlob], filename, { type: "audio/wav" });
    setEmergencyFile(dummyFile);
    handleEmergencyUpload(dummyFile);
  };

  const loadHealthAndData = async () => {
    try {
      const hRes = await fetch("/api/health");
      if (hRes.ok) {
        const hData = await hRes.json();
        setLlmEnabled(hData.llm_enabled);
        setProviderName(hData.provider);
        setRagBackend(hData.rag_backend || "Vector RAG");
      }

      const pRes = await fetch("/api/programs");
      if (pRes.ok) {
        const pData = await pRes.json();
        setProgramsList(pData.programs || []);
        setImpactMetrics(pData.metrics || []);
      }
      fetchDonationsAndVolunteers();
    } catch (e) {
      setDbStatus("offline");
    }
  };

  const loadDbHistory = async () => {
    try {
      const sRes = await fetch("/api/history/donor");
      if (sRes.ok) {
        const sData = await sRes.json();
        setHistorySessions(sData.sessions || []);
      }

      const nRes = await fetch("/api/history/needs");
      if (nRes.ok) {
        const nData = await nRes.json();
        setHistoryNeeds(nData.needs || []);
      }

      const bRes = await fetch("/api/history/beneficiaries");
      if (bRes.ok) {
        const bData = await bRes.json();
        setHistoryBeneficiaries(bData.matches || []);
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

  const fetchDonationsAndVolunteers = async () => {
    try {
      const dRes = await fetch("/api/donations");
      if (dRes.ok) {
        const d = await dRes.json();
        setDonations(d.donations || []);
        setTotalRaised(d.total || 0);
      }

      const vRes = await fetch("/api/volunteers");
      if (vRes.ok) {
        const v = await vRes.json();
        setVolunteers(v.volunteers || []);
      }
    } catch (e) {}
  };

  // Auth operations
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
        localStorage.setItem("trust_token", d.token);
        setAuthFeedback("Donor account created!");
      }
    } catch (e) {
      setAuthFeedback("Authentication error.");
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
        localStorage.setItem("trust_token", d.token);
        setAuthFeedback("Welcome back!");
      }
    } catch (e) {
      setAuthFeedback("Authentication error.");
    }
  };

  const handleLogout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("trust_token");
    setAuthFeedback("");
  };

  // Chat send
  const handleDonorSend = async () => {
    const text = chatInput.trim();
    if (!text || chatLoading) return;
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", text }]);
    setChatLoading(true);

    const sid = activeSessionId || Math.random().toString(36).substring(2, 15);
    if (!activeSessionId) setActiveSessionId(sid);

    try {
      const res = await fetch("/api/donor", {
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

  const handleSelectSession = (session: DonorSession) => {
    setActiveSessionId(session.session_id);
    setChatMessages(session.messages.map(m => ({
      role: m.role,
      text: m.text
    })));
    setActivePanel("donor");
    setSidebarOpen(false);
  };

  const handleNewSession = () => {
    setActiveSessionId("");
    setChatMessages([
      { role: "ai", text: "💚 Welcome to AVP Charitable Trust! I can help you understand our programs, how to volunteer, or how 80G tax exemptions apply to your donation." }
    ]);
    setActivePanel("donor");
  };

  // Needs assessment
  const handleNeedsCalculate = async () => {
    if (!needsLocation.trim() || needsLoading) return;
    setNeedsLoading(true);
    setNeedsResult("");
    try {
      const res = await fetch("/api/needs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: needsLocation, population: needsPopulation, issues: needsIssues, income_level: needsIncome })
      });
      if (res.ok) {
        const d = await res.json();
        setNeedsResult(d.result || "");
        loadDbHistory();
      }
    } catch (e) {
    } finally {
      setNeedsLoading(false);
    }
  };

  // Beneficiary match
  const handleBeneficiaryMatch = async () => {
    if (!benName.trim() || benLoading) return;
    setBenLoading(true);
    setBenResult("");
    try {
      const res = await fetch("/api/beneficiary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: benName, age: benAge, location: benLocation, issues: benIssues, income: benIncome })
      });
      if (res.ok) {
        const d = await res.json();
        setBenResult(d.result || "");
        loadDbHistory();
      }
    } catch (e) {
    } finally {
      setBenLoading(false);
    }
  };

  // Grant writer
  const handleGrantWrite = async () => {
    if (!grantProg.trim() || grantLoading) return;
    setGrantLoading(true);
    setGrantResult("");
    try {
      const res = await fetch("/api/tools/grant-writer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ program: grantProg, funder: grantFunder, amount: grantAmount })
      });
      if (res.ok) {
        const d = await res.json();
        setGrantResult(d.result || "");
      }
    } catch (e) {
    } finally {
      setGrantLoading(false);
    }
  };

  // Volunteer registration
  const handleVolunteerSubmit = async () => {
    if (!volName.trim() || !volEmail.trim()) return;
    try {
      const res = await fetch("/api/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: volName, email: volEmail, skills: volSkills, availability: volAvail })
      });
      if (res.ok) {
        fetchDonationsAndVolunteers();
        setVolName("");
        setVolEmail("");
      }
    } catch (e) {}
  };

  // Ledger donation
  const handleDonationSubmit = async () => {
    if (!donorName.trim() || !donorAmount) return;
    setReceiptFeedback("Registering donation...");
    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donor: donorName, email: donorEmail, amount: donorAmount, pan: donorPAN, purpose: donorPurpose })
      });
      if (res.ok) {
        const d = await res.json();
        setReceiptFeedback(`Donation saved! 80G Receipt Number: ${d.receipt_no}`);
        fetchDonationsAndVolunteers();
        setDonorName("");
        setDonorEmail("");
      }
    } catch (e) {
      setReceiptFeedback("Donation ledger offline.");
    }
  };

  // Impact quarterly reporter
  const handleImpactReport = async () => {
    if (reportLoading) return;
    setReportLoading(true);
    setReportResult("");
    try {
      const res = await fetch("/api/impact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ period: reportPeriod })
      });
      if (res.ok) {
        const d = await res.json();
        setReportResult(d.report || "");
      }
    } catch (e) {
    } finally {
      setReportLoading(false);
    }
  };

  const formatMd = (s: string) => {
    return s
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .split("\n")
      .map((line, idx) => <span key={idx} className="block mt-1">{line}</span>);
  };

  const formatCurrency = (val: number) => "₹" + val.toLocaleString("en-IN");

  const panels = {
    dashboard: (
      <div className="flex flex-col gap-8 animate-[fade_0.3s_ease]">
        <div className="welcome bg-gradient-to-r from-[#f43f5e]/15 to-[#f59e0b]/5 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white font-mono">NGO Management Hub 🤝</h2>
            <p className="text-sm text-[#c8bdc0] mt-1 max-w-[620px]">
              Access public funding ledgers, register volunteers, check needs matching statistics, or generate donor receipts.
            </p>
          </div>
          <div className="text-center bg-white/[0.03] border border-white/5 rounded-2xl p-4 min-w-[140px]">
            <span className="text-[10px] text-[#7c7073] uppercase font-bold tracking-wider">CSR Funds Raised</span>
            <div className="text-2xl font-black text-[#f43f5e] mt-1">{formatCurrency(totalRaised)}</div>
          </div>
        </div>

        {/* CSR Donor Auth & Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-[#10080a] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
            <h4 className="font-extrabold text-[#faf5f6] text-sm uppercase tracking-wider">CSR Donor Account</h4>
            {user ? (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-[#c8bdc0]">Partner: <strong className="text-white">{user.name}</strong> ({user.email})</p>
                <button onClick={handleLogout} className="btn bg-white/5 border border-white/10 text-xs text-white py-2 rounded-lg hover:bg-white/10 mt-2">
                  Logout Session
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <input 
                  type="text" 
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="Company Name"
                  className="w-full bg-[#180b0f] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                />
                <input 
                  type="email" 
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="csr@sponsor.com"
                  className="w-full bg-[#180b0f] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                />
                <input 
                  type="password" 
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-[#180b0f] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                />
                <div className="flex gap-2">
                  <button onClick={handleLogin} className="btn bg-[#f43f5e]/20 text-[#f43f5e] text-xs font-semibold py-2 px-4 rounded-lg">Login</button>
                  <button onClick={handleSignup} className="btn bg-gradient-to-r from-[#f43f5e] to-[#f59e0b] text-white text-xs font-semibold py-2 px-4 rounded-lg">Register</button>
                </div>
                {authFeedback && <p className="text-[10px] text-[#f43f5e] font-semibold">{authFeedback}</p>}
              </div>
            )}
          </div>

          <div className="lg:col-span-7 bg-[#10080a] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
            <h4 className="font-extrabold text-[#faf5f6] text-sm uppercase tracking-wider">NGO Quick Indicators</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#180b0f] border border-white/5 rounded-xl p-4">
                <span className="text-[10px] text-[#7c7073] uppercase font-bold">Welfare divisions</span>
                <div className="text-lg font-bold text-white mt-1">3 active programs</div>
              </div>
              <div className="bg-[#180b0f] border border-white/5 rounded-xl p-4">
                <span className="text-[10px] text-[#7c7073] uppercase font-bold">Registered Volunteers</span>
                <div className="text-lg font-bold text-white mt-1">{volunteers.length} members</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic programs list */}
        {programsList.length > 0 && (
          <div className="flex flex-col gap-3">
            <h4 className="font-extrabold text-[#faf5f6] text-sm uppercase tracking-wider">NGO Welfare Programs ({programsList.length})</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {programsList.map((p, idx) => (
                <div key={idx} className="bg-[#180b0f] border border-white/5 rounded-2xl p-5">
                  <span className="text-[10px] text-[#f43f5e] font-mono font-bold uppercase">{p.beneficiary}</span>
                  <h5 className="font-bold text-white text-sm mt-1">{p.name}</h5>
                  <p className="text-xs text-[#c8bdc0] mt-2 leading-relaxed">District: {p.district}</p>
                  <p className="text-[10.5px] text-[#7c7073] mt-2 italic leading-normal">Eligible: {p.eligibility}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    ),
    donor: (
      <div className="chat-wrap flex flex-col h-[calc(100vh-170px)] max-w-[840px] animate-[fade_0.3s_ease]">
        <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-2">
          <span className="text-xs font-bold text-[#c8bdc0] uppercase">AI Donor Assistant</span>
          <button onClick={handleNewSession} className="btn bg-white/5 border border-white/10 text-xs text-white px-3 py-1.5 rounded-lg hover:bg-[#220f15]">
            + New Session
          </button>
        </div>

        <div ref={chatScrollRef} className="chat-scroll flex-1 overflow-y-auto flex flex-col gap-4 p-2">
          {chatMessages.map((m, i) => (
            <div key={i} className={`msg flex gap-3 max-w-[90%] ${m.role === "user" ? "self-end flex-row-reverse" : "self-start"}`}>
              <div className={`msg-ic w-[33px] h-[33px] rounded-lg flex items-center justify-center shrink-0 text-white ${
                m.role === "user" ? "bg-white/10" : "bg-gradient-to-br from-[#f43f5e] to-[#f59e0b]"
              }`}>
                {m.role === "user" ? <X className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={`msg-body text-sm px-4 py-3 rounded-2xl border ${
                m.role === "user" ? "bg-[#f43f5e]/10 border-[#f43f5e]/25" : "bg-[#180b0f] border-white/5"
              }`}>
                {formatMd(m.text)}
              </div>
            </div>
          ))}
          {chatLoading && (
            <div className="msg flex gap-3 self-start">
              <div className="msg-ic w-[33px] h-[33px] rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br from-[#f43f5e] to-[#f59e0b] text-white">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
              <div className="msg-body text-sm bg-[#180b0f] border border-white/5 px-4 py-3 rounded-2xl flex items-center gap-2">
                Consulting public RAG records...
              </div>
            </div>
          )}
        </div>

        <div className="chat-input flex gap-2 border-t border-white/5 pt-4 mt-2">
          <input 
            type="text" 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleDonorSend()}
            placeholder="Ask about 80G tax benefits, donations, or rural programs..." 
            className="flex-1 bg-[#10080a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f43f5e]"
          />
          <button onClick={handleDonorSend} className="btn bg-gradient-to-br from-[#f43f5e] to-[#f59e0b] text-white px-5 rounded-xl cursor-pointer">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    ),
    needs: (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-[fade_0.3s_ease]">
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4 bg-white/[0.02] border border-white/5 rounded-2xl p-5 backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--secondary)]/10 flex items-center justify-center shrink-0 border border-white/10">
              <Activity className="h-6 w-6 text-[var(--primary)]" />
            </div>
            <div>
              <h3 className="text-base font-black text-white font-mono">Needs Assessor</h3>
              <p className="text-xs text-[var(--text-2)] mt-1.5 leading-relaxed">Log regional NGO community needs assessment, identifying priority intervention sectors and custom RAG-matched budgets.</p>
            </div>
          </div>

          <div className="bg-[var(--bg-1)] border border-white/5 rounded-2xl p-6 flex flex-col gap-5 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-[var(--text-2)] tracking-wider block mb-2">District / Location</label>
                <input value={needsLocation} onChange={(e) => setNeedsLocation(e.target.value)} className="w-full bg-[var(--bg-2)] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[var(--primary)]/50" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[var(--text-2)] tracking-wider block mb-2">Estimated Population</label>
                <input value={needsPopulation} onChange={(e) => setNeedsPopulation(e.target.value)} className="w-full bg-[var(--bg-2)] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[var(--primary)]/50" />
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-[var(--text-2)] tracking-wider block mb-2">Household Income Level</label>
              <select
                value={needsIncome}
                onChange={(e) => setNeedsIncome(e.target.value)}
                className="w-full bg-[var(--bg-2)] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[var(--primary)]/50"
              >
                <option value="low">Low income</option>
                <option value="medium">Medium income</option>
                <option value="high">High income</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-[var(--text-2)] tracking-wider block mb-2">Main Community Issues</label>
              <input
                value={needsIssues}
                onChange={(e) => setNeedsIssues(e.target.value)}
                className="w-full bg-[var(--bg-2)] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[var(--primary)]/50"
              />
            </div>
            <button onClick={handleNeedsCalculate} disabled={needsLoading} className="btn w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-extrabold py-4 rounded-xl inline-flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(244,63,94,0.3)] hover:scale-[1.005] transition-all">
              {needsLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Running Assessment...</> : <><Activity className="h-4 w-4" /> Run Needs Assessment</>}
            </button>
          </div>
        </div>

        <div className="console-panel bg-[#10080a] border border-white/5 rounded-2xl p-6 min-h-[480px] flex flex-col shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
            <span className="text-xs font-bold text-[var(--text-2)] uppercase tracking-wider font-mono flex items-center gap-2"><Cpu className="h-4 w-4 text-[var(--primary)]" /> Needs Audit Console</span>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${needsLoading ? "bg-amber-500 animate-pulse" : "bg-emerald-500"} shadow-lg`}></span>
              <span className="text-[10px] uppercase text-[var(--text-3)] font-bold">{needsLoading ? "processing" : "ready"}</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            {needsLoading ? (
              <div className="flex flex-col items-center justify-center gap-3 text-[var(--text-2)] font-mono text-xs">
                <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
                <p>Auditing regional databases...</p>
              </div>
            ) : needsResult ? (
              <div className="flex flex-col gap-4 animate-[fade_0.3s_ease]">
                <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2 text-xs">
                  <span className="text-[10px] text-[var(--text-2)] uppercase font-bold tracking-wider">Assessment Matrix</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--primary)]/15 text-[var(--primary)] flex items-center gap-1"><Sparkles className="h-3 w-3" /> AI Generated</span>
                </div>
                <div className="bg-white/[0.01] border border-white/5 rounded-xl p-5 text-xs md:text-sm text-[var(--text-2)] leading-relaxed">{formatMd(needsResult)}</div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 text-[var(--text-3)]">
                <Activity className="h-10 w-10 opacity-20" />
                <p className="text-xs text-center max-w-[200px]">Fill location info and run needs assessment to display matching stats.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    beneficiary: (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-[fade_0.3s_ease]">
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4 bg-white/[0.02] border border-white/5 rounded-2xl p-5 backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--secondary)]/10 flex items-center justify-center shrink-0 border border-white/10">
              <Award className="h-6 w-6 text-[var(--primary)]" />
            </div>
            <div>
              <h3 className="text-base font-black text-white font-mono">Beneficiary Matcher</h3>
              <p className="text-xs text-[var(--text-2)] mt-1.5 leading-relaxed">Match a beneficiary profile against active NGO welfare divisions and verify eligibility instantly.</p>
            </div>
          </div>

          <div className="bg-[var(--bg-1)] border border-white/5 rounded-2xl p-6 flex flex-col gap-5 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-[var(--text-2)] tracking-wider block mb-2">Beneficiary Name</label>
                <input value={benName} onChange={(e) => setBenName(e.target.value)} className="w-full bg-[var(--bg-2)] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[var(--primary)]/50" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[var(--text-2)] tracking-wider block mb-2">Age</label>
                <input value={benAge} onChange={(e) => setBenAge(e.target.value)} className="w-full bg-[var(--bg-2)] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[var(--primary)]/50" />
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-[var(--text-2)] tracking-wider block mb-2">District / Location</label>
              <input value={benLocation} onChange={(e) => setBenLocation(e.target.value)} className="w-full bg-[var(--bg-2)] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[var(--primary)]/50" />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-[var(--text-2)] tracking-wider block mb-2">Specific Needs</label>
              <input value={benIssues} onChange={(e) => setBenIssues(e.target.value)} className="w-full bg-[var(--bg-2)] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[var(--primary)]/50" />
            </div>
            <button onClick={handleBeneficiaryMatch} disabled={benLoading} className="btn w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-extrabold py-4 rounded-xl inline-flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(244,63,94,0.3)] hover:scale-[1.005] transition-all">
              {benLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Matching...</> : <><Award className="h-4 w-4" /> Match Beneficiary Eligibility</>}
            </button>
          </div>
        </div>

        <div className="console-panel bg-[#10080a] border border-white/5 rounded-2xl p-6 min-h-[480px] flex flex-col shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
            <span className="text-xs font-bold text-[var(--text-2)] uppercase tracking-wider font-mono flex items-center gap-2"><Cpu className="h-4 w-4 text-[var(--primary)]" /> Match Eligibility Console</span>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${benLoading ? "bg-amber-500 animate-pulse" : "bg-emerald-500"} shadow-lg`}></span>
              <span className="text-[10px] uppercase text-[var(--text-3)] font-bold">{benLoading ? "processing" : "ready"}</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            {benLoading ? (
              <div className="flex flex-col items-center justify-center gap-3 text-[var(--text-2)] font-mono text-xs">
                <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
                <p>Auditing welfare eligibility...</p>
              </div>
            ) : benResult ? (
              <div className="flex flex-col gap-4 animate-[fade_0.3s_ease]">
                <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2 text-xs">
                  <span className="text-[10px] text-[var(--text-2)] uppercase font-bold tracking-wider">Match Log</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--primary)]/15 text-[var(--primary)] flex items-center gap-1"><Sparkles className="h-3 w-3" /> AI Generated</span>
                </div>
                <div className="bg-white/[0.01] border border-white/5 rounded-xl p-5 text-xs md:text-sm text-[var(--text-2)] leading-relaxed">{formatMd(benResult)}</div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 text-[var(--text-3)]">
                <Award className="h-10 w-10 opacity-20" />
                <p className="text-xs text-center max-w-[200px]">Fill demographic details on the left to verify active welfare alignment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    grant: (
      <div className="flex flex-col gap-6 max-w-[820px] animate-[fade_0.3s_ease]">
        <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--secondary)]/10 flex items-center justify-center shrink-0">
            <Briefcase className="h-5 w-5 text-[var(--primary)]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">CSR Grant Writer</h3>
            <p className="text-xs text-[var(--text-2)] mt-1 leading-relaxed">Draft a structured NGO grant proposal for corporate CSR sponsors and donors.</p>
          </div>
        </div>

        <div className="bg-[var(--bg-1)] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-[var(--text-2)] tracking-wider block mb-2">Program Objective</label>
            <input
              value={grantProg}
              onChange={(e) => setGrantProg(e.target.value)}
              className="w-full bg-[var(--bg-2)] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--primary)]/50"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-[var(--text-2)] tracking-wider block mb-2">Target Funder</label>
              <input
                value={grantFunder}
                onChange={(e) => setGrantFunder(e.target.value)}
                className="w-full bg-[var(--bg-2)] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--primary)]/50"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-[var(--text-2)] tracking-wider block mb-2">Funding Sought</label>
              <input
                value={grantAmount}
                onChange={(e) => setGrantAmount(e.target.value)}
                className="w-full bg-[var(--bg-2)] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--primary)]/50"
              />
            </div>
          </div>
          <button onClick={handleGrantWrite} disabled={grantLoading} className="btn w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold py-3.5 rounded-xl inline-flex items-center justify-center gap-2">
            {grantLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Drafting...</> : <><Sparkles className="h-4 w-4" /> Draft Grant Proposal</>}
          </button>
        </div>

        {!grantResult && !grantLoading && (
          <div className="flex flex-col items-center justify-center gap-3 py-14 text-[var(--text-3)] border border-dashed border-white/10 rounded-2xl">
            <Briefcase className="h-8 w-8 opacity-30" />
            <p className="text-xs">Fill the form above to draft a CSR grant proposal</p>
          </div>
        )}

        {grantResult && (
          <div className="bg-[var(--bg-2)] border border-white/5 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.02]">
              <span className="text-[11px] uppercase font-bold text-[var(--text-2)] tracking-wider">Grant Proposal Draft</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--primary)]/15 text-[var(--primary)]"><Sparkles className="h-2.5 w-2.5" /> AI Generated</span>
            </div>
            <div className="p-6 text-sm leading-relaxed font-mono whitespace-pre-wrap">{formatMd(grantResult)}</div>
          </div>
        )}
      </div>
    ),
    volunteers: (
      <div className="flex flex-col gap-6 max-w-[820px] animate-[fade_0.3s_ease]">
        <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--secondary)]/10 flex items-center justify-center shrink-0">
            <Users className="h-5 w-5 text-[var(--primary)]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Volunteers Hub</h3>
            <p className="text-xs text-[var(--text-2)] mt-1 leading-relaxed">Register as an NGO volunteer and browse the active volunteer roster.</p>
          </div>
        </div>

        <div className="bg-[var(--bg-1)] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-[var(--text-2)] tracking-wider block mb-2">Your Name</label>
              <input value={volName} onChange={(e) => setVolName(e.target.value)} className="w-full bg-[var(--bg-2)] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--primary)]/50" />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-[var(--text-2)] tracking-wider block mb-2">Your Email</label>
              <input type="email" value={volEmail} onChange={(e) => setVolEmail(e.target.value)} className="w-full bg-[var(--bg-2)] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--primary)]/50" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-[var(--text-2)] tracking-wider block mb-2">Skills</label>
              <input value={volSkills} onChange={(e) => setVolSkills(e.target.value)} placeholder="Teaching, Marketing, Medical..." className="w-full bg-[var(--bg-2)] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--primary)]/50" />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-[var(--text-2)] tracking-wider block mb-2">Availability</label>
              <input value={volAvail} onChange={(e) => setVolAvail(e.target.value)} placeholder="Weekends, Evenings..." className="w-full bg-[var(--bg-2)] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--primary)]/50" />
            </div>
          </div>
          <button onClick={handleVolunteerSubmit} className="btn w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold py-3.5 rounded-xl inline-flex items-center justify-center gap-2">
            <UserPlus className="h-4 w-4" /> Register as Volunteer
          </button>
        </div>

        {/* Volunteers list */}
        {volunteers.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-14 text-[var(--text-3)] border border-dashed border-white/10 rounded-2xl">
            <Users className="h-8 w-8 opacity-30" />
            <p className="text-xs">No volunteers registered yet — be the first to join</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h5 className="font-extrabold text-white text-xs uppercase tracking-wider">Volunteer Roster</h5>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--primary)]/15 text-[var(--primary)]">{volunteers.length} members</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {volunteers.map((vol, idx) => (
                <div key={idx} className="bg-[var(--bg-2)] border border-white/5 rounded-xl p-4 text-xs flex flex-col gap-2">
                  <div>
                    <strong className="text-white block text-sm">{vol.name}</strong>
                    <span className="text-[var(--text-2)]">{vol.email}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">{vol.skills}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--secondary)]/10 text-[var(--secondary)] border border-[var(--secondary)]/20">{vol.availability}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    ),
    ledger: (
      <div className="flex flex-col gap-6 max-w-[820px] animate-[fade_0.3s_ease]">
        <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--secondary)]/10 flex items-center justify-center shrink-0">
            <HandCoins className="h-5 w-5 text-[var(--primary)]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Donation Ledger</h3>
            <p className="text-xs text-[var(--text-2)] mt-1 leading-relaxed">The public NGO fund ledger — record donations and generate 80G tax-exemption receipts.</p>
          </div>
        </div>

        <div className="bg-[var(--bg-1)] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-[var(--text-2)] tracking-wider block mb-2">Donor Name</label>
              <input value={donorName} onChange={(e) => setDonorName(e.target.value)} className="w-full bg-[var(--bg-2)] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--primary)]/50" />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-[var(--text-2)] tracking-wider block mb-2">Donor Email</label>
              <input type="email" value={donorEmail} onChange={(e) => setDonorEmail(e.target.value)} className="w-full bg-[var(--bg-2)] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--primary)]/50" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-[var(--text-2)] tracking-wider block mb-2">Amount (₹)</label>
              <input type="number" value={donorAmount} onChange={(e) => setDonorAmount(Number(e.target.value))} className="w-full bg-[var(--bg-2)] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--primary)]/50" />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-[var(--text-2)] tracking-wider block mb-2">PAN (80G)</label>
              <input value={donorPAN} onChange={(e) => setDonorPAN(e.target.value)} className="w-full bg-[var(--bg-2)] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--primary)]/50" />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-[var(--text-2)] tracking-wider block mb-2">Purpose</label>
              <input value={donorPurpose} onChange={(e) => setDonorPurpose(e.target.value)} placeholder="General Fund, Scholarships..." className="w-full bg-[var(--bg-2)] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--primary)]/50" />
            </div>
          </div>
          <button onClick={handleDonationSubmit} className="btn w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold py-3.5 rounded-xl inline-flex items-center justify-center gap-2">
            <Receipt className="h-4 w-4" /> Record Donation
          </button>
          {receiptFeedback && (
            <p className={`text-xs font-semibold mt-1 inline-flex items-center gap-1.5 ${receiptFeedback.toLowerCase().includes("offline") ? "text-rose-400" : "text-[var(--secondary-l)]"}`}>
              {receiptFeedback.toLowerCase().includes("offline") ? <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> : <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />}
              {receiptFeedback}
            </p>
          )}
        </div>

        {/* Ledger entries list */}
        {donations.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-14 text-[var(--text-3)] border border-dashed border-white/10 rounded-2xl">
            <HandCoins className="h-8 w-8 opacity-30" />
            <p className="text-xs">No donations recorded yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h5 className="font-extrabold text-white text-xs uppercase tracking-wider">Public Donation Ledger</h5>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--primary)]/15 text-[var(--primary)]">{donations.length} entries</span>
            </div>
            <div className="flex flex-col gap-2">
              {donations.map((don, idx) => (
                <div key={idx} className="bg-[var(--bg-2)] border border-white/5 rounded-xl p-4 text-xs flex justify-between items-center">
                  <div>
                    <strong className="text-white block text-sm">{don.donor}</strong>
                    <span className="text-[var(--text-2)]">Receipt No: AVP-80G-{(don.id || idx + 1).toString().padStart(5, '0')}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[var(--primary)] font-black block">{formatCurrency(don.amount)}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--secondary)]/10 text-[var(--secondary)] border border-[var(--secondary)]/20 mt-1 inline-block">{don.purpose}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    ),
    reporter: (
      <div className="flex flex-col gap-6 max-w-[820px] animate-[fade_0.3s_ease]">
        <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--secondary)]/10 flex items-center justify-center shrink-0">
            <FileSpreadsheet className="h-5 w-5 text-[var(--primary)]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Quarterly Reporter</h3>
            <p className="text-xs text-[var(--text-2)] mt-1 leading-relaxed">Produce a print-ready PDF/HTML NGO impact review log for the selected quarter.</p>
          </div>
        </div>

        <div className="bg-[var(--bg-1)] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-[var(--text-2)] tracking-wider block mb-2">Reporting Period</label>
            <select
              value={reportPeriod}
              onChange={(e) => setReportPeriod(e.target.value)}
              className="w-full bg-[var(--bg-2)] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--primary)]/50"
            >
              <option value="Q1 2026">Q1 2026</option>
              <option value="Q2 2026">Q2 2026</option>
              <option value="Q3 2026">Q3 2026</option>
              <option value="Q4 2026">Q4 2026</option>
            </select>
          </div>
          <button onClick={handleImpactReport} disabled={reportLoading} className="btn w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold py-3.5 rounded-xl inline-flex items-center justify-center gap-2">
            {reportLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</> : <><FileSpreadsheet className="h-4 w-4" /> Generate Quarterly Impact Report</>}
          </button>
        </div>

        {!reportResult && !reportLoading && (
          <div className="flex flex-col items-center justify-center gap-3 py-14 text-[var(--text-3)] border border-dashed border-white/10 rounded-2xl">
            <FileSpreadsheet className="h-8 w-8 opacity-30" />
            <p className="text-xs">Select a period above to generate the impact report</p>
          </div>
        )}

        {reportResult && (
          <div className="bg-[var(--bg-2)] border border-white/5 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.02]">
              <span className="text-[11px] uppercase font-bold text-[var(--text-2)] tracking-wider">Impact Report · {reportPeriod}</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--primary)]/15 text-[var(--primary)]"><Sparkles className="h-2.5 w-2.5" /> AI Generated</span>
            </div>
            <div className="p-6 text-sm leading-relaxed font-mono whitespace-pre-wrap">{formatMd(reportResult)}</div>
          </div>
        )}
      </div>
    ),
    finance: (
      <div className="flex flex-col gap-6 max-w-[860px] animate-[fade_0.3s_ease]">
        <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--secondary)]/10 flex items-center justify-center shrink-0">
            <Search className="h-5 w-5 text-[var(--primary)]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Ask Your Data</h3>
            <p className="text-xs text-[var(--text-2)] mt-1 leading-relaxed">Ask plain-English questions about donations, donors, beneficiaries, and volunteers — answered with real SQL against your data, not a guess.</p>
          </div>
        </div>

        <div className="bg-[var(--bg-1)] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-[var(--text-2)] tracking-wider block mb-2">Question</label>
            <input
              value={financeQuestion}
              onChange={(e) => setFinanceQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFinanceAsk()}
              placeholder="e.g. How much have we raised this quarter? How many beneficiaries in Ahmedabad?"
              className="w-full bg-[var(--bg-2)] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--primary)]/50"
            />
          </div>
          <button onClick={handleFinanceAsk} disabled={financeLoading} className="btn w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold py-3.5 rounded-xl disabled:opacity-50 inline-flex items-center justify-center gap-2">
            {financeLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Querying...</> : <><Search className="h-4 w-4" /> Ask Your Data</>}
          </button>
        </div>

        {!financeResult && !financeLoading && (
          <div className="flex flex-col items-center justify-center gap-3 py-14 text-[var(--text-3)] border border-dashed border-white/10 rounded-2xl">
            <Search className="h-8 w-8 opacity-30" />
            <p className="text-xs">Ask a question above to query your live data</p>
          </div>
        )}

        {financeResult && (
          financeResult.error ? (
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/25 rounded-2xl p-5 text-sm text-rose-400">
              <AlertTriangle className="h-4 w-4 shrink-0" /> {financeResult.error}
            </div>
          ) : (
            <div className="bg-[var(--bg-2)] border border-white/5 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.02]">
                <span className="text-[11px] uppercase font-bold text-[var(--text-2)] tracking-wider">Query Result</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--primary)]/15 text-[var(--primary)]"><Sparkles className="h-2.5 w-2.5" /> AI Generated</span>
              </div>
              <div className="p-6 flex flex-col gap-4">
                {financeResult.summary && <div className="text-sm text-white leading-relaxed">{financeResult.summary}</div>}
                {financeResult.sql && <div className="text-[11px] text-[var(--text-2)] font-mono bg-[var(--bg-1)] border border-white/5 rounded-lg p-3 overflow-x-auto">{financeResult.sql}</div>}
                {Array.isArray(financeResult.rows) && financeResult.rows.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-bold text-[var(--text-2)] tracking-wider">Result rows</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--secondary)]/10 text-[var(--secondary)] border border-[var(--secondary)]/20">{financeResult.rows.length} rows</span>
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-white/5">
                      <table className="w-full text-xs border-collapse">
                        <thead>
                          <tr className="bg-white/[0.02]">
                            {Object.keys(financeResult.rows[0]).map(col => (
                              <th key={col} className="text-left text-[var(--text-2)] uppercase font-bold px-3 py-2 border-b border-white/10 tracking-wider">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {financeResult.rows.slice(0, 25).map((row: any, idx: number) => (
                            <tr key={idx} className="border-b border-white/5 last:border-b-0">
                              {Object.keys(row).map(col => (
                                <td key={col} className="px-3 py-2 text-white">{String(row[col])}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </div>
    ),
    emergency: (
      <div className="flex flex-col gap-6 max-w-[860px] animate-[fade_0.3s_ease]">
        <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--secondary)]/10 flex items-center justify-center shrink-0">
            <PhoneCall className="h-5 w-5 text-[var(--primary)]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Emergency Triage</h3>
            <p className="text-xs text-[var(--text-2)] mt-1 leading-relaxed">Triage incoming emergency calls or incident voice clips. The system transcribes the audio, ranks urgency from 0 to 5, classifies the category, and outlines an immediate action plan.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Custom File Upload */}
          <div className="bg-[var(--bg-1)] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <label className="text-[10px] uppercase font-bold text-[var(--text-2)] tracking-wider mb-2 flex items-center gap-1.5"><Mic className="h-3 w-3" /> Upload Audio Clip</label>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setEmergencyFile(e.target.files[0]);
                  }
                }}
                className="w-full bg-[var(--bg-2)] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--primary)]/50 mb-4"
              />
              {emergencyFile && (
                <p className="text-xs text-[var(--primary)] font-semibold mb-4 truncate">
                  Selected: {emergencyFile.name} ({(emergencyFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>
            <button onClick={() => handleEmergencyUpload()} disabled={emergencyLoading} className="btn w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold py-3.5 rounded-xl inline-flex items-center justify-center gap-2">
              {emergencyLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing Audio...</> : <><PhoneCall className="h-4 w-4" /> Analyze Audio</>}
            </button>
          </div>

          {/* Preset Mock Scenarios */}
          <div className="bg-[var(--bg-1)] border border-white/5 rounded-2xl p-6 flex flex-col gap-3">
            <label className="text-[10px] uppercase font-bold text-[var(--text-2)] tracking-wider block mb-1">Try Mock Voice Scenarios</label>
            <button onClick={() => handleLoadMockEmergency("flood")} className="flex items-center justify-between text-left bg-[var(--bg-2)] hover:bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-white transition-all cursor-pointer">
              <div>
                <p className="font-bold">🌊 Flood Distress Call</p>
                <p className="text-[10px] text-[var(--text-2)] mt-0.5">High water level, family stranded on roof.</p>
              </div>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold shrink-0">Level 3</span>
            </button>
            <button onClick={() => handleLoadMockEmergency("accident")} className="flex items-center justify-between text-left bg-[var(--bg-2)] hover:bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-white transition-all cursor-pointer">
              <div>
                <p className="font-bold">🚑 Severe Road Accident</p>
                <p className="text-[10px] text-[var(--text-2)] mt-0.5">Injured pedestrian, bleeding head wound.</p>
              </div>
              <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full font-bold shrink-0">Level 4</span>
            </button>
            <button onClick={() => handleLoadMockEmergency("donation")} className="flex items-center justify-between text-left bg-[var(--bg-2)] hover:bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-white transition-all cursor-pointer">
              <div>
                <p className="font-bold">🤝 CSR Blanket Donation Offer</p>
                <p className="text-[10px] text-[var(--text-2)] mt-0.5">Inquiry about supply donations for camps.</p>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold shrink-0">Level 0</span>
            </button>
          </div>
        </div>

        {emergencyError && (
          <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/25 rounded-2xl p-5 text-sm text-rose-400">
            <AlertTriangle className="h-4 w-4 shrink-0" /> {emergencyError}
          </div>
        )}

        {!emergencyResult && !emergencyLoading && !emergencyError && (
          <div className="flex flex-col items-center justify-center gap-3 py-14 text-[var(--text-3)] border border-dashed border-white/10 rounded-2xl">
            <PhoneCall className="h-8 w-8 opacity-30" />
            <p className="text-xs">Upload an audio clip or try a mock scenario to triage an emergency</p>
          </div>
        )}

        {emergencyResult && (
          <div className="bg-[var(--bg-2)] border border-white/5 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.02]">
              <span className="text-[11px] uppercase font-bold text-[var(--text-2)] tracking-wider">Emergency Assessment Report</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--primary)]/15 text-[var(--primary)]"><Sparkles className="h-2.5 w-2.5" /> AI Generated</span>
            </div>
            <div className="p-6 flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="bg-[var(--primary)]/15 text-[var(--primary)] border border-[var(--primary)]/25 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit">
                  {emergencyResult.category || "General"}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--text-2)] font-bold">Urgency Score:</span>
                  <span className={`text-2xl font-black px-3 py-1.5 rounded-xl ${
                    emergencyResult.urgency_rating >= 4 ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" :
                    emergencyResult.urgency_rating >= 2 ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                    "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  }`}>
                    {emergencyResult.urgency_rating}/5
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--text-3)]">Transcribed Text</span>
                <p className="text-sm text-white italic mt-1 bg-white/5 p-4 rounded-xl border border-white/5">
                  "{emergencyResult.transcript || 'No text transcribed.'}"
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--text-3)]">Incident Summary</span>
                <p className="text-sm text-[var(--text-2)] mt-1 bg-[var(--bg-1)] p-4 rounded-xl border border-white/5 leading-relaxed">
                  {emergencyResult.summary || 'Summary unavailable.'}
                </p>
              </div>

              {emergencyResult.fallback_used && (
                <p className="text-[11px] text-[var(--secondary)] italic">
                  * Note: Speech recognition was offline. Triage was computed using keyword heuristics based on the sample file.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    )
  };

  return (
    <div className="app-shell flex min-h-screen">
      {/* Sidebar */}
      <aside className={`sidebar w-[255px] shrink-0 bg-[#10080a] border-r border-white/5 flex flex-col p-[18px_14px] fixed top-0 bottom-0 z-50 h-screen transition-transform duration-300 md:sticky ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="side-logo flex items-center gap-3 font-extrabold text-[15px] tracking-tight">
            <span className="logo-icon w-[34px] h-[34px] rounded-[10px] grid place-items-center text-white bg-gradient-to-br from-[#f43f5e] to-[#f59e0b] shadow-[0_6px_16px_rgba(244,63,94,0.3)]">
              <Heart className="h-4 w-4 fill-current" />
            </span>
            <span className="text-white">AVP<span className="text-[#f43f5e]">Trust</span></span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/50 hover:text-white transition-all cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="side-nav flex flex-col gap-1.5 flex-1">
          <button onClick={() => { setActivePanel("dashboard"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-semibold border-none cursor-pointer transition-all ${activePanel === "dashboard" ? "bg-[#f43f5e]/15 text-[#f43f5e]" : "text-[#c8bdc0] hover:bg-[#180b0f] hover:text-white"}`}>
            <LayoutDashboard className="h-4 w-4" /> Dashboard Overview
          </button>

          <button onClick={() => { setActivePanel("donor"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-semibold border-none cursor-pointer transition-all ${activePanel === "donor" ? "bg-[#f43f5e]/15 text-[#f43f5e]" : "text-[#c8bdc0] hover:bg-[#180b0f] hover:text-white"}`}>
            <Bot className="h-4 w-4" /> AI Donor Assistant
          </button>

          <button onClick={() => { setActivePanel("needs"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-semibold border-none cursor-pointer transition-all ${activePanel === "needs" ? "bg-[#f43f5e]/15 text-[#f43f5e]" : "text-[#c8bdc0] hover:bg-[#180b0f] hover:text-white"}`}>
            <Activity className="h-4 w-4" /> Needs Assessor
          </button>

          <button onClick={() => { setActivePanel("beneficiary"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-semibold border-none cursor-pointer transition-all ${activePanel === "beneficiary" ? "bg-[#f43f5e]/15 text-[#f43f5e]" : "text-[#c8bdc0] hover:bg-[#180b0f] hover:text-white"}`}>
            <Award className="h-4 w-4" /> Beneficiary Matcher
          </button>

          <button onClick={() => { setActivePanel("grant"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-semibold border-none cursor-pointer transition-all ${activePanel === "grant" ? "bg-[#f43f5e]/15 text-[#f43f5e]" : "text-[#c8bdc0] hover:bg-[#180b0f] hover:text-white"}`}>
            <Briefcase className="h-4 w-4" /> CSR Grant Writer
          </button>

          <button onClick={() => { setActivePanel("volunteers"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-semibold border-none cursor-pointer transition-all ${activePanel === "volunteers" ? "bg-[#f43f5e]/15 text-[#f43f5e]" : "text-[#c8bdc0] hover:bg-[#180b0f] hover:text-white"}`}>
            <Users className="h-4 w-4" /> Volunteers Hub
          </button>

          <button onClick={() => { setActivePanel("ledger"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-semibold border-none cursor-pointer transition-all ${activePanel === "ledger" ? "bg-[#f43f5e]/15 text-[#f43f5e]" : "text-[#c8bdc0] hover:bg-[#180b0f] hover:text-white"}`}>
            <HandCoins className="h-4 w-4" /> Donation Ledger
          </button>

          <button onClick={() => { setActivePanel("reporter"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-semibold border-none cursor-pointer transition-all ${activePanel === "reporter" ? "bg-[#f43f5e]/15 text-[#f43f5e]" : "text-[#c8bdc0] hover:bg-[#180b0f] hover:text-white"}`}>
            <FileSpreadsheet className="h-4 w-4" /> Quarterly Reporter
          </button>

          <button onClick={() => { setActivePanel("finance"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-semibold border-none cursor-pointer transition-all ${activePanel === "finance" ? "bg-[#f43f5e]/15 text-[#f43f5e]" : "text-[#c8bdc0] hover:bg-[#180b0f] hover:text-white"}`}>
            <HandCoins className="h-4 w-4" /> Ask Your Data
          </button>

          <button onClick={() => { setActivePanel("emergency"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-semibold border-none cursor-pointer transition-all ${activePanel === "emergency" ? "bg-[#f43f5e]/15 text-[#f43f5e]" : "text-[#c8bdc0] hover:bg-[#180b0f] hover:text-white"}`}>
            <PhoneCall className="h-4 w-4" /> Emergency Triage
          </button>

          {historySessions.length > 0 && (
            <div className="flex flex-col gap-1 mt-4">
              <span className="text-[10px] text-[#7c7073] uppercase font-bold px-4 mb-1">Recent conversations</span>
              {historySessions.slice(0, 4).map(s => (
                <button 
                  key={s.session_id} 
                  onClick={() => handleSelectSession(s)}
                  className="flex items-center gap-2 text-left text-[11px] text-[#c8bdc0] hover:text-white px-4 py-1.5 rounded-lg border-none bg-transparent cursor-pointer line-clamp-1 w-full truncate"
                >
                  <BookMarked className="h-3 w-3 shrink-0" /> Chat {s.session_id.substring(0, 6)}...
                </button>
              ))}
            </div>
          )}
        </nav>

        <div className="side-foot flex flex-col gap-3 pt-4 border-t border-white/5 mt-auto"><button onClick={() => setSettingsOpen(true)} className="nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-semibold border-none cursor-pointer transition-all text-[#8890aa] hover:bg-[#12121e] hover:text-white"> <Settings className="h-4 w-4" /> API Settings </button>
          <div className={`sysbadge flex items-center gap-2 text-[10.5px] font-mono rounded-lg border p-2.5 transition-all duration-300 ${
            llmEnabled ? "text-[#f43f5e] border-[#f43f5e]/30 bg-[#f43f5e]/5" : "text-[#7c7073] border-white/5 bg-[#180b0f]"
          }`}>
            <i className={`fas fa-circle ${llmEnabled ? "text-[#f43f5e]" : "text-[#7c7073]"} text-[6px]`}></i>
            {llmEnabled ? "Donor Assistant Ready" : "Local Sandbox"}
          </div>
          <Link href="/" className="side-back flex items-center gap-2 text-xs text-[#c8bdc0] hover:text-white py-1 transition-all">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to landing page
          </Link>
        </div>
      </aside>

      {/* Main Panel Area */}
      <div className="main flex-1 flex flex-col min-w-0">
        <header className="topbar sticky top-0 bg-[#070405]/95 backdrop-blur-md border-b border-white/5 z-20 flex items-center gap-4 px-6 md:px-12 py-4">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden w-10 h-10 rounded-lg bg-[#180b0f] border border-white/10 flex items-center justify-center text-white cursor-pointer">
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-black text-white capitalize font-mono">{activePanel} Workspace</h1>
            <p className="text-xs text-[#c8bdc0] mt-0.5">AVP Charitable Trust Dashboard Workspace Portal</p>
          </div>
          <div className="ml-auto hidden md:block">
            <span className="prov-chip font-mono text-[11px] font-semibold text-[#f43f5e] bg-[#f43f5e]/10 border border-[#f43f5e]/25 px-3 py-1.5 rounded-full">
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
