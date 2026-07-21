"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Sparkles, ArrowRight, Bot, ShoppingCart, TrendingDown, Layers } from "lucide-react";

const API_BASE = "/avp-emart";

const EXAMPLES = [
  "Best phone under ₹20,000 with good camera",
  "Compare iPhone 15 vs Samsung S24",
  "Cheapest 55-inch smart TV with good reviews",
];

const MATRIX_PRODUCTS = [
  {
    name: "Apple iPhone 15 (128GB)",
    stores: [
      { store: "Amazon", price: 65999, rating: 4.6, best: false },
      { store: "Flipkart", price: 64999, rating: 4.7, best: true },
      { store: "Reliance Digital", price: 66490, rating: 4.5, best: false },
      { store: "Snapdeal", price: 67200, rating: 4.3, best: false },
    ],
    recommendation: "Buy on Flipkart for ₹64,999 + extra ₹1,500 bank discount."
  },
  {
    name: "Samsung Galaxy S24 FE 5G",
    stores: [
      { store: "Amazon", price: 54999, rating: 4.5, best: true },
      { store: "Flipkart", price: 55490, rating: 4.4, best: false },
      { store: "Reliance Digital", price: 56999, rating: 4.6, best: false },
      { store: "Snapdeal", price: 57500, rating: 4.1, best: false },
    ],
    recommendation: "Amazon has lowest price ₹54,999 with free exchange bonus."
  }
];

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
  const [activeTab, setActiveTab] = useState<"assistant" | "matrix" | "predictor">("assistant");

  // Assistant State
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  // Matrix State
  const [selectedProduct, setSelectedProduct] = useState(MATRIX_PRODUCTS[0]);

  async function runDemo(e?: React.FormEvent) {
    e?.preventDefault();
    if (!message.trim() || loading) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch(API_BASE + "/api/assistant/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.slice(0, 200) }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setResult(data.reply || "");
    } catch {
      setError("Couldn't reach the AI right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glow-card bg-gradient-to-br from-[#12121e] to-[#0d0d16] border border-[#ea580c]/25 rounded-2xl p-6 md:p-8 mt-8 shadow-2xl">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-[#fdba74]" />
            <span className="text-xs font-bold tracking-wider text-[#fdba74] uppercase">Live AI Shopping Assistant</span>
          </div>
          <h4 className="text-xl font-extrabold text-white">Multi-Store Price Intelligence</h4>
        </div>

        <div className="flex gap-2 p-1 bg-[#08080f] rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab("assistant")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "assistant" ? "bg-[#ea580c] text-white shadow-md" : "text-[#9aa0b8] hover:text-white"
            }`}
          >
            <ShoppingCart className="h-3.5 w-3.5" /> AI Shopping Bot
          </button>
          <button
            onClick={() => setActiveTab("matrix")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "matrix" ? "bg-[#ea580c] text-white shadow-md" : "text-[#9aa0b8] hover:text-white"
            }`}
          >
            <Layers className="h-3.5 w-3.5" /> 4-Store Price Matrix
          </button>
          <button
            onClick={() => setActiveTab("predictor")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "predictor" ? "bg-[#ea580c] text-white shadow-md" : "text-[#9aa0b8] hover:text-white"
            }`}
          >
            <TrendingDown className="h-3.5 w-3.5" /> Price Drop Predictor
          </button>
        </div>
      </div>

      {/* Tab 1: AI Shopping Assistant */}
      {activeTab === "assistant" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-xs md:text-sm text-[#9aa0b8] mb-5">
            Describe what you&apos;re shopping for — our AI scans live listings and recommends the best-value deal.
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
              className="btn shrink-0 w-fit self-center sm:self-auto px-6 py-3 rounded-lg bg-gradient-to-r from-[#ea580c] to-[#10b981] text-white font-semibold text-sm hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ask AI"}
            </button>
          </form>

          {error && <p className="text-xs text-[#fca5a5] font-medium mt-4 text-center">{error}</p>}

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-[#0d0d16] border border-[#ea580c]/25 rounded-xl p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg grid place-items-center bg-gradient-to-r from-[#ea580c] to-[#10b981] text-white shrink-0">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-[10px] font-bold tracking-wider text-[#6ee7b7] uppercase">AI Shopping Assistant</div>
                </div>
                <div className="text-sm text-[#eeeef8] leading-relaxed">{renderReply(result)}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Tab 2: 4-Store Price Matrix */}
      {activeTab === "matrix" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-xs md:text-sm text-[#9aa0b8] mb-4">
            Select a product to view real-time cross-platform price & rating matrix:
          </p>

          <div className="flex gap-2 mb-5">
            {MATRIX_PRODUCTS.map((prod) => (
              <button
                key={prod.name}
                onClick={() => setSelectedProduct(prod)}
                className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                  selectedProduct.name === prod.name
                    ? "bg-[#ea580c]/15 border-[#ea580c] text-white shadow-md"
                    : "bg-[#08080f] border-white/10 text-[#9aa0b8] hover:border-white/30"
                }`}
              >
                {prod.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {selectedProduct.stores.map((s, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border flex flex-col justify-between ${
                  s.best
                    ? "bg-[#10b981]/15 border-[#10b981] text-white shadow-lg"
                    : "bg-[#08080f] border-white/10 text-[#9aa0b8]"
                }`}
              >
                <div className="text-xs font-bold text-white flex justify-between items-center">
                  <span>{s.store}</span>
                  {s.best && <span className="text-[9px] bg-[#10b981] text-black font-extrabold px-1.5 py-0.5 rounded">BEST DEAL</span>}
                </div>
                <div className="mt-3">
                  <div className="text-base font-extrabold font-mono text-white">₹{s.price.toLocaleString("en-IN")}</div>
                  <div className="text-[10px] text-[#fdba74] font-mono mt-0.5">{s.rating}★ Rating</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#08080f] border border-[#ea580c]/30 rounded-xl p-4 text-xs text-[#eeeef8]">
            <strong className="text-[#fdba74]">ML Value Recommendation:</strong> {selectedProduct.recommendation}
          </div>
        </motion.div>
      )}

      {/* Tab 3: Price Drop Predictor */}
      {activeTab === "predictor" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-xs md:text-sm text-[#9aa0b8] mb-4">
            AI Price Trend Forecast & Purchase Timing Recommendation:
          </p>

          <div className="bg-[#08080f] border border-white/10 rounded-xl p-5 space-y-4 text-xs text-[#9aa0b8]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <div className="text-sm font-bold text-white">Flagship Smartphone Category</div>
                <div className="text-[11px] text-[#6ee7b7] font-mono mt-0.5">Predicted Drop: 8% - 12% in next 10 days</div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#10b981]/20 border border-[#10b981]/40 text-[#6ee7b7] font-bold text-[10px] uppercase">
                RECOMMENDATION: WAIT 7 DAYS
              </span>
            </div>

            <p className="leading-relaxed">
              Historical price trends indicate upcoming festival sale drops on Flipkart & Amazon. Setting a price alert now will notify you when price reaches target <strong>₹59,999</strong>.
            </p>
          </div>
        </motion.div>
      )}

      <div className="mt-6 border-t border-white/10 pt-4 flex justify-between items-center">
        <span className="text-[11px] text-[#9aa0b8] italic">Cross-referencing 4 major Indian e-commerce stores</span>
        <a href="/app/" className="inline-flex items-center gap-1.5 text-xs text-[#6ee7b7] font-semibold hover:underline">
          Open Full App Matrix <ArrowRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
