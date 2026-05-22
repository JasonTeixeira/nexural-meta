import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runGoldenSetDrift } from "../src/golden-set-drift.js";

function setupRecipeWithEval(root: string, recipeName: string, content: unknown): void {
  const evalDir = join(root, "recipes", recipeName, "templates", "eval");
  mkdirSync(evalDir, { recursive: true });
  writeFileSync(join(evalDir, "golden-set.json"), JSON.stringify(content), "utf8");
}

describe("runGoldenSetDrift", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "qa-gsd-"));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("passes for a complete golden set", async () => {
    setupRecipeWithEval(dir, "saas-rag-chat", {
      schema_version: 1,
      description: "Test",
      baseline_pass_rate_required: 0.8,
      drift_threshold_pct: 5,
      items: [
        { id: "r-1", category: "factual-recall", question: "x" },
        { id: "r-2", category: "multi-hop", question: "y" },
        { id: "r-3", category: "edge-case", question: "z" },
        { id: "r-4", category: "ambiguous", question: "a" },
        { id: "r-5", category: "adversarial", question: "b" },
      ],
    });
    const r = await runGoldenSetDrift({ cwd: dir });
    expect(r.passed).toBe(true);
    expect(r.score).toBe(100);
  });

  it("warns when fewer than 4 categories", async () => {
    setupRecipeWithEval(dir, "x", {
      schema_version: 1,
      drift_threshold_pct: 5,
      items: [
        { id: "1", category: "factual-recall", question: "x" },
        { id: "2", category: "factual-recall", question: "y" },
      ],
    });
    const r = await runGoldenSetDrift({ cwd: dir });
    expect(r.findings.some((f) => f.rule === "golden-set-category-coverage")).toBe(true);
  });

  it("errors on missing id", async () => {
    setupRecipeWithEval(dir, "x", {
      schema_version: 1,
      drift_threshold_pct: 5,
      items: [{ category: "recall", question: "x" }],
    });
    const r = await runGoldenSetDrift({ cwd: dir });
    expect(r.passed).toBe(false);
    expect(r.findings.some((f) => f.rule === "golden-set-item-id")).toBe(true);
  });

  it("warns when no drift threshold present", async () => {
    setupRecipeWithEval(dir, "x", {
      schema_version: 1,
      items: [{ id: "1", category: "recall" }],
    });
    const r = await runGoldenSetDrift({ cwd: dir });
    expect(r.findings.some((f) => f.rule === "golden-set-drift-threshold")).toBe(true);
  });

  it("errors on malformed JSON", async () => {
    const evalDir = join(dir, "recipes/x/templates/eval");
    mkdirSync(evalDir, { recursive: true });
    writeFileSync(join(evalDir, "golden-set.json"), "{not valid json", "utf8");
    const r = await runGoldenSetDrift({ cwd: dir });
    expect(r.passed).toBe(false);
    expect(r.findings.some((f) => f.rule === "golden-set-json-valid")).toBe(true);
  });

  it("passes informational when no recipes exist", async () => {
    const r = await runGoldenSetDrift({ cwd: dir });
    expect(r.passed).toBe(true);
    expect(r.findings.some((f) => f.severity === "info")).toBe(true);
  });
});
