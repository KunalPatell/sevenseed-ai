"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Bot, User, Loader2, Key, ShieldCheck, RefreshCcw } from "lucide-react";
import { aiSuggestions, profile } from "../../lib/data";
import { askKunalAI, getStoredApiKeys, type ChatMessage } from "../../lib/api";
import { SectionHeading } from "../ui";
import { sound } from "../../lib/sound";

const GREETING: ChatMessage = {
  role: "assistant",
  content: `Hi! I'm Kunal's AI assistant. Ask me about his multi-agent systems, Rakshak AI, computer vision projects, work at Capermint/Elite Workforce, or technical skills.`,
};

export function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasByok, setHasByok] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateByok = () => {
      const keys = getStoredApiKeys();
      setHasByok(Boolean(keys.groqKey || keys.geminiKey || keys.openaiKey));
    };
    updateByok();
    window.addEventListener("byok-updated", updateByok);
    return () => window.removeEventListener("byok-updated", updateByok);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    sound.playClick();
    const history = messages.filter((m) => m !== GREETING);
    const next: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const reply = await askKunalAI(trimmed, history);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
      sound.playSuccess();
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: `Kunal is an AI Engineer with an MSc in AI & Machine Learning. You can review his live projects above or contact him directly at ${profile.email}.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="ask-ai" className="section bg-[#050505] border-t border-white/5 relative">
      <div className="container-px">
        <SectionHeading
          eyebrow="Conversational AI Core"
          title={
            <>
              Interactive <span className="text-[#9ed8ff] drop-shadow-[0_0_8px_rgba(158,216,255,0.4)]">Kunal AI</span> Assistant
            </>
          }
          description="Grounded in Kunal's complete resume, 9+ production platforms, and engineering architecture. Instant responses with zero server errors."
        />

        <div
          data-blur-in
          className="glass-card mx-auto flex max-w-3xl flex-col overflow-hidden hover:border-[#9ed8ff]/20 transition-all duration-300"
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-white/5 px-5 py-4 bg-white/[0.01]">
            <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-[#9ed8ff]/10 text-[#9ed8ff] border border-[#9ed8ff]/20 shadow-[0_0_10px_rgba(158,216,255,0.15)]">
              <Bot className="h-5 w-5" />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#050505] bg-emerald-400 animate-pulse" />
            </span>
            <div>
              <p className="font-mono text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Kunal AI Assistant</span>
                {hasByok ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-2 py-0.5 text-[9px] font-medium text-violet-300 border border-violet-500/20">
                    <ShieldCheck className="h-2.5 w-2.5" /> BYOK Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-medium text-emerald-400 border border-emerald-500/20">
                    Neural RAG
                  </span>
                )}
              </p>
              <p className="font-mono text-[9px] text-white/40 uppercase tracking-widest mt-0.5">
                Grounded on 9+ production platforms &amp; V7 Resume
              </p>
            </div>
            <Sparkles className="ml-auto h-4 w-4 text-[#9ed8ff] drop-shadow-[0_0_5px_rgba(158,216,255,0.4)]" />
          </div>

          {/* Messages Window */}
          <div ref={scrollRef} className="h-80 sm:h-96 space-y-4 overflow-y-auto px-5 py-5 scrollbar-thin">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl border ${
                      m.role === "user"
                        ? "border-white/10 bg-white/[0.05] text-white"
                        : "border-[#9ed8ff]/20 bg-[#9ed8ff]/10 text-[#9ed8ff]"
                    }`}
                  >
                    {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </span>
                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 font-mono text-xs leading-relaxed ${
                      m.role === "user"
                        ? "bg-[#9ed8ff]/10 border border-[#9ed8ff]/20 text-white"
                        : "border border-white/5 bg-white/[0.02] text-white/90 whitespace-pre-line"
                    }`}
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <div className="flex gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-[#9ed8ff]/20 bg-[#9ed8ff]/10 text-[#9ed8ff]">
                  <Bot className="h-4 w-4" />
                </span>
                <div className="flex items-center gap-2 rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3 font-mono text-xs text-white/50">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#9ed8ff]" />
                  Retrieving context &amp; inferring...
                </div>
              </div>
            )}
          </div>

          {/* Suggestion Chips */}
          <div className="flex flex-wrap gap-1.5 px-5 pb-3 border-t border-white/5 pt-3">
            {aiSuggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-lg border border-[#9ed8ff]/15 bg-[#9ed8ff]/5 px-2.5 py-1 font-mono text-[10px] text-[#9ed8ff]/80 transition-all hover:border-[#9ed8ff]/40 hover:bg-[#9ed8ff]/10 hover:text-white"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-3 border-t border-white/5 p-4 bg-white/[0.005]"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about Kunal's architecture, projects, or background..."
              className="flex-1 rounded-xl border border-white/10 bg-[#080a0f] px-4 py-2.5 font-mono text-xs text-white outline-none transition-all placeholder:text-white/30 focus:border-[#9ed8ff]/40 focus:bg-[#0b0e14]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-xl bg-[#9ed8ff]/10 border border-[#9ed8ff]/30 text-[#9ed8ff] transition-all hover:scale-105 hover:bg-[#9ed8ff]/20 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
