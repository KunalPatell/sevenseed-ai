"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Bot,
  BookOpen,
  GraduationCap,
  Award,
  Search,
  Map,
  Briefcase,
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
  Layers,
  FileText,
  Settings,
  Sparkles,
  User,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Building2,
  Trophy,
  Clock,
  Target,
  MapPin
} from "lucide-react";

// This dashboard is served under the "/avpu" path when merged into the
// Sevenseed hub (see apps/sevenseed/backend/child_processes.py); its own API
// calls must go through that same prefix, not root-relative "/api/...".
const API_BASE = "/avpu";

type PanelType = "dashboard" | "tutor" | "roadmaps" | "assessments" | "placements" | "admissions" | "research" | "quiz";

interface StudyRoadmap {
  id: number;
  created_at: string;
  goal: string;
  level: string;
  weeks: number;
  roadmap: {
    target: string;
    level: string;
    weeks_count: number;
    outline: { week: number; topic: string; focus: string; project: string }[];
  };
}

interface AssessmentItem {
  id: number;
  created_at: string;
  question: string;
  student_answer: string;
  feedback: {
    question: string;
    points: number;
    grade: string;
    feedback: string;
    model_answer: string;
  };
}

interface LearningSession {
  session_id: string;
  created_at: string;
  subject: string;
  messages: { role: "user" | "ai"; text: string; sources?: string[]; traces?: string[] }[];
}

export default function StudentPortal() {
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
  
  // RAG / Programs list
  const [programsList, setProgramsList] = useState<any[]>([]);

  // AI Tutor state
  const [tutorSubject, setTutorSubject] = useState("Python Programming");
  const [tutorInput, setTutorInput] = useState("");
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [tutorMessages, setTutorMessages] = useState<{ role: "user" | "ai"; text: string; sources?: string[] }[]>([
    { role: "ai", text: "🎓 Welcome to AVPU Student Copilot! Ask me about syllabus topics, computer science concepts, or university programs." }
  ]);
  const [tutorLoading, setTutorLoading] = useState(false);
  const tutorScrollRef = useRef<HTMLDivElement>(null);

  // Custom Roadmaps
  const [roadmapGoal, setRoadmapGoal] = useState("");
  const [roadmapLevel, setRoadmapLevel] = useState("intermediate");
  const [roadmapWeeks, setRoadmapWeeks] = useState(8);
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [generatedRoadmap, setGeneratedRoadmap] = useState<any>(null);

  // Assessments
  const [assessQ, setAssessQ] = useState("What is the difference between compiler and interpreter?");
  const [assessAns, setAssessAns] = useState("");
  const [assessLoading, setAssessLoading] = useState(false);
  const [assessFeedback, setAssessFeedback] = useState<any>(null);

  // Quiz
  const [quizTopic, setQuizTopic] = useState("Data Structures");
  const [quizCount, setQuizCount] = useState(5);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Placement matcher
  const [placementSkills, setPlacementSkills] = useState("Python, SQL, HTML, CSS");
  const [placementInterests, setPlacementInterests] = useState("Software engineer, web developer");
  const [placementResults, setPlacementResults] = useState<any>(null);
  const [placementLoading, setPlacementLoading] = useState(false);

  // Admissions counselor
  const [admissionInterests, setAdmissionInterests] = useState("Artificial intelligence, big data");
  const [admissionBg, setAdmissionBg] = useState("12th grade science, basic programming");
  const [admissionGoal, setAdmissionGoal] = useState("Become a software developer in MNC");
  const [admissionResult, setAdmissionResult] = useState<any>(null);
  const [admissionLoading, setAdmissionLoading] = useState(false);

  // Research Summarizer
  const [researchText, setResearchText] = useState("");
  const [researchResult, setResearchResult] = useState("");
  const [researchLoading, setResearchLoading] = useState(false);

  // DB History lists
  const [historySessions, setHistorySessions] = useState<LearningSession[]>([]);
  const [historyRoadmaps, setHistoryRoadmaps] = useState<StudyRoadmap[]>([]);
  const [historyAssessments, setHistoryAssessments] = useState<AssessmentItem[]>([]);

  useEffect(() => {
    loadHealthAndPrograms();
    loadDbHistory();
  }, []);

  useEffect(() => {
    if (tutorScrollRef.current) {
      tutorScrollRef.current.scrollTop = tutorScrollRef.current.scrollHeight;
    }
  }, [tutorMessages]);

  const loadHealthAndPrograms = async () => {
    try {
      const hRes = await fetch(API_BASE + "/api/health");
      if (hRes.ok) {
        const hData = await hRes.json();
        setLlmEnabled(hData.llm_enabled);
        setProviderName(hData.provider);
        setRagBackend(hData.rag_backend || "Vector RAG");
      }

      const pRes = await fetch(API_BASE + "/api/programs");
      if (pRes.ok) {
        const pData = await pRes.json();
        setProgramsList(pData.programs || []);
      }
    } catch (e) {
      setDbStatus("offline");
    }
  };

  const loadDbHistory = async () => {
    try {
      const sRes = await fetch(API_BASE + "/api/history/sessions");
      if (sRes.ok) {
        const sData = await sRes.json();
        setHistorySessions(sData.sessions || []);
      }

      const rRes = await fetch(API_BASE + "/api/history/roadmaps");
      if (rRes.ok) {
        const rData = await rRes.json();
        setHistoryRoadmaps(rData.roadmaps || []);
      }

      const aRes = await fetch(API_BASE + "/api/history/assessments");
      if (aRes.ok) {
        const aData = await aRes.json();
        setHistoryAssessments(aData.assessments || []);
      }
    } catch (e) {}
  };

  // Actions
  const handleTutorSend = async () => {
    const text = tutorInput.trim();
    if (!text || tutorLoading) return;
    setTutorInput("");
    setTutorMessages(prev => [...prev, { role: "user", text }]);
    setTutorLoading(true);

    const sid = activeSessionId || strRandom();
    if (!activeSessionId) setActiveSessionId(sid);

    try {
      const res = await fetch(API_BASE + "/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, session_id: sid, subject: tutorSubject })
      });
      if (res.ok) {
        const d = await res.json();
        setTutorMessages(prev => [...prev, { role: "ai", text: d.reply, sources: d.sources }]);
        loadDbHistory();
      }
    } catch (e) {
      setTutorMessages(prev => [...prev, { role: "ai", text: "⚠️ Server offline. Please run the backend." }]);
    } finally {
      setTutorLoading(false);
    }
  };

  const handleSelectSession = (session: LearningSession) => {
    setActiveSessionId(session.session_id);
    setTutorSubject(session.subject);
    setTutorMessages(session.messages.map(m => ({
      role: m.role,
      text: m.text,
      sources: m.sources
    })));
    setActivePanel("tutor");
    setSidebarOpen(false);
  };

  const handleNewTutorChat = () => {
    setActiveSessionId("");
    setTutorMessages([
      { role: "ai", text: `🎓 Welcome to AVPU Tutor! Let's study: ${tutorSubject}. Ask me any question.` }
    ]);
    setActivePanel("tutor");
  };

  const handleGenerateRoadmap = async () => {
    const goal = roadmapGoal.trim();
    if (!goal || roadmapLoading) return;
    setRoadmapLoading(true);
    setGeneratedRoadmap(null);
    try {
      const res = await fetch(API_BASE + "/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, level: roadmapLevel, weeks: roadmapWeeks })
      });
      if (res.ok) {
        const d = await res.json();
        setGeneratedRoadmap(d);
        loadDbHistory();
      }
    } catch (e) {
    } finally {
      setRoadmapLoading(false);
    }
  };

  const handleAssessSubmit = async () => {
    const ans = assessAns.trim();
    if (!ans || assessLoading) return;
    setAssessLoading(true);
    setAssessFeedback(null);
    try {
      const res = await fetch(API_BASE + "/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: assessQ, answer: ans })
      });
      if (res.ok) {
        const d = await res.json();
        setAssessFeedback(d);
        setAssessAns("");
        loadDbHistory();
      }
    } catch (e) {
    } finally {
      setAssessLoading(false);
    }
  };

  const handleQuizGenerate = async () => {
    if (!quizTopic.trim() || quizLoading) return;
    setQuizLoading(true);
    setQuizQuestions([]);
    setQuizAnswers({});
    setQuizSubmitted(false);
    try {
      const res = await fetch(API_BASE + "/api/tools/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: quizTopic, n: quizCount })
      });
      if (res.ok) {
        const d = await res.json();
        setQuizQuestions(d.questions || []);
      }
    } catch (e) {
    } finally {
      setQuizLoading(false);
    }
  };

  const handleQuizPick = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleQuizSubmit = async () => {
    setQuizSubmitted(true);
    const score = quizQuestions.reduce((acc, q, i) => acc + (quizAnswers[i] === q.answer ? 1 : 0), 0);
    try {
      await fetch(API_BASE + "/api/tools/quiz/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: quizTopic, score, total: quizQuestions.length })
      });
      loadDbHistory();
    } catch (e) {}
  };

  const handlePlacementMatch = async () => {
    if (placementLoading) return;
    setPlacementLoading(true);
    setPlacementResults(null);
    try {
      const skillsArray = placementSkills.split(",").map(s => s.trim()).filter(Boolean);
      const res = await fetch(API_BASE + "/api/placement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: skillsArray, interests: placementInterests })
      });
      if (res.ok) {
        const d = await res.json();
        setPlacementResults(d);
      }
    } catch (e) {
    } finally {
      setPlacementLoading(false);
    }
  };

  const handleAdmissionQuery = async () => {
    if (admissionLoading) return;
    setAdmissionLoading(true);
    setAdmissionResult(null);
    try {
      const res = await fetch(API_BASE + "/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interests: admissionInterests, background: admissionBg, goal: admissionGoal })
      });
      if (res.ok) {
        const d = await res.json();
        setAdmissionResult(d);
      }
    } catch (e) {
    } finally {
      setAdmissionLoading(false);
    }
  };

  const handleResearchSummary = async () => {
    if (!researchText.trim() || researchLoading) return;
    setResearchLoading(true);
    setResearchResult("");
    try {
      const res = await fetch(API_BASE + "/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: researchText, mode: "summarize" })
      });
      if (res.ok) {
        const d = await res.json();
        setResearchResult(d.summary || d.result || "");
      }
    } catch (e) {
      setResearchResult("⚠️ Research summarization query failed.");
    } finally {
      setResearchLoading(false);
    }
  };

  // Helper
  const strRandom = () => Math.random().toString(36).substring(2, 15);

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
        <div className="welcome relative overflow-hidden bg-gradient-to-r from-[#6366f1]/15 to-[#3b82f6]/5 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <span className="hidden sm:flex w-12 h-12 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#3b82f6] items-center justify-center shrink-0 shadow-[0_6px_20px_rgba(99,102,241,0.35)]">
              <GraduationCap className="h-6 w-6 text-white" />
            </span>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white">Welcome to AVPU Student Portal 🎓</h2>
              <p className="text-sm text-[#9aa0b8] mt-1 max-w-[620px] leading-relaxed">
                Access vector database resources, compile syllabus guides, customize roadmaps, or evaluate placements options.
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-2 text-[11px] font-bold px-3 py-1.5 rounded-full border shrink-0 ${
            llmEnabled ? "text-[#6ee7b7] bg-[#10b981]/10 border-[#10b981]/25" : "text-[#8890aa] bg-white/5 border-white/10"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${llmEnabled ? "bg-[#10b981]" : "bg-[#5b5f78]"}`} />
            {llmEnabled ? `${providerName} Online` : "Offline Mode"}
          </span>
        </div>

        {/* Syllabus / Programs Quick lookup */}
        {programsList.length > 0 ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-[#eeeef8] text-sm uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#6366f1]" /> Offered academic branches
              </h4>
              <span className="text-[11px] font-bold text-[#c7d2fe] bg-[#6366f1]/15 px-2.5 py-1 rounded-full border border-[#6366f1]/25">{programsList.length} total</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {programsList.slice(0, 6).map((prog, idx) => (
                <div key={idx} className="bg-[#0d0f0e] border border-white/5 rounded-2xl p-5 hover:border-[#6366f1]/50 transition-all">
                  <span className="text-[10px] text-[#6366f1] font-mono font-bold tracking-wider uppercase">{prog.degree}</span>
                  <h5 className="font-bold text-white text-sm mt-1">{prog.name}</h5>
                  <p className="text-xs text-[#9aa0b8] mt-2 leading-relaxed line-clamp-2">{prog.overview}</p>
                  <div className="text-[10.5px] font-mono text-[#5b5f78] mt-4 flex items-center gap-1.5"><Clock className="h-3 w-3" /> Duration: {prog.duration}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="tool-empty">
            <BookOpen className="h-8 w-8 opacity-30" />
            <p className="text-xs">Academic branch catalog is loading or unavailable right now</p>
          </div>
        )}

        {/* Quick access tiles */}
        <div className="flex flex-col gap-3">
          <h4 className="font-extrabold text-[#eeeef8] text-sm uppercase tracking-wider">Quick access</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { key: "tutor" as PanelType, label: "AI Tutor", icon: Bot },
              { key: "roadmaps" as PanelType, label: "Study Roadmaps", icon: Map },
              { key: "assessments" as PanelType, label: "Adaptive Quiz", icon: Award },
              { key: "placements" as PanelType, label: "Placements", icon: Briefcase },
              { key: "admissions" as PanelType, label: "Admissions", icon: Search },
              { key: "research" as PanelType, label: "Research", icon: FileText },
              { key: "quiz" as PanelType, label: "Quiz Yourself", icon: Layers }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActivePanel(key)}
                className="flex flex-col items-start gap-2.5 text-left bg-[#0d0f0e] border border-white/5 rounded-xl p-4 hover:border-[#6366f1]/40 hover:bg-[#12121e] transition-all cursor-pointer"
              >
                <span className="w-8 h-8 rounded-lg bg-[#6366f1]/15 text-[#c7d2fe] flex items-center justify-center">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-xs font-semibold text-white">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    ),
    tutor: (
      <div className="chat-wrap flex flex-col h-[calc(100vh-170px)] max-w-[840px] animate-[fade_0.3s_ease]">
        <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-2xl px-4 py-3 mb-3">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6366f1]/25 to-[#3b82f6]/10 flex items-center justify-center shrink-0">
            <Bot className="h-4 w-4 text-[#c7d2fe]" />
          </span>
          <div className="hidden sm:block mr-1">
            <h3 className="text-sm font-bold text-white leading-tight">Syllabus AI Tutor</h3>
            <p className="text-[11px] text-[#9aa0b8]">RAG-grounded answers from the AVPU knowledge base</p>
          </div>
          <label className="text-[10px] font-bold text-[#9aa0b8] uppercase tracking-wider ml-auto sm:ml-2">Subject</label>
          <select
            value={tutorSubject}
            onChange={(e) => setTutorSubject(e.target.value)}
            className="bg-[#0d0f0e] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#6366f1]"
          >
            {["Python Programming", "Machine Learning & AI", "Database Systems", "Computer Architecture", "Software Engineering"].map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
          <button onClick={handleNewTutorChat} className="btn bg-white/5 border border-white/10 text-xs text-white px-3 py-1.5 rounded-lg hover:bg-[#18182a] cursor-pointer">
            + New Chat
          </button>
        </div>

        <div ref={tutorScrollRef} className="chat-scroll flex-1 overflow-y-auto flex flex-col gap-4 p-2">
          {tutorMessages.map((m, i) => (
            <div key={i} className={`msg flex gap-3 max-w-[90%] ${m.role === "user" ? "self-end flex-row-reverse" : "self-start"}`}>
              <div className={`msg-ic w-[33px] h-[33px] rounded-lg flex items-center justify-center shrink-0 text-white ${
                m.role === "user" ? "bg-white/10" : "bg-gradient-to-r from-[#6366f1] to-[#3b82f6]"
              }`}>
                {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={`msg-body text-sm px-4 py-3 rounded-2xl border ${
                m.role === "user" ? "bg-[#6366f1]/10 border-[#6366f1]/25" : "bg-[#12121e] border-white/5"
              }`}>
                {formatMd(m.text)}
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-white/5 flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] text-[#5b5f78] uppercase font-bold mr-1">RAG Sources:</span>
                    {m.sources.map((s, idx) => (
                      <span key={idx} className="inline-flex text-[10px] text-[#c7d2fe] bg-[#6366f1]/15 px-2 py-0.5 rounded-md font-medium border border-[#6366f1]/20">
                        <BookMarked className="h-3 w-3 inline mr-1 self-center" /> {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {tutorLoading && (
            <div className="msg flex gap-3 self-start">
              <div className="msg-ic w-[33px] h-[33px] rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-r from-[#6366f1] to-[#3b82f6] text-white">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
              <div className="msg-body text-sm bg-[#12121e] border border-white/5 px-4 py-3 rounded-2xl flex items-center gap-2">
                Retrieving vector knowledge RAG...
              </div>
            </div>
          )}
        </div>

        <div className="chat-input flex gap-2 border-t border-white/5 pt-4 mt-2">
          <input 
            type="text" 
            value={tutorInput}
            onChange={(e) => setTutorInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTutorSend()}
            placeholder="e.g. Explain how polymorphism works with an OOP example" 
            className="flex-1 bg-[#0d0f0e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1]"
          />
          <button onClick={handleTutorSend} className="btn bg-gradient-to-r from-[#6366f1] to-[#3b82f6] text-white px-5 rounded-xl cursor-pointer">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    ),
    roadmaps: (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-[fade_0.3s_ease]">
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4 bg-white/[0.02] border border-white/5 rounded-2xl p-5 backdrop-blur-md">
            <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6366f1]/25 to-[#3b82f6]/10 flex items-center justify-center shrink-0 border border-white/10">
              <Map className="h-6 w-6 text-[#c7d2fe]" />
            </span>
            <div>
              <h3 className="text-base font-black text-white font-mono">Roadmap Builder</h3>
              <p className="text-xs text-[#9aa0b8] mt-1.5 leading-relaxed">Provide your career or academic study target to auto-compile a weekly adaptive curriculum outline.</p>
            </div>
          </div>

          <div className="bg-[#0d0f0e] border border-white/5 rounded-2xl p-6 flex flex-col gap-5 shadow-2xl">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#9aa0b8] tracking-wider block mb-2">Study Goal</label>
              <input
                type="text"
                value={roadmapGoal}
                onChange={(e) => setRoadmapGoal(e.target.value)}
                placeholder="e.g. Learn Machine learning algorithms"
                className="w-full bg-[#12121e] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#6366f1]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#9aa0b8] tracking-wider block mb-2">Difficulty level</label>
                <select
                  value={roadmapLevel}
                  onChange={(e) => setRoadmapLevel(e.target.value)}
                  className="w-full bg-[#12121e] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#6366f1]"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[#9aa0b8] tracking-wider block mb-2">Duration (Weeks)</label>
                <input
                  type="number"
                  value={roadmapWeeks}
                  onChange={(e) => setRoadmapWeeks(parseInt(e.target.value) || 8)}
                  className="w-full bg-[#12121e] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#6366f1]"
                />
              </div>
            </div>
            <button onClick={handleGenerateRoadmap} disabled={roadmapLoading} className="btn w-full bg-gradient-to-r from-[#6366f1] to-[#3b82f6] text-white font-extrabold py-4 rounded-xl cursor-pointer disabled:opacity-60 inline-flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(99,102,241,0.3)]">
              {roadmapLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Structuring curriculum...</> : <><Map className="h-4 w-4" /> Generate Weekly Roadmap</>}
            </button>
          </div>
        </div>

        <div className="console-panel bg-[#0d0f0e] border border-white/5 rounded-2xl p-6 min-h-[480px] flex flex-col shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
            <span className="text-xs font-bold text-[#9aa0b8] uppercase tracking-wider font-mono flex items-center gap-2"><Cpu className="h-4 w-4 text-[#6366f1]" /> Curriculum Compiler</span>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${roadmapLoading ? "bg-amber-500 animate-pulse" : "bg-[#10b981]"} shadow-lg`}></span>
              <span className="text-[10px] uppercase text-[#5b5f78] font-bold">{roadmapLoading ? "compiling" : "ready"}</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            {roadmapLoading ? (
              <div className="flex flex-col items-center justify-center gap-3 text-[#9aa0b8] font-mono text-xs">
                <Loader2 className="h-8 w-8 animate-spin text-[#6366f1]" />
                <p>Generating adaptive roadmap...</p>
              </div>
            ) : generatedRoadmap ? (
              <div className="flex flex-col gap-5 animate-[fade_0.3s_ease]">
                <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2 text-xs">
                  <h4 className="font-extrabold text-white text-xs">{generatedRoadmap.target}</h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#6366f1]/15 text-[#c7d2fe] border border-[#6366f1]/25">{generatedRoadmap.level.toUpperCase()}</span>
                </div>
                <div className="flex flex-col gap-3 max-h-[360px] overflow-y-auto pr-1">
                  {generatedRoadmap.outline && generatedRoadmap.outline.map((o: any, idx: number) => (
                    <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#6366f1]/15 text-[#c7d2fe] flex items-center justify-center font-bold font-mono text-xs shrink-0 border border-[#6366f1]/20">
                        W{o.week}
                      </div>
                      <div>
                        <h5 className="font-bold text-white text-xs md:text-sm">{o.topic}</h5>
                        <p className="text-[11px] text-[#9aa0b8] mt-1">Focus: {o.focus}</p>
                        <p className="text-[11px] text-[#6ee7b7] font-semibold mt-1 flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> Weekly Target: {o.project}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 text-[#5b5f78]">
                <Map className="h-10 w-10 opacity-20" />
                <p className="text-xs text-center max-w-[220px]">Fill in your goal above to compile your personalized learning path.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    assessments: (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-[fade_0.3s_ease]">
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4 bg-white/[0.02] border border-white/5 rounded-2xl p-5 backdrop-blur-md">
            <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6366f1]/25 to-[#3b82f6]/10 flex items-center justify-center shrink-0 border border-white/10">
              <Award className="h-6 w-6 text-[#c7d2fe]" />
            </span>
            <div>
              <h3 className="text-base font-black text-white font-mono">Adaptive Assessment</h3>
              <p className="text-xs text-[#9aa0b8] mt-1.5 leading-relaxed">Evaluate your understanding. Pick a core concept question and draft your explanation to get graded feedback.</p>
            </div>
          </div>

          <div className="bg-[#0d0f0e] border border-white/5 rounded-2xl p-6 flex flex-col gap-4 shadow-2xl">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#9aa0b8] tracking-wider block mb-2">Assessment Question</label>
              <select
                value={assessQ}
                onChange={(e) => setAssessQ(e.target.value)}
                className="w-full bg-[#12121e] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#6366f1]"
              >
                {[
                  "What is the difference between compiler and interpreter?",
                  "Explain the ACID properties in database management systems.",
                  "What is overfitting in machine learning and how do you prevent it?",
                  "Describe the difference between process and thread in OS."
                ].map(q => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-[#9aa0b8] tracking-wider block mb-2">Your Answer</label>
              <textarea
                rows={5}
                value={assessAns}
                onChange={(e) => setAssessAns(e.target.value)}
                placeholder="Explain the concept in your own words..."
                className="w-full bg-[#12121e] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#6366f1] resize-none"
              />
            </div>
            <button onClick={handleAssessSubmit} disabled={assessLoading} className="btn w-full bg-gradient-to-r from-[#6366f1] to-[#3b82f6] text-white font-extrabold py-4 rounded-xl cursor-pointer disabled:opacity-60 inline-flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(99,102,241,0.3)]">
              {assessLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Evaluating answer...</> : <><Award className="h-4 w-4" /> Submit Assessment</>}
            </button>
          </div>
        </div>

        <div className="console-panel bg-[#0d0f0e] border border-white/5 rounded-2xl p-6 min-h-[480px] flex flex-col shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
            <span className="text-xs font-bold text-[#9aa0b8] uppercase tracking-wider font-mono flex items-center gap-2"><Cpu className="h-4 w-4 text-[#6366f1]" /> Evaluator Console</span>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${assessLoading ? "bg-amber-500 animate-pulse" : "bg-[#10b981]"} shadow-lg`}></span>
              <span className="text-[10px] uppercase text-[#5b5f78] font-bold">{assessLoading ? "evaluating" : "ready"}</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            {assessLoading ? (
              <div className="flex flex-col items-center justify-center gap-3 text-[#9aa0b8] font-mono text-xs">
                <Loader2 className="h-8 w-8 animate-spin text-[#6366f1]" />
                <p>Auditing response parameters...</p>
              </div>
            ) : assessFeedback ? (
              <div className="flex flex-col gap-4 animate-[fade_0.2s_ease]">
                <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2 text-xs">
                  <span className="text-xs font-extrabold text-white">Grade: {assessFeedback.grade}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#10b981]/10 text-[#6ee7b7] border border-[#10b981]/20">Points: {assessFeedback.points}/10</span>
                </div>
                <div className="bg-white/[0.01] border border-white/5 rounded-xl p-5 text-xs md:text-sm text-[#9aa0b8] leading-relaxed">{assessFeedback.feedback}</div>
                {assessFeedback.model_answer && (
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                    <span className="text-[10px] uppercase font-bold text-[#5b5f78] font-mono">Reference Model Answer</span>
                    <p className="text-[11px] text-[#9aa0b8] mt-2 leading-relaxed">{assessFeedback.model_answer}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 text-[#5b5f78]">
                <Award className="h-10 w-10 opacity-20" />
                <p className="text-xs text-center max-w-[220px]">Submit your written response to view the AI model alignment score.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    ),


    placements: (
      <div className="flex flex-col gap-6 max-w-[820px] animate-[fade_0.3s_ease]">
        <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1]/25 to-[#3b82f6]/10 flex items-center justify-center shrink-0">
            <Briefcase className="h-5 w-5 text-[#c7d2fe]" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-white">Placements Matcher</h3>
            <p className="text-xs text-[#9aa0b8] mt-1 leading-relaxed">
              Input your coding skills and career interests. The corporate placement agent matches you with partner companies currently hiring from AVPU.
            </p>
          </div>
        </div>

        <div className="form-card bg-[#0d0f0e] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11.5px] font-bold uppercase tracking-wider text-[#9aa0b8] block mb-1.5">Your Skills (Comma-separated)</label>
              <input
                type="text"
                value={placementSkills}
                onChange={(e) => setPlacementSkills(e.target.value)}
                placeholder="e.g. Python, SQL, Java, React"
                className="w-full bg-[#12121e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1]"
              />
            </div>
            <div>
              <label className="text-[11.5px] font-bold uppercase tracking-wider text-[#9aa0b8] block mb-1.5">Your Career Interests</label>
              <input
                type="text"
                value={placementInterests}
                onChange={(e) => setPlacementInterests(e.target.value)}
                placeholder="e.g. Backend developer, systems engineer"
                className="w-full bg-[#12121e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1]"
              />
            </div>
          </div>
          <button onClick={handlePlacementMatch} disabled={placementLoading} className="btn w-full bg-gradient-to-r from-[#6366f1] to-[#3b82f6] text-white font-semibold py-3.5 rounded-xl cursor-pointer disabled:opacity-60 inline-flex items-center justify-center gap-2">
            {placementLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Matching placements...</> : <><Briefcase className="h-4 w-4" /> Match Corporate Placements</>}
          </button>
        </div>

        {!placementResults && !placementLoading && (
          <div className="tool-empty">
            <Briefcase className="h-8 w-8 opacity-30" />
            <p className="text-xs">Fill the form above to see matched corporate placements</p>
          </div>
        )}

        {placementResults && (
          <div className="result-card bg-[#12121e] border border-white/5 rounded-2xl overflow-hidden">
            <div className="result-hdr-bar">
              <span className="text-[11px] uppercase font-bold text-[#9aa0b8] tracking-wider">Matched Corporate Placements</span>
              <span className="text-[11px] font-bold text-[#c7d2fe] bg-[#6366f1]/15 px-2.5 py-1 rounded-full border border-[#6366f1]/25">{placementResults.matches?.length || 0} matches</span>
            </div>
            <div className="p-6 flex flex-col gap-4">
              {placementResults.matches && placementResults.matches.map((match: any, idx: number) => (
                <div key={idx} className="bg-[#0d0f0e] border border-white/5 rounded-xl p-4 flex justify-between items-center gap-4">
                  <div className="flex items-start gap-3">
                    <span className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0 text-[#9aa0b8]">
                      <Building2 className="h-4 w-4" />
                    </span>
                    <div>
                      <h5 className="font-bold text-white text-sm">{match.company}</h5>
                      <p className="text-xs text-[#9aa0b8] mt-1">Role: {match.role}</p>
                      <p className="text-[10px] text-[#5b5f78] mt-1 flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {match.location} · Package: {match.salary_lpa} LPA</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#6ee7b7] bg-[#10b981]/15 px-3 py-1 rounded-full border border-[#10b981]/25">
                      <TrendingUp className="h-3 w-3" /> {match.score}%
                    </span>
                  </div>
                </div>
              ))}
              {placementResults.tips && (
                <div className="bg-[#12121e] border border-white/5 rounded-xl p-4 mt-2">
                  <h5 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-[#6366f1]" /> AI Placement Prep Tips</h5>
                  <p className="text-xs text-[#9aa0b8] mt-2 leading-relaxed">{placementResults.tips}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    ),
    admissions: (
      <div className="flex flex-col gap-6 max-w-[820px] animate-[fade_0.3s_ease]">
        <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1]/25 to-[#3b82f6]/10 flex items-center justify-center shrink-0">
            <Search className="h-5 w-5 text-[#c7d2fe]" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-white">Admissions Counselor</h3>
            <p className="text-xs text-[#9aa0b8] mt-1 leading-relaxed">
              Provide your interests, educational background, and goals. The admissions counselor agent recommends eligible AVPU branches.
            </p>
          </div>
        </div>

        <div className="form-card bg-[#0d0f0e] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11.5px] font-bold uppercase tracking-wider text-[#9aa0b8] block mb-1.5">Your Academic Interests</label>
              <input
                type="text"
                value={admissionInterests}
                onChange={(e) => setAdmissionInterests(e.target.value)}
                className="w-full bg-[#12121e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1]"
              />
            </div>
            <div>
              <label className="text-[11.5px] font-bold uppercase tracking-wider text-[#9aa0b8] block mb-1.5">Your Educational Background</label>
              <input
                type="text"
                value={admissionBg}
                onChange={(e) => setAdmissionBg(e.target.value)}
                className="w-full bg-[#12121e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1]"
              />
            </div>
          </div>
          <div>
            <label className="text-[11.5px] font-bold uppercase tracking-wider text-[#9aa0b8] block mb-1.5">Your Career Goal</label>
            <input
              type="text"
              value={admissionGoal}
              onChange={(e) => setAdmissionGoal(e.target.value)}
              className="w-full bg-[#12121e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1]"
            />
          </div>
          <button onClick={handleAdmissionQuery} disabled={admissionLoading} className="btn w-full bg-gradient-to-r from-[#6366f1] to-[#3b82f6] text-white font-semibold py-3.5 rounded-xl cursor-pointer disabled:opacity-60 inline-flex items-center justify-center gap-2">
            {admissionLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Checking eligibility...</> : <><Search className="h-4 w-4" /> Query Program Eligibility</>}
          </button>
        </div>

        {!admissionResult && !admissionLoading && (
          <div className="tool-empty">
            <Search className="h-8 w-8 opacity-30" />
            <p className="text-xs">Fill the form above to get branch recommendations</p>
          </div>
        )}

        {admissionResult && (
          <div className="result-card bg-[#12121e] border border-white/5 rounded-2xl overflow-hidden">
            <div className="result-hdr-bar">
              <span className="text-[11px] uppercase font-bold text-[#9aa0b8] tracking-wider">Admission Counseling Recommendations</span>
              <span className="ai-pill"><Sparkles className="h-3 w-3" /> AI Generated</span>
            </div>
            <div className="p-6 flex flex-col gap-4">
              {admissionResult.matches && admissionResult.matches.map((m: any, idx: number) => (
                <div key={idx} className="bg-[#0d0f0e] border border-white/5 rounded-xl p-4">
                  <span className="text-[9.5px] text-[#6366f1] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5"><GraduationCap className="h-3 w-3" /> {m.degree}</span>
                  <h5 className="font-bold text-white text-sm mt-1">{m.program_name}</h5>
                  <p className="text-xs text-[#9aa0b8] mt-2 leading-relaxed">Overview: {m.overview}</p>
                  <p className="text-xs text-[#6ee7b7] font-semibold mt-2 flex items-start gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" /> Why it fits you: {m.fit_reason}</p>
                </div>
              ))}
              {admissionResult.counsel_advice && (
                <div className="bg-[#12121e] border border-white/5 rounded-xl p-4 mt-2">
                  <h5 className="font-bold text-xs text-white uppercase tracking-wider">Admissions Counselor Advice</h5>
                  <p className="text-xs text-[#9aa0b8] mt-2 leading-relaxed">{admissionResult.counsel_advice}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    ),
    research: (
      <div className="flex flex-col gap-6 max-w-[820px] animate-[fade_0.3s_ease]">
        <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1]/25 to-[#3b82f6]/10 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5 text-[#c7d2fe]" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-white">Research Abstract Summarizer</h3>
            <p className="text-xs text-[#9aa0b8] mt-1 leading-relaxed">
              Paste a large technical paper abstract or academic writing text to summarize key definitions and concepts.
            </p>
          </div>
        </div>

        <div className="form-card bg-[#0d0f0e] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
          <div>
            <label className="text-[11.5px] font-bold uppercase tracking-wider text-[#9aa0b8] block mb-1.5">Research Paper Text</label>
            <textarea
              rows={8}
              value={researchText}
              onChange={(e) => setResearchText(e.target.value)}
              placeholder="Paste text here..."
              className="w-full bg-[#12121e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1] resize-y"
            />
          </div>
          <button onClick={handleResearchSummary} disabled={researchLoading} className="btn w-full bg-gradient-to-r from-[#6366f1] to-[#3b82f6] text-white font-semibold py-3.5 rounded-xl disabled:opacity-50 cursor-pointer inline-flex items-center justify-center gap-2">
            {researchLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Compiling definitions...</> : <><FileText className="h-4 w-4" /> Analyze Technical Paper</>}
          </button>
        </div>

        {!researchResult && !researchLoading && (
          <div className="tool-empty">
            <FileText className="h-8 w-8 opacity-30" />
            <p className="text-xs">Paste text above and analyze to get a structured summary</p>
          </div>
        )}

        {researchResult && (
          <div className="result-card bg-[#12121e] border border-white/5 rounded-2xl overflow-hidden">
            <div className="result-hdr-bar">
              <span className="text-[11px] uppercase font-bold text-[#9aa0b8] tracking-wider">Summary</span>
              <span className="ai-pill"><Sparkles className="h-3 w-3" /> AI Generated</span>
            </div>
            <div className="result-text p-6 text-sm leading-relaxed">
              {formatMd(researchResult)}
            </div>
          </div>
        )}
      </div>
    ),
    quiz: (
      <div className="flex flex-col gap-6 max-w-[820px] animate-[fade_0.3s_ease]">
        <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1]/25 to-[#3b82f6]/10 flex items-center justify-center shrink-0">
            <Layers className="h-5 w-5 text-[#c7d2fe]" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-white">Quiz Yourself</h3>
            <p className="text-xs text-[#9aa0b8] mt-1 leading-relaxed">
              Generate an interactive multiple-choice quiz on any topic and test yourself instantly.
            </p>
          </div>
        </div>

        <div className="form-card bg-[#0d0f0e] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_120px] gap-4">
            <div>
              <label className="text-[11.5px] font-bold uppercase tracking-wider text-[#9aa0b8] block mb-1.5">Topic</label>
              <input
                type="text"
                value={quizTopic}
                onChange={(e) => setQuizTopic(e.target.value)}
                placeholder="Topic e.g. Operating Systems"
                className="w-full bg-[#12121e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1]"
              />
            </div>
            <div>
              <label className="text-[11.5px] font-bold uppercase tracking-wider text-[#9aa0b8] block mb-1.5">Questions</label>
              <input
                type="number"
                min={3}
                max={10}
                value={quizCount}
                onChange={(e) => setQuizCount(Number(e.target.value))}
                className="w-full bg-[#12121e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1]"
              />
            </div>
          </div>
          <button onClick={handleQuizGenerate} disabled={quizLoading} className="btn w-full bg-gradient-to-r from-[#6366f1] to-[#3b82f6] text-white font-semibold py-3.5 rounded-xl disabled:opacity-50 cursor-pointer inline-flex items-center justify-center gap-2">
            {quizLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating quiz...</> : <><Layers className="h-4 w-4" /> Generate Quiz</>}
          </button>
        </div>

        {quizQuestions.length === 0 && !quizLoading && (
          <div className="tool-empty">
            <Layers className="h-8 w-8 opacity-30" />
            <p className="text-xs">Enter a topic above to generate a quiz</p>
          </div>
        )}

        {quizQuestions.length > 0 && (
          <div className="flex flex-col gap-5">
            {quizQuestions.map((q, qi) => (
              <div key={qi} className="bg-[#0d0f0e] border border-white/5 rounded-2xl p-6">
                <div className="text-sm font-bold text-white mb-3">{qi + 1}. {q.question}</div>
                <div className="flex flex-col gap-2">
                  {(q.options || []).map((opt: string, oi: number) => {
                    const picked = quizAnswers[qi] === oi;
                    const correct = quizSubmitted && oi === q.answer;
                    const wrong = quizSubmitted && picked && oi !== q.answer;
                    return (
                      <button
                        key={oi}
                        onClick={() => handleQuizPick(qi, oi)}
                        className={`flex items-center justify-between gap-2 text-left text-xs px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
                          correct ? "bg-[#10b981]/15 border-[#10b981]/40 text-[#6ee7b7]" :
                          wrong ? "bg-rose-500/15 border-rose-500/40 text-rose-300" :
                          picked ? "bg-[#6366f1]/15 border-[#6366f1]/40 text-[#c7d2fe]" :
                          "bg-[#12121e] border-white/10 text-[#c8bdc0] hover:border-white/25"
                        }`}
                      >
                        <span>{opt}</span>
                        {correct && <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />}
                        {wrong && <XCircle className="h-3.5 w-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                {quizSubmitted && q.explanation && (
                  <div className="text-[11px] text-[#9aa0b8] mt-3">💡 {q.explanation}</div>
                )}
              </div>
            ))}
            {!quizSubmitted ? (
              <button onClick={handleQuizSubmit} className="btn w-full bg-gradient-to-r from-[#6366f1] to-[#3b82f6] text-white font-semibold py-3.5 rounded-xl cursor-pointer">
                Submit Quiz
              </button>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 text-center bg-[#0d0f0e] border border-white/5 rounded-2xl p-8">
                <Trophy className="h-8 w-8 text-[#fcd34d]" />
                <div className="text-lg font-black text-white mt-1">
                  Score: {quizQuestions.reduce((acc, q, i) => acc + (quizAnswers[i] === q.answer ? 1 : 0), 0)} / {quizQuestions.length}
                </div>
                <p className="text-xs text-[#9aa0b8]">Saved to your quiz history</p>
              </div>
            )}
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
            <span className="logo-icon w-[34px] h-[34px] rounded-[10px] grid place-items-center text-white bg-gradient-to-br from-[#6366f1] to-[#3b82f6] shadow-[0_6px_16px_rgba(99,102,241,0.3)]">
              <GraduationCap className="h-4 w-4" />
            </span>
            <span className="text-white">AVP <span className="text-[#c7d2fe]">University</span></span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/50 hover:text-white transition-all cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="side-nav flex flex-col gap-1.5 flex-1">
          {[
            { key: "dashboard" as PanelType, label: "Dashboard", icon: LayoutDashboard },
            { key: "tutor" as PanelType, label: "Syllabus AI Tutor", icon: Bot },
            { key: "roadmaps" as PanelType, label: "Study Roadmaps", icon: Map },
            { key: "assessments" as PanelType, label: "Adaptive Quiz", icon: Award },
            { key: "placements" as PanelType, label: "Placements Matcher", icon: Briefcase },
            { key: "admissions" as PanelType, label: "Admissions Counselor", icon: Search },
            { key: "research" as PanelType, label: "Research Abstract", icon: FileText },
            { key: "quiz" as PanelType, label: "Quiz Yourself", icon: Layers }
          ].map(({ key, label, icon: Icon }) => {
            const active = activePanel === key;
            return (
              <button
                key={key}
                onClick={() => { setActivePanel(key); setSidebarOpen(false); }}
                className={`nav-item flex items-center gap-3 pl-3.5 pr-4 py-2.5 rounded-xl text-left text-xs font-semibold border-l-2 cursor-pointer transition-all ${
                  active
                    ? "bg-[#6366f1]/15 text-[#c7d2fe] border-[#6366f1]"
                    : "border-transparent text-[#8890aa] hover:bg-[#12121e] hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${active ? "text-[#c7d2fe]" : "text-[#8890aa]"}`} />
                <span>{label}</span>
              </button>
            );
          })}

          {historySessions.length > 0 && (
            <div className="flex flex-col gap-1 mt-4">
              <span className="text-[10px] text-[#5b5f78] uppercase font-bold px-4 mb-1">Past learning chats</span>
              {historySessions.slice(0, 4).map(s => (
                <button 
                  key={s.session_id} 
                  onClick={() => handleSelectSession(s)}
                  className="flex items-center gap-2 text-left text-[11px] text-[#8890aa] hover:text-[#eeeef8] px-4 py-1.5 rounded-lg border-none bg-transparent cursor-pointer line-clamp-1 w-full truncate"
                >
                  <BookMarked className="h-3 w-3 shrink-0" /> {s.subject}
                </button>
              ))}
            </div>
          )}
        </nav>

        <div className="side-foot flex flex-col gap-3 pt-4 border-t border-white/5 mt-auto"><button onClick={() => setSettingsOpen(true)} className="nav-item flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-semibold border-none cursor-pointer transition-all text-[#8890aa] hover:bg-[#12121e] hover:text-white"> <Settings className="h-4 w-4" /> API Settings </button>
          <div className={`sysbadge flex items-center gap-2 text-[10.5px] font-mono rounded-lg border p-2.5 transition-all duration-300 ${
            llmEnabled ? "text-[#6366f1] border-[#6366f1]/30 bg-[#6366f1]/5" : "text-[#8890aa] border-white/5 bg-[#12121e]"
          }`}>
            <i className={`fas fa-circle ${llmEnabled ? "text-[#6366f1]" : "text-[#5b5f78]"} text-[6px]`}></i>
            {llmEnabled ? "LLM Tutor Ready" : "Offline Mode"}
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
            <p className="text-xs text-[#9aa0b8] mt-0.5">AVPU Student Workspace Suite</p>
          </div>
          <div className="ml-auto hidden md:block">
            <span className="prov-chip font-mono text-[11px] font-semibold text-[#c7d2fe] bg-[#6366f1]/10 border border-[#6366f1]/25 px-3 py-1.5 rounded-full">
              <Cpu className="h-3 w-3 inline mr-1.5" />
              {llmEnabled ? providerName : "Offline AI Engine"} · {ragBackend.split(" ")[0]} RAG
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
