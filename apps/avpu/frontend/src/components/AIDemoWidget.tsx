"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Sparkles, ArrowRight, GraduationCap, Compass, Award } from "lucide-react";

const API_BASE = "/avpu";

const EXAMPLES = [
  "Explain binary search in simple terms",
  "What's the difference between SQL JOIN types?",
  "How does gradient descent work?",
  "What documents do I need for admission?",
];

const ROADMAP_EXAMPLES = ["AI / Machine Learning Engineer", "Full-Stack Data Scientist", "Cloud DevOps Engineer"];

function renderReply(text: string) {
  return text.split("\n").map((line, i) => (
    <p key={i} className={line.trim() ? "mb-1.5" : "h-2"}>
      {line.split(/\*\*(.+?)\*\*/g).map((part, j) =>
        j % 2 === 1 ? (
          <strong key={j} className="text-[#c7d2fe]">
            {part}
          </strong>
        ) : (
          part
        )
      )}
    </p>
  ));
}

export function AIDemoWidget() {
  const [activeTab, setActiveTab] = useState<"tutor" | "roadmap" | "placement">("placement");

  // Tutor State
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  // Roadmap State
  const [goal, setGoal] = useState("");
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [roadmapError, setRoadmapError] = useState("");
  const [roadmapPlan, setRoadmapPlan] = useState<string[]>([]);

  // Placement State — real, adjustable, client-side computed (no AI claim, just honest math)
  const [skills, setSkills] = useState({
    python: 60,
    deepLearning: 50,
    langchain: 40,
    fastapi: 50,
  });
  const readinessScore = Math.round(
    (skills.python + skills.deepLearning + skills.langchain + skills.fastapi) / 4
  );

  async function runRoadmapDemo(e?: React.FormEvent) {
    e?.preventDefault();
    if (!goal.trim() || roadmapLoading) return;
    setRoadmapLoading(true);
    setRoadmapError("");
    setRoadmapPlan([]);
    try {
      const res = await fetch(`${API_BASE}/api/roadmap/demo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: goal.slice(0, 100) }),
      });
      if (res.status === 429) {
        const data = await res.json().catch(() => null);
        setRoadmapError(data?.detail || "This demo is popular right now — please try again in a moment.");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setRoadmapError(data?.detail || "Something went wrong. Please try again.");
        return;
      }
      const data = await res.json();
      setRoadmapPlan(data.plan || []);
    } catch {
      setRoadmapError("Couldn't reach the AI right now. Please try again shortly.");
    } finally {
      setRoadmapLoading(false);
    }
  }

  async function runDemo(e?: React.FormEvent) {
    e?.preventDefault();
    if (!question.trim() || loading) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch(`${API_BASE}/api/tutor/demo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.slice(0, 300) }),
      });
      if (res.status === 429) {
        const data = await res.json().catch(() => null);
        setError(data?.detail || "Our AI Tutor is popular right now — please try again in a moment.");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.detail || "Something went wrong. Please try again.");
        return;
      }
      const data = await res.json();
      setResult(data.reply || "");
    } catch {
      setError("Couldn't reach the AI Tutor right now. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative overflow-hidden bg-[#090a14] border border-[#6366f1]/30 rounded-3xl p-6 md:p-10 mt-10 shadow-[0_0_50px_rgba(99,102,241,0.15)]">
      {/* Ambient Electric Blue Mesh Glows */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#6366f1]/15 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#3b82f6]/15 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Live Enterprise Performance Stats Bar */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-black/40 border border-white/10 rounded-2xl mb-8 backdrop-blur-xl">
        <div className="flex items-center gap-2.5 px-3 border-r border-white/10">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
          </span>
          <div>
            <div className="text-[10px] uppercase font-mono text-[#999]">Engine Status</div>
            <div className="text-xs font-bold text-white font-mono">LangChain RAG Online</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-3 border-r border-white/10">
          <span className="text-xs">⚡</span>
          <div>
            <div className="text-[10px] uppercase font-mono text-[#999]">Tutor Mode</div>
            <div className="text-xs font-bold text-[#93c5fd] font-mono">RAG-Grounded</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-3 border-r border-white/10">
          <span className="text-xs">🎓</span>
          <div>
            <div className="text-[10px] uppercase font-mono text-[#999]">Demo Tools</div>
            <div className="text-xs font-bold text-white font-mono">3 Live Widgets</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-3">
          <span className="text-xs">🏆</span>
          <div>
            <div className="text-[10px] uppercase font-mono text-[#999]">Public Rate Limit</div>
            <div className="text-xs font-bold text-emerald-400 font-mono">5 / hour</div>
          </div>
        </div>
      </div>

      {/* Header & Glass Tabs */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-[#93c5fd]" />
            <span className="text-xs font-bold tracking-wider text-[#93c5fd] uppercase">Interactive EdTech AI Workstation</span>
          </div>
          <h4 className="text-2xl font-black text-white tracking-tight">AI Learning & Placement Intelligence</h4>
        </div>

        <div className="flex gap-2 p-1.5 bg-black/60 rounded-2xl border border-white/10 backdrop-blur-xl">
          <button
            onClick={() => setActiveTab("placement")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-300 ${
              activeTab === "placement" ? "bg-[#6366f1] text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] scale-[1.02]" : "text-[#9aa0b8] hover:text-white"
            }`}
          >
            <Award className="h-3.5 w-3.5" /> Skill Radar & Placement
          </button>
          <button
            onClick={() => setActiveTab("tutor")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-300 ${
              activeTab === "tutor" ? "bg-[#6366f1] text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] scale-[1.02]" : "text-[#9aa0b8] hover:text-white"
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" /> AI Personal Tutor
          </button>
          <button
            onClick={() => setActiveTab("roadmap")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-300 ${
              activeTab === "roadmap" ? "bg-[#6366f1] text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] scale-[1.02]" : "text-[#9aa0b8] hover:text-white"
            }`}
          >
            <Compass className="h-3.5 w-3.5" /> Career Roadmap
          </button>
        </div>
      </div>

      {/* Tab 1: AI Personal Tutor */}
      {activeTab === "tutor" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-xs md:text-sm text-[#9aa0b8] mb-5">
            Type any course topic — our RAG-grounded tutor agent will explain it, live, right here.
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setQuestion(ex)}
                className="text-[11px] px-3 py-1.5 rounded-full border border-white/10 text-[#9aa0b8] hover:text-white hover:border-[#6366f1]/50 hover:bg-[#6366f1]/10 transition-all"
              >
                &ldquo;{ex}&rdquo;
              </button>
            ))}
          </div>

          <form onSubmit={runDemo} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Explain binary search in simple terms"
              maxLength={300}
              required
              className="flex-1 w-full px-4 py-3 bg-[#0d0d16] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#6366f1]"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="btn w-full sm:w-fit px-6 py-3 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#3b82f6] text-white font-semibold text-sm hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ask Tutor"}
            </button>
          </form>

          {error && <p className="text-xs text-[#fca5a5] font-medium mt-4 text-center">{error}</p>}

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-[#0d0d16] border border-[#6366f1]/25 rounded-xl p-5"
              >
                <div className="text-[10px] font-bold tracking-wider text-[#93c5fd] uppercase mb-3">AI Tutor Response</div>
                <div className="text-sm text-[#eeeef8] leading-relaxed">{renderReply(result)}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Tab 2: Adaptive Career Roadmap */}
      {activeTab === "roadmap" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-xs md:text-sm text-[#9aa0b8] mb-4">
            Type a target career goal — our AI coach will draft a real 4-week starter roadmap, live.
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            {ROADMAP_EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setGoal(ex)}
                className="text-[11px] px-3 py-1.5 rounded-full border border-white/10 text-[#9aa0b8] hover:text-white hover:border-[#6366f1]/50 hover:bg-[#6366f1]/10 transition-all"
              >
                &ldquo;{ex}&rdquo;
              </button>
            ))}
          </div>

          <form onSubmit={runRoadmapDemo} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. AI / Machine Learning Engineer"
              maxLength={100}
              required
              className="flex-1 w-full px-4 py-3 bg-[#0d0d16] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#6366f1]"
            />
            <button
              type="submit"
              disabled={roadmapLoading || !goal.trim()}
              className="btn w-full sm:w-fit px-6 py-3 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#3b82f6] text-white font-semibold text-sm hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {roadmapLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate Roadmap"}
            </button>
          </form>

          {roadmapError && <p className="text-xs text-[#fca5a5] font-medium mt-4 text-center">{roadmapError}</p>}

          <AnimatePresence>
            {roadmapPlan.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-[#08080f] border border-[#6366f1]/30 rounded-xl p-5"
              >
                <div className="text-[10px] font-bold tracking-wider text-[#93c5fd] uppercase mb-3">AI Generated · 4-Week Starter Plan</div>
                <div className="space-y-2">
                  {roadmapPlan.map((line, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2.5 rounded-lg bg-[#0d0d16] border border-white/5 text-xs text-white/90">
                      <span className="w-5 h-5 rounded-full bg-[#6366f1]/20 border border-[#6366f1]/40 text-[#93c5fd] flex items-center justify-center font-bold text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
                <a href="/app/" className="inline-flex items-center gap-1.5 text-xs text-[#93c5fd] font-semibold mt-4 hover:underline">
                  Get a full personalized multi-month roadmap in the Student Portal <ArrowRight className="h-3 w-3" />
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Tab 3: Placement Readiness Dial & Skill Audit */}
      {activeTab === "placement" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-xs md:text-sm text-[#9aa0b8] mb-4">
            Drag the sliders to your real proficiency — the readiness score below is a live average, computed as you move them:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#08080f] border border-[#6366f1]/30 rounded-2xl p-5 md:p-6 shadow-xl">
            {/* Left: Real, adjustable skill sliders */}
            <div className="space-y-4">
              {([
                ["Python & Data Pipelines", "python"],
                ["Deep Learning (PyTorch)", "deepLearning"],
                ["LangChain & RAG Agents", "langchain"],
                ["FastAPI & Vector DBs", "fastapi"],
              ] as const).map(([label, key]) => (
                <div key={key}>
                  <div className="flex justify-between text-xs text-white mb-1 font-mono">
                    <span>{label}</span>
                    <span className="text-[#93c5fd]">{skills[key]}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={skills[key]}
                    onChange={(e) => setSkills((s) => ({ ...s, [key]: Number(e.target.value) }))}
                    className="w-full accent-[#6366f1]"
                  />
                </div>
              ))}
            </div>

            {/* Right: Live-computed score (honest client-side average, not AI-claimed) */}
            <div className="flex flex-col justify-center">
              <div className="bg-[#0d0d16] border border-white/10 rounded-xl p-4 text-center">
                <span className="text-[10px] font-mono text-[#93c5fd] font-bold uppercase tracking-wider block mb-1">
                  YOUR SELF-RATED READINESS AVERAGE
                </span>
                <div className="text-3xl font-black font-mono text-white my-1">
                  {readinessScore}<span className="text-[#6366f1] text-lg">%</span>
                </div>
                <span className="text-[11px] text-[#93c5fd]/80 block mt-2">
                  Simple average of the 4 sliders above — a self-assessment, not an AI-computed score.
                </span>
              </div>
              <a href="/app/" className="inline-flex items-center justify-center gap-1.5 text-xs text-[#93c5fd] font-semibold mt-4 hover:underline">
                Get a real AI skill assessment & placement matching in the Student Portal <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </motion.div>
      )}

      <div className="mt-6 border-t border-white/10 pt-4 flex justify-between items-center">
        <span className="text-[11px] text-[#9aa0b8] italic">Powered by ChromaDB Vector RAG & LangChain</span>
        <a href="/app/" className="inline-flex items-center gap-1.5 text-xs text-[#93c5fd] font-semibold hover:underline">
          Open Student Portal <ArrowRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

