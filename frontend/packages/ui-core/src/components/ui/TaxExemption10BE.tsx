"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Calculator, Info, AlertTriangle, FileCheck2 } from "lucide-react";

// 80G deduction estimator. The old version printed a "Form 10BE receipt" with an invented
// registration number for anyone who typed a name, which a donor could wrongly file with
// their tax return. Only the Trust can issue Form 10BE, after it receives a donation, so this
// tool only estimates the deduction and explains how to get the real certificate.

type Mode = "online" | "cheque" | "cash";
type Regime = "old" | "new";

const SLABS = [
  { label: "5%", v: 5 }, { label: "20%", v: 20 }, { label: "30%", v: 30 },
];
const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

export function TaxExemption10BE() {
  const [amount, setAmount] = useState("10000");
  const [income, setIncome] = useState("");
  const [mode, setMode] = useState<Mode>("online");
  const [regime, setRegime] = useState<Regime>("old");
  const [slab, setSlab] = useState(30);

  const r = useMemo(() => {
    const a = Math.max(0, parseFloat(amount) || 0);
    const gti = parseFloat(income) || 0;
    if (regime === "new") return { ok: false, reason: "The new tax regime doesn't allow 80G deductions. You only get this benefit under the old regime." };
    if (mode === "cash" && a > 2000) return { ok: false, reason: "Cash donations above ₹2,000 can't be claimed under 80G. Pay online, by UPI or by cheque instead." };
    // Most 80G(5) trusts fall under "50% of the donation, subject to 10% of adjusted gross income".
    const limit = gti > 0 ? gti * 0.1 : Infinity;
    const qualifying = Math.min(a, limit);
    const deduction = qualifying * 0.5;
    const cess = 1.04;
    return { ok: true, a, limited: qualifying < a, qualifying, deduction, saved: deduction * (slab / 100) * cess };
  }, [amount, income, mode, regime, slab]);

  const input = "w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400";
  const pill = (on: boolean) => `px-3 py-2 rounded-lg border text-sm font-semibold ${on ? "border-amber-400 bg-amber-400/10 text-amber-200" : "border-slate-700 text-slate-300 hover:border-slate-500"}`;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="p-6 md:p-8 rounded-2xl bg-slate-900/90 border border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2"><Calculator className="w-6 h-6 text-amber-400" /> 80G Tax Saving Calculator</h1>
        <p className="mt-2 text-sm text-slate-300 max-w-2xl">See roughly how much tax a donation to AVP Charitable Trust could save you under Section 80G. This is an estimate. Your actual claim is based on the Form 10BE certificate the Trust sends you after it receives your donation.</p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <label className="block text-sm text-slate-300">Donation amount (₹)
              <input className={input + " mt-1.5 font-mono"} inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))} />
            </label>
            <label className="block text-sm text-slate-300">Your taxable income this year (₹, optional)
              <input className={input + " mt-1.5 font-mono"} inputMode="decimal" placeholder="Used for the 10% limit" value={income} onChange={(e) => setIncome(e.target.value.replace(/[^\d.]/g, ""))} />
            </label>
            <fieldset>
              <legend className="text-sm text-slate-300 mb-1.5">How you'll pay</legend>
              <div className="flex flex-wrap gap-2">
                {(["online", "cheque", "cash"] as Mode[]).map((m) => <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)} className={pill(mode === m)}>{m === "online" ? "Online / UPI" : m === "cheque" ? "Cheque" : "Cash"}</button>)}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-sm text-slate-300 mb-1.5">Tax regime</legend>
              <div className="flex flex-wrap gap-2">
                <button type="button" aria-pressed={regime === "old"} onClick={() => setRegime("old")} className={pill(regime === "old")}>Old regime</button>
                <button type="button" aria-pressed={regime === "new"} onClick={() => setRegime("new")} className={pill(regime === "new")}>New regime</button>
              </div>
            </fieldset>
            {regime === "old" && (
              <fieldset>
                <legend className="text-sm text-slate-300 mb-1.5">Your highest tax slab</legend>
                <div className="flex flex-wrap gap-2">
                  {SLABS.map((s) => <button key={s.v} type="button" aria-pressed={slab === s.v} onClick={() => setSlab(s.v)} className={pill(slab === s.v)}>{s.label}</button>)}
                </div>
              </fieldset>
            )}
          </div>

          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800" aria-live="polite">
            {r.ok ? (
              <div className="space-y-3">
                <div className="text-sm text-slate-400">You could deduct</div>
                <div className="text-4xl font-black font-mono text-white">{inr(r.deduction!)}</div>
                <div className="text-sm text-slate-300">That saves about <strong className="text-emerald-300 font-mono">{inr(r.saved!)}</strong> in tax (at {slab}% plus 4% cess).</div>
                {r.limited && <p className="text-xs text-amber-200">Only {inr(r.qualifying!)} of your donation counts, because 80G is capped at 10% of your income.</p>}
                <p className="text-xs text-slate-500 pt-2 border-t border-slate-800">Assumes the common 80G category: 50% of the donation, capped at 10% of adjusted income. Surcharge is ignored. Check with your tax adviser.</p>
              </div>
            ) : (
              <div className="flex gap-2 text-amber-200 text-sm"><AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" /> {r.reason}</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
          <h2 className="font-bold text-white flex items-center gap-2"><FileCheck2 className="w-5 h-5 text-emerald-400" /> Getting your Form 10BE</h2>
          <ol className="mt-3 space-y-2 text-sm text-slate-300 list-decimal pl-5">
            <li>Donate by UPI, bank transfer or cheque, and give your name, address and PAN.</li>
            <li>The Trust reports donations to the Income Tax Department in Form 10BD, due by 31 May after the financial year ends.</li>
            <li>The Trust then sends you Form 10BE. Your donation also appears in your Form 26AS / AIS.</li>
            <li>Claim the deduction in your return using the details on Form 10BE.</li>
          </ol>
          <Link href="/trust/campaigns/" className="mt-4 inline-flex px-4 py-2.5 rounded-lg bg-amber-400 text-black text-sm font-bold">Pledge a donation</Link>
        </div>
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
          <h2 className="font-bold text-white flex items-center gap-2"><Info className="w-5 h-5 text-sky-400" /> Before you donate</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-300 list-disc pl-5">
            <li>Ask the Trust for its 80G registration number and check it on the <a className="underline hover:text-white" href="https://www.incometax.gov.in/iec/foportal/" target="_blank" rel="noopener noreferrer">Income Tax e-filing portal</a>.</li>
            <li>Only a Form 10BE from the Trust counts as proof. A receipt you print from a website does not.</li>
            <li>Keep the payment proof, such as the UPI reference or a bank statement.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
