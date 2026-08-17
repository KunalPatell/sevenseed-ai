"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  AlertCircle,
  Sparkles,
  ListTodo,
  FileText,
  Compass,
  ExternalLink,
  Save,
  CheckCircle,
} from "lucide-react";
import { GlowCard } from "@/components/GlowCard";
import { authApi } from "@/lib/api";
import { Auth } from "@/lib/auth";

type ViewTab = "visual" | "text";

interface TimelineStep {
  title: string;
  duration?: string;
  description?: string;
  items?: string[];
}

const OFFICIAL_ROADMAPS = [
  { label: "Frontend", url: "https://roadmap.sh/frontend", icon: "🎨" },
  { label: "Backend", url: "https://roadmap.sh/backend", icon: "🖥️" },
  { label: "DevOps", url: "https://roadmap.sh/devops", icon: "🔄" },
  { label: "Data Science", url: "https://roadmap.sh/ai-data-scientist", icon: "🤖" },
];

function pickString(item: Record<string, unknown>, keys: string[]): string | undefined {
  for (const k of keys) {
    const v = item[k];
    if (typeof v === "string" && v.trim()) return v;
  }
  return undefined;
}

function pickArray(item: Record<string, unknown>, keys: string[]): string[] | undefined {
  for (const k of keys) {
    const v = item[k];
    if (Array.isArray(v)) {
      const strs = v.filter((x): x is string => typeof x === "string");
      if (strs.length) return strs;
    }
  }
  return undefined;
}

/** Finds the first array-of-objects field anywhere in an unknown API response
 * shape, since /api/visual-roadmap's real response contract isn't documented. */
function firstArrayField(obj: unknown): Record<string, unknown>[] | null {
  if (!obj || typeof obj !== "object") return null;
  for (const v of Object.values(obj as Record<string, unknown>)) {
    if (Array.isArray(v) && v.length > 0 && typeof v[0] === "object" && v[0] !== null) {
      return v as Record<string, unknown>[];
    }
  }
  return null;
}

function normalizeSteps(items: Record<string, unknown>[]): TimelineStep[] {
  return items.map((item, i) => ({
    title: pickString(item, ["title", "phase", "name", "label", "stage", "milestone"]) || `Step ${i + 1}`,
    duration: pickString(item, ["duration", "timeframe", "period", "days", "weeks", "range"]),
    description: pickString(item, ["description", "desc", "details", "summary", "goal"]),
    items: pickArray(item, ["tasks", "skills", "resources", "items", "topics", "actions"]),
  }));
}

/** Fallback: derive a rough phase timeline from the markdown-ish text guide
 * (## headers) when /api/visual-roadmap isn't available. */
function stepsFromMarkdown(text: string): TimelineStep[] {
  const blocks = text.split(/\n(?=##\s)/g).filter((b) => b.trim().startsWith("##"));
  if (!blocks.length) return [];
  return blocks.map((b) => {
    const lines = b.trim().split("\n");
    const title = lines[0].replace(/^#+\s*/, "").trim();
    const rest = lines.slice(1).join("\n").trim();
    const items = rest
      .split("\n")
      .map((l) => l.replace(/^[-*]\s*/, "").trim())
      .filter((l) => l && !l.startsWith("|"));
    return { title, description: undefined, items: items.length ? items : undefined };
  });
}

function MarkdownLite({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/);
  return (
    <div className="flex flex-col gap-3">
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (!trimmed) return null;
        if (trimmed.startsWith("###")) {
          return (
            <p key={i} className="text-sm font-black text-[#a78bfa] mt-1">
              {trimmed.replace(/^#+\s*/, "")}
            </p>
          );
        }
        if (trimmed.startsWith("##")) {
          return (
            <p key={i} className="text-base font-black mt-2">
              {trimmed.replace(/^#+\s*/, "")}
            </p>
          );
        }
        if (trimmed.startsWith("#")) {
          return (
            <p key={i} className="text-lg font-black mt-2">
              {trimmed.replace(/^#+\s*/, "")}
            </p>
          );
        }
        if (trimmed.includes("\n-") || trimmed.startsWith("-")) {
          const items = trimmed.split("\n").filter((l) => l.trim());
          return (
            <ul key={i} className="flex flex-col gap-1.5 text-sm text-[#9090b0]">
              {items.map((l, j) => (
                <li key={j}>• {l.replace(/^[-*]\s*/, "")}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="text-sm leading-relaxed text-[#eeeef8] whitespace-pre-wrap">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

export function RoadmapPanel() {
  const user = Auth.user();
  const [targetRole, setTargetRole] = useState(user?.target_role || "Full Stack Developer");
  const [experienceLevel, setExperienceLevel] = useState("fresher");
  const [skillsInput, setSkillsInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewTab, setViewTab] = useState<ViewTab>("visual");

  const [textGuide, setTextGuide] = useState("");
  const [steps, setSteps] = useState<TimelineStep[]>([]);
  const [generated, setGenerated] = useState(false);

  const [notionState, setNotionState] = useState<"idle" | "loading" | "success" | "error" | "missing">("idle");
  const [notionMsg, setNotionMsg] = useState("");

  async function generate() {
    if (!targetRole.trim()) {
      setError("Enter a target role first.");
      return;
    }
    setError("");
    setLoading(true);
    setNotionState("idle");
    const skills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const payload = { target_role: targetRole, experience_level: experienceLevel, skills };

    try {
      const textRes = await authApi("POST", "/api/career-roadmap", payload);
      const roadmapText: string = textRes?.roadmap || "";
      setTextGuide(roadmapText);

      let visualSteps: TimelineStep[] = [];
      try {
        const visualRes = await authApi("POST", "/api/visual-roadmap", payload);
        const arr = firstArrayField(visualRes);
        if (arr) visualSteps = normalizeSteps(arr);
      } catch {
        // /api/visual-roadmap isn't confirmed to exist on the backend — fall
        // back to deriving a timeline from the text guide's ## sections.
      }
      if (!visualSteps.length) visualSteps = stepsFromMarkdown(roadmapText);
      setSteps(visualSteps);
      setGenerated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate roadmap.");
    } finally {
      setLoading(false);
    }
  }

  async function exportToNotion() {
    setNotionState("loading");
    setNotionMsg("");
    try {
      const res = await authApi("POST", "/api/notion-export", {
        title: `Career Roadmap — ${targetRole}`,
        content: textGuide,
        page_type: "roadmap",
      });
      if (res?.missing) {
        setNotionState("missing");
        setNotionMsg(res.message || "Notion integration isn't configured on the server yet.");
      } else if (res?.success) {
        setNotionState("success");
        setNotionMsg(res.page_url || "");
      } else {
        setNotionState("error");
        setNotionMsg(res?.error || "Could not export to Notion.");
      }
    } catch (err) {
      setNotionState("error");
      setNotionMsg(err instanceof Error ? err.message : "Could not export to Notion.");
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <GlowCard className="tcard">
        <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] mb-4">Build Your Roadmap</p>
        <div className="grid sm:grid-cols-3 gap-3.5 mb-4">
          <div>
            <label className="text-[11px] font-bold text-[#55556a] mb-1.5 block">Target Role</label>
            <input
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Full Stack Developer"
              className="w-full text-sm px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[var(--primary)]/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#55556a] mb-1.5 block">Experience Level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full text-sm px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[var(--primary)]/50 transition-colors"
            >
              <option value="fresher">Fresher</option>
              <option value="junior">Junior (0-2 yr)</option>
              <option value="mid">Mid (2-5 yr)</option>
              <option value="senior">Senior (5+ yr)</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#55556a] mb-1.5 block">Skills (comma-separated)</label>
            <input
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="e.g. react, node, sql"
              className="w-full text-sm px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[var(--primary)]/50 transition-colors"
            />
          </div>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="flex items-center justify-center gap-2 text-sm font-bold px-5 py-3 rounded-xl text-white cursor-pointer transition-opacity disabled:opacity-50 w-full sm:w-auto"
          style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Generate Roadmap
        </button>
      </GlowCard>

      {error && (
        <div className="tcard flex items-center gap-2 border-[var(--red)]/30 text-sm text-[var(--red-l)]">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {generated && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewTab("visual")}
                className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg cursor-pointer transition-colors border"
                style={
                  viewTab === "visual"
                    ? { background: "linear-gradient(115deg, var(--primary), var(--secondary))", borderColor: "transparent", color: "white" }
                    : { background: "transparent", borderColor: "var(--border)", color: "#9090b0" }
                }
              >
                <ListTodo className="h-3.5 w-3.5" /> Visual
              </button>
              <button
                onClick={() => setViewTab("text")}
                className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg cursor-pointer transition-colors border"
                style={
                  viewTab === "text"
                    ? { background: "linear-gradient(115deg, var(--primary), var(--secondary))", borderColor: "transparent", color: "white" }
                    : { background: "transparent", borderColor: "var(--border)", color: "#9090b0" }
                }
              >
                <FileText className="h-3.5 w-3.5" /> Text Guide
              </button>
            </div>
            <button
              onClick={exportToNotion}
              disabled={notionState === "loading" || !textGuide}
              className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors disabled:opacity-50"
            >
              {notionState === "loading" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              Export to Notion
            </button>
          </div>

          {notionState === "success" && (
            <div className="tcard flex items-center gap-2 text-sm text-[var(--green-l)] border-[var(--green)]/30">
              <CheckCircle className="h-4 w-4 shrink-0" />
              Exported to Notion.{" "}
              {notionMsg && (
                <a href={notionMsg} target="_blank" rel="noreferrer" className="underline">
                  Open page →
                </a>
              )}
            </div>
          )}
          {(notionState === "error" || notionState === "missing") && (
            <div className="tcard flex items-center gap-2 text-sm text-[var(--gold-l)] border-[var(--gold)]/30">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {notionMsg}
            </div>
          )}

          {viewTab === "visual" && (
            <div className="tcard">
              {steps.length === 0 ? (
                <p className="text-sm text-[#55556a] py-8 text-center">No phased breakdown available for this roadmap.</p>
              ) : (
                <div className="flex flex-col">
                  {steps.map((s, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                          style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}
                        >
                          {i + 1}
                        </div>
                        {i < steps.length - 1 && <div className="w-px flex-1 bg-white/10 my-1" />}
                      </div>
                      <div className="pb-6 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-sm">{s.title}</p>
                          {s.duration && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#7c3aed]/15 text-[#a78bfa]">
                              {s.duration}
                            </span>
                          )}
                        </div>
                        {s.description && <p className="text-sm text-[#9090b0] mt-1.5">{s.description}</p>}
                        {s.items && s.items.length > 0 && (
                          <ul className="mt-2 flex flex-col gap-1">
                            {s.items.map((it, j) => (
                              <li key={j} className="text-xs text-[#9090b0] flex items-start gap-1.5">
                                <span className="mt-1 h-1 w-1 rounded-full bg-[#a78bfa] shrink-0" /> {it}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {viewTab === "text" && (
            <div className="tcard">
              <MarkdownLite text={textGuide} />
            </div>
          )}
        </motion.div>
      )}

      <div className="tcard">
        <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] mb-3 flex items-center gap-1.5">
          <Compass className="h-3.5 w-3.5" /> Official Roadmaps (roadmap.sh)
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {OFFICIAL_ROADMAPS.map((r) => (
            <a
              key={r.label}
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 px-3.5 py-3 rounded-lg bg-white/[0.03] border border-white/5 hover:border-white/15 transition-colors"
            >
              <span className="text-xl">{r.icon}</span>
              <span className="text-sm font-semibold flex-1">{r.label}</span>
              <ExternalLink className="h-3.5 w-3.5 text-[#55556a] shrink-0" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
