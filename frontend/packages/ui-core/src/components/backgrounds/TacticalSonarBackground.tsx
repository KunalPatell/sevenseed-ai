"use client";

import React from "react";

interface TacticalSonarBackgroundProps {
  className?: string;
}

export function TacticalSonarBackground({ className = "" }: TacticalSonarBackgroundProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Concentric Radar Rings & Crosshairs in Hero Area */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] pointer-events-none opacity-20">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border border-red-500/30" />
        {/* Middle Ring */}
        <div className="absolute inset-[150px] rounded-full border border-red-500/40 border-dashed" />
        {/* Inner Ring */}
        <div className="absolute inset-[300px] rounded-full border border-red-500/50" />
        {/* Core Ring */}
        <div className="absolute inset-[400px] rounded-full border border-red-500/60" />

        {/* Crosshair Axes */}
        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-red-500/30 -translate-x-1/2" />
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-red-500/30 -translate-y-1/2" />

        {/* Diagonal Graticules */}
        <div className="absolute inset-0 rotate-45">
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-red-500/20 -translate-x-1/2" />
          <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-red-500/20 -translate-y-1/2" />
        </div>

        {/* Sweeping Sonar Beam (360 rotate) */}
        <div className="absolute inset-0 rounded-full animate-spin [animation-duration:8s] [background:conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(239,68,68,0.25)_360deg)]" />

        {/* Threat Ping Markers */}
        <div className="absolute top-[220px] left-[320px] w-2 h-2 rounded-full bg-red-500 animate-ping" />
        <div className="absolute top-[220px] left-[320px] w-2 h-2 rounded-full bg-red-500" />
        <div className="absolute bottom-[280px] right-[260px] w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
      </div>

      {/* Military HUD Hex Grid Pattern */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: "radial-gradient(rgba(239, 68, 68, 0.4) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Top Banner Stencil */}
      <div className="absolute top-3 left-6 font-mono text-[9px] text-red-500/60 uppercase tracking-widest flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        DEFENSE_GRID // THREAT_LEVEL: ELEVATED // SECTOR: BNS_LEGAL_CYBER_SHIELD
      </div>
    </div>
  );
}
