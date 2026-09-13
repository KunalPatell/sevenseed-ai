"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingDown,
  TrendingUp,
  Clock,
  Bell,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  ArrowDownRight,
  Flame,
} from "lucide-react";

interface TrendModel {
  title: string;
  category: string;
  currentPrice: number;
  allTimeLow: number;
  allTimeHigh: number;
  direction: "falling" | "rising";
  changePct: number;
  recommendation: "WAIT" | "BUY_NOW";
  waitDays: number;
  confidence: number;
  history: number[]; // 12 weeks
}

const TREND_DATA: TrendModel[] = [
  {
    title: "Apple iPhone 16 Pro (128GB)",
    category: "Smartphones",
    currentPrice: 114900,
    allTimeLow: 112999,
    allTimeHigh: 119900,
    direction: "falling",
    changePct: -4.2,
    recommendation: "WAIT",
    waitDays: 10,
    confidence: 88,
    history: [119900, 119900, 118500, 117900, 117900, 116500, 115900, 115900, 114900, 114900, 114900, 114900],
  },
  {
    title: "Sony WH-1000XM5 Wireless ANC",
    category: "Audio",
    currentPrice: 28990,
    allTimeLow: 28990,
    allTimeHigh: 34990,
    direction: "falling",
    changePct: -17.1,
    recommendation: "BUY_NOW",
    waitDays: 0,
    confidence: 96,
    history: [34990, 33990, 32990, 32490, 31990, 31490, 30990, 30490, 29990, 29490, 28990, 28990],
  },
  {
    title: "MacBook Air 13\" M3 Chip",
    category: "Laptops",
    currentPrice: 127900,
    allTimeLow: 124990,
    allTimeHigh: 134900,
    direction: "falling",
    changePct: -5.2,
    recommendation: "WAIT",
    waitDays: 7,
    confidence: 82,
    history: [134900, 134900, 132900, 131900, 130900, 129900, 129900, 128900, 128900, 127900, 127900, 127900],
  },
];

export function PriceTrendForecaster() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);
  const [targetPrice, setTargetPrice] = useState<number>(110000);
  const [alertSet, setAlertSet] = useState(false);

  const model = TREND_DATA[selectedIdx];
  const maxPrice = Math.max(...model.history);
  const minPrice = Math.min(...model.history);
  const range = maxPrice - minPrice || 1;

  // Compute SVG polyline points
  const points = model.history.map((price, i) => {
    const x = (i / (model.history.length - 1)) * 100;
    // invert Y so high price is top
    const y = 90 - ((price - minPrice) / range) * 75;
    return `${x},${y}`;
  });

  const polylinePoints = points.join(" ");
  const areaPoints = `0,100 ${polylinePoints} 100,100`;

  const handleSetAlert = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertSet(true);
    setTimeout(() => setAlertSet(false), 4000);
  };

  const potentialSavings = Math.max(0, model.currentPrice - targetPrice);

  return (
    <div className="w-full rounded-3xl border border-[rgba(99,102,241,0.25)] bg-[#070716] shadow-[0_0_80px_rgba(99,102,241,0.1)] overflow-hidden">
      {/* Telemetry Header */}
      <div className="p-6 md:p-8 bg-[#090920] border-b border-[rgba(99,102,241,0.12)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#10b981] flex items-center gap-1">
              <TrendingDown className="h-3.5 w-3.5" /> 30-DAY FORECAST ENGINE
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-[#a5b4fc] border border-white/10">
              Confidence: {model.confidence}%
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white">
            Predictive Price Drop Radar
          </h3>
        </div>

        {/* Model Switcher */}
        <div className="flex gap-2">
          {TREND_DATA.map((t, idx) => (
            <button
              key={t.title}
              type="button"
              onClick={() => {
                setSelectedIdx(idx);
                setTargetPrice(Math.round(t.currentPrice * 0.94));
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedIdx === idx
                  ? "bg-[#6366f1] text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                  : "bg-[#050512] text-[#a5b4fc] hover:text-white border border-[rgba(99,102,241,0.12)]"
              }`}
            >
              {t.title.split(" ")[0]} {t.title.split(" ")[1]}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8 items-center">
        {/* Left Column: Interactive Trend Graph */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#6471c4] font-bold">
                {model.category}
              </span>
              <h4 className="text-base md:text-lg font-bold text-white truncate max-w-[320px] sm:max-w-md">
                {model.title}
              </h4>
            </div>

            <div className="text-right">
              <div className="text-xs font-mono text-[#6471c4]">Current Price</div>
              <div className="text-xl md:text-2xl font-black text-white font-mono">
                ₹{model.currentPrice.toLocaleString("en-IN")}
              </div>
            </div>
          </div>

          {/* SVG Price Chart */}
          <div className="relative w-full h-48 bg-[#050512] rounded-2xl border border-[rgba(99,102,241,0.15)] p-4 overflow-hidden">
            {/* Grid scanlines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:100%_24px] pointer-events-none" />

            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area Fill */}
              <polygon points={areaPoints} fill="url(#trendGradient)" />

              {/* Trend Polyline */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={polylinePoints}
              />

              {/* Data points */}
              {model.history.map((price, i) => {
                const x = (i / (model.history.length - 1)) * 100;
                const y = 90 - ((price - minPrice) / range) * 75;
                const isHovered = hoveredWeek === i;
                const isLast = i === model.history.length - 1;

                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={isHovered ? 4 : isLast ? 3.5 : 2}
                    fill={isLast ? "#f59e0b" : "#10b981"}
                    stroke="#050512"
                    strokeWidth="1.5"
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredWeek(i)}
                    onMouseLeave={() => setHoveredWeek(null)}
                  />
                );
              })}
            </svg>

            {/* Price Overlay Tooltip */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-[#6471c4] pointer-events-none">
              <span>12 Weeks Ago: ₹{maxPrice.toLocaleString("en-IN")}</span>
              <span className="text-[#f59e0b] font-bold">
                {hoveredWeek !== null
                  ? `Week ${hoveredWeek + 1}: ₹${model.history[hoveredWeek].toLocaleString("en-IN")}`
                  : `Current: ₹${model.currentPrice.toLocaleString("en-IN")}`}
              </span>
              <span>30-Day Low: ₹{minPrice.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Stat Badges */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-[#090920] border border-[rgba(99,102,241,0.12)]">
              <div className="text-[9px] font-mono uppercase text-[#6471c4]">30-Day Net Shift</div>
              <div className="text-sm font-black text-[#10b981] font-mono mt-0.5">
                {model.changePct}% Drop
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#090920] border border-[rgba(99,102,241,0.12)]">
              <div className="text-[9px] font-mono uppercase text-[#6471c4]">All-Time Low</div>
              <div className="text-sm font-black text-white font-mono mt-0.5">
                ₹{model.allTimeLow.toLocaleString("en-IN")}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#090920] border border-[rgba(99,102,241,0.12)]">
              <div className="text-[9px] font-mono uppercase text-[#6471c4]">Peak Price</div>
              <div className="text-sm font-black text-white font-mono mt-0.5">
                ₹{model.allTimeHigh.toLocaleString("en-IN")}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Val's Buy/Wait Advice + Alert Simulator */}
        <div className="p-6 rounded-2xl bg-[#090920] border border-[rgba(99,102,241,0.18)] flex flex-col gap-5">
          {/* Recommendation Banner */}
          <div>
            <div className="text-[10px] font-mono uppercase text-[#6471c4] font-bold tracking-wider mb-2">
              VAL'S PURCHASE TIMING RECOMMENDATION
            </div>
            {model.recommendation === "BUY_NOW" ? (
              <div className="p-4 rounded-xl bg-[#10b981]/15 border border-[#10b981]/40 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#10b981] text-black flex items-center justify-center font-black shrink-0">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-[#10b981] uppercase tracking-wider">
                    BUY NOW — AT 30-DAY LOW
                  </div>
                  <div className="text-xs text-white mt-0.5 font-medium">
                    Price has bottomed out across retail stores. Further drop probability under 5%.
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#f59e0b]/15 border border-[#f59e0b]/40 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#f59e0b] text-black flex items-center justify-center font-black shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-[#f59e0b] uppercase tracking-wider">
                    RECOMMENDATION: WAIT ~{model.waitDays} DAYS
                  </div>
                  <div className="text-xs text-white mt-0.5 font-medium">
                    Cyclical festival sales projected to drop prices another 4-7%.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Target Price Alert Simulator */}
          <div className="pt-2 border-t border-[rgba(99,102,241,0.12)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                <Bell className="h-3.5 w-3.5 text-[#f59e0b]" /> Set Target Price Drop Alert
              </span>
              {potentialSavings > 0 && (
                <span className="text-[10px] font-mono text-[#10b981] font-bold">
                  Save ₹{potentialSavings.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            <form onSubmit={handleSetAlert} className="flex flex-col gap-2.5">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#6471c4]">
                  ₹
                </span>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(Number(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-2.5 bg-[#050512] border border-[rgba(99,102,241,0.2)] rounded-xl text-sm font-mono text-white focus:outline-none focus:border-[#6366f1]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#6366f1] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#5254e2] transition-colors flex items-center justify-center gap-2"
              >
                {alertSet ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-[#10b981]" /> Alert Scheduled!
                  </>
                ) : (
                  <>
                    <Bell className="h-3.5 w-3.5" /> Notify When Price Drops
                  </>
                )}
              </button>
            </form>

            <p className="text-[10px] text-[#6471c4] mt-2 text-center">
              Alerts check all 4 stores hourly in the background.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
