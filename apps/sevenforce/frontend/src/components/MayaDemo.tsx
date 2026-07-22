"use client";

import React, { useState } from "react";

const API_BASE = "/sevenforce";

const SAMPLES = [
  "5 ways AI saves small businesses time",
  "Why WhatsApp is the new storefront for D2C brands",
  "A beginner's guide to NL-to-SQL",
];

/**
 * "Try Maya" — the public, unauthenticated demo of Sevenforce's Content & SEO
 * employee. Server-side rate limited (5/hr per IP, 200/hr global) by the
 * /api/tools/content-demo route.
 *
 * The rendered answer is untrusted model output. React escapes text by
 * default, so it is only ever placed as text children — the light **bold**
 * markup is turned into real <strong> elements rather than injected as HTML.
 */
export function MayaDemo() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = topic.trim();
    if (!t || loading) return;

    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/tools/content-demo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: t.slice(0, 120) }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const fallback =
          res.status === 429
            ? "This demo is popular right now — please try again in a moment."
            : "Something went wrong. Please try again.";
        throw new Error(data?.detail || data?.error || fallback);
      }
      const data = await res.json();
      setResult(String(data?.result ?? ""));
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Couldn't reach the AI right now. Please try again shortly."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section ai-demo-sec" id="try-maya">
      <div className="eyebrow center">LIVE DEMO · NO SIGNUP</div>
      <h2 className="sec-title">Watch Maya write, right now</h2>

      <div className="demo-card glow reveal">
        <div className="demo-badge"><i className="fas fa-bolt" /> Real AI · Instant · Free</div>
        <p className="demo-lead">
          Give Maya — Sevenforce&apos;s Content &amp; SEO employee — a blog topic, and
          she&apos;ll draft a real, SEO-ready opening paragraph live, using the same AI
          engine that powers the full Content Studio.
        </p>

        <div className="demo-chips">
          {SAMPLES.map((s) => (
            <button key={s} type="button" className="demo-chip" onClick={() => setTopic(s)}>
              &ldquo;{s}&rdquo;
            </button>
          ))}
        </div>

        <form className="demo-form" onSubmit={onSubmit}>
          <input
            type="text"
            className="demo-input"
            placeholder="Enter a blog topic…"
            maxLength={120}
            autoComplete="off"
            required
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <i className={loading ? "fas fa-spinner fa-spin" : "fas fa-wand-magic-sparkles"} />
            <span>{loading ? "Maya is writing…" : "Generate with Maya"}</span>
          </button>
        </form>

        {error && <p className="demo-error" role="status">{error}</p>}

        {result !== null && (
          <div className="demo-result" style={{ display: "block" }}>
            <div className="demo-result-badge"><i className="fas fa-robot" /> AI Generated · Maya</div>
            <div className="demo-result-body">{renderRich(result)}</div>
            <a href="/sevenforce/app/" className="demo-cta">
              Unlock the full Content Studio <i className="fas fa-arrow-right" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

/** Render `**bold**` as real <strong> nodes; everything else stays plain text. */
function renderRich(text: string) {
  return text.split("\n").map((line, i) => {
    if (!line.trim()) return <p key={i} className="demo-line-gap" />;
    const parts = line.split(/\*\*(.+?)\*\*/g);
    return (
      <p key={i}>
        {parts.map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )}
      </p>
    );
  });
}
