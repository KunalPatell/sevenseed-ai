"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, TrendingDown } from "lucide-react";
import { ValOrb } from "./ValOrb";

/**
 * Hero centerpiece for AVP Emart — a live-feeling 4-store price board.
 *
 * Replaces the generic stat-card row every other Sevenseed site uses. The
 * numbers mirror how backend/comparator.py actually scores a product
 * (40% price + 40% rating + 20% reviews -> value_score, highest wins), so
 * "Val's Pick" below is the same store the real scorer would surface — not
 * an arbitrary highlight.
 */
type Row = { store: string; price: number; rating: number; reviews: number };
type Product = { name: string; category: string; rows: Row[] };

function valueScore(rows: Row[], r: Row): number {
  const maxPrice = Math.max(...rows.map((x) => x.price));
  const maxReviews = Math.max(...rows.map((x) => x.reviews));
  const priceScore = maxPrice ? (maxPrice - r.price) / maxPrice : 0;
  const ratingScore = r.rating / 5;
  const reviewScore = maxReviews ? r.reviews / maxReviews : 0;
  return Math.round((0.4 * priceScore + 0.4 * ratingScore + 0.2 * reviewScore) * 1000) / 10;
}

const PRODUCTS: Product[] = [
  {
    name: "boAt Airdopes 141 TWS",
    category: "Audio",
    rows: [
      { store: "Amazon", price: 1299, rating: 4.2, reviews: 18400 },
      { store: "Flipkart", price: 1199, rating: 4.3, reviews: 21200 },
      { store: "Reliance Digital", price: 1349, rating: 4.1, reviews: 3100 },
      { store: "Snapdeal", price: 1249, rating: 3.9, reviews: 900 },
    ],
  },
  {
    name: "HP Pavilion 14 Laptop",
    category: "Laptops",
    rows: [
      { store: "Amazon", price: 54990, rating: 4.4, reviews: 5600 },
      { store: "Flipkart", price: 53499, rating: 4.3, reviews: 8100 },
      { store: "Reliance Digital", price: 55990, rating: 4.5, reviews: 1200 },
      { store: "Snapdeal", price: 54200, rating: 4.0, reviews: 340 },
    ],
  },
  {
    name: "Mi Smart TV 5A 43-inch",
    category: "Home & TV",
    rows: [
      { store: "Amazon", price: 24999, rating: 4.3, reviews: 41000 },
      { store: "Flipkart", price: 23990, rating: 4.4, reviews: 52300 },
      { store: "Reliance Digital", price: 25490, rating: 4.2, reviews: 2800 },
      { store: "Snapdeal", price: 24499, rating: 3.8, reviews: 610 },
    ],
  },
];

export function PriceBoard() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % PRODUCTS.length), 5200);
    return () => clearInterval(id);
  }, []);

  const product = PRODUCTS[active];
  const scored = product.rows
    .map((r) => ({ ...r, score: valueScore(product.rows, r) }))
    .sort((a, b) => b.score - a.score);
  const winner = scored[0];
  const maxPrice = Math.max(...product.rows.map((r) => r.price));

  return (
    <div className="price-board w-full max-w-[640px]">
      <div className="flex items-center gap-3 mb-4 justify-center">
        <ValOrb size={44} />
        <div className="text-left">
          <div className="text-xs font-bold text-white leading-tight">Val is scanning 4 stores</div>
          <div className="text-[11px] text-[#9aa0b8] leading-tight">live value-score comparison, not just lowest price</div>
        </div>
      </div>

      <div className="bg-black/40 border border-white/10 rounded-2xl backdrop-blur-xl p-4 md:p-5 text-left">
        <AnimatePresence mode="wait">
          <motion.div
            key={product.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-[#9aa0b8] font-mono">{product.category}</div>
                <div className="text-sm font-bold text-white truncate">{product.name}</div>
              </div>
              <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-mono font-bold text-[#fdba74] bg-[#ea580c]/10 border border-[#ea580c]/30 px-2 py-1 rounded-full shrink-0">
                <TrendingDown className="h-3 w-3" /> value_score
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {scored.map((r) => {
                const isBest = r.store === winner.store;
                const widthPct = Math.max(18, Math.round((r.price / maxPrice) * 100));
                return (
                  <div key={r.store} className="flex items-center gap-1.5 sm:gap-3">
                    <div className="w-[62px] sm:w-[92px] shrink-0 text-[10px] sm:text-[11px] font-semibold text-[#eeeef8] truncate">{r.store}</div>
                    <div className="flex-1 min-w-0 h-6 bg-white/5 rounded-md overflow-hidden relative">
                      <motion.div
                        className={`h-full rounded-md ${isBest ? "bg-gradient-to-r from-[#ea580c] to-[#10b981]" : "bg-white/15"}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${widthPct}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                      <span className="absolute inset-y-0 left-2 flex items-center text-[9px] sm:text-[10px] font-mono font-bold text-white">
                        ₹{r.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="hidden sm:block w-[70px] shrink-0 text-right text-[10px] font-mono text-[#9aa0b8]">
                      {r.score.toFixed(1)} pts
                    </div>
                    {isBest && <CheckCircle2 className="h-4 w-4 text-[#6ee7b7] shrink-0" />}
                  </div>
                );
              })}
            </div>

            <div className="mt-3 pt-3 border-t border-white/10 text-[11px] text-[#9aa0b8]">
              <strong className="text-[#6ee7b7]">Val&apos;s Pick:</strong> {winner.store} at ₹{winner.price.toLocaleString("en-IN")} — best mix of price, {winner.rating}★ rating and {winner.reviews.toLocaleString("en-IN")} reviews (40/40/20 weighting).
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-1.5 mt-3">
        {PRODUCTS.map((p, i) => (
          <button
            key={p.name}
            onClick={() => setActive(i)}
            aria-label={`Show ${p.name}`}
            className={`h-1.5 rounded-full transition-all ${i === active ? "w-6 bg-[#fdba74]" : "w-1.5 bg-white/20"}`}
          />
        ))}
      </div>
    </div>
  );
}
