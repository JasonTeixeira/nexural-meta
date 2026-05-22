/**
 * Typed error shapes used by @nexural/sdk, @nexural/mcp-base, @nexural/factory.
 *
 * All errors include a stable `code` string for telemetry filtering.
 */

import { z } from "zod";

export const NexuralErrorCode = z.enum([
  // Schema
  "schema_validation_failed",
  "schema_version_mismatch",

  // MCP
  "mcp_timeout",
  "mcp_unavailable",
  "mcp_invalid_response",

  // Decay
  "decay_quarantined",
  "decay_stale",

  // Recipe / forge
  "recipe_signature_invalid",
  "recipe_revoked",
  "recipe_input_invalid",
  "recipe_sbom_gate_failed",
  "recipe_license_gate_failed",
  "recipe_typosquat_detected",

  // Cost
  "cost_cap_exceeded",
  "cost_cap_streaming_exceeded",
  "cost_circuit_break",

  // Tier / federation
  "tier_confinement_violation",
  "federation_mismatch",

  // Auth / secrets
  "secret_resolution_failed",
  "op_signin_required",
]);
export type NexuralErrorCode = z.infer<typeof NexuralErrorCode>;

export const NexuralError = z
  .object({
    code: NexuralErrorCode,
    message: z.string().min(1),
    retryable: z.boolean(),
    details: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();
export type NexuralError = z.infer<typeof NexuralError>;
