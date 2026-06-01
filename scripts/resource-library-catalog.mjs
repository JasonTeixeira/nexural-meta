#!/usr/bin/env node
/**
 * Phase 12/13 resource library catalog and maturity lift queue.
 *
 * Consolidates public-safe resource-map, scorecard, recipe, and proof data into
 * one operator artifact. This is the "what do I use, what do I improve, what is
 * already proven?" layer for the dashboard.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCHEMA_VERSION = 1;
const GENERATED_BY = "scripts/resource-library-catalog.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const DATA_DIR = join(ROOT, "data");
const DOCS_DIR = join(ROOT, "docs");

function main() {
  const generatedAt = new Date().toISOString();
  const scorecard = readJson("data/ecosystem-scorecard.public.json", {
    public_repositories: [],
    totals: {},
  });
  const resourceMap = readJson("data/ecosystem-resource-map.public.json", { use_cases: [] });
  const recipes = readJson("data/recipe-catalog.public.json", { recipes: [], totals: {} });
  const proofEnv = readJson("data/proof-environment.public.json", { status: "missing" });
  const golden = readJson("data/golden-path-runs.public.json", { runs: [], totals: {} });

  const repositories = scorecard.public_repositories ?? [];
  const generatedRecipeAssets = recipes.recipes.map((recipe) => ({
    name: recipe.name,
    layer: "app-factory-runtime",
    asset_type: "recipe",
    maturity: recipe.readiness.proof_backed ? "L4" : recipe.readiness.forge_ready ? "L3" : "L2",
    status: recipe.readiness.forge_ready ? "usable" : "incomplete",
    score: recipe.readiness.score,
    proof: recipe.readiness.proof_backed ? "golden-path" : "catalog-only",
    gaps: recipe.readiness.gaps,
    recommended_use: recipe.description,
  }));

  const libraryAssets = [
    ...repositories.map((repo) => ({
      name: repo.name,
      url: repo.url,
      layer: repo.canonical.layer,
      asset_type: repo.canonical.asset_type,
      maturity: repo.canonical.maturity,
      status: repo.operational.status,
      score: repo.score.total,
      proof: repo.score.gaps.includes("missing-public-proof") ? "missing" : "repo-metadata",
      gaps: repo.score.gaps,
      recommended_use: repo.canonical.role,
      load_bearing: repo.score.load_bearing,
    })),
    ...generatedRecipeAssets,
  ];

  const useCaseRoutes = resourceMap.use_cases.map((useCase) => ({
    id: useCase.id,
    title: useCase.title,
    question: useCase.question,
    command: `/resources?useCase=${encodeURIComponent(useCase.id)}`,
    recommended_assets: useCase.asset_counts?.recommended ?? 0,
    improve_first_assets: useCase.asset_counts?.improve_first ?? 0,
  }));

  const liftQueue = libraryAssets
    .filter((asset) => asset.score < 90)
    .sort((a, b) => priorityWeight(b) - priorityWeight(a) || a.score - b.score)
    .slice(0, 25)
    .map((asset) => ({
      name: asset.name,
      layer: asset.layer,
      asset_type: asset.asset_type,
      current_score: asset.score,
      target_score: asset.load_bearing || asset.asset_type === "recipe" ? 90 : 70,
      reason: chooseReason(asset),
      gaps: asset.gaps.slice(0, 5),
    }));

  const catalog = {
    schema_version: SCHEMA_VERSION,
    generated_at: generatedAt,
    generated_by: GENERATED_BY,
    privacy: "public-safe",
    status: "generated",
    purpose:
      "Unified resource library for choosing reusable engines, kits, recipes, SDKs, playbooks, QA assets, and proof-backed paths.",
    totals: {
      assets: libraryAssets.length,
      use_cases: useCaseRoutes.length,
      recipes: recipes.totals?.recipes ?? recipes.recipes.length,
      proof_backed_recipes: recipes.totals?.proof_backed ?? 0,
      load_bearing_assets: scorecard.totals?.load_bearing_count ?? 0,
      load_bearing_average_score: scorecard.totals?.load_bearing_average_score ?? 0,
      proof_environment_status: proofEnv.status ?? "missing",
      golden_path_passed_runs: golden.totals?.passed_runs ?? 0,
    },
    operator_paths: [
      {
        label: "Build an app",
        start: "/resources?useCase=ship-saas-app",
        proof_required: "golden-path plus hosted health",
      },
      {
        label: "Pick a stack or SDK",
        start: "/resources?useCase=choose-stack-or-sdk",
        proof_required: "scorecard and gap review",
      },
      {
        label: "Release with QA evidence",
        start: "/resources?useCase=qa-release-proof",
        proof_required: "verify-all, proof packet, evidence hash",
      },
      {
        label: "Audit trading infrastructure",
        start: "/resources?useCase=build-trading-system",
        proof_required: "anti-lookahead, walk-forward, overfit checks",
      },
    ],
    use_case_routes: useCaseRoutes,
    maturity_lift_queue: liftQueue,
    top_assets: libraryAssets
      .filter((asset) => asset.score >= 70)
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
      .slice(0, 20),
  };

  mkdirSync(DATA_DIR, { recursive: true });
  mkdirSync(DOCS_DIR, { recursive: true });
  writeJson(join(DATA_DIR, "resource-library.public.json"), catalog);
  writeFileSync(join(DOCS_DIR, "RESOURCE_LIBRARY.md"), renderMarkdown(catalog), "utf8");

  console.error(
    `[resource-library] ${catalog.totals.assets} assets, ` +
      `${catalog.maturity_lift_queue.length} lift actions`,
  );
}

function priorityWeight(asset) {
  let weight = 0;
  if (asset.load_bearing) weight += 100;
  if (asset.asset_type === "recipe") weight += 90;
  if (asset.layer === "control-plane") weight += 60;
  if (asset.layer === "quality-system") weight += 50;
  if (asset.layer === "app-factory-runtime") weight += 50;
  return weight;
}

function chooseReason(asset) {
  if (asset.asset_type === "recipe")
    return "Recipe must be forge-ready and proof-backed before broad reuse.";
  if (asset.load_bearing) return "Load-bearing asset under target maturity.";
  if (asset.gaps.includes("missing-topics"))
    return "Missing metadata makes the ecosystem less legible.";
  if (asset.gaps.includes("missing-public-proof"))
    return "Public claim needs proof before promotion.";
  return "Raise maturity or mark as reference-only.";
}

function renderMarkdown(catalog) {
  const lines = [];
  lines.push("# Resource Library");
  lines.push("");
  lines.push("**Status:** Phase 12/13 generated resource library and maturity lift queue");
  lines.push(`**Generated:** ${catalog.generated_at}`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- Assets: ${catalog.totals.assets}`);
  lines.push(`- Use cases: ${catalog.totals.use_cases}`);
  lines.push(`- Recipes: ${catalog.totals.recipes}`);
  lines.push(`- Proof-backed recipes: ${catalog.totals.proof_backed_recipes}`);
  lines.push(`- Load-bearing average: ${catalog.totals.load_bearing_average_score}/100`);
  lines.push("");
  lines.push("## Operator Paths");
  lines.push("");
  for (const path of catalog.operator_paths) {
    lines.push(`- **${path.label}:** ${path.start} (${path.proof_required})`);
  }
  lines.push("");
  lines.push("## Maturity Lift Queue");
  lines.push("");
  lines.push("| Asset | Layer | Current | Target | Reason |");
  lines.push("| --- | --- | ---: | ---: | --- |");
  for (const item of catalog.maturity_lift_queue.slice(0, 15)) {
    lines.push(
      `| ${item.name} | ${item.layer} | ${item.current_score} | ${item.target_score} | ${item.reason} |`,
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
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

main();
