"use client";

import React, { useEffect, useState } from "react";
import { RefreshCw, CheckCircle2, XCircle, Loader2, Activity } from "lucide-react";

type Venture = { id: string; name: string; href: string };
type Status = "checking" | "up" | "down";

export function PortfolioHealthMonitor({ ventures }: { ventures: Venture[] }) {
  const [status, setStatus] = useState<Record<string, { status: Status; ms: number | null }>>({});
  const [checkedAt, setCheckedAt] = useState<string | null>(null);

  const runCheck = async () => {
    const next: Record<string, { status: Status; ms: number | null }> = {};
    ventures.forEach((v) => (next[v.id] = { status: "checking", ms: null }));
    setStatus({ ...next });

    await Promise.all(
      ventures.map(async (v) => {
        const started = performance.now();
        try {
          const res = await fetch(v.href, { method: "GET", cache: "no-store" });
          next[v.id] = { status: res.ok ? "up" : "down", ms: Math.round(performance.now() - started) };
        } catch {
          next[v.id] = { status: "down", ms: null };
        }
        setStatus((prev) => ({ ...prev, [v.id]: next[v.id] }));
      })
    );
    setCheckedAt(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    runCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const upCount = Object.values(status).filter((s) => s.status === "up").length;

  return (
    <div className="rounded-2xl bg-slate-950/80 border border-slate-800/90 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Live Portfolio Status</span>
          <span className="text-xs font-mono text-slate-500">({upCount}/{ventures.length} operational)</span>
        </div>
        <button
          onClick={runCheck}
          className="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
        >
          <RefreshCw className="w-3 h-3" /> Re-check
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ventures.map((v) => {
          const s = status[v.id]?.status ?? "checking";
          return (
            <div key={v.id} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center gap-2.5">
              {s === "checking" && <Loader2 className="w-3.5 h-3.5 text-slate-500 animate-spin shrink-0" />}
              {s === "up" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
              {s === "down" && <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
              <div className="min-w-0">
                <div className="text-xs font-medium text-slate-200 truncate">{v.name}</div>
                <div className="text-[10px] font-mono text-slate-500">
                  {s === "checking" ? "checking…" : s === "up" ? `${status[v.id]?.ms ?? "—"}ms` : "unreachable"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {checkedAt && <div className="text-[10px] font-mono text-slate-600 mt-4 text-right">Last checked {checkedAt}</div>}
    </div>
  );
}
