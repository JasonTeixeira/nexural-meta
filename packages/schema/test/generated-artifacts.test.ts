/**
 * Generated-artifact schemas — index-file, scorecard, registry, cross-refs, decay, adr.
 *
 * These are smaller schemas — consolidated into one test file.
 */

import { describe, expect, it } from "vitest";
import { AdrFrontmatter } from "../src/adr.js";
import { CrossRefReport } from "../src/cross-refs.js";
import { DecayConfig } from "../src/decay.js";
import { WarehouseIndex } from "../src/index-file.js";
import { Registry } from "../src/registry.js";
import { ScorecardReport } from "../src/scorecard.js";
import { NexuralError, NexuralErrorCode } from "../src/errors.js";

describe("WarehouseIndex", () => {
  const valid = {
    schema_version: 1 as const,
    warehouse: "auth",
    generated_at: "2026-05-22T03:49:21Z",
    generator_version: "1.0.0",
    count: 1,
    entries: [
      {
        id: "oauth-pkce-pattern",
        path: "content/oauth-pkce-pattern/body.md",
        title: "OAuth PKCE",
        tags: ["oauth"],
        updated: "2026-06-01",
        last_reviewed: "2026-06-01",
        source_type: "playbook" as const,
      },
    ],
    health: { decayed_entries: 0, draft_entries: 0, scorecard: 92 },
  };
  it("accepts valid", () => expect(() => WarehouseIndex.parse(valid)).not.toThrow());
  it("rejects scorecard > 100", () =>
    expect(() =>
      WarehouseIndex.parse({ ...valid, health: { ...valid.health, scorecard: 101 } }),
    ).toThrow());
  it("rejects negative count", () =>
    expect(() => WarehouseIndex.parse({ ...valid, count: -1 })).toThrow());
  it("rejects extra keys", () =>
    expect(() => WarehouseIndex.parse({ ...valid, foo: 1 })).toThrow());
  it("rejects malformed generator_version", () =>
    expect(() => WarehouseIndex.parse({ ...valid, generator_version: "v1.0" })).toThrow());
  it("rejects unknown source_type in entry", () =>
    expect(() =>
      WarehouseIndex.parse({
        ...valid,
        entries: [{ ...valid.entries[0]!, source_type: "tutorial" }],
      }),
    ).toThrow());
});

describe("ScorecardReport", () => {
  const valid = {
    schema_version: 1 as const,
    generated_at: "2026-05-22T03:49:21Z",
    warehouses: [
      {
        name: "auth",
        federation: "factory" as const,
        score: 95,
        grade: "S" as const,
        findings: [],
      },
    ],
    aggregate: {
      mean_score: 95,
      median_score: 95,
      below_80_count: 0,
      below_90_count: 0,
    },
  };
  it("accepts valid", () => expect(() => ScorecardReport.parse(valid)).not.toThrow());
  it("rejects score > 100", () =>
    expect(() =>
      ScorecardReport.parse({
        ...valid,
        warehouses: [{ ...valid.warehouses[0]!, score: 101 }],
      }),
    ).toThrow());
  it("rejects unknown grade", () =>
    expect(() =>
      ScorecardReport.parse({
        ...valid,
        warehouses: [{ ...valid.warehouses[0]!, grade: "G" as never }],
      }),
    ).toThrow());
  it("rejects unknown severity in finding", () =>
    expect(() =>
      ScorecardReport.parse({
        ...valid,
        warehouses: [
          {
            ...valid.warehouses[0]!,
            findings: [{ category: "c", severity: "fatal" as never, message: "m" }],
          },
        ],
      }),
    ).toThrow());
  it("rejects extra keys", () =>
    expect(() => ScorecardReport.parse({ ...valid, foo: 1 })).toThrow());
  it("rejects unknown federation", () =>
    expect(() =>
      ScorecardReport.parse({
        ...valid,
        warehouses: [{ ...valid.warehouses[0]!, federation: "apps" as never }],
      }),
    ).toThrow());
});

describe("Registry", () => {
  const valid = {
    schema_version: 1 as const,
    federation: "factory" as const,
    generated_at: "2026-05-22T03:49:21Z",
    warehouses: [
      {
        name: "auth",
        tier: "internal" as const,
        status: "active" as const,
        repo: "https://github.com/JasonTeixeira/auth-warehouse",
        last_reviewed: "2026-06-01",
        decay_rate_days: 90,
        discovered_via: "github-topic" as const,
      },
    ],
  };
  it("accepts valid", () => expect(() => Registry.parse(valid)).not.toThrow());
  it("rejects unknown discovered_via", () =>
    expect(() =>
      Registry.parse({
        ...valid,
        warehouses: [{ ...valid.warehouses[0]!, discovered_via: "magic" as never }],
      }),
    ).toThrow());
  it("rejects non-github repo", () =>
    expect(() =>
      Registry.parse({
        ...valid,
        warehouses: [{ ...valid.warehouses[0]!, repo: "https://gitlab.com/x/y" }],
      }),
    ).toThrow());
  it("rejects extra keys", () => expect(() => Registry.parse({ ...valid, foo: 1 })).toThrow());
  it("rejects unknown federation", () =>
    expect(() => Registry.parse({ ...valid, federation: "apps" as never })).toThrow());
  it("rejects unknown status", () =>
    expect(() =>
      Registry.parse({
        ...valid,
        warehouses: [{ ...valid.warehouses[0]!, status: "wip" as never }],
      }),
    ).toThrow());
});

describe("CrossRefReport", () => {
  const valid = {
    schema_version: 1 as const,
    generated_at: "2026-05-22T03:49:21Z",
    links: [
      {
        from_warehouse: "auth",
        from_id: "oauth-pkce",
        to_warehouse: "security",
        to_id: "csrf-pattern",
        relation: "informs",
        valid: true,
      },
    ],
    summary: { total: 1, broken: 0, orphan_warehouses: [] },
  };
  it("accepts valid", () => expect(() => CrossRefReport.parse(valid)).not.toThrow());
  it("rejects negative broken count", () =>
    expect(() =>
      CrossRefReport.parse({
        ...valid,
        summary: { ...valid.summary, broken: -1 },
      }),
    ).toThrow());
  it("rejects non-bool valid", () =>
    expect(() =>
      CrossRefReport.parse({
        ...valid,
        links: [{ ...valid.links[0]!, valid: "yes" as never }],
      }),
    ).toThrow());
  it("rejects extra keys", () =>
    expect(() => CrossRefReport.parse({ ...valid, foo: 1 })).toThrow());
  it("rejects non-kebab from_warehouse", () =>
    expect(() =>
      CrossRefReport.parse({
        ...valid,
        links: [{ ...valid.links[0]!, from_warehouse: "Auth" }],
      }),
    ).toThrow());
  it("rejects malformed orphan slug", () =>
    expect(() =>
      CrossRefReport.parse({
        ...valid,
        summary: { ...valid.summary, orphan_warehouses: ["Auth"] },
      }),
    ).toThrow());
});

describe("DecayConfig", () => {
  it("accepts minimal", () => expect(() => DecayConfig.parse({ schema_version: 1 })).not.toThrow());
  it("accepts with default_days + overrides", () =>
    expect(() =>
      DecayConfig.parse({
        schema_version: 1,
        default_days: 30,
        overrides: [{ match: { tag: "experimental" }, decay_days: 14 }],
      }),
    ).not.toThrow());
  it("rejects decay_days = 0", () =>
    expect(() =>
      DecayConfig.parse({
        schema_version: 1,
        overrides: [{ match: { tag: "a" }, decay_days: 0 }],
      }),
    ).toThrow());
  it("rejects extra keys in match", () =>
    expect(() =>
      DecayConfig.parse({
        schema_version: 1,
        overrides: [{ match: { unknown: "x" }, decay_days: 30 }],
      }),
    ).toThrow());
  it("rejects extra keys at top level", () =>
    expect(() => DecayConfig.parse({ schema_version: 1, foo: 1 })).toThrow());
  it("rejects negative default_days", () =>
    expect(() => DecayConfig.parse({ schema_version: 1, default_days: -1 })).toThrow());
});

describe("AdrFrontmatter", () => {
  const valid = {
    number: 9,
    title: "Tier 1 Gap Closures",
    status: "proposed" as const,
    date: "2026-05-21",
    deciders: ["Sage"],
    soak_until: "2026-05-28",
  };
  it("accepts valid", () => expect(() => AdrFrontmatter.parse(valid)).not.toThrow());
  it("rejects 0 number", () =>
    expect(() => AdrFrontmatter.parse({ ...valid, number: 0 })).toThrow());
  it("rejects negative number", () =>
    expect(() => AdrFrontmatter.parse({ ...valid, number: -1 })).toThrow());
  it("rejects too-short title", () =>
    expect(() => AdrFrontmatter.parse({ ...valid, title: "ABC" })).toThrow());
  it("rejects too-long title", () =>
    expect(() => AdrFrontmatter.parse({ ...valid, title: "x".repeat(121) })).toThrow());
  it("rejects empty deciders", () =>
    expect(() => AdrFrontmatter.parse({ ...valid, deciders: [] })).toThrow());
  it("rejects unknown status", () =>
    expect(() => AdrFrontmatter.parse({ ...valid, status: "draft" as never })).toThrow());
});

describe("NexuralError", () => {
  it("accepts known code", () => {
    const codes = NexuralErrorCode.options;
    for (const code of codes) {
      expect(() =>
        NexuralError.parse({ code, message: "x".repeat(5), retryable: false }),
      ).not.toThrow();
    }
  });
  it("rejects unknown code", () =>
    expect(() =>
      NexuralError.parse({
        code: "totally_unknown",
        message: "x",
        retryable: false,
      }),
    ).toThrow());
  it("rejects empty message", () =>
    expect(() =>
      NexuralError.parse({
        code: "schema_validation_failed",
        message: "",
        retryable: false,
      }),
    ).toThrow());
  it("rejects non-bool retryable", () =>
    expect(() =>
      NexuralError.parse({
        code: "schema_validation_failed",
        message: "m",
        retryable: 1 as never,
      }),
    ).toThrow());
  it("accepts details", () =>
    expect(() =>
      NexuralError.parse({
        code: "cost_cap_exceeded",
        message: "over",
        retryable: false,
        details: { projected: 1.5 },
      }),
    ).not.toThrow());
});
