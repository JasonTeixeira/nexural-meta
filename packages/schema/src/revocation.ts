/**
 * RevokedRecipesList — `nexural-meta/security/revoked-recipes.yaml`.
 *
 * APPEND-ONLY. Per ADR-0009 §1.6.
 * Every entry is signed via cosign.
 * `nx forge` consults this list before emitting; revoked recipe → forge fails.
 */

import { z } from "zod";
import { Iso8601, KebabSlug, SchemaVersion, SemverString } from "./primitives.js";

export const RevokedRecipeEntry = z
  .object({
    recipe_name: KebabSlug,
    recipe_version: SemverString,
    revoked_at: Iso8601,
    reason: z.string().min(10, "must explain why (>= 10 chars)"),
    ticket: z.string().url().optional(),
    signature: z.string().min(1),
  })
  .strict();
export type RevokedRecipeEntry = z.infer<typeof RevokedRecipeEntry>;

export const RevokedRecipesList = z
  .object({
    schema_version: SchemaVersion,
    generated_at: Iso8601,
    entries: z.array(RevokedRecipeEntry),
  })
  .strict();
export type RevokedRecipesList = z.infer<typeof RevokedRecipesList>;
