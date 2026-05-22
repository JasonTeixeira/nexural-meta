import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runRecipeValidity } from "../src/recipe-validity.js";

describe("runRecipeValidity", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "qa-rv-"));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("passes with no recipes (Phase <5)", async () => {
    const r = await runRecipeValidity({ cwd: dir });
    expect(r.passed).toBe(true);
    expect(r.findings.some((f) => f.severity === "info")).toBe(true);
  });

  it("passes for a complete recipe", async () => {
    const recipeDir = join(dir, "recipes/saas-mt-baseline");
    mkdirSync(join(recipeDir, "templates"), { recursive: true });
    writeFileSync(
      join(recipeDir, "recipe.yaml"),
      `schema_version: 1
name: saas-mt-baseline
version: 0.1.0
description: Multi-tenant SaaS baseline scaffold for the nexural-factory federation.
warehouses:
  - auth
  - payments
cost_envelope:
  per_request_p50_usd: 0.001
  hard_caps:
    per_request_usd: 0.05
output_license: MIT
emit:
  template_path: templates/
threat_model_path: THREAT_MODEL.md
decisions_path: DECISIONS.md
`,
      "utf8",
    );
    writeFileSync(join(recipeDir, "THREAT_MODEL.md"), "# Threat model\n");
    writeFileSync(join(recipeDir, "DECISIONS.md"), "# Decisions\n");
    const r = await runRecipeValidity({ cwd: dir });
    expect(r.passed).toBe(true);
  });

  it("fails when THREAT_MODEL.md missing", async () => {
    const recipeDir = join(dir, "recipes/x");
    mkdirSync(join(recipeDir, "templates"), { recursive: true });
    writeFileSync(join(recipeDir, "recipe.yaml"), "schema_version: 1\nname: x\n", "utf8");
    writeFileSync(join(recipeDir, "DECISIONS.md"), "");
    const r = await runRecipeValidity({ cwd: dir });
    expect(r.passed).toBe(false);
    expect(r.findings.some((f) => f.rule === "recipe-threat-model")).toBe(true);
  });

  it("fails when cost_envelope lacks hard_caps", async () => {
    const recipeDir = join(dir, "recipes/x");
    mkdirSync(join(recipeDir, "templates"), { recursive: true });
    writeFileSync(
      join(recipeDir, "recipe.yaml"),
      `schema_version: 1
name: x
version: 0.1.0
description: test
warehouses:
  - a
cost_envelope:
  per_request_p50_usd: 0.001
output_license: MIT
emit:
  template_path: templates/
threat_model_path: THREAT_MODEL.md
decisions_path: DECISIONS.md
`,
      "utf8",
    );
    writeFileSync(join(recipeDir, "THREAT_MODEL.md"), "");
    writeFileSync(join(recipeDir, "DECISIONS.md"), "");
    const r = await runRecipeValidity({ cwd: dir });
    expect(r.findings.some((f) => f.rule === "recipe-cost-hard-caps")).toBe(true);
  });
});
