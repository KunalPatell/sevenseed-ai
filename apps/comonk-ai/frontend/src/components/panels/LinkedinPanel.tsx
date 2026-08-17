"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Share2,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  SpellCheck,
  CheckCircle,
  Lightbulb,
} from "lucide-react";
import { GlowCard } from "@/components/GlowCard";
import { authApi } from "@/lib/api";
import { Auth } from "@/lib/auth";

interface LinkedInResult {
  rewritten_about?: string;
  headlines?: string[];
  tips?: string[];
}

interface GrammarMatch {
  message?: string;
  type?: string;
}

interface GrammarResult {
  matches?: GrammarMatch[];
  total_errors?: number;
  score?: number | null;
  error?: string;
}

function CopyButton({ text, className = "" }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async (e) => {
        e.stopPropagation();
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // ignore
        }
      }}
      className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors shrink-0 ${className}`}
    >
      {copied ? <Check className="h-3 w-3 text-[var(--green-l)]" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function LinkedinPanel() {
  const user = Auth.user();
  const [targetRole, setTargetRole] = useState(user?.target_role || "Software Engineer");
  const [aboutText, setAboutText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<LinkedInResult | null>(null);
  const [selectedHeadline, setSelectedHeadline] = useState(0);

  const [grammarLoading, setGrammarLoading] = useState(false);
  const [grammarResult, setGrammarResult] = useState<GrammarResult | null>(null);

  async function generate() {
    if (!targetRole.trim()) {
      setError("Enter a target role first.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res: LinkedInResult = await authApi("POST", "/api/linkedin-optimize", {
        target_role: targetRole,
        about_text: aboutText,
      });
      setResult(res);
      setSelectedHeadline(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to optimize LinkedIn profile.");
    } finally {
      setLoading(false);
    }
  }

  async function checkGrammar() {
    if (aboutText.trim().length < 10) {
      setError("Write your About section before checking grammar.");
      return;
    }
    setError("");
    setGrammarLoading(true);
    setGrammarResult(null);
    try {
      const res: GrammarResult = await authApi("POST", "/api/grammar-check", { text: aboutText });
      if (res.error && !res.matches?.length) throw new Error(res.error);
      setGrammarResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check grammar.");
    } finally {
      setGrammarLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="tcard">
        <div className="grid sm:grid-cols-2 gap-3.5 mb-3.5">
          <div>
            <label className="text-[11px] font-bold text-[#55556a] mb-1.5 block">Target Role</label>
            <input
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Product Manager"
              className="w-full text-sm px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[var(--primary)]/50 transition-colors"
            />
          </div>
        </div>
        <label className="text-[11px] font-bold text-[#55556a] mb-1.5 block">Current About Section (optional)</label>
        <textarea
          value={aboutText}
          onChange={(e) => setAboutText(e.target.value)}
          rows={6}
          placeholder="Paste your current LinkedIn About text — or leave blank and we'll draft one from scratch."
          className="w-full text-sm px-3.5 py-3 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[var(--primary)]/50 transition-colors resize-none mb-3.5"
        />
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={generate}
            disabled={loading}
            className="flex items-center justify-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl text-white cursor-pointer transition-opacity disabled:opacity-50"
            style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Optimize Profile
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

      {error && (
        <div className="tcard flex items-center gap-2 border-[var(--red)]/30 text-sm text-[var(--red-l)]">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
          {result.headlines && result.headlines.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] mb-3 flex items-center gap-1.5">
                <Share2 className="h-3.5 w-3.5" /> Headline Variants — pick your favorite
              </p>
              <div className="grid md:grid-cols-3 gap-3.5">
                {result.headlines.map((h, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedHeadline(i)}
                    className="tcard text-left cursor-pointer transition-all"
                    style={
                      selectedHeadline === i
                        ? { borderColor: "rgba(124,58,237,0.5)", boxShadow: "0 0 0 1px rgba(124,58,237,0.35)" }
                        : {}
                    }
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span
                        className="text-[10px] font-black px-2 py-0.5 rounded-full"
                        style={
                          selectedHeadline === i
                            ? { background: "linear-gradient(115deg, var(--primary), var(--secondary))", color: "white" }
                            : { background: "rgba(255,255,255,0.06)", color: "#9090b0" }
                        }
                      >
                        Option {i + 1}
                      </span>
                      <CopyButton text={h} />
                    </div>
                    <p className="text-sm leading-relaxed">{h}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {result.rewritten_about && (
            <GlowCard className="tcard">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-wide text-[#55556a]">Rewritten About</p>
                <CopyButton text={result.rewritten_about} />
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{result.rewritten_about}</p>
            </GlowCard>
          )}

          {result.tips && result.tips.length > 0 && (
            <div className="tcard">
              <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] mb-3 flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5" /> Profile Tips
              </p>
              <ul className="flex flex-col gap-2.5">
                {result.tips.map((t, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle className="h-4 w-4 text-[var(--green-l)] shrink-0 mt-0.5" />
                    {t}
                  </li>
                ))}
              </ul>
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
            </div>
          </div>
          {grammarResult.matches && grammarResult.matches.length > 0 ? (
            <ul className="flex flex-col gap-2 text-sm">
              {grammarResult.matches.map((m, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span
                    className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${
                      m.type === "error" ? "bg-[#ef4444]/15 text-[var(--red-l)]" : "bg-[#f59e0b]/15 text-[var(--gold-l)]"
                    }`}
                  >
                    {m.type || "warning"}
                  </span>
                  {m.message}
                </li>
              ))}
            </ul>
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
