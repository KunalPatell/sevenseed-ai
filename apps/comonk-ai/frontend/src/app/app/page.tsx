"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { AuthModal } from "@/components/AuthModal";
import { Auth, type ComonkUser } from "@/lib/auth";
import { NAV_GROUPS, ADMIN_EMAILS, type PanelId } from "@/lib/panels";

import { OverviewPanel } from "@/components/panels/OverviewPanel";
import { DailyBriefingPanel } from "@/components/panels/DailyBriefingPanel";
import { CounselorPanel } from "@/components/panels/CounselorPanel";
import { JobTargetsPanel } from "@/components/panels/JobTargetsPanel";
import { LiveJobsPanel } from "@/components/panels/LiveJobsPanel";
import { AppTrackerPanel } from "@/components/panels/AppTrackerPanel";
import { AutopilotPanel } from "@/components/panels/AutopilotPanel";
import { OutreachAnalyticsPanel } from "@/components/panels/OutreachAnalyticsPanel";
import { MockInterviewPanel } from "@/components/panels/MockInterviewPanel";
import { ResumeStudioPanel } from "@/components/panels/ResumeStudioPanel";
import { CalendarPanel } from "@/components/panels/CalendarPanel";
import { InterviewQaPanel } from "@/components/panels/InterviewQaPanel";
import { AtsOptimizerPanel } from "@/components/panels/AtsOptimizerPanel";
import { LinkedinPanel } from "@/components/panels/LinkedinPanel";
import { LearningHubPanel } from "@/components/panels/LearningHubPanel";
import { RoadmapPanel } from "@/components/panels/RoadmapPanel";
import { CheatsheetsPanel } from "@/components/panels/CheatsheetsPanel";
import { ResourcesHubPanel } from "@/components/panels/ResourcesHubPanel";
import { SalaryPanel } from "@/components/panels/SalaryPanel";
import { GithubAnalyzerPanel } from "@/components/panels/GithubAnalyzerPanel";
import { EmailScorerPanel } from "@/components/panels/EmailScorerPanel";
import { OffersPanel } from "@/components/panels/OffersPanel";
import { AptitudePanel } from "@/components/panels/AptitudePanel";
import { AdminPanel } from "@/components/panels/AdminPanel";
import { ApiKeysPanel } from "@/components/panels/ApiKeysPanel";
import { TrendingReposPanel } from "@/components/panels/TrendingReposPanel";
import { StackOverflowPanel } from "@/components/panels/StackOverflowPanel";
import { CodingStatsPanel } from "@/components/panels/CodingStatsPanel";
import { FlashcardsPanel } from "@/components/panels/FlashcardsPanel";
import { NetworkPanel } from "@/components/panels/NetworkPanel";
import { HeatmapPanel } from "@/components/panels/HeatmapPanel";
import { FocusTimerPanel } from "@/components/panels/FocusTimerPanel";
import { JobAlertsPanel } from "@/components/panels/JobAlertsPanel";

const LABELS: Record<PanelId, string> = Object.fromEntries(
  NAV_GROUPS.flatMap((g) => g.items.map((i) => [i.id, i.label]))
) as Record<PanelId, string>;

export default function AppShell() {
  const [activePanel, setActivePanel] = useState<PanelId>("overview");
  const [user, setUser] = useState<ComonkUser | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(Auth.user());
    const savedTheme = localStorage.getItem("comonk_theme");
    if (savedTheme === "light") setTheme("light");
    setReady(true);
  }, []);

  const navigate = useCallback((id: PanelId) => {
    setActivePanel(id);
    setMobileSidebarOpen(false);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("comonk_theme", next);
  }

  function handleAuthSuccess() {
    setUser(Auth.user());
    setAuthOpen(false);
  }

  const isAdmin = !!user && ADMIN_EMAILS.includes(user.email);

  if (!ready) return null;

  return (
    <div className="min-h-screen flex" data-theme={theme}>
      <Sidebar
        active={activePanel}
        onSelect={navigate}
        isAdmin={isAdmin}
        jobTargetsCount={0}
        trackerCount={0}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        user={user}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar
          onOpenSidebar={() => setMobileSidebarOpen(true)}
          onOpenSearch={() => {}}
          theme={theme}
          onToggleTheme={toggleTheme}
          user={user}
          onLogin={() => setAuthOpen(true)}
          llmProvider="Groq"
          panelTitle={LABELS[activePanel] ?? "Dashboard"}
        />

        <main className="flex-1 p-4 md:p-8 max-w-[1180px] w-full mx-auto">
          {activePanel === "overview" && <OverviewPanel user={user} onNavigate={navigate} />}
          {activePanel === "briefing" && <DailyBriefingPanel />}
          {activePanel === "counselor" && <CounselorPanel />}
          {activePanel === "targets" && <JobTargetsPanel />}
          {activePanel === "jobs" && <LiveJobsPanel />}
          {activePanel === "tracker" && <AppTrackerPanel />}
          {activePanel === "autopilot" && <AutopilotPanel />}
          {activePanel === "outreach" && <OutreachAnalyticsPanel />}
          {activePanel === "interview" && <MockInterviewPanel />}
          {activePanel === "resume-studio" && <ResumeStudioPanel />}
          {activePanel === "calendar" && <CalendarPanel />}
          {activePanel === "interview-qa" && <InterviewQaPanel />}
          {activePanel === "ats" && <AtsOptimizerPanel />}
          {activePanel === "linkedin" && <LinkedinPanel />}
          {activePanel === "learning" && <LearningHubPanel />}
          {activePanel === "roadmap" && <RoadmapPanel />}
          {activePanel === "cheatsheets" && <CheatsheetsPanel />}
          {activePanel === "resources" && <ResourcesHubPanel />}
          {activePanel === "salary" && <SalaryPanel />}
          {activePanel === "github" && <GithubAnalyzerPanel />}
          {activePanel === "email-scorer" && <EmailScorerPanel />}
          {activePanel === "offers" && <OffersPanel />}
          {activePanel === "aptitude" && <AptitudePanel />}
          {activePanel === "admin" && <AdminPanel />}
          {activePanel === "apikeys" && <ApiKeysPanel />}
          {activePanel === "trending-repos" && <TrendingReposPanel />}
          {activePanel === "stackoverflow" && <StackOverflowPanel />}
          {activePanel === "coding-stats" && <CodingStatsPanel />}
          {activePanel === "flashcards" && <FlashcardsPanel />}
          {activePanel === "network" && <NetworkPanel />}
          {activePanel === "heatmap" && <HeatmapPanel />}
          {activePanel === "focus-timer" && <FocusTimerPanel />}
          {activePanel === "job-alerts" && <JobAlertsPanel onNavigate={navigate} />}
        </main>
      </div>

      {authOpen && (
        <AuthModal initialTab="login" onClose={() => setAuthOpen(false)} onSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}
