/**
 * MCP tool envelopes — used by every MCP tool exposed by every warehouse.
 *
 * Enforced by @nexural/mcp-base at runtime (Zod parse on every req/resp).
 *
 * Per SCHEMA_CHARTER §4.4 + ADR-0008 (prompt-injection warning codes).
 */

import { z } from "zod";
import { KebabSlug, SchemaVersion, Ulid } from "./primitives.js";

const Caller = z
  .object({
    kind: z.enum(["nx-cli", "agent", "dashboard", "test"]),
    session_id: Ulid.optional(),
    user: z.string().optional(),
  })
  .strict();

export const McpToolRequest = z
  .object({
    schema_version: SchemaVersion,
    request_id: Ulid,
    caller: Caller,
    tool: KebabSlug,
    args: z.record(z.string(), z.unknown()),
    timeout_ms: z.number().int().positive().max(30_000).default(5_000),
  })
  .strict();
export type McpToolRequest = z.infer<typeof McpToolRequest>;

const McpWarning = z
  .object({
    code: z.enum([
      "stale",
      "draft-content",
      "low-confidence",
      "tier-mismatch",
      "deprecated",
      "tier_confinement_violation",
      "citation_stripped",
      "token_budget_trimmed",
    ]),
    message: z.string(),
  })
  .strict();

const McpCitation = z
  .object({
    warehouse: KebabSlug,
    id: z.union([Ulid, KebabSlug]),
    title: z.string().optional(),
    url: z.string().url().optional(),
  })
  .strict();

const McpErrorShape = z
  .object({
    code: z.string(),
    message: z.string(),
    retryable: z.boolean(),
  })
  .strict();

export const McpToolResponse = z
  .object({
    schema_version: SchemaVersion,
    request_id: Ulid,
    warehouse: KebabSlug,
    tool: KebabSlug,
    ok: z.boolean(),
    latency_ms: z.number().int().nonnegative(),
    data: z.unknown().optional(),
    error: McpErrorShape.optional(),
    warnings: z.array(McpWarning).default([]),
    citations: z.array(McpCitation).default([]),
  })
  .strict()
  .refine((r) => r.ok || !!r.error, {
    message: "non-ok response must include error",
  });

export type McpToolResponse = z.infer<typeof McpToolResponse>;
