"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame, Star, GitFork, ExternalLink, Loader2, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api";

interface Repo {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
  topics: string[];
  owner_avatar: string;
}

const LANGUAGES = ["python", "javascript", "typescript", "java", "go", "rust", "c++", "c#"];
const PERIODS: { id: string; label: string }[] = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
];

function fmtNum(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function TrendingReposPanel() {
  const [language, setLanguage] = useState("python");
  const [period, setPeriod] = useState("weekly");
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (lang: string, per: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await api("GET", `/api/github-trending?language=${encodeURIComponent(lang)}&period=${per}`);
      setRepos(res.repos || []);
      if (res.error) setError(res.error);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load trending repos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(language, period);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function apply(lang: string, per: string) {
    setLanguage(lang);
    setPeriod(per);
    load(lang, per);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="tcard flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-[#f59e0b]" />
          <p className="text-xs font-bold uppercase tracking-wide text-[#55556a]">Trending Repos</p>
        </div>
        <select
          value={language}
          onChange={(e) => apply(e.target.value, period)}
          className="ml-auto text-xs font-semibold px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none cursor-pointer"
        >
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/5 rounded-lg p-1">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              onClick={() => apply(language, p.id)}
              className={`text-[11px] font-bold px-2.5 py-1.5 rounded-md cursor-pointer transition-colors ${
                period === p.id ? "bg-[#7c3aed]/20 text-white" : "text-[#9090b0] hover:text-white"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-xs text-[#fca5a5] flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5" /> {error}
        </p>
      )}

      {loading ? (
        <div className="tcard flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 text-[#a78bfa] animate-spin" />
        </div>
      ) : repos.length === 0 ? (
        <div className="tcard text-center py-16 text-xs text-[#55556a]">No trending repos found.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {repos.map((r) => (
            <motion.a
              key={r.name}
              href={r.url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="tcard flex flex-col gap-2.5 hover:border-white/15 transition-colors"
            >
              <div className="flex items-start gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {r.owner_avatar && (
                  <img src={r.owner_avatar} alt="" className="h-8 w-8 rounded-full shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">{r.name}</p>
                  <p className="text-[11px] text-[#55556a]">{r.language}</p>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-[#55556a] ml-auto shrink-0" />
              </div>
              <p className="text-xs text-[#9090b0] leading-relaxed line-clamp-2">{r.description || "No description."}</p>
              {r.topics?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {r.topics.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[#3b82f6]/10 text-[#93c5fd]">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-4 text-[11px] text-[#9090b0] mt-1">
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-[#fcd34d]" /> {fmtNum(r.stars)}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="h-3.5 w-3.5" /> {fmtNum(r.forks)}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      )}
    </div>
  );
}
