"use client";

import React, { useMemo, useState } from "react";
import { Wallet, Info } from "lucide-react";

// CTC to take-home calculator (India, new tax regime, FY 2025-26). The old version showed
// fixed salary bands labelled "verified" that came from nowhere. This works on the
// visitor's own offer, using the published tax slabs.

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
const n = (s: string) => Math.max(0, parseFloat(s) || 0);

// New regime slabs for FY 2025-26 (Budget 2025).
const SLABS: [number, number][] = [[400000, 0], [800000, 0.05], [1200000, 0.1], [1600000, 0.15], [2000000, 0.2], [2400000, 0.25], [Infinity, 0.3]];
const STD_DEDUCTION = 75000;

function slabTax(income: number) {
  let tax = 0, prev = 0;
  for (const [upto, rate] of SLABS) {
    if (income <= prev) break;
    tax += (Math.min(income, upto) - prev) * rate;
    prev = upto;
  }
  return tax;
}

function incomeTax(taxable: number) {
  let tax = slabTax(taxable);
  // Section 87A rebate: no tax up to ₹12 lakh taxable, with marginal relief just above it.
  if (taxable <= 1200000) tax = 0;
  else tax = Math.min(tax, taxable - 1200000);
  let surcharge = 0;
  if (taxable > 20000000) surcharge = 0.25; else if (taxable > 10000000) surcharge = 0.15; else if (taxable > 5000000) surcharge = 0.1;
  return tax * (1 + surcharge) * 1.04;
}

export function SalaryInsightsBenchmark() {
  const [ctc, setCtc] = useState("1200000");
  const [basicPct, setBasicPct] = useState("40");
  const [variable, setVariable] = useState("0");
  const [employerPf, setEmployerPf] = useState(true);
  const [pt, setPt] = useState("2400");

  const r = useMemo(() => {
    const total = n(ctc), vari = Math.min(n(variable), total);
    const fixed = total - vari;
    const basic = (fixed * Math.min(100, n(basicPct))) / 100;
    const pfBase = Math.min(basic, 15000 * 12);
    const erPf = employerPf ? pfBase * 0.12 : 0; // employer PF sits inside CTC
    const eePf = pfBase * 0.12;
    const gratuity = basic * 0.0481; // commonly built into CTC
    const gross = total - erPf - gratuity;
    const taxable = Math.max(0, gross - STD_DEDUCTION);
    const tax = incomeTax(taxable);
    const profTax = n(pt);
    const inHandYear = gross - eePf - profTax - tax;
    const fixedShare = vari > 0 ? (gross - vari) / gross : 1;
    return { gross, erPf, eePf, gratuity, taxable, tax, profTax, inHandYear, monthly: inHandYear / 12, monthlyFixed: (inHandYear * fixedShare) / 12 };
  }, [ctc, basicPct, variable, employerPf, pt]);

  const input = "w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-emerald-400";
  const row = (label: string, v: number, strong = false) => (
    <div className={`flex justify-between gap-4 py-2 border-b border-slate-800 text-sm ${strong ? "font-bold text-white" : "text-slate-300"}`}><span>{label}</span><span className="font-mono">{inr(v)}</span></div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-8 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl">
      <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2"><Wallet className="w-6 h-6 text-emerald-400" /> What will I take home?</h1>
      <p className="mt-2 text-sm text-slate-300 max-w-2xl">Enter your offer's CTC to see your monthly in-hand pay under the new tax regime (FY 2025-26). Use it to compare two offers on what actually reaches your bank account.</p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <label className="block text-sm text-slate-300">Annual CTC (₹)<input className={input + " mt-1.5"} inputMode="decimal" value={ctc} onChange={(e) => setCtc(e.target.value.replace(/[^\d.]/g, ""))} /></label>
          <label className="block text-sm text-slate-300">Variable / bonus part of CTC (₹ a year)<input className={input + " mt-1.5"} inputMode="decimal" value={variable} onChange={(e) => setVariable(e.target.value.replace(/[^\d.]/g, ""))} /></label>
          <label className="block text-sm text-slate-300">Basic pay as % of fixed pay<input className={input + " mt-1.5"} inputMode="decimal" value={basicPct} onChange={(e) => setBasicPct(e.target.value.replace(/[^\d.]/g, ""))} /><span className="text-xs text-slate-500">Usually 40–50%. It's on your offer letter.</span></label>
          <label className="block text-sm text-slate-300">Professional tax (₹ a year)<input className={input + " mt-1.5"} inputMode="decimal" value={pt} onChange={(e) => setPt(e.target.value.replace(/[^\d.]/g, ""))} /><span className="text-xs text-slate-500">₹2,400 in Gujarat, Maharashtra and Karnataka for most salaries. ₹0 in some states.</span></label>
          <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={employerPf} onChange={(e) => setEmployerPf(e.target.checked)} className="accent-emerald-500 w-4 h-4" /> Employer's PF is included in my CTC</label>
        </div>

        <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800" aria-live="polite">
          <div className="text-sm text-slate-400">Monthly in-hand (average)</div>
          <div className="text-4xl font-black font-mono text-emerald-300">{inr(r.monthly)}</div>
          {n(variable) > 0 && <div className="text-sm text-slate-300 mt-1">About {inr(r.monthlyFixed)} a month without the variable pay.</div>}
          <div className="mt-4">
            {row("Gross salary", r.gross)}
            {row("Employer PF (inside CTC)", r.erPf)}
            {row("Gratuity (inside CTC)", r.gratuity)}
            {row("Your PF contribution", r.eePf)}
            {row("Professional tax", r.profTax)}
            {row("Income tax + cess", r.tax)}
            {row("Take-home a year", r.inHandYear, true)}
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs text-slate-500 flex gap-2"><Info className="w-4 h-4 shrink-0" /> New regime with ₹75,000 standard deduction and the Section 87A rebate up to ₹12 lakh taxable income. PF is taken as 12% of basic, capped at ₹15,000 a month of basic; gratuity as 4.81% of basic. Your payslip may differ. This is not tax advice.</p>
    </div>
  );
}
