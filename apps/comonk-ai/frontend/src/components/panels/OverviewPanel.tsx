"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Briefcase, FileCheck, Mic, TrendingUp, Award } from "lucide-react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
} from "recharts";
import { GlowCard } from "@/components/GlowCard";
import type { ComonkUser } from "@/lib/auth";
import type { PanelId } from "@/lib/panels";

const TIPS = [
  "Tailor your resume's keywords to each job description — ATS systems reward exact matches.",
  "Follow up on applications after 5-7 business days if you haven't heard back.",
  "Quantify your achievements: 'increased X by Y%' beats 'responsible for X' every time.",
  "Your LinkedIn headline is prime real estate — make it about impact, not just your title.",
  "Practice the STAR method (Situation, Task, Action, Result) before every interview.",
];

const ACHIEVEMENTS = [
  { label: "First Upload", icon: FileCheck },
  { label: "Verified", icon: Award },
  { label: "5 Interviews", icon: Mic },
  { label: "10 Applications", icon: Briefcase },
  { label: "ATS Master", icon: TrendingUp },
  { label: "Networker", icon: Sparkles },
  { label: "Early Bird", icon: Sparkles },
  { label: "Streak x7", icon: Sparkles },
];

export function OverviewPanel({
  user,
  onNavigate,
}: {
  user: ComonkUser | null;
  onNavigate: (id: PanelId) => void;
}) {
  const [tip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)]);
  const [careerScore, setCareerScore] = useState(0);
  const [unlockedAch, setUnlockedAch] = useState<string[]>([]);

  useEffect(() => {
    setCareerScore(Math.round(58 + Math.random() * 30));
    try {
      const raw = localStorage.getItem("comonk_ach");
      if (raw) setUnlockedAch(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const radarData = [
    { skill: "Technical", value: 72 },
    { skill: "Communication", value: 65 },
    { skill: "Leadership", value: 58 },
    { skill: "Problem Solving", value: 80 },
    { skill: "Domain Knowledge", value: 70 },
  ];

  const kpis = [
    { label: "Companies Matched", value: "—", icon: Briefcase, action: "targets" as PanelId },
    { label: "Applications Tracked", value: "0", icon: FileCheck, action: "tracker" as PanelId },
    { label: "Interviews Practiced", value: "0", icon: Mic, action: "interview" as PanelId },
    { label: "Last ATS Score", value: "—", icon: TrendingUp, action: "ats" as PanelId },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Career score + tip */}
      <div className="grid md:grid-cols-3 gap-5">
        <GlowCard className="tcard md:col-span-1 flex flex-col items-center justify-center text-center">
          <div className="relative h-28 w-28">
            <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--bg-3)" strokeWidth="8" />
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#scoreGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 42}
                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - careerScore / 100) }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="100%" stopColor="var(--secondary)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black">{careerScore}</span>
              <span className="text-[10px] text-[#55556a]">/ 100</span>
            </div>
          </div>
          <p className="text-xs font-bold text-[#9090b0] mt-3">AI Career Score</p>
        </GlowCard>

        <GlowCard className="tcard md:col-span-2 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-[#a78bfa]" />
            <p className="text-xs font-bold uppercase tracking-wide text-[#55556a]">Today&apos;s Career Tip</p>
          </div>
          <p className="text-sm leading-relaxed">{tip}</p>
        </GlowCard>
      </div>

      {/* KPI row */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <button
            key={k.label}
            onClick={() => onNavigate(k.action)}
            className="tcard text-left cursor-pointer border-none hover:border-white/15 transition-all"
          >
            <k.icon className="h-5 w-5 text-[#a78bfa] mb-2" />
            <p className="text-2xl font-black">{k.value}</p>
            <p className="text-xs text-[#55556a] mt-0.5">{k.label}</p>
          </button>
        ))}
      </div>

      {/* Profile + Quick actions */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="tcard">
          <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] mb-3">Profile</p>
          <div className="flex items-center gap-3">
            <div
              className="h-12 w-12 rounded-full flex items-center justify-center text-lg font-black text-white shrink-0"
              style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}
            >
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="font-bold">{user?.name || "Guest"}</p>
              <p className="text-xs text-[#55556a]">{user?.target_role || "Set a target role"}</p>
            </div>
            {user?.is_verified ? (
              <span className="ml-auto text-[10px] font-black px-2 py-1 rounded-full bg-[#10b981]/15 text-[#6ee7b7]">
                ✓ VERIFIED
              </span>
            ) : (
              <button
                onClick={() => onNavigate("aptitude")}
                className="ml-auto text-[10px] font-bold px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#9090b0] cursor-pointer hover:text-white transition-colors"
              >
                Get Verified
              </button>
            )}
          </div>
        </div>

        <div className="tcard">
          <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] mb-3">Quick Actions</p>
          <div className="grid grid-cols-2 gap-2">
            {([
              ["Ask AI Counselor", "counselor"],
              ["Practice Interview", "interview"],
              ["Check ATS Score", "ats"],
              ["Find Companies", "targets"],
            ] as [string, PanelId][]).map(([label, id]) => (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className="text-xs font-semibold text-left px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Skills radar */}
      <div className="tcard">
        <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] mb-3">Skills Radar</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: "#9090b0", fontSize: 11 }} />
              <Radar dataKey="value" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.35} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Achievements */}
      <div className="tcard">
        <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] mb-3">Achievements</p>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = unlockedAch.includes(a.label);
            return (
              <div key={a.label} className="flex flex-col items-center gap-1.5 text-center">
                <div
                  className={`h-11 w-11 rounded-full flex items-center justify-center border ${
                    unlocked
                      ? "border-[#7c3aed]/40 bg-[#7c3aed]/15 text-[#a78bfa]"
                      : "border-white/5 bg-white/[0.02] text-[#3a3a4a]"
                  }`}
                >
                  <a.icon className="h-4.5 w-4.5" />
                </div>
                <span className="text-[9px] text-[#55556a] leading-tight">{a.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
