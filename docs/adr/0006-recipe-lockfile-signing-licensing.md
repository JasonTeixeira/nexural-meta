# ADR-0006: Recipe Lockfile, Sigstore Signing, License Composition

**Status:** Proposed
**Date:** 2026-05-21
**Deciders:** Sage
**Soak ends:** 2026-05-28
**Depends on:** ADR-0002

## Context

Three institutional-grade gaps in the locked plan:

1. **No recipe lockfile** in emitted apps → no clean upgrade path. Six months after forging, you can't compute the delta between the recipe-as-was and the recipe-as-is.
2. **Recipes not signed** → supply-chain attack vector. A compromised recipe taints every downstream app forged from it.
3. **License composition undefined** → legal blocker when emitted apps go to customers. Mixed-license output without attribution is a lawsuit waiting.

Also unaddressed: **secrets handling during forge**. Currently undefined where Stripe keys, Supabase URLs, Anthropic tokens come from when `nx forge` runs.

## Decision

### 1. `forged.lock.yaml` in every emitted app

Every `nx forge` writes a checked-in lockfile at `.nexural/forged.lock.yaml` capturing exactly what produced the app:

```yaml
schema_version: 1
forged_at: 2026-06-01T14:23:11Z
forged_by_nx_version: 1.2.3
recipe:
  name: saas-multitenant-baseline
  version: 1.0.0
  sha: 9f3a8b7c...
  signature: MEUCIQD... # cosign signature
  provenance: https://github.com/.../attestations/ # SLSA L3 URL
warehouses_consumed:
  - name: auth
    sha: 4d2e1a3b...
    version: 1.2.0
  - name: payments
    sha: 7c9f5e2a...
    version: 1.1.4
inputs:
  tenant_routing: subdomain
  billing_model: seat
  trial: 14-day
  sso: false
model_families_used:
  - anthropic:opus
  - openai:flagship
sbom_hash: f9a3...
```

`nx upgrade <app>` reads the lockfile, fetches current recipe + warehouses, diffs, and emits a PR with the upgrade.

### 2. Recipe signing — Sigstore + SLSA L3

Every recipe is built into a tarball, signed via cosign + OIDC from GitHub Actions, with SLSA L3 provenance attestation. Same pattern as `@nexural/*` packages.

- Recipes published to a registry inside `nexural-meta` as **GitHub Releases** tagged `recipe/<name>@<version>`.
- `nx forge` verifies signature + provenance BEFORE emitting.
- Refuses unverified or invalid recipes.
- Compromised recipe → revoke from registry → `nx forge` immediately fails for that recipe.

### 3. Secrets handling during forge — 1Password CLI references

Recipes declare required secrets by **logical name**, never by raw value. At forge time, `nx forge` resolves each via `op` (1Password CLI).

```yaml
# in recipe.yaml
secrets_required:
  - logical_name: stripe.test.secret_key
    op_path: "op://Nexural/Stripe/test/secret_key"
    target_file: .env.local
    target_var: STRIPE_SECRET_KEY
  - logical_name: anthropic.api_key
    op_path: "op://Nexural/Anthropic/api_key"
    target_file: .env.local
    target_var: ANTHROPIC_API_KEY
```

Resolution rules:

- Secrets are written ONLY to the new repo's local `.env.local`.
- `.env.local` is in `.gitignore` by default (recipe enforces).
- Nothing checked in. Nothing in shell history. Nothing in `~/.nexural/`.
- For CI: GitHub Actions secrets referenced via the same logical names.

### 4. License composition rules

#### Output license

Every recipe declares `output_license`. Allowed values (v1.0):

- `MIT` (default)
- `Apache-2.0`
- `ISC`

Each emitted app gets a `LICENSE` file matching this.

#### Dependency license gate

During forge, an SBOM is generated for the to-be-emitted package set (via `cyclonedx-npm` or equivalent). Forge fails if any direct or transitive dep is:

- **Strong copyleft:** GPL-2.0, GPL-3.0, AGPL-3.0, LGPL-2.1, LGPL-3.0
- **Source-available commercial-restricted:** BUSL-1.1, SSPL-1.0, Elastic-2.0 — UNLESS recipe explicitly opts in via `commercial_restricted_ok: true`
- **Unknown license** (license field missing in package metadata)

Allowed by default: MIT, Apache-2.0, ISC, BSD-2-Clause, BSD-3-Clause, MPL-2.0, CC0-1.0, Unlicense, 0BSD.

#### Attribution

Every emitted app gets `THIRD_PARTY_NOTICES.md` auto-generated from SBOM at forge time. Updated on every `nx upgrade`.

#### Warehouse content vs. warehouse code licensing

- Warehouse **content** (markdown, fixtures, prose) is **CC-BY-SA-4.0**. Stays in the warehouse, queryable via MCP. NEVER copied into emitted apps.
- Warehouse **code** (template files, TypeScript snippets in `templates/`) is **MIT**. Copied into emitted apps under recipe's output_license.
- Recipes ONLY emit from `templates/`, never from content files. The line is enforced by a forge-time check: any path read from a warehouse during emit must be under `templates/`.

## Schema additions (`@nexural/schema` amendment)

Add to `packages/schema/src/recipe.ts`:

```ts
import { z } from "zod";
import { SchemaVersion, KebabSlug, SemverString, Iso8601 } from "./primitives";

export const RecipeManifest = z
  .object({
    schema_version: SchemaVersion,
    name: KebabSlug,
    version: SemverString,
    description: z.string().min(20).max(500),
    output_license: z.enum(["MIT", "Apache-2.0", "ISC"]),
    commercial_restricted_ok: z.boolean().default(false),
    extends: KebabSlug.optional(),
    composes: z.array(KebabSlug).default([]),
    inputs_schema: z.string(), // path to inputs.zod.ts
    warehouses: z.array(KebabSlug).min(1),
    services: z.array(ServiceDeclaration).default([]), // per ADR-0004
    qa_profile: z.enum(["fast", "standard", "thorough", "deep"]).default("standard"),
    cost_envelope: CostEnvelope, // per ADR-0007
    model_families: z.array(z.string()).default([]),
    secrets_required: z
      .array(
        z
          .object({
            logical_name: KebabSlug,
            op_path: z.string().regex(/^op:\/\//),
            target_file: z.string(),
            target_var: z.string().regex(/^[A-Z_][A-Z0-9_]*$/),
          })
          .strict(),
      )
      .default([]),
    emit: z
      .object({
        template_path: z.string(),
        pre_emit_hooks: z.array(z.string()).default([]),
        post_emit_hooks: z.array(z.string()).default([]),
      })
      .strict(),
    threat_model_path: z.string(), // required per ADR-0008
    decisions_path: z.string(), // required per ADR-0008
  })
  .strict();

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
        signature: z.string(),
        provenance: z.string().url(),
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
```

## Consequences

**Positive:**

- Clean upgrade path forever via lockfile diff.
- Supply-chain attack window closed for recipes (signed + verified at forge).
- Legal posture clean: every emitted app is shippable to enterprise.
- Secrets never touch git, never touch `~/.nexural/`, never in shell history.

**Negative:**

- Forge slower by ~5s (signature verification + SBOM scan).
- Sigstore CI for recipes adds setup complexity (mitigated: same pattern as `@nexural/*`).
- Requires 1Password CLI on every machine that forges.

**Neutral:**

- `nx upgrade` command implementation is now well-specified (was vague before).

## Alternatives Considered

1. **Skip lockfile, version recipes only.** Rejected — recipes drift faster than warehouses; per-warehouse SHA pinning needed.
2. **No SBOM gate, manual review.** Rejected — solo operator can't manually audit every dep tree at forge time.
3. **Allow AGPL with attribution.** Rejected — AGPL service-side obligations don't fit SaaS distribution.
4. **Store secrets in `~/.nexural/secrets/`.** Rejected — single-point-of-leak if laptop stolen; 1Password gives proper KMS-style access.

## Soak

7 days, co-soak with ADR-0002.
