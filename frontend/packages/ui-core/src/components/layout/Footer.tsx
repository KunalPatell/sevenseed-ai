"use client";

import { Github, Linkedin, Mail, Download, Command } from "lucide-react";
import { isPlaceholderUrl, profile } from "../../lib/data";
import { sound } from "../../lib/sound";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/5 bg-[#050505] py-12">
      <div className="container-px flex flex-col items-center justify-between gap-6 text-sm text-muted sm:flex-row">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-white tracking-wider">{profile.name}</span>
            <span className="text-white/30">/</span>
            <span className="text-xs font-mono text-[#9ed8ff]">AI Engineer &amp; Automation Specialist</span>
          </div>
          <p className="mt-1 font-mono text-xs text-white/50">
            © {year} Kunal Patel • Built with Next.js 15, FastAPI, LangGraph &amp; PyTorch.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => sound.playClick()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-white/80 hover:border-[#9ed8ff]/40 hover:text-white transition-all"
          >
            <Download className="h-3.5 w-3.5 text-[#9ed8ff]" />
            <span>V7 Resume PDF</span>
          </a>

          <button
            onClick={() => {
              const event = new KeyboardEvent("keydown", { key: "k", ctrlKey: true });
              window.dispatchEvent(event);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-white/80 hover:border-[#9ed8ff]/40 hover:text-white transition-all"
          >
            <Command className="h-3.5 w-3.5 text-[#9ed8ff]" />
            <span>Ctrl+K</span>
          </button>

          {!isPlaceholderUrl(profile.socials.github) ? (
            <a
              aria-label="GitHub"
              href={profile.socials.github}
              target="_blank"
              rel="noreferrer"
              className="p-2 transition-colors hover:text-[#9ed8ff]"
            >
              <Github className="h-4 w-4" />
            </a>
          ) : null}
          <a
            aria-label="LinkedIn"
            href={profile.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="p-2 transition-colors hover:text-[#9ed8ff]"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <a
            aria-label="Email"
            href={`mailto:${profile.email}`}
            className="p-2 transition-colors hover:text-[#9ed8ff]"
          >
            <Mail className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
