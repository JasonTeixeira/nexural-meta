import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runForgeEmitConformance } from "../src/forge-emit-conformance.js";

/**
 * The conformance runner walks `recipes/` and (per recipe) attempts an
 * emit against the test/fixtures fixture. We build a tiny synthetic repo
 * per test rather than relying on the live monorepo state — that keeps
 * tests deterministic regardless of what's in /recipes/ today.
 */

let workDir: string;

beforeEach(() => {
  workDir = mkdtempSync(join(tmpdir(), "forge-emit-conf-"));
});
afterEach(() => {
  rmSync(workDir, { recursive: true, force: true });
});

function writeFile(path: string, content: string): void {
  const full = join(workDir, path);
  mkdirSync(join(full, ".."), { recursive: true });
  writeFileSync(full, content);
}

const validRecipeYaml = (name: string): string =>
  `
schema_version: 1
name: ${name}
version: 0.1.0
description: A scaffold recipe used in conformance tests, with sufficient length.
output_license: MIT
commercial_restricted_ok: false
composes: []
inputs_schema: inputs.zod.ts
warehouses:
  - architecture
services:
  - id: web
    runtime: nextjs
    language: typescript
    host: vercel
qa_profile: standard
cost_envelope:
  per_request_p50_usd: 0.001
  per_request_p99_usd: 0.01
  monthly_baseline_usd: 5
  hard_caps:
    per_request_usd: 0.05
    per_user_per_day_usd: 1
    per_app_per_day_usd: 10
model_families: []
secrets_required: []
emit:
  template_path: templates/
  pre_emit_hooks: []
  post_emit_hooks: []
threat_model_path: THREAT_MODEL.md
decisions_path: DECISIONS.md
forge_sandbox:
  ignore_scripts: true
  allowed_postinstalls: []
`.trim();

describe("runForgeEmitConformance", () => {
  it("returns passing result when recipes/ is absent", async () => {
    const result = await runForgeEmitConformance({ cwd: workDir });
    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
  });

  it("flags recipes that have no inputs fixture (warn, not error)", async () => {
    writeFile("recipes/sample/recipe.yaml", validRecipeYaml("sample"));
    writeFile("recipes/sample/templates/package.json.template", `{"name":"{{ slug }}"}`);
    const result = await runForgeEmitConformance({ cwd: workDir });
    expect(result.passed).toBe(true); // warn doesn't fail
    expect(result.findings.some((f) => f.rule === "fixture-recommended")).toBe(true);
  });

  it("passes when recipe + fixture + templates all valid", async () => {
    writeFile("recipes/sample/recipe.yaml", validRecipeYaml("sample"));
    writeFile("recipes/sample/templates/package.json.template", `{"name":"{{ slug }}"}`);
    writeFile("test/fixtures/sample.inputs.json", `{}`);
    const result = await runForgeEmitConformance({ cwd: workDir });
    expect(result.passed).toBe(true);
    expect(result.findings.filter((f) => f.severity === "error")).toHaveLength(0);
  });

  it("fails when emit hits an unresolved variable", async () => {
    writeFile("recipes/sample/recipe.yaml", validRecipeYaml("sample"));
    writeFile("recipes/sample/templates/x.ts.template", `// {{ NEVER_DEFINED }}`);
    writeFile("test/fixtures/sample.inputs.json", `{}`);
    const result = await runForgeEmitConformance({ cwd: workDir });
    expect(result.passed).toBe(false);
    expect(result.findings.some((f) => f.rule?.startsWith("emit-"))).toBe(true);
  });

  it("flags malformed JSON fixture as error", async () => {
    writeFile("recipes/sample/recipe.yaml", validRecipeYaml("sample"));
    writeFile("recipes/sample/templates/x.ts.template", `// ok`);
    writeFile("test/fixtures/sample.inputs.json", `{ this is not json }`);
    const result = await runForgeEmitConformance({ cwd: workDir });
    expect(result.passed).toBe(false);
    expect(result.findings.some((f) => f.rule === "inputs-fixture-valid")).toBe(true);
  });

  it("warns when service-bearing recipe emits no anchor file", async () => {
    writeFile("recipes/sample/recipe.yaml", validRecipeYaml("sample"));
    writeFile("recipes/sample/templates/just-a-readme.md.template", `# {{ slug }}`);
    writeFile("test/fixtures/sample.inputs.json", `{}`);
    const result = await runForgeEmitConformance({ cwd: workDir });
    expect(result.findings.some((f) => f.rule === "service-anchor-present")).toBe(true);
  });

  it("flags refuses-to-parse recipe.yaml as error", async () => {
    writeFile("recipes/broken/recipe.yaml", "this: is: not: valid: yaml: at: all");
    const result = await runForgeEmitConformance({ cwd: workDir });
    expect(result.passed).toBe(false);
    expect(result.findings.some((f) => f.rule === "recipe-must-parse")).toBe(true);
  });
});
