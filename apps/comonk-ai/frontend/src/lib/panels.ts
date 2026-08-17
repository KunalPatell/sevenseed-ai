export type PanelId =
  // Workspace
  | "overview"
  | "briefing"
  | "counselor"
  | "targets"
  | "jobs"
  | "tracker"
  | "autopilot"
  | "outreach"
  // AI Tools
  | "interview"
  | "resume-studio"
  | "calendar"
  | "interview-qa"
  | "ats"
  | "linkedin"
  | "learning"
  | "roadmap"
  | "cheatsheets"
  | "resources"
  | "salary"
  | "github"
  | "email-scorer"
  | "offers"
  // Account
  | "aptitude"
  | "admin"
  | "apikeys"
  // Bonus Tools
  | "trending-repos"
  | "stackoverflow"
  | "coding-stats"
  | "flashcards"
  | "network"
  | "heatmap"
  | "focus-timer"
  | "job-alerts";

export interface NavItem {
  id: PanelId;
  label: string;
  icon: string; // lucide-react icon name, resolved in Sidebar.tsx
  badge?: "NEW" | "FLAGSHIP";
  adminOnly?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Workspace",
    items: [
      { id: "overview", label: "Overview", icon: "LayoutDashboard" },
      { id: "briefing", label: "Daily Briefing", icon: "Sunrise", badge: "NEW" },
      { id: "counselor", label: "AI Counselor", icon: "Bot" },
      { id: "targets", label: "Job Targets", icon: "Target" },
      { id: "jobs", label: "Live Jobs", icon: "Briefcase" },
      { id: "tracker", label: "App Tracker", icon: "Kanban" },
      { id: "autopilot", label: "Autopilot Agent", icon: "Rocket", badge: "FLAGSHIP" },
      { id: "outreach", label: "Outreach Analytics", icon: "TrendingUp", badge: "NEW" },
    ],
  },
  {
    label: "AI Tools",
    items: [
      { id: "interview", label: "AI Mock Interview", icon: "Mic" },
      { id: "resume-studio", label: "Resume Studio", icon: "FileText" },
      { id: "calendar", label: "Calendar", icon: "Calendar" },
      { id: "interview-qa", label: "Interview Q&A", icon: "MessagesSquare" },
      { id: "ats", label: "ATS Optimizer", icon: "ScanSearch" },
      { id: "linkedin", label: "LinkedIn Optimizer", icon: "Share2" },
      { id: "learning", label: "Learning Hub", icon: "GraduationCap" },
      { id: "roadmap", label: "Career Roadmap", icon: "Map" },
      { id: "cheatsheets", label: "Cheat Sheets", icon: "BookOpen" },
      { id: "resources", label: "Resources Hub", icon: "Library" },
      { id: "salary", label: "Salary Insights", icon: "IndianRupee" },
      { id: "github", label: "GitHub Analyzer", icon: "GitBranch" },
      { id: "email-scorer", label: "Cold Email Scorer", icon: "Mail" },
      { id: "offers", label: "Offer Comparator", icon: "Scale" },
    ],
  },
  {
    label: "Account",
    items: [
      { id: "aptitude", label: "Take Aptitude Test", icon: "ShieldCheck" },
      { id: "admin", label: "Admin", icon: "Lock", adminOnly: true },
      { id: "apikeys", label: "My API Keys", icon: "KeyRound" },
    ],
  },
  {
    label: "Bonus Tools",
    items: [
      { id: "trending-repos", label: "Trending Repos", icon: "Flame" },
      { id: "stackoverflow", label: "Stack Overflow", icon: "HelpCircle" },
      { id: "coding-stats", label: "Coding Stats", icon: "BarChart3" },
      { id: "flashcards", label: "Flashcards", icon: "Layers" },
      { id: "network", label: "Network Log", icon: "Contact" },
      { id: "heatmap", label: "Skill Heatmap", icon: "Grid3x3" },
      { id: "focus-timer", label: "Focus Timer", icon: "Timer" },
      { id: "job-alerts", label: "Job Alerts Setup", icon: "BellRing" },
    ],
  },
];

export const ADMIN_EMAILS = ["kunalpatel8702@gmail.com", "ai@capermint.com"];
