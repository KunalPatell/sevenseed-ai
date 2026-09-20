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
  MapPin,
  QrCode,
  UserCheck,
  Timer,
  Flame,
  Zap,
  Heart,
  Code2,
  Terminal,
  Brain,
  Lightbulb,
  Compass,
  Rocket,
  Split,
  Play,
  Copy,
  Check,
  RotateCcw,
  Network,
  Share2,
  CheckCircle,
  AlertCircle
} from "lucide-react";

// This dashboard is served under the "/avpu" path when merged into the
// Sevenseed hub (see apps/sevenseed/backend/child_processes.py); its own API
// calls must go through that same prefix, not root-relative "/api/...".
const API_BASE = "/avpu";

type PanelType =
  | "dashboard"
  | "tutor"
  | "mindmap"
  | "codelab"
  | "challenges100"
  | "mentalmodels"
  | "lawsofux"
  | "teardowns"
  | "roadmaps"
  | "assessments"
  | "placements"
  | "admissions"
  | "research"
  | "quiz"
  | "attendance";

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

  // Attendance — QR/OTP session check-in (faculty generates a code, students check in with it)
  const [sessionSubject, setSessionSubject] = useState("Data Structures");
  const [sessionDuration, setSessionDuration] = useState(5);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionCode, setSessionCode] = useState("");
  const [sessionExpiresAt, setSessionExpiresAt] = useState<string>("");
  const [sessionSecondsLeft, setSessionSecondsLeft] = useState(0);
  const [checkinCode, setCheckinCode] = useState("");
  const [checkinEmail, setCheckinEmail] = useState("");
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [checkinResult, setCheckinResult] = useState<{ ok: boolean; message: string } | null>(null);

  // Duolingo Gamification State
  const [userStreak, setUserStreak] = useState(5);
  const [userXP, setUserXP] = useState(380);
  const [userHearts, setUserHearts] = useState(5);
  const [userLeague, setUserLeague] = useState("Gold Scholar");

  // LearnAnything Mindmap
  const [mindmapTopic, setMindmapTopic] = useState("Autonomous AI Agents");
  const [mindmapData, setMindmapData] = useState<any>(null);
  const [mindmapLoading, setMindmapLoading] = useState(false);
  const [activeMindmapNode, setActiveMindmapNode] = useState<any>(null);

  // freeCodeCamp Code Lab
  const [codeChallenges, setCodeChallenges] = useState<any[]>([]);
  const [activeChallengeIdx, setActiveChallengeIdx] = useState(0);
  const [editorCode, setEditorCode] = useState("");
  const [codeExecuting, setCodeExecuting] = useState(false);
  const [codeResult, setCodeResult] = useState<any>(null);

  // 100 Days AI Challenge
  const [challenges100, setChallenges100] = useState<any[]>([]);
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [challengeSubmission, setChallengeSubmission] = useState("");
  const [submittingChallenge, setSubmittingChallenge] = useState(false);
  const [completedDays, setCompletedDays] = useState<number[]>([1, 2]);

  // Mental Models Library (fs.blog)
  const [mentalModels, setMentalModels] = useState<any[]>([]);
  const [modelCategory, setModelCategory] = useState("all");
  const [modelSearch, setModelSearch] = useState("");
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [modelProblemInput, setModelProblemInput] = useState("");
  const [modelAnalysisResult, setModelAnalysisResult] = useState("");
  const [analyzingModel, setAnalyzingModel] = useState(false);

  // Laws of UX (lawsofux.com)
  const [lawsList, setLawsList] = useState<any[]>([]);
  const [uxConceptInput, setUxConceptInput] = useState("");
  const [uxAuditResult, setUxAuditResult] = useState("");
  const [auditingUx, setAuditingUx] = useState(false);

  // Growth & Marketing Teardowns (MarketingExamples / GrowthInReverse)
  const [teardownsList, setTeardownsList] = useState<any[]>([]);
  const [teardownFilter, setTeardownFilter] = useState("all");
  const [teardownInput, setTeardownInput] = useState("");
  const [teardownResult, setTeardownResult] = useState("");
  const [analyzingTeardown, setAnalyzingTeardown] = useState(false);

  // DB History lists
  const [historySessions, setHistorySessions] = useState<LearningSession[]>([]);
  const [historyRoadmaps, setHistoryRoadmaps] = useState<StudyRoadmap[]>([]);
  const [historyAssessments, setHistoryAssessments] = useState<AssessmentItem[]>([]);

  useEffect(() => {
    loadHealthAndPrograms();
    loadDbHistory();
    loadReferenceTools();

    const storedStreak = localStorage.getItem("avpu_streak");
    if (storedStreak) setUserStreak(parseInt(storedStreak, 10));
    const storedXP = localStorage.getItem("avpu_xp");
    if (storedXP) setUserXP(parseInt(storedXP, 10));
    const storedHearts = localStorage.getItem("avpu_hearts");
    if (storedHearts) setUserHearts(parseInt(storedHearts, 10));
    const storedDays = localStorage.getItem("avpu_completed_days");
    if (storedDays) {
      try { setCompletedDays(JSON.parse(storedDays)); } catch (e) {}
    }
  }, []);

  const awardXP = (pts: number) => {
    setUserXP(prev => {
      const next = prev + pts;
      localStorage.setItem("avpu_xp", String(next));
      return next;
    });
  };

  const loadReferenceTools = async () => {
    try {
      // Mindmap
      fetch(API_BASE + "/api/tools/mindmap?topic=Autonomous+AI+Agents")
        .then(r => r.ok ? r.json() : null)
        .then(d => { if (d?.mindmap) setMindmapData(d.mindmap); });

      // Code challenges
      fetch(API_BASE + "/api/tools/code-challenges")
        .then(r => r.ok ? r.json() : null)
        .then(d => {
          if (d?.challenges?.length) {
            setCodeChallenges(d.challenges);
            setEditorCode(d.challenges[0].starter_code);
          }
        });

      // 100 days AI
      fetch(API_BASE + "/api/tools/challenge-100")
        .then(r => r.ok ? r.json() : null)
        .then(d => { if (d?.challenges?.length) setChallenges100(d.challenges); });

      // Laws of UX
      fetch(API_BASE + "/api/tools/laws-of-ux")
        .then(r => r.ok ? r.json() : null)
        .then(d => { if (d?.laws?.length) setLawsList(d.laws); });

      // Mental models
      fetch(API_BASE + "/api/tools/mental-models")
        .then(r => r.ok ? r.json() : null)
        .then(d => { if (d?.models?.length) setMentalModels(d.models); });

      // Teardowns
      fetch(API_BASE + "/api/tools/teardowns")
        .then(r => r.ok ? r.json() : null)
        .then(d => { if (d?.teardowns?.length) setTeardownsList(d.teardowns); });
    } catch (e) {
      console.warn("Reference tools fetch fallback", e);
    }
  };

  useEffect(() => {
    if (tutorScrollRef.current) {
      tutorScrollRef.current.scrollTop = tutorScrollRef.current.scrollHeight;
    }
  }, [tutorMessages]);

  // Countdown for the active attendance session code
  useEffect(() => {
    if (!sessionExpiresAt) {
      setSessionSecondsLeft(0);
      return;
    }
    const tick = () => {
      const left = Math.round((new Date(sessionExpiresAt + "Z").getTime() - Date.now()) / 1000);
      setSessionSecondsLeft(Math.max(0, left));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [sessionExpiresAt]);

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

  const handleGenerateSession = async () => {
    if (!sessionSubject.trim() || sessionLoading) return;
    setSessionLoading(true);
    try {
      const res = await fetch(API_BASE + "/api/attendance/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: sessionSubject, duration_minutes: sessionDuration })
      });
      if (res.ok) {
        const d = await res.json();
        setSessionCode(d.code);
        setSessionExpiresAt(d.expires_at);
      }
    } catch (e) {
    } finally {
      setSessionLoading(false);
    }
  };

  const handleCheckin = async () => {
    const code = checkinCode.trim();
    const email = checkinEmail.trim();
    if (!code || !email || checkinLoading) return;
    setCheckinLoading(true);
    setCheckinResult(null);
    try {
      const res = await fetch(API_BASE + "/api/attendance/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, email })
      });
      const d = await res.json();
      if (res.ok) {
        setCheckinResult({ ok: true, message: `Checked in for ${d.subject}.` });
        setCheckinCode("");
      } else {
        setCheckinResult({ ok: false, message: d.detail || "Check-in failed." });
      }
    } catch (e) {
      setCheckinResult({ ok: false, message: "Server offline. Please try again." });
    } finally {
      setCheckinLoading(false);
    }
  };

  // Reference Tools Handlers
  const handleSearchMindmap = async () => {
    if (!mindmapTopic.trim() || mindmapLoading) return;
    setMindmapLoading(true);
    try {
      const res = await fetch(API_BASE + "/api/tools/mindmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: mindmapTopic })
      });
      if (res.ok) {
        const d = await res.json();
        if (d.mindmap) {
          setMindmapData(d.mindmap);
          setActiveMindmapNode(d.mindmap.nodes?.[0] || null);
          awardXP(15);
        }
      }
    } catch (e) {
    } finally {
      setMindmapLoading(false);
    }
  };

  const handleRunCode = async () => {
    if (!editorCode.trim() || codeExecuting) return;
    setCodeExecuting(true);
    setCodeResult(null);
    try {
      const ch = codeChallenges[activeChallengeIdx] || { id: "custom" };
      const res = await fetch(API_BASE + "/api/tools/code-execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challenge_id: ch.id, code: editorCode })
      });
      if (res.ok) {
        const d = await res.json();
        setCodeResult(d);
        if (d.passed) awardXP(d.xp_earned || 75);
      }
    } catch (e) {
      setCodeResult({ passed: false, message: "Code runner offline" });
    } finally {
      setCodeExecuting(false);
    }
  };

  const handleSubmitChallenge = async () => {
    if (!challengeSubmission.trim() || submittingChallenge) return;
    setSubmittingChallenge(true);
    try {
      const ch = challenges100[activeDayIdx] || { day: activeDayIdx + 1 };
      const res = await fetch(API_BASE + "/api/tools/challenge-100/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ day: ch.day, submission: challengeSubmission })
      });
      if (res.ok) {
        const d = await res.json();
        awardXP(d.xp_awarded || 50);
        setCompletedDays(prev => {
          const next = [...new Set([...prev, ch.day])];
          localStorage.setItem("avpu_completed_days", JSON.stringify(next));
          return next;
        });
        setChallengeSubmission("");
      }
    } catch (e) {
    } finally {
      setSubmittingChallenge(false);
    }
  };

  const handleApplyMentalModel = async () => {
    if (!modelProblemInput.trim() || analyzingModel || !selectedModel) return;
    setAnalyzingModel(true);
    setModelAnalysisResult("");
    try {
      const res = await fetch(API_BASE + "/api/tools/mental-model/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model_id: selectedModel.id, problem: modelProblemInput })
      });
      if (res.ok) {
        const d = await res.json();
        setModelAnalysisResult(d.analysis || "");
        awardXP(25);
      }
    } catch (e) {
      setModelAnalysisResult("Failed to analyze problem through this mental model.");
    } finally {
      setAnalyzingModel(false);
    }
  };

  const handleAuditUx = async () => {
    if (!uxConceptInput.trim() || auditingUx) return;
    setAuditingUx(true);
    setUxAuditResult("");
    try {
      const res = await fetch(API_BASE + "/api/tools/laws-of-ux/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concept: uxConceptInput })
      });
      if (res.ok) {
        const d = await res.json();
        setUxAuditResult(d.audit || "");
        awardXP(25);
      }
    } catch (e) {
      setUxAuditResult("UX Audit service unavailable.");
    } finally {
      setAuditingUx(false);
    }
  };

  const handleAnalyzeTeardown = async () => {
    if (!teardownInput.trim() || analyzingTeardown) return;
    setAnalyzingTeardown(true);
    setTeardownResult("");
    try {
      const res = await fetch(API_BASE + "/api/tools/teardowns/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concept: teardownInput })
      });
      if (res.ok) {
        const d = await res.json();
        setTeardownResult(d.teardown || "");
        awardXP(25);
      }
    } catch (e) {
      setTeardownResult("Teardown analysis failed.");
    } finally {
      setAnalyzingTeardown(false);
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
              { key: "quiz" as PanelType, label: "Quiz Yourself", icon: Layers },
              { key: "attendance" as PanelType, label: "Attendance", icon: QrCode }
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
              {/* These read the fields the backend actually returns. They used to
                  read match.company / match.role / match.location / match.salary_lpa
                  / match.score — none of which exist in agents.match_placement, so
                  every card rendered a blank company and "undefined%". The real
                  keys are name / sector / city / roles / match, plus matched_skills
                  and missing_skills, which were never shown at all.

                  The missing skills lead now rather than the percentage: a number
                  tells a student nothing they can act on, and labelling students
                  with scores is the part of learning analytics that DPDP treats as
                  profiling. The gap list is the useful half and it was already
                  being computed. */}
              {placementResults.matches && placementResults.matches.map((match: any, idx: number) => (
                <div key={idx} className="bg-[#0d0f0e] border border-white/5 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-start gap-3">
                      <span className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0 text-[#9aa0b8]">
                        <Building2 className="h-4 w-4" />
                      </span>
                      <div>
                        <h5 className="font-bold text-white text-sm">{match.name}</h5>
                        <p className="text-xs text-[#9aa0b8] mt-1">
                          {Array.isArray(match.roles) ? match.roles.join(" · ") : match.roles}
                        </p>
                        <p className="text-[10px] text-[#5b5f78] mt-1 flex items-center gap-1.5">
                          <MapPin className="h-3 w-3" /> {match.city}{match.sector ? ` · ${match.sector}` : ""}
                        </p>
                      </div>
                    </div>
                    {typeof match.match === "number" && (
                      <span className="shrink-0 inline-flex items-center gap-1.5 text-[11px] font-bold text-[#6ee7b7] bg-[#10b981]/15 px-3 py-1 rounded-full border border-[#10b981]/25">
                        <TrendingUp className="h-3 w-3" /> {match.match}% fit
                      </span>
                    )}
                  </div>

                  {(match.missing_skills?.length > 0 || match.matched_skills?.length > 0) && (
                    <div className="border-t border-white/5 pt-3 flex flex-col gap-2">
                      {match.missing_skills?.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] uppercase font-bold text-[#fca5a5] tracking-wider mr-1">To learn</span>
                          {match.missing_skills.map((s: string) => (
                            <span key={s} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f87171]/10 border border-[#f87171]/25 text-[#fca5a5]">{s}</span>
                          ))}
                        </div>
                      )}
                      {match.matched_skills?.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] uppercase font-bold text-[#6ee7b7] tracking-wider mr-1">You have</span>
                          {match.matched_skills.map((s: string) => (
                            <span key={s} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#10b981]/10 border border-[#10b981]/25 text-[#6ee7b7]">{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {placementResults.skill_gaps?.length > 0 && (
                <div className="bg-[#12121e] border border-[#6366f1]/25 rounded-xl p-4">
                  <h5 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-[#6366f1]" /> Learn these first
                  </h5>
                  <p className="text-[11px] text-[#9aa0b8] mt-1.5">
                    The skills asked for most often across the roles above.
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {placementResults.skill_gaps.map((s: string) => (
                      <span key={s} className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#6366f1]/12 border border-[#6366f1]/30 text-[#c7d2fe]">{s}</span>
                    ))}
                  </div>
                </div>
              )}
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
    ),
    attendance: (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-[fade_0.3s_ease]">
        {/* Faculty side — generate a short-lived session code */}
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4 bg-white/[0.02] border border-white/5 rounded-2xl p-5 backdrop-blur-md">
            <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6366f1]/25 to-[#3b82f6]/10 flex items-center justify-center shrink-0 border border-white/10">
              <QrCode className="h-6 w-6 text-[#c7d2fe]" />
            </span>
            <div>
              <h3 className="text-base font-black text-white font-mono">Attendance Session</h3>
              <p className="text-xs text-[#9aa0b8] mt-1.5 leading-relaxed">
                Generate a short-lived session code for your class. Students check in with the code — no biometric data collected.
              </p>
            </div>
          </div>

          <div className="bg-[#0d0f0e] border border-white/5 rounded-2xl p-6 flex flex-col gap-5 shadow-2xl">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#9aa0b8] tracking-wider block mb-2">Subject</label>
              <input
                type="text"
                value={sessionSubject}
                onChange={(e) => setSessionSubject(e.target.value)}
                placeholder="e.g. Data Structures"
                className="w-full bg-[#12121e] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#6366f1]"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-[#9aa0b8] tracking-wider block mb-2">Duration (Minutes)</label>
              <input
                type="number"
                min={1}
                max={60}
                value={sessionDuration}
                onChange={(e) => setSessionDuration(parseInt(e.target.value) || 5)}
                className="w-full bg-[#12121e] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#6366f1]"
              />
            </div>
            <button onClick={handleGenerateSession} disabled={sessionLoading} className="btn w-full bg-gradient-to-r from-[#6366f1] to-[#3b82f6] text-white font-extrabold py-4 rounded-xl cursor-pointer disabled:opacity-60 inline-flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(99,102,241,0.3)]">
              {sessionLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating code...</> : <><QrCode className="h-4 w-4" /> Generate Session Code</>}
            </button>
          </div>
        </div>

        <div className="console-panel bg-[#0d0f0e] border border-white/5 rounded-2xl p-6 min-h-[300px] flex flex-col shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
            <span className="text-xs font-bold text-[#9aa0b8] uppercase tracking-wider font-mono flex items-center gap-2"><Timer className="h-4 w-4 text-[#6366f1]" /> Active Session</span>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${sessionCode && sessionSecondsLeft > 0 ? "bg-[#10b981]" : "bg-[#5b5f78]"} shadow-lg`}></span>
              <span className="text-[10px] uppercase text-[#5b5f78] font-bold">{sessionCode && sessionSecondsLeft > 0 ? "live" : "none"}</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            {sessionCode ? (
              <div className="flex flex-col items-center gap-3 animate-[fade_0.3s_ease]">
                <span className="text-[10px] uppercase font-bold text-[#9aa0b8] tracking-wider">{sessionSubject}</span>
                <div className="text-5xl font-black tracking-[0.2em] text-white font-mono bg-[#6366f1]/10 border border-[#6366f1]/25 rounded-2xl px-8 py-5">
                  {sessionCode}
                </div>
                {sessionSecondsLeft > 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6ee7b7] bg-[#10b981]/10 border border-[#10b981]/25 px-3 py-1.5 rounded-full">
                    <Timer className="h-3.5 w-3.5" /> Expires in {Math.floor(sessionSecondsLeft / 60)}:{String(sessionSecondsLeft % 60).padStart(2, "0")}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-300 bg-rose-500/10 border border-rose-500/25 px-3 py-1.5 rounded-full">
                    Expired — generate a new code
                  </span>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 text-[#5b5f78]">
                <QrCode className="h-10 w-10 opacity-20" />
                <p className="text-xs text-center max-w-[220px]">Generate a code above to open an attendance session.</p>
              </div>
            )}
          </div>
        </div>

        {/* Student side — check in with the code */}
        <div className="lg:col-span-2 form-card bg-[#0d0f0e] border border-white/5 rounded-2xl p-6 flex flex-col gap-4 max-w-[820px]">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1]/25 to-[#3b82f6]/10 flex items-center justify-center shrink-0">
              <UserCheck className="h-5 w-5 text-[#c7d2fe]" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white">Student Check-in</h3>
              <p className="text-xs text-[#9aa0b8] mt-1 leading-relaxed">Enter the session code shared by your instructor to mark yourself present.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11.5px] font-bold uppercase tracking-wider text-[#9aa0b8] block mb-1.5">Session Code</label>
              <input
                type="text"
                value={checkinCode}
                onChange={(e) => setCheckinCode(e.target.value.toUpperCase())}
                placeholder="e.g. A1B2C3"
                className="w-full bg-[#12121e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono tracking-widest focus:outline-none focus:border-[#6366f1]"
              />
            </div>
            <div>
              <label className="text-[11.5px] font-bold uppercase tracking-wider text-[#9aa0b8] block mb-1.5">Your Email</label>
              <input
                type="email"
                value={checkinEmail}
                onChange={(e) => setCheckinEmail(e.target.value)}
                placeholder="you@avpu.edu.in"
                className="w-full bg-[#12121e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1]"
              />
            </div>
          </div>
          <button onClick={handleCheckin} disabled={checkinLoading} className="btn w-full bg-gradient-to-r from-[#6366f1] to-[#3b82f6] text-white font-semibold py-3.5 rounded-xl cursor-pointer disabled:opacity-60 inline-flex items-center justify-center gap-2">
            {checkinLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Checking in...</> : <><UserCheck className="h-4 w-4" /> Check In</>}
          </button>
          {checkinResult && (
            <div className={`text-xs font-semibold rounded-xl px-4 py-3 border flex items-center gap-2 ${
              checkinResult.ok ? "bg-[#10b981]/10 border-[#10b981]/25 text-[#6ee7b7]" : "bg-rose-500/10 border-rose-500/25 text-rose-300"
            }`}>
              {checkinResult.ok ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <XCircle className="h-4 w-4 shrink-0" />}
              {checkinResult.message}
            </div>
          )}
        </div>
      </div>
    ),

    // ── 1. LearnAnything Mindmap & Knowledge Graph ──
    mindmap: (
      <div className="flex flex-col gap-6 animate-[fade_0.3s_ease]">
        <div className="bg-gradient-to-r from-[#6366f1]/15 to-[#06b6d4]/10 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#06b6d4] grid place-items-center text-white shrink-0 shadow-[0_6px_20px_rgba(99,102,241,0.3)]">
              <Network className="h-6 w-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">Visual Mindmap & Knowledge Graph</h2>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#06b6d4] bg-[#06b6d4]/10 border border-[#06b6d4]/20 px-2 py-0.5 rounded-full">
                  LearnAnything Inspired
                </span>
              </div>
              <p className="text-xs text-[#9aa0b8] mt-1">
                Explore structured learning trees, prerequisite nodes, and deep curated subtopics for any technical field.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              value={mindmapTopic}
              onChange={(e) => setMindmapTopic(e.target.value)}
              placeholder="e.g. Autonomous AI Agents, Machine Learning"
              className="bg-[#12121e] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#6366f1] w-full md:w-64"
            />
            <button
              onClick={handleSearchMindmap}
              disabled={mindmapLoading}
              className="btn bg-[#6366f1] hover:bg-[#4f46e5] text-white px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer shrink-0 disabled:opacity-60 inline-flex items-center gap-2 transition-all"
            >
              {mindmapLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />} Explore
            </button>
          </div>
        </div>

        {/* Mindmap Nodes Graph */}
        <div className="bg-[#0d0f0e] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
            <div>
              <span className="text-[10px] font-mono text-[#6366f1] font-bold uppercase tracking-wider">Root Topic</span>
              <h3 className="text-lg font-bold text-white mt-0.5">{mindmapData?.root || mindmapTopic}</h3>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="flex items-center gap-1.5 text-[#10b981] bg-[#10b981]/10 px-2.5 py-1 rounded-full border border-[#10b981]/20 font-medium">
                <CheckCircle className="h-3 w-3" /> Completed
              </span>
              <span className="flex items-center gap-1.5 text-[#6366f1] bg-[#6366f1]/10 px-2.5 py-1 rounded-full border border-[#6366f1]/20 font-medium">
                <Sparkles className="h-3 w-3" /> In-Progress
              </span>
              <span className="flex items-center gap-1.5 text-[#9aa0b8] bg-white/5 px-2.5 py-1 rounded-full border border-white/10 font-medium">
                Unlocked
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(mindmapData?.nodes || [
              { id: "n1", label: "LLM Core Reasoning", level: 1, description: "StateGraph, ReAct loops, Chain-of-Thought", status: "completed" },
              { id: "n2", label: "Tool Calling & MCP", level: 2, description: "Function calling schemas, Model Context Protocol, REST API clients", status: "in-progress" },
              { id: "n3", label: "Memory Architecture", level: 2, description: "Short-term session memory, Long-term Vector memory (ChromaDB)", status: "unlocked" },
              { id: "n4", label: "Multi-Agent Orchestration", level: 3, description: "Hierarchical teams, Supervisor agents, LangGraph nodes", status: "unlocked" },
              { id: "n5", label: "Production Guardrails", level: 3, description: "Rate limits, output parsers, human-in-the-loop review", status: "locked" }
            ]).map((node: any, idx: number) => {
              const isSelected = activeMindmapNode?.id === node.id;
              const statusColor =
                node.status === "completed"
                  ? "border-[#10b981]/40 bg-[#10b981]/5 text-[#6ee7b7]"
                  : node.status === "in-progress"
                  ? "border-[#6366f1]/50 bg-[#6366f1]/10 text-[#c7d2fe]"
                  : "border-white/5 bg-[#12121e]/80 text-[#8890aa]";

              return (
                <div
                  key={node.id || idx}
                  onClick={() => setActiveMindmapNode(node)}
                  className={`border rounded-xl p-4 cursor-pointer transition-all hover:border-[#6366f1] hover:shadow-[0_8px_20px_rgba(99,102,241,0.15)] flex flex-col justify-between gap-3 ${
                    isSelected ? "border-[#6366f1] bg-[#6366f1]/15 ring-1 ring-[#6366f1]" : statusColor
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9aa0b8]">Level {node.level || 1} Node</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        node.status === "completed" ? "bg-[#10b981]/20 text-[#6ee7b7]" : node.status === "in-progress" ? "bg-[#6366f1]/20 text-[#c7d2fe]" : "bg-white/5 text-[#8890aa]"
                      }`}>
                        {node.status || "unlocked"}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{node.label}</h4>
                    <p className="text-xs text-[#9aa0b8] mt-1 line-clamp-2 leading-relaxed">{node.description}</p>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-medium text-[#c7d2fe] pt-2 border-t border-white/5">
                    <span>Explore Roadmap Node</span>
                    <Share2 className="h-3 w-3" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Node Detail Drawer */}
          {activeMindmapNode && (
            <div className="mt-6 p-5 bg-[#12121e] border border-[#6366f1]/30 rounded-xl flex flex-col gap-3 animate-[fade_0.2s_ease]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#6366f1]" />
                  <h4 className="text-sm font-bold text-white">Active Node: {activeMindmapNode.label}</h4>
                </div>
                <button
                  onClick={() => { setActivePanel("tutor"); setTutorInput(`Explain ${activeMindmapNode.label} in depth with code examples.`); }}
                  className="text-xs text-[#c7d2fe] hover:text-white bg-[#6366f1]/20 hover:bg-[#6366f1]/40 px-3 py-1.5 rounded-lg border border-[#6366f1]/30 cursor-pointer inline-flex items-center gap-1.5 transition-all"
                >
                  <Bot className="h-3.5 w-3.5" /> Ask AI Tutor About This Node
                </button>
              </div>
              <p className="text-xs text-[#9aa0b8] leading-relaxed">{activeMindmapNode.description}</p>
            </div>
          )}
        </div>
      </div>
    ),

    // ── 2. freeCodeCamp Interactive Code Lab ──
    codelab: (
      <div className="flex flex-col gap-6 animate-[fade_0.3s_ease]">
        <div className="bg-gradient-to-r from-[#10b981]/15 to-[#3b82f6]/10 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10b981] to-[#3b82f6] grid place-items-center text-white shrink-0 shadow-[0_6px_20px_rgba(16,185,129,0.3)]">
              <Code2 className="h-6 w-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">Interactive Code Lab & Practice</h2>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/20 px-2 py-0.5 rounded-full">
                  freeCodeCamp Inspired
                </span>
              </div>
              <p className="text-xs text-[#9aa0b8] mt-1">
                Solve coding challenges directly in your browser. Run test suites, verify algorithmic assertions, and earn XP.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-[#6ee7b7] bg-[#10b981]/10 px-3 py-1.5 rounded-full border border-[#10b981]/25">
              +75 XP Per Solved Challenge
            </span>
          </div>
        </div>

        {/* Challenge Selection Tabs */}
        <div className="flex flex-wrap gap-2">
          {(codeChallenges.length > 0 ? codeChallenges : [
            { id: "challenge-1", title: "Cosine Similarity Vector Metric", difficulty: "Intermediate", language: "python", starter_code: "def cosine_similarity(v1, v2):\n    # Return float similarity score between 0.0 and 1.0\n    import math\n    dot = sum(a * b for a, b in zip(v1, v2))\n    mag1 = math.sqrt(sum(a * a for a in v1))\n    mag2 = math.sqrt(sum(b * b for b in v2))\n    if mag1 == 0 or mag2 == 0:\n        return 0.0\n    return round(dot / (mag1 * mag2), 4)\n" },
            { id: "challenge-2", title: "Prompt Template Interpolation", difficulty: "Beginner", language: "python", starter_code: "def format_prompt(template, vars_dict):\n    # Replace each {key} with value from vars_dict\n    for k, v in vars_dict.items():\n        template = template.replace('{' + k + '}', str(v))\n    return template\n" },
            { id: "challenge-3", title: "Sliding Window Document Chunker", difficulty: "Intermediate", language: "python", starter_code: "def chunk_text(text, size=50, overlap=10):\n    chunks = []\n    start = 0\n    step = max(1, size - overlap)\n    while start < len(text):\n        chunks.append(text[start:start+size])\n        start += step\n    return chunks\n" }
          ]).map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => { setActiveChallengeIdx(idx); setEditorCode(ch.starter_code); setCodeResult(null); }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                activeChallengeIdx === idx
                  ? "bg-[#10b981] text-black font-bold shadow-[0_4px_12px_rgba(16,185,129,0.3)]"
                  : "bg-[#12121e] border border-white/5 text-[#8890aa] hover:text-white"
              }`}
            >
              {ch.title}
            </button>
          ))}
        </div>

        {/* Code Editor & Execution Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#0d0f0e] border border-white/5 rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <span className="text-xs font-bold font-mono text-[#10b981] flex items-center gap-2">
                <Terminal className="h-4 w-4" /> Python Editor
              </span>
              <button
                onClick={() => {
                  const ch = codeChallenges[activeChallengeIdx];
                  if (ch) setEditorCode(ch.starter_code);
                }}
                className="text-[11px] text-[#8890aa] hover:text-white inline-flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" /> Reset Code
              </button>
            </div>
            <textarea
              value={editorCode}
              onChange={(e) => setEditorCode(e.target.value)}
              rows={14}
              className="w-full bg-[#060609] border border-white/10 rounded-xl p-4 text-xs font-mono text-[#a5f3fc] focus:outline-none focus:border-[#10b981] leading-relaxed resize-none"
              spellCheck={false}
            />
            <button
              onClick={handleRunCode}
              disabled={codeExecuting}
              className="btn bg-[#10b981] hover:bg-[#059669] text-black font-bold py-3 rounded-xl cursor-pointer disabled:opacity-60 inline-flex items-center justify-center gap-2 shadow-[0_6px_16px_rgba(16,185,129,0.25)] transition-all"
            >
              {codeExecuting ? <><Loader2 className="h-4 w-4 animate-spin" /> Running Test Suite...</> : <><Play className="h-4 w-4 fill-black" /> Run Code & Test Cases</>}
            </button>
          </div>

          {/* Test Case & Output Console */}
          <div className="bg-[#0d0f0e] border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
            <div className="pb-3 border-b border-white/5">
              <h4 className="text-sm font-bold text-white">Challenge Specification & Tests</h4>
              <p className="text-xs text-[#9aa0b8] mt-1">Implement the function signature and pass all assertions.</p>
            </div>

            <div className="bg-[#12121e] border border-white/5 rounded-xl p-4 flex flex-col gap-2">
              <span className="text-[10.5px] font-mono uppercase font-bold text-[#8890aa]">Test Assertions</span>
              <div className="text-xs font-mono text-[#9aa0b8] flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#10b981]" />
                  <span>Input: [1, 0], [1, 0] → Expected: 1.0</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#10b981]" />
                  <span>Input: [1, 0], [0, 1] → Expected: 0.0</span>
                </div>
              </div>
            </div>

            {/* Test Execution Output */}
            {codeResult && (
              <div className={`p-4 rounded-xl border text-xs font-mono flex flex-col gap-2 animate-[fade_0.2s_ease] ${
                codeResult.passed
                  ? "bg-[#10b981]/10 border-[#10b981]/30 text-[#6ee7b7]"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-300"
              }`}>
                <div className="flex items-center gap-2 font-bold">
                  {codeResult.passed ? <CheckCircle className="h-4 w-4 text-[#10b981]" /> : <AlertCircle className="h-4 w-4 text-rose-400" />}
                  <span>{codeResult.passed ? "SUCCESS: All Test Cases Passed!" : "TEST FAILED"}</span>
                </div>
                <p className="text-[11px] leading-relaxed">{codeResult.message}</p>
                {codeResult.passed && (
                  <div className="mt-1 inline-flex items-center gap-2 text-[11px] font-bold text-[#10b981]">
                    <Zap className="h-3.5 w-3.5 fill-[#10b981]" /> Awarded +{codeResult.xp_earned || 75} XP
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    ),

    // ── 3. 100 Days of AI Challenge ──
    challenges100: (
      <div className="flex flex-col gap-6 animate-[fade_0.3s_ease]">
        <div className="bg-gradient-to-r from-[#f59e0b]/15 to-[#ef4444]/10 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#ef4444] grid place-items-center text-white shrink-0 shadow-[0_6px_20px_rgba(245,158,11,0.3)]">
              <Rocket className="h-6 w-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">100 Days of AI & NoCode Challenge</h2>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/20 px-2 py-0.5 rounded-full">
                  100DaysOfCode / 100DaysAI
                </span>
              </div>
              <p className="text-xs text-[#9aa0b8] mt-1">
                Build a daily learning habit with 100 progressive micro-challenges across Prompting, RAG, Agents, and Multimodal ML.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-white">{completedDays.length} / 100 Days Complete</span>
              <div className="w-32 h-2 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#f59e0b] to-[#ef4444] rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(5, (completedDays.length / 100) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Days Ribbon */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {(challenges100.length > 0 ? challenges100 : [
            { day: 1, title: "Hello AI World: Prompt Framing & Constraints", track: "Fundamentals", difficulty: "Easy", task: "Construct a prompt using System, Context, Task, Constraints, and Output Format to summarize an article.", prompt_template: "You are a CIO. Summarize in 3 bullet points.", xp: 50 },
            { day: 2, title: "Few-Shot Classification with Strict JSON", track: "Prompt Engineering", difficulty: "Easy", task: "Feed 3 input-output examples to classify customer support emails into strict JSON.", prompt_template: 'Return JSON: {"category": "Billing"}', xp: 60 },
            { day: 3, title: "RAG Chunking: Token Limits & Overlap", track: "RAG & Embeddings", difficulty: "Medium", task: "Write a python function that splits a 10,000 character document with a 50-character overlap window.", prompt_template: "def chunk_text(text, chunk_size=500):", xp: 80 },
            { day: 4, title: "Cosine Similarity from Scratch", track: "Math for AI", difficulty: "Medium", task: "Calculate the cosine similarity between two 3-dimensional vector embeddings.", prompt_template: "dot_product = sum(a*b)", xp: 80 },
            { day: 5, title: "Building a Function Calling Agent", track: "Agents", difficulty: "Hard", task: "Define a JSON tool schema for get_weather and create an agent loop.", prompt_template: '{"name": "get_weather"}', xp: 100 },
            { day: 6, title: "Vision OCR & Structured Data Extraction", track: "Multimodal", difficulty: "Medium", task: "Extract table from receipt image with OCR.", prompt_template: "Extract table: | Item | Price |", xp: 90 },
            { day: 7, title: "Autonomous Multi-Agent Debate", track: "Agentic Workflows", difficulty: "Hard", task: "Orchestrate Advocate and Critic agents with a Judge arbiter.", prompt_template: "Agent 1 -> Agent 2 -> Agent 3", xp: 120 }
          ]).map((ch, idx) => {
            const isCompleted = completedDays.includes(ch.day);
            const isActive = activeDayIdx === idx;
            return (
              <button
                key={ch.day}
                onClick={() => { setActiveDayIdx(idx); setChallengeSubmission(""); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 cursor-pointer flex items-center gap-1.5 transition-all ${
                  isActive
                    ? "bg-[#f59e0b] text-black shadow-[0_4px_12px_rgba(245,158,11,0.3)]"
                    : isCompleted
                    ? "bg-[#10b981]/15 text-[#6ee7b7] border border-[#10b981]/30"
                    : "bg-[#12121e] border border-white/5 text-[#8890aa] hover:text-white"
                }`}
              >
                {isCompleted && <Check className="h-3 w-3" />}
                Day {ch.day}
              </button>
            );
          })}
        </div>

        {/* Active Challenge Card */}
        {(() => {
          const list = challenges100.length > 0 ? challenges100 : [
            { day: 1, title: "Hello AI World: Prompt Framing & Constraints", track: "Fundamentals", difficulty: "Easy", task: "Construct a prompt using System, Context, Task, Constraints, and Output Format to summarize a 500-word news article into 3 actionable bullet points.", prompt_template: "You are a Chief Intelligence Officer. Given the article below, produce exactly 3 bullet points. No conversational filler.", xp: 50 }
          ];
          const ch = list[activeDayIdx] || list[0];
          const isDone = completedDays.includes(ch.day);

          return (
            <div className="bg-[#0d0f0e] border border-white/5 rounded-2xl p-6 flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-[#f59e0b]">Day {ch.day} Challenge</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#9aa0b8] bg-white/5 px-2 py-0.5 rounded-full border border-white/5">{ch.track}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded-full border border-[#10b981]/20">{ch.difficulty}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{ch.title}</h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/20 px-3 py-1.5 rounded-full shrink-0">
                  <Zap className="h-3.5 w-3.5 fill-[#f59e0b]" /> +{ch.xp || 50} XP Reward
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8890aa] mb-1.5">Task Description</h4>
                <p className="text-sm text-[#eeeef8] leading-relaxed">{ch.task}</p>
              </div>

              {ch.prompt_template && (
                <div className="bg-[#12121e] border border-white/5 rounded-xl p-4 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#8890aa] uppercase font-bold">Starter Prompt / Code Template</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(ch.prompt_template)}
                      className="text-[10.5px] text-[#c7d2fe] hover:text-white inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="h-3 w-3" /> Copy
                    </button>
                  </div>
                  <code className="text-xs font-mono text-[#fbbf24]">{ch.prompt_template}</code>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#8890aa]">Your Solution or Prompt Output</label>
                <textarea
                  value={challengeSubmission}
                  onChange={(e) => setChallengeSubmission(e.target.value)}
                  rows={4}
                  placeholder="Paste your prompt, python snippet, or solution explanation here..."
                  className="w-full bg-[#12121e] border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-[#f59e0b] leading-relaxed resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-[#8890aa]">
                  {isDone ? "✅ Completed & Verified" : "Submit solution to increment daily streak and earn XP"}
                </span>
                <button
                  onClick={handleSubmitChallenge}
                  disabled={submittingChallenge || !challengeSubmission.trim()}
                  className="btn bg-gradient-to-r from-[#f59e0b] to-[#ef4444] text-black font-bold px-6 py-2.5 rounded-xl cursor-pointer disabled:opacity-60 inline-flex items-center gap-2 shadow-[0_4px_14px_rgba(245,158,11,0.25)] transition-all"
                >
                  {submittingChallenge ? <Loader2 className="h-4 w-4 animate-spin text-black" /> : <CheckCircle className="h-4 w-4" />} Complete Day {ch.day}
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    ),

    // ── 4. Mental Models Library (fs.blog/mental-models) ──
    mentalmodels: (
      <div className="flex flex-col gap-6 animate-[fade_0.3s_ease]">
        <div className="bg-gradient-to-r from-[#a855f7]/15 to-[#3b82f6]/10 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#a855f7] to-[#3b82f6] grid place-items-center text-white shrink-0 shadow-[0_6px_20px_rgba(168,85,247,0.3)]">
              <Brain className="h-6 w-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">Lattice of Mental Models</h2>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#a855f7] bg-[#a855f7]/10 border border-[#a855f7]/20 px-2 py-0.5 rounded-full">
                  Farnam Street (fs.blog) Inspired
                </span>
              </div>
              <p className="text-xs text-[#9aa0b8] mt-1">
                Deep thinking frameworks for superior reasoning: First Principles, Inversion, Second-Order Thinking, Occam's Razor, and Circle of Competence.
              </p>
            </div>
          </div>
          <div className="w-full md:w-64">
            <input
              type="text"
              value={modelSearch}
              onChange={(e) => setModelSearch(e.target.value)}
              placeholder="Search mental models..."
              className="w-full bg-[#12121e] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#a855f7]"
            />
          </div>
        </div>

        {/* Mental Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(mentalModels.length > 0 ? mentalModels : [
            { id: "first-principles", name: "First Principles Thinking", category: "Thinking", origin: "Aristotle & Elon Musk", summary: "Boil a problem down to its most fundamental truths and reason up from there, rather than reasoning by analogy.", quote: "Reason from first principles rather than by analogy. — Elon Musk" },
            { id: "inversion", name: "Inversion (Think Backwards)", category: "Problem Solving", origin: "Carl Jacobi & Charlie Munger", summary: "Instead of asking how to achieve a goal, ask how to guarantee failure—and then systematically avoid those pitfalls.", quote: "Invert, always invert: Turn a situation upside down. — Carl Jacobi" },
            { id: "second-order-thinking", name: "Second-Order Thinking", category: "Decision Making", origin: "Howard Marks", summary: "First-order thinking considers only immediate results. Second-order thinking asks: 'And then what?'", quote: "First-order thinking is simplistic. Second-order is deep and convoluted. — Howard Marks" },
            { id: "occams-razor", name: "Occam's Razor", category: "Analysis", origin: "William of Ockham", summary: "Among competing hypotheses, the one with the fewest assumptions is usually correct.", quote: "Entities should not be multiplied beyond necessity." },
            { id: "circle-of-competence", name: "Circle of Competence", category: "Strategy", origin: "Warren Buffett", summary: "Know what you know, and know where your boundary ends. Avoid overconfidence in unfamiliar domains.", quote: "Knowing what you don’t know is more useful than being brilliant. — Charlie Munger" },
            { id: "pareto-principle", name: "Pareto Principle (80/20)", category: "Productivity", origin: "Vilfredo Pareto", summary: "80% of outcomes result from 20% of inputs. Focus energy on the high-leverage vital few.", quote: "Identify the 20% that drives 80% of value." }
          ])
            .filter((m: any) => !modelSearch || m.name.toLowerCase().includes(modelSearch.toLowerCase()) || m.summary.toLowerCase().includes(modelSearch.toLowerCase()))
            .map((model: any) => (
              <div
                key={model.id}
                onClick={() => setSelectedModel(model)}
                className={`border rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between gap-4 hover:border-[#a855f7] hover:shadow-[0_8px_20px_rgba(168,85,247,0.15)] ${
                  selectedModel?.id === model.id ? "border-[#a855f7] bg-[#a855f7]/10 ring-1 ring-[#a855f7]" : "border-white/5 bg-[#0d0f0e]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#a855f7] bg-[#a855f7]/10 px-2.5 py-0.5 rounded-full border border-[#a855f7]/20">
                      {model.category}
                    </span>
                    <span className="text-[10.5px] text-[#8890aa]">{model.origin}</span>
                  </div>
                  <h4 className="text-base font-bold text-white">{model.name}</h4>
                  <p className="text-xs text-[#9aa0b8] mt-2 leading-relaxed">{model.summary}</p>
                </div>

                <div className="pt-3 border-t border-white/5">
                  <p className="text-[11px] italic text-[#c7d2fe] line-clamp-2">"{model.quote}"</p>
                  <span className="mt-2 text-[11px] font-semibold text-[#a855f7] inline-flex items-center gap-1">
                    Apply to My Problem →
                  </span>
                </div>
              </div>
            ))}
        </div>

        {/* Apply Model to Problem Interactive Studio */}
        {selectedModel && (
          <div className="bg-[#0d0f0e] border border-[#a855f7]/30 rounded-2xl p-6 flex flex-col gap-4 animate-[fade_0.2s_ease]">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <span className="text-[10.5px] font-mono text-[#a855f7] font-bold uppercase">Apply Mental Model</span>
                <h3 className="text-base font-bold text-white">{selectedModel.name}</h3>
              </div>
              <button onClick={() => setSelectedModel(null)} className="text-xs text-[#8890aa] hover:text-white cursor-pointer">
                Close
              </button>
            </div>
            <p className="text-xs text-[#9aa0b8]">{selectedModel.summary}</p>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#8890aa]">Describe Your Problem or Dilemma</label>
              <textarea
                value={modelProblemInput}
                onChange={(e) => setModelProblemInput(e.target.value)}
                rows={3}
                placeholder="e.g. My startup launch is delayed because we keep adding features..."
                className="w-full bg-[#12121e] border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-[#a855f7] resize-none leading-relaxed"
              />
            </div>

            <button
              onClick={handleApplyMentalModel}
              disabled={analyzingModel || !modelProblemInput.trim()}
              className="btn bg-[#a855f7] hover:bg-[#9333ea] text-white font-bold py-3 rounded-xl cursor-pointer disabled:opacity-60 inline-flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(168,85,247,0.3)] transition-all"
            >
              {analyzingModel ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lightbulb className="h-4 w-4" />} Deconstruct with {selectedModel.name}
            </button>

            {modelAnalysisResult && (
              <div className="mt-2 p-4 bg-[#12121e] border border-[#a855f7]/30 rounded-xl text-xs text-[#eeeef8] whitespace-pre-line leading-relaxed animate-[fade_0.2s_ease]">
                {modelAnalysisResult}
              </div>
            )}
          </div>
        )}
      </div>
    ),

    // ── 5. Laws of UX Deck (lawsofux.com) ──
    lawsofux: (
      <div className="flex flex-col gap-6 animate-[fade_0.3s_ease]">
        <div className="bg-gradient-to-r from-[#06b6d4]/15 to-[#3b82f6]/10 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#06b6d4] to-[#3b82f6] grid place-items-center text-white shrink-0 shadow-[0_6px_20px_rgba(6,182,212,0.3)]">
              <Compass className="h-6 w-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">Laws of UX & Heuristics Deck</h2>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#06b6d4] bg-[#06b6d4]/10 border border-[#06b6d4]/20 px-2 py-0.5 rounded-full">
                  LawsOfUX.com Inspired
                </span>
              </div>
              <p className="text-xs text-[#9aa0b8] mt-1">
                Visual heuristics, cognitive biases, and ergonomic interaction laws that determine high-conversion product usability.
              </p>
            </div>
          </div>
        </div>

        {/* Laws Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(lawsList.length > 0 ? lawsList : [
            { id: "fitts-law", name: "Fitts's Law", category: "Interaction", summary: "The time to acquire a target is a function of distance and size.", takeaway: "Make key interactive buttons large and easy to reach.", do: "Large touch targets (>48px)", dont: "Tiny text links in corners" },
            { id: "hicks-law", name: "Hick's Law", category: "Cognitive", summary: "Decision time increases with the number and complexity of choices.", takeaway: "Minimize cognitive friction; break multi-choice forms into wizards.", do: "Highlight 1 recommended action", dont: "Overwhelm with 20 parallel options" },
            { id: "jakobs-law", name: "Jakob's Law", category: "Behavioral", summary: "Users spend most of their time on other sites, so they expect yours to work the same way.", takeaway: "Embrace standard conventions rather than unprompted novel layouts.", do: "Standard cart/nav placement", dont: "Reinvent standard conventions" },
            { id: "millers-law", name: "Miller's Law", category: "Cognitive", summary: "Average working memory can only hold 7 (±2) items at once.", takeaway: "Chunk information into 5-7 distinct groups.", do: "Group fields logically", dont: "Present 15 unformatted inputs" },
            { id: "doherty-threshold", name: "Doherty Threshold", category: "Performance", summary: "Productivity soars when system response time is <400ms.", takeaway: "Provide instant feedback with skeleton loaders and optimistic UI.", do: "Skeleton states (<200ms)", dont: "Frozen UI with zero feedback" },
            { id: "peak-end-rule", name: "Peak-End Rule", category: "Psychology", summary: "People judge an experience by its peak emotional moment and its finish.", takeaway: "Deliver delightful celebratory conclusions when tasks succeed.", do: "Rewarding success finish", dont: "Empty dull confirmation screen" }
          ]).map((law: any) => (
            <div key={law.id} className="bg-[#0d0f0e] border border-white/5 rounded-2xl p-5 flex flex-col justify-between gap-4 hover:border-[#06b6d4]/50 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#06b6d4] bg-[#06b6d4]/10 px-2.5 py-0.5 rounded-full border border-[#06b6d4]/20">
                    {law.category}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white">{law.name}</h4>
                <p className="text-xs text-[#9aa0b8] mt-1.5 leading-relaxed">{law.summary}</p>
                <div className="mt-3 p-3 bg-[#12121e] rounded-xl border border-white/5">
                  <span className="text-[10.5px] font-bold uppercase text-[#c7d2fe] block mb-1">Key Takeaway</span>
                  <p className="text-xs text-[#eeeef8]">{law.takeaway}</p>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 pt-3 border-t border-white/5 text-[11px]">
                <div className="flex items-center gap-1.5 text-[#6ee7b7]">
                  <CheckCircle className="h-3.5 w-3.5 shrink-0 text-[#10b981]" />
                  <span>DO: {law.do}</span>
                </div>
                <div className="flex items-center gap-1.5 text-rose-300">
                  <XCircle className="h-3.5 w-3.5 shrink-0 text-rose-400" />
                  <span>DON'T: {law.dont}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI UX Audit Workbench */}
        <div className="bg-[#0d0f0e] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#06b6d4]/20 grid place-items-center text-[#06b6d4]">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white">AI UX Audit Studio</h3>
              <p className="text-xs text-[#9aa0b8]">Test any screen, landing page idea, or user flow against all UX Laws.</p>
            </div>
          </div>

          <textarea
            value={uxConceptInput}
            onChange={(e) => setUxConceptInput(e.target.value)}
            rows={3}
            placeholder="Describe your user flow or screen layout (e.g. A 3-step checkout form with floating action buttons)..."
            className="w-full bg-[#12121e] border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-[#06b6d4] resize-none"
          />

          <button
            onClick={handleAuditUx}
            disabled={auditingUx || !uxConceptInput.trim()}
            className="btn bg-[#06b6d4] hover:bg-[#0891b2] text-black font-bold py-3 rounded-xl cursor-pointer disabled:opacity-60 inline-flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_rgba(6,182,212,0.25)]"
          >
            {auditingUx ? <Loader2 className="h-4 w-4 animate-spin" /> : <Compass className="h-4 w-4" />} Run UX Heuristics Audit
          </button>

          {uxAuditResult && (
            <div className="p-4 bg-[#12121e] border border-[#06b6d4]/30 rounded-xl text-xs text-[#eeeef8] whitespace-pre-line leading-relaxed animate-[fade_0.2s_ease]">
              {uxAuditResult}
            </div>
          )}
        </div>
      </div>
    ),

    // ── 6. MarketingExamples & GrowthInReverse Teardowns ──
    teardowns: (
      <div className="flex flex-col gap-6 animate-[fade_0.3s_ease]">
        <div className="bg-gradient-to-r from-[#ec4899]/15 to-[#8b5cf6]/10 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ec4899] to-[#8b5cf6] grid place-items-center text-white shrink-0 shadow-[0_6px_20px_rgba(236,72,153,0.3)]">
              <Split className="h-6 w-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">Visual Teardown & Case Study Hub</h2>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#ec4899] bg-[#ec4899]/10 border border-[#ec4899]/20 px-2 py-0.5 rounded-full">
                  MarketingExamples & GrowthInReverse
                </span>
              </div>
              <p className="text-xs text-[#9aa0b8] mt-1">
                Side-by-side 'Before vs After' breakdowns showing exactly how top founders fix weak copy, optimize viral hooks, and engineer growth loops.
              </p>
            </div>
          </div>
        </div>

        {/* Teardowns List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(teardownsList.length > 0 ? teardownsList : [
            {
              id: "hero-headline",
              title: "SaaS Hero Section Copywriting",
              tag: "Copywriting",
              bad_example: "The Next-Gen Synergy Platform Powered by Enterprise AI",
              bad_critique: "Meaningless jargon soup. The visitor has no idea what problem is solved.",
              good_example: "Turn recorded Zoom calls into ready-to-publish client proposals in 90 seconds.",
              good_critique: "Hyper-specific outcome, specific timeline (90s), clear input.",
              rule: "Replace vague buzzwords with [Action] + [Specific Outcome] + [Timeline / Barrier Removed]."
            },
            {
              id: "cold-email",
              title: "B2B Founder Cold Outreach",
              tag: "Growth",
              bad_example: "Hi! We are a leading 50-person agency. Would love to hop on a 30-min call to showcase our capabilities.",
              bad_critique: "All about the sender. Asks for a 30-min commitment with zero proof or relevance.",
              good_example: "Noticed your checkout page drops visitors on step 2. Recorded a 45-second Loom showing the 1-line fix. Mind if I send it over?",
              good_critique: "Provides upfront unasked value and asks for frictionless 1-click permission.",
              rule: "Lead with proof and diagnosis. Never ask for a 30-minute meeting on email 1."
            },
            {
              id: "duolingo-gamification",
              title: "Duolingo's Viral Retention Engine",
              tag: "Product",
              bad_example: "Traditional LMS: 2-hour passive video lectures with long midterm exams.",
              bad_critique: "High cognitive friction leads to 90%+ drop-off within 14 days.",
              good_example: "3-minute daily micro-drills + streak counter + heart penalty + celebratory haptics.",
              good_critique: "Loss aversion on the 30-day streak cements a compulsive daily habit.",
              rule: "Shrink daily friction to <3 minutes and leverage streak loss aversion."
            },
            {
              id: "substack-growth-loop",
              title: "Growth In Reverse: The Newsletter Flywheel",
              tag: "Audience",
              bad_example: "Writing essays in isolation and waiting for Google SEO to rank your blog.",
              bad_critique: "Zero distribution. You stay at 50 subscribers for years.",
              good_example: "1 Deep Teardown every Thursday + 3 Twitter threads summarizing charts + peer recommendations.",
              good_critique: "Repurposes long-form research into social hooks, converting readers to owned email list.",
              rule: "20% creation, 80% repurposing and distribution."
            }
          ]).map((t: any) => (
            <div key={t.id} className="bg-[#0d0f0e] border border-white/5 rounded-2xl p-6 flex flex-col justify-between gap-5">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#ec4899] bg-[#ec4899]/10 px-2.5 py-0.5 rounded-full border border-[#ec4899]/20">
                    {t.tag}
                  </span>
                  <span className="text-xs font-bold text-white">{t.title}</span>
                </div>

                {/* Bad Example Box */}
                <div className="p-4 bg-rose-500/10 border border-rose-500/25 rounded-xl flex flex-col gap-1.5 mb-3">
                  <span className="text-[10.5px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <XCircle className="h-3.5 w-3.5" /> Before (Weak Example)
                  </span>
                  <p className="text-xs font-mono text-rose-200">"{t.bad_example}"</p>
                  <p className="text-[11px] text-rose-300/80 mt-1 italic">Why it fails: {t.bad_critique}</p>
                </div>

                {/* Good Example Box */}
                <div className="p-4 bg-[#10b981]/10 border border-[#10b981]/25 rounded-xl flex flex-col gap-1.5">
                  <span className="text-[10.5px] font-bold text-[#6ee7b7] uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-[#10b981]" /> After (High-Converting Fix)
                  </span>
                  <p className="text-xs font-mono text-[#a7f3d0]">"{t.good_example}"</p>
                  <p className="text-[11px] text-[#6ee7b7]/80 mt-1 italic">Why it converts: {t.good_critique}</p>
                </div>
              </div>

              {/* Golden Rule */}
              <div className="pt-3 border-t border-white/5 bg-[#12121e] p-3 rounded-xl">
                <span className="text-[10px] font-mono uppercase font-bold text-[#f59e0b] block mb-0.5">Core Principle</span>
                <p className="text-xs font-medium text-white">{t.rule}</p>
              </div>
            </div>
          ))}
        </div>

        {/* AI Teardown Studio */}
        <div className="bg-[#0d0f0e] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#ec4899]/20 grid place-items-center text-[#ec4899]">
              <Split className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white">AI Copy & Product Teardown Studio</h3>
              <p className="text-xs text-[#9aa0b8]">Submit your headline, email pitch, or growth idea for a brutal, high-converting rewrite.</p>
            </div>
          </div>

          <textarea
            value={teardownInput}
            onChange={(e) => setTeardownInput(e.target.value)}
            rows={3}
            placeholder="Paste your current landing page headline, email opener, or product pitch..."
            className="w-full bg-[#12121e] border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-[#ec4899] resize-none"
          />

          <button
            onClick={handleAnalyzeTeardown}
            disabled={analyzingTeardown || !teardownInput.trim()}
            className="btn bg-gradient-to-r from-[#ec4899] to-[#8b5cf6] text-white font-bold py-3 rounded-xl cursor-pointer disabled:opacity-60 inline-flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_rgba(236,72,153,0.3)]"
          >
            {analyzingTeardown ? <Loader2 className="h-4 w-4 animate-spin" /> : <Split className="h-4 w-4" />} Tear Down & Rewrite
          </button>

          {teardownResult && (
            <div className="p-4 bg-[#12121e] border border-[#ec4899]/30 rounded-xl text-xs text-[#eeeef8] whitespace-pre-line leading-relaxed animate-[fade_0.2s_ease]">
              {teardownResult}
            </div>
          )}
        </div>
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

        <nav className="side-nav flex flex-col gap-1.5 flex-1 overflow-y-auto pr-1">
          {[
            { key: "dashboard" as PanelType, label: "Dashboard", icon: LayoutDashboard },
            { key: "tutor" as PanelType, label: "Syllabus AI Tutor", icon: Bot },
            { key: "mindmap" as PanelType, label: "Mindmap Explorer", icon: Network },
            { key: "codelab" as PanelType, label: "Code Lab (FCC)", icon: Code2 },
            { key: "challenges100" as PanelType, label: "100 Days AI", icon: Rocket },
            { key: "mentalmodels" as PanelType, label: "Mental Models", icon: Brain },
            { key: "lawsofux" as PanelType, label: "Laws of UX", icon: Compass },
            { key: "teardowns" as PanelType, label: "Growth Teardowns", icon: Split },
            { key: "roadmaps" as PanelType, label: "Study Roadmaps", icon: Map },
            { key: "assessments" as PanelType, label: "Adaptive Quiz", icon: Award },
            { key: "placements" as PanelType, label: "Placements Matcher", icon: Briefcase },
            { key: "admissions" as PanelType, label: "Admissions Counselor", icon: Search },
            { key: "research" as PanelType, label: "Research Abstract", icon: FileText },
            { key: "quiz" as PanelType, label: "Quiz Yourself", icon: Layers },
            { key: "attendance" as PanelType, label: "Attendance", icon: QrCode }
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

          <div className="ml-auto flex items-center gap-3">
            {/* Duolingo Gamification Stats */}
            <div className="flex items-center gap-2 bg-[#12121e] border border-white/5 px-3 py-1.5 rounded-full">
              <span className="flex items-center gap-1 text-xs font-bold text-[#f59e0b]" title="Daily Streak">
                <Flame className="h-4 w-4 fill-[#f59e0b]" /> {userStreak}
              </span>
              <span className="w-px h-3 bg-white/10" />
              <span className="flex items-center gap-1 text-xs font-bold text-[#6366f1]" title="Total XP">
                <Zap className="h-4 w-4 fill-[#6366f1]" /> {userXP} XP
              </span>
              <span className="w-px h-3 bg-white/10" />
              <span className="flex items-center gap-1 text-xs font-bold text-rose-400" title="Hearts">
                <Heart className="h-4 w-4 fill-rose-500" /> {userHearts}
              </span>
              <span className="w-px h-3 bg-white/10 hidden sm:block" />
              <span className="text-[10.5px] font-bold text-[#c7d2fe] hidden sm:flex items-center gap-1">
                <Trophy className="h-3 w-3 text-[#fbbf24]" /> {userLeague}
              </span>
            </div>

            <div className="hidden lg:block">
              <span className="prov-chip font-mono text-[11px] font-semibold text-[#c7d2fe] bg-[#6366f1]/10 border border-[#6366f1]/25 px-3 py-1.5 rounded-full">
                <Cpu className="h-3 w-3 inline mr-1.5" />
                {llmEnabled ? providerName : "Offline AI Engine"} · {ragBackend.split(" ")[0]} RAG
              </span>
            </div>
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
