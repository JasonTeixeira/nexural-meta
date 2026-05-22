/**
 * @nexural/qa-runners-federation
 *
 * Federation-specific qa-os runners:
 *   - federation-conformance (ADR-0008 §3) — drift detection in forged apps
 *   - recipe-validity (ADR-0008 §4) — recipe shape + nightly forge verification
 *   - prompt-injection-resilience (ADR-0008 §2) — content fuzzing
 *   - golden-set-drift (ADR-0010 §2.9) — eval golden set shape + drift detection
 *   - forge-emit-conformance (ADR-0011) — recipe must successfully forge an emit
 */

export * from "./types.js";
export * from "./federation-conformance.js";
export * from "./recipe-validity.js";
export * from "./prompt-injection-resilience.js";
export * from "./golden-set-drift.js";
export * from "./forge-emit-conformance.js";
