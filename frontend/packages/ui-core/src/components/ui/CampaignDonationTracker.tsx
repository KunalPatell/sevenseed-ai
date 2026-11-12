"use client";

import React, { useState } from "react";
import { HeartHandshake, IndianRupee, Users, Flame } from "lucide-react";

type Campaign = {
  id: string;
  title: string;
  category: "Medical" | "Education" | "Disaster Relief" | "Community";
  goal: number;
  raised: number;
  donors: number;
  urgent: boolean;
};

const SEED: Campaign[] = [
  { id: "c1", title: "Emergency Dialysis Fund — Rekha Ben", category: "Medical", goal: 350000, raised: 268400, donors: 412, urgent: true },
  { id: "c2", title: "School Kits for 200 Flood-Affected Kids", category: "Disaster Relief", goal: 200000, raised: 200000, donors: 587, urgent: false },
  { id: "c3", title: "Scholarship Fund — First-Gen Engineering Students", category: "Education", goal: 500000, raised: 189200, donors: 231, urgent: false },
  { id: "c4", title: "Mobile Health Camp — Rural Kutch", category: "Community", goal: 120000, raised: 96500, donors: 164, urgent: true },
];

export function CampaignDonationTracker() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(SEED);
  const [amount, setAmount] = useState<Record<string, string>>({});

  const donate = (id: string) => {
    const value = Number(amount[id]);
    if (!value || value <= 0) return;
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, raised: Math.min(c.goal, c.raised + value), donors: c.donors + 1 } : c))
    );
    setAmount((prev) => ({ ...prev, [id]: "" }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-100 px-1">
        <HeartHandshake className="w-4 h-4 text-amber-400" />
        <span>Live Fundraising Campaigns</span>
        <span className="text-[10px] font-mono text-slate-500">(ketto/milaap-style, 100% goes to the cause — no platform fee)</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {campaigns.map((c) => {
          const pct = Math.min(100, Math.round((c.raised / c.goal) * 100));
          const complete = pct >= 100;
          return (
            <div key={c.id} className="p-5 rounded-2xl bg-emerald-950/10 border border-emerald-900/30 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-amber-800 text-amber-300">{c.category}</span>
                  <h3 className="text-sm font-bold text-slate-100 mt-1.5 leading-snug">{c.title}</h3>
                </div>
                {c.urgent && !complete && (
                  <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-1">
                    <Flame className="w-3 h-3" /> Urgent
                  </span>
                )}
              </div>

              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${complete ? "bg-emerald-400" : "bg-gradient-to-r from-amber-500 to-emerald-400"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-200 font-bold flex items-center gap-0.5"><IndianRupee className="w-3 h-3" />{c.raised.toLocaleString("en-IN")} <span className="text-slate-500 font-normal">/ ₹{c.goal.toLocaleString("en-IN")}</span></span>
                <span className="text-slate-400 flex items-center gap-1"><Users className="w-3 h-3" /> {c.donors} donors</span>
              </div>

              {complete ? (
                <div className="text-center text-xs font-bold text-emerald-400 py-2">🎉 Goal Reached — thank you!</div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={1}
                    placeholder="₹ amount"
                    value={amount[c.id] ?? ""}
                    onChange={(e) => setAmount((prev) => ({ ...prev, [c.id]: e.target.value }))}
                    className="flex-1 px-3 py-2 rounded-lg bg-[#1a1204] border border-emerald-900/50 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={() => donate(c.id)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-emerald-400 text-black text-xs font-bold hover:opacity-90 transition-opacity"
                  >
                    Donate
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
