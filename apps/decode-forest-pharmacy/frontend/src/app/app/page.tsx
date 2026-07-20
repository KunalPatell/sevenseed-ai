"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Bot,
  FileText,
  AlertTriangle,
  Pill,
  Calendar,
  Stethoscope,
  Search,
  Menu,
  X,
  Send,
  Loader2,
  Trash2,
  Bell,
  ArrowLeft,
  ChevronDown,
  Cpu,
  MapPin,
  HeartPulse,
  Shield,
  Phone,
  ClipboardList,
  ShieldAlert,
  Sparkles,
  Building2
} from "lucide-react";

type PanelType = "dashboard" | "assistant" | "prescription" | "interactions" | "substitutes" | "refill" | "symptoms" | "medicines" | "hospitals" | "camps" | "schemes";

interface Medicine {
  name: string;
  generic: string;
  brand: string;
  category: string;
  use: string;
  dose: string;
  side_effects: string;
  avoid: string;
  price_inr: string;
}

interface RefillRecord {
  id: number;
  created_at: string;
  medicine: string;
  quantity: number;
  dose_per_day: number;
  start_date: string;
  refill_date: string;
  reminder_date: string;
}

interface PrescriptionRecord {
  id: number;
  created_at: string;
  text: string;
  result: string;
}

interface InteractionRecord {
  id: number;
  created_at: string;
  drugs: string[];
  result: string;
}

export default function AppPortal() {
  const [activePanel, setActivePanel] = useState<PanelType>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [llmEnabled, setLlmEnabled] = useState(false);
  const [providerName, setProviderName] = useState("Offline AI");
  const [ragBackend, setRagBackend] = useState("token-overlap");
  const [dbStatus, setDbStatus] = useState("connected");
  
  // Counts from health
  const [medCount, setMedCount] = useState(0);
  const [intCount, setIntCount] = useState(0);
  const [topicCount, setTopicCount] = useState(0);

  // Lists
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Medicine[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Db lists
  const [refills, setRefills] = useState<RefillRecord[]>([]);
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>([]);
  const [interactionsHistory, setInteractionsHistory] = useState<InteractionRecord[]>([]);

  // Chat
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "👋 Hi! I'm the Decode Forest AI Health Assistant. Ask me about any medicine, drug interaction, symptom, or health topic." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Prescription Reader
  const [rxInput, setRxInput] = useState("");
  const [rxResult, setRxResult] = useState("");
  const [rxLoading, setRxLoading] = useState(false);

  // Hospital Locator
  const [hospitalCity, setHospitalCity] = useState("Ahmedabad");
  const [hospitalRadius, setHospitalRadius] = useState(10);
  const [hospitalResults, setHospitalResults] = useState<any[]>([]);
  const [hospitalLoading, setHospitalLoading] = useState(false);
  const [hospitalError, setHospitalError] = useState("");

  // Camps and Schemes
  const [camps, setCamps] = useState<any[]>([]);
  const [campQuery, setCampQuery] = useState("");
  const [campLoading, setCampLoading] = useState(false);
  const [schemes, setSchemes] = useState<any[]>([]);
  const [schemeQuery, setSchemeQuery] = useState("");
  const [schemeLoading, setSchemeLoading] = useState(false);

  // Drug Interactions
  const [drugChips, setDrugChips] = useState<string[]>([]);
  const [drugInput, setDrugInput] = useState("");
  const [interactResult, setInteractResult] = useState("");
  const [interactLoading, setInteractLoading] = useState(false);

  // Substitutes
  const [subInput, setSubInput] = useState("");
  const [subResult, setSubResult] = useState("");
  const [subLoading, setSubLoading] = useState(false);

  // Refill Form
  const [refillMed, setRefillMed] = useState("");
  const [refillQty, setRefillQty] = useState(30);
  const [refillDose, setRefillDose] = useState(1);
  const [refillDate, setRefillDate] = useState("");
  const [refillResult, setRefillResult] = useState<any>(null);
  const [refillLoading, setRefillLoading] = useState(false);

  // Symptom Guide
  const [symptomInput, setSymptomInput] = useState("");
  const [symptomResult, setSymptomResult] = useState("");
  const [symptomLoading, setSymptomLoading] = useState(false);

  // Set default date
  useEffect(() => {
    setRefillDate(new Date().toISOString().slice(0, 10));
    loadHealthAndData();
    loadAllMedicines();
    loadDbHistory();
  }, []);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const loadHealthAndData = async () => {
    try {
      const res = await fetch("/api/health");
      if (res.ok) {
        const d = await res.json();
        setLlmEnabled(d.llm_enabled);
        setProviderName(d.provider);
        setRagBackend(d.rag_backend);
        setMedCount(d.counts?.medicines || 0);
        setIntCount(d.counts?.interactions || 0);
        setTopicCount(d.counts?.health_topics || 0);
      }
    } catch (e) {
      setDbStatus("offline");
    }
  };

  const loadAllMedicines = async () => {
    try {
      const res = await fetch("/api/medicines");
      if (res.ok) {
        const d = await res.json();
        setMedicines(d.medicines || []);
        setSearchResults(d.medicines || []);
      }
    } catch (e) {}
  };

  const loadDbHistory = async () => {
    try {
      const rRes = await fetch("/api/refills");
      if (rRes.ok) {
        const rData = await rRes.json();
        setRefills(rData.refills || []);
      }

      const pRes = await fetch("/api/prescriptions");
      if (pRes.ok) {
        const pData = await pRes.json();
        setPrescriptions(pData.prescriptions || []);
      }

      const iRes = await fetch("/api/interactions-history");
      if (iRes.ok) {
        const iData = await iRes.json();
        setInteractionsHistory(iData.interactions || []);
      }
    } catch (e) {}
  };

  // Actions
  const handleChatSend = async () => {
    const msg = chatInput.trim();
    if (!msg || chatLoading) return;
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", text: msg }]);
    setChatLoading(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, session_id: sessionId })
      });
      if (res.ok) {
        const d = await res.json();
        setChatMessages(prev => [...prev, { role: "ai", text: d.reply }]);
        setSessionId(d.session_id);
      } else {
        setChatMessages(prev => [...prev, { role: "ai", text: "⚠️ Error communicating with AI server." }]);
      }
    } catch (e) {
      setChatMessages(prev => [...prev, { role: "ai", text: "⚠️ Server offline. Please run the backend." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handlePrescriptionRead = async () => {
    if (!rxInput.trim() || rxLoading) return;
    setRxLoading(true);
    setRxResult("");
    try {
      const res = await fetch("/api/prescription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: rxInput })
      });
      if (res.ok) {
        const d = await res.json();
        setRxResult(d.result);
        loadDbHistory();
      }
    } catch (e) {
      setRxResult("⚠️ Failed to parse prescription.");
    } finally {
      setRxLoading(false);
    }
  };

  const handleInteractionCheck = async () => {
    if (drugChips.length < 2 || interactLoading) return;
    setInteractLoading(true);
    setInteractResult("");
    try {
      const res = await fetch("/api/interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drugs: drugChips })
      });
      if (res.ok) {
        const d = await res.json();
        setInteractResult(d.result);
        loadDbHistory();
      }
    } catch (e) {
      setInteractResult("⚠️ Failed to check interactions.");
    } finally {
      setInteractLoading(false);
    }
  };

  const handleSubstitutes = async () => {
    if (!subInput.trim() || subLoading) return;
    setSubLoading(true);
    setSubResult("");
    try {
      const res = await fetch("/api/substitutes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicine: subInput })
      });
      if (res.ok) {
        const d = await res.json();
        setSubResult(d.result);
      }
    } catch (e) {
      setSubResult("⚠️ Failed to load substitutes.");
    } finally {
      setSubLoading(false);
    }
  };

  const handleRefillPredict = async () => {
    if (!refillMed.trim() || refillLoading) return;
    setRefillLoading(true);
    setRefillResult(null);
    try {
      const res = await fetch("/api/refill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medicine: refillMed,
          quantity: refillQty,
          dose_per_day: refillDose,
          start_date: refillDate
        })
      });
      if (res.ok) {
        const d = await res.json();
        setRefillResult(d);
        loadDbHistory();
      }
    } catch (e) {
      setRefillResult({ message: "⚠️ Refill prediction failed." });
    } finally {
      setRefillLoading(false);
    }
  };

  const handleSymptomGuide = async () => {
    if (!symptomInput.trim() || symptomLoading) return;
    setSymptomLoading(true);
    setSymptomResult("");
    try {
      const res = await fetch("/api/symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptom: symptomInput })
      });
      if (res.ok) {
        const d = await res.json();
        setSymptomResult(d.result);
      }
    } catch (e) {
      setSymptomResult("⚠️ Failed to load symptom recommendations.");
    } finally {
      setSymptomLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults(medicines);
      return;
    }
    setSearchLoading(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery })
      });
      if (res.ok) {
        const d = await res.json();
        setSearchResults(d.results || []);
      }
    } catch (e) {
    } finally {
      setSearchLoading(false);
    }
  };

  const handleHospitalLocate = async () => {
    if (!hospitalCity.trim() || hospitalLoading) return;
    setHospitalLoading(true);
    setHospitalError("");
    setHospitalResults([]);
    try {
      const res = await fetch("/api/hospitals/nearby", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: hospitalCity, radius_km: hospitalRadius * 1.6 })
      });
      const d = await res.json();
      if (res.ok && (d.hospitals || []).length > 0) {
        setHospitalResults(d.hospitals || []);
      } else if (d.error) {
        setHospitalError(d.error);
      } else {
        setHospitalError(`No hospitals found near ${hospitalCity}. Try a major city like Ahmedabad, Surat, Vadodara, or Rajkot.`);
      }
    } catch (e) {
      setHospitalError("⚠️ Server offline. Please run the backend.");
    } finally {
      setHospitalLoading(false);
    }
  };


  const loadCampsAndSchemes = async () => {
    try {
      const cRes = await fetch("/api/health-camps");
      if (cRes.ok) {
        const cData = await cRes.json();
        setCamps(cData.camps || []);
      }
      const sRes = await fetch("/api/free-schemes");
      if (sRes.ok) {
        const sData = await sRes.json();
        setSchemes(sData.schemes || []);
      }
    } catch (e) {}
  };

  const deleteRefillRecord = async (id: number) => {
    try {
      const res = await fetch(`/api/refills/${id}`, { method: "DELETE" });
      if (res.ok) {
        setRefills(prev => prev.filter(r => r.id !== id));
      }
    } catch (e) {}
  };

  const addDrugChip = (name: string) => {
    const cleaned = name.trim();
    if (cleaned && !drugChips.includes(cleaned)) {
      setDrugChips(prev => [...prev, cleaned]);
    }
    setDrugInput("");
  };

  const removeDrugChip = (name: string) => {
    setDrugChips(prev => prev.filter(c => c !== name));
  };

  const formatMd = (s: string) => {
    return s
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .split("\n")
      .map((line, idx) => <span key={idx} className="block mt-1">{line}</span>);
  };

  const panels = {
    dashboard: (
      <div className="flex flex-col gap-8 animate-[fade_0.3s_ease]">
        <div className="welcome bg-gradient-to-r from-[#10b981]/15 to-[#14b8a6]/5 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white">Welcome to Decode Forest AI Portal 💊</h2>
            <p className="text-sm text-[#9aa0b8] mt-1 max-w-[620px]">
              Access seven advanced tools for instant prescription scans, drug compatibility checks, smart generic replacements, and refill alarms.
            </p>
          </div>
        </div>

        {/* Stats Tiles */}
        <div className="stat-tiles grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="tile bg-[#0d0f0e] border border-white/5 rounded-2xl p-5">
            <div className="tile-num text-3xl font-black bg-gradient-to-r from-[#6ee7b7] to-[#5eead4] bg-clip-text text-transparent">{medCount}</div>
            <div className="tile-lbl text-[11px] text-[#9aa0b8] font-bold mt-1 uppercase tracking-wider">Medicines Database</div>
          </div>
          <div className="tile bg-[#0d0f0e] border border-white/5 rounded-2xl p-5">
            <div className="tile-num text-3xl font-black bg-gradient-to-r from-[#6ee7b7] to-[#5eead4] bg-clip-text text-transparent">{intCount}</div>
            <div className="tile-lbl text-[11px] text-[#9aa0b8] font-bold mt-1 uppercase tracking-wider">Interaction Rules</div>
          </div>
          <div className="tile bg-[#0d0f0e] border border-white/5 rounded-2xl p-5">
            <div className="tile-num text-3xl font-black bg-gradient-to-r from-[#6ee7b7] to-[#5eead4] bg-clip-text text-transparent">{topicCount}</div>
            <div className="tile-lbl text-[11px] text-[#9aa0b8] font-bold mt-1 uppercase tracking-wider">Health Guides</div>
          </div>
          <div className="tile bg-[#0d0f0e] border border-white/5 rounded-2xl p-5">
            <div className="tile-num text-3xl font-black bg-gradient-to-r from-[#6ee7b7] to-[#5eead4] bg-clip-text text-transparent">7</div>
            <div className="tile-lbl text-[11px] text-[#9aa0b8] font-bold mt-1 uppercase tracking-wider">AI Modules</div>
          </div>
        </div>

        {/* Quick grid */}
        <h3 className="block-title font-extrabold text-[#eeeef8] text-base">Quick tools</h3>
        <div className="quick-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div onClick={() => setActivePanel("assistant")} className="quick-card bg-[#0d0f0e] border border-white/5 rounded-2xl p-5 cursor-pointer hover:border-[#10b981]/50 hover:-translate-y-0.5 transition-all">
            <div className="quick-ic w-10 h-10 rounded-xl grid place-items-center bg-[#10b981]/15 text-[#6ee7b7] mb-4"><Bot className="h-5 w-5" /></div>
            <h4 className="font-bold text-white text-sm">AI Health Assistant</h4>
            <p className="text-[12px] text-[#9aa0b8] mt-1">Converse with our clinical-based chatbot helper.</p>
          </div>
          <div onClick={() => setActivePanel("prescription")} className="quick-card bg-[#0d0f0e] border border-white/5 rounded-2xl p-5 cursor-pointer hover:border-[#10b981]/50 hover:-translate-y-0.5 transition-all">
            <div className="quick-ic w-10 h-10 rounded-xl grid place-items-center bg-[#10b981]/15 text-[#6ee7b7] mb-4"><FileText className="h-5 w-5" /></div>
            <h4 className="font-bold text-white text-sm">Prescription Reader</h4>
            <p className="text-[12px] text-[#9aa0b8] mt-1">Paste prescription files/text to extract information.</p>
          </div>
          <div onClick={() => setActivePanel("interactions")} className="quick-card bg-[#0d0f0e] border border-white/5 rounded-2xl p-5 cursor-pointer hover:border-[#10b981]/50 hover:-translate-y-0.5 transition-all">
            <div className="quick-ic w-10 h-10 rounded-xl grid place-items-center bg-[#10b981]/15 text-[#6ee7b7] mb-4"><AlertTriangle className="h-5 w-5" /></div>
            <h4 className="font-bold text-white text-sm">Drug Interactions</h4>
            <p className="text-[12px] text-[#9aa0b8] mt-1">Check multiple medications for harmful combinations.</p>
          </div>
          <div onClick={() => setActivePanel("substitutes")} className="quick-card bg-[#0d0f0e] border border-white/5 rounded-2xl p-5 cursor-pointer hover:border-[#10b981]/50 hover:-translate-y-0.5 transition-all">
            <div className="quick-ic w-10 h-10 rounded-xl grid place-items-center bg-[#10b981]/15 text-[#6ee7b7] mb-4"><Pill className="h-5 w-5" /></div>
            <h4 className="font-bold text-white text-sm">Smart Substitutes</h4>
            <p className="text-[12px] text-[#9aa0b8] mt-1">Find high-quality generic alternative options.</p>
          </div>
          <div onClick={() => setActivePanel("refill")} className="quick-card bg-[#0d0f0e] border border-white/5 rounded-2xl p-5 cursor-pointer hover:border-[#10b981]/50 hover:-translate-y-0.5 transition-all">
            <div className="quick-ic w-10 h-10 rounded-xl grid place-items-center bg-[#10b981]/15 text-[#6ee7b7] mb-4"><Calendar className="h-5 w-5" /></div>
            <h4 className="font-bold text-white text-sm">Refill Predictor</h4>
            <p className="text-[12px] text-[#9aa0b8] mt-1">Plan your medicine restocks and configure alerts.</p>
          </div>
          <div onClick={() => setActivePanel("symptoms")} className="quick-card bg-[#0d0f0e] border border-white/5 rounded-2xl p-5 cursor-pointer hover:border-[#10b981]/50 hover:-translate-y-0.5 transition-all">
            <div className="quick-ic w-10 h-10 rounded-xl grid place-items-center bg-[#10b981]/15 text-[#6ee7b7] mb-4"><Stethoscope className="h-5 w-5" /></div>
            <h4 className="font-bold text-white text-sm">Symptom Guide</h4>
            <p className="text-[12px] text-[#9aa0b8] mt-1">Lookup immediate responsible OTC medication tips.</p>
          </div>
        </div>

        {/* Refill Reminders History Panel */}
        {refills.length > 0 && (
          <div className="bg-[#0d0f0e] border border-white/5 rounded-2xl p-6">
            <h4 className="font-extrabold text-[#eeeef8] text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Bell className="h-4 w-4 text-[#10b981]" /> Active Refill Schedules ({refills.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {refills.map(r => (
                <div key={r.id} className="bg-[#12121e] border border-white/5 rounded-xl p-4 flex justify-between items-start">
                  <div>
                    <h5 className="font-bold text-white text-sm">{r.medicine}</h5>
                    <p className="text-xs text-[#9aa0b8] mt-1">
                      Qty: {r.quantity} @ {r.dose_per_day}/day | Start: {r.start_date}
                    </p>
                    <p className="text-xs text-[#6ee7b7] font-semibold mt-2">
                      📅 Refill date: {r.refill_date}
                    </p>
                    <p className="text-[10px] text-[#5b5f78] mt-0.5">
                      🔔 Alarm date: {r.reminder_date}
                    </p>
                  </div>
                  <button onClick={() => deleteRefillRecord(r.id)} className="text-white/30 hover:text-rose-400 p-1.5 transition-all" aria-label="Delete schedule">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    ),
    assistant: (
      <div className="chat-wrap flex flex-col h-[calc(100vh-170px)] max-w-[840px] animate-[fade_0.3s_ease]">
        <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5 mb-4 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10b981]/20 to-[#14b8a6]/10 flex items-center justify-center shrink-0">
            <Bot className="h-5 w-5 text-[#6ee7b7]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">AI Health Assistant</h3>
            <p className="text-xs text-[#9aa0b8] mt-1 leading-relaxed">Ask about medicines, dosages, symptoms, or general health topics — grounded in our clinical RAG database.</p>
          </div>
        </div>
        <div ref={chatScrollRef} className="chat-scroll flex-1 min-h-0 overflow-y-auto flex flex-col gap-4 p-2">
          {chatMessages.map((m, i) => (
            <div key={i} className={`msg flex gap-3 max-w-[90%] ${m.role === "user" ? "self-end flex-row-reverse" : "self-start"}`}>
              <div className={`msg-ic w-[33px] h-[33px] rounded-lg flex items-center justify-center shrink-0 text-white ${
                m.role === "user" ? "bg-white/10" : "bg-gradient-to-r from-[#10b981] to-[#14b8a6]"
              }`}>
                {m.role === "user" ? <X className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={`msg-body text-sm px-4 py-3 rounded-2xl border ${
                m.role === "user" ? "bg-[#10b981]/10 border-[#10b981]/25" : "bg-[#12121e] border-white/5"
              }`}>
                {formatMd(m.text)}
              </div>
            </div>
          ))}
          {chatLoading && (
            <div className="msg flex gap-3 self-start">
              <div className="msg-ic w-[33px] h-[33px] rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-r from-[#10b981] to-[#14b8a6] text-white">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
              <div className="msg-body text-sm bg-[#12121e] border border-white/5 px-4 py-3 rounded-2xl flex items-center gap-2">
                Thinking...
              </div>
            </div>
          )}
        </div>
        <div className="chat-input flex gap-2 border-t border-white/5 pt-4 mt-2 shrink-0">
          <input
            type="text" 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
            placeholder="Ask anything about medicines, dosages, symptoms..." 
            className="flex-1 bg-[#0d0f0e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#10b981]"
          />
          <button onClick={handleChatSend} className="btn bg-gradient-to-r from-[#10b981] to-[#14b8a6] text-white px-5 rounded-xl cursor-pointer">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    ),
    prescription: (
      <div className="flex flex-col gap-6 max-w-[820px] animate-[fade_0.3s_ease]">
        <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10b981]/20 to-[#14b8a6]/10 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5 text-[#6ee7b7]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Prescription Reader</h3>
            <p className="text-xs text-[#9aa0b8] mt-1 leading-relaxed">Paste prescription transcripts or typed text from your doctor. The AI extracts standard medicine names, dosages, plain-language summaries, and flags safety interactions.</p>
          </div>
        </div>
        <div className="form-card bg-[#0d0f0e] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-[#9aa0b8] tracking-wider block mb-2">Prescription / Drug List</label>
            <textarea
              rows={6}
              value={rxInput}
              onChange={(e) => setRxInput(e.target.value)}
              placeholder="Example:&#10;Tab. Metformin 500mg BD&#10;Tab. Atorvastatin 10mg HS&#10;Tab. Omeprazole 20mg OD AC&#10;Tab. Losartan 50mg OD"
              className="w-full bg-[#12121e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#10b981]/50 resize-y"
            />
          </div>
          <button onClick={handlePrescriptionRead} disabled={rxLoading} className="btn w-full bg-gradient-to-r from-[#10b981] to-[#14b8a6] text-white font-semibold py-3.5 rounded-xl hover:scale-[1.005] transition-all disabled:opacity-50 cursor-pointer inline-flex items-center justify-center gap-2">
            {rxLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</> : <><ClipboardList className="h-4 w-4" /> Analyze Prescription</>}
          </button>
        </div>

        {!rxResult && !rxLoading && (
          <div className="flex flex-col items-center justify-center gap-3 py-14 text-[#5b5f78] border border-dashed border-white/10 rounded-2xl">
            <FileText className="h-8 w-8 opacity-30" />
            <p className="text-xs">Paste a prescription above to get an AI-read summary</p>
          </div>
        )}

        {rxResult && (
          <div className="bg-[#12121e] border border-white/5 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.02]">
              <span className="text-[11px] uppercase font-bold text-[#9aa0b8] tracking-wider">Analysis Result</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#10b981]/15 text-[#6ee7b7] flex items-center gap-1"><Sparkles className="h-3 w-3" /> AI Generated</span>
            </div>
            <div className="p-6 text-sm leading-relaxed">{formatMd(rxResult)}</div>
          </div>
        )}

        {/* History of prescriptions */}
        {prescriptions.length > 0 && (
          <div className="flex flex-col gap-3 mt-6">
            <h4 className="font-extrabold text-[#eeeef8] text-sm uppercase tracking-wider">Prescription Scan History</h4>
            {prescriptions.map(p => (
              <details key={p.id} className="bg-[#0d0f0e] border border-white/5 rounded-xl p-4">
                <summary className="font-bold text-white text-xs md:text-sm flex items-center justify-between cursor-pointer">
                  <span>Prescription ID #{p.id} — {new Date(p.created_at).toLocaleDateString()}</span>
                  <ChevronDown className="h-4 w-4 text-[#10b981]" />
                </summary>
                <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-xs uppercase text-[#5b5f78] font-bold">Input Text</h5>
                    <pre className="text-xs text-[#9aa0b8] whitespace-pre-wrap mt-1 bg-[#12121e] p-3 rounded-lg border border-white/5">{p.text}</pre>
                  </div>
                  <div>
                    <h5 className="text-xs uppercase text-[#5b5f78] font-bold">AI Analysis Result</h5>
                    <div className="text-xs text-[#9aa0b8] mt-1">{formatMd(p.result)}</div>
                  </div>
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    ),
    interactions: (
      <div className="flex flex-col gap-6 max-w-[820px] animate-[fade_0.3s_ease]">
        <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10b981]/20 to-[#14b8a6]/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-[#6ee7b7]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Drug Interaction Checker</h3>
            <p className="text-xs text-[#9aa0b8] mt-1 leading-relaxed">Add two or more active drug substances to screen for severe, moderate, or low-risk drug-drug interaction warnings.</p>
          </div>
        </div>
        <div className="form-card bg-[#0d0f0e] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-[#9aa0b8] tracking-wider block mb-2">Medication Registry</label>
            <div className="chips-input border border-white/10 rounded-xl bg-[#12121e] p-3 flex flex-wrap gap-2 items-center">
              {drugChips.map(c => (
                <span key={c} className="chip bg-[#10b981]/15 text-[#6ee7b7] border border-[#10b981]/25 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                  {c} <X className="h-3 w-3 cursor-pointer" onClick={() => removeDrugChip(c)} />
                </span>
              ))}
              <input
                type="text"
                value={drugInput}
                onChange={(e) => setDrugInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addDrugChip((e.target as HTMLInputElement).value)}
                placeholder={drugChips.length === 0 ? "Type drug name (e.g. Aspirin) & press Enter" : "Add another..."}
                className="flex-1 min-w-[150px] bg-transparent border-none focus:outline-none text-sm text-white"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            {["Aspirin", "Ibuprofen", "Paracetamol", "Metformin", "Warfarin", "Omeprazole", "Atorvastatin", "Losartan"].map(d => (
              <button key={d} onClick={() => addDrugChip(d)} className="text-[11px] text-[#9aa0b8] bg-[#12121e] border border-white/5 rounded-full px-3 py-1 hover:border-[#10b981]/50 hover:text-white transition-all cursor-pointer">
                + {d}
              </button>
            ))}
          </div>
          <button onClick={handleInteractionCheck} disabled={drugChips.length < 2 || interactLoading} className="btn w-full bg-gradient-to-r from-[#10b981] to-[#14b8a6] text-white font-semibold py-3.5 rounded-xl disabled:opacity-50 cursor-pointer inline-flex items-center justify-center gap-2">
            {interactLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Verifying...</> : <><ShieldAlert className="h-4 w-4" /> Run Interaction Audit</>}
          </button>
        </div>

        {!interactResult && !interactLoading && (
          <div className="flex flex-col items-center justify-center gap-3 py-14 text-[#5b5f78] border border-dashed border-white/10 rounded-2xl">
            <AlertTriangle className="h-8 w-8 opacity-30" />
            <p className="text-xs">Add at least two medicines above, then run the audit</p>
          </div>
        )}

        {interactResult && (
          <div className="bg-[#12121e] border border-white/5 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.02]">
              <span className="text-[11px] uppercase font-bold text-[#9aa0b8] tracking-wider">Audit Result</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#10b981]/15 text-[#6ee7b7] flex items-center gap-1"><Sparkles className="h-3 w-3" /> AI Generated</span>
            </div>
            <div className="p-6 text-sm leading-relaxed">{formatMd(interactResult)}</div>
          </div>
        )}

        {/* History of interaction checks */}
        {interactionsHistory.length > 0 && (
          <div className="flex flex-col gap-3 mt-6">
            <h4 className="font-extrabold text-[#eeeef8] text-sm uppercase tracking-wider">Interaction Audit Log</h4>
            {interactionsHistory.map(ih => (
              <div key={ih.id} className="bg-[#0d0f0e] border border-white/5 rounded-xl p-5">
                <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-3">
                  <span className="font-bold text-white text-xs md:text-sm">Audit ID #{ih.id}</span>
                  <span className="text-xs text-[#5b5f78]">{new Date(ih.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {ih.drugs.map((d, idx) => (
                    <span key={idx} className="bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5 text-xs text-[#9aa0b8]">
                      {d}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-[#9aa0b8] leading-relaxed">{formatMd(ih.result)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    ),
    substitutes: (
      <div className="flex flex-col gap-6 max-w-[820px] animate-[fade_0.3s_ease]">
        <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10b981]/20 to-[#14b8a6]/10 flex items-center justify-center shrink-0">
            <Pill className="h-5 w-5 text-[#6ee7b7]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Smart Substitutes</h3>
            <p className="text-xs text-[#9aa0b8] mt-1 leading-relaxed">Input a brand name medication to identify its active generic substance and browse cheaper bioequivalent Indian brands at matching strengths.</p>
          </div>
        </div>
        <div className="form-card bg-[#0d0f0e] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-[#9aa0b8] tracking-wider block mb-2">Medicine Brand Name</label>
            <input
              type="text"
              value={subInput}
              onChange={(e) => setSubInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubstitutes()}
              placeholder="e.g. Calpol, Lipitor, Zithromax, Prilosec"
              className="w-full bg-[#12121e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#10b981]/50"
            />
          </div>
          <button onClick={handleSubstitutes} disabled={subLoading} className="btn w-full bg-gradient-to-r from-[#10b981] to-[#14b8a6] text-white font-semibold py-3.5 rounded-xl cursor-pointer inline-flex items-center justify-center gap-2">
            {subLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Searching...</> : <><Pill className="h-4 w-4" /> Identify Alternatives</>}
          </button>
        </div>

        {!subResult && !subLoading && (
          <div className="flex flex-col items-center justify-center gap-3 py-14 text-[#5b5f78] border border-dashed border-white/10 rounded-2xl">
            <Pill className="h-8 w-8 opacity-30" />
            <p className="text-xs">Enter a brand name above to find generic alternatives</p>
          </div>
        )}

        {subResult && (
          <div className="bg-[#12121e] border border-white/5 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.02]">
              <span className="text-[11px] uppercase font-bold text-[#9aa0b8] tracking-wider">Substitute Options</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#10b981]/15 text-[#6ee7b7] flex items-center gap-1"><Sparkles className="h-3 w-3" /> AI Generated</span>
            </div>
            <div className="p-6 text-sm leading-relaxed">{formatMd(subResult)}</div>
          </div>
        )}
      </div>
    ),
    refill: (
      <div className="flex flex-col gap-6 max-w-[820px] animate-[fade_0.3s_ease]">
        <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10b981]/20 to-[#14b8a6]/10 flex items-center justify-center shrink-0">
            <Calendar className="h-5 w-5 text-[#6ee7b7]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Refill Predictor</h3>
            <p className="text-xs text-[#9aa0b8] mt-1 leading-relaxed">Configure a medication alarm schedule based on current remaining pills and daily dosage to ensure seamless restocks.</p>
          </div>
        </div>
        <div className="form-card bg-[#0d0f0e] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-[#9aa0b8] tracking-wider block mb-2">Medicine Info</label>
            <input
              type="text"
              value={refillMed}
              onChange={(e) => setRefillMed(e.target.value)}
              placeholder="e.g. Metformin 500mg"
              className="w-full bg-[#12121e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#10b981]/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#9aa0b8] tracking-wider block mb-2">Total Quantity</label>
              <input
                type="number"
                value={refillQty}
                onChange={(e) => setRefillQty(parseInt(e.target.value))}
                min={1}
                className="w-full bg-[#12121e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#10b981]/50"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-[#9aa0b8] tracking-wider block mb-2">Daily Dosage</label>
              <input
                type="number"
                value={refillDose}
                onChange={(e) => setRefillDose(parseFloat(e.target.value))}
                min={0.25}
                step={0.25}
                className="w-full bg-[#12121e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#10b981]/50"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-[#9aa0b8] tracking-wider block mb-2">Start Date</label>
              <input
                type="date"
                value={refillDate}
                onChange={(e) => setRefillDate(e.target.value)}
                className="w-full bg-[#12121e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#10b981]/50"
              />
            </div>
          </div>

          <button onClick={handleRefillPredict} disabled={refillLoading} className="btn w-full bg-gradient-to-r from-[#10b981] to-[#14b8a6] text-white font-semibold py-3.5 rounded-xl mt-2 cursor-pointer inline-flex items-center justify-center gap-2">
            {refillLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Calculating...</> : <><Calendar className="h-4 w-4" /> Calculate Schedule</>}
          </button>
        </div>

        {!refillResult && !refillLoading && (
          <div className="flex flex-col items-center justify-center gap-3 py-14 text-[#5b5f78] border border-dashed border-white/10 rounded-2xl">
            <Calendar className="h-8 w-8 opacity-30" />
            <p className="text-xs">Fill in the medicine details above to calculate a refill schedule</p>
          </div>
        )}

        {refillResult && (
          <div className="bg-[#12121e] border border-white/5 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.02]">
              <span className="text-[11px] uppercase font-bold text-[#9aa0b8] tracking-wider">Refill Calculation Report</span>
              {refillResult.refill_date && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#10b981]/15 text-[#6ee7b7]">Scheduled</span>}
            </div>
            <div className="p-6">
            {refillResult.refill_date ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#5b5f78]">Days Supply</span>
                  <div className="text-2xl font-black text-white mt-1">{refillResult.days_supply} Days</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#5b5f78]">Refill Target Date</span>
                  <div className="text-2xl font-black text-[#6ee7b7] mt-1">{refillResult.refill_date}</div>
                </div>
                <div className="sm:col-span-2 bg-[#10b981]/5 border border-[#10b981]/20 rounded-xl p-3.5 text-xs text-[#9aa0b8] flex items-center gap-2">
                  <Bell className="h-4 w-4 text-[#10b981]" /> Auto-configured alarm set for: <strong>{refillResult.reminder_date}</strong> (3 days warning buffer).
                </div>
              </div>
            ) : (
              <div className="text-rose-400 text-sm">{refillResult.message}</div>
            )}
            </div>
          </div>
        )}
      </div>
    ),
    symptoms: (
      <div className="flex flex-col gap-6 max-w-[820px] animate-[fade_0.3s_ease]">
        <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10b981]/20 to-[#14b8a6]/10 flex items-center justify-center shrink-0">
            <Stethoscope className="h-5 w-5 text-[#6ee7b7]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Symptom Guide</h3>
            <p className="text-xs text-[#9aa0b8] mt-1 leading-relaxed">Lookup common minor discomforts (fever, cold, acidity, muscular pain) for standard OTC suggestions and emergency clinical threshold guidance.</p>
          </div>
        </div>
        <div className="form-card bg-[#0d0f0e] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-[#9aa0b8] tracking-wider block mb-2">Your Symptoms</label>
            <input
              type="text"
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSymptomGuide()}
              placeholder="e.g. fever, headache, common cold, heartburn"
              className="w-full bg-[#12121e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#10b981]/50"
            />
          </div>
          <button onClick={handleSymptomGuide} disabled={symptomLoading} className="btn w-full bg-gradient-to-r from-[#10b981] to-[#14b8a6] text-white font-semibold py-3.5 rounded-xl cursor-pointer inline-flex items-center justify-center gap-2">
            {symptomLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Looking up...</> : <><Stethoscope className="h-4 w-4" /> Lookup Clinical Guidance</>}
          </button>
        </div>

        {!symptomResult && !symptomLoading && (
          <div className="flex flex-col items-center justify-center gap-3 py-14 text-[#5b5f78] border border-dashed border-white/10 rounded-2xl">
            <Stethoscope className="h-8 w-8 opacity-30" />
            <p className="text-xs">Describe a symptom above to get clinical guidance</p>
          </div>
        )}

        {symptomResult && (
          <div className="bg-[#12121e] border border-white/5 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.02]">
              <span className="text-[11px] uppercase font-bold text-[#9aa0b8] tracking-wider">Clinical Guidance</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#10b981]/15 text-[#6ee7b7] flex items-center gap-1"><Sparkles className="h-3 w-3" /> AI Generated</span>
            </div>
            <div className="p-6 text-sm leading-relaxed">{formatMd(symptomResult)}</div>
          </div>
        )}
      </div>
    ),
    medicines: (
      <div className="flex flex-col gap-6 animate-[fade_0.3s_ease]">
        <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10b981]/20 to-[#14b8a6]/10 flex items-center justify-center shrink-0">
            <Search className="h-5 w-5 text-[#6ee7b7]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Medicine Database Search</h3>
            <p className="text-xs text-[#9aa0b8] mt-1 leading-relaxed">Browse or run lexical similarity lookups against our catalog of genuine active generic and brand medications.</p>
          </div>
        </div>
        <div className="form-card bg-[#0d0f0e] border border-white/5 p-3 rounded-2xl flex gap-3 max-w-[600px] items-center">
          <div className="flex-1 flex items-center gap-2 bg-[#12121e] border border-white/10 rounded-xl px-4 py-1">
            <Search className="h-3.5 w-3.5 text-[#5b5f78] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search by name, symptom or active category..."
              className="w-full bg-transparent border-none py-2.5 text-sm text-white focus:outline-none"
            />
          </div>
          <button onClick={handleSearch} className="btn bg-gradient-to-r from-[#10b981] to-[#14b8a6] text-white px-5 py-3 rounded-xl cursor-pointer shrink-0">
            <Search className="h-4 w-4" />
          </button>
        </div>

        {searchResults.length > 0 && !searchLoading && (
          <span className="text-[11px] text-[#5b5f78] font-semibold uppercase tracking-wider">{searchResults.length} medicines found</span>
        )}

        {searchLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#10b981]" /></div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((m, idx) => (
              <div key={idx} className="bg-[#0d0f0e] border border-white/5 rounded-2xl p-5 hover:border-[#10b981]/30 transition-all flex flex-col">
                <span className="bg-[#10b981]/15 text-[#6ee7b7] border border-[#10b981]/25 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit mb-3">{m.category}</span>
                <h5 className="font-bold text-white text-base leading-snug">{m.name}</h5>
                <p className="text-[11px] text-[#5b5f78] mt-1 font-semibold">Generic: {m.generic} | Brand: {m.brand}</p>
                <p className="text-xs text-[#9aa0b8] mt-3 leading-relaxed flex-1">{m.use}</p>
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[#5b5f78]">Dose: {m.dose}</span>
                  <span className="font-bold text-[#5eead4]">₹{m.price_inr}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-14 text-[#5b5f78] border border-dashed border-white/10 rounded-2xl">
            <Search className="h-8 w-8 opacity-30" />
            <p className="text-xs">No matching medications found</p>
          </div>
        )}
      </div>
    ),
    hospitals: (
      <div className="flex flex-col gap-6 max-w-[900px] animate-[fade_0.3s_ease]">
        <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10b981]/20 to-[#14b8a6]/10 flex items-center justify-center shrink-0">
            <MapPin className="h-5 w-5 text-[#6ee7b7]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Hospital Locator</h3>
            <p className="text-xs text-[#9aa0b8] mt-1 leading-relaxed">Search for nearby medical facilities, hospitals, and clinics. Enter a city name and radius (in miles) to find matching locations with directions.</p>
          </div>
        </div>
        <div className="form-card bg-[#0d0f0e] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#9aa0b8] tracking-wider block mb-2">City Name</label>
              <input
                type="text"
                value={hospitalCity}
                onChange={(e) => setHospitalCity(e.target.value)}
                placeholder="e.g. Ahmedabad, Anand"
                className="w-full bg-[#12121e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#10b981]/50"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-[#9aa0b8] tracking-wider block mb-2">Radius (miles)</label>
              <input
                type="number"
                value={hospitalRadius}
                onChange={(e) => setHospitalRadius(parseFloat(e.target.value) || 10)}
                min={1}
                max={100}
                className="w-full bg-[#12121e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#10b981]/50"
              />
            </div>
          </div>
          <button onClick={handleHospitalLocate} disabled={hospitalLoading} className="btn w-full bg-gradient-to-r from-[#10b981] to-[#14b8a6] text-white font-semibold py-3.5 rounded-xl cursor-pointer inline-flex items-center justify-center gap-2">
            {hospitalLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Locating...</> : <><MapPin className="h-4 w-4" /> Find Facilities</>}
          </button>
        </div>

        {hospitalError && (
          <div className="bg-rose-500/10 border border-rose-500/25 rounded-2xl p-6 text-sm text-rose-400">
            {hospitalError}
          </div>
        )}

        {!hospitalError && hospitalResults.length === 0 && !hospitalLoading && (
          <div className="flex flex-col items-center justify-center gap-3 py-14 text-[#5b5f78] border border-dashed border-white/10 rounded-2xl">
            <MapPin className="h-8 w-8 opacity-30" />
            <p className="text-xs">Search a city above to find nearby hospitals and clinics</p>
          </div>
        )}

        {hospitalResults.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-[#eeeef8] text-sm uppercase tracking-wider">Nearby Facilities</h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#10b981]/15 text-[#6ee7b7]">{hospitalResults.length} found</span>
            </div>
            <div className="flex flex-col gap-3">
              {hospitalResults.map((h, idx) => (
                <div key={idx} className="bg-[#0d0f0e] border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4 hover:border-[#10b981]/30 transition-all">
                  <div className="w-11 h-11 rounded-xl bg-[#10b981]/15 flex items-center justify-center shrink-0">
                    <Building2 className="h-5 w-5 text-[#6ee7b7]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h5 className="font-bold text-white text-sm leading-snug">{h.name || h.Name}</h5>
                      <span className="bg-[#10b981]/15 text-[#6ee7b7] border border-[#10b981]/25 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">{h.type || h.Type || "General"}</span>
                    </div>
                    <p className="text-xs text-[#9aa0b8] mt-1.5">{h.address || h.Address}, {h.city || h.City}, {h.state || h.State} {h.zip || h.ZIP || ""}</p>
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      {(h.phone || h.Phone) && (
                        <a href={`tel:${h.phone || h.Phone}`} className="text-xs text-[#6ee7b7] font-semibold flex items-center gap-1.5 hover:underline">
                          <Phone className="h-3 w-3" /> {h.phone || h.Phone}
                        </a>
                      )}
                      {(h.beds || h.Beds) && (
                        <span className="text-[11px] text-[#5b5f78]">{h.beds || h.Beds} beds</span>
                      )}
                      <span className="text-[11px] text-[#5b5f78] font-mono">
                        {h.distance_km != null ? `${h.distance_km} km away` : h.Distance_miles != null ? `${h.Distance_miles?.toFixed(2)} mi` : ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 md:w-[220px] shrink-0">
                    <a href={h.maps || h.Google_Maps_URL || `https://maps.google.com/?q=${encodeURIComponent((h.name || h.Name) + " " + (h.city || h.City || ""))}`} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-[#12121e] hover:bg-white/5 text-white border border-white/10 rounded-xl py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5">
                      View Map
                    </a>
                    {(h.route || h.Route_URL) && (
                      <a href={h.route || h.Route_URL} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-[#10b981]/15 hover:bg-[#10b981]/25 text-[#6ee7b7] border border-[#10b981]/30 rounded-xl py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5">
                        Get Route
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    ),
    camps: (
      <div className="flex flex-col gap-6 animate-[fade_0.3s_ease]">
        <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10b981]/20 to-[#14b8a6]/10 flex items-center justify-center shrink-0">
            <HeartPulse className="h-5 w-5 text-[#6ee7b7]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Gujarat Health Camps</h3>
            <p className="text-xs text-[#9aa0b8] mt-1 leading-relaxed">Explore upcoming free medical checkups, eye treatment camps, pediatric care, and blood donation drives in Gujarat.</p>
          </div>
        </div>
        <div className="form-card bg-[#0d0f0e] border border-white/5 p-3 rounded-2xl flex gap-3 max-w-[600px] items-center">
          <div className="flex-1 flex items-center gap-2 bg-[#12121e] border border-white/10 rounded-xl px-4 py-1">
            <Search className="h-3.5 w-3.5 text-[#5b5f78] shrink-0" />
            <input
              type="text"
              value={campQuery}
              onChange={(e) => setCampQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setCampLoading(true);
                  fetch(`/api/health-camps?query=${encodeURIComponent(campQuery)}`)
                    .then(res => res.json())
                    .then(d => { setCamps(d.camps || []); setCampLoading(false); });
                }
              }}
              placeholder="Search by city or camp category (e.g. Eye, Surat)..."
              className="w-full bg-transparent border-none py-2.5 text-sm text-white focus:outline-none"
            />
          </div>
          <button
            onClick={() => {
              setCampLoading(true);
              fetch(`/api/health-camps?query=${encodeURIComponent(campQuery)}`)
                .then(res => res.json())
                .then(d => { setCamps(d.camps || []); setCampLoading(false); });
            }}
            className="btn bg-gradient-to-r from-[#10b981] to-[#14b8a6] text-white px-5 py-3 rounded-xl cursor-pointer shrink-0"
          >
            {campLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </button>
        </div>

        {camps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {camps.map((c, idx) => (
              <div key={idx} className="bg-[#0d0f0e] border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-[#10b981]/30 transition-all">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-[#10b981]/15 text-[#6ee7b7] border border-[#10b981]/25 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">{c.category}</span>
                    <span className="text-[10px] text-[#5b5f78] font-bold font-mono">{c.date}</span>
                  </div>
                  <h5 className="font-bold text-white text-base leading-snug">{c.title}</h5>
                  <p className="text-xs text-[#9aa0b8] mt-2 leading-relaxed">{c.description}</p>
                  <div className="mt-4 flex flex-col gap-1.5 text-[11px] text-[#5b5f78] font-semibold">
                    <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3 shrink-0" /> Venue: <span className="text-[#9aa0b8] font-normal">{c.venue}, {c.city}</span></div>
                    <div className="flex items-center gap-1.5"><Calendar className="h-3 w-3 shrink-0" /> Time: <span className="text-[#9aa0b8] font-normal">{c.time}</span></div>
                    <div className="flex items-center gap-1.5"><Building2 className="h-3 w-3 shrink-0" /> Organizer: <span className="text-[#6ee7b7] font-normal">{c.organizer}</span></div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const email = prompt("Enter your email to receive free pass & reminder updates:");
                    if (email) alert(`Registered successfully for ${c.title}! Pass details sent to ${email}.`);
                  }}
                  className="btn bg-white/5 border border-white/10 text-white text-xs hover:bg-[#12121e] py-2.5 mt-5 font-bold rounded-xl w-full"
                >
                  Register Free Pass
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-14 text-[#5b5f78] border border-dashed border-white/10 rounded-2xl">
            <HeartPulse className="h-8 w-8 opacity-30" />
            <p className="text-xs">No camps matching that query found</p>
          </div>
        )}
      </div>
    ),
    schemes: (
      <div className="flex flex-col gap-6 animate-[fade_0.3s_ease]">
        <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10b981]/20 to-[#14b8a6]/10 flex items-center justify-center shrink-0">
            <Shield className="h-5 w-5 text-[#6ee7b7]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Free Medical Schemes</h3>
            <p className="text-xs text-[#9aa0b8] mt-1 leading-relaxed">Lookup government schemes, cashless hospitalisation models, and free diagnostic coverage guides in India & Gujarat.</p>
          </div>
        </div>
        <div className="form-card bg-[#0d0f0e] border border-white/5 p-3 rounded-2xl flex gap-3 max-w-[600px] items-center">
          <div className="flex-1 flex items-center gap-2 bg-[#12121e] border border-white/10 rounded-xl px-4 py-1">
            <Search className="h-3.5 w-3.5 text-[#5b5f78] shrink-0" />
            <input
              type="text"
              value={schemeQuery}
              onChange={(e) => setSchemeQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSchemeLoading(true);
                  fetch(`/api/free-schemes?query=${encodeURIComponent(schemeQuery)}`)
                    .then(res => res.json())
                    .then(d => { setSchemes(d.schemes || []); setSchemeLoading(false); });
                }
              }}
              placeholder="Search schemes by name or eligibility criteria..."
              className="w-full bg-transparent border-none py-2.5 text-sm text-white focus:outline-none"
            />
          </div>
          <button
            onClick={() => {
              setSchemeLoading(true);
              fetch(`/api/free-schemes?query=${encodeURIComponent(schemeQuery)}`)
                .then(res => res.json())
                .then(d => { setSchemes(d.schemes || []); setSchemeLoading(false); });
            }}
            className="btn bg-gradient-to-r from-[#10b981] to-[#14b8a6] text-white px-5 py-3 rounded-xl cursor-pointer shrink-0"
          >
            {schemeLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </button>
        </div>

        {schemes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schemes.map((s, idx) => (
              <div key={idx} className="bg-[#0d0f0e] border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-[#10b981]/30 transition-all border-l-4 border-l-[#10b981]">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-extrabold text-white text-base leading-snug">{s.name}</h5>
                  </div>
                  <div className="text-xs font-black text-[#6ee7b7] mb-3">Coverage: {s.coverage}</div>
                  
                  <div className="text-xs text-[#9aa0b8] mb-3">
                    <strong className="text-white block mb-1">Key Benefits:</strong>
                    <ul className="list-disc pl-4 flex flex-col gap-0.5">
                      {s.benefits.map((b: any, bidx: number) => (
                        <li key={bidx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-4 flex flex-col gap-1.5 text-[11px] text-[#5b5f78] font-semibold">
                    <div className="flex items-center gap-1.5"><Shield className="h-3 w-3 shrink-0" /> Eligibility: <span className="text-[#9aa0b8] font-normal">{s.eligibility}</span></div>
                    <div className="flex items-center gap-1.5"><Phone className="h-3 w-3 shrink-0" /> Contact: <span className="text-[#6ee7b7] font-normal">{s.contact}</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-14 text-[#5b5f78] border border-dashed border-white/10 rounded-2xl">
            <Shield className="h-8 w-8 opacity-30" />
            <p className="text-xs">No schemes found matching that query</p>
          </div>
        )}
      </div>
    )
  };

  return (
    <div className="app-shell flex min-h-screen">
      {/* Sidebar */}
      <aside className={`sidebar w-[255px] shrink-0 bg-[#0d0f0e] border-r border-white/5 flex flex-col p-[18px_14px] fixed top-0 bottom-0 z-50 h-screen transition-transform duration-300 md:sticky ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="side-logo flex items-center gap-3 font-extrabold text-[15px] tracking-tight">
            <span className="logo-icon w-[34px] h-[34px] rounded-[10px] grid place-items-center text-white bg-gradient-to-br from-[#10b981] to-[#14b8a6] shadow-[0_6px_16px_rgba(16,185,129,0.3)]">
              <MortarPestle className="h-4 w-4" />
            </span>
            <span className="text-white">Decode <span className="text-[#6ee7b7]">Forest</span></span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/50 hover:text-white transition-all cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="side-nav flex flex-col gap-1 flex-1">
          <button onClick={() => { setActivePanel("dashboard"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 pl-3.5 pr-4 py-2.5 rounded-xl text-left text-xs font-semibold cursor-pointer transition-all border-l-2 ${activePanel === "dashboard" ? "bg-[#10b981]/15 text-[#6ee7b7] border-[#10b981]" : "text-[#8890aa] border-transparent hover:bg-[#12121e] hover:text-white"}`}>
            <LayoutDashboard className="h-4 w-4 shrink-0" /> Dashboard
          </button>
          <button onClick={() => { setActivePanel("assistant"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 pl-3.5 pr-4 py-2.5 rounded-xl text-left text-xs font-semibold cursor-pointer transition-all border-l-2 ${activePanel === "assistant" ? "bg-[#10b981]/15 text-[#6ee7b7] border-[#10b981]" : "text-[#8890aa] border-transparent hover:bg-[#12121e] hover:text-white"}`}>
            <Bot className="h-4 w-4 shrink-0" /> AI Assistant
          </button>
          <button onClick={() => { setActivePanel("prescription"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 pl-3.5 pr-4 py-2.5 rounded-xl text-left text-xs font-semibold cursor-pointer transition-all border-l-2 ${activePanel === "prescription" ? "bg-[#10b981]/15 text-[#6ee7b7] border-[#10b981]" : "text-[#8890aa] border-transparent hover:bg-[#12121e] hover:text-white"}`}>
            <FileText className="h-4 w-4 shrink-0" /> Prescription Reader
          </button>
          <button onClick={() => { setActivePanel("interactions"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 pl-3.5 pr-4 py-2.5 rounded-xl text-left text-xs font-semibold cursor-pointer transition-all border-l-2 ${activePanel === "interactions" ? "bg-[#10b981]/15 text-[#6ee7b7] border-[#10b981]" : "text-[#8890aa] border-transparent hover:bg-[#12121e] hover:text-white"}`}>
            <AlertTriangle className="h-4 w-4 shrink-0" /> Drug Interactions
          </button>
          <button onClick={() => { setActivePanel("substitutes"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 pl-3.5 pr-4 py-2.5 rounded-xl text-left text-xs font-semibold cursor-pointer transition-all border-l-2 ${activePanel === "substitutes" ? "bg-[#10b981]/15 text-[#6ee7b7] border-[#10b981]" : "text-[#8890aa] border-transparent hover:bg-[#12121e] hover:text-white"}`}>
            <Pill className="h-4 w-4 shrink-0" /> Smart Substitutes
          </button>
          <button onClick={() => { setActivePanel("refill"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 pl-3.5 pr-4 py-2.5 rounded-xl text-left text-xs font-semibold cursor-pointer transition-all border-l-2 ${activePanel === "refill" ? "bg-[#10b981]/15 text-[#6ee7b7] border-[#10b981]" : "text-[#8890aa] border-transparent hover:bg-[#12121e] hover:text-white"}`}>
            <Calendar className="h-4 w-4 shrink-0" /> Refill Predictor
          </button>
          <button onClick={() => { setActivePanel("symptoms"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 pl-3.5 pr-4 py-2.5 rounded-xl text-left text-xs font-semibold cursor-pointer transition-all border-l-2 ${activePanel === "symptoms" ? "bg-[#10b981]/15 text-[#6ee7b7] border-[#10b981]" : "text-[#8890aa] border-transparent hover:bg-[#12121e] hover:text-white"}`}>
            <Stethoscope className="h-4 w-4 shrink-0" /> Symptom Guide
          </button>
          <button onClick={() => { setActivePanel("medicines"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 pl-3.5 pr-4 py-2.5 rounded-xl text-left text-xs font-semibold cursor-pointer transition-all border-l-2 ${activePanel === "medicines" ? "bg-[#10b981]/15 text-[#6ee7b7] border-[#10b981]" : "text-[#8890aa] border-transparent hover:bg-[#12121e] hover:text-white"}`}>
            <Search className="h-4 w-4 shrink-0" /> Search Database
          </button>
          <button onClick={() => { setActivePanel("hospitals"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 pl-3.5 pr-4 py-2.5 rounded-xl text-left text-xs font-semibold cursor-pointer transition-all border-l-2 ${activePanel === "hospitals" ? "bg-[#10b981]/15 text-[#6ee7b7] border-[#10b981]" : "text-[#8890aa] border-transparent hover:bg-[#12121e] hover:text-white"}`}>
            <MapPin className="h-4 w-4 shrink-0" /> Hospital Locator
          </button>
          <button onClick={() => { setActivePanel("camps"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 pl-3.5 pr-4 py-2.5 rounded-xl text-left text-xs font-semibold cursor-pointer transition-all border-l-2 ${activePanel === "camps" ? "bg-[#10b981]/15 text-[#6ee7b7] border-[#10b981]" : "text-[#8890aa] border-transparent hover:bg-[#12121e] hover:text-white"}`}>
            <HeartPulse className="h-4 w-4 shrink-0" /> Gujarat Health Camps
          </button>
          <button onClick={() => { setActivePanel("schemes"); setSidebarOpen(false); }} className={`nav-item flex items-center gap-3 pl-3.5 pr-4 py-2.5 rounded-xl text-left text-xs font-semibold cursor-pointer transition-all border-l-2 ${activePanel === "schemes" ? "bg-[#10b981]/15 text-[#6ee7b7] border-[#10b981]" : "text-[#8890aa] border-transparent hover:bg-[#12121e] hover:text-white"}`}>
            <Shield className="h-4 w-4 shrink-0" /> Free Medical Schemes
          </button>
        </nav>

        <div className="side-foot flex flex-col gap-3 pt-4 border-t border-white/5 mt-auto">
          <div className={`sysbadge flex items-center gap-2 text-[10.5px] font-mono rounded-lg border p-2.5 transition-all duration-300 ${
            llmEnabled ? "text-[#10b981] border-[#10b981]/30 bg-[#10b981]/5" : "text-[#8890aa] border-white/5 bg-[#12121e]"
          }`}>
            <i className={`fas fa-circle ${llmEnabled ? "text-[#10b981]" : "text-[#5b5f78]"} text-[6px]`}></i>
            {llmEnabled ? "LLM Ready" : "Offline Mode"}
          </div>
          <Link href="/" className="side-back flex items-center gap-2 text-xs text-[#8890aa] hover:text-white py-1 transition-all">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to landing page
          </Link>
        </div>
      </aside>

      {/* Main Panel Area */}
      <div className="main flex-1 flex flex-col min-w-0">
        <header className="topbar sticky top-0 bg-[#060609]/95 backdrop-blur-md border-b border-white/5 z-20 flex items-center gap-4 px-6 md:px-12 py-4">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden w-10 h-10 rounded-lg bg-[#12121e] border border-white/10 flex items-center justify-center text-white cursor-pointer">
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-black text-white capitalize">{activePanel}</h1>
            <p className="text-xs text-[#9aa0b8] mt-0.5">AI-assisted pharmacy utility suite</p>
          </div>
          <div className="ml-auto hidden md:block">
            <span className="prov-chip font-mono text-[11px] font-semibold text-[#6ee7b7] bg-[#10b981]/10 border border-[#10b981]/25 px-3 py-1.5 rounded-full">
              <Cpu className="h-3 w-3 inline mr-1.5" />
              {llmEnabled ? providerName : "Offline AI Engine"} · {ragBackend.split(" ")[0]} RAG
            </span>
          </div>
        </header>

        <main className="panels p-6 md:p-12 max-w-[1180px] w-full flex-1">
          {panels[activePanel]}
        </main>
      </div>
    </div>
  );
}

// Icon fallbacks inside html templates (Font Awesome logic)
function MortarPestle({ className }: { className?: string }) {
  return <i className={`fas fa-mortar-pestle ${className || ""}`} style={{ fontSize: "inherit" }}></i>;
}
