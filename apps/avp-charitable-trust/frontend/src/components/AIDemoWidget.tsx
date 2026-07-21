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
  const [activeTab, setActiveTab] = useState<"impact" | "donor" | "scholarship">("impact");

  // Donor State
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  // Scholarship State
  const [selectedGrant, setSelectedGrant] = useState(SCHOLARSHIPS[0]);

  // Impact Slider State
  const [donationAmount, setDonationAmount] = useState(5000);

  const studentsEducated = Math.floor(donationAmount / 1500);
  const medicalKits = Math.floor(donationAmount / 500);
  const mealsServed = Math.floor(donationAmount / 50);
  const taxSavings = Math.round(donationAmount * 0.5 * 0.3);

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
    <div className="relative overflow-hidden bg-[#10070a] border border-[#f43f5e]/30 rounded-3xl p-6 md:p-10 mt-10 shadow-[0_0_50px_rgba(244,63,94,0.15)]">
      {/* Ambient Rose Gold Mesh Glows */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#f43f5e]/15 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#f59e0b]/15 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Live Enterprise Performance Stats Bar */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-black/40 border border-white/10 rounded-2xl mb-8 backdrop-blur-xl">
        <div className="flex items-center gap-2.5 px-3 border-r border-white/10">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
          <div>
            <div className="text-[10px] uppercase font-mono text-[#999]">Engine Status</div>
            <div className="text-xs font-bold text-white font-mono">100% Free Welfare AI</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-3 border-r border-white/10">
          <span className="text-xs">⚡</span>
          <div>
            <div className="text-[10px] uppercase font-mono text-[#999]">Response Speed</div>
            <div className="text-xs font-bold text-[#fef3c7] font-mono">14ms Latency</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-3 border-r border-white/10">
          <span className="text-xs">📜</span>
          <div>
            <div className="text-[10px] uppercase font-mono text-[#999]">Tax Status</div>
            <div className="text-xs font-bold text-white font-mono">80G Tax Exempted</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-3">
          <span className="text-xs">❤️</span>
          <div>
            <div className="text-[10px] uppercase font-mono text-[#999]">Lives Impacted</div>
            <div className="text-xs font-bold text-[#6ee7b7] font-mono">12,000+ Helped</div>
          </div>
        </div>
      </div>

      {/* Header & Glass Tabs */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Heart className="h-4 w-4 text-[#f43f5e]" />
            <span className="text-xs font-bold tracking-wider text-[#fef3c7] uppercase">100% Free Social Impact Platform</span>
          </div>
          <h4 className="text-2xl font-black text-white tracking-tight">Transparent Welfare & Donor Intelligence</h4>
        </div>

        <div className="flex gap-2 p-1.5 bg-black/60 rounded-2xl border border-white/10 backdrop-blur-xl">
          <button
            onClick={() => setActiveTab("impact")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-300 ${
              activeTab === "impact" ? "bg-[#f43f5e] text-white shadow-[0_0_20px_rgba(244,63,94,0.5)] scale-[1.02]" : "text-[#c8bdc0] hover:text-white"
            }`}
          >
            <PieChart className="h-3.5 w-3.5" /> Impact & 80G Tax Saver
          </button>
          <button
            onClick={() => setActiveTab("donor")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-300 ${
              activeTab === "donor" ? "bg-[#f43f5e] text-white shadow-[0_0_20px_rgba(244,63,94,0.5)] scale-[1.02]" : "text-[#c8bdc0] hover:text-white"
            }`}
          >
            <Bot className="h-3.5 w-3.5" /> AI Donor Bot
          </button>
          <button
            onClick={() => setActiveTab("scholarship")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-300 ${
              activeTab === "scholarship" ? "bg-[#f43f5e] text-white shadow-[0_0_20px_rgba(244,63,94,0.5)] scale-[1.02]" : "text-[#c8bdc0] hover:text-white"
            }`}
          >
            <HandHeart className="h-3.5 w-3.5" /> Scholarship Matcher
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

      {/* Tab 3: Interactive Impact Slider & 80G Receipt Preview */}
      {activeTab === "impact" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-xs md:text-sm text-[#c8bdc0] mb-4">
            Drag the slider to see your contribution&apos;s real-world tangible impact & 80G tax savings:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0a0507] border border-[#f43f5e]/30 rounded-2xl p-5 md:p-6 shadow-xl">
            {/* Left: Donation Amount Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono text-white mb-2">
                <span>Contribution Amount:</span>
                <span className="text-[#f43f5e] font-extrabold text-base">₹{donationAmount.toLocaleString("en-IN")}</span>
              </div>
              <input
                type="range"
                min={500}
                max={50000}
                step={500}
                value={donationAmount}
                onChange={(e) => setDonationAmount(Number(e.target.value))}
                className="w-full accent-[#f43f5e] cursor-pointer mb-5"
              />

              <div className="space-y-2 text-xs">
                <span className="text-[#fef3c7] font-bold block mb-1">🎁 Your Tangible Impact:</span>
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                  <span className="text-[#c8bdc0]">🎓 Rural Students Educated:</span>
                  <span className="font-bold text-white font-mono">{studentsEducated} Students (1 Year)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                  <span className="text-[#c8bdc0]">🩺 Free Medical Kits Delivered:</span>
                  <span className="font-bold text-white font-mono">{medicalKits} Emergency Kits</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                  <span className="text-[#c8bdc0]">🍲 Nutritious Meals Provided:</span>
                  <span className="font-bold text-white font-mono">{mealsServed} Meals</span>
                </div>
              </div>
            </div>

            {/* Right: Instant 80G Tax Exemption Certificate Card */}
            <div className="flex flex-col justify-between">
              <div className="p-4 rounded-xl bg-[#14080b] border border-[#f43f5e]/40 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[10px] font-mono text-[#f43f5e] font-bold uppercase tracking-wider">
                    80G CERTIFICATE PREVIEW
                  </span>
                  <span className="text-[9px] bg-[#6ee7b7]/20 text-[#6ee7b7] px-2 py-0.5 rounded font-bold">
                    Govt Recognized NGO
                  </span>
                </div>

                <div className="text-white font-bold text-sm">AVP Charitable Trust (80G Exemption)</div>
                <p className="text-[11px] text-[#c8bdc0] leading-relaxed">
                  Under Section 80G of Income Tax Act, 50% of your donation (<strong>₹{(donationAmount * 0.5).toLocaleString("en-IN")}</strong>) is directly tax-deductible from taxable income.
                </p>

                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[11px] font-mono text-[#fef3c7]">
                  <span>Estimated Tax Saved:</span>
                  <span className="font-bold text-[#6ee7b7]">₹{taxSavings.toLocaleString("en-IN")} (at 30% slab)</span>
                </div>
              </div>
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

