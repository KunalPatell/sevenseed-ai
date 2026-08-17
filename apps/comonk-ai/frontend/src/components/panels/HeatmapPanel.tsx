"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Grid3x3, Loader2, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api";

interface SkillCount {
  skill: string;
  count: number;
}

function normalize(res: any): SkillCount[] {
  // Backend returns {skills: [{name, count}]} — but handle a plain
  // {skill: count} map shape defensively too, per spec.
  if (Array.isArray(res?.skills)) {
    return res.skills
      .map((s: any) => ({ skill: s.skill ?? s.name ?? "", count: Number(s.count) || 0 }))
      .filter((s: SkillCount) => s.skill);
  }
  if (res && typeof res === "object") {
    const source = typeof res.skills === "object" && res.skills !== null ? res.skills : res;
    return Object.entries(source)
      .filter(([, v]) => typeof v === "number")
      .map(([skill, count]) => ({ skill, count: count as number }));
  }
  return [];
}

export function HeatmapPanel() {
  const [skills, setSkills] = useState<SkillCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api("GET", "/api/skill-demand");
        const list = normalize(res).sort((a, b) => b.count - a.count);
        setSkills(list);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load skill demand data.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const max = skills.length > 0 ? Math.max(...skills.map((s) => s.count)) : 1;

  return (
    <div className="flex flex-col gap-5">
      <div className="tcard flex items-center gap-2">
        <Grid3x3 className="h-4 w-4 text-[#a78bfa]" />
        <p className="text-xs font-bold uppercase tracking-wide text-[#55556a]">Skill Demand Heatmap</p>
        <p className="text-[11px] text-[#55556a] ml-auto">Frequency of skills across live job listings</p>
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
      ) : skills.length === 0 ? (
        <div className="tcard text-center py-16 text-xs text-[#55556a]">No skill demand data available.</div>
      ) : (
        <div className="tcard grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {skills.map((s, i) => {
            const intensity = Math.max(0.12, s.count / max);
            return (
              <motion.div
                key={s.skill}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(i * 0.02, 0.4) }}
                className="rounded-lg border border-white/5 p-3 flex flex-col gap-1"
                style={{ background: `rgba(124, 58, 237, ${intensity})` }}
              >
                <span className="text-xs font-bold capitalize truncate">{s.skill}</span>
                <span className="text-[10px] text-[#eeeef8]/70">{s.count}</span>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
