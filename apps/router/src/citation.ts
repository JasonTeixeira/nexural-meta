/**
 * Citation validation per ADR-0008 §1.
 *
 * After the LLM produces synthesis output, walk the response for citation
 * tokens and validate that each one references a real snippet we actually
 * sent in. Hallucinated citations are STRIPPED and flagged.
 */

import type { CitedSnippet } from "./envelope.js";

export interface Citation {
  readonly warehouse: string;
  readonly id: string;
}

export interface ValidationResult {
  readonly cleanedText: string;
  readonly validCitations: ReadonlyArray<Citation>;
  readonly strippedCitations: ReadonlyArray<Citation>;
}

const CITATION_RE = /\[\[([a-z0-9-]+):([0-9A-HJKMNP-TV-Za-z-]+)\]\]/g;

/**
 * Validate citations in `text` against the set of snippets we returned to the LLM.
 *
 * The expected citation format is `[[warehouse:id]]`.
 * (Synthesis prompt MUST instruct the LLM to use this format; per ADR-0008.)
 */
export function validateCitations(
  text: string,
  providedSnippets: ReadonlyArray<CitedSnippet>,
): ValidationResult {
  const allowed = new Set<string>();
  for (const s of providedSnippets) allowed.add(`${s.warehouse}::${s.id}`);

  const validCitations: Citation[] = [];
  const strippedCitations: Citation[] = [];

  const cleaned = text.replace(CITATION_RE, (match, wh, id) => {
    const key = `${wh}::${id}`;
    if (allowed.has(key)) {
      validCitations.push({ warehouse: wh as string, id: id as string });
      return match; // keep
    }
    strippedCitations.push({ warehouse: wh as string, id: id as string });
    return ""; // strip
  });

  // Deduplicate
  const seen = new Set<string>();
  const dedupedValid = validCitations.filter((c) => {
    const k = `${c.warehouse}::${c.id}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  return {
    cleanedText: cleaned,
    validCitations: dedupedValid,
    strippedCitations,
  };
}
