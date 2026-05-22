/**
 * Tier confinement per ADR-0009 §1.9.
 *
 * Router enforces hard boundary between factory and lifeops federations.
 * `nx ask --factory` MUST NEVER receive lifeops content (and vice versa).
 * Default `nx ask` sees both but synthesis segregates them in the prompt.
 *
 * Cross-federation contamination is a `tier_confinement_violation` warning.
 */

import type { CitedSnippet } from "./envelope.js";
import type { RouterEndpoint } from "./registry.js";

export type QueryScope = "factory" | "lifeops" | "both";

export interface FilterResult {
  readonly allowed: ReadonlyArray<RouterEndpoint>;
  readonly rejected: ReadonlyArray<RouterEndpoint>;
}

/**
 * Filter the endpoint list down to those allowed by `scope`.
 */
export function filterEndpointsForScope(
  endpoints: ReadonlyArray<RouterEndpoint>,
  scope: QueryScope,
): FilterResult {
  if (scope === "both") {
    return { allowed: [...endpoints], rejected: [] };
  }
  const allowed: RouterEndpoint[] = [];
  const rejected: RouterEndpoint[] = [];
  for (const e of endpoints) {
    if (e.federation === scope) allowed.push(e);
    else rejected.push(e);
  }
  return { allowed, rejected };
}

/**
 * After fan-out, double-check that no snippet has crossed the federation
 * boundary. This is defense-in-depth — the filter at request time should
 * prevent it, but middleware confirms.
 *
 * Returns the snippets that pass tier confinement + a list of violations.
 */
export function enforceTierConfinement(
  snippets: ReadonlyArray<CitedSnippet & { federation: "factory" | "lifeops" }>,
  scope: QueryScope,
): {
  passed: ReadonlyArray<CitedSnippet & { federation: "factory" | "lifeops" }>;
  violations: ReadonlyArray<{ snippet: CitedSnippet; reason: string }>;
} {
  if (scope === "both") {
    return { passed: snippets, violations: [] };
  }
  const passed: Array<CitedSnippet & { federation: "factory" | "lifeops" }> = [];
  const violations: Array<{ snippet: CitedSnippet; reason: string }> = [];
  for (const s of snippets) {
    if (s.federation === scope) {
      passed.push(s);
    } else {
      violations.push({
        snippet: s,
        reason: `${s.federation} snippet leaked into ${scope}-scoped query`,
      });
    }
  }
  return { passed, violations };
}
