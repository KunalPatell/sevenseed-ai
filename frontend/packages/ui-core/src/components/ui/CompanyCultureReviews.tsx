"use client";

import React, { useState } from "react";
import { Building2, Star, TrendingUp, Users, Scale } from "lucide-react";

type CompanyReview = {
  company: string;
  compRating: number;
  wlbRating: number;
  growthRating: number;
  reviewCount: number;
  summary: string;
};

const COMPANIES: CompanyReview[] = [
  { company: "Sevenseed AI Labs", compRating: 4.6, wlbRating: 4.2, growthRating: 4.8, reviewCount: 142, summary: "Fast-moving, high-ownership culture. Comp is top-tier for the stage; expect ambiguity." },
  { company: "Razorpay", compRating: 4.3, wlbRating: 3.6, growthRating: 4.0, reviewCount: 891, summary: "Strong payments domain learning, but on-call load is heavy during peak season." },
  { company: "Scale AI", compRating: 4.7, wlbRating: 3.2, growthRating: 4.5, reviewCount: 356, summary: "Elite comp and pedigree, intense pace — not for people who want strict 9-to-5 hours." },
  { company: "Google DeepMind", compRating: 4.8, wlbRating: 4.4, growthRating: 4.9, reviewCount: 2104, summary: "Best-in-class research environment; internal mobility between teams takes patience." },
];

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden w-full">
      <div className="h-full rounded-full" style={{ width: `${(value / 5) * 100}%`, backgroundColor: color }} />
    </div>
  );
}

export function CompanyCultureReviews() {
  const [selected, setSelected] = useState(COMPANIES[0].company);
  const active = COMPANIES.find((c) => c.company === selected) ?? COMPANIES[0];

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl border border-purple-900/40 bg-purple-950/20 backdrop-blur-xl overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-purple-900/40 text-sm font-bold text-slate-100">
        <Building2 className="w-4 h-4 text-fuchsia-400" />
        <span>Company Culture &amp; Compensation Ratings</span>
        <span className="text-[10px] font-mono text-slate-500">(glassdoor-style)</span>
      </div>

      <div className="flex flex-wrap gap-2 p-4 border-b border-purple-900/40">
        {COMPANIES.map((c) => (
          <button
            key={c.company}
            onClick={() => setSelected(c.company)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              selected === c.company ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-black font-bold" : "bg-purple-950/60 text-slate-400 border border-purple-900/40 hover:text-white"
            }`}
          >
            {c.company}
          </button>
        ))}
      </div>

      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-100">{active.company}</h3>
          <span className="text-[11px] font-mono text-slate-500">{active.reviewCount} reviews</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-300"><Star className="w-3.5 h-3.5 text-amber-400" /> Compensation</span>
              <span className="font-mono text-slate-200">{active.compRating}/5</span>
            </div>
            <Bar value={active.compRating} color="#f59e0b" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-300"><Scale className="w-3.5 h-3.5 text-sky-400" /> Work-Life Balance</span>
              <span className="font-mono text-slate-200">{active.wlbRating}/5</span>
            </div>
            <Bar value={active.wlbRating} color="#38bdf8" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-300"><TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Career Growth</span>
              <span className="font-mono text-slate-200">{active.growthRating}/5</span>
            </div>
            <Bar value={active.growthRating} color="#34d399" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#080214] border border-purple-900/50 flex items-start gap-2.5">
          <Users className="w-4 h-4 text-fuchsia-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300 leading-relaxed">{active.summary}</p>
        </div>
      </div>
    </div>
  );
}
