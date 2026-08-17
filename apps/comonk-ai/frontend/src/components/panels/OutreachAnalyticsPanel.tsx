"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  TrendingUp,
  RefreshCw,
  Loader2,
  AlertCircle,
  Flame,
  Clock,
  Star,
  Percent,
} from "lucide-react";
import { authApi } from "@/lib/api";

interface Funnel {
  total?: number;
  saved?: number;
  applied?: number;
  replied?: number;
  interview?: number;
  offer?: number;
  rejected?: number;
  [key: string]: unknown;
}

interface WeeklyPoint {
  day?: string;
  count?: number;
  [key: string]: unknown;
}

interface CategoryPoint {
  category?: string;
  count?: number;
  [key: string]: unknown;
}

interface Analytics {
  funnel?: Funnel;
  weekly_chart?: WeeklyPoint[];
  top_categories?: CategoryPoint[];
  streak_days?: number;
  avg_response_days?: number | null;
  avg_fit_score?: number | null;
  conversion_rate?: number;
  [key: string]: unknown;
}

const KNOWN_KEYS = new Set([
  "funnel",
  "weekly_chart",
  "top_categories",
  "streak_days",
  "avg_response_days",
  "avg_fit_score",
  "conversion_rate",
]);

function prettifyKey(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const TOOLTIP_STYLE = {
  background: "var(--bg-3)",
  border: "1px solid var(--border-hi)",
  borderRadius: 10,
  fontSize: 12,
  color: "var(--text)",
};

export function OutreachAnalyticsPanel() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await authApi("GET", "/api/analytics/outreach");
      setData(res as Analytics);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load outreach analytics");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const funnel = data?.funnel || {};
  const funnelKpis = [
    { label: "Total", value: funnel.total },
    { label: "Saved", value: funnel.saved },
    { label: "Applied", value: funnel.applied },
    { label: "Replied", value: funnel.replied },
    { label: "Interview", value: funnel.interview },
    { label: "Offer", value: funnel.offer },
    { label: "Rejected", value: funnel.rejected },
  ];

  const perfKpis = [
    { label: "Streak", value: data?.streak_days, suffix: "d", icon: Flame },
    { label: "Avg Response", value: data?.avg_response_days, suffix: "d", icon: Clock },
    { label: "Avg Fit Score", value: data?.avg_fit_score, suffix: "", icon: Star },
    { label: "Conversion Rate", value: data?.conversion_rate, suffix: "%", icon: Percent },
  ];

  const extraEntries = data
    ? Object.entries(data).filter(([k, v]) => !KNOWN_KEYS.has(k) && v !== null && v !== undefined)
    : [];

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="tcard flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="h-11 w-11 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}
          >
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold flex items-center gap-2">
              Outreach Analytics
              <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-[#10b981]/15 text-[#6ee7b7]">
                NEW
              </span>
            </p>
            <p className="text-xs text-[#55556a]">How your applications are converting</p>
          </div>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="tcard flex items-center gap-2 border-[var(--red)]/30 text-sm text-[var(--red-l)]">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {loading && !data && (
        <div className="tcard flex items-center justify-center py-16 text-[#55556a] text-sm">
          <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading analytics...
        </div>
      )}

      {data && (
        <>
          {/* Funnel KPI row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {funnelKpis.map((k) => (
              <div key={k.label} className="tcard !p-3.5 text-center">
                <p className="text-xl font-black">{typeof k.value === "number" ? k.value : "—"}</p>
                <p className="text-[10px] text-[#55556a] mt-0.5">{k.label}</p>
              </div>
            ))}
          </div>

          {/* Performance KPI row */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {perfKpis.map((k) => (
              <div key={k.label} className="tcard">
                <k.icon className="h-5 w-5 text-[#a78bfa] mb-2" />
                <p className="text-2xl font-black">
                  {typeof k.value === "number" ? `${k.value}${k.suffix}` : "—"}
                </p>
                <p className="text-xs text-[#55556a] mt-0.5">{k.label}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="tcard">
              <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] mb-4">
                Weekly Activity
              </p>
              {data.weekly_chart && data.weekly_chart.length > 0 ? (
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.weekly_chart} barCategoryGap={10}>
                      <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />
                      <XAxis
                        dataKey="day"
                        tick={{ fill: "#9090b0", fontSize: 11 }}
                        axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                        tickLine={false}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fill: "#9090b0", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        width={28}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(255,255,255,0.04)" }}
                        contentStyle={TOOLTIP_STYLE}
                        labelStyle={{ color: "#9090b0" }}
                      />
                      <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-xs text-[#55556a] py-10 text-center">No activity in the last 7 days.</p>
              )}
            </div>

            <div className="tcard">
              <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] mb-4">
                Top Company Categories
              </p>
              {data.top_categories && data.top_categories.length > 0 ? (
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.top_categories}
                      layout="vertical"
                      margin={{ left: 8, right: 16 }}
                      barCategoryGap={10}
                    >
                      <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.08)" />
                      <XAxis
                        type="number"
                        allowDecimals={false}
                        tick={{ fill: "#9090b0", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="category"
                        tick={{ fill: "#9090b0", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        width={110}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(255,255,255,0.04)" }}
                        contentStyle={TOOLTIP_STYLE}
                        labelStyle={{ color: "#9090b0" }}
                      />
                      <Bar dataKey="count" fill="var(--secondary)" radius={[0, 4, 4, 0]} maxBarSize={18}>
                        {data.top_categories.map((_, i) => (
                          <Cell key={i} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-xs text-[#55556a] py-10 text-center">No categorized applications yet.</p>
              )}
            </div>
          </div>

          {/* Generic fallback for any additional fields */}
          {extraEntries.length > 0 && (
            <div className="tcard">
              <p className="text-xs font-bold uppercase tracking-wide text-[#55556a] mb-3">More</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {extraEntries.map(([k, v]) => (
                  <div key={k} className="px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#55556a] mb-1">
                      {prettifyKey(k)}
                    </p>
                    <p className="text-sm text-[#eeeef8] break-words">
                      {typeof v === "string" || typeof v === "number" ? String(v) : JSON.stringify(v)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
