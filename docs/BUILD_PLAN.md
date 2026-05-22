# BUILD_PLAN.md

**Nexural Federation — Ordered, Gated Build Sequence (v2.1)**
**Version:** 2.1 — supersedes v2.0 and v1.0
**Reference:** ARCHITECTURE.md §9 (high-level), VERIFICATION.md (gate criteria), ADRs 0002–0010

---

## What changed in v2.1

v2.0 fixed the factory reorientation (ADRs 0002–0008). v2.1 closes the comprehensive-audit Tier 1 + Tier 2 gaps:

- **Entry minimums reduced** from ≥5/≥10 per warehouse to **≥3 with scorecard ≥85** (per ADR-0009 §1.3). Quality over quantity.
- **`nx new` moved from v1.1 → Phase 5** (per ADR-0009 §1.5).
- **Calendar honest:** **19–22 weekends realistic**, not 17. Content-authoring time visible per phase.
- **PRE_FLIGHT amended** with Vercel/Supabase/Stripe/Sentry/PostHog/spare-machine (per ADR-0009 §1.4).
- **ADR-0009 + ADR-0010 mandates** referenced inline at each phase.
- **Cost model split** (federation + per-app + per-recipe) per ADR-0009 §1.8.

---

## How this document works

Each phase has:

- **Goal**, **Deliverables**, **Steps**, **Gate** (cross-ref to VERIFICATION.md), **Tag**, **Sage checkpoints**, **Content-authoring time visibility**.

Phases sequential. No phase starts until prior gate passes.

---

## Pre-flight (per docs/PRE_FLIGHT.md)

100% green before Phase 1 begins. See `docs/PRE_FLIGHT.md` — single source.

Critical additions per ADR-0009: Vercel, Supabase, Stripe, Sentry, PostHog accounts; spare laptop or VM for drills.

---

## Phase 0 — Constitution + ADRs (CURRENT, closing now)

**Goal:** Constitution v1.0 + ADRs 0002–0010 + supporting docs in place.

**Deliverables (all in `docs/` of draft directory):**

- ✅ 6 canonical constitution docs: ARCHITECTURE.md, THREAT_MODEL.md, SCHEMA_CHARTER.md, NAMING.md, RETIREMENT.md, SUCCESSION.md
- ✅ 10 ADRs: 0001 through 0010
- ✅ BUILD_PLAN.md v2.1 (this file)
- ✅ VERIFICATION.md
- ✅ PRE_FLIGHT.md (amended)
- ✅ INDEX.md
- ✅ SCHEMA_AMENDMENTS.md (consolidated)
- ✅ OPS_CALENDAR.md
- ✅ POST_V1_BACKLOG.md
- ✅ STATE.md

**Gate:** VERIFICATION.md §0 — pre-flight 100% green.

**Tag:** none (no code yet).

**Sage checkpoint:** "Phase 0 closed, proceed to Phase 1" recorded in STATE.md.

---

## Phase 1 — Shared Foundations (`@nexural/*` packages) [Weekends 1–2]

**Goal:** Six shared packages published; types resolve in scratch project.

**Calendar honest:** **2 weekends realistic** (not 1). Factory + model-router + property-based testing add real work.

**Content-authoring time:** 0 hours (pure engineering).

**Deliverables:**

- `@nexural/schema@1.0.0` — full schemas per SCHEMA_AMENDMENTS.md
- `@nexural/sdk@1.0.0` — including **streaming-aware `llmClient()`** (per ADR-0010 §2.4)
- `@nexural/mcp-base@1.0.0` — with prompt-injection XML wrapping middleware (per ADR-0008)
- `@nexural/qa-runners@1.0.0` — re-exports of `nexural-qa-os/runners/`
- `@nexural/factory@1.0.0` — codegen + signature verify + SBOM gate + forge sandbox (per ADRs 0002, 0006, 0009)
- `@nexural/model-router@1.0.0` — family resolution + **price ceiling for cost-aware routing** (per ADRs 0007, 0010 §2.8)
- 100% schema test coverage; ≥5 invalid fixtures per schema; **property-based tests via fast-check** (per ADR-0010 §2.5)
- JSON Schema exports in `dist/json-schema/`
- Sigstore signing wired (dry-run; live in Phase 8)
- SBOM generation wired (cyclonedx-npm)
- Changesets configured

**Steps:**

1. pnpm workspace under `packages/`
2. Build `@nexural/schema` per SCHEMA_AMENDMENTS.md (primitives → meta → frontmatter → index → mcp → telemetry → recipe-family → external-mcp → model-router → revocation)
3. Build `@nexural/sdk` including streaming `llmClient()`
4. Build `@nexural/mcp-base` with prompt-injection middleware
5. Build `@nexural/qa-runners`
6. Build `@nexural/factory` — recipe loader, signature verifier, input validator, template emitter, lockfile writer, SBOM gate, forge sandbox
7. Build `@nexural/model-router` with initial Anthropic + OpenAI + Ollama family registry
8. Property-based + standard tests
9. CI: changesets, vitest, tsup, eslint, prettier, tsc, Sigstore dry-run, SBOM
10. Sage reviews PR; tag `v0.1.0`

**Gate:** VERIFICATION.md §1

**Tag:** `v0.1.0`

**Sage checkpoint:** scratch dir `pnpm add @nexural/schema @nexural/sdk @nexural/factory` works; types resolve; sample RecipeManifest parses.

---

## Phase 2 — `nexural-meta` Skeleton + Automation [Weekend 3]

**Goal:** Control plane shell; dual-federation discovery; STATE.md; B2 backup; federation-CHANGELOG aggregator.

**Content-authoring time:** 0 hours.

**Deliverables:**

- `JasonTeixeira/nexural-meta` GitHub repo (private; flips public at v1.0)
- All Phase 0 docs committed to `docs/`
- `STATE.md` at root, current and committed
- `scripts/discover.mjs` — `--federation=factory|lifeops|both` (per ADR-0003)
- `scripts/verify-all.mjs`
- `scripts/cross-refs.mjs`
- `scripts/bootstrap.mjs` — cold-start ≤ 30 min on spare machine
- `scripts/session-save.mjs` — updates STATE.md
- `scripts/aggregate-changelogs.mjs` — federation-wide CHANGELOG (per ADR-0010 §2.7)
- `scripts/ops-calendar-export.mjs` — emits .ics from OPS_CALENDAR.md
- `registry-factory.yaml` + `registry-lifeops.yaml` (generated)
- `registry-external-mcp.yaml` (manual; lists `ai-warehouse` per ADR-0005)
- `infra/repo-config/` Terraform — enforces `nexural-factory` XOR `nexural-lifeops` topic
- `infra/backup/` — rclone + GHA workflow → B2 nightly
- `security/revoked-recipes.yaml` (empty; appended over time per ADR-0009 §1.6)
- 5 cron workflows + recipe-validity workflow (placeholder; full runner in Phase 5)

**Steps:**

1. `gh repo create JasonTeixeira/nexural-meta --private` (Sage confirms)
2. Scaffold structure per ARCHITECTURE §4.2
3. Commit docs/ + STATE.md
4. Implement scripts
5. Scaffold Terraform module
6. Sage provides B2 credentials via GH Secrets
7. Wire 6 cron workflow YAMLs
8. Dogfood: register `ai-warehouse` (external MCP) + `nexural-qa-os`
9. Sage runs `pnpm bootstrap` on spare machine; time RTO
10. Tag `v0.2.0`

**Gate:** VERIFICATION.md §2

**Tag:** `v0.2.0`

**Sage checkpoint:** control plane discovery green; nightly cron green 2 consecutive nights.

---

## Phase 3 — `nx` CLI v1 [Weekends 4–5]

**Goal:** Six daily commands + dogfood week.

**Calendar honest:** **1 weekend build + 1 week dogfood (7 working days)** = 2 weekends.

**Content-authoring time:** 0 hours.

**Deliverables:**

- `@nexural/cli@1.0.0` published
- npm install + Homebrew tap + Scoop bucket
- 6 commands: `ask`, `sync` (with conflict resolution per ADR-0010 §2.3), `health`, `open`, `forge` (placeholder for real Phase 5 recipes), `play`
- Deferred v1.1: `decide`, `review`, `search`, `audit`, `stats`, `backup`, `rotate-keys`
- Telemetry middleware → `~/.nexural/telemetry.db`
- `~/.nexural/config.toml` schema
- `nx session save` updates STATE.md

**Steps:**

1. Scaffold `apps/cli` (Commander + Ink)
2. Implement each command
3. `nx sync` with auto-stash conflict resolution (per ADR-0010 §2.3)
4. `nx forge` placeholder (recipe verification works; recipes themselves Phase 5)
5. `nx play` with confirmation prompts on irreversible steps
6. Telemetry with sha256-hashed args
7. CI tests + cross-platform binaries
8. Scaffold Homebrew tap + Scoop bucket
9. Wire publish workflow
10. Sage installs; uses `nx` daily for 7 days; files issues
11. Tag `v0.3.0`

**Gate:** VERIFICATION.md §3

**Tag:** `v0.3.0`

**Sage checkpoint:** "I've used `nx` daily for a week; it's smooth."

---

## Phase 4 — MCP Router + Telemetry + Dashboard [Weekends 6–7]

**Goal:** Federation queryable from any MCP agent; prompt-injection hardened; cost telemetry; dashboard.

**Calendar honest:** **2 weekends** (was 1; router + dashboard + LLM adapter is real work).

**Content-authoring time:** 0 hours.

**Deliverables:**

- `apps/router` — MCP fan-out + tier confinement (per ADR-0009 §1.9) + MCP hot reload (per ADR-0010 §2.3)
- Prompt-injection XML wrapping middleware
- Citation validation post-synthesis
- Token-budget trimming (32k cap)
- Telemetry pipeline (SQLite + Turso optional sync)
- Decay middleware
- `apps/dashboard` — Next.js 15 + shadcn/ui + Tailwind v4
  - Pages: `/`, `/factory`, `/lifeops`, `/warehouses/[name]`, `/recipes`, `/telemetry`, `/scorecard`, `/decay`, `/costs`, `/security/revocations`
- Multi-provider LLM adapter via `@nexural/model-router`
- Weekly digest job via Resend (Monday 13:00 UTC)
- Cost telemetry events (per ADR-0007)

**Steps:**

1. Scaffold `apps/router` extending `@nexural/mcp-base`
2. Implement fan-out + tier confinement + hot-reload
3. Implement prompt-injection middleware + citation validation
4. Implement decay middleware
5. Implement telemetry SQLite + libsql sync
6. Implement LLM adapter using `@nexural/model-router`
7. Implement `nx ask` synthesis flow
8. Scaffold `apps/dashboard`
9. Implement weekly digest job
10. Dogfood with Claude Desktop
11. Sage configures Anthropic + OpenAI keys
12. Tag `v0.4.0`

**Gate:** VERIFICATION.md §4

**Tag:** `v0.4.0`

**Sage checkpoint:** Claude Desktop sees factory + ai-warehouse; dashboard live; digest hits inbox; cost tab populates.

---

## Phase 5 — Templates + Recipe #1 + 15 Platform Warehouses [Weekends 8–11]

**Goal:** Parent recipe shipping; 15 platform warehouses live; 3 new qa-os runners; `nx new` working.

**Calendar honest:** **4 weekends** (was 3; content authoring is real).

**Content-authoring time:** **≥45 hours** (15 warehouses × ≥3 entries × ~1 hour authoring + review). Front-loaded into the 4 weekends.

**Deliverables:**

- 4 warehouse templates: `public-warehouse`, `internal-warehouse`, `private-warehouse`, `mcp-only-warehouse`
- **`nx new <warehouse>` working** (per ADR-0009 §1.5)
- 15 platform warehouses scaffolded + registered + each with **≥3 entries scoring ≥85** (per ADR-0009 §1.3): architecture, auth, payments, database, storage, email, realtime, deployment, observability, security, dx, design, accessibility, performance, runbook
- **Recipe 1: `saas-multitenant-baseline`** — all artifacts per SCHEMA_AMENDMENTS.md §5 (recipe.yaml, THREAT_MODEL.md, DECISIONS.md, cost_envelope, secrets, sigstore signature, SLSA L3, SBOM-passing)
- **Escape recipe: `saas-multitenant-baseline-cf`** (Cloudflare Pages + Workers + D1)
- **3 new qa-os runners** (per ADR-0008):
  - `federation-conformance`
  - `recipe-validity`
  - `prompt-injection-resilience`
- **`discipline-scorecard` runner** (per ADR-0009 §1.10)
- **Recipe migration codemod** scaffold (per ADR-0010 §2.6)

**Steps:**

1. Build 4 warehouse templates
2. Implement `nx new`
3. For each of 15 warehouses: `nx new` → scaffold → register → Sage authors ≥3 entries → verify scorecard ≥85
4. Build `saas-multitenant-baseline` recipe (templates + threat model + decisions + cost envelope + secrets manifest)
5. Build `saas-multitenant-baseline-cf` escape recipe
6. Implement 4 new qa-os runners
7. Run `recipe-validity` against both recipes; iterate until ≥80
8. Sage: `nx forge saas-multitenant-baseline test-saas-1` → working Vercel deploy
9. Sage: `nx forge saas-multitenant-baseline-cf test-saas-1-cf` → working Cloudflare deploy
10. Tag `v0.5.0`

**Gate:** VERIFICATION.md §5

**Tag:** `v0.5.0`

**Sage checkpoint:** `nx forge saas-multitenant-baseline myapp` produces working app in ≤4 hours.

---

## Phase 6 — AI Recipes + 6 AI Warehouses [Weekends 12–14]

**Goal:** Two AI recipes; 6 AI warehouses with content; real RAG product dogfooded.

**Calendar honest:** **3 weekends.**

**Content-authoring time:** **≥30 hours** (6 warehouses × ≥3 entries × ~1.5 hours for AI content with eval pairs).

**Deliverables:**

- 6 AI warehouses scaffolded + registered + each with ≥3 entries scoring ≥85: agent, rag, eval, prompt, model-routing, safety
- **Recipe 2: `saas-rag-chat`** — all standard artifacts + eval golden set (≥50 Q&A pairs, ≥80% baseline pass rate)
- **Recipe 3: `saas-agent-platform`** — all standard artifacts + tool registry + agent tool-call validation (per ADR-0010 §2.10)
- **2 escape recipes:** `saas-rag-chat-qdrant`, `saas-rag-chat-openai-first`
- **`golden-set-drift` runner** (per ADR-0010 §2.9)
- Real dogfood: one RAG product forged, deployed, ≥10 real queries handled

**Steps:**

1. Scaffold + populate 6 AI warehouses
2. Build `saas-rag-chat` with full opinion lock
3. Build `saas-agent-platform` with agent tool-call validation per ADR-0010 §2.10
4. Build 2 escape recipes
5. Implement `golden-set-drift` runner
6. Dogfood: forge real RAG product; ship; collect queries
7. All recipes pass `recipe-validity` ≥90
8. Tag `v0.6.0`

**Gate:** VERIFICATION.md §6

**Tag:** `v0.6.0`

**Sage checkpoint:** real RAG product deployed; passes `federation-conformance`; cost envelope holds.

---

## Phase 7 — Finance + SaaS Recipes + 9 Specialized Warehouses + Escapes [Weekends 15–17]

**Goal:** All 5 priority recipes ship; all primary vendor escapes tested.

**Calendar honest:** **3 weekends.**

**Content-authoring time:** **≥45 hours** (9 warehouses × ≥3 entries × ~1.5 hours for finance-grade content with audit considerations).

**Deliverables:**

- 4 finance warehouses + 5 SaaS warehouses, each ≥3 entries scoring ≥85: ledger, compliance, market-data, accounting, billing, multi-tenancy, onboarding, admin, analytics
- **Recipe 4: `fintech-ledger-app`** — US GAAP default + IFRS input, multi-currency via dinero.js, UTC storage, immutable audit trail
- **Recipe 5: `internal-tool-dashboard`** (sub-recipe of baseline) — parent SSO, audit retention, time-boxed impersonation
- Escape recipes: `fintech-ledger-app-aws`, `saas-multitenant-baseline-lemon`
- All recipes + escapes pass `recipe-validity` ≥90 / ≥85
- Each escape recipe forged into a test app at least once

**Steps:**

1. Scaffold + populate 9 warehouses
2. Build `fintech-ledger-app` with GAAP/IFRS + multi-currency + immutable ledger
3. Build `internal-tool-dashboard`
4. Build escape recipes
5. Dogfood: forge test fintech app; verify ledger reconciles to zero across 100 random transactions
6. Mutation test: attempt to UPDATE/DELETE ledger entry — must fail at DB level
7. All recipes pass `recipe-validity`
8. Tag `v0.7.0`

**Gate:** VERIFICATION.md §7

**Tag:** `v0.7.0`

**Sage checkpoint:** all 5 priority recipes shippable; all escapes proven; 30/30 factory warehouses live.

---

## Phase 8 — `nexural-lifeops` Split + Hardening + v1.0 Launch [Weekends 18–22]

**Goal:** Lifeops federation seeded; Sigstore + SLSA live; public site; succession rehearsed.

**Calendar honest:** **4–5 weekends.**

**Content-authoring time:** **≥21 hours** for lifeops scaffold + Sage's choice of seed entries (≥1 entry per lifeops warehouse for v1.0 — `status: seeded` is acceptable for most).

**Deliverables:**

- 14 lifeops warehouses scaffolded with `status: seeded` (each `meta.yaml` + README + empty `content/`); discovery picks up
- Sigstore signing LIVE on all `@nexural/*` + all recipes
- SLSA L3 attestations verifiable via `cosign verify-attestation`
- `nexural.dev` site live (Astro Starlight): `/`, `/w/`, `/scorecard/`, `/badges/`, `/docs/`, `/registry.json`, `/changelog`, `/security/revocations`
- Embeddable scorecard badges
- **Mutation testing via stryker-mutator nightly** (per ADR-0010 §2.5)
- Cold-start drill ≤ 30 min documented
- SUCCESSION dry-run with Technical Executor documented
- Blog post draft

**Steps:**

1. Spin up 14 lifeops warehouse repos (private); apply Terraform repo-config
2. Promote Sigstore from dry-run to live OIDC
3. Wire SLSA L3 attestation generation on all release workflows
4. Build nexural.dev site
5. Configure Cloudflare DNS
6. Deploy public site
7. Implement badge SVG endpoints
8. Enable mutation testing nightly
9. Cold-start drill on spare machine; time RTO
10. SUCCESSION dry-run with Technical Executor (per SUCCESSION.md once Sage merges canonical content)
11. Sage drafts blog post
12. Tag `v1.0.0`
13. (Optional) Publish blog post

**Gate:** VERIFICATION.md §8 — all 8 ARCHITECTURE §1 metrics green for 30 consecutive days.

**Tag:** `v1.0.0`

**Sage checkpoint:** v1.0 shipped; public scorecards live; escape recipes proven; succession rehearsed; lifeops federation seeded.

---

## Post-v1.0 Backlog

Per `docs/POST_V1_BACKLOG.md`. Items there are NOT promises — they're a curated wishlist surviving the comprehensive audit. Each becomes its own ADR + phase when prioritized.

---

## Timeline Estimates (weekends only, realistic)

| Phase     | Effort                                          | Calendar               |
| --------- | ----------------------------------------------- | ---------------------- |
| 0         | already done                                    | —                      |
| 1         | 2 weekends                                      | 2 weeks                |
| 2         | 1 weekend                                       | 1 week                 |
| 3         | 1 weekend build + 1 week dogfood                | 2 weeks                |
| 4         | 2 weekends                                      | 2 weeks                |
| 5         | 4 weekends (mostly content)                     | 4 weeks                |
| 6         | 3 weekends (mostly content + AI iteration)      | 3 weeks                |
| 7         | 3 weekends (mostly content + finance precision) | 3 weeks                |
| 8         | 4 weekends (hardening + launch + drills)        | 4 weeks                |
| **Total** | **~20 weekends of focused build + content**     | **~21 calendar weeks** |

Content authoring post-v1.0 is ongoing — that's the steady state. OPS_CALENDAR.md §7 projects ~3 hours/week.

---

## Content-authoring discipline

Per ADR-0009 §1.3: entry quality is the bar, not quantity. **3 entries that pass scorecard ≥85** are worth more than 10 entries that pass at 80. Authoring time per entry:

- Platform warehouse entry: 30–60 min
- AI warehouse entry: 60–90 min (often includes eval examples)
- Finance warehouse entry: 90–120 min (audit considerations, edge cases)
- Lifeops warehouse entry (post-v1.0): 30–60 min

Allocate time on the calendar BEFORE the phase — content authoring is real work that competes with engineering.

---

## What can be parallelized

If using AI subagents:

- Phases 5–7: per-warehouse scaffolding in parallel
- Per-runner implementation in parallel
- Schema fixture generation in parallel
- Recipe template authoring per service in parallel

**Cannot parallelize:** phases themselves; ADRs; private-tier hardware setup; Sigstore key operations; Sage's content authoring.

---

## Recovery from a failed phase

1. Identify failed criterion in VERIFICATION.md
2. Open issue in `nexural-meta`
3. Fix in branch off phase's prior tag (or `main` if first failure)
4. Re-run verification on fresh checkout
5. Tag a patch version
6. Update STATE.md + CHANGELOG.md

Do not bypass a gate.

---

## CHANGELOG

- **2026-05-21** v2.1 — Entry minimums reduced to ≥3 per ADR-0009; `nx new` moved to Phase 5; calendar honest at 19–22 weekends; content-authoring time visible per phase; ADRs 0009/0010 mandates integrated.
- **2026-05-21** v2.0 — Reoriented per ADRs 0002–0008.
- **2026-05-20** v1.0 — Initial canonical draft.
