"use client";

import React, { useState } from "react";
import { Pill, Search, ShieldCheck, ArrowRight, IndianRupee } from "lucide-react";

interface DrugItem {
  branded: string;
  brandPrice: number;
  generic: string;
  genericPrice: number;
  salt: string;
}

const DRUG_DATABASE: Record<string, DrugItem> = {
  augmentin: {
    branded: "Augmentin 625 Duo (10 Tabs)",
    brandPrice: 218.0,
    generic: "Amoxycillin & Pot. Clavulanate (10 Tabs)",
    genericPrice: 45.0,
    salt: "Amoxicillin (500mg) + Clavulanic Acid (125mg)"
  },
  pan: {
    branded: "Pan-D Capsule (15 Caps)",
    brandPrice: 245.0,
    generic: "Pantoprazole + Domperidone (15 Caps)",
    genericPrice: 38.0,
    salt: "Pantoprazole (40mg) + Domperidone (30mg)"
  },
  glycomet: {
    branded: "Glycomet GP 1 (15 Tabs)",
    brandPrice: 165.0,
    generic: "Metformin + Glimepiride (15 Tabs)",
    genericPrice: 28.0,
    salt: "Metformin (500mg) + Glimepiride (1mg)"
  },
  crocin: {
    branded: "Crocin 650 Advance (15 Tabs)",
    brandPrice: 35.0,
    generic: "Paracetamol IP 650mg Generic (15 Tabs)",
    genericPrice: 8.0,
    salt: "Paracetamol IP (650mg)"
  }
};

export function GenericSaltFinder() {
  const [query, setQuery] = useState("augmentin");
  const [currentDrug, setCurrentDrug] = useState<DrugItem>(DRUG_DATABASE["augmentin"]);

  const handleSearch = () => {
    const q = query.toLowerCase().trim();
    for (const key in DRUG_DATABASE) {
      if (q.includes(key)) {
        setCurrentDrug(DRUG_DATABASE[key]);
        return;
      }
    }
    setCurrentDrug(DRUG_DATABASE["augmentin"]);
  };

  const savings = currentDrug.brandPrice - currentDrug.genericPrice;
  const savingsPct = Math.round((savings / currentDrug.brandPrice) * 100);

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-8 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Pill className="w-4 h-4" /> PMBJP Jan Aushadhi Bio-Equivalent Matcher
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Jan Aushadhi Generic Medicine Savings Finder
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
          Compare branded medications against identical PMBJP generic formulations and save up to 85% on recurring prescriptions.
        </p>
      </div>

      {/* Search Input */}
      <div className="flex gap-3 max-w-xl mx-auto mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search branded medication (Augmentin, Pan-D, Glycomet, Crocin)..."
          className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
        />
        <button
          onClick={handleSearch}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
        >
          <Search className="w-4 h-4" /> Find Generic
        </button>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <div className="p-6 rounded-xl bg-rose-500/5 border border-rose-500/30 flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-rose-400 tracking-wider">Branded Retail Medicine</span>
            <h4 className="text-xl font-bold text-white mt-2">{currentDrug.branded}</h4>
            <p className="text-xs text-slate-400 mt-1 font-mono">{currentDrug.salt}</p>
          </div>
          <div className="mt-6 pt-4 border-t border-rose-500/20 flex justify-between items-end">
            <span className="text-xs text-slate-400">Retail MRP</span>
            <span className="text-3xl font-mono font-black text-rose-400">₹{currentDrug.brandPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-emerald-500/5 border border-emerald-500/30 flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">PMBJP Jan Aushadhi Generic</span>
            <h4 className="text-xl font-bold text-white mt-2">{currentDrug.generic}</h4>
            <p className="text-xs text-slate-400 mt-1 font-mono">100% Bio-Equivalent Salt (WHO-GMP Certified)</p>
          </div>
          <div className="mt-6 pt-4 border-t border-emerald-500/20 flex justify-between items-end">
            <span className="text-xs text-slate-400">Jan Aushadhi Price</span>
            <span className="text-3xl font-mono font-black text-emerald-400">₹{currentDrug.genericPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Savings Summary Banner */}
      <div className="mt-6 p-5 rounded-xl bg-gradient-to-r from-emerald-500/15 to-transparent border border-emerald-500/40 flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="font-bold text-white text-sm flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> Total Prescription Savings: ₹{savings.toFixed(2)} per strip
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Identical therapeutic efficacy at a fraction of pharmaceutical marketing overhead.</p>
        </div>
        <div className="text-2xl font-black font-mono text-emerald-400 bg-emerald-500/20 px-4 py-1.5 rounded-lg border border-emerald-500/40">
          {savingsPct}% Cheaper
        </div>
      </div>
    </div>
  );
}
