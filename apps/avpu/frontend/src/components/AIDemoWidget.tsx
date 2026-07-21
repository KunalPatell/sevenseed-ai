"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Sparkles, ArrowRight, GraduationCap } from "lucide-react";

// This widget is served under the "/avpu" basePath when merged into the
// Sevenseed hub (see apps/sevenseed/backend/child_processes.py) — same
// convention the Student Portal dashboard uses for its own API calls.
const API_BASE = "/avpu";

const EXAMPLES = [
  "Explain binary search in simple terms",
  "What's the difference between SQL JOIN types?",
  "How does gradient descent work?",
  "What documents do I need for admission?",
];

function renderReply(text: string) {
  return text.split("\n").map((line, i) => (
    <p key={i} className={line.trim() ? "mb-1.5" : "h-2"}>
      {line.split(/\*\*(.+?)\*\*/g).map((part, j) =>
        j % 2 === 1 ? (
          <strong key={j} className="text-[#c7d2fe]">
            {part}
          </strong>
        ) : (
          part
        )
      )}
    </p>
  ));
}

export function AIDemoWidget() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  async function runDemo(e?: React.FormEvent) {
    e?.preventDefault();
    if (!question.trim() || loading) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch(`${API_BASE}/api/tutor/demo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.slice(0, 300) }),
      });
      if (res.status === 429) {
        const data = await res.json().catch(() => null);
        setError(data?.detail || "Our AI Tutor is popular right now — please try again in a moment.");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.detail || "Something went wrong. Please try again.");
        return;
      }
      const data = await res.json();
      setResult(data.reply || "");
    } catch {
      setError("Couldn't reach the AI Tutor right now. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  }

  function useExample(ex: string) {
    setQuestion(ex);
  }

  return (
    <div className="glow-card bg-gradient-to-br from-[#12121e] to-[#0d0d16] border border-white/5 rounded-2xl p-6 md:p-8 mt-8">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="h-4 w-4 text-[#93c5fd]" />
        <span className="text-xs font-bold tracking-wider text-[#93c5fd] uppercase">Live demo · Real AI, no signup</span>
      </div>
      <h4 className="text-lg font-bold text-white mb-1">Ask our AI Tutor a study question</h4>
      <p className="text-xs md:text-sm text-[#9aa0b8] mb-5">
        Type any course topic — our RAG-grounded tutor agent will explain it, live, right here.
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => useExample(ex)}
            className="text-[11px] px-3 py-1.5 rounded-full border border-white/10 text-[#9aa0b8] hover:text-white hover:border-[#6366f1]/50 hover:bg-[#6366f1]/10 transition-all"
          >
            &ldquo;{ex}&rdquo;
          </button>
        ))}
      </div>

      <form onSubmit={runDemo} className="flex flex-col gap-3">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. Explain binary search in simple terms"
          maxLength={300}
          required
          className="w-full px-4 py-3 bg-[#0d0d16] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#6366f1]"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="btn w-fit self-center px-6 py-3 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#3b82f6] text-white font-semibold text-sm hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
            </>
          ) : (
            <>
              <GraduationCap className="h-4 w-4" /> Ask the AI Tutor
            </>
          )}
        </button>
      </form>

      {error && (
        <p className="text-xs text-[#fca5a5] font-medium mt-4 text-center">{error}</p>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6 bg-[#0d0d16] border border-[#6366f1]/25 rounded-xl p-5"
          >
            <div className="text-[10px] font-bold tracking-wider text-[#93c5fd] uppercase mb-3">AI Tutor</div>
            <div className="text-sm text-[#eeeef8] leading-relaxed">{renderReply(result)}</div>
            <a
              href="/app/"
              className="inline-flex items-center gap-1.5 text-xs text-[#93c5fd] font-semibold mt-4 hover:underline"
            >
              Get full tutoring, saved sessions & adaptive roadmaps in the Student Portal <ArrowRight className="h-3 w-3" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
