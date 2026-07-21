"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import { GyanOrb } from "./GyanOrb";

/**
 * Hero centerpiece for AVPU — a vertical curriculum timeline instead of a
 * generic stat-card row. The two tracks and their weekly modules mirror what
 * backend/agents.py's roadmap() tool actually generates ("Week N: topic —
 * action") and match the real skill lists in backend/avpu_data.py's PROGRAMS
 * (B.Tech AI/ML, B.Tech Data Science) — not invented curricula.
 */
type Module = { weeks: string; title: string; detail: string };
type Track = { role: string; modules: Module[] };

const TRACKS: Track[] = [
  {
    role: "AI / ML Engineer track",
    modules: [
      { weeks: "Wk 1-3", title: "Python & Math Foundations", detail: "Programming, data structures, linear algebra & statistics." },
      { weeks: "Wk 4-7", title: "Machine Learning Core", detail: "Supervised/unsupervised models, feature engineering." },
      { weeks: "Wk 8-11", title: "Deep Learning & NLP", detail: "Neural nets, transformers, computer vision basics." },
      { weeks: "Wk 12-14", title: "Deployment & Placement Prep", detail: "MLOps, FastAPI serving, mock interviews." },
    ],
  },
  {
    role: "Data Science track",
    modules: [
      { weeks: "Wk 1-3", title: "Statistics & SQL", detail: "Probability, hypothesis testing, querying real datasets." },
      { weeks: "Wk 4-6", title: "Python & Data Wrangling", detail: "Pandas, cleaning pipelines, feature extraction." },
      { weeks: "Wk 7-10", title: "ML & Visualization", detail: "Model building plus dashboards for the results." },
      { weeks: "Wk 11-14", title: "Capstone & Interviews", detail: "A portfolio project, then resume and interview prep." },
    ],
  },
];

export function CurriculumPath() {
  const [trackIdx, setTrackIdx] = useState(0);
  const [activeModule, setActiveModule] = useState(0);

  const track = TRACKS[trackIdx];

  useEffect(() => {
    const id = setInterval(() => {
      setActiveModule((m) => (m + 1) % track.modules.length);
    }, 2200);
    return () => clearInterval(id);
  }, [track.modules.length]);

  function selectTrack(i: number) {
    setTrackIdx(i);
    setActiveModule(0);
  }

  return (
    <div className="curriculum-path w-full max-w-[640px]">
      <div className="flex items-center gap-3 mb-4 justify-center">
        <GyanOrb size={44} />
        <div className="text-left">
          <div className="text-xs font-bold text-white leading-tight">Gyan is mapping a syllabus</div>
          <div className="text-[11px] text-[#9aa0b8] leading-tight">grounded in AVPU&apos;s real program requirements</div>
        </div>
      </div>

      <div className="bg-black/40 border border-white/10 rounded-2xl backdrop-blur-xl p-4 md:p-5 text-left">
        <div className="flex gap-2 mb-4 flex-wrap">
          {TRACKS.map((t, i) => (
            <button
              key={t.role}
              onClick={() => selectTrack(i)}
              className={`px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-all ${
                i === trackIdx
                  ? "bg-[#6366f1]/20 border-[#6366f1] text-white"
                  : "bg-transparent border-white/10 text-[#9aa0b8] hover:border-white/30"
              }`}
            >
              {t.role}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={track.role}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="relative pl-6"
          >
            <div className="absolute left-[9px] top-2 bottom-2 w-px bg-gradient-to-b from-[#6366f1]/60 via-[#3b82f6]/40 to-transparent" />
            <div className="flex flex-col gap-4">
              {track.modules.map((m, i) => {
                const isActive = i === activeModule;
                const isDone = i < activeModule;
                return (
                  <div key={m.title} className="relative flex items-start gap-3">
                    <div className="absolute -left-6 top-0.5">
                      {isDone || isActive ? (
                        <CheckCircle2 className={`h-[18px] w-[18px] ${isActive ? "text-[#93c5fd]" : "text-[#6ee7b7]"}`} />
                      ) : (
                        <Circle className="h-[18px] w-[18px] text-white/20" />
                      )}
                    </div>
                    <div className={`flex-1 min-w-0 rounded-xl border px-3 py-2.5 transition-all ${
                      isActive ? "bg-[#6366f1]/10 border-[#6366f1]/40" : "bg-white/[0.02] border-white/5"
                    }`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-white truncate">{m.title}</span>
                        <span className="text-[10px] font-mono text-[#93c5fd] shrink-0">{m.weeks}</span>
                      </div>
                      <p className="text-[11px] text-[#9aa0b8] mt-0.5 leading-snug">{m.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-[#9aa0b8]">
          <strong className="text-[#93c5fd]">Full plan:</strong> the AI Tutor generates this week-by-week, then tracks quiz scores and study logs as you go.
        </div>
      </div>
    </div>
  );
}
