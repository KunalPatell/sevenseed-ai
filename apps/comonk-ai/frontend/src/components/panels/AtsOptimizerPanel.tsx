"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ScanSearch,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Lightbulb,
  SpellCheck,
  Wand2,
} from "lucide-react";
import { GlowCard } from "@/components/GlowCard";
import { authApi } from "@/lib/api";

interface QuickWin {
  section?: string;
  issue?: string;
  fix?: string;
}

interface RewrittenBullet {
  original?: string;
  improved?: string;
}

interface AtsResult {
  ats_score?: number;
  grade?: string;
  summary?: string;
  keywords_found?: string[];
  keywords_missing?: string[];
  quick_wins?: QuickWin[];
  rewritten_bullets?: RewrittenBullet[];
}

interface GrammarMatch {
  message?: string;
  context?: string;
  replacements?: string[];
  type?: string;
  rule_category?: string;
}

interface GrammarResult {
  matches?: GrammarMatch[];
  total_errors?: number;
  word_count?: number;
  score?: number | null;
  error?: string;
}

function letterGrade(score: number): string {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 50) return "C";
  return "D";
}

function gradeColor(grade: string): string {
  switch (grade) {
    case "A":
      return "var(--green-l)";
    case "B":
      return "var(--secondary-l)";
    case "C":
      return "var(--gold-l)";
    default:
      return "var(--red-l)";
  }
}

function Chip({ label, tone }: { label: string; tone: "green" | "red" }) {
  const styles =
    tone === "green"
      ? "bg-[#10b981]/15 text-[var(--green-l)] border-[#10b981]/30"
      : "bg-[#ef4444]/15 text-[var(--red-l)] border-[#ef4444]/30";
  return <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${styles}`}>{label}</span>;
}

export function AtsOptimizerPanel() {
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("AI/ML Engineer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AtsResult | null>(null);

  const [grammarLoading, setGrammarLoading] = useState(false);
  const [grammarResult, setGrammarResult] = useState<GrammarResult | null>(null);

  async function analyze() {
    if (resumeText.trim().length < 30) {
      setError("Paste more of your resume text (at least a few lines).");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res: AtsResult = await authApi("POST", "/api/ats-optimize", { resume_text: resumeText, target_role: targetRole });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze resume.");
    } finally {
      setLoading(false);
    }
  }

  async function checkGrammar() {
    if (resumeText.trim().length < 10) {
      setError("Paste your resume text before checking grammar.");
      return;
    }
    setError("");
    setGrammarLoading(true);
    setGrammarResult(null);
    try {
      const res: GrammarResult = await authApi("POST", "/api/grammar-check", { text: resumeText });
      if (res.error && !res.matches?.length) throw new Error(res.error);
      setGrammarResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check grammar.");
    } finally {
      setGrammarLoading(false);
    }
  }

  const score = result?.ats_score ?? 0;
  const grade = letterGrade(score);
  const gColor = gradeColor(grade);

  return (
    <div className="flex flex-col gap-5">
      <div className="tcard">
        <div className="grid sm:grid-cols-[1fr_240px] gap-3.5 mb-3.5">
          <div>
            <label className="text-[11px] font-bold text-[#55556a] mb-1.5 block">Paste Your Resume</label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={9}
              placeholder="Paste your resume text here..."
              className="w-full text-sm px-3.5 py-3 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[var(--primary)]/50 transition-colors resize-none"
            />
          </div>
          <div className="flex flex-col gap-3.5">
            <div>
              <label className="text-[11px] font-bold text-[#55556a] mb-1.5 block">Target Role</label>
              <input
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. AI/ML Engineer"
                className="w-full text-sm px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[var(--primary)]/50 transition-colors"
              />
            </div>
            <button
              onClick={analyze}
              disabled={loading}
              className="flex items-center justify-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl text-white cursor-pointer transition-opacity disabled:opacity-50"
              style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanSearch className="h-4 w-4" />}
              Analyze
            </button>
            <button
              onClick={checkGrammar}
              disabled={grammarLoading}
              className="flex items-center justify-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors disabled:opacity-50"
            >
              {grammarLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <SpellCheck className="h-3.5 w-3.5" />}
              Grammar Check
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="tcard flex items-center gap-2 border-[var(--red)]/30 text-sm text-[var(--red-l)]">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
          <div className="grid md:grid-cols-3 gap-5">
            <GlowCard className="tcard flex flex-col items-center justify-center text-center">
              <div className="relative h-28 w-28">
                <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="var(--bg-3)" strokeWidth="8" />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="url(#atsGrad)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 42}
                    initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - score / 100) }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="atsGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" />
                      <stop offset="100%" stopColor="var(--secondary)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black">{score}</span>
                  <span className="text-[10px] text-[#55556a]">/ 100</span>
                </div>
              </div>
              <div
                className="mt-3 h-9 w-9 rounded-full flex items-center justify-center text-sm font-black border-2"
                style={{ borderColor: gColor, color: gColor }}
              >
                {grade}
              </div>
              <p className="text-xs font-bold text-[#9090b0] mt-2">ATS Score</p>
            </GlowCard>

            <div className="md:col-span-2 tcard flex flex-col justify-center">
              <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] mb-2">Summary</p>
              <p className="text-sm leading-relaxed">{result.summary}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="tcard">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--green-l)] mb-3 flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5" /> Keywords Found ({(result.keywords_found || []).length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(result.keywords_found || []).map((k, i) => (
                  <Chip key={i} label={k} tone="green" />
                ))}
                {(result.keywords_found || []).length === 0 && <p className="text-xs text-[#55556a]">None detected.</p>}
              </div>
            </div>
            <div className="tcard">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--red-l)] mb-3 flex items-center gap-1.5">
                <XCircle className="h-3.5 w-3.5" /> Keywords Missing ({(result.keywords_missing || []).length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(result.keywords_missing || []).map((k, i) => (
                  <Chip key={i} label={k} tone="red" />
                ))}
                {(result.keywords_missing || []).length === 0 && <p className="text-xs text-[#55556a]">Nothing missing.</p>}
              </div>
            </div>
          </div>

          {result.quick_wins && result.quick_wins.length > 0 && (
            <div className="tcard">
              <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] mb-3 flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5" /> Quick Wins
              </p>
              <div className="flex flex-col gap-2.5">
                {result.quick_wins.map((w, i) => (
                  <div key={i} className="px-3.5 py-3 rounded-lg bg-white/[0.03] border border-white/5">
                    <p className="text-xs font-bold text-[#a78bfa] mb-1">{w.section || "General"}</p>
                    <p className="text-sm text-[#eeeef8] mb-1">{w.issue}</p>
                    <p className="text-xs text-[#9090b0]">→ {w.fix}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.rewritten_bullets && result.rewritten_bullets.length > 0 && (
            <div className="tcard">
              <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] mb-3 flex items-center gap-1.5">
                <Wand2 className="h-3.5 w-3.5" /> Suggested Rewrites
              </p>
              <div className="flex flex-col gap-3">
                {result.rewritten_bullets.map((b, i) => (
                  <div key={i} className="px-3.5 py-3 rounded-lg bg-white/[0.03] border border-white/5">
                    <p className="text-xs text-[#55556a] line-through mb-1.5">{b.original}</p>
                    <p className="text-sm text-[#eeeef8]">{b.improved}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {grammarResult && (
        <div className="tcard">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] flex items-center gap-1.5">
              <SpellCheck className="h-3.5 w-3.5" /> Grammar Check
            </p>
            <div className="flex items-center gap-3 text-xs text-[#55556a]">
              {typeof grammarResult.score === "number" && (
                <span className="font-black text-[#eeeef8]">{grammarResult.score}/100</span>
              )}
              <span>{grammarResult.total_errors ?? 0} issues</span>
              <span>{grammarResult.word_count ?? 0} words</span>
            </div>
          </div>
          {grammarResult.matches && grammarResult.matches.length > 0 ? (
            <div className="flex flex-col gap-2">
              {grammarResult.matches.map((m, i) => (
                <div key={i} className="px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                        m.type === "error" ? "bg-[#ef4444]/15 text-[var(--red-l)]" : "bg-[#f59e0b]/15 text-[var(--gold-l)]"
                      }`}
                    >
                      {m.type || "warning"}
                    </span>
                    {m.rule_category && <span className="text-[10px] text-[#55556a]">{m.rule_category}</span>}
                  </div>
                  <p className="text-sm mb-1">{m.message}</p>
                  {m.context && <p className="text-xs text-[#55556a] italic mb-1">&ldquo;{m.context}&rdquo;</p>}
                  {m.replacements && m.replacements.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {m.replacements.map((r, j) => (
                        <span key={j} className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#10b981]/15 text-[var(--green-l)]">
                          {r}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#9090b0] flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[var(--green-l)]" /> No issues found — clean writing.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
