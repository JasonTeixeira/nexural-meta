#!/usr/bin/env node
/**
 * discover.mjs — generates registry-factory.yaml + registry-lifeops.yaml
 * per ADR-0003 dual-federation discovery.
 *
 * Source: GitHub topics `nexural-factory` and `nexural-lifeops`.
 * Each discovered repo's meta.yaml is fetched + validated against @nexural/schema.
 *
 * Usage:
 *   node scripts/discover.mjs                    # both federations
 *   node scripts/discover.mjs --federation=factory
 *   node scripts/discover.mjs --federation=lifeops
 *   node scripts/discover.mjs --dry-run          # don't write files
 */

import { execFile } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import { WarehouseMeta } from "@nexural/schema";

const exec = promisify(execFile);

const FEDERATIONS = ["factory", "lifeops"];
const ARGS = parseArgs(process.argv.slice(2));

async function main() {
  const targets = ARGS.federation === "both" ? FEDERATIONS : [ARGS.federation];
  for (const fed of targets) {
    await discoverFederation(fed);
  }
}

function parseArgs(argv) {
  const args = { federation: "both", dryRun: false };
  for (const a of argv) {
    if (a.startsWith("--federation=")) args.federation = a.split("=")[1];
    else if (a === "--dry-run") args.dryRun = true;
  }
  if (args.federation !== "both" && !FEDERATIONS.includes(args.federation)) {
    throw new Error(
      `--federation must be one of: ${FEDERATIONS.join(", ")}, both. Got: ${args.federation}`,
    );
  }
  return args;
}

async function discoverFederation(federation) {
  const topic = `nexural-${federation}`;
  console.log(`→ Searching GitHub for repos with topic "${topic}"...`);

  const { stdout } = await exec("gh", [
    "api",
    "-X",
    "GET",
    `search/repositories`,
    "-f",
    `q=topic:${topic}`,
    "-f",
    "per_page=100",
    "--jq",
    ".items[] | {name, full_name, default_branch, html_url, updated_at, archived}",
  ]).catch((e) => {
    if (e.stderr?.includes("rate limit")) {
      console.error("GitHub rate limit hit. Wait and retry.");
      process.exit(1);
    }
    throw e;
  });

  const lines = stdout.trim().split("\n").filter(Boolean);
  const repos = lines.map((l) => JSON.parse(l));
  console.log(`  found ${repos.length} repo(s)`);

  const entries = [];
  for (const repo of repos) {
    if (repo.archived) continue;
    try {
      const meta = await fetchMeta(repo);
      entries.push({
        name: meta.name,
        tier: meta.tier,
        status: meta.status,
        repo: repo.html_url,
        last_reviewed: meta.last_reviewed,
        decay_rate_days: meta.decay_rate_days,
        discovered_via: "github-topic",
      });
    } catch (e) {
      console.warn(`  ⚠ ${repo.full_name}: ${e.message}`);
    }
  }

  const registry = {
    schema_version: 1,
    federation,
    generated_at: new Date().toISOString(),
    warehouses: entries.sort((a, b) => a.name.localeCompare(b.name)),
  };

  const outPath = `registry-${federation}.yaml`;
  if (ARGS.dryRun) {
    console.log(`  (dry-run) would write ${outPath}:`);
    console.log(JSON.stringify(registry, null, 2));
  } else {
    await writeFile(outPath, toYaml(registry), "utf8");
    console.log(`  ✓ wrote ${outPath} (${entries.length} warehouses)`);
  }
}

async function fetchMeta(repo) {
  const url = `repos/${repo.full_name}/contents/meta.yaml`;
  const { stdout } = await exec("gh", ["api", url, "--jq", ".content"]);
  const decoded = Buffer.from(stdout.trim(), "base64").toString("utf8");
  // Lightweight YAML→JSON: we accept simple meta.yaml shape.
  const parsed = parseSimpleYaml(decoded);
  return WarehouseMeta.parse(parsed);
}

/**
 * Lightweight YAML parser sufficient for meta.yaml shape.
 * Replace with `yaml` npm package if shapes grow more complex.
 */
function parseSimpleYaml(content) {
  // Minimal parser — for production use, install `yaml` and import it.
  // For Phase 2 we keep dependencies tight; meta.yaml is well-formed YAML.
  // Falls back to JSON if file is .json.
  try {
    return JSON.parse(content);
  } catch {
    // Fallback: shell to yq if installed.
    const tempPath = `/tmp/nexural-meta-yaml-${Date.now()}.yaml`;
    return shellYamlParse(content, tempPath);
  }
}

function shellYamlParse(content, tempPath) {
  const { writeFileSync, readFileSync, unlinkSync } = require("node:fs");
  const { execSync } = require("node:child_process");
  writeFileSync(tempPath, content, "utf8");
  try {
    const json = execSync(`npx --yes yaml-cli@1 toJson < ${tempPath}`, {
      encoding: "utf8",
    });
    return JSON.parse(json);
  } finally {
    try {
      unlinkSync(tempPath);
    } catch {}
  }
}

function toYaml(obj) {
  // Light YAML serializer — preserves the simple registry shape we emit.
  // (We control the shape, so we don't need full YAML escaping for arbitrary input.)
  const lines = [];
  lines.push(`schema_version: ${obj.schema_version}`);
  lines.push(`federation: ${obj.federation}`);
  lines.push(`generated_at: ${obj.generated_at}`);
  lines.push(`warehouses:`);
  for (const w of obj.warehouses) {
    lines.push(`  - name: ${w.name}`);
    lines.push(`    tier: ${w.tier}`);
    lines.push(`    status: ${w.status}`);
    lines.push(`    repo: ${w.repo}`);
    lines.push(`    last_reviewed: ${w.last_reviewed}`);
    lines.push(`    decay_rate_days: ${w.decay_rate_days}`);
    lines.push(`    discovered_via: ${w.discovered_via}`);
  }
  return lines.join("\n") + "\n";
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
