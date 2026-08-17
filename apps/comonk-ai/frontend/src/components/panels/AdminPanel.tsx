"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Lock,
  Loader2,
  CheckCircle2,
  XCircle,
  Trash2,
  RefreshCw,
  AlertTriangle,
  ShieldAlert,
  Users,
} from "lucide-react";
import { API_BASE } from "@/lib/api";
import { Auth } from "@/lib/auth";
import { ADMIN_EMAILS } from "@/lib/panels";

const PW_STORAGE_KEY = "comonk_admin_pw";

interface AdminRequest {
  id: number;
  user_id: number;
  company_ids: string;
  status: string;
  admin_note: string;
  created_at: number;
  name: string;
  email: string;
  target_role: string;
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  target_role: string;
  city: string;
  is_verified: number;
  is_email_verified: number;
  contacts_used: number;
  created_at: number;
}

interface TestAttempt {
  id: number;
  user_id: number;
  score: number;
  total: number;
  passed: number;
  role: string;
  tab_switches: number;
  time_taken: number;
  suspicious: number;
  created_at: number;
  name: string;
  email: string;
}

type Tab = "requests" | "users" | "attempts";

async function adminFetch(pw: string, path: string, opts: { method?: string; body?: unknown } = {}) {
  const headers: Record<string, string> = { Authorization: `Admin ${pw}` };
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  const res = await fetch(`${API_BASE}${path}`, {
    method: opts.method || "GET",
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const j = await res.json();
      detail = j.detail || j.error || detail;
    } catch {
      // ignore
    }
    throw new Error(detail);
  }
  return res.json();
}

function fmtDate(ts: number) {
  if (!ts) return "—";
  return new Date(ts * 1000).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
}

function prettyLabel(key: string) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function AdminPanel() {
  const [emailOk, setEmailOk] = useState<boolean | null>(null);
  const [pw, setPw] = useState<string | null>(null);
  const [pwInput, setPwInput] = useState("");
  const [pwReady, setPwReady] = useState(false);
  const [pwChecking, setPwChecking] = useState(false);
  const [pwError, setPwError] = useState("");

  const [tab, setTab] = useState<Tab>("requests");
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPage, setUsersPage] = useState(1);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [loadingTab, setLoadingTab] = useState(false);
  const [tabError, setTabError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    const user = Auth.user();
    setEmailOk(!!user && ADMIN_EMAILS.includes(user.email));
  }, []);

  const verifyPw = useCallback(async (candidate: string) => {
    setPwChecking(true);
    setPwError("");
    try {
      await adminFetch(candidate, "/api/admin/stats");
      sessionStorage.setItem(PW_STORAGE_KEY, candidate);
      setPw(candidate);
    } catch {
      sessionStorage.removeItem(PW_STORAGE_KEY);
      setPwError("Incorrect admin password.");
    } finally {
      setPwChecking(false);
      setPwReady(true);
    }
  }, []);

  useEffect(() => {
    if (emailOk !== true) return;
    const stored = typeof window !== "undefined" ? sessionStorage.getItem(PW_STORAGE_KEY) : null;
    if (stored) {
      verifyPw(stored);
    } else {
      setPwReady(true);
    }
  }, [emailOk, verifyPw]);

  const loadStats = useCallback(async (p: string) => {
    try {
      const s = await adminFetch(p, "/api/admin/stats");
      setStats(s);
    } catch {
      // ignore — KPI row just stays empty
    }
  }, []);

  const loadRequests = useCallback(async (p: string) => {
    setLoadingTab(true);
    setTabError("");
    try {
      const r = await adminFetch(p, "/api/admin/requests");
      setRequests(r.requests || []);
    } catch (e) {
      setTabError(e instanceof Error ? e.message : "Failed to load requests.");
    } finally {
      setLoadingTab(false);
    }
  }, []);

  const loadUsers = useCallback(async (p: string, page: number) => {
    setLoadingTab(true);
    setTabError("");
    try {
      const r = await adminFetch(p, `/api/admin/users?page=${page}&limit=20`);
      setUsers(r.users || []);
      setUsersTotal(r.total || 0);
    } catch (e) {
      setTabError(e instanceof Error ? e.message : "Failed to load users.");
    } finally {
      setLoadingTab(false);
    }
  }, []);

  const loadAttempts = useCallback(async (p: string) => {
    setLoadingTab(true);
    setTabError("");
    try {
      const r = await adminFetch(p, "/api/admin/test-attempts");
      setAttempts(r.attempts || []);
    } catch (e) {
      setTabError(e instanceof Error ? e.message : "Failed to load test attempts.");
    } finally {
      setLoadingTab(false);
    }
  }, []);

  useEffect(() => {
    if (!pw) return;
    loadStats(pw);
  }, [pw, loadStats]);

  useEffect(() => {
    if (!pw) return;
    if (tab === "requests") loadRequests(pw);
    else if (tab === "users") loadUsers(pw, usersPage);
    else loadAttempts(pw);
  }, [pw, tab, usersPage, loadRequests, loadUsers, loadAttempts]);

  async function approve(id: number) {
    if (!pw) return;
    setBusyId(id);
    try {
      await adminFetch(pw, "/api/admin/approve", { method: "POST", body: { request_id: id } });
      await Promise.all([loadRequests(pw), loadStats(pw)]);
    } catch (e) {
      setTabError(e instanceof Error ? e.message : "Approve failed.");
    } finally {
      setBusyId(null);
    }
  }

  async function reject(id: number) {
    if (!pw) return;
    setBusyId(id);
    try {
      await adminFetch(pw, "/api/admin/reject", { method: "POST", body: { request_id: id } });
      await Promise.all([loadRequests(pw), loadStats(pw)]);
    } catch (e) {
      setTabError(e instanceof Error ? e.message : "Reject failed.");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteUser(id: number) {
    if (!pw) return;
    setBusyId(id);
    try {
      await adminFetch(pw, `/api/admin/user/${id}`, { method: "DELETE" });
      await Promise.all([loadUsers(pw, usersPage), loadStats(pw)]);
    } catch (e) {
      setTabError(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setBusyId(null);
    }
  }

  if (emailOk === null) return null;

  if (!emailOk) {
    return (
      <div className="tcard flex flex-col items-center justify-center py-16 text-center gap-3">
        <Lock className="h-7 w-7 text-[#55556a]" />
        <p className="font-bold">Not authorized</p>
        <p className="text-xs text-[#55556a]">This area is restricted to Comonk admins.</p>
      </div>
    );
  }

  if (!pwReady) {
    return (
      <div className="tcard flex flex-col items-center justify-center py-16 gap-2">
        <Loader2 className="h-6 w-6 text-[#a78bfa] animate-spin" />
      </div>
    );
  }

  if (!pw) {
    return (
      <div className="tcard max-w-sm mx-auto flex flex-col items-center text-center gap-4 py-10">
        <div className="h-12 w-12 rounded-full flex items-center justify-center bg-[#7c3aed]/15 border border-[#7c3aed]/40">
          <Lock className="h-5 w-5 text-[#a78bfa]" />
        </div>
        <p className="font-bold">Admin access</p>
        <form
          className="w-full flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (pwInput.trim()) verifyPw(pwInput.trim());
          }}
        >
          <input
            type="password"
            value={pwInput}
            onChange={(e) => setPwInput(e.target.value)}
            placeholder="Admin password"
            className="w-full text-sm px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[#7c3aed]/50"
            autoFocus
          />
          {pwError && <p className="text-xs text-[#fca5a5]">{pwError}</p>}
          <button
            type="submit"
            disabled={pwChecking}
            className="text-xs font-bold px-4 py-2.5 rounded-lg text-white cursor-pointer disabled:opacity-60"
            style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
          >
            {pwChecking ? "Checking…" : "Enter"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(stats).map(([k, v]) => (
            <div key={k} className="tcard py-3 px-4">
              <p className="text-xl font-black">{v}</p>
              <p className="text-[10px] text-[#55556a] mt-0.5">{prettyLabel(k)}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        {([
          ["requests", "Pending Requests"],
          ["users", "All Users"],
          ["attempts", "Test Attempts"],
        ] as [Tab, string][]).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`text-xs font-bold px-3.5 py-2 rounded-lg cursor-pointer transition-colors ${
              tab === id ? "bg-[#7c3aed]/20 text-white border border-[#7c3aed]/40" : "bg-white/5 text-[#9090b0] border border-white/5 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
        <button
          onClick={() => {
            if (tab === "requests") loadRequests(pw);
            else if (tab === "users") loadUsers(pw, usersPage);
            else loadAttempts(pw);
            loadStats(pw);
          }}
          className="ml-auto text-xs font-semibold px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-[#9090b0] hover:text-white cursor-pointer flex items-center gap-1.5"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {tabError && (
        <p className="text-xs text-[#fca5a5] flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5" /> {tabError}
        </p>
      )}

      {loadingTab ? (
        <div className="tcard flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 text-[#a78bfa] animate-spin" />
        </div>
      ) : tab === "requests" ? (
        <div className="tcard overflow-x-auto">
          {requests.length === 0 ? (
            <p className="text-xs text-[#55556a] text-center py-8">No pending contact requests.</p>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[10px] uppercase tracking-wide text-[#55556a] border-b border-white/5">
                  <th className="text-left py-2 pr-3 font-semibold">User</th>
                  <th className="text-left py-2 pr-3 font-semibold">Target Role</th>
                  <th className="text-left py-2 pr-3 font-semibold">Companies</th>
                  <th className="text-left py-2 pr-3 font-semibold">Requested</th>
                  <th className="text-right py-2 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => {
                  let count = 0;
                  try {
                    count = (JSON.parse(r.company_ids) as unknown[]).length;
                  } catch {
                    count = 0;
                  }
                  return (
                    <tr key={r.id} className="border-b border-white/5 last:border-0">
                      <td className="py-2.5 pr-3">
                        <p className="font-semibold">{r.name}</p>
                        <p className="text-[#55556a]">{r.email}</p>
                      </td>
                      <td className="py-2.5 pr-3 text-[#9090b0]">{r.target_role || "—"}</td>
                      <td className="py-2.5 pr-3 text-[#9090b0]">{count} compan{count === 1 ? "y" : "ies"}</td>
                      <td className="py-2.5 pr-3 text-[#55556a]">{fmtDate(r.created_at)}</td>
                      <td className="py-2.5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            disabled={busyId === r.id}
                            onClick={() => approve(r.id)}
                            className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-md bg-[#10b981]/15 text-[#6ee7b7] border border-[#10b981]/30 hover:bg-[#10b981]/25 cursor-pointer disabled:opacity-50"
                          >
                            <CheckCircle2 className="h-3 w-3" /> Approve
                          </button>
                          <button
                            disabled={busyId === r.id}
                            onClick={() => reject(r.id)}
                            className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-md bg-[#ef4444]/15 text-[#fca5a5] border border-[#ef4444]/30 hover:bg-[#ef4444]/25 cursor-pointer disabled:opacity-50"
                          >
                            <XCircle className="h-3 w-3" /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      ) : tab === "users" ? (
        <div className="flex flex-col gap-3">
          <div className="tcard overflow-x-auto">
            {users.length === 0 ? (
              <p className="text-xs text-[#55556a] text-center py-8">No users found.</p>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wide text-[#55556a] border-b border-white/5">
                    <th className="text-left py-2 pr-3 font-semibold">Name</th>
                    <th className="text-left py-2 pr-3 font-semibold">Email</th>
                    <th className="text-left py-2 pr-3 font-semibold">Role</th>
                    <th className="text-left py-2 pr-3 font-semibold">City</th>
                    <th className="text-left py-2 pr-3 font-semibold">Verified</th>
                    <th className="text-left py-2 pr-3 font-semibold">Joined</th>
                    <th className="text-right py-2 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-white/5 last:border-0">
                      <td className="py-2.5 pr-3 font-semibold">{u.name}</td>
                      <td className="py-2.5 pr-3 text-[#9090b0]">{u.email}</td>
                      <td className="py-2.5 pr-3 text-[#9090b0]">{u.target_role || "—"}</td>
                      <td className="py-2.5 pr-3 text-[#9090b0]">{u.city || "—"}</td>
                      <td className="py-2.5 pr-3">
                        {u.is_verified ? (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#10b981]/15 text-[#6ee7b7]">✓</span>
                        ) : (
                          <span className="text-[10px] text-[#55556a]">—</span>
                        )}
                      </td>
                      <td className="py-2.5 pr-3 text-[#55556a]">{fmtDate(u.created_at)}</td>
                      <td className="py-2.5 text-right">
                        <button
                          disabled={busyId === u.id}
                          onClick={() => {
                            if (confirm(`Delete user ${u.name}? This cannot be undone.`)) deleteUser(u.id);
                          }}
                          className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-md bg-[#ef4444]/15 text-[#fca5a5] border border-[#ef4444]/30 hover:bg-[#ef4444]/25 cursor-pointer disabled:opacity-50 ml-auto"
                        >
                          <Trash2 className="h-3 w-3" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-[#55556a]">
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> {usersTotal} total users
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={usersPage <= 1}
                onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 disabled:opacity-40 cursor-pointer"
              >
                Prev
              </button>
              <span>Page {usersPage}</span>
              <button
                disabled={usersPage * 20 >= usersTotal}
                onClick={() => setUsersPage((p) => p + 1)}
                className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="tcard overflow-x-auto">
          {attempts.length === 0 ? (
            <p className="text-xs text-[#55556a] text-center py-8">No test attempts yet.</p>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[10px] uppercase tracking-wide text-[#55556a] border-b border-white/5">
                  <th className="text-left py-2 pr-3 font-semibold">User</th>
                  <th className="text-left py-2 pr-3 font-semibold">Score</th>
                  <th className="text-left py-2 pr-3 font-semibold">Result</th>
                  <th className="text-left py-2 pr-3 font-semibold">Strikes</th>
                  <th className="text-left py-2 pr-3 font-semibold">Time</th>
                  <th className="text-left py-2 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((a) => (
                  <tr key={a.id} className="border-b border-white/5 last:border-0">
                    <td className="py-2.5 pr-3">
                      <p className="font-semibold">{a.name}</p>
                      <p className="text-[#55556a]">{a.email}</p>
                    </td>
                    <td className="py-2.5 pr-3 text-[#9090b0]">
                      {a.score}/{a.total}
                    </td>
                    <td className="py-2.5 pr-3">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          a.passed ? "bg-[#10b981]/15 text-[#6ee7b7]" : "bg-[#ef4444]/15 text-[#fca5a5]"
                        }`}
                      >
                        {a.passed ? "PASSED" : "FAILED"}
                      </span>
                      {!!a.suspicious && (
                        <span className="ml-1.5 text-[10px] font-black px-2 py-0.5 rounded-full bg-[#f59e0b]/15 text-[#fcd34d] inline-flex items-center gap-1">
                          <ShieldAlert className="h-2.5 w-2.5" /> SUSPICIOUS
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 pr-3 text-[#9090b0]">{a.tab_switches}</td>
                    <td className="py-2.5 pr-3 text-[#9090b0]">{a.time_taken}s</td>
                    <td className="py-2.5 text-[#55556a]">{fmtDate(a.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
