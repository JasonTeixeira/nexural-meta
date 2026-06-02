#!/usr/bin/env node
/**
 * Phase 20 daily operating loop.
 *
 * Builds the cockpit queue: what is fresh, what is broken, which recipe to use,
 * and what decision/proof work should happen next.
 */

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const DATA_DIR = join(ROOT, "data");
const DOCS_DIR = join(ROOT, "docs");
const EVIDENCE_DIR = join(ROOT, "evidence", "daily-ops");

function main() {
  const generatedAt = new Date().toISOString();
  const maintenance = readJson("data/ecosystem-maintenance.public.json", {
    summary: {},
    artifacts: [],
    next_actions: [],
  });
  const library = readJson("data/resource-library.public.json", {
    use_case_routes: [],
    maturity_lift_queue: [],
  });
  const recipes = readJson("data/recipe-catalog.public.json", { recipes: [] });
  const proof = readJson("data/public-proof-layer.public.json", { remaining_gaps: [] });

  const stale = (maintenance.artifacts ?? []).filter((item) =>
    ["missing", "stale"].includes(item.status),
  );
  const recipeFreshness = recipes.recipes.map((recipe) => ({
    recipe: recipe.name,
    status: recipe.readiness.proof_backed
      ? "proof-backed"
      : recipe.readiness.forge_ready
        ? "forge-ready"
        : "needs-work",
    score: recipe.readiness.score,
    next_action: recipe.readiness.proof_backed
      ? "Keep in scheduled proof rotation."
      : "Add to dogfood or hosted golden-path proof.",
  }));
  const report = {
    schema_version: 1,
    generated_at: generatedAt,
    generated_by: "scripts/daily-operating-loop.mjs",
    privacy: "public-safe",
    phase: "Phase 20",
    status: stale.length === 0 ? "ready" : "attention-required",
    weekly_proof_refresh: {
      status: maintenance.summary?.status ?? "unknown",
      latest_public_hash: maintenance.summary?.public_proof_packet_hash ?? null,
      hosted_golden_paths: maintenance.summary?.golden_path_hosted_runs ?? 0,
      db_proof_status: maintenance.summary?.db_proof_status ?? "unknown",
    },
    broken_asset_queue: [
      ...stale.map((item) => ({
        severity: item.status === "missing" ? "critical" : "warn",
        item: item.path,
        reason: `${item.id} is ${item.status}.`,
      })),
      ...(maintenance.next_actions ?? []).map((item) => ({
        severity: item.severity ?? "info",
        item: item.action,
        reason: item.evidence,
      })),
    ].slice(0, 25),
    recipe_freshness: recipeFreshness,
    resource_navigation: library.use_case_routes ?? [],
    next_action_recommendations: [
      ...(maintenance.next_actions ?? []).slice(0, 5).map((item) => item.action),
      ...(proof.remaining_gaps ?? []).slice(0, 5),
    ].filter(Boolean),
    architecture_decision_tracking: {
      standard: "All L4/L5 claims need a doc, proof artifact, owner, and refresh path.",
      docs: [
        "docs/MATURITY_LIFT.md",
        "docs/OPERATOR_TEST.md",
        "docs/PUBLIC_PORTFOLIO_PACKAGING.md",
      ],
    },
  };
  report.evidence_hash = hash(report);

  writeJson(join(DATA_DIR, "daily-operating-loop.public.json"), report);
  writeJson(join(EVIDENCE_DIR, "latest.json"), report);
  writeFileSync(join(DOCS_DIR, "DAILY_OPERATING_LOOP.md"), renderMarkdown(report), "utf8");
  console.error(`[daily-ops] ${report.status}: ${report.broken_asset_queue.length} queue item(s)`);
}

function renderMarkdown(report) {
  const lines = [];
  lines.push("# Daily Operating Loop");
  lines.push("");
  lines.push(`**Status:** ${report.status}`);
  lines.push(`**Generated:** ${report.generated_at}`);
  lines.push("");
  lines.push("## Refresh");
  lines.push("");
  lines.push(`- Maintenance: ${report.weekly_proof_refresh.status}`);
  lines.push(`- Hosted golden paths: ${report.weekly_proof_refresh.hosted_golden_paths}`);
  lines.push(`- DB proof: ${report.weekly_proof_refresh.db_proof_status}`);
  lines.push(`- Public hash: \`${report.weekly_proof_refresh.latest_public_hash}\``);
  lines.push("");
  lines.push("## Queue");
  lines.push("");
  if (report.broken_asset_queue.length === 0) {
    lines.push("- None.");
  } else {
    for (const item of report.broken_asset_queue.slice(0, 15)) {
      lines.push(`- **${item.severity}:** ${item.item} - ${item.reason}`);
    }
  }
  return `${lines.join("\n")}\n`;
}

function readJson(path, fallback) {
  const absolute = join(ROOT, path);
  if (!existsSync(absolute)) return fallback;
  try {
    return JSON.parse(readFileSync(absolute, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function hash(value) {
  return `sha256:${createHash("sha256").update(JSON.stringify(value)).digest("hex")}`;
}

main();
