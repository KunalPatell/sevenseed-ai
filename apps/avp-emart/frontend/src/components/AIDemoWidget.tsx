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
    history: [69900, 68500, 67990, 66490, 64999, 64999, 63999],
    dates: ["30d ago", "20d ago", "15d ago", "10d ago", "5d ago", "2d ago", "Today"],
    stores: [
      { store: "Amazon", price: 65999, rating: 4.6, best: false, stock: "In Stock" },
      { store: "Flipkart", price: 63999, rating: 4.7, best: true, stock: "3 Left!" },
      { store: "Reliance Digital", price: 66490, rating: 4.5, best: false, stock: "In Stock" },
      { store: "Snapdeal", price: 67200, rating: 4.3, best: false, stock: "In Stock" },
    ],
    bankOffer: "HDFC Card ₹3,000 Instant Cashback + No Cost EMI",
    recommendation: "Buy on Flipkart for ₹63,999 — Lowest price in 30 days!"
  },
  {
    name: "Samsung Galaxy S24 FE 5G",
    history: [59999, 58490, 57500, 56999, 55490, 54999, 53999],
    dates: ["30d ago", "20d ago", "15d ago", "10d ago", "5d ago", "2d ago", "Today"],
    stores: [
      { store: "Amazon", price: 53999, rating: 4.6, best: true, stock: "In Stock" },
      { store: "Flipkart", price: 55490, rating: 4.4, best: false, stock: "In Stock" },
      { store: "Reliance Digital", price: 56999, rating: 4.6, best: false, stock: "Limited" },
      { store: "Snapdeal", price: 57500, rating: 4.1, best: false, stock: "In Stock" },
    ],
    bankOffer: "ICICI Credit Card ₹2,500 Instant Cashback",
    recommendation: "Amazon has lowest price ₹53,999 with free ₹4,000 exchange bonus."
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
  const [activeTab, setActiveTab] = useState<"matrix" | "predictor" | "assistant">("matrix");

  // Assistant State
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  // Matrix & Graph State
  const [selectedProduct, setSelectedProduct] = useState(MATRIX_PRODUCTS[0]);
  const [cashbackPercent, setCashbackPercent] = useState(5);

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

  const bestPrice = selectedProduct.stores.find((s) => s.best)?.price || 64999;
  const effectivePrice = Math.round(bestPrice * (1 - cashbackPercent / 100));

  return (
    <div className="relative overflow-hidden bg-[#0d0906] border border-[#ea580c]/30 rounded-3xl p-6 md:p-10 mt-10 shadow-[0_0_50px_rgba(234,88,12,0.15)]">
      {/* Ambient Cyber Orange Mesh Glows */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#ea580c]/15 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#ec4899]/15 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Live Enterprise Performance Stats Bar */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-black/40 border border-white/10 rounded-2xl mb-8 backdrop-blur-xl">
        <div className="flex items-center gap-2.5 px-3 border-r border-white/10">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ea580c] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ea580c]"></span>
          </span>
          <div>
            <div className="text-[10px] uppercase font-mono text-[#999]">Engine Status</div>
            <div className="text-xs font-bold text-white font-mono">4-Store Scraper</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-3 border-r border-white/10">
          <span className="text-xs">⚡</span>
          <div>
            <div className="text-[10px] uppercase font-mono text-[#999]">Response Speed</div>
            <div className="text-xs font-bold text-[#fdba74] font-mono">18ms Latency</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-3 border-r border-white/10">
          <span className="text-xs">🛍️</span>
          <div>
            <div className="text-[10px] uppercase font-mono text-[#999]">Price Alerts</div>
            <div className="text-xs font-bold text-white font-mono">8,400+ Active</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-3">
          <span className="text-xs">✨</span>
          <div>
            <div className="text-[10px] uppercase font-mono text-[#999]">Deal Accuracy</div>
            <div className="text-xs font-bold text-[#6ee7b7] font-mono">99.5% Verified</div>
          </div>
        </div>
      </div>

      {/* Header & Glass Tabs */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-[#fdba74]" />
            <span className="text-xs font-bold tracking-wider text-[#fdba74] uppercase">Live AI E-Commerce Intelligence</span>
          </div>
          <h4 className="text-2xl font-black text-white tracking-tight">4-Store Price Comparison & Trend Predictor</h4>
        </div>

        <div className="flex gap-2 p-1.5 bg-black/60 rounded-2xl border border-white/10 backdrop-blur-xl">
          <button
            onClick={() => setActiveTab("matrix")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-300 ${
              activeTab === "matrix" ? "bg-[#ea580c] text-white shadow-[0_0_20px_rgba(234,88,12,0.5)] scale-[1.02]" : "text-[#9aa0b8] hover:text-white"
            }`}
          >
            <Layers className="h-3.5 w-3.5" /> 4-Store Price Matrix
          </button>
          <button
            onClick={() => setActiveTab("predictor")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-300 ${
              activeTab === "predictor" ? "bg-[#ea580c] text-white shadow-[0_0_20px_rgba(234,88,12,0.5)] scale-[1.02]" : "text-[#9aa0b8] hover:text-white"
            }`}
          >
            <TrendingDown className="h-3.5 w-3.5" /> 30-Day Trend & Cashback
          </button>
          <button
            onClick={() => setActiveTab("assistant")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-300 ${
              activeTab === "assistant" ? "bg-[#ea580c] text-white shadow-[0_0_20px_rgba(234,88,12,0.5)] scale-[1.02]" : "text-[#9aa0b8] hover:text-white"
            }`}
          >
            <ShoppingCart className="h-3.5 w-3.5" /> AI Deal Bot
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
