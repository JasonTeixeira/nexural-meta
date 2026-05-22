/**
 * WarehouseMeta — happy path + ≥5 named invalid cases + 3 cross-field refinements.
 */

import { describe, expect, it } from "vitest";
import { WarehouseMeta } from "../src/meta.js";

const validInternalMeta = {
  schema_version: 1 as const,
  name: "auth",
  tier: "internal" as const,
  description: "Authentication patterns for SaaS apps in nexural-factory.",
  owner: "sage@nexural",
  created: "2026-06-01",
  last_reviewed: "2026-06-01",
  decay_rate_days: 90,
  status: "active" as const,
  federation: "factory" as const,
  trust: { encryption: "none" as const },
  backup: {
    destination: "b2://nexural-public-backup/auth/",
    cadence: "nightly" as const,
    retention_days: 365,
  },
  mcp: { tool_prefix: "auth", exposes: ["search", "get-pattern"] },
  cross_refs: {
    consumes_from: [],
    exposed_to: { public: false, agents: true, human: true },
  },
  links: { repo: "https://github.com/JasonTeixeira/auth-warehouse" },
};

describe("WarehouseMeta", () => {
  it("accepts a valid internal-tier meta", () => {
    expect(() => WarehouseMeta.parse(validInternalMeta)).not.toThrow();
  });

  it("accepts a private-encrypted tier with age+sops", () => {
    expect(() =>
      WarehouseMeta.parse({
        ...validInternalMeta,
        name: "decision",
        tier: "private-encrypted",
        federation: "lifeops",
        trust: {
          encryption: "age+sops",
          key_source: "yubikey-primary",
          recovery: "1Password Emergency Kit",
          filename_strategy: "ulid",
        },
      }),
    ).not.toThrow();
  });

  it("rejects missing required field (name)", () => {
    const { name: _n, ...rest } = validInternalMeta;
    expect(() => WarehouseMeta.parse(rest)).toThrow();
  });

  it("rejects unknown tier value", () => {
    expect(() => WarehouseMeta.parse({ ...validInternalMeta, tier: "secret" })).toThrow();
  });

  it("rejects too-short description (< 20 chars)", () => {
    expect(() => WarehouseMeta.parse({ ...validInternalMeta, description: "too short" })).toThrow();
  });

  it("rejects unknown federation", () => {
    expect(() =>
      WarehouseMeta.parse({ ...validInternalMeta, federation: "experimental" }),
    ).toThrow();
  });

  it("rejects extra unknown keys (strict mode)", () => {
    expect(() => WarehouseMeta.parse({ ...validInternalMeta, hidden_field: true })).toThrow();
  });

  it("rejects merged status without merged_into (cross-field refinement)", () => {
    expect(() => WarehouseMeta.parse({ ...validInternalMeta, status: "merged" })).toThrow();
  });

  it("rejects private-encrypted tier with encryption: none (cross-field refinement)", () => {
    expect(() =>
      WarehouseMeta.parse({
        ...validInternalMeta,
        tier: "private-encrypted",
        trust: { encryption: "none" },
      }),
    ).toThrow();
  });

  it("rejects non-public tier with exposed_to.public = true (cross-field refinement)", () => {
    expect(() =>
      WarehouseMeta.parse({
        ...validInternalMeta,
        cross_refs: {
          consumes_from: [],
          exposed_to: { public: true, agents: true, human: true },
        },
      }),
    ).toThrow();
  });

  it("accepts merged status when merged_into is provided", () => {
    expect(() =>
      WarehouseMeta.parse({
        ...validInternalMeta,
        status: "merged",
        merged_into: "newer-warehouse",
      }),
    ).not.toThrow();
  });
});
