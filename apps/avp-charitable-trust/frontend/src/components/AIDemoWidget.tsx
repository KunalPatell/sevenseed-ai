"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Sparkles, ArrowRight, Bot, Heart, HandHeart, PieChart } from "lucide-react";

const EXAMPLES = [
  "How does the Trust choose which communities to help?",
  "What happens to my donation after I give?",
  "Am I eligible for an 80G tax receipt?",
];

const SCHOLARSHIPS = [
  {
    name: "AVP Merit-Cum-Means Higher Education Grant",
    grant: "₹50,000 / year",
    eligibility: "Students pursuing B.Tech / MSc AI with annual family income < ₹3 Lakhs.",
    match: "98% Match"
  },
  {
    name: "Rural Digital Skills & Device Subsidy",
    grant: "Free Laptop + WiFi Pass",
    eligibility: "Rural Gujarat students in Class 10-12 with > 75% score.",
    match: "95% Match"
  }
];

function renderReply(text: string) {
  return text.split("\n").map((line, i) => (
    <p key={i} className={line.trim() ? "mb-1.5" : "h-2"}>
      {line.split(/\*\*(.+?)\*\*/g).map((part, j) =>
        j % 2 === 1 ? (
          <strong key={j} className="text-[#ffe4e6]">
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
  const [activeTab, setActiveTab] = useState<"donor" | "scholarship" | "impact">("donor");

  // Donor State
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  // Scholarship State
  const [selectedGrant, setSelectedGrant] = useState(SCHOLARSHIPS[0]);

  async function runDemo(e?: React.FormEvent) {
    e?.preventDefault();
    if (!question.trim() || loading) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/trust/api/donor/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.slice(0, 400) }),
      });
      if (res.status === 429) {
        const data = await res.json().catch(() => null);
        setError(data?.detail || "This assistant is popular right now — please try again in a moment.");
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
      setError("Couldn't reach the assistant right now. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glow-card bg-gradient-to-br from-[#180b0f] to-[#10080a] border border-[#f43f5e]/25 rounded-2xl p-6 md:p-8 shadow-2xl">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Heart className="h-4 w-4 text-[#f43f5e]" />
            <span className="text-xs font-bold tracking-wider text-[#fef3c7] uppercase">100% Free Social Impact Platform</span>
          </div>
          <h4 className="text-xl font-extrabold text-white">Transparent Welfare & Donor Intelligence</h4>
        </div>

        <div className="flex gap-2 p-1 bg-[#0a0507] rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab("donor")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "donor" ? "bg-[#f43f5e] text-white shadow-md" : "text-[#c8bdc0] hover:text-white"
            }`}
          >
            <Bot className="h-3.5 w-3.5" /> AI Donor Bot
          </button>
          <button
            onClick={() => setActiveTab("scholarship")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "scholarship" ? "bg-[#f43f5e] text-white shadow-md" : "text-[#c8bdc0] hover:text-white"
            }`}
          >
            <HandHeart className="h-3.5 w-3.5" /> Scholarship Matcher
          </button>
          <button
            onClick={() => setActiveTab("impact")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "impact" ? "bg-[#f43f5e] text-white shadow-md" : "text-[#c8bdc0] hover:text-white"
            }`}
          >
            <PieChart className="h-3.5 w-3.5" /> Impact Tracker
          </button>
        </div>
      </div>

      {/* Tab 1: AI Donor Bot */}
      {activeTab === "donor" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-xs md:text-sm text-[#c8bdc0] mb-5">
            Ask general questions about our non-profit welfare programs, 80G tax exemptions, and fund distribution:
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            {EXAMPLES.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuestion(q)}
                className="text-[11px] px-3 py-1.5 rounded-full border border-white/10 text-[#c8bdc0] hover:text-white hover:border-[#f43f5e]/50 hover:bg-[#f43f5e]/10 transition-all"
              >
                &ldquo;{q}&rdquo;
              </button>
            ))}
          </div>

          <form onSubmit={runDemo} className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about donations, programs, or 80G tax receipts..."
              maxLength={400}
              required
              className="flex-1 w-full px-4 py-3 bg-[#10080a] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#f43f5e]"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="btn w-full sm:w-fit px-6 py-3 rounded-lg bg-gradient-to-r from-[#f43f5e] to-[#f59e0b] text-white font-semibold text-sm hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center gap-2 justify-center shrink-0"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ask AI"}
            </button>
          </form>

          {error && <p className="text-xs text-[#fca5a5] font-medium mt-4 text-center">{error}</p>}

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-[#10080a] border border-[#f43f5e]/25 rounded-xl p-5"
              >
                <div className="text-[10px] font-bold tracking-wider text-[#fef3c7] uppercase mb-3">AI Response</div>
                <div className="text-sm text-[#faf5f6] leading-relaxed">{renderReply(result)}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Tab 2: Scholarship Matcher */}
      {activeTab === "scholarship" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-xs md:text-sm text-[#c8bdc0] mb-4">
            AI-matched welfare scholarships & community support programs:
          </p>

          <div className="flex gap-2 mb-5">
            {SCHOLARSHIPS.map((sc) => (
              <button
                key={sc.name}
                onClick={() => setSelectedGrant(sc)}
                className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                  selectedGrant.name === sc.name
                    ? "bg-[#f43f5e]/20 border-[#f43f5e] text-white shadow-md"
                    : "bg-[#0a0507] border-white/10 text-[#c8bdc0] hover:border-white/30"
                }`}
              >
                {sc.name}
              </button>
            ))}
          </div>

          <div className="bg-[#0a0507] border border-[#f43f5e]/30 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <div className="text-sm font-bold text-white">{selectedGrant.name}</div>
                <div className="text-xs text-[#fef3c7] font-mono mt-0.5">Grant: {selectedGrant.grant}</div>
              </div>
              <span className="px-2.5 py-1 rounded bg-[#f43f5e]/20 text-[#f43f5e] font-mono font-bold text-xs">{selectedGrant.match}</span>
            </div>
            <p className="text-xs text-[#c8bdc0]"><strong className="text-white">Eligibility Criteria:</strong> {selectedGrant.eligibility}</p>
          </div>
        </motion.div>
      )}

      {/* Tab 3: Impact Tracker */}
      {activeTab === "impact" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-xs md:text-sm text-[#c8bdc0] mb-4">
            Transparent breakdown of fund utilization (Audited AI Anomaly Detection):
          </p>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-[#0a0507] border border-white/10 text-center">
              <div className="text-xl font-extrabold text-[#f43f5e]">85%</div>
              <div className="text-[10px] text-[#c8bdc0] font-mono uppercase mt-1">Direct Student Grants</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0a0507] border border-white/10 text-center">
              <div className="text-xl font-extrabold text-[#f59e0b]">10%</div>
              <div className="text-[10px] text-[#c8bdc0] font-mono uppercase mt-1">Healthcare Clinics</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0a0507] border border-white/10 text-center">
              <div className="text-xl font-extrabold text-[#6ee7b7]">5%</div>
              <div className="text-[10px] text-[#c8bdc0] font-mono uppercase mt-1">Audit & Ops</div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="mt-6 border-t border-white/10 pt-4 flex justify-between items-center">
        <span className="text-[11px] text-[#c8bdc0] italic">80G Tax Exempted Registered Trust</span>
        <a href="/app/" className="inline-flex items-center gap-1.5 text-xs text-[#fef3c7] font-semibold hover:underline">
          Open NGO Portal <ArrowRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

