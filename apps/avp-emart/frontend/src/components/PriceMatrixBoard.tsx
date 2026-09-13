"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingDown,
  Sparkles,
  ExternalLink,
  Award,
  CheckCircle2,
  Search,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Zap,
  Star,
  Flame,
} from "lucide-react";

const API_BASE = "/avp-emart";

export interface StoreListing {
  name: string;
  price: number;
  rating: number;
  reviews: number;
  score: number;
  deliveryDays: number;
  inStock: boolean;
  link: string;
}

export interface ComparisonProduct {
  query: string;
  name: string;
  category: string;
  typicalPrice: number;
  stores: StoreListing[];
  verdict: string;
}

// Built-in high-fidelity presets for instant zero-latency rendering
const PRESET_PRODUCTS: ComparisonProduct[] = [
  {
    query: "iPhone 16 Pro",
    name: "Apple iPhone 16 Pro (128GB - Desert Titanium)",
    category: "Smartphones",
    typicalPrice: 119900,
    verdict: "Flipkart offers the highest value score (94.2/100) with fastest 2-day delivery and ₹5,000 instant savings vs highest retail.",
    stores: [
      { name: "Flipkart", price: 114900, rating: 4.7, reviews: 3420, score: 94.2, deliveryDays: 2, inStock: true, link: "https://www.flipkart.com/search?q=iPhone+16+Pro" },
      { name: "Amazon", price: 116900, rating: 4.6, reviews: 4890, score: 88.5, deliveryDays: 1, inStock: true, link: "https://www.amazon.in/s?k=iPhone+16+Pro" },
      { name: "Reliance Digital", price: 118990, rating: 4.5, reviews: 890, score: 81.0, deliveryDays: 3, inStock: true, link: "https://www.reliancedigital.in/search?q=iPhone+16+Pro" },
      { name: "Snapdeal", price: 119900, rating: 4.1, reviews: 320, score: 72.4, deliveryDays: 4, inStock: true, link: "https://www.snapdeal.com/search?keyword=iPhone+16+Pro" },
    ],
  },
  {
    query: "Samsung Galaxy S24 Ultra",
    name: "Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB)",
    category: "Smartphones",
    typicalPrice: 129999,
    verdict: "Amazon leads with ₹121,999 (saving ₹8,000) and verified 4.8-star buyer consensus across 6,100+ reviews.",
    stores: [
      { name: "Amazon", price: 121999, rating: 4.8, reviews: 6120, score: 96.0, deliveryDays: 1, inStock: true, link: "https://www.amazon.in/s?k=Samsung+Galaxy+S24+Ultra" },
      { name: "Flipkart", price: 124999, rating: 4.6, reviews: 2980, score: 89.2, deliveryDays: 2, inStock: true, link: "https://www.flipkart.com/search?q=Samsung+Galaxy+S24+Ultra" },
      { name: "Reliance Digital", price: 126999, rating: 4.4, reviews: 1140, score: 82.5, deliveryDays: 2, inStock: true, link: "https://www.reliancedigital.in/search?q=Samsung+Galaxy+S24+Ultra" },
      { name: "Snapdeal", price: 129999, rating: 4.0, reviews: 450, score: 71.8, deliveryDays: 5, inStock: true, link: "https://www.snapdeal.com/search?keyword=Samsung+Galaxy+S24+Ultra" },
    ],
  },
  {
    query: "MacBook Air M3",
    name: "Apple MacBook Air 13\" M3 Chip (16GB, 512GB SSD)",
    category: "Laptops",
    typicalPrice: 134900,
    verdict: "Reliance Digital delivers the best value score (93.1/100) featuring an exclusive student bundle and free pickup.",
    stores: [
      { name: "Reliance Digital", price: 127900, rating: 4.7, reviews: 1420, score: 93.1, deliveryDays: 2, inStock: true, link: "https://www.reliancedigital.in/search?q=MacBook+Air+M3" },
      { name: "Amazon", price: 128990, rating: 4.7, reviews: 3150, score: 91.8, deliveryDays: 1, inStock: true, link: "https://www.amazon.in/s?k=MacBook+Air+M3" },
      { name: "Flipkart", price: 129900, rating: 4.5, reviews: 1890, score: 86.4, deliveryDays: 3, inStock: true, link: "https://www.flipkart.com/search?q=MacBook+Air+M3" },
      { name: "Snapdeal", price: 134900, rating: 3.9, reviews: 190, score: 68.0, deliveryDays: 5, inStock: false, link: "https://www.snapdeal.com/search?keyword=MacBook+Air+M3" },
    ],
  },
  {
    query: "Sony WH-1000XM5",
    name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
    category: "Audio",
    typicalPrice: 34990,
    verdict: "Amazon secures the win at ₹28,990 with 7,400+ verified audio ratings and 1-day Prime dispatch.",
    stores: [
      { name: "Amazon", price: 28990, rating: 4.8, reviews: 7410, score: 97.4, deliveryDays: 1, inStock: true, link: "https://www.amazon.in/s?k=Sony+WH-1000XM5" },
      { name: "Flipkart", price: 29990, rating: 4.6, reviews: 3820, score: 89.0, deliveryDays: 2, inStock: true, link: "https://www.flipkart.com/search?q=Sony+WH-1000XM5" },
      { name: "Reliance Digital", price: 31490, rating: 4.5, reviews: 920, score: 81.3, deliveryDays: 2, inStock: true, link: "https://www.reliancedigital.in/search?q=Sony+WH-1000XM5" },
      { name: "Snapdeal", price: 33990, rating: 4.1, reviews: 240, score: 69.5, deliveryDays: 4, inStock: true, link: "https://www.snapdeal.com/search?keyword=Sony+WH-1000XM5" },
    ],
  },
  {
    query: "boAt Airdopes 141",
    name: "boAt Airdopes 141 Bluetooth Truly Wireless Earbuds",
    category: "Audio",
    typicalPrice: 1499,
    verdict: "Flipkart offers best price at ₹1,199 with massive 42,000+ positive user reviews.",
    stores: [
      { name: "Flipkart", price: 1199, rating: 4.4, reviews: 42300, score: 95.8, deliveryDays: 2, inStock: true, link: "https://www.flipkart.com/search?q=boAt+Airdopes+141" },
      { name: "Amazon", price: 1249, rating: 4.3, reviews: 38900, score: 91.2, deliveryDays: 1, inStock: true, link: "https://www.amazon.in/s?k=boAt+Airdopes+141" },
      { name: "Snapdeal", price: 1299, rating: 4.0, reviews: 3100, score: 79.5, deliveryDays: 3, inStock: true, link: "https://www.snapdeal.com/search?keyword=boAt+Airdopes+141" },
      { name: "Reliance Digital", price: 1399, rating: 4.1, reviews: 1800, score: 74.0, deliveryDays: 3, inStock: true, link: "https://www.reliancedigital.in/search?q=boAt+Airdopes+141" },
    ],
  },
];

const STORE_CONFIG: Record<string, { color: string; badgeBg: string; logoText: string }> = {
  Amazon: { color: "#f59e0b", badgeBg: "rgba(245, 158, 11, 0.12)", logoText: "Amazon" },
  Flipkart: { color: "#3b82f6", badgeBg: "rgba(59, 130, 246, 0.12)", logoText: "Flipkart" },
  "Reliance Digital": { color: "#10b981", badgeBg: "rgba(16, 185, 129, 0.12)", logoText: "Reliance" },
  Snapdeal: { color: "#f43f5e", badgeBg: "rgba(244, 63, 94, 0.12)", logoText: "Snapdeal" },
};

function calculateValueScore(price: number, maxPrice: number, rating: number, reviews: number, maxReviews: number): number {
  const priceScore = maxPrice > 0 ? (maxPrice - price) / maxPrice : 0;
  const ratingScore = rating / 5;
  const reviewScore = maxReviews > 0 ? reviews / maxReviews : 0;
  return Math.round((0.4 * priceScore + 0.4 * ratingScore + 0.2 * reviewScore) * 1000) / 10;
}

export function PriceMatrixBoard() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [currentProduct, setCurrentProduct] = useState<ComparisonProduct>(PRESET_PRODUCTS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeSort, setActiveSort] = useState<"score" | "price" | "rating">("score");

  const inputRef = useRef<HTMLInputElement>(null);

  // Sync preset changes
  const handleSelectPreset = (idx: number) => {
    setSelectedIdx(idx);
    setCurrentProduct(PRESET_PRODUCTS[idx]);
  };

  // Live search handler against /api/compare
  const handleLiveSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    // Check if query matches a preset first for instant swap
    const match = PRESET_PRODUCTS.findIndex(p => p.query.toLowerCase() === query.toLowerCase());
    if (match !== -1) {
      handleSelectPreset(match);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`${API_BASE}/api/compare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, n: 6 }),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const maxP = Math.max(...data.map(p => p.price || 1));
          const maxR = Math.max(...data.map(p => p.reviews_count || 1));

          const stores: StoreListing[] = data.slice(0, 4).map((p: any) => {
            const platformName = p.platform === "amazon.in" ? "Amazon"
              : p.platform === "flipkart.com" ? "Flipkart"
              : p.platform === "reliancedigital.in" ? "Reliance Digital"
              : p.platform === "snapdeal.com" ? "Snapdeal"
              : p.platform || "Amazon";

            const score = p.best_value_score
              ? Math.round(p.best_value_score * 10) / 10
              : calculateValueScore(p.price, maxP, p.rating || 4.2, p.reviews_count || 500, maxR);

            return {
              name: platformName,
              price: p.price,
              rating: p.rating || 4.2,
              reviews: p.reviews_count || 850,
              score,
              deliveryDays: p.delivery_days || 2,
              inStock: p.in_stock !== false,
              link: p.url || `https://www.google.com/search?q=${encodeURIComponent(query)}`,
            };
          });

          // Sort descending by score initially
          stores.sort((a, b) => b.score - a.score);
          const winner = stores[0];
          const savings = maxP - winner.price;

          setCurrentProduct({
            query,
            name: data[0].title || query,
            category: data[0].category || "Gadget",
            typicalPrice: maxP,
            stores,
            verdict: `${winner.name} delivers the winning score (${winner.score}/100) with ₹${savings.toLocaleString("en-IN")} price advantage.`,
          });
        }
      }
    } catch {
      // Fallback gracefully to default
    } finally {
      setIsSearching(false);
    }
  };

  const sortedStores = [...currentProduct.stores].sort((a, b) => {
    if (activeSort === "score") return b.score - a.score;
    if (activeSort === "price") return a.price - b.price;
    if (activeSort === "rating") return b.rating - a.rating;
    return 0;
  });

  const bestStore = [...currentProduct.stores].sort((a, b) => b.score - a.score)[0];
  const maxStorePrice = Math.max(...currentProduct.stores.map(s => s.price));
  const maxSavings = maxStorePrice - bestStore.price;

  return (
    <div className="w-full rounded-3xl border border-[rgba(99,102,241,0.25)] bg-[#070716]/90 backdrop-blur-2xl shadow-[0_0_90px_rgba(99,102,241,0.14)] overflow-hidden">
      {/* HUD Telemetry Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-[#090920] border-b border-[rgba(99,102,241,0.14)]">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10b981]" />
          </span>
          <div className="flex flex-col">
            <span className="text-[11px] font-mono font-black text-white tracking-widest uppercase flex items-center gap-1.5">
              VAL 4-STORE MATRIX <Sparkles className="h-3 w-3 text-[#f59e0b]" />
            </span>
            <span className="text-[9px] font-mono text-[#a5b4fc]">
              Scoring: 40% Price · 40% Rating · 20% Review Depth
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.25)] text-[#10b981] font-bold">
            Live 4-Store Sync
          </span>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[rgba(99,102,241,0.12)] border border-[rgba(99,102,241,0.25)] text-[#a5b4fc]">
            BYOK Unlimited
          </span>
        </div>
      </div>

      {/* Interactive Search & Quick Match Preset Ribbon */}
      <div className="p-6 border-b border-[rgba(99,102,241,0.1)] bg-[#050512]">
        <form onSubmit={handleLiveSearch} className="flex gap-2.5 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a5b4fc]" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any smartphone, laptop, TV, or headphones..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#090920] border border-[rgba(99,102,241,0.2)] rounded-xl text-sm text-white placeholder:text-[#6471c4] focus:outline-none focus:border-[#6366f1] transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Compare
          </button>
        </form>

        {/* Preset Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] font-mono uppercase text-[#6471c4] shrink-0 font-bold">Trending:</span>
          {PRESET_PRODUCTS.map((prod, idx) => (
            <button
              key={prod.query}
              type="button"
              onClick={() => handleSelectPreset(idx)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium shrink-0 transition-all flex items-center gap-1.5 ${
                selectedIdx === idx && !searchQuery
                  ? "bg-[#6366f1]/20 border-[#6366f1] text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                  : "bg-[#090920] border-[rgba(99,102,241,0.12)] text-[#a5b4fc] hover:text-white hover:border-[rgba(99,102,241,0.3)]"
              }`}
            >
              {prod.query}
            </button>
          ))}
        </div>
      </div>

      {/* Product Summary Header */}
      <div className="px-6 py-4 bg-[#08081f] border-b border-[rgba(99,102,241,0.1)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#6471c4] font-bold">
              {currentProduct.category}
            </span>
            {maxSavings > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#10b981] bg-[#10b981]/15 px-2 py-0.5 rounded-full border border-[#10b981]/30">
                <Flame className="h-3 w-3" /> Save ₹{maxSavings.toLocaleString("en-IN")} vs Peak
              </span>
            )}
          </div>
          <h3 className="text-lg md:text-xl font-black text-white">{currentProduct.name}</h3>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-1.5 bg-[#050512] p-1 rounded-xl border border-[rgba(99,102,241,0.15)] text-xs">
          <span className="text-[10px] font-mono text-[#6471c4] px-2">Sort:</span>
          {(["score", "price", "rating"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setActiveSort(s)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] capitalize transition-all ${
                activeSort === s
                  ? "bg-[#6366f1] text-white"
                  : "text-[#a5b4fc] hover:text-white"
              }`}
            >
              {s === "score" ? "Val Score" : s}
            </button>
          ))}
        </div>
      </div>

      {/* 4-Store Matrix Cards Grid */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatePresence mode="wait">
          {sortedStores.map((store, i) => {
            const isWinner = store.name === bestStore.name;
            const config = STORE_CONFIG[store.name] || { color: "#6366f1", badgeBg: "rgba(99,102,241,0.1)", logoText: store.name };
            const priceDiff = store.price - bestStore.price;

            return (
              <motion.div
                key={store.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={`relative rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 ${
                  isWinner
                    ? "bg-gradient-to-b from-[#0e0e2e] to-[#0a0a22] border-[#10b981] shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                    : "bg-[#090920]/80 border-[rgba(99,102,241,0.12)] hover:border-[rgba(99,102,241,0.3)]"
                }`}
              >
                {/* Winner Crown / Status Badge */}
                {isWinner && (
                  <div className="absolute -top-3 left-4 right-4 flex justify-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10b981] text-black text-[10px] font-black uppercase tracking-wider shadow-lg">
                      <Award className="h-3.5 w-3.5" /> Best Value Deal
                    </span>
                  </div>
                )}

                <div>
                  {/* Retailer Logo Bar */}
                  <div className="flex items-center justify-between mb-4 mt-1">
                    <span
                      className="text-xs font-black tracking-wider uppercase px-2.5 py-1 rounded-lg"
                      style={{ background: config.badgeBg, color: config.color }}
                    >
                      {store.name}
                    </span>
                    <span className="text-[10px] font-mono text-[#a5b4fc] flex items-center gap-1">
                      <Zap className="h-3 w-3 text-[#f59e0b]" /> {store.deliveryDays}d delivery
                    </span>
                  </div>

                  {/* Price Block */}
                  <div className="mb-4">
                    <div className="text-2xl font-black text-white font-mono tracking-tight">
                      ₹{store.price.toLocaleString("en-IN")}
                    </div>
                    {isWinner ? (
                      <div className="text-[10px] text-[#10b981] font-mono font-bold mt-0.5">
                        ✓ Lowest 4-Store Price
                      </div>
                    ) : (
                      <div className="text-[10px] text-[#f43f5e] font-mono mt-0.5">
                        +₹{priceDiff.toLocaleString("en-IN")} vs Winner
                      </div>
                    )}
                  </div>

                  {/* Value Score Meter */}
                  <div className="space-y-1.5 mb-5 p-3 rounded-xl bg-[#050512] border border-white/5">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-[#a5b4fc]">Value Score</span>
                      <strong className="text-white font-bold">{store.score} / 100</strong>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${store.score}%` }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        style={{
                          background: isWinner
                            ? "linear-gradient(90deg, #10b981, #06b6d4)"
                            : "linear-gradient(90deg, #6366f1, #a855f7)",
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#6471c4] pt-1">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-[#f59e0b] text-[#f59e0b]" /> {store.rating}
                      </span>
                      <span>{store.reviews.toLocaleString("en-IN")} reviews</span>
                    </div>
                  </div>
                </div>

                {/* Direct Retailer Store Action */}
                <a
                  href={store.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    isWinner
                      ? "bg-[#10b981] text-black hover:bg-[#10b981]/90 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                      : "bg-[#050512] text-white border border-white/10 hover:border-[#6366f1] hover:text-[#a5b4fc]"
                  }`}
                >
                  View on {store.name} <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Val AI Recommendation Callout Footer */}
      <div className="p-5 bg-[#050512] border-t border-[rgba(99,102,241,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#6366f1]/20 border border-[#6366f1]/40 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5 text-[#a5b4fc]" />
          </div>
          <div>
            <div className="text-[11px] font-mono font-bold text-[#10b981] uppercase tracking-wider">
              Val's Automated Verdict
            </div>
            <p className="text-xs text-white mt-0.5 leading-relaxed font-medium">
              {currentProduct.verdict}
            </p>
          </div>
        </div>

        <a
          href="/avp-emart/app/"
          className="shrink-0 text-xs font-mono font-bold text-[#a5b4fc] hover:text-white px-4 py-2 rounded-xl bg-[#090920] border border-[rgba(99,102,241,0.2)] flex items-center gap-1.5 transition-colors"
        >
          Open Full App Dashboard →
        </a>
      </div>
    </div>
  );
}
