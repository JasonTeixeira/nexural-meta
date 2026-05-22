/**
 * @nexural/forge-emit
 *
 * Template render + filesystem emit engine for `nx forge`. Per ADR-0002,
 * ADR-0011. Pure render path (I/O-free) — disk writes live in `write.ts`.
 *
 * Public API:
 *   - emit()                — render templates → in-memory EmitResult
 *   - writeEmitResult()     — write EmitResult to a target directory
 *   - renderTemplate()      — single-string renderer (for forge-emit-conformance)
 *   - EmitContext, TemplateFile, EmitResult, EmitError — types
 */

export { emit, type EmitOptions } from "./emit.js";
export { writeEmitResult, type WriteOptions, type WriteResult } from "./write.js";
export { renderTemplate, lookup, type RenderOptions, type RenderResult } from "./render.js";
export {
  EmitError,
  type EmitContext,
  type EmittedFile,
  type EmitResult,
  type EmitSkip,
  type EmitWarning,
  type EmitErrorCode,
  type ForgeMetadata,
  type RecipeIdentity,
  type TemplateFile,
} from "./types.js";
