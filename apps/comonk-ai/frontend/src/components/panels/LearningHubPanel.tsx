"use client";

import React, { useCallback, useState } from "react";
import { motion } from "framer-motion";
import {
  Library,
  Video,
  Newspaper,
  BookOpen,
  Map,
  GitBranch,
  Rocket,
  ListChecks,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Star,
  GitFork,
  LogIn,
  Clock,
} from "lucide-react";
import { api, authApi } from "@/lib/api";
import { Auth } from "@/lib/auth";

type Tab = "resources" | "youtube" | "news" | "cheatsheets" | "roadmaps" | "github" | "producthunt" | "planner";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "resources", label: "Resources", icon: Library },
  { id: "youtube", label: "YouTube", icon: Video },
  { id: "news", label: "Tech News", icon: Newspaper },
  { id: "cheatsheets", label: "Cheat Sheets", icon: BookOpen },
  { id: "roadmaps", label: "Roadmaps", icon: Map },
  { id: "github", label: "GitHub Trending", icon: GitBranch },
  { id: "producthunt", label: "Product Hunt", icon: Rocket },
  { id: "planner", label: "Study Planner", icon: ListChecks },
];

interface ResourceItem {
  title?: string;
  url?: string;
  source?: string;
  tags?: string[];
  reading_time?: number;
  cover?: string | null;
}
interface YoutubeItem {
  title?: string;
  channel?: string;
  description?: string;
  thumbnail?: string;
  url?: string;
  published?: string;
}
interface NewsItem {
  title?: string;
  url?: string;
  source?: string;
  description?: string;
  image?: string | null;
  published?: string;
}
interface CheatsheetItem {
  name?: string;
  author?: string;
  url?: string;
  description?: string;
  source?: string;
}
interface RoadmapItem {
  slug?: string;
  title?: string;
  icon?: string;
  url?: string;
  pdf_url?: string;
  img_url?: string;
}
interface RepoItem {
  name?: string;
  description?: string;
  stars?: number;
  forks?: number;
  language?: string;
  url?: string;
  topics?: string[];
}
interface ProductItem {
  name?: string;
  url?: string;
  description?: string;
}
interface PlannerTask {
  id: number;
  skill?: string;
  resource_url?: string;
  status?: string;
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="tcard flex flex-col gap-2">{children}</div>;
}

function EmptyState({ text }: { text: string }) {
  return <p className="text-sm text-[#55556a] py-8 text-center col-span-full">{text}</p>;
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="tcard flex items-center gap-2 border-[var(--red)]/30 text-sm text-[var(--red-l)]">
      <AlertCircle className="h-4 w-4 shrink-0" />
      {message}
    </div>
  );
}

function TabHeader({
  title,
  onRefresh,
  loading,
}: {
  title: string;
  onRefresh: () => void;
  loading: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-xs font-bold uppercase tracking-wide text-[#55556a]">{title}</p>
      <button
        onClick={onRefresh}
        disabled={loading}
        className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors disabled:opacity-50"
      >
        <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} /> Refresh
      </button>
    </div>
  );
}

export function LearningHubPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("resources");
  const [loaded, setLoaded] = useState<Partial<Record<Tab, boolean>>>({});
  const [loading, setLoading] = useState<Partial<Record<Tab, boolean>>>({});
  const [errors, setErrors] = useState<Partial<Record<Tab, string>>>({});

  const [skillsInput, setSkillsInput] = useState("python, react");
  const skills = skillsInput
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const firstSkill = skills[0] || "python";

  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [videos, setVideos] = useState<YoutubeItem[]>([]);
  const [youtubeMsg, setYoutubeMsg] = useState<{ message?: string; fallback_url?: string } | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [cheatsheets, setCheatsheets] = useState<CheatsheetItem[]>([]);
  const [roadmaps, setRoadmaps] = useState<RoadmapItem[]>([]);
  const [roadmapRole, setRoadmapRole] = useState("");
  const [repos, setRepos] = useState<RepoItem[]>([]);
  const [language, setLanguage] = useState("python");
  const [period, setPeriod] = useState("weekly");
  const [products, setProducts] = useState<ProductItem[]>([]);

  const [tasks, setTasks] = useState<PlannerTask[]>([]);
  const [progress, setProgress] = useState<{ todo: number; doing: number; done: number; percentage: number } | null>(null);
  const [taskUpdating, setTaskUpdating] = useState<number | null>(null);

  function setBusy(tab: Tab, v: boolean) {
    setLoading((p) => ({ ...p, [tab]: v }));
  }
  function setErr(tab: Tab, v: string) {
    setErrors((p) => ({ ...p, [tab]: v }));
  }

  const loadResources = useCallback(async () => {
    setBusy("resources", true);
    setErr("resources", "");
    try {
      const res = await api("GET", `/api/learning-resources?skills=${encodeURIComponent(skills.join(","))}&limit=15`);
      setResources(res?.resources || []);
    } catch (err) {
      setErr("resources", err instanceof Error ? err.message : "Failed to load resources.");
    } finally {
      setBusy("resources", false);
      setLoaded((p) => ({ ...p, resources: true }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skillsInput]);

  const loadYoutube = useCallback(async () => {
    setBusy("youtube", true);
    setErr("youtube", "");
    try {
      const q = `${firstSkill} tutorial`;
      const res = await api("GET", `/api/youtube-tutorials?query=${encodeURIComponent(q)}&max_results=8`);
      setVideos(res?.videos || []);
      setYoutubeMsg(res?.videos?.length ? null : { message: res?.message, fallback_url: res?.fallback_url });
    } catch (err) {
      setErr("youtube", err instanceof Error ? err.message : "Failed to load videos.");
    } finally {
      setBusy("youtube", false);
      setLoaded((p) => ({ ...p, youtube: true }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skillsInput]);

  const loadNews = useCallback(async () => {
    setBusy("news", true);
    setErr("news", "");
    try {
      const res = await api("GET", `/api/tech-news?skills=${encodeURIComponent(skills.join(","))}&limit=10`);
      setNews(res?.articles || []);
    } catch (err) {
      setErr("news", err instanceof Error ? err.message : "Failed to load news.");
    } finally {
      setBusy("news", false);
      setLoaded((p) => ({ ...p, news: true }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skillsInput]);

  const loadCheatsheets = useCallback(async () => {
    setBusy("cheatsheets", true);
    setErr("cheatsheets", "");
    try {
      const res = await api("GET", `/api/cheatsheets?skill=${encodeURIComponent(firstSkill)}&limit=12`);
      setCheatsheets(res?.cheatsheets || []);
    } catch (err) {
      setErr("cheatsheets", err instanceof Error ? err.message : "Failed to load cheat sheets.");
    } finally {
      setBusy("cheatsheets", false);
      setLoaded((p) => ({ ...p, cheatsheets: true }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skillsInput]);

  const loadRoadmaps = useCallback(async () => {
    setBusy("roadmaps", true);
    setErr("roadmaps", "");
    try {
      const res = await api(
        "GET",
        `/api/roadmaps?skills=${encodeURIComponent(skills.join(","))}&role=${encodeURIComponent(roadmapRole)}`
      );
      setRoadmaps(res?.roadmaps || []);
    } catch (err) {
      setErr("roadmaps", err instanceof Error ? err.message : "Failed to load roadmaps.");
    } finally {
      setBusy("roadmaps", false);
      setLoaded((p) => ({ ...p, roadmaps: true }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skillsInput, roadmapRole]);

  const loadGithub = useCallback(async () => {
    setBusy("github", true);
    setErr("github", "");
    try {
      const res = await api("GET", `/api/github-trending?language=${encodeURIComponent(language)}&period=${period}`);
      setRepos(res?.repos || []);
      if (res?.error) setErr("github", res.error);
    } catch (err) {
      setErr("github", err instanceof Error ? err.message : "Failed to load trending repos.");
    } finally {
      setBusy("github", false);
      setLoaded((p) => ({ ...p, github: true }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, period]);

  const loadProductHunt = useCallback(async () => {
    setBusy("producthunt", true);
    setErr("producthunt", "");
    try {
      const res = await api("GET", "/api/product-hunt");
      setProducts(res?.products || []);
    } catch (err) {
      setErr("producthunt", err instanceof Error ? err.message : "Failed to load products.");
    } finally {
      setBusy("producthunt", false);
      setLoaded((p) => ({ ...p, producthunt: true }));
    }
  }, []);

  const loadPlanner = useCallback(async () => {
    if (!Auth.isLoggedIn()) {
      setLoaded((p) => ({ ...p, planner: true }));
      return;
    }
    setBusy("planner", true);
    setErr("planner", "");
    try {
      const [planRes, progRes] = await Promise.all([
        authApi("GET", "/api/learning/plan"),
        authApi("GET", "/api/learning/progress"),
      ]);
      setTasks(planRes?.tasks || []);
      setProgress({
        todo: progRes?.todo ?? 0,
        doing: progRes?.doing ?? 0,
        done: progRes?.done ?? 0,
        percentage: progRes?.percentage ?? 0,
      });
    } catch (err) {
      setErr("planner", err instanceof Error ? err.message : "Failed to load your study plan.");
    } finally {
      setBusy("planner", false);
      setLoaded((p) => ({ ...p, planner: true }));
    }
  }, []);

  const LOADERS: Record<Tab, () => Promise<void>> = {
    resources: loadResources,
    youtube: loadYoutube,
    news: loadNews,
    cheatsheets: loadCheatsheets,
    roadmaps: loadRoadmaps,
    github: loadGithub,
    producthunt: loadProductHunt,
    planner: loadPlanner,
  };

  function openTab(tab: Tab) {
    setActiveTab(tab);
    if (!loaded[tab]) {
      LOADERS[tab]();
    }
  }

  async function toggleTask(task: PlannerTask) {
    const newStatus = task.status === "done" ? "todo" : "done";
    setTaskUpdating(task.id);
    try {
      await authApi("PATCH", `/api/learning/${task.id}`, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)));
      setProgress((p) => {
        if (!p) return p;
        const wasDone = task.status === "done";
        const done = p.done + (newStatus === "done" ? 1 : wasDone ? -1 : 0);
        const total = p.todo + p.doing + p.done;
        return { ...p, done, percentage: total > 0 ? Math.round((done / total) * 100) : 0 };
      });
    } catch {
      // best-effort; keep UI state as-is on failure
    } finally {
      setTaskUpdating(null);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="tcard">
        <label className="text-[11px] font-bold text-[#55556a] mb-1.5 block">Your Skills (comma-separated)</label>
        <input
          value={skillsInput}
          onChange={(e) => setSkillsInput(e.target.value)}
          placeholder="e.g. python, react, docker"
          className="w-full text-sm px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[var(--primary)]/50 transition-colors"
        />
        <p className="text-[11px] text-[#55556a] mt-1.5">
          Feeds Resources, YouTube, Tech News, Cheat Sheets &amp; Roadmaps below. Hit Refresh on a tab after changing it.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => openTab(t.id)}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg cursor-pointer transition-colors border"
            style={
              activeTab === t.id
                ? { background: "linear-gradient(115deg, var(--primary), var(--secondary))", borderColor: "transparent", color: "white" }
                : { background: "transparent", borderColor: "var(--border)", color: "#9090b0" }
            }
          >
            <t.icon className="h-3.5 w-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {activeTab === "resources" && (
        <div className="flex flex-col gap-3.5">
          <TabHeader title="Articles & Resources" onRefresh={loadResources} loading={!!loading.resources} />
          {errors.resources && <ErrorBox message={errors.resources} />}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {loading.resources && <EmptyState text="Loading resources..." />}
            {!loading.resources && resources.length === 0 && <EmptyState text="No resources found. Try different skills." />}
            {resources.map((r, i) => (
              <a key={i} href={r.url} target="_blank" rel="noreferrer" className="block">
                <Card>
                  <p className="text-[10px] font-bold text-[#55556a] uppercase">{r.source}</p>
                  <p className="text-sm font-semibold leading-snug">{r.title}</p>
                  <div className="flex items-center justify-between mt-auto pt-1">
                    <span className="text-[11px] text-[#55556a] flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {r.reading_time || 5} min read
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 text-[#55556a]" />
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </div>
      )}

      {activeTab === "youtube" && (
        <div className="flex flex-col gap-3.5">
          <TabHeader title={`YouTube Tutorials — "${firstSkill}"`} onRefresh={loadYoutube} loading={!!loading.youtube} />
          {errors.youtube && <ErrorBox message={errors.youtube} />}
          {youtubeMsg?.message && (
            <div className="tcard text-sm text-[#9090b0]">
              {youtubeMsg.message}{" "}
              {youtubeMsg.fallback_url && (
                <a href={youtubeMsg.fallback_url} target="_blank" rel="noreferrer" className="text-[#a78bfa] underline">
                  Search on YouTube instead →
                </a>
              )}
            </div>
          )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {loading.youtube && <EmptyState text="Loading videos..." />}
            {videos.map((v, i) => (
              <a key={i} href={v.url} target="_blank" rel="noreferrer" className="block">
                <Card>
                  {v.thumbnail && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={v.thumbnail} alt={v.title || ""} className="rounded-lg w-full aspect-video object-cover" />
                  )}
                  <p className="text-sm font-semibold leading-snug line-clamp-2">{v.title}</p>
                  <p className="text-[11px] text-[#55556a]">{v.channel}</p>
                </Card>
              </a>
            ))}
          </div>
        </div>
      )}

      {activeTab === "news" && (
        <div className="flex flex-col gap-3.5">
          <TabHeader title="Tech News" onRefresh={loadNews} loading={!!loading.news} />
          {errors.news && <ErrorBox message={errors.news} />}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {loading.news && <EmptyState text="Loading news..." />}
            {!loading.news && news.length === 0 && <EmptyState text="No news found." />}
            {news.map((n, i) => (
              <a key={i} href={n.url} target="_blank" rel="noreferrer" className="block">
                <Card>
                  <p className="text-[10px] font-bold text-[#55556a] uppercase">{n.source}</p>
                  <p className="text-sm font-semibold leading-snug">{n.title}</p>
                  {n.description && <p className="text-xs text-[#9090b0] line-clamp-2">{n.description}</p>}
                  <p className="text-[10px] text-[#55556a] mt-auto pt-1">{n.published}</p>
                </Card>
              </a>
            ))}
          </div>
        </div>
      )}

      {activeTab === "cheatsheets" && (
        <div className="flex flex-col gap-3.5">
          <TabHeader title={`Cheat Sheets — "${firstSkill}"`} onRefresh={loadCheatsheets} loading={!!loading.cheatsheets} />
          {errors.cheatsheets && <ErrorBox message={errors.cheatsheets} />}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {loading.cheatsheets && <EmptyState text="Loading cheat sheets..." />}
            {cheatsheets.map((c, i) => (
              <a key={i} href={c.url} target="_blank" rel="noreferrer" className="block">
                <Card>
                  <p className="text-sm font-semibold leading-snug">{c.name}</p>
                  {c.description && <p className="text-xs text-[#9090b0] line-clamp-2">{c.description}</p>}
                  <p className="text-[11px] text-[#55556a] mt-auto pt-1">by {c.author || "unknown"}</p>
                </Card>
              </a>
            ))}
          </div>
        </div>
      )}

      {activeTab === "roadmaps" && (
        <div className="flex flex-col gap-3.5">
          <div className="tcard flex flex-wrap items-end gap-3">
            <div>
              <label className="text-[11px] font-bold text-[#55556a] mb-1.5 block">Role (optional)</label>
              <input
                value={roadmapRole}
                onChange={(e) => setRoadmapRole(e.target.value)}
                placeholder="e.g. backend developer"
                className="text-sm px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[var(--primary)]/50 transition-colors"
              />
            </div>
            <button
              onClick={loadRoadmaps}
              disabled={loading.roadmaps}
              className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-3 w-3 ${loading.roadmaps ? "animate-spin" : ""}`} /> Refresh
            </button>
          </div>
          {errors.roadmaps && <ErrorBox message={errors.roadmaps} />}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {loading.roadmaps && <EmptyState text="Loading roadmaps..." />}
            {roadmaps.map((r, i) => (
              <a key={i} href={r.url} target="_blank" rel="noreferrer" className="block">
                <Card>
                  <p className="text-2xl">{r.icon}</p>
                  <p className="text-sm font-semibold">{r.title}</p>
                  <span className="text-[11px] text-[#a78bfa] flex items-center gap-1 mt-auto pt-1">
                    View roadmap <ExternalLink className="h-3 w-3" />
                  </span>
                </Card>
              </a>
            ))}
          </div>
        </div>
      )}

      {activeTab === "github" && (
        <div className="flex flex-col gap-3.5">
          <div className="tcard flex flex-wrap items-end gap-3">
            <div>
              <label className="text-[11px] font-bold text-[#55556a] mb-1.5 block">Language</label>
              <input
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="python"
                className="text-sm px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[var(--primary)]/50 transition-colors w-32"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#55556a] mb-1.5 block">Period</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="text-sm px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-[var(--primary)]/50 transition-colors"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <button
              onClick={loadGithub}
              disabled={loading.github}
              className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-3 w-3 ${loading.github ? "animate-spin" : ""}`} /> Refresh
            </button>
          </div>
          {errors.github && <ErrorBox message={errors.github} />}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {loading.github && <EmptyState text="Loading trending repos..." />}
            {repos.map((r, i) => (
              <a key={i} href={r.url} target="_blank" rel="noreferrer" className="block">
                <Card>
                  <p className="text-sm font-semibold leading-snug">{r.name}</p>
                  {r.description && <p className="text-xs text-[#9090b0] line-clamp-2">{r.description}</p>}
                  <div className="flex items-center gap-3 text-[11px] text-[#55556a] mt-auto pt-1">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" /> {r.stars ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="h-3 w-3" /> {r.forks ?? 0}
                    </span>
                    <span>{r.language}</span>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </div>
      )}

      {activeTab === "producthunt" && (
        <div className="flex flex-col gap-3.5">
          <TabHeader title="Trending on Product Hunt" onRefresh={loadProductHunt} loading={!!loading.producthunt} />
          {errors.producthunt && <ErrorBox message={errors.producthunt} />}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {loading.producthunt && <EmptyState text="Loading products..." />}
            {!loading.producthunt && products.length === 0 && <EmptyState text="No products available right now." />}
            {products.map((p, i) => (
              <a key={i} href={p.url} target="_blank" rel="noreferrer" className="block">
                <Card>
                  <p className="text-sm font-semibold leading-snug">{p.name}</p>
                  {p.description && <p className="text-xs text-[#9090b0] line-clamp-3">{p.description}</p>}
                </Card>
              </a>
            ))}
          </div>
        </div>
      )}

      {activeTab === "planner" && (
        <div className="flex flex-col gap-3.5">
          {!Auth.isLoggedIn() ? (
            <div className="tcard flex items-center gap-2 text-sm text-[#9090b0]">
              <LogIn className="h-4 w-4 shrink-0 text-[#55556a]" />
              Login to build and track your personal study plan.
            </div>
          ) : (
            <>
              <TabHeader title="Study Planner" onRefresh={loadPlanner} loading={!!loading.planner} />
              {errors.planner && <ErrorBox message={errors.planner} />}
              {progress && (
                <div className="tcard">
                  <div className="flex items-center justify-between mb-2 text-xs font-bold text-[#55556a]">
                    <span>
                      {progress.done} done · {progress.doing} in progress · {progress.todo} to do
                    </span>
                    <span>{progress.percentage}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, var(--primary), var(--secondary))" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress.percentage}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-2">
                {loading.planner && <EmptyState text="Loading your plan..." />}
                {!loading.planner && tasks.length === 0 && <EmptyState text="No tasks yet — analyze a job description to populate your plan." />}
                {tasks.map((t) => (
                  <label
                    key={t.id}
                    className="tcard flex items-center gap-3 cursor-pointer py-3"
                  >
                    <input
                      type="checkbox"
                      checked={t.status === "done"}
                      onChange={() => toggleTask(t)}
                      disabled={taskUpdating === t.id}
                      className="h-4 w-4 accent-[var(--primary)] cursor-pointer shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold capitalize ${t.status === "done" ? "line-through text-[#55556a]" : ""}`}>
                        {t.skill}
                      </p>
                      {t.resource_url && (
                        <a
                          href={t.resource_url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[11px] text-[#a78bfa] hover:underline"
                        >
                          Learning resource →
                        </a>
                      )}
                    </div>
                    <span className="text-[10px] font-black uppercase px-2 py-1 rounded-full bg-white/5 text-[#9090b0] shrink-0">
                      {t.status}
                    </span>
                  </label>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
