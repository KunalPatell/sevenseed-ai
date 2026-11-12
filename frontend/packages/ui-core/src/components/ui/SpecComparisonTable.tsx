"use client";

import React, { useState } from "react";
import { Check, Trophy, Sparkles, Star, ChevronDown, ArrowRight, ShoppingCart } from "lucide-react";

export interface ComparedProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  specScore: number; // 0-100 proprietary metric
  image: string;
  specs: {
    processor: string;
    ram: string;
    storage: string;
    display: string;
    battery: string;
    charging: string;
    camera: string;
    connectivity: string;
  };
  pros: string[];
  cons: string[];
}

const defaultProducts: ComparedProduct[] = [
  {
    id: "prod-1",
    name: "NeuralEdge Workstation Pro",
    brand: "Sevenseed Hardware",
    price: 124999,
    originalPrice: 149999,
    specScore: 94,
    image: "💻",
    specs: {
      processor: "Apple M3 Max / 16-Core CPU",
      ram: "64GB Unified Memory (400GB/s)",
      storage: "2TB NVMe PCIe 4.0 SSD",
      display: "16.2-inch Liquid Retina XDR (120Hz)",
      battery: "100Wh (22-Hour Battery Life)",
      charging: "140W Fast MagSafe",
      camera: "1080p Neural FaceTime HD",
      connectivity: "Wi-Fi 7 + Thunderbolt 4 x3"
    },
    pros: ["Highest memory bandwidth in category", "Silent thermal performance under AI load", "Top-tier mini-LED display"],
    cons: ["Premium price point", "RAM non-upgradeable"]
  },
  {
    id: "prod-2",
    name: "RTX 4090 AI Studio Beast",
    brand: "AVP Tech Labs",
    price: 119999,
    originalPrice: 139999,
    specScore: 89,
    image: "🖥️",
    specs: {
      processor: "Intel Core i9-14900HX",
      ram: "32GB DDR5 5600MHz (Upgradeable)",
      storage: "1TB Gen4 NVMe SSD",
      display: "16-inch QHD+ 240Hz IPS",
      battery: "90Wh (6-Hour Battery Life)",
      charging: "330W Power Adapter",
      camera: "FHD IR with Windows Hello",
      connectivity: "Wi-Fi 6E + 2.5G Ethernet"
    },
    pros: ["Full-power 175W RTX 4090 GPU", "Dual upgradeable SO-DIMM slots", "Higher refresh rate display"],
    cons: ["Heavy 2.8kg weight with power brick", "Short battery runtime"]
  }
];

export function SpecComparisonTable({
  products = defaultProducts,
  className = "",
}: {
  products?: ComparedProduct[];
  className?: string;
}) {
  const [activeTab, setActiveTab] = useState<"specs" | "proscons">("specs");

  const specKeys: (keyof ComparedProduct["specs"])[] = [
    "processor",
    "ram",
    "storage",
    "display",
    "battery",
    "charging",
    "camera",
    "connectivity",
  ];

  return (
    <div className={`w-full bg-[#050814] border border-slate-800 rounded-2xl p-6 space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="text-xs font-mono uppercase text-sky-400">Spec Compare Engine (Smartprix System)</div>
          <h3 className="text-xl font-bold text-slate-100">Side-by-Side Hardware Analysis</h3>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-mono">
          <button
            onClick={() => setActiveTab("specs")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "specs" ? "bg-sky-500 text-black font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            Technical Specs
          </button>
          <button
            onClick={() => setActiveTab("proscons")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "proscons" ? "bg-sky-500 text-black font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            Pros & Cons
          </button>
        </div>
      </div>

      {/* Product Cards Top Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((p, idx) => {
          const isWinner = idx === 0;
          return (
            <div
              key={p.id}
              className={`relative p-5 rounded-xl border flex flex-col justify-between transition-all ${
                isWinner
                  ? "bg-slate-900/80 border-sky-400 shadow-xl shadow-sky-500/10"
                  : "bg-slate-950/80 border-slate-800"
              }`}
            >
              {isWinner && (
                <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 text-black text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <Trophy className="w-3 h-3" />
                  <span>Editor's Choice</span>
                </div>
              )}

              <div>
                <div className="flex items-center gap-3">
                  <div className="text-3xl p-2 rounded-xl bg-slate-800/80 border border-slate-700">{p.image}</div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400">{p.brand}</span>
                    <h4 className="text-base font-bold text-slate-100">{p.name}</h4>
                  </div>
                </div>

                {/* Price & Spec Score Gauge */}
                <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/80">
                  <div>
                    <div className="text-xs text-slate-500 line-through font-mono">₹{p.originalPrice.toLocaleString()}</div>
                    <div className="text-lg font-bold text-emerald-400 font-mono">₹{p.price.toLocaleString()}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] font-mono uppercase text-slate-400">Spec Score</div>
                    <div className="inline-flex items-center gap-1 text-sm font-bold font-mono px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300">
                      <Star className="w-3.5 h-3.5 fill-current text-sky-400" />
                      <span>{p.specScore} / 100</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
                <button className="flex-1 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-black text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors">
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Buy on AVP E-Mart</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Rows */}
      {activeTab === "specs" ? (
        <div className="border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800/80 text-xs font-mono">
          {specKeys.map((key) => (
            <div key={key} className="grid grid-cols-1 md:grid-cols-3 p-3.5 hover:bg-slate-900/40 transition-colors">
              <div className="text-slate-400 uppercase font-semibold capitalize pb-1 md:pb-0">{key}</div>
              <div className="text-slate-200">{products[0]?.specs[key]}</div>
              <div className="text-slate-300 pt-1 md:pt-0">{products[1]?.specs[key]}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {products.map((p) => (
            <div key={p.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div>
                <span className="text-emerald-400 font-bold uppercase block mb-1.5">✓ Key Advantages</span>
                <ul className="space-y-1 text-slate-300">
                  {p.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-2 border-t border-slate-900">
                <span className="text-rose-400 font-bold uppercase block mb-1.5">✗ Trade-offs</span>
                <ul className="space-y-1 text-slate-400">
                  {p.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold shrink-0">·</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
