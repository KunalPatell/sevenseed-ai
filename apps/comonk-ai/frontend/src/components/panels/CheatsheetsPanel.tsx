"use client";

import React, { useEffect, useState } from "react";
import { Search, ExternalLink, Copy, Check, Loader2, BookOpen, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

interface CheatSheet {
  name: string;
  author?: string;
  url: string;
  description?: string;
  source?: string;
}

interface CheatSheetResponse {
  cheatsheets?: CheatSheet[];
  skill?: string;
  source?: string;
  search_url?: string;
  [key: string]: unknown;
}

const TOPICS = [
  "Python", "JavaScript", "TypeScript", "React", "Node.js", "SQL",
  "Git", "Docker", "Kubernetes", "Linux", "Machine Learning", "Regex",
  "Java", "MongoDB", "PostgreSQL", "FastAPI",
];

const LEVELS = ["Any", "Beginner", "Intermediate", "Advanced"];

export function CheatsheetsPanel() {
  const [activeTopic, setActiveTopic] = useState("Python");
  const [customTopic, setCustomTopic] = useState("");
  const [level, setLevel] = useState("Any");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<CheatSheetResponse | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  async function load(skill: string, lvl: string) {
    setLoading(true);
    setError("");
    try {
      const query = lvl && lvl !== "Any" ? `${skill} ${lvl.toLowerCase()}` : skill;
      const res = await api("GET", `/api/cheat-sheet-topics?skill=${encodeURIComponent(query)}&limit=12`).catch(() =>
        api("GET", `/api/cheatsheets?skill=${encodeURIComponent(query)}&limit=12`)
      );
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load cheat sheets");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load("Python", "Any");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function selectTopic(topic: string) {
    setActiveTopic(topic);
    setCustomTopic("");
    load(topic, level);
  }

  function submitCustom(e: React.FormEvent) {
    e.preventDefault();
    const topic = customTopic.trim();
    if (!topic) return;
    setActiveTopic(topic);
    load(topic, level);
  }

  async function copy(sheet: CheatSheet, idx: number) {
    const text = `${sheet.name}${sheet.author ? ` (by ${sheet.author})` : ""}\n${sheet.description || ""}\n${sheet.url}`;
    try {
      await navigator.clipboard.writeText(text.trim());
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx((c) => (c === idx ? null : c)), 1500);
    } catch {
      // clipboard not available — ignore
    }
  }

  const sheets = Array.isArray(data?.cheatsheets) ? (data!.cheatsheets as CheatSheet[]) : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="tcard flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-[#a78bfa]" />
          <p className="text-xs font-bold uppercase tracking-wide text-[#55556a]">Browse Topics</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t) => {
            const active = t === activeTopic;
            return (
              <button
                key={t}
                onClick={() => selectTopic(t)}
                className={`text-xs font-bold px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                  active ? "text-white border-transparent" : "bg-white/5 border-white/10 text-[#9090b0] hover:text-white hover:border-white/20"
                }`}
                style={active ? { background: "linear-gradient(115deg, var(--primary), var(--secondary))" } : undefined}
              >
                {t}
              </button>
            );
          })}
        </div>

        <form onSubmit={submitCustom} className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/5">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 flex-1 min-w-[200px]">
            <Search className="h-3.5 w-3.5 text-[#55556a] shrink-0" />
            <input
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="Custom technology (e.g. Rust, GraphQL)..."
              className="bg-transparent outline-none text-sm flex-1 min-w-0"
            />
          </div>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#7c3aed]/60"
          >
            {LEVELS.map((l) => (
              <option key={l} value={l} className="bg-[#12121e]">
                {l}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="text-xs font-bold px-4 py-2.5 rounded-lg text-white cursor-pointer"
            style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
          >
            Search
          </button>
        </form>
      </div>

      {loading && (
        <div className="tcard flex items-center justify-center gap-2 py-12">
          <Loader2 className="h-4 w-4 animate-spin text-[#a78bfa]" />
          <p className="text-sm text-[#9090b0]">Loading cheat sheets for {activeTopic}...</p>
        </div>
      )}

      {!loading && error && (
        <div className="tcard flex items-center gap-2 py-8 justify-center text-center">
          <AlertCircle className="h-4 w-4 text-[#fca5a5] shrink-0" />
          <p className="text-sm text-[#fca5a5]">{error}</p>
        </div>
      )}

      {!loading && !error && sheets && (
        <>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm font-bold">
              {sheets.length} cheat sheet{sheets.length === 1 ? "" : "s"} for <span className="grad">{activeTopic}</span>
            </p>
            {typeof data?.search_url === "string" && (
              <a
                href={data.search_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#9090b0] hover:text-white flex items-center gap-1"
              >
                More on Cheatography <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          {sheets.length === 0 ? (
            <div className="tcard text-center py-10">
              <p className="text-sm text-[#55556a]">No cheat sheets found for this topic yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sheets.map((s, i) => (
                <div key={i} className="tcard flex flex-col gap-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-bold leading-snug">{s.name}</p>
                    <button
                      onClick={() => copy(s, i)}
                      className="shrink-0 h-7 w-7 flex items-center justify-center rounded-md bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors"
                      title="Copy details"
                    >
                      {copiedIdx === i ? <Check className="h-3.5 w-3.5 text-[#6ee7b7]" /> : <Copy className="h-3.5 w-3.5 text-[#9090b0]" />}
                    </button>
                  </div>
                  {s.author && <p className="text-[10px] text-[#55556a]">by {s.author}</p>}
                  {s.description && <p className="text-xs text-[#9090b0] leading-relaxed flex-1">{s.description}</p>}
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 text-xs font-bold flex items-center gap-1 text-[#a78bfa] hover:text-[#93c5fd]"
                  >
                    View Cheat Sheet <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {!loading && !error && data && !sheets && (
        <div className="tcard">
          <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] mb-2">Raw Response</p>
          <pre className="text-xs text-[#9090b0] whitespace-pre-wrap break-words bg-black/20 rounded-lg p-3 overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
