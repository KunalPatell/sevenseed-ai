"use client";

import React from "react";
import { Menu, Search, Bell, Sun, Moon, LogIn, Cpu } from "lucide-react";
import type { ComonkUser } from "@/lib/auth";

export function Topbar({
  onOpenSidebar,
  onOpenSearch,
  theme,
  onToggleTheme,
  user,
  onLogin,
  llmProvider,
  panelTitle,
}: {
  onOpenSidebar: () => void;
  onOpenSearch: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  user: ComonkUser | null;
  onLogin: () => void;
  llmProvider: string;
  panelTitle: string;
}) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-[#060609]/90 backdrop-blur-md border-b border-white/5 flex items-center gap-3 px-4 md:px-6">
      <button
        onClick={onOpenSidebar}
        className="md:hidden h-9 w-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer"
      >
        <Menu className="h-4.5 w-4.5" />
      </button>

      <h1 className="text-sm font-black hidden sm:block">{panelTitle}</h1>

      <button
        onClick={onOpenSearch}
        className="ml-2 flex-1 max-w-xs hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-[#55556a] cursor-pointer hover:border-white/20 transition-colors"
      >
        <Search className="h-3.5 w-3.5" />
        Search tools…
        <kbd className="ml-auto font-mono text-[10px] bg-white/10 px-1.5 py-0.5 rounded">⌘K</kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <span className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono font-semibold text-[#a78bfa] bg-[#7c3aed]/10 border border-[#7c3aed]/25 px-2.5 py-1 rounded-full">
          <Cpu className="h-3 w-3" />
          {llmProvider}
        </span>

        <button
          onClick={onToggleTheme}
          className="h-9 w-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:border-white/20 transition-colors"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <button className="relative h-9 w-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:border-white/20 transition-colors">
          <Bell className="h-4 w-4" />
        </button>

        {user ? (
          <div
            className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-black text-white cursor-pointer"
            style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}
            title={user.name}
          >
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>
        ) : (
          <button
            onClick={onLogin}
            className="flex items-center gap-1.5 text-xs font-bold text-white px-3.5 py-2 rounded-lg cursor-pointer border-none"
            style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
          >
            <LogIn className="h-3.5 w-3.5" /> Login
          </button>
        )}
      </div>
    </header>
  );
}
