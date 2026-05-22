/**
 * Primitive atoms imported by every other schema in @nexural/schema.
 *
 * Changing a primitive is a major version bump per SCHEMA_CHARTER §5.
 */

import { z } from "zod";

/** ISO 8601 timestamp with timezone offset. */
export const Iso8601 = z.string().datetime({ offset: true });

/** ISO 8601 date (YYYY-MM-DD). */
export const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "must be YYYY-MM-DD");

/** ULID — Crockford base32, 26 chars. */
export const Ulid = z
  .string()
  .regex(/^[0-9A-HJKMNP-TV-Z]{26}$/, "must be a valid ULID (26 chars, Crockford base32)");

/** Kebab-case slug — lowercase alphanumeric with single-hyphen separators. */
export const KebabSlug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be kebab-case (lowercase, hyphens)");

/** Warehouse trust tiers (per ARCHITECTURE.md §6, THREAT_MODEL §1). */
export const TrustTier = z.enum(["public", "internal", "private-encrypted"]);
export type TrustTier = z.infer<typeof TrustTier>;

/** Warehouse lifecycle status (per RETIREMENT.md §1). */
export const WarehouseStatus = z.enum(["active", "seeded", "archived", "deprecated", "merged"]);
export type WarehouseStatus = z.infer<typeof WarehouseStatus>;

/** Schema version — currently a single integer literal. Bumps require migration codemod (SCHEMA_CHARTER §6). */
export const SchemaVersion = z.literal(1);
export type SchemaVersion = z.infer<typeof SchemaVersion>;

/** Strict semver string per https://semver.org */
export const SemverString = z
  .string()
  .regex(
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/,
    "must be valid semver (MAJOR.MINOR.PATCH[-pre][+build])",
  );

/** GitHub repo URL — pinned to github.com (per NAMING.md). */
export const RepoUrl = z
  .string()
  .url()
  .regex(/^https:\/\/github\.com\//, "must be https://github.com/...");

/** RFC 5322 email. */
export const Email = z.string().email();

/** Decay rate in days (1 = daily, 7 = weekly, 90 = quarterly, 365 = yearly, 3650 = decadal). */
export const DecayDays = z.number().int().positive().max(3650, "decay > 10 years not allowed");

/** Federation identifier (per ADR-0003). */
export const Federation = z.enum(["factory", "lifeops"]);
export type Federation = z.infer<typeof Federation>;

/** Git SHA — short (7+) or full (40 or 64 for sha256). */
export const GitSha = z
  .string()
  .regex(/^[a-f0-9]{7,64}$/, "must be a 7-64 char lowercase hex git SHA");

/** SHA-256 hex string (64 chars). */
export const Sha256Hex = z.string().regex(/^[a-f0-9]{64}$/, "must be 64-char lowercase hex sha256");

/** 1Password CLI URI (`op://VaultName/ItemName/field`). */
export const OpUri = z.string().regex(/^op:\/\//, "must start with op:// (1Password CLI URI)");

/** Environment variable identifier (SCREAMING_SNAKE_CASE, valid POSIX). */
export const EnvVarName = z.string().regex(/^[A-Z_][A-Z0-9_]*$/, "must be SCREAMING_SNAKE_CASE");

/** USD amount (non-negative for projections, positive for caps). */
export const UsdAmount = z.number().nonnegative();
export const PositiveUsdAmount = z.number().positive();
