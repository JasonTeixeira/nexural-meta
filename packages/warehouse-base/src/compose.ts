/**
 * Multi-warehouse composition. Loads many warehouses and returns the
 * combined TemplateFile[] for a given recipe, with duplicate-path
 * detection across warehouse boundaries.
 *
 * This is what `nx forge` calls to assemble the full emit set:
 *
 *   const composed = composeForRecipe({
 *     warehouseRoots: [
 *       "/repo/warehouses/architecture",
 *       "/repo/warehouses/auth",
 *       ...
 *     ],
 *     recipeName: "saas-multitenant-baseline",
 *     additionalTemplates: localRecipeTemplates,
 *   });
 *   emit(composed.templates, ctx);
 *
 * Phase 6.5: local-disk warehouses only. Phase 7+: MCP-fetched warehouses
 * via @nexural/mcp-base.
 */

import type { TemplateFile } from "@nexural/forge-emit";
import { loadWarehouse, templatesForRecipe, WarehouseLoadError } from "./loader.js";

export interface ComposeRequest {
  /** Absolute paths to warehouse directories. */
  readonly warehouseRoots: ReadonlyArray<string>;
  /**
   * Recipe name to filter templates by. A recipe inherits its parent's
   * templates — pass the extends chain explicitly here (e.g.
   * `["fintech-ledger-app", "saas-multitenant-baseline"]`).
   */
  readonly recipeName: string | ReadonlyArray<string>;
  /**
   * Templates the recipe ships locally (e.g. `recipes/<name>/templates/*`).
   * These appear LAST in the composed array, so any duplicate path with
   * a warehouse-supplied template causes an error rather than silent override.
   */
  readonly additionalTemplates?: ReadonlyArray<TemplateFile>;
}

export interface ComposeResult {
  readonly templates: ReadonlyArray<TemplateFile>;
  /** Map of target path → which warehouse / source provided it (for debugging). */
  readonly provenance: Readonly<Record<string, string>>;
  readonly warehouseCount: number;
  readonly templateCountByWarehouse: Readonly<Record<string, number>>;
}

export class ComposeError extends Error {
  readonly code: "duplicate_path_across_warehouses" | "warehouse_load_failed";
  readonly detail?: Readonly<Record<string, unknown>>;
  constructor(
    code: ComposeError["code"],
    message: string,
    detail?: Readonly<Record<string, unknown>>,
  ) {
    super(`[warehouse-base:${code}] ${message}`);
    this.name = "ComposeError";
    this.code = code;
    if (detail !== undefined) this.detail = detail;
  }
}

export function composeForRecipe(req: ComposeRequest): ComposeResult {
  const seen = new Map<string, string>(); // targetPath → provenance label
  const composed: TemplateFile[] = [];
  const countByWh: Record<string, number> = {};

  for (const root of req.warehouseRoots) {
    let wh;
    try {
      wh = loadWarehouse(root);
    } catch (err) {
      if (err instanceof WarehouseLoadError) {
        throw new ComposeError(
          "warehouse_load_failed",
          `failed to load warehouse at ${root}: ${err.message}`,
          { warehouseRoot: root, cause: err.message },
        );
      }
      throw err;
    }
    const eligible = templatesForRecipe(wh, req.recipeName);
    const label = wh.manifest.warehouse;
    countByWh[label] = eligible.length;
    for (const t of eligible) {
      const prior = seen.get(t.targetPath);
      if (prior !== undefined) {
        throw new ComposeError(
          "duplicate_path_across_warehouses",
          `template path "${t.targetPath}" provided by both "${prior}" and "${label}"`,
          { targetPath: t.targetPath, providers: [prior, label] },
        );
      }
      seen.set(t.targetPath, label);
      composed.push(t);
    }
  }

  for (const t of req.additionalTemplates ?? []) {
    const prior = seen.get(t.targetPath);
    if (prior !== undefined) {
      throw new ComposeError(
        "duplicate_path_across_warehouses",
        `template path "${t.targetPath}" provided by warehouse "${prior}" and also by the recipe's local templates`,
        { targetPath: t.targetPath, providers: [prior, "<recipe>"] },
      );
    }
    seen.set(t.targetPath, "<recipe>");
    composed.push(t);
  }

  return {
    templates: composed,
    provenance: Object.fromEntries(seen),
    warehouseCount: req.warehouseRoots.length,
    templateCountByWarehouse: countByWh,
  };
}
