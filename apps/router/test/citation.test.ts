import { describe, expect, it } from "vitest";
import { validateCitations } from "../src/citation.js";
import type { CitedSnippet } from "../src/envelope.js";

function snippet(warehouse: string, id: string, rest: Partial<CitedSnippet> = {}): CitedSnippet {
  return {
    warehouse,
    id,
    content: rest.content ?? `content for ${warehouse}/${id}`,
    relevance: rest.relevance ?? 0.5,
    tokens: rest.tokens ?? 10,
    ...(rest.sha !== undefined ? { sha: rest.sha } : {}),
  };
}

describe("validateCitations", () => {
  it("keeps valid citations", () => {
    const text = "Use OAuth PKCE [[auth:oauth-pkce-pattern]].";
    const snippets = [snippet("auth", "oauth-pkce-pattern")];
    const r = validateCitations(text, snippets);
    expect(r.validCitations).toHaveLength(1);
    expect(r.strippedCitations).toHaveLength(0);
    expect(r.cleanedText).toBe(text);
  });

  it("strips hallucinated citations", () => {
    const text = "Use OAuth PKCE [[auth:doesnt-exist]] for security [[security:csrf]].";
    const snippets = [snippet("auth", "oauth-pkce-pattern")];
    const r = validateCitations(text, snippets);
    expect(r.validCitations).toHaveLength(0);
    expect(r.strippedCitations).toHaveLength(2);
    expect(r.cleanedText).not.toContain("[[auth:doesnt-exist]]");
    expect(r.cleanedText).not.toContain("[[security:csrf]]");
  });

  it("returns mixed valid + stripped", () => {
    const text = "[[auth:oauth-pkce]] and [[ghost:notreal]] together.";
    const snippets = [snippet("auth", "oauth-pkce")];
    const r = validateCitations(text, snippets);
    expect(r.validCitations).toHaveLength(1);
    expect(r.strippedCitations).toHaveLength(1);
    expect(r.cleanedText).toContain("[[auth:oauth-pkce]]");
    expect(r.cleanedText).not.toContain("[[ghost:notreal]]");
  });

  it("dedupes repeated valid citations", () => {
    const text = "[[auth:x]] [[auth:x]] [[auth:x]]";
    const snippets = [snippet("auth", "x")];
    const r = validateCitations(text, snippets);
    expect(r.validCitations).toHaveLength(1);
  });

  it("handles ULID-style ids", () => {
    const text = "See [[decision:01H8XK7Q3F9V7M5N0E3B4P2J6T]] for context.";
    const snippets = [snippet("decision", "01H8XK7Q3F9V7M5N0E3B4P2J6T")];
    const r = validateCitations(text, snippets);
    expect(r.validCitations).toHaveLength(1);
  });

  it("leaves text without citations untouched", () => {
    const text = "Plain text with no citations.";
    const r = validateCitations(text, []);
    expect(r.cleanedText).toBe(text);
    expect(r.validCitations).toHaveLength(0);
    expect(r.strippedCitations).toHaveLength(0);
  });
});
