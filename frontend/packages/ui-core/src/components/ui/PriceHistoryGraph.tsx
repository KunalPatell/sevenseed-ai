"use client";

import React, { useState } from "react";
import { TrendingDown, Bell, ShieldCheck, AlertCircle, ArrowUpRight, CheckCircle2 } from "lucide-react";

export function PriceHistoryGraph({
  productName = "NeuralEdge Workstation Pro",
  currentPrice = 124999,
  highestPrice = 149999,
  lowestPrice = 118500,
  className = "",
}: {
  productName?: string;
  currentPrice?: number;
  highestPrice?: number;
  lowestPrice?: number;
  className?: string;
}) {
  const [targetAlertPrice, setTargetAlertPrice] = useState(120000);
  const [alertSubscribed, setAlertSubscribed] = useState(false);
  const [timeframe, setTimeframe] = useState<"30d" | "60d" | "90d">("90d");

  // Synthetic price points across 90 days
  const points = [
    { day: "Day 1", price: 149999 },
    { day: "Day 15", price: 144999 },
    { day: "Day 30", price: 139999 },
    { day: "Day 45", price: 132000 },
    { day: "Day 60", price: 118500 }, // Lowest dip (Festival)
    { day: "Day 75", price: 129999 },
    { day: "Day 90", price: 124999 }, // Current
  ];

  const minP = 110000;
  const maxP = 155000;
  const svgWidth = 600;
  const svgHeight = 200;

  const getCoordinates = (index: number, price: number) => {
    const x = (index / (points.length - 1)) * (svgWidth - 40) + 20;
    const y = svgHeight - 20 - ((price - minP) / (maxP - minP)) * (svgHeight - 40);
    return { x, y };
  };

  const pathD = points
    .map((p, idx) => {
      const { x, y } = getCoordinates(idx, p.price);
      return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  const areaD = `${pathD} L ${svgWidth - 20} ${svgHeight - 20} L 20 ${svgHeight - 20} Z`;

  return (
    <div className={`w-full bg-[#050814] border border-slate-800 rounded-2xl p-6 space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="text-xs font-mono uppercase text-sky-400">Price Intelligence Engine (BuyHatke System)</div>
          <h3 className="text-xl font-bold text-slate-100">{productName} — 90-Day Trend</h3>
        </div>

        <div className="flex items-center gap-2">
          {(["30d", "60d", "90d"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                timeframe === tf ? "bg-sky-500 text-black font-bold" : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-slate-500 uppercase block text-[10px]">Current Price</span>
          <span className="text-base font-bold text-slate-100 font-mono">₹{currentPrice.toLocaleString()}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-slate-500 uppercase block text-[10px]">All-Time Low</span>
          <span className="text-base font-bold text-emerald-400 font-mono">₹{lowestPrice.toLocaleString()}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-slate-500 uppercase block text-[10px]">All-Time High</span>
          <span className="text-base font-bold text-rose-400 font-mono">₹{highestPrice.toLocaleString()}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-slate-500 uppercase block text-[10px]">Verdict</span>
            <span className="text-xs font-bold text-sky-400">Good Time to Buy</span>
          </div>
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
        </div>
      </div>

      {/* SVG Price Chart */}
      <div className="relative w-full h-[220px] bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 overflow-hidden">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="20" y1="40" x2={svgWidth - 20} y2="40" stroke="#1e293b" strokeDasharray="4 4" />
          <line x1="20" y1="100" x2={svgWidth - 20} y2="100" stroke="#1e293b" strokeDasharray="4 4" />
          <line x1="20" y1="160" x2={svgWidth - 20} y2="160" stroke="#1e293b" strokeDasharray="4 4" />

          {/* Area fill */}
          <path d={areaD} fill="url(#chartFill)" />

          {/* Line stroke */}
          <path d={pathD} fill="none" stroke="#38bdf8" strokeWidth="2.5" />

          {/* Points */}
          {points.map((p, idx) => {
            const { x, y } = getCoordinates(idx, p.price);
            const isLowest = p.price === lowestPrice;
            const isCurrent = idx === points.length - 1;
            return (
              <g key={idx}>
                <circle
                  cx={x}
                  cy={y}
                  r={isLowest || isCurrent ? 5 : 3.5}
                  fill={isLowest ? "#10b981" : isCurrent ? "#38bdf8" : "#64748b"}
                  stroke="#050814"
                  strokeWidth="2"
                />
                {(isLowest || isCurrent) && (
                  <text
                    x={x}
                    y={y - 10}
                    textAnchor="middle"
                    fill={isLowest ? "#10b981" : "#38bdf8"}
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    ₹{p.price.toLocaleString()}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Price Drop Alert Trigger Slider */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-mono uppercase text-slate-300 font-bold">
              Automated Price Drop Alert
            </span>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            Alert me when price drops below: ₹{targetAlertPrice.toLocaleString()}
          </span>
        </div>

        <input
          type="range"
          min={lowestPrice - 5000}
          max={currentPrice}
          step={1000}
          value={targetAlertPrice}
          onChange={(e) => setTargetAlertPrice(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
        />

        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] font-mono text-slate-500">Min: ₹{(lowestPrice - 5000).toLocaleString()}</span>
          <button
            onClick={() => setAlertSubscribed(true)}
            disabled={alertSubscribed}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
              alertSubscribed
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "bg-sky-500 hover:bg-sky-400 text-black"
            }`}
          >
            {alertSubscribed ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Alert Active! (Instant Email/SMS Triggered)</span>
              </>
            ) : (
              <span>Set Alert</span>
            )}
          </button>
          <span className="text-[10px] font-mono text-slate-500">Current: ₹{currentPrice.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
