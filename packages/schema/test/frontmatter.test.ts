import { describe, expect, it } from "vitest";
import { ContentFrontmatter } from "../src/frontmatter.js";

const valid = {
  schema_version: 1 as const,
  id: "oauth-pkce-pattern",
  title: "OAuth 2.0 PKCE Flow",
  summary: "When and how to implement PKCE for public OAuth clients.",
  tags: ["oauth", "auth", "security"],
  created: "2026-06-01",
  updated: "2026-06-01",
  last_reviewed: "2026-06-01",
  status: "active" as const,
  authors: ["sage@nexural"],
  source_type: "playbook" as const,
  visibility: { public_via_mcp: true, embedding_eligible: true },
};

describe("ContentFrontmatter", () => {
  it("accepts a valid frontmatter", () => {
    expect(() => ContentFrontmatter.parse(valid)).not.toThrow();
  });

  it("accepts a ULID id (private tier)", () => {
    expect(() =>
      ContentFrontmatter.parse({ ...valid, id: "01H8XK7Q3F9V7M5N0E3B4P2J6T" }),
    ).not.toThrow();
  });

  it("rejects too-short title (< 3 chars)", () =>
    expect(() => ContentFrontmatter.parse({ ...valid, title: "ab" })).toThrow());

  it("rejects too-long title (> 200 chars)", () =>
    expect(() => ContentFrontmatter.parse({ ...valid, title: "x".repeat(201) })).toThrow());

  it("rejects unknown source_type", () =>
    expect(() => ContentFrontmatter.parse({ ...valid, source_type: "tutorial" })).toThrow());

  it("rejects empty authors array", () =>
    expect(() => ContentFrontmatter.parse({ ...valid, authors: [] })).toThrow());

  it("rejects too many tags (> 20)", () => {
    const tags = Array.from({ length: 21 }, (_, i) => `t${i}`);
    expect(() => ContentFrontmatter.parse({ ...valid, tags })).toThrow();
  });

  it("rejects missing visibility", () => {
    const { visibility: _v, ...rest } = valid;
    expect(() => ContentFrontmatter.parse(rest)).toThrow();
  });

  it("rejects extra keys (strict)", () =>
    expect(() => ContentFrontmatter.parse({ ...valid, extra_field: true })).toThrow());

  it("accepts related links with valid relation", () => {
    expect(() =>
      ContentFrontmatter.parse({
        ...valid,
        related: [{ warehouse: "security", id: "csrf-pattern", relation: "informs" }],
      }),
    ).not.toThrow();
  });

  it("rejects related with invalid relation", () =>
    expect(() =>
      ContentFrontmatter.parse({
        ...valid,
        related: [{ warehouse: "x", id: "y", relation: "loosely-related" }],
      }),
    ).toThrow());
});
