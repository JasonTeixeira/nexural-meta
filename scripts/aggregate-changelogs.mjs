#!/usr/bin/env node
/**
 * aggregate-changelogs.mjs — federation-wide CHANGELOG per ADR-0010 §2.7.
 *
 * Walks every package + cloned warehouse, pulls their CHANGELOG.md, and
 * assembles CHANGELOG-FEDERATION.md sorted by date.
 *
 * Runs weekly (Monday 12:30 UTC, ahead of digest) per OPS_CALENDAR §1.
 *
 * Usage:
 *   node scripts/aggregate-changelogs.mjs
 *   node scripts/aggregate-changelogs.mjs --warehouses-root=~/code/nexural/warehouses
 */

import { existsSync, readdirSync, statSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

const ARGS = parseArgs(process.argv.slice(2));
const WAREHOUSES_ROOT = resolve(ARGS.warehousesRoot.replace(/^~/, homedir()));

async function main() {
  const sources = [];

  // 1. Packages in nexural-meta
  const packagesDir = "packages";
  if (existsSync(packagesDir)) {
    for (const pkg of readdirSync(packagesDir)) {
      const log = join(packagesDir, pkg, "CHANGELOG.md");
      if (existsSync(log)) {
        const content = await readFile(log, "utf8");
        sources.push({ source: `@nexural/${pkg}`, content });
      }
    }
  }

  // 2. Warehouses in the local clone root
  if (existsSync(WAREHOUSES_ROOT)) {
    for (const wh of readdirSync(WAREHOUSES_ROOT)) {
      const p = join(WAREHOUSES_ROOT, wh);
      if (!statSync(p).isDirectory()) continue;
      const log = join(p, "CHANGELOG.md");
      if (existsSync(log)) {
        const content = await readFile(log, "utf8");
        sources.push({ source: wh, content });
      }
    }
  }

  // 3. Sibling repos (nexural-qa-os, ai-warehouse) if adjacent
  for (const sibling of ["../nexural-qa-os", "../ai-warehouse"]) {
    const log = join(sibling, "CHANGELOG.md");
    if (existsSync(log)) {
      const content = await readFile(log, "utf8");
      sources.push({ source: sibling.replace("../", ""), content });
    }
  }

  console.log(`→ Aggregating ${sources.length} CHANGELOG sources...`);

  const lines = [];
  lines.push("# Nexural Federation — Aggregated Changelog");
  lines.push("");
  lines.push(
    `Generated ${new Date().toISOString()}. Auto-emitted by \`scripts/aggregate-changelogs.mjs\` per ADR-0010 §2.7.`,
  );
  lines.push("");
  lines.push("---");
  lines.push("");

  for (const { source, content } of sources.sort((a, b) => a.source.localeCompare(b.source))) {
    lines.push(`## ${source}`);
    lines.push("");
    // Strip the source's own H1 if present to avoid duplicate-h1 churn.
    const stripped = content.replace(/^#\s+[^\n]+\n+/m, "");
    lines.push(stripped.trim());
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  await writeFile("CHANGELOG-FEDERATION.md", lines.join("\n"), "utf8");
  console.log(`✓ wrote CHANGELOG-FEDERATION.md (${sources.length} sources)`);
}

function parseArgs(argv) {
  const args = { warehousesRoot: "~/code/nexural/warehouses" };
  for (const a of argv) {
    if (a.startsWith("--warehouses-root=")) args.warehousesRoot = a.split("=")[1];
  }
  return args;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
