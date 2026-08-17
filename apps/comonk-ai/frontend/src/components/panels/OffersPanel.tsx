"use client";

import React, { useState } from "react";
import { Plus, Trash2, Scale, IndianRupee, Loader2, AlertCircle, Sparkles, Award } from "lucide-react";
import { authApi } from "@/lib/api";

interface OfferForm {
  id: string;
  company: string;
  role: string;
  ctc: string;
  bonus: string;
  esop: string;
  work_mode: string;
  company_type: string;
  perks: string[];
}

interface EnrichedOffer {
  company?: string;
  role?: string;
  ctc?: number;
  bonus?: number;
  esop?: number;
  inhand?: { annual_gross?: number; estimated_tax?: number; monthly_inhand?: number };
  perk_score?: number;
  growth_score?: number;
  total_value?: number;
}

interface CompareResult {
  offers?: EnrichedOffer[];
  ai_pick?: number;
  ai_reason?: string;
}

const PERKS = [
  { key: "remote", label: "Remote Work" },
  { key: "hybrid", label: "Hybrid" },
  { key: "health_insurance", label: "Health Insurance" },
  { key: "meal", label: "Meals" },
  { key: "gym", label: "Gym" },
  { key: "learning_budget", label: "Learning Budget" },
  { key: "flexible_hours", label: "Flexible Hours" },
  { key: "stock", label: "Stock / ESOP" },
];

const WORK_MODES = ["Remote", "Hybrid", "Onsite"];
const COMPANY_TYPES = ["Startup", "Product", "MNC", "Service"];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function newOffer(): OfferForm {
  return { id: uid(), company: "", role: "", ctc: "", bonus: "", esop: "", work_mode: "Hybrid", company_type: "Product", perks: [] };
}

function formatINR(n?: number) {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export function OffersPanel() {
  const [offers, setOffers] = useState<OfferForm[]>([newOffer()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CompareResult | null>(null);

  function updateOffer(id: string, patch: Partial<OfferForm>) {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  }
  function togglePerk(id: string, perkKey: string) {
    setOffers((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, perks: o.perks.includes(perkKey) ? o.perks.filter((p) => p !== perkKey) : [...o.perks, perkKey] }
          : o
      )
    );
  }
  function addOffer() {
    if (offers.length >= 3) return;
    setOffers((prev) => [...prev, newOffer()]);
  }
  function removeOffer(id: string) {
    setOffers((prev) => (prev.length > 1 ? prev.filter((o) => o.id !== id) : prev));
  }

  async function compare() {
    const valid = offers.filter((o) => o.company.trim() && o.ctc.trim());
    if (valid.length === 0) {
      setError("Add at least one offer with a company name and CTC.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const payload = valid.map((o) => ({
        company: o.company.trim(),
        role: o.role.trim(),
        ctc: parseFloat(o.ctc) || 0,
        bonus: parseFloat(o.bonus) || 0,
        esop: parseFloat(o.esop) || 0,
        work_mode: o.work_mode.toLowerCase(),
        company_type: o.company_type.toLowerCase(),
        perks: o.perks,
      }));
      const res = await authApi("POST", "/api/compare-offers", { offers: payload });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to compare offers");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  const pickedIdx = typeof result?.ai_pick === "number" ? result.ai_pick - 1 : -1;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-[#a78bfa]" />
          <p className="text-xs font-bold uppercase tracking-wide text-[#55556a]">Offer Comparator</p>
        </div>
        <button
          onClick={addOffer}
          disabled={offers.length >= 3}
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[#9090b0] hover:text-white hover:border-white/20 cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="h-3.5 w-3.5" /> Add Offer ({offers.length}/3)
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {offers.map((o, idx) => (
          <div key={o.id} className="tcard flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-[#55556a] uppercase tracking-wide">Offer {idx + 1}</p>
              {offers.length > 1 && (
                <button
                  onClick={() => removeOffer(o.id)}
                  className="h-6 w-6 flex items-center justify-center rounded-md bg-white/5 hover:bg-[#ef4444]/15 text-[#55556a] hover:text-[#fca5a5] cursor-pointer transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <input
              value={o.company}
              onChange={(e) => updateOffer(o.id, { company: e.target.value })}
              placeholder="Company name"
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#7c3aed]/60"
            />
            <input
              value={o.role}
              onChange={(e) => updateOffer(o.id, { role: e.target.value })}
              placeholder="Role / title"
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#7c3aed]/60"
            />

            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase text-[#55556a]">CTC (LPA)</label>
                <input
                  type="number" min="0" step="0.1"
                  value={o.ctc}
                  onChange={(e) => updateOffer(o.id, { ctc: e.target.value })}
                  placeholder="12"
                  className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-[#7c3aed]/60"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase text-[#55556a]">Bonus (LPA)</label>
                <input
                  type="number" min="0" step="0.1"
                  value={o.bonus}
                  onChange={(e) => updateOffer(o.id, { bonus: e.target.value })}
                  placeholder="1"
                  className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-[#7c3aed]/60"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase text-[#55556a]">ESOP (LPA)</label>
                <input
                  type="number" min="0" step="0.1"
                  value={o.esop}
                  onChange={(e) => updateOffer(o.id, { esop: e.target.value })}
                  placeholder="0"
                  className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-[#7c3aed]/60"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase text-[#55556a]">Work Mode</label>
                <select
                  value={o.work_mode}
                  onChange={(e) => updateOffer(o.id, { work_mode: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-[#7c3aed]/60"
                >
                  {WORK_MODES.map((m) => (
                    <option key={m} value={m} className="bg-[#12121e]">{m}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase text-[#55556a]">Company Type</label>
                <select
                  value={o.company_type}
                  onChange={(e) => updateOffer(o.id, { company_type: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-[#7c3aed]/60"
                >
                  {COMPANY_TYPES.map((c) => (
                    <option key={c} value={c} className="bg-[#12121e]">{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold uppercase text-[#55556a]">Perks & Benefits</label>
              <div className="flex flex-wrap gap-1.5">
                {PERKS.map((p) => {
                  const active = o.perks.includes(p.key);
                  return (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => togglePerk(o.id, p.key)}
                      className={`text-[9px] font-semibold px-2 py-1 rounded-full border cursor-pointer transition-colors ${
                        active
                          ? "bg-[#7c3aed]/15 border-[#7c3aed]/40 text-[#a78bfa]"
                          : "bg-white/5 border-white/10 text-[#55556a] hover:text-white"
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={compare}
        disabled={loading}
        className="self-start text-xs font-bold px-4 py-2.5 rounded-lg text-white cursor-pointer disabled:opacity-60"
        style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
      >
        {loading ? "Comparing..." : "Compare Offers"}
      </button>

      {loading && (
        <div className="tcard flex items-center justify-center gap-2 py-10">
          <Loader2 className="h-4 w-4 animate-spin text-[#a78bfa]" />
          <p className="text-sm text-[#9090b0]">Analyzing offers...</p>
        </div>
      )}

      {!loading && error && (
        <div className="tcard flex items-center gap-2 py-6 justify-center text-center">
          <AlertCircle className="h-4 w-4 text-[#fca5a5] shrink-0" />
          <p className="text-sm text-[#fca5a5]">{error}</p>
        </div>
      )}

      {!loading && !error && result && Array.isArray(result.offers) && (
        <>
          {result.ai_reason && (
            <div className="tcard flex items-start gap-3">
              <div
                className="h-9 w-9 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}
              >
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] mb-1">
                  AI Verdict
                  {pickedIdx >= 0 && result.offers[pickedIdx]?.company ? ` — ${result.offers[pickedIdx]?.company}` : ""}
                </p>
                <p className="text-sm leading-relaxed">{result.ai_reason}</p>
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.offers.map((o, i) => {
              const isPick = i === pickedIdx;
              return (
                <div
                  key={i}
                  className="tcard flex flex-col gap-2.5 relative"
                  style={isPick ? { borderColor: "rgba(124,58,237,0.5)", boxShadow: "0 0 0 1px rgba(124,58,237,0.35)" } : undefined}
                >
                  {isPick && (
                    <span className="absolute -top-2.5 right-4 text-[9px] font-black px-2 py-0.5 rounded-full bg-[#7c3aed] text-white flex items-center gap-1">
                      <Award className="h-2.5 w-2.5" /> AI PICK
                    </span>
                  )}
                  <p className="text-sm font-black truncate">{o.company || "Untitled Offer"}</p>
                  {o.role && <p className="text-xs text-[#55556a] -mt-1.5">{o.role}</p>}

                  <div className="flex items-center gap-1 text-xs font-bold text-[#a78bfa] pt-1">
                    <IndianRupee className="h-3 w-3" />
                    {typeof o.ctc === "number" ? `${o.ctc} LPA` : "—"}
                    {typeof o.bonus === "number" && o.bonus > 0 && <span className="text-[#55556a] font-normal">+ {o.bonus} bonus</span>}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-white/5">
                    <div>
                      <p className="text-[#55556a]">Monthly In-hand</p>
                      <p className="font-bold text-[#eeeef8]">{formatINR(o.inhand?.monthly_inhand)}</p>
                    </div>
                    <div>
                      <p className="text-[#55556a]">Annual Gross</p>
                      <p className="font-bold text-[#eeeef8]">{formatINR(o.inhand?.annual_gross)}</p>
                    </div>
                    <div>
                      <p className="text-[#55556a]">Perk Score</p>
                      <p className="font-bold text-[#eeeef8]">{o.perk_score ?? "—"}</p>
                    </div>
                    <div>
                      <p className="text-[#55556a]">Growth Score</p>
                      <p className="font-bold text-[#eeeef8]">{o.growth_score ?? "—"}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
