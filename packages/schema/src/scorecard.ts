/**
 * ScorecardReport — generated artifact produced by nexural-qa-os
 * verify-all run. Lives at `nexural-meta/scorecard.json`.
 */

import { z } from "zod";
import { Federation, Iso8601, KebabSlug, SchemaVersion } from "./primitives.js";

const Finding = z
  .object({
    category: KebabSlug,
    severity: z.enum(["info", "warn", "error", "critical"]),
    message: z.string(),
    file: z.string().optional(),
  })
  .strict();

const Grade = z.enum(["S", "A", "B", "C", "D", "F"]);

const WarehouseScore = z
  .object({
    name: KebabSlug,
    federation: Federation,
    score: z.number().int().min(0).max(100),
    grade: Grade,
    findings: z.array(Finding),
  })
  .strict();

const Aggregate = z
  .object({
    mean_score: z.number(),
    median_score: z.number(),
    below_80_count: z.number().int().nonnegative(),
    below_90_count: z.number().int().nonnegative(),
  })
  .strict();

export const ScorecardReport = z
  .object({
    schema_version: SchemaVersion,
    generated_at: Iso8601,
    warehouses: z.array(WarehouseScore),
    aggregate: Aggregate,
  })
  .strict();

export type ScorecardReport = z.infer<typeof ScorecardReport>;
