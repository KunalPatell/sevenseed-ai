"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Home,
  Briefcase,
  Layers,
  FolderGit2,
  Cpu,
  Bot,
  Mail,
  Terminal,
  Volume2,
  VolumeX,
  FileText,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { sound } from "../../lib/sound";

interface DockItem {
  title: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

export function FloatingDock({ className }: { className?: string }) {
  const [soundActive, setSoundActive] = useState(sound.isEnabled());

  const toggleSound = () => {
    const next = sound.toggle();
    setSoundActive(next);
  };

  const openTerminal = () => {
    sound.playClick();
    const event = new CustomEvent("open-terminal");
    window.dispatchEvent(event);
  };

  const items: DockItem[] = [
    { title: "Home", icon: <Home className="h-4 w-4" />, href: "#home" },
    { title: "Experience", icon: <Briefcase className="h-4 w-4" />, href: "#experience" },
    { title: "Ventures", icon: <Layers className="h-4 w-4" />, href: "#ventures" },
    { title: "Projects", icon: <FolderGit2 className="h-4 w-4" />, href: "#projects" },
    { title: "Skills", icon: <Cpu className="h-4 w-4" />, href: "#skills" },
    { title: "Ask AI", icon: <Bot className="h-4 w-4" />, href: "#ask-ai" },
    { title: "Terminal", icon: <Terminal className="h-4 w-4 text-[#9ed8ff]" />, onClick: openTerminal },
    {
      title: soundActive ? "Mute Audio" : "Enable Audio",
      icon: soundActive ? (
        <Volume2 className="h-4 w-4 text-emerald-400" />
      ) : (
        <VolumeX className="h-4 w-4 text-white/50" />
      ),
      onClick: toggleSound,
    },
    { title: "Contact", icon: <Mail className="h-4 w-4" />, href: "#contact" },
  ];

  const mouseX = useMotionValue(Infinity);

  return (
    <div
      className={cn(
        "fixed bottom-6 inset-x-0 z-40 mx-auto w-max max-w-[95vw] pointer-events-auto",
        className
      )}
    >
      <motion.div
        onMouseMove={(e: React.MouseEvent) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex h-14 items-center gap-2 rounded-2xl border border-white/10 bg-[#080a0f]/80 px-3 py-2 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
      >
        {items.map((item) => (
          <DockIcon key={item.title} mouseX={mouseX} item={item} />
        ))}
      </motion.div>
    </div>
  );
}

function DockIcon({
  mouseX,
  item,
}: {
  mouseX: any;
  item: DockItem;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-120, 0, 120], [38, 54, 38]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  const handleClick = (e: React.MouseEvent) => {
    sound.playClick();
    if (item.onClick) {
      e.preventDefault();
      item.onClick();
    }
  };

  const handleMouseEnter = () => {
    setHovered(true);
    sound.playHover();
  };

  return (
    <div ref={ref} className="relative">
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 2, x: "-50%" }}
            className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-black/90 px-2 py-0.5 font-mono text-[10px] text-white/90 backdrop-blur-sm shadow-md"
          >
            {item.title}
          </motion.div>
        )}
      </AnimatePresence>

      {item.href ? (
        <motion.a
          href={item.href}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={() => setHovered(false)}
          style={{ width, height: width }}
          className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition-colors hover:border-[#9ed8ff]/50 hover:bg-[#9ed8ff]/15 hover:text-white"
        >
          {item.icon}
        </motion.a>
      ) : (
        <motion.button
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={() => setHovered(false)}
          style={{ width, height: width }}
          className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition-colors hover:border-[#9ed8ff]/50 hover:bg-[#9ed8ff]/15 hover:text-white"
        >
          {item.icon}
        </motion.button>
      )}
    </div>
  );
}
