"use client";

import { useEffect, useState } from "react";
import { Cpu } from "lucide-react";

export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    // Check if user has already seen preloader in this session
    const seen = sessionStorage.getItem("seen-preloader");
    if (seen) {
      setRemoved(true);
      return;
    }

    const start = Date.now();
    const duration = 1600; // 1.6 seconds loading simulation

    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(timer);
        sessionStorage.setItem("seen-preloader", "true");
        // Trigger fade out
        setTimeout(() => setHidden(true), 200);
        // Remove from DOM
        setTimeout(() => setRemoved(true), 1200);
      }
    }, 16);

    return () => clearInterval(timer);
  }, []);

  const quotes = [
    "Reticulating AI splines...",
    "Java developers never RIP. They just get Garbage Collected.",
    "Web developers do it with <style>.",
    "Unix is user-friendly. It's just selective about who its friends are.",
    "Compiling neural weights & RAG embeddings...",
  ];

  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    setQuoteIndex(Math.floor(Math.random() * quotes.length));
  }, []);

  if (removed) return null;

  return (
    <div className={`preloader ${hidden ? "preloader-hide" : ""}`}>
      <div className="preloader-glow-1" />
      <div className="preloader-glow-2" />

      <div className="preloader-content">
        <div className="preloader-logo-wrapper">
          <div className="preloader-icon-container">
            <Cpu className="preloader-icon" />
            <div className="preloader-icon-ring" />
          </div>
          <h1 className="font-display preloader-name">Kunal Patel</h1>
          <p className="mt-2 font-mono text-xs text-[#9ed8ff]/70 tracking-widest animate-pulse">
            "{quotes[quoteIndex]}"
          </p>
        </div>

        <div className="preloader-progress-wrapper">
          <div className="preloader-bar-container">
            <div
              className="preloader-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="font-mono preloader-text">
            INITIALIZING SYSTEM... {progress}%
          </div>
        </div>
      </div>
    </div>
  );
}
