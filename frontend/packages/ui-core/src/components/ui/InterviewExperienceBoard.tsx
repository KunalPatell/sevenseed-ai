"use client";

import React, { useEffect, useState } from "react";
import { MessageSquareQuote, Search, Send, Building2, Star } from "lucide-react";

type Experience = {
  id: string;
  company: string;
  role: string;
  difficulty: number;
  outcome: "Offer" | "Rejected" | "Ghosted" | "In Process";
  rounds: number;
  takeaway: string;
  date: string;
};

const SEED: Experience[] = [
  { id: "s1", company: "Google DeepMind", role: "Staff AI Engineer", difficulty: 5, outcome: "Offer", rounds: 6, takeaway: "Deep dive on distributed training + a live LangGraph agent design round. Know your checkpointing tradeoffs cold.", date: "2026-08-02" },
  { id: "s2", company: "Sevenseed AI Labs", role: "Autonomous Agent Architect", difficulty: 4, outcome: "Offer", rounds: 4, takeaway: "Whiteboard a multi-agent consensus protocol. They care more about failure handling than the happy path.", date: "2026-07-18" },
  { id: "s3", company: "Razorpay", role: "Senior Full-Stack Engineer", difficulty: 3, outcome: "Rejected", rounds: 5, takeaway: "Strong on system design, tripped on a Postgres locking question. Bar is high on payments correctness.", date: "2026-06-30" },
  { id: "s4", company: "Scale AI", role: "Autonomous Agent Architect", difficulty: 4, outcome: "Ghosted", rounds: 3, takeaway: "Take-home eval was 8 hours of real work — worth it for the feedback alone, but they never replied after.", date: "2026-06-11" },
];

const STORAGE_KEY = "comonk_interview_experiences";

export function InterviewExperienceBoard() {
  const [experiences, setExperiences] = useState<Experience[]>(SEED);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ company: "", role: "", difficulty: 3, outcome: "Offer" as Experience["outcome"], rounds: 3, takeaway: "" });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setExperiences([...(JSON.parse(saved) as Experience[]), ...SEED]);
    } catch {
      // ignore corrupted storage
    }
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company.trim() || !form.role.trim() || !form.takeaway.trim()) return;
    const entry: Experience = { id: `u-${Date.now()}`, date: new Date().toISOString().slice(0, 10), ...form };
    const updated = [entry, ...experiences];
    setExperiences(updated);
    try {
      const userPosts = updated.filter((e) => e.id.startsWith("u-"));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userPosts));
    } catch {
      // localStorage unavailable — post still shows for this session
    }
    setForm({ company: "", role: "", difficulty: 3, outcome: "Offer", rounds: 3, takeaway: "" });
    setShowForm(false);
  };

  const filtered = experiences.filter(
    (e) => e.company.toLowerCase().includes(query.toLowerCase()) || e.role.toLowerCase().includes(query.toLowerCase())
  );

  const outcomeColor: Record<Experience["outcome"], string> = {
    Offer: "text-emerald-400 bg-emerald-950/80 border-emerald-800/60",
    Rejected: "text-rose-400 bg-rose-950/80 border-rose-800/60",
    Ghosted: "text-slate-400 bg-slate-900 border-slate-700",
    "In Process": "text-amber-400 bg-amber-950/80 border-amber-800/60",
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl border border-purple-900/40 bg-purple-950/20 backdrop-blur-xl overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-purple-900/40">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
          <MessageSquareQuote className="w-4 h-4 text-fuchsia-400" />
          <span>Interview Experience Board</span>
          <span className="text-[10px] font-mono text-slate-500">({experiences.length} shared)</span>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="text-xs font-bold px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-fuchsia-500 text-black hover:opacity-90 transition-opacity"
        >
          {showForm ? "Cancel" : "Share Your Experience"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="p-6 space-y-3 border-b border-purple-900/40 bg-purple-950/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              placeholder="Company (e.g. Anthropic)"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl bg-[#080214] border border-purple-900/50 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
              required
            />
            <input
              placeholder="Role (e.g. ML Infra Engineer)"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl bg-[#080214] border border-purple-900/50 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <select
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: Number(e.target.value) })}
              className="px-3 py-2.5 rounded-xl bg-[#080214] border border-purple-900/50 text-xs text-white focus:outline-none"
            >
              {[1, 2, 3, 4, 5].map((d) => (
                <option key={d} value={d}>{"★".repeat(d)} difficulty</option>
              ))}
            </select>
            <select
              value={form.outcome}
              onChange={(e) => setForm({ ...form, outcome: e.target.value as Experience["outcome"] })}
              className="px-3 py-2.5 rounded-xl bg-[#080214] border border-purple-900/50 text-xs text-white focus:outline-none"
            >
              <option>Offer</option>
              <option>Rejected</option>
              <option>Ghosted</option>
              <option>In Process</option>
            </select>
            <input
              type="number"
              min={1}
              max={12}
              value={form.rounds}
              onChange={(e) => setForm({ ...form, rounds: Number(e.target.value) })}
              className="px-3 py-2.5 rounded-xl bg-[#080214] border border-purple-900/50 text-xs text-white focus:outline-none"
              placeholder="Rounds"
            />
          </div>
          <textarea
            placeholder="What should the next candidate know? (question types, pace, red flags...)"
            value={form.takeaway}
            onChange={(e) => setForm({ ...form, takeaway: e.target.value })}
            rows={2}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#080214] border border-purple-900/50 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 resize-none"
            required
          />
          <button type="submit" className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-fuchsia-500 text-black hover:opacity-90 transition-opacity">
            <Send className="w-3.5 h-3.5" /> Post Anonymously
          </button>
        </form>
      )}

      <div className="p-4 border-b border-purple-900/40">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by company or role..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#080214] border border-purple-900/50 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
          />
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto divide-y divide-purple-900/30">
        {filtered.length === 0 && (
          <div className="p-6 text-center text-xs text-slate-500">No experiences match &quot;{query}&quot; yet.</div>
        )}
        {filtered.map((e) => (
          <div key={e.id} className="p-5 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
                <Building2 className="w-3.5 h-3.5 text-purple-400" />
                <span>{e.company}</span>
                <span className="text-slate-500 font-normal">· {e.role}</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${outcomeColor[e.outcome]}`}>{e.outcome}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{e.takeaway}</p>
            <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500">
              <span className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: e.difficulty }).map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400" />)}
              </span>
              <span>{e.rounds} rounds</span>
              <span>{e.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
