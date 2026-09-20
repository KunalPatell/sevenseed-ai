"use client";

import React, { useState } from "react";
import { Calculator, IndianRupee, Clock, TrendingUp } from "lucide-react";

export function AutomationROICalculator() {
  const [hoursPerWeek, setHoursPerWeek] = useState(15);
  const [hourlyCost, setHourlyCost] = useState(600);
  const [automationPct, setAutomationPct] = useState(70);

  const weeklyHoursSaved = (hoursPerWeek * automationPct) / 100;
  const monthlyCostSaved = weeklyHoursSaved * 4.33 * hourlyCost;
  const annualCostSaved = monthlyCostSaved * 12;

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl border border-amber-900/40 bg-amber-950/10 backdrop-blur-xl overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-amber-900/40 text-sm font-bold text-slate-100">
        <Calculator className="w-4 h-4 text-amber-400" />
        <span>Automation ROI Calculator</span>
      </div>

      <div className="p-6 space-y-5">
        <div>
          <div className="flex justify-between text-xs text-slate-300 mb-1.5">
            <span>Manual hours spent per week on this task</span>
            <span className="font-mono text-amber-400">{hoursPerWeek}h</span>
          </div>
          <input type="range" min={1} max={60} value={hoursPerWeek} onChange={(e) => setHoursPerWeek(Number(e.target.value))} className="w-full accent-amber-500" />
        </div>

        <div>
          <div className="flex justify-between text-xs text-slate-300 mb-1.5">
            <span>Fully-loaded hourly cost of the person doing it</span>
            <span className="font-mono text-amber-400">₹{hourlyCost}/hr</span>
          </div>
          <input type="range" min={100} max={3000} step={50} value={hourlyCost} onChange={(e) => setHourlyCost(Number(e.target.value))} className="w-full accent-amber-500" />
        </div>

        <div>
          <div className="flex justify-between text-xs text-slate-300 mb-1.5">
            <span>% of this task an AI agent can take over</span>
            <span className="font-mono text-amber-400">{automationPct}%</span>
          </div>
          <input type="range" min={10} max={100} step={5} value={automationPct} onChange={(e) => setAutomationPct(Number(e.target.value))} className="w-full accent-amber-500" />
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-xl bg-[#1a1004] border border-amber-900/50 text-center">
            <Clock className="w-4 h-4 text-amber-400 mx-auto mb-1.5" />
            <div className="text-lg font-bold text-white">{weeklyHoursSaved.toFixed(1)}h</div>
            <div className="text-[10px] font-mono text-slate-500 uppercase">saved / week</div>
          </div>
          <div className="p-4 rounded-xl bg-[#1a1004] border border-amber-900/50 text-center">
            <IndianRupee className="w-4 h-4 text-amber-400 mx-auto mb-1.5" />
            <div className="text-lg font-bold text-white">₹{Math.round(monthlyCostSaved).toLocaleString("en-IN")}</div>
            <div className="text-[10px] font-mono text-slate-500 uppercase">saved / month</div>
          </div>
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-center">
            <TrendingUp className="w-4 h-4 text-emerald-400 mx-auto mb-1.5" />
            <div className="text-lg font-bold text-emerald-400">₹{Math.round(annualCostSaved).toLocaleString("en-IN")}</div>
            <div className="text-[10px] font-mono text-slate-500 uppercase">saved / year</div>
          </div>
        </div>
      </div>
    </div>
  );
}
