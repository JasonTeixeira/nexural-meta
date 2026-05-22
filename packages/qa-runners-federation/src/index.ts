/**
 * @nexural/qa-runners-federation
 *
 * Three federation-specific qa-os runners per ADR-0008:
 *   - federation-conformance (§3) — drift detection in forged apps
 *   - recipe-validity (§4) — recipe shape + nightly forge verification
 *   - prompt-injection-resilience (§2) — content fuzzing against OWASP LLM payloads
 */

export * from "./types.js";
export * from "./federation-conformance.js";
export * from "./recipe-validity.js";
export * from "./prompt-injection-resilience.js";
