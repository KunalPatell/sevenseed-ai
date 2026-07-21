"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 35, stiffness: 220, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    setMounted(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable =
        target.tagName === "A" ||
        target.closest("a") ||
        target.tagName === "BUTTON" ||
        target.closest("button") ||
        target.classList.contains("glass-spotlight") ||
        target.closest(".glass-spotlight") ||
        target.style.cursor === "pointer";

      setIsHovered(!!isClickable);
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  if (!mounted) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[99999] h-8 w-8 rounded-full border border-[#8b5cf6]/40 bg-transparent hidden md:block"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        scale: isHovered ? 1.5 : 1,
      }}
      animate={{
        borderColor: isHovered ? "rgba(139, 92, 246, 0.8)" : "rgba(139, 92, 246, 0.3)",
        backgroundColor: isHovered ? "rgba(139, 92, 246, 0.08)" : "rgba(139, 92, 246, 0)",
      }}
      transition={{ type: "tween", ease: "backOut", duration: 0.3 }}
    />
  );
}
