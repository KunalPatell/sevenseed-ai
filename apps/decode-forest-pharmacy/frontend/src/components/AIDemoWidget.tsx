"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Sparkles, ShieldAlert } from "lucide-react";

// This app is served under the "/pharmacy" basePath whether standalone or
// merged into the Sevenseed hub (see src/app/app/page.tsx for the same
// convention) — API calls must go through that prefix, not root-relative "/api/...".
const API_BASE = "/pharmacy";

const EXAMPLES = [
  "What's a safe way to reduce a mild fever at home?",
  "What is Paracetamol generally used for?",
  "Any general tips for a scratchy throat and cold?",
];

function renderReply(text: string) {
  return text.split("\n").map((line, i) => (
    <p key={i} className={line.trim() ? "mb-1.5" : "h-2"}>
      {line.split(/\*\*(.+?)\*\*/g).map((part, j) =>
        j % 2 === 1 ? (
          <strong key={j} className="text-[#6ee7b7]">
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
  const [reply, setReply] = useState("");

  async function runDemo(e?: React.FormEvent) {
    e?.preventDefault();
    if (!question.trim() || loading) return;
    setLoading(true);
    setError("");
    setReply("");
    try {
      const res = await fetch(`${API_BASE}/api/assistant/demo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question.slice(0, 300) }),
      });
      if (res.status === 429) {
        const data = await res.json().catch(() => null);
        setError(data?.detail || "This demo is popular right now — please try again in a moment.");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.detail || "Something went wrong. Please try again.");
        return;
      }
      const data = await res.json();
      setReply(data.reply || "");
    } catch {
      setError("Couldn't reach the AI right now. Please try again shortly.");
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
        <Sparkles className="h-4 w-4 text-[#6ee7b7]" />
        <span className="text-xs font-bold tracking-wider text-[#6ee7b7] uppercase">Live demo · Real AI, no signup</span>
      </div>
      <h4 className="text-lg font-bold text-white mb-1">Ask our AI Health Assistant</h4>
      <p className="text-xs md:text-sm text-[#9aa0b8] mb-3">
        General wellness &amp; medicine-information questions, answered live by the same AI that powers our AI Portal.
      </p>

      <div className="flex items-start gap-2 bg-[#10b981]/5 border border-[#10b981]/20 rounded-lg px-3 py-2 mb-5">
        <ShieldAlert className="h-3.5 w-3.5 text-[#6ee7b7] shrink-0 mt-0.5" />
        <p className="text-[11px] text-[#9aa0b8] leading-relaxed">
          General information only — not a substitute for professional medical advice. This demo does not read prescriptions or check drug interactions; for that, use the full AI Portal.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => useExample(ex)}
            className="text-[11px] px-3 py-1.5 rounded-full border border-white/10 text-[#9aa0b8] hover:text-white hover:border-[#10b981]/50 hover:bg-[#10b981]/10 transition-all"
          >
            &ldquo;{ex}&rdquo;
          </button>
        ))}
      </div>

      <form onSubmit={runDemo} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a general health or medicine question..."
          maxLength={300}
          required
          className="flex-1 w-full px-4 py-3 bg-[#0d0d16] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#10b981]"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="btn w-full sm:w-fit px-6 py-3 rounded-lg bg-gradient-to-r from-[#10b981] to-[#14b8a6] text-white font-semibold text-sm hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
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
        {reply && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6 bg-[#0d0d16] border border-[#10b981]/25 rounded-xl p-5"
          >
            <div className="text-[10px] font-bold tracking-wider text-[#6ee7b7] uppercase mb-3">AI Generated</div>
            <div className="text-sm text-[#eeeef8] leading-relaxed">{renderReply(reply)}</div>
            <Link
              href="/app/"
              className="inline-flex items-center gap-1.5 text-xs text-[#6ee7b7] font-semibold mt-4 hover:underline"
            >
              Get prescription reading, interaction checks &amp; more in the AI Portal →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
