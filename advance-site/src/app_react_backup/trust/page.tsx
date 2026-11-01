"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Spotlight, CardSpotlight, SmoothScrollProvider } from "@main/ui-core";
import { ArrowLeft, HeartHandshake, ShieldCheck, Download, Sparkles, CheckCircle2, Lock } from "lucide-react";

interface DonationRecord {
  id: string;
  donor: string;
  amount: number;
  allocatedCause: string;
  txHash: string;
  timestamp: string;
  status: "Settled on Ledger";
}

const ledgerRecords: DonationRecord[] = [
  {
    id: "DON-9012",
    donor: "Anonymous Patron",
    amount: 100000,
    allocatedCause: "Village Telemedicine Dispensary (Kutch)",
    txHash: "0x8f2b...c91a",
    timestamp: "2026-09-19 18:32 IST",
    status: "Settled on Ledger"
  },
  {
    id: "DON-9011",
    donor: "Kunal Patel",
    amount: 50000,
    allocatedCause: "Open Science STEM Scholarship Fund",
    txHash: "0x3a4c...18de",
    timestamp: "2026-09-18 14:10 IST",
    status: "Settled on Ledger"
  },
  {
    id: "DON-9010",
    donor: "Sevenforce Community Pool",
    amount: 250000,
    allocatedCause: "Clean Solar Micro-Grid for Rural Schools",
    txHash: "0x91ae...77fc",
    timestamp: "2026-09-17 09:45 IST",
    status: "Settled on Ledger"
  }
];

export default function TrustPage() {
  const [taxPan, setTaxPan] = useState("");
  const [donorName, setDonorName] = useState("");

  const downloadReceipt = () => {
    if (!donorName || !taxPan) {
      alert("Please enter Donor Name and PAN number to issue Section 80G certificate.");
      return;
    }
    alert(`[SECTION 80G TAX EXEMPTION CERTIFICATE ISSUED]\nDonor: ${donorName}\nPAN: ${taxPan.toUpperCase()}\nRegistration: AVP-TRUST-80G-2026-4401\nTax Exemption: 50% deduction under IT Act 1961.`);
  };

  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#030712] text-slate-100 p-6 md:p-10 space-y-8">
        <Spotlight className="-top-40 left-20" fill="rgba(244, 63, 94, 0.25)" />

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
              <div className="text-[11px] font-mono uppercase text-rose-400">AVP Charitable Foundation</div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-rose-400" />
                <span>AVP Charitable Trust — 100% Transparent Ledger & 80G Generator (Charity:Water)</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Public Ledger Transparency</span>
            </span>
          </div>
        </div>

        {/* Transparent Public Ledger Table */}
        <div className="p-6 rounded-2xl bg-[#050814] border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-100">Immutable Philanthropy Ledger</h3>
              <p className="text-xs text-slate-400">Every single rupee is publicly tracked with cryptographic transaction hashes.</p>
            </div>
            <div className="text-sm font-mono text-emerald-400 font-bold bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
              Total Disbursed: ₹4,00,000
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px]">
                  <th className="pb-3">Record ID</th>
                  <th className="pb-3">Donor</th>
                  <th className="pb-3">Allocated Cause</th>
                  <th className="pb-3">Cryptographic Hash</th>
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {ledgerRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 text-rose-400 font-bold">{r.id}</td>
                    <td className="py-3 text-slate-200">{r.donor}</td>
                    <td className="py-3 text-slate-300 pr-4">{r.allocatedCause}</td>
                    <td className="py-3 text-sky-400 font-mono text-[11px]">{r.txHash}</td>
                    <td className="py-3 text-slate-500">{r.timestamp}</td>
                    <td className="py-3 text-right text-emerald-400 font-bold">₹{r.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 80G Tax Exemption Receipt Generator */}
        <div className="p-6 rounded-2xl bg-[#050814] border border-slate-800 space-y-4 max-w-xl">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Download className="w-4 h-4 text-rose-400" />
            <span>Generate Instant Section 80G Tax Exemption Certificate</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Donor Legal Name</label>
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="e.g. Kunal Patel"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">PAN Number (Permanent Account Number)</label>
              <input
                type="text"
                value={taxPan}
                onChange={(e) => setTaxPan(e.target.value)}
                placeholder="e.g. ABCDE1234F"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none uppercase"
              />
            </div>

            <button
              onClick={downloadReceipt}
              className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-rose-500/20"
            >
              Issue & Download 80G Certificate
            </button>
          </div>
        </div>
      </main>
    </SmoothScrollProvider>
  );
}
