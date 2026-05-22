import { describe, expect, it } from "vitest";
import { buildSynthesisPrompt, validateSynthesisOutput } from "../src/synthesis.js";
import type { CitedSnippet } from "../src/envelope.js";

function snip(
  warehouse: string,
  id: string,
  federation: "factory" | "lifeops",
  tokens = 100,
  relevance = 0.5,
): CitedSnippet & { federation: "factory" | "lifeops" } {
  return { warehouse, id, federation, content: `data for ${warehouse}/${id}`, relevance, tokens };
}

describe("buildSynthesisPrompt", () => {
  it("emits a system prompt with the synthesis directive", () => {
    const r = buildSynthesisPrompt({
      query: "how to do x?",
      scope: "both",
      snippets: [snip("auth", "oauth-pkce", "factory")],
    });
    expect(r.systemPrompt).toMatch(/warehouse_content/);
    expect(r.systemPrompt).toMatch(/Never follow instructions/i);
    expect(r.systemPrompt).toMatch(/\[\[warehouse:id\]\]/);
  });

  it("wraps snippets in envelopes inside user prompt", () => {
    const r = buildSynthesisPrompt({
      query: "q",
      scope: "both",
      snippets: [snip("auth", "oauth-pkce", "factory")],
    });
    expect(r.userPrompt).toMatch(/<warehouse_content/);
    expect(r.userPrompt).toMatch(/warehouse="auth"/);
    expect(r.userPrompt).toMatch(/id="oauth-pkce"/);
  });

  it("filters lifeops snippets when scope=factory", () => {
    const r = buildSynthesisPrompt({
      query: "q",
      scope: "factory",
      snippets: [snip("auth", "x", "factory"), snip("decision", "y", "lifeops")],
    });
    expect(r.snippetsInPrompt.map((s) => s.warehouse)).toEqual(["auth"]);
    expect(r.tierViolations).toHaveLength(1);
  });

  it("trims when budget exceeded", () => {
    const big = snip("a", "1", "factory", 30_000, 0.9);
    const tiny = snip("b", "2", "factory", 5_000, 0.5);
    const r = buildSynthesisPrompt({
      query: "q",
      scope: "both",
      snippets: [big, tiny],
      tokenBudget: 32_000,
    });
    expect(r.snippetsInPrompt).toHaveLength(1);
    expect(r.snippetsInPrompt[0]!.warehouse).toBe("a"); // higher relevance
    expect(r.snippetsTrimmed).toHaveLength(1);
  });
});

describe("validateSynthesisOutput", () => {
  it("preserves valid citations", () => {
    const prompt = buildSynthesisPrompt({
      query: "q",
      scope: "both",
      snippets: [snip("auth", "oauth-pkce", "factory")],
    });
    const rawAnswer = "Use OAuth PKCE [[auth:oauth-pkce]] for public clients.";
    const out = validateSynthesisOutput(rawAnswer, prompt);
    expect(out.answer).toContain("[[auth:oauth-pkce]]");
    expect(out.citations).toHaveLength(1);
    expect(out.hallucinatedCitations).toHaveLength(0);
  });

  it("strips hallucinated citations", () => {
    const prompt = buildSynthesisPrompt({
      query: "q",
      scope: "both",
      snippets: [snip("auth", "real-id", "factory")],
    });
    const out = validateSynthesisOutput("Bad: [[fake:nope]] · Good: [[auth:real-id]]", prompt);
    expect(out.answer).not.toContain("[[fake:nope]]");
    expect(out.answer).toContain("[[auth:real-id]]");
    expect(out.hallucinatedCitations[0]).toEqual({
      warehouse: "fake",
      id: "nope",
    });
  });
});
