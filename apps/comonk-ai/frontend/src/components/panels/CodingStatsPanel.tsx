"use client";

import React, { useState } from "react";
import {
  Code2,
  Trophy,
  Package,
  Globe,
  Search,
  Loader2,
  AlertTriangle,
  Star,
  ExternalLink,
} from "lucide-react";
import { api } from "@/lib/api";

// Note: this installed lucide-react version ships no brand/logo icons (no real
// "Github" export exists) — Code2 is used as a generic stand-in everywhere a
// GitHub mark would normally go.

function StatCard({
  icon: Icon,
  title,
  placeholder,
  fetchPath,
  render,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  placeholder: string;
  fetchPath: (q: string) => string;
  render: (data: any) => React.ReactNode;
}) {
  const [input, setInput] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function run() {
    const q = input.trim();
    if (!q) return;
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await api("GET", fetchPath(q));
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="tcard flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#a78bfa]" />
        <p className="text-xs font-bold uppercase tracking-wide text-[#55556a]">{title}</p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run();
        }}
        className="flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="flex-1 min-w-0 text-xs px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[#7c3aed]/50"
        />
        <button
          type="submit"
          className="shrink-0 flex items-center gap-1 text-[11px] font-bold px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:text-white cursor-pointer"
        >
          <Search className="h-3 w-3" /> Check
        </button>
      </form>

      {loading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-4 w-4 text-[#a78bfa] animate-spin" />
        </div>
      )}
      {error && (
        <p className="text-[11px] text-[#fca5a5] flex items-center gap-1.5">
          <AlertTriangle className="h-3 w-3" /> {error}
        </p>
      )}
      {!loading && data && <div className="pt-1 border-t border-white/5">{render(data)}</div>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-[11px] py-0.5">
      <span className="text-[#55556a]">{label}</span>
      <span className="font-bold text-[#eeeef8]">{value}</span>
    </div>
  );
}

export function CodingStatsPanel() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard
        icon={Code2}
        title="LeetCode Stats"
        placeholder="LeetCode username"
        fetchPath={(u) => `/api/leetcode-stats/${encodeURIComponent(u)}`}
        render={(d) =>
          d.found === false ? (
            <p className="text-[11px] text-[#fca5a5]">{d.error || "User not found."}</p>
          ) : (
            <div className="mt-2 flex flex-col gap-0.5">
              <Row label="Total solved" value={`${d.total_solved}/${d.total_questions}`} />
              <Row label="Easy / Medium / Hard" value={`${d.easy_solved} / ${d.medium_solved} / ${d.hard_solved}`} />
              <Row label="Rank" value={d.rank || "—"} />
              <Row label="Acceptance" value={`${Math.round(d.acceptance_rate || 0)}%`} />
              <a href={d.profile_url} target="_blank" rel="noreferrer" className="text-[11px] text-[#93c5fd] flex items-center gap-1 mt-1.5">
                View profile <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )
        }
      />

      <StatCard
        icon={Trophy}
        title="Codeforces Stats"
        placeholder="Codeforces handle"
        fetchPath={(u) => `/api/codeforces/${encodeURIComponent(u)}`}
        render={(d) =>
          d.found === false ? (
            <p className="text-[11px] text-[#fca5a5]">{d.error || "Handle not found."}</p>
          ) : (
            <div className="mt-2 flex flex-col gap-0.5">
              <Row label="Rating" value={d.rating || "unrated"} />
              <Row label="Max rating" value={d.max_rating || "—"} />
              <Row label="Rank" value={d.rank || "unrated"} />
              <Row label="Max rank" value={d.max_rank || "—"} />
              <a href={d.profile_url} target="_blank" rel="noreferrer" className="text-[11px] text-[#93c5fd] flex items-center gap-1 mt-1.5">
                View profile <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )
        }
      />

      <StatCard
        icon={Package}
        title="NPM Package Stats"
        placeholder="Package name (e.g. react)"
        fetchPath={(p) => `/api/npm-stats?pkg=${encodeURIComponent(p)}`}
        render={(d) =>
          d.error ? (
            <p className="text-[11px] text-[#fca5a5]">{d.error}</p>
          ) : (
            <div className="mt-2 flex flex-col gap-0.5">
              <Row label="Version" value={d.version || "—"} />
              <Row label="License" value={d.license || "—"} />
              <Row label="Monthly downloads" value={(d.monthly_downloads || 0).toLocaleString()} />
              {d.npm_url && (
                <a href={d.npm_url} target="_blank" rel="noreferrer" className="text-[11px] text-[#93c5fd] flex items-center gap-1 mt-1.5">
                  View on npm <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )
        }
      />

      <StatCard
        icon={Globe}
        title="Wikipedia Lookup"
        placeholder="Search a topic or company"
        fetchPath={(q) => `/api/wikipedia-info?query=${encodeURIComponent(q)}`}
        render={(d) =>
          d.error ? (
            <p className="text-[11px] text-[#fca5a5]">{d.error}</p>
          ) : (
            <div className="mt-2 flex flex-col gap-1">
              <p className="text-xs font-bold">{d.title}</p>
              {d.extract && <p className="text-[11px] text-[#9090b0] leading-relaxed line-clamp-4">{d.extract}</p>}
              {d.url && (
                <a href={d.url} target="_blank" rel="noreferrer" className="text-[11px] text-[#93c5fd] flex items-center gap-1 mt-1">
                  Read more <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )
        }
      />

      <StatCard
        icon={Code2}
        title="GitHub Profile"
        placeholder="GitHub username"
        fetchPath={(u) => `/api/github-profile?username=${encodeURIComponent(u)}`}
        render={(d) => (
          <div className="mt-2 flex flex-col gap-0.5">
            <Row label="Public repos" value={d.public_repos ?? "—"} />
            <Row label="Followers" value={d.followers ?? "—"} />
            <Row label="Total stars" value={d.total_stars ?? "—"} />
            <Row label="Top languages" value={(d.top_languages || []).slice(0, 3).join(", ") || "—"} />
            {d.best_repos?.[0] && (
              <p className="text-[11px] text-[#55556a] mt-1.5 flex items-center gap-1">
                <Star className="h-3 w-3 text-[#fcd34d]" /> Best: {d.best_repos[0].name} ({d.best_repos[0].stars}★)
              </p>
            )}
            {d.profile_url && (
              <a href={d.profile_url} target="_blank" rel="noreferrer" className="text-[11px] text-[#93c5fd] flex items-center gap-1 mt-1">
                View profile <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        )}
      />
    </div>
  );
}
