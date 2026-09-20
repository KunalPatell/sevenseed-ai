import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SmartDealScanner } from "@main/ui-core";

export default function DealScannerPage() {
  return (
    <main className="min-h-screen bg-[#022c22] py-10 px-4">
      <div className="max-w-4xl mx-auto mb-6">
        <Link href="/avp-emart" className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition">
          <ArrowLeft className="w-4 h-4" /> Back to AVP E-Mart
        </Link>
      </div>
      <SmartDealScanner />
    </main>
  );
}
