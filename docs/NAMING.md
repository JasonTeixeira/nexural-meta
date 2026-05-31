# NAMING.md

**Nexural Federation — Naming Conventions (v1.1, includes ADR-0003 amendments)**
**Status:** Canonical. Names are forever — changes require ADR + 14-day soak.
**Owner:** Sage
**Last reviewed:** 2026-05-21
**Decay rate:** 365 days

---

## 2026-05-31 Supersession Note

ADR-0014 clarifies the umbrella naming model. Sage Ideas is the company and
ecosystem umbrella. Sage Ideas Engineering OS is the internal resource factory.
Nexural is a trading/investment product name and legacy implementation namespace.

This document still governs existing `nexural-*`, `@nexural/*`, and `nx`
implementation names. It no longer means that Nexural is the company or the
umbrella identity for the whole ecosystem.

---

## 0. Purpose

Naming is the cheapest decision to get right and the most expensive to change. This document fixes the conventions for every name that appears in Nexural — repos, packages, files, tools, branches, env vars, content slugs, ULIDs, badges, URLs.

Once a public name ships, it's effectively permanent. Pick on purpose.

---

## 1. Top-Level Principles

1. **Predictable.** Given the kind of thing, a person should guess the name correctly without checking.
2. **Greppable.** Names should survive `grep -r` cleanly. No clashes with common words.
3. **Lowercase always.** No camelCase or PascalCase in filenames, URLs, slugs, or repos.
4. **Hyphens between words.** Never underscores in user-visible names. Underscores only in code identifiers.
5. **No abbreviations unless industry-standard.** `mcp` ok, `tx` ok, `wh` not ok.
6. **No version numbers in names.** Versions belong in tags, package versions, and CHANGELOGs — not filenames or repo names.
7. **No company or person names in shared infrastructure.** Sage's name appears in author fields, not in identifiers.
8. **Reserved namespaces are sacred.** `nexural-*`, `@nexural/*`, `*-warehouse` mean specific things. Never reuse for other purposes.

---

## 2. Reserved Namespaces (the four big buckets)

These are the only top-level naming buckets that exist in Nexural. Everything fits in one.

### 2.1 `*-warehouse` — Content repositories

Pattern: `<topic-kebab>-warehouse`

| Examples                                                            | What goes here                                                |
| ------------------------------------------------------------------- | ------------------------------------------------------------- |
| `architecture-warehouse`, `decision-warehouse`, `finance-warehouse` | Domain knowledge repos following the standard warehouse shape |

**Rules:**

- The suffix `-warehouse` is mandatory. No exceptions.
- The topic is **always singular** (`decision-warehouse`, not `decisions-warehouse`).
- The topic is the **dominant noun** of the domain.
- Topics are 1–2 words max. If you need 3 words, you have two warehouses.
- Reserved: any repo ending in `-warehouse` MUST follow the standard warehouse shape (per ARCHITECTURE.md §4.4).

**Banned warehouse names:**

- `meta-warehouse`, `nexural-warehouse`, `qa-warehouse` — collisions
- `core-warehouse`, `main-warehouse`, `master-warehouse` — too generic
- Anything with `secret`, `private`, `personal` — leaks tier info

### 2.2 `nexural-*` — Infrastructure repositories

Pattern: `nexural-<purpose-kebab>`

| Repo                      | Purpose                           |
| ------------------------- | --------------------------------- |
| `nexural-meta`            | Control plane                     |
| `nexural-qa-os`           | Quality verifier                  |
| (future) `nexural-cli`    | If `nx` becomes a standalone repo |
| (future) `nexural-router` | If MCP router is extracted later  |

### 2.3 `@nexural/*` — npm packages

Pattern: `@nexural/<purpose-kebab>`

| Package                              | Purpose                                      |
| ------------------------------------ | -------------------------------------------- |
| `@nexural/schema`                    | Shared schemas                               |
| `@nexural/sdk`                       | Shared helpers + cost-wrapped `llmClient()`  |
| `@nexural/mcp-base`                  | MCP server base class                        |
| `@nexural/qa-runners`                | Re-exported runners                          |
| `@nexural/factory`                   | Codegen engine for `nx forge` (per ADR-0002) |
| `@nexural/model-router`              | Family→ID resolution (per ADR-0007)          |
| `@nexural/cli`                       | The `nx` binary                              |
| (future) `@nexural/migrate-v1-to-v2` | Migration tooling                            |

### 2.4 `nx <command>` — CLI surface

Pattern: `nx <verb>` or `nx <verb>-<modifier>`

| Command (v1.0 — 6 commands per ADR-0002)                                     | Verb form                  |
| ---------------------------------------------------------------------------- | -------------------------- |
| `nx ask`, `nx sync`, `nx health`, `nx open`, `nx forge`, `nx play`, `nx new` | Single verb                |
| `nx rotate-keys`, `nx migrate-schema`                                        | Verb-noun for compound ops |

Deferred to v1.1: `decide`, `review`, `search`, `audit`, `stats`, `backup`.

**Rules:**

- Commands are verbs.
- Single word preferred. Two words when ambiguity demands.
- No flags-as-commands.
- Subcommands reserved if surface grows >20 commands.

---

## 3. Branches, Tags, Releases

### Branches

| Pattern              | Purpose                                                                            |
| -------------------- | ---------------------------------------------------------------------------------- |
| `main`               | Default on every NEW repo (per ADR-0001, existing `master` branches grandfathered) |
| `feat/<short-slug>`  | Feature work                                                                       |
| `fix/<short-slug>`   | Bug fix                                                                            |
| `docs/<short-slug>`  | Doc-only changes                                                                   |
| `chore/<short-slug>` | Tooling, deps                                                                      |
| `release/<version>`  | Release prep                                                                       |
| `incident/<id>`      | Hotfix during incident response                                                    |

**Rules:**

- Non-main branches are short-lived (≤ 7 days). Stale branches auto-deleted weekly.
- No personal-name branches.
- `nexural-qa-os` uses `master` per ADR-0001 (legacy); future repos use `main`.

### Tags

| Pattern                              | Where                                            |
| ------------------------------------ | ------------------------------------------------ |
| `v<major>.<minor>.<patch>`           | Every release. Semver.                           |
| `v<major>.<minor>.<patch>-<pre>.<n>` | Pre-releases                                     |
| `schema-v<major>`                    | Floating tag on `@nexural/schema` major lines    |
| `recipe/<name>@<version>`            | Recipe releases on `nexural-meta` (per ADR-0006) |

### Conventional commits

Required on `nexural-meta`, `nexural-qa-os`, `@nexural/*`. Recommended on warehouses.

```
<type>(<scope>): <subject>
```

| type       | meaning               |
| ---------- | --------------------- |
| `feat`     | New feature           |
| `fix`      | Bug fix               |
| `docs`     | Doc only              |
| `refactor` | No behavior change    |
| `perf`     | Performance           |
| `test`     | Tests only            |
| `chore`    | Tooling, deps         |
| `ci`       | CI changes            |
| `security` | Security-relevant fix |
| `revert`   | Revert a prior commit |

---

## 4. Filenames

- `kebab-case.md` for human-authored content
- `01H8X...ULID.md.age` for private-tier encrypted content
- `PascalCase.md` reserved for top-level canonical docs (ARCHITECTURE.md, etc.)
- `lowercase.config.ext` for config files
- Never spaces. Never special chars. Never non-ASCII.

### Content slugs (public + internal tiers)

Pattern: `YYYY-MM-DD-<topic-kebab>` or just `<topic-kebab>` if timeless.

Recommended prefixes by source_type:

- `principle-`, `playbook-`, `framework-`, `template-`, `runbook-`, `post-mortem-`, `decision-`

### Content slugs (private-encrypted tier)

ULID only. The encrypted `manifest.yaml.age` maps ULID → human topic.

### Scripts

- `scripts/<verb>-<noun>.mjs`
- `.mjs` for plain-node; `.ts` for tsx-run
- Shebang + brief purpose + usage example at top

---

## 5. MCP Tools

Pattern: `<warehouse-topic>.<verb-or-noun>`

| Example                    | Meaning                       |
| -------------------------- | ----------------------------- |
| `architecture.search`      | Search architecture-warehouse |
| `architecture.get_pattern` | Get a specific pattern        |
| `decision.list_recent`     | Recent decisions              |

**Rules:**

- Prefix matches `meta.yaml.mcp.tool_prefix`.
- After dot: snake_case verb or noun.
- Verbs: `search`, `get`, `list`, `create`, `update`, `analyze`, `summarize`.
- Tools exposed by per-warehouse MCP servers; router prefixes.

Arg schemas: snake_case (MCP convention), Zod-validated by `@nexural/mcp-base`.

---

## 6. Files in `nexural-meta`

| Path                                 | Purpose                                        |
| ------------------------------------ | ---------------------------------------------- |
| `docs/ARCHITECTURE.md`               | Canonical architecture                         |
| `docs/THREAT_MODEL.md`               | Threat model                                   |
| `docs/SCHEMA_CHARTER.md`             | Schema charter                                 |
| `docs/SCHEMA_AMENDMENTS.md`          | Consolidated new schemas (per ADR-0009 §1.2)   |
| `docs/NAMING.md`                     | This file                                      |
| `docs/RETIREMENT.md`                 | Lifecycle protocols                            |
| `docs/SUCCESSION.md`                 | Continuity                                     |
| `docs/OPS_CALENDAR.md`               | Operational rhythm (per ADR-0009 §1.2)         |
| `docs/BUILD_PLAN.md`                 | Phased build sequence                          |
| `docs/VERIFICATION.md`               | Per-phase gates                                |
| `docs/PRE_FLIGHT.md`                 | Pre-Phase-1 checklist                          |
| `docs/INDEX.md`                      | Reading order + glossary                       |
| `docs/POST_V1_BACKLOG.md`            | v1.1+ items                                    |
| `docs/adr/NNNN-<title-kebab>.md`     | ADRs                                           |
| `docs/runbooks/<topic>.md`           | Operator runbooks                              |
| `docs/drills/<topic>.md`             | Drill checklists                               |
| `incidents/YYYY-NN-<title-kebab>.md` | Incident records                               |
| `apps/<name>/`                       | Long-running services (router, dashboard, cli) |
| `packages/<name>/`                   | Library code (`@nexural/*`)                    |
| `infra/<area>/`                      | Infrastructure-as-code                         |
| `scripts/<verb>-<noun>.mjs`          | One-off and cron scripts                       |
| `templates/<tier>-warehouse/`        | Warehouse templates                            |
| `security/revoked-recipes.yaml`      | Revocation list (per ADR-0009 §1.6)            |
| `recipes/<name>/`                    | Recipe source (per ADR-0002, 0006)             |
| `registry-factory.yaml`              | Generated (per ADR-0003)                       |
| `registry-lifeops.yaml`              | Generated (per ADR-0003)                       |
| `registry-external-mcp.yaml`         | Manual (per ADR-0005)                          |
| `scorecard.json`                     | Generated                                      |
| `STATE.md`                           | Build state (per ADR-0008)                     |

---

## 7. Environment Variables

Pattern: `NEXURAL_<AREA>_<NAME>` — SCREAMING_SNAKE_CASE, namespace-prefixed.

| Variable                   | Purpose                                              |
| -------------------------- | ---------------------------------------------------- |
| `NEXURAL_HOME`             | Override of `~/.nexural`                             |
| `NEXURAL_ROUTER_URL`       | MCP router endpoint                                  |
| `NEXURAL_TELEMETRY_DEST`   | `local` \| `turso` \| `none`                         |
| `NEXURAL_LLM_PROVIDER`     | `anthropic` \| `openai` \| `ollama`                  |
| `NEXURAL_LLM_MODEL`        | model identifier                                     |
| `NEXURAL_LOG_LEVEL`        | `debug` \| `info` \| `warn` \| `error`               |
| `NEXURAL_BACKUP_DEST`      | b2 bucket override                                   |
| `NEXURAL_NO_TELEMETRY`     | `1` disables telemetry                               |
| `NEXURAL_DEBUG_RAW_ARGS`   | `1` allows raw arg logging (NEVER in prod)           |
| `NEXURAL_FORGE_OUTPUT_DIR` | Override forge output base (`~/code/apps/`)          |
| `NEXURAL_OP_VAULT`         | 1Password vault for secret resolution (per ADR-0006) |

**Rules:**

- Always `NEXURAL_*`. No bare `LLM_PROVIDER`.
- Secret env vars live in GitHub Actions secrets, 1Password, never in `.env` committed to repos.
- `.env.example` files SHOULD exist in every repo with safe placeholder values.

---

## 8. URLs

### Public domain (`nexural.dev`)

| Path                      | Content                                            |
| ------------------------- | -------------------------------------------------- |
| `/`                       | Landing                                            |
| `/w/<warehouse>`          | Public warehouse browser                           |
| `/scorecard/<warehouse>`  | Public scorecard page                              |
| `/badges/<warehouse>.svg` | Embeddable scorecard badge                         |
| `/docs/`                  | Public docs subset                                 |
| `/registry.json`          | Public registry (factory only)                     |
| `/changelog`              | Federation changelog                               |
| `/security/revocations`   | Public view of revoked recipes (per ADR-0009 §1.6) |

Internal tools live at `localhost:<port>` only. If ever exposed: `admin.nexural.dev` behind auth.

### Repo URLs

`https://github.com/JasonTeixeira/<repo-name>` — personal GitHub account currently. ADR documents any future org migration.

---

## 9. Versioning Names

| Name                            | Format                                    |
| ------------------------------- | ----------------------------------------- |
| Package versions                | strict semver `1.2.3`                     |
| Schema versions (in data)       | integer `schema_version: 1`               |
| `nx` CLI version                | semver, follows `@nexural/cli`            |
| Warehouse content version       | not versioned individually — git history  |
| Recipe versions                 | semver per recipe (per ADR-0006)          |
| Manifests with breaking changes | per SCHEMA_CHARTER major-version protocol |

---

## 10. Logging & Telemetry Names

### Event names (telemetry `kind`)

snake_case verb_noun:

- `tool_call`
- `nx_command`
- `decay_warn`
- `audit`
- `backup_completed`
- `key_rotated`
- `cost_event` (per ADR-0007)
- `tool_call_audit` (per ADR-0010 §2.10)

### Log fields

snake_case. Standard: `ts`, `level`, `event`, `host`, `process`, `session_id`, `latency_ms`, `error_code`, `error_message`.

---

## 11. Anti-Patterns (banned)

- ❌ `*-warehouse-v2` — versions belong in tags
- ❌ `warehouse-architecture` — wrong word order
- ❌ `architecture` (without `-warehouse`) — collides with topic
- ❌ `personal-warehouse`, `private-decisions-warehouse` — tier info in name
- ❌ `nexural-warehouse-router` — mixing namespaces
- ❌ `the-` prefixes — articles
- ❌ Cryptic abbreviations
- ❌ Inside jokes — names outlive moods
- ❌ Emoji in repo / package / tool names
- ❌ Collision with common Unix/JS terms
- ❌ camelCase or PascalCase in npm package names

---

## 12. Naming Decision Tree

```
1. What kind of thing?
   ├─ Knowledge repo? → <topic>-warehouse
   ├─ Infrastructure repo? → nexural-<purpose>
   ├─ npm package? → @nexural/<purpose>
   ├─ CLI command? → nx <verb>
   ├─ MCP tool? → <warehouse-topic>.<verb>
   ├─ Recipe? → <sector>-<purpose-kebab> (e.g. saas-rag-chat, fintech-ledger-app)
   ├─ Forged app? → <purpose-kebab> (no prefix; each is its own brand)
   ├─ Content file (public/internal)? → <topic-kebab>.md
   ├─ Content file (private)? → <ulid>.md.age
   ├─ Branch? → feat/<slug> | fix/<slug> | docs/<slug> | chore/<slug>
   ├─ Env var? → NEXURAL_<AREA>_<NAME>
   ├─ Telemetry event? → snake_case verb_noun
   ├─ ADR? → NNNN-<title-kebab>.md
   └─ Anything else? → STOP. Ask: does it really belong?

2. Predictability test: "If I described this to someone, would they guess?"
3. Longevity test: "Will this still make sense in 5 years?"
4. Namespace test: "Does this fit in one of the reserved namespaces?"
```

---

## 13. Reserved Names (DO NOT USE)

Permanently reserved:

- `meta`, `core`, `main`, `master`, `system`, `internal`, `default`
- `test`, `tests`, `e2e`, `staging`, `prod`
- `tmp`, `temp`, `scratch`, `wip`, `draft`
- `nexural` standalone (always prefixed/scoped)
- `nexural-factory`, `nexural-lifeops` (per §15 below — federation identifiers, not repo names)
- Any name starting with a number or symbol

---

## 14. Document Maintenance

- Review every 365 days
- Changes require ADR + 14-day soak

---

## 15. GitHub topic taxonomy (per ADR-0003) — AMENDMENT

Every warehouse MUST carry exactly one of:

- `nexural-factory` — for app-building patterns (30 warehouses)
- `nexural-lifeops` — for personal/strategic knowledge (14 warehouses)

`nexural-warehouse` (legacy generic topic) is deprecated. Existing warehouses carrying it must migrate to one of the two scoped topics within 90 days of v1.0.

Carrying BOTH `nexural-factory` AND `nexural-lifeops` is forbidden. Verify-all fails.

External MCP endpoints (e.g., `ai-warehouse` per ADR-0005) do NOT carry either topic — they are federated via `registry-external-mcp.yaml` and not bound by federation topic rules.

---

## CHANGELOG

- **2026-05-21** v1.1 — Added §15 GitHub topic taxonomy (ADR-0003). Added §6 references to new file paths. Added `@nexural/factory`, `@nexural/model-router` to §2.3. Added recipe + forged-app patterns to §12. Reserved `nexural-factory`, `nexural-lifeops` in §13. Updated §2.4 to reflect 6-command v1.0 surface.
- **2026-05-20** v1.0 — Initial canonical draft.
