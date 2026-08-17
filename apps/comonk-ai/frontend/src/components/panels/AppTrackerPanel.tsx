"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Kanban,
  Plus,
  X,
  Trash2,
  Mail,
  MessageCircle,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  Building2,
} from "lucide-react";
import { authApi } from "@/lib/api";

type StatusKey = "saved" | "applied" | "interview" | "offer" | "rejected";

interface AppItem {
  id: number;
  status: string;
  custom_company_name?: string;
  company_name?: string;
  company_category?: string;
  notes?: string;
  fit_score?: number;
  applied_at?: number;
  last_action_at?: number;
  [key: string]: unknown;
}

type Board = Record<StatusKey, AppItem[]>;

const COLUMNS: { key: StatusKey; label: string }[] = [
  { key: "saved", label: "Saved" },
  { key: "applied", label: "Applied" },
  { key: "interview", label: "Interview" },
  { key: "offer", label: "Offer" },
  { key: "rejected", label: "Rejected" },
];

function emptyBoard(): Board {
  return { saved: [], applied: [], interview: [], offer: [], rejected: [] };
}

function extractRole(notes?: string): string | null {
  if (!notes) return null;
  const m = notes.match(/^Role:\s*(.+)$/m);
  return m ? m[1].trim() : null;
}

export function AppTrackerPanel() {
  const [board, setBoard] = useState<Board>(emptyBoard());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOverCol, setDragOverCol] = useState<StatusKey | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ company: "", role: "", status: "saved" as StatusKey, notes: "" });
  const [saving, setSaving] = useState(false);

  const [actionResult, setActionResult] = useState<{ title: string; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await authApi("GET", "/api/applications/board");
      const raw = (res?.board as Record<string, AppItem[]>) || {};
      const next = emptyBoard();
      (Object.keys(raw) as (keyof typeof raw)[]).forEach((k) => {
        const items = raw[k] || [];
        if (k === "replied") {
          next.applied = [...next.applied, ...items];
        } else if (COLUMNS.some((c) => c.key === k)) {
          next[k as StatusKey] = [...next[k as StatusKey], ...items];
        }
      });
      setBoard(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load application board");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const kpis = useMemo(
    () => COLUMNS.map((c) => ({ ...c, count: board[c.key]?.length || 0 })),
    [board]
  );

  async function handleAdd() {
    if (!form.company.trim()) {
      setError("Company name is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const notes = form.role.trim()
        ? `Role: ${form.role.trim()}${form.notes.trim() ? "\n" + form.notes.trim() : ""}`
        : form.notes.trim();
      await authApi("POST", "/api/applications", {
        company_id: -1,
        custom_company_name: form.company.trim(),
        status: form.status,
        notes,
        fit_score: 0,
      });
      setModalOpen(false);
      setForm({ company: "", role: "", status: "saved", notes: "" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add application");
    } finally {
      setSaving(false);
    }
  }

  async function moveTo(id: number, status: StatusKey) {
    // optimistic update
    setBoard((prev) => {
      const next: Board = { saved: [...prev.saved], applied: [...prev.applied], interview: [...prev.interview], offer: [...prev.offer], rejected: [...prev.rejected] };
      let moved: AppItem | undefined;
      (Object.keys(next) as StatusKey[]).forEach((k) => {
        const idx = next[k].findIndex((a) => a.id === id);
        if (idx !== -1) {
          moved = next[k][idx];
          next[k] = next[k].filter((a) => a.id !== id);
        }
      });
      if (moved) next[status] = [{ ...moved, status }, ...next[status]];
      return next;
    });
    try {
      await authApi("PATCH", `/api/applications/${id}`, { status });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
      load();
    }
  }

  async function removeApp(id: number) {
    setBusyId(id);
    try {
      await authApi("DELETE", `/api/applications/${id}`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete application");
    } finally {
      setBusyId(null);
    }
  }

  async function runFollowup(id: number) {
    setBusyId(id);
    try {
      const res = await authApi("POST", `/api/applications/${id}/followup`);
      setActionResult({ title: "Follow-up Email", text: String(res?.followup_email || "") });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate follow-up");
    } finally {
      setBusyId(null);
    }
  }

  async function runMarkReplied(id: number) {
    setBusyId(id);
    try {
      const res = await authApi("POST", `/api/applications/${id}/mark-replied`);
      setActionResult({ title: "Suggested Reply", text: String(res?.suggested_reply || "") });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark as replied");
    } finally {
      setBusyId(null);
    }
  }

  function copyResult() {
    if (!actionResult) return;
    navigator.clipboard?.writeText(actionResult.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Kanban className="h-4 w-4 text-[#a78bfa]" />
          <p className="text-sm font-bold">Application Tracker</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-lg text-white cursor-pointer transition-opacity shrink-0"
          style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
        >
          <Plus className="h-4 w-4" /> Add Application
        </button>
      </div>

      {error && (
        <div className="tcard flex items-center gap-2 border-[var(--red)]/30 text-sm text-[var(--red-l)]">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {kpis.map((k) => (
          <div key={k.key} className="tcard !p-3.5 text-center">
            <p className="text-xl font-black">{k.count}</p>
            <p className="text-[10px] text-[#55556a] mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {loading && (
        <div className="tcard flex items-center justify-center py-10 text-[#55556a] text-sm">
          <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading board...
        </div>
      )}

      {/* Kanban board */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {COLUMNS.map((col) => (
            <div
              key={col.key}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverCol(col.key);
              }}
              onDragLeave={() => setDragOverCol((c) => (c === col.key ? null : c))}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverCol(null);
                const id = Number(e.dataTransfer.getData("text/plain"));
                if (id) moveTo(id, col.key);
              }}
              className={`rounded-[16px] border p-3 flex flex-col gap-2.5 min-h-[220px] transition-colors ${
                dragOverCol === col.key ? "border-[#7c3aed]/50 bg-[#7c3aed]/5" : "border-white/5 bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center justify-between px-1">
                <p className="text-xs font-bold uppercase tracking-wide text-[#9090b0]">{col.label}</p>
                <span className="text-[10px] font-black text-[#55556a]">{board[col.key]?.length || 0}</span>
              </div>

              <div className="flex flex-col gap-2">
                {(board[col.key] || []).map((item) => {
                  const role = extractRole(item.notes);
                  const isReplied = item.status === "replied";
                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", String(item.id));
                      }}
                      className="tcard !p-3 cursor-grab active:cursor-grabbing flex flex-col gap-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Building2 className="h-3.5 w-3.5 text-[#55556a] shrink-0" />
                          <p className="text-xs font-bold truncate">
                            {item.company_name || item.custom_company_name || "Unknown"}
                          </p>
                        </div>
                        {isReplied && (
                          <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-[#10b981]/15 text-[#6ee7b7] shrink-0">
                            REPLIED
                          </span>
                        )}
                      </div>
                      {role && <p className="text-[10px] text-[#55556a]">{role}</p>}
                      {typeof item.fit_score === "number" && item.fit_score > 0 && (
                        <p className="text-[10px] text-[#a78bfa] font-bold">Fit {item.fit_score}</p>
                      )}
                      <div className="flex items-center gap-1 pt-1 border-t border-white/5 mt-1">
                        <button
                          onClick={() => runFollowup(item.id)}
                          disabled={busyId === item.id}
                          title="Generate follow-up email"
                          className="flex-1 flex items-center justify-center py-1.5 rounded-md hover:bg-white/5 text-[#9090b0] cursor-pointer disabled:opacity-40"
                        >
                          <Mail className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => runMarkReplied(item.id)}
                          disabled={busyId === item.id}
                          title="Mark as replied"
                          className="flex-1 flex items-center justify-center py-1.5 rounded-md hover:bg-white/5 text-[#9090b0] cursor-pointer disabled:opacity-40"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => removeApp(item.id)}
                          disabled={busyId === item.id}
                          title="Delete"
                          className="flex-1 flex items-center justify-center py-1.5 rounded-md hover:bg-white/5 text-[#55556a] hover:text-[var(--red-l)] cursor-pointer disabled:opacity-40"
                        >
                          {busyId === item.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
                {(board[col.key] || []).length === 0 && (
                  <p className="text-[10px] text-[#3a3a4a] text-center py-6">Drop cards here</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Application modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              className="tcard w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="font-bold">Add Application</p>
                <button onClick={() => setModalOpen(false)} className="cursor-pointer text-[#55556a] hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wide text-[#55556a] mb-1 block">
                    Company
                  </label>
                  <input
                    value={form.company}
                    onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                    placeholder="e.g. Acme Corp"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-[#eeeef8] placeholder:text-[#55556a] focus:outline-none focus:border-[#7c3aed]/50"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wide text-[#55556a] mb-1 block">
                    Role
                  </label>
                  <input
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    placeholder="e.g. Frontend Engineer"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-[#eeeef8] placeholder:text-[#55556a] focus:outline-none focus:border-[#7c3aed]/50"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wide text-[#55556a] mb-1 block">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as StatusKey }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-[#eeeef8] focus:outline-none focus:border-[#7c3aed]/50"
                  >
                    {COLUMNS.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wide text-[#55556a] mb-1 block">
                    Notes
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    rows={3}
                    placeholder="Optional notes..."
                    className="w-full resize-none bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-[#eeeef8] placeholder:text-[#55556a] focus:outline-none focus:border-[#7c3aed]/50"
                  />
                </div>
                <button
                  onClick={handleAdd}
                  disabled={saving}
                  className="mt-1 flex items-center justify-center gap-2 text-sm font-bold px-4 py-2.5 rounded-lg text-white cursor-pointer disabled:opacity-60 transition-opacity"
                  style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Save Application
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action result modal (followup / reply text) */}
      <AnimatePresence>
        {actionResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setActionResult(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              className="tcard w-full max-w-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold">{actionResult.title}</p>
                <button onClick={() => setActionResult(null)} className="cursor-pointer text-[#55556a] hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <pre className="whitespace-pre-wrap text-sm text-[#eeeef8] bg-white/[0.03] border border-white/5 rounded-lg p-3.5 max-h-80 overflow-y-auto font-sans">
                {actionResult.text}
              </pre>
              <button
                onClick={copyResult}
                className="mt-3 flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-[var(--green-l)]" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy to clipboard"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
