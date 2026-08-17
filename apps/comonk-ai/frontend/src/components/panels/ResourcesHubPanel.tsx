"use client";

import React, { useEffect, useState } from "react";
import { Search, ExternalLink, Loader2, AlertCircle, BookOpen, GitBranch, MessagesSquare, Library, Globe } from "lucide-react";
import { api } from "@/lib/api";

type GenericItem = Record<string, unknown>;

interface Section {
  key: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: GenericItem[];
}

const SECTION_META: Record<string, { title: string; icon: React.ComponentType<{ className?: string }> }> = {
  resources: { title: "Courses & Docs", icon: BookOpen },
  articles: { title: "Courses & Docs", icon: BookOpen },
  top_github_repos: { title: "Top GitHub Repos", icon: GitBranch },
  repos: { title: "Top GitHub Repos", icon: GitBranch },
  stackoverflow_questions: { title: "StackOverflow Q&A", icon: MessagesSquare },
  questions: { title: "StackOverflow Q&A", icon: MessagesSquare },
  free_platforms: { title: "Free Learning Platforms", icon: Library },
};

function prettifyKey(key: string) {
  const meta = SECTION_META[key];
  if (meta) return meta.title;
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function freePlatforms(topic: string): GenericItem[] {
  const q = encodeURIComponent(topic);
  return [
    { name: "freeCodeCamp", url: `https://www.freecodecamp.org/news/search/?query=${q}`, description: "Free interactive courses and articles." },
    { name: "MDN Web Docs", url: `https://developer.mozilla.org/en-US/search?q=${q}`, description: "Authoritative, free web reference documentation." },
    { name: "The Odin Project", url: "https://www.theodinproject.com/", description: "Free, project-based full-stack curriculum." },
    { name: "Khan Academy", url: `https://www.khanacademy.org/search?page_search_query=${q}`, description: "Free foundational CS and math courses." },
    { name: "Coursera (audit free)", url: `https://www.coursera.org/search?query=${q}`, description: "Audit university courses at no cost." },
    { name: "YouTube", url: `https://www.youtube.com/results?search_query=${q}+tutorial`, description: "Free video tutorials from the community." },
  ];
}

function buildSections(obj: GenericItem): Section[] {
  const out: Section[] = [];
  for (const [key, value] of Object.entries(obj)) {
    if (!Array.isArray(value)) continue;
    const meta = SECTION_META[key];
    out.push({
      key,
      title: prettifyKey(key),
      icon: meta?.icon || Globe,
      items: value as GenericItem[],
    });
  }
  return out;
}

function pickTitle(item: GenericItem): string {
  return (item.title as string) || (item.name as string) || (item.text as string) || "Untitled";
}
function pickUrl(item: GenericItem): string | undefined {
  return (item.url as string) || (item.link as string) || undefined;
}
function pickDescription(item: GenericItem): string | undefined {
  return (item.description as string) || undefined;
}
function pickTags(item: GenericItem): string[] | undefined {
  const t = (item.tags as string[]) || (item.topics as string[]);
  return Array.isArray(t) ? t : undefined;
}

const META_SKIP = new Set(["title", "name", "text", "url", "link", "description", "tags", "topics", "cover", "owner_avatar", "author"]);

function pickMeta(item: GenericItem): [string, string | number | boolean][] {
  return Object.entries(item).filter(
    ([k, v]) => !META_SKIP.has(k) && v !== "" && v !== null && (typeof v === "string" || typeof v === "number" || typeof v === "boolean")
  ) as [string, string | number | boolean][];
}

function GenericCard({ item }: { item: GenericItem }) {
  const title = pickTitle(item);
  const url = pickUrl(item);
  const description = pickDescription(item);
  const tags = pickTags(item);
  const meta = pickMeta(item).slice(0, 4);

  const inner = (
    <>
      <p className="text-xs font-bold leading-snug flex items-center gap-1.5">
        <span className="min-w-0 truncate">{title}</span>
        {url && <ExternalLink className="h-3 w-3 text-[#55556a] shrink-0" />}
      </p>
      {description && <p className="text-[11px] text-[#9090b0] mt-1 line-clamp-2">{description}</p>}
      {(meta.length > 0 || (tags && tags.length > 0)) && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {meta.map(([k, v]) => (
            <span key={k} className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-white/5 text-[#55556a]">
              {prettifyKey(k)}: {String(v)}
            </span>
          ))}
          {tags?.slice(0, 4).map((t) => (
            <span key={t} className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-[#7c3aed]/10 text-[#a78bfa]">
              #{t}
            </span>
          ))}
        </div>
      )}
    </>
  );

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/15 transition-colors"
      >
        {inner}
      </a>
    );
  }
  return <div className="p-3 rounded-lg bg-white/5 border border-white/5">{inner}</div>;
}

export function ResourcesHubPanel() {
  const [input, setInput] = useState("python");
  const [topic, setTopic] = useState("python");
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load(t: string) {
    setLoading(true);
    setError("");
    try {
      let combined: GenericItem | null = null;
      try {
        const direct = await api("GET", `/api/free-resources?technology=${encodeURIComponent(t)}`);
        const directSections = buildSections(direct || {});
        if (directSections.length > 0) combined = direct;
      } catch {
        // documented endpoint isn't live — fall back below
      }

      if (!combined) {
        const [resourcesRes, reposRes, questionsRes] = await Promise.allSettled([
          api("GET", `/api/learning-resources?skills=${encodeURIComponent(t)}&limit=8`),
          api("GET", `/api/github-trending?language=${encodeURIComponent(t)}&period=weekly`),
          api("GET", `/api/stackoverflow?skill=${encodeURIComponent(t)}&limit=8`),
        ]);
        combined = {};
        if (resourcesRes.status === "fulfilled") combined.resources = resourcesRes.value?.resources ?? [];
        if (reposRes.status === "fulfilled") combined.top_github_repos = reposRes.value?.repos ?? [];
        if (questionsRes.status === "fulfilled") combined.stackoverflow_questions = questionsRes.value?.questions ?? [];

        if (resourcesRes.status === "rejected" && reposRes.status === "rejected" && questionsRes.status === "rejected") {
          setError("Failed to load resources. Please try again.");
        }
      }

      combined.free_platforms = freePlatforms(t);
      setSections(buildSections(combined));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load resources");
      setSections(buildSections({ free_platforms: freePlatforms(t) }));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load("python");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const t = input.trim();
    if (!t) return;
    setTopic(t);
    load(t);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="tcard">
        <form onSubmit={submit} className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 flex-1 min-w-[200px]">
            <Search className="h-3.5 w-3.5 text-[#55556a] shrink-0" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search a technology (e.g. React, Docker, SQL)..."
              className="bg-transparent outline-none text-sm flex-1 min-w-0"
            />
          </div>
          <button
            type="submit"
            className="text-xs font-bold px-4 py-2.5 rounded-lg text-white cursor-pointer"
            style={{ background: "linear-gradient(115deg, var(--primary), var(--secondary))" }}
          >
            Find Resources
          </button>
        </form>
      </div>

      {loading && (
        <div className="tcard flex items-center justify-center gap-2 py-12">
          <Loader2 className="h-4 w-4 animate-spin text-[#a78bfa]" />
          <p className="text-sm text-[#9090b0]">Gathering resources for {topic}...</p>
        </div>
      )}

      {!loading && error && (
        <div className="tcard flex items-center gap-2 py-6 justify-center text-center">
          <AlertCircle className="h-4 w-4 text-[#fca5a5] shrink-0" />
          <p className="text-sm text-[#fca5a5]">{error}</p>
        </div>
      )}

      {!loading && sections.length > 0 && (
        <div className="grid md:grid-cols-2 gap-5">
          {sections.map((s) => (
            <div key={s.key} className="tcard flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <s.icon className="h-4 w-4 text-[#a78bfa]" />
                <p className="text-xs font-bold uppercase tracking-wide text-[#55556a]">{s.title}</p>
                <span className="ml-auto text-[10px] text-[#55556a]">{s.items.length}</span>
              </div>
              {s.items.length === 0 ? (
                <p className="text-xs text-[#55556a] py-4 text-center">No results for this topic.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {s.items.map((item, i) => (
                    <GenericCard key={i} item={item} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
