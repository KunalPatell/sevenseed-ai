"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Swords,
  Cpu,
  Loader2,
  Sparkles,
  Check,
  Award,
  RefreshCw,
  Zap,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

const API_BASE = "/avp-emart";

interface SpecRow {
  spec: string;
  a: string;
  b: string;
}

const PRESET_MATCHUPS = [
  {
    nameA: "Apple iPhone 15 Pro",
    nameB: "Samsung Galaxy S24",
    tag: "Flagship Mobile",
    defaultSpecs: [
      { spec: "Display", a: "6.1\" Super Retina XDR OLED (120Hz ProMotion)", b: "6.2\" Dynamic AMOLED 2X (120Hz, 2600 nits)" },
      { spec: "Processor", a: "Apple A17 Pro (3nm, 6-core)", b: "Snapdragon 8 Gen 3 (4nm, Octa-Core)" },
      { spec: "Primary Camera", a: "48MP Main + 12MP Ultra-wide + 3x Telephoto", b: "50MP Main (OIS) + 12MP Ultra-wide + 10MP Telephoto" },
      { spec: "Battery & Charging", a: "Up to 23 hrs video (MagSafe 15W)", b: "4,000 mAh (25W Wired, 15W Wireless)" },
      { spec: "Operating System", a: "iOS 18 (Apple Intelligence)", b: "Android 14 (One UI 6.1, Galaxy AI)" },
      { spec: "Build & Protection", a: "Grade 5 Titanium / Ceramic Shield", b: "Armor Aluminum 2 / Gorilla Glass Victus 2" },
    ],
    verdict: "iPhone 15 Pro wins on GPU benchmark performance and titanium lightweight build; Galaxy S24 wins on peak display brightness (2600 nits) and versatility.",
  },
  {
    nameA: "MacBook Air M3 (13.6-inch)",
    nameB: "Dell XPS 13 (Intel Core Ultra 7)",
    tag: "Ultrabooks",
    defaultSpecs: [
      { spec: "Processor / CPU", a: "Apple M3 (8-core CPU / 10-core GPU)", b: "Intel Core Ultra 7 155H (16-core)" },
      { spec: "Display", a: "13.6\" Liquid Retina (500 nits, P3 Wide Color)", b: "13.4\" FHD+ / 3K OLED InfinityEdge (500 nits)" },
      { spec: "Battery Endurance", a: "Up to 18 Hours (Fanless Silent)", b: "Up to 12 Hours (Active Dual-Fan)" },
      { spec: "Memory & Storage", a: "16GB Unified Memory / 512GB SSD", b: "16GB LPDDR5X / 512GB PCIe NVMe" },
      { spec: "Chassis & Weight", a: "1.24 kg (11.3mm Ultra-thin Aluminum)", b: "1.19 kg (CNC Machined Aluminum)" },
      { spec: "Thermals & Sound", a: "Zero fan noise (passive cooling)", b: "Dual fans under high multicore load" },
    ],
    verdict: "MacBook Air M3 dominates battery endurance (18 hrs) and silent thermal performance; Dell XPS 13 offers OLED touch display options.",
  },
  {
    nameA: "Sony WH-1000XM5",
    nameB: "Bose QuietComfort Ultra",
    tag: "ANC Headphones",
    defaultSpecs: [
      { spec: "Active Noise Canceling", a: "Dual Processor V1 + QN1 (8 Microphones)", b: "Custom Immersive Audio ANC Array" },
      { spec: "Battery Playtime", a: "30 Hours (ANC ON) / 40 Hours (ANC OFF)", b: "24 Hours (ANC ON) / 18 Hours (Immersive)" },
      { spec: "High-Res Audio Codecs", a: "LDAC, AAC, SBC (Multipoint Bluetooth 5.3)", b: "aptX Adaptive, AAC, SBC (Bluetooth 5.3)" },
      { spec: "Microphone Clarity", a: "4 Beamforming Mics + AI Noise Suppression", b: "Quad-Mic Array with Wind Filtering" },
      { spec: "Weight & Comfort", a: "250g (Soft Ergonomic Synthetic Leather)", b: "253g (Plush Cushioned Headband)" },
    ],
    verdict: "Sony WH-1000XM5 leads in battery runtime (30h) and LDAC fidelity; Bose QC Ultra delivers unmatched spatial immersion.",
  },
];

export function SpecCompareStudio() {
  const [activeMatchupIdx, setActiveMatchupIdx] = useState(0);
  const [productA, setProductA] = useState(PRESET_MATCHUPS[0].nameA);
  const [productB, setProductB] = useState(PRESET_MATCHUPS[0].nameB);
  const [specs, setSpecs] = useState<SpecRow[]>(PRESET_MATCHUPS[0].defaultSpecs);
  const [verdict, setVerdict] = useState(PRESET_MATCHUPS[0].verdict);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [provider, setProvider] = useState("AI Engine");

  const handleSelectPreset = (idx: number) => {
    setActiveMatchupIdx(idx);
    const preset = PRESET_MATCHUPS[idx];
    setProductA(preset.nameA);
    setProductB(preset.nameB);
    setSpecs(preset.defaultSpecs);
    setVerdict(preset.verdict);
    setError("");
  };

  const handleRunComparison = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!productA.trim() || !productB.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/spec-compare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_a: productA.trim(), product_b: productB.trim() }),
      });

      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();

      if (data.success && Array.isArray(data.specs) && data.specs.length > 0) {
        setSpecs(data.specs);
        setProvider(data.provider || "AI Engine");
        setVerdict(`Analyzed side-by-side specs for ${productA} vs ${productB} across core hardware benchmarks.`);
      } else {
        setError(data.error || "Could not retrieve specs comparison.");
      }
    } catch {
      setError("AI comparison service is currently in offline mode.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-3xl border border-[rgba(99,102,241,0.25)] bg-[#070716] shadow-[0_0_80px_rgba(99,102,241,0.1)] overflow-hidden">
      {/* Studio Header */}
      <div className="p-6 md:p-8 bg-[#090920] border-b border-[rgba(99,102,241,0.12)]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6366f1] to-[#ec4899] flex items-center justify-center text-white shadow-lg">
              <Swords className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#f59e0b] block">
                HEAD-TO-HEAD STUDIO
              </span>
              <h3 className="text-xl md:text-2xl font-black text-white">
                AI Spec Compare Engine
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-[rgba(99,102,241,0.1)] border border-[rgba(99,102,241,0.25)] text-[#a5b4fc]">
              Provider: {provider}
            </span>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-[10px] font-mono uppercase text-[#6471c4] shrink-0 font-bold">Presets:</span>
          {PRESET_MATCHUPS.map((m, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(idx)}
              className={`text-xs px-3.5 py-1.5 rounded-lg border font-medium shrink-0 transition-all flex items-center gap-2 ${
                activeMatchupIdx === idx
                  ? "bg-[#6366f1]/20 border-[#6366f1] text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                  : "bg-[#050512] border-[rgba(99,102,241,0.12)] text-[#a5b4fc] hover:text-white"
              }`}
            >
              <span>{m.nameA.split(" ")[0]} vs {m.nameB.split(" ")[0]}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 font-mono text-[#6471c4]">{m.tag}</span>
            </button>
          ))}
        </div>

        {/* Interactive Dual-Product Input Form */}
        <form onSubmit={handleRunComparison} className="mt-5 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto] gap-3 items-center">
          <div className="relative">
            <label className="block text-[10px] font-mono uppercase text-[#6471c4] mb-1 font-bold">Product A</label>
            <input
              type="text"
              value={productA}
              onChange={(e) => setProductA(e.target.value)}
              placeholder="e.g. iPhone 15"
              className="w-full px-4 py-2.5 bg-[#050512] border border-[rgba(99,102,241,0.2)] rounded-xl text-sm text-white focus:outline-none focus:border-[#6366f1] transition-all"
            />
          </div>

          <div className="flex justify-center pt-4 md:pt-0">
            <div className="w-8 h-8 rounded-full bg-[#6366f1]/20 border border-[#6366f1]/40 flex items-center justify-center text-xs font-black text-white">
              VS
            </div>
          </div>

          <div className="relative">
            <label className="block text-[10px] font-mono uppercase text-[#6471c4] mb-1 font-bold">Product B</label>
            <input
              type="text"
              value={productB}
              onChange={(e) => setProductB(e.target.value)}
              placeholder="e.g. Samsung Galaxy S24"
              className="w-full px-4 py-2.5 bg-[#050512] border border-[rgba(99,102,241,0.2)] rounded-xl text-sm text-white focus:outline-none focus:border-[#6366f1] transition-all"
            />
          </div>

          <div className="pt-4 md:pt-0">
            <button
              type="submit"
              disabled={loading || !productA.trim() || !productB.trim()}
              className="w-full md:w-auto mt-0 md:mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#ec4899] text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Cpu className="h-4 w-4" />}
              Compare Specs
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-3 text-xs text-[#f43f5e] font-medium flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}
      </div>

      {/* Side-by-Side Comparison Scorecard */}
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_2fr_2fr] gap-3 pb-3 border-b border-[rgba(99,102,241,0.15)] text-xs font-mono font-bold uppercase tracking-wider text-[#a5b4fc]">
          <div>Specification Metric</div>
          <div className="text-white truncate">{productA}</div>
          <div className="text-[#38bdf8] truncate">{productB}</div>
        </div>

        <div className="divide-y divide-[rgba(99,102,241,0.08)]">
          <AnimatePresence mode="popLayout">
            {specs.map((row, i) => (
              <motion.div
                key={`${row.spec}-${i}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                className="grid grid-cols-1 md:grid-cols-[1.5fr_2fr_2fr] gap-3 py-3.5 text-xs items-center hover:bg-white/[0.02] rounded-xl px-2 transition-colors"
              >
                <div className="font-bold text-[#a5b4fc] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1]" />
                  {row.spec}
                </div>
                <div className="text-white font-medium bg-[#050512] md:bg-transparent p-2 md:p-0 rounded-lg border md:border-0 border-white/5">
                  <span className="md:hidden text-[10px] text-[#6471c4] block mb-0.5">{productA}</span>
                  {row.a}
                </div>
                <div className="text-[#cbd5e1] font-medium bg-[#050512] md:bg-transparent p-2 md:p-0 rounded-lg border md:border-0 border-white/5">
                  <span className="md:hidden text-[10px] text-[#38bdf8] block mb-0.5">{productB}</span>
                  {row.b}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Verdict Callout */}
        <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-[#6366f1]/10 via-[#ec4899]/10 to-transparent border border-[rgba(99,102,241,0.2)] flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-xl bg-[#6366f1]/20 border border-[#6366f1]/40 flex items-center justify-center shrink-0 mt-0.5">
            <Award className="h-4 w-4 text-[#a5b4fc]" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#f59e0b]">
              Val's Matchup Assessment
            </div>
            <p className="text-xs md:text-sm text-white mt-1 leading-relaxed font-medium">
              {verdict}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
