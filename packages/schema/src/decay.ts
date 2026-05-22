/**
 * DecayConfig — `.nexural/decay.yaml` inside any warehouse.
 *
 * Allows per-warehouse override of decay rate plus targeted overrides
 * for specific tags / source_types / path globs.
 */

import { z } from "zod";
import { SourceType } from "./frontmatter.js";
import { DecayDays, KebabSlug, SchemaVersion } from "./primitives.js";

const Override = z
  .object({
    match: z
      .object({
        tag: KebabSlug.optional(),
        source_type: SourceType.optional(),
        path_glob: z.string().optional(),
      })
      .strict(),
    decay_days: DecayDays,
  })
  .strict();

export const DecayConfig = z
  .object({
    schema_version: SchemaVersion,
    default_days: DecayDays.optional(),
    overrides: z.array(Override).default([]),
  })
  .strict();

export type DecayConfig = z.infer<typeof DecayConfig>;
