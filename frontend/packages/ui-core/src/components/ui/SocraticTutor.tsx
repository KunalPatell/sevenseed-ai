"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Sparkles, KeyRound, Loader2 } from "lucide-react";
import { getStoredApiKeys } from "../../lib/api";

type TutorMessage = { role: "student" | "tutor"; text: string };

const SYSTEM_PROMPT =
  "You are a Socratic tutor. Never hand over the final answer immediately. " +
  "Respond with one or two short guiding questions that lead the student to discover the answer themselves. " +
  "Keep every reply under 60 words. Only give a direct explanation if the student explicitly says " +
  "they give up or asks for the answer twice in a row.";

const OFFLINE_OPENERS = [
  (t: string) => `Before I answer — what do you already know about "${t}"? Try explaining it in your own words first.`,
  (t: string) => `Good topic. What do you think happens in the simplest possible case of "${t}"?`,
  (t: string) => `Let's break "${t}" down: which specific part is confusing you the most right now?`,
  (t: string) => `If you had to explain "${t}" to a 10-year-old in one sentence, what would you say?`,
  (t: string) => `Interesting question about "${t}". What have you already tried, and where did it break down?`,
];

async function askTutor(history: TutorMessage[]): Promise<string | null> {
  const keys = getStoredApiKeys();
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.slice(-6).map((m) => ({ role: m.role === "student" ? "user" : "assistant", content: m.text })),
  ];

  if (keys.groqKey) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${keys.groqKey}` },
        body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages, temperature: 0.5, max_tokens: 200 }),
      });
      if (res.ok) {
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) return reply;
      }
    } catch {
      // fall through
    }
  }

  if (keys.geminiKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${keys.geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: history.slice(-6).map((m) => ({
              role: m.role === "student" ? "user" : "model",
              parts: [{ text: m.text }],
            })),
            generationConfig: { temperature: 0.5, maxOutputTokens: 200 },
          }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) return reply;
      }
    } catch {
      // fall through
    }
  }

  if (keys.openaiKey) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${keys.openaiKey}` },
        body: JSON.stringify({ model: "gpt-4o-mini", messages, temperature: 0.5, max_tokens: 200 }),
      });
      if (res.ok) {
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) return reply;
      }
    } catch {
      // fall through
    }
  }

  return null;
}

export function SocraticTutor() {
  const [topic, setTopic] = useState("");
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      role: "tutor",
      text: "I'm your Socratic tutor — ask me about anything you're studying (calculus, CAP theorem, thermodynamics, whatever). I'll guide you to the answer with questions instead of just telling you.",
    },
  ]);
  const [sending, setSending] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [turn, setTurn] = useState(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const keys = getStoredApiKeys();
    setHasKey(Boolean(keys.groqKey || keys.geminiKey || keys.openaiKey));
    const onUpdate = () => {
      const k = getStoredApiKeys();
      setHasKey(Boolean(k.groqKey || k.geminiKey || k.openaiKey));
    };
    window.addEventListener("byok-updated", onUpdate);
    return () => window.removeEventListener("byok-updated", onUpdate);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    const question = topic.trim();
    if (!question || sending) return;

    const nextHistory = [...messages, { role: "student" as const, text: question }];
    setMessages(nextHistory);
    setTopic("");
    setSending(true);

    const liveReply = await askTutor(nextHistory);
    const reply = liveReply ?? OFFLINE_OPENERS[turn % OFFLINE_OPENERS.length](question);

    setMessages((prev) => [...prev, { role: "tutor", text: reply }]);
    setTurn((t) => t + 1);
    setSending(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
          <Bot className="w-4 h-4 text-indigo-400" />
          <span>Socratic AI Tutor</span>
        </div>
        {hasKey ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-[10px] font-mono text-emerald-400">
            <Sparkles className="w-3 h-3" /> Live AI Mode
          </span>
        ) : (
          <a
            href="/byok"
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-[10px] font-mono text-amber-400 hover:bg-amber-500/20 transition-colors"
          >
            <KeyRound className="w-3 h-3" /> Demo Mode · Add a free key
          </a>
        )}
      </div>

      <div ref={scrollRef} className="h-80 overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2.5 ${m.role === "student" ? "flex-row-reverse" : ""}`}>
            <div
              className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center ${
                m.role === "student" ? "bg-sky-500/15 text-sky-400" : "bg-indigo-500/15 text-indigo-400"
              }`}
            >
              {m.role === "student" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>
            <div
              className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                m.role === "student"
                  ? "bg-sky-500/10 border border-sky-500/20 text-sky-100"
                  : "bg-slate-800/80 border border-slate-700/80 text-slate-200"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono pl-9">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> thinking of a good question…
          </div>
        )}
      </div>

      <form onSubmit={handleAsk} className="flex items-center gap-2 border-t border-slate-800 p-3">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Ask about calculus, CAP theorem, thermodynamics…"
          className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={sending || !topic.trim()}
          className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 text-white disabled:opacity-40 transition-opacity"
          aria-label="Ask tutor"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
