"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Timer, Play, Pause, RotateCcw, Plus, Trash2, RefreshCw, Coffee, Activity, Quote } from "lucide-react";
import { authApi } from "@/lib/api";

type Mode = "work" | "short" | "long";

const DURATIONS: Record<Mode, number> = { work: 25 * 60, short: 5 * 60, long: 15 * 60 };
const MODE_LABEL: Record<Mode, string> = { work: "Focus", short: "Short Break", long: "Long Break" };

const QUOTES = [
  "The secret of getting ahead is getting started. — Mark Twain",
  "Focus on being productive instead of busy. — Tim Ferriss",
  "It always seems impossible until it's done. — Nelson Mandela",
  "Discipline is choosing between what you want now and what you want most. — Abraham Lincoln",
  "You don't have to be great to start, but you have to start to be great. — Zig Ziglar",
  "The way to get started is to quit talking and begin doing. — Walt Disney",
  "Amateurs sit and wait for inspiration; the rest of us just get up and go to work. — Stephen King",
  "Success is the sum of small efforts repeated day in and day out. — Robert Collier",
  "Don't watch the clock; do what it does. Keep going. — Sam Levenson",
  "Deep work is the ability to focus without distraction on a cognitively demanding task. — Cal Newport",
  "Motivation is what gets you started. Habit is what keeps you going. — Jim Rohn",
  "Concentrate all your thoughts upon the work at hand. — Alexander Graham Bell",
  "The future depends on what you do today. — Mahatma Gandhi",
  "Small daily improvements are the key to staggering long-term results. — James Clear",
  "Well begun is half done. — Aristotle",
];

interface Task {
  id: string;
  text: string;
  done: boolean;
}

const TASKS_KEY = "comonk_focus_tasks";

interface WakaData {
  configured: boolean;
  human_readable_total?: string;
  daily_average?: string;
  best_day?: string;
  languages?: { name: string; percent: number }[];
}

function fmtTime(sec: number) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export function FocusTimerPanel() {
  const [mode, setMode] = useState<Mode>("work");
  const [secondsLeft, setSecondsLeft] = useState(DURATIONS.work);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [quote, setQuote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState("");
  const [tasksLoaded, setTasksLoaded] = useState(false);
  const [waka, setWaka] = useState<WakaData | null>(null);

  const modeRef = useRef(mode);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(TASKS_KEY);
      if (raw) setTasks(JSON.parse(raw));
    } catch {
      // ignore
    }
    setTasksLoaded(true);
  }, []);

  useEffect(() => {
    if (!tasksLoaded) return;
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }, [tasks, tasksLoaded]);

  useEffect(() => {
    (async () => {
      try {
        const res = await authApi("GET", "/api/wakatime-stats");
        if (res?.configured && !res?.error) setWaka(res);
      } catch {
        // hide silently — optional card
      }
    })();
  }, []);

  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => {
      setSecondsLeft((t) => {
        if (t <= 1) {
          clearInterval(iv);
          setRunning(false);
          if (modeRef.current === "work") setSessions((s) => s + 1);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [running]);

  const switchMode = useCallback((m: Mode) => {
    setMode(m);
    setSecondsLeft(DURATIONS[m]);
    setRunning(false);
  }, []);

  function reset() {
    setSecondsLeft(DURATIONS[mode]);
    setRunning(false);
  }

  function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!taskInput.trim()) return;
    setTasks((t) => [{ id: `${Date.now()}`, text: taskInput.trim(), done: false }, ...t]);
    setTaskInput("");
  }

  function toggleTask(id: string) {
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  }

  function removeTask(id: string) {
    setTasks((t) => t.filter((x) => x.id !== id));
  }

  function refreshQuote() {
    setQuote((q) => {
      let next = q;
      let guard = 0;
      while (next === q && guard < 10) {
        next = QUOTES[Math.floor(Math.random() * QUOTES.length)];
        guard++;
      }
      return next;
    });
  }

  const total = DURATIONS[mode];
  const pct = secondsLeft / total;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid md:grid-cols-3 gap-5">
        <div className="tcard md:col-span-2 flex flex-col items-center gap-5">
          <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/5 rounded-lg p-1">
            {(["work", "short", "long"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
                  mode === m ? "bg-[#7c3aed]/20 text-white" : "text-[#9090b0] hover:text-white"
                }`}
              >
                {MODE_LABEL[m]}
              </button>
            ))}
          </div>

          <div className="relative h-56 w-56">
            <svg viewBox="0 0 100 100" className="h-56 w-56 -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--bg-3)" strokeWidth="7" />
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#timerGrad)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 42}
                animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - pct) }}
                transition={{ duration: 0.4, ease: "linear" }}
              />
              <defs>
                <linearGradient id="timerGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="100%" stopColor="var(--secondary)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black tabular-nums">{fmtTime(secondsLeft)}</span>
              <span className="text-[11px] text-[#55556a] mt-1">{MODE_LABEL[mode]}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setRunning((r) => !r)}
              disabled={secondsLeft === 0}
              className="flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-lg text-white cursor-pointer disabled:opacity-50"
              style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
            >
              {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {running ? "Pause" : "Start"}
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-xs font-bold px-4 py-3 rounded-lg bg-white/5 border border-white/10 hover:text-white cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>

          <p className="text-xs text-[#55556a] flex items-center gap-1.5">
            <Coffee className="h-3.5 w-3.5" /> {sessions} focus session{sessions === 1 ? "" : "s"} completed today
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <div className="tcard flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Quote className="h-4 w-4 text-[#a78bfa]" />
              <p className="text-xs font-bold uppercase tracking-wide text-[#55556a]">Motivation</p>
              <button onClick={refreshQuote} className="ml-auto text-[#55556a] hover:text-white cursor-pointer">
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-xs text-[#9090b0] leading-relaxed">{quote}</p>
          </div>

          {waka?.configured && (
            <div className="tcard flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#a78bfa]" />
                <p className="text-xs font-bold uppercase tracking-wide text-[#55556a]">WakaTime — Last 7 Days</p>
              </div>
              <p className="text-lg font-black">{waka.human_readable_total || "—"}</p>
              {waka.daily_average && <p className="text-[11px] text-[#55556a]">Avg/day: {waka.daily_average}</p>}
              {waka.languages && waka.languages.length > 0 && (
                <p className="text-[11px] text-[#9090b0] mt-1">
                  Top: {waka.languages.slice(0, 3).map((l) => l.name).join(", ")}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="tcard">
        <div className="flex items-center gap-2 mb-3">
          <Timer className="h-4 w-4 text-[#a78bfa]" />
          <p className="text-xs font-bold uppercase tracking-wide text-[#55556a]">Focus Tasks</p>
        </div>
        <form onSubmit={addTask} className="flex items-center gap-2 mb-3">
          <input
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="What are you working on?"
            className="flex-1 text-xs px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[#7c3aed]/50"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:text-white cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </form>
        {tasks.length === 0 ? (
          <p className="text-xs text-[#55556a] text-center py-6">No tasks yet — add what you want to focus on.</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {tasks.map((t) => (
              <div key={t.id} className="flex items-center gap-2.5 px-1 py-1.5">
                <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)} className="cursor-pointer" />
                <span className={`text-xs flex-1 ${t.done ? "line-through text-[#55556a]" : ""}`}>{t.text}</span>
                <button onClick={() => removeTask(t.id)} className="text-[#55556a] hover:text-[#fca5a5] cursor-pointer">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
