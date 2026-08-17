"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Trash2, User, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { Auth } from "@/lib/auth";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

const SUGGESTED_PROMPTS = [
  "How do I break into AI/ML roles with no experience?",
  "Review my career path and suggest next steps",
  "What skills should I learn for a backend role in 2026?",
  "How do I negotiate a job offer confidently?",
];

export function CounselorPanel() {
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSessionId(crypto.randomUUID());
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setError("");
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setSending(true);
    try {
      const user = Auth.user();
      const res = await api("POST", "/api/chat", {
        message: trimmed,
        session_id: sessionId || "default",
        profile: user ? { name: user.name, target_role: user.target_role } : {},
      });
      const reply: string =
        (res && (res.reply as string)) || "Sorry, I couldn't generate a response right now.";
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", text: reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reach the counselor");
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  function clearChat() {
    setMessages([]);
    setError("");
    setSessionId(crypto.randomUUID());
  }

  return (
    <div className="tcard flex flex-col h-[calc(100vh-180px)] min-h-[520px] p-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2.5">
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}
          >
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold">AI Career Counselor</p>
            <p className="text-[10px] text-[#55556a]">Ask anything about your job search</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors text-[#9090b0]"
        >
          <Trash2 className="h-3.5 w-3.5" /> Clear
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 py-10">
            <Sparkles className="h-6 w-6 text-[#55556a]" />
            <p className="text-sm font-bold text-[#9090b0]">Start the conversation</p>
            <p className="text-xs text-[#55556a] max-w-xs">
              Pick a suggested prompt below or type your own career question.
            </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2.5 max-w-[85%] ${m.role === "user" ? "self-end flex-row-reverse" : "self-start"}`}
            >
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${
                  m.role === "user" ? "bg-white/10" : ""
                }`}
                style={
                  m.role === "assistant"
                    ? { background: "linear-gradient(135deg, var(--primary), var(--secondary))" }
                    : undefined
                }
              >
                {m.role === "user" ? (
                  <User className="h-3.5 w-3.5 text-[#9090b0]" />
                ) : (
                  <Bot className="h-3.5 w-3.5 text-white" />
                )}
              </div>
              <div
                className={`tcard !p-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === "user" ? "!bg-[#7c3aed]/15 !border-[#7c3aed]/25" : ""
                }`}
              >
                {m.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {sending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2.5 max-w-[85%] self-start"
          >
            <div
              className="h-7 w-7 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}
            >
              <Bot className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="tcard !p-3.5 flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-[#9090b0] inline-block"
                  style={{ animation: `typedot 1.2s ${i * 0.15}s infinite` }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {error && <p className="text-xs text-[var(--red-l)] self-center">{error}</p>}
      </div>

      {/* Suggested prompts */}
      <div className="px-5 pt-3 flex flex-wrap gap-2 shrink-0">
        {SUGGESTED_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => setInput(p)}
            className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors text-[#9090b0] hover:text-white"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 flex items-end gap-2.5 shrink-0">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your career question..."
          rows={1}
          className="flex-1 resize-none bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-[#eeeef8] placeholder:text-[#55556a] focus:outline-none focus:border-[#7c3aed]/50 max-h-32"
        />
        <button
          onClick={() => send(input)}
          disabled={sending || !input.trim()}
          className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
