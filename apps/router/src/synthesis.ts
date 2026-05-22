/**
 * Synthesis pipeline — assembles the LLM prompt from MCP responses + applies
 * all router middleware in order.
 *
 * Pipeline (per ARCHITECTURE §5.1):
 *   1. Tier confinement filter (per ADR-0009 §1.9)
 *   2. Token-budget trim (per ADR-0010 §2.5)
 *   3. <warehouse_content> envelope wrapping (per ADR-0008 §1)
 *   4. Synthesis system prompt with isolation directive
 *   5. LLM call (via @nexural/sdk.llmClient — cost-wrapped)
 *   6. Citation validation (per ADR-0008 §1) — strip hallucinated citations
 */

import { buildSynthesisDataBlock, SYNTHESIS_DIRECTIVE, type CitedSnippet } from "./envelope.js";
import { trimToBudget } from "./token-budget.js";
import { enforceTierConfinement, type QueryScope } from "./tier-confinement.js";
import { validateCitations, type Citation } from "./citation.js";

export interface SynthesisInput {
  readonly query: string;
  readonly scope: QueryScope;
  readonly snippets: ReadonlyArray<CitedSnippet & { federation: "factory" | "lifeops" }>;
  readonly tokenBudget?: number;
}

export interface SynthesisPrompt {
  readonly systemPrompt: string;
  readonly userPrompt: string;
  readonly snippetsInPrompt: ReadonlyArray<CitedSnippet>;
  readonly snippetsTrimmed: ReadonlyArray<CitedSnippet>;
  readonly tierViolations: ReadonlyArray<{ snippet: CitedSnippet; reason: string }>;
}

export interface SynthesisOutput {
  readonly answer: string;
  readonly citations: ReadonlyArray<Citation>;
  readonly hallucinatedCitations: ReadonlyArray<Citation>;
}

/**
 * Build the synthesis prompt (steps 1-3 of the pipeline).
 * Pure function — no LLM call yet.
 */
export function buildSynthesisPrompt(input: SynthesisInput): SynthesisPrompt {
  // 1. Tier confinement
  const { passed, violations } = enforceTierConfinement(input.snippets, input.scope);

  // 2. Token-budget trim
  const { kept, trimmed } = trimToBudget(passed, input.tokenBudget);

  // 3. Envelope wrapping
  const dataBlock = buildSynthesisDataBlock(kept);

  const systemPrompt = [
    SYNTHESIS_DIRECTIVE,
    "",
    "When citing data from inside the tags, use the exact format `[[warehouse:id]]`",
    "where `warehouse` and `id` match the attributes on the surrounding tag.",
    "Citations MUST reference IDs that appear in the data block. Do not invent IDs.",
  ].join("\n");

  const userPrompt = [
    `<query>${input.query}</query>`,
    "",
    "<data>",
    dataBlock,
    "</data>",
    "",
    "Answer the query using only the data above. Cite every claim with `[[warehouse:id]]`.",
  ].join("\n");

  return {
    systemPrompt,
    userPrompt,
    snippetsInPrompt: kept,
    snippetsTrimmed: trimmed,
    tierViolations: violations,
  };
}

/**
 * Validate + clean the LLM response (step 6 of the pipeline).
 * Pure function — no LLM call.
 */
export function validateSynthesisOutput(
  rawAnswer: string,
  prompt: SynthesisPrompt,
): SynthesisOutput {
  const { cleanedText, validCitations, strippedCitations } = validateCitations(
    rawAnswer,
    prompt.snippetsInPrompt,
  );
  return {
    answer: cleanedText.trim(),
    citations: validCitations,
    hallucinatedCitations: strippedCitations,
  };
}
