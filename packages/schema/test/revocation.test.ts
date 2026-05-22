import { describe, expect, it } from "vitest";
import { RevokedRecipeEntry, RevokedRecipesList } from "../src/revocation.js";

describe("RevokedRecipeEntry", () => {
  const valid = {
    recipe_name: "saas-rag-chat",
    recipe_version: "1.2.0",
    revoked_at: "2026-06-15T12:00:00Z",
    reason: "Discovered prompt-injection vector via uploaded documents",
    signature: "MEUCIQ...",
  };

  it("accepts valid", () => expect(() => RevokedRecipeEntry.parse(valid)).not.toThrow());

  it("accepts with ticket URL", () =>
    expect(() =>
      RevokedRecipeEntry.parse({
        ...valid,
        ticket: "https://github.com/JasonTeixeira/nexural-meta/issues/42",
      }),
    ).not.toThrow());

  it("rejects short reason (< 10 chars)", () =>
    expect(() => RevokedRecipeEntry.parse({ ...valid, reason: "short" })).toThrow());

  it("rejects empty signature", () =>
    expect(() => RevokedRecipeEntry.parse({ ...valid, signature: "" })).toThrow());

  it("rejects malformed version", () =>
    expect(() => RevokedRecipeEntry.parse({ ...valid, recipe_version: "v1.2" })).toThrow());

  it("rejects non-kebab recipe_name", () =>
    expect(() => RevokedRecipeEntry.parse({ ...valid, recipe_name: "SaasRagChat" })).toThrow());

  it("rejects non-URL ticket", () =>
    expect(() => RevokedRecipeEntry.parse({ ...valid, ticket: "GH-42" })).toThrow());

  it("rejects extra keys", () =>
    expect(() => RevokedRecipeEntry.parse({ ...valid, extra: true })).toThrow());
});

describe("RevokedRecipesList", () => {
  it("accepts empty list", () =>
    expect(() =>
      RevokedRecipesList.parse({
        schema_version: 1,
        generated_at: "2026-05-22T03:49:21Z",
        entries: [],
      }),
    ).not.toThrow());
});
