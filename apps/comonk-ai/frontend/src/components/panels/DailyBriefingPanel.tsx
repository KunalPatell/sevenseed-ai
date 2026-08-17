"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Sunrise,
  RefreshCw,
  Sparkles,
  Target,
  Clock,
  Trophy,
  MessageCircle,
  Flame,
  LogIn,
  AlertCircle,
} from "lucide-react";
import { GlowCard } from "@/components/GlowCard";
import { authApi } from "@/lib/api";
import { Auth } from "@/lib/auth";

interface FollowupDue {
  company?: string;
  app_id?: number;
  days_since?: number;
  [key: string]: unknown;
}

interface BriefingStats {
  total?: number;
  interviews?: number;
  offers?: number;
  replies?: number;
  [key: string]: unknown;
}

interface SkillOfDay {
  skill?: string;
  tip?: string;
  [key: string]: unknown;
}

interface Briefing {
  date?: string;
  weekday?: string;
  priorities?: string[];
  followups_due?: FollowupDue[];
  stats?: BriefingStats;
  skill_of_day?: SkillOfDay;
  motivation?: string;
  ai_insight?: string | null;
  [key: string]: unknown;
}

const KNOWN_KEYS = new Set([
  "date",
  "weekday",
  "priorities",
  "followups_due",
  "stats",
  "skill_of_day",
  "motivation",
  "ai_insight",
]);

function prettifyKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function DailyBriefingPanel() {
  const loggedIn = Auth.isLoggedIn();
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!loggedIn) return;
    setLoading(true);
    setError("");
    try {
      const res = await authApi("GET", "/api/daily-briefing");
      setBriefing(res as Briefing);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load briefing");
    } finally {
      setLoading(false);
    }
  }, [loggedIn]);

  useEffect(() => {
    load();
  }, [load]);

  if (!loggedIn) {
    return (
      <div className="tcard flex flex-col items-center justify-center py-20 text-center">
        <LogIn className="h-6 w-6 text-[#55556a] mb-3" />
        <p className="font-bold text-[#9090b0]">Login to see your briefing</p>
        <p className="text-xs text-[#55556a] mt-1">
          Your personalized daily briefing is available once you&apos;re signed in.
        </p>
      </div>
    );
  }

  const stats = briefing?.stats || {};
  const kpis = [
    { label: "Applications", value: stats.total, icon: Target },
    { label: "Interviews", value: stats.interviews, icon: Sparkles },
    { label: "Offers", value: stats.offers, icon: Trophy },
    { label: "Replies", value: stats.replies, icon: MessageCircle },
  ];

  const extraEntries = briefing
    ? Object.entries(briefing).filter(([k, v]) => !KNOWN_KEYS.has(k) && v !== null && v !== undefined)
    : [];

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="tcard flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="h-11 w-11 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}
          >
            <Sunrise className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold">
              {briefing?.weekday ? `Good morning — ${briefing.weekday}` : "Your Daily Briefing"}
            </p>
            <p className="text-xs text-[#55556a]">{briefing?.date || "Fetching today's plan..."}</p>
          </div>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="tcard flex items-center gap-2 border-[var(--red)]/30 text-sm text-[var(--red-l)]">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {loading && !briefing && (
        <div className="tcard flex items-center justify-center py-16 text-[#55556a] text-sm">
          Loading your briefing...
        </div>
      )}

      {briefing && (
        <>
          {/* Motivation + AI insight */}
          <div className="grid md:grid-cols-2 gap-5">
            <GlowCard className="tcard flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-4 w-4 text-[#a78bfa]" />
                <p className="text-xs font-bold uppercase tracking-wide text-[#55556a]">Motivation</p>
              </div>
              <p className="text-sm leading-relaxed">{briefing.motivation || "Keep pushing forward today."}</p>
            </GlowCard>
            <GlowCard className="tcard flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-[#93c5fd]" />
                <p className="text-xs font-bold uppercase tracking-wide text-[#55556a]">AI Insight</p>
              </div>
              <p className="text-sm leading-relaxed">
                {briefing.ai_insight || "Add a Groq API key to unlock personalized AI insights."}
              </p>
            </GlowCard>
          </div>

          {/* KPI row */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((k) => (
              <div key={k.label} className="tcard">
                <k.icon className="h-5 w-5 text-[#a78bfa] mb-2" />
                <p className="text-2xl font-black">{typeof k.value === "number" ? k.value : "—"}</p>
                <p className="text-xs text-[#55556a] mt-0.5">{k.label}</p>
              </div>
            ))}
          </div>

          {/* Priorities + skill of day */}
          <div className="grid md:grid-cols-2 gap-5">
            <div className="tcard">
              <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] mb-3">
                Today&apos;s Priorities
              </p>
              {briefing.priorities && briefing.priorities.length > 0 ? (
                <ul className="flex flex-col gap-2.5">
                  {briefing.priorities.map((p, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-start gap-2.5 text-sm"
                    >
                      <span
                        className="mt-0.5 h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 text-white"
                        style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}
                      >
                        {i + 1}
                      </span>
                      <span className="text-[#eeeef8]">{p}</span>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-[#55556a]">No priorities today — you&apos;re all caught up.</p>
              )}
            </div>

            <div className="tcard">
              <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] mb-3">Skill of the Day</p>
              {briefing.skill_of_day ? (
                <div>
                  <span className="inline-block text-[10px] font-black px-2 py-1 rounded-full bg-[#7c3aed]/15 text-[#a78bfa] mb-2">
                    {briefing.skill_of_day.skill || "Skill"}
                  </span>
                  <p className="text-sm leading-relaxed text-[#eeeef8]">{briefing.skill_of_day.tip}</p>
                </div>
              ) : (
                <p className="text-xs text-[#55556a]">No skill tip available.</p>
              )}
            </div>
          </div>

          {/* Follow-ups due */}
          <div className="tcard">
            <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] mb-3 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" /> Follow-ups Due
            </p>
            {briefing.followups_due && briefing.followups_due.length > 0 ? (
              <div className="flex flex-col gap-2">
                {briefing.followups_due.map((f, i) => (
                  <div
                    key={f.app_id ?? i}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-white/5"
                  >
                    <span className="text-sm font-semibold">{f.company || "Unknown company"}</span>
                    <span className="text-xs text-[#f59e0b] font-bold">
                      {typeof f.days_since === "number" ? `${f.days_since}d silent` : ""}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#55556a]">Nothing pending — great job staying on top of things.</p>
            )}
          </div>

          {/* Any unexpected extra fields, rendered generically */}
          {extraEntries.length > 0 && (
            <div className="tcard">
              <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] mb-3">More</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {extraEntries.map(([k, v]) => (
                  <div key={k} className="px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#55556a] mb-1">
                      {prettifyKey(k)}
                    </p>
                    <p className="text-sm text-[#eeeef8] break-words">
                      {typeof v === "string" || typeof v === "number" ? String(v) : JSON.stringify(v)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
