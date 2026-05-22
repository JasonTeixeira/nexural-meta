/**
 * Prompt-injection envelope wrapping per ADR-0008 §1.
 *
 * Re-exports + extends the warehouse-level helpers from @nexural/mcp-base
 * with router-specific bulk-wrapping for multi-warehouse synthesis prompts.
 */

import { SYNTHESIS_DIRECTIVE, wrapInEnvelope } from "@nexural/mcp-base";

export { SYNTHESIS_DIRECTIVE, wrapInEnvelope };

export interface CitedSnippet {
  readonly warehouse: string;
  readonly id: string;
  readonly content: string;
  readonly sha?: string;
  /** Relevance score in [0, 1]; higher = more relevant. */
  readonly relevance: number;
  /** Approximate token count for this snippet. */
  readonly tokens: number;
}

/**
 * Bulk-wrap an array of snippets into a single newline-separated block
 * of <warehouse_content> envelopes.
 *
 * Drives the synthesis prompt's data section.
 */
export function buildSynthesisDataBlock(snippets: ReadonlyArray<CitedSnippet>): string {
  return snippets
    .map((s) =>
      wrapInEnvelope(s.content, {
        warehouse: s.warehouse,
        id: s.id,
        ...(s.sha ? { sha: s.sha } : {}),
      }),
    )
    .join("\n\n");
}
