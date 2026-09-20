"use client";

import React, { useState } from "react";
import { Ticket, Wallet, CheckCircle2, XCircle, ArrowRight } from "lucide-react";

interface Coupon {
  code: string;
  discountPct: number;
  status: "idle" | "testing" | "applied" | "rejected";
}

export function CouponAutoTester() {
  const [coupons, setCoupons] = useState<Coupon[]>([
    { code: "SAVE50", discountPct: 50, status: "idle" },
    { code: "WELCOME20", discountPct: 20, status: "idle" },
    { code: "FLAT100", discountPct: 15, status: "idle" },
    { code: "FESTIVE40", discountPct: 40, status: "idle" },
    { code: "EXPIRED99", discountPct: 99, status: "idle" }
  ]);

  const [cartAmount] = useState(1499);
  const [activeDiscount, setActiveDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState(250);
  const [upiId, setUpiId] = useState("kunal@okhdfcbank");

  const runTester = () => {
    setActiveDiscount(0);
    setAppliedCode(null);

    // Simulate progressive testing
    setCoupons((prev) => prev.map((c) => ({ ...c, status: "testing" })));

    setTimeout(() => {
      setCoupons([
        { code: "SAVE50", discountPct: 50, status: "applied" },
        { code: "WELCOME20", discountPct: 20, status: "rejected" },
        { code: "FLAT100", discountPct: 15, status: "rejected" },
        { code: "FESTIVE40", discountPct: 40, status: "rejected" },
        { code: "EXPIRED99", discountPct: 99, status: "rejected" }
      ]);
      setActiveDiscount(50);
      setAppliedCode("SAVE50");
      setWalletBalance((prev) => prev + 75); // UPI cashback
    }, 1500);
  };

  const finalAmount = Math.round(cartAmount * (1 - activeDiscount / 100));

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-8 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Ticket className="w-4 h-4" /> Automated Promo Code Verification
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Coupon Auto-Tester & Cashback Wallet
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
          Test 5 promotional codes automatically, apply the highest discount rate, and claim instant UPI rewards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Cart & Tester Card */}
        <div className="md:col-span-7 bg-slate-950/60 border border-slate-800/80 p-6 rounded-xl space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs text-slate-400">Order Subtotal:</span>
              <div className="text-2xl font-black text-white font-mono">₹{cartAmount}</div>
            </div>
            <button
              onClick={runTester}
              className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition"
            >
              <Ticket className="w-4 h-4" /> Auto-Test All 5 Coupons
            </button>
          </div>

          <div className="space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Promo Codes</span>
            {coupons.map((c) => (
              <div
                key={c.code}
                className="flex justify-between items-center p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono"
              >
                <span className="font-bold text-amber-400">{c.code}</span>
                <div className="flex items-center gap-2">
                  {c.status === "testing" && <span className="text-slate-400 animate-pulse">Testing...</span>}
                  {c.status === "applied" && (
                    <span className="text-emerald-400 flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Best Deal Applied ({c.discountPct}% OFF)
                    </span>
                  )}
                  {c.status === "rejected" && (
                    <span className="text-slate-500 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Invalid / Lower
                    </span>
                  )}
                  {c.status === "idle" && <span className="text-slate-400">Ready to test</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 flex justify-between items-center">
            <div>
              <span className="text-xs text-slate-400">Final Price ({appliedCode || "No Code"}):</span>
              <div className="text-3xl font-black text-emerald-400 font-mono">₹{finalAmount}</div>
            </div>
            {activeDiscount > 0 && (
              <span className="text-xs px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold rounded-full">
                Saved ₹{cartAmount - finalAmount} ({activeDiscount}% OFF)
              </span>
            )}
          </div>
        </div>

        {/* UPI Cashback Wallet */}
        <div className="md:col-span-5 bg-slate-950/80 border border-slate-800 p-6 rounded-xl space-y-5">
          <div className="flex items-center gap-2 text-white font-bold text-base border-b border-slate-800 pb-3">
            <Wallet className="w-5 h-5 text-emerald-400" /> AVP Cashback Wallet
          </div>

          <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/30 text-center">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Wallet Balance</span>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">₹{walletBalance}</div>
            <p className="text-[11px] text-slate-400 mt-1">+₹75 cashback credited on coupon test!</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Instant UPI Withdrawal Address</label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            onClick={() => alert(`₹${walletBalance} transferred to ${upiId} via NPCI UPI gateway.`)}
            className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition"
          >
            Withdraw to Bank <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
