/**
 * Typosquat detection per ADR-0009 §1.7.
 *
 * For each package in the to-be-emitted dep tree, compare against a known
 * high-priority package list. If Levenshtein distance is small (1-2 chars),
 * flag as suspicious.
 *
 * Recipes that legitimately depend on a similarly-named package opt in via
 * explicit allowlist in recipe.yaml (out of scope here; consumed by `nx forge`).
 */

/**
 * High-priority package names — common typosquat targets.
 * Update as the ecosystem evolves; sourced from npm download statistics.
 */
export const HIGH_PRIORITY_PACKAGES: ReadonlyArray<string> = [
  // React ecosystem
  "react",
  "react-dom",
  "react-router",
  "react-router-dom",
  // Next
  "next",
  // Vue / Svelte
  "vue",
  "svelte",
  // Tooling
  "vite",
  "vitest",
  "webpack",
  "rollup",
  "esbuild",
  "typescript",
  "tsup",
  "turbo",
  // Utils
  "lodash",
  "lodash-es",
  "axios",
  "node-fetch",
  "zod",
  "yup",
  // Auth / data
  "next-auth",
  "stripe",
  "@supabase/supabase-js",
  // Email
  "resend",
  "nodemailer",
  // LLM
  "@anthropic-ai/sdk",
  "openai",
  // AWS / cloud
  "aws-sdk",
  "@aws-sdk/client-s3",
  // Misc top packages
  "express",
  "cors",
  "dotenv",
  "uuid",
];

/**
 * Levenshtein distance (edit distance).
 */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const prev: number[] = new Array<number>(b.length + 1);
  const curr: number[] = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min((curr[j - 1] ?? 0) + 1, (prev[j] ?? 0) + 1, (prev[j - 1] ?? 0) + cost);
    }
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j] ?? 0;
  }
  return prev[b.length] ?? 0;
}

export interface TyposquatHit {
  readonly suspectName: string;
  readonly knownTarget: string;
  readonly distance: number;
}

/**
 * Check each candidate name against the high-priority list.
 * Returns hits where distance ≤ `maxDistance` AND names differ (exact matches excluded).
 *
 * Default maxDistance = 2 per ADR-0009 §1.7.
 */
export function detectTyposquats(
  candidates: ReadonlyArray<string>,
  options: {
    readonly knownTargets?: ReadonlyArray<string>;
    readonly maxDistance?: number;
  } = {},
): ReadonlyArray<TyposquatHit> {
  const known = options.knownTargets ?? HIGH_PRIORITY_PACKAGES;
  const maxDist = options.maxDistance ?? 2;
  const hits: TyposquatHit[] = [];
  for (const suspect of candidates) {
    for (const target of known) {
      if (suspect === target) continue; // exact match is fine
      const dist = levenshtein(suspect, target);
      if (dist > 0 && dist <= maxDist) {
        hits.push({ suspectName: suspect, knownTarget: target, distance: dist });
      }
    }
  }
  return hits;
}
