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
    <div className="rounded-3xl bg-white border border-[#e4e7ec] shadow-sm p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2 text-[15px] font-semibold text-[#0f172a]">
          <Activity className="w-4 h-4 text-[#6d28d9]" />
          <span>Live Portfolio Status</span>
          <span className="text-[13px] font-normal text-[#475467]">({upCount}/{ventures.length} operational)</span>
        </div>
        <button
          onClick={runCheck}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#344054] px-3 py-1.5 rounded-lg bg-white border border-[#d0d5dd] hover:bg-[#f9fafb] transition-colors"
        >
          <RefreshCw className="w-3 h-3" /> Re-check
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ventures.map((v) => {
          const s = status[v.id]?.status ?? "checking";
          return (
            <div key={v.id} className="p-3 rounded-xl bg-[#f9fafb] border border-[#e4e7ec] flex items-center gap-2.5">
              {s === "checking" && <Loader2 className="w-3.5 h-3.5 text-[#667085] animate-spin shrink-0" />}
              {s === "up" && <CheckCircle2 className="w-3.5 h-3.5 text-[#6d28d9] shrink-0" />}
              {s === "down" && <XCircle className="w-3.5 h-3.5 text-[#b42318] shrink-0" />}
              <div className="min-w-0">
                <div className="text-sm font-medium text-[#344054] truncate">{v.name}</div>
                <div className="text-[13px] text-[#475467]">
                  {s === "checking" ? "checking…" : s === "up" ? `${status[v.id]?.ms ?? "—"}ms` : "unreachable"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {checkedAt && <div className="text-[13px] text-[#475467] mt-4 text-right">Last checked {checkedAt}</div>}
    </div>
  );
}
