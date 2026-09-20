"use client";

import React from "react";

interface BlueprintGridBackgroundProps {
  className?: string;
}

export function BlueprintGridBackground({ className = "" }: BlueprintGridBackgroundProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Precision CAD grid (10px subgrid, 50px major grid) */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(14, 165, 233, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(14, 165, 233, 0.2) 1px, transparent 1px),
            linear-gradient(to right, rgba(14, 165, 233, 0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(14, 165, 233, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px, 60px 60px, 12px 12px, 12px 12px",
        }}
      />

      {/* Blueprint Coordinate Crosshairs in Corners and Margins */}
      <div className="absolute top-4 left-4 font-mono text-[10px] text-sky-400/40 tracking-widest">
        + CAD_DSR_REF: 28°36&apos;42&quot;N 77°12&apos;18&quot;E [AXIS: X-00.00 Y-00.00]
      </div>
      <div className="absolute top-4 right-4 font-mono text-[10px] text-sky-400/40 tracking-widest">
        SCALE: 1:100 MM // CPWD 2023 SPEC
      </div>

      {/* Architectural Laser Horizon Line */}
      <div className="absolute top-1/3 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
      
      {/* Technical Blueprint Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_20%,transparent_0%,rgba(6,17,36,0.85)_100%)]" />
    </div>
  );
}
