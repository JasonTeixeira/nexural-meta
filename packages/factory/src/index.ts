/**
 * @nexural/factory
 *
 * Codegen engine for `nx forge`. Phase-1 scope (per BUILD_PLAN v2.1 §Phase 1):
 *
 *   - Recipe loading with revocation check  (ADRs 0002, 0009 §1.6)
 *   - License composition gate              (ADR-0006 §4)
 *   - Typosquat detection                   (ADR-0009 §1.7)
 *   - Lockfile writer                       (ADR-0006 §1)
 *
 * Not yet (Phase 5+ as recipes ship):
 *   - Template emission engine
 *   - cosign signature verification (shell out from nx forge)
 *   - SBOM generation (delegates to cyclonedx-npm)
 *   - Secret resolution via op://  (delegates to op CLI)
 *   - Pre/post-emit hooks
 */

export * from "./license-gate.js";
export * from "./typosquat.js";
export * from "./revocation.js";
export * from "./lockfile.js";
export * from "./recipe-loader.js";
