"use client";

import React, { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, Search, ArrowUpRight, MessageSquare, Eye, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";

interface SOQuestion {
  title: string;
  score: number;
  answers: number;
  views: number;
  is_answered: boolean;
  tags: string[];
  url: string;
  asked: number;
}

export function StackOverflowPanel() {
  const [skill, setSkill] = useState("python");
  const [input, setInput] = useState("python");
  const [questions, setQuestions] = useState<SOQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setError("");
    setSkill(q);
    try {
      const res = await api("GET", `/api/stackoverflow?skill=${encodeURIComponent(q)}&limit=15`);
      setQuestions(res.questions || []);
      if (res.error) setError(res.error);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load questions.");
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          search(input);
        }}
        className="tcard flex items-center gap-3"
      >
        <HelpCircle className="h-4 w-4 text-[#a78bfa] shrink-0" />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search a skill or technology (e.g. react, docker, sql)…"
          className="flex-1 text-sm bg-transparent outline-none placeholder:text-[#55556a]"
        />
        <button
          type="submit"
          className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg text-white cursor-pointer"
          style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
        >
          <Search className="h-3.5 w-3.5" /> Search
        </button>
      </form>

      {error && (
        <p className="text-xs text-[#fca5a5] flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5" /> {error}
        </p>
      )}

      {loading ? (
        <div className="tcard flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 text-[#a78bfa] animate-spin" />
        </div>
      ) : !searched ? (
        <div className="tcard text-center py-16 text-xs text-[#55556a]">
          Search any skill to see its top-voted Stack Overflow questions.
        </div>
      ) : questions.length === 0 ? (
        <div className="tcard text-center py-16 text-xs text-[#55556a]">No questions found for &quot;{skill}&quot;.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {questions.map((q) => (
            <motion.a
              key={q.url}
              href={q.url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="tcard flex flex-col gap-2.5 hover:border-white/15 transition-colors"
            >
              <div className="flex items-start gap-2">
                <p className="text-sm font-bold leading-snug flex-1">{q.title}</p>
                <ArrowUpRight className="h-3.5 w-3.5 text-[#55556a] shrink-0" />
              </div>
              {q.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {q.tags.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[#3b82f6]/10 text-[#93c5fd]">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-4 text-[11px] text-[#9090b0] mt-1">
                <span className="font-bold text-[#eeeef8]">{q.score} votes</span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5" /> {q.answers}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" /> {q.views}
                </span>
                {q.is_answered && (
                  <span className="flex items-center gap-1 text-[#6ee7b7] ml-auto">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Answered
                  </span>
                )}
              </div>
            </motion.a>
          ))}
        </div>
      )}
    </div>
  );
}
