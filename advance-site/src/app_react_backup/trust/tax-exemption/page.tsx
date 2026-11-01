import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TaxExemption10BE } from "@main/ui-core";

export default function TaxExemptionPage() {
  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto mb-6">
        <Link href="/trust" className="inline-flex items-center gap-2 text-xs font-bold text-pink-400 hover:text-pink-300 transition">
          <ArrowLeft className="w-4 h-4" /> Back to AVP Trust
        </Link>
      </div>
      <TaxExemption10BE />
    </main>
  );
}
