"use client";

import React, { useState } from "react";
import { HeartHandshake, GraduationCap, Stethoscope, LifeBuoy, Users, Send, CheckCircle2 } from "lucide-react";

// "Support a cause" pledge form for AVP Charitable Trust. There is no payment gateway, so
// nothing here takes money or shows invented campaigns and totals (it used to). A pledge
// is sent to the Trust through the hub's contact endpoint, and the Trust replies with
// bank details and an 80G receipt process.

const CAUSES = [
  { id: "education", name: "Education", icon: GraduationCap, text: "School kits, fees and scholarships for first-generation students." },
  { id: "health", name: "Health camps", icon: Stethoscope, text: "Free check-up and eye camps in under-served areas." },
  { id: "relief", name: "Disaster relief", icon: LifeBuoy, text: "Food, water and shelter kits after floods and cyclones." },
  { id: "community", name: "Community", icon: Users, text: "Local projects chosen with the communities we work with." },
];
const AMOUNTS = [500, 1000, 2500, 5000];

export function CampaignDonationTracker() {
  const [cause, setCause] = useState(CAUSES[0].id);
  const [amount, setAmount] = useState("1000");
  const [form, setForm] = useState({ name: "", email: "", pan: "", note: "", website: "" });
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending"); setErr("");
    const c = CAUSES.find((x) => x.id === cause)!;
    const message = [`Pledge for: ${c.name}`, `Amount: ₹${amount || "not decided"}`, form.pan.trim() && `PAN (for 80G receipt): ${form.pan.trim().toUpperCase()}`, form.note.trim() && `Note: ${form.note.trim()}`].filter(Boolean).join("\n");
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name, email: form.email, subject: `Donation pledge: ${c.name}`, message, website: form.website }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(typeof d.detail === "string" ? d.detail : "Something went wrong. Please try again.");
      setState("sent");
    } catch (x) { setErr((x as Error).message); setState("error"); }
  };
  const input = "mt-1 w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400";

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="rounded-2xl border border-amber-900/40 bg-amber-950/10 p-5 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2"><HeartHandshake className="w-6 h-6 text-amber-300" /> Support a Cause</h1>
        <p className="mt-2 text-sm text-slate-300 max-w-2xl">Choose a cause and tell us how you'd like to help. The Trust will email you the bank details and send an 80G receipt once your donation arrives. You won't be charged on this page.</p>
      </div>

      {state === "sent" ? (
        <div className="rounded-2xl border border-emerald-500/50 bg-emerald-950/30 p-6 text-emerald-100" role="status">
          <p className="font-bold text-lg flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Thank you, {form.name.split(" ")[0] || "friend"}!</p>
          <p className="mt-1 text-sm">Your pledge has reached the Trust. We'll reply to {form.email} with how to donate and get your receipt.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 sm:p-6 space-y-5">
          <fieldset>
            <legend className="text-lg font-bold text-white">1. Choose a cause</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {CAUSES.map((c) => (
                <label key={c.id} className={`p-4 rounded-xl border cursor-pointer flex gap-3 ${cause === c.id ? "border-amber-400 bg-amber-500/10" : "border-slate-800 hover:border-slate-600"}`}>
                  <input type="radio" name="cause" value={c.id} checked={cause === c.id} onChange={() => setCause(c.id)} className="sr-only" />
                  <c.icon className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <span><span className="block font-semibold text-white">{c.name}</span><span className="text-sm text-slate-400">{c.text}</span></span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-lg font-bold text-white">2. Amount you'd like to give (₹)</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {AMOUNTS.map((a) => (
                <button key={a} type="button" onClick={() => setAmount(String(a))} className={`px-4 py-2 rounded-lg border text-sm font-semibold ${amount === String(a) ? "border-amber-400 bg-amber-500/15 text-white" : "border-slate-700 text-slate-300"}`}>₹{a.toLocaleString("en-IN")}</button>
              ))}
              <label className="sr-only" htmlFor="pledge-amount">Other amount</label>
              <input id="pledge-amount" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))} className="w-32 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm font-mono" />
            </div>
          </fieldset>
          <fieldset className="grid gap-3 sm:grid-cols-2">
            <legend className="text-lg font-bold text-white mb-2">3. Your details</legend>
            <label className="text-sm text-slate-300">Name<input required maxLength={100} className={input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
            <label className="text-sm text-slate-300">Email<input required type="email" maxLength={200} className={input} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
            <label className="text-sm text-slate-300">PAN (optional, for the 80G receipt)<input maxLength={10} className={input + " uppercase"} value={form.pan} onChange={(e) => setForm({ ...form, pan: e.target.value })} /></label>
            <label className="text-sm text-slate-300">Message (optional)<input maxLength={500} className={input} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></label>
            <input tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          </fieldset>
          {state === "error" && <p className="text-sm text-rose-300" role="alert">{err}</p>}
          <button type="submit" disabled={state === "sending"} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black font-bold">
            <Send className="w-4 h-4" /> {state === "sending" ? "Sending…" : "Send my pledge"}
          </button>
        </form>
      )}
    </div>
  );
}
