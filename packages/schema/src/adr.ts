/**
 * ADR frontmatter — for ADRs in `nexural-meta/docs/adr/NNNN-*.md`.
 *
 * Pre-commit + CI enforces this on ADR creation per ARCHITECTURE §12.
 */

import { z } from "zod";
import { IsoDate } from "./primitives.js";

export const AdrFrontmatter = z
  .object({
    number: z.number().int().positive(),
    title: z.string().min(5).max(120),
    status: z.enum(["proposed", "accepted", "superseded", "deprecated"]),
    supersedes: z.number().int().positive().optional(),
    superseded_by: z.number().int().positive().optional(),
    date: IsoDate,
    deciders: z.array(z.string()).min(1),
    soak_until: IsoDate,
  })
  .strict();

export type AdrFrontmatter = z.infer<typeof AdrFrontmatter>;
