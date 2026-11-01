"use client";

import React from "react";
import Link from "next/link";
import { StreakGamification, Spotlight, SmoothScrollProvider } from "@main/ui-core";
import { ArrowLeft, Flame, Trophy, Award, Shield, UserCheck } from "lucide-react";

export default function DuoLeagueRoute() {
  const leaderboardUsers = [
    { rank: 1, name: "Aarav Sharma", xp: 3420, streak: 42, avatar: "🦁", league: "Diamond" },
    { rank: 2, name: "Kunal Patel (You)", xp: 1840, streak: 14, avatar: "⚡", league: "Emerald", isCurrent: true },
    { rank: 3, name: "Priya Venkatesh", xp: 1790, streak: 28, avatar: "🚀", league: "Emerald" },
    { rank: 4, name: "Devansh Rao", xp: 1620, streak: 19, avatar: "🎯", league: "Emerald" },
    { rank: 5, name: "Ananya Iyer", xp: 1480, streak: 9, avatar: "🌟", league: "Emerald" },
  ];

  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#030712] text-slate-100 p-6 md:p-10 space-y-8">
        <Spotlight className="-top-40 left-20" fill="rgba(245, 158, 11, 0.2)" />

        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/avpu"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="text-[11px] font-mono uppercase text-amber-400">AVPU Gamification Engine</div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400 fill-current animate-bounce" />
                <span>Daily Streak & Emerald League Arena (duolingo.com)</span>
              </h1>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 font-mono text-xs text-slate-400">
            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
              Season ends in 2d 14h · Top 3 Advance to Obsidian
            </span>
          </div>
        </div>

        {/* Streak & Quest Component */}
        <StreakGamification />

        {/* Weekly Leaderboard Division */}
        <div className="w-full bg-[#050814] border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-slate-100">Emerald League Leaderboard</h3>
            </div>
            <span className="text-xs font-mono text-emerald-400">Promotion Zone: Top 3</span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {leaderboardUsers.map((u) => (
              <div
                key={u.rank}
                className={`flex items-center justify-between p-3.5 rounded-xl transition-colors ${
                  u.isCurrent ? "bg-sky-950/40 border border-sky-500/40" : "hover:bg-slate-900/40"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`w-6 text-center font-mono text-xs font-bold ${
                      u.rank === 1
                        ? "text-amber-400"
                        : u.rank === 2
                        ? "text-slate-300"
                        : u.rank === 3
                        ? "text-amber-600"
                        : "text-slate-500"
                    }`}
                  >
                    #{u.rank}
                  </span>
                  <div className="text-2xl p-1 rounded-lg bg-slate-900 border border-slate-800">{u.avatar}</div>
                  <div>
                    <span className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                      {u.name}
                      {u.isCurrent && (
                        <span className="text-[10px] font-mono bg-sky-500 text-black px-1.5 py-0.2 rounded font-bold">
                          YOU
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-400 fill-current" />
                      {u.streak} Day Streak
                    </span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-sm font-bold text-sky-400">{u.xp.toLocaleString()} XP</div>
                  <div className="text-[10px] text-slate-500">{u.league} Division</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </SmoothScrollProvider>
  );
}
