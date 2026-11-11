"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Building2, Plus, Trash2, ExternalLink, Trophy } from "lucide-react";

// Offer & company scorecard. Sevenseed has no review database, so instead of showing
// ratings for companies it lets the job seeker score the companies they are weighing,
// with their own priorities, and links to real employee-review sites.

const CRITERIA = [
  { key: "pay", label: "Pay & benefits" },
  { key: "growth", label: "Learning & growth" },
  { key: "balance", label: "Work-life balance" },
  { key: "manager", label: "Manager & team" },
  { key: "stability", label: "Job stability" },
  { key: "commute", label: "Location / remote" },
] as const;
type Key = (typeof CRITERIA)[number]["key"];
type Company = { name: string; scores: Record<Key, number> };

const blank = (name = ""): Company => ({ name, scores: { pay: 3, growth: 3, balance: 3, manager: 3, stability: 3, commute: 3 } });
const KEY = "ss-comonk-company-scorecard";
const REVIEW_SITES = [
  ["AmbitionBox", (q: string) => `https://www.ambitionbox.com/search?CompanySearch%5Bname%5D=${encodeURIComponent(q)}`],
  ["Glassdoor", (q: string) => `https://www.glassdoor.co.in/Search/results.htm?keyword=${encodeURIComponent(q)}`],
  ["LinkedIn", (q: string) => `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(q)}`],
] as const;

export function CompanyCultureReviews() {
  const [weights, setWeights] = useState<Record<Key, number>>({ pay: 3, growth: 3, balance: 3, manager: 3, stability: 2, commute: 2 });
  const [companies, setCompanies] = useState<Company[]>([blank("Company A"), blank("Company B")]);

  useEffect(() => { try { const v = JSON.parse(localStorage.getItem(KEY) || "null"); if (v?.companies) { setCompanies(v.companies); setWeights(v.weights); } } catch { /* ignore */ } }, []);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify({ companies, weights })); } catch { /* ignore */ } }, [companies, weights]);

  const totals = useMemo(() => {
    const wsum = CRITERIA.reduce((a, c) => a + weights[c.key], 0) || 1;
    return companies.map((co) => Math.round((CRITERIA.reduce((a, c) => a + co.scores[c.key] * weights[c.key], 0) / (wsum * 5)) * 100));
  }, [companies, weights]);
  const best = totals.length ? totals.indexOf(Math.max(...totals)) : -1;
  const setScore = (i: number, k: Key, v: number) => setCompanies((cs) => cs.map((c, j) => (j === i ? { ...c, scores: { ...c.scores, [k]: v } } : c)));

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="rounded-2xl border border-purple-900/40 bg-purple-950/20 p-5 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2"><Building2 className="w-6 h-6 text-fuchsia-400" /> Company & Offer Scorecard</h1>
        <p className="mt-2 text-sm text-slate-300 max-w-2xl">Deciding between offers? Set what matters most to you, rate each company from what you've learned in interviews and reviews, and see which one fits you best. Saved on this device.</p>
      </div>

      <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 sm:p-6">
        <h2 className="text-lg font-bold text-white">1. How much does each thing matter to you?</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CRITERIA.map((c) => (
            <label key={c.key} className="text-sm text-slate-300">
              <span className="flex justify-between">{c.label}<span className="font-mono text-fuchsia-300">{["Not at all", "A little", "Somewhat", "A lot", "Most"][weights[c.key]]}</span></span>
              <input type="range" min={0} max={4} value={weights[c.key]} onChange={(e) => setWeights((w) => ({ ...w, [c.key]: +e.target.value }))} className="w-full accent-fuchsia-500" />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-white">2. Rate each company (1–5)</h2>
          <button type="button" disabled={companies.length >= 5} onClick={() => setCompanies((cs) => [...cs, blank(`Company ${String.fromCharCode(65 + cs.length)}`)])} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 text-sm text-slate-200 hover:border-fuchsia-500 disabled:opacity-40"><Plus className="w-4 h-4" /> Add company</button>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {companies.map((co, i) => (
            <div key={i} className={`p-4 rounded-xl border ${i === best ? "border-emerald-500/60 bg-emerald-950/20" : "border-slate-800 bg-slate-900/50"}`}>
              <div className="flex gap-2 items-center">
                <input aria-label={`Company ${i + 1} name`} value={co.name} onChange={(e) => setCompanies((cs) => cs.map((c, j) => (j === i ? { ...c, name: e.target.value } : c)))} className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-semibold focus:outline-none focus:border-fuchsia-500" />
                {companies.length > 1 && <button type="button" aria-label={`Remove ${co.name}`} onClick={() => setCompanies((cs) => cs.filter((_, j) => j !== i))} className="p-2 text-slate-500 hover:text-rose-300"><Trash2 className="w-4 h-4" /></button>}
              </div>
              <div className="mt-3 space-y-2">
                {CRITERIA.map((c) => (
                  <div key={c.key} className="flex items-center justify-between gap-2 text-sm">
                    <span className="text-slate-300">{c.label}</span>
                    <div className="flex gap-1" role="radiogroup" aria-label={`${c.label} at ${co.name}`}>
                      {[1, 2, 3, 4, 5].map((v) => (
                        <button key={v} type="button" role="radio" aria-checked={co.scores[c.key] === v} onClick={() => setScore(i, c.key, v)}
                          className={`w-8 h-8 rounded-md text-xs font-bold ${co.scores[c.key] >= v ? "bg-fuchsia-500 text-black" : "bg-slate-800 text-slate-400"}`}>{v}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-slate-300">Fit score</span>
                <span className="text-2xl font-black font-mono text-white">{totals[i]}<span className="text-sm text-slate-400">/100</span></span>
              </div>
              {co.name.trim() && (
                <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                  <span className="text-slate-400 self-center">Read real reviews:</span>
                  {REVIEW_SITES.map(([site, url]) => (
                    <a key={site} href={url(co.name.trim())} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2 py-1 rounded border border-slate-700 text-slate-200 hover:border-fuchsia-500">{site} <ExternalLink className="w-3 h-3" /></a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        {best >= 0 && companies.length > 1 && (
          <p className="mt-4 text-slate-200 flex items-center gap-2" aria-live="polite"><Trophy className="w-4 h-4 text-emerald-400" /> Best fit for your priorities: <b>{companies[best].name || `Company ${best + 1}`}</b> ({totals[best]}/100).</p>
        )}
      </section>
    </div>
  );
}
