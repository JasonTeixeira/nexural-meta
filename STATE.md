# Nexural Build State

> Single source of truth for "where is the build now?" Updated at end of every session. Read at start of every AI session. Per ADR-0008.

---

## Current state

- **Current phase:** **Phase 6.5 (Vertical Slice + 6 MVP warehouses + adversarial proof) — SHIPPED 🚀**
- **Soak window:** WAIVED by Sage 2026-05-22 for ADR-0011. ADRs 0002–0011 locked.
- **Last tag:** `v0.7.0`
- **Slice status:** `saas-multitenant-baseline` cleared 5 of 6 ADR-0011 gates (emit + install + typecheck + build + adversarial proof). Gate 4 (deploy) is Sage-driven and tracked separately.

## Phase 6.5 deliverables ✅

### ADR-0011 — Vertical Slice Doctrine

Locks the rule: every recipe must forge-and-deploy (6 gates) before earning `shipped`. Recipes that haven't are marked `scaffold`.

### `@nexural/forge-emit@0.1.0` (new package)

Pure render path + disk-write helper. Handlebars-subset renderer with tightened identifier-path regex that ignores JSX inline styles. Five safety floors: unresolved-var, path traversal, duplicate paths, secret-leak scan, binary integrity. 34/34 tests.

### `@nexural/warehouse-base@0.1.0` (new package)

Filesystem warehouse loader + multi-warehouse template composition with cross-warehouse duplicate-path detection. Local-disk only for Phase 6.5; Phase 7+ swaps in MCP fetch. 17 tests.

### `@nexural/schema@0.1.0 → 0.2.0`

Adds `WarehouseManifest` Zod schema for warehouse `manifest.yaml` files. 309 tests (+10).

### `@nexural/qa-runners-federation@0.2.0 → 0.3.0`

Adds `forge-emit-conformance` (5th federation runner). For each recipe, runs a mock emit and asserts no errors. 27 tests across 5 runners.

### Real `nx forge` pipeline

`apps/cli/src/commands/forge.ts` replaces the Phase 3 stub. Recipe load → revocation check → inputs validation → secret resolution (or `--mock-secrets` for slice testing) → warehouse composition → emit → write to disk → git init + first commit → write `.nexural/forged.lock.yaml`. CLI flags: `--inputs`, `--dry-run`, `--force`, `--out-dir`, `--mock-secrets`.

### 6 MVP warehouses (under `warehouses/`)

| Warehouse     | Templates                                                             | Documents                                          |
| ------------- | --------------------------------------------------------------------- | -------------------------------------------------- |
| architecture  | tsconfig, next.config, .gitignore, vercel.json                        | nextjs-15-baseline, typescript-strict              |
| auth          | middleware, lib/supabase/{client,server}, login page, callback route  | supabase-ssr                                       |
| database      | 0001_init.sql (RLS multi-tenant + immutable audit), supabase config   | rls-pattern                                        |
| observability | instrumentation, sentry.{client,server,edge}.config, posthog-provider | sentry-baseline                                    |
| security      | .env.example, lib/security/{redaction,tcpa}                           | pii-redaction, tcpa-compliance, env-secrets-policy |
| dx            | eslint.config, .prettierrc, .editorconfig, README, /api/health route  | tooling-rationale                                  |

`security/` vendors the TCPA gate + PII redaction patterns from sage-agents per ADR-0011 §6.

### Vertical slice verification

`nx forge saas-multitenant-baseline nexural-slice-test --mock-secrets` produces 27 files across 6 warehouses + 3 recipe-local. Emitted app:

- `pnpm install` clean.
- `pnpm typecheck` clean (after patching 2 supabase-cookie typing gaps + 3 sentry DSN-undefined gaps — fixes pushed back to warehouses).
- `pnpm build` produces 6 routes (`/`, `/api/health`, `/callback`, `/login`, `_not-found`, and middleware) — 102 kB shared JS, 137 kB middleware.

### Adversarial proof (`evidence/adversarial/saas-multitenant-baseline/`)

Three deliberate breaks, all caught by the matching gate:

1. **secret_leak** — template inlines a literal secret value → `EmitError(secret_leak)` ✓
2. **unresolved_variable** — template references undefined var → `EmitError(unresolved_variable)` ✓
3. **duplicate_path** — two warehouses emit to the same path → `ComposeError(duplicate_path_across_warehouses)` ✓

Report: `evidence/adversarial/saas-multitenant-baseline/report.json`.

### Deferred to Sage (ADR-0011 gate 4)

- Deploy slice to live Vercel + Supabase + Stripe test environment. Requires Sage's accounts; no automation. Tracked in BUILD_PLAN.md Phase 6.5 §8.

## Phase 6 deliverables ✅

### Recipes (4 new)

- `recipes/saas-rag-chat/` — pgvector + hybrid search (BM25 + dense, RRF fusion), optional Cohere rerank, citation validation, safe-link rewrite, 50-item eval golden set scaffold. Cost cap $0.50/req. Anthropic Opus → OpenAI flagship → Ollama chain.
- `recipes/saas-agent-platform/` — Vercel AI SDK + custom orchestration, Zod-typed tool registry, per-session whitelist (ADR-0010 §2.10), 10-case adversarial eval (100% rejection required), tool_call_audit immutable table. Cost cap $1.00/req.
- `recipes/saas-rag-chat-qdrant/` — Qdrant escape for >1M chunks; collection-per-tenant default; D1-no-RLS threat notes.
- `recipes/saas-rag-chat-openai-first/` — Model chain inverted (OpenAI primary); tighter $0.30/req cap.

### @nexural/qa-runners-federation@0.2.0

- **golden-set-drift** runner (ADR-0010 §2.9) — validates `schema_version`, `drift_threshold_pct`, ≥4 category coverage, non-empty items, id+category per item. 6 new tests. 20/20 total in the package.

### Published packages (8 total)

```
@nexural/qa-runners-federation@0.2.0  (NEW MINOR — added golden-set-drift)
```

All other packages unchanged from Phase 5.

## Phase 5 deliverables ✅

### recipes/saas-multitenant-baseline/

- Recipe scaffold with THREAT_MODEL + DECISIONS + inputs.zod.ts (per ADR-0008 §7)
- Templates for Next.js 15 + Supabase + Stripe + Sentry + PostHog
- Inherits cost discipline + RLS + provenance gates

### @nexural/qa-runners-federation@0.1.0 (published Phase 5)

- `federation-conformance` runner (ADR-0008 §3)
- `recipe-validity` runner (ADR-0008 §4)
- `prompt-injection-resilience` runner (ADR-0008 §2)

## Phase 4 deliverables ✅

### apps/router/ — @nexural/router

- Registry loader for factory + lifeops + external-mcp (ADRs 0003, 0005)
- Synthesis pipeline (ARCHITECTURE §5.1):
  - Tier confinement filter (ADR-0009 §1.9)
  - 32k token-budget trim by relevance (ADR-0010 §2.5)
  - `<warehouse_content>` envelope wrapping (ADR-0008 §1)
  - Citation validation + hallucinated-citation stripping (ADR-0008 §1)
- Multi-provider LLM adapter (Anthropic + OpenAI + Ollama) conforming to `@nexural/sdk` `ProviderCaller`
- Streaming-aware via `@nexural/sdk.llmClient` cost wrapper (ADRs 0007, 0010 §2.4)
- `nexural-router` binary scaffold — full child-spawn loop unlocks once Phase 5 warehouse MCPs exist
- 34 router tests passing

### apps/dashboard/ — @nexural/dashboard

- Next.js 15 + React 18 + App Router + dark theme baseline
- 5 pages: `/`, `/factory`, `/lifeops`, `/scorecard`, `/security/revocations`
- Server-side reads of registries + `scorecard.json` + `revoked-recipes.yaml`
- Run locally: `pnpm --filter @nexural/dashboard dev` → http://localhost:3000

### Workspace state

- 11 packages typecheck clean
- 455+ tests passing across schema/sdk/mcp-base/qa-runners/factory/model-router/cli/router

## Published packages (7 total)

```
@nexural/schema@0.1.0       21 schemas + JSON Schema export, 100% coverage
@nexural/sdk@0.1.0          cost-wrapped llmClient + decay + hash
@nexural/mcp-base@0.1.0     prompt-injection envelope + middleware
@nexural/qa-runners@0.1.0   typed registry of 70+ qa-os runners
@nexural/factory@0.1.0      recipe loader + license gate + lockfile
@nexural/model-router@0.1.0 family→ID with deprecation + price ceiling
@nexural/cli@0.1.0          `nx` CLI: 8 commands, telemetry, Ink dashboard
```

Install: `npm i -g @nexural/cli` → `nx --version`

- **Repo visibility:** PUBLIC (since v0.1.0; required for Sigstore provenance)
- **Last touched:** 2026-05-22
- **Mode signal from Sage:** "yolo mode" — autonomous execution

## Phase 2 deliverables ✅

### Scripts (per ARCHITECTURE §4.2)

- `scripts/discover.mjs` — dual-federation registry generation via gh API + topic search (ADR-0003)
- `scripts/verify-all.mjs` — shells out to nexural-qa-os; aggregates scorecard.json
- `scripts/cross-refs.mjs` — validates `related` links across federation
- `scripts/bootstrap.mjs` — cold-start a laptop; RTO ≤ 30 min target per VERIFICATION §2
- `scripts/session-save.mjs` — STATE.md continuity per ADR-0008
- `scripts/aggregate-changelogs.mjs` — federation-wide CHANGELOG per ADR-0010 §2.7
- `scripts/ops-calendar-export.mjs` — .ics from OPS_CALENDAR.md per ADR-0010 §2.2

### Cron workflows

- `discover.yml` (03:00 UTC) — opens PR on registry drift
- `verify-all.yml` (04:00 UTC) — scorecard.json refresh
- `cross-refs.yml` (04:30 UTC) — link validity
- `backup.yml` (05:00 UTC) — B2 mirror (no-ops until B2 secrets set by Sage)
- `recipe-validity.yml` (05:30 UTC) — placeholder; populates Phase 5
- `aggregate-changelogs.yml` (Mon 12:30 UTC)
- `repo-config.yml` (Mon 11:00 UTC) — Terraform drift check

### Infrastructure

- `infra/repo-config/` — Terraform module enforcing branch protection + federation topic XOR + signed-commit requirement
- `infra/backup/` — rclone config template; B2 secrets needed via `gh secret set B2_*`
- `security/revoked-recipes.yaml` — append-only revocation list (empty) per ADR-0009 §1.6
- `registry-external-mcp.yaml` — lists `ai-warehouse` per ADR-0005

### Pre-commit + secrets discipline

- `.husky/pre-commit` — gitleaks scan + lint-staged + typecheck
- `.gitleaks.toml` — config with fixture/doc allowlist
- `lint-staged` config in package.json

## OUTSTANDING for full Phase 2 verification (per VERIFICATION.md §2)

1. **B2 secrets** — Sage runs:
   ```bash
   gh secret set B2_PUBLIC_ACCOUNT --repo JasonTeixeira/nexural-meta
   gh secret set B2_PUBLIC_KEY     --repo JasonTeixeira/nexural-meta
   # ... (4 more pairs for private/audit/apps buckets)
   ```
2. **B2 buckets created** at https://secure.backblaze.com/b2_buckets.htm
3. **`TF_GITHUB_TOKEN` secret** for Terraform drift-check workflow
4. **Cold-start drill** on spare machine — `pnpm bootstrap --check-only` then full clone test
5. **Branch protection on main** via gh API (deferred until Sage has SSH commit signing wired)
6. **2 consecutive successful nights of backup workflow** — needs item 1+2 first

## v0.1.0 — PUBLISHED with SLSA Provenance ✅

All 6 packages live on npm with SLSA Provenance v1 attestations:

- ✅ [@nexural/schema@0.1.0](https://www.npmjs.com/package/@nexural/schema)
- ✅ [@nexural/sdk@0.1.0](https://www.npmjs.com/package/@nexural/sdk)
- ✅ [@nexural/mcp-base@0.1.0](https://www.npmjs.com/package/@nexural/mcp-base)
- ✅ [@nexural/qa-runners@0.1.0](https://www.npmjs.com/package/@nexural/qa-runners)
- ✅ [@nexural/factory@0.1.0](https://www.npmjs.com/package/@nexural/factory)
- ✅ [@nexural/model-router@0.1.0](https://www.npmjs.com/package/@nexural/model-router)

GitHub Release: https://github.com/JasonTeixeira/nexural-meta/releases/tag/v0.1.0 (SBOM attached).

## Phase 1 deliverables — STATUS

### Workspace + tooling ✅

- pnpm workspace + Turborepo + TypeScript strict + vitest + tsup + ESLint + Prettier + changesets
- `.npmrc` with `enable-pre-post-scripts=false` (forge sandbox baseline per ADR-0009 §1.7)
- `eslint.config.js` enforces no-any + no-TODO + unused-var
- `tsconfig.base.json` with `exactOptionalPropertyTypes` + `noUncheckedIndexedAccess`

### Six @nexural/\* packages — all green ✅

| Package               | Version | Tests                    | Notes                                                                    |
| --------------------- | ------- | ------------------------ | ------------------------------------------------------------------------ |
| @nexural/schema       | 0.1.0   | 299 (100% coverage)      | 21 canonical schemas + JSON Schema exports                               |
| @nexural/sdk          | 0.1.0   | 20                       | streaming cost-wrapped llmClient + checkDecay + sha256Hex                |
| @nexural/mcp-base     | 0.1.0   | 17                       | `<warehouse_content>` envelope + middleware tool handler                 |
| @nexural/qa-runners   | 0.1.0   | 8                        | typed runner registry incl. 5 new federation runners                     |
| @nexural/factory      | 0.1.0   | 36                       | recipe loader + license gate + typosquat + lockfile builder + revocation |
| @nexural/model-router | 0.1.0   | 21                       | family→ID with deprecation + price ceiling                               |
| **TOTAL**             |         | **401 tests, 0 failing** |                                                                          |

### Build artifacts ✅

- `pnpm build` ⚡️ 6 packages compile clean
- `pnpm typecheck` ⚡️ 9 tasks succeed
- `pnpm test` ⚡️ 401 tests pass
- `pnpm format:check` ⚡️ all green

### CI ✅

- `.github/workflows/ci.yml`: install, typecheck, lint, test:coverage (with artifact upload), build, changeset-gate (PR-only), sbom-dry-run, sigstore-dry-run
- `.github/workflows/publish.yml`: gated on `v*.*.*` tag; OIDC publish via changesets with provenance; cosign installer; SBOM attached to GitHub Release
- `.github/PULL_REQUEST_TEMPLATE.md`: enforces ADR-0006/0007 + tests + changeset checklist
- `README.md` at repo root

## OUTSTANDING — Sage actions to complete Phase 1

### Tier 1 — interactive prereqs (still outstanding from 2026-05-22 session)

1. `gh auth refresh -h github.com -s admin:ssh_signing_key`
2. `op signin`
3. FileVault — Turn On
4. YubiKey passkey check on github.com

### Tier 2 — Phase-1-specific gates

5. **Confirm GitHub repo creation** (IRREVERSIBLE) — Sage approval needed for:
   ```
   gh repo create JasonTeixeira/nexural-meta --private
   git remote add origin https://github.com/JasonTeixeira/nexural-meta.git
   git push -u origin main
   ```
6. **Configure GitHub Actions Secrets** before publish workflow can fire:
   - `NPM_TOKEN` (optional — OIDC is preferred; only needed if changesets:publish can't use OIDC)
   - B2 keys (for backup workflow — Phase 2)
7. **Configure npm @nexural org** if not already created
8. **Confirm tag + publish** (IRREVERSIBLE) — Sage approval needed for `git tag v0.1.0 && git push origin v0.1.0`
   - This triggers `.github/workflows/publish.yml` → packages auto-publish to npm

### Tier 3 — accounts/purchases (still outstanding, Phase 2+ blocking)

- B2 account + bucket
- Cloudflare account + `nexural.dev` DNS
- `nexural.dev` domain registration
- Anthropic, OpenAI, Resend, Vercel, Supabase, Stripe, Sentry, PostHog accounts
- Two YubiKey 5C NFC keys

## Verification (per VERIFICATION.md §1)

| Criterion                                            | Status                | Notes                                                        |
| ---------------------------------------------------- | --------------------- | ------------------------------------------------------------ |
| All 6 packages publishable                           | ⏳ pending push + tag | code is ready; awaiting Sage confirmation                    |
| Every schema ≥5 invalid fixtures                     | ✅                    | inline named cases per VERIFICATION.md §1                    |
| Schema test coverage 100%                            | ✅                    | verified via vitest --coverage                               |
| SDK coverage ≥70%                                    | ✅                    | currently 80% threshold                                      |
| tsc --noEmit clean                                   | ✅                    | turbo `typecheck` 9 successful                               |
| Lint + format green                                  | ✅                    | `pnpm format:check` clean                                    |
| JSON Schema exports                                  | ✅                    | 21 .json files in dist/json-schema/                          |
| No `z.any()` / `z.unknown()` in src                  | ✅                    | grep returns 0                                               |
| No `as any` / `as unknown` in src                    | ✅                    | grep returns 0                                               |
| Every package engines.node ≥22                       | ✅                    | inherited from root                                          |
| Changesets config present                            | ✅                    | `.changeset/config.json`                                     |
| CI sigstore dry-run wired                            | ✅                    | `.github/workflows/ci.yml` `sigstore-dry-run` job            |
| SBOM generation wired                                | ✅                    | `.github/workflows/ci.yml` `sbom-dry-run` job                |
| `llmClient()` cost-cap enforced                      | ✅                    | 20 tests covering happy path + 3 cap types + streaming abort |
| `@nexural/factory` verifies signature + license gate | ✅                    | logic implemented; cosign shell-out in Phase 3 (nx CLI)      |
| `@nexural/model-router` initial registry             | ✅                    | Anthropic, OpenAI, Ollama families                           |
| Property-based tests via fast-check                  | ✅                    | primitives.test.ts                                           |

## Next session start (assumes Sage confirms gh repo create + tag)

1. **CONFIRM with Sage**: `gh repo create JasonTeixeira/nexural-meta --private --source=. --remote=origin --push`
2. **CONFIRM with Sage**: `git tag v0.1.0 && git push origin v0.1.0` → triggers publish workflow
3. Verify packages publish via OIDC: `npm view @nexural/schema dist.tarball`
4. After v0.1.0 lands: begin Phase 2 — `nexural-meta` skeleton + automation (BUILD_PLAN §Phase 2)

## Soak waivers (per ADR-0009 §1.10 — ≤2 per quarter)

| Date       | What was waived              | Reason                 |
| ---------- | ---------------------------- | ---------------------- |
| 2026-05-21 | 7-day soak on ADRs 0002–0010 | Sage explicit override |

(2026-Q2 waiver count: 1)

## History

History rotates weekly into `STATE.history.md`. Recent entries:

- **2026-05-22:** Phase 1 code complete. 6 @nexural/\* packages built + tested locally. 401 tests passing. CI workflows written. Initial commit `c4e85c1` on `main`. Awaiting Sage confirmation for GitHub repo creation + tag v0.1.0.
- **2026-05-22 (earlier):** Yolo-mode pre-flight walkthrough. SUCCESSION.md merged. Installed 6 CLIs via brew + node@22. PRE_FLIGHT.md updated with mechanical findings.
- **2026-05-21:** Phase 0 docs drafted — 10 ADRs + 6 canonical docs + BUILD_PLAN v2.1 + VERIFICATION + INDEX + PRE_FLIGHT + SCHEMA_AMENDMENTS + OPS_CALENDAR + POST_V1_BACKLOG. Soak waived.
