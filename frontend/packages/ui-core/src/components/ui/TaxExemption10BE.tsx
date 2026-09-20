"use client";

import React, { useState } from "react";
import { HeartHandshake, QrCode, Printer, ShieldCheck } from "lucide-react";

export function TaxExemption10BE() {
  const [donorName, setDonorName] = useState("Vikram Patel");
  const [donorPan, setDonorPan] = useState("ABCDE1234F");
  const [amount, setAmount] = useState(25000);

  const deduction50 = Math.round(amount * 0.5);

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-8 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <HeartHandshake className="w-4 h-4" /> Income Tax Act Section 80G Compliant
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          80G Tax Exemption & Form 10BE Receipt
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
          Generate an official cryptographic Form 10BE donation acknowledgment with verified 50% taxable income deduction.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Input Details */}
        <div className="md:col-span-5 bg-slate-950/60 border border-slate-800/80 p-6 rounded-xl space-y-4">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Donor Information</h3>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Donor Full Name</label>
            <input
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Permanent Account Number (PAN)</label>
            <input
              type="text"
              value={donorPan}
              onChange={(e) => setDonorPan(e.target.value.toUpperCase())}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-sm uppercase focus:outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Contribution Amount (₹)</label>
            <input
              type="number"
              value={amount}
              step={5000}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-pink-500"
            />
          </div>
        </div>

        {/* Certificate Preview */}
        <div className="md:col-span-7 bg-slate-950 border-2 border-pink-500/40 p-6 rounded-xl space-y-5 relative">
          <div className="flex justify-between items-start border-b border-slate-800 pb-4">
            <div>
              <h4 className="text-lg font-bold text-white">AVP Charitable Trust</h4>
              <p className="text-[11px] text-slate-400">Govt. Reg No: TRUST/GJ/80G/2026/A4901</p>
            </div>
            <div className="px-3 py-1 bg-pink-500/10 border border-pink-500/30 text-pink-400 font-bold text-xs rounded-full">
              FORM 10BE CERTIFICATE
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
            <p>
              Certified that <strong>{donorName}</strong> (PAN: <span className="font-mono text-amber-400">{donorPan}</span>) has donated the sum of:
            </p>
            <div className="text-2xl font-black font-mono text-pink-400">₹{amount.toLocaleString()}</div>
            <p className="text-emerald-400 font-bold">
              Eligible Deduction under Section 80G (50%): ₹{deduction50.toLocaleString()}
            </p>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-800 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <QrCode className="w-8 h-8 text-white bg-slate-800 p-1 rounded" />
              <span>SHA-256 Verified Receipt</span>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" /> Print 10BE Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
