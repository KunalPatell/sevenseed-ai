"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { KeyRound, Eye, EyeOff, Save, ShieldCheck, Info } from "lucide-react";

interface KeyField {
  storageKey: string;
  label: string;
  note: string;
  placeholder: string;
}

// Mirrors BYOK_HEADER_KEYS in src/lib/api.ts — the exact localStorage keys
// api.ts reads per-request and attaches as x-api-key-* headers.
const FIELDS: KeyField[] = [
  { storageKey: "byok_groq_key", label: "Groq API Key", note: "Powers fast LLM calls — AI Counselor, mock interviews, resume tools.", placeholder: "gsk_..." },
  { storageKey: "byok_gemini_key", label: "Gemini API Key", note: "Alternate LLM provider for AI-generated content across the app.", placeholder: "AIza..." },
  { storageKey: "byok_openrouter_key", label: "OpenRouter API Key", note: "Access free/low-cost models (Llama, Gemma, Mistral) via OpenRouter.", placeholder: "sk-or-..." },
  { storageKey: "byok_mistral_key", label: "Mistral API Key", note: "Alternate LLM provider used as a fallback for AI features.", placeholder: "..." },
  { storageKey: "byok_youtube_key", label: "YouTube Data API Key", note: "Unlocks curated tutorial video results in Learning Hub.", placeholder: "AIza..." },
  { storageKey: "byok_github_key", label: "GitHub Token", note: "Raises GitHub API rate limits for Trending Repos and GitHub Analyzer.", placeholder: "ghp_..." },
  { storageKey: "byok_newsapi_key", label: "NewsAPI Key", note: "Powers tech news headlines shown around the app.", placeholder: "..." },
  { storageKey: "byok_adzuna_id", label: "Adzuna App ID", note: "Pairs with the Adzuna key below to unlock live job listings & skill demand data.", placeholder: "..." },
  { storageKey: "byok_adzuna_key", label: "Adzuna API Key", note: "Pairs with the Adzuna App ID above.", placeholder: "..." },
  { storageKey: "byok_hunter_key", label: "Hunter.io API Key", note: "Unlocks HR email finding for outreach.", placeholder: "..." },
  { storageKey: "byok_twilio_sid", label: "Twilio Account SID", note: "Pairs with the Twilio token below to unlock SMS / WhatsApp job alerts.", placeholder: "AC..." },
  { storageKey: "byok_twilio_token", label: "Twilio Auth Token", note: "Pairs with the Twilio SID above.", placeholder: "..." },
];

export function ApiKeysPanel() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [reveal, setReveal] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const v: Record<string, string> = {};
    for (const f of FIELDS) v[f.storageKey] = localStorage.getItem(f.storageKey) || "";
    setValues(v);
  }, []);

  function update(key: string, val: string) {
    setValues((s) => ({ ...s, [key]: val }));
    setSaved(false);
  }

  function save() {
    for (const f of FIELDS) {
      const v = (values[f.storageKey] || "").trim();
      if (v) localStorage.setItem(f.storageKey, v);
      else localStorage.removeItem(f.storageKey);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="tcard flex items-start gap-3">
        <div className="h-9 w-9 rounded-full flex items-center justify-center bg-[#7c3aed]/15 border border-[#7c3aed]/40 shrink-0">
          <KeyRound className="h-4.5 w-4.5 text-[#a78bfa]" />
        </div>
        <div>
          <p className="font-bold text-sm">Bring Your Own Keys</p>
          <p className="text-xs text-[#9090b0] mt-1 leading-relaxed flex items-start gap-1.5">
            <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[#55556a]" />
            Stored only in your browser (localStorage), sent as request headers on each call, and never stored on
            our servers. Leave any field blank to fall back to Comonk&apos;s shared/free tier where available.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {FIELDS.map((f) => (
          <div key={f.storageKey} className="tcard flex flex-col gap-2">
            <label className="text-xs font-bold text-[#eeeef8]">{f.label}</label>
            <div className="relative">
              <input
                type={reveal[f.storageKey] ? "text" : "password"}
                value={values[f.storageKey] || ""}
                onChange={(e) => update(f.storageKey, e.target.value)}
                placeholder={f.placeholder}
                className="w-full text-xs px-3 py-2.5 pr-9 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[#7c3aed]/50 font-mono"
              />
              <button
                type="button"
                onClick={() => setReveal((s) => ({ ...s, [f.storageKey]: !s[f.storageKey] }))}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#55556a] hover:text-white cursor-pointer"
              >
                {reveal[f.storageKey] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-[#55556a] leading-snug">{f.note}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 sticky bottom-4">
        <button
          onClick={save}
          className="flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-lg text-white cursor-pointer"
          style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
        >
          <Save className="h-4 w-4" /> Save
        </button>
        {saved && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xs font-bold text-[#6ee7b7] flex items-center gap-1.5"
          >
            <ShieldCheck className="h-3.5 w-3.5" /> Saved to this browser
          </motion.span>
        )}
      </div>
    </div>
  );
}
