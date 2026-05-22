import { describe, expect, it } from "vitest";
import type { ModelFamilyResolution } from "@nexural/schema";
import {
  estimateCostUsd,
  listFamilies,
  REGISTRY,
  resolveChain,
  resolveFamily,
} from "../src/index.js";

describe("REGISTRY", () => {
  it("contains expected providers", () => {
    const families = REGISTRY.map((r) => r.family);
    expect(families).toContain("anthropic:opus");
    expect(families).toContain("openai:flagship");
    expect(families).toContain("ollama:llama-large");
  });

  it("every entry conforms to schema (smoke)", () => {
    for (const entry of REGISTRY) {
      expect(typeof entry.id).toBe("string");
      expect(entry.context_window).toBeGreaterThan(0);
      expect(entry.pricing.input_per_million_tokens_usd).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("resolveFamily", () => {
  it("returns current anthropic:opus", () => {
    const r = resolveFamily("anthropic:opus");
    expect(r).not.toBeNull();
    expect(r?.id).toBe("claude-opus-4-7");
  });

  it("returns null for unknown family", () => {
    expect(resolveFamily("nope:none")).toBeNull();
  });

  it("returns null for deprecated family", () => {
    const fixture: ModelFamilyResolution = {
      family: "x:y",
      id: "deprecated-model",
      tier: "small",
      context_window: 1000,
      pricing: { input_per_million_tokens_usd: 1, output_per_million_tokens_usd: 1 },
      deprecates_at: "2024-01-01",
      status: "deprecated",
    };
    expect(resolveFamily("x:y", { registry: [fixture] })).toBeNull();
  });

  it("returns deprecating family by default", () => {
    const fixture: ModelFamilyResolution = {
      family: "x:y",
      id: "soon-gone",
      tier: "small",
      context_window: 1000,
      pricing: { input_per_million_tokens_usd: 1, output_per_million_tokens_usd: 1 },
      deprecates_at: "2027-01-01",
      status: "deprecating",
    };
    const r = resolveFamily("x:y", { registry: [fixture] });
    expect(r).not.toBeNull();
    expect(r?.status).toBe("deprecating");
  });

  it("excludes deprecating when includeDeprecating=false", () => {
    const fixture: ModelFamilyResolution = {
      family: "x:y",
      id: "soon-gone",
      tier: "small",
      context_window: 1000,
      pricing: { input_per_million_tokens_usd: 1, output_per_million_tokens_usd: 1 },
      deprecates_at: "2027-01-01",
      status: "deprecating",
    };
    expect(resolveFamily("x:y", { registry: [fixture], includeDeprecating: false })).toBeNull();
  });

  it("respects price_ceiling per ADR-0010 §2.8", () => {
    const fixture: ModelFamilyResolution = {
      family: "x:y",
      id: "too-expensive",
      tier: "flagship",
      context_window: 100_000,
      pricing: { input_per_million_tokens_usd: 100, output_per_million_tokens_usd: 100 },
      price_ceiling_usd_per_million_tokens: 50,
      deprecates_at: null,
      status: "current",
    };
    expect(resolveFamily("x:y", { registry: [fixture] })).toBeNull();
  });

  it("returns family when under price_ceiling", () => {
    const fixture: ModelFamilyResolution = {
      family: "x:y",
      id: "affordable",
      tier: "flagship",
      context_window: 100_000,
      pricing: { input_per_million_tokens_usd: 10, output_per_million_tokens_usd: 10 },
      price_ceiling_usd_per_million_tokens: 50,
      deprecates_at: null,
      status: "current",
    };
    expect(resolveFamily("x:y", { registry: [fixture] })?.id).toBe("affordable");
  });
});

describe("resolveChain", () => {
  it("returns first match in chain", () => {
    const r = resolveChain(["anthropic:opus", "openai:flagship"]);
    expect(r).not.toBeNull();
    expect(r?.chainIndex).toBe(0);
    expect(r?.resolution.id).toBe("claude-opus-4-7");
  });

  it("falls through to next when first is unknown", () => {
    const r = resolveChain(["nope:none", "anthropic:opus"]);
    expect(r?.chainIndex).toBe(1);
    expect(r?.resolution.id).toBe("claude-opus-4-7");
  });

  it("returns null when entire chain fails", () => {
    expect(resolveChain(["nope:none", "also:none"])).toBeNull();
  });

  it("returns null on empty chain", () => {
    expect(resolveChain([])).toBeNull();
  });

  it("skips falsy entries", () => {
    const r = resolveChain([
      "" as `${string}:${string}`,
      "anthropic:opus",
    ] as ReadonlyArray<`${string}:${string}`>);
    expect(r?.resolution.id).toBe("claude-opus-4-7");
  });
});

describe("estimateCostUsd", () => {
  const opus = REGISTRY.find((r) => r.family === "anthropic:opus")!;

  it("computes basic cost", () => {
    // 1M input + 1M output at opus pricing ($15 in + $75 out = $90)
    expect(estimateCostUsd(opus, 1_000_000, 1_000_000)).toBeCloseTo(90, 5);
  });

  it("computes partial million", () => {
    // 500k input only at $15/M = $7.50
    expect(estimateCostUsd(opus, 500_000, 0)).toBeCloseTo(7.5, 5);
  });

  it("returns 0 for zero tokens", () => {
    expect(estimateCostUsd(opus, 0, 0)).toBe(0);
  });

  it("uses cached pricing when available + cached=true", () => {
    const fixture: ModelFamilyResolution = {
      family: "x:y",
      id: "with-cache",
      tier: "fast",
      context_window: 100_000,
      pricing: {
        input_per_million_tokens_usd: 10,
        output_per_million_tokens_usd: 30,
        cached_input_per_million_tokens_usd: 2,
      },
      deprecates_at: null,
      status: "current",
    };
    // 1M cached input → $2 (not $10), 1M output → $30 = $32
    expect(estimateCostUsd(fixture, 1_000_000, 1_000_000, { cached: true })).toBe(32);
  });

  it("ignores cached flag when no cached pricing", () => {
    // opus has no cached price; cached=true must fall back to standard
    expect(estimateCostUsd(opus, 1_000_000, 0, { cached: true })).toBeCloseTo(15, 5);
  });
});

describe("listFamilies", () => {
  it("returns all family identifiers", () => {
    const all = listFamilies();
    expect(all.length).toBe(REGISTRY.length);
    expect(all).toContain("anthropic:opus");
  });

  it("returns identifiers from a custom registry", () => {
    expect(
      listFamilies({
        registry: [
          {
            family: "x:y",
            id: "z",
            tier: "small",
            context_window: 1,
            pricing: {
              input_per_million_tokens_usd: 1,
              output_per_million_tokens_usd: 1,
            },
            deprecates_at: null,
            status: "current",
          },
        ],
      }),
    ).toEqual(["x:y"]);
  });
});
