import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CompanyCultureReviews } from "@main/ui-core";

export default function CompanyReviewsPage() {
  return (
    <main className="min-h-screen bg-[#090314] py-10 px-4">
      <div className="max-w-3xl mx-auto mb-6">
        <Link href="/comonk" className="inline-flex items-center gap-2 text-xs font-bold text-fuchsia-400 hover:text-fuchsia-300 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Comonk
        </Link>
      </div>
      <CompanyCultureReviews />
    </main>
  );
}
