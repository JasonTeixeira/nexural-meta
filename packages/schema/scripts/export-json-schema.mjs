#!/usr/bin/env node
/**
 * Exports every Zod schema to JSON Schema for external tooling
 * (yaml-language-server, IDE intellisense, language servers).
 *
 * Output: dist/json-schema/*.json
 *
 * Consumers reference via:
 *   # yaml-language-server: $schema=https://unpkg.com/@nexural/schema@1/dist/json-schema/warehouse-meta.json
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { zodToJsonSchema } from "zod-to-json-schema";
import * as schemas from "../dist/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "dist", "json-schema");

const EXPORTS = {
  "warehouse-meta": schemas.WarehouseMeta,
  "content-frontmatter": schemas.ContentFrontmatter,
  "warehouse-index": schemas.WarehouseIndex,
  "mcp-tool-request": schemas.McpToolRequest,
  "mcp-tool-response": schemas.McpToolResponse,
  "telemetry-event": schemas.TelemetryEvent,
  "scorecard-report": schemas.ScorecardReport,
  registry: schemas.Registry,
  "cross-ref-report": schemas.CrossRefReport,
  "decay-config": schemas.DecayConfig,
  "adr-frontmatter": schemas.AdrFrontmatter,
  "recipe-manifest": schemas.RecipeManifest,
  "forged-lockfile": schemas.ForgedLockfile,
  "cost-envelope": schemas.CostEnvelope,
  "service-declaration": schemas.ServiceDeclaration,
  "external-mcp-endpoint": schemas.ExternalMcpEndpoint,
  "external-mcp-registry": schemas.ExternalMcpRegistry,
  "model-family-resolution": schemas.ModelFamilyResolution,
  "model-family-registry": schemas.ModelFamilyRegistry,
  "revoked-recipe-entry": schemas.RevokedRecipeEntry,
  "revoked-recipes-list": schemas.RevokedRecipesList,
};

await mkdir(OUT_DIR, { recursive: true });

for (const [name, schema] of Object.entries(EXPORTS)) {
  const jsonSchema = zodToJsonSchema(schema, {
    name,
    $refStrategy: "none",
    target: "jsonSchema7",
  });
  await writeFile(
    join(OUT_DIR, `${name}.json`),
    JSON.stringify(jsonSchema, null, 2) + "\n",
    "utf8",
  );
  console.log(`exported ${name}.json`);
}

console.log(`\n✓ ${Object.keys(EXPORTS).length} JSON schemas exported to dist/json-schema/`);
