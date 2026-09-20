import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CampaignDonationTracker } from "@main/ui-core";

export default function CampaignsPage() {
  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto mb-6">
        <Link href="/trust" className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition">
          <ArrowLeft className="w-4 h-4" /> Back to AVP Charitable Trust
        </Link>
      </div>
      <CampaignDonationTracker />
    </main>
  );
}
