"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  Sliders,
  Play,
  Loader2,
  CheckCircle,
  XCircle,
  History,
  Building2,
  AlertCircle,
  Mail,
} from "lucide-react";
import { authApi } from "@/lib/api";

const TONES = ["professional", "friendly", "concise", "enthusiastic"];

interface Draft {
  id: number;
  company_id?: number;
  company_name?: string;
  email_to?: string;
  subject?: string;
  body?: string;
  status?: string;
  fit_score?: number;
  [key: string]: unknown;
}

interface RunDetail {
  run_id: number;
  status: string;
  drafts: Draft[];
}

interface HistoryRun {
  id: number;
  status: string;
  params?: string;
  summary?: string;
  created_at?: number;
  [key: string]: unknown;
}

export function AutopilotPanel() {
  const [targetRole, setTargetRole] = useState("");
  const [numCompanies, setNumCompanies] = useState(5);
  const [tone, setTone] = useState("professional");

  const [starting, setStarting] = useState(false);
  const [polling, setPolling] = useState(false);
  const [error, setError] = useState("");
  const [run, setRun] = useState<RunDetail | null>(null);
  const [draftBusyId, setDraftBusyId] = useState<number | null>(null);

  const [history, setHistory] = useState<HistoryRun[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await authApi("GET", "/api/autopilot/history");
      setHistory((res?.runs as HistoryRun[]) || []);
    } catch {
      // silent — history is secondary
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
    return () => {
      if (pollTimer.current) clearTimeout(pollTimer.current);
    };
  }, [loadHistory]);

  function pollRun(runId: number, attemptsLeft: number) {
    if (attemptsLeft <= 0) {
      setPolling(false);
      return;
    }
    pollTimer.current = setTimeout(async () => {
      try {
        const res = await authApi("GET", `/api/autopilot/${runId}`);
        const drafts = (res?.drafts as Draft[]) || [];
        const status = String(res?.run?.status || "pending_approval");
        setRun({ run_id: runId, status, drafts });
        if (status === "completed") {
          setPolling(false);
          loadHistory();
          return;
        }
      } catch {
        // keep polling despite a transient failure
      }
      pollRun(runId, attemptsLeft - 1);
    }, 3000);
  }

  async function startRun() {
    if (!targetRole.trim()) {
      setError("Enter a target role first.");
      return;
    }
    setError("");
    setStarting(true);
    setRun(null);
    if (pollTimer.current) clearTimeout(pollTimer.current);
    try {
      const res = await authApi("POST", "/api/autopilot/run", {
        target_role: targetRole.trim(),
        num_companies: numCompanies,
        tone,
      });
      const runId = Number(res?.run_id);
      const drafts = (res?.drafts as Draft[]) || [];
      const status = String(res?.status || "pending_approval");
      setRun({ run_id: runId, status, drafts });
      loadHistory();
      if (status !== "completed" && runId) {
        setPolling(true);
        pollRun(runId, 10);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start Autopilot run");
    } finally {
      setStarting(false);
    }
  }

  async function actOnDraft(draftId: number, approve: boolean) {
    if (!run) return;
    setDraftBusyId(draftId);
    setError("");
    try {
      const res = await authApi("POST", `/api/autopilot/${run.run_id}/approve`, {
        approved_drafts: approve ? [draftId] : [],
        rejected_drafts: approve ? [] : [draftId],
      });
      const newStatus = String(res?.status || run.status);
      setRun((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              drafts: prev.drafts.map((d) =>
                d.id === draftId ? { ...d, status: approve ? "approved" : "rejected" } : d
              ),
            }
          : prev
      );
      loadHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update draft");
    } finally {
      setDraftBusyId(null);
    }
  }

  function parseJson(raw?: string): Record<string, unknown> {
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }

  const pendingDrafts = run?.drafts.filter((d) => (d.status || "pending") === "pending") || [];
  const resolvedDrafts = run?.drafts.filter((d) => (d.status || "pending") !== "pending") || [];

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="tcard flex items-center gap-3">
        <div
          className="h-11 w-11 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}
        >
          <Rocket className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-bold flex items-center gap-2">
            Autopilot Agent
            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-[#f59e0b]/15 text-[#fcd34d]">
              FLAGSHIP
            </span>
          </p>
          <p className="text-xs text-[#55556a]">
            Autopilot finds companies, drafts outreach emails, and sends them after your approval.
          </p>
        </div>
      </div>

      {/* Config form */}
      <div className="tcard flex flex-col gap-4">
        <p className="text-xs font-bold uppercase tracking-wide text-[#55556a]">Run Configuration</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wide text-[#55556a] mb-1 block">
              Target Role
            </label>
            <input
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Backend Engineer"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-[#eeeef8] placeholder:text-[#55556a] focus:outline-none focus:border-[#7c3aed]/50"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wide text-[#55556a] mb-1 block">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-[#eeeef8] focus:outline-none focus:border-[#7c3aed]/50"
            >
              {TONES.map((t) => (
                <option key={t} value={t}>
                  {t[0].toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wide text-[#55556a] mb-2 flex items-center gap-1.5">
            <Sliders className="h-3 w-3" /> Companies to target: <span className="text-[#a78bfa]">{numCompanies}</span>
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={numCompanies}
            onChange={(e) => setNumCompanies(Number(e.target.value))}
            className="w-full accent-[#7c3aed]"
          />
        </div>
        {error && (
          <p className="flex items-center gap-1.5 text-xs text-[var(--red-l)]">
            <AlertCircle className="h-3.5 w-3.5" /> {error}
          </p>
        )}
        <button
          onClick={startRun}
          disabled={starting}
          className="flex items-center justify-center gap-2 text-sm font-bold px-5 py-2.5 rounded-lg text-white cursor-pointer disabled:opacity-60 transition-opacity self-start"
          style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
        >
          {starting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          Run Autopilot
        </button>
      </div>

      {/* Approval queue */}
      {run && (
        <div className="tcard">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wide text-[#55556a]">
              Approval Queue — Run #{run.run_id}
            </p>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#9090b0]">
              {polling && <Loader2 className="h-3 w-3 animate-spin" />}
              {run.status.replace(/_/g, " ")}
            </span>
          </div>

          {pendingDrafts.length === 0 && resolvedDrafts.length === 0 && (
            <p className="text-xs text-[#55556a]">No drafts were generated for this run.</p>
          )}

          <div className="flex flex-col gap-3">
            <AnimatePresence initial={false}>
              {pendingDrafts.map((d) => (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex flex-col gap-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <Building2 className="h-4 w-4 text-[#9090b0] shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate">{d.company_name || "Unknown Company"}</p>
                        <p className="text-[10px] text-[#55556a] truncate">{d.email_to || "No email on file"}</p>
                      </div>
                    </div>
                    {typeof d.fit_score === "number" && (
                      <span className="text-[10px] font-black px-2 py-1 rounded-full bg-[#7c3aed]/15 text-[#a78bfa] shrink-0">
                        Fit {d.fit_score}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-[#eeeef8]">{d.subject}</p>
                  <p className="text-xs text-[#9090b0] leading-relaxed whitespace-pre-wrap line-clamp-4">{d.body}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => actOnDraft(d.id, true)}
                      disabled={draftBusyId === d.id}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-[#10b981]/15 text-[#6ee7b7] hover:bg-[#10b981]/25 cursor-pointer disabled:opacity-50 transition-colors"
                    >
                      {draftBusyId === d.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <CheckCircle className="h-3.5 w-3.5" />
                      )}
                      Approve &amp; Send
                    </button>
                    <button
                      onClick={() => actOnDraft(d.id, false)}
                      disabled={draftBusyId === d.id}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-white/5 text-[#9090b0] hover:bg-white/10 cursor-pointer disabled:opacity-50 transition-colors"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Reject
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {resolvedDrafts.length > 0 && (
              <div className="flex flex-col gap-2 pt-2">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#55556a]">Resolved</p>
                {resolvedDrafts.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-white/[0.02] border border-white/5"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Mail className="h-3.5 w-3.5 text-[#55556a] shrink-0" />
                      <span className="text-xs font-semibold truncate">{d.company_name}</span>
                    </div>
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                        d.status === "approved"
                          ? "bg-[#10b981]/15 text-[#6ee7b7]"
                          : d.status === "failed"
                          ? "bg-[#ef4444]/15 text-[#fca5a5]"
                          : "bg-white/5 text-[#55556a]"
                      }`}
                    >
                      {(d.status || "").toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Run history */}
      <div className="tcard">
        <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] mb-3 flex items-center gap-2">
          <History className="h-3.5 w-3.5" /> Run History
        </p>
        {historyLoading && <p className="text-xs text-[#55556a]">Loading history...</p>}
        {!historyLoading && history.length === 0 && (
          <p className="text-xs text-[#55556a]">No Autopilot runs yet — start one above.</p>
        )}
        {!historyLoading && history.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-[#55556a] border-b border-white/5">
                  <th className="font-semibold py-2 pr-4">Run</th>
                  <th className="font-semibold py-2 pr-4">Role</th>
                  <th className="font-semibold py-2 pr-4">Companies</th>
                  <th className="font-semibold py-2 pr-4">Tone</th>
                  <th className="font-semibold py-2 pr-4">Status</th>
                  <th className="font-semibold py-2 pr-4">Sent</th>
                  <th className="font-semibold py-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => {
                  const params = parseJson(h.params);
                  const summary = parseJson(h.summary);
                  return (
                    <tr key={h.id} className="border-b border-white/5 last:border-none">
                      <td className="py-2 pr-4 font-bold">#{h.id}</td>
                      <td className="py-2 pr-4 text-[#9090b0]">{String(params.target_role || "—")}</td>
                      <td className="py-2 pr-4 text-[#9090b0]">{String(params.num_companies ?? "—")}</td>
                      <td className="py-2 pr-4 text-[#9090b0]">{String(params.tone || "—")}</td>
                      <td className="py-2 pr-4">
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-white/5 text-[#9090b0]">
                          {String(h.status || "—").replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-[#9090b0]">{String(summary.sent ?? "—")}</td>
                      <td className="py-2 text-[#55556a]">
                        {h.created_at ? new Date(Number(h.created_at) * 1000).toLocaleString() : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
