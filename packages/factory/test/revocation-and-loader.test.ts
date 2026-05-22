import { describe, expect, it } from "vitest";
import type { RecipeManifest, RevokedRecipesList } from "@nexural/schema";
import { checkRevocation } from "../src/revocation.js";
import { loadRecipe } from "../src/recipe-loader.js";
import { buildLockfile } from "../src/lockfile.js";

const emptyList: RevokedRecipesList = {
  schema_version: 1,
  generated_at: "2026-05-22T00:00:00Z",
  entries: [],
};

const listWithRevocation: RevokedRecipesList = {
  schema_version: 1,
  generated_at: "2026-05-22T00:00:00Z",
  entries: [
    {
      recipe_name: "saas-rag-chat",
      recipe_version: "1.2.0",
      revoked_at: "2026-06-15T12:00:00Z",
      reason: "Prompt-injection via uploaded documents",
      ticket: "https://github.com/JasonTeixeira/nexural-meta/issues/42",
      signature: "MEUCIQ...",
    },
  ],
};

const validRecipeManifest: Partial<RecipeManifest> & Record<string, unknown> = {
  schema_version: 1,
  name: "saas-multitenant-baseline",
  version: "1.0.0",
  description: "Multi-tenant SaaS baseline recipe used by the factory.",
  inputs_schema: "inputs.zod.ts",
  warehouses: ["auth", "payments"],
  cost_envelope: {
    per_request_p50_usd: 0.001,
    per_request_p99_usd: 0.01,
    monthly_baseline_usd: 5,
    hard_caps: {
      per_request_usd: 0.05,
      per_user_per_day_usd: 1,
      per_app_per_day_usd: 20,
    },
  },
  output_license: "MIT",
  emit: { template_path: "templates/" },
  threat_model_path: "THREAT_MODEL.md",
  decisions_path: "DECISIONS.md",
};

describe("checkRevocation", () => {
  it("returns not revoked when list is empty", () => {
    expect(checkRevocation("any", "1.0.0", emptyList).revoked).toBe(false);
  });
  it("returns revoked with reason when match", () => {
    const r = checkRevocation("saas-rag-chat", "1.2.0", listWithRevocation);
    expect(r.revoked).toBe(true);
    expect(r.reason).toMatch(/Prompt-injection/);
  });
  it("includes ticket URL when present", () => {
    const r = checkRevocation("saas-rag-chat", "1.2.0", listWithRevocation);
    expect(r.ticket).toContain("github.com");
  });
  it("requires EXACT version match", () => {
    const r = checkRevocation("saas-rag-chat", "1.2.1", listWithRevocation);
    expect(r.revoked).toBe(false);
  });
  it("requires EXACT name match", () => {
    const r = checkRevocation("saas-rag-chats", "1.2.0", listWithRevocation);
    expect(r.revoked).toBe(false);
  });
});

describe("loadRecipe", () => {
  it("parses a valid manifest", () => {
    const r = loadRecipe(validRecipeManifest, emptyList);
    expect(r.recipe.name).toBe("saas-multitenant-baseline");
    expect(r.revocation.revoked).toBe(false);
  });

  it("throws on parse error", () => {
    expect(() => loadRecipe({ invalid: true }, emptyList)).toThrow();
  });

  it("throws when recipe is revoked", () => {
    const revokedManifest = {
      ...validRecipeManifest,
      name: "saas-rag-chat",
      version: "1.2.0",
    };
    expect(() => loadRecipe(revokedManifest, listWithRevocation)).toThrow(/revoked/);
  });

  it("bypasses revocation check with allowRevoked=true (audit mode)", () => {
    const revokedManifest = {
      ...validRecipeManifest,
      name: "saas-rag-chat",
      version: "1.2.0",
    };
    const r = loadRecipe(revokedManifest, listWithRevocation, {
      allowRevoked: true,
    });
    expect(r.revocation.revoked).toBe(true);
    expect(r.recipe.name).toBe("saas-rag-chat");
  });
});

describe("buildLockfile", () => {
  it("builds a valid lockfile", () => {
    const lf = buildLockfile({
      forgedByNxVersion: "1.0.0",
      recipe: {
        name: "saas-multitenant-baseline",
        version: "1.0.0",
        sha: "a".repeat(40),
        signature: "MEUCIQ...",
        provenance: "https://github.com/JasonTeixeira/nexural-meta/attestations/1",
      },
      warehousesConsumed: [{ name: "auth", sha: "b".repeat(40), version: "1.2.0" }],
      inputs: { tenant_routing: "subdomain" },
      modelFamiliesUsed: ["anthropic:opus"],
      sbomHash: "f".repeat(64),
    });
    expect(lf.recipe.name).toBe("saas-multitenant-baseline");
    expect(lf.forged_at).toMatch(/^\d{4}-/);
  });

  it("uses injected clock for deterministic tests", () => {
    const lf = buildLockfile({
      forgedByNxVersion: "1.0.0",
      recipe: {
        name: "x",
        version: "1.0.0",
        sha: "a".repeat(40),
        signature: "s",
        provenance: "https://example.com/a",
      },
      warehousesConsumed: [{ name: "auth", sha: "b".repeat(40) }],
      inputs: {},
      modelFamiliesUsed: [],
      sbomHash: "f".repeat(64),
      forgedAtMs: Date.parse("2026-01-01T00:00:00Z"),
    });
    expect(lf.forged_at).toBe("2026-01-01T00:00:00.000Z");
  });

  it("throws on malformed inputs", () => {
    expect(() =>
      buildLockfile({
        forgedByNxVersion: "1.0.0",
        recipe: {
          name: "x",
          version: "1.0.0",
          sha: "not-a-sha",
          signature: "s",
          provenance: "https://e.com/a",
        },
        warehousesConsumed: [{ name: "auth", sha: "b".repeat(40) }],
        inputs: {},
        modelFamiliesUsed: [],
        sbomHash: "f".repeat(64),
      }),
    ).toThrow();
  });
});
