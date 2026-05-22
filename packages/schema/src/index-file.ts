/**
 * WarehouseIndex — generated `index.json` per warehouse.
 *
 * NEVER hand-edited. Pre-commit hook fails if hash diverges from
 * `scripts/build-index.mjs` output.
 */

import { z } from "zod";
import { SourceType } from "./frontmatter.js";
import { IsoDate, Iso8601, KebabSlug, SchemaVersion, SemverString, Ulid } from "./primitives.js";

const IndexEntry = z
  .object({
    id: z.union([Ulid, KebabSlug]),
    path: z.string(),
    title: z.string(),
    tags: z.array(KebabSlug),
    updated: IsoDate,
    last_reviewed: IsoDate,
    source_type: SourceType,
  })
  .strict();

const IndexHealth = z
  .object({
    decayed_entries: z.number().int().nonnegative(),
    draft_entries: z.number().int().nonnegative(),
    scorecard: z.number().int().min(0).max(100).optional(),
  })
  .strict();

export const WarehouseIndex = z
  .object({
    schema_version: SchemaVersion,
    warehouse: KebabSlug,
    generated_at: Iso8601,
    generator_version: SemverString,
    count: z.number().int().nonnegative(),
    entries: z.array(IndexEntry),
    health: IndexHealth,
  })
  .strict();

export type WarehouseIndex = z.infer<typeof WarehouseIndex>;
