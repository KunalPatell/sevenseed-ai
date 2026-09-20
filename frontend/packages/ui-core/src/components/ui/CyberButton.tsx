"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface CyberButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  icon?: LucideIcon;
  external?: boolean;
}

export function CyberButton({
  children,
  onClick,
  href,
  className = "",
  icon: Icon,
  external = false,
}: CyberButtonProps) {
  const content = (
    <span className="inline-flex items-center gap-2 font-mono uppercase tracking-wider text-xs font-bold">
      {Icon && <Icon className="h-4 w-4 shrink-0 text-sky-300" />}
      <span>{children}</span>
    </span>
  );

  const baseClasses = `relative inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-sky-400/30 overflow-hidden cursor-pointer ${className}`;

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={baseClasses}
        >
          {content}
        </a>
      );
    }
    return (
      <a href={href} className={baseClasses}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={baseClasses}>
      {content}
    </button>
  );
}
