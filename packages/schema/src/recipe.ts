/**
 * Recipe family — RecipeManifest, ForgedLockfile, CostEnvelope, ServiceDeclaration.
 *
 * Canonical reference: docs/SCHEMA_AMENDMENTS.md.
 * Source ADRs: 0002 (factory), 0004 (polyglot), 0006 (lockfile/signing/license),
 * 0007 (cost envelope), 0008 (per-recipe docs), 0009 (forge sandbox).
 */

import { z } from "zod";
import {
  EnvVarName,
  GitSha,
  Iso8601,
  KebabSlug,
  OpUri,
  PositiveUsdAmount,
  SchemaVersion,
  SemverString,
  Sha256Hex,
  UsdAmount,
} from "./primitives.js";

// ── ServiceDeclaration (per ADR-0004) ────────────────────────────────────────

const NextjsService = z
  .object({
    id: KebabSlug,
    runtime: z.literal("nextjs"),
    language: z.literal("typescript"),
    host: z.enum(["vercel", "cloudflare-pages"]),
  })
  .strict();

const ModalService = z
  .object({
    id: KebabSlug,
    runtime: z.literal("modal"),
    language: z.literal("python"),
    python_version: z.enum(["3.11", "3.12"]),
    deps: z.string(),
    host: z.literal("modal"),
    contract: z.string(),
    gpu: z.enum(["none", "t4", "a10g", "a100"]).default("none"),
  })
  .strict();

const RailwayService = z
  .object({
    id: KebabSlug,
    runtime: z.literal("railway"),
    language: z.enum(["python", "node"]),
    deps: z.string(),
    host: z.literal("railway"),
    contract: z.string(),
  })
  .strict();

const CloudflareWorkerService = z
  .object({
    id: KebabSlug,
    runtime: z.literal("cloudflare-worker"),
    language: z.literal("typescript"),
    host: z.literal("cloudflare"),
    contract: z.string().optional(),
  })
  .strict();

export const ServiceDeclaration = z.discriminatedUnion("runtime", [
  NextjsService,
  ModalService,
  RailwayService,
  CloudflareWorkerService,
]);
export type ServiceDeclaration = z.infer<typeof ServiceDeclaration>;

// ── CostEnvelope (per ADR-0007) ──────────────────────────────────────────────

export const CostEnvelope = z
  .object({
    per_request_p50_usd: UsdAmount,
    per_request_p99_usd: UsdAmount,
    monthly_baseline_usd: UsdAmount,
    hard_caps: z
      .object({
        per_request_usd: PositiveUsdAmount,
        per_user_per_day_usd: PositiveUsdAmount,
        per_app_per_day_usd: PositiveUsdAmount,
      })
      .strict(),
  })
  .strict();
export type CostEnvelope = z.infer<typeof CostEnvelope>;

// ── Secret declaration (per ADR-0006) ────────────────────────────────────────

const SecretDeclaration = z
  .object({
    logical_name: KebabSlug,
    op_path: OpUri,
    target_file: z.string(),
    target_var: EnvVarName,
  })
  .strict();

// ── Forge sandbox (per ADR-0009) ─────────────────────────────────────────────

const ForgeSandbox = z
  .object({
    ignore_scripts: z.boolean().default(true),
    allowed_postinstalls: z.array(z.string()).default([]),
  })
  .strict()
  .default({ ignore_scripts: true, allowed_postinstalls: [] });

// ── RecipeManifest ───────────────────────────────────────────────────────────

const EmitConfig = z
  .object({
    template_path: z.string(),
    pre_emit_hooks: z.array(z.string()).default([]),
    post_emit_hooks: z.array(z.string()).default([]),
  })
  .strict();

export const RecipeManifest = z
  .object({
    schema_version: SchemaVersion,
    name: KebabSlug,
    version: SemverString,
    description: z.string().min(20).max(500),

    // Inheritance / composition
    extends: KebabSlug.optional(),
    composes: z.array(KebabSlug).default([]),

    // Inputs
    inputs_schema: z.string(),

    // References
    warehouses: z.array(KebabSlug).min(1),
    services: z.array(ServiceDeclaration).default([]),

    // QA
    qa_profile: z.enum(["fast", "standard", "thorough", "deep"]).default("standard"),

    // Cost discipline
    cost_envelope: CostEnvelope,
    model_families: z.array(z.string().regex(/^[a-z0-9-]+:[a-z0-9-]+$/)).default([]),

    // License composition (ADR-0006)
    output_license: z.enum(["MIT", "Apache-2.0", "ISC"]),
    commercial_restricted_ok: z.boolean().default(false),

    // Secrets
    secrets_required: z.array(SecretDeclaration).default([]),

    // Emit configuration
    emit: EmitConfig,

    // Per-recipe required docs (ADR-0008)
    threat_model_path: z.string(),
    decisions_path: z.string(),

    // Forge hygiene (ADR-0009)
    forge_sandbox: ForgeSandbox,
  })
  .strict()
  .refine((r) => r.services.length > 0 || r.warehouses.length > 0, {
    message: "recipe must declare at least one service or one warehouse",
  });
export type RecipeManifest = z.infer<typeof RecipeManifest>;

// ── ForgedLockfile (per ADR-0006) ────────────────────────────────────────────

const WarehouseConsumption = z
  .object({
    name: KebabSlug,
    sha: GitSha,
    version: SemverString.optional(),
  })
  .strict();

const RecipeReference = z
  .object({
    name: KebabSlug,
    version: SemverString,
    sha: GitSha,
    signature: z.string().min(1),
    provenance: z.string().url(),
  })
  .strict();

export const ForgedLockfile = z
  .object({
    schema_version: SchemaVersion,
    forged_at: Iso8601,
    forged_by_nx_version: SemverString,
    recipe: RecipeReference,
    warehouses_consumed: z.array(WarehouseConsumption).min(1),
    inputs: z.record(z.string(), z.unknown()),
    model_families_used: z.array(z.string()).default([]),
    sbom_hash: Sha256Hex,
  })
  .strict();
export type ForgedLockfile = z.infer<typeof ForgedLockfile>;
