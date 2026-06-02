#!/usr/bin/env node
/**
 * Phase 17 operator testing pass.
 *
 * Treats the Engineering OS as an internal app-factory product and verifies the
 * navigation/proof surfaces an operator would depend on before building more.
 */

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCHEMA_VERSION = 1;
const GENERATED_BY = "scripts/operator-test-pass.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const DATA_DIR = join(ROOT, "data");
const DOCS_DIR = join(ROOT, "docs");
const EVIDENCE_DIR = join(ROOT, "evidence", "operator-test");

const DASHBOARD_ROUTES = [
  "/",
  "/resources",
  "/recipes",
  "/golden-path",
  "/proof-environment",
  "/db-proof",
  "/public-proof",
  "/ecosystem",
  "/scorecard",
  "/factory",
  "/health",
];

function main() {
  const generatedAt = new Date().toISOString();
  const resourceMap = readJson("data/ecosystem-resource-map.public.json", { use_cases: [] });
  const recipeCatalog = readJson("data/recipe-catalog.public.json", { totals: {}, recipes: [] });
  const resourceLibrary = readJson("data/resource-library.public.json", {
    operator_paths: [],
    maturity_lift_queue: [],
    totals: {},
  });
  const goldenPath = readJson("data/golden-path-runs.public.json", { totals: {}, runs: [] });
  const proofEnv = readJson("data/proof-environment.public.json", { status: "missing" });
  const dbProof = readJson("data/db-proof.public.json", { status: "missing", summary: {} });
  const maintenance = readJson("data/ecosystem-maintenance.public.json", {
    next_actions: [],
    summary: {},
  });

  const checks = [
    check(
      "resource-question-routing",
      "Operator can answer what should I build with X.",
      resourceMap.use_cases.some((item) => item.id === "ship-saas-app") &&
        resourceMap.use_cases.some((item) => item.id === "choose-stack-or-sdk"),
      `${resourceMap.use_cases.length} resource use cases indexed.`,
    ),
    check(
      "recipe-selection",
      "Operator can choose from a serious recipe catalog.",
      recipeCatalog.totals.recipes >= 8 &&
        recipeCatalog.totals.forge_ready >= 8 &&
        recipeCatalog.totals.proof_backed >= 3,
      `${recipeCatalog.totals.recipes ?? 0} recipes, ${
        recipeCatalog.totals.forge_ready ?? 0
      } forge-ready, ${recipeCatalog.totals.proof_backed ?? 0} proof-backed.`,
    ),
    check(
      "proof-consistency",
      "Recipe proof count matches hosted golden-path evidence.",
      recipeCatalog.totals.proof_backed === goldenPath.totals.proof_backed_recipes,
      `catalog=${recipeCatalog.totals.proof_backed ?? 0}, golden=${
        goldenPath.totals.proof_backed_recipes ?? 0
      }.`,
    ),
    check(
      "dashboard-navigation",
      "Dashboard has the expected operator pages.",
      DASHBOARD_ROUTES.every((route) => routeExists(route)),
      `${DASHBOARD_ROUTES.filter(routeExists).length}/${DASHBOARD_ROUTES.length} routes present.`,
    ),
    check(
      "proof-artifacts",
      "Golden path, proof env, DB proof, and public packet are usable.",
      goldenPath.totals.hosted_runs >= 3 &&
        proofEnv.status === "passed" &&
        dbProof.status === "passed" &&
        existsSync(join(ROOT, "data", "public-proof-layer.public.json")),
      `${goldenPath.totals.hosted_runs ?? 0} hosted runs, env=${proofEnv.status}, db=${
        dbProof.status
      }.`,
    ),
    check(
      "db-proof-depth",
      "DB proof includes CRUD, schema drift, and seed-data checks.",
      dbProof.summary?.hosted_crud_status === "passed" &&
        dbProof.summary?.schema_drift_status === "passed" &&
        dbProof.summary?.seed_data_status === "passed",
      `crud=${dbProof.summary?.hosted_crud_status ?? "missing"}, schema=${
        dbProof.summary?.schema_drift_status ?? "missing"
      }, seed=${dbProof.summary?.seed_data_status ?? "missing"}.`,
    ),
    check(
      "maintenance-refresh",
      "Maintenance loop exposes freshness and next actions.",
      Boolean(maintenance.summary?.status) &&
        Array.isArray(maintenance.next_actions) &&
        existsSync(join(ROOT, "docs", "ECOSYSTEM_MAINTENANCE.md")),
      `maintenance=${maintenance.summary?.status ?? "missing"}, actions=${
        maintenance.next_actions?.length ?? 0
      }.`,
    ),
    check(
      "failure-clarity",
      "Operator can see what to fix first.",
      resourceLibrary.maturity_lift_queue.length > 0 && resourceLibrary.operator_paths.length >= 4,
      `${resourceLibrary.maturity_lift_queue.length} lift items, ${
        resourceLibrary.operator_paths.length
      } operator paths.`,
    ),
  ];

  const report = {
    schema_version: SCHEMA_VERSION,
    generated_at: generatedAt,
    generated_by: GENERATED_BY,
    privacy: "public-safe",
    phase: "Phase 17",
    status: checks.every((item) => item.status === "passed") ? "passed" : "failed",
    summary: {
      checks_total: checks.length,
      checks_passed: checks.filter((item) => item.status === "passed").length,
      dashboard_routes: DASHBOARD_ROUTES.length,
      recipes_indexed: recipeCatalog.totals.recipes ?? 0,
      proof_backed_recipes: recipeCatalog.totals.proof_backed ?? 0,
      hosted_golden_paths: goldenPath.totals.hosted_runs ?? 0,
      db_proof_status: dbProof.status,
    },
    checks,
    operator_scenarios: [
      "What should I use to ship a SaaS app?",
      "Which recipe should I start from?",
      "Is the generated app proof backed by live DB/runtime evidence?",
      "What asset should be improved first?",
      "What failed, what is stale, and what should the operator do next?",
    ],
  };
  report.evidence_hash = hash(report);

  writeJson(join(DATA_DIR, "operator-test.public.json"), report);
  writeJson(join(EVIDENCE_DIR, "latest.json"), report);
  writeFileSync(join(DOCS_DIR, "OPERATOR_TEST.md"), renderMarkdown(report), "utf8");

  console.error(
    `[operator-test] ${report.status}: ${report.summary.checks_passed}/${report.summary.checks_total} checks`,
  );
  if (report.status !== "passed") process.exit(1);
}

function check(id, label, passed, detail) {
  return { id, label, status: passed ? "passed" : "failed", detail };
}

function routeExists(route) {
  const relative = route === "/" ? "page.tsx" : `${route.slice(1)}/page.tsx`;
  return existsSync(join(ROOT, "apps", "dashboard", "src", "app", relative));
}

function renderMarkdown(report) {
  const lines = [];
  lines.push("# Operator Test Pass");
  lines.push("");
  lines.push(`**Status:** ${report.status}`);
  lines.push(`**Generated:** ${report.generated_at}`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- Checks: ${report.summary.checks_passed}/${report.summary.checks_total}`);
  lines.push(`- Recipes indexed: ${report.summary.recipes_indexed}`);
  lines.push(`- Proof-backed recipes: ${report.summary.proof_backed_recipes}`);
  lines.push(`- Hosted golden paths: ${report.summary.hosted_golden_paths}`);
  lines.push(`- DB proof: ${report.summary.db_proof_status}`);
  lines.push(`- Evidence hash: \`${report.evidence_hash}\``);
  lines.push("");
  lines.push("## Checks");
  lines.push("");
  lines.push("| Check | Status | Detail |");
  lines.push("| --- | --- | --- |");
  for (const item of report.checks) {
    lines.push(`| ${item.label} | ${item.status} | ${item.detail} |`);
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
