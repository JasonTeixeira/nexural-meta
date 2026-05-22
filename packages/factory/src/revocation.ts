/**
 * Recipe revocation check per ADR-0009 §1.6.
 *
 * `nx forge` consults `nexural-meta/security/revoked-recipes.yaml` before
 * emitting. Revoked recipe + version → forge fails immediately.
 */

import type { RevokedRecipesList } from "@nexural/schema";

export interface RevocationCheckResult {
  readonly revoked: boolean;
  readonly reason?: string;
  readonly revokedAt?: string;
  readonly ticket?: string;
}

/**
 * Check whether a (name, version) pair is on the revocation list.
 *
 * Exact name AND exact version must match (per ADR-0009 — revocations are precise).
 */
export function checkRevocation(
  recipeName: string,
  recipeVersion: string,
  list: RevokedRecipesList,
): RevocationCheckResult {
  for (const entry of list.entries) {
    if (entry.recipe_name === recipeName && entry.recipe_version === recipeVersion) {
      return {
        revoked: true,
        reason: entry.reason,
        revokedAt: entry.revoked_at,
        ...(entry.ticket ? { ticket: entry.ticket } : {}),
      };
    }
  }
  return { revoked: false };
}
