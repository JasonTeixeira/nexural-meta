# ADR-0013: Multi-repo Sage Ideas Ecosystem — federation by MCP

**Status:** Proposed
**Date:** 2026-05-28
**Deciders:** Sage
**Soak:** WAIVED (Sage, 2026-05-28). Treat as locked at v1.0.10 tag.
**Depends on:** ADR-0003 (federation split), ADR-0005 (ai-warehouse external MCP), ADR-0012 (federation V1)

## Context

The Nexural Federation began as a single-repo control plane (`nexural-meta`). Two additional repos emerged as the engineering surface grew:

- **`ai-warehouse`** — curated parts catalog (861 tools × verdicts), Python MCP server
- **`nexural-qa-os`** — quality assurance operating system (scorecards, runners, phase hardening)

A fourth (`voice-engine`) is in active development. ADR-0003 anticipated a multi-repo shape; ADR-0005 anticipated federation-by-reference for ai-warehouse. Both treated their respective concerns in isolation. There has been no single decision locking the **whole ecosystem shape**.

Without an ADR, three risks materialize:

1. **Implicit drift** — what's "the ecosystem" is defined only in docs/ECOSYSTEM.md, which has no soak + no breaking-change discipline
2. **Vendoring temptation** — when ai-warehouse adds something useful, the "just copy it into nexural-meta" option keeps reappearing without principled resistance
3. **Bus-factor opacity** — a successor encountering 4 repos with no manifesto wouldn't know which is canonical for what

This ADR locks the shape.

## Decision

### 1. The ecosystem is the 4 repos, federated by MCP — not a monorepo

| Repo            | Role                                                 | MCP server                  | When to add to                                             |
| --------------- | ---------------------------------------------------- | --------------------------- | ---------------------------------------------------------- |
| `nexural-meta`  | Control plane: recipes, warehouses, ADRs, audit, CLI | `nexural-federation-server` | Patterns reused across 2+ projects; load-bearing decisions |
| `ai-warehouse`  | Tool catalog with verdicts                           | `mcp-server/server.py`      | New tools, verdict changes, decision trees                 |
| `nexural-qa-os` | QA verification + scorecard                          | `nexural-qa-os-server`      | New runners, hardening phases                              |
| `voice-engine`  | Voice agent toolkit                                  | `voice-engine-server`       | Persona definitions, voice provider adapters               |

Each repo:

- Independently versioned (semver)
- Independently published (npm or PyPI as fits)
- Self-governs runtime + dependencies (TypeScript for nexural-meta + voice-engine TS surface; Python for ai-warehouse + nexural-qa-os + voice-engine engine)
- Ships its own MCP server binary
- Carries a `CLAUDE.md` + `AGENTS.md` at root that references `nexural-meta/docs/ECOSYSTEM.md`

No monorepo. No shared `tsconfig.base.json` across repos. No cross-repo `workspace:^` deps.

### 2. `nexural-meta` is the canonical entry point

Of the 4 repos, **`nexural-meta` is the door**. It:

- Maintains `docs/ECOSYSTEM.md` — the canonical map
- Maintains `registry-external-mcp.yaml` — the registered MCP servers
- Ships the `nx` CLI which wraps the editor-agent workflow (`nx ask`, `nx forge`, `nx ecosystem`, `nx audit`, `nx verify`, `nx serve`)
- Hosts ADRs that govern cross-repo behavior

Other repos may have their own ADRs for repo-local decisions. Cross-repo decisions live here.

### 3. Graduation criteria — when something moves between repos

Knowledge naturally migrates as it matures. Lock the criteria so migration is principled, not ad-hoc.

| Pattern matures in                         | Graduates to                                                  | When                                                                                                          |
| ------------------------------------------ | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Client project (one-off)                   | `nexural-meta/warehouses/<existing>/documents/`               | Used in 2+ projects + you can describe it in <500 words                                                       |
| Warehouse document                         | A new warehouse                                               | When 3+ documents on the same topic accumulate                                                                |
| Warehouse template                         | Recipe template                                               | When 2+ recipes consume the same template                                                                     |
| `ai-warehouse` tool entry with USE verdict | Federation recipe primitive (default in a warehouse template) | When verdict has been USE for 90+ days + no AVOID-adjacent risk                                               |
| `voice-engine` persona                     | Federation prompt warehouse document                          | When persona is stable + reused across 2+ apps                                                                |
| Federation pattern                         | `ai-warehouse` decision tree                                  | Never automatically — federation patterns are code, ai-warehouse entries are vendor catalog (different shape) |

Reverse-direction migrations (federation → other repo) require an ADR.

### 4. Cross-repo dependency rules

| Direction                        | Allowed?                                            | Mechanism                                                    |
| -------------------------------- | --------------------------------------------------- | ------------------------------------------------------------ |
| `nexural-meta` → `ai-warehouse`  | Read-only at runtime                                | `registry-external-mcp.yaml` + `search_warehouse` MCP tool   |
| `nexural-meta` → `nexural-qa-os` | Read-only at runtime                                | `registry-external-mcp.yaml` + `qa_os_check` MCP tool        |
| `nexural-meta` → `voice-engine`  | Read-only at runtime                                | `registry-external-mcp.yaml` + `voice_search` MCP tool       |
| `nexural-qa-os` → `nexural-meta` | Read-only via the meta repo's registry-recipes.yaml | shells out to `nx audit --json` (no direct package import)   |
| `ai-warehouse` → `nexural-meta`  | None                                                | tool catalog is decoupled by design                          |
| `voice-engine` → `nexural-meta`  | None at module level                                | may consume `@nexural/cli` for forge but not import packages |
| Any → Any                        | No circular workspace dependencies                  | enforced manually (no tooling yet)                           |

### 5. Registry-external-mcp.yaml is API

The shape of entries in `registry-external-mcp.yaml` is API per ADR-0012 §2. Adding a new endpoint is a minor bump; changing required fields is a major bump.

Required fields per endpoint: `schema_version`, `name`, `type`, `transport`, `command`. Optional but recommended: `args`, `tool_prefix`, `description`, `quality_attestation`.

### 6. CLAUDE.md + AGENTS.md at every repo root

Every repo in the ecosystem MUST carry a `CLAUDE.md` + identical `AGENTS.md` at root, both:

- Linking to `nexural-meta/docs/ECOSYSTEM.md` as the master map
- Describing the repo's role (one of the 4)
- Listing the repo's MCP tools
- Pointing at which other repo's MCP server an agent should consult for cross-cutting questions

Template templates live at `nexural-meta/evidence/templates/repo-bootstrap/`.

### 7. The voice-engine is added to the ecosystem as repo #4

Per Sage's 2026-05-28 decision, the in-development `voice-engine` graduates from `packages/voice-engine/` (accidentally swept into `nexural-meta` via `git add -A`) to its own GitHub repo `JasonTeixeira/voice-engine`. From that point forward it federates by MCP per this ADR.

### 8. Quarterly ecosystem review (alongside federation review)

ADR-0009 §1.10 mandates quarterly federation review. Effective with this ADR, the review additionally covers:

- Cross-repo graduation queue (what's matured for migration)
- Cross-repo version skew (each repo's @modelcontextprotocol/sdk version, etc.)
- New MCP server registrations
- Deprecated MCP servers
- Editor MCP config drift (CLAUDE.md / AGENTS.md still accurate?)

Conducted alongside the federation review. First post-ADR review: 2026-08-28.

## Rejected alternatives

- **Monorepo all 4.** Would force shared toolchain + shared release cadence. Each repo has distinct ownership of its surface; monorepo would create false coupling. Rejected.
- **Hard-vendor ai-warehouse into nexural-meta.** Would dilute nexural-meta's "control plane" focus + force Python + JS coexistence. Rejected.
- **Add federation-server logic to each repo's MCP server.** Would duplicate the FTS5 index across 4 servers. Single `federation-server` indexing `nexural-meta` only + per-repo MCP servers for their own content is the simpler shape. Adopted.
- **Defer ADR until V2.** Decisions made informally tend to drift. Locking now while shape is fresh prevents the drift. Adopted.

## Consequences

**Positive:**

- The ecosystem has a load-bearing decision that future contributors / successors / Sage's own future-self can rely on.
- Graduation criteria stop drift between repos.
- Quarterly review surface includes the cross-repo dimension.
- The 4-repo shape is locked enough to be defended, loose enough to evolve.

**Negative:**

- Adding repo #5 to the ecosystem now requires an ADR amendment.
- Vendoring something from `ai-warehouse` into `nexural-meta` (which we already did for playbooks + prompts) now requires explicit ADR-0013 §3 graduation criteria documentation, not just code.
- Multi-repo bus-factor remains harder than monorepo — successor has to know about 4 repos, not 1.

## Acceptance

Accepted when:

- ✅ `v1.0.10` is tagged with this ADR on `main`
- ✅ `docs/ECOSYSTEM.md` is updated to reference ADR-0013
- ✅ `registry-external-mcp.yaml` schema documented in `@nexural/schema` (if not already)
- ✅ `voice-engine` extracted from `packages/` (per ADR §7)

## CHANGELOG

- **2026-05-28** v1 — Proposed + soak-waived. Locks the 4-repo ecosystem shape. Adds graduation criteria + dependency rules + quarterly review extension.
