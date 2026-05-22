/**
 * WarehouseMeta — the `meta.yaml` file at the root of every warehouse.
 *
 * Validated:
 *   - pre-commit via husky (warehouse-local `scripts/validate.mjs`)
 *   - CI on every warehouse PR
 *   - nightly via nexural-meta `scripts/verify-all.mjs`
 *
 * Per ARCHITECTURE.md §4.4 + ADR-0003 (federation field).
 */

import { z } from "zod";
import {
  DecayDays,
  Federation,
  IsoDate,
  KebabSlug,
  RepoUrl,
  SchemaVersion,
  TrustTier,
  WarehouseStatus,
} from "./primitives.js";

const TrustNone = z
  .object({
    encryption: z.literal("none"),
  })
  .strict();

const TrustAgeSops = z
  .object({
    encryption: z.literal("age+sops"),
    key_source: z.enum(["yubikey-primary", "yubikey-backup", "1password-emergency"]),
    recovery: z.string().min(1),
    filename_strategy: z.enum(["plaintext", "ulid"]),
  })
  .strict();

const Trust = z.discriminatedUnion("encryption", [TrustNone, TrustAgeSops]);

const Backup = z
  .object({
    destination: z.string().url(),
    cadence: z.enum(["realtime", "hourly", "nightly", "weekly"]),
    retention_days: z.number().int().positive(),
  })
  .strict();

const Mcp = z
  .object({
    tool_prefix: KebabSlug,
    exposes: z.array(KebabSlug).min(1),
  })
  .strict();

const CrossRefs = z
  .object({
    consumes_from: z.array(KebabSlug).default([]),
    exposed_to: z
      .object({
        public: z.boolean(),
        agents: z.boolean(),
        human: z.boolean(),
      })
      .strict(),
  })
  .strict();

const Metrics = z
  .object({
    target_entries: z.number().int().nonnegative().optional(),
    target_scorecard: z.number().int().min(0).max(100).optional(),
  })
  .strict();

const Links = z
  .object({
    repo: RepoUrl,
    docs: z.string().url().optional(),
  })
  .strict();

export const WarehouseMeta = z
  .object({
    schema_version: SchemaVersion,
    name: KebabSlug,
    tier: TrustTier,
    description: z.string().min(20).max(500),
    owner: z.string().min(1),
    created: IsoDate,
    last_reviewed: IsoDate,
    decay_rate_days: DecayDays,
    status: WarehouseStatus,
    merged_into: KebabSlug.optional(),

    /** Which federation this warehouse belongs to (per ADR-0003). */
    federation: Federation,

    trust: Trust,
    backup: Backup,
    mcp: Mcp,
    cross_refs: CrossRefs,
    metrics: Metrics.optional(),
    links: Links,
  })
  .strict()
  .refine((m) => m.status !== "merged" || !!m.merged_into, {
    message: "merged status requires merged_into target",
  })
  .refine((m) => m.tier !== "private-encrypted" || m.trust.encryption === "age+sops", {
    message: "private-encrypted tier requires age+sops encryption",
  })
  .refine((m) => m.tier === "public" || !m.cross_refs.exposed_to.public, {
    message: "non-public tier cannot have exposed_to.public = true",
  });

export type WarehouseMeta = z.infer<typeof WarehouseMeta>;
