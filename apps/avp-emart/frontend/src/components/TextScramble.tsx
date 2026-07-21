"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "!<>-_\\/[]{}=+*^?#01ABCXYZ";

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
      start: Math.floor(Math.random() * 12),
      end: Math.floor(Math.random() * 12) + 12,
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
  }, [text]);

  return (
    <span className={className} onMouseEnter={run}>
      {display}
    </span>
  );
}
