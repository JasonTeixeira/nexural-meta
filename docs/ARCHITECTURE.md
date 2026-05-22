# ARCHITECTURE.md

**Nexural Federation — System Architecture (v1.1, includes ADR-0002 amendments)**
**Status:** Canonical. Changes require ADR + 7-day soak.
**Owner:** Sage (Sage Ideas LLC)
**Last reviewed:** 2026-05-21
**Decay rate:** 180 days

---

## 0. Purpose

Nexural is a **single-operator SaaS factory** — a federated system that lets one person build, ship, and operate software products in finance, AI, and multi-sector SaaS at the quality and velocity of a 25-person team. Every domain — architecture, security, finance, sales, decision-making, etc. — has a dedicated, machine-readable, agent-queryable knowledge surface PLUS production-grade recipes that emit shippable apps.

If reality and this doc disagree, _fix the doc or fix reality_ — never both silently.

---

## 1. North Star

> **"Any question I'd ask a 25-person team, I can answer with `nx ask` in under 2 seconds, with a citation, from my own captured knowledge. And `nx forge` produces a deployable production-grade app in under 4 hours."**

Every architectural decision is justified against that sentence. If a proposed change doesn't help it, reject.

### Success metrics

| Metric                                   | Target                       | Source                         |
| ---------------------------------------- | ---------------------------- | ------------------------------ |
| `nx ask` p95 latency                     | < 2.0 s                      | telemetry SQLite               |
| `nx ask` answer-with-citation rate       | > 95%                        | router logs                    |
| Warehouse scorecard average              | ≥ 90/100                     | nexural-qa-os                  |
| Stale warehouses (past 2× decay)         | 0                            | nightly verify                 |
| Daily `nx` invocations                   | ≥ 10 (working days)          | telemetry                      |
| Manual maintenance hours/week            | **≤ 3** (per ADR-0009 §1.10) | self-reported, audited monthly |
| Cold-start (laptop → working federation) | ≤ 30 min                     | quarterly drill                |
| `nx forge` (idea → deployed staging)     | ≤ 4 hours                    | per recipe, per ADR-0002       |
| `nx new` (scaffold a new warehouse)      | ≤ 10 min                     | per ADR-0009 §1.5              |

If any metric stays red for 2 consecutive weeks, file an incident and fix before adding features.

---

## 2. Operating Principles (the constitution)

Numbered, immutable without ADR.

1. **Consumer-first.**
2. **Generated > authored.**
3. **Schema before scale.**
4. **Federation, never coupling.** Warehouses share schemas + references, never source.
5. **Dogfood everything.**
6. **One human, automated leverage.**
7. **Trust tiers are physical, not cultural.**
8. **Decay is a first-class metric.**
9. **Measure or remove.**
10. **Future-Sage is the user.**
11. **Local-first.**
12. **No vendor lock.**
13. **Boring tech wins.**
14. **Reversible by default.**
15. **Cost is a constraint.** Federation ≤ $200/month; each forged app ≤ $150/month (per ADR-0009 §1.8). Crossing triggers cost review.
16. **Recipes are the assembly line, not just the shelf.** (Per ADR-0002 — added.)

---

## 3. Topology

```
                          ┌─────────────────────┐
                          │   Human (Sage)      │
                          │   + AI Agents       │
                          │   (Claude, Cursor)  │
                          └──────────┬──────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
              ▼                      ▼                      ▼
       ┌───────────┐         ┌──────────────┐      ┌──────────────┐
       │ nx (CLI)  │         │  MCP clients │      │   Dashboard  │
       │           │         │ (any agent)  │      │  (Next.js)   │
       └─────┬─────┘         └──────┬───────┘      └──────┬───────┘
             │                      │                      │
             └──────────────────────┼──────────────────────┘
                                    │
                  ┌─────────────────▼─────────────────┐
                  │      nexural-meta (control plane) │
                  │                                   │
                  │  ┌──────────┐  ┌──────────────┐   │
                  │  │ MCP      │  │ Registries   │   │
                  │  │ Router   │  │ (factory +   │   │
                  │  │          │  │  lifeops +   │   │
                  │  │          │  │  external)   │   │
                  │  └────┬─────┘  └──────┬───────┘   │
                  │       │               │           │
                  │  ┌────▼───────────────▼───────┐   │
                  │  │ Telemetry (SQLite + Turso) │   │
                  │  └────────────────────────────┘   │
                  │  ┌────────────┐ ┌─────────────┐   │
                  │  │ Scorecard  │ │ Cross-Refs  │   │
                  │  │ Engine     │ │ Validator   │   │
                  │  └────────────┘ └─────────────┘   │
                  │  ┌────────────┐ ┌─────────────┐   │
                  │  │ Backup Cron│ │ Repo-Config │   │
                  │  │ (rclone→B2)│ │ (Terraform) │   │
                  │  └────────────┘ └─────────────┘   │
                  │  ┌────────────────────────────┐   │
                  │  │ Recipes registry           │   │
                  │  │ (signed, SBOM-gated)       │   │
                  │  └────────────────────────────┘   │
                  └─────────────────┬─────────────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
        @nexural/schema    @nexural/sdk          @nexural/mcp-base
        @nexural/factory   @nexural/model-router @nexural/qa-runners
        @nexural/cli                              (versioned npm pkgs)
                                    │
        ┌───────────────────────────┴────────────────────────────┐
        │             FEDERATIONS (per ADR-0003)                 │
        │                                                        │
        │  nexural-factory (30 warehouses — apps)                │
        │    Platform: architecture, auth, payments, database,   │
        │              storage, email, realtime, deployment,     │
        │              observability, security, dx, design,      │
        │              accessibility, performance, runbook       │
        │    AI: agent, rag, eval, prompt, model-routing, safety │
        │    Finance: ledger, compliance, market-data, accounting│
        │    SaaS: billing, multi-tenancy, onboarding, admin,    │
        │          analytics                                     │
        │                                                        │
        │  nexural-lifeops (14 warehouses — personal/strategic)  │
        │    decision, network, career, health, mentoring,       │
        │    interview, learning, failure, comms, vendor,        │
        │    finance-personal, legal-personal, principles,       │
        │    system-prompts                                      │
        │                                                        │
        │  External (per ADR-0005):                              │
        │    ai-warehouse (Python, MCP-federated)                │
        └────────────────────────────────────────────────────────┘
                                    │
              ┌─────────────────────┴─────────────────────┐
              │                                           │
              ▼                                           ▼
       nexural-qa-os                              Backblaze B2
       (verifier, dogfoods all,                  (off-platform backup)
        runs federation-conformance,
        recipe-validity,
        prompt-injection-resilience,
        discipline-scorecard)
```

### Repo count

| Class                        | Count                                                        |
| ---------------------------- | ------------------------------------------------------------ |
| `nexural-meta` control plane | 1                                                            |
| `nexural-qa-os` verifier     | 1                                                            |
| `@nexural/*` shared packages | 6 (schema, sdk, mcp-base, qa-runners, factory, model-router) |
| `@nexural/cli`               | 1 (in `nexural-meta/apps/cli/`)                              |
| Factory warehouses           | 30                                                           |
| Lifeops warehouses           | 14                                                           |
| External MCP endpoints       | 1 (`ai-warehouse`)                                           |
| **Total internal**           | **47 + 1 external**                                          |

Most are read-mostly. Steady-state human touch: ~5 repos/week.

---

## 4. Component Specifications

### 4.1 `nx` CLI

**Tech:** TypeScript, Node 22 LTS, Commander, Ink, pnpm workspace.

**Distribution:** npm (`@nexural/cli`), Homebrew tap, Scoop bucket.

**Commands (v1.0 — 6 commands per ADR-0002, plus `nx new` per ADR-0009 §1.5):**

| Command                    | Purpose                                                | Latency target                         |
| -------------------------- | ------------------------------------------------------ | -------------------------------------- | --------- |
| `nx ask "<q>"`             | Route via MCP router; synthesize answer with citations | p95 < 2s                               |
| `nx sync [--factory        | --lifeops]`                                            | git pull all warehouses; refresh cache | p95 < 60s |
| `nx health [--factory      | --lifeops]`                                            | Terminal dashboard                     | p95 < 1s  |
| `nx open <warehouse>`      | cd + `$EDITOR`                                         | instant                                |
| `nx forge <recipe> <name>` | Emit a new production-grade app                        | p95 < 4 hours                          |
| `nx play <playbook>`       | Execute a playbook with confirmations                  | varies                                 |
| `nx new <warehouse>`       | Scaffold a new warehouse (Phase 5 per ADR-0009 §1.5)   | p95 < 10 min                           |

**Deferred to v1.1:** `decide`, `review`, `search`, `audit`, `stats`, `backup`, `rotate-keys` (interactive wizard). Built when daily use surfaces actual need.

**Config:** `~/.nexural/config.toml` — clone root, MCP router URL, telemetry destination, encryption key source, LLM provider preferences.

**Local cache:** `~/.nexural/cache/` — clones of public + internal warehouses; age-encrypted bundles for private tier.

**Telemetry:** every invocation logs to `~/.nexural/telemetry.db`. Schema in `@nexural/schema/telemetry`.

### 4.2 `nexural-meta` (control plane)

**Tech:** TypeScript, Node 22, pnpm + Turborepo, GitHub Actions, Terraform.

```
nexural-meta/
├── docs/                    ← constitution + ADRs + amendments
├── apps/
│   ├── router/              ← MCP fan-out (Phase 4)
│   ├── dashboard/           ← Next.js 15 UI (Phase 4)
│   ├── cli/                 ← @nexural/cli (Phase 3)
│   └── digest/              ← weekly email/markdown digest
├── packages/                ← @nexural/* (Phase 1)
│   ├── schema/
│   ├── sdk/
│   ├── mcp-base/
│   ├── qa-runners/
│   ├── factory/             ← NEW per ADR-0002
│   └── model-router/        ← NEW per ADR-0007
├── recipes/                 ← Recipe sources (Phases 5-7)
│   ├── saas-multitenant-baseline/
│   ├── saas-rag-chat/
│   ├── saas-agent-platform/
│   ├── fintech-ledger-app/
│   ├── internal-tool-dashboard/
│   └── <escape recipes>/
├── security/
│   └── revoked-recipes.yaml ← per ADR-0009 §1.6
├── infra/
│   ├── repo-config/         ← Terraform
│   ├── backup/              ← rclone + GHA crons
│   └── monitoring/          ← OTel collector config
├── scripts/
│   ├── discover.mjs
│   ├── verify-all.mjs
│   ├── cross-refs.mjs
│   ├── bootstrap.mjs
│   ├── new-warehouse.mjs
│   ├── publish-all.mjs
│   ├── session-save.mjs     ← per ADR-0008
│   └── ops-calendar-export.mjs
├── templates/
│   ├── public-warehouse/
│   ├── internal-warehouse/
│   ├── private-warehouse/
│   └── mcp-only-warehouse/
├── registry-factory.yaml    ← GENERATED (per ADR-0003)
├── registry-lifeops.yaml    ← GENERATED (per ADR-0003)
├── registry-external-mcp.yaml ← MANUAL (per ADR-0005)
├── scorecard.json           ← GENERATED
├── STATE.md                 ← per ADR-0008
└── .github/workflows/
    ├── discover.yml         ← nightly 03:00 UTC
    ├── verify-all.yml       ← nightly 04:00 UTC
    ├── cross-refs.yml       ← on push, nightly
    ├── backup.yml           ← nightly 05:00 UTC
    ├── recipe-validity.yml  ← nightly 05:30 UTC (per ADR-0008)
    └── repo-config.yml      ← weekly drift check
```

### 4.3 Shared packages (`@nexural/*`)

All published to npm. Semver via `changesets`.

| Package                 | Purpose                                                                                                                                 |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `@nexural/schema`       | Zod schemas + JSON Schema for meta, frontmatter, MCP envelope, telemetry, recipe family, external MCP, model router                     |
| `@nexural/sdk`          | `loadMeta()`, `loadFrontmatter()`, `emitTool()`, `logEvent()`, `checkDecay()`, **`llmClient()` cost-wrapped LLM helper (per ADR-0007)** |
| `@nexural/mcp-base`     | Opinionated MCP server base class with telemetry, decay, schema, prompt-injection middleware                                            |
| `@nexural/qa-runners`   | Re-exports of nexural-qa-os runners                                                                                                     |
| `@nexural/factory`      | Codegen engine; recipe verifier; lockfile writer; SBOM gate; sandbox enforcement (per ADRs 0002, 0006, 0009)                            |
| `@nexural/model-router` | Family → ID resolution; deprecation-aware; cost-aware (per ADRs 0007, 0010)                                                             |
| `@nexural/cli`          | The `nx` binary                                                                                                                         |

### 4.4 Warehouses

**Standard shape:**

```
<topic>-warehouse/
├── README.md
├── LICENSE                  ← MIT (public), proprietary (internal/private)
├── CHANGELOG.md
├── meta.yaml                ← schema-validated
├── index.json               ← GENERATED
├── content/
│   └── <slug-or-ulid>/
│       ├── frontmatter.yaml
│       └── body.md
├── playbooks/
├── templates/
├── mcp-server/
│   ├── src/index.ts         ← extends @nexural/mcp-base
│   └── package.json
├── scripts/
│   ├── build-index.mjs
│   └── validate.mjs
├── .nexural/
│   ├── decay.yaml
│   └── badges.json
└── .github/workflows/
    ├── ci.yml
    └── publish.yml          ← MCP server to npm (public only)
```

GitHub topic: exactly one of `nexural-factory` or `nexural-lifeops` per ADR-0003.

---

## 5. Data Flow

### 5.1 Read path (`nx ask`)

```
User: nx ask "how should I price a usage-based SaaS"
    ↓
nx CLI → POST /ask {query} → MCP router
    ↓
Router classifies → relevant warehouses (factory: billing, monetization, ...)
    ↓
Tier confinement applied (per ADR-0009 §1.9):
  --factory: lifeops content excluded
  --lifeops: factory content excluded
  default: both, segregated in prompt
    ↓
Router fans out in parallel (timeout 1.5s each)
    ↓
Each warehouse MCP:
  - Validates request via @nexural/schema
  - Checks decay (prepends ⚠️ STALE if needed)
  - Returns content + citations
  - Emits telemetry
    ↓
Router aggregates → wraps each response in <warehouse_content> envelope (per ADR-0008)
    ↓
Token-budget trim (32k max; lowest-relevance first)
    ↓
Synthesis prompt with isolation directive → LLM (via @nexural/sdk.llmClient)
    ↓
Post-synthesis: citation validation strips hallucinations
    ↓
Router emits aggregate telemetry → response to nx
    ↓
nx renders with citation links (streams in v1.0 if Phase 4 streaming wrap lands; otherwise buffered)
```

### 5.2 Forge path (`nx forge`) — per ADR-0002

```
nx forge saas-rag-chat my-new-rag-product
    ↓
@nexural/factory:
  1. Fetch recipe tarball from nexural-meta GH Releases
  2. cosign verify-attestation (Sigstore + SLSA L3)
  3. Check against security/revoked-recipes.yaml
  4. Validate against RecipeManifest schema
  5. Prompt for inputs (validated via recipe's inputs.zod.ts)
  6. Resolve secrets via op://... → write to .env.local only
  7. Resolve model_families via @nexural/model-router → record IDs
  8. SBOM gate: scan dep tree; fail on AGPL/GPL/BUSL etc.
  9. Emit templates to ./my-new-rag-product/
 10. pnpm install --ignore-scripts (per ADR-0009 §1.7)
 11. Run typosquat detection on lockfile
 12. Write .nexural/forged.lock.yaml
 13. Emit THIRD_PARTY_NOTICES.md
 14. Run qa-os qa run --fast → must pass
 15. Run federation-conformance runner → must pass
 16. git init + initial commit
 17. (Optional) gh repo create (with Sage confirmation)
```

### 5.3 Write path (`nx new` warehouse + content authoring)

```
nx new <warehouse>
    ↓
Choose template (public/internal/private/mcp-only)
    ↓
Fill meta.yaml interactively
    ↓
Create GitHub repo with appropriate topic
    ↓
Apply Terraform repo-config
    ↓
Open PR to nexural-meta registry source list
    ↓
Nightly discover.mjs → registry updated
    ↓
Nightly verify-all.mjs → scorecard + badge published
```

### 5.4 Verification (continuous)

```
Nightly UTC:
  02:00  check-decay.mjs
  02:30  auto-archive-deprecated.mjs
  03:00  discover.yml
  04:00  verify-all.yml (includes federation-conformance + discipline-scorecard)
  04:30  cross-refs.yml
  05:00  backup.yml
  05:30  recipe-validity.yml
  06:00  prompt-injection-resilience (via verify-all)
  13:00 Mon: digest

On-push (per warehouse):
  - schema validation
  - scorecard
  - index rebuild
  - changeset check
```

---

## 6. Trust Tiers (summary; full detail in THREAT_MODEL.md)

| Tier                  | Repo visibility | Encryption                 | Backup             | Federations                     |
| --------------------- | --------------- | -------------------------- | ------------------ | ------------------------------- |
| **Public**            | GitHub public   | None                       | GitHub + B2 mirror | Factory (most)                  |
| **Internal**          | GitHub private  | None                       | GitHub + B2 mirror | Factory (some) + Lifeops (some) |
| **Private-encrypted** | GitHub private  | age + sops, filenames ULID | GitHub + B2 + NAS  | Lifeops (mostly)                |

Filename strategy for private-encrypted: ULID with sops-encrypted `manifest.yaml` mapping ULID ↔ slug.

---

## 7. Tech Stack (locked — changes require ADR)

| Layer                                    | Choice                                                                                         |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Language                                 | TypeScript (strict)                                                                            |
| Runtime                                  | Node 22 LTS                                                                                    |
| Package mgr                              | pnpm 9+                                                                                        |
| Mono-tooling                             | Turborepo (inside `nexural-meta` only)                                                         |
| Schema                                   | Zod 3 + zod-to-json-schema                                                                     |
| MCP                                      | `@modelcontextprotocol/sdk`                                                                    |
| CLI framework                            | Commander + Ink                                                                                |
| Dashboard                                | Next.js 15 (App Router) + shadcn/ui + Tailwind v4                                              |
| Local DB                                 | SQLite (better-sqlite3)                                                                        |
| Optional sync                            | Turso (libsql)                                                                                 |
| Encryption (file)                        | age 1.2+                                                                                       |
| Encryption (structured)                  | sops 3.9+                                                                                      |
| Key hardware                             | YubiKey 5C NFC (×2)                                                                            |
| Key vault                                | 1Password                                                                                      |
| Disaster recovery                        | Shamir Secret Sharing (3-of-5)                                                                 |
| CI/CD                                    | GitHub Actions                                                                                 |
| Signing                                  | Sigstore (cosign) + SLSA L3                                                                    |
| Repo config-as-code                      | Terraform + GitHub provider                                                                    |
| Backup engine                            | rclone                                                                                         |
| Backup destination                       | Backblaze B2 (primary) + local NAS (weekly)                                                    |
| Observability                            | OpenTelemetry → local SQLite + optional Honeycomb                                              |
| Docs (public)                            | Astro Starlight                                                                                |
| Docs (internal)                          | Plain Markdown + Mermaid                                                                       |
| Email/notifications                      | Resend                                                                                         |
| Domain/DNS                               | Cloudflare                                                                                     |
| Default forged app stack (per ADR-0002): | Next.js 15 + Supabase + Stripe + Resend + Vercel + Sentry + PostHog + OTel + Anthropic primary |
| Polyglot recipes allowed (per ADR-0004): | Python via Modal/Railway; Cloudflare Workers                                                   |

**Anti-stack (banned without ADR):** Kubernetes, Docker Swarm, Nomad, microservice orchestration beyond GHA + cron, proprietary AI lock-in, custom databases, graph DBs, Kafka, Yarn, npm-as-mono-tool, Bun (until 2.0 LTS), CommonJS in new code, SaaS without export API.

---

## 8. Cost Model (AMENDMENT per ADR-0009 §1.8)

Three layers, separate budgets:

### Layer 1: Federation COGS — target ≤ $200/month

| Line item                      | Estimate          |
| ------------------------------ | ----------------- |
| GitHub Pro                     | $4                |
| Backblaze B2                   | $1–5              |
| Cloudflare                     | $0                |
| Domain                         | $1                |
| Resend                         | $0–20             |
| LLM API for `nx ask` synthesis | $5–60             |
| Honeycomb                      | $0 (free tier)    |
| Sigstore                       | $0                |
| 1Password                      | $3                |
| YubiKey                        | $0 amortized      |
| **Federation total**           | **~$15–95/month** |

### Layer 2: Per-forged-app COGS — target ≤ $150/month per app

| Line item                 | Estimate (per app, steady state) |
| ------------------------- | -------------------------------- |
| Vercel Pro                | $20                              |
| Supabase Pro              | $25                              |
| Stripe transaction fees   | volume-dependent                 |
| LLM API (app's own usage) | $50–100                          |
| Sentry (free tier OK)     | $0                               |
| PostHog (free tier OK)    | $0                               |
| **Per-app total**         | **~$100–150/month**              |

### Layer 3: Per-recipe unit economics

Enforced by `cost_envelope` declared in each recipe (per ADR-0007). Hard caps on:

- `per_request_usd`
- `per_user_per_day_usd`
- `per_app_per_day_usd`

### Total system budget

**Federation + 5 shipped apps:** ≤ $950/month at steady state.

Crossing triggers cost review ADR. Likely culprit at scale: LLM spend → add prompt-caching layer, switch to cheaper models in family via `@nexural/model-router`, or move LLM-heavy recipes to local Ollama emergency fallback.

---

## 9. Build Sequence

Per `docs/BUILD_PLAN.md` v2.1 (revised per ADR-0009 §1.3 for realistic 19–22 weekend calendar).

| Phase | Goal                                                                                   | Tag    |
| ----- | -------------------------------------------------------------------------------------- | ------ |
| **0** | Constitution + ADRs locked                                                             | none   |
| **1** | `@nexural/*` packages published (6 packages incl. factory + model-router)              | v0.1.0 |
| **2** | `nexural-meta` skeleton + dual-federation discovery + B2 backup                        | v0.2.0 |
| **3** | `nx` CLI v1 (6+1 commands) + dogfood week                                              | v0.3.0 |
| **4** | MCP router + telemetry + dashboard + prompt-injection defense + LLM adapter            | v0.4.0 |
| **5** | 4 templates + 15 platform warehouses + Recipe #1 + 3 new qa-os runners + escape recipe | v0.5.0 |
| **6** | 6 AI warehouses + Recipes 2–3 + 2 escape recipes                                       | v0.6.0 |
| **7** | 9 finance + SaaS warehouses + Recipes 4–5 + remaining escapes                          | v0.7.0 |
| **8** | `nexural-lifeops` split + Sigstore live + SLSA L3 + nexural.dev + SUCCESSION drill     | v1.0.0 |

---

## 10. Quality Gates

| Gate                                    | Where                         | Blocking?                               |
| --------------------------------------- | ----------------------------- | --------------------------------------- |
| Schema validation                       | per-warehouse CI + verify-all | yes                                     |
| Scorecard ≥ 80                          | per-warehouse CI              | yes                                     |
| Scorecard ≥ 90                          | nightly verify-all            | warn (file issue)                       |
| Cross-ref validity                      | per-warehouse CI + nightly    | yes                                     |
| Decay                                   | nightly                       | warn at 1×, quarantine at 2×            |
| Type check                              | all TS CI                     | yes                                     |
| Test coverage ≥ 70%                     | shared packages CI            | yes                                     |
| Schema coverage = 100%                  | `@nexural/schema` CI          | yes                                     |
| Sigstore signature on release           | release workflow              | yes                                     |
| Recipe signature on forge               | `nx forge`                    | yes (per ADR-0006)                      |
| Backup success                          | nightly                       | page if fails 2 nights                  |
| Telemetry healthy                       | hourly                        | warn if 0 events in 24h                 |
| `federation-conformance` on forged apps | forged app CI                 | yes (per ADR-0008)                      |
| `recipe-validity` nightly               | nexural-meta CI               | warn (recipe flagged degraded if fails) |
| `prompt-injection-resilience`           | nightly verify-all            | warn (warehouse scorecard penalty)      |
| `discipline-scorecard`                  | nightly verify-all            | warn (incident if drift >14 days)       |

---

## 11. Failure Modes & Mitigations

| Failure                                 | Likelihood          | Impact                        | Mitigation                                                                                   |
| --------------------------------------- | ------------------- | ----------------------------- | -------------------------------------------------------------------------------------------- |
| GitHub outage                           | Medium              | High (read), Critical (write) | Local clones via `nx sync`; B2 mirror                                                        |
| GitHub account compromise               | Low                 | Catastrophic                  | YubiKey-only auth; SSH signing; dedicated recovery email                                     |
| YubiKey lost/destroyed                  | Medium (over years) | High                          | Second YubiKey; 1Password kit; Shamir 3-of-5                                                 |
| Both YubiKeys lost                      | Low                 | Catastrophic for private      | Shamir 3-of-5 reconstruction; per SUCCESSION.md                                              |
| age/sops zero-day                       | Very low            | Catastrophic                  | Layered defense; audit log of decryptions                                                    |
| `@nexural/*` npm compromise             | Low                 | Medium                        | Sigstore signatures; SLSA L3; pinned versions                                                |
| Recipe compromise                       | Low                 | High                          | Sigstore + SLSA on recipes; revocation list (per ADR-0009 §1.6)                              |
| Prompt-injection in synthesis           | Medium              | Medium                        | XML envelope wrapping (per ADR-0008); citation validation                                    |
| LLM provider outage                     | Medium              | Medium                        | Multi-provider via `@nexural/model-router`                                                   |
| Model deprecation                       | Certain             | Medium                        | Family-not-ID resolution (per ADR-0007); Renovate-style PRs                                  |
| Cost runaway (per app)                  | Medium              | Medium                        | Hard caps via `@nexural/sdk.llmClient()` (per ADR-0007)                                      |
| B2 outage                               | Low                 | Low                           | Local NAS weekly is independent                                                              |
| Registry corruption                     | Low                 | High                          | Generated nightly from sources; rollback in < 5 min                                          |
| Human burnout / 6mo absence             | Real                | High                          | Auto-quarantine; STALE warnings; SUCCESSION.md dead-man                                      |
| Knowledge loss (laptop dies, no backup) | Low                 | Catastrophic                  | 3-2-1 rule; bootstrap.mjs RTO ≤ 30 min                                                       |
| Tier confinement leak                   | Low                 | Medium                        | Router middleware enforced (per ADR-0009 §1.9); federation-conformance                       |
| Forge supply-chain attack               | Low                 | High                          | `--ignore-scripts`; typosquat detection; SBOM gate; signatures (per ADR-0006, ADR-0009 §1.7) |

---

## 12. ADR Process

Architectural changes → ADRs in `nexural-meta/docs/adr/`.

**Format:** `NNNN-kebab-case-title.md`

**Template:**

```markdown
# ADR-NNNN: Title

**Status:** Proposed | Accepted | Superseded by ADR-XXXX | Deprecated
**Date:** YYYY-MM-DD
**Deciders:** Sage

## Context

## Decision

## Consequences (positive, negative, neutral)

## Alternatives Considered

## Soak Period (7-day minimum, 14-day for security, 30-day for stack)
```

ADRs append-only. Superseding creates new ADR referencing the old.

---

## 13. Glossary

- **Warehouse** — single-domain repo following the standard shape (§4.4).
- **Federation** — `nexural-factory` (30) or `nexural-lifeops` (14). Both share control plane.
- **Recipe** — parameterized composition of warehouses → emits a complete app scaffold.
- **Forge** — `nx forge`; emit an app from a recipe.
- **Forged app** — output of a forge; lives in own repo; contains `.nexural/forged.lock.yaml`.
- **Control plane** — `nexural-meta`. Strict TS/Node.
- **Trust tier** — public | internal | private-encrypted (THREAT_MODEL §1).
- **Decay** — staleness vs. `decay_rate_days`.
- **Scorecard** — `nexural-qa-os` 0-100 score per warehouse.
- **External MCP** — third-party MCP server federated via router (e.g., `ai-warehouse`).
- **Cold start** — bootstrap entire federation onto fresh laptop.
- **Quarantine** — past 2× decay → ⚠️ STALE prepended.
- **Lockfile** — `.nexural/forged.lock.yaml` in emitted app.
- **Cost envelope** — per-recipe unit economics declaration.
- **Model family** — stable reference (e.g., `anthropic:opus`) resolved to volatile model ID.
- **Escape recipe** — paired variant using a different vendor/stack.

---

## 14. Document Maintenance

- Read at the start of every Phase
- Review every 180 days
- Changes require ADR + 7-day soak
- Drift between doc and reality treated as P1
- CHANGELOG appended to bottom

---

## 15. Four-layer model (AMENDMENT per ADR-0002)

The federation is explicitly four layers:

```
┌──────────────────────────────────────────────────────────────────┐
│ LAYER 4: Verification  →  nexural-qa-os (v1.0+)                  │
│   + federation-conformance, recipe-validity,                      │
│     prompt-injection-resilience, discipline-scorecard             │
├──────────────────────────────────────────────────────────────────┤
│ LAYER 3: Pipeline      →  @nexural/factory + nx forge|play|upgrade│
├──────────────────────────────────────────────────────────────────┤
│ LAYER 2: Composition   →  Recipes (5 priority + escapes)          │
├──────────────────────────────────────────────────────────────────┤
│ LAYER 1: Reference     →  30 factory + 14 lifeops warehouses      │
│                           + ai-warehouse (external MCP)           │
└──────────────────────────────────────────────────────────────────┘
```

Each layer:

- **Reference (1):** captures knowledge per domain. Source of truth for patterns.
- **Composition (2):** combines references into reusable, parameterized scaffolds.
- **Pipeline (3):** turns compositions into shipped code via codegen + verification.
- **Verification (4):** ensures every layer above stays compliant.

This is the architectural backbone. ADR-0002 establishes it; ADRs 0003–0008 + 0009 + 0010 detail the implementation.

## CHANGELOG

- **2026-05-21** v1.1 — Added §15 four-layer model (ADR-0002). §1 metrics: maintenance hours `≤2` → `≤3` (ADR-0009 §1.10); added forge + new-warehouse latency metrics. §2 added Principle #16 (recipes are the assembly line). §3 topology shows federation split + recipes. §4 added `@nexural/factory` + `@nexural/model-router`. §5 added forge path + tier confinement. §8 cost model split into three layers (ADR-0009 §1.8). §10 added recipe + conformance + discipline gates. §11 added recipe/forge/prompt-injection/tier failure modes.
- **2026-05-20** v1.0 — Initial canonical draft.
