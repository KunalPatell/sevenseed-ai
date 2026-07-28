#!/usr/bin/env node
/**
 * Post-build fix for Next.js static exports.
 *
 * Next's client prefetches a route's RSC payload using a FLAT, dot-joined
 * filename — e.g. GET /avpu/app/__next.app.__PAGE__.txt — but `output: "export"`
 * writes that payload as a NESTED path: out/app/__next.app/__PAGE__.txt.
 * The names never line up, so every page that renders a <Link> to such a route
 * fires a 404 on load. Navigation still works (Next falls back to a full page
 * load), but the request is wasted and the prefetch benefit is lost.
 *
 * This walks an export directory and, for every `__next.<seg>/<file>`, writes
 * the dot-joined alias `__next.<seg>.<file>` beside it. Copies, never moves, so
 * whichever name the framework asks for resolves.
 *
 * Usage: node scripts/fix-rsc-aliases.mjs <outDir> [...more]
 */
import { readdirSync, statSync, copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

let written = 0;

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (!statSync(full).isDirectory()) continue;

    if (entry.startsWith("__next.")) {
      // A payload directory: emit `<dir>.<file>` next to it for each child.
      for (const child of readdirSync(full)) {
        const src = join(full, child);
        if (statSync(src).isDirectory()) continue;
        const alias = join(dir, `${entry}.${child}`);
        if (!existsSync(alias)) {
          copyFileSync(src, alias);
          written++;
        }
      }
    }
    walk(full);
  }
}

const targets = process.argv.slice(2);
if (!targets.length) {
  console.error("usage: node scripts/fix-rsc-aliases.mjs <outDir> [...]");
  process.exit(1);
}
for (const t of targets) {
  if (!existsSync(t)) {
    console.error(`skip (missing): ${t}`);
    continue;
  }
  walk(t);
}
console.log(`rsc aliases written: ${written}`);
