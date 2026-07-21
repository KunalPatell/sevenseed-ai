"use client";

import React from "react";
import { GraduationCap, Stethoscope, Sprout } from "lucide-react";
import { AshaAvatar } from "./AshaAvatar";

// Figures below are the Trust's own published 2024–25 impact numbers
// (see backend/trust_data.py::IMPACT_METRICS) — not marketing placeholders.
const CATEGORIES = [
  {
    icon: GraduationCap,
    label: "Education",
    value: "847 students",
    detail: "merit-cum-means scholarships, 2024–25",
  },
  {
    icon: Stethoscope,
    label: "Healthcare",
    value: "12,300 people",
    detail: "across 96 village health camps",
  },
  {
    icon: Sprout,
    label: "Livelihood",
    value: "634 grads · 42 SHGs",
    detail: "vocational training & women's self-help groups",
  },
];

function Connector({ orientation }: { orientation: "h" | "v" }) {
  if (orientation === "h") {
    return (
      <div className="hidden md:block relative overflow-visible flow-connector w-8 lg:w-12 h-[2px] self-center rounded-full shrink-0">
        <span className="flow-dot" />
      </div>
    );
  }
  return (
    <div className="md:hidden relative overflow-visible flow-connector vertical w-[2px] h-7 mx-auto rounded-full shrink-0">
      <span className="flow-dot" />
    </div>
  );
}

/**
 * Donations → programs → community-impact flow, built around AVP Trust's
 * real 2024–25 numbers instead of a generic stat-card row. Ribbon widths
 * are intentionally uniform (not scaled to value) since the categories use
 * different units (students / people / groups) — the numbers carry the
 * data, the flow just carries the story. Stacks to a single column below
 * the md breakpoint so nothing overflows at phone widths.
 */
export function ImpactFlowDiagram() {
  return (
    <div className="flow-node rounded-2xl p-5 sm:p-7">
      <div className="flex items-center gap-3 mb-6">
        <AshaAvatar size={36} />
        <div>
          <div className="text-sm font-bold text-white">Where a donation goes</div>
          <div className="text-[11px] text-[#c8bdc0] font-mono">Asha tracks it end to end · FY 2024–25</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-stretch gap-2 md:gap-0">
        <div className="flow-node rounded-xl p-4 md:p-5 flex flex-col justify-center items-center text-center md:w-[170px] shrink-0">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#7c7073]">Donated</div>
          <div className="text-xl sm:text-2xl font-black text-[#ffe4e6] font-mono mt-1">₹38.2L</div>
          <div className="text-[10px] text-[#c8bdc0] mt-1">received, FY 2024–25</div>
        </div>

        <Connector orientation="h" />
        <Connector orientation="v" />

        <div className="flex flex-col gap-2 flex-1">
          {CATEGORIES.map((c) => (
            <div key={c.label} className="flow-node rounded-xl p-3 sm:p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg grid place-items-center bg-[#f43f5e]/15 text-[#ffe4e6] shrink-0">
                <c.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-xs font-bold text-white">{c.label}</span>
                  <span className="text-[11px] font-mono text-[#fef3c7]">{c.value}</span>
                </div>
                <div className="text-[10px] text-[#c8bdc0] mt-0.5">{c.detail}</div>
              </div>
            </div>
          ))}
        </div>

        <Connector orientation="h" />
        <Connector orientation="v" />

        <div className="flow-node rounded-xl p-4 md:p-5 flex flex-col justify-center items-center text-center md:w-[170px] shrink-0">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#7c7073]">Utilized</div>
          <div className="text-xl sm:text-2xl font-black text-[#fef3c7] font-mono mt-1">₹34.7L</div>
          <div className="text-[10px] text-[#c8bdc0] mt-1">~91% of funds spent directly on programs</div>
        </div>
      </div>
    </div>
  );
}
