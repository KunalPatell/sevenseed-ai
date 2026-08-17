"use client";

import React from "react";
import {
  LayoutDashboard, Sunrise, Bot, Target, Briefcase, Kanban, Rocket, TrendingUp,
  Mic, FileText, Calendar, MessagesSquare, ScanSearch, Share2, GraduationCap,
  Map, BookOpen, Library, IndianRupee, GitBranch, Mail, Scale, ShieldCheck, Lock,
  KeyRound, Flame, HelpCircle, BarChart3, Layers, Contact, Grid3x3, Timer,
  BellRing, X, ArrowLeft, type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { NAV_GROUPS, type PanelId } from "@/lib/panels";
import type { ComonkUser } from "@/lib/auth";

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard, Sunrise, Bot, Target, Briefcase, Kanban, Rocket, TrendingUp,
  Mic, FileText, Calendar, MessagesSquare, ScanSearch, Share2, GraduationCap,
  Map, BookOpen, Library, IndianRupee, GitBranch, Mail, Scale, ShieldCheck, Lock,
  KeyRound, Flame, HelpCircle, BarChart3, Layers, Contact, Grid3x3, Timer,
  BellRing,
};

export function Sidebar({
  active,
  onSelect,
  isAdmin,
  jobTargetsCount,
  trackerCount,
  mobileOpen,
  onCloseMobile,
  user,
}: {
  active: PanelId;
  onSelect: (id: PanelId) => void;
  isAdmin: boolean;
  jobTargetsCount: number;
  trackerCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  user: ComonkUser | null;
}) {
  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={onCloseMobile} />
      )}
      <aside
        className={`fixed md:sticky top-0 h-screen w-[240px] bg-[#0d0d16] border-r border-white/5 flex flex-col z-50 transition-transform ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/5 shrink-0">
          <span className="font-black grad">Comonk AI</span>
          <button onClick={onCloseMobile} className="md:hidden text-[#55556a] hover:text-white cursor-pointer bg-transparent border-none">
            <X className="h-5 w-5" />
          </button>
        </div>

        {user && (
          <div className="px-5 py-4 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div
                className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0"
                style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}
              >
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold truncate">{user.name}</p>
                <p className="text-[11px] text-[#55556a] truncate">{user.target_role || "Job Seeker"}</p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mb-5">
              <p className="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#55556a]">
                {group.label}
              </p>
              <div className="flex flex-col gap-0.5">
                {group.items
                  .filter((item) => !item.adminOnly || isAdmin)
                  .map((item) => {
                    const Icon = ICONS[item.icon] ?? LayoutDashboard;
                    const isActive = active === item.id;
                    const count = item.id === "targets" ? jobTargetsCount : item.id === "tracker" ? trackerCount : 0;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onSelect(item.id)}
                        className={`nav-item flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-[13px] font-semibold cursor-pointer border-none transition-all ${
                          isActive
                            ? "bg-[#7c3aed]/15 text-[#a78bfa]"
                            : "text-[#9090b0] hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="flex-1 truncate">{item.label}</span>
                        {count > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/10 text-[#9090b0]">
                            {count}
                          </span>
                        )}
                        {item.badge && (
                          <span
                            className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                              item.badge === "FLAGSHIP"
                                ? "bg-[#f59e0b]/15 text-[#fcd34d]"
                                : "bg-[#10b981]/15 text-[#6ee7b7]"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/5 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-[#55556a] hover:text-white px-2.5 py-1.5 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to landing page
          </Link>
        </div>
      </aside>
    </>
  );
}
