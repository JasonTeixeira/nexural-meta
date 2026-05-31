# Sage Ideas Ecosystem — single source of truth

> **For any agent reading this:** you are working inside one of four repos that make up the Sage Ideas LLC engineering ecosystem. Each repo has its own purpose, its own MCP server, and a shared governance posture. Before doing significant work, consult the relevant repo(s) below.

---

## Phase 0 Naming Authority

Per ADR-0014, Sage Ideas is the company and ecosystem umbrella. Sage Ideas
Engineering OS is the internal resource factory. Nexural is scoped to the
trading/investment product and legacy implementation namespaces. Existing
`nexural-*` repo names remain stable implementation names unless a future ADR
approves a rename.

---

## The four repos

| Repo                | Role                                                      | MCP server                           | Search tool               |
| ------------------- | --------------------------------------------------------- | ------------------------------------ | ------------------------- |
| **`nexural-meta`**  | Control plane — recipes, warehouses, ADRs, audit, CLI     | `nexural-federation-server`          | `federation_ask(query)`   |
| **`ai-warehouse`**  | Parts catalog — 861 tools × verdicts (USE/WATCH/AVOID)    | Python MCP at `mcp-server/server.py` | `search_warehouse(query)` |
| **`nexural-qa-os`** | QA verification — scorecards + runners + drift            | `nexural-qa-os-server`               | `qa_os_check(target)`     |
| **`voice-engine`**  | Voice agent toolkit — personas + TCPA + provider adapters | `voice-engine-server`                | `voice_search(query)`     |

Each repo is **independently versioned, independently deployed, federated by MCP**. No monorepo.

---

## When to consult which

| Question shape                                                             | Consult                                                                     |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| "How do we build a new SaaS / RAG / agent / fintech / admin app?"          | `nexural-meta` → `nx forge <recipe>`                                        |
| "What's our pattern for X?" (auth, RLS, cost discipline, prompt injection) | `nexural-meta` → `federation_ask` or `nx ask`                               |
| "Which tool should I use for Y?" (vector store, LLM, embedding, etc.)      | `ai-warehouse` → `search_warehouse` or `recommend_stack`                    |
| "Did we already decide about Z?" (ADRs / DECISIONS)                        | `nexural-meta` → `federation_ask --kinds=adr,recipe-doc`                    |
| "Is this app meeting our QA bars?"                                         | `nexural-qa-os` → run scorecard                                             |
| "How do I add voice to my app?"                                            | `voice-engine` → `voice_search` for personas/patterns                       |
| "How do I do operational task X?" (deploy, add evals, optimize cost)       | `nexural-meta` → `federation_ask --kinds=warehouse-doc` (runbook warehouse) |

---

## The flow when you (the agent) start a task

1. **Read this file.** Now you know the ecosystem.
2. **Read the repo's CLAUDE.md or AGENTS.md.** That tells you what's specific to this repo.
3. **Before adding a new architectural pattern, search the federation:** `federation_ask("<your question>")`. If the answer exists, follow it.
4. **Before picking a tool, search ai-warehouse:** `search_warehouse(query)`. Use the USE-verdict tool.
5. **Before deploying, check QA:** consult `nexural-qa-os` scorecards or run `nx audit`.
6. **When you discover a pattern that should outlive this project:** patch it back to the relevant warehouse in `nexural-meta` (don't let knowledge die in one client repo).

---

## Local environment setup (one-time, you Sage)

Set these in `~/.bash_profile` or `~/.zshrc`:

```bash
export NEXURAL_META_ROOT=/Users/Sage/code/nexural/nexural-meta
export AI_WAREHOUSE_ROOT=/Users/Sage/code/sage-ideas/ai-warehouse
export NEXURAL_QA_OS_ROOT=/Users/Sage/code/sage-ideas/nexural-qa-os
export VOICE_ENGINE_ROOT=/Users/Sage/code/sage-ideas/voice-engine
```

Then:

```bash
# Install all four MCP server binaries globally
npm i -g @nexural/cli @nexural/federation-server @nexural/warehouse-server
pip install -e $AI_WAREHOUSE_ROOT
# nexural-qa-os + voice-engine installs per their READMEs

# Auto-start the federation daemon at login (one-time)
# See docs/EDITOR_MCP_SETUP.md → launchd section
```

---

## Wire MCP into your editor (one-time per editor)

See [`docs/EDITOR_MCP_SETUP.md`](EDITOR_MCP_SETUP.md) for full configs. TL;DR: put all 4 MCP servers in your editor's config file, restart the editor, and the agent gains 4 cross-repo tool surfaces.

After this, your agent in any project can call `federation_ask`, `search_warehouse`, `qa_os_check`, `voice_search` without you having to think about it.

---

## Governance — what's locked, what changes

| Concern                                  | Lives in                                       | Versioning rule                                                       |
| ---------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------- |
| Federation API (schemas, forge, recipes) | `nexural-meta`                                 | ADR-0012 — major bump requires ADR                                    |
| Tool verdicts (USE/WATCH/AVOID)          | `ai-warehouse`                                 | Verdicts change as market evolves; `last_reviewed` on each tool entry |
| QA runner contracts                      | `nexural-qa-os`                                | Scorecard format stable; runners can be added/removed                 |
| Voice patterns                           | `voice-engine`                                 | TCPA gate is API-stable; personas evolve                              |
| **Cross-repo dependencies**              | `registry-external-mcp.yaml` in `nexural-meta` | Append-only; deprecations require ADR                                 |

---

## Cross-repo doctrines (apply to ALL four repos)

These are inherited from ADR-0001 through ADR-0013:

1. **No SMS 2FA, anywhere.** YubiKey FIDO2 only.
2. **Secrets via `op://` references.** Never in git, never in env files committed to git.
3. **All packages publish with SLSA L3 provenance via GitHub Actions OIDC.** No local npm publish.
4. **Strict TypeScript** (`exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`) on all TS code.
5. **RLS for multi-tenant data**, with `tenant_id` carried through every query.
6. **Cost-wrapped LLM calls** via `@nexural/sdk.llmClient` — per-request + per-day hard caps (ADR-0007).
7. **`<warehouse_content>` envelope wrapping** for any retrieved content fed to an LLM (ADR-0008 §1).
8. **Vertical slice doctrine** — recipes/apps don't ship until they emit-build-deploy-verify-adversarial (ADR-0011 6-gate).
9. **Soak windows** — load-bearing decisions wait the documented soak before locking (ADR-0009 §1.10).
10. **Append-only audit trails** — `audit_events`, `ledger_entries`, `admin_bulk_actions` immutable via DB triggers.

If you (the agent) hit a question and one of these doctrines applies, follow it. If you think a doctrine should be relaxed, propose an ADR — don't just deviate.

---

## What this ecosystem is NOT

- **Not a monorepo.** Four repos, federated by MCP.
- **Not a hosted SaaS.** Everything runs locally (laptop + MCP stdio servers + npm-published packages).
- **Not multi-tenant.** Single operator (Sage). When that changes, ADR-0009 §1.10 succession kicks in.
- **Not free of process.** ADRs gate breaking changes. Slice doctrine gates recipe ships. Quarterly review per ADR-0009 §1.10.

---

## What's NEW in your context, agent

- `nexural-meta` is V1.0 GA as of 2026-05-22 (`v1.0.0` through `v1.0.8` tagged). 12 ADRs. 7 recipes. 12 warehouses (architecture, auth, database, observability, security, dx, payments, billing, rag, prompt, safety, runbook).
- `ai-warehouse` is operational with 861 tools indexed.
- `nexural-qa-os` is mid-Phase-J hardening (72→95+ target).
- `voice-engine` is in active development; few stable surfaces.

When in doubt, query the federation first (`federation_ask`) — it knows what's current.

---

## Read order (for human reviewers)

1. This doc (ECOSYSTEM.md) — the map
2. `nexural-meta/docs/V1_ANNOUNCEMENT.md` — what V1.0 means
3. `nexural-meta/docs/DAILY_OPS.md` — the daily-use habit loop
4. `nexural-meta/docs/ARCHITECTURE.md` — system design
5. `nexural-meta/docs/adr/` — every locked decision
6. Each repo's own README + CLAUDE.md

---

_Sage Ideas LLC. Built solo. Forged, not assembled._
