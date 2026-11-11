"use client";

import React from "react";
import { Hospital, PhoneCall, MapPin, AlertCircle, ExternalLink } from "lucide-react";

// Emergency hospital finder. Sevenseed has no live bed-availability feed, so no bed
// counts are shown (they used to be invented numbers, which is dangerous in an
// emergency). It offers the national emergency numbers, a nearest-hospital map search,
// and directions to major hospitals.

const HOSPITALS = [
  { name: "Civil Hospital Ahmedabad", area: "Asarwa, Ahmedabad", type: "Government" },
  { name: "SVP Hospital", area: "Ellis Bridge, Ahmedabad", type: "Municipal" },
  { name: "GMERS Medical College & Civil Hospital Sola", area: "Sola, Ahmedabad", type: "Government" },
  { name: "Apollo Hospitals International", area: "Bhat, Gandhinagar", type: "Private" },
  { name: "Zydus Hospital", area: "Thaltej, Ahmedabad", type: "Private" },
];
const maps = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export function HospitalBedRadar() {
  return (
    <div className="w-full max-w-5xl mx-auto p-5 md:p-8 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <Hospital className="w-4 h-4" /> Emergency help
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Find a Hospital Fast</h1>
        <p className="text-slate-300 text-sm mt-2 max-w-xl mx-auto">In an emergency, call first. Then use the map to find the nearest hospital and call ahead to check that it has a bed for you.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <a href="tel:108" className="p-5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-4">
          <PhoneCall className="w-8 h-8" /><div><div className="text-3xl font-black font-mono">108</div><div className="text-sm">Free ambulance</div></div>
        </a>
        <a href="tel:112" className="p-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-4 border border-slate-700">
          <PhoneCall className="w-8 h-8 text-rose-300" /><div><div className="text-3xl font-black font-mono">112</div><div className="text-sm">All emergencies</div></div>
        </a>
      </div>

      <a href={maps("hospital emergency near me")} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full p-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
        <MapPin className="w-5 h-5" /> Show hospitals near me on the map <ExternalLink className="w-4 h-4" />
      </a>

      <section>
        <h2 className="text-lg font-bold text-white">Major hospitals in Ahmedabad &amp; Gandhinagar</h2>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          {HOSPITALS.map((h) => (
            <div key={h.name} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between items-center gap-3">
              <div>
                <h3 className="text-base font-bold text-white">{h.name}</h3>
                <p className="text-sm text-slate-400">{h.area} · {h.type}</p>
              </div>
              <a href={maps(`${h.name}, ${h.area}`)} target="_blank" rel="noopener noreferrer" className="shrink-0 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold inline-flex items-center gap-1 border border-slate-700">
                <MapPin className="w-4 h-4" /> Directions
              </a>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs text-slate-400 flex gap-2"><AlertCircle className="w-4 h-4 shrink-0 text-amber-400" /> We don't have live bed availability. The map shows each hospital's current phone number; call before you travel if the patient is stable.</p>
    </div>
  );
}
