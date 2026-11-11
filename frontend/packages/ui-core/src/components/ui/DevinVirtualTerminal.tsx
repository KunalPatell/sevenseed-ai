"use client";

import React, { useState } from "react";
import { Terminal, Loader2, Copy, Send } from "lucide-react";

// AI coding assistant. The old "terminal" printed a fixed script ("42 tests passed",
// "PR #142 created") whatever you did. This sends the visitor's task to Sevenseed's AI
// gateway (/api/llm/chat) and shows the real answer: a plan, code and how to test it.
// It can't run code or open pull requests, and says so.

const KEY_SOURCES: Record<string, string[]> = {
  "X-Groq-API-Key": ["user_groq_key", "ss_key_groq", "groq_api_key"],
  "X-Gemini-API-Key": ["user_gemini_key", "ss_key_gemini", "ss_apikey_gemini"],
  "X-OpenAI-API-Key": ["user_openai_key", "ss_key_openai"],
};
function headers() {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  try {
    for (const [header, names] of Object.entries(KEY_SOURCES)) {
      for (const n of names) { const v = (localStorage.getItem(n) || "").trim(); if (v) { h[header] = v; break; } }
    }
  } catch { /* storage blocked */ }
  return h;
}

const SYSTEM = "You are a senior software engineer helping someone with a coding task. Reply in this order: 1) a short plan (3-6 bullet points), 2) the code in fenced code blocks with the language named, 3) how to test it. Be concise. If the task is unclear, ask one clarifying question instead. Never claim you ran code, ran tests or opened a pull request: you can't.";
const EXAMPLES = [
  "Write a Python function that validates an Indian PAN number and explain the format.",
  "A React form submits twice when I press Enter. What are the common causes and fixes?",
  "Write a SQL query for the top 5 customers by total order value in the last 90 days.",
];

export function DevinVirtualTerminal() {
  const [task, setTask] = useState("");
  const [lang, setLang] = useState("Any");
  const [answer, setAnswer] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const run = async () => {
    if (!task.trim() || busy) return;
    setBusy(true); setErr(""); setAnswer("");
    try {
      const r = await fetch("/api/llm/chat", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ system: SYSTEM, temperature: 0.3, maxTokens: 1800, messages: [{ role: "user", content: `${lang !== "Any" ? `Language: ${lang}\n` : ""}${task.trim()}` }] }),
      });
      const body = await r.json().catch(() => ({}));
      if (r.status === 429) throw new Error("The free hourly AI limit was reached. Add your own AI key on the Your AI keys page, or try again later.");
      if (!r.ok) throw new Error(body.detail || `The AI service returned an error (${r.status}).`);
      setAnswer(body.text || "");
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally { setBusy(false); }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-8 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl">
      <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2"><Terminal className="w-6 h-6 text-cyan-400" /> AI coding assistant</h1>
      <p className="mt-2 text-sm text-slate-300 max-w-2xl">Describe a coding task or paste an error. You get a plan, the code and how to test it. It writes code but can't run it, so check the result before you use it.</p>

      <div className="mt-6 space-y-3">
        <label className="block text-sm text-slate-300">Your task
          <textarea rows={5} value={task} onChange={(e) => setTask(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) run(); }} placeholder="e.g. Write a FastAPI endpoint that accepts a CSV upload and returns the row count" className="mt-1.5 w-full p-3 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white font-mono focus:outline-none focus:border-cyan-400" />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm text-slate-300">Language <select value={lang} onChange={(e) => setLang(e.target.value)} className="ml-1 px-2 py-1.5 rounded-md bg-slate-950 border border-slate-700 text-sm text-white">{["Any", "Python", "JavaScript", "TypeScript", "Java", "Go", "SQL", "Bash"].map((l) => <option key={l}>{l}</option>)}</select></label>
          <button type="button" onClick={run} disabled={busy || !task.trim()} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 text-black text-sm font-bold disabled:opacity-50">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} {busy ? "Thinking…" : "Ask"}</button>
          <span className="text-xs text-slate-500">Ctrl + Enter</span>
        </div>
        {!task && (
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((x) => <button key={x} type="button" onClick={() => setTask(x)} className="text-left text-xs px-3 py-1.5 rounded-full border border-slate-700 text-slate-300 hover:border-cyan-400">{x}</button>)}
          </div>
        )}
      </div>

      <div className="mt-6" aria-live="polite">
        {err && <p className="p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-sm text-rose-200">{err}</p>}
        {answer && (
          <div className="rounded-xl border border-slate-800 bg-slate-950">
            <div className="flex justify-between items-center px-4 py-2 border-b border-slate-800">
              <span className="text-xs text-slate-400">Answer</span>
              <button type="button" onClick={async () => { try { await navigator.clipboard.writeText(answer); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* ignore */ } }} className="inline-flex items-center gap-1 text-xs text-slate-300"><Copy className="w-3.5 h-3.5" /> {copied ? "Copied" : "Copy"}</button>
            </div>
            <pre className="p-4 whitespace-pre-wrap text-sm text-slate-200 font-mono leading-relaxed max-h-[560px] overflow-y-auto">{answer}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
