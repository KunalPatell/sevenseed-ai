"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArgusAvatar } from "./ArgusAvatar";

const READOUTS = [
  {
    label: "Scans for",
    value: "10 defect classes",
    detail: "wall cracks, tile, pipes, switches, glass, wood…",
  },
  {
    label: "Checks against",
    value: "IS 456 · IS 800 · NBC 2016",
    detail: "Indian structural & building codes",
  },
  {
    label: "Returns",
    value: "repair steps + a cost range",
    detail: "from a photo, not a site visit",
  },
];

/**
 * Hero HUD readout — replaces the generic 4-box stat grid with a panel
 * built around Argus, the inspection agent that actually powers the
 * defect scanner and BOQ tools below. Kept as a single responsive column
 * on narrow screens so it never forces horizontal scroll.
 */
export function InspectionHUD() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="hud-panel w-full max-w-[900px] mb-12"
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 p-5 sm:p-7">
        <div className="flex items-center gap-4 shrink-0">
          <ArgusAvatar size={60} />
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-wide text-white">ARGUS</span>
              <span className="hud-dot" aria-hidden="true" />
            </div>
            <div className="text-[10px] font-mono text-[#c8c0b8] uppercase tracking-wider mt-0.5">
              Site Inspection Agent
            </div>
          </div>
        </div>

        <div className="hidden sm:block w-px self-stretch bg-white/10" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 flex-1 w-full text-center sm:text-left">
          {READOUTS.map((r) => (
            <div key={r.label}>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#7c7268] mb-1">
                {r.label}
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#fef3c7] font-mono leading-snug">
                {r.value}
              </div>
              <div className="text-[11px] text-[#c8c0b8] mt-0.5 leading-relaxed">{r.detail}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="hud-sweep" aria-hidden="true" />
    </motion.div>
  );
}
