"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Spotlight, SmoothScrollProvider } from "@main/ui-core";
import { ArrowLeft, Percent, Plus, Trash2, Check } from "lucide-react";

// Coupon & cashback calculator. The old page listed invented coupon codes as "verified"
// and pretended to test them. Here the shopper types the offers they actually have; the
// page works out each offer's value against their cart and the final price after stacking
// one coupon with one bank-card offer and cashback, which is how most Indian stores allow it.

type Kind = "flat" | "percent";
type Offer = { id: string; label: string; kind: Kind; value: string; cap: string; min: string; group: "coupon" | "card" | "cashback" };
const KEY = "ss-emart-offers";
const SAMPLE: Offer[] = [
  { id: "o1", label: "Example: store coupon", kind: "percent", value: "10", cap: "1000", min: "5000", group: "coupon" },
  { id: "o2", label: "Example: bank card offer", kind: "flat", value: "1500", cap: "", min: "20000", group: "card" },
  { id: "o3", label: "Example: wallet cashback", kind: "percent", value: "2", cap: "500", min: "", group: "cashback" },
];
const num = (s: string) => Math.max(0, parseFloat(s) || 0);
const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
const GROUPS = { coupon: "Coupon", card: "Card offer", cashback: "Cashback (after payment)" } as const;

function value(o: Offer, amount: number) {
  if (num(o.min) && amount < num(o.min)) return { ok: false, v: 0 };
  let v = o.kind === "flat" ? num(o.value) : (amount * num(o.value)) / 100;
  if (o.kind === "percent" && num(o.cap)) v = Math.min(v, num(o.cap));
  return { ok: true, v: Math.min(v, amount) };
}

export default function CouponTesterRoute() {
  const [cart, setCart] = useState("25000");
  const [offers, setOffers] = useState<Offer[]>(SAMPLE);
  useEffect(() => { try { const v = JSON.parse(localStorage.getItem(KEY) || "null"); if (v?.offers) { setOffers(v.offers); setCart(v.cart); } } catch { /* ignore */ } }, []);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify({ offers, cart })); } catch { /* ignore */ } }, [offers, cart]);
  const set = (id: string, k: keyof Offer, v: string) => setOffers((os) => os.map((o) => (o.id === id ? { ...o, [k]: v } : o)));

  const best = useMemo(() => {
    const total = num(cart);
    const pick = (g: Offer["group"], amount: number) => offers.filter((o) => o.group === g).map((o) => ({ o, ...value(o, amount) })).filter((x) => x.ok).sort((a, b) => b.v - a.v)[0];
    const c = pick("coupon", total);
    const afterCoupon = total - (c?.v || 0);
    const k = pick("card", afterCoupon);
    const pay = afterCoupon - (k?.v || 0);
    const cb = pick("cashback", pay);
    return { total, c, k, pay, cb, effective: pay - (cb?.v || 0) };
  }, [cart, offers]);

  const input = "w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400";

  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-[#030712] text-slate-100 px-4 py-8 md:p-10">
        <Spotlight className="-top-40 left-20" fill="rgba(245, 158, 11, 0.2)" />
        <div className="relative z-10 max-w-5xl mx-auto space-y-6">
          <Link href="/avp-emart" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-300 hover:text-amber-200"><ArrowLeft className="w-4 h-4" /> Back to AVP E-Mart</Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2"><Percent className="w-6 h-6 text-amber-400" /> Coupon &amp; cashback calculator</h1>
            <p className="mt-2 text-sm text-slate-300 max-w-2xl">Type in the offers you can see at checkout: coupons, bank-card discounts and cashback. We work out what each is worth on your cart and the best combination. Most stores let you use one coupon plus one card offer.</p>
          </div>

          <label className="block max-w-xs text-sm text-slate-300">Cart total (₹)<input className={input + " mt-1.5 font-mono text-lg"} inputMode="decimal" value={cart} onChange={(e) => setCart(e.target.value.replace(/[^\d.]/g, ""))} /></label>

          <div className="rounded-2xl border border-slate-800 overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-slate-950/70 text-left text-slate-400"><tr><th className="p-2.5">Offer</th><th className="p-2.5 w-40">Type</th><th className="p-2.5 w-24">Value</th><th className="p-2.5 w-24">Max ₹</th><th className="p-2.5 w-28">Min order ₹</th><th className="p-2.5 w-24">Worth</th><th /></tr></thead>
              <tbody className="divide-y divide-slate-800">
                {offers.map((o) => {
                  const w = value(o, num(cart));
                  return (
                    <tr key={o.id}>
                      <td className="p-2"><input aria-label="Offer name" className={input} value={o.label} onChange={(e) => set(o.id, "label", e.target.value)} /><select aria-label="Offer group" className={input + " mt-1.5"} value={o.group} onChange={(e) => set(o.id, "group", e.target.value)}>{Object.entries(GROUPS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></td>
                      <td className="p-2"><select aria-label="Discount type" className={input} value={o.kind} onChange={(e) => set(o.id, "kind", e.target.value)}><option value="percent">% off</option><option value="flat">₹ off</option></select></td>
                      <td className="p-2"><input aria-label="Value" inputMode="decimal" className={input + " font-mono"} value={o.value} onChange={(e) => set(o.id, "value", e.target.value.replace(/[^\d.]/g, ""))} /></td>
                      <td className="p-2"><input aria-label="Maximum discount" inputMode="decimal" disabled={o.kind === "flat"} className={input + " font-mono disabled:opacity-40"} value={o.cap} onChange={(e) => set(o.id, "cap", e.target.value.replace(/[^\d.]/g, ""))} /></td>
                      <td className="p-2"><input aria-label="Minimum order" inputMode="decimal" className={input + " font-mono"} value={o.min} onChange={(e) => set(o.id, "min", e.target.value.replace(/[^\d.]/g, ""))} /></td>
                      <td className="p-2 font-mono">{w.ok ? <span className="text-emerald-300">{inr(w.v)}</span> : <span className="text-amber-300 text-xs">Below min</span>}</td>
                      <td className="p-2"><button type="button" aria-label={`Remove ${o.label}`} onClick={() => setOffers((os) => os.filter((x) => x.id !== o.id))} className="p-1.5 text-slate-500 hover:text-rose-300"><Trash2 className="w-4 h-4" /></button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setOffers((os) => [...os, { id: `o-${Date.now()}`, label: "", kind: "percent", value: "", cap: "", min: "", group: "coupon" }])} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 text-sm text-slate-200 hover:border-amber-400"><Plus className="w-4 h-4" /> Add an offer</button>
            <button type="button" onClick={() => setOffers([])} className="px-3 py-2 rounded-lg border border-slate-700 text-sm text-slate-300">Clear examples</button>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30 grid gap-4 sm:grid-cols-2" aria-live="polite">
            <div className="space-y-1.5 text-sm text-slate-300">
              <div className="flex justify-between"><span>Cart</span><span className="font-mono">{inr(best.total)}</span></div>
              <div className="flex justify-between"><span>Best coupon{best.c ? `: ${best.c.o.label || "unnamed"}` : ""}</span><span className="font-mono text-emerald-300">−{inr(best.c?.v || 0)}</span></div>
              <div className="flex justify-between"><span>Best card offer{best.k ? `: ${best.k.o.label || "unnamed"}` : ""}</span><span className="font-mono text-emerald-300">−{inr(best.k?.v || 0)}</span></div>
              <div className="flex justify-between font-bold text-white border-t border-slate-800 pt-1.5"><span>You pay</span><span className="font-mono">{inr(best.pay)}</span></div>
              <div className="flex justify-between"><span>Cashback later{best.cb ? `: ${best.cb.o.label || "unnamed"}` : ""}</span><span className="font-mono text-emerald-300">−{inr(best.cb?.v || 0)}</span></div>
            </div>
            <div className="flex flex-col justify-center items-start sm:items-end">
              <div className="text-sm text-slate-400">Effective price</div>
              <div className="text-4xl font-black font-mono text-white">{inr(best.effective)}</div>
              {best.total > 0 && <div className="text-sm text-emerald-300 flex items-center gap-1"><Check className="w-4 h-4" /> {Math.round(((best.total - best.effective) / best.total) * 100)}% saved in total</div>}
            </div>
          </div>
          <p className="text-xs text-slate-500">Assumes the card offer applies to the price after the coupon, which is the usual rule. Check each offer's terms, as some exclude certain cards, sellers or EMI payments.</p>
        </div>
      </main>
    </SmoothScrollProvider>
  );
}
