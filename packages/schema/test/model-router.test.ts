import { describe, expect, it } from "vitest";
import { ModelFamilyRegistry, ModelFamilyResolution } from "../src/model-router.js";

describe("ModelFamilyResolution", () => {
  const valid = {
    family: "anthropic:opus",
    id: "claude-opus-4-7",
    tier: "premium" as const,
    context_window: 1_000_000,
    pricing: {
      input_per_million_tokens_usd: 15,
      output_per_million_tokens_usd: 75,
    },
    deprecates_at: null,
    status: "current" as const,
  };

  it("accepts valid", () => expect(() => ModelFamilyResolution.parse(valid)).not.toThrow());

  it("accepts with deprecates_at date", () =>
    expect(() =>
      ModelFamilyResolution.parse({ ...valid, deprecates_at: "2027-01-01" }),
    ).not.toThrow());

  it("accepts price_ceiling per ADR-0010 §2.8", () =>
    expect(() =>
      ModelFamilyResolution.parse({
        ...valid,
        price_ceiling_usd_per_million_tokens: 30,
      }),
    ).not.toThrow());

  it("rejects malformed family", () =>
    expect(() => ModelFamilyResolution.parse({ ...valid, family: "anthropic.opus" })).toThrow());

  it("rejects empty id", () =>
    expect(() => ModelFamilyResolution.parse({ ...valid, id: "" })).toThrow());

  it("rejects unknown tier", () =>
    expect(() => ModelFamilyResolution.parse({ ...valid, tier: "ultra" as never })).toThrow());

  it("rejects 0 context_window", () =>
    expect(() => ModelFamilyResolution.parse({ ...valid, context_window: 0 })).toThrow());

  it("rejects negative pricing", () =>
    expect(() =>
      ModelFamilyResolution.parse({
        ...valid,
        pricing: { ...valid.pricing, input_per_million_tokens_usd: -1 },
      }),
    ).toThrow());

  it("rejects unknown status", () =>
    expect(() => ModelFamilyResolution.parse({ ...valid, status: "yanked" as never })).toThrow());
});

describe("ModelFamilyRegistry", () => {
  it("accepts empty resolutions", () =>
    expect(() =>
      ModelFamilyRegistry.parse({
        schema_version: 1,
        generated_at: "2026-05-22T03:49:21Z",
        resolutions: [],
      }),
    ).not.toThrow());

  it("rejects extra keys", () =>
    expect(() =>
      ModelFamilyRegistry.parse({
        schema_version: 1,
        generated_at: "2026-05-22T03:49:21Z",
        resolutions: [],
        extra: 1,
      }),
    ).toThrow());
});
