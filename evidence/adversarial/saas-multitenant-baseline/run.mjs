#!/usr/bin/env node
/**
 * Adversarial proof harness for the saas-multitenant-baseline vertical slice.
 * Per ADR-0011 §1 (gate 6: adversarial proof).
 *
 * Each scenario deliberately breaks the recipe in a known way and asserts
 * the matching defensive gate fires. If any scenario silently succeeds,
 * Phase 6.5 ship is blocked.
 *
 * Run: `node evidence/adversarial/saas-multitenant-baseline/run.mjs`
 */

import { emit, EmitError } from "../../../packages/forge-emit/dist/index.js";
import { composeForRecipe, ComposeError } from "../../../packages/warehouse-base/dist/index.js";
import { writeFileSync, mkdtempSync, rmSync, mkdirSync, writeFileSync as wf } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const scenarios = [];

function record(name, expected, actual) {
  scenarios.push({
    name,
    expected,
    caught: actual.caught,
    code: actual.code,
    message: actual.message,
  });
  const status = actual.caught ? "✓ CAUGHT" : "✗ ESCAPED";
  console.log(`${status} ${name} — expected: ${expected}`);
  if (actual.caught) console.log(`         got: ${actual.code} — ${actual.message.slice(0, 80)}`);
  else console.log(`         emitted ${actual.fileCount ?? 0} files without flagging`);
}

const baseCtx = {
  inputs: { slug: "adversarial-test", appName: "adversarial" },
  recipe: { name: "saas-multitenant-baseline", version: "0.1.0" },
  secrets: {},
  forge: { slug: "adversarial-test", timestamp: "2026-05-22T00:00:00Z", nexuralVersion: "0.1.0" },
};

// ── Scenario 1: secret leak ─────────────────────────────────────────────────
{
  const tplBody = `const k = "${"x".repeat(50)}";`;
  try {
    const r = emit([{ sourcePath: "leak.ts", targetPath: "leak.ts", body: tplBody }], {
      ...baseCtx,
      secrets: { TEST_KEY: "x".repeat(50) },
    });
    record("secret_leak", "EmitError(secret_leak)", { caught: false, fileCount: r.files.length });
  } catch (err) {
    record("secret_leak", "EmitError(secret_leak)", {
      caught: err instanceof EmitError && err.code === "secret_leak",
      code: err.code,
      message: err.message,
    });
  }
}

// ── Scenario 2: unresolved variable ─────────────────────────────────────────
{
  try {
    const r = emit(
      [{ sourcePath: "x.ts", targetPath: "x.ts", body: "// {{ never_defined }}" }],
      baseCtx,
    );
    record("unresolved_variable", "EmitError(unresolved_variable)", {
      caught: false,
      fileCount: r.files.length,
    });
  } catch (err) {
    record("unresolved_variable", "EmitError(unresolved_variable)", {
      caught: err instanceof EmitError && err.code === "unresolved_variable",
      code: err.code,
      message: err.message,
    });
  }
}

// ── Scenario 3: duplicate path across warehouses ────────────────────────────
{
  const work = mkdtempSync(join(tmpdir(), "adversarial-"));
  try {
    const mkWh = (name, target) => {
      const root = join(work, name);
      mkdirSync(root, { recursive: true });
      mkdirSync(join(root, "templates"), { recursive: true });
      wf(
        join(root, "manifest.yaml"),
        `schema_version: 1
warehouse: ${name}
version: 0.1.0
description: adversarial fixture — should hard-fail at compose time.
documents: []
templates:
  - id: x
    source: templates/x.template
    target_path: ${target}
    consumers: ["*"]
`,
      );
      wf(join(root, "templates", "x.template"), "// dup");
      return root;
    };
    const a = mkWh("alpha", "shared.ts");
    const b = mkWh("beta", "shared.ts");
    try {
      composeForRecipe({ warehouseRoots: [a, b], recipeName: "any" });
      record("duplicate_path", "ComposeError(duplicate_path_across_warehouses)", {
        caught: false,
      });
    } catch (err) {
      record("duplicate_path", "ComposeError(duplicate_path_across_warehouses)", {
        caught: err instanceof ComposeError && err.code === "duplicate_path_across_warehouses",
        code: err.code,
        message: err.message,
      });
    }
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

// ── Final report ────────────────────────────────────────────────────────────
const escapes = scenarios.filter((s) => !s.caught);
const summary = {
  ran_at: new Date().toISOString(),
  recipe: "saas-multitenant-baseline",
  scenarios,
  total: scenarios.length,
  caught: scenarios.filter((s) => s.caught).length,
  escaped: escapes.length,
  passed: escapes.length === 0,
};

const out = new URL("./report.json", import.meta.url);
writeFileSync(out, JSON.stringify(summary, null, 2));
console.log("");
console.log(
  `Summary: ${summary.caught}/${summary.total} caught — ${summary.passed ? "PASS" : "FAIL"}`,
);
console.log(`Report:  ${out.pathname}`);
process.exit(summary.passed ? 0 : 1);
