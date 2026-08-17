"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Loader2, AlertCircle, Copy, Check, ThumbsUp, ThumbsDown, Sparkles } from "lucide-react";
import { authApi } from "@/lib/api";

interface EmailScoreResult {
  overall_score?: number;
  personalization_score?: number;
  clarity_score?: number;
  cta_score?: number;
  tone_score?: number;
  personalization_feedback?: string;
  clarity_feedback?: string;
  cta_feedback?: string;
  tone_feedback?: string;
  top_strength?: string;
  top_weakness?: string;
  rewritten?: string;
}

const SUB_SCORES: { key: keyof EmailScoreResult; feedbackKey: keyof EmailScoreResult; label: string }[] = [
  { key: "personalization_score", feedbackKey: "personalization_feedback", label: "Personalization" },
  { key: "clarity_score", feedbackKey: "clarity_feedback", label: "Clarity" },
  { key: "cta_score", feedbackKey: "cta_feedback", label: "Call to Action" },
  { key: "tone_score", feedbackKey: "tone_feedback", label: "Tone" },
];

export function EmailScorerPanel() {
  const [text, setText] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<EmailScoreResult | null>(null);
  const [copied, setCopied] = useState(false);

  const tooShort = text.trim().length > 0 && text.trim().length < 30;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (text.trim().length < 30) {
      setError("Paste at least 30 characters of your email so it can be scored properly.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await authApi("POST", "/api/score-email", {
        text: text.trim(),
        company_name: companyName.trim(),
        recipient_name: recipientName.trim(),
      });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to score email");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  async function copyRewritten() {
    if (!result?.rewritten) return;
    try {
      await navigator.clipboard.writeText(result.rewritten);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  const overall = typeof result?.overall_score === "number" ? Math.min(100, Math.max(0, result.overall_score)) : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="tcard flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-[#a78bfa]" />
          <p className="text-xs font-bold uppercase tracking-wide text-[#55556a]">Cold Email / LinkedIn Message Scorer</p>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            placeholder="Paste your cold email or LinkedIn outreach message here..."
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#7c3aed]/60 resize-y"
          />
          {tooShort && <p className="text-[11px] text-[#fcd34d]">Add a bit more text — at least 30 characters — for an accurate score.</p>}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase text-[#55556a]">Company Name (optional)</label>
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Acme Corp"
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#7c3aed]/60"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase text-[#55556a]">Recipient Name (optional)</label>
              <input
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Priya Shah"
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#7c3aed]/60"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || text.trim().length < 30}
            className="self-start text-xs font-bold px-4 py-2.5 rounded-lg text-white cursor-pointer disabled:opacity-50"
            style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
          >
            {loading ? "Scoring..." : "Score Email"}
          </button>
        </form>
      </div>

      {loading && (
        <div className="tcard flex items-center justify-center gap-2 py-12">
          <Loader2 className="h-4 w-4 animate-spin text-[#a78bfa]" />
          <p className="text-sm text-[#9090b0]">Analyzing your email...</p>
        </div>
      )}

      {!loading && error && (
        <div className="tcard flex items-center gap-2 py-6 justify-center text-center">
          <AlertCircle className="h-4 w-4 text-[#fca5a5] shrink-0" />
          <p className="text-sm text-[#fca5a5]">{error}</p>
        </div>
      )}

      {!loading && !error && result && (
        <>
          <div className="tcard grid md:grid-cols-3 gap-6">
            {overall !== null && (
              <div className="flex flex-col items-center justify-center text-center">
                <div className="relative h-28 w-28">
                  <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="var(--bg-3)" strokeWidth="8" />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="url(#emailScoreGrad)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 42}
                      initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - overall / 100) }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="emailScoreGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" />
                        <stop offset="100%" stopColor="var(--secondary)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black">{overall}</span>
                    <span className="text-[10px] text-[#55556a]">/ 100</span>
                  </div>
                </div>
                <p className="text-xs font-bold text-[#9090b0] mt-3">Overall Score</p>
              </div>
            )}

            <div className="md:col-span-2 flex flex-col gap-3 justify-center">
              {SUB_SCORES.map(({ key, feedbackKey, label }) => {
                const value = result[key];
                if (typeof value !== "number") return null;
                const feedback = result[feedbackKey] as string | undefined;
                return (
                  <div key={key as string}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-[#9090b0]">{label}</span>
                      <span className="text-xs font-bold">{value}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(100, Math.max(0, value))}%`,
                          background: "linear-gradient(90deg, var(--primary), var(--secondary))",
                        }}
                      />
                    </div>
                    {feedback && <p className="text-[11px] text-[#55556a] mt-1">{feedback}</p>}
                  </div>
                );
              })}
            </div>
          </div>

          {(result.top_strength || result.top_weakness) && (
            <div className="grid sm:grid-cols-2 gap-4">
              {result.top_strength && (
                <div className="tcard flex items-start gap-2 border-[#10b981]/20">
                  <ThumbsUp className="h-4 w-4 text-[#6ee7b7] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#6ee7b7] mb-1">Top Strength</p>
                    <p className="text-xs text-[#9090b0] leading-relaxed">{result.top_strength}</p>
                  </div>
                </div>
              )}
              {result.top_weakness && (
                <div className="tcard flex items-start gap-2">
                  <ThumbsDown className="h-4 w-4 text-[#fca5a5] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#fca5a5] mb-1">Top Weakness</p>
                    <p className="text-xs text-[#9090b0] leading-relaxed">{result.top_weakness}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {result.rewritten && (
            <div className="tcard flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#a78bfa]" /> AI Rewritten Version
                </p>
                <button
                  onClick={copyRewritten}
                  className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors"
                >
                  {copied ? <Check className="h-3 w-3 text-[#6ee7b7]" /> : <Copy className="h-3 w-3" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{result.rewritten}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
