import { describe, expect, it } from "vitest";
import {
  DEFAULT_PHASE_MAP,
  isKnownRunner,
  RUNNER_COUNT,
  RunnerId,
  RunnerPhase,
  runnersForPhase,
} from "../src/index.js";

describe("RunnerId registry", () => {
  it("includes the 4 new Nexural-introduced runners (ADR-0008, 0009, 0010)", () => {
    expect(isKnownRunner("federation-conformance")).toBe(true);
    expect(isKnownRunner("recipe-validity")).toBe(true);
    expect(isKnownRunner("prompt-injection-resilience")).toBe(true);
    expect(isKnownRunner("discipline-scorecard")).toBe(true);
    expect(isKnownRunner("golden-set-drift")).toBe(true);
  });

  it("includes core qa-os runners", () => {
    expect(isKnownRunner("vitest")).toBe(true);
    expect(isKnownRunner("gitleaks")).toBe(true);
    expect(isKnownRunner("semgrep")).toBe(true);
  });

  it("rejects unknown runner ids", () => {
    expect(isKnownRunner("does-not-exist")).toBe(false);
    expect(isKnownRunner("")).toBe(false);
  });

  it("DEFAULT_PHASE_MAP covers every runner", () => {
    for (const id of RunnerId.options) {
      expect(DEFAULT_PHASE_MAP[id]).toBeDefined();
      expect(RunnerPhase.options).toContain(DEFAULT_PHASE_MAP[id]);
    }
  });

  it("RUNNER_COUNT matches enum length", () => {
    expect(RUNNER_COUNT).toBe(RunnerId.options.length);
    expect(RUNNER_COUNT).toBeGreaterThan(70); // qa-os v1.0 ships 77+ runners
  });
});

describe("runnersForPhase", () => {
  it("returns fast-phase runners", () => {
    const fast = runnersForPhase("fast");
    expect(fast).toContain("vitest");
    expect(fast).toContain("gitleaks");
    expect(fast).not.toContain("zap");
  });

  it("returns deep-phase runners", () => {
    const deep = runnersForPhase("deep");
    expect(deep).toContain("zap");
    expect(deep).toContain("prompt-injection-resilience");
  });

  it("every runner appears in exactly one phase", () => {
    const all = ["fast", "standard", "thorough", "deep"] as const;
    const totalAcrossPhases = all.map((p) => runnersForPhase(p).length).reduce((a, b) => a + b, 0);
    expect(totalAcrossPhases).toBe(RUNNER_COUNT);
  });
});
