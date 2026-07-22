"use client";

import React, { useEffect, useMemo, useState } from "react";
import "./portal.css";
import { AGENTS, type Agent, type AgentTool } from "@/lib/agents";
import {
  PROVIDERS, getToken, setToken, clearToken, post, postBlob, login, signup,
} from "@/lib/api";

export default function Portal() {
  const [authed, setAuthed] = useState<boolean | null>(null); // null = checking
  const [currentId, setCurrentId] = useState("dashboard");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setAuthed(Boolean(getToken()));
  }, []);

  const current = useMemo<Agent>(
    () => AGENTS.find((a) => a.id === currentId) ?? AGENTS[0],
    [currentId]
  );

  if (authed === null) return null; // avoid an auth flash before we've checked

  if (!authed) return <AuthGate onDone={() => setAuthed(true)} />;

  return (
    <div className="split-container">
      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="console-brand">
          <span className="console-brand-em">🤖</span>
          <span>Sevenforce</span>
        </div>

        {AGENTS.map((a) => (
          <button
            key={a.id}
            className={`sidebar-item${a.id === currentId ? " active" : ""}`}
            onClick={() => { setCurrentId(a.id); setSidebarOpen(false); }}
          >
            <span className="sidebar-em">{a.em}</span>
            <span className="sidebar-name">{a.name}</span>
          </button>
        ))}

        <div className="sidebar-foot">
          <button className="sidebar-item" onClick={() => setSettingsOpen(true)}>
            <span className="sidebar-em">🔑</span>
            <span className="sidebar-name">API Keys (BYOK)</span>
          </button>
          <a className="sidebar-item" href="/sevenforce/">
            <span className="sidebar-em">←</span>
            <span className="sidebar-name">Back to site</span>
          </a>
          <button
            className="sidebar-item"
            onClick={() => { clearToken(); setAuthed(false); }}
          >
            <span className="sidebar-em">⏻</span>
            <span className="sidebar-name">Sign out</span>
          </button>
        </div>
      </aside>

      <main className="main">
        <button
          className="sidebar-toggle"
          aria-label="Toggle agent list"
          onClick={() => setSidebarOpen((v) => !v)}
        >
          <i className="fas fa-bars" />
        </button>

        <div className="agent-header">
          <span className="agent-em-big">{current.em}</span>
          <div className="agent-hinfo">
            <div className="agent-htitle">
              <span className="agent-name">{current.name}</span>
              <span className="agent-role-badge">{current.role}</span>
            </div>
            <p className="agent-hdesc">{current.desc}</p>
          </div>
        </div>

        {current.tools.length === 0 ? (
          <AgentsOverview onPick={setCurrentId} />
        ) : (
          <div className="agent-tools">
            {current.tools.map((tool) => (
              <ToolCard key={tool.ep + tool.t} tool={tool} />
            ))}
          </div>
        )}
      </main>

      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}

/* ── Overview grid ─────────────────────────────────────────── */

function AgentsOverview({ onPick }: { onPick: (id: string) => void }) {
  return (
    <div className="agents-grid">
      {AGENTS.filter((a) => a.tools.length > 0).map((a) => (
        <button key={a.id} className="agent-card" onClick={() => onPick(a.id)}>
          <span className="agent-em">{a.em}</span>
          <span className="agent-name">{a.name}</span>
          <span className="agent-role">{a.role}</span>
          <span className="agent-role-badge">{a.suite}</span>
        </button>
      ))}
    </div>
  );
}

/* ── One tool: a generated form + its own console ──────────── */

function ToolCard({ tool }: { tool: AgentTool }) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      tool.f.map((f) => [
        f.k,
        f.def !== undefined ? String(f.def) : f.type === "select" ? (f.opts?.[0] ?? "") : "",
      ])
    )
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true); setError(""); setResult(null); setFileUrl(null);
    try {
      // Serialise each field exactly as the previous portal did, so the
      // backend contracts are unchanged.
      const payload: Record<string, unknown> = {};
      for (const f of tool.f) {
        const raw = (values[f.k] ?? "").trim();
        switch (f.type) {
          case "number":
            payload[f.k] = Number(raw);
            break;
          case "csv":
            payload[f.k] = raw ? raw.split(",").map((x) => x.trim()).filter(Boolean) : [];
            break;
          case "lines":
            payload[f.k] = raw ? raw.split(/\n+/).map((x) => x.trim()).filter(Boolean) : [];
            break;
          case "recipients":
            payload[f.k] = raw
              ? raw.split(/\n+/).map((line) => {
                  const [email = "", name = ""] = line.split(",");
                  return { email: email.trim(), name: name.trim() };
                }).filter((r) => r.email)
              : [];
            break;
          default:
            payload[f.k] = raw;
        }
      }
      if (tool.download) {
        const blob = await postBlob(tool.ep, payload);
        setFileUrl(URL.createObjectURL(blob));
      } else {
        const data = await post<Record<string, unknown>>(tool.ep, payload);
        setResult(pretty(data));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="console-card">
      <header className="console-header">
        <span className="console-title">
          {tool.icon && <i className={`fas ${tool.icon}`} />} {tool.t}
        </span>
        <span className="console-status">
          <span className="console-status-dot" /> {tool.ep}
        </span>
      </header>

      <form className="console-body" onSubmit={run}>
        {tool.f.map((f) => (
          <div className="input-group" key={f.k}>
            <label>
              {f.icon && <i className={`fas ${f.icon}`} />} {f.l}
            </label>
            {f.type === "select" ? (
              <select
                value={values[f.k]}
                onChange={(e) => setValues((v) => ({ ...v, [f.k]: e.target.value }))}
              >
                {(f.opts ?? []).map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : f.type === "textarea" || f.type === "lines" || f.type === "recipients" ? (
              <textarea
                rows={4}
                value={values[f.k]}
                onChange={(e) => setValues((v) => ({ ...v, [f.k]: e.target.value }))}
              />
            ) : (
              <input
                type={f.type === "number" ? "number" : "text"}
                value={values[f.k]}
                onChange={(e) => setValues((v) => ({ ...v, [f.k]: e.target.value }))}
              />
            )}
          </div>
        ))}

        <button className="run-btn" type="submit" disabled={busy}>
          <i className={busy ? "fas fa-spinner fa-spin" : "fas fa-play"} />
          {busy ? " Running…" : " Run"}
        </button>
      </form>

      {(error || result || fileUrl) && (
        <div className="console-result">
          {error && <div className="result-box result-error">{error}</div>}
          {fileUrl && (
            <a className="run-btn" href={fileUrl} download="sevenforce-document.docx">
              <i className="fas fa-download" /> Download document (.docx)
            </a>
          )}
          {result && <pre className="result-box">{result}</pre>}
        </div>
      )}
    </section>
  );
}

/** Render an API response readably: prefer its main text field, else pretty JSON. */
function pretty(data: Record<string, unknown>): string {
  for (const k of ["result", "answer", "output", "text", "content", "summary", "reply"]) {
    const v = data?.[k];
    if (typeof v === "string" && v.trim()) return v;
  }
  return JSON.stringify(data, null, 2);
}

/* ── BYOK settings ─────────────────────────────────────────── */

function SettingsModal({ onClose }: { onClose: () => void }) {
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
      if (v) localStorage.setItem(p.key, v);
      else localStorage.removeItem(p.key);
    }
    setSaved("Saved to this browser only.");
    setTimeout(() => setSaved(""), 2500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <i className="fas fa-times" />
        </button>
        <h3>Your API keys (BYOK)</h3>
        <p className="modal-sub">
          Bring your own keys so every tool stays free to use. They are stored only
          in this browser and sent as request headers — never saved on our servers.
        </p>

        {PROVIDERS.map((p) => (
          <div className="input-group" key={p.key}>
            <label>{p.label} <span className="key-hint">{p.hint}</span></label>
            <input
              type="password"
              autoComplete="off"
              placeholder={`${p.label} API key`}
              value={keys[p.key] ?? ""}
              onChange={(e) => setKeys((k) => ({ ...k, [p.key]: e.target.value }))}
            />
          </div>
        ))}

        <button className="run-btn" onClick={save}><i className="fas fa-floppy-disk" /> Save keys</button>
        {saved && <p className="modal-note" role="status">{saved}</p>}
      </div>
    </div>
  );
}

/* ── Auth ──────────────────────────────────────────────────── */

function AuthGate({ onDone }: { onDone: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true); setError("");
    try {
      const data = mode === "login"
        ? await login(email, pw)
        : await signup(name, email, pw);
      if (!data?.token) throw new Error("No token returned.");
      setToken(data.token);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign you in.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-overlay auth-overlay">
      <div className="modal-card">
        <div className="console-brand" style={{ justifyContent: "center", marginBottom: 18 }}>
          <span className="console-brand-em">🤖</span>
          <span>Sevenforce</span>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab${mode === "login" ? " active" : ""}`}
            onClick={() => setMode("login")}
          >Log In</button>
          <button
            className={`auth-tab${mode === "signup" ? " active" : ""}`}
            onClick={() => setMode("signup")}
          >Register</button>
        </div>

        <form onSubmit={submit}>
          {mode === "signup" && (
            <div className="input-group">
              <label><i className="fas fa-user" /> Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}
          <div className="input-group">
            <label><i className="fas fa-envelope" /> Email</label>
            <input type="email" autoComplete="email" value={email}
              onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label><i className="fas fa-lock" /> Password</label>
            <input type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={pw} onChange={(e) => setPw(e.target.value)} required />
          </div>

          <button className="run-btn" type="submit" disabled={busy}>
            <i className={busy ? "fas fa-spinner fa-spin" : "fas fa-right-to-bracket"} />
            {busy ? " Please wait…" : mode === "login" ? " Log in" : " Create account"}
          </button>
        </form>

        {error && <p className="modal-note result-error" role="status">{error}</p>}

        <a className="auth-back" href="/sevenforce/">← Back to site</a>
      </div>
    </div>
  );
}
