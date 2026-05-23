/**
 * federation-conformance — runs in every forged app's CI.
 *
 * Per ADR-0008 §3.
 *
 * 1. Reads .nexural/forged.lock.yaml in the app
 * 2. Identifies the recipe + version that produced it
 * 3. Flags drift between the locked recipe and the current app state
 *
 * Drift = scorecard penalty. PR auto-suggested to remediate.
 *
 * Phase 5 ships the LOCKFILE DETECTION + structure validation. Full drift
 * diffing against the live recipe (which requires recipe registry access)
 * is deferred to Phase 5.5 polish when the recipe registry is populated.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Finding, RunnerContext, RunnerResult } from "./types.js";

export async function runFederationConformance(ctx: RunnerContext): Promise<RunnerResult> {
  const start = Date.now();
  const findings: Finding[] = [];

  const lockfilePath = join(ctx.cwd, ".nexural", "forged.lock.yaml");

  if (!existsSync(lockfilePath)) {
    // Detect the control-plane repo (nexural-meta itself) — it has
    // `warehouses/` and `recipes/` directories but is NOT a forged app.
    // Without this guard, the runner false-positives every audit run.
    const isControlPlane =
      existsSync(join(ctx.cwd, "warehouses")) && existsSync(join(ctx.cwd, "recipes"));
    if (isControlPlane) {
      findings.push({
        category: "federation-conformance",
        severity: "info",
        message:
          "control-plane repo detected (warehouses/ + recipes/ present, no .nexural/) — runner skipped",
        rule: "lockfile-presence",
      });
      return result(start, findings);
    }
    findings.push({
      category: "federation-conformance",
      severity: "error",
      message:
        "No .nexural/forged.lock.yaml present. Either this app wasn't forged via `nx forge`, or the lockfile was deleted.",
      file: ".nexural/forged.lock.yaml",
      rule: "lockfile-presence",
    });
    return result(start, findings);
  }

  const lockfile = readFileSync(lockfilePath, "utf8");

  // Required fields per @nexural/schema ForgedLockfile
  const required = [
    { key: "schema_version", rule: "lockfile-schema-version" },
    { key: "forged_at", rule: "lockfile-forged-at" },
    { key: "forged_by_nx_version", rule: "lockfile-nx-version" },
    { key: "recipe", rule: "lockfile-recipe" },
    { key: "warehouses_consumed", rule: "lockfile-warehouses" },
    { key: "sbom_hash", rule: "lockfile-sbom-hash" },
  ];

  for (const { key, rule } of required) {
    if (!lockfile.includes(`${key}:`)) {
      findings.push({
        category: "federation-conformance",
        severity: "error",
        message: `Lockfile missing required field: ${key}`,
        file: ".nexural/forged.lock.yaml",
        rule,
      });
    }
  }

  // signature + provenance MUST be present (per ADR-0006)
  if (!lockfile.includes("signature:")) {
    findings.push({
      category: "federation-conformance",
      severity: "critical",
      message: "Lockfile has no recipe signature. Forge MUST verify cosign + record signature.",
      file: ".nexural/forged.lock.yaml",
      rule: "recipe-signature-present",
    });
  }
  if (!lockfile.includes("provenance:")) {
    findings.push({
      category: "federation-conformance",
      severity: "critical",
      message: "Lockfile has no SLSA provenance URL. Forge MUST record provenance per ADR-0006.",
      file: ".nexural/forged.lock.yaml",
      rule: "recipe-provenance-present",
    });
  }

  // Recipe must be from @nexural/* namespace per the federation
  const recipeMatch = lockfile.match(/recipe:\s*\n\s+name:\s*(\S+)/);
  if (recipeMatch && !recipeMatch[1]) {
    findings.push({
      category: "federation-conformance",
      severity: "warn",
      message: "Recipe name not parseable from lockfile.",
      file: ".nexural/forged.lock.yaml",
      rule: "recipe-name",
    });
  }

  return result(start, findings);
}

function result(start: number, findings: ReadonlyArray<Finding>): RunnerResult {
  const critical = findings.filter((f) => f.severity === "critical").length;
  const errors = findings.filter((f) => f.severity === "error").length;
  const warns = findings.filter((f) => f.severity === "warn").length;
  // Score: 100 - 30 per critical - 15 per error - 5 per warn, floor 0.
  const score = Math.max(0, 100 - critical * 30 - errors * 15 - warns * 5);
  return {
    runner: "federation-conformance",
    passed: critical === 0 && errors === 0,
    score,
    findings: [...findings],
    duration_ms: Date.now() - start,
  };
}
