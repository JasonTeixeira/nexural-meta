# External ai-warehouse — federated tool catalog

Per ADR-0005, the federation references the external **ai-warehouse** repo as an MCP server rather than vendoring its 861-tool catalog. This doc tells recipe authors + agents how to query it.

## What ai-warehouse is

Sage's curated AI engineering parts catalog. One markdown file per tool, frontmatter-validated, indexed into `index.json`. 861 tools across 106 categories, each with a **verdict** (`USE` / `WATCH` / `AVOID`), pricing tier, lock-in profile, maturity grade, and reasoning.

Repo: <https://github.com/JasonTeixeira/ai-warehouse>

## Why we don't vendor it

| Reason            | Detail                                                                                                                                                                                 |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Wrong shape       | The federation's warehouses are _typed templates + authored docs_ for the **forge pipeline**. ai-warehouse is a _tool catalog with verdicts_ — different purpose, different lifecycle. |
| Different runtime | ai-warehouse MCP server is Python; the federation is TypeScript. Distinct deploy + dependency surfaces.                                                                                |
| Different cadence | ai-warehouse changes frequently as the AI market shifts (new tools, new verdicts). The federation's API + schema surface is stable per ADR-0012.                                       |
| Same author       | Both are Sage Ideas LLC. Federating-by-reference keeps each cohesive.                                                                                                                  |

## How to query it from a federation context

### From an agent (Cursor / Claude Code / etc.)

Wire ai-warehouse into your MCP config separately:

```json
{
  "mcpServers": {
    "ai-warehouse": {
      "command": "python",
      "args": ["/absolute/path/to/ai-warehouse/mcp-server/server.py"]
    }
  }
}
```

Then the agent has 8 callable tools:

- `search_warehouse(query, layer?, category?, verdict?, pricing?, limit?)`
- `get_tool(slug)`
- `compare_tools(slugs[])`
- `recommend_stack(use_case)`
- `list_categories()`
- `list_stacks()`
- `get_decisions(area?)`
- `inbox_add(tool_name, source_url, category?, why?)`

### From a federation recipe author

When writing a recipe's `DECISIONS.md` and you need to lock a vendor choice:

1. Query ai-warehouse via the agent for the current verdict (`search_warehouse "vector db" --verdict USE`).
2. Reference the chosen tool in DECISIONS with a note like: _"Selected `pgvector` per ai-warehouse verdict USE (last reviewed 2026-05-21)."_
3. Pin the date so future readers know when the choice was validated.

The federation doesn't re-validate vendor verdicts. That's ai-warehouse's job.

## What lives in the federation vs ai-warehouse

| Concern                                             | Lives in                                                                            | Why                                                                                                          |
| --------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Recipe scaffolds (forge templates)                  | Federation `recipes/`                                                               | Codegen pipeline; needs the typed forge engine                                                               |
| Warehouse-level patterns + docs                     | Federation `warehouses/`                                                            | Composable building blocks for recipes                                                                       |
| ADRs + constitution                                 | Federation `docs/`                                                                  | Load-bearing federation governance                                                                           |
| Operational runbooks                                | Federation `warehouses/runbook/` (vendored from ai-warehouse `playbooks/`)          | These are "how to operate", not "which tool to pick" — federation-shape                                      |
| Bootstrap prompts                                   | Federation `warehouses/prompt/` (vendored from ai-warehouse `prompts/bootstrap-*`)  | Agent-launcher prompts; sit in the prompt warehouse alongside synthesis prompts                              |
| **Tool catalog with verdicts**                      | **ai-warehouse**                                                                    | 861 tools × verdict/pricing/lock-in/maturity — wrong shape for forge templates                               |
| **Decision trees per tool category**                | **ai-warehouse** + a thin shape doc here ([`decision-trees.md`](decision-trees.md)) | The catalog stays external; the federation publishes the _shape_ recipe authors use to write their own trees |
| Tool boilerplates (Python LLM apps, eval harnesses) | **ai-warehouse `templates/`**                                                       | Different platform (Python); different consumers. The federation's templates are TypeScript-first.           |

## Registry placement

ai-warehouse is registered in `registry-external-mcp.yaml` at the federation root, with `tier: external` per ADR-0005. The federation router can fan out queries to it alongside warehouse MCPs.

## When a tool from ai-warehouse needs to become a federation primitive

Rare but possible: if a specific ai-warehouse tool becomes a load-bearing dep of multiple federation recipes, _and_ its API stabilizes, _and_ there's value in templating its setup, _then_ it can graduate into a warehouse template.

Process: open an ADR documenting the migration. Per ADR-0008 §7, recipe authors who depend on the migrated tool update their DECISIONS to point at the new warehouse template + the date of migration.
