# ADR-0005: ai-warehouse as External Federated MCP Endpoint

**Status:** Proposed
**Date:** 2026-05-21
**Deciders:** Sage
**Soak ends:** 2026-05-28
**Depends on:** ADR-0002

## Context

`ai-warehouse` (https://github.com/JasonTeixeira/ai-warehouse) is a mature, MCP-ready Python project that has shipped:

- 861 curated tool entries across 106 categories
- Its own frontmatter schema (`_meta/schema.json`)
- An MCP server exposing `search_warehouse`, `get_tool`, `compare_tools`, `recommend_stack`
- A dual MIT + CC-BY-SA-4.0 license
- A 100/100 score from `nexural-qa-os` v1.0 dogfood

Options considered for integrating it into the federation:

- (a) Port to TypeScript and fold into `nexural-factory`.
- (b) ADR a polyglot exception inside the federation.
- (c) Keep it separate and federate it as an external MCP endpoint.

Sage's decision: **(c)** — keep `ai-warehouse` standalone as its own product, federate via MCP.

## Decision

### Status

`ai-warehouse` is **NOT** a member of `nexural-factory` or `nexural-lifeops`. It remains a standalone Python project with its own:

- Schema (`_meta/schema.json`)
- License (MIT + CC-BY-SA-4.0 dual)
- Versioning (`pyproject.toml`, semver)
- Release cadence
- Maintenance schedule
- GitHub topics (unchanged)

### Integration as external MCP endpoint

`nexural-meta/apps/router` is configured to fan out queries to `ai-warehouse`'s MCP server alongside `nexural-factory` warehouse MCP servers. From a `nx ask` user perspective, results look identical.

```yaml
# nexural-meta/registry-external-mcp.yaml (new file)
schema_version: 1
endpoints:
  - name: ai-warehouse
    type: external
    transport: stdio
    command: ["ai-warehouse", "mcp"]
    tool_prefix: ai-warehouse
    schema_compatibility: external
    federations: [factory]
    quality_attestation:
      source: nexural-qa-os
      score: 100
      verified_at: 2026-05-21
      next_review: 2026-08-21
```

### What's enforced

| Concern         | How                                                                                       |
| --------------- | ----------------------------------------------------------------------------------------- |
| Response shape  | Validated against `ai-warehouse`'s own published schema, NOT `@nexural/schema`            |
| Provenance      | Router tags every response with `provenance: ai-warehouse-external` so synthesis can cite |
| Decay           | Router applies decay using `ai-warehouse`'s `last_reviewed` field (its own conventions)   |
| Quality         | Quarterly dogfood re-run via `nexural-qa-os` — must maintain ≥ 90 score                   |
| Trust isolation | Responses treated as external — full prompt-injection wrapping per ADR-0008               |

### What's NOT enforced

- `ai-warehouse` is not required to use `@nexural/schema`.
- `ai-warehouse` is not required to follow `nexural-factory` naming conventions.
- `ai-warehouse` is not required to use `@nexural/mcp-base`.
- `ai-warehouse` is not required to carry a `nexural-*` topic.

### Trust boundary

Even though Sage owns `ai-warehouse`, it is treated as a third-party MCP endpoint for trust purposes. Same rules as any external MCP federation member would get:

1. All responses wrapped in `<warehouse_content>` envelopes (per ADR-0008).
2. Citations validated against actual response IDs returned.
3. Quality attestation refreshed quarterly via dogfood re-run.
4. Failure to maintain ≥ 90 score → endpoint removed from registry until re-attested.

### Sets the precedent

This ADR establishes the pattern for federating ANY third-party MCP server in the future (e.g., a public AWS knowledge MCP, a vendor's product docs MCP). Configuration follows the same shape.

## Schema additions

Add to `@nexural/schema/external-mcp.ts`:

```ts
export const ExternalMcpEndpoint = z
  .object({
    schema_version: SchemaVersion,
    name: KebabSlug,
    type: z.literal("external"),
    transport: z.enum(["stdio", "http", "websocket"]),
    command: z.array(z.string()).optional(), // stdio
    url: z.string().url().optional(), // http/ws
    tool_prefix: KebabSlug,
    schema_compatibility: z.enum(["nexural-1", "external"]),
    federations: z.array(z.enum(["factory", "lifeops"])).min(1),
    quality_attestation: z
      .object({
        source: z.string(),
        score: z.number().int().min(0).max(100),
        verified_at: IsoDate,
        next_review: IsoDate,
      })
      .strict(),
  })
  .strict()
  .refine((e) => (e.transport === "stdio" && !!e.command) || (e.transport !== "stdio" && !!e.url), {
    message: "stdio transport requires command; http/ws requires url",
  });

export const ExternalMcpRegistry = z
  .object({
    schema_version: SchemaVersion,
    endpoints: z.array(ExternalMcpEndpoint),
  })
  .strict();
```

## Consequences

**Positive:**

- No migration overhead. 861 tools instantly federated on day one of Phase 4.
- `ai-warehouse` stays as its own product. Can be open-sourced or sold independently.
- Sets the precedent for federating other third-party MCPs (vendor docs, public knowledge servers).
- Polyglot federation without polyglot governance.

**Negative:**

- Two schemas to maintain (ai-warehouse's + `@nexural/schema`).
- Upgrades happen independently — light coordination overhead.
- Quarterly attestation cadence is a small but real ongoing task.

**Neutral:**

- Router complexity is bounded — handles both internal and external MCPs via the same dispatcher.

## Alternatives Considered

1. **Port to TypeScript and fold in.** Rejected — wasted effort on a working system; loses Python ecosystem advantages.
2. **Polyglot internal (ai-warehouse becomes a factory warehouse with Python exception).** Rejected — drags ai-warehouse into governance it doesn't need and dilutes the strict-TS factory rule.

## Soak

7 days, co-soak with ADR-0002.
