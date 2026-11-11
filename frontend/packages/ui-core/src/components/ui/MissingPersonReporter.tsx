"use client";

import React, { useMemo, useState } from "react";
import { UserSearch, PhoneCall, Copy, Share2, Printer, AlertTriangle, CheckCircle2 } from "lucide-react";

// Missing person / lost article report helper. Sevenseed is not connected to the police,
// so this never claims to file or notify anything (it used to show a fake FIR number and
// "nearest station notified"). It tells people to call 112 first, builds a complete
// report they can hand to the police and share, and lists the official channels.

type Kind = "Missing person" | "Lost item";
const FIELDS: Record<Kind, { key: string; label: string; placeholder: string; multi?: boolean }[]> = {
  "Missing person": [
    { key: "name", label: "Name", placeholder: "Full name" },
    { key: "age", label: "Age and gender", placeholder: "e.g. 14, boy" },
    { key: "looks", label: "Height, build, clothes", placeholder: "e.g. 5'2\", thin, grey school uniform, black bag", multi: true },
    { key: "where", label: "Last seen where", placeholder: "e.g. Maninagar bus depot, Ahmedabad" },
    { key: "when", label: "Last seen when", placeholder: "e.g. Today, about 5:30 pm" },
    { key: "phone", label: "Phone number to contact", placeholder: "Your number" },
    { key: "more", label: "Anything else", placeholder: "Medical needs, languages spoken, phone number they carry…", multi: true },
  ],
  "Lost item": [
    { key: "name", label: "What was lost", placeholder: "e.g. Black leather wallet" },
    { key: "looks", label: "Description and contents", placeholder: "e.g. Aadhaar card, debit card, ₹500", multi: true },
    { key: "where", label: "Where", placeholder: "e.g. Kankaria Lakefront food court" },
    { key: "when", label: "When", placeholder: "e.g. Sunday evening" },
    { key: "phone", label: "Phone number to contact", placeholder: "Your number" },
  ],
};

export function MissingPersonReporter() {
  const [kind, setKind] = useState<Kind>("Missing person");
  const [v, setV] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const report = useMemo(() => {
    const rows = FIELDS[kind].filter((f) => (v[f.key] || "").trim()).map((f) => `${f.label}: ${v[f.key].trim()}`);
    if (!rows.length) return "";
    return `${kind === "Missing person" ? "MISSING PERSON" : "LOST ITEM"}\n\n${rows.join("\n")}\n\nIf you have seen ${kind === "Missing person" ? "this person" : "this item"}, please call ${v.phone?.trim() || "the number above"} or 112.`;
  }, [kind, v]);

  const copy = async () => { try { await navigator.clipboard.writeText(report); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch { setCopied(false); } };
  const print = () => { const w = window.open("", "_blank"); if (!w) return; w.document.write(`<pre style="font:18px/1.5 system-ui;white-space:pre-wrap;padding:32px">${report.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] as string)}</pre>`); w.document.close(); w.print(); };
  const input = "w-full px-3.5 py-2.5 rounded-xl bg-[#1a0505] border border-red-900/50 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500";

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="rounded-2xl border border-red-900/40 bg-red-950/10 p-5 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2"><UserSearch className="w-6 h-6 text-red-400" /> Missing Person &amp; Lost Item Report</h1>
        <p className="mt-2 text-sm text-slate-300 max-w-2xl">Build a clear, complete report to give the police and share with people nearby.</p>
      </div>

      {kind === "Missing person" && (
        <div className="rounded-2xl border border-rose-500/50 bg-rose-950/30 p-5 space-y-3">
          <p className="font-bold text-rose-100 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-rose-300" /> If someone is missing, call 112 now. Don't wait.</p>
          <p className="text-sm text-rose-100/90">There is no waiting period: police must register a report for a missing person straight away, and for a missing child it is registered as an FIR. This page does not contact the police for you.</p>
          <div className="flex flex-wrap gap-2">
            <a href="tel:112" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-black font-bold"><PhoneCall className="w-4 h-4" /> Call 112</a>
            <a href="tel:1098" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-400/60 text-rose-100 font-semibold"><PhoneCall className="w-4 h-4" /> Childline 1098</a>
          </div>
        </div>
      )}

      <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 sm:p-6">
        <div className="flex gap-2" role="tablist">
          {(Object.keys(FIELDS) as Kind[]).map((k) => (
            <button key={k} type="button" role="tab" aria-selected={k === kind} onClick={() => setKind(k)} className={`px-3 py-2 rounded-lg text-sm border ${k === kind ? "border-red-400 bg-red-500/15 text-white" : "border-slate-700 text-slate-300"}`}>{k}</button>
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {FIELDS[kind].map((f) => (
            <label key={f.key} className={`text-sm text-slate-300 ${f.multi ? "sm:col-span-2" : ""}`}>{f.label}
              {f.multi
                ? <textarea rows={2} value={v[f.key] || ""} placeholder={f.placeholder} onChange={(e) => setV({ ...v, [f.key]: e.target.value })} className={input + " mt-1 resize-y"} />
                : <input value={v[f.key] || ""} placeholder={f.placeholder} onChange={(e) => setV({ ...v, [f.key]: e.target.value })} className={input + " mt-1"} />}
            </label>
          ))}
        </div>
        {kind === "Missing person" && <p className="mt-3 text-sm text-slate-400">Take a recent, clear photo of their face with you to the police station.</p>}
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 sm:p-6" aria-live="polite">
        <h2 className="text-lg font-bold text-white">Your report</h2>
        {report ? (
          <>
            <pre className="mt-3 whitespace-pre-wrap text-sm text-slate-100 bg-slate-900/70 border border-slate-800 rounded-xl p-4 font-sans">{report}</pre>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-black font-bold text-sm">{copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? "Copied" : "Copy report"}</button>
              <a href={`https://wa.me/?text=${encodeURIComponent(report)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-100 text-sm hover:border-red-400"><Share2 className="w-4 h-4" /> Share on WhatsApp</a>
              <button type="button" onClick={print} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-100 text-sm hover:border-red-400"><Printer className="w-4 h-4" /> Print</button>
            </div>
          </>
        ) : <p className="mt-2 text-sm text-slate-400">Fill in the details above and your report appears here.</p>}
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 sm:p-6 text-sm text-slate-300 space-y-2">
        <h2 className="text-lg font-bold text-white">Next steps</h2>
        <p>1. Go to the nearest police station with the report and a photo, and ask for a copy of the FIR or complaint with its number.</p>
        <p>2. {kind === "Missing person" ? "Check with hospitals and the railway/bus station near where they were last seen." : "For lost ID cards or phones, the police complaint copy helps you get replacements and block misuse."}</p>
        <p>3. Lost phone? Block it on the government's CEIR portal: <a className="text-red-300 underline" href="https://www.ceir.gov.in" target="_blank" rel="noopener noreferrer">ceir.gov.in</a>.</p>
      </section>
    </div>
  );
}
