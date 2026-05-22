/**
 * Filesystem warehouse loader. Reads a warehouse directory at a given
 * path, parses its `manifest.yaml`, and materializes documents +
 * forge-emit TemplateFile[] from the declared paths.
 *
 * Phase 6.5 path: warehouses live as local directories under
 * `warehouses/<name>/`. Phase 7+ swaps this for MCP stdio fetch via
 * `@nexural/mcp-base` while preserving the same `LoadedWarehouse` shape.
 */

import { existsSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { parse as parseYaml } from "yaml";
import type { TemplateFile } from "@nexural/forge-emit";
import { WarehouseManifest, type WarehouseDocument, type WarehouseTemplate } from "@nexural/schema";

export interface LoadedDocument {
  readonly meta: WarehouseDocument;
  /** Resolved on demand; null until `readDocument()` is called. */
  readonly body: string;
}

export interface LoadedWarehouse {
  readonly root: string;
  readonly manifest: WarehouseManifest;
  /** Documents (metadata only; body lazy-loaded). */
  readonly documents: ReadonlyArray<WarehouseDocument>;
  /** Templates already materialized as forge-emit TemplateFile[]. */
  readonly templates: ReadonlyArray<TemplateFile>;
}

export class WarehouseLoadError extends Error {
  readonly warehouseRoot: string;
  readonly detail?: Readonly<Record<string, unknown>>;
  constructor(
    message: string,
    opts: { warehouseRoot: string; detail?: Readonly<Record<string, unknown>> },
  ) {
    super(`[warehouse-base] ${message}`);
    this.name = "WarehouseLoadError";
    this.warehouseRoot = opts.warehouseRoot;
    if (opts.detail !== undefined) this.detail = opts.detail;
  }
}

/**
 * Load a warehouse from disk.
 *
 * Throws WarehouseLoadError on:
 *   - missing manifest.yaml
 *   - manifest fails schema validation
 *   - any declared template's source file is missing
 *
 * Does NOT throw on missing documents (those are read lazily by ID).
 */
export function loadWarehouse(root: string): LoadedWarehouse {
  if (!existsSync(root) || !statSync(root).isDirectory()) {
    throw new WarehouseLoadError(`warehouse root not a directory: ${root}`, {
      warehouseRoot: root,
    });
  }
  const manifestPath = join(root, "manifest.yaml");
  if (!existsSync(manifestPath)) {
    throw new WarehouseLoadError(`missing manifest.yaml at ${manifestPath}`, {
      warehouseRoot: root,
    });
  }

  let raw: unknown;
  try {
    raw = parseYaml(readFileSync(manifestPath, "utf8"));
  } catch (err) {
    throw new WarehouseLoadError(`manifest.yaml is not valid YAML: ${(err as Error).message}`, {
      warehouseRoot: root,
    });
  }

  const parsed = WarehouseManifest.safeParse(raw);
  if (!parsed.success) {
    throw new WarehouseLoadError(
      `manifest.yaml failed schema validation: ${parsed.error.message}`,
      { warehouseRoot: root, detail: { issues: parsed.error.issues } },
    );
  }
  const manifest = parsed.data;

  const templates: TemplateFile[] = [];
  for (const t of manifest.templates) {
    const sourceFull = join(root, t.source);
    if (!existsSync(sourceFull)) {
      throw new WarehouseLoadError(
        `template "${t.id}" declares source "${t.source}" but file does not exist`,
        { warehouseRoot: root, detail: { template: t.id, expectedPath: t.source } },
      );
    }
    templates.push(materializeTemplate(t, root, sourceFull));
  }

  return {
    root,
    manifest,
    documents: manifest.documents,
    templates,
  };
}

function materializeTemplate(t: WarehouseTemplate, root: string, sourceFull: string): TemplateFile {
  const body = t.binary ? "" : readFileSync(sourceFull, "utf8");
  const sourcePath = relative(root, sourceFull).split(sep).join("/");
  const result: TemplateFile = {
    sourcePath,
    targetPath: t.target_path,
    body,
    binary: t.binary,
  };
  if (t.conditional_on !== undefined) {
    (result as { conditionalOn?: string }).conditionalOn = t.conditional_on;
  }
  if (t.mode !== undefined) {
    (result as { mode?: number }).mode = t.mode;
  }
  return result;
}

/**
 * Read a document's body by id. Throws if the document is declared but
 * its file is missing on disk.
 */
export function readDocument(warehouse: LoadedWarehouse, documentId: string): LoadedDocument {
  const doc = warehouse.documents.find((d) => d.id === documentId);
  if (!doc) {
    throw new WarehouseLoadError(`no document with id "${documentId}"`, {
      warehouseRoot: warehouse.root,
    });
  }
  const full = join(warehouse.root, doc.path);
  if (!existsSync(full)) {
    throw new WarehouseLoadError(
      `document "${documentId}" declared at "${doc.path}" but file missing`,
      { warehouseRoot: warehouse.root, detail: { documentId } },
    );
  }
  return { meta: doc, body: readFileSync(full, "utf8") };
}

/**
 * Filter a warehouse's templates by recipe name(s). Returns templates whose
 * `consumers` includes any of the given names, OR contains the wildcard
 * "*". Pass an array to include extends-chain parents — a recipe inherits
 * its parent's eligible templates.
 *
 * Accepts a string for backwards compat (Phase 6.5) or string[] for
 * extends-aware filtering (Phase 7+).
 */
export function templatesForRecipe(
  warehouse: LoadedWarehouse,
  recipeNames: string | ReadonlyArray<string>,
): TemplateFile[] {
  const names = Array.isArray(recipeNames) ? recipeNames : [recipeNames as string];
  return warehouse.templates.filter((tpl) => {
    const declared = warehouse.manifest.templates.find((t) => t.target_path === tpl.targetPath);
    if (!declared) return false;
    if (declared.consumers.length === 0) return false;
    if (declared.consumers.includes("*")) return true;
    return names.some((n) => declared.consumers.includes(n));
  });
}
