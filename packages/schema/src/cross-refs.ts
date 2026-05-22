/**
 * CrossRefReport — generated artifact validating `related` links across the federation.
 *
 * Produced nightly by `scripts/cross-refs.mjs`.
 */

import { z } from "zod";
import { Iso8601, KebabSlug, SchemaVersion, Ulid } from "./primitives.js";

const Link = z
  .object({
    from_warehouse: KebabSlug,
    from_id: z.union([Ulid, KebabSlug]),
    to_warehouse: KebabSlug,
    to_id: z.union([Ulid, KebabSlug]),
    relation: z.string(),
    valid: z.boolean(),
    reason: z.string().optional(),
  })
  .strict();

const Summary = z
  .object({
    total: z.number().int().nonnegative(),
    broken: z.number().int().nonnegative(),
    orphan_warehouses: z.array(KebabSlug),
  })
  .strict();

export const CrossRefReport = z
  .object({
    schema_version: SchemaVersion,
    generated_at: Iso8601,
    links: z.array(Link),
    summary: Summary,
  })
  .strict();

export type CrossRefReport = z.infer<typeof CrossRefReport>;
