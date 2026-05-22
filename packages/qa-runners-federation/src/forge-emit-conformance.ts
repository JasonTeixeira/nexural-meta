/**
 * forge-emit-conformance — 5th federation runner. Per ADR-0011.
 *
 * For each recipe under `recipes/<name>/`:
 *   1. Verifies recipe.yaml parses (delegates to @nexural/factory.loadRecipe)
 *   2. Verifies the recipe has a fixture inputs file at
 *      `test/fixtures/<recipe>.inputs.json` (Phase 6.5: lenient — warning, not
 *      error, when missing; Phase 7+ will hard-fail).
 *   3. Loads templates from `recipes/<name>/<emit.template_path>/` and
 *      simulates an emit() through @nexural/forge-emit with the fixture.
 *      Asserts:
 *        - emit succeeds
 *        - no unresolved {{ }} markers remain in any rendered file
 *        - no path traversal or duplicate paths
 *        - the rendered tree contains a recipe-appropriate minimum
 *          (at minimum: package.json or fly.toml or a service-shaped file)
 *
 * This is the gate that prevents "scaffold drift" — recipe changes that
 * break the emit path without anyone noticing because nothing has been
 * forged in a while.
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { parse as parseYaml } from "yaml";
import { emit, type EmitContext, type TemplateFile } from "@nexural/forge-emit";
import { loadRecipe } from "@nexural/factory";
import { RevokedRecipesList } from "@nexural/schema";
import type { Finding, RunnerContext, RunnerResult } from "./types.js";

const BINARY_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".ico",
  ".pdf",
  ".zip",
  ".woff",
  ".woff2",
  ".ttf",
  ".otf",
]);

const TEMPLATE_MARKER = /\{\{[^}]*\}\}/;

interface RecipeAudit {
  readonly name: string;
  readonly findings: ReadonlyArray<Finding>;
  readonly emitted: number;
}

export async function runForgeEmitConformance(ctx: RunnerContext): Promise<RunnerResult> {
  const start = Date.now();
  const findings: Finding[] = [];

  const recipesDir = join(ctx.cwd, "recipes");
  if (!existsSync(recipesDir)) {
    return {
      runner: "forge-emit-conformance",
      passed: true,
      score: 100,
      findings: [
        {
          category: "discovery",
          severity: "info",
          message: "no recipes/ directory found — runner skipped",
        },
      ],
      duration_ms: Date.now() - start,
    };
  }

  const recipeNames = readdirSync(recipesDir)
    .filter((name) => statSync(join(recipesDir, name)).isDirectory())
    .filter((name) => existsSync(join(recipesDir, name, "recipe.yaml")));

  if (recipeNames.length === 0) {
    findings.push({
      category: "discovery",
      severity: "info",
      message: "recipes/ is empty",
    });
    return resultOf("forge-emit-conformance", findings, start);
  }

  const revocationList = loadRevocationList(ctx.cwd);

  for (const recipeName of recipeNames) {
    const audit = auditRecipe(ctx.cwd, recipeName, revocationList);
    findings.push(...audit.findings);
  }

  return resultOf("forge-emit-conformance", findings, start);
}

function auditRecipe(
  cwd: string,
  recipeName: string,
  revocationList: import("@nexural/schema").RevokedRecipesList,
): RecipeAudit {
  const findings: Finding[] = [];
  const recipeDir = join(cwd, "recipes", recipeName);
  const recipeYamlPath = join(recipeDir, "recipe.yaml");

  // 1. Recipe parse + revocation
  let recipe;
  try {
    const rawRecipe = parseYaml(readFileSync(recipeYamlPath, "utf8"));
    const result = loadRecipe(rawRecipe, revocationList);
    recipe = result.recipe;
  } catch (err) {
    findings.push({
      category: "recipe-load",
      severity: "error",
      message: `${recipeName}: failed to load recipe — ${(err as Error).message}`,
      file: relative(cwd, recipeYamlPath),
      rule: "recipe-must-parse",
    });
    return { name: recipeName, findings, emitted: 0 };
  }

  // 2. Inputs fixture
  const fixturePath = join(cwd, "test/fixtures", `${recipeName}.inputs.json`);
  let inputs: Record<string, unknown> = {};
  if (existsSync(fixturePath)) {
    try {
      inputs = JSON.parse(readFileSync(fixturePath, "utf8")) as Record<string, unknown>;
    } catch (err) {
      findings.push({
        category: "inputs-fixture",
        severity: "error",
        message: `${recipeName}: fixture at ${relative(cwd, fixturePath)} is not valid JSON: ${(err as Error).message}`,
        file: relative(cwd, fixturePath),
        rule: "inputs-fixture-valid",
      });
      return { name: recipeName, findings, emitted: 0 };
    }
  } else {
    // Phase 6.5: warning, not error. Some scaffold recipes won't have
    // fixtures yet; flag so they're authored before Phase 7.
    findings.push({
      category: "inputs-fixture",
      severity: "warn",
      message: `${recipeName}: no fixture at test/fixtures/${recipeName}.inputs.json — emit conformance skipped`,
      rule: "fixture-recommended",
    });
    return { name: recipeName, findings, emitted: 0 };
  }

  // 3. Load templates
  const templatesRoot = join(recipeDir, recipe.emit.template_path);
  if (!existsSync(templatesRoot)) {
    findings.push({
      category: "templates",
      severity: "warn",
      message: `${recipeName}: declared template_path "${recipe.emit.template_path}" does not exist`,
      file: relative(cwd, recipeYamlPath),
      rule: "templates-must-exist",
    });
    return { name: recipeName, findings, emitted: 0 };
  }
  const templates = loadTemplatesSync(templatesRoot);
  if (templates.length === 0) {
    findings.push({
      category: "templates",
      severity: "warn",
      message: `${recipeName}: template directory exists but contains no files`,
      rule: "templates-must-have-content",
    });
    return { name: recipeName, findings, emitted: 0 };
  }

  // 4. Build mock context + emit
  const ctx: EmitContext = {
    inputs: enrichInputs(inputs, recipe, "conformance-test"),
    recipe: {
      name: recipe.name,
      version: recipe.version,
      description: recipe.description,
    },
    secrets: mockSecrets(recipe.secrets_required),
    forge: {
      slug: "conformance-test",
      timestamp: "2026-01-01T00:00:00Z",
      nexuralVersion: "0.1.0",
    },
  };

  let emitResult;
  try {
    emitResult = emit(templates, ctx);
  } catch (err) {
    const e = err as { code?: string; message: string; sourcePath?: string };
    findings.push({
      category: "emit",
      severity: "error",
      message: `${recipeName}: emit failed — ${e.message}`,
      file: e.sourcePath ? relative(cwd, join(templatesRoot, e.sourcePath)) : undefined,
      rule: `emit-${e.code ?? "unknown"}`,
    });
    return { name: recipeName, findings, emitted: 0 };
  }

  // 5. Post-emit invariants
  for (const file of emitResult.files) {
    if (typeof file.content === "string" && TEMPLATE_MARKER.test(file.content)) {
      findings.push({
        category: "emit",
        severity: "error",
        message: `${recipeName}: rendered file "${file.path}" still contains "{{...}}" markers`,
        file: file.path,
        rule: "no-unresolved-markers",
      });
    }
  }

  // 6. Minimal service-shape sanity check — at least one of the
  // recipe-appropriate "this app actually exists" anchor files.
  const hasAnchor = emitResult.files.some((f) =>
    ["package.json", "fly.toml", "pyproject.toml", "go.mod", "Cargo.toml"].some(
      (anchor) => f.path === anchor || f.path.endsWith(`/${anchor}`),
    ),
  );
  if (!hasAnchor && recipe.services.length > 0) {
    findings.push({
      category: "emit",
      severity: "warn",
      message: `${recipeName}: emitted tree has no service anchor (package.json/fly.toml/pyproject.toml/etc)`,
      rule: "service-anchor-present",
    });
  }

  // 7. Surface emit-time warnings as info-level findings (visibility only).
  for (const w of emitResult.warnings) {
    findings.push({
      category: "emit-warning",
      severity: "info",
      message: `${recipeName}: ${w.code} — ${w.message}`,
      file: w.source,
      rule: `emit-${w.code}`,
    });
  }

  return { name: recipeName, findings, emitted: emitResult.files.length };
}

// ── helpers ─────────────────────────────────────────────────────────────────

function loadTemplatesSync(root: string): TemplateFile[] {
  const files: TemplateFile[] = [];
  function walk(dir: string): void {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!entry.isFile()) continue;
      const sourcePath = relative(root, full).split(sep).join("/");
      const targetPath = sourcePath.replace(/\.template$/, "");
      const dot = targetPath.lastIndexOf(".");
      const isBinary = dot >= 0 && BINARY_EXTENSIONS.has(targetPath.slice(dot).toLowerCase());
      files.push({
        sourcePath,
        targetPath,
        body: isBinary ? "" : readFileSync(full, "utf8"),
        binary: isBinary,
      });
    }
  }
  walk(root);
  return files;
}

function loadRevocationList(cwd: string): import("@nexural/schema").RevokedRecipesList {
  const path = join(cwd, "security/revoked-recipes.yaml");
  const empty = {
    schema_version: 1 as const,
    generated_at: new Date().toISOString(),
    entries: [],
  };
  if (!existsSync(path)) return empty;
  const raw = parseYaml(readFileSync(path, "utf8"));
  if (raw === null || raw === undefined) return empty;
  const parsed = RevokedRecipesList.safeParse(raw);
  return parsed.success ? parsed.data : empty;
}

function mockSecrets(declared: ReadonlyArray<{ target_var: string }>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const s of declared) {
    out[s.target_var] = `MOCK_${s.target_var}_conformance_only`;
  }
  return out;
}

function enrichInputs(
  inputs: Record<string, unknown>,
  recipe: import("@nexural/schema").RecipeManifest,
  slug: string,
): Record<string, unknown> {
  return {
    ...inputs,
    slug,
    forgedAt: "2026-01-01T00:00:00Z",
    outputLicense: recipe.output_license,
    nexuralVersion: "0.1.0",
    recipeName: recipe.name,
    recipeVersion: recipe.version,
  };
}

function resultOf(name: string, findings: Finding[], start: number): RunnerResult {
  const errorCount = findings.filter(
    (f) => f.severity === "error" || f.severity === "critical",
  ).length;
  const warnCount = findings.filter((f) => f.severity === "warn").length;
  const passed = errorCount === 0;
  const score = Math.max(0, 100 - errorCount * 20 - warnCount * 5);
  return {
    runner: name,
    passed,
    score,
    findings,
    duration_ms: Date.now() - start,
  };
}
