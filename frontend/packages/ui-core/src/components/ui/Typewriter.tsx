"use client";

import { useEffect, useState } from "react";

/**
 * Rotating typewriter: types and deletes through a list of words on a loop.
 */
export function Typewriter({
  words,
  typingSpeed = 75,
  deleteSpeed = 40,
  pause = 1500,
  className,
}: {
  words: string[];
  typingSpeed?: number;
  deleteSpeed?: number;
  pause?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [sub, setSub] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index % words.length];

    if (!deleting && sub === word.length) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }
    if (deleting && sub === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
      return;
    }
    const t = setTimeout(
      () => setSub((s) => s + (deleting ? -1 : 1)),
      deleting ? deleteSpeed : typingSpeed
    );
    return () => clearTimeout(t);
  }, [sub, deleting, index, words, typingSpeed, deleteSpeed, pause]);

  return (
    <span className={className}>
      {words[index % words.length].slice(0, sub)}
      <span className="ml-0.5 inline-block w-[1px] animate-pulse bg-current align-middle">
        &nbsp;
      </span>
    </span>
  );
}
