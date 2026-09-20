"use client";

import React, { useState } from "react";
import { LucideIcon } from "lucide-react";

export type DockItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export function FloatingDock({ items }: { items: DockItem[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="fixed bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-end gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 backdrop-blur-xl shadow-2xl shadow-black/40 max-w-[calc(100vw-1.5rem)] overflow-x-auto">
      {items.map((item, idx) => {
        const Icon = item.icon;
        const isHovered = hovered === idx;
        const isNeighbor = hovered !== null && Math.abs(hovered - idx) === 1;
        return (
          <a
            key={item.href}
            href={item.href}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
            className="group relative flex flex-col items-center"
            style={{
              transform: `translateY(${isHovered ? -8 : 0}px) scale(${isHovered ? 1.35 : isNeighbor ? 1.1 : 1})`,
              transition: "transform 150ms ease-out",
            }}
          >
            {isHovered && (
              <span className="absolute -top-8 whitespace-nowrap text-[10px] font-mono px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-200">
                {item.label}
              </span>
            )}
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-indigo-500/50 flex items-center justify-center text-slate-300 group-hover:text-indigo-400 transition-colors">
              <Icon className="w-4 h-4" />
            </div>
          </a>
        );
      })}
    </div>
  );
}
