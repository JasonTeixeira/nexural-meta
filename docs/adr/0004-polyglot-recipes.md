# ADR-0004: Polyglot Recipes Allowed

**Status:** Proposed
**Date:** 2026-05-21
**Deciders:** Sage
**Soak ends:** 2026-05-28
**Depends on:** ADR-0002

## Context

ARCHITECTURE.md §7 locks the stack to TypeScript / Node 22 / pnpm. The reality:

1. `ai-warehouse` is already pure Python and remains separate (per ADR-0005).
2. Finance applications regularly require Python (pandas/polars data work, numerical libraries, ML pipelines, quantitative tools, backtesting engines).
3. AI applications sometimes require GPU-backed Python services (Modal, Replicate, RunPod, Banana).

A strict TS-only ban on emitted apps forces unnatural workarounds (e.g., porting numpy logic to TS). A loose "anything goes" policy erodes factory predictability.

## Decision

### Federation control plane: strict TS/Node — unchanged

`nexural-meta`, all `@nexural/*` packages, `nx` CLI, MCP router, dashboard remain **strict TypeScript / Node 22 LTS / pnpm 9+**. Non-negotiable. The factory itself must be predictable.

### Emitted apps: polyglot allowed via explicit recipe declaration

A recipe MAY declare additional non-TS services in its `recipe.yaml`:

```yaml
services:
  - id: web
    runtime: nextjs
    language: typescript
    host: vercel
  - id: ml-inference
    runtime: modal
    language: python
    python_version: "3.11"
    deps: requirements.txt
    host: modal
    contract: openapi/ml-inference.yaml
```

### Allowed additional runtimes (v1.0)

| Runtime            | Language       | Host (default) | Use case                         |
| ------------------ | -------------- | -------------- | -------------------------------- |
| Modal              | Python 3.11+   | Modal          | ML inference, GPU workloads      |
| Railway            | Python or Node | Railway        | Batch jobs, long-running workers |
| Cloudflare Workers | TypeScript     | Cloudflare     | Edge compute                     |

### Forbidden (v1.0 — revisit per ADR if needed)

- Compiled binaries shipped from forge (Rust, Go, C/C++).
- Mixed-runtime monoliths. Each service is its own deploy target with its own lifecycle.
- Polyglot services without an OpenAPI contract.

### Inter-service contract

Cross-service communication is **HTTPS + JSON only**. No RPC frameworks. No gRPC. The TS web app calls Python services via fetch + Zod-validated JSON. Every polyglot recipe ships an OpenAPI 3.1 spec; types stay in sync via codegen on both sides.

### Service declaration schema

Added to `@nexural/schema/recipe.ts`:

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
      contract: z.string(), // path to OpenAPI spec
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
```

### qa-os support

Existing `nexural-qa-os` runners cover TS/Node. Python services use thin runner wrappers (`runners/python-service-health/`, `runners/python-lint/`, `runners/python-test/`) that shell out to `pytest`, `ruff`, `mypy`. Pattern already proven on `ai-warehouse` dogfood.

### Polyglot recipes in v1.0 priority list

Of the 5 priority recipes:

- `saas-multitenant-baseline` — pure TS
- `saas-rag-chat` — pure TS (pgvector keeps embeddings in Postgres)
- `saas-agent-platform` — pure TS
- `fintech-ledger-app` — pure TS
- `internal-tool-dashboard` — pure TS

Polyglot recipes ship in v1.1+ as needs surface (e.g., `saas-rag-chat-with-finetune`, `fintech-trading-backtester`).

## Consequences

**Positive:**

- Real finance / ML use cases unlocked without per-app ADRs.
- ai-warehouse stays first-class.
- Recipe declares all polyglot dependencies explicitly — no implicit drift.

**Negative:**

- Forge complexity: must scaffold + deploy multiple runtimes.
- Test surface bigger: TS + Python both tested in CI.
- Multi-runtime deployment requires Modal/Railway accounts (handled via 1Password per ADR-0006).

**Neutral:**

- v1.0 recipes are all pure TS. Polyglot is available as a v1.1 surface.

## Alternatives Considered

1. **Strict TS-only forever.** Rejected — kills ML/quant finance use cases.
2. **Anything goes (any language, any runtime).** Rejected — destroys factory predictability.
3. **Python as a sub-package inside Next.js app.** Rejected — Vercel doesn't run Python well; wrong deploy target.

## Soak

7 days, co-soak with ADR-0002.
