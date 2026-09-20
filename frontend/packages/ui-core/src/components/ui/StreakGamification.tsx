"use client";

import React, { useState } from "react";
import { Flame, Heart, Zap, Trophy, ShieldAlert, Award, Star, ArrowRight } from "lucide-react";

export function StreakGamification({
  initialStreak = 14,
  initialXP = 1840,
  initialHearts = 5,
  league = "Emerald",
  className = "",
}: {
  initialStreak?: number;
  initialXP?: number;
  initialHearts?: number;
  league?: string;
  className?: string;
}) {
  const [streak, setStreak] = useState(initialStreak);
  const [xp, setXp] = useState(initialXP);
  const [hearts, setHearts] = useState(initialHearts);
  const [streakFrozen, setStreakFrozen] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);

  const sampleQuestion = {
    q: "Which attention mechanism reduces transformer KV-cache memory bandwidth by sharing key-value heads?",
    options: [
      { text: "Multi-Query Attention (MQA)", correct: true },
      { text: "Standard Multi-Head Attention", correct: false },
      { text: "Feedforward SwiGLU", correct: false },
      { text: "Sinusoidal Embedding", correct: false },
    ],
  };

  const handleAnswer = (index: number, isCorrect: boolean) => {
    if (quizAnswered !== null) return;
    setQuizAnswered(index);
    if (isCorrect) {
      setXp((prev) => prev + 25);
    } else {
      setHearts((prev) => Math.max(0, prev - 1));
    }
  };

  return (
    <div className={`w-full bg-[#050814] border border-slate-800 rounded-2xl p-6 space-y-6 ${className}`}>
      {/* Top Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="text-xs font-mono uppercase text-sky-400">Gamification Engine (Duolingo System)</div>
          <h3 className="text-xl font-bold text-slate-100">Daily Study Streak & League Division</h3>
        </div>

        <div className="flex items-center gap-4">
          {/* Streak Flame */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold shadow-lg shadow-amber-500/10">
            <Flame className="w-4 h-4 fill-current animate-bounce" />
            <span>{streak} Days</span>
          </div>

          {/* XP Gauge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono text-xs font-bold">
            <Zap className="w-4 h-4 fill-current" />
            <span>{xp} XP</span>
          </div>

          {/* Hearts */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs font-bold">
            <Heart className="w-4 h-4 fill-current" />
            <span>{hearts} / 5</span>
          </div>

          {/* League Rank */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
            <Trophy className="w-4 h-4" />
            <span>{league} League</span>
          </div>
        </div>
      </div>

      {/* 7-Day Streak Calendar */}
      <div>
        <div className="text-xs font-mono uppercase text-slate-400 mb-2">This Week's Activity Matrix</div>
        <div className="grid grid-cols-7 gap-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => {
            const isCompleted = idx < 5;
            const isToday = idx === 5;
            return (
              <div
                key={day}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-mono transition-all ${
                  isCompleted
                    ? "bg-amber-950/20 border-amber-500/40 text-amber-300"
                    : isToday
                    ? "bg-sky-950/40 border-sky-400 text-sky-300 shadow-md shadow-sky-500/20"
                    : "bg-slate-900/40 border-slate-800 text-slate-500"
                }`}
              >
                <span className="text-[10px] uppercase text-slate-400 mb-1">{day}</span>
                {isCompleted ? (
                  <Flame className="w-5 h-5 fill-current text-amber-400" />
                ) : isToday ? (
                  <span className="w-4 h-4 rounded-full border-2 border-sky-400 animate-ping" />
                ) : (
                  <span className="w-3 h-3 rounded-full bg-slate-800" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Rapid-Fire Daily Quest */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-sky-400 font-bold flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-current text-sky-400" />
            <span>Daily Spaced-Repetition Checkpoint (+25 XP)</span>
          </span>
          <span className="text-xs font-mono text-slate-400">Question 1 of 1</span>
        </div>

        <p className="text-sm font-semibold text-slate-100">{sampleQuestion.q}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {sampleQuestion.options.map((opt, i) => {
            const isSelected = quizAnswered === i;
            return (
              <button
                key={i}
                onClick={() => handleAnswer(i, opt.correct)}
                disabled={quizAnswered !== null}
                className={`p-3 rounded-xl border text-left text-xs font-mono transition-all ${
                  quizAnswered === null
                    ? "bg-slate-900/80 border-slate-800 hover:border-sky-500/40 hover:bg-slate-900 text-slate-300"
                    : isSelected && opt.correct
                    ? "bg-emerald-950/50 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/20"
                    : isSelected && !opt.correct
                    ? "bg-rose-950/50 border-rose-500 text-rose-300"
                    : opt.correct
                    ? "bg-emerald-950/30 border-emerald-500/60 text-emerald-400"
                    : "bg-slate-900/40 border-slate-800 text-slate-600"
                }`}
              >
                {opt.text}
              </button>
            );
          })}
        </div>

        {quizAnswered !== null && (
          <div className="pt-2 text-xs font-mono flex items-center justify-between">
            <span className={sampleQuestion.options[quizAnswered].correct ? "text-emerald-400 font-bold" : "text-rose-400"}>
              {sampleQuestion.options[quizAnswered].correct ? "✓ Correct! +25 XP awarded." : "✗ Incorrect: 1 Heart deducted."}
            </span>
            <button
              onClick={() => { setQuizAnswered(null); }}
              className="text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>Next Checkpoint</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
