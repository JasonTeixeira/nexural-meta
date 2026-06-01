#!/usr/bin/env node
/**
 * Phase 11 recipe catalog.
 *
 * Turns recipe manifests into a public-safe readiness map for the operator
 * dashboard. This is intentionally metadata-only: no secrets and no generated
 * app source snapshots.
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCHEMA_VERSION = 1;
const GENERATED_BY = "scripts/recipe-catalog.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const RECIPES_DIR = join(ROOT, "recipes");
const DATA_DIR = join(ROOT, "data");
const DOCS_DIR = join(ROOT, "docs");
const FIXTURES_DIR = join(ROOT, "test", "fixtures");

function main() {
  const generatedAt = new Date().toISOString();
  const recipes = readRecipes();
  const catalog = {
    schema_version: SCHEMA_VERSION,
    generated_at: generatedAt,
    generated_by: GENERATED_BY,
    privacy: "public-safe",
    status: recipes.length >= 8 ? "expanded" : "needs-expansion",
    purpose:
      "Recipe readiness catalog for deciding what the factory can generate, what is proof-backed, and what needs hardening before reuse.",
    totals: {
      recipes: recipes.length,
      forge_ready: recipes.filter((recipe) => recipe.readiness.forge_ready).length,
      proof_backed: recipes.filter((recipe) => recipe.readiness.proof_backed).length,
      needs_fixture: recipes.filter((recipe) => !recipe.readiness.has_fixture).length,
      needs_templates: recipes.filter((recipe) => !recipe.readiness.has_templates).length,
      average_readiness_score: round(avg(recipes.map((recipe) => recipe.readiness.score))),
    },
    coverage: buildCoverage(recipes),
    recipes,
    next_actions: buildNextActions(recipes),
  };

  mkdirSync(DATA_DIR, { recursive: true });
  mkdirSync(DOCS_DIR, { recursive: true });
  writeJson(join(DATA_DIR, "recipe-catalog.public.json"), catalog);
  writeFileSync(join(DOCS_DIR, "RECIPE_CATALOG.md"), renderMarkdown(catalog), "utf8");

  console.error(
    `[recipe-catalog] ${catalog.totals.recipes} recipes, ` +
      `${catalog.totals.forge_ready} forge-ready, ${catalog.totals.proof_backed} proof-backed`,
  );
}

function readRecipes() {
  if (!existsSync(RECIPES_DIR)) return [];
  return readdirSync(RECIPES_DIR)
    .map((name) => join(RECIPES_DIR, name))
    .filter((path) => statSync(path).isDirectory())
    .filter((path) => existsSync(join(path, "recipe.yaml")))
    .map(readRecipe)
    .sort((a, b) => b.readiness.score - a.readiness.score || a.name.localeCompare(b.name));
}

function readRecipe(dir) {
  const name = dir.split(/[\\/]/).at(-1);
  const manifest = readFileSync(join(dir, "recipe.yaml"), "utf8");
  const parsed = parseRecipeManifest(manifest);
  const templatesDir = join(dir, "templates");
  const migrationDir = join(templatesDir, "supabase", "migrations");
  const fixturePath = join(FIXTURES_DIR, `${name}.inputs.json`);
  const hasTemplates = existsSync(templatesDir) && countFiles(templatesDir) > 0;
  const hasFixture = existsSync(fixturePath);
  const hasThreatModel = existsSync(join(dir, parsed.threat_model_path ?? "THREAT_MODEL.md"));
  const hasDecisions = existsSync(join(dir, parsed.decisions_path ?? "DECISIONS.md"));
  const migrationCount = existsSync(migrationDir)
    ? readdirSync(migrationDir).filter((file) => file.endsWith(".sql.template")).length
    : 0;
  const secretCount = countManifestList(manifest, "secrets_required");
  const warehouseCount = countManifestList(manifest, "warehouses");
  const services = parseServices(manifest);
  const scoreParts = {
    manifest: 15,
    templates: hasTemplates ? 20 : 0,
    fixture: hasFixture ? 15 : 0,
    docs: (hasThreatModel ? 10 : 0) + (hasDecisions ? 10 : 0),
    database: migrationCount > 0 ? 10 : 0,
    services: services.length > 0 ? 10 : 0,
    proof: name === "internal-tool-dashboard" ? 20 : 0,
  };
  const score = Object.values(scoreParts).reduce((sum, value) => sum + value, 0);
  const gaps = [];
  if (!hasTemplates) gaps.push("missing-templates");
  if (!hasFixture) gaps.push("missing-fixture");
  if (!hasThreatModel) gaps.push("missing-threat-model");
  if (!hasDecisions) gaps.push("missing-decisions");
  if (migrationCount === 0 && usesDatabase(parsed.warehouses)) gaps.push("missing-db-migrations");
  if (name !== "internal-tool-dashboard") gaps.push("missing-golden-path-proof");

  return {
    name,
    version: parsed.version ?? "0.0.0",
    description: parsed.description ?? "",
    extends: parsed.extends ?? null,
    warehouses: parsed.warehouses,
    services,
    cost_envelope: parsed.cost_envelope,
    secrets_required: secretCount,
    readiness: {
      score,
      band: score >= 90 ? "elite" : score >= 75 ? "strong" : score >= 60 ? "usable" : "incomplete",
      forge_ready: hasTemplates && hasFixture && hasThreatModel && hasDecisions,
      proof_backed: name === "internal-tool-dashboard",
      has_templates: hasTemplates,
      has_fixture: hasFixture,
      has_threat_model: hasThreatModel,
      has_decisions: hasDecisions,
      migration_count: migrationCount,
      gaps,
    },
  };
}

function parseRecipeManifest(text) {
  const out = {
    version: field(text, "version"),
    description: blockOrField(text, "description"),
    extends: field(text, "extends"),
    warehouses: list(text, "warehouses"),
    threat_model_path: field(text, "threat_model_path"),
    decisions_path: field(text, "decisions_path"),
    cost_envelope: {
      per_request_p50_usd: numberField(text, "per_request_p50_usd"),
      per_request_p99_usd: numberField(text, "per_request_p99_usd"),
      monthly_baseline_usd: numberField(text, "monthly_baseline_usd"),
    },
  };
  return out;
}

function parseServices(text) {
  const serviceBlock = section(text, "services");
  if (!serviceBlock) return [];
  const chunks = serviceBlock.split(/\n\s*-\s+id:\s+/).slice(1);
  return chunks.map((chunk) => ({
    id: firstLine(chunk),
    runtime: field(chunk, "runtime") ?? "unknown",
    language: field(chunk, "language") ?? "unknown",
    host: field(chunk, "host") ?? "unknown",
  }));
}

function field(text, key) {
  const match = text.match(new RegExp(`^\\s*${escapeRe(key)}:\\s*(.+)$`, "m"));
  if (!match) return undefined;
  const value = match[1].trim();
  if (value === ">-" || value === "|") return undefined;
  return value.replace(/^["']|["']$/g, "");
}

function blockOrField(text, key) {
  const direct = field(text, key);
  if (direct) return direct;
  const match = text.match(
    new RegExp(`^${escapeRe(key)}:\\s*>-\\s*\\n([\\s\\S]*?)(?=^\\S|$)`, "m"),
  );
  if (!match) return "";
  return match[1]
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ");
}

function list(text, key) {
  const block = section(text, key);
  if (!block) return [];
  return [...block.matchAll(/^\s*-\s+(.+)$/gm)].map((match) => match[1].trim());
}

function section(text, key) {
  const match = text.match(new RegExp(`^${escapeRe(key)}:\\s*\\n([\\s\\S]*?)(?=^\\S|$)`, "m"));
  return match?.[1] ?? "";
}

function numberField(text, key) {
  const value = field(text, key);
  return value === undefined ? null : Number(value);
}

function countManifestList(text, key) {
  return list(text, key).length;
}

function usesDatabase(warehouses) {
  return (
    warehouses.includes("database") || warehouses.includes("storage") || warehouses.includes("auth")
  );
}

function buildCoverage(recipes) {
  const byWarehouse = {};
  const byRuntime = {};
  for (const recipe of recipes) {
    for (const warehouse of recipe.warehouses)
      byWarehouse[warehouse] = (byWarehouse[warehouse] ?? 0) + 1;
    for (const service of recipe.services)
      byRuntime[service.runtime] = (byRuntime[service.runtime] ?? 0) + 1;
  }
  return {
    by_warehouse: sortRecord(byWarehouse),
    by_runtime: sortRecord(byRuntime),
  };
}

function buildNextActions(recipes) {
  const actions = [];
  const proofBacked = recipes.filter((recipe) => recipe.readiness.proof_backed).length;
  const missingFixtures = recipes.filter((recipe) => !recipe.readiness.has_fixture).slice(0, 5);
  const missingProof = recipes.filter((recipe) => !recipe.readiness.proof_backed).slice(0, 5);
  if (proofBacked < Math.min(3, recipes.length)) {
    actions.push({
      action: "Add two more golden-path specs for high-value recipes.",
      reason: `Only ${proofBacked} recipe is proof-backed today.`,
      phase: "Phase 11",
    });
  }
  if (missingFixtures.length > 0) {
    actions.push({
      action: `Add fixtures for ${missingFixtures.map((recipe) => recipe.name).join(", ")}.`,
      reason: "Fixtures make recipe validity automation deterministic.",
      phase: "Phase 11",
    });
  }
  if (missingProof.length > 0) {
    actions.push({
      action: `Promote ${missingProof[0].name} into the next hosted proof run.`,
      reason: "The factory should prove more than one app shape.",
      phase: "Phase 14",
    });
  }
  return actions;
}

function renderMarkdown(catalog) {
  const lines = [];
  lines.push("# Recipe Catalog");
  lines.push("");
  lines.push("**Status:** Phase 11 generated recipe readiness catalog");
  lines.push(`**Generated:** ${catalog.generated_at}`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- Recipes: ${catalog.totals.recipes}`);
  lines.push(`- Forge-ready: ${catalog.totals.forge_ready}`);
  lines.push(`- Proof-backed: ${catalog.totals.proof_backed}`);
  lines.push(`- Average readiness: ${catalog.totals.average_readiness_score}/100`);
  lines.push("");
  lines.push("## Recipes");
  lines.push("");
  lines.push("| Recipe | Score | Band | Forge-ready | Proof-backed | Gaps |");
  lines.push("| --- | ---: | --- | --- | --- | --- |");
  for (const recipe of catalog.recipes) {
    lines.push(
      `| ${recipe.name} | ${recipe.readiness.score} | ${recipe.readiness.band} | ` +
        `${yesNo(recipe.readiness.forge_ready)} | ${yesNo(recipe.readiness.proof_backed)} | ` +
        `${recipe.readiness.gaps.join(", ") || "none"} |`,
    );
  }
  lines.push("");
  lines.push("## Next Actions");
  lines.push("");
  for (const action of catalog.next_actions) {
    lines.push(`- **${action.phase}:** ${action.action} ${action.reason}`);
  }
  return `${lines.join("\n")}\n`;
}

function countFiles(dir) {
  let total = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) total += countFiles(path);
    else if (entry.isFile()) total += 1;
  }
  return total;
}

function sortRecord(record) {
  return Object.fromEntries(
    Object.entries(record).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])),
  );
}

function avg(values) {
  return values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length;
}

function round(value) {
  return Math.round(value * 10) / 10;
}

function firstLine(value) {
  return value.split("\n")[0].trim();
}

function yesNo(value) {
  return value ? "yes" : "no";
}

function escapeRe(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

main();
