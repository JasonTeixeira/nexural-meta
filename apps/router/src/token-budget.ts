/**
 * Token-budget trimming per ADR-0010 §2.5.
 *
 * Synthesis prompt mustn't exceed 32k tokens. When the federation fans out
 * to N warehouses each returning M snippets, the aggregate easily exceeds
 * the budget. We trim lowest-relevance snippets first.
 */

import type { CitedSnippet } from "./envelope.js";

export const DEFAULT_TOKEN_BUDGET = 32_000;

export interface TrimResult {
  readonly kept: ReadonlyArray<CitedSnippet>;
  readonly trimmed: ReadonlyArray<CitedSnippet>;
  readonly totalTokensKept: number;
  readonly budget: number;
}

/**
 * Trim snippets so their combined token count fits within the budget.
 * Lowest-relevance snippets are dropped first.
 */
export function trimToBudget(
  snippets: ReadonlyArray<CitedSnippet>,
  budget = DEFAULT_TOKEN_BUDGET,
): TrimResult {
  // Sort copy by relevance desc (preserves caller's array)
  const sorted = [...snippets].sort((a, b) => b.relevance - a.relevance);
  const kept: CitedSnippet[] = [];
  const trimmed: CitedSnippet[] = [];
  let total = 0;
  for (const s of sorted) {
    if (total + s.tokens <= budget) {
      kept.push(s);
      total += s.tokens;
    } else {
      trimmed.push(s);
    }
  }
  return {
    kept,
    trimmed,
    totalTokensKept: total,
    budget,
  };
}

/**
 * Rough token-count estimate for arbitrary text.
 * Heuristic: 1 token ≈ 4 chars for English. For perfect accuracy we'd use a
 * model-specific tokenizer; this estimate is sufficient for budget enforcement.
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
