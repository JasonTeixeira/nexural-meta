/**
 * ModelFamilyResolution + ModelFamilyRegistry — per ADR-0007 + ADR-0010 §2.8.
 *
 * NOTE: this file contains only the SCHEMA. The runtime resolver lives in
 * the separate `@nexural/model-router` package.
 */

import { z } from "zod";
import { IsoDate, Iso8601, SchemaVersion } from "./primitives.js";

const FamilyId = z
  .string()
  .regex(/^[a-z0-9-]+:[a-z0-9-]+$/, "family must be `provider:tier` e.g. `anthropic:opus`");

const ModelTier = z.enum(["flagship", "premium", "balanced", "fast", "small"]);
const ModelStatus = z.enum(["current", "deprecating", "deprecated", "preview"]);

const Pricing = z
  .object({
    input_per_million_tokens_usd: z.number().nonnegative(),
    output_per_million_tokens_usd: z.number().nonnegative(),
    cached_input_per_million_tokens_usd: z.number().nonnegative().optional(),
  })
  .strict();

export const ModelFamilyResolution = z
  .object({
    family: FamilyId,
    id: z.string().min(1),
    tier: ModelTier,
    context_window: z.number().int().positive(),
    pricing: Pricing,
    /** Per ADR-0010 §2.8 — if current pricing exceeds this ceiling, router substitutes next family. */
    price_ceiling_usd_per_million_tokens: z.number().positive().optional(),
    deprecates_at: IsoDate.nullable(),
    status: ModelStatus,
  })
  .strict();
export type ModelFamilyResolution = z.infer<typeof ModelFamilyResolution>;

export const ModelFamilyRegistry = z
  .object({
    schema_version: SchemaVersion,
    generated_at: Iso8601,
    resolutions: z.array(ModelFamilyResolution),
  })
  .strict();
export type ModelFamilyRegistry = z.infer<typeof ModelFamilyRegistry>;
