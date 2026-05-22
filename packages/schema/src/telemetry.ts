/**
 * Telemetry events — written by every component (nx, router, warehouse-mcp, ci, cron).
 *
 * **Privacy:** raw query strings and tool args are NEVER stored. Only hashes.
 *
 * Per SCHEMA_CHARTER §4.5 + ADR-0007 (CostEvent).
 */

import { z } from "zod";
import { DecayDays, Iso8601, KebabSlug, SchemaVersion, Ulid } from "./primitives.js";

const BaseEvent = z.object({
  schema_version: SchemaVersion,
  event_id: Ulid,
  ts: Iso8601,
  host: z.string(),
  process: z.enum(["nx", "router", "warehouse-mcp", "ci", "cron"]),
  session_id: Ulid.optional(),
});

export const ToolCallEvent = BaseEvent.extend({
  kind: z.literal("tool_call"),
  warehouse: KebabSlug,
  tool: KebabSlug,
  latency_ms: z.number().int().nonnegative(),
  ok: z.boolean(),
  error_code: z.string().optional(),
}).strict();

export const NxCommandEvent = BaseEvent.extend({
  kind: z.literal("nx_command"),
  command: KebabSlug,
  args_hash: z.string().regex(/^[a-f0-9]{64}$/, "must be sha256 hex"),
  latency_ms: z.number().int().nonnegative(),
  exit_code: z.number().int(),
}).strict();

export const DecayWarnEvent = BaseEvent.extend({
  kind: z.literal("decay_warn"),
  warehouse: KebabSlug,
  days_since_review: z.number().int().nonnegative(),
  decay_rate_days: DecayDays,
  severity: z.enum(["warn", "quarantine"]),
}).strict();

export const AuditEvent = BaseEvent.extend({
  kind: z.literal("audit"),
  op: z.enum(["decrypt", "encrypt", "key_rotate", "key_lost", "key_added"]),
  warehouse: KebabSlug.optional(),
  file_ulid: Ulid.optional(),
  key_id: z.string(),
  exit: z.number().int(),
}).strict();

/** Per ADR-0007 §7 — emitted by @nexural/sdk.llmClient() cost wrapper. */
export const CostEvent = BaseEvent.extend({
  kind: z.literal("cost_event"),
  app: KebabSlug,
  recipe: KebabSlug,
  severity: z.enum(["warn", "exceeded", "circuit_break"]),
  scope: z.enum(["per_request", "per_user_day", "per_app_day"]),
  projected_usd: z.number().nonnegative(),
  cap_usd: z.number().positive(),
  user_hash: z
    .string()
    .regex(/^[a-f0-9]{64}$/, "must be sha256 hex (never raw user id)")
    .optional(),
}).strict();

export const TelemetryEvent = z.discriminatedUnion("kind", [
  ToolCallEvent,
  NxCommandEvent,
  DecayWarnEvent,
  AuditEvent,
  CostEvent,
]);

export type ToolCallEvent = z.infer<typeof ToolCallEvent>;
export type NxCommandEvent = z.infer<typeof NxCommandEvent>;
export type DecayWarnEvent = z.infer<typeof DecayWarnEvent>;
export type AuditEvent = z.infer<typeof AuditEvent>;
export type CostEvent = z.infer<typeof CostEvent>;
export type TelemetryEvent = z.infer<typeof TelemetryEvent>;
