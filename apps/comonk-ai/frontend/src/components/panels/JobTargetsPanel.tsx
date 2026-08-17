"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Target, Search, Lock, Mail, Phone, Globe, Loader2, AlertCircle, Building2 } from "lucide-react";
import { authApi } from "@/lib/api";
import { Auth } from "@/lib/auth";

interface FitScore {
  score?: number;
  reasons?: string[];
  breakdown?: Record<string, number>;
}

interface CompanyMatch {
  id?: number;
  name?: string;
  category?: string;
  roles?: string;
  emails?: string[];
  phone?: string;
  website?: string;
  fit_score?: FitScore;
  [key: string]: unknown;
}

export function JobTargetsPanel() {
  const user = Auth.user();
  const isVerified = !!user?.is_verified;

  const [skillsInput, setSkillsInput] = useState("");
  const [matches, setMatches] = useState<CompanyMatch[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  async function findMatches() {
    const skills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (skills.length === 0) {
      setError("Enter at least one skill, comma-separated.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await authApi("POST", "/api/match", { skills });
      setMatches((res?.matches as CompanyMatch[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch company matches");
    } finally {
      setLoading(false);
    }
  }

  const categories = useMemo(() => {
    const set = new Set<string>();
    (matches || []).forEach((m) => {
      if (m.category) set.add(m.category);
    });
    return Array.from(set).sort();
  }, [matches]);

  const filtered = useMemo(() => {
    if (!matches) return [];
    return matches.filter((m) => {
      const matchesSearch = !search || (m.name || "").toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || m.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [matches, search, category]);

  return (
    <div className="flex flex-col gap-5">
      {/* Search form */}
      <div className="tcard">
        <div className="flex items-center gap-2 mb-3">
          <Target className="h-4 w-4 text-[#a78bfa]" />
          <p className="text-xs font-bold uppercase tracking-wide text-[#55556a]">Find Your Target Companies</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && findMatches()}
            placeholder="e.g. React, Python, AWS, Machine Learning"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-[#eeeef8] placeholder:text-[#55556a] focus:outline-none focus:border-[#7c3aed]/50"
          />
          <button
            onClick={findMatches}
            disabled={loading}
            className="flex items-center justify-center gap-2 text-sm font-bold px-5 py-2.5 rounded-lg text-white cursor-pointer disabled:opacity-60 transition-opacity shrink-0"
            style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Find Matches
          </button>
        </div>
        {error && (
          <p className="flex items-center gap-1.5 text-xs text-[var(--red-l)] mt-2.5">
            <AlertCircle className="h-3.5 w-3.5" /> {error}
          </p>
        )}
      </div>

      {matches && matches.length > 0 && (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="h-4 w-4 text-[#55556a] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search companies..."
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3.5 py-2.5 text-sm text-[#eeeef8] placeholder:text-[#55556a] focus:outline-none focus:border-[#7c3aed]/50"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-[#eeeef8] focus:outline-none focus:border-[#7c3aed]/50 sm:w-56"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <p className="text-xs text-[#55556a] -mt-2">
            Showing {filtered.length} of {matches.length} matched companies
          </p>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((m, i) => (
              <motion.div
                key={m.id ?? i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i, 8) * 0.04 }}
                className="tcard flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      <Building2 className="h-4 w-4 text-[#9090b0]" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate">{m.name || "Unknown Company"}</p>
                      <p className="text-[10px] text-[#55556a] truncate">{m.category || "—"}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-black grad">{m.fit_score?.score ?? "—"}</p>
                    <p className="text-[9px] text-[#55556a]">FIT SCORE</p>
                  </div>
                </div>

                {m.fit_score?.reasons && m.fit_score.reasons.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {m.fit_score.reasons.slice(0, 3).map((r, ri) => (
                      <span
                        key={ri}
                        className="text-[10px] font-medium px-2 py-1 rounded-full bg-[#7c3aed]/10 text-[#a78bfa] border border-[#7c3aed]/15"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-col gap-1.5 pt-2 border-t border-white/5">
                  {isVerified ? (
                    <>
                      {m.emails && m.emails.length > 0 ? (
                        <a
                          href={`mailto:${m.emails[0]}`}
                          className="flex items-center gap-1.5 text-xs text-[#93c5fd] hover:underline truncate"
                        >
                          <Mail className="h-3.5 w-3.5 shrink-0" /> {m.emails[0]}
                        </a>
                      ) : (
                        <p className="flex items-center gap-1.5 text-xs text-[#55556a]">
                          <Mail className="h-3.5 w-3.5 shrink-0" /> No email on file
                        </p>
                      )}
                      {m.phone ? (
                        <p className="flex items-center gap-1.5 text-xs text-[#9090b0]">
                          <Phone className="h-3.5 w-3.5 shrink-0" /> {m.phone}
                        </p>
                      ) : null}
                    </>
                  ) : (
                    <button className="flex items-center gap-1.5 text-xs text-[#55556a] hover:text-[#9090b0] cursor-pointer transition-colors">
                      <Lock className="h-3.5 w-3.5 shrink-0" />
                      <span className="blur-[3px] select-none">hr@company.com</span>
                      <span className="ml-auto font-bold not-italic text-[#f59e0b]">Verify to unlock</span>
                    </button>
                  )}
                  {m.website ? (
                    <a
                      href={m.website.startsWith("http") ? m.website : `https://${m.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-[#55556a] hover:text-[#9090b0] truncate"
                    >
                      <Globe className="h-3.5 w-3.5 shrink-0" /> {m.website}
                    </a>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {matches && matches.length === 0 && (
        <div className="tcard flex flex-col items-center justify-center py-16 text-center">
          <Target className="h-6 w-6 text-[#55556a] mb-3" />
          <p className="font-bold text-[#9090b0]">No matches found</p>
          <p className="text-xs text-[#55556a] mt-1">Try different or broader skills.</p>
        </div>
      )}
    </div>
  );
}
