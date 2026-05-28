# CLAUDE.md — ai-warehouse

> **Read first:** the master ecosystem map at [`nexural-meta/docs/ECOSYSTEM.md`](https://github.com/JasonTeixeira/nexural-meta/blob/main/docs/ECOSYSTEM.md). This repo is the **parts catalog** — one of four repos in the Sage Ideas LLC ecosystem.

## What this repo is

The **AI engineering parts catalog**: 861 curated tools across 106 categories with verdicts (USE / WATCH / AVOID), pricing tier, lock-in profile, maturity grade. Backed by an MCP server agents call to query.

## What lives here

- `tools/` — one `.md` per tool, frontmatter-validated against `_meta/schema.json`
- `stacks/` — curated bundles (e.g., `production-rag`, `voice-agent-sub-500ms`)
- `templates/` — boilerplates for project types (eval-harness, fastapi-llm, etc.)
- `playbooks/` — operational how-tos (some vendored into `nexural-meta/warehouses/runbook/`)
- `prompts/` — bootstrap prompts (some vendored into `nexural-meta/warehouses/prompt/`)
- `mcp-server/` — Python MCP stdio server exposing 8 tools
- `INDEX.md` — auto-generated master index
- `DECISIONS.md` — vendor-selection trees

## MCP tools you can call

| Tool                                                             | Use when                          |
| ---------------------------------------------------------------- | --------------------------------- |
| `search_warehouse(query, layer?, category?, verdict?, pricing?)` | "Which tool should I use for X?"  |
| `get_tool(slug)`                                                 | Fetch full entry for one tool     |
| `compare_tools(slugs[])`                                         | A/B/C compare candidates          |
| `recommend_stack(use_case)`                                      | "Build me a stack for Y"          |
| `list_categories()`                                              | Browse what's catalogued          |
| `list_stacks()`                                                  | Browse curated bundles            |
| `get_decisions(area?)`                                           | Get the decision tree for an area |
| `inbox_add(tool_name, source_url, ...)`                          | Triage a new tool you encountered |

## Cross-repo flow

- **From `nexural-meta`:** federation references this repo via `registry-external-mcp.yaml`. Recipe DECISIONS.md files can cite a verdict here.
- **From `nexural-qa-os`:** treats your verdicts as one input to its scorecards.
- **From `voice-engine`:** queries here when picking voice provider candidates.
- **You should patch verdicts back** when client work surfaces a new opinion about a tool.

## Doctrines (inherited from ecosystem)

- No SMS 2FA; YubiKey FIDO2 only
- Secrets via `op://` references
- Last-reviewed date on every tool entry; older than 90 days = stale alert
- Schema in `_meta/schema.json` enforced pre-commit via validator

## When something breaks

| Symptom                          | Fix                                                             |
| -------------------------------- | --------------------------------------------------------------- |
| MCP server returns no results    | `python scripts/build_index.py` to rebuild `index.json`         |
| Tool entry rejected by validator | Check `_meta/schema.json` requirements; add missing frontmatter |
| Stale verdicts                   | Run `make monthly-review`                                       |
| Verdict change needed            | Edit tool entry; bump `last_reviewed`; PR                       |

---

_See also:_ [`AGENTS.md`](AGENTS.md) — same content for non-Claude agents.
