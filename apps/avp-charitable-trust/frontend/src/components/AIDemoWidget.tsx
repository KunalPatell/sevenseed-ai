"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Sparkles, ArrowRight, Bot } from "lucide-react";

const EXAMPLES = [
  "How does the Trust choose which communities to help?",
  "What happens to my donation after I give?",
  "Am I eligible for an 80G tax receipt?",
];

function renderReply(text: string) {
  return text.split("\n").map((line, i) => (
    <p key={i} className={line.trim() ? "mb-1.5" : "h-2"}>
      {line.split(/\*\*(.+?)\*\*/g).map((part, j) =>
        j % 2 === 1 ? (
          <strong key={j} className="text-[#ffe4e6]">
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
      const res = await fetch("/trust/api/donor/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.slice(0, 400) }),
      });
      if (res.status === 429) {
        const data = await res.json().catch(() => null);
        setError(data?.detail || "This assistant is popular right now — please try again in a moment.");
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
      setError("Couldn't reach the assistant right now. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  }

  function useExample(q: string) {
    setQuestion(q);
  }

  return (
    <div className="glow-card bg-gradient-to-br from-[#180b0f] to-[#10080a] border border-white/5 rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-2 mb-1">
        <Bot className="h-4 w-4 text-[#fef3c7]" />
        <span className="text-xs font-bold tracking-wider text-[#fef3c7] uppercase">Live demo · Real AI, no signup</span>
      </div>
      <h4 className="text-lg font-bold text-white mb-1">Ask our Donor Assistant</h4>
      <p className="text-xs md:text-sm text-[#c8bdc0] mb-5">
        General information about our programs and how donations are used — not financial or tax advice.
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        {EXAMPLES.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => useExample(q)}
            className="text-[11px] px-3 py-1.5 rounded-full border border-white/10 text-[#c8bdc0] hover:text-white hover:border-[#f43f5e]/50 hover:bg-[#f43f5e]/10 transition-all"
          >
            &ldquo;{q}&rdquo;
          </button>
        ))}
      </div>

      <form onSubmit={runDemo} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about donations, programs, or 80G tax receipts..."
          maxLength={400}
          required
          className="flex-1 w-full px-4 py-3 bg-[#10080a] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#f43f5e]"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="btn w-full sm:w-fit px-6 py-3 rounded-lg bg-gradient-to-r from-[#f43f5e] to-[#f59e0b] text-white font-semibold text-sm hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2 justify-center shrink-0"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> Ask
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
            className="mt-6 bg-[#10080a] border border-[#f43f5e]/25 rounded-xl p-5"
          >
            <div className="text-[10px] font-bold tracking-wider text-[#fef3c7] uppercase mb-3">AI Generated · General Information Only</div>
            <div className="text-sm text-[#faf5f6] leading-relaxed">{renderReply(result)}</div>
            <a
              href="/app/"
              className="inline-flex items-center gap-1.5 text-xs text-[#fef3c7] font-semibold mt-4 hover:underline"
            >
              Chat further in the NGO Portal <ArrowRight className="h-3 w-3" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
