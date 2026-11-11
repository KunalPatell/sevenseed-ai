"use client";

import React, { useEffect, useMemo, useState } from "react";
import { TrendingDown, Plus, Trash2, ExternalLink, LineChart } from "lucide-react";

// Personal price log. Sevenseed has no store price feed, so the history comes from the
// prices the shopper records (the old version drew invented points for a made-up product
// and claimed an "instant email/SMS" alert it could not send). Saved on this device.

type Point = { price: number; at: string; store: string };
type Log = Record<string, Point[]>;
const KEY = "ss-emart-price-log";
const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

export function PriceHistoryGraph({ className = "" }: { productName?: string; currentPrice?: number; highestPrice?: number; lowestPrice?: number; className?: string }) {
  const [log, setLog] = useState<Log>({});
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("");
  const [store, setStore] = useState("Amazon");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => { try { setLog(JSON.parse(localStorage.getItem(KEY) || "{}")); } catch { /* ignore */ } }, []);
  const save = (l: Log) => { setLog(l); try { localStorage.setItem(KEY, JSON.stringify(l)); } catch { /* ignore */ } };
  const names = Object.keys(log);
  const active = product.trim() && log[product.trim()] ? product.trim() : names[0] || "";
  const pts = useMemo(() => (log[active] || []).slice().sort((a, b) => a.at.localeCompare(b.at)), [log, active]);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(price), name = product.trim();
    if (!name || !(p > 0)) return;
    save({ ...log, [name]: [...(log[name] || []), { price: p, at: date, store: store.trim() || "Store" }] });
    setPrice("");
  };

  const stats = pts.length ? { min: Math.min(...pts.map((p) => p.price)), max: Math.max(...pts.map((p) => p.price)), last: pts[pts.length - 1].price } : null;
  const W = 600, H = 200;
  const lo = stats ? stats.min * 0.97 : 0, hi = stats ? stats.max * 1.03 : 1;
  const xy = (i: number, p: number) => ({ x: pts.length > 1 ? 30 + (i / (pts.length - 1)) * (W - 60) : W / 2, y: H - 25 - ((p - lo) / (hi - lo || 1)) * (H - 50) });
  const path = pts.map((p, i) => `${i ? "L" : "M"} ${xy(i, p.price).x} ${xy(i, p.price).y}`).join(" ");
  const input = "px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-400";

  return (
    <div className={`w-full bg-[#050814] border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6 ${className}`}>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2"><LineChart className="w-6 h-6 text-sky-400" /> Price Tracker</h1>
        <p className="mt-1 text-sm text-slate-300 max-w-2xl">Each time you check a product's price, log it here. Over a few weeks you'll see whether today's “sale” is really the lowest price. Saved on this device.</p>
      </div>

      <form onSubmit={add} className="grid gap-2 sm:grid-cols-[1.5fr_0.8fr_0.8fr_0.9fr_auto]">
        <label className="sr-only" htmlFor="pt-product">Product</label>
        <input id="pt-product" list="pt-products" value={product} onChange={(e) => setProduct(e.target.value)} placeholder="Product, e.g. Sony WH-1000XM5" className={input} />
        <datalist id="pt-products">{names.map((n) => <option key={n} value={n} />)}</datalist>
        <label className="sr-only" htmlFor="pt-price">Price in rupees</label>
        <input id="pt-price" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value.replace(/[^\d.]/g, ""))} placeholder="Price ₹" className={input + " font-mono"} />
        <label className="sr-only" htmlFor="pt-store">Store</label>
        <input id="pt-store" value={store} onChange={(e) => setStore(e.target.value)} placeholder="Store" className={input} />
        <label className="sr-only" htmlFor="pt-date">Date</label>
        <input id="pt-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className={input} />
        <button type="submit" className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-black font-bold text-sm"><Plus className="w-4 h-4" /> Log price</button>
      </form>

      {names.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {names.map((n) => <button key={n} type="button" onClick={() => setProduct(n)} className={`px-3 py-1.5 rounded-lg text-sm border ${n === active ? "border-sky-400 bg-sky-500/15 text-white" : "border-slate-700 text-slate-300"}`}>{n}</button>)}
        </div>
      )}

      {!active ? (
        <p className="text-sm text-slate-400">No prices logged yet. Add the first one above.</p>
      ) : (
        <section aria-live="polite" className="space-y-4">
          <h2 className="text-lg font-bold text-white">{active}</h2>
          {stats && (
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800"><div className="text-xs text-slate-400">Lowest seen</div><div className="font-mono font-bold text-emerald-300">{inr(stats.min)}</div></div>
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800"><div className="text-xs text-slate-400">Highest seen</div><div className="font-mono font-bold text-rose-300">{inr(stats.max)}</div></div>
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800"><div className="text-xs text-slate-400">Latest</div><div className="font-mono font-bold text-white">{inr(stats.last)}</div></div>
            </div>
          )}
          {stats && pts.length > 1 && (
            <p className="text-sm text-slate-200 flex items-center gap-2"><TrendingDown className="w-4 h-4 text-sky-300" />
              {stats.last <= stats.min ? "The latest price is the lowest you've recorded." : `The latest price is ${inr(stats.last - stats.min)} (${Math.round(((stats.last - stats.min) / stats.min) * 100)}%) above the lowest you've seen. Waiting may pay off.`}
            </p>
          )}
          {pts.length > 1 && (
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto rounded-xl bg-slate-950 border border-slate-800" role="img" aria-label={`Price history for ${active}`}>
              <path d={path} fill="none" stroke="#38bdf8" strokeWidth="2.5" />
              {pts.map((p, i) => { const c = xy(i, p.price); return <circle key={i} cx={c.x} cy={c.y} r="4" fill="#38bdf8"><title>{`${p.at}: ${inr(p.price)} at ${p.store}`}</title></circle>; })}
            </svg>
          )}
          <ul className="divide-y divide-slate-900 text-sm">
            {pts.slice().reverse().map((p, i) => (
              <li key={i} className="py-2 flex justify-between items-center gap-2">
                <span className="text-slate-300">{new Date(p.at).toLocaleDateString("en-IN")} · {p.store}</span>
                <span className="flex items-center gap-2 font-mono text-white">{inr(p.price)}
                  <button type="button" aria-label="Delete this entry" onClick={() => { const rest = (log[active] || []).filter((x) => x !== p); const l = { ...log }; if (rest.length) l[active] = rest; else delete l[active]; save(l); }} className="p-1.5 text-slate-500 hover:text-rose-300"><Trash2 className="w-4 h-4" /></button>
                </span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="text-slate-400 self-center">Check today's price:</span>
            {[["Amazon", "https://www.amazon.in/s?k="], ["Flipkart", "https://www.flipkart.com/search?q="], ["Google Shopping", "https://www.google.com/search?tbm=shop&q="]].map(([s, u]) => (
              <a key={s} href={u + encodeURIComponent(active)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-700 text-slate-200 hover:border-sky-400">{s} <ExternalLink className="w-3 h-3" /></a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
