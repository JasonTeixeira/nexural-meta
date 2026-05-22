/**
 * Recipe family — RecipeManifest, ForgedLockfile, CostEnvelope, ServiceDeclaration.
 *
 * Combined into one test file since they cover the same domain.
 */

import { describe, expect, it } from "vitest";
import { CostEnvelope, ForgedLockfile, RecipeManifest, ServiceDeclaration } from "../src/recipe.js";

describe("ServiceDeclaration", () => {
  it("accepts nextjs on vercel", () =>
    expect(() =>
      ServiceDeclaration.parse({
        id: "web",
        runtime: "nextjs",
        language: "typescript",
        host: "vercel",
      }),
    ).not.toThrow());

  it("accepts modal python", () =>
    expect(() =>
      ServiceDeclaration.parse({
        id: "ml-inference",
        runtime: "modal",
        language: "python",
        python_version: "3.11",
        deps: "services/ml/requirements.txt",
        host: "modal",
        contract: "services/ml/openapi.yaml",
        gpu: "a10g",
      }),
    ).not.toThrow());

  it("applies default gpu=none for modal", () => {
    const parsed = ServiceDeclaration.parse({
      id: "ml-inference",
      runtime: "modal",
      language: "python",
      python_version: "3.11",
      deps: "requirements.txt",
      host: "modal",
      contract: "openapi.yaml",
    });
    expect(parsed.runtime === "modal" && parsed.gpu).toBe("none");
  });

  it("rejects nextjs with python language", () =>
    expect(() =>
      ServiceDeclaration.parse({
        id: "web",
        runtime: "nextjs",
        language: "python",
        host: "vercel",
      }),
    ).toThrow());

  it("rejects modal without contract", () =>
    expect(() =>
      ServiceDeclaration.parse({
        id: "ml",
        runtime: "modal",
        language: "python",
        python_version: "3.11",
        deps: "r.txt",
        host: "modal",
      }),
    ).toThrow());

  it("rejects unknown runtime", () =>
    expect(() =>
      ServiceDeclaration.parse({
        id: "x",
        runtime: "django",
        language: "python",
      }),
    ).toThrow());

  it("rejects unknown gpu type", () =>
    expect(() =>
      ServiceDeclaration.parse({
        id: "ml",
        runtime: "modal",
        language: "python",
        python_version: "3.11",
        deps: "r.txt",
        host: "modal",
        contract: "o.yaml",
        gpu: "h100",
      }),
    ).toThrow());

  it("accepts railway service", () =>
    expect(() =>
      ServiceDeclaration.parse({
        id: "worker",
        runtime: "railway",
        language: "node",
        deps: "package.json",
        host: "railway",
        contract: "openapi.yaml",
      }),
    ).not.toThrow());

  it("accepts cloudflare-worker", () =>
    expect(() =>
      ServiceDeclaration.parse({
        id: "edge",
        runtime: "cloudflare-worker",
        language: "typescript",
        host: "cloudflare",
      }),
    ).not.toThrow());
});

describe("CostEnvelope", () => {
  const valid = {
    per_request_p50_usd: 0.002,
    per_request_p99_usd: 0.05,
    monthly_baseline_usd: 25,
    hard_caps: {
      per_request_usd: 0.5,
      per_user_per_day_usd: 5,
      per_app_per_day_usd: 100,
    },
  };

  it("accepts valid", () => expect(() => CostEnvelope.parse(valid)).not.toThrow());

  it("rejects negative p50", () =>
    expect(() => CostEnvelope.parse({ ...valid, per_request_p50_usd: -0.01 })).toThrow());

  it("rejects 0 hard cap (must be positive)", () =>
    expect(() =>
      CostEnvelope.parse({
        ...valid,
        hard_caps: { ...valid.hard_caps, per_request_usd: 0 },
      }),
    ).toThrow());

  it("rejects missing hard_caps", () => {
    const { hard_caps: _, ...rest } = valid;
    expect(() => CostEnvelope.parse(rest)).toThrow();
  });

  it("rejects missing per_user_per_day_usd in caps", () => {
    const { per_user_per_day_usd: _, ...rest } = valid.hard_caps;
    expect(() => CostEnvelope.parse({ ...valid, hard_caps: rest })).toThrow();
  });

  it("rejects extra cap keys", () =>
    expect(() =>
      CostEnvelope.parse({
        ...valid,
        hard_caps: { ...valid.hard_caps, per_year_usd: 1000 },
      }),
    ).toThrow());
});

const validRecipe = {
  schema_version: 1 as const,
  name: "saas-multitenant-baseline",
  version: "1.0.0",
  description: "Multi-tenant SaaS baseline with auth, billing, and observability.",
  inputs_schema: "recipes/saas-multitenant-baseline/inputs.zod.ts",
  warehouses: ["auth", "payments", "multi-tenancy"],
  cost_envelope: {
    per_request_p50_usd: 0.001,
    per_request_p99_usd: 0.01,
    monthly_baseline_usd: 10,
    hard_caps: {
      per_request_usd: 0.1,
      per_user_per_day_usd: 5,
      per_app_per_day_usd: 100,
    },
  },
  output_license: "MIT" as const,
  emit: { template_path: "templates/" },
  threat_model_path: "THREAT_MODEL.md",
  decisions_path: "DECISIONS.md",
};

describe("RecipeManifest", () => {
  it("accepts a minimal valid recipe", () =>
    expect(() => RecipeManifest.parse(validRecipe)).not.toThrow());

  it("applies forge_sandbox default ignore_scripts=true", () => {
    const parsed = RecipeManifest.parse(validRecipe);
    expect(parsed.forge_sandbox.ignore_scripts).toBe(true);
    expect(parsed.forge_sandbox.allowed_postinstalls).toEqual([]);
  });

  it("rejects unknown output_license (e.g., GPL)", () =>
    expect(() => RecipeManifest.parse({ ...validRecipe, output_license: "GPL-3.0" })).toThrow());

  it("rejects too-short description", () =>
    expect(() => RecipeManifest.parse({ ...validRecipe, description: "short" })).toThrow());

  it("rejects empty warehouses array (cross-field refinement: must have warehouse or service)", () =>
    expect(() => RecipeManifest.parse({ ...validRecipe, warehouses: [] })).toThrow());

  it("rejects missing threat_model_path (per ADR-0008)", () => {
    const { threat_model_path: _, ...rest } = validRecipe;
    expect(() => RecipeManifest.parse(rest)).toThrow();
  });

  it("rejects missing decisions_path", () => {
    const { decisions_path: _, ...rest } = validRecipe;
    expect(() => RecipeManifest.parse(rest)).toThrow();
  });

  it("rejects malformed model_family format", () =>
    expect(() =>
      RecipeManifest.parse({
        ...validRecipe,
        model_families: ["Anthropic/Opus"],
      }),
    ).toThrow());

  it("accepts valid model_family format", () =>
    expect(() =>
      RecipeManifest.parse({
        ...validRecipe,
        model_families: ["anthropic:opus", "openai:flagship"],
      }),
    ).not.toThrow());

  it("rejects secret with non-op:// path", () =>
    expect(() =>
      RecipeManifest.parse({
        ...validRecipe,
        secrets_required: [
          {
            logical_name: "stripe-key",
            op_path: "vault://stripe/key",
            target_file: ".env.local",
            target_var: "STRIPE_SECRET_KEY",
          },
        ],
      }),
    ).toThrow());

  it("rejects secret with non-SCREAMING_SNAKE target_var", () =>
    expect(() =>
      RecipeManifest.parse({
        ...validRecipe,
        secrets_required: [
          {
            logical_name: "stripe-key",
            op_path: "op://Vault/Stripe/key",
            target_file: ".env.local",
            target_var: "stripe_key",
          },
        ],
      }),
    ).toThrow());

  it("accepts forge_sandbox with allowed_postinstalls", () =>
    expect(() =>
      RecipeManifest.parse({
        ...validRecipe,
        forge_sandbox: {
          ignore_scripts: true,
          allowed_postinstalls: ["esbuild"],
        },
      }),
    ).not.toThrow());
});

describe("ForgedLockfile", () => {
  const valid = {
    schema_version: 1 as const,
    forged_at: "2026-06-01T14:23:11Z",
    forged_by_nx_version: "1.2.3",
    recipe: {
      name: "saas-multitenant-baseline",
      version: "1.0.0",
      sha: "a".repeat(40),
      signature: "MEUCIQ...",
      provenance: "https://github.com/JasonTeixeira/nexural-meta/attestations/123",
    },
    warehouses_consumed: [{ name: "auth", sha: "b".repeat(40), version: "1.2.0" }],
    inputs: { tenant_routing: "subdomain" },
    model_families_used: ["anthropic:opus"],
    sbom_hash: "f".repeat(64),
  };

  it("accepts valid", () => expect(() => ForgedLockfile.parse(valid)).not.toThrow());

  it("rejects empty warehouses_consumed", () =>
    expect(() => ForgedLockfile.parse({ ...valid, warehouses_consumed: [] })).toThrow());

  it("rejects non-hex sha", () =>
    expect(() =>
      ForgedLockfile.parse({
        ...valid,
        recipe: { ...valid.recipe, sha: "not-a-sha" },
      }),
    ).toThrow());

  it("rejects empty signature", () =>
    expect(() =>
      ForgedLockfile.parse({
        ...valid,
        recipe: { ...valid.recipe, signature: "" },
      }),
    ).toThrow());

  it("rejects non-URL provenance", () =>
    expect(() =>
      ForgedLockfile.parse({
        ...valid,
        recipe: { ...valid.recipe, provenance: "not a url" },
      }),
    ).toThrow());

  it("rejects malformed sbom_hash", () =>
    expect(() => ForgedLockfile.parse({ ...valid, sbom_hash: "abc123" })).toThrow());

  it("rejects missing nx_version", () => {
    const { forged_by_nx_version: _, ...rest } = valid;
    expect(() => ForgedLockfile.parse(rest)).toThrow();
  });
});
