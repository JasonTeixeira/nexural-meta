/**
 * Hashing utilities. Per SCHEMA_CHARTER §4.5, telemetry NEVER stores raw user input.
 * Only sha256 hashes.
 */

import { createHash } from "node:crypto";

/**
 * Stable sha256 hex string for telemetry. Used for `args_hash` in NxCommandEvent
 * and `user_hash` in CostEvent.
 */
export function sha256Hex(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}
