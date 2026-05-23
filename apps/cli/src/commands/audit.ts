/**
 * `nx audit` — federation-wide stress check.
 *
 * Single command that answers "is the federation OK?" by running:
 *   1. All 5 federation qa-os runners
 *   2. Adversarial proof across all recipes (3 attack classes each)
 *   3. Forge dry-run for every recipe that has a fixture
 *
 * Writes a structured report to evidence/audit/<ISO-date>.json + a
 * `latest.json` pointer for the dashboard.
 *
 * Exit code: 0 if everything passes; 1 if any errors; 2 on harness error.
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { NexuralConfig } from "../config.js";

export interface AuditOptions {
  /** Skip the adversarial harness (faster local checks). */
  readonly skipAdversarial?: boolean;
  /** Skip forge dry-runs. */
  readonly skipForge?: boolean;
  /** Output JSON only — no human-readable summary. */
  readonly json?: boolean;
}

type Severity = "info" | "warn" | "error" | "critical";

interface FindingShape {
  severity: Severity;
  category: string;
  message: string;
}

interface SectionReport {
  readonly name: string;
  readonly passed: boolean;
  readonly score: number;
  readonly findings: FindingShape[];
  readonly duration_ms: number;
}

interface AuditReport {
  readonly schema_version: 1;
  readonly started_at: string;
  readonly finished_at: string;
  readonly federation_root: string;
  readonly summary: {
    readonly sections: number;
    readonly avg_score: number;
    readonly errors: number;
    readonly warnings: number;
    readonly passed: boolean;
  };
  readonly sections: ReadonlyArray<SectionReport>;
}

export async function runAudit(_config: NexuralConfig, opts: AuditOptions = {}): Promise<void> {
  const cwd = process.cwd();
  const startedAt = new Date().toISOString();
  const sections: SectionReport[] = [];

  if (!opts.json) {
    console.error(`[audit] starting at ${startedAt}`);
    console.error(`[audit] federation root: ${cwd}`);
    console.error("");
  }

  // ── Federation runners ───────────────────────────────────────────────────
  const runnerStart = Date.now();
  const runnerResults = await runFederationRunners(cwd);
  for (const r of runnerResults) {
    sections.push({
      name: `runner:${r.runner}`,
      passed: r.passed,
      score: r.score,
      findings: r.findings as FindingShape[],
      duration_ms: r.duration_ms,
    });
    if (!opts.json) {
      const icon = r.passed ? "✓" : "✖";
      const errCount = r.findings.filter((f) => f.severity === "error").length;
      const warnCount = r.findings.filter((f) => f.severity === "warn").length;
      console.error(
        `[audit] ${icon} runner:${r.runner}  score=${r.score}/100  errors=${errCount} warns=${warnCount}`,
      );
    }
  }
  if (!opts.json) {
    console.error(`[audit] runners total: ${Date.now() - runnerStart}ms`);
    console.error("");
  }

  // ── Adversarial harness ──────────────────────────────────────────────────
  if (!opts.skipAdversarial) {
    const advStart = Date.now();
    const adv = await runAdversarialHarness(cwd);
    sections.push(adv);
    if (!opts.json) {
      const icon = adv.passed ? "✓" : "✖";
      console.error(
        `[audit] ${icon} ${adv.name}  score=${adv.score}/100  findings=${adv.findings.length}  (${Date.now() - advStart}ms)`,
      );
      console.error("");
    }
  }

  // ── Forge dry-runs ───────────────────────────────────────────────────────
  if (!opts.skipForge) {
    const forgeStart = Date.now();
    const forge = await runForgeDryRuns(cwd);
    sections.push(forge);
    if (!opts.json) {
      const icon = forge.passed ? "✓" : "✖";
      console.error(
        `[audit] ${icon} ${forge.name}  score=${forge.score}/100  findings=${forge.findings.length}  (${Date.now() - forgeStart}ms)`,
      );
      console.error("");
    }
  }

  // ── Aggregate + write ────────────────────────────────────────────────────
  const errorCount = sections.reduce(
    (acc, s) =>
      acc + s.findings.filter((f) => f.severity === "error" || f.severity === "critical").length,
    0,
  );
  const warnCount = sections.reduce(
    (acc, s) => acc + s.findings.filter((f) => f.severity === "warn").length,
    0,
  );
  const avgScore =
    sections.length > 0
      ? Math.round(sections.reduce((acc, s) => acc + s.score, 0) / sections.length)
      : 0;
  const passed = errorCount === 0;
  const finishedAt = new Date().toISOString();

  const report: AuditReport = {
    schema_version: 1,
    started_at: startedAt,
    finished_at: finishedAt,
    federation_root: cwd,
    summary: {
      sections: sections.length,
      avg_score: avgScore,
      errors: errorCount,
      warnings: warnCount,
      passed,
    },
    sections,
  };

  const outDir = resolve(cwd, "evidence/audit");
  mkdirSync(outDir, { recursive: true });
  const isoDate = startedAt.replace(/[:.]/g, "-");
  writeFileSync(join(outDir, `${isoDate}.json`), JSON.stringify(report, null, 2));
  writeFileSync(join(outDir, "latest.json"), JSON.stringify(report, null, 2));

  if (opts.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.error(`[audit] ${"=".repeat(60)}`);
    console.error(`[audit] sections:  ${sections.length}`);
    console.error(`[audit] avg score: ${avgScore}/100`);
    console.error(`[audit] errors:    ${errorCount}`);
    console.error(`[audit] warnings:  ${warnCount}`);
    console.error(`[audit] passed:    ${passed ? "yes ✓" : "no ✖"}`);
    console.error(`[audit] report:    evidence/audit/latest.json`);
    console.error(`[audit] ${"=".repeat(60)}`);
  }

  if (!passed) process.exitCode = 1;
}

// ── helpers ────────────────────────────────────────────────────────────────

async function runFederationRunners(cwd: string): Promise<
  Array<{
    runner: string;
    passed: boolean;
    score: number;
    findings: FindingShape[];
    duration_ms: number;
  }>
> {
  const HERE = dirname(fileURLToPath(import.meta.url));
  // Resolve from the running CLI's perspective. apps/cli/dist or apps/cli/src.
  const candidates = [
    resolve(HERE, "../../../packages/qa-runners-federation/dist/index.js"),
    resolve(HERE, "../../packages/qa-runners-federation/dist/index.js"),
    resolve(cwd, "packages/qa-runners-federation/dist/index.js"),
  ];
  let mod: Record<string, unknown> | undefined;
  for (const c of candidates) {
    try {
      mod = (await import(pathToFileURL(c).href)) as Record<string, unknown>;
      break;
    } catch {
      // try next
    }
  }
  if (!mod) {
    throw new Error(
      "could not load @nexural/qa-runners-federation/dist/index.js — run `pnpm --filter @nexural/qa-runners-federation build` first",
    );
  }

  const RUNNERS: Array<{ key: string; fn: string }> = [
    { key: "federation-conformance", fn: "runFederationConformance" },
    { key: "recipe-validity", fn: "runRecipeValidity" },
    { key: "prompt-injection-resilience", fn: "runPromptInjectionResilience" },
    { key: "golden-set-drift", fn: "runGoldenSetDrift" },
    { key: "forge-emit-conformance", fn: "runForgeEmitConformance" },
  ];

  const results = [];
  for (const r of RUNNERS) {
    const fn = mod[r.fn] as ((ctx: { cwd: string }) => Promise<unknown>) | undefined;
    if (typeof fn !== "function") {
      results.push({
        runner: r.key,
        passed: false,
        score: 0,
        findings: [
          {
            severity: "error" as const,
            category: "harness",
            message: `function ${r.fn} not exported`,
          },
        ],
        duration_ms: 0,
      });
      continue;
    }
    try {
      const result = (await fn({ cwd })) as {
        passed: boolean;
        score: number;
        findings: FindingShape[];
        duration_ms: number;
      };
      results.push({ runner: r.key, ...result });
    } catch (err) {
      results.push({
        runner: r.key,
        passed: false,
        score: 0,
        findings: [
          { severity: "error" as const, category: "harness", message: (err as Error).message },
        ],
        duration_ms: 0,
      });
    }
  }
  return results;
}

async function runAdversarialHarness(cwd: string): Promise<SectionReport> {
  const start = Date.now();
  const script = resolve(cwd, "scripts/adversarial-all.mjs");
  try {
    execFileSync("node", [script], { cwd, stdio: ["ignore", "pipe", "pipe"] });
    // Parse the aggregate file
    const aggregatePath = resolve(cwd, "evidence/adversarial/aggregate.json");
    const aggregate = JSON.parse((await import("node:fs")).readFileSync(aggregatePath, "utf8")) as {
      summary: {
        total_scenarios: number;
        caught: number;
        passed: boolean;
        failing_recipes: string[];
      };
    };
    const findings: FindingShape[] = [];
    if (!aggregate.summary.passed) {
      for (const recipe of aggregate.summary.failing_recipes) {
        findings.push({
          severity: "error",
          category: "adversarial",
          message: `${recipe}: not all attack classes caught`,
        });
      }
    }
    const score =
      aggregate.summary.total_scenarios > 0
        ? Math.round((aggregate.summary.caught / aggregate.summary.total_scenarios) * 100)
        : 100;
    return {
      name: "adversarial-cross-recipe",
      passed: aggregate.summary.passed,
      score,
      findings,
      duration_ms: Date.now() - start,
    };
  } catch (err) {
    return {
      name: "adversarial-cross-recipe",
      passed: false,
      score: 0,
      findings: [
        { severity: "error", category: "harness", message: (err as Error).message.slice(0, 200) },
      ],
      duration_ms: Date.now() - start,
    };
  }
}

async function runForgeDryRuns(cwd: string): Promise<SectionReport> {
  const start = Date.now();
  const fs = await import("node:fs");
  const recipesDir = resolve(cwd, "recipes");
  if (!fs.existsSync(recipesDir)) {
    return {
      name: "forge-dry-runs",
      passed: true,
      score: 100,
      findings: [],
      duration_ms: 0,
    };
  }
  const findings: FindingShape[] = [];
  let attempted = 0;
  let succeeded = 0;
  for (const recipe of fs.readdirSync(recipesDir)) {
    const recipeYaml = join(recipesDir, recipe, "recipe.yaml");
    if (!fs.existsSync(recipeYaml)) continue;
    const fixture = join(cwd, "test/fixtures", `${recipe}.inputs.json`);
    if (!fs.existsSync(fixture)) {
      findings.push({
        severity: "info",
        category: "forge-dry-run",
        message: `${recipe}: no fixture, skipped`,
      });
      continue;
    }
    attempted++;
    // Spawn forge via tsx — recipes that extend a parent reference
    // `../parent/inputs.zod.js` which only exists as source. tsx
    // intercepts the .js→.ts mapping. This matches the dev workflow.
    try {
      execFileSync(
        "npx",
        [
          "--yes",
          "tsx",
          resolve(cwd, "apps/cli/src/bin/nx.ts"),
          "forge",
          recipe,
          `${recipe.slice(0, 30)}-audit`,
          `--inputs=${fixture}`,
          "--dry-run",
        ],
        { cwd, stdio: ["ignore", "pipe", "pipe"], timeout: 60_000 },
      );
      succeeded++;
    } catch (err) {
      findings.push({
        severity: "error",
        category: "forge-dry-run",
        message: `${recipe}: dry-run failed — ${(err as Error).message.slice(0, 160)}`,
      });
    }
  }
  const score = attempted > 0 ? Math.round((succeeded / attempted) * 100) : 100;
  return {
    name: "forge-dry-runs",
    passed: succeeded === attempted,
    score,
    findings,
    duration_ms: Date.now() - start,
  };
}
