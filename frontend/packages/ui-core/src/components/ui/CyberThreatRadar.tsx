"use client";

import React, { useState } from "react";
import { ShieldAlert, Globe, PhoneCall, AlertTriangle, Info, ExternalLink } from "lucide-react";

// Suspicious-link checker. It inspects the link itself for well-known scam patterns.
// It is not connected to any threat database, so it never declares a link "safe"
// (the old version called every link without "apk"/"fake"/"kyc" clean, citing
// telemetry it did not have).

const BRANDS = ["sbi", "hdfc", "icici", "axis", "kotak", "paytm", "phonepe", "gpay", "googlepay", "amazon", "flipkart", "irctc", "incometax", "epfo", "uidai", "aadhaar", "npci", "bhim", "airtel", "jio"];
const OFFICIAL = /(^|\.)(sbi\.co\.in|onlinesbi\.sbi|hdfcbank\.com|icicibank\.com|axisbank\.com|kotak\.com|paytm\.com|phonepe\.com|amazon\.in|amazon\.com|flipkart\.com|irctc\.co\.in|incometax\.gov\.in|epfindia\.gov\.in|uidai\.gov\.in|npci\.org\.in|airtel\.in|jio\.com|google\.com)$/;
const SHORTENERS = /^(bit\.ly|tinyurl\.com|t\.co|cutt\.ly|rb\.gy|is\.gd|shorturl\.at|tiny\.cc|ow\.ly|goo\.gl)$/;
const RISKY_TLDS = /\.(xyz|top|click|link|zip|mov|ru|cn|tk|ml|ga|cf|gq|buzz|rest|cam|icu|work|support|live|online|site|shop)$/;
const LURES = ["kyc", "update", "verify", "blocked", "suspend", "reward", "lottery", "prize", "refund", "cashback", "electricity", "bill-pay", "pan-link", "otp", "login", "free-gift", "job-offer"];

type Flag = { level: "high" | "medium"; text: string };

function inspect(raw: string): { host: string; flags: Flag[] } | { error: string } {
  let s = raw.trim();
  if (!s) return { error: "Paste a link first." };
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(s)) s = "http://" + s;
  let u: URL;
  try { u = new URL(s); } catch { return { error: "That doesn't look like a web link. Check you copied the whole thing." }; }
  const host = u.hostname.toLowerCase();
  const full = (u.hostname + u.pathname + u.search).toLowerCase();
  const flags: Flag[] = [];
  if (u.protocol === "http:" && /^http:\/\//i.test(raw.trim())) flags.push({ level: "medium", text: "It isn't secure (http, not https). Never enter passwords or card details on it." });
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) flags.push({ level: "high", text: "It uses a bare number address instead of a name. Real banks and shops never do this." });
  if (host.startsWith("xn--") || host.includes(".xn--")) flags.push({ level: "high", text: "It uses look-alike characters to imitate another website's name." });
  if (raw.includes("@")) flags.push({ level: "high", text: "It contains an @ sign, a trick that hides the real website behind a fake-looking start." });
  if (/\.apk(\?|$)/.test(u.pathname.toLowerCase())) flags.push({ level: "high", text: "It downloads an Android app (.apk) from outside the Play Store. Scammers use these to read your OTPs and take over your phone." });
  const brand = BRANDS.find((b) => host.replace(/[-.]/g, "").includes(b));
  if (brand && !OFFICIAL.test(host)) flags.push({ level: "high", text: `It mentions “${brand}” but is not that company's official website.` });
  if (SHORTENERS.test(host)) flags.push({ level: "medium", text: "It's a shortened link, which hides where it really goes." });
  if (RISKY_TLDS.test(host)) flags.push({ level: "medium", text: `The ending “.${host.split(".").pop()}” is cheap to register and common in scam links.` });
  if (host.split(".").length > 4) flags.push({ level: "medium", text: "It has an unusually long chain of sub-names, often used to make a fake site look official." });
  const lure = LURES.filter((w) => full.includes(w));
  if (lure.length) flags.push({ level: "medium", text: `It uses pressure words (${lure.slice(0, 3).join(", ")}), typical of “update your KYC” and “claim your prize” scams.` });
  return { host, flags };
}

export function CyberThreatRadar() {
  const [link, setLink] = useState("");
  const [res, setRes] = useState<ReturnType<typeof inspect> | null>(null);
  const high = res && "flags" in res && res.flags.some((f) => f.level === "high");

  return (
    <div className="w-full max-w-4xl mx-auto p-5 md:p-8 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <ShieldAlert className="w-4 h-4" /> Scam link check
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Is This Link a Scam?</h1>
        <p className="text-slate-300 text-sm mt-2 max-w-xl mx-auto">Paste a link from an SMS, WhatsApp or email. We check it for the warning signs scammers use. Don't open the link yourself until you've checked.</p>
      </div>

      <form className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto" onSubmit={(e) => { e.preventDefault(); setRes(inspect(link)); }}>
        <label htmlFor="scam-link" className="sr-only">Link to check</label>
        <input id="scam-link" value={link} onChange={(e) => setLink(e.target.value)} placeholder="e.g. sbi-kyc-update.xyz/login" className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-rose-400" />
        <button type="submit" className="px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-xl inline-flex items-center justify-center gap-1.5"><Globe className="w-4 h-4" /> Check link</button>
      </form>

      <div aria-live="polite" className="max-w-2xl mx-auto">
        {res && "error" in res && <p className="text-amber-300 text-sm">{res.error}</p>}
        {res && "flags" in res && (
          res.flags.length ? (
            <div className={`p-5 rounded-xl border ${high ? "bg-rose-500/10 border-rose-500/40" : "bg-amber-500/10 border-amber-500/40"}`}>
              <h2 className={`font-bold text-lg flex items-center gap-2 ${high ? "text-rose-200" : "text-amber-200"}`}><AlertTriangle className="w-5 h-5" /> {high ? "Very likely a scam: don't open it" : "Suspicious: be careful"}</h2>
              <p className="text-sm text-slate-300 mt-1 font-mono break-all">{res.host}</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-100 list-disc pl-5">{res.flags.map((f, i) => <li key={i}>{f.text}</li>)}</ul>
            </div>
          ) : (
            <div className="p-5 rounded-xl border bg-slate-800/60 border-slate-600">
              <h2 className="font-bold text-lg text-slate-100 flex items-center gap-2"><Info className="w-5 h-5 text-sky-300" /> No obvious warning signs</h2>
              <p className="text-sm text-slate-300 mt-1 font-mono break-all">{res.host}</p>
              <p className="text-sm text-slate-300 mt-2">That doesn't make it safe: new scam sites can look perfectly normal. If the message asked you to pay, log in or share an OTP, go to the company's app or type its address yourself instead.</p>
            </div>
          )
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <a href="tel:1930" className="p-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-3"><PhoneCall className="w-6 h-6" /><span><b className="block text-xl font-mono">1930</b><span className="text-sm">Lost money to a scam? Call now: the sooner, the better the chance of freezing it.</span></span></a>
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-300 space-y-1.5">
          <a className="flex items-center gap-1 underline text-rose-200" href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer">Report at cybercrime.gov.in <ExternalLink className="w-3.5 h-3.5" /></a>
          <a className="flex items-center gap-1 underline text-rose-200" href="https://sancharsaathi.gov.in" target="_blank" rel="noopener noreferrer">Report scam calls and SMS on Sanchar Saathi (Chakshu) <ExternalLink className="w-3.5 h-3.5" /></a>
        </div>
      </div>
    </div>
  );
}
