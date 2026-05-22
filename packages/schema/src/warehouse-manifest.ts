/**
 * WarehouseManifest — `manifest.yaml` at the root of every warehouse.
 *
 * Distinct from `meta.yaml` (WarehouseMeta) which describes the warehouse
 * itself. The manifest describes the warehouse's **contribution surface**:
 * which documents it exposes (consumed by `nx ask` + agent synthesis) and
 * which templates it exposes (consumed by `nx forge` at emit time).
 *
 * Introduced in Phase 6.5 per ADR-0011 §2 (Minimum Viable Warehouses).
 */

import { z } from "zod";
import { KebabSlug, SchemaVersion } from "./primitives.js";

/**
 * A document is a piece of authored knowledge — markdown / yaml /
 * structured text — that the warehouse offers as reference material.
 * `nx ask` synthesis pulls these via the MCP layer (per ADR-0008 §1).
 */
export const WarehouseDocument = z
  .object({
    /** Stable id for cross-references; kebab-case. */
    id: KebabSlug,
    /** Path relative to the warehouse root. */
    path: z.string().min(1),
    /** Short human-readable title. */
    title: z.string().min(3).max(160),
    /**
     * Who is allowed to consume this document.
     * "agents" = LLM synthesis; "human" = direct read via `nx ask --human`;
     * "public" = any external MCP consumer.
     */
    audience: z
      .array(z.enum(["agents", "human", "public"]))
      .min(1)
      .max(3),
    /** Free-form tags for retrieval / filtering. */
    tags: z.array(z.string().min(1).max(40)).max(20).default([]),
    /**
     * Last-reviewed ISO date. Decay countdown starts here. Inherits the
     * warehouse's `meta.yaml.decay_rate_days` if unset.
     */
    last_reviewed: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
  })
  .strict();
export type WarehouseDocument = z.infer<typeof WarehouseDocument>;

/**
 * A template is an emittable artifact — code, config, or scaffold — that
 * `nx forge` writes to disk when composing a recipe. Each template
 * declares which recipes are allowed to consume it (or `["*"]` for
 * recipe-agnostic primitives like `.gitignore`).
 */
export const WarehouseTemplate = z
  .object({
    /** Stable id for cross-references; kebab-case. */
    id: KebabSlug,
    /** Source path relative to the warehouse root. */
    source: z.string().min(1),
    /**
     * Emit target path, with Handlebars-style `{{vars}}` allowed in
     * path segments. Relative to the emit root.
     */
    target_path: z.string().min(1),
    /**
     * Which recipes may consume this template. `["*"]` = any recipe.
     * Empty array = template not yet released to any recipe.
     */
    consumers: z.array(z.union([z.literal("*"), KebabSlug])).default([]),
    /** Optional conditional path; same syntax as TemplateFile.conditionalOn. */
    conditional_on: z.string().min(1).optional(),
    /** Mark binary files (skip rendering, copy bytes). */
    binary: z.boolean().default(false),
    /** POSIX mode (octal). Default 0o644. */
    mode: z.number().int().min(0).max(0o7777).optional(),
  })
  .strict();
export type WarehouseTemplate = z.infer<typeof WarehouseTemplate>;

export const WarehouseManifest = z
  .object({
    schema_version: SchemaVersion,
    /** Must match the warehouse's `meta.yaml.name`. */
    warehouse: KebabSlug,
    /** Manifest version; bumps on document/template changes. */
    version: z.string().regex(/^\d+\.\d+\.\d+$/, "semver: major.minor.patch"),
    /** Short description of what this warehouse contributes. */
    description: z.string().min(20).max(500),
    /** Authored documents. */
    documents: z.array(WarehouseDocument).default([]),
    /** Forge templates. */
    templates: z.array(WarehouseTemplate).default([]),
  })
  .strict()
  .refine(
    (m) => {
      // Document ids unique
      const docIds = new Set<string>();
      for (const d of m.documents) {
        if (docIds.has(d.id)) return false;
        docIds.add(d.id);
      }
      return true;
    },
    { message: "document ids must be unique within a manifest" },
  )
  .refine(
    (m) => {
      // Template ids unique
      const tplIds = new Set<string>();
      for (const t of m.templates) {
        if (tplIds.has(t.id)) return false;
        tplIds.add(t.id);
      }
      return true;
    },
    { message: "template ids must be unique within a manifest" },
  );
export type WarehouseManifest = z.infer<typeof WarehouseManifest>;
