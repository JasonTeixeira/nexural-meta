/**
 * @nexural/model-router
 *
 * Resolves stable model family references (e.g. `anthropic:opus`) to
 * volatile concrete model IDs at runtime. Supports:
 *
 *   - deprecation awareness (skip deprecated; fall down chain)
 *   - price ceiling per family (per ADR-0010 §2.8) — skip if pricing exceeds ceiling
 *   - fallback chains (per ADR-0007 §3)
 *
 * Source registry: ./registry.ts (Renovate-updated).
 */

import type { ModelFamilyResolution } from "@nexural/schema";
import { REGISTRY } from "./registry.js";

export type Family = `${string}:${string}`;

export interface ResolveOptions {
  /**
   * If true, also include `deprecating` (announced but not yet pulled) families.
   * Default: true. Set false to be strict.
   */
  readonly includeDeprecating?: boolean;

  /**
   * Override registry (useful for tests or hot-loading).
   */
  readonly registry?: ReadonlyArray<ModelFamilyResolution>;
}

const DEFAULT_OPTIONS: Required<ResolveOptions> = {
  includeDeprecating: true,
  registry: REGISTRY,
};

/**
 * Resolve a single family to its current model resolution.
 *
 * Returns `null` if the family is not in the registry or is fully deprecated.
 */
export function resolveFamily(
  family: Family,
  options?: ResolveOptions,
): ModelFamilyResolution | null {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const found = opts.registry.find((r) => r.family === family);
  if (!found) return null;
  if (found.status === "deprecated") return null;
  if (!opts.includeDeprecating && found.status === "deprecating") return null;
  // Price ceiling per ADR-0010 §2.8
  if (
    typeof found.price_ceiling_usd_per_million_tokens === "number" &&
    found.pricing.input_per_million_tokens_usd > found.price_ceiling_usd_per_million_tokens
  ) {
    return null;
  }
  return found;
}

/**
 * Resolve a fallback chain. Returns the first family that resolves successfully,
 * along with the chain position used (0-indexed).
 *
 * Returns `null` if no family in the chain resolves.
 */
export function resolveChain(
  chain: ReadonlyArray<Family>,
  options?: ResolveOptions,
): { resolution: ModelFamilyResolution; chainIndex: number } | null {
  for (let i = 0; i < chain.length; i++) {
    const family = chain[i];
    if (!family) continue;
    const resolved = resolveFamily(family, options);
    if (resolved) return { resolution: resolved, chainIndex: i };
  }
  return null;
}

/**
 * Estimate USD cost for a model invocation.
 *
 * Used by @nexural/sdk's cost-wrapped llmClient() for pre-flight checks.
 */
export function estimateCostUsd(
  resolution: ModelFamilyResolution,
  inputTokens: number,
  outputTokens: number,
  options?: { cached?: boolean },
): number {
  const inputCost =
    options?.cached && typeof resolution.pricing.cached_input_per_million_tokens_usd === "number"
      ? resolution.pricing.cached_input_per_million_tokens_usd
      : resolution.pricing.input_per_million_tokens_usd;
  const inputUsd = (inputTokens / 1_000_000) * inputCost;
  const outputUsd = (outputTokens / 1_000_000) * resolution.pricing.output_per_million_tokens_usd;
  return inputUsd + outputUsd;
}

/** List all families known to the registry. */
export function listFamilies(options?: Pick<ResolveOptions, "registry">): ReadonlyArray<Family> {
  const reg = options?.registry ?? REGISTRY;
  return reg.map((r) => r.family as Family);
}

/** Re-export the registry shape for direct consumers (tests, dashboard). */
export { REGISTRY } from "./registry.js";
