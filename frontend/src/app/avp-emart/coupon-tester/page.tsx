"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Spotlight, CardSpotlight, SmoothScrollProvider } from "@main/ui-core";
import { ArrowLeft, Percent, Check, X, Sparkles, ArrowRight, Wallet, ShieldCheck } from "lucide-react";

interface Coupon {
  code: string;
  discount: string;
  minOrder: number;
  status: "verified" | "expired" | "exclusive";
  cashback: number;
}

const sampleCoupons: Coupon[] = [
  { code: "SEVENSEED_SUPER", discount: "Flat ₹2,500 OFF", minOrder: 50000, status: "exclusive", cashback: 1200 },
  { code: "FESTIVAL_AI_500", discount: "₹500 Instant Discount", minOrder: 10000, status: "verified", cashback: 350 },
  { code: "FIRST_DISPATCH", discount: "10% OFF up to ₹1,000", minOrder: 5000, status: "verified", cashback: 180 },
  { code: "EXPIRED_MONSOON", discount: "Flat ₹3,000 OFF", minOrder: 80000, status: "expired", cashback: 0 },
];

export default function CouponTesterRoute() {
  const [activeCartTotal, setActiveCartTotal] = useState(65000);
  const [testingCode, setTestingCode] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(sampleCoupons[0]);

  const testCoupon = (c: Coupon) => {
    setTestingCode(c.code);
    setTimeout(() => {
      setTestingCode(null);
      if (c.status !== "expired" && activeCartTotal >= c.minOrder) {
        setAppliedCoupon(c);
      } else {
        alert(c.status === "expired" ? "This coupon has expired." : `Minimum order of ₹${c.minOrder.toLocaleString()} required.`);
      }
    }, 400);
  };

  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#030712] text-slate-100 p-6 md:p-10 space-y-8">
        <Spotlight className="-top-40 left-20" fill="rgba(245, 158, 11, 0.2)" />

        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/avp-emart"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="text-[11px] font-mono uppercase text-amber-400">AVP E-Mart Savings Hub</div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
                <Percent className="w-5 h-5 text-amber-400" />
                <span>Automated Coupon Tester & Cashback (xerve.in)</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
              1-Click Automated Coupon Injection
            </span>
          </div>
        </div>

        {/* Cart & Applied Discount Simulator */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-400">
              <span>Active Verified Coupons</span>
              <span>Cart Value: ₹{activeCartTotal.toLocaleString()}</span>
            </div>

            <div className="space-y-3">
              {sampleCoupons.map((c) => {
                const isApplied = appliedCoupon?.code === c.code;
                return (
                  <div
                    key={c.code}
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                      isApplied
                        ? "bg-emerald-950/30 border-emerald-500 shadow-lg shadow-emerald-500/10"
                        : c.status === "expired"
                        ? "bg-slate-950/40 border-slate-800/60 opacity-50"
                        : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-slate-100 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded">
                          {c.code}
                        </span>
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                          c.status === "exclusive" ? "bg-amber-500/20 text-amber-300" : c.status === "verified" ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 font-medium">{c.discount}</div>
                      <div className="text-[10px] font-mono text-slate-500">
                        Min. Order ₹{c.minOrder.toLocaleString()} · Extra ₹{c.cashback} Bank Cashback
                      </div>
                    </div>

                    <button
                      onClick={() => testCoupon(c)}
                      disabled={testingCode === c.code || isApplied || c.status === "expired"}
                      className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                        isApplied
                          ? "bg-emerald-500 text-black cursor-default"
                          : c.status === "expired"
                          ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                          : "bg-amber-500 hover:bg-amber-400 text-black"
                      }`}
                    >
                      {testingCode === c.code ? "Testing..." : isApplied ? "Applied ✓" : "Test & Apply"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart Breakdown Summary */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 h-fit">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span>Savings Breakdown</span>
            </h3>

            <div className="space-y-2 text-xs font-mono border-y border-slate-800/80 py-3">
              <div className="flex justify-between text-slate-400">
                <span>Original Cart Total:</span>
                <span>₹{activeCartTotal.toLocaleString()}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon ({appliedCoupon.code}):</span>
                  <span>-₹2,500</span>
                </div>
              )}
              {appliedCoupon && (
                <div className="flex justify-between text-amber-400">
                  <span>Direct NEFT Cashback:</span>
                  <span>+₹{appliedCoupon.cashback}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between font-mono font-bold text-sm text-slate-100">
              <span>Final Effective Total:</span>
              <span className="text-emerald-400">₹{(activeCartTotal - (appliedCoupon ? 2500 : 0)).toLocaleString()}</span>
            </div>

            <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-[11px] font-mono text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>₹{appliedCoupon?.cashback || 0} withdrawable directly to bank via NEFT</span>
            </div>
          </div>
        </div>
      </main>
    </SmoothScrollProvider>
  );
}
