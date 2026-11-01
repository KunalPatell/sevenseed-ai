"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Spotlight, CardSpotlight, SmoothScrollProvider } from "@main/ui-core";
import { ArrowLeft, HeartPulse, ScanLine, Search, ShieldCheck, AlertTriangle, Sparkles } from "lucide-react";

interface MedicineMapping {
  branded: string;
  genericSalt: string;
  brandedPrice: number;
  janAushadhiPrice: number;
  savingsPct: number;
  contraindications: string[];
}

const sampleMedicines: MedicineMapping[] = [
  {
    branded: "Augmentin 625 Duo",
    genericSalt: "Amoxicillin (500mg) + Clavulanic Acid (125mg)",
    brandedPrice: 204,
    janAushadhiPrice: 42,
    savingsPct: 79,
    contraindications: ["Methotrexate", "Warfarin"],
  },
  {
    branded: "Lipitor (Atorvastatin 20mg)",
    genericSalt: "Atorvastatin Calcium IP",
    brandedPrice: 380,
    janAushadhiPrice: 38,
    savingsPct: 90,
    contraindications: ["Clarithromycin", "Cyclosporine"],
  },
  {
    branded: "Januvia 100mg",
    genericSalt: "Sitagliptin Phosphate",
    brandedPrice: 450,
    janAushadhiPrice: 65,
    savingsPct: 85,
    contraindications: ["Digoxin"],
  }
];

export default function PharmacyPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMed, setSelectedMed] = useState<MedicineMapping>(sampleMedicines[0]);

  const filtered = sampleMedicines.filter((m) =>
    m.branded.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.genericSalt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#030712] text-slate-100 p-6 md:p-10 space-y-8">
        <Spotlight className="-top-40 left-20" fill="rgba(236, 72, 153, 0.25)" />

        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="text-[11px] font-mono uppercase text-pink-400">Decode Forest Healthcare</div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-pink-400" />
                <span>Decode Forest Pharmacy — Jan Aushadhi Generic & OCR Engine (1mg & Netmeds)</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full">
              Up to 90% Healthcare Savings
            </span>
          </div>
        </div>

        {/* Search & Generic Equivalent Engine */}
        <div className="p-6 rounded-2xl bg-[#050814] border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-100">Salt-to-Generic Equivalent Finder</h3>
              <p className="text-xs text-slate-400">Search any expensive branded medicine to uncover government-verified Jan Aushadhi equivalents.</p>
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Augmentin, Lipitor..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filtered.map((med) => {
              const isSelected = selectedMed.branded === med.branded;
              return (
                <div
                  key={med.branded}
                  onClick={() => setSelectedMed(med)}
                  className={`p-5 rounded-xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? "bg-slate-900 border-pink-400 shadow-lg shadow-pink-500/10"
                      : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-100">{med.branded}</span>
                    <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
                      Save {med.savingsPct}%
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-slate-400">
                    <span className="text-slate-500 block text-[10px] uppercase">Active Chemical Salt:</span>
                    {med.genericSalt}
                  </div>

                  <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="text-slate-500 line-through">₹{med.brandedPrice}</span>
                      <span className="text-emerald-400 font-bold ml-2">₹{med.janAushadhiPrice}</span>
                    </div>
                    <span className="text-[10px] text-pink-400">Inspect Drug Safety →</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Safety & Interaction Matrix */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>Drug-Drug Contraindication Alert for {selectedMed.branded}:</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Clinical safety guidelines suggest avoiding simultaneous co-administration with:{" "}
              <span className="text-rose-400 font-bold">{selectedMed.contraindications.join(", ")}</span>.
            </p>
          </div>
        </div>
      </main>
    </SmoothScrollProvider>
  );
}
