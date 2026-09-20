import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { QuickCommerceOptimizer } from "@main/ui-core";

export default function QCommercePage() {
  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto mb-6">
        <Link href="/avp-emart" className="inline-flex items-center gap-2 text-xs font-bold text-purple-400 hover:text-purple-300 transition">
          <ArrowLeft className="w-4 h-4" /> Back to AVP E-Mart
        </Link>
      </div>
      <QuickCommerceOptimizer />
    </main>
  );
}
