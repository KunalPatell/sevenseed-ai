"use client";

import React from "react";
import { Meteors } from "./Meteors";

interface GoldenAuraBackgroundProps {
  className?: string;
}

export function GoldenAuraBackground({ className = "" }: GoldenAuraBackgroundProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Radiant Central Sunlight Beam */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[700px] rounded-full bg-[radial-gradient(circle_at_50%_0%,rgba(234,179,8,0.18)_0%,rgba(217,119,6,0.08)_40%,transparent_75%)] blur-2xl" />

      {/* Subtle Golden Diamond Matrix */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: "radial-gradient(rgba(234, 179, 8, 0.4) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Gentle Golden Meteors */}
      <Meteors number={15} className="!from-amber-400 !to-transparent" />

      {/* Emerald & Gold Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/20 to-emerald-950/60" />
    </div>
  );
}
