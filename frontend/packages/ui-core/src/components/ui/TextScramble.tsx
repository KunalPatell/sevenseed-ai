"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "!<>-_\\/[]{}=+*^?#01ABCXYZ";

/**
 * Cyber "decode" effect: text resolves from random glyphs to the final string
 * on mount, and re-scrambles on hover. Matches the #9ed8ff terminal vibe.
 */
export function TextScramble({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [display, setDisplay] = useState(text);
  const rafRef = useRef<number | null>(null);

  function run() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const queue = text.split("").map((c) => ({
      c,
      start: Math.floor(Math.random() * 16),
      end: Math.floor(Math.random() * 16) + 16,
    }));
    let f = 0;
    const tick = () => {
      let out = "";
      let done = 0;
      for (const q of queue) {
        if (q.c === " ") {
          out += " ";
          done++;
        } else if (f >= q.end) {
          out += q.c;
          done++;
        } else if (f >= q.start) {
          out += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      setDisplay(out);
      if (done >= queue.length) return;
      f++;
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
  }

  useEffect(() => {
    run();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <span className={className} onMouseEnter={run}>
      {display}
    </span>
  );
}
