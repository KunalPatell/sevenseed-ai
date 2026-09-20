"use client";

import { useEffect } from "react";

export function GlowEffectInitializer() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest(".glass-card") as HTMLElement;
      if (card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      }
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return null;
}
