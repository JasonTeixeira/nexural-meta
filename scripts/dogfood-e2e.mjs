#!/usr/bin/env node
/**
 * Phase 21 hard E2E dogfood.
 *
 * Forges multiple non-golden recipes without hand editing, then runs install,
 * typecheck, and build in each generated app. This is intentionally explicit
 * and heavier than the daily maintenance loop.
 */

import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const DATA_DIR = join(ROOT, "data");
const DOCS_DIR = join(ROOT, "docs");
const EVIDENCE_DIR = join(ROOT, "evidence", "dogfood");
const CACHE_DIR = join(ROOT, ".nexural", "cache", "dogfood");
const isWindows = process.platform === "win32";
const pnpmBin = isWindows ? "pnpm.cmd" : "pnpm";
const npxBin = isWindows ? "npx.cmd" : "npx";

const TARGETS = ["marketplace-starter", "analytics-workbench", "agent-workflow-app"];

function main() {
  const generatedAt = new Date().toISOString();
  const runId = `dogfood-${stamp(generatedAt)}`;
  const runRoot = join(CACHE_DIR, runId);
  rmSync(runRoot, { recursive: true, force: true });
  mkdirSync(runRoot, { recursive: true });

  const results = TARGETS.map((recipe) => runRecipe(recipe, runRoot));
  const report = {
    schema_version: 1,
    generated_at: generatedAt,
    generated_by: "scripts/dogfood-e2e.mjs",
    privacy: "public-safe",
    phase: "Phase 21",
    run_id: runId,
    status: results.every((item) => item.status === "passed") ? "passed" : "failed",
    summary: {
      recipes_total: results.length,
      recipes_passed: results.filter((item) => item.status === "passed").length,
      gates_total: results.reduce((sum, item) => sum + item.gates.length, 0),
      gates_passed: results.reduce(
        (sum, item) => sum + item.gates.filter((gate) => gate.status === "passed").length,
        0,
      ),
    },
    results: maskPaths(results),
  };
  report.evidence_hash = hash(report);

  writeJson(join(DATA_DIR, "dogfood-e2e.public.json"), report);
  writeJson(join(EVIDENCE_DIR, "latest.json"), report);
  writeFileSync(join(DOCS_DIR, "DOGFOOD_E2E.md"), renderMarkdown(report), "utf8");
  console.error(
    `[dogfood-e2e] ${report.status}: ${report.summary.recipes_passed}/${report.summary.recipes_total} recipes`,
  );
  if (report.status !== "passed") process.exit(1);
}

function runRecipe(recipe, runRoot) {
  const fixture = join(ROOT, "test", "fixtures", `${recipe}.inputs.json`);
  const appRoot = join(runRoot, recipe);
  const gates = [];
  gates.push(gate("fixture", existsSync(fixture), `fixture=${relativeSafe(fixture)}`));
  if (gates.at(-1).status !== "passed")
    return { recipe, status: "failed", app_root: appRoot, gates };

  const forge = run(npxBin, [
    "--yes",
    "tsx",
    "apps/cli/src/bin/nx.ts",
    "forge",
    recipe,
    recipe,
    "--inputs",
    fixture,
    "--mock-secrets",
    "--out-dir",
    appRoot,
  ]);
  gates.push(commandGate("forge", forge));
  if (forge.status !== 0) return { recipe, status: "failed", app_root: appRoot, gates };

  const install = run(pnpmBin, ["install", "--ignore-workspace", "--ignore-scripts"], {
    cwd: appRoot,
    timeoutMs: 300_000,
  });
  gates.push(commandGate("install", install));
  if (install.status !== 0) return { recipe, status: "failed", app_root: appRoot, gates };

  const typecheck = run(pnpmBin, ["typecheck"], { cwd: appRoot, timeoutMs: 180_000 });
  gates.push(commandGate("typecheck", typecheck));
  if (typecheck.status !== 0) return { recipe, status: "failed", app_root: appRoot, gates };

  const build = run(pnpmBin, ["build"], { cwd: appRoot, timeoutMs: 300_000 });
  gates.push(commandGate("build", build));
  return {
    recipe,
    status: gates.every((item) => item.status === "passed") ? "passed" : "failed",
    app_root: appRoot,
    gates,
  };
}

function run(command, args, options = {}) {
  const started = Date.now();
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? ROOT,
    shell: isWindows,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: options.timeoutMs ?? 120_000,
    env: { ...process.env, CI: "1" },
  });
  return {
    command: [command, ...args].join(" "),
    status: result.status ?? 1,
    duration_ms: Date.now() - started,
    stdout_tail: tail(result.stdout),
    stderr_tail: tail(result.stderr),
  };
}

function gate(id, passed, detail) {
  return { id, status: passed ? "passed" : "failed", detail };
}

function commandGate(id, result) {
  return {
    id,
    status: result.status === 0 ? "passed" : "failed",
    detail: result.status === 0 ? "exit 0" : `exit ${result.status}`,
    command: maskPaths(result.command),
    duration_ms: result.duration_ms,
    stderr_tail: tail(result.stderr_tail),
  };
}

function renderMarkdown(report) {
  const lines = [];
  lines.push("# Dogfood E2E");
  lines.push("");
  lines.push(`**Status:** ${report.status}`);
  lines.push(`**Generated:** ${report.generated_at}`);
  lines.push(`**Run:** \`${report.run_id}\``);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- Recipes: ${report.summary.recipes_passed}/${report.summary.recipes_total}`);
  lines.push(`- Gates: ${report.summary.gates_passed}/${report.summary.gates_total}`);
  lines.push(`- Evidence hash: \`${report.evidence_hash}\``);
  lines.push("");
  lines.push("## Results");
  lines.push("");
  lines.push("| Recipe | Status | Gates |");
  lines.push("| --- | --- | ---: |");
  for (const result of report.results) {
    lines.push(
      `| ${result.recipe} | ${result.status} | ${
        result.gates.filter((gate) => gate.status === "passed").length
      }/${result.gates.length} |`,
    );
  }
  return `${lines.join("\n")}\n`;
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function maskPaths(value) {
  if (typeof value === "string") return value.split(ROOT).join("<repo>");
  if (Array.isArray(value)) return value.map(maskPaths);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, maskPaths(item)]));
  }
  return value;
}

function relativeSafe(path) {
  return path.split(ROOT).join("<repo>");
}

function tail(value, max = 2500) {
  const text = String(value ?? "");
  return text.length > max ? text.slice(-max) : text;
}

function hash(value) {
  return `sha256:${createHash("sha256").update(JSON.stringify(value)).digest("hex")}`;
}

function stamp(iso) {
  return iso.replaceAll(":", "").replaceAll(".", "").replace("Z", "Z");
}

main();
