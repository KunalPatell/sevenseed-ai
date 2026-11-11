"use client";

import React, { useEffect, useMemo, useState } from "react";
import { NotebookPen, Search, Plus, Trash2, Download, Star } from "lucide-react";

// Personal interview journal. The old board mixed visitors' posts with four invented
// "experiences" at real companies. There is no shared database behind this page, so it's
// honest about being private: entries are saved on this device and can be exported.

type Entry = { id: string; company: string; role: string; round: string; date: string; difficulty: number; outcome: string; questions: string; learned: string };
const KEY = "comonk_interview_journal";
const OUTCOMES = ["Waiting", "Next round", "Offer", "Rejected", "No reply"];
const blank = { company: "", role: "", round: "", date: new Date().toISOString().slice(0, 10), difficulty: 3, outcome: "Waiting", questions: "", learned: "" };

export function InterviewExperienceBoard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [form, setForm] = useState(blank);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => { try { setEntries(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch { /* ignore */ } }, []);
  const save = (v: Entry[]) => { setEntries(v); try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* ignore */ } };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company.trim()) return;
    save([{ id: `e-${Date.now()}`, ...form, company: form.company.trim() }, ...entries]);
    setForm({ ...blank, company: form.company, role: form.role });
    setOpen(false);
  };

  const shown = useMemo(() => {
    const q = query.toLowerCase();
    return entries.filter((e) => [e.company, e.role, e.questions, e.learned].join(" ").toLowerCase().includes(q));
  }, [entries, query]);

  const stats = useMemo(() => ({
    total: entries.length,
    offers: entries.filter((e) => e.outcome === "Offer").length,
    companies: new Set(entries.map((e) => e.company.toLowerCase())).size,
  }), [entries]);

  const exportMd = () => {
    const md = entries.map((e) => `## ${e.company} · ${e.role} · ${e.round}\n${e.date} · ${e.outcome} · difficulty ${e.difficulty}/5\n\n**Questions**\n${e.questions}\n\n**What I learned**\n${e.learned}\n`).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([md], { type: "text/markdown" }));
    a.download = "interview-journal.md";
    a.click();
  };

  const input = "w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-400";

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5">
      <div className="p-6 md:p-8 bg-slate-900/90 border border-slate-800 rounded-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2"><NotebookPen className="w-6 h-6 text-purple-400" /> Interview journal</h1>
        <p className="mt-2 text-sm text-slate-300 max-w-2xl">Write down every interview round while it's fresh: the questions, how it went, what to do better. Before your next interview, search your notes. Everything stays private on this device.</p>
        <div className="mt-5 grid grid-cols-3 gap-3 max-w-md">
          {[["Rounds logged", stats.total], ["Companies", stats.companies], ["Offers", stats.offers]].map(([k, v]) => (
            <div key={k as string} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800"><div className="text-2xl font-black text-white font-mono">{v}</div><div className="text-xs text-slate-400">{k}</div></div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={() => setOpen((o) => !o)} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-purple-500 text-white text-sm font-bold"><Plus className="w-4 h-4" /> Log a round</button>
          {entries.length > 0 && <button type="button" onClick={exportMd} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-700 text-slate-200 text-sm font-semibold"><Download className="w-4 h-4" /> Export notes</button>}
        </div>
      </div>

      {open && (
        <form onSubmit={submit} className="p-6 bg-slate-900/90 border border-purple-500/30 rounded-2xl grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-slate-300">Company<input required className={input + " mt-1.5"} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></label>
          <label className="text-sm text-slate-300">Role<input className={input + " mt-1.5"} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></label>
          <label className="text-sm text-slate-300">Round<input className={input + " mt-1.5"} placeholder="e.g. Phone screen, DSA, System design, HR" value={form.round} onChange={(e) => setForm({ ...form, round: e.target.value })} /></label>
          <label className="text-sm text-slate-300">Date<input type="date" className={input + " mt-1.5"} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label>
          <label className="text-sm text-slate-300">Result<select className={input + " mt-1.5"} value={form.outcome} onChange={(e) => setForm({ ...form, outcome: e.target.value })}>{OUTCOMES.map((o) => <option key={o}>{o}</option>)}</select></label>
          <fieldset className="text-sm text-slate-300"><legend>Difficulty</legend>
            <div className="mt-1.5 flex gap-1">{[1, 2, 3, 4, 5].map((d) => <button key={d} type="button" aria-label={`Difficulty ${d} of 5`} aria-pressed={form.difficulty === d} onClick={() => setForm({ ...form, difficulty: d })}><Star className={`w-6 h-6 ${d <= form.difficulty ? "text-amber-400 fill-amber-400" : "text-slate-600"}`} /></button>)}</div>
          </fieldset>
          <label className="text-sm text-slate-300 sm:col-span-2">Questions asked<textarea rows={3} className={input + " mt-1.5"} value={form.questions} onChange={(e) => setForm({ ...form, questions: e.target.value })} /></label>
          <label className="text-sm text-slate-300 sm:col-span-2">What I learned / do better next time<textarea rows={3} className={input + " mt-1.5"} value={form.learned} onChange={(e) => setForm({ ...form, learned: e.target.value })} /></label>
          <div className="sm:col-span-2"><button type="submit" className="px-5 py-2.5 rounded-lg bg-purple-500 text-white text-sm font-bold">Save</button></div>
        </form>
      )}

      {entries.length > 0 && (
        <label className="relative block">
          <span className="sr-only">Search your notes</span>
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input className={input + " pl-9"} placeholder="Search companies, questions, lessons…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
      )}

      <div className="space-y-3" aria-live="polite">
        {entries.length === 0 && <p className="p-6 text-center text-sm text-slate-400 bg-slate-900/60 border border-dashed border-slate-700 rounded-2xl">No rounds logged yet. After your next interview, log it here.</p>}
        {shown.map((e) => (
          <article key={e.id} className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-white">{e.company}{e.role && <span className="text-slate-400 font-normal"> · {e.role}</span>}</h3>
                <div className="text-xs text-slate-400">{e.round || "Round"} · {e.date} · difficulty {e.difficulty}/5</div>
              </div>
              <div className="flex items-center gap-2">
                <select aria-label={`Result for ${e.company}`} value={e.outcome} onChange={(ev) => save(entries.map((x) => (x.id === e.id ? { ...x, outcome: ev.target.value } : x)))} className="px-2 py-1 rounded-md bg-slate-950 border border-slate-700 text-xs text-slate-200">{OUTCOMES.map((o) => <option key={o}>{o}</option>)}</select>
                <button type="button" aria-label={`Delete ${e.company} entry`} onClick={() => save(entries.filter((x) => x.id !== e.id))} className="p-1.5 text-slate-500 hover:text-rose-300"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            {e.questions && <p className="mt-3 text-sm text-slate-300 whitespace-pre-wrap"><strong className="text-slate-200">Questions: </strong>{e.questions}</p>}
            {e.learned && <p className="mt-2 text-sm text-slate-300 whitespace-pre-wrap"><strong className="text-slate-200">Learned: </strong>{e.learned}</p>}
          </article>
        ))}
      </div>
    </div>
  );
}
