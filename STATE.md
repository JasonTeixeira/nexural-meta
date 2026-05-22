# Nexural Build State

> Single source of truth for "where is the build now?" Updated at end of every session. Read at start of every AI session. Per ADR-0008.

---

## Current state

- **Current phase:** **Phase 1 (Shared Foundations) — CODE COMPLETE; awaiting Sage confirmation to push + tag**
- **Soak window:** WAIVED by Sage 2026-05-21. ADRs 0002–0010 locked.
- **Last commit:** `c4e85c1` — "feat: Phase 0 + Phase 1 — constitution + @nexural/\* packages v0.1.0"
- **Last tag:** none (`v0.1.0` tag awaits GitHub repo creation + push)
- **Last touched:** 2026-05-22
- **Mode signal from Sage:** "yolo mode" — autonomous execution + Phase 1 go signal received

## Phase 1 deliverables — STATUS

### Workspace + tooling ✅

- pnpm workspace + Turborepo + TypeScript strict + vitest + tsup + ESLint + Prettier + changesets
- `.npmrc` with `enable-pre-post-scripts=false` (forge sandbox baseline per ADR-0009 §1.7)
- `eslint.config.js` enforces no-any + no-TODO + unused-var
- `tsconfig.base.json` with `exactOptionalPropertyTypes` + `noUncheckedIndexedAccess`

### Six @nexural/\* packages — all green ✅

| Package | Version | Tests | Notes |
| --- | --- | --- | --- |
| @nexural/schema | 0.1.0 | 299 (100% coverage) | 21 canonical schemas + JSON Schema exports |
| @nexural/sdk | 0.1.0 | 20 | streaming cost-wrapped llmClient + checkDecay + sha256Hex |
| @nexural/mcp-base | 0.1.0 | 17 | `<warehouse_content>` envelope + middleware tool handler |
| @nexural/qa-runners | 0.1.0 | 8 | typed runner registry incl. 5 new federation runners |
| @nexural/factory | 0.1.0 | 36 | recipe loader + license gate + typosquat + lockfile builder + revocation |
| @nexural/model-router | 0.1.0 | 21 | family→ID with deprecation + price ceiling |
| **TOTAL** | | **401 tests, 0 failing** | |

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

| Criterion | Status | Notes |
| --- | --- | --- |
| All 6 packages publishable | ⏳ pending push + tag | code is ready; awaiting Sage confirmation |
| Every schema ≥5 invalid fixtures | ✅ | inline named cases per VERIFICATION.md §1 |
| Schema test coverage 100% | ✅ | verified via vitest --coverage |
| SDK coverage ≥70% | ✅ | currently 80% threshold |
| tsc --noEmit clean | ✅ | turbo `typecheck` 9 successful |
| Lint + format green | ✅ | `pnpm format:check` clean |
| JSON Schema exports | ✅ | 21 .json files in dist/json-schema/ |
| No `z.any()` / `z.unknown()` in src | ✅ | grep returns 0 |
| No `as any` / `as unknown` in src | ✅ | grep returns 0 |
| Every package engines.node ≥22 | ✅ | inherited from root |
| Changesets config present | ✅ | `.changeset/config.json` |
| CI sigstore dry-run wired | ✅ | `.github/workflows/ci.yml` `sigstore-dry-run` job |
| SBOM generation wired | ✅ | `.github/workflows/ci.yml` `sbom-dry-run` job |
| `llmClient()` cost-cap enforced | ✅ | 20 tests covering happy path + 3 cap types + streaming abort |
| `@nexural/factory` verifies signature + license gate | ✅ | logic implemented; cosign shell-out in Phase 3 (nx CLI) |
| `@nexural/model-router` initial registry | ✅ | Anthropic, OpenAI, Ollama families |
| Property-based tests via fast-check | ✅ | primitives.test.ts |

## Next session start (assumes Sage confirms gh repo create + tag)

1. **CONFIRM with Sage**: `gh repo create JasonTeixeira/nexural-meta --private --source=. --remote=origin --push`
2. **CONFIRM with Sage**: `git tag v0.1.0 && git push origin v0.1.0` → triggers publish workflow
3. Verify packages publish via OIDC: `npm view @nexural/schema dist.tarball`
4. After v0.1.0 lands: begin Phase 2 — `nexural-meta` skeleton + automation (BUILD_PLAN §Phase 2)

## Soak waivers (per ADR-0009 §1.10 — ≤2 per quarter)

| Date | What was waived | Reason |
| --- | --- | --- |
| 2026-05-21 | 7-day soak on ADRs 0002–0010 | Sage explicit override |

(2026-Q2 waiver count: 1)

## History

History rotates weekly into `STATE.history.md`. Recent entries:

- **2026-05-22:** Phase 1 code complete. 6 @nexural/\* packages built + tested locally. 401 tests passing. CI workflows written. Initial commit `c4e85c1` on `main`. Awaiting Sage confirmation for GitHub repo creation + tag v0.1.0.
- **2026-05-22 (earlier):** Yolo-mode pre-flight walkthrough. SUCCESSION.md merged. Installed 6 CLIs via brew + node@22. PRE_FLIGHT.md updated with mechanical findings.
- **2026-05-21:** Phase 0 docs drafted — 10 ADRs + 6 canonical docs + BUILD_PLAN v2.1 + VERIFICATION + INDEX + PRE_FLIGHT + SCHEMA_AMENDMENTS + OPS_CALENDAR + POST_V1_BACKLOG. Soak waived.
