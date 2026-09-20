"use client";

import React, { useState } from "react";
import { Bot, Zap, Check, Loader2, Store } from "lucide-react";

type AgentTemplate = {
  id: string;
  name: string;
  category: "Marketing" | "Sales" | "Support" | "Recruiting" | "Finance";
  desc: string;
  integrations: string[];
};

const TEMPLATES: AgentTemplate[] = [
  { id: "t1", name: "Maya · SEO Content Agent", category: "Marketing", desc: "Drafts and schedules SEO-optimized blog posts, then tracks keyword rank movement weekly.", integrations: ["WordPress", "Ahrefs", "Slack"] },
  { id: "t2", name: "Lead Qualifier Bot", category: "Sales", desc: "Scores inbound leads against your ICP and auto-drafts a personalized first-touch email.", integrations: ["HubSpot", "Gmail", "Groq"] },
  { id: "t3", name: "Tier-1 Support Triage", category: "Support", desc: "Classifies incoming tickets, resolves FAQs instantly, escalates the rest with full context.", integrations: ["Zendesk", "ChromaDB", "Slack"] },
  { id: "t4", name: "RecruitAI Screener", category: "Recruiting", desc: "Screens resumes against a role rubric and schedules first-round interviews automatically.", integrations: ["Greenhouse", "Google Calendar"] },
  { id: "t5", name: "Invoice Reconciliation Agent", category: "Finance", desc: "Matches incoming invoices against POs and flags discrepancies over your threshold.", integrations: ["QuickBooks", "Slack"] },
  { id: "t6", name: "Sales Call Summarizer", category: "Sales", desc: "Transcribes sales calls, extracts action items, and pushes them straight into your CRM.", integrations: ["Zoom", "Salesforce"] },
];

const CATEGORIES = ["All", "Marketing", "Sales", "Support", "Recruiting", "Finance"] as const;

export function AgentTemplateMarketplace() {
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>("All");
  const [deploying, setDeploying] = useState<string | null>(null);
  const [deployed, setDeployed] = useState<Set<string>>(new Set());

  const deploy = (id: string) => {
    setDeploying(id);
    setTimeout(() => {
      setDeployed((prev) => new Set(prev).add(id));
      setDeploying(null);
    }, 1200);
  };

  const visible = filter === "All" ? TEMPLATES : TEMPLATES.filter((t) => t.category === filter);

  return (
    <div className="w-full max-w-5xl mx-auto rounded-2xl border border-amber-900/40 bg-amber-950/10 backdrop-blur-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-amber-900/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
          <Store className="w-4 h-4 text-amber-400" />
          <span>AI Agent Template Marketplace</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-3 py-1 rounded-lg text-[11px] font-mono transition-all ${
                filter === c ? "bg-amber-500 text-black font-bold" : "bg-amber-950/60 text-slate-400 border border-amber-900/40 hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
        {visible.map((t) => {
          const isDeployed = deployed.has(t.id);
          const isDeploying = deploying === t.id;
          return (
            <div key={t.id} className="p-5 rounded-xl bg-amber-950/20 border border-amber-900/30 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300">{t.category}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-100">{t.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{t.desc}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {t.integrations.map((i) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">{i}</span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => deploy(t.id)}
                disabled={isDeploying || isDeployed}
                className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  isDeployed
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-default"
                    : "bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:opacity-90"
                }`}
              >
                {isDeploying ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Deploying agent…</>
                ) : isDeployed ? (
                  <><Check className="w-3.5 h-3.5" /> Deployed to your workspace</>
                ) : (
                  <><Zap className="w-3.5 h-3.5" /> Deploy Agent</>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
