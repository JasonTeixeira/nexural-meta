# @nexural/schema

**Canonical Zod schemas for the Nexural Federation.**

Single source of truth for every shape that crosses a warehouse boundary. Imported by every other `@nexural/*` package, every warehouse MCP server, every recipe, every forged app.

## Modules

| Module         | Schemas                                                                                                                                                   | Source ADR(s)                          |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `primitives`   | `Iso8601`, `IsoDate`, `Ulid`, `KebabSlug`, `TrustTier`, `WarehouseStatus`, `SchemaVersion`, `SemverString`, `RepoUrl`, `Email`, `DecayDays`, `Federation` | core                                   |
| `meta`         | `WarehouseMeta`                                                                                                                                           | core + ADR-0003                        |
| `frontmatter`  | `ContentFrontmatter`                                                                                                                                      | core                                   |
| `index-file`   | `WarehouseIndex`                                                                                                                                          | core                                   |
| `mcp`          | `McpToolRequest`, `McpToolResponse`                                                                                                                       | core + ADR-0008                        |
| `telemetry`    | `BaseEvent`, `ToolCallEvent`, `NxCommandEvent`, `DecayWarnEvent`, `AuditEvent`, `CostEvent`, `TelemetryEvent`                                             | core + ADR-0007                        |
| `scorecard`    | `ScorecardReport`                                                                                                                                         | core                                   |
| `registry`     | `Registry`                                                                                                                                                | core + ADR-0003                        |
| `cross-refs`   | `CrossRefReport`                                                                                                                                          | core                                   |
| `decay`        | `DecayConfig`                                                                                                                                             | core                                   |
| `adr`          | `AdrFrontmatter`                                                                                                                                          | core                                   |
| `recipe`       | `RecipeManifest`, `ForgedLockfile`, `CostEnvelope`, `ServiceDeclaration`                                                                                  | ADR-0002, 0004, 0006, 0007, 0008, 0009 |
| `external-mcp` | `ExternalMcpEndpoint`, `ExternalMcpRegistry`                                                                                                              | ADR-0005                               |
| `model-router` | `ModelFamilyResolution`, `ModelFamilyRegistry`                                                                                                            | ADR-0007                               |
| `revocation`   | `RevokedRecipeEntry`, `RevokedRecipesList`                                                                                                                | ADR-0009                               |
| `errors`       | typed error shapes                                                                                                                                        | core                                   |

See `docs/SCHEMA_CHARTER.md` and `docs/SCHEMA_AMENDMENTS.md` for the canonical reference.

## Usage

```ts
import { WarehouseMeta, RecipeManifest } from "@nexural/schema";

const parsed = WarehouseMeta.parse(yaml.load(metaContent));
```

## JSON Schema exports

`pnpm build` generates JSON Schema files under `dist/json-schema/` for external tooling (yaml-language-server, IDE intellisense):

```yaml
# yaml-language-server: $schema=https://unpkg.com/@nexural/schema@1/dist/json-schema/warehouse-meta.json
```

## Versioning

Strict semver per SCHEMA_CHARTER §5. Breaking changes follow §6 (30-day soak + migration codemod).

## License

MIT.
