"use client";

import React from "react";

interface CyberGridBackgroundProps {
  color?: string;
  className?: string;
}

export function CyberGridBackground({
  color = "rgba(16, 185, 129, 0.15)",
  className = "",
}: CyberGridBackgroundProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* 3D Perspective Grid */}
      <div
        className="absolute inset-0 opacity-40 [perspective:1000px]"
        style={{
          backgroundImage: `linear-gradient(to right, ${color} 1px, transparent 1px), linear-gradient(to bottom, ${color} 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)",
        }}
      />
      {/* Glowing Horizon Accent */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-emerald-500/10 to-transparent" />
    </div>
  );
}
