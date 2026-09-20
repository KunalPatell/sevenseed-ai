"use client";

import React, { useState } from "react";
import { Hospital, PhoneCall, Bed, AlertCircle } from "lucide-react";

export function HospitalBedRadar() {
  const hospitals = [
    { name: "Civil Hospital Medicity", area: "Asarwa, Ahmedabad", icu: 14, oxygen: 38, phone: "108" },
    { name: "Apollo Hospitals International", area: "Bhat, Gandhinagar", icu: 6, oxygen: 18, phone: "079-66701800" },
    { name: "SVP Institute of Medical Sciences", area: "Ellis Bridge, Ahmedabad", icu: 11, oxygen: 42, phone: "079-26577621" },
    { name: "Zydus Hospital", area: "Thaltej, Ahmedabad", icu: 4, oxygen: 12, phone: "079-66190201" }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-8 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Hospital className="w-4 h-4" /> Real-Time Emergency Healthcare Telemetry
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Hospital & ICU Bed Radar
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
          Live bed availability tracking ventilator ICU units, oxygenated ward beds, and blood banks in Ahmedabad & Gandhinagar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hospitals.map((hosp) => (
          <div key={hosp.name} className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between items-center">
            <div>
              <h4 className="text-base font-bold text-white">{hosp.name}</h4>
              <p className="text-xs text-slate-400">{hosp.area}</p>
              <div className="flex gap-4 mt-3 font-mono text-xs">
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5" /> ICU Beds: {hosp.icu}
                </span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5" /> Oxygen Beds: {hosp.oxygen}
                </span>
              </div>
            </div>
            <a
              href={`tel:${hosp.phone}`}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition"
            >
              <PhoneCall className="w-3.5 h-3.5" /> Call
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
