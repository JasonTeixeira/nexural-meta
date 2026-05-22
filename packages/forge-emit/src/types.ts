/**
 * Public types for @nexural/forge-emit.
 *
 * A warehouse contributes a `TemplateFile[]` (declared in its `manifest.yaml`).
 * The forge-emit engine renders those against an `EmitContext` and produces
 * an `EmitResult` of in-memory `EmittedFile[]`. The caller (`nx forge`) is
 * responsible for writing the result to disk, running `git init`, etc.
 *
 * Keeping the engine I/O-free makes it trivially testable and `--dry-run`
 * cheap.
 */

export interface TemplateFile {
  /** Path inside the warehouse (e.g. "templates/app/page.tsx.template"). */
  readonly sourcePath: string;
  /**
   * Target path after rendering, with `{{vars}}` allowed in path segments.
   * Relative to the emit root (e.g. `app/{{slug}}/page.tsx`).
   */
  readonly targetPath: string;
  /** Raw template body. */
  readonly body: string;
  /**
   * Optional conditional. If set, the file is emitted only when this
   * expression renders to a truthy string (anything other than empty,
   * "false", "0", "null", "undefined").
   */
  readonly conditionalOn?: string;
  /** POSIX file mode (e.g. 0o755 for executable). Defaults to 0o644. */
  readonly mode?: number;
  /** Skip template rendering — copy bytes as-is. */
  readonly binary?: boolean;
}

export interface RecipeIdentity {
  readonly name: string;
  readonly version: string;
  readonly description?: string;
}

export interface ForgeMetadata {
  /** App slug (kebab-case). Passed to `nx forge <recipe> <slug>`. */
  readonly slug: string;
  /** ISO 8601 emit timestamp. */
  readonly timestamp: string;
  /** Version of `@nexural/forge-emit` doing the rendering. */
  readonly nexuralVersion: string;
}

export interface EmitContext {
  /** Output of `recipe.inputs.zod.ts.parse(rawInputs)`. */
  readonly inputs: Readonly<Record<string, unknown>>;
  readonly recipe: RecipeIdentity;
  /**
   * Resolved secret values (op:// already shelled out). Used for leak
   * detection — emitted files must not contain any of these literal values.
   */
  readonly secrets: Readonly<Record<string, string>>;
  readonly forge: ForgeMetadata;
}

export interface EmittedFile {
  /** Path relative to the emit root (rendered, no `{{}}` remaining). */
  readonly path: string;
  /** UTF-8 string content for text files; Buffer for binary. */
  readonly content: string | Uint8Array;
  /** POSIX mode. */
  readonly mode: number;
}

export interface EmitWarning {
  readonly code: "unused_input" | "default_applied" | "binary_copied" | "conditional_skipped";
  readonly message: string;
  /** Source path if applicable. */
  readonly source?: string;
}

export interface EmitSkip {
  readonly sourcePath: string;
  readonly reason: string;
}

export interface EmitResult {
  readonly files: ReadonlyArray<EmittedFile>;
  readonly warnings: ReadonlyArray<EmitWarning>;
  readonly skipped: ReadonlyArray<EmitSkip>;
}

export type EmitErrorCode =
  | "unresolved_variable"
  | "secret_leak"
  | "template_syntax"
  | "invalid_path"
  | "duplicate_path"
  | "binary_with_template_marker";

export class EmitError extends Error {
  readonly code: EmitErrorCode;
  readonly sourcePath?: string;
  readonly detail?: Readonly<Record<string, unknown>>;

  constructor(
    code: EmitErrorCode,
    message: string,
    opts: { sourcePath?: string; detail?: Readonly<Record<string, unknown>> } = {},
  ) {
    super(`[forge-emit:${code}] ${message}`);
    this.name = "EmitError";
    this.code = code;
    if (opts.sourcePath !== undefined) this.sourcePath = opts.sourcePath;
    if (opts.detail !== undefined) this.detail = opts.detail;
  }
}
