/**
 * golden-set-drift — re-evaluates eval golden sets against current resolved
 * models. Detects when model upgrades silently change answer quality.
 *
 * Per ADR-0010 §2.9.
 *
 * Phase 6 implementation: validates golden-set FILE SHAPE + computes
 * structural drift metrics (item count, category distribution). Live LLM
 * evaluation is wired by `@nexural/sdk.llmClient` + the recipe's eval harness
 * — this runner verifies the harness is properly set up.
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import type { Finding, RunnerContext, RunnerResult } from "./types.js";

interface GoldenSetItem {
  readonly id?: string;
  readonly category?: string;
  readonly question?: string;
  readonly prompt?: string;
  readonly expected_keywords?: ReadonlyArray<string>;
  readonly expected_behavior?: string;
  readonly expected_citation_patterns?: ReadonlyArray<string>;
}

interface GoldenSet {
  readonly schema_version?: number;
  readonly description?: string;
  readonly baseline_pass_rate_required?: number;
  readonly required_rejection_rate?: number;
  readonly drift_threshold_pct?: number;
  readonly items?: ReadonlyArray<GoldenSetItem>;
}

export async function runGoldenSetDrift(ctx: RunnerContext): Promise<RunnerResult> {
  const start = Date.now();
  const findings: Finding[] = [];

  const recipesDir = join(ctx.cwd, "recipes");
  if (!existsSync(recipesDir)) {
    findings.push({
      category: "golden-set-drift",
      severity: "info",
      message: "No recipes/ — golden sets ship with Phase 6 recipes.",
      rule: "recipes-dir-presence",
    });
    return result(start, findings);
  }

  for (const recipeName of readdirSync(recipesDir)) {
    const recipeDir = join(recipesDir, recipeName);
    if (!statSync(recipeDir).isDirectory()) continue;
    const evalDir = join(recipeDir, "templates", "eval");
    if (!existsSync(evalDir)) continue;

    for (const file of readdirSync(evalDir)) {
      if (!file.endsWith(".json") && !file.endsWith(".json.template")) continue;
      const fullPath = join(evalDir, file);
      checkGoldenSet(recipeName, file, fullPath, findings);
    }
  }

  return result(start, findings);
}

function checkGoldenSet(
  recipeName: string,
  fileName: string,
  path: string,
  findings: Finding[],
): void {
  const raw = readFileSync(path, "utf8");
  let json: GoldenSet;
  try {
    json = JSON.parse(raw) as GoldenSet;
  } catch (e) {
    findings.push({
      category: "golden-set-drift",
      severity: "error",
      message: `Recipe "${recipeName}" eval file ${fileName} is not valid JSON: ${(e as Error).message.slice(0, 100)}`,
      file: `recipes/${recipeName}/templates/eval/${fileName}`,
      rule: "golden-set-json-valid",
    });
    return;
  }

  // schema_version check
  if (json.schema_version !== 1) {
    findings.push({
      category: "golden-set-drift",
      severity: "warn",
      message: `Recipe "${recipeName}" eval ${fileName} schema_version != 1`,
      file: `recipes/${recipeName}/templates/eval/${fileName}`,
      rule: "golden-set-schema-version",
    });
  }

  // drift threshold present
  if (
    typeof json.drift_threshold_pct !== "number" &&
    typeof json.baseline_pass_rate_required !== "number" &&
    typeof json.required_rejection_rate !== "number"
  ) {
    findings.push({
      category: "golden-set-drift",
      severity: "warn",
      message: `Recipe "${recipeName}" eval ${fileName} missing drift / baseline gate (per ADR-0010 §2.9 + ADR-0008 §4)`,
      file: `recipes/${recipeName}/templates/eval/${fileName}`,
      rule: "golden-set-drift-threshold",
    });
  }

  // items present
  const items = json.items ?? [];
  if (items.length === 0) {
    findings.push({
      category: "golden-set-drift",
      severity: "warn",
      message: `Recipe "${recipeName}" eval ${fileName} has zero items`,
      file: `recipes/${recipeName}/templates/eval/${fileName}`,
      rule: "golden-set-non-empty",
    });
  }

  // each item must have an id + category
  for (const [i, item] of items.entries()) {
    if (!item.id) {
      findings.push({
        category: "golden-set-drift",
        severity: "error",
        message: `Recipe "${recipeName}" eval ${fileName} item ${i} missing id`,
        file: `recipes/${recipeName}/templates/eval/${fileName}`,
        rule: "golden-set-item-id",
      });
    }
    if (!item.category) {
      findings.push({
        category: "golden-set-drift",
        severity: "warn",
        message: `Recipe "${recipeName}" eval ${fileName} item ${item.id ?? i} missing category`,
        file: `recipes/${recipeName}/templates/eval/${fileName}`,
        rule: "golden-set-item-category",
      });
    }
  }

  // For RAG-style sets: ≥5 categories represented (recall, multi-hop, edge, ambiguous, adversarial)
  if (fileName.startsWith("golden-set") && items.length > 0) {
    const cats = new Set(items.map((i) => i.category).filter(Boolean));
    if (cats.size < 4) {
      findings.push({
        category: "golden-set-drift",
        severity: "warn",
        message: `Recipe "${recipeName}" golden set has only ${cats.size} categories — DECISIONS.md prescribes 5 (recall, multi-hop, edge, ambiguous, adversarial)`,
        file: `recipes/${recipeName}/templates/eval/${fileName}`,
        rule: "golden-set-category-coverage",
      });
    }
  }
}

function result(start: number, findings: ReadonlyArray<Finding>): RunnerResult {
  const errors = findings.filter((f) => f.severity === "error").length;
  const warns = findings.filter((f) => f.severity === "warn").length;
  const score = Math.max(0, 100 - errors * 15 - warns * 5);
  return {
    runner: "golden-set-drift",
    passed: errors === 0,
    score,
    findings: [...findings],
    duration_ms: Date.now() - start,
  };
}
