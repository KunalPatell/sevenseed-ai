"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Volume2,
  Timer,
  Send,
  ChevronDown,
  ChevronUp,
  LogIn,
  AlertCircle,
  RotateCcw,
  Download,
  Sparkles,
  Loader2,
  ArrowRight,
  Keyboard,
  Trophy,
  Radio,
} from "lucide-react";
import { GlowCard } from "@/components/GlowCard";
import { authApi } from "@/lib/api";
import { Auth } from "@/lib/auth";

const QUESTION_SECONDS = 90;

interface MockQuestion {
  q: string;
  type: string;
}

interface ScoreBreakdown {
  clarity?: number;
  relevance?: number;
  structure?: number;
  confidence?: number;
}

interface ScoreResult {
  scores?: ScoreBreakdown;
  overall?: number;
  verdict?: string;
  strengths?: string[];
  improvements?: string[];
  model_answer?: string;
}

interface AnsweredItem {
  question: string;
  answer: string;
  result: ScoreResult;
}

interface VoiceStartResp {
  success?: boolean;
  session_id?: number;
  first_question?: string;
  total_questions?: number;
}

interface VoiceAnswerResp {
  success?: boolean;
  done?: boolean;
  score?: number;
  feedback?: string;
  next_question?: string | null;
  report?: string;
}

const STAR_PROMPTS = [
  {
    q: "Tell me about a time you led a team through a difficult situation.",
    tip: "Situation: the team, the stakes. Task: what you were responsible for. Action: the specific decisions you made. Result: the measurable outcome and what you'd repeat.",
  },
  {
    q: "Describe a disagreement you had with a coworker or manager.",
    tip: "Situation: the source of friction. Task: your goal in resolving it. Action: how you communicated, not just what you felt. Result: the resolution and the relationship afterward.",
  },
  {
    q: "Tell me about a time you failed or made a significant mistake.",
    tip: "Situation: what went wrong, own it plainly. Task: what you were supposed to deliver. Action: how you fixed it or contained the damage. Result: what changed in how you work since.",
  },
  {
    q: "Describe a project with a tight deadline you had to meet.",
    tip: "Situation: the deadline and the constraint. Task: the scope you owned. Action: how you prioritized and cut scope safely. Result: did you ship on time, and at what cost/benefit.",
  },
  {
    q: "Tell me about a time you had to work with a difficult teammate.",
    tip: "Situation: what made them difficult, factually. Task: the shared goal you both needed. Action: the specific adjustment you made to work together. Result: the outcome for the project and the relationship.",
  },
  {
    q: "Describe a time you went above and beyond your role.",
    tip: "Situation: what was NOT technically your job. Task: why you stepped in anyway. Action: concrete steps taken. Result: impact delivered, and how it was recognized.",
  },
];

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.98;
    window.speechSynthesis.speak(utter);
  } catch {
    // ignore — TTS is a nice-to-have
  }
}

function useSpeechRecognition() {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recRef = useRef<any>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSupported(!!SR);
  }, []);

  const start = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    setTranscript("");
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      setTranscript(text);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  }, []);

  const stop = useCallback(() => {
    try {
      recRef.current?.stop();
    } catch {
      // ignore
    }
    setListening(false);
  }, []);

  const reset = useCallback(() => setTranscript(""), []);

  return { supported, listening, transcript, start, stop, reset };
}

function useCountdown(active: boolean, resetKey: string | number) {
  const [secondsLeft, setSecondsLeft] = useState(QUESTION_SECONDS);

  useEffect(() => {
    setSecondsLeft(QUESTION_SECONDS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [active, resetKey]);

  const mm = Math.floor(secondsLeft / 60);
  const ss = secondsLeft % 60;
  return { secondsLeft, label: `${mm}:${ss.toString().padStart(2, "0")}` };
}

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: "linear-gradient(90deg, var(--primary), var(--secondary))" }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}

function ScoreBars({ scores }: { scores?: ScoreBreakdown }) {
  if (!scores) return null;
  const entries = Object.entries(scores).filter(([, v]) => typeof v === "number") as [string, number][];
  if (!entries.length) return null;
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {entries.map(([k, v]) => (
        <div key={k}>
          <div className="flex items-center justify-between text-[10px] font-bold text-[#55556a] mb-1 uppercase tracking-wide">
            <span>{k}</span>
            <span>{v}/10</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${(v / 10) * 100}%`, background: "linear-gradient(90deg, var(--primary), var(--secondary))" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function FeedbackCard({ result }: { result: ScoreResult }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="tcard border-[var(--primary)]/25"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold uppercase tracking-wide text-[#55556a]">AI Feedback</p>
        {typeof result.overall === "number" && (
          <span
            className="text-xs font-black px-2.5 py-1 rounded-full text-white"
            style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
          >
            {result.overall}/100
          </span>
        )}
      </div>
      {result.verdict && <p className="text-sm font-semibold mb-3">{result.verdict}</p>}
      <div className="mb-3">
        <ScoreBars scores={result.scores} />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {result.strengths && result.strengths.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--green-l)] mb-1.5">Strengths</p>
            <ul className="flex flex-col gap-1 text-xs text-[#9090b0]">
              {result.strengths.map((s, i) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </div>
        )}
        {result.improvements && result.improvements.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--gold-l)] mb-1.5">Improve</p>
            <ul className="flex flex-col gap-1 text-xs text-[#9090b0]">
              {result.improvements.map((s, i) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {result.model_answer && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#55556a] mb-1.5">Model Answer</p>
          <p className="text-xs text-[#9090b0] leading-relaxed">{result.model_answer}</p>
        </div>
      )}
    </motion.div>
  );
}

function StarCheatSheet() {
  const [open, setOpen] = useState(false);
  return (
    <div className="tcard">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between cursor-pointer"
      >
        <span className="text-xs font-bold uppercase tracking-wide text-[#55556a]">
          STAR Method Cheat Sheet
        </span>
        {open ? <ChevronUp className="h-4 w-4 text-[#55556a]" /> : <ChevronDown className="h-4 w-4 text-[#55556a]" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pt-4 flex flex-col gap-3">
              {STAR_PROMPTS.map((p, i) => (
                <div key={i} className="px-3.5 py-3 rounded-lg bg-white/[0.03] border border-white/5">
                  <p className="text-sm font-semibold mb-1">{p.q}</p>
                  <p className="text-xs text-[#9090b0] leading-relaxed">{p.tip}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MockInterviewPanel() {
  const loggedIn = Auth.isLoggedIn();
  const user = Auth.user();
  const [mode, setMode] = useState<"text" | "voice">("text");
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSpeechSupported(!!SR);
  }, []);

  // ── shared config ──
  const [targetRole, setTargetRole] = useState(user?.target_role || "Software Engineer");
  const [experienceLevel, setExperienceLevel] = useState("fresher");
  const [difficulty, setDifficulty] = useState("medium");
  const [count, setCount] = useState(5);

  // ── text mode session ──
  const [questions, setQuestions] = useState<MockQuestion[] | null>(null);
  const [qIdx, setQIdx] = useState(0);
  const [answered, setAnswered] = useState<AnsweredItem[]>([]);
  const [answerTab, setAnswerTab] = useState<"type" | "speak">("type");
  const [typedAnswer, setTypedAnswer] = useState("");
  const [scoring, setScoring] = useState(false);
  const [startLoading, setStartLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingResult, setPendingResult] = useState<ScoreResult | null>(null);
  const speakRec = useSpeechRecognition();

  const textActive = !!questions && qIdx < questions.length && !pendingResult;
  const textTimer = useCountdown(textActive, qIdx);

  async function startTextSession() {
    setError("");
    setStartLoading(true);
    try {
      const res = await authApi("POST", "/api/mock-interview/questions", {
        target_role: targetRole,
        difficulty,
        count,
      });
      if (!res?.success || !res?.questions?.length) {
        throw new Error(res?.error || "Could not generate questions.");
      }
      setQuestions(res.questions);
      setQIdx(0);
      setAnswered([]);
      setPendingResult(null);
      setTypedAnswer("");
      speakRec.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start interview.");
    } finally {
      setStartLoading(false);
    }
  }

  async function submitTextAnswer() {
    if (!questions) return;
    const q = questions[qIdx];
    const answer = answerTab === "type" ? typedAnswer : speakRec.transcript;
    if (!answer || answer.trim().length < 10) {
      setError("Write or speak a fuller answer before submitting (at least a sentence or two).");
      return;
    }
    setError("");
    setScoring(true);
    try {
      const res = await authApi("POST", "/api/mock-interview/score", {
        question: q.q,
        answer,
        target_role: targetRole,
        qtype: q.type || "behavioral",
      });
      if (!res?.success) throw new Error(res?.error || "Could not score this answer.");
      const result: ScoreResult = {
        scores: res.scores,
        overall: res.overall,
        verdict: res.verdict,
        strengths: res.strengths,
        improvements: res.improvements,
        model_answer: res.model_answer,
      };
      setPendingResult(result);
      setAnswered((prev) => [...prev, { question: q.q, answer, result }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to score answer.");
    } finally {
      setScoring(false);
    }
  }

  function nextTextQuestion() {
    setPendingResult(null);
    setTypedAnswer("");
    speakRec.reset();
    setAnswerTab("type");
    setQIdx((i) => i + 1);
  }

  function restartText() {
    setQuestions(null);
    setQIdx(0);
    setAnswered([]);
    setPendingResult(null);
    setTypedAnswer("");
    setError("");
  }

  // ── voice mode session ──
  const [voiceSessionId, setVoiceSessionId] = useState<number | null>(null);
  const [voiceQuestion, setVoiceQuestion] = useState("");
  const [voiceTotal, setVoiceTotal] = useState(0);
  const [voiceAnsweredCount, setVoiceAnsweredCount] = useState(0);
  const [voiceDone, setVoiceDone] = useState(false);
  const [voiceReport, setVoiceReport] = useState("");
  const [voiceLastFeedback, setVoiceLastFeedback] = useState<{ score: number; feedback: string } | null>(null);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [voiceTyped, setVoiceTyped] = useState("");
  const voiceRec = useSpeechRecognition();
  const voiceTimer = useCountdown(!!voiceSessionId && !voiceDone, voiceQuestion);

  async function startVoiceSession() {
    setError("");
    setVoiceLoading(true);
    try {
      const res: VoiceStartResp = await authApi("POST", "/api/mock-interview/voice/start", {
        company_id: -1,
        role: targetRole,
        difficulty,
      });
      if (!res?.success) throw new Error("Could not start voice interview.");
      setVoiceSessionId(res.session_id ?? null);
      setVoiceQuestion(res.first_question || "");
      setVoiceTotal(res.total_questions || 3);
      setVoiceAnsweredCount(0);
      setVoiceDone(false);
      setVoiceReport("");
      setVoiceLastFeedback(null);
      voiceRec.reset();
      setVoiceTyped("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start voice interview. Login required.");
    } finally {
      setVoiceLoading(false);
    }
  }

  async function submitVoiceAnswer() {
    if (voiceSessionId == null) return;
    const answer = (voiceRec.transcript || voiceTyped).trim();
    if (answer.length < 5) {
      setError("Speak or type your answer before submitting.");
      return;
    }
    setError("");
    setVoiceLoading(true);
    try {
      const res: VoiceAnswerResp = await authApi("POST", "/api/mock-interview/voice/answer", {
        session_id: voiceSessionId,
        answer_text: answer,
      });
      setVoiceAnsweredCount((c) => c + 1);
      setVoiceLastFeedback({ score: res.score ?? 0, feedback: res.feedback || "" });
      if (res.done) {
        setVoiceDone(true);
        setVoiceReport(res.report || "");
      } else {
        setVoiceQuestion(res.next_question || "");
      }
      voiceRec.reset();
      setVoiceTyped("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit answer.");
    } finally {
      setVoiceLoading(false);
    }
  }

  function restartVoice() {
    setVoiceSessionId(null);
    setVoiceQuestion("");
    setVoiceDone(false);
    setVoiceReport("");
    setVoiceLastFeedback(null);
    setError("");
  }

  // ── PDF / transcript export ──
  const [pdfState, setPdfState] = useState<"idle" | "loading" | "error">("idle");

  async function exportReportPdf(reportText: string, transcript: string) {
    setPdfState("loading");
    try {
      const res = await authApi("POST", "/api/interview/report-pdf", {
        target_role: targetRole,
        report: reportText,
        transcript,
      });
      const url = res?.pdf_url || res?.url;
      if (url) {
        window.open(url, "_blank");
        setPdfState("idle");
      } else {
        throw new Error("no url in response");
      }
    } catch {
      setPdfState("error");
    }
  }

  if (!loggedIn) {
    return (
      <div className="flex flex-col gap-5">
        <div className="tcard flex flex-col items-center justify-center py-20 text-center">
          <LogIn className="h-6 w-6 text-[#55556a] mb-3" />
          <p className="font-bold text-[#9090b0]">Login to practice</p>
          <p className="text-xs text-[#55556a] mt-1 max-w-sm">
            AI Mock Interview tracks your session and scores your answers per-user — sign in from the top bar
            to start practicing.
          </p>
        </div>
        <StarCheatSheet />
      </div>
    );
  }

  const avgScore = answered.length
    ? Math.round(answered.reduce((s, a) => s + (a.result.overall || 0), 0) / answered.length)
    : 0;
  const textSessionDone = !!questions && qIdx >= questions.length;

  return (
    <div className="flex flex-col gap-5">
      {/* Mode tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setMode("text")}
          className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg cursor-pointer transition-colors border"
          style={
            mode === "text"
              ? { background: "linear-gradient(115deg, var(--primary), var(--secondary))", borderColor: "transparent", color: "white" }
              : { background: "transparent", borderColor: "var(--border)", color: "#9090b0" }
          }
        >
          <Keyboard className="h-3.5 w-3.5" /> Text Interview
        </button>
        {speechSupported && (
          <button
            onClick={() => setMode("voice")}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg cursor-pointer transition-colors border"
            style={
              mode === "voice"
                ? { background: "linear-gradient(115deg, var(--primary), var(--secondary))", borderColor: "transparent", color: "white" }
                : { background: "transparent", borderColor: "var(--border)", color: "#9090b0" }
            }
          >
            <Radio className="h-3.5 w-3.5" /> Voice Interview
          </button>
        )}
      </div>

      {error && (
        <div className="tcard flex items-center gap-2 border-[var(--red)]/30 text-sm text-[var(--red-l)]">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {mode === "text" && (
        <>
          {!questions && (
            <GlowCard className="tcard">
              <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] mb-4">Configure your session</p>
              <div className="grid sm:grid-cols-2 gap-3.5 mb-4">
                <div>
                  <label className="text-[11px] font-bold text-[#55556a] mb-1.5 block">Target Role</label>
                  <input
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Backend Engineer"
                    className="w-full text-sm px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[var(--primary)]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#55556a] mb-1.5 block">Experience Level</label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full text-sm px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[var(--primary)]/50 transition-colors"
                  >
                    <option value="fresher">Fresher</option>
                    <option value="junior">Junior (0-2 yr)</option>
                    <option value="mid">Mid (2-5 yr)</option>
                    <option value="senior">Senior (5+ yr)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#55556a] mb-1.5 block">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full text-sm px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[var(--primary)]/50 transition-colors"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#55556a] mb-1.5 block">Number of Questions</label>
                  <select
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="w-full text-sm px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[var(--primary)]/50 transition-colors"
                  >
                    {[3, 5, 7, 10].map((n) => (
                      <option key={n} value={n}>
                        {n} questions
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={startTextSession}
                disabled={startLoading || !targetRole.trim()}
                className="flex items-center justify-center gap-2 text-sm font-bold px-5 py-3 rounded-xl text-white cursor-pointer transition-opacity disabled:opacity-50 w-full sm:w-auto"
                style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
              >
                {startLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Start Interview
              </button>
            </GlowCard>
          )}

          {questions && !textSessionDone && (
            <div className="flex flex-col gap-4">
              <div className="tcard">
                <div className="flex items-center justify-between mb-2 text-xs text-[#55556a] font-bold">
                  <span>
                    Question {qIdx + 1} / {questions.length}
                  </span>
                  <span className={`flex items-center gap-1.5 ${textTimer.secondsLeft <= 15 ? "text-[var(--red-l)]" : ""}`}>
                    <Timer className="h-3.5 w-3.5" /> {textTimer.label}
                    {textTimer.secondsLeft === 0 && " · Time's up"}
                  </span>
                </div>
                <ProgressBar pct={(qIdx / questions.length) * 100} />
              </div>

              <GlowCard className="tcard">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <p className="text-base font-semibold leading-relaxed">{questions[qIdx].q}</p>
                  <button
                    onClick={() => speak(questions[qIdx].q)}
                    title="Listen to Question"
                    className="shrink-0 flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors"
                  >
                    <Volume2 className="h-3.5 w-3.5" /> Listen
                  </button>
                </div>
                <span className="inline-block text-[10px] font-black px-2 py-1 rounded-full bg-[#7c3aed]/15 text-[#a78bfa] uppercase">
                  {questions[qIdx].type || "behavioral"}
                </span>

                {!pendingResult && (
                  <>
                    <div className="flex items-center gap-2 mt-4 mb-3">
                      <button
                        onClick={() => setAnswerTab("type")}
                        className="text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors border"
                        style={
                          answerTab === "type"
                            ? { background: "rgba(124,58,237,0.15)", borderColor: "rgba(124,58,237,0.4)", color: "#a78bfa" }
                            : { background: "transparent", borderColor: "var(--border)", color: "#9090b0" }
                        }
                      >
                        Type
                      </button>
                      {speechSupported && (
                        <button
                          onClick={() => setAnswerTab("speak")}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors border"
                          style={
                            answerTab === "speak"
                              ? { background: "rgba(124,58,237,0.15)", borderColor: "rgba(124,58,237,0.4)", color: "#a78bfa" }
                              : { background: "transparent", borderColor: "var(--border)", color: "#9090b0" }
                          }
                        >
                          Speak
                        </button>
                      )}
                    </div>

                    {answerTab === "type" ? (
                      <textarea
                        value={typedAnswer}
                        onChange={(e) => setTypedAnswer(e.target.value)}
                        rows={5}
                        placeholder="Type your answer here..."
                        className="w-full text-sm px-3.5 py-3 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[var(--primary)]/50 transition-colors resize-none"
                      />
                    ) : (
                      <div className="flex flex-col gap-2.5">
                        <div className="min-h-[110px] text-sm px-3.5 py-3 rounded-lg bg-white/5 border border-white/10 text-[#9090b0]">
                          {speakRec.transcript || "Press the mic and start speaking — your words will appear here."}
                        </div>
                        <button
                          onClick={() => (speakRec.listening ? speakRec.stop() : speakRec.start())}
                          className="flex items-center justify-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg cursor-pointer transition-colors self-start"
                          style={
                            speakRec.listening
                              ? { background: "rgba(239,68,68,0.15)", color: "var(--red-l)", animation: "micPulse 1.6s infinite" }
                              : { background: "rgba(124,58,237,0.15)", color: "#a78bfa" }
                          }
                        >
                          {speakRec.listening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                          {speakRec.listening ? "Stop Recording" : "Start Recording"}
                        </button>
                      </div>
                    )}

                    <button
                      onClick={submitTextAnswer}
                      disabled={scoring}
                      className="flex items-center justify-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl text-white cursor-pointer transition-opacity disabled:opacity-50 mt-3.5"
                      style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
                    >
                      {scoring ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      Submit Answer
                    </button>
                  </>
                )}
              </GlowCard>

              {pendingResult && (
                <>
                  <FeedbackCard result={pendingResult} />
                  <button
                    onClick={nextTextQuestion}
                    className="flex items-center justify-center gap-2 text-sm font-bold px-5 py-3 rounded-xl text-white cursor-pointer transition-opacity self-start"
                    style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
                  >
                    {qIdx + 1 >= questions.length ? "Finish Interview" : "Next Question"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          )}

          {textSessionDone && (
            <div className="flex flex-col gap-4">
              <GlowCard className="tcard flex flex-col items-center text-center py-8">
                <Trophy className="h-8 w-8 text-[var(--gold-l)] mb-3" />
                <p className="text-3xl font-black">{avgScore}/100</p>
                <p className="text-xs text-[#55556a] mt-1">Average score across {answered.length} answers</p>
                <div className="flex items-center gap-2.5 mt-5">
                  <button
                    onClick={restartText}
                    className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Practice Again
                  </button>
                  <button
                    onClick={() =>
                      exportReportPdf(
                        `Interview report — ${targetRole} (avg ${avgScore}/100)`,
                        answered.map((a, i) => `Q${i + 1}: ${a.question}\nA: ${a.answer}\nScore: ${a.result.overall}/100 — ${a.result.verdict || ""}`).join("\n\n")
                      )
                    }
                    disabled={pdfState === "loading"}
                    className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors disabled:opacity-50"
                  >
                    {pdfState === "loading" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                    Download PDF Report
                  </button>
                </div>
                {pdfState === "error" && (
                  <p className="text-[11px] text-[#55556a] mt-2.5">
                    PDF export isn&apos;t available yet on the server.{" "}
                    <CopyTranscriptInline
                      text={answered
                        .map((a, i) => `Q${i + 1}: ${a.question}\nA: ${a.answer}\nScore: ${a.result.overall}/100 — ${a.result.verdict || ""}`)
                        .join("\n\n")}
                    />
                  </p>
                )}
              </GlowCard>

              <div className="flex flex-col gap-3">
                {answered.map((a, i) => (
                  <div key={i} className="tcard">
                    <p className="text-xs font-bold text-[#55556a] mb-1">Q{i + 1}. {a.question}</p>
                    <p className="text-sm text-[#9090b0] mb-2">{a.answer}</p>
                    <FeedbackCard result={a.result} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {mode === "voice" && (
        <>
          {voiceSessionId == null && (
            <GlowCard className="tcard">
              <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] mb-4">
                Configure your voice interview
              </p>
              <div className="grid sm:grid-cols-2 gap-3.5 mb-4">
                <div>
                  <label className="text-[11px] font-bold text-[#55556a] mb-1.5 block">Target Role</label>
                  <input
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Frontend Developer"
                    className="w-full text-sm px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[var(--primary)]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#55556a] mb-1.5 block">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full text-sm px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[var(--primary)]/50 transition-colors"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
              <button
                onClick={startVoiceSession}
                disabled={voiceLoading || !targetRole.trim()}
                className="flex items-center justify-center gap-2 text-sm font-bold px-5 py-3 rounded-xl text-white cursor-pointer transition-opacity disabled:opacity-50 w-full sm:w-auto"
                style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
              >
                {voiceLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Radio className="h-4 w-4" />}
                Start Voice Interview
              </button>
            </GlowCard>
          )}

          {voiceSessionId != null && !voiceDone && (
            <div className="flex flex-col gap-4">
              <div className="tcard">
                <div className="flex items-center justify-between mb-2 text-xs text-[#55556a] font-bold">
                  <span>
                    Question {voiceAnsweredCount + 1} / {voiceTotal}
                  </span>
                  <span className={`flex items-center gap-1.5 ${voiceTimer.secondsLeft <= 15 ? "text-[var(--red-l)]" : ""}`}>
                    <Timer className="h-3.5 w-3.5" /> {voiceTimer.label}
                  </span>
                </div>
                <ProgressBar pct={(voiceAnsweredCount / Math.max(1, voiceTotal)) * 100} />
              </div>

              {voiceLastFeedback && (
                <div className="tcard flex items-center gap-3 border-[var(--primary)]/20">
                  <span
                    className="text-xs font-black px-2.5 py-1 rounded-full text-white shrink-0"
                    style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
                  >
                    {voiceLastFeedback.score}/100
                  </span>
                  <p className="text-xs text-[#9090b0]">{voiceLastFeedback.feedback}</p>
                </div>
              )}

              <GlowCard className="tcard">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <p className="text-base font-semibold leading-relaxed">{voiceQuestion}</p>
                  <button
                    onClick={() => speak(voiceQuestion)}
                    title="Listen to Question"
                    className="shrink-0 flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors"
                  >
                    <Volume2 className="h-3.5 w-3.5" /> Listen
                  </button>
                </div>

                <div className="min-h-[90px] text-sm px-3.5 py-3 rounded-lg bg-white/5 border border-white/10 text-[#9090b0] mb-2.5">
                  {voiceRec.transcript || "Press the mic and speak your answer — your words will appear here."}
                </div>
                <button
                  onClick={() => (voiceRec.listening ? voiceRec.stop() : voiceRec.start())}
                  className="flex items-center justify-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg cursor-pointer transition-colors self-start"
                  style={
                    voiceRec.listening
                      ? { background: "rgba(239,68,68,0.15)", color: "var(--red-l)", animation: "micPulse 1.6s infinite" }
                      : { background: "rgba(124,58,237,0.15)", color: "#a78bfa" }
                  }
                >
                  {voiceRec.listening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                  {voiceRec.listening ? "Stop Recording" : "Start Recording"}
                </button>

                <div className="mt-3">
                  <label className="text-[11px] font-bold text-[#55556a] mb-1.5 block">Or type your answer</label>
                  <textarea
                    value={voiceTyped}
                    onChange={(e) => setVoiceTyped(e.target.value)}
                    rows={2}
                    placeholder="(optional — used only if the transcript above is empty)"
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[var(--primary)]/50 transition-colors resize-none"
                  />
                </div>

                <button
                  onClick={submitVoiceAnswer}
                  disabled={voiceLoading}
                  className="flex items-center justify-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl text-white cursor-pointer transition-opacity disabled:opacity-50 mt-3.5"
                  style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
                >
                  {voiceLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Submit Answer
                </button>
              </GlowCard>
            </div>
          )}

          {voiceDone && (
            <GlowCard className="tcard">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="h-5 w-5 text-[var(--gold-l)]" />
                <p className="text-xs font-bold uppercase tracking-wide text-[#55556a]">Interview Complete</p>
              </div>
              <div className="text-sm leading-relaxed whitespace-pre-wrap text-[#eeeef8]">{voiceReport}</div>
              <div className="flex items-center gap-2.5 mt-5">
                <button
                  onClick={restartVoice}
                  className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Practice Again
                </button>
                <button
                  onClick={() => exportReportPdf(voiceReport, voiceReport)}
                  disabled={pdfState === "loading"}
                  className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors disabled:opacity-50"
                >
                  {pdfState === "loading" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                  Download PDF Report
                </button>
              </div>
              {pdfState === "error" && (
                <p className="text-[11px] text-[#55556a] mt-2.5">
                  PDF export isn&apos;t available yet on the server. <CopyTranscriptInline text={voiceReport} />
                </p>
              )}
            </GlowCard>
          )}
        </>
      )}

      <StarCheatSheet />
    </div>
  );
}

function CopyTranscriptInline({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // ignore
        }
      }}
      className="underline decoration-dotted hover:text-[#9090b0] cursor-pointer"
    >
      {copied ? "Copied to clipboard" : "Copy transcript instead"}
    </button>
  );
}
