"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  ChevronRight,
  LogIn,
} from "lucide-react";
import { GlowCard } from "@/components/GlowCard";
import { authApi } from "@/lib/api";
import { Auth } from "@/lib/auth";

interface Question {
  id: string | number;
  q: string;
  opts: string[];
}

interface SubmitResult {
  passed: boolean;
  score: number;
  total: number;
  suspicious: boolean;
  tab_strikes: number;
  message: string;
}

type Phase =
  | "not-logged-in"
  | "intro"
  | "loading"
  | "already-verified"
  | "cooldown"
  | "session"
  | "submitting"
  | "result"
  | "error";

const RULES = [
  "20 questions, 45 seconds each — the timer auto-advances if you run out of time.",
  "Score 14/20 (70%) or higher to pass and earn the Comonk Verified badge.",
  "The test runs in fullscreen. Leaving fullscreen or switching tabs counts as a strike.",
  "You get 2 warnings — a 3rd strike auto-submits your test immediately.",
  "Right-click, copy and paste are disabled on the question screen.",
  "One attempt per 24 hours if you don't pass.",
];

export function AptitudePanel() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [errorMsg, setErrorMsg] = useState("");
  const [cooldownHours, setCooldownHours] = useState(0);
  const [fsBlocked, setFsBlocked] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answerKey, setAnswerKey] = useState<Record<string, number>>({});
  const [timePerQ, setTimePerQ] = useState(45);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(45);
  const [strikes, setStrikes] = useState(0);
  const [warning, setWarning] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);

  const strikesRef = useRef(0);
  const lastStrikeAtRef = useRef(0);
  const startTimeRef = useRef(0);
  const submittingRef = useRef(false);
  const answersRef = useRef<Record<string, number>>({});
  const answerKeyRef = useRef<Record<string, number>>({});
  const submitFnRef = useRef<() => void>(() => {});

  useEffect(() => {
    const user = Auth.user();
    if (!Auth.isLoggedIn()) {
      setPhase("not-logged-in");
    } else if (user?.is_verified) {
      setPhase("already-verified");
    } else {
      setPhase("intro");
    }
  }, []);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);
  useEffect(() => {
    answerKeyRef.current = answerKey;
  }, [answerKey]);

  const submitTest = useCallback(async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setPhase("submitting");
    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);
    try {
      const res = await authApi("POST", "/api/test/submit", {
        answers: answersRef.current,
        answer_key: answerKeyRef.current,
        tab_switches: strikesRef.current,
        time_taken: timeTaken,
      });
      if (res?.already_verified) {
        setPhase("already-verified");
      } else {
        setResult(res as SubmitResult);
        setPhase("result");
      }
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Failed to submit test.");
      setPhase("error");
    }
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    submitFnRef.current = submitTest;
  }, [submitTest]);

  const registerStrike = useCallback((reason: string) => {
    const now = Date.now();
    if (now - lastStrikeAtRef.current < 1000) return; // debounce simultaneous events
    lastStrikeAtRef.current = now;
    const n = strikesRef.current + 1;
    strikesRef.current = n;
    setStrikes(n);
    if (n >= 3) {
      setWarning(`Strike ${n}/3 — ${reason} Your test has been auto-submitted.`);
      submitFnRef.current();
    } else {
      setWarning(`Strike ${n}/3 — ${reason} One more strike after this and your test auto-fails.`);
    }
  }, []);

  // Anti-cheat listeners — only live during an active session
  useEffect(() => {
    if (phase !== "session") return;
    function onVisibility() {
      if (document.hidden) registerStrike("You switched tabs or minimized the window.");
    }
    function onFullscreenChange() {
      if (!document.fullscreenElement) registerStrike("You exited fullscreen mode.");
    }
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, [phase, registerStrike]);

  // Auto-dismiss warning banner
  useEffect(() => {
    if (!warning) return;
    const t = setTimeout(() => setWarning(null), 4500);
    return () => clearTimeout(t);
  }, [warning]);

  const goNext = useCallback(() => {
    setCurrentIndex((idx) => {
      if (idx >= questions.length - 1) {
        submitFnRef.current();
        return idx;
      }
      return idx + 1;
    });
  }, [questions.length]);

  // Per-question countdown
  useEffect(() => {
    if (phase !== "session") return;
    setTimeLeft(timePerQ);
    const iv = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(iv);
  }, [phase, currentIndex, timePerQ]);

  useEffect(() => {
    if (phase !== "session" || timeLeft !== 0) return;
    goNext();
  }, [timeLeft, phase, goNext]);

  async function startTest() {
    setErrorMsg("");
    setFsBlocked(false);
    setPhase("loading");
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      setFsBlocked(true);
    }
    try {
      const res = await authApi("GET", "/api/test/questions");
      if (res?.already_verified) {
        setPhase("already-verified");
        return;
      }
      if (res?.cooldown) {
        setCooldownHours(res.wait_hours || 24);
        setPhase("cooldown");
        return;
      }
      const qs: Question[] = res.questions || [];
      setQuestions(qs);
      setAnswerKey(res.answer_key || {});
      setTimePerQ(res.time_per_q || 45);
      setCurrentIndex(0);
      setAnswers({});
      strikesRef.current = 0;
      setStrikes(0);
      submittingRef.current = false;
      startTimeRef.current = Date.now();
      setPhase("session");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Could not load test questions.");
      setPhase("error");
      if (document.fullscreenElement) {
        try {
          await document.exitFullscreen();
        } catch {
          // ignore
        }
      }
    }
  }

  function selectOption(qid: string | number, optIdx: number) {
    setAnswers((a) => ({ ...a, [String(qid)]: optIdx }));
  }

  // ── Not logged in ──────────────────────────────────────────────
  if (phase === "not-logged-in") {
    return (
      <div className="tcard flex flex-col items-center justify-center py-16 text-center gap-3">
        <LogIn className="h-8 w-8 text-[#55556a]" />
        <p className="font-bold">Log in to take the verification test</p>
        <p className="text-xs text-[#55556a] max-w-sm">
          Passing the Comonk Aptitude Test unlocks the &quot;Comonk Verified&quot; badge and HR contact access.
        </p>
      </div>
    );
  }

  // ── Already verified ───────────────────────────────────────────
  if (phase === "already-verified") {
    return (
      <GlowCard className="tcard flex flex-col items-center justify-center py-16 text-center gap-3">
        <div className="h-16 w-16 rounded-full flex items-center justify-center bg-[#10b981]/15 border border-[#10b981]/40">
          <ShieldCheck className="h-8 w-8 text-[#6ee7b7]" />
        </div>
        <p className="font-black text-lg">You&apos;re already Comonk Verified!</p>
        <p className="text-xs text-[#55556a] max-w-sm">
          Your profile carries the verified badge — HR contacts and priority matching are unlocked.
        </p>
      </GlowCard>
    );
  }

  // ── Cooldown ────────────────────────────────────────────────────
  if (phase === "cooldown") {
    return (
      <div className="tcard flex flex-col items-center justify-center py-16 text-center gap-3">
        <Clock className="h-8 w-8 text-[#f59e0b]" />
        <p className="font-bold">Come back in {cooldownHours} hour(s)</p>
        <p className="text-xs text-[#55556a] max-w-sm">
          You&apos;ve already attempted the test recently. Retesting is limited to once every 24 hours.
        </p>
      </div>
    );
  }

  // ── Error ───────────────────────────────────────────────────────
  if (phase === "error") {
    return (
      <div className="tcard flex flex-col items-center justify-center py-16 text-center gap-3">
        <AlertTriangle className="h-8 w-8 text-[#fca5a5]" />
        <p className="font-bold">Something went wrong</p>
        <p className="text-xs text-[#55556a] max-w-sm">{errorMsg}</p>
        <button
          onClick={() => setPhase("intro")}
          className="mt-2 text-xs font-bold px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:text-white cursor-pointer"
        >
          Back
        </button>
      </div>
    );
  }

  // ── Loading ─────────────────────────────────────────────────────
  if (phase === "loading" || phase === "submitting") {
    return (
      <div className="tcard flex flex-col items-center justify-center py-20 text-center gap-3">
        <Loader2 className="h-7 w-7 text-[#a78bfa] animate-spin" />
        <p className="text-sm font-semibold text-[#9090b0]">
          {phase === "loading" ? "Preparing your test…" : "Submitting your results…"}
        </p>
      </div>
    );
  }

  // ── Result ──────────────────────────────────────────────────────
  if (phase === "result" && result) {
    const passed = result.passed;
    return (
      <GlowCard className="tcard flex flex-col items-center justify-center py-14 text-center gap-4">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className={`h-20 w-20 rounded-full flex items-center justify-center border ${
            passed ? "bg-[#10b981]/15 border-[#10b981]/40" : "bg-[#ef4444]/15 border-[#ef4444]/40"
          }`}
        >
          {passed ? (
            <ShieldCheck className="h-10 w-10 text-[#6ee7b7]" />
          ) : (
            <XCircle className="h-10 w-10 text-[#fca5a5]" />
          )}
        </motion.div>
        {passed && (
          <span className="text-[10px] font-black px-3 py-1.5 rounded-full bg-[#10b981]/15 text-[#6ee7b7] tracking-wide">
            ✓ COMONK VERIFIED
          </span>
        )}
        <p className="text-2xl font-black">
          {result.score} / {result.total}
        </p>
        <p className="text-sm text-[#9090b0] max-w-md">{result.message}</p>
        {result.suspicious && (
          <p className="text-xs text-[#fcd34d] flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5" /> Flagged for review — {result.tab_strikes} strike(s) recorded.
          </p>
        )}
        {!passed && !result.suspicious && (
          <button
            onClick={() => setPhase("intro")}
            className="mt-2 text-xs font-bold px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:text-white cursor-pointer"
          >
            Back to overview
          </button>
        )}
      </GlowCard>
    );
  }

  // ── Session ─────────────────────────────────────────────────────
  if (phase === "session" && questions.length > 0) {
    const q = questions[currentIndex];
    const progressPct = ((currentIndex + 1) / questions.length) * 100;
    const ringPct = timeLeft / timePerQ;
    const ringDanger = timeLeft <= 10;
    const isLast = currentIndex === questions.length - 1;
    const selected = answers[String(q.id)];

    return (
      <div className="flex flex-col gap-4">
        <AnimatePresence>
          {warning && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-xs font-semibold px-4 py-3 rounded-lg bg-[#ef4444]/15 border border-[#ef4444]/30 text-[#fca5a5]"
            >
              <ShieldAlert className="h-4 w-4 shrink-0" />
              {warning}
            </motion.div>
          )}
        </AnimatePresence>

        {fsBlocked && (
          <p className="text-[11px] text-[#fcd34d] flex items-center gap-1.5">
            <AlertTriangle className="h-3 w-3" /> Fullscreen was blocked by your browser — please stay on this tab manually.
          </p>
        )}

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-[10px] font-bold text-[#55556a] mb-1.5 uppercase tracking-wide">
              <span>
                Question {currentIndex + 1} / {questions.length}
              </span>
              <span className="flex items-center gap-1">
                <ShieldAlert className="h-3 w-3" /> Strikes: {strikes}/3
              </span>
            </div>
            <div className="h-2 rounded-full bg-[var(--bg-3)] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, var(--primary), var(--secondary))" }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <div className="relative h-14 w-14 shrink-0">
            <svg viewBox="0 0 44 44" className="h-14 w-14 -rotate-90">
              <circle cx="22" cy="22" r="18" fill="none" stroke="var(--bg-3)" strokeWidth="4" />
              <motion.circle
                cx="22"
                cy="22"
                r="18"
                fill="none"
                stroke={ringDanger ? "#ef4444" : "#7c3aed"}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 18}
                animate={{ strokeDashoffset: 2 * Math.PI * 18 * (1 - ringPct) }}
                transition={{ duration: 0.4, ease: "linear" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-sm font-black ${ringDanger ? "text-[#fca5a5]" : ""}`}>{timeLeft}</span>
            </div>
          </div>
        </div>

        <div
          className="tcard select-none"
          onContextMenu={(e) => e.preventDefault()}
          onCopy={(e) => e.preventDefault()}
          onCut={(e) => e.preventDefault()}
          onPaste={(e) => e.preventDefault()}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm font-bold leading-relaxed mb-5">{q.q}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {q.opts.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => selectOption(q.id, i)}
                    className={`text-left text-xs font-semibold px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                      selected === i
                        ? "bg-[#7c3aed]/15 border-[#7c3aed]/50 text-white"
                        : "bg-white/[0.02] border-white/5 text-[#9090b0] hover:border-white/15"
                    }`}
                  >
                    <span className="text-[#55556a] mr-2">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-end">
          <button
            onClick={goNext}
            className="flex items-center gap-1.5 text-xs font-bold px-5 py-2.5 rounded-lg text-white cursor-pointer"
            style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
          >
            {isLast ? "Submit Test" : "Next"} <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // ── Intro ───────────────────────────────────────────────────────
  return (
    <GlowCard className="tcard flex flex-col items-center text-center gap-5 py-10">
      <div className="h-14 w-14 rounded-full flex items-center justify-center bg-[#7c3aed]/15 border border-[#7c3aed]/40">
        <ShieldCheck className="h-7 w-7 text-[#a78bfa]" />
      </div>
      <div>
        <p className="text-lg font-black">Comonk Verified Aptitude Test</p>
        <p className="text-xs text-[#55556a] mt-1">A short, proctored test to prove your skills are real.</p>
      </div>
      <ul className="text-left text-xs text-[#9090b0] flex flex-col gap-2 max-w-md w-full">
        {RULES.map((r) => (
          <li key={r} className="flex items-start gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#6ee7b7] shrink-0 mt-0.5" />
            {r}
          </li>
        ))}
      </ul>
      <button
        onClick={startTest}
        className="mt-2 flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-lg text-white cursor-pointer"
        style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
      >
        <ShieldCheck className="h-4 w-4" /> Start Test
      </button>
    </GlowCard>
  );
}
