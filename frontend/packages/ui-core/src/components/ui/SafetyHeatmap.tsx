"use client";

import React, { useState } from "react";
import { MapPinned, AlertTriangle, ShieldCheck } from "lucide-react";

type Zone = { id: string; name: string; risk: number; lastIncident: string };

const ZONES: Zone[] = [
  { id: "z1", name: "Infocity Circle", risk: 78, lastIncident: "Snatching, 2 days ago" },
  { id: "z2", name: "Maninagar Bus Depot", risk: 62, lastIncident: "Pickpocketing, 5 days ago" },
  { id: "z3", name: "Kankaria Lakefront", risk: 24, lastIncident: "Lost article, 9 days ago" },
  { id: "z4", name: "SG Highway Junction", risk: 45, lastIncident: "Chain snatching, 1 week ago" },
  { id: "z5", name: "Naranpura Market", risk: 33, lastIncident: "None reported, 3 weeks" },
  { id: "z6", name: "Vastrapur Lake", risk: 12, lastIncident: "None reported, 1 month" },
];

function riskColor(risk: number) {
  if (risk >= 60) return { bg: "bg-rose-500/20", border: "border-rose-500/50", text: "text-rose-400", label: "High Alert" };
  if (risk >= 35) return { bg: "bg-amber-500/20", border: "border-amber-500/50", text: "text-amber-400", label: "Moderate" };
  return { bg: "bg-emerald-500/20", border: "border-emerald-500/50", text: "text-emerald-400", label: "Low Risk" };
}

export function SafetyHeatmap() {
  const [selected, setSelected] = useState<Zone>(ZONES[0]);
  const meta = riskColor(selected.risk);

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl border border-red-900/40 bg-red-950/10 backdrop-blur-xl overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-red-900/40 text-sm font-bold text-slate-100">
        <MapPinned className="w-4 h-4 text-red-400" />
        <span>Neighborhood Safety Heatmap</span>
        <span className="text-[10px] font-mono text-slate-500">(based on filed reports, last 30 days)</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-5">
        {ZONES.map((z) => {
          const c = riskColor(z.risk);
          return (
            <button
              key={z.id}
              onClick={() => setSelected(z)}
              className={`p-3.5 rounded-xl border text-left transition-all ${c.bg} ${
                selected.id === z.id ? `${c.border} ring-1 ring-offset-0` : "border-transparent hover:border-white/10"
              }`}
            >
              <div className="text-xs font-bold text-slate-100">{z.name}</div>
              <div className={`text-[11px] font-mono mt-1 ${c.text}`}>{z.risk}/100 · {c.label}</div>
            </button>
          );
        })}
      </div>

      <div className={`m-5 mt-0 p-4 rounded-xl border flex items-start gap-3 ${meta.bg} ${meta.border}`}>
        {selected.risk >= 35 ? (
          <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${meta.text}`} />
        ) : (
          <ShieldCheck className={`w-4 h-4 shrink-0 mt-0.5 ${meta.text}`} />
        )}
        <div>
          <div className={`text-xs font-bold ${meta.text}`}>{selected.name} — {meta.label}</div>
          <p className="text-xs text-slate-300 mt-0.5">Most recent: {selected.lastIncident}. Stay alert during low-light hours and avoid isolated routes.</p>
        </div>
      </div>
    </div>
  );
}
