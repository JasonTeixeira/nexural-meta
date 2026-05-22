# @nexural/schema

## 0.1.0

### Initial release

- Primitives: `Iso8601`, `IsoDate`, `Ulid`, `KebabSlug`, `TrustTier`, `WarehouseStatus`, `SchemaVersion`, `SemverString`, `RepoUrl`, `Email`, `DecayDays`, `Federation`, `GitSha`, `Sha256Hex`, `OpUri`, `EnvVarName`, `UsdAmount`, `PositiveUsdAmount`
- Core schemas: `WarehouseMeta`, `ContentFrontmatter`, `WarehouseIndex`, `McpToolRequest`, `McpToolResponse`, `ScorecardReport`, `Registry`, `CrossRefReport`, `DecayConfig`, `AdrFrontmatter`
- Telemetry: `BaseEvent`, `ToolCallEvent`, `NxCommandEvent`, `DecayWarnEvent`, `AuditEvent`, `CostEvent`, `TelemetryEvent`
- Recipe family (per ADRs 0002, 0004, 0006, 0007, 0008, 0009): `RecipeManifest`, `ForgedLockfile`, `CostEnvelope`, `ServiceDeclaration`
- External MCP (per ADR-0005): `ExternalMcpEndpoint`, `ExternalMcpRegistry`
- Model router (per ADR-0007): `ModelFamilyResolution`, `ModelFamilyRegistry`
- Revocation (per ADR-0009): `RevokedRecipeEntry`, `RevokedRecipesList`
- Errors: `NexuralError`, `NexuralErrorCode`
- JSON Schema export of all 21 schemas to `dist/json-schema/`
