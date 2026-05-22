import { describe, expect, it } from "vitest";
import { DEFAULT_TOKEN_BUDGET, estimateTokens, trimToBudget } from "../src/token-budget.js";
import type { CitedSnippet } from "../src/envelope.js";

function s(name: string, tokens: number, relevance: number): CitedSnippet {
  return { warehouse: name, id: name, content: "x".repeat(tokens * 4), relevance, tokens };
}

describe("trimToBudget", () => {
  it("keeps everything when under budget", () => {
    const snippets = [s("a", 100, 0.9), s("b", 200, 0.8)];
    const r = trimToBudget(snippets, 1000);
    expect(r.kept).toHaveLength(2);
    expect(r.trimmed).toHaveLength(0);
    expect(r.totalTokensKept).toBe(300);
  });

  it("drops lowest-relevance first to fit budget", () => {
    const snippets = [s("high", 600, 0.9), s("mid", 400, 0.6), s("low", 300, 0.2)];
    // Budget 1000 → keep high (600) + mid (400) = 1000; drop low.
    const r = trimToBudget(snippets, 1000);
    expect(r.kept.map((k) => k.warehouse)).toEqual(["high", "mid"]);
    expect(r.trimmed.map((t) => t.warehouse)).toEqual(["low"]);
  });

  it("respects default budget when none provided", () => {
    const r = trimToBudget([s("a", 1000, 0.9)]);
    expect(r.budget).toBe(DEFAULT_TOKEN_BUDGET);
  });

  it("drops a single oversize snippet entirely", () => {
    const r = trimToBudget([s("big", 50_000, 1.0)], 32_000);
    expect(r.kept).toHaveLength(0);
    expect(r.trimmed).toHaveLength(1);
  });

  it("handles empty input", () => {
    const r = trimToBudget([], 1000);
    expect(r.kept).toEqual([]);
    expect(r.totalTokensKept).toBe(0);
  });
});

describe("estimateTokens", () => {
  it("approximates ~4 chars per token", () => {
    expect(estimateTokens("")).toBe(0);
    expect(estimateTokens("abcd")).toBe(1);
    expect(estimateTokens("a".repeat(100))).toBe(25);
  });
});
