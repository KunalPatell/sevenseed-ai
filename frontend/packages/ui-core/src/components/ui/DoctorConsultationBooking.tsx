"use client";

import React, { useMemo, useState } from "react";
import { Stethoscope, Video, ExternalLink, Copy, CheckCircle2, PhoneCall, AlertTriangle } from "lucide-react";

// Online consultation helper. Sevenseed does not employ doctors or run bookings (this
// used to list invented doctors and confirm video calls that never happened). It points
// to eSanjeevani, the Government of India's free teleconsultation service, and helps the
// patient prepare a short, complete summary to read out or paste during the consult.

const RED_FLAGS = ["Chest pain or pressure", "Trouble breathing", "Fainting or confusion", "Weakness or numbness on one side of the body", "Severe bleeding", "A seizure"];

export function DoctorConsultationBooking() {
  const [f, setF] = useState({ who: "", age: "", main: "", since: "", meds: "", allergies: "", questions: "" });
  const [flags, setFlags] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const summary = useMemo(() => {
    if (!f.main.trim()) return "";
    return [
      `Patient: ${[f.who, f.age].filter((x) => x.trim()).join(", ") || "-"}`,
      `Main problem: ${f.main.trim()}`,
      f.since.trim() && `Since: ${f.since.trim()}`,
      f.meds.trim() && `Current medicines: ${f.meds.trim()}`,
      `Allergies: ${f.allergies.trim() || "None known"}`,
      f.questions.trim() && `My questions: ${f.questions.trim()}`,
    ].filter(Boolean).join("\n");
  }, [f]);

  const input = "mt-1 w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-teal-400";

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="rounded-2xl border border-teal-900/40 bg-teal-950/20 p-5 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2"><Stethoscope className="w-6 h-6 text-teal-300" /> Talk to a Doctor Online, Free</h1>
        <p className="mt-2 text-sm text-slate-300 max-w-2xl">eSanjeevani is the Government of India's free video consultation service with registered doctors. Prepare your summary here first so the call is quick and nothing is missed.</p>
        <a href="https://esanjeevani.mohfw.gov.in" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-bold text-sm"><Video className="w-4 h-4" /> Open eSanjeevani <ExternalLink className="w-4 h-4" /></a>
      </div>

      <section className="rounded-2xl border border-rose-500/40 bg-rose-950/20 p-5">
        <h2 className="font-bold text-rose-100 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-rose-300" /> Is it an emergency?</h2>
        <p className="text-sm text-rose-100/80 mt-1">Tick anything that's happening now.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {RED_FLAGS.map((r) => (
            <label key={r} className="flex items-center gap-2 text-sm text-rose-50">
              <input type="checkbox" className="accent-rose-500" checked={flags.includes(r)} onChange={(e) => setFlags((x) => (e.target.checked ? [...x, r] : x.filter((y) => y !== r)))} /> {r}
            </label>
          ))}
        </div>
        {flags.length > 0 && (
          <div className="mt-4 p-4 rounded-xl bg-rose-600 text-white" role="alert">
            <p className="font-bold">Don't wait for an online consult. Call an ambulance now.</p>
            <a href="tel:108" className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-rose-700 font-black"><PhoneCall className="w-4 h-4" /> Call 108</a>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 sm:p-6">
        <h2 className="text-lg font-bold text-white">Prepare your consultation summary</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm text-slate-300">Who is the patient<input className={input} value={f.who} placeholder="e.g. Myself / my mother" onChange={(e) => setF({ ...f, who: e.target.value })} /></label>
          <label className="text-sm text-slate-300">Age<input className={input} value={f.age} placeholder="e.g. 58" onChange={(e) => setF({ ...f, age: e.target.value })} /></label>
          <label className="text-sm text-slate-300 sm:col-span-2">Main problem<textarea rows={2} className={input} value={f.main} placeholder="e.g. Fever and dry cough, worse at night" onChange={(e) => setF({ ...f, main: e.target.value })} /></label>
          <label className="text-sm text-slate-300">Since when<input className={input} value={f.since} placeholder="e.g. 3 days" onChange={(e) => setF({ ...f, since: e.target.value })} /></label>
          <label className="text-sm text-slate-300">Allergies<input className={input} value={f.allergies} placeholder="e.g. Penicillin" onChange={(e) => setF({ ...f, allergies: e.target.value })} /></label>
          <label className="text-sm text-slate-300 sm:col-span-2">Medicines currently taking<input className={input} value={f.meds} placeholder="e.g. Metformin 500 mg twice a day" onChange={(e) => setF({ ...f, meds: e.target.value })} /></label>
          <label className="text-sm text-slate-300 sm:col-span-2">Questions for the doctor<textarea rows={2} className={input} value={f.questions} placeholder="e.g. Do I need a blood test?" onChange={(e) => setF({ ...f, questions: e.target.value })} /></label>
        </div>
        <div className="mt-4" aria-live="polite">
          {summary ? (
            <>
              <pre className="whitespace-pre-wrap text-sm font-sans text-slate-100 bg-slate-900/70 border border-slate-800 rounded-xl p-4">{summary}</pre>
              <button type="button" onClick={async () => { try { await navigator.clipboard.writeText(summary); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch { /* ignore */ } }} className="mt-3 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-100 text-sm hover:border-teal-400">
                {copied ? <CheckCircle2 className="w-4 h-4 text-teal-300" /> : <Copy className="w-4 h-4" />} {copied ? "Copied" : "Copy summary"}
              </button>
            </>
          ) : <p className="text-sm text-slate-400">Describe the main problem to build your summary.</p>}
        </div>
      </section>
      <p className="text-xs text-slate-500">This page gives general guidance only and is not medical advice. Nothing you type here is sent anywhere.</p>
    </div>
  );
}
