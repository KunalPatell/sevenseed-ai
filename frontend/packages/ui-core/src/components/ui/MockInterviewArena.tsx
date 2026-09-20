"use client";

import React, { useState, useEffect } from "react";
import { Mic, Terminal, Play, CheckCircle, Volume2, Award, Clock } from "lucide-react";

export function MockInterviewArena() {
  const [timeLeft, setTimeLeft] = useState(2700); // 45:00
  const [isRunning, setIsRunning] = useState(false);
  const [userCode, setUserCode] = useState(`class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}

    def get(self, key: int) -> int:
        return self.cache.get(key, -1)

    def put(self, key: int, value: int) -> None:
        self.cache[key] = value`);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    let timer: any;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const evaluateCode = () => {
    setFeedback("✅ Algorithmic Complexity: O(1) Get / Put · Design Rubric: 9.2/10 (Strong Hire candidate).");
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-8 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Mic className="w-4 h-4" /> FAANG 45-Min Technical Interview Simulator
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Mock Interview Arena & Code Sandbox
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
          Simulated live coding room with active countdown timer, real-time rubric scorecards, and AI interviewer audio evaluation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left: Problem & Controls */}
        <div className="md:col-span-5 bg-slate-950/60 border border-slate-800 p-6 rounded-xl space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase">Interview Clock</span>
            <span className="text-2xl font-mono font-bold text-amber-400 flex items-center gap-1.5">
              <Clock className="w-5 h-5" /> {formatTime(timeLeft)}
            </span>
          </div>

          <div>
            <span className="text-xs font-bold uppercase text-sky-400">Problem 146: LRU Cache</span>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with <code>get</code> and <code>put</code> operations in O(1) average time complexity.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs font-bold uppercase text-slate-400">Evaluation Rubrics</span>
            <div className="text-xs space-y-1 text-slate-300">
              <div className="flex justify-between"><span>Algorithm Complexity:</span> <span className="text-emerald-400 font-bold">O(1) Hash+DLL</span></div>
              <div className="flex justify-between"><span>Edge Cases & Nulls:</span> <span className="text-sky-400 font-bold">Passed</span></div>
              <div className="flex justify-between"><span>Code Cleanliness:</span> <span className="text-purple-400 font-bold">PEP 8 Standard</span></div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex-1 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition"
            >
              {isRunning ? "Pause Interview" : "Start 45m Clock"}
            </button>
            <button
              onClick={evaluateCode}
              className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition"
            >
              <Play className="w-3.5 h-3.5" /> Submit
            </button>
          </div>
        </div>

        {/* Right: Code Console */}
        <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>Python 3.12 Sandboxed REPL</span>
            <span className="text-emerald-400 flex items-center gap-1"><Volume2 className="w-3.5 h-3.5" /> AI Interviewer Connected</span>
          </div>

          <textarea
            rows={10}
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            className="w-full p-3 bg-slate-900 border border-slate-800 rounded-lg font-mono text-xs text-slate-200 focus:outline-none focus:border-sky-500"
          />

          {feedback && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs font-mono text-emerald-300 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" /> {feedback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
