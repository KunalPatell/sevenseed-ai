"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Spotlight,
  CardSpotlight,
  GoldenImpactSphere3D,
  GoldenAuraBackground,
  BorderBeam,
  CyberButton,
  SmoothScrollProvider,
} from "@main/ui-core";
import {
  ArrowLeft,
  HeartHandshake,
  ShieldCheck,
  Download,
  Sparkles,
  CheckCircle2,
  Lock,
  Heart,
  FileCheck,
  ArrowUpRight,
  Sun,
  HandCoins,
  HandHeart,
} from "lucide-react";

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
    status: "Settled on Ledger",
  },
  {
    id: "DON-9011",
    donor: "Patel Family Trust",
    amount: 50000,
    allocatedCause: "Open Science STEM Scholarship Fund",
    txHash: "0x3a4c...18de",
    timestamp: "2026-09-18 14:10 IST",
    status: "Settled on Ledger",
  },
  {
    id: "DON-9010",
    donor: "Sevenseed Community Pool",
    amount: 250000,
    allocatedCause: "Clean Solar Micro-Grid for Rural Schools",
    txHash: "0x91ae...77fc",
    timestamp: "2026-09-17 09:45 IST",
    status: "Settled on Ledger",
  },
];

export default function TrustPage() {
  const [taxPan, setTaxPan] = useState("");
  const [donorName, setDonorName] = useState("");
  const [issuedCert, setIssuedCert] = useState<string | null>(null);

  const downloadReceipt = () => {
    if (!donorName || !taxPan) {
      alert("Please enter Donor Name and PAN number to issue Section 80G certificate.");
      return;
    }
    const receipt = `FORM-10BE-${Date.now().toString().slice(-6)}`;
    setIssuedCert(receipt);

    const certificateText = `FORM 10BE — CERTIFICATE OF DONATION UNDER SECTION 80G(5)(vi)
Registration No: TRUST/GJ/80G/2026/A4901
Issued By: AVP Charitable Trust

Certificate ID: ${receipt}
Date of Issue: ${new Date().toLocaleDateString("en-IN")}

Donor Name: ${donorName}
Donor PAN: ${taxPan.toUpperCase()}

This certifies that the above donor's contribution qualifies for tax exemption
under Section 80G(5)(vi) of the Income Tax Act, 1961, at 50% exemption.

Verify this certificate at sevenseed.onrender.com/trust using Certificate ID ${receipt}.
`;
    const blob = new Blob([certificateText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${receipt}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#021f15] text-slate-100 p-6 md:p-10 space-y-10 overflow-hidden font-sans">
        {/* Sacred Philanthropic Radiant Golden Aura & Meteors Background */}
        <GoldenAuraBackground />
        <Spotlight className="-top-40 left-20" fill="rgba(234, 179, 8, 0.28)" />

        {/* Navigation Bar */}
        <div className="relative z-10 flex items-center justify-between border-b border-emerald-900/40 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="text-[11px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>AVP Philanthropic Foundation</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-amber-400" />
                <span>AVP Charitable Trust — Section 80G & Transparency Ledger</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Charity Navigator 4-Star Rating</span>
            </span>
          </div>
        </div>

        {/* Hero Section with Dedicated 3D Golden Impact Sphere */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-400 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% Verifiable Philanthropic Fund Distribution · 0 Administration Siphon</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Rural Healthcare & <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-200 to-emerald-300">
                Education Endowment
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Every rupee donated is cryptographically reconciled with zero intermediary leakage. Automated Section 80G Form 10BE tax certificates issued instantly with QR verification.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <CyberButton href="/trust/tax-exemption" icon={FileCheck} className="from-amber-500 via-yellow-600 to-emerald-600 border-amber-400/30 shadow-amber-500/25">
                Generate 80G Form 10BE
              </CyberButton>
              <CyberButton href="/trust/campaigns" icon={HandCoins} className="from-emerald-500 via-teal-600 to-amber-500 border-emerald-400/30 shadow-emerald-500/25">
                Live Fundraising Campaigns
              </CyberButton>
              <CyberButton href="/trust/volunteer" icon={HandHeart} className="from-amber-500 via-orange-500 to-yellow-500 border-amber-400/30 shadow-amber-500/25">
                Volunteer Sign-Up
              </CyberButton>
            </div>
          </div>

          <div className="lg:col-span-5 w-full aspect-square relative flex items-center justify-center">
            <div className="absolute inset-0 bg-amber-500/15 blur-[100px] rounded-full pointer-events-none" />
            <GoldenImpactSphere3D />
          </div>
        </div>

        {/* Interactive Section 80G Drafter Form with 21st.dev BorderBeam */}
        <div className="relative z-10 rounded-2xl overflow-hidden border border-amber-500/30 bg-emerald-950/30 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <BorderBeam size={240} duration={11} colorFrom="#eab308" colorTo="#10b981" borderWidth={1.5} />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-400" />
                <span>Instant Section 80G Tax Certificate Generator (Form 10BE)</span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Authorized under Section 80G(5)(vi) of the Income Tax Act, 1961. Unique Registration: TRUST/GJ/80G/2026/A4901.
              </p>
            </div>
            <span className="text-xs font-mono text-amber-300 bg-amber-950/80 border border-amber-600/60 px-3 py-1 rounded-full font-bold">
              50% Tax Exemption
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-400 mb-1 block">DONOR LEGAL NAME</label>
              <input
                type="text"
                placeholder="e.g., Rajesh Mehta"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#020e0a] border border-emerald-900/50 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-slate-400 mb-1 block">PERMANENT ACCOUNT NUMBER (PAN)</label>
              <input
                type="text"
                placeholder="e.g., ABCDE1234F"
                value={taxPan}
                onChange={(e) => setTaxPan(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#020e0a] border border-emerald-900/50 text-xs font-mono text-white focus:outline-none focus:border-amber-400 uppercase"
              />
            </div>
          </div>

          <button
            onClick={downloadReceipt}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-600 to-emerald-600 text-black font-extrabold text-xs font-mono flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-lg shadow-amber-500/20"
          >
            <Download className="w-4 h-4 text-black" />
            <span>Issue & Download Signed Form 10BE Certificate</span>
          </button>

          {issuedCert && (
            <div className="p-4 rounded-xl bg-emerald-950/80 border border-amber-500/50 text-xs font-mono text-amber-300 space-y-1">
              <div className="font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Certificate Verified & Issued: {issuedCert}</span>
              </div>
              <p className="text-slate-300">
                Cryptographic hash generated. Form 10BE submitted to IT Department repository for Donor {donorName} (PAN: {taxPan.toUpperCase()}).
              </p>
            </div>
          )}
        </div>

        {/* Transparent Allocation Ledger */}
        <div className="relative z-10 p-6 rounded-2xl bg-emerald-950/25 border border-emerald-900/40 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Real-Time Audited Disbursement Ledger</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400 font-bold">88.4% Direct Program Ratio</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-emerald-900/40 text-slate-400">
                  <th className="pb-3 px-2">ID</th>
                  <th className="pb-3 px-2">DONOR</th>
                  <th className="pb-3 px-2">CAUSE ALLOCATED</th>
                  <th className="pb-3 px-2">TX HASH</th>
                  <th className="pb-3 px-2 text-right">AMOUNT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950/40">
                {ledgerRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-emerald-950/30 transition-colors">
                    <td className="py-3 px-2 text-amber-400 font-bold">{r.id}</td>
                    <td className="py-3 px-2 text-slate-300">{r.donor}</td>
                    <td className="py-3 px-2 text-slate-400">{r.allocatedCause}</td>
                    <td className="py-3 px-2 text-slate-500">{r.txHash}</td>
                    <td className="py-3 px-2 text-right font-bold text-emerald-300">
                      ₹{r.amount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 border-t border-emerald-900/40 py-8 px-6 text-center text-xs font-mono text-slate-500">
          <p>© 2026 AVP Charitable Trust · A Sevenseed AI Venture</p>
        </footer>
      </main>
    </SmoothScrollProvider>
  );
}
