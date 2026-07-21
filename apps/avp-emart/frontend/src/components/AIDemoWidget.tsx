"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Sparkles, ArrowRight, Bot } from "lucide-react";

const API_BASE = "/avp-emart";

const EXAMPLES = [
  "Best phone under ₹20,000 with good camera",
  "Compare iPhone 15 vs Samsung S24",
  "Cheapest 55-inch smart TV with good reviews",
];

// Renders **bold** markdown as real <strong> JSX elements — splitting into an
// array of text/element nodes, NOT string-replacing into literal "<strong>"
// tags and interpolating that string into JSX (React would escape it and
// users would see literal asterisk-tag text on screen).
function renderReply(text: string) {
  return text.split("\n").map((line, i) => (
    <p key={i} className={line.trim() ? "mb-1.5" : "h-2"}>
      {line.split(/\*\*(.+?)\*\*/g).map((part, j) =>
        j % 2 === 1 ? (
          <strong key={j} className="text-[#fdba74]">
            {part}
          </strong>
        ) : (
          part
        )
      )}
    </p>
  ));
}

type DemoProduct = {
  platform: string;
  price: number;
  rating: number;
};

export function AIDemoWidget() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [products, setProducts] = useState<DemoProduct[]>([]);

  async function runDemo(e?: React.FormEvent) {
    e?.preventDefault();
    if (!message.trim() || loading) return;
    setLoading(true);
    setError("");
    setResult("");
    setProducts([]);
    try {
      const res = await fetch(API_BASE + "/api/assistant/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.slice(0, 200) }),
      });
      if (res.status === 429) {
        const data = await res.json().catch(() => null);
        setError(data?.detail || "This demo is popular right now — please try again in a moment.");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.detail || "Something went wrong. Please try again.");
        return;
      }
      const data = await res.json();
      setResult(data.reply || "");
      setProducts(Array.isArray(data.products) ? data.products.slice(0, 3) : []);
    } catch {
      setError("Couldn't reach the AI right now. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glow-card bg-gradient-to-br from-[#12121e] to-[#0d0d16] border border-white/5 rounded-2xl p-6 md:p-8 mt-8">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="h-4 w-4 text-[#6ee7b7]" />
        <span className="text-xs font-bold tracking-wider text-[#6ee7b7] uppercase">Live demo · Real AI, no signup</span>
      </div>
      <h4 className="text-lg font-bold text-white mb-1">Ask our AI to compare a product</h4>
      <p className="text-xs md:text-sm text-[#9aa0b8] mb-5">
        Describe what you&apos;re shopping for — our AI shopping assistant scans live listings across platforms and recommends the best-value pick.
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => setMessage(ex)}
            className="text-[11px] px-3 py-1.5 rounded-full border border-white/10 text-[#9aa0b8] hover:text-white hover:border-[#ea580c]/50 hover:bg-[#ea580c]/10 transition-all"
          >
            &ldquo;{ex}&rdquo;
          </button>
        ))}
      </div>

      <form onSubmit={runDemo} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. best budget laptop under ₹40,000"
          maxLength={200}
          required
          className="flex-1 w-full px-4 py-3 bg-[#0d0d16] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#ea580c]"
        />
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="btn shrink-0 w-fit self-center sm:self-auto px-6 py-3 rounded-lg bg-gradient-to-r from-[#ea580c] to-[#10b981] text-white font-semibold text-sm hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Scanning...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> Ask AI
            </>
          )}
        </button>
      </form>

      {error && (
        <p className="text-xs text-[#fca5a5] font-medium mt-4 text-center">{error}</p>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6 bg-[#0d0d16] border border-[#ea580c]/25 rounded-xl p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg grid place-items-center bg-gradient-to-r from-[#ea580c] to-[#10b981] text-white shrink-0">
                <Bot className="h-3.5 w-3.5" />
              </div>
              <div className="text-[10px] font-bold tracking-wider text-[#6ee7b7] uppercase">AI Shopping Assistant</div>
            </div>
            <div className="text-sm text-[#eeeef8] leading-relaxed">{renderReply(result)}</div>

            {products.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {products.map((p, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#fdba74] bg-[#ea580c]/10 border border-[#ea580c]/20 px-2.5 py-1.5 rounded-lg"
                  >
                    {p.platform} · ₹{Number(p.price).toLocaleString("en-IN")} · {p.rating}★
                  </span>
                ))}
              </div>
            )}

            <a
              href="/app/"
              className="inline-flex items-center gap-1.5 text-xs text-[#6ee7b7] font-semibold mt-4 hover:underline"
            >
              Get the full comparison across all 4 platforms in the app <ArrowRight className="h-3 w-3" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
