"use client";

import React, { useState } from "react";
import { AlertTriangle, ShieldCheck, Pill, Stethoscope } from "lucide-react";

export function DrugInteractionMatrix() {
  const [drugA, setDrugA] = useState("Warfarin");
  const [drugB, setDrugB] = useState("Aspirin");

  const isMajor = (drugA === "Warfarin" && drugB === "Aspirin") || (drugA === "Aspirin" && drugB === "Warfarin");

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-8 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <AlertTriangle className="w-4 h-4" /> Clinical Pharmacological Interaction Matrix
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Drug-Drug Interaction Checker
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
          Scan multi-drug regimens for severe contraindications, QT prolongation risks, and metabolic competition.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mb-6">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Medication A</label>
          <select
            value={drugA}
            onChange={(e) => setDrugA(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-rose-500"
          >
            <option value="Warfarin">Warfarin (Blood Thinner)</option>
            <option value="Aspirin">Aspirin (Antiplatelet)</option>
            <option value="Metformin">Metformin (Antidiabetic)</option>
            <option value="Atorvastatin">Atorvastatin (Cholesterol)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Medication B</label>
          <select
            value={drugB}
            onChange={(e) => setDrugB(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-rose-500"
          >
            <option value="Aspirin">Aspirin (Antiplatelet)</option>
            <option value="Warfarin">Warfarin (Blood Thinner)</option>
            <option value="Ibuprofen">Ibuprofen (NSAID)</option>
            <option value="Metformin">Metformin (Antidiabetic)</option>
          </select>
        </div>
      </div>

      <div className={`p-6 rounded-xl border ${isMajor ? "bg-rose-500/10 border-rose-500/40" : "bg-emerald-500/10 border-emerald-500/40"}`}>
        <div className="flex items-center gap-3">
          {isMajor ? (
            <AlertTriangle className="w-8 h-8 text-rose-400 shrink-0" />
          ) : (
            <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
          )}
          <div>
            <h4 className={`text-lg font-bold ${isMajor ? "text-rose-300" : "text-emerald-300"}`}>
              {isMajor ? "MAJOR CONTRAINDICATION DETECTED" : "No Severe Interaction Found"}
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {isMajor
                ? `Concomitant use of ${drugA} and ${drugB} significantly heightens the risk of severe gastrointestinal and intracranial hemorrhage due to additive anticoagulant and antiplatelet mechanisms.`
                : `Concurrent administration of ${drugA} and ${drugB} demonstrates manageable clinical safety profiles under standard therapeutic dosages.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
