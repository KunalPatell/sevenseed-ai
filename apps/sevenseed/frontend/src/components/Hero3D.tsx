"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { Hero3DGeometry } from "./Hero3DBackground";

const Hero3DBackground = dynamic(
  () => import("./Hero3DBackground").then((m) => m.Hero3DBackground),
  { ssr: false }
);

/**
 * Drop-in wrapper: skips the WebGL scene under prefers-reduced-motion (and
 * during SSR/static export) instead of rendering it statically, since a
 * frozen 3D mesh reads as broken rather than restrained.
 */
export function Hero3D(props: {
  primary: string;
  secondary: string;
  geometry?: Hero3DGeometry;
  className?: string;
}) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setEnabled(!mq.matches);
    const onChange = () => setEnabled(!mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (!enabled) return null;
  return <Hero3DBackground {...props} />;
}
