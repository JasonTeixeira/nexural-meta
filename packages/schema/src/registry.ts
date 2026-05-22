/**
 * Registry — generated per-federation artifact. Two files exist per ADR-0003:
 *   - registry-factory.yaml
 *   - registry-lifeops.yaml
 *
 * Generated nightly by `scripts/discover.mjs`. NEVER hand-edited.
 */

import { z } from "zod";
import {
  DecayDays,
  Federation,
  IsoDate,
  Iso8601,
  KebabSlug,
  RepoUrl,
  SchemaVersion,
  TrustTier,
  WarehouseStatus,
} from "./primitives.js";

const RegistryEntry = z
  .object({
    name: KebabSlug,
    tier: TrustTier,
    status: WarehouseStatus,
    repo: RepoUrl,
    last_reviewed: IsoDate,
    decay_rate_days: DecayDays,
    discovered_via: z.enum(["github-topic", "explicit-list", "manual-add"]),
  })
  .strict();

export const Registry = z
  .object({
    schema_version: SchemaVersion,
    federation: Federation,
    generated_at: Iso8601,
    warehouses: z.array(RegistryEntry),
  })
  .strict();

export type Registry = z.infer<typeof Registry>;
