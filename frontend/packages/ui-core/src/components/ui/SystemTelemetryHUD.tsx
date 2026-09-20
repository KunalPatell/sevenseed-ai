"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Cpu,
  Zap,
  Check,
  Copy,
  Terminal,
  Sparkles,
  Command,
} from "lucide-react";
import { profile } from "../../lib/data";
import { sound } from "../../lib/sound";

export function SystemTelemetryHUD() {
  const [latency, setLatency] = useState(18);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Subtle realistic latency fluctuation between 14ms and 24ms
    const interval = setInterval(() => {
      setLatency(Math.floor(14 + Math.random() * 10));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    sound.playSuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenCommandPalette = () => {
    sound.playClick();
    const event = new KeyboardEvent("keydown", { key: "k", ctrlKey: true });
    window.dispatchEvent(event);
  };

  return (
    <div className="w-full flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#080a0f]/80 p-2.5 sm:p-3 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      {/* Left: Availability & Live Status */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Pulsing Status Dot */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] text-emerald-400 backdrop-blur-md shadow-[0_0_12px_rgba(52,211,153,0.2)]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span className="font-semibold tracking-wide">
            AVAILABLE FOR HIRE
          </span>
        </div>

        {/* Telemetry Stats: Inference Latency */}
        <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-white/70">
          <Zap className="h-3 w-3 text-[#cfae6e]" />
          <span>INFERENCE:</span>
          <span className="font-bold text-[#9ed8ff]">{latency}ms</span>
        </div>

        {/* Active Multi-Agent Stack Pill */}
        <div className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-white/70">
          <Cpu className="h-3 w-3 text-[#9ed8ff]" />
          <span>STACK:</span>
          <span className="text-white/90">LangGraph • YOLOv8 • FastAPI</span>
        </div>
      </div>

      {/* Right: Quick Action Buttons (Command Center & Copy Email) */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleOpenCommandPalette}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] text-white/70 hover:border-[#9ed8ff]/50 hover:bg-[#9ed8ff]/10 hover:text-white transition-all shadow-sm"
        >
          <Command className="h-3 w-3 text-[#9ed8ff]" />
          <span className="hidden sm:inline">Command Palette</span>
          <kbd className="rounded bg-white/10 px-1 py-0.2 text-[9px] text-[#9ed8ff]">
            Ctrl+K
          </kbd>
        </button>

        <button
          onClick={handleCopyEmail}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#9ed8ff]/30 bg-[#9ed8ff]/10 px-3 py-1 font-mono text-[11px] text-[#9ed8ff] hover:bg-[#9ed8ff]/20 hover:border-[#9ed8ff]/60 transition-all"
          title="Copy Kunal's Email"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">COPIED</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>{profile.email}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
