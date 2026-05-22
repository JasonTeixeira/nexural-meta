/**
 * ExternalMcpEndpoint + ExternalMcpRegistry — per ADR-0005.
 *
 * Registers third-party MCP servers (e.g. ai-warehouse) that are federated
 * via the router but NOT subject to factory governance.
 *
 * Manual file: nexural-meta/registry-external-mcp.yaml.
 */

import { z } from "zod";
import { Federation, IsoDate, KebabSlug, SchemaVersion } from "./primitives.js";

const QualityAttestation = z
  .object({
    source: z.string(),
    score: z.number().int().min(0).max(100),
    verified_at: IsoDate,
    next_review: IsoDate,
  })
  .strict();

export const ExternalMcpEndpoint = z
  .object({
    schema_version: SchemaVersion,
    name: KebabSlug,
    type: z.literal("external"),
    transport: z.enum(["stdio", "http", "websocket"]),
    command: z.array(z.string()).optional(),
    url: z.string().url().optional(),
    tool_prefix: KebabSlug,
    schema_compatibility: z.enum(["nexural-1", "external"]),
    federations: z.array(Federation).min(1),
    quality_attestation: QualityAttestation,
  })
  .strict()
  .refine(
    (e) =>
      (e.transport === "stdio" && !!e.command && e.command.length > 0) ||
      (e.transport !== "stdio" && !!e.url),
    { message: "stdio transport requires command; http/ws requires url" },
  );
export type ExternalMcpEndpoint = z.infer<typeof ExternalMcpEndpoint>;

export const ExternalMcpRegistry = z
  .object({
    schema_version: SchemaVersion,
    endpoints: z.array(ExternalMcpEndpoint),
  })
  .strict();
export type ExternalMcpRegistry = z.infer<typeof ExternalMcpRegistry>;
