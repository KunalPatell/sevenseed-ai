"use client";
import React from "react";
import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0e0a0d] border-t border-[#ef4444]/15 py-12 px-6 md:px-12 text-[#7e6f73] text-xs">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg grid place-items-center text-white bg-gradient-to-br from-[#ef4444] to-[#dc2626]">
            <Shield className="h-4 w-4" />
          </span>
          <span className="font-bold text-white text-sm">
            Rakshak <span className="text-[#fca5a5]">AI</span>
          </span>
        </div>

        <p>© 2026 Sevenseed Group · Rakshak AI Sentinel Suite. All Rights Reserved.</p>

        <div className="flex items-center gap-4 text-xs font-mono">
          <a href="/rakshak-ai/app/" className="hover:text-white transition-colors">Workstation Suite</a>
          <a href="https://sevenseed.onrender.com/" className="hover:text-white transition-colors">Sevenseed Hub</a>
        </div>
      </div>
    </footer>
  );
}
