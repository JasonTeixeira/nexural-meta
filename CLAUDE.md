# CLAUDE.md — nexural-meta

> **Read first:** [`docs/ECOSYSTEM.md`](docs/ECOSYSTEM.md). This repo is the **control plane** of the Sage Ideas ecosystem; three other repos federate via MCP.

## What this repo is

The **Nexural Federation control plane**:

- **Recipes** (`recipes/`) — signed code-generation templates for SaaS / fintech / RAG / agent / internal-tool apps
- **Warehouses** (`warehouses/`) — composable typed templates + authored docs
- **ADRs + constitution** (`docs/`) — load-bearing decisions
- **`nx` CLI** (`apps/cli/`) — `forge`, `ask`, `audit`, `verify`, `serve`, `health`, `new`, `play`, `sync`, `session save`
- **Federation MCP servers** (`packages/{federation-server,warehouse-server}/`) — agent-callable surfaces

## Before adding anything substantial

1. **Search the federation first:** `nx ask "<question>"` OR `federation_ask` via MCP.
2. **Check ADRs** for governing decisions: `nx ask "<topic>" --kinds=adr`.
3. **If you're adding a pattern that should outlive one project**, add it to the relevant warehouse, not the project.
4. **Doctrines that apply** (full list in `docs/ECOSYSTEM.md`): RLS for multi-tenant, `op://` for secrets, cost-wrapped LLM calls, `<warehouse_content>` envelopes, vertical slice doctrine, no SMS 2FA, strict TS.

## Conventions

- **Branch naming:** `feat/<short>`, `fix/<short>`, `chore/<short>`, `docs/<short>`
- **Commit messages:** Conventional commits (`feat:`, `fix:`, etc.); per ADR-0001 follow the project style.
- **Version bumps:** semver — `patch` for fixes, `minor` for additive, `major` requires an ADR.
- **Schema changes** in `@nexural/schema` are API per ADR-0012 §2 — bump minor for additions, major for breaks.
- **Recipe additions** require THREAT_MODEL.md + DECISIONS.md per ADR-0008 §7.
- **New ADR** required for: cross-cutting infra change, new federation runner, doctrine relaxation, V2-breaking work.

## What lives where

| Concern                                              | Location                                                                                       |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Code-gen pipeline                                    | `apps/cli/src/commands/forge.ts` + `packages/forge-emit/`                                      |
| Federation search                                    | `packages/ask-engine/` + `apps/cli/src/commands/ask.ts`                                        |
| MCP servers                                          | `packages/federation-server/`, `packages/warehouse-server/`                                    |
| QA runners (federation-side)                         | `packages/qa-runners-federation/` (5 runners)                                                  |
| Warehouse content                                    | `warehouses/<name>/{manifest.yaml,documents/,templates/}`                                      |
| Recipe content                                       | `recipes/<name>/{recipe.yaml,inputs.zod.ts,THREAT_MODEL.md,DECISIONS.md,README.md,templates/}` |
| Evidence (audit / health / adversarial / benchmarks) | `evidence/{audit,health,adversarial,benchmarks}/`                                              |
| External MCP registry                                | `registry-external-mcp.yaml`                                                                   |

## How to query other ecosystem repos from here

- **ai-warehouse:** `search_warehouse(query)` MCP tool, OR shell out to its CLI in `${AI_WAREHOUSE_ROOT}`.
- **nexural-qa-os:** `qa_os_check(target)` MCP tool, OR run `pnpm verify-all` from this repo (shells out per `.qa-os.yml`).
- **voice-engine:** `voice_search(query)` MCP tool, OR `cd ${VOICE_ENGINE_ROOT}` for direct work.

## Local dev quickstart

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm build
nx audit            # federation health
nx serve            # HTTP daemon on localhost:7345
```

## When something breaks

| Symptom                                                        | Check                                                                        |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `nx ask` returns nothing                                       | `NEXURAL_META_ROOT` env var; `git pull`                                      |
| `nx forge` errors `secret_leak`                                | Template contains literal secret; fix template, not error                    |
| `nx audit` shows control-plane false positive                  | Federation-conformance fix in v1.0.7+; `npm i -g @nexural/cli@latest`        |
| New `@nexural/*` package ghost-published                       | Token lacks scope-create; rotate per `evidence/operational/sage-blockers.md` |
| Recipe with `extends:` parent fails to forge from compiled CLI | Use `npx tsx apps/cli/src/bin/nx.ts forge ...` in dev; known V1.1 gap        |

## Doctrines (excerpt — full list in ECOSYSTEM.md)

- ADR-0011 **vertical slice**: recipes don't ship until 6-gate clear
- ADR-0007 **cost discipline**: LLM calls cost-wrapped via `@nexural/sdk.llmClient`
- ADR-0008 **prompt-injection envelopes**: every retrieved chunk wrapped in `<warehouse_content>`
- ADR-0010 **streaming abort**: long-running LLM calls cancellable + cost-checked mid-flight

Full set: [`docs/adr/`](docs/adr/).

---

_See also:_ [`AGENTS.md`](AGENTS.md) — same content for Codex / non-Claude agents.

---

## Project brief (Obsidian)

This repo's project brief lives in the Sage Ideas vault:
**`~/Sage Ideas/01-Projects/nexural-meta.md`**

Before exploring the codebase, read the brief — it contains current focus,
open questions, decisions log, and links to related projects. Update the
brief at the end of each work session.
