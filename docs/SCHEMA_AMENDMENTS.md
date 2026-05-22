# SCHEMA_AMENDMENTS.md

**Nexural Federation — Consolidated New Schemas (v1.0)**
**Status:** Canonical. Single source of truth for all schemas introduced by ADRs 0002–0008.
**Owner:** Sage
**Last reviewed:** 2026-05-21
**Decay rate:** 180 days
**Depends on:** SCHEMA_CHARTER.md; ADRs 0002, 0004, 0005, 0006, 0007, 0008

---

## 0. Purpose

The original SCHEMA_CHARTER.md predates the factory reorientation. Six new schemas were introduced by ADRs 0002–0008, each declared in its parent ADR. **This document consolidates all of them in one place** so implementers reach for a single canonical reference.

When ADRs and this file disagree, **this file wins** (it's the merged result).

When this file and the actual code in `@nexural/schema/src/` disagree, **the code wins** (and this file is updated immediately).

---

## 1. Reference catalog

| Schema                  | Source ADR             | Lives in                              | Used by               |
| ----------------------- | ---------------------- | ------------------------------------- | --------------------- |
| `RecipeManifest`        | 0002, 0006, 0007, 0008 | `packages/schema/src/recipe.ts`       | factory, forge        |
| `ForgedLockfile`        | 0006                   | `packages/schema/src/recipe.ts`       | forged apps, upgrade  |
| `CostEnvelope`          | 0007                   | `packages/schema/src/recipe.ts`       | recipes, sdk wrapper  |
| `ServiceDeclaration`    | 0004                   | `packages/schema/src/recipe.ts`       | recipes (polyglot)    |
| `ExternalMcpEndpoint`   | 0005                   | `packages/schema/src/external-mcp.ts` | router                |
| `ExternalMcpRegistry`   | 0005                   | `packages/schema/src/external-mcp.ts` | nexural-meta          |
| `ModelFamilyResolution` | 0007                   | `packages/schema/src/model-router.ts` | model-router, recipes |
| `ModelFamilyRegistry`   | 0007                   | `packages/schema/src/model-router.ts` | nexural-meta          |
| `CostEvent` (telemetry) | 0007                   | `packages/schema/src/telemetry.ts`    | sdk, dashboard        |
| `RevokedRecipesList`    | 0009                   | `packages/schema/src/revocation.ts`   | factory, forge        |

---

## 2. Imports for every schema below

```ts
import { z } from "zod";
import { SchemaVersion, KebabSlug, SemverString, Iso8601, IsoDate, Ulid } from "./primitives";
```

---

## 3. `ServiceDeclaration` (per ADR-0004)

Discriminated union covering allowed runtimes for emitted apps.

```ts
export const ServiceDeclaration = z.discriminatedUnion("runtime", [
  z
    .object({
      id: KebabSlug,
      runtime: z.literal("nextjs"),
      language: z.literal("typescript"),
      host: z.enum(["vercel", "cloudflare-pages"]),
    })
    .strict(),

  z
    .object({
      id: KebabSlug,
      runtime: z.literal("modal"),
      language: z.literal("python"),
      python_version: z.enum(["3.11", "3.12"]),
      deps: z.string(), // path to requirements.txt
      host: z.literal("modal"),
      contract: z.string(), // path to OpenAPI 3.1 spec
      gpu: z.enum(["none", "t4", "a10g", "a100"]).default("none"),
    })
    .strict(),

  z
    .object({
      id: KebabSlug,
      runtime: z.literal("railway"),
      language: z.enum(["python", "node"]),
      deps: z.string(),
      host: z.literal("railway"),
      contract: z.string(),
    })
    .strict(),

  z
    .object({
      id: KebabSlug,
      runtime: z.literal("cloudflare-worker"),
      language: z.literal("typescript"),
      host: z.literal("cloudflare"),
      contract: z.string().optional(),
    })
    .strict(),
]);

export type ServiceDeclaration = z.infer<typeof ServiceDeclaration>;
```

---

## 4. `CostEnvelope` (per ADR-0007)

```ts
export const CostEnvelope = z
  .object({
    per_request_p50_usd: z.number().nonnegative(),
    per_request_p99_usd: z.number().nonnegative(),
    monthly_baseline_usd: z.number().nonnegative(),
    hard_caps: z
      .object({
        per_request_usd: z.number().positive(),
        per_user_per_day_usd: z.number().positive(),
        per_app_per_day_usd: z.number().positive(),
      })
      .strict(),
  })
  .strict();

export type CostEnvelope = z.infer<typeof CostEnvelope>;
```

**Semantics:**

- All values USD.
- `hard_caps` enforced by `@nexural/sdk`'s `llmClient()` wrapper. Exceeded → request rejected with `429 cost_cap_exceeded`.
- Streaming responses re-check projected cost every 100 emitted tokens (per ADR-0010 §2.4).

---

## 5. `RecipeManifest` (consolidated from ADRs 0002, 0006, 0007, 0008)

```ts
export const RecipeManifest = z
  .object({
    schema_version: SchemaVersion,
    name: KebabSlug,
    version: SemverString,
    description: z.string().min(20).max(500),

    // ── Inheritance / composition (ADR-0002, 0010)
    extends: KebabSlug.optional(),
    composes: z.array(KebabSlug).default([]),

    // ── Inputs (ADR-0002)
    inputs_schema: z.string(), // relative path to inputs.zod.ts

    // ── Warehouses consumed (ADR-0002)
    warehouses: z.array(KebabSlug).min(1),

    // ── Services emitted (ADR-0004 — polyglot allowed)
    services: z.array(ServiceDeclaration).default([]),

    // ── QA profile (ADR-0002)
    qa_profile: z.enum(["fast", "standard", "thorough", "deep"]).default("standard"),

    // ── Cost discipline (ADR-0007)
    cost_envelope: CostEnvelope,
    model_families: z.array(z.string().regex(/^[a-z0-9-]+:[a-z0-9-]+$/)).default([]),

    // ── License composition (ADR-0006)
    output_license: z.enum(["MIT", "Apache-2.0", "ISC"]),
    commercial_restricted_ok: z.boolean().default(false),

    // ── Secrets (ADR-0006)
    secrets_required: z
      .array(
        z
          .object({
            logical_name: KebabSlug,
            op_path: z.string().regex(/^op:\/\//), // 1Password CLI URI
            target_file: z.string(),
            target_var: z.string().regex(/^[A-Z_][A-Z0-9_]*$/),
          })
          .strict(),
      )
      .default([]),

    // ── Emit configuration
    emit: z
      .object({
        template_path: z.string(), // relative path to templates/
        pre_emit_hooks: z.array(z.string()).default([]),
        post_emit_hooks: z.array(z.string()).default([]),
      })
      .strict(),

    // ── Per-recipe required docs (ADR-0008)
    threat_model_path: z.string(), // relative path to THREAT_MODEL.md
    decisions_path: z.string(), // relative path to DECISIONS.md

    // ── Forge hygiene (ADR-0009)
    forge_sandbox: z
      .object({
        ignore_scripts: z.boolean().default(true), // pnpm install --ignore-scripts
        allowed_postinstalls: z.array(z.string()).default([]), // explicit allowlist
      })
      .strict()
      .default({ ignore_scripts: true, allowed_postinstalls: [] }),
  })
  .strict();

export type RecipeManifest = z.infer<typeof RecipeManifest>;
```

**Cross-field invariants (refine):**

```ts
RecipeManifest.refine((r) => r.services.length > 0 || r.warehouses.length > 0, {
  message: "recipe must declare at least one service or one warehouse",
});
```

---

## 6. `ForgedLockfile` (per ADR-0006)

```ts
export const ForgedLockfile = z
  .object({
    schema_version: SchemaVersion,
    forged_at: Iso8601,
    forged_by_nx_version: SemverString,

    recipe: z
      .object({
        name: KebabSlug,
        version: SemverString,
        sha: z.string().regex(/^[a-f0-9]{40,64}$/),
        signature: z.string(), // cosign sig
        provenance: z.string().url(), // SLSA L3 URL
      })
      .strict(),

    warehouses_consumed: z
      .array(
        z
          .object({
            name: KebabSlug,
            sha: z.string().regex(/^[a-f0-9]{40,64}$/),
            version: SemverString.optional(),
          })
          .strict(),
      )
      .min(1),

    inputs: z.record(z.string(), z.unknown()),
    model_families_used: z.array(z.string()).default([]),
    sbom_hash: z.string().regex(/^[a-f0-9]{64}$/),
  })
  .strict();

export type ForgedLockfile = z.infer<typeof ForgedLockfile>;
```

**Usage:**

- Emitted to `.nexural/forged.lock.yaml` in every forged app.
- Read by `nx upgrade` to compute deltas.
- Verified by `federation-conformance` runner in CI.

---

## 7. `ExternalMcpEndpoint` + `ExternalMcpRegistry` (per ADR-0005)

```ts
export const ExternalMcpEndpoint = z
  .object({
    schema_version: SchemaVersion,
    name: KebabSlug,
    type: z.literal("external"),
    transport: z.enum(["stdio", "http", "websocket"]),
    command: z.array(z.string()).optional(), // required iff stdio
    url: z.string().url().optional(), // required iff http/ws
    tool_prefix: KebabSlug,
    schema_compatibility: z.enum(["nexural-1", "external"]),
    federations: z.array(z.enum(["factory", "lifeops"])).min(1),

    quality_attestation: z
      .object({
        source: z.string(), // e.g. "nexural-qa-os"
        score: z.number().int().min(0).max(100),
        verified_at: IsoDate,
        next_review: IsoDate,
      })
      .strict(),
  })
  .strict()
  .refine((e) => (e.transport === "stdio" && !!e.command) || (e.transport !== "stdio" && !!e.url), {
    message: "stdio requires command; http/ws requires url",
  });

export const ExternalMcpRegistry = z
  .object({
    schema_version: SchemaVersion,
    endpoints: z.array(ExternalMcpEndpoint),
  })
  .strict();

export type ExternalMcpEndpoint = z.infer<typeof ExternalMcpEndpoint>;
export type ExternalMcpRegistry = z.infer<typeof ExternalMcpRegistry>;
```

---

## 8. `ModelFamilyResolution` + `ModelFamilyRegistry` (per ADR-0007)

```ts
export const ModelFamilyResolution = z
  .object({
    family: z.string().regex(/^[a-z0-9-]+:[a-z0-9-]+$/), // "anthropic:opus"
    id: z.string(), // "claude-opus-4-7"
    tier: z.enum(["flagship", "premium", "balanced", "fast", "small"]),
    context_window: z.number().int().positive(),
    pricing: z
      .object({
        input_per_million_tokens_usd: z.number().nonnegative(),
        output_per_million_tokens_usd: z.number().nonnegative(),
        cached_input_per_million_tokens_usd: z.number().nonnegative().optional(),
      })
      .strict(),
    price_ceiling_usd_per_million_tokens: z.number().positive().optional(), // ADR-0010 §2.8
    deprecates_at: IsoDate.nullable(),
    status: z.enum(["current", "deprecating", "deprecated", "preview"]),
  })
  .strict();

export const ModelFamilyRegistry = z
  .object({
    schema_version: SchemaVersion,
    generated_at: Iso8601,
    resolutions: z.array(ModelFamilyResolution),
  })
  .strict();
```

---

## 9. `CostEvent` telemetry (per ADR-0007)

```ts
export const CostEvent = BaseEvent.extend({
  kind: z.literal("cost_event"),
  app: KebabSlug, // forged app name
  recipe: KebabSlug,
  severity: z.enum(["warn", "exceeded", "circuit_break"]),
  scope: z.enum(["per_request", "per_user_day", "per_app_day"]),
  projected_usd: z.number().nonnegative(),
  cap_usd: z.number().positive(),
  user_hash: z.string().optional(), // sha256, never raw user id
}).strict();
```

Added to the `TelemetryEvent` discriminated union.

---

## 10. `RevokedRecipesList` (per ADR-0009)

```ts
export const RevokedRecipeEntry = z
  .object({
    recipe_name: KebabSlug,
    recipe_version: SemverString,
    revoked_at: Iso8601,
    reason: z.string().min(10),
    ticket: z.string().optional(), // GitHub issue URL
    signature: z.string(), // cosign sig of this entry
  })
  .strict();

export const RevokedRecipesList = z
  .object({
    schema_version: SchemaVersion,
    generated_at: Iso8601,
    entries: z.array(RevokedRecipeEntry),
  })
  .strict();
```

**Location:** `nexural-meta/security/revoked-recipes.yaml`.
**Discipline:** append-only. Every entry signed. `nx forge` checks this list before emitting.

---

## 11. Cross-document harmonization

The original `SCHEMA_CHARTER.md` §4 contains the canonical shapes for `WarehouseMeta`, `ContentFrontmatter`, `WarehouseIndex`, `McpToolRequest`, `McpToolResponse`, `TelemetryEvent`, `Registry`, `ScorecardReport`, `CrossRefReport`, `DecayConfig`, `AdrFrontmatter`. Those shapes are unchanged by ADRs.

**Three shapes are AMENDED by this document and supersede their original:**

| Schema                                | Amendment                                                                   |
| ------------------------------------- | --------------------------------------------------------------------------- |
| `TelemetryEvent`                      | Discriminated union expanded to include `CostEvent`                         |
| `WarehouseMeta.cross_refs.exposed_to` | Add `federation: enum("factory", "lifeops")` for ADR-0003 routing           |
| `Registry`                            | Split into `registry-factory.yaml` and `registry-lifeops.yaml` per ADR-0003 |

The amended TelemetryEvent:

```ts
export const TelemetryEvent = z.discriminatedUnion("kind", [
  ToolCallEvent,
  NxCommandEvent,
  DecayWarnEvent,
  AuditEvent,
  CostEvent, // ADDED per ADR-0007
]);
```

---

## 12. Versioning

This document and the shapes within it are bound to `@nexural/schema@1.x.x`. Breaking changes follow SCHEMA_CHARTER.md §6 (30-day soak; migration codemod ships in `@nexural/migrate-vN-to-vN+1`).

## CHANGELOG

- **2026-05-21** v1.0 — Initial consolidation of ADR-introduced schemas.
