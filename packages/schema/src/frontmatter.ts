/**
 * ContentFrontmatter — per-entry `frontmatter.yaml` inside a warehouse.
 *
 * Validated at warehouse pre-commit + CI.
 */

import { z } from "zod";
import { DecayDays, IsoDate, KebabSlug, SchemaVersion, Ulid } from "./primitives.js";

export const SourceType = z.enum([
  "principle",
  "playbook",
  "framework",
  "template",
  "case-study",
  "decision",
  "reference",
  "snippet",
  "checklist",
  "rubric",
  "post-mortem",
]);
export type SourceType = z.infer<typeof SourceType>;

export const RelatedRelation = z.enum(["extends", "supersedes", "informs", "contradicts", "cites"]);
export type RelatedRelation = z.infer<typeof RelatedRelation>;

const Related = z
  .object({
    warehouse: KebabSlug,
    id: z.union([Ulid, KebabSlug]),
    relation: RelatedRelation,
  })
  .strict();

const Visibility = z
  .object({
    public_via_mcp: z.boolean(),
    embedding_eligible: z.boolean(),
  })
  .strict();

export const ContentFrontmatter = z
  .object({
    schema_version: SchemaVersion,
    id: z.union([Ulid, KebabSlug]),
    title: z.string().min(3).max(200),
    summary: z.string().min(20).max(500),
    tags: z.array(KebabSlug).max(20),
    created: IsoDate,
    updated: IsoDate,
    last_reviewed: IsoDate,
    decay_rate_days: DecayDays.optional(),
    status: z.enum(["draft", "active", "archived", "deprecated"]),
    authors: z.array(z.string()).min(1),
    source_type: SourceType,
    related: z.array(Related).default([]),
    visibility: Visibility,
  })
  .strict();

export type ContentFrontmatter = z.infer<typeof ContentFrontmatter>;
