"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export function ComingSoonPanel({ label }: { label: string }) {
  return (
    <div className="tcard flex flex-col items-center justify-center py-20 text-center">
      <Loader2 className="h-6 w-6 text-[#55556a] mb-3" />
      <p className="font-bold text-[#9090b0]">{label}</p>
      <p className="text-xs text-[#55556a] mt-1">This panel is being rebuilt — check back shortly.</p>
    </div>
  );
}
