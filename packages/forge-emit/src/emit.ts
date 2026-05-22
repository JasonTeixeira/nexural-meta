/**
 * Top-level emit orchestrator. Pure / I/O-free — produces an in-memory
 * EmitResult. The caller (`nx forge`) writes to disk.
 *
 * Pipeline per template file:
 *   1. Evaluate conditionalOn (skip + warn if falsy)
 *   2. Render targetPath
 *   3. Validate targetPath (no `{{}}` left; no `..`; not absolute)
 *   4. Render body (or copy as-is if binary)
 *   5. Scan rendered body for secret leaks
 *   6. Push EmittedFile
 *
 * Final pass: detect duplicate target paths (two templates emitting to the
 * same path = federation bug, hard fail).
 */

import { renderTemplate, lookup } from "./render.js";
import {
  EmitError,
  type EmitContext,
  type EmitResult,
  type EmitWarning,
  type EmitSkip,
  type EmittedFile,
  type TemplateFile,
} from "./types.js";

const TEMPLATE_MARKER_PATTERN = /\{\{[^}]*\}\}/;
const PATH_TRAVERSAL = /(^|\/)\.\.(\/|$)/;
const ABSOLUTE_PATH = /^(\/|[A-Za-z]:\\)/;
const DEFAULT_MODE = 0o644;

export interface EmitOptions {
  /** Throw on unknown variables (default true). False is for tests only. */
  readonly strict?: boolean;
}

export function emit(
  templates: ReadonlyArray<TemplateFile>,
  ctx: EmitContext,
  options: EmitOptions = {},
): EmitResult {
  const strict = options.strict ?? true;
  const warnings: EmitWarning[] = [];
  const skipped: EmitSkip[] = [];
  const emitted: EmittedFile[] = [];
  const seenPaths = new Map<string, string>(); // path -> source

  const usedInputKeys = new Set<string>();

  for (const tmpl of templates) {
    // 1. Conditional
    if (tmpl.conditionalOn !== undefined) {
      const value = lookup(tmpl.conditionalOn, ctx);
      if (!truthy(value)) {
        skipped.push({
          sourcePath: tmpl.sourcePath,
          reason: `conditional "${tmpl.conditionalOn}" evaluated falsy`,
        });
        warnings.push({
          code: "conditional_skipped",
          message: `skipped ${tmpl.sourcePath} (${tmpl.conditionalOn} = falsy)`,
          source: tmpl.sourcePath,
        });
        continue;
      }
      trackUsage(tmpl.conditionalOn, usedInputKeys);
    }

    // 2. Render path
    const pathRender = renderTemplate(tmpl.targetPath, ctx, {
      sourcePath: `${tmpl.sourcePath}#path`,
      strict,
    });
    warnings.push(...pathRender.warnings);
    const renderedPath = pathRender.text;

    // 3. Validate path
    if (TEMPLATE_MARKER_PATTERN.test(renderedPath)) {
      throw new EmitError(
        "invalid_path",
        `Target path "${renderedPath}" still contains template markers after render`,
        { sourcePath: tmpl.sourcePath, detail: { renderedPath } },
      );
    }
    if (PATH_TRAVERSAL.test(renderedPath) || ABSOLUTE_PATH.test(renderedPath)) {
      throw new EmitError("invalid_path", `Unsafe target path "${renderedPath}"`, {
        sourcePath: tmpl.sourcePath,
        detail: { renderedPath },
      });
    }
    const prior = seenPaths.get(renderedPath);
    if (prior !== undefined) {
      throw new EmitError(
        "duplicate_path",
        `Two templates emit to "${renderedPath}": "${prior}" and "${tmpl.sourcePath}"`,
        { sourcePath: tmpl.sourcePath, detail: { renderedPath, conflicts: [prior] } },
      );
    }

    // 4. Render body (or skip for binaries)
    let content: string | Uint8Array;
    if (tmpl.binary) {
      // Binary files must not contain template markers in their body. If
      // they do, that's almost certainly a misclassification.
      if (TEMPLATE_MARKER_PATTERN.test(tmpl.body)) {
        throw new EmitError(
          "binary_with_template_marker",
          `Binary template ${tmpl.sourcePath} contains "{{...}}" markers — declare binary:false to render, or remove markers`,
          { sourcePath: tmpl.sourcePath },
        );
      }
      content = new TextEncoder().encode(tmpl.body);
      warnings.push({
        code: "binary_copied",
        message: `copied ${tmpl.sourcePath} as-is`,
        source: tmpl.sourcePath,
      });
    } else {
      const bodyRender = renderTemplate(tmpl.body, ctx, {
        sourcePath: tmpl.sourcePath,
        strict,
      });
      warnings.push(...bodyRender.warnings);
      content = bodyRender.text;
    }

    // 5. Secret-leak scan
    if (typeof content === "string") {
      assertNoSecretLeak(content, ctx, tmpl.sourcePath);
    }

    emitted.push({
      path: renderedPath,
      content,
      mode: tmpl.mode ?? DEFAULT_MODE,
    });
    seenPaths.set(renderedPath, tmpl.sourcePath);
  }

  // Unused-input warnings (best-effort; only counts top-level inputs keys
  // that appear in no template body OR path).
  for (const key of Object.keys(ctx.inputs)) {
    if (!usedInputKeys.has(key) && !appearsInAnyTemplate(key, templates)) {
      warnings.push({
        code: "unused_input",
        message: `recipe input "${key}" never referenced by any template`,
      });
    }
  }

  return { files: emitted, warnings, skipped };
}

function trackUsage(path: string, set: Set<string>): void {
  const head = path.split(".")[0];
  if (head === "inputs") {
    const second = path.split(".")[1];
    if (second !== undefined) set.add(second);
  } else if (head !== "recipe" && head !== "secrets" && head !== "forge") {
    // bare names = inputs.<name>
    if (head !== undefined) set.add(head);
  }
}

function appearsInAnyTemplate(key: string, templates: ReadonlyArray<TemplateFile>): boolean {
  const inputsPattern = new RegExp(`\\binputs\\.${escapeRegExp(key)}\\b`);
  const barePattern = new RegExp(`\\{\\{\\s*${escapeRegExp(key)}(\\s*[|}.])`);
  for (const t of templates) {
    if (inputsPattern.test(t.body) || barePattern.test(t.body)) return true;
    if (inputsPattern.test(t.targetPath) || barePattern.test(t.targetPath)) return true;
    if (t.conditionalOn !== undefined) {
      if (inputsPattern.test(t.conditionalOn) || barePattern.test(t.conditionalOn)) return true;
    }
  }
  return false;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function truthy(v: unknown): boolean {
  if (v === undefined || v === null) return false;
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0 && !Number.isNaN(v);
  if (typeof v === "string") {
    const x = v.trim().toLowerCase();
    return x !== "" && x !== "false" && x !== "0" && x !== "null" && x !== "undefined";
  }
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "object") return Object.keys(v).length > 0;
  return true;
}

/**
 * Scan rendered text for literal secret values. If any secret value (length
 * ≥ 8 to avoid trivial false positives) appears in the output, fail.
 *
 * This is the leak-detection floor. It does not catch all leaks (a secret
 * embedded in a URL the LLM constructed via concatenation could still
 * sneak through), but it catches the easy case of a template accidentally
 * including `{{ secrets.foo }}` without env indirection.
 */
function assertNoSecretLeak(text: string, ctx: EmitContext, sourcePath: string): void {
  for (const [name, value] of Object.entries(ctx.secrets)) {
    if (value.length < 8) continue;
    if (text.includes(value)) {
      throw new EmitError(
        "secret_leak",
        `Emitted file would contain literal value of secret "${name}". Use env-var indirection, not direct substitution.`,
        { sourcePath, detail: { secret: name } },
      );
    }
  }
}
