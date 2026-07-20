"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Sparkles, ArrowRight } from "lucide-react";
import { apiFetch } from "@/lib/api";

const EXAMPLES = [
  { domain: "Rural healthcare", problem: "Clinics lose patients to missed follow-up appointments" },
  { domain: "College placements", problem: "Students don't know which skills recruiters actually want" },
  { domain: "Local pharmacies", problem: "Handwritten prescriptions cause dangerous dispensing errors" },
];

function renderIdea(text: string) {
  return text.split("\n").map((line, i) => (
    <p key={i} className={line.trim() ? "mb-1.5" : "h-2"}>
      {line.split(/\*\*(.+?)\*\*/g).map((part, j) =>
        j % 2 === 1 ? (
          <strong key={j} className="text-[#ddd6fe]">
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
  const [domain, setDomain] = useState("");
  const [problem, setProblem] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  async function runDemo(e?: React.FormEvent) {
    e?.preventDefault();
    if (!domain.trim() || loading) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await apiFetch("/api/ideate/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domain.slice(0, 80), problem: problem.slice(0, 400) }),
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
      setResult(data.idea || "");
    } catch {
      setError("Couldn't reach the AI right now. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  }

  function useExample(ex: { domain: string; problem: string }) {
    setDomain(ex.domain);
    setProblem(ex.problem);
  }

  return (
    <div className="glow-card bg-gradient-to-br from-[#12121e] to-[#0d0d16] border border-white/5 rounded-2xl p-6 md:p-8 mt-8">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="h-4 w-4 text-[#6ee7b7]" />
        <span className="text-xs font-bold tracking-wider text-[#6ee7b7] uppercase">Live demo · Real AI, no signup</span>
      </div>
      <h4 className="text-lg font-bold text-white mb-1">Try it right now</h4>
      <p className="text-xs md:text-sm text-[#9aa0b8] mb-5">
        Describe a domain and a problem — our venture-ideation agent will draft one real AI-native concept, live.
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.domain}
            type="button"
            onClick={() => useExample(ex)}
            className="text-[11px] px-3 py-1.5 rounded-full border border-white/10 text-[#9aa0b8] hover:text-white hover:border-[#8b5cf6]/50 hover:bg-[#8b5cf6]/10 transition-all"
          >
            &ldquo;{ex.domain}: {ex.problem}&rdquo;
          </button>
        ))}
      </div>

      <form onSubmit={runDemo} className="flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Business domain (e.g. rural healthcare)"
            maxLength={80}
            required
            className="w-full px-4 py-3 bg-[#0d0d16] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#8b5cf6]"
          />
          <input
            type="text"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="The problem (optional)"
            maxLength={400}
            className="w-full px-4 py-3 bg-[#0d0d16] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#8b5cf6]"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !domain.trim()}
          className="btn w-fit self-center px-6 py-3 rounded-lg bg-gradient-to-r from-[#8b5cf6] to-[#10b981] text-white font-semibold text-sm hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> Generate my AI venture idea
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
            className="mt-6 bg-[#0d0d16] border border-[#8b5cf6]/25 rounded-xl p-5"
          >
            <div className="text-[10px] font-bold tracking-wider text-[#6ee7b7] uppercase mb-3">AI Generated</div>
            <div className="text-sm text-[#eeeef8] leading-relaxed">{renderIdea(result)}</div>
            <a
              href="/app/"
              className="inline-flex items-center gap-1.5 text-xs text-[#6ee7b7] font-semibold mt-4 hover:underline"
            >
              Get all 3 pitches + a 90-day MVP plan in the Studio Hub <ArrowRight className="h-3 w-3" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
