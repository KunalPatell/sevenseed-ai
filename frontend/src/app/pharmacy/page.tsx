"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Spotlight,
  CardSpotlight,
  DnaDoubleHelix3D,
  FloatingMoleculesBackground,
  BorderBeam,
  CyberButton,
  SmoothScrollProvider,
} from "@main/ui-core";
import {
  ArrowLeft,
  HeartPulse,
  ScanLine,
  Search,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Pill,
  Hospital,
  Activity,
  ArrowUpRight,
  Cross,
  Stethoscope,
} from "lucide-react";

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
  },
];

export default function PharmacyPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMed, setSelectedMed] = useState<MedicineMapping>(sampleMedicines[0]);

  const filtered = sampleMedicines.filter(
    (m) =>
      m.branded.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.genericSalt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#041d1a] text-slate-100 p-6 md:p-10 space-y-10 overflow-hidden font-sans">
        {/* Bio-Chemical Floating Molecules Background */}
        <FloatingMoleculesBackground />
        <Spotlight className="-top-40 left-20" fill="rgba(13, 148, 136, 0.35)" />

        {/* Navigation Bar */}
        <div className="relative z-10 flex items-center justify-between border-b border-teal-900/40 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-teal-950/60 border border-teal-800/40 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="text-[11px] font-mono uppercase text-teal-400 font-bold flex items-center gap-1.5">
                <Cross className="w-3.5 h-3.5 text-teal-400" />
                <span>Decode Forest Healthcare</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-rose-400" />
                <span>Decode Forest Pharmacy — Jan Aushadhi Generic & OCR Engine (1mg & Netmeds)</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Up to 90% Healthcare Savings</span>
            </span>
          </div>
        </div>

        {/* Hero Section with Dedicated 3D DNA Helix */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-xs font-mono text-teal-400 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Affordable Jan Aushadhi Generic Equivalents · PMBJP Standards</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Clinical Tele-Pharmacy & <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-emerald-300 to-cyan-400">
                Prescription AI Scanner
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Synthesizing government-verified Jan Aushadhi generic salt formulations from <em>PMBJP</em>, multi-drug contraindication safety matrices, and doctor prescription OCR.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <CyberButton href="/pharmacy/generic-finder" icon={Pill} className="from-teal-600 via-emerald-600 to-cyan-600 border-teal-400/30 shadow-teal-500/25">
                Find Generic Equivalent
              </CyberButton>
              <CyberButton href="/pharmacy/interaction-checker" icon={AlertTriangle} className="from-rose-600 via-pink-600 to-orange-600 border-rose-400/30 shadow-rose-500/25">
                Check Drug Interactions
              </CyberButton>
              <CyberButton href="/pharmacy/hospital-finder" icon={Hospital} className="from-cyan-600 via-sky-600 to-blue-600 border-cyan-400/30 shadow-cyan-500/25">
                Find Nearby Hospital Beds
              </CyberButton>
              <CyberButton href="/pharmacy/medicine-reminders" icon={Activity} className="from-emerald-600 via-teal-600 to-cyan-600 border-emerald-400/30 shadow-emerald-500/25">
                Set Refill Reminders
              </CyberButton>
              <CyberButton href="/pharmacy/doctor-consultation" icon={Stethoscope} className="from-teal-600 via-cyan-600 to-sky-600 border-teal-400/30 shadow-teal-500/25">
                Book Doctor Consultation
              </CyberButton>
            </div>
          </div>

          <div className="lg:col-span-5 w-full aspect-square relative flex items-center justify-center">
            <div className="absolute inset-0 bg-teal-500/15 blur-[100px] rounded-full pointer-events-none" />
            <DnaDoubleHelix3D />
          </div>
        </div>

        {/* Salt-to-Generic Equivalent Finder with 21st.dev BorderBeam */}
        <div className="relative z-10 rounded-2xl overflow-hidden border border-teal-900/40 bg-teal-950/25 backdrop-blur-xl p-6 sm:p-8 space-y-6">
          <BorderBeam size={240} duration={11} colorFrom="#14b8a6" colorTo="#06b6d4" borderWidth={1.5} />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-100">Salt-to-Generic Equivalent Finder</h3>
              <p className="text-xs text-slate-400 mt-0.5">Search any expensive branded medicine to uncover government-verified Jan Aushadhi equivalents.</p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400" />
              <input
                type="text"
                placeholder="Search Augmentin, Lipitor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#02100e] border border-teal-900/50 text-xs font-mono text-teal-200 focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filtered.map((med) => (
              <div
                key={med.branded}
                onClick={() => setSelectedMed(med)}
                className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedMed.branded === med.branded
                    ? "bg-teal-950/60 border-teal-400/70 shadow-lg shadow-teal-500/15 ring-1 ring-teal-400/40"
                    : "bg-teal-950/30 border-teal-900/40 hover:border-teal-700/60"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-100">{med.branded}</span>
                    <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/90 border border-emerald-700 px-2 py-0.5 rounded">
                      Save {med.savingsPct}%
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-300">
                    <span className="text-slate-500">ACTIVE CHEMICAL SALT:</span> <br />
                    {med.genericSalt}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-teal-900/40 flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-slate-500 line-through">₹{med.brandedPrice}</span>
                    <span className="text-lg font-bold text-emerald-400">₹{med.janAushadhiPrice}</span>
                  </div>
                  <span className="text-xs font-mono text-teal-400 font-medium">Inspect Drug Safety &rarr;</span>
                </div>
              </div>
            ))}
          </div>

          {/* Contraindication Alert Box */}
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/50 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-xs font-bold text-rose-300">
                Drug-Drug Contraindication Alert for {selectedMed.branded}:
              </div>
              <p className="text-xs text-rose-200/90 leading-relaxed">
                Clinical safety guidelines suggest avoiding simultaneous co-administration with:{" "}
                <strong className="text-rose-400">{selectedMed.contraindications.join(", ")}</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 border-t border-teal-900/40 py-8 px-6 text-center text-xs font-mono text-slate-500">
          <p>© 2026 Decode Forest Pharmacy · A Sevenseed AI Venture</p>
        </footer>
      </main>
    </SmoothScrollProvider>
  );
}
