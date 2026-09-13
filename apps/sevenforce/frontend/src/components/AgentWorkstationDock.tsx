"use client";

import React, { useState } from "react";

const API_BASE = "/sevenforce";

export type AgentSpec = {
  id: "maya" | "nova" | "wave" | "vibe" | "echo" | "scout" | "sage";
  name: string;
  role: string;
  suite: "Growth AI" | "Agency AI";
  em: string;
  accent: string;
  icon: string;
  model: string;
  latency: string;
  tagline: string;
  inputPlaceholder: string;
  presets: string[];
};

export const DOCK_AGENTS: AgentSpec[] = [
  {
    id: "maya",
    name: "Maya",
    role: "Content & SEO Director",
    suite: "Growth AI",
    em: "🖊️",
    accent: "#06b6d4",
    icon: "fa-pen-nib",
    model: "Groq LLaMA 3.3 70B",
    latency: "340ms",
    tagline: "Autonomous SEO keyword research, brand voice extraction, and high-ranking article drafts.",
    inputPlaceholder: "Enter a blog topic or keyword target (e.g., 'Enterprise AI Agent Safety in 2026')…",
    presets: [
      "5 ways autonomous AI saves mid-market SaaS time",
      "Why WhatsApp is the new storefront for D2C brands",
      "Complete guide to Enterprise RAG & NL-to-SQL architecture",
    ],
  },
  {
    id: "nova",
    name: "Nova",
    role: "Business Analyst & PRD",
    suite: "Agency AI",
    em: "📋",
    accent: "#f59e0b",
    icon: "fa-file-signature",
    model: "Groq LLaMA 3.3 70B",
    latency: "420ms",
    tagline: "Turns raw briefs into structured PRDs, user stories, acceptance criteria, and Word exports.",
    inputPlaceholder: "Enter a feature concept or product brief (e.g., 'Real-time multi-agent notification center')…",
    presets: [
      "PRD for B2B Freight Logistics Fleet Tracking",
      "User stories & acceptance criteria for BYOK Key Vault",
      "Feature specification for Multi-Agent Task Orchestration",
    ],
  },
  {
    id: "wave",
    name: "Wave",
    role: "Sales & Outreach Lead",
    suite: "Growth AI",
    em: "💬",
    accent: "#10b981",
    icon: "fa-paper-plane",
    model: "Groq LLaMA 3.3 70B",
    latency: "380ms",
    tagline: "Autonomous ideal customer profiling, lead scoring, and personalized multi-stage cold outreach.",
    inputPlaceholder: "Describe your product or target market (e.g., 'Compliance automation for FinTech startups')…",
    presets: [
      "B2B Cold Outreach Sequence for FinTech CFOs",
      "ICP Mapping for Healthcare AI Security Platforms",
      "Sales Sequence for D2C Brands switching from legacy tools",
    ],
  },
  {
    id: "vibe",
    name: "Vibe",
    role: "Viral Social & Campaigns",
    suite: "Growth AI",
    em: "📱",
    accent: "#8b5cf6",
    icon: "fa-hashtag",
    model: "Groq LLaMA 3.3 70B",
    latency: "310ms",
    tagline: "Tailors platform-tuned copy for LinkedIn, X/Twitter, and Instagram that drives engagement.",
    inputPlaceholder: "Enter an announcement or topic (e.g., 'Launching our self-hosted AI workforce platform')…",
    presets: [
      "LinkedIn & X thread announcing Sevenforce 2.0 release",
      "Viral product launch campaign for Developer Tools",
      "Engineering insights on running multi-agent LLM systems",
    ],
  },
  {
    id: "echo",
    name: "Echo",
    role: "Meeting Intelligence",
    suite: "Agency AI",
    em: "🎙️",
    accent: "#f43f5e",
    icon: "fa-microphone-lines",
    model: "Groq LLaMA 3.3 70B",
    latency: "390ms",
    tagline: "Transforms raw meeting transcripts into executive summaries, key decisions, and tagged action items.",
    inputPlaceholder: "Paste meeting agenda, notes, or topic (e.g., 'Sprint Planning on Database Sharding')…",
    presets: [
      "Q3 Architecture Review & BYOK Security sprint notes",
      "Client onboarding kickoff digest & owner checklist",
      "Executive board meeting summary on venture unit economics",
    ],
  },
  {
    id: "scout",
    name: "Scout",
    role: "AI Technical Recruiter",
    suite: "Agency AI",
    em: "👔",
    accent: "#3b82f6",
    icon: "fa-user-tie",
    model: "Groq LLaMA 3.3 70B",
    latency: "360ms",
    tagline: "Screens resumes against job specs, generates competency rubrics, and crafts technical interview questions.",
    inputPlaceholder: "Enter a job title or hiring criteria (e.g., 'Staff Distributed Systems Engineer')…",
    presets: [
      "Staff AI Engineer (LangGraph, PyTorch, FastAPI)",
      "Head of Growth Marketing for Enterprise B2B SaaS",
      "Senior Fullstack Engineer (Next.js 16, TypeScript, SQL)",
    ],
  },
  {
    id: "sage",
    name: "Sage",
    role: "Data & SQL Analyst",
    suite: "Agency AI",
    em: "📊",
    accent: "#6366f1",
    icon: "fa-chart-column",
    model: "Groq LLaMA 3.3 70B",
    latency: "290ms",
    tagline: "Guarded NL-to-SQL translation and instant data analytics with executive business insights.",
    inputPlaceholder: "Ask any data question in plain English (e.g., 'Monthly active users and churn rate')…",
    presets: [
      "Daily agent execution velocity & error rate breakdown",
      "Top 10 customer cohorts by API usage and retention",
      "Query average response latency by model provider",
    ],
  },
];

export function AgentWorkstationDock() {
  const [activeAgentId, setActiveAgentId] = useState<AgentSpec["id"]>("maya");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const activeAgent = DOCK_AGENTS.find((a) => a.id === activeAgentId) ?? DOCK_AGENTS[0];

  const handleSelectAgent = (agentId: AgentSpec["id"]) => {
    setActiveAgentId(agentId);
    setError("");
    setResult(null);
    setPrompt("");
  };

  const executeTask = async (taskPrompt: string) => {
    const p = taskPrompt.trim();
    if (!p || loading) return;

    setError("");
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/tools/agent-demo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent: activeAgent.id,
          prompt: p.slice(0, 200),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const fallback =
          res.status === 429
            ? "Public demo rate limit reached. Please wait a moment or launch the full workspace."
            : "Agent execution failed. Please retry.";
        throw new Error(data?.detail || data?.error || fallback);
      }

      const data = await res.json();
      setResult(String(data?.result ?? ""));
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Could not reach the AI agent right now. Please try again shortly."
      );
    } finally {
      setLoading(false);
    }
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeTask(prompt);
  };

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="section command-center-section" id="workstation-dock">
      <div className="eyebrow center">
        <span className="beacon-dot" /> 7 AUTONOMOUS AGENTS ONLINE · LIVE WORKSTATION DOCK
      </div>
      <h2 className="sec-title">Sevenforce Cyber Command Center</h2>
      <p className="sec-sub center" style={{ maxWidth: "680px", margin: "0 auto 36px" }}>
        Dock directly into any specialized AI employee. Test live outputs with sub-second execution,
        zero server key storage, and full operational telemetry.
      </p>

      {/* ── 7-AGENT INTERACTIVE DOCK ───────────────────────────── */}
      <div className="dock-container">
        <div className="dock-track" role="tablist" aria-label="Sevenforce AI Agents">
          {DOCK_AGENTS.map((agent) => {
            const isActive = agent.id === activeAgent.id;
            return (
              <button
                key={agent.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => handleSelectAgent(agent.id)}
                className={`dock-tab ${isActive ? "active" : ""}`}
                style={{
                  ["--agent-accent" as any]: agent.accent,
                }}
              >
                <div className="dock-avatar-wrap">
                  <span className="dock-em">{agent.em}</span>
                  <span className="dock-beacon" />
                </div>
                <div className="dock-info">
                  <span className="dock-name">{agent.name}</span>
                  <span className="dock-suite">{agent.suite}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── ACTIVE AGENT WORKSTATION CONSOLE ───────────────────── */}
      <div
        className="workstation-hud glow"
        style={{ ["--agent-accent" as any]: activeAgent.accent }}
      >
        {/* HUD Top Bar */}
        <div className="hud-header">
          <div className="hud-agent-meta">
            <div className="hud-avatar">
              <span className="hud-em">{activeAgent.em}</span>
            </div>
            <div>
              <div className="hud-title-row">
                <h3 className="hud-agent-name">{activeAgent.name}</h3>
                <span className="hud-badge role-badge">{activeAgent.role}</span>
                <span className="hud-badge suite-badge">{activeAgent.suite}</span>
              </div>
              <p className="hud-tagline">{activeAgent.tagline}</p>
            </div>
          </div>

          <div className="hud-telemetry">
            <div className="telemetry-item">
              <span className="telemetry-lbl">ENGINE</span>
              <span className="telemetry-val">{activeAgent.model}</span>
            </div>
            <div className="telemetry-item">
              <span className="telemetry-lbl">STATUS</span>
              <span className="telemetry-val text-online">
                <span className="beacon-ping" /> ONLINE
              </span>
            </div>
            <div className="telemetry-item">
              <span className="telemetry-lbl">LATENCY</span>
              <span className="telemetry-val">{activeAgent.latency}</span>
            </div>
          </div>
        </div>

        {/* HUD Body: Presets & Live Prompt */}
        <div className="hud-body">
          <div className="presets-label">
            <i className="fas fa-bolt" /> QUICK SPECIMEN PROMPTS FOR {activeAgent.name.toUpperCase()}
          </div>
          <div className="hud-chips">
            {activeAgent.presets.map((preset) => (
              <button
                key={preset}
                type="button"
                className="hud-chip"
                onClick={() => {
                  setPrompt(preset);
                  executeTask(preset);
                }}
              >
                &ldquo;{preset}&rdquo;
              </button>
            ))}
          </div>

          <form className="hud-form" onSubmit={onFormSubmit}>
            <div className="input-group">
              <span className="terminal-prefix">&gt;</span>
              <input
                type="text"
                className="hud-input"
                placeholder={activeAgent.inputPlaceholder}
                maxLength={200}
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <button
                type="submit"
                className="hud-run-btn"
                disabled={loading}
                style={{ backgroundColor: activeAgent.accent }}
              >
                <i className={loading ? "fas fa-spinner fa-spin" : "fas fa-play"} />
                <span>{loading ? "Agent Running…" : `Execute with ${activeAgent.name}`}</span>
              </button>
            </div>
          </form>

          {error && (
            <div className="hud-error" role="alert">
              <i className="fas fa-triangle-exclamation" /> {error}
            </div>
          )}

          {/* ── TERMINAL OUTPUT WINDOW ───────────────────────── */}
          {result && (
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-dots">
                  <span className="dot red" />
                  <span className="dot yellow" />
                  <span className="dot green" />
                </div>
                <span className="terminal-title">
                  <i className="fas fa-terminal" /> {activeAgent.name.toLowerCase()}_deliverable.md
                </span>
                <div className="terminal-actions">
                  <button
                    type="button"
                    onClick={copyResult}
                    className="terminal-btn"
                    title="Copy deliverable text"
                  >
                    <i className={copied ? "fas fa-check text-success" : "fas fa-copy"} />
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>
                  <a
                    href="/sevenforce/app/"
                    className="terminal-btn highlight"
                    title="Open in Sevenforce Production Console"
                  >
                    <span>Full Workspace →</span>
                  </a>
                </div>
              </div>

              <div className="terminal-content">
                <pre className="terminal-pre">
                  {result.split("\n").map((line, idx) => {
                    if (line.startsWith("**") && line.endsWith("**")) {
                      return (
                        <strong key={idx} className="terminal-heading">
                          {line.replace(/\*\*/g, "")}
                        </strong>
                      );
                    }
                    if (line.startsWith("- [ ]") || line.startsWith("•") || line.startsWith("- ")) {
                      return (
                        <div key={idx} className="terminal-list-item">
                          {line}
                        </div>
                      );
                    }
                    if (line.startsWith("```")) {
                      return (
                        <div key={idx} className="terminal-code-fence">
                          {line}
                        </div>
                      );
                    }
                    return <p key={idx} className="terminal-line">{line}</p>;
                  })}
                </pre>
              </div>

              <div className="terminal-footer">
                <span>
                  <i className="fas fa-microchip" /> Engine: {activeAgent.model} · Verified Offline-Safe
                </span>
                <span>
                  <i className="fas fa-shield-halved" /> Zero Credential Storage
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
