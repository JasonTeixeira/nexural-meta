#!/usr/bin/env node
/**
 * Phase 19 maturity lift plan.
 *
 * Generates the concrete queue required to move the load-bearing ecosystem from
 * good to elite without pretending scores improved before work is done.
 */

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const DATA_DIR = join(ROOT, "data");
const DOCS_DIR = join(ROOT, "docs");
const EVIDENCE_DIR = join(ROOT, "evidence", "maturity-lift");

function main() {
  const generatedAt = new Date().toISOString();
  const scorecard = readJson("data/ecosystem-scorecard.public.json", {
    public_repositories: [],
    totals: {},
  });
  const resourceLibrary = readJson("data/resource-library.public.json", {
    maturity_lift_queue: [],
    totals: {},
  });
  const recipes = readJson("data/recipe-catalog.public.json", { recipes: [], totals: {} });

  const loadBearing = (scorecard.public_repositories ?? []).filter(
    (repo) => repo.score?.load_bearing,
  );
  const current =
    scorecard.totals?.load_bearing_average_score ??
    average(loadBearing.map((repo) => repo.score?.total));
  const repoTargets = loadBearing
    .filter((repo) => repo.score.total < 90)
    .sort((a, b) => a.score.total - b.score.total || a.name.localeCompare(b.name))
    .slice(0, 20)
    .map((repo) => ({
      asset: repo.name,
      layer: repo.canonical.layer,
      current_score: repo.score.total,
      target_score: 90,
      missing: repo.score.gaps.slice(0, 6),
      required_work: workItems(repo.score.gaps),
    }));
  const recipeTargets = recipes.recipes
    .filter((recipe) => recipe.readiness.score < 90 || !recipe.readiness.proof_backed)
    .slice(0, 10)
    .map((recipe) => ({
      asset: recipe.name,
      layer: "app-factory-runtime",
      current_score: recipe.readiness.score,
      target_score: 90,
      missing: recipe.readiness.gaps,
      required_work: workItems(recipe.readiness.gaps),
    }));
  const queue = [...repoTargets, ...recipeTargets];

  const report = {
    schema_version: 1,
    generated_at: generatedAt,
    generated_by: "scripts/maturity-lift-plan.mjs",
    privacy: "public-safe",
    phase: "Phase 19",
    status: current >= 90 ? "elite" : current >= 85 ? "near-elite" : "lift-required",
    summary: {
      current_load_bearing_average: current,
      target_1: 85,
      target_2: 90,
      load_bearing_assets: loadBearing.length,
      lift_items: queue.length,
      resource_library_queue_items: resourceLibrary.maturity_lift_queue?.length ?? 0,
    },
    l4_l5_operating_standard: {
      l4: [
        "Public-safe docs explain purpose, ownership, and usage.",
        "Automated health or proof artifact exists.",
        "Known gaps are explicit and routed to an owner.",
        "Example or recipe path proves reuse.",
      ],
      l5: [
        "Hosted proof or CI evidence refreshes on schedule.",
        "E2E path covers build, runtime, data, and failure behavior.",
        "Security/secrets posture is documented and machine checked.",
        "Maintenance queue keeps freshness and maturity from drifting.",
      ],
    },
    lift_queue: queue,
    score_model_note:
      "This report does not inflate maturity scores. It defines the work required to raise the scorecard in subsequent proof refreshes.",
  };
  report.evidence_hash = hash(report);

  writeJson(join(DATA_DIR, "maturity-lift.public.json"), report);
  writeJson(join(EVIDENCE_DIR, "latest.json"), report);
  writeFileSync(join(DOCS_DIR, "MATURITY_LIFT.md"), renderMarkdown(report), "utf8");
  console.error(`[maturity-lift] ${report.status}: ${queue.length} lift items`);
}

function workItems(gaps) {
  const items = [];
  if (gaps.includes("missing-readme") || gaps.includes("missing-docs"))
    items.push("Add concise operator docs with setup, proof, and ownership.");
  if (gaps.includes("missing-tests")) items.push("Add smoke or contract tests.");
  if (gaps.includes("missing-public-proof") || gaps.includes("missing-golden-path-proof"))
    items.push("Attach public-safe proof evidence.");
  if (gaps.includes("missing-topics")) items.push("Add searchable repo metadata/topics.");
  if (gaps.includes("missing-fixture")) items.push("Add deterministic factory fixture.");
  if (gaps.includes("missing-db-migrations")) items.push("Add migration or mark database-free.");
  return items.length > 0
    ? items
    : ["Review maturity gap and either improve or mark reference-only."];
}

function renderMarkdown(report) {
  const lines = [];
  lines.push("# Maturity Lift");
  lines.push("");
  lines.push(`**Status:** ${report.status}`);
  lines.push(`**Generated:** ${report.generated_at}`);
  lines.push("");
  lines.push("## Targets");
  lines.push("");
  lines.push(`- Current load-bearing average: ${report.summary.current_load_bearing_average}/100`);
  lines.push("- Target 1: 85/100");
  lines.push("- Target 2: 90/100");
  lines.push(`- Lift items: ${report.summary.lift_items}`);
  lines.push("");
  lines.push("## Queue");
  lines.push("");
  lines.push("| Asset | Layer | Current | Target | Work |");
  lines.push("| --- | --- | ---: | ---: | --- |");
  for (const item of report.lift_queue.slice(0, 25)) {
    lines.push(
      `| ${item.asset} | ${item.layer} | ${item.current_score} | ${item.target_score} | ${item.required_work.join("; ")} |`,
    );
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

function average(values) {
  const clean = values.filter((value) => Number.isFinite(value));
  if (clean.length === 0) return 0;
  return Math.round(clean.reduce((sum, value) => sum + value, 0) / clean.length);
}

function hash(value) {
  return `sha256:${createHash("sha256").update(JSON.stringify(value)).digest("hex")}`;
}

main();
