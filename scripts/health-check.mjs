#!/usr/bin/env node
/**
 * Federation health check. Phase 11.6 per ADR-0012 §5.
 *
 * Runs all 5 federation qa-os runners against the current working tree
 * and writes a structured report to evidence/health/<ISO-date>.json.
 *
 * Cron via .github/workflows/health-check.yml (added separately) — but
 * the script itself runs anywhere: locally for spot-checks, in CI for
 * the nightly snapshot, by external automation.
 *
 * Exit code:
 *   0 — all runners passed (no errors; warnings ok)
 *   1 — any runner emitted an error-severity finding
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const RUNNERS = [
  { name: "federation-conformance", fn: "runFederationConformance" },
  { name: "recipe-validity", fn: "runRecipeValidity" },
  { name: "prompt-injection-resilience", fn: "runPromptInjectionResilience" },
  { name: "golden-set-drift", fn: "runGoldenSetDrift" },
  { name: "forge-emit-conformance", fn: "runForgeEmitConformance" },
];

const HERE = dirname(fileURLToPath(import.meta.url));
const FEDERATION_DIST = pathToFileURL(
  resolve(HERE, "../packages/qa-runners-federation/dist/index.js"),
).href;

async function main() {
  const cwd = process.cwd();
  const startedAt = new Date().toISOString();
  console.error(`[health-check] starting at ${startedAt} (cwd=${cwd})`);

  const results = [];
  const ctx = { cwd };

  // Import the local-workspace dist directly. Avoids needing the package
  // hoisted to root node_modules for the script to resolve.
  const lib = await import(FEDERATION_DIST);

  for (const r of RUNNERS) {
    const fn = lib[r.fn];
    if (typeof fn !== "function") {
      console.error(`[health-check] ✖ ${r.name}: not exported as ${r.fn}`);
      results.push({
        runner: r.name,
        passed: false,
        score: 0,
        findings: [
          { category: "harness", severity: "error", message: `runner not found: ${r.fn}` },
        ],
        duration_ms: 0,
      });
      continue;
    }
    try {
      const result = await fn(ctx);
      const ok = result.passed ? "✓" : "✖";
      console.error(
        `[health-check] ${ok} ${r.name}: score=${result.score} findings=${result.findings.length} (${result.duration_ms}ms)`,
      );
      results.push(result);
    } catch (err) {
      console.error(`[health-check] ✖ ${r.name}: threw — ${err.message}`);
      results.push({
        runner: r.name,
        passed: false,
        score: 0,
        findings: [{ category: "harness", severity: "error", message: err.message ?? String(err) }],
        duration_ms: 0,
      });
    }
  }

  // Aggregate
  const errors = results.flatMap((r) =>
    r.findings.filter((f) => f.severity === "error" || f.severity === "critical"),
  );
  const warnings = results.flatMap((r) => r.findings.filter((f) => f.severity === "warn"));
  const score =
    results.length > 0
      ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length)
      : 0;
  const passed = errors.length === 0;
  const finishedAt = new Date().toISOString();

  const report = {
    schema_version: 1,
    started_at: startedAt,
    finished_at: finishedAt,
    federation_root: cwd,
    summary: {
      runners: results.length,
      avg_score: score,
      errors: errors.length,
      warnings: warnings.length,
      passed,
    },
    runners: results,
  };

  // Write
  const outDir = resolve(cwd, "evidence/health");
  mkdirSync(outDir, { recursive: true });
  const isoDate = startedAt.replace(/[:.]/g, "-");
  const outPath = join(outDir, `${isoDate}.json`);
  writeFileSync(outPath, JSON.stringify(report, null, 2));

  // Also write a `latest.json` pointer for the dashboard
  writeFileSync(join(outDir, "latest.json"), JSON.stringify(report, null, 2));

  console.error("");
  console.error(`[health-check] ====================================`);
  console.error(`[health-check] runners:    ${results.length}`);
  console.error(`[health-check] avg score:  ${score}/100`);
  console.error(`[health-check] errors:     ${errors.length}`);
  console.error(`[health-check] warnings:   ${warnings.length}`);
  console.error(`[health-check] passed:     ${passed ? "yes ✓" : "no ✖"}`);
  console.error(`[health-check] report:     ${outPath}`);
  console.error(`[health-check] ====================================`);

  process.exit(passed ? 0 : 1);
}

main().catch((err) => {
  console.error("[health-check] fatal:", err);
  process.exit(2);
});
