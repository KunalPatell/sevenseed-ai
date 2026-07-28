"use client";

import React, { useEffect, useMemo, useState } from "react";
import { GROUPS, TOTAL_TOOLS, type Group, type Tool } from "@/lib/registry";
import { fetchOpenApi, callTool, PROVIDERS, type OpenApiDoc } from "@/lib/api";
import { fieldsFor, buildBody, type Field } from "@/lib/schema";

export default function SuperSuite() {
  const [active, setActive] = useState<string>("overview");
  const [doc, setDoc] = useState<OpenApiDoc | null>(null);
  const [schemaErr, setSchemaErr] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    fetchOpenApi().then(setDoc).catch(() => setSchemaErr(true));
  }, []);

  const group = GROUPS.find((g) => g.id === active);

  return (
    <div className="flex min-h-screen">
      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside
        className={`fixed lg:static z-70 h-screen w-[260px] shrink-0 overflow-y-auto border-r border-[var(--line)] bg-[#080a13] p-4 transition-transform ${
          navOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="mb-5 flex items-center gap-2.5 px-1">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#06b6d4] text-lg">🧰</span>
          <div className="leading-tight">
            <div className="text-[15px] font-extrabold">Sevenseed</div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-3)]">Super-Suite</div>
          </div>
        </div>

        <button className={`sb-item ${active === "overview" ? "active" : ""}`} onClick={() => { setActive("overview"); setNavOpen(false); }}>
          <span className="sb-ico"><i className="fas fa-gauge-high" /></span> Overview
        </button>

        <div className="mt-4 mb-1 px-2 text-[10px] font-bold uppercase tracking-wider text-[var(--text-3)]">Suites</div>
        {GROUPS.map((g) => (
          <button key={g.id} className={`sb-item ${active === g.id ? "active" : ""}`} onClick={() => { setActive(g.id); setNavOpen(false); }}>
            <span className="sb-ico" style={{ color: g.accent }}><i className={`fas ${g.icon}`} /></span>
            <span className="flex-1">{g.label}</span>
            <span className="text-[10px] text-[var(--text-3)]">{g.tools.length}</span>
          </button>
        ))}

        <div className="my-4 border-t border-[var(--line)]" />
        <button className="sb-item" onClick={() => setSettingsOpen(true)}>
          <span className="sb-ico"><i className="fas fa-key" /></span> API Keys (BYOK)
        </button>
      </aside>

      {navOpen && <div className="fixed inset-0 z-60 bg-black/50 lg:hidden" onClick={() => setNavOpen(false)} />}

      {/* ── Main ────────────────────────────────────────── */}
      <main className="min-w-0 flex-1 overflow-x-hidden">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-[var(--line)] bg-[#06070d]/85 px-5 py-3 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3">
            <button className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--line)] text-[var(--text-2)] lg:hidden" onClick={() => setNavOpen(true)} aria-label="Menu">
              <i className="fas fa-bars" />
            </button>
            <div>
              <h1 className="text-[15px] font-extrabold md:text-[17px]">
                {active === "overview" ? "Founder Super-Suite" : group?.label}
              </h1>
              <p className="hidden text-[11px] text-[var(--text-3)] sm:block">
                {active === "overview" ? "One free AI toolkit across your whole business" : group?.tools.length + " tools · live FastAPI backend"}
              </p>
            </div>
          </div>
          <span className="ep-tag hidden sm:inline">Python FastAPI · React 19 · BYOK</span>
        </header>

        <div className="p-5 md:p-8">
          {active === "overview" ? (
            <Overview onPick={setActive} schemaErr={schemaErr} />
          ) : group ? (
            <ToolGrid group={group} doc={doc} schemaErr={schemaErr} />
          ) : null}
        </div>
      </main>

      {settingsOpen && <Settings onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}

/* ── Overview ─────────────────────────────────────────── */

function Overview({ onPick, schemaErr }: { onPick: (id: string) => void; schemaErr: boolean }) {
  const [companies, setCompanies] = useState<number | null>(null);
  useEffect(() => {
    callTool("GET", "/api/stats")
      .then((d) => setCompanies((d as { total_companies?: number })?.total_companies ?? null))
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="tile mb-6" style={{ padding: "26px 24px" }}>
        <div className="mb-1 inline-flex items-center gap-2 self-start rounded-full border border-[var(--line)] bg-white/[0.03] px-3 py-1 text-[11px] font-semibold text-[#c4b5fd]">
          <i className="fas fa-bolt text-[#67e8f9]" /> 100% free · bring your own AI key
        </div>
        <h2 className="mt-2 text-2xl font-black md:text-3xl">
          One <span className="grad-text">free AI toolkit</span> for founders.
        </h2>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-[var(--text-2)]">
          {TOTAL_TOOLS} working tools across {GROUPS.length} suites — career, growth, hiring, sales,
          meetings, fintech, commerce, mobility, health and more. Every tool is a live Python
          FastAPI endpoint; the forms are generated straight from the API schema.
        </p>
      </div>

      <div className="mb-7 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="stat"><div className="stat-num grad-text">{TOTAL_TOOLS}</div><div className="stat-lbl">Working tools</div></div>
        <div className="stat"><div className="stat-num grad-text">{GROUPS.length}</div><div className="stat-lbl">Suites</div></div>
        <div className="stat"><div className="stat-num grad-text">{companies !== null ? companies.toLocaleString() : "—"}</div><div className="stat-lbl">Companies in DB</div></div>
        <div className="stat"><div className="stat-num grad-text">₹0</div><div className="stat-lbl">Cost to use</div></div>
      </div>

      {schemaErr && (
        <div className="result err mb-5">Couldn&apos;t reach the API schema — start the backend (apps/comonk) so the tools can load.</div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {GROUPS.map((g) => (
          <button key={g.id} className="tile items-start text-left hover:-translate-y-0.5" onClick={() => onPick(g.id)}>
            <span className="mb-3 grid h-10 w-10 place-items-center rounded-xl text-[17px]" style={{ background: `${g.accent}1f`, color: g.accent }}>
              <i className={`fas ${g.icon}`} />
            </span>
            <div className="text-[15px] font-bold">{g.label}</div>
            <div className="mt-0.5 text-[12px] text-[var(--text-3)]">{g.tools.length} tools</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Tool grid for a group ────────────────────────────── */

function ToolGrid({ group, doc, schemaErr }: { group: Group; doc: OpenApiDoc | null; schemaErr: boolean }) {
  return (
    <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-4 lg:grid-cols-2">
      {group.tools.map((t) => (
        <ToolCard key={t.path} tool={t} accent={group.accent} doc={doc} schemaErr={schemaErr} />
      ))}
    </div>
  );
}

function ToolCard({ tool, accent, doc, schemaErr }: { tool: Tool; accent: string; doc: OpenApiDoc | null; schemaErr: boolean }) {
  const fields: Field[] = useMemo(
    () => (tool.method === "POST" && doc ? fieldsFor(doc, tool.path) : []),
    [doc, tool]
  );
  const [values, setValues] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // seed defaults once fields load
  useEffect(() => {
    const seed: Record<string, string> = {};
    for (const f of fields) if (f.def !== undefined) seed[f.name] = String(f.def);
    if (Object.keys(seed).length) setValues((v) => ({ ...seed, ...v }));
  }, [fields]);

  const run = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (busy) return;
    setBusy(true); setErr(null); setOut(null);
    try {
      const body = tool.method === "POST" ? buildBody(fields, values) : undefined;
      const data = await callTool(tool.method, tool.path, body);
      setOut(prettyResult(data));
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="tile">
      <div className="mb-3 flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[16px]" style={{ background: `${accent}1f`, color: accent }}>
          <i className={`fas ${tool.icon}`} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-[15px] font-bold">{tool.label}</h3>
            <span className="ep-tag hidden shrink-0 md:inline">{tool.method}</span>
          </div>
          <p className="mt-0.5 text-[12.5px] leading-snug text-[var(--text-3)]">{tool.desc}</p>
        </div>
      </div>

      <form onSubmit={run} className="flex flex-1 flex-col">
        <div className="flex-1 space-y-3">
          {tool.method === "POST" && fields.length === 0 && !schemaErr && (
            <p className="text-[12px] text-[var(--text-3)]">Runs with no input needed.</p>
          )}
          {fields.map((f) => (
            <div key={f.name}>
              <label className="lbl">{f.label}{f.required && <span className="text-[#f472b6]"> *</span>}</label>
              {f.kind === "select" ? (
                <select className="sel" value={values[f.name] ?? f.def ?? ""} onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}>
                  {(f.options ?? []).map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : f.kind === "textarea" || f.kind === "list" ? (
                <textarea className="ta" placeholder={f.kind === "list" ? "one per line" : ""} value={values[f.name] ?? ""} onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))} />
              ) : f.kind === "boolean" ? (
                <select className="sel" value={values[f.name] ?? "false"} onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}>
                  <option value="true">Yes</option><option value="false">No</option>
                </select>
              ) : (
                <input className="inp" type={f.kind === "number" ? "number" : "text"} value={values[f.name] ?? ""} onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))} />
              )}
            </div>
          ))}
        </div>

        <button type="submit" className="btn btn-run mt-4" disabled={busy}>
          <i className={busy ? "fas fa-spinner fa-spin" : "fas fa-play"} />
          {busy ? "Running…" : tool.method === "GET" ? "Fetch" : "Run"}
        </button>
      </form>

      {err && <div className="result err">{err}</div>}
      {out && <div className="result">{out}</div>}
    </section>
  );
}

/** Prefer a readable text field; otherwise pretty-print JSON. */
function prettyResult(data: unknown): string {
  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    for (const k of ["result", "answer", "output", "text", "content", "summary", "reply", "message"]) {
      if (typeof obj[k] === "string" && (obj[k] as string).trim()) return obj[k] as string;
    }
    return JSON.stringify(data, null, 2);
  }
  return String(data);
}

/* ── BYOK settings ────────────────────────────────────── */

function Settings({ onClose }: { onClose: () => void }) {
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState("");

  useEffect(() => {
    const init: Record<string, string> = {};
    for (const p of PROVIDERS) init[p.key] = localStorage.getItem(p.key) ?? "";
    setKeys(init);
  }, []);

  const save = () => {
    for (const p of PROVIDERS) {
      const v = (keys[p.key] ?? "").trim();
      if (v) localStorage.setItem(p.key, v); else localStorage.removeItem(p.key);
    }
    setSaved("Saved to this browser only.");
    setTimeout(() => setSaved(""), 2500);
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-[17px] font-black">Your API keys (BYOK)</h3>
          <button className="grid h-8 w-8 place-items-center rounded-lg border border-[var(--line)] text-[var(--text-2)]" onClick={onClose} aria-label="Close"><i className="fas fa-times" /></button>
        </div>
        <p className="mb-4 text-[13px] leading-relaxed text-[var(--text-2)]">
          Bring your own keys so every tool stays free. Stored only in this browser and sent as
          request headers — never saved on our servers.
        </p>
        {PROVIDERS.map((p) => (
          <div key={p.key} className="mb-3">
            <label className="lbl">{p.label} <span className="mono float-right font-normal normal-case text-[var(--text-3)]">{p.hint}</span></label>
            <input className="inp" type="password" autoComplete="off" placeholder={`${p.label} API key`} value={keys[p.key] ?? ""} onChange={(e) => setKeys((k) => ({ ...k, [p.key]: e.target.value }))} />
          </div>
        ))}
        <button className="btn btn-run mt-2" onClick={save}><i className="fas fa-floppy-disk" /> Save keys</button>
        {saved && <p className="mt-2 text-center text-[12.5px] text-[#67e8f9]">{saved}</p>}
      </div>
    </div>
  );
}
