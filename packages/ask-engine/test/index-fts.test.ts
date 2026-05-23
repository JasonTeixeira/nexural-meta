import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { AskIndex } from "../src/index-fts.js";
import type { CollectedDoc } from "../src/collector.js";

const sampleDocs: CollectedDoc[] = [
  {
    path: "docs/adr/0007-cost-guardrails.md",
    kind: "adr",
    title: "Cost guardrails + model deprecation",
    body: "Every LLM call is wrapped by @nexural/sdk.llmClient with per-request and per-day caps. Streaming abort is mandatory.",
    source: "adr:0007",
  },
  {
    path: "warehouses/auth/documents/supabase-ssr.md",
    kind: "warehouse-doc",
    title: "Supabase Auth + SSR",
    body: "Forged apps use @supabase/ssr for cookie-based session management across server components, route handlers, and middleware.",
    source: "warehouse:auth:supabase-ssr",
  },
  {
    path: "warehouses/database/documents/rls-pattern.md",
    kind: "warehouse-doc",
    title: "Postgres RLS pattern for multi-tenancy",
    body: "Every multi-tenant table has RLS enabled. Membership lookup via tenant_memberships. Service-role connections must set role authenticated.",
    source: "warehouse:database:rls-pattern",
  },
  {
    path: "recipes/fintech-ledger-app/DECISIONS.md",
    kind: "recipe-doc",
    title: "Fintech ledger decisions",
    body: "Double-entry bookkeeping. Storage as bigint at decimal precision. Append-only via DB triggers. 7 year retention.",
    source: "recipe:fintech-ledger-app:decisions",
  },
];

let index: AskIndex;
beforeEach(() => {
  index = new AskIndex(sampleDocs);
});
afterEach(() => {
  index.close();
});

describe("AskIndex", () => {
  it("indexes the docs and reports size", () => {
    expect(index.size).toBe(4);
  });

  it("finds RLS pattern when asked about tenant isolation", () => {
    const hits = index.search("tenant isolation RLS");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0]?.source).toBe("warehouse:database:rls-pattern");
  });

  it("finds cost ADR when asked about LLM cost discipline", () => {
    const hits = index.search("cost cap LLM streaming");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0]?.source).toBe("adr:0007");
  });

  it("filters by kind", () => {
    const all = index.search("decisions retention", { limit: 10 });
    const adrsOnly = index.search("decisions retention", { kinds: ["adr"], limit: 10 });
    expect(all.length).toBeGreaterThan(adrsOnly.length);
    expect(adrsOnly.every((h) => h.kind === "adr")).toBe(true);
  });

  it("returns empty for blank query", () => {
    expect(index.search("")).toEqual([]);
    expect(index.search("   ")).toEqual([]);
  });

  it("returns empty for query with no matches", () => {
    expect(index.search("nonexistent-term-xyz-pdq")).toEqual([]);
  });

  it("includes a snippet with [[…]] highlighting", () => {
    const hits = index.search("ledger bigint");
    expect(hits[0]?.snippet).toBeDefined();
    expect(hits[0]?.snippet).toMatch(/\[\[/);
  });

  it("respects limit option", () => {
    const hits = index.search("tenant role middleware ssr", { limit: 2 });
    expect(hits.length).toBeLessThanOrEqual(2);
  });

  it("is robust against FTS5 special characters in query", () => {
    // Quotes + slashes shouldn't crash the parser
    expect(() => index.search(`"tenant" / membership`)).not.toThrow();
  });

  it("ranks by relevance — scores monotonically decrease", () => {
    // Match multiple docs to verify ordering.
    const hits = index.search("table role tenant LLM");
    expect(hits.length).toBeGreaterThanOrEqual(1);
    for (let i = 1; i < hits.length; i++) {
      expect(hits[i]!.score).toBeLessThanOrEqual(hits[i - 1]!.score);
    }
  });
});
