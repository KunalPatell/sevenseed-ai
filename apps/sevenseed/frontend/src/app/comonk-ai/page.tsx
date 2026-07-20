"use client";

import { useEffect } from "react";

export default function ComonkPage() {
  useEffect(() => {
    if (typeof window !== "undefined" && !window.location.pathname.endsWith("/")) {
      window.location.replace("/comonk-ai/");
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#060609] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-10 h-10 border-4 border-[#8b5cf6] border-t-transparent rounded-full animate-spin mb-4" />
      <h1 className="text-xl font-bold mb-2">Loading Comonk AI...</h1>
      <p className="text-sm text-[#9aa0b8]">Opening embedded Comonk Technology platform...</p>
    </div>
  );
}
