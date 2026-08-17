"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search, ExternalLink, Loader2, AlertCircle, GitFork, Star, MapPin, Building2, Sparkles, ThumbsUp, ThumbsDown,
} from "lucide-react";
import { api } from "@/lib/api";

interface Repo {
  name: string;
  description?: string;
  stars?: number;
  url: string;
  language?: string;
  forks?: number;
}

interface AiAnalysis {
  score?: number;
  strengths?: string[];
  improvements?: string[];
  summary?: string;
}

interface GithubProfile {
  username?: string;
  name?: string;
  bio?: string;
  public_repos?: number;
  followers?: number;
  following?: number;
  avatar?: string;
  profile_url?: string;
  company?: string;
  location?: string;
  blog?: string;
  top_languages?: string[];
  best_repos?: Repo[];
  total_stars?: number;
  ai_analysis?: AiAnalysis;
}

export function GithubAnalyzerPanel() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<GithubProfile | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const username = input.trim().replace(/^@/, "");
    if (!username) return;
    setLoading(true);
    setError("");
    try {
      const res = await api("GET", `/api/github-profile?username=${encodeURIComponent(username)}`);
      setProfile(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load GitHub profile");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  const score = profile?.ai_analysis?.score;

  return (
    <div className="flex flex-col gap-5">
      <div className="tcard">
        <form onSubmit={submit} className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 flex-1 min-w-[200px]">
            <Search className="h-3.5 w-3.5 text-[#55556a] shrink-0" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="GitHub username (e.g. torvalds)..."
              className="bg-transparent outline-none text-sm flex-1 min-w-0"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="text-xs font-bold px-4 py-2.5 rounded-lg text-white cursor-pointer disabled:opacity-60"
            style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
          >
            Analyze
          </button>
        </form>
      </div>

      {loading && (
        <div className="tcard flex items-center justify-center gap-2 py-12">
          <Loader2 className="h-4 w-4 animate-spin text-[#a78bfa]" />
          <p className="text-sm text-[#9090b0]">Analyzing profile...</p>
        </div>
      )}

      {!loading && error && (
        <div className="tcard flex items-center gap-2 py-6 justify-center text-center">
          <AlertCircle className="h-4 w-4 text-[#fca5a5] shrink-0" />
          <p className="text-sm text-[#fca5a5]">{error}</p>
        </div>
      )}

      {!loading && !error && profile && (
        <>
          <div className="tcard flex flex-col sm:flex-row gap-5">
            {profile?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar}
                alt={profile?.username || "avatar"}
                className="h-20 w-20 rounded-full border border-white/10 shrink-0"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-black shrink-0">
                {profile?.username?.[0]?.toUpperCase() || "?"}
              </div>
            )}
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-lg font-black">{profile?.name || profile?.username || "Unknown"}</p>
                {profile?.profile_url && (
                  <a
                    href={profile.profile_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#a78bfa] hover:text-[#93c5fd] flex items-center gap-1"
                  >
                    @{profile?.username} <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              {profile?.bio && <p className="text-sm text-[#9090b0]">{profile.bio}</p>}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#55556a]">
                {profile?.company && (
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" /> {profile.company}
                  </span>
                )}
                {profile?.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {profile.location}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-4 pt-1">
                <Stat label="Repos" value={profile?.public_repos} />
                <Stat label="Followers" value={profile?.followers} />
                <Stat label="Following" value={profile?.following} />
                <Stat label="Total Stars" value={profile?.total_stars} icon={Star} />
              </div>
              {Array.isArray(profile?.top_languages) && profile.top_languages.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {profile.top_languages.map((l) => (
                    <span key={l} className="text-[10px] font-semibold px-2 py-1 rounded-full bg-[#7c3aed]/10 text-[#a78bfa]">
                      {l}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {profile?.ai_analysis && (
            <div className="tcard grid md:grid-cols-3 gap-5">
              {typeof score === "number" && (
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="relative h-24 w-24">
                    <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="var(--bg-3)" strokeWidth="8" />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="url(#ghScoreGrad)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 42}
                        initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - Math.min(100, Math.max(0, score)) / 100) }}
                        transition={{ duration: 1.1, ease: "easeOut" }}
                      />
                      <defs>
                        <linearGradient id="ghScoreGrad" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="var(--primary)" />
                          <stop offset="100%" stopColor="var(--secondary)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-black">{score}</span>
                      <span className="text-[9px] text-[#55556a]">/ 100</span>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-[#9090b0] mt-3">Portfolio Score</p>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] flex items-center gap-1.5">
                  <ThumbsUp className="h-3.5 w-3.5 text-[#6ee7b7]" /> Strengths
                </p>
                <ul className="flex flex-col gap-1.5">
                  {(profile.ai_analysis.strengths || []).map((s, i) => (
                    <li key={i} className="text-xs text-[#9090b0] leading-relaxed flex gap-2">
                      <span className="text-[#6ee7b7] shrink-0">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] flex items-center gap-1.5">
                  <ThumbsDown className="h-3.5 w-3.5 text-[#fca5a5]" /> Improvements
                </p>
                <ul className="flex flex-col gap-1.5">
                  {(profile.ai_analysis.improvements || []).map((s, i) => (
                    <li key={i} className="text-xs text-[#9090b0] leading-relaxed flex gap-2">
                      <span className="text-[#fca5a5] shrink-0">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {profile.ai_analysis.summary && (
                <div className="md:col-span-3 flex items-start gap-2 pt-3 border-t border-white/5">
                  <Sparkles className="h-3.5 w-3.5 text-[#a78bfa] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#9090b0] leading-relaxed">{profile.ai_analysis.summary}</p>
                </div>
              )}
            </div>
          )}

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] mb-3">Top Repositories</p>
            {!Array.isArray(profile?.best_repos) || profile.best_repos.length === 0 ? (
              <div className="tcard text-center py-8">
                <p className="text-sm text-[#55556a]">No public repositories found.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile.best_repos.map((r) => (
                  <a
                    key={r.name}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tcard flex flex-col gap-2 hover:border-white/20 transition-colors"
                  >
                    <p className="text-sm font-bold truncate">{r.name}</p>
                    <p className="text-xs text-[#9090b0] leading-relaxed line-clamp-2 flex-1">
                      {r.description || "No description provided."}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-[#55556a] pt-1">
                      {r.language && <span>{r.language}</span>}
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" /> {r.stars ?? 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="h-3 w-3" /> {r.forks ?? 0}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value?: number; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm font-black flex items-center gap-1">
        {Icon && <Icon className="h-3.5 w-3.5 text-[#55556a]" />}
        {value ?? "—"}
      </span>
      <span className="text-[10px] text-[#55556a]">{label}</span>
    </div>
  );
}
