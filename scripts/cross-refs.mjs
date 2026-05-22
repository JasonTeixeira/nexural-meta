#!/usr/bin/env node
/**
 * cross-refs.mjs — validates `related` links across federation per
 * ARCHITECTURE §4.2 + SCHEMA_CHARTER.
 *
 * Walks every locally-cloned warehouse, extracts `related: [{warehouse, id, relation}]`
 * from each entry's frontmatter, and verifies the link target exists.
 *
 * Emits cross-refs.json conforming to @nexural/schema CrossRefReport.
 *
 * Usage:
 *   node scripts/cross-refs.mjs                  # all federations
 *   node scripts/cross-refs.mjs --root=~/code/nexural/warehouses
 */

import { existsSync, readdirSync, statSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { homedir } from "node:os";

const ARGS = parseArgs(process.argv.slice(2));
const ROOT = resolve(ARGS.root.replace(/^~/, homedir()));

async function main() {
  if (!existsSync(ROOT)) {
    console.warn(`⚠ warehouses root ${ROOT} not present — run \`pnpm bootstrap\` first.`);
    await writeFile(
      "cross-refs.json",
      JSON.stringify(
        {
          schema_version: 1,
          generated_at: new Date().toISOString(),
          links: [],
          summary: { total: 0, broken: 0, orphan_warehouses: [] },
        },
        null,
        2,
      ) + "\n",
      "utf8",
    );
    return;
  }

  console.log(`→ Scanning warehouses under ${ROOT}...`);
  const warehouseDirs = readdirSync(ROOT).filter((d) => {
    const p = join(ROOT, d);
    return statSync(p).isDirectory() && d.endsWith("-warehouse");
  });

  console.log(`  found ${warehouseDirs.length} warehouse director(ies)`);

  // Index: { warehouseName => Set<entryId> }
  const index = new Map();
  const links = [];

  for (const wh of warehouseDirs) {
    const name = wh.replace(/-warehouse$/, "");
    const contentDir = join(ROOT, wh, "content");
    if (!existsSync(contentDir)) continue;
    const entries = readdirSync(contentDir);
    const entryIds = new Set();
    for (const e of entries) {
      const fmPath = join(contentDir, e, "frontmatter.yaml");
      if (!existsSync(fmPath)) continue;
      const fm = await readFile(fmPath, "utf8");
      const parsed = parseSimpleFrontmatter(fm);
      if (!parsed.id) continue;
      entryIds.add(parsed.id);
      for (const rel of parsed.related ?? []) {
        links.push({
          from_warehouse: name,
          from_id: parsed.id,
          to_warehouse: rel.warehouse,
          to_id: rel.id,
          relation: rel.relation,
          valid: false, // filled in below
        });
      }
    }
    index.set(name, entryIds);
  }

  // Validate links
  const orphans = new Set();
  for (const link of links) {
    const targetIds = index.get(link.to_warehouse);
    if (!targetIds) {
      link.valid = false;
      link.reason = `target warehouse "${link.to_warehouse}" not found`;
      orphans.add(link.to_warehouse);
    } else if (!targetIds.has(link.to_id)) {
      link.valid = false;
      link.reason = `target entry "${link.to_id}" not found in ${link.to_warehouse}-warehouse`;
    } else {
      link.valid = true;
    }
  }

  const broken = links.filter((l) => !l.valid).length;

  const report = {
    schema_version: 1,
    generated_at: new Date().toISOString(),
    links,
    summary: {
      total: links.length,
      broken,
      orphan_warehouses: [...orphans].sort(),
    },
  };

  await writeFile("cross-refs.json", JSON.stringify(report, null, 2) + "\n", "utf8");
  console.log(
    `✓ wrote cross-refs.json — ${links.length} links, ${broken} broken, ${orphans.size} orphan warehouses`,
  );
}

function parseArgs(argv) {
  const args = { root: "~/code/nexural/warehouses" };
  for (const a of argv) {
    if (a.startsWith("--root=")) args.root = a.split("=")[1];
  }
  return args;
}

/**
 * Minimal YAML frontmatter parser — extracts id + related[] only.
 * Sufficient for cross-ref validation; doesn't need a full YAML parser.
 */
function parseSimpleFrontmatter(content) {
  const result = { id: null, related: [] };
  const lines = content.split("\n");
  let inRelated = false;
  let currentLink = null;
  for (const line of lines) {
    if (line.startsWith("id:")) {
      result.id = line.split(":").slice(1).join(":").trim().replace(/['"]/g, "");
    } else if (line.startsWith("related:")) {
      inRelated = true;
    } else if (inRelated) {
      if (/^\S/.test(line)) {
        inRelated = false;
        if (currentLink) result.related.push(currentLink);
        currentLink = null;
        continue;
      }
      if (line.trimStart().startsWith("- warehouse:")) {
        if (currentLink) result.related.push(currentLink);
        currentLink = { warehouse: line.split(":").slice(1).join(":").trim() };
      } else if (currentLink && line.trim().startsWith("id:")) {
        currentLink.id = line.split(":").slice(1).join(":").trim();
      } else if (currentLink && line.trim().startsWith("relation:")) {
        currentLink.relation = line.split(":").slice(1).join(":").trim();
      }
    }
  }
  if (currentLink) result.related.push(currentLink);
  return result;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
