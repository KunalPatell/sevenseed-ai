"use client";

import React, { useMemo, useState } from "react";
import { Scale, Printer, Copy, Phone, AlertTriangle, Download } from "lucide-react";

// Police complaint draft helper. The old version printed the same "Sections 304 & 351"
// complaint whatever you typed. This builds a draft from the visitor's own details and
// suggests sections that may apply, clearly as suggestions: the police decide the sections.

type Section = { id: string; words: RegExp; law: string; title: string };
const SECTIONS: Section[] = [
  { id: "snatch", words: /snatch|grabbed (my|the)|pulled (my|the) (chain|bag|phone)/i, law: "BNS 304", title: "Snatching" },
  { id: "robbery", words: /robb|at knife|at gun|weapon|knife|threatened .* (gave|hand)/i, law: "BNS 309", title: "Robbery" },
  { id: "theft", words: /stole|stolen|theft|missing from|pickpocket|took (my|the)/i, law: "BNS 303", title: "Theft" },
  { id: "cheat", words: /cheat|fraud|scam|fake (job|offer|loan|call)|paid .* never|otp|upi|duped/i, law: "BNS 318", title: "Cheating" },
  { id: "imperson", words: /pretend|posing as|impersonat|fake (officer|police|bank)/i, law: "BNS 319", title: "Cheating by impersonation" },
  { id: "cyber", words: /online|upi|otp|account hacked|hack|whatsapp|instagram|facebook|link|app/i, law: "IT Act 66C / 66D", title: "Identity theft or online cheating" },
  { id: "threat", words: /threat|intimidat|kill you|harm (me|my)|warned me/i, law: "BNS 351", title: "Criminal intimidation" },
  { id: "hurt", words: /hit|beat|slap|punch|injur|assault|attacked/i, law: "BNS 115", title: "Voluntarily causing hurt" },
  { id: "woman", words: /molest|touched (me )?inappropriately|outrage|modesty/i, law: "BNS 74", title: "Assault on a woman's modesty" },
  { id: "harass", words: /sexual(ly)? harass|lewd|obscene (message|call)/i, law: "BNS 75", title: "Sexual harassment" },
  { id: "stalk", words: /stalk|follow(s|ed|ing) me|keeps (calling|messaging)/i, law: "BNS 78", title: "Stalking" },
  { id: "cruelty", words: /dowry|husband .* (beat|harass)|in-laws/i, law: "BNS 85", title: "Cruelty by husband or relatives" },
  { id: "trespass", words: /broke into|break-in|entered (my|our) (house|home|shop)|trespass/i, law: "BNS 329 / 331", title: "Trespass or house-breaking" },
  { id: "mischief", words: /damag|vandal|broke (my|the) (car|window|door)|set fire/i, law: "BNS 324", title: "Mischief (damage to property)" },
  { id: "trust", words: /misappropriat|embezzl|breach of trust|kept (my|the) money/i, law: "BNS 316", title: "Criminal breach of trust" },
];

const blank = { name: "", relation: "", address: "", phone: "", when: "", where: "", what: "", accused: "", lost: "", witnesses: "" };

export function BNSFIRGenerator() {
  const [f, setF] = useState(blank);
  const [copied, setCopied] = useState(false);
  const set = (k: keyof typeof blank) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  const matches = useMemo(() => SECTIONS.filter((s) => s.words.test(f.what)), [f.what]);
  const isCyber = matches.some((m) => m.id === "cyber" || m.id === "cheat");

  const draft = useMemo(() => {
    const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    return [
      "To,",
      "The Station House Officer,",
      f.where ? `Police Station having jurisdiction over ${f.where}` : "[Police Station name]",
      "",
      "Subject: Complaint for registration of FIR under Section 173 of the Bharatiya Nagarik Suraksha Sanhita, 2023",
      "",
      "Respected Sir/Madam,",
      "",
      `I, ${f.name || "[your full name]"}${f.relation ? `, ${f.relation}` : ""}, residing at ${f.address || "[your address]"}, phone ${f.phone || "[your phone]"}, wish to report the following incident.`,
      "",
      `Date and time of incident: ${f.when || "[date and time]"}`,
      `Place of incident: ${f.where || "[place]"}`,
      "",
      "What happened:",
      f.what || "[Describe what happened, in order, in your own words.]",
      "",
      `Person(s) responsible: ${f.accused || "Unknown"}`,
      ...(f.lost ? [`Property lost or damaged, with approximate value: ${f.lost}`] : []),
      ...(f.witnesses ? [`Witnesses: ${f.witnesses}`] : []),
      "",
      "I request you to register an FIR and take action as per law. If this police station does not have jurisdiction, I request registration of a Zero FIR and transfer to the concerned police station.",
      "",
      "I declare that the above facts are true to the best of my knowledge.",
      "",
      "Yours faithfully,",
      f.name || "[Name]",
      `Date: ${today}`,
      "Signature: ____________",
    ].join("\n");
  }, [f]);

  const copy = async () => { try { await navigator.clipboard.writeText(draft); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* ignore */ } };
  const download = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([draft], { type: "text/plain" }));
    a.download = "police-complaint-draft.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };

  const input = "w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-rose-500";
  const field = (k: keyof typeof blank, label: string, ph: string) => (
    <label className="block text-sm text-slate-300">{label}<input className={input + " mt-1.5"} value={f[k]} onChange={set(k)} placeholder={ph} /></label>
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="p-6 md:p-8 bg-slate-900/90 border border-slate-800 rounded-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2"><Scale className="w-6 h-6 text-rose-400" /> Police complaint draft</h1>
        <p className="mt-2 text-sm text-slate-300 max-w-2xl">Write down what happened and get a clear, properly laid-out complaint to take to the police station or attach to an online complaint. Nothing is sent anywhere: this page doesn't file an FIR.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href="tel:112" className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-600 text-white text-sm font-bold"><Phone className="w-4 h-4" /> In danger now? Call 112</a>
          <a href="tel:1930" className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-700 text-slate-200 text-sm font-semibold">Cyber fraud: call 1930</a>
          <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-700 text-slate-200 text-sm font-semibold">cybercrime.gov.in</a>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 items-start">
        <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
          <h2 className="font-bold text-white">Your details</h2>
          {field("name", "Full name", "As on your ID")}
          {field("relation", "Son / daughter / wife of (optional)", "e.g. son of Ramesh Patel")}
          {field("address", "Address", "House, street, area, city")}
          {field("phone", "Phone", "10-digit mobile")}
          <h2 className="font-bold text-white pt-2">The incident</h2>
          {field("when", "Date and time", "e.g. 10 Nov 2026, around 8:30 pm")}
          {field("where", "Place", "Exact spot and area")}
          <label className="block text-sm text-slate-300">What happened<textarea rows={6} className={input + " mt-1.5"} value={f.what} onChange={set("what")} placeholder="Describe events in order: what you saw, what was said, what was taken or done." /></label>
          {field("accused", "Who did it (if known)", "Name, or a description: height, clothes, vehicle number")}
          {field("lost", "Property lost or damaged (optional)", "e.g. phone (IMEI ...), ₹8,000 cash")}
          {field("witnesses", "Witnesses (optional)", "Names and phone numbers")}
        </div>

        <div className="space-y-4 lg:sticky lg:top-24">
          <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl" aria-live="polite">
            <h2 className="font-bold text-white">Sections that may apply</h2>
            {matches.length ? (
              <ul className="mt-2 space-y-1.5 text-sm">
                {matches.map((m) => <li key={m.id} className="text-slate-300"><strong className="text-rose-300 font-mono">{m.law}</strong> · {m.title}</li>)}
              </ul>
            ) : <p className="mt-2 text-sm text-slate-400">Describe what happened and we'll suggest sections.</p>}
            <p className="mt-3 text-xs text-slate-500 flex gap-1.5"><AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" /> Suggestions only. You don't need to write sections in your complaint: the police decide which apply. For legal advice, contact your District Legal Services Authority (free legal aid) or a lawyer.</p>
            {isCyber && <p className="mt-2 text-xs text-amber-200">For online fraud, call 1930 as soon as possible. Banks can sometimes freeze the money if you report within hours.</p>}
          </div>
          <div className="p-5 bg-slate-950 border border-rose-500/30 rounded-2xl">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h2 className="font-bold text-white">Your complaint draft</h2>
              <div className="flex gap-2">
                <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-bold text-slate-200"><Copy className="w-3.5 h-3.5" /> {copied ? "Copied" : "Copy"}</button>
                <button type="button" onClick={download} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-bold text-slate-200"><Download className="w-3.5 h-3.5" /> .txt</button>
                <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-xs font-bold text-white"><Printer className="w-3.5 h-3.5" /> Print</button>
              </div>
            </div>
            <pre className="whitespace-pre-wrap text-xs leading-relaxed text-slate-200 font-mono max-h-[420px] overflow-y-auto">{draft}</pre>
          </div>
          <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl text-sm text-slate-300">
            <h2 className="font-bold text-white">Your rights</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1.5">
              <li>The police must register an FIR for a cognizable offence, and you get a free copy.</li>
              <li>Any police station must take a Zero FIR even if the crime happened elsewhere.</li>
              <li>If they refuse, you can send the complaint in writing to the Superintendent of Police.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
