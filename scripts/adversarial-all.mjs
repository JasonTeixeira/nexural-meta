#!/usr/bin/env node
/**
 * Cross-recipe adversarial harness. Phase 11.x stress hardening.
 *
 * For every recipe under `recipes/`, programmatically inject three attack
 * classes + verify each is caught by the matching gate:
 *
 *   1. secret_leak           → emit() throws EmitError(secret_leak)
 *   2. unresolved_variable   → emit() throws EmitError(unresolved_variable)
 *   3. duplicate_path        → composeForRecipe() throws
 *                              ComposeError(duplicate_path_across_warehouses)
 *
 * Writes per-recipe report to evidence/adversarial/<recipe>/report.json.
 * Writes aggregate to evidence/adversarial/aggregate.json.
 *
 * Exit code: 0 if all 3 attacks caught for every recipe; 1 otherwise.
 *
 * This generalizes the saas-multitenant-baseline proof from Phase 6.5 to
 * all 7 recipes at V1.0, closing the doctrinal gap noted in ADR-0012 §4.
 */

import { emit, EmitError } from "../packages/forge-emit/dist/index.js";
import { composeForRecipe, ComposeError } from "../packages/warehouse-base/dist/index.js";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const ROOT = resolve(new URL("..", import.meta.url).pathname);
const RECIPES_DIR = join(ROOT, "recipes");
const EVIDENCE_DIR = join(ROOT, "evidence/adversarial");

function listRecipes() {
  if (!existsSync(RECIPES_DIR)) return [];
  return readdirSync(RECIPES_DIR).filter((name) => {
    const dir = join(RECIPES_DIR, name);
    return statSync(dir).isDirectory() && existsSync(join(dir, "recipe.yaml"));
  });
}

function baseCtx(recipeName) {
  return {
    inputs: { slug: "adv-test", appName: "adv-test" },
    recipe: { name: recipeName, version: "0.1.0" },
    secrets: {},
    forge: {
      slug: "adv-test",
      timestamp: "2026-01-01T00:00:00Z",
      nexuralVersion: "1.0.0",
    },
  };
}

function testSecretLeak(recipeName) {
  const secret = "x".repeat(60);
  const tmpl = {
    sourcePath: "leak.ts",
    targetPath: "leak.ts",
    body: `const k = "${secret}";`,
  };
  try {
    emit([tmpl], { ...baseCtx(recipeName), secrets: { TEST_KEY: secret } });
    return { caught: false, message: "secret leaked unprotected" };
  } catch (err) {
    return {
      caught: err instanceof EmitError && err.code === "secret_leak",
      code: err.code,
      message: err.message.slice(0, 120),
    };
  }
}

function testUnresolvedVar(recipeName) {
  try {
    emit(
      [{ sourcePath: "u.ts", targetPath: "u.ts", body: "// {{ never_defined }}" }],
      baseCtx(recipeName),
    );
    return { caught: false, message: "unresolved variable rendered to output" };
  } catch (err) {
    return {
      caught: err instanceof EmitError && err.code === "unresolved_variable",
      code: err.code,
      message: err.message.slice(0, 120),
    };
  }
}

function testDuplicatePath(recipeName) {
  const work = mkdtempSync(join(tmpdir(), `adv-${recipeName}-`));
  try {
    const mkWh = (name) => {
      const root = join(work, name);
      mkdirSync(root, { recursive: true });
      mkdirSync(join(root, "templates"), { recursive: true });
      writeFileSync(
        join(root, "manifest.yaml"),
        `schema_version: 1
warehouse: ${name}
version: 0.1.0
description: adversarial fixture — should hard-fail at compose time for cross-warehouse path collision.
documents: []
templates:
  - id: x
    source: templates/x.template
    target_path: shared.ts
    consumers: ["*"]
`,
      );
      writeFileSync(join(root, "templates", "x.template"), "// dup");
      return root;
    };
    const a = mkWh("alpha");
    const b = mkWh("beta");
    try {
      composeForRecipe({ warehouseRoots: [a, b], recipeName });
      return { caught: false, message: "duplicate path silently accepted" };
    } catch (err) {
      return {
        caught: err instanceof ComposeError && err.code === "duplicate_path_across_warehouses",
        code: err.code,
        message: err.message.slice(0, 120),
      };
    }
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

function auditRecipe(recipeName) {
  const ranAt = new Date().toISOString();
  const scenarios = [
    {
      id: "secret_leak",
      expected: "EmitError(secret_leak)",
      actual: testSecretLeak(recipeName),
    },
    {
      id: "unresolved_variable",
      expected: "EmitError(unresolved_variable)",
      actual: testUnresolvedVar(recipeName),
    },
    {
      id: "duplicate_path",
      expected: "ComposeError(duplicate_path_across_warehouses)",
      actual: testDuplicatePath(recipeName),
    },
  ];
  const caught = scenarios.filter((s) => s.actual.caught).length;
  const total = scenarios.length;
  return {
    schema_version: 1,
    recipe: recipeName,
    ran_at: ranAt,
    summary: { total, caught, escaped: total - caught, passed: caught === total },
    scenarios,
  };
}

function main() {
  const recipes = listRecipes();
  if (recipes.length === 0) {
    console.error("[adversarial-all] no recipes found under recipes/");
    process.exit(2);
  }

  console.error(`[adversarial-all] auditing ${recipes.length} recipes…`);
  const reports = [];
  for (const recipe of recipes) {
    const report = auditRecipe(recipe);
    const status = report.summary.passed ? "✓" : "✖";
    console.error(
      `[adversarial-all] ${status} ${recipe}: ${report.summary.caught}/${report.summary.total} caught`,
    );
    // Write per-recipe report
    const dir = join(EVIDENCE_DIR, recipe);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "report.json"), JSON.stringify(report, null, 2));
    reports.push(report);
  }

  // Aggregate
  const totalScenarios = reports.reduce((acc, r) => acc + r.summary.total, 0);
  const totalCaught = reports.reduce((acc, r) => acc + r.summary.caught, 0);
  const failingRecipes = reports.filter((r) => !r.summary.passed).map((r) => r.recipe);
  const aggregate = {
    schema_version: 1,
    ran_at: new Date().toISOString(),
    summary: {
      recipes: reports.length,
      total_scenarios: totalScenarios,
      caught: totalCaught,
      escaped: totalScenarios - totalCaught,
      failing_recipes: failingRecipes,
      passed: failingRecipes.length === 0,
    },
    reports,
  };
  mkdirSync(EVIDENCE_DIR, { recursive: true });
  writeFileSync(join(EVIDENCE_DIR, "aggregate.json"), JSON.stringify(aggregate, null, 2));

  console.error("");
  console.error(`[adversarial-all] ${"=".repeat(60)}`);
  console.error(`[adversarial-all] recipes:        ${reports.length}`);
  console.error(`[adversarial-all] scenarios:      ${totalScenarios}`);
  console.error(`[adversarial-all] caught:         ${totalCaught}`);
  console.error(`[adversarial-all] escaped:        ${totalScenarios - totalCaught}`);
  console.error(`[adversarial-all] passed:         ${aggregate.summary.passed ? "yes ✓" : "no ✖"}`);
  if (failingRecipes.length > 0) {
    console.error(`[adversarial-all] failing recipes: ${failingRecipes.join(", ")}`);
  }
  console.error(`[adversarial-all] aggregate:      evidence/adversarial/aggregate.json`);
  console.error(`[adversarial-all] ${"=".repeat(60)}`);

  process.exit(aggregate.summary.passed ? 0 : 1);
}

main();
