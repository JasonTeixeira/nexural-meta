# ADR-0007: Cost Guardrails + Model Deprecation Handler

**Status:** Proposed
**Date:** 2026-05-21
**Deciders:** Sage
**Soak ends:** 2026-05-28
**Depends on:** ADR-0002, ADR-0006

## Context

Two cost-related failure modes are unaddressed in the original plan:

1. **Per-recipe cost runaway.** A `saas-agent-platform` app could see one user prompt cost $5 in LLM tokens. Across a free tier, this can burn through monthly budget in minutes. Federation has no structural defense.
2. **Model deprecation cascade.** Anthropic deprecates models every ~12 months. OpenAI faster. Each recipe pinning a model ID silently breaks on deprecation date. With 5+ recipes and N forged apps, this is unmanageable manually.

ARCHITECTURE.md §8 targets $200/month total system COGS — that's the federation itself. It does NOT cover _emitted apps_ or per-recipe cost discipline.

## Decision

### 1. Cost envelope in every recipe

Every recipe MUST declare a `cost_envelope` in its `recipe.yaml`:

```yaml
cost_envelope:
  per_request_p50_usd: 0.002 # median request cost projection
  per_request_p99_usd: 0.05 # tail cost projection
  monthly_baseline_usd: 25 # expected steady-state monthly per active tenant
  hard_caps:
    per_request_usd: 0.50 # rejects requests projected over this
    per_user_per_day_usd: 5.00 # blocks user after this
    per_app_per_day_usd: 100 # circuit-breaks app after this
```

Schema added to `@nexural/schema/recipe.ts`:

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
```

Recipes without a complete `cost_envelope` fail `recipe-validity` runner.

### 2. Cost enforcement via `@nexural/sdk` LLM wrapper

Every emitted app uses `@nexural/sdk`'s `llmClient()` wrapper instead of direct provider SDKs. The wrapper:

1. **Pre-flight estimate.** Before issuing the call, estimate cost from model pricing × projected token counts.
2. **Per-request reject.** If projected cost > `per_request_usd` cap, return `429 cost_cap_exceeded` immediately. No call made.
3. **Per-user track.** Increment per-user daily total in app's local SQLite (or Postgres for SaaS). Block user after `per_user_per_day_usd`.
4. **Per-app circuit.** Increment per-app daily total. Circuit-break entire app after `per_app_per_day_usd` (returns 503 with retry-after).
5. **Telemetry.** Emit `cost_warn` at 80% of any cap, `cost_exceeded` at 100%.
6. **Daily reset.** All daily counters reset at UTC midnight.

Recipes using raw provider SDKs (bypassing the wrapper) fail `federation-conformance` runner (per ADR-0008).

### 3. `@nexural/model-router` package — family resolution

New package: `@nexural/model-router`. Resolves "model families" (stable references) to concrete model IDs (volatile).

```ts
import { resolveFamily, resolveChain } from "@nexural/model-router";

const model = await resolveFamily("anthropic:opus");
// returns: {
//   id: "claude-opus-4-7",
//   tier: "premium",
//   context_window: 1_000_000,
//   pricing: { input: 15, output: 75 },
//   deprecates_at: null,
//   status: "current"
// }

const model = await resolveChain(["anthropic:opus", "openai:flagship", "ollama:llama-3.3-70b"]);
// returns the first available; falls down chain on outage/deprecation
```

### 4. Model family registry maintained in nexural-meta

Live map in `nexural-meta/packages/model-router/src/registry.ts` — single source of truth for family → concrete model resolution.

Renovate-style PR opens automatically when:

- A provider announces deprecation (scraped weekly from `https://docs.anthropic.com/...` and equivalents).
- A provider releases a new model in a family (CI-driven update from provider APIs).
- A model's pricing changes (weekly check).

PR labels: `model-deprecation` (high urgency) or `model-update` (normal).

### 5. Forge-time model resolution

Recipe declares `model_families`. `nx forge` resolves families to current IDs at emit time AND wires the model-router into the emitted app, so the app's runtime resolves families dynamically — giving auto-upgrade when registry updates.

Lockfile records the IDs resolved at forge time AND the families requested. `nx upgrade` detects when registry has moved beyond locked IDs.

### 6. Cost telemetry surfaces in dashboard

`nexural-meta/apps/dashboard` adds a `Costs` tab:

- Per-app monthly spend (sourced from app's telemetry → Turso sync)
- Per-recipe expected vs. actual spend drift
- Per-model usage breakdown
- Per-app daily/monthly cap proximity bars
- Cap breaches (24h, 7d, 30d)

### 7. Cost-related telemetry events

Added to `@nexural/schema/telemetry.ts`:

```ts
export const CostEvent = BaseEvent.extend({
  kind: z.literal("cost_event"),
  app: KebabSlug, // forged app name
  recipe: KebabSlug,
  severity: z.enum(["warn", "exceeded", "circuit_break"]),
  scope: z.enum(["per_request", "per_user_day", "per_app_day"]),
  projected_usd: z.number().nonnegative(),
  cap_usd: z.number().positive(),
  user_hash: z.string().optional(), // sha256, never raw user
}).strict();
```

## Schema additions

Add model family resolution schema:

```ts
export const ModelFamilyResolution = z
  .object({
    family: z.string().regex(/^[a-z0-9-]+:[a-z0-9-]+$/), // e.g. "anthropic:opus"
    id: z.string(), // e.g. "claude-opus-4-7"
    tier: z.enum(["flagship", "premium", "balanced", "fast", "small"]),
    context_window: z.number().int().positive(),
    pricing: z
      .object({
        input_per_million_tokens_usd: z.number().nonnegative(),
        output_per_million_tokens_usd: z.number().nonnegative(),
        cached_input_per_million_tokens_usd: z.number().nonnegative().optional(),
      })
      .strict(),
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

## Consequences

**Positive:**

- Cost runaway structurally impossible (hard caps enforced at SDK).
- Model deprecation handled across federation via 1 PR, not N.
- Telemetry surface for cost is real, not aspirational.
- Apps auto-upgrade their model family when registry updates.

**Negative:**

- All LLM calls MUST go through `@nexural/sdk` wrapper. Recipes that bypass fail conformance.
- Model-router needs ongoing maintenance (weekly Renovate-style PRs).
- Per-app/per-user counters require persistent storage in emitted apps (mitigated: piggybacks on existing Postgres).

**Neutral:**

- `cost_envelope` becomes a recipe documentation surface — forces explicit unit-economics thinking up front.

## Alternatives Considered

1. **Hope and monthly billing alerts.** Rejected — reactive, burns a weekend recovering.
2. **Recipe-time model pinning only.** Rejected — guarantees stale-model bug at 12-month mark.
3. **No hard caps, just warnings.** Rejected — toy guardrails. Hard caps or none.
4. **Cost tracking via OpenTelemetry only (no in-line wrapper).** Rejected — too late; OTel reports AFTER spend.

## Soak

7 days, co-soak with ADR-0002.
