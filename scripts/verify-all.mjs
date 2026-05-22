#!/usr/bin/env node
/**
 * verify-all.mjs — runs nexural-qa-os scorecard on every discovered warehouse
 * and emits scorecard.json per ARCHITECTURE §4.2.
 *
 * Strategy: shells out to the `qa` CLI from the sibling `nexural-qa-os` repo.
 * Falls back to a warning if qa-os isn't cloned locally.
 *
 * Usage:
 *   node scripts/verify-all.mjs                  # both registries
 *   node scripts/verify-all.mjs --federation=factory
 *   node scripts/verify-all.mjs --dry-run
 */

import { execFile, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";

const exec = promisify(execFile);

const ARGS = parseArgs(process.argv.slice(2));
const QA_OS_PATH = process.env.NEXURAL_QA_OS_PATH ?? "../nexural-qa-os";

async function main() {
  if (!existsSync(QA_OS_PATH)) {
    console.warn(
      `⚠ nexural-qa-os not found at ${QA_OS_PATH}. Set NEXURAL_QA_OS_PATH or clone it adjacent to nexural-meta.`,
    );
    console.warn(`  (continuing with stub scorecard)`);
  }

  const registries =
    ARGS.federation === "both"
      ? ["registry-factory.yaml", "registry-lifeops.yaml"]
      : [`registry-${ARGS.federation}.yaml`];

  const allResults = [];

  for (const reg of registries) {
    if (!existsSync(reg)) {
      console.warn(`  ${reg} not present yet — run \`pnpm discover\` first.`);
      continue;
    }
    const content = await readFile(reg, "utf8");
    const warehouses = parseWarehouses(content);
    console.log(`→ Verifying ${warehouses.length} warehouses from ${reg}...`);

    for (const w of warehouses) {
      const result = await verifyWarehouse(w);
      allResults.push(result);
    }
  }

  const aggregate = aggregateScorecard(allResults);
  const report = {
    schema_version: 1,
    generated_at: new Date().toISOString(),
    warehouses: allResults,
    aggregate,
  };

  if (ARGS.dryRun) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    await writeFile("scorecard.json", JSON.stringify(report, null, 2) + "\n", "utf8");
    console.log(
      `✓ wrote scorecard.json — ${allResults.length} warehouses, mean ${aggregate.mean_score}`,
    );
  }
}

function parseArgs(argv) {
  const args = { federation: "both", dryRun: false };
  for (const a of argv) {
    if (a.startsWith("--federation=")) args.federation = a.split("=")[1];
    else if (a === "--dry-run") args.dryRun = true;
  }
  return args;
}

function parseWarehouses(yamlContent) {
  // Simple registry parser — emit the entries that have `name`, `repo`, `tier`.
  const entries = [];
  let current = null;
  for (const line of yamlContent.split("\n")) {
    if (line.startsWith("  - name:")) {
      if (current) entries.push(current);
      current = { name: line.split(":")[1].trim() };
    } else if (line.startsWith("    ") && current) {
      const [key, ...rest] = line.trim().split(":");
      current[key] = rest.join(":").trim();
    }
  }
  if (current) entries.push(current);
  return entries;
}

async function verifyWarehouse(warehouse) {
  // Default federation derivation from registry presence.
  const federation = await detectFederation(warehouse);

  if (!existsSync(QA_OS_PATH)) {
    // Stub mode: report a placeholder until qa-os is wired in.
    return {
      name: warehouse.name,
      federation,
      score: 0,
      grade: "F",
      findings: [
        {
          category: "qa-os-unavailable",
          severity: "warn",
          message: `qa-os not installed at ${QA_OS_PATH} — score is a placeholder.`,
        },
      ],
    };
  }

  try {
    const { stdout } = await exec(
      "node",
      [join(QA_OS_PATH, "packages/cli/dist/bin/qa.js"), "score", "--json"],
      { cwd: process.cwd(), timeout: 5 * 60 * 1000 },
    );
    const parsed = JSON.parse(stdout);
    return {
      name: warehouse.name,
      federation,
      score: parsed.score ?? 0,
      grade: parsed.grade ?? scoreToGrade(parsed.score ?? 0),
      findings: parsed.findings ?? [],
    };
  } catch (e) {
    return {
      name: warehouse.name,
      federation,
      score: 0,
      grade: "F",
      findings: [
        {
          category: "qa-os-error",
          severity: "error",
          message: e.message.slice(0, 200),
        },
      ],
    };
  }
}

async function detectFederation(warehouse) {
  // Determined by the registry that contained the entry — caller responsibility.
  // We default by reading from the repo URL convention.
  return "factory";
}

function scoreToGrade(score) {
  if (score >= 95) return "S";
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function aggregateScorecard(results) {
  if (!results.length) {
    return { mean_score: 0, median_score: 0, below_80_count: 0, below_90_count: 0 };
  }
  const scores = results.map((r) => r.score).sort((a, b) => a - b);
  const mean = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const median = scores[Math.floor(scores.length / 2)];
  return {
    mean_score: mean,
    median_score: median,
    below_80_count: scores.filter((s) => s < 80).length,
    below_90_count: scores.filter((s) => s < 90).length,
  };
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
