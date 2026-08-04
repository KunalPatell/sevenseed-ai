#!/usr/bin/env node
/**
 * Copy a Next.js static export into the hub's served static directory.
 *
 * WHY THIS EXISTS: apps/sevenseed/backend/static/ is not one app. It is the hub's
 * own export PLUS a nested directory per child venture (breakdown/, avpu/, ...),
 * each of which is a separate build mounted at that prefix by the orchestrator.
 * A plain "wipe and copy" of the hub's out/ therefore deletes all six child
 * sites — that is exactly what commit 8ac663a did, and every child 404'd in
 * production until the builds were restored.
 *
 * So: this copies over the top and never deletes. Stale hub files may linger,
 * which is harmless; losing a child site is not.
 *
 * Usage:
 *   node scripts/deploy-static.mjs hub                 # hub out/ -> static/
 *   node scripts/deploy-static.mjs breakdown           # child out/ -> static/breakdown/
 */
import { cpSync, existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const STATIC = join(ROOT, "apps", "sevenseed", "backend", "static");

// mount prefix -> the apps/<folder> whose frontend builds it.
const CHILDREN = {
  "avp-emart": "avp-emart",
  avpu: "avpu",
  breakdown: "breakdown-factor",
  trust: "avp-charitable-trust",
  pharmacy: "decode-forest-pharmacy",
  sevenforce: "sevenforce",
  "rakshak-ai": "rakshak-ai",
};

const target = process.argv[2];
if (!target) {
  console.error("Usage: deploy-static.mjs <hub|" + Object.keys(CHILDREN).join("|") + ">");
  process.exit(1);
}

const isHub = target === "hub";
if (!isHub && !CHILDREN[target]) {
  console.error(`Unknown target "${target}". Known: hub, ${Object.keys(CHILDREN).join(", ")}`);
  process.exit(1);
}

const folder = isHub ? "sevenseed" : CHILDREN[target];
const out = join(ROOT, "apps", folder, "frontend", "out");
const dest = isHub ? STATIC : join(STATIC, target);

if (!existsSync(out)) {
  console.error(`No export at ${out} — run "next build" in apps/${folder}/frontend first.`);
  process.exit(1);
}

// Guard: before overwriting the hub, record the child dirs so we can prove
// afterwards that none of them vanished.
const before = isHub
  ? Object.keys(CHILDREN).filter((p) => existsSync(join(STATIC, p)))
  : [];

cpSync(out, dest, { recursive: true, force: true });
console.log(`Copied ${out}\n     -> ${dest}`);

if (isHub) {
  const after = before.filter((p) => {
    const dir = join(STATIC, p);
    return existsSync(dir) && readdirSync(dir).length > 0;
  });
  const lost = before.filter((p) => !after.includes(p));
  if (lost.length) {
    console.error(`FATAL: these child sites were destroyed: ${lost.join(", ")}`);
    process.exit(1);
  }
  console.log(`Child sites intact: ${after.length ? after.join(", ") : "(none present)"}`);
}
