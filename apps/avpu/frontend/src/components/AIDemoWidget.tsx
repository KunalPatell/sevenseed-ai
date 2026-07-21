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

const ROADMAPS = [
  {
    role: "AI / Machine Learning Engineer",
    duration: "6 Months Intensive",
    modules: ["Python & Math Foundations", "Deep Learning & PyTorch", "LLMs, LangChain & RAG Pipelines", "Model Deployment & FastAPI"],
    salary: "₹12 – ₹24 LPA"
  },
  {
    role: "Full-Stack Data Scientist",
    duration: "5 Months",
    modules: ["SQL & Feature Engineering", "Supervised/Unsupervised ML", "Computer Vision (OpenCV/YOLO)", "Interactive Streamlit Dashboards"],
    salary: "₹10 – ₹18 LPA"
  }
];

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
  const [activeTab, setActiveTab] = useState<"tutor" | "roadmap" | "placement">("tutor");

  // Tutor State
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  // Roadmap State
  const [selectedRole, setSelectedRole] = useState(ROADMAPS[0]);

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
    <div className="glow-card bg-gradient-to-br from-[#12121e] to-[#0d0d16] border border-[#6366f1]/25 rounded-2xl p-6 md:p-8 mt-8 shadow-2xl">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-[#93c5fd]" />
            <span className="text-xs font-bold tracking-wider text-[#93c5fd] uppercase">Interactive EdTech AI Workstation</span>
          </div>
          <h4 className="text-xl font-extrabold text-white">AI Learning & Placement Intelligence</h4>
        </div>

        <div className="flex gap-2 p-1 bg-[#08080f] rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab("tutor")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "tutor" ? "bg-[#6366f1] text-white shadow-md" : "text-[#9aa0b8] hover:text-white"
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" /> AI Personal Tutor
          </button>
          <button
            onClick={() => setActiveTab("roadmap")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "roadmap" ? "bg-[#6366f1] text-white shadow-md" : "text-[#9aa0b8] hover:text-white"
            }`}
          >
            <Compass className="h-3.5 w-3.5" /> Career Roadmap
          </button>
          <button
            onClick={() => setActiveTab("placement")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "placement" ? "bg-[#6366f1] text-white shadow-md" : "text-[#9aa0b8] hover:text-white"
            }`}
          >
            <Award className="h-3.5 w-3.5" /> Placement Matcher
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
            Select a target AI career path to generate an adaptive curriculum roadmap:
          </p>

          <div className="flex gap-2 mb-5">
            {ROADMAPS.map((rm) => (
              <button
                key={rm.role}
                onClick={() => setSelectedRole(rm)}
                className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                  selectedRole.role === rm.role
                    ? "bg-[#6366f1]/20 border-[#6366f1] text-white shadow-md"
                    : "bg-[#08080f] border-white/10 text-[#9aa0b8] hover:border-white/30"
                }`}
              >
                {rm.role}
              </button>
            ))}
          </div>

          <div className="bg-[#08080f] border border-[#6366f1]/30 rounded-xl p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <div>
                <div className="text-sm font-bold text-white">{selectedRole.role} Roadmap</div>
                <div className="text-xs text-[#93c5fd] font-mono mt-0.5">Duration: {selectedRole.duration}</div>
              </div>
              <span className="text-xs font-mono font-bold text-[#c7d2fe]">Target: {selectedRole.salary}</span>
            </div>

            <div className="space-y-2">
              {selectedRole.modules.map((m, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2.5 rounded-lg bg-[#0d0d16] border border-white/5 text-xs text-white/90">
                  <span className="w-5 h-5 rounded-full bg-[#6366f1]/20 border border-[#6366f1]/40 text-[#93c5fd] flex items-center justify-center font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 3: Placement Matcher */}
      {activeTab === "placement" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-xs md:text-sm text-[#9aa0b8] mb-4">
            Semantic placement & hiring partner score card:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-[#08080f] border border-white/10">
              <div className="text-xs font-bold text-white mb-1">Capermint Technology</div>
              <div className="text-xs text-[#93c5fd] font-mono mb-2">Role: AI-ML Gaming Engineer</div>
              <div className="text-[11px] text-[#9aa0b8]">Match Score: <strong className="text-[#6366f1]">94% Match</strong> (Python, OpenCV, Reinforcement AI)</div>
            </div>
            <div className="p-4 rounded-xl bg-[#08080f] border border-white/10">
              <div className="text-xs font-bold text-white mb-1">Elite Workforces Services</div>
              <div className="text-xs text-[#93c5fd] font-mono mb-2">Role: AI Automation Engineer</div>
              <div className="text-[11px] text-[#9aa0b8]">Match Score: <strong className="text-[#6366f1]">91% Match</strong> (n8n, LangChain, FastAPI)</div>
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

