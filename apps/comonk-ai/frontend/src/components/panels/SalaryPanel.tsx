"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  IndianRupee,
  Loader2,
  AlertCircle,
  Sparkles,
  Banknote,
  Globe2,
  Lightbulb,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { GlowCard } from "@/components/GlowCard";
import { api, authApi } from "@/lib/api";
import { Auth } from "@/lib/auth";

interface SalaryRange {
  min?: number;
  max?: number;
  typical?: number;
}

interface SalaryResult {
  salary_range?: SalaryRange;
  unit?: string;
  negotiation_tips?: string[];
  market_context?: string;
  skills_premium?: Record<string, string>;
  comparison?: Record<string, string>;
}

interface ExchangeRates {
  base?: string;
  usd?: number;
  eur?: number;
  gbp?: number;
  updated?: string;
  note?: string;
}

const NEGOTIATION_TIPS = [
  "Anchor near the top of your researched range. If market data shows ₹8–14L for the role, open at ₹13–14L — recruiters expect you to negotiate downward, not up, so opening at your true target leaves no room to move.",
  "Never give a number first. When asked for expectations, say: \"I'd like to understand the role's scope a bit more — what budget range has been approved for this position?\" This shifts the anchor onto them.",
  "Negotiate the whole package, not just base pay — joining bonus, variable/annual bonus %, ESOPs or RSUs, WFH allowance, and a learning/certification budget are all separately negotiable even when the base band is fixed.",
  "A single competing offer letter, even from a smaller company, is the strongest lever you have — bring it up only after you have it in writing, and let the recruiter ask for details rather than volunteering them upfront.",
  "Always ask for the offer in writing and take 24–48 hours before responding: \"This sounds great — let me review the full offer and get back to you by Friday.\" A rushed verbal acceptance gives up all remaining leverage.",
];

function formatINR(n?: number): string {
  if (typeof n !== "number") return "—";
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

function parseComparison(comparison: Record<string, string>, typical: number) {
  return Object.entries(comparison).map(([city, text]) => {
    let multiplier = 1;
    const m = text.match(/(\d+)(?:-(\d+))?%/);
    if (m) {
      const lo = parseInt(m[1], 10);
      const hi = m[2] ? parseInt(m[2], 10) : lo;
      const avg = (lo + hi) / 2;
      multiplier = text.toLowerCase().includes("lower") ? 1 - avg / 100 : 1 + avg / 100;
    }
    const label = city.charAt(0).toUpperCase() + city.slice(1);
    return { city: label, value: Math.round(typical * multiplier), note: text };
  });
}

function SalaryTooltip({ active, payload }: { active?: boolean; payload?: { payload: { city: string; value: number; note: string } }[] }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-white/10 bg-[#12121e] px-3 py-2 text-xs shadow-lg">
      <p className="font-bold text-[#eeeef8]">{d.city}</p>
      <p className="text-[#9090b0]">{formatINR(d.value)} · {d.note}</p>
    </div>
  );
}

export function SalaryPanel() {
  const user = Auth.user();
  const [role, setRole] = useState(user?.target_role || "Software Engineer");
  const [experienceLevel, setExperienceLevel] = useState("fresher");
  const [experienceYears, setExperienceYears] = useState(0);
  const [skillsInput, setSkillsInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SalaryResult | null>(null);

  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [ratesLoading, setRatesLoading] = useState(true);

  useEffect(() => {
    api("GET", "/api/exchange-rates")
      .then((res) => setRates(res))
      .catch(() => setRates(null))
      .finally(() => setRatesLoading(false));
  }, []);

  async function analyze() {
    if (!role.trim()) {
      setError("Enter a role first.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const skills = skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const res: SalaryResult = await authApi("POST", "/api/salary-insights", {
        role,
        experience_level: experienceLevel,
        experience_years: experienceYears,
        skills,
      });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch salary insights.");
    } finally {
      setLoading(false);
    }
  }

  const range = result?.salary_range;
  const min = range?.min ?? 0;
  const max = range?.max ?? 0;
  const typical = range?.typical ?? 0;
  const typicalPct = max > min ? ((typical - min) / (max - min)) * 100 : 50;

  const cityData = result?.comparison ? parseComparison(result.comparison, typical) : [];

  return (
    <div className="flex flex-col gap-5">
      <GlowCard className="tcard">
        <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] mb-4 flex items-center gap-1.5">
          <IndianRupee className="h-3.5 w-3.5" /> Salary Insights
        </p>
        <div className="grid sm:grid-cols-4 gap-3.5 mb-4">
          <div className="sm:col-span-2">
            <label className="text-[11px] font-bold text-[#55556a] mb-1.5 block">Role</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Data Analyst"
              className="w-full text-sm px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[var(--primary)]/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#55556a] mb-1.5 block">Experience Level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full text-sm px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[var(--primary)]/50 transition-colors"
            >
              <option value="fresher">Fresher</option>
              <option value="junior">Junior</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#55556a] mb-1.5 block">Years of Experience</label>
            <input
              type="number"
              min={0}
              max={40}
              value={experienceYears}
              onChange={(e) => setExperienceYears(Number(e.target.value))}
              className="w-full text-sm px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[var(--primary)]/50 transition-colors"
            />
          </div>
          <div className="sm:col-span-4">
            <label className="text-[11px] font-bold text-[#55556a] mb-1.5 block">Skills (comma-separated, optional)</label>
            <input
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="e.g. python, aws, langchain"
              className="w-full text-sm px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[var(--primary)]/50 transition-colors"
            />
          </div>
        </div>
        <button
          onClick={analyze}
          disabled={loading}
          className="flex items-center justify-center gap-2 text-sm font-bold px-5 py-3 rounded-xl text-white cursor-pointer transition-opacity disabled:opacity-50 w-full sm:w-auto"
          style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Get Salary Insights
        </button>
      </GlowCard>

      {error && (
        <div className="tcard flex items-center gap-2 border-[var(--red)]/30 text-sm text-[var(--red-l)]">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
          <div className="tcard">
            <div className="flex items-center gap-2 mb-4">
              <Banknote className="h-4 w-4 text-[#a78bfa]" />
              <p className="text-xs font-bold uppercase tracking-wide text-[#55556a]">
                Salary Range · {result.unit || "INR per year"}
              </p>
            </div>
            <div className="relative h-3 rounded-full bg-white/10 mb-2">
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ width: "100%", background: "linear-gradient(90deg, var(--primary), var(--secondary))", opacity: 0.35 }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-5 w-5 rounded-full border-2 border-white shadow-lg"
                style={{ left: `${Math.min(96, Math.max(4, typicalPct))}%`, background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}
                title={`Typical: ${formatINR(typical)}`}
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <div>
                <p className="font-black text-sm">{formatINR(min)}</p>
                <p className="text-[#55556a]">Min</p>
              </div>
              <div className="text-center">
                <p className="font-black text-base text-[#a78bfa]">{formatINR(typical)}</p>
                <p className="text-[#55556a]">Typical</p>
              </div>
              <div className="text-right">
                <p className="font-black text-sm">{formatINR(max)}</p>
                <p className="text-[#55556a]">Max</p>
              </div>
            </div>
          </div>

          {result.market_context && (
            <div className="tcard">
              <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] mb-2 flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5" /> Market Context
              </p>
              <p className="text-sm leading-relaxed text-[#9090b0]">{result.market_context}</p>
            </div>
          )}

          {cityData.length > 0 && (
            <div className="tcard">
              <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] mb-4">
                Estimated Typical Salary by City
              </p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cityData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="city" tick={{ fill: "#9090b0", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fill: "#9090b0", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: number) => formatINR(v)}
                      width={56}
                    />
                    <Tooltip content={<SalaryTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                    <ReferenceLine y={typical} stroke="#55556a" strokeDasharray="4 4" />
                    <Bar dataKey="value" fill="#7c3aed" radius={[4, 4, 0, 0]} maxBarSize={44} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {result.skills_premium && Object.keys(result.skills_premium).length > 0 && (
            <div className="tcard">
              <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] mb-3">Skills Premium</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(result.skills_premium).map(([skill, premium]) => (
                  <span key={skill} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#10b981]/15 text-[var(--green-l)] border border-[#10b981]/30">
                    {skill}: {premium}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      <div className="tcard">
        <div className="flex items-center gap-2 mb-3">
          <Globe2 className="h-4 w-4 text-[#93c5fd]" />
          <p className="text-xs font-bold uppercase tracking-wide text-[#55556a]">FX Conversion (from typical INR salary)</p>
        </div>
        {ratesLoading ? (
          <p className="text-sm text-[#55556a] flex items-center gap-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading live rates...
          </p>
        ) : rates ? (
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { code: "USD", symbol: "$", rate: rates.usd },
              { code: "EUR", symbol: "€", rate: rates.eur },
              { code: "GBP", symbol: "£", rate: rates.gbp },
            ].map((c) => (
              <div key={c.code} className="px-3.5 py-3 rounded-lg bg-white/[0.03] border border-white/5">
                <p className="text-[10px] font-bold text-[#55556a] uppercase mb-1">{c.code}</p>
                <p className="text-lg font-black">
                  {typical && c.rate ? `${c.symbol}${Math.round(typical * c.rate).toLocaleString("en-US")}` : "—"}
                </p>
                <p className="text-[10px] text-[#55556a] mt-0.5">1 ₹ ≈ {c.rate?.toFixed(4) ?? "—"} {c.code}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#55556a]">Live rates unavailable right now.</p>
        )}
        {rates?.note && <p className="text-[11px] text-[#55556a] mt-2.5">{rates.note}</p>}
      </div>

      <div className="tcard">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="h-4 w-4 text-[var(--gold-l)]" />
          <p className="text-xs font-bold uppercase tracking-wide text-[#55556a]">Negotiation Playbook</p>
        </div>
        <ul className="flex flex-col gap-3">
          {NEGOTIATION_TIPS.map((tip, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span
                className="mt-0.5 h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 text-white"
                style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}
              >
                {i + 1}
              </span>
              <span className="text-[#eeeef8] leading-relaxed">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
