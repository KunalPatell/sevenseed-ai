"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Globe,
  Building2,
  GraduationCap,
  MessagesSquare,
  MessageCircle,
  RefreshCw,
  ExternalLink,
  MapPin,
  Loader2,
  Inbox,
  AlertCircle,
} from "lucide-react";
import { api } from "@/lib/api";

type SourceId = "live" | "more" | "greenhouse" | "internshala" | "hn" | "reddit";

interface NormalizedItem {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  meta?: string;
  snippet?: string;
  url?: string;
}

const SOURCES: { id: SourceId; label: string; icon: typeof Briefcase }[] = [
  { id: "live", label: "Live Jobs", icon: Briefcase },
  { id: "more", label: "More Jobs", icon: Globe },
  { id: "greenhouse", label: "Greenhouse", icon: Building2 },
  { id: "internshala", label: "India Boards", icon: GraduationCap },
  { id: "hn", label: "HN Hiring", icon: MessagesSquare },
  { id: "reddit", label: "Reddit", icon: MessageCircle },
];

function stripHtml(text: string): string {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function LiveJobsPanel() {
  const [source, setSource] = useState<SourceId>("live");
  const [query, setQuery] = useState("python");
  const [company, setCompany] = useState("google");
  const [subreddit, setSubreddit] = useState("cscareerquestions");
  const [items, setItems] = useState<NormalizedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError("");
    setNote("");
    try {
      let normalized: NormalizedItem[] = [];
      if (source === "live") {
        const res = await api("GET", `/api/live-jobs?skills=${encodeURIComponent(query)}&limit=15`);
        const jobs = (res?.jobs as Record<string, unknown>[]) || [];
        if (res?.error) setNote(String(res.error));
        normalized = jobs.map((j, i) => ({
          id: String(j.id ?? i),
          title: String(j.title || "Untitled role"),
          subtitle: String(j.company || "Unknown company"),
          badge: Array.isArray(j.tags) && j.tags.length ? String(j.tags[0]) : "Remote",
          meta: j.salary ? String(j.salary) : String(j.date || ""),
          snippet: j.description ? String(j.description) : undefined,
          url: j.url ? String(j.url) : undefined,
        }));
      } else if (source === "more") {
        const res = await api("GET", `/api/more-jobs?skills=${encodeURIComponent(query)}&limit=20`);
        const jobs = (res?.jobs as Record<string, unknown>[]) || [];
        normalized = jobs.map((j, i) => ({
          id: String(i),
          title: String(j.title || "Untitled role"),
          subtitle: String(j.company || "Unknown company"),
          badge: String(j.location || "Remote"),
          meta: String(j.source || ""),
          snippet: Array.isArray(j.tags) ? j.tags.join(", ") : undefined,
          url: j.url ? String(j.url) : undefined,
        }));
      } else if (source === "greenhouse") {
        const res = await api("GET", `/api/greenhouse-jobs?company=${encodeURIComponent(company)}`);
        if (res?.error) setNote(String(res.error));
        const jobs = (res?.jobs as Record<string, unknown>[]) || [];
        normalized = jobs.map((j, i) => ({
          id: String(j.id ?? i),
          title: String(j.title || "Untitled role"),
          subtitle: company,
          badge: j.location ? String(j.location) : "Onsite",
          url: j.url ? String(j.url) : undefined,
        }));
      } else if (source === "internshala") {
        const res = await api("GET", `/api/internshala?skills=${encodeURIComponent(query)}`);
        const boards = (res?.boards as Record<string, unknown>[]) || [];
        normalized = boards.map((b, i) => ({
          id: String(i),
          title: String(b.name || "Job Board"),
          subtitle: String(b.type || ""),
          badge: b.icon ? String(b.icon) : undefined,
          url: b.url ? String(b.url) : undefined,
        }));
      } else if (source === "hn") {
        const res = await api("GET", `/api/hn-jobs?skill=${encodeURIComponent(query)}`);
        if (res?.error) setNote(String(res.error));
        if (res?.note) setNote(String(res.note));
        const jobs = (res?.jobs as Record<string, unknown>[]) || [];
        normalized = jobs.map((j, i) => ({
          id: String(i),
          title: stripHtml(String(j.company || "Hiring post")).slice(0, 90) || "Hiring post",
          subtitle: j.author ? `by ${j.author}` : "HN Who is Hiring",
          badge: "HN",
          meta: j.posted ? String(j.posted).slice(0, 10) : "",
          snippet: j.text ? stripHtml(String(j.text)).slice(0, 220) : undefined,
          url: j.url ? String(j.url) : undefined,
        }));
      } else if (source === "reddit") {
        const res = await api(
          "GET",
          `/api/reddit-feed?skill=${encodeURIComponent(query)}&subreddit=${encodeURIComponent(subreddit)}`
        );
        if (res?.error) setNote(String(res.error));
        const posts = (res?.posts as Record<string, unknown>[]) || [];
        normalized = posts.map((p, i) => ({
          id: String(i),
          title: String(p.title || "Untitled post"),
          subtitle: p.flair ? String(p.flair) : `r/${subreddit}`,
          badge: `${p.score ?? 0} pts`,
          meta: `${p.comments ?? 0} comments`,
          snippet: p.self_text ? String(p.self_text) : undefined,
          url: p.url ? String(p.url) : undefined,
        }));
      }
      setItems(normalized);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load jobs from this source");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [source, query, company, subreddit]);

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  return (
    <div className="flex flex-col gap-5">
      {/* Tabs */}
      <div className="tcard !p-2 flex flex-wrap gap-1.5">
        {SOURCES.map((s) => (
          <button
            key={s.id}
            onClick={() => setSource(s.id)}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg cursor-pointer transition-colors ${
              source === s.id ? "text-white" : "text-[#9090b0] hover:bg-white/5"
            }`}
            style={source === s.id ? { background: "linear-gradient(115deg, var(--primary), var(--secondary))" } : undefined}
          >
            <s.icon className="h-3.5 w-3.5" />
            {s.label}
          </button>
        ))}
      </div>

      {/* Query controls */}
      <div className="tcard flex flex-col sm:flex-row gap-3">
        {source === "greenhouse" ? (
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchJobs()}
            placeholder="Greenhouse company token, e.g. stripe"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-[#eeeef8] placeholder:text-[#55556a] focus:outline-none focus:border-[#7c3aed]/50"
          />
        ) : (
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchJobs()}
            placeholder="Skill / keyword, e.g. python"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-[#eeeef8] placeholder:text-[#55556a] focus:outline-none focus:border-[#7c3aed]/50"
          />
        )}
        {source === "reddit" && (
          <input
            value={subreddit}
            onChange={(e) => setSubreddit(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchJobs()}
            placeholder="Subreddit, e.g. cscareerquestions"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-[#eeeef8] placeholder:text-[#55556a] focus:outline-none focus:border-[#7c3aed]/50"
          />
        )}
        <button
          onClick={fetchJobs}
          disabled={loading}
          className="flex items-center justify-center gap-2 text-sm font-bold px-5 py-2.5 rounded-lg text-white cursor-pointer disabled:opacity-60 transition-opacity shrink-0"
          style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh
        </button>
      </div>

      {error && (
        <div className="tcard flex items-center gap-2 border-[var(--red)]/30 text-sm text-[var(--red-l)]">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}
      {!error && note && (
        <div className="tcard flex items-center gap-2 text-sm text-[#9090b0]">
          <AlertCircle className="h-4 w-4 shrink-0 text-[#f59e0b]" /> {note}
        </div>
      )}

      {loading && items.length === 0 && (
        <div className="tcard flex items-center justify-center py-16 text-[#55556a] text-sm">
          Loading jobs...
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="tcard flex flex-col items-center justify-center py-16 text-center">
          <Inbox className="h-6 w-6 text-[#55556a] mb-3" />
          <p className="font-bold text-[#9090b0]">No listings found</p>
          <p className="text-xs text-[#55556a] mt-1">Try a different keyword or source.</p>
        </div>
      )}

      {items.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it, i) => (
            <motion.div
              key={it.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i, 8) * 0.04 }}
              className="tcard flex flex-col gap-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-bold text-sm leading-snug">{it.title}</p>
                {it.badge && (
                  <span className="text-[9px] font-black px-2 py-1 rounded-full bg-[#7c3aed]/15 text-[#a78bfa] shrink-0 whitespace-nowrap">
                    {it.badge}
                  </span>
                )}
              </div>
              {it.subtitle && (
                <p className="flex items-center gap-1.5 text-xs text-[#9090b0]">
                  <MapPin className="h-3.5 w-3.5 shrink-0" /> {it.subtitle}
                </p>
              )}
              {it.snippet && <p className="text-xs text-[#55556a] leading-relaxed line-clamp-3">{it.snippet}</p>}
              <div className="flex items-center justify-between pt-1 mt-auto">
                <span className="text-[10px] text-[#55556a]">{it.meta}</span>
                {it.url ? (
                  <a
                    href={it.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-bold text-[#93c5fd] hover:underline"
                  >
                    View <ExternalLink className="h-3 w-3" />
                  </a>
                ) : null}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
