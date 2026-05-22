/**
 * Template renderer — Handlebars-flavoured subset, deliberately small.
 *
 * Supported syntax:
 *   - {{ var }}                       — substitute. Errors on unknown var.
 *   - {{ var | default:"foo" }}       — substitute with fallback. Warning emitted on use.
 *   - {{# if expr }}...{{/if}}        — conditional block. Expr is a dotted path; truthy if non-empty + not "false"/"0"/"null".
 *   - {{# unless expr }}...{{/unless}}— negated conditional.
 *
 * Not supported (deliberately, for v0.1):
 *   - {{# each }} iteration
 *   - Nested helpers
 *   - Custom helpers
 *   - HTML-escaping (we emit code, not HTML — escaping is the caller's job)
 *
 * Why no Handlebars dep: zero runtime deps in the render path keeps SBOM
 * lean and means there's no upstream-CVE surface for a load-bearing
 * federation tool. The grammar is tiny enough to parse by hand.
 */

import type { EmitContext, EmitWarning } from "./types.js";
import { EmitError } from "./types.js";

const VAR_PATTERN = /\{\{\s*([^{}#/][^{}]*?)\s*\}\}/g;
const IF_BLOCK = /\{\{#\s*if\s+([^}]+?)\s*\}\}([\s\S]*?)\{\{\/if\}\}/g;
const UNLESS_BLOCK = /\{\{#\s*unless\s+([^}]+?)\s*\}\}([\s\S]*?)\{\{\/unless\}\}/g;

export interface RenderOptions {
  /** Source path for error reporting. */
  readonly sourcePath: string;
  /** When true, unknown variables produce an EmitError instead of leaving `{{...}}` in output. */
  readonly strict: boolean;
}

export interface RenderResult {
  readonly text: string;
  readonly warnings: ReadonlyArray<EmitWarning>;
}

/** Top-level entry point: render template body against context. */
export function renderTemplate(body: string, ctx: EmitContext, opts: RenderOptions): RenderResult {
  const warnings: EmitWarning[] = [];

  // Pass 1: resolve {{# unless }} blocks (must run before {{ var }} to avoid
  // double-substituting things inside un-emitted branches).
  let text = body.replace(UNLESS_BLOCK, (_match, expr: string, inner: string) => {
    const value = lookup(String(expr).trim(), ctx);
    return isTruthy(value) ? "" : inner;
  });

  // Pass 2: resolve {{# if }} blocks.
  text = text.replace(IF_BLOCK, (_match, expr: string, inner: string) => {
    const value = lookup(String(expr).trim(), ctx);
    return isTruthy(value) ? inner : "";
  });

  // Pass 3: resolve {{ var }} and {{ var | default:"x" }} substitutions.
  text = text.replace(VAR_PATTERN, (match, raw: string) => {
    const expr = String(raw).trim();
    const defaultMatch = expr.match(/^([^|]+?)\s*\|\s*default\s*:\s*"([^"]*)"\s*$/);

    const path = defaultMatch ? String(defaultMatch[1]).trim() : expr;
    const value = lookup(path, ctx);

    if (value !== undefined && value !== null) {
      return stringify(value);
    }
    if (defaultMatch) {
      warnings.push({
        code: "default_applied",
        message: `variable "${path}" missing; using default`,
        source: opts.sourcePath,
      });
      return defaultMatch[2] ?? "";
    }
    if (opts.strict) {
      throw new EmitError("unresolved_variable", `Unknown template variable "${path}"`, {
        sourcePath: opts.sourcePath,
        detail: { variable: path, marker: match },
      });
    }
    return match;
  });

  return { text, warnings };
}

/** Look up a dotted path against (inputs|recipe|secrets|forge). */
export function lookup(path: string, ctx: EmitContext): unknown {
  const parts = path.split(".");
  const root = parts.shift();
  if (root === undefined || root === "") return undefined;

  let cur: unknown;
  switch (root) {
    case "inputs":
      cur = ctx.inputs;
      break;
    case "recipe":
      cur = ctx.recipe;
      break;
    case "secrets":
      cur = ctx.secrets;
      break;
    case "forge":
      cur = ctx.forge;
      break;
    default:
      // Bare names default to inputs (most-used namespace).
      cur = (ctx.inputs as Record<string, unknown>)[root];
  }

  for (const segment of parts) {
    if (cur === null || cur === undefined) return undefined;
    if (typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[segment];
  }
  return cur;
}

function stringify(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value === null) return "";
  if (value === undefined) return "";
  // Objects/arrays serialize to JSON (rare in templates but supported).
  return JSON.stringify(value);
}

function isTruthy(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0 && !Number.isNaN(value);
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    return v !== "" && v !== "false" && v !== "0" && v !== "null" && v !== "undefined";
  }
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}
