/**
 * recipe-validity — nightly forge of every recipe to a clean temp dir +
 * verify the emitted app still builds.
 *
 * Per ADR-0008 §4.
 *
 * Phase 5 implementation: validates recipe.yaml shape + THREAT_MODEL.md +
 * DECISIONS.md + cost_envelope presence. The actual clean-room forge step
 * is wired in Phase 5.5 once `nx forge` ships full template emission.
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import type { Finding, RunnerContext, RunnerResult } from "./types.js";

export async function runRecipeValidity(ctx: RunnerContext): Promise<RunnerResult> {
  const start = Date.now();
  const findings: Finding[] = [];

  const recipesDir = join(ctx.cwd, "recipes");
  if (!existsSync(recipesDir)) {
    findings.push({
      category: "recipe-validity",
      severity: "info",
      message: "No recipes/ directory. Recipes ship in Phase 5+.",
      rule: "recipes-dir-presence",
    });
    return result(start, findings);
  }

  const recipeNames = readdirSync(recipesDir).filter((d) =>
    statSync(join(recipesDir, d)).isDirectory(),
  );

  for (const name of recipeNames) {
    const recipeDir = join(recipesDir, name);
    checkRecipeStructure(recipeDir, name, findings);
  }

  return result(start, findings);
}

function checkRecipeStructure(recipeDir: string, name: string, findings: Finding[]): void {
  const required = [
    { file: "recipe.yaml", rule: "recipe-manifest" },
    { file: "THREAT_MODEL.md", rule: "recipe-threat-model" },
    { file: "DECISIONS.md", rule: "recipe-decisions" },
    { file: "templates", rule: "recipe-templates-dir" },
  ];

  for (const { file, rule } of required) {
    const path = join(recipeDir, file);
    if (!existsSync(path)) {
      findings.push({
        category: "recipe-validity",
        severity: "error",
        message: `Recipe "${name}" missing required ${file}`,
        file: `recipes/${name}/${file}`,
        rule,
      });
    }
  }

  const recipePath = join(recipeDir, "recipe.yaml");
  if (existsSync(recipePath)) {
    const content = readFileSync(recipePath, "utf8");

    // Required recipe.yaml fields per RecipeManifest (SCHEMA_AMENDMENTS §5)
    const requiredFields = [
      "schema_version",
      "name",
      "version",
      "description",
      "warehouses",
      "cost_envelope",
      "output_license",
      "emit",
      "threat_model_path",
      "decisions_path",
    ];

    for (const field of requiredFields) {
      if (!content.includes(`${field}:`)) {
        findings.push({
          category: "recipe-validity",
          severity: "error",
          message: `Recipe "${name}" recipe.yaml missing required field "${field}"`,
          file: `recipes/${name}/recipe.yaml`,
          rule: `recipe-field-${field}`,
        });
      }
    }

    // cost_envelope must include hard_caps
    if (content.includes("cost_envelope:") && !content.includes("hard_caps:")) {
      findings.push({
        category: "recipe-validity",
        severity: "error",
        message: `Recipe "${name}" has cost_envelope but no hard_caps (per ADR-0007)`,
        file: `recipes/${name}/recipe.yaml`,
        rule: "recipe-cost-hard-caps",
      });
    }
  }
}

function result(start: number, findings: ReadonlyArray<Finding>): RunnerResult {
  const errors = findings.filter((f) => f.severity === "error").length;
  const warns = findings.filter((f) => f.severity === "warn").length;
  const score = Math.max(0, 100 - errors * 15 - warns * 5);
  return {
    runner: "recipe-validity",
    passed: errors === 0,
    score,
    findings: [...findings],
    duration_ms: Date.now() - start,
  };
}
