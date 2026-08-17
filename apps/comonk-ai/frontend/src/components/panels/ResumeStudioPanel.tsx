"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Mail,
  ScanSearch,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  Sparkles,
  LogIn,
  Wand2,
} from "lucide-react";
import { GlowCard } from "@/components/GlowCard";
import { authApi } from "@/lib/api";
import { Auth } from "@/lib/auth";

type Tab = "rewrite" | "cover-letter" | "gap";

interface RewriteResult {
  summary?: string;
  bullets?: string[];
  skills_to_add?: string[];
  ats_tips?: string[];
  keywords?: string[];
}

interface GapResult {
  match_pct?: number;
  present_skills?: string[];
  missing_skills?: string[];
}

interface TailorResult {
  tailored_bullets?: string;
  cover_letter?: string;
}

function CopyButton({ text, className = "" }: { text: string; className?: string }) {
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
      className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors shrink-0 ${className}`}
    >
      {copied ? <Check className="h-3 w-3 text-[var(--green-l)]" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function Chip({ label, tone = "default" }: { label: string; tone?: "green" | "red" | "default" }) {
  const styles =
    tone === "green"
      ? "bg-[#10b981]/15 text-[var(--green-l)] border-[#10b981]/30"
      : tone === "red"
      ? "bg-[#ef4444]/15 text-[var(--red-l)] border-[#ef4444]/30"
      : "bg-[#7c3aed]/15 text-[#a78bfa] border-[#7c3aed]/30";
  return <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${styles}`}>{label}</span>;
}

function TabBtn({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: React.ElementType; label: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg cursor-pointer transition-colors border"
      style={
        active
          ? { background: "linear-gradient(115deg, var(--primary), var(--secondary))", borderColor: "transparent", color: "white" }
          : { background: "transparent", borderColor: "var(--border)", color: "#9090b0" }
      }
    >
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="tcard flex items-center gap-2 border-[var(--red)]/30 text-sm text-[var(--red-l)]">
      <AlertCircle className="h-4 w-4 shrink-0" />
      {message}
    </div>
  );
}

export function ResumeStudioPanel() {
  const loggedIn = Auth.isLoggedIn();
  const user = Auth.user();
  const [tab, setTab] = useState<Tab>("rewrite");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <TabBtn active={tab === "rewrite"} onClick={() => setTab("rewrite")} icon={FileText} label="Rewrite" />
        <TabBtn active={tab === "cover-letter"} onClick={() => setTab("cover-letter")} icon={Mail} label="Cover Letter" />
        <TabBtn active={tab === "gap"} onClick={() => setTab("gap")} icon={ScanSearch} label="Gap Analyzer" />
      </div>

      {tab === "rewrite" && <RewriteTab defaultRole={user?.target_role || ""} />}
      {tab === "cover-letter" && <CoverLetterTab defaultName={user?.name || ""} defaultRole={user?.target_role || ""} />}
      {tab === "gap" && <GapTab loggedIn={loggedIn} />}
    </div>
  );
}

function RewriteTab({ defaultRole }: { defaultRole: string }) {
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState(defaultRole || "AI/ML Engineer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<RewriteResult | null>(null);

  async function generate() {
    if (resumeText.trim().length < 30) {
      setError("Paste more of your resume text (at least a few lines).");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res = await authApi("POST", "/api/resume-rewrite", { resume_text: resumeText, target_role: targetRole });
      if (!res?.success) throw new Error(res?.error || "Could not generate a rewrite.");
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to rewrite resume.");
    } finally {
      setLoading(false);
    }
  }

  const fullText = result
    ? [
        result.summary,
        "",
        ...(result.bullets || []).map((b) => `- ${b}`),
      ].join("\n")
    : "";

  return (
    <div className="flex flex-col gap-4">
      <div className="tcard">
        <label className="text-[11px] font-bold text-[#55556a] mb-1.5 block">Target Role</label>
        <input
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          placeholder="e.g. Data Scientist"
          className="w-full text-sm px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[var(--primary)]/50 transition-colors mb-3.5"
        />
        <label className="text-[11px] font-bold text-[#55556a] mb-1.5 block">Paste Your Resume Text</label>
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          rows={8}
          placeholder="Paste your current resume content here..."
          className="w-full text-sm px-3.5 py-3 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[var(--primary)]/50 transition-colors resize-none mb-3.5"
        />
        <button
          onClick={generate}
          disabled={loading}
          className="flex items-center justify-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl text-white cursor-pointer transition-opacity disabled:opacity-50"
          style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
          Rewrite Resume
        </button>
      </div>

      {error && <ErrorBox message={error} />}

      {result && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
          <GlowCard className="tcard">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold uppercase tracking-wide text-[#55556a]">Professional Summary</p>
              <CopyButton text={fullText} />
            </div>
            <p className="text-sm leading-relaxed">{result.summary}</p>
          </GlowCard>

          {result.bullets && result.bullets.length > 0 && (
            <div className="tcard">
              <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] mb-3">Rewritten Bullets</p>
              <ul className="flex flex-col gap-2 text-sm">
                {result.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#a78bfa] shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {result.skills_to_add && result.skills_to_add.length > 0 && (
              <div className="tcard">
                <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] mb-3">Skills to Add</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.skills_to_add.map((s, i) => (
                    <Chip key={i} label={s} />
                  ))}
                </div>
              </div>
            )}
            {result.keywords && result.keywords.length > 0 && (
              <div className="tcard">
                <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] mb-3">ATS Keywords</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.keywords.map((s, i) => (
                    <Chip key={i} label={s} tone="green" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {result.ats_tips && result.ats_tips.length > 0 && (
            <div className="tcard">
              <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] mb-3">ATS Tips</p>
              <ul className="flex flex-col gap-2 text-sm text-[#9090b0]">
                {result.ats_tips.map((t, i) => (
                  <li key={i}>• {t}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

function CoverLetterTab({ defaultName, defaultRole }: { defaultName: string; defaultRole: string }) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState(defaultRole || "AI/ML Engineer");
  const [tone, setTone] = useState("professional");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [letter, setLetter] = useState("");

  async function generate() {
    if (!company.trim()) {
      setError("Enter the company you're applying to.");
      return;
    }
    setError("");
    setLoading(true);
    setLetter("");
    try {
      const res = await authApi("POST", "/api/cover-letter", {
        name: defaultName,
        target_role: role,
        company,
        tone,
        skills: skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      if (!res?.success) throw new Error(res?.error || "Could not generate a cover letter.");
      setLetter(res.letter || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate cover letter.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="tcard">
        <div className="grid sm:grid-cols-2 gap-3.5 mb-3.5">
          <div>
            <label className="text-[11px] font-bold text-[#55556a] mb-1.5 block">Company</label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Acme Corp"
              className="w-full text-sm px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[var(--primary)]/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#55556a] mb-1.5 block">Role</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Backend Engineer"
              className="w-full text-sm px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[var(--primary)]/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#55556a] mb-1.5 block">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full text-sm px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[var(--primary)]/50 transition-colors"
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="enthusiastic">Enthusiastic</option>
              <option value="formal">Formal</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#55556a] mb-1.5 block">Key Skills (optional, comma-separated)</label>
            <input
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. Python, React, AWS"
              className="w-full text-sm px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[var(--primary)]/50 transition-colors"
            />
          </div>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="flex items-center justify-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl text-white cursor-pointer transition-opacity disabled:opacity-50"
          style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Generate Cover Letter
        </button>
      </div>

      {error && <ErrorBox message={error} />}

      {letter && (
        <GlowCard className="tcard">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wide text-[#55556a]">Your Cover Letter</p>
            <CopyButton text={letter} />
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{letter}</p>
        </GlowCard>
      )}
    </div>
  );
}

function GapTab({ loggedIn }: { loggedIn: boolean }) {
  const [jdText, setJdText] = useState("");
  const [gapLoading, setGapLoading] = useState(false);
  const [tailorLoading, setTailorLoading] = useState(false);
  const [error, setError] = useState("");
  const [gap, setGap] = useState<GapResult | null>(null);
  const [tailored, setTailored] = useState<TailorResult | null>(null);

  async function analyzeGap() {
    if (jdText.trim().length < 20) {
      setError("Paste a fuller job description first.");
      return;
    }
    setError("");
    setGapLoading(true);
    setGap(null);
    try {
      const res = await authApi("POST", "/api/jd-gap", { jd_text: jdText });
      if (!res?.success) throw new Error(res?.error || "Could not analyze the gap.");
      setGap(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze gap. Login required for this tool.");
    } finally {
      setGapLoading(false);
    }
  }

  async function tailor() {
    if (jdText.trim().length < 20) {
      setError("Paste a fuller job description first.");
      return;
    }
    setError("");
    setTailorLoading(true);
    setTailored(null);
    try {
      const res = await authApi("POST", "/api/tailor-resume", { jd_text: jdText });
      if (!res?.success) throw new Error(res?.error || "Could not tailor your resume.");
      setTailored(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to tailor resume. Login required for this tool.");
    } finally {
      setTailorLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {!loggedIn && (
        <div className="tcard flex items-center gap-2 text-sm text-[#9090b0]">
          <LogIn className="h-4 w-4 shrink-0 text-[#55556a]" />
          Login to compare a job description against your saved profile skills.
        </div>
      )}

      <div className="tcard">
        <label className="text-[11px] font-bold text-[#55556a] mb-1.5 block">Paste Job Description</label>
        <textarea
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          rows={8}
          placeholder="Paste the job description you're targeting..."
          className="w-full text-sm px-3.5 py-3 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[var(--primary)]/50 transition-colors resize-none mb-3.5"
        />
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={analyzeGap}
            disabled={gapLoading}
            className="flex items-center justify-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl text-white cursor-pointer transition-opacity disabled:opacity-50"
            style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
          >
            {gapLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanSearch className="h-4 w-4" />}
            Analyze Gap
          </button>
          <button
            onClick={tailor}
            disabled={tailorLoading}
            className="flex items-center justify-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors disabled:opacity-50"
          >
            {tailorLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            Tailor Resume &amp; Cover Letter
          </button>
        </div>
      </div>

      {error && <ErrorBox message={error} />}

      {gap && (
        <GlowCard className="tcard">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative h-16 w-16 shrink-0">
              <svg viewBox="0 0 100 100" className="h-16 w-16 -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--bg-3)" strokeWidth="10" />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="url(#gapGrad)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 42}
                  initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - (gap.match_pct || 0) / 100) }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="gapGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" />
                    <stop offset="100%" stopColor="var(--secondary)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-black">
                {gap.match_pct ?? 0}%
              </div>
            </div>
            <div>
              <p className="font-bold">Skill Match</p>
              <p className="text-xs text-[#55556a]">How well your profile matches this JD</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--green-l)] mb-2">
                Present ({(gap.present_skills || []).length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(gap.present_skills || []).map((s, i) => (
                  <Chip key={i} label={s} tone="green" />
                ))}
                {(gap.present_skills || []).length === 0 && <p className="text-xs text-[#55556a]">None matched yet.</p>}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--red-l)] mb-2">
                Missing ({(gap.missing_skills || []).length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(gap.missing_skills || []).map((s, i) => (
                  <Chip key={i} label={s} tone="red" />
                ))}
                {(gap.missing_skills || []).length === 0 && <p className="text-xs text-[#55556a]">No gaps found.</p>}
              </div>
            </div>
          </div>
        </GlowCard>
      )}

      {tailored && (
        <div className="flex flex-col gap-4">
          {tailored.tailored_bullets && (
            <div className="tcard">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-wide text-[#55556a]">Tailored Bullets</p>
                <CopyButton text={tailored.tailored_bullets} />
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{tailored.tailored_bullets}</p>
            </div>
          )}
          {tailored.cover_letter && (
            <div className="tcard">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-wide text-[#55556a]">Tailored Cover Letter</p>
                <CopyButton text={tailored.cover_letter} />
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{tailored.cover_letter}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
