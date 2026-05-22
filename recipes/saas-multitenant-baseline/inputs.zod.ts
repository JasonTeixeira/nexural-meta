/**
 * Inputs schema for `saas-multitenant-baseline`.
 *
 * `nx forge` validates user-supplied values against this before emission.
 * Defaults represent the locked opinions in DECISIONS.md.
 */

import { z } from "zod";

export const SaasMultitenantBaselineInputs = z
  .object({
    /** Branding */
    appName: z
      .string()
      .min(2)
      .max(50)
      .regex(/^[a-z0-9-]+$/, "kebab-case"),
    displayName: z.string().min(2).max(100),
    primaryColor: z
      .string()
      .regex(/^#[0-9a-fA-F]{6}$/)
      .default("#3b82f6"),

    /** Tenant model */
    tenantRouting: z.enum(["subdomain", "path"]).default("subdomain"),
    rootDomain: z.string().regex(/^[a-z0-9-]+\.[a-z]{2,}$/i, "TLD format e.g. myapp.com"),

    /** Billing */
    billingModel: z.enum(["seat", "metered", "seat+metered"]).default("seat+metered"),
    trialDays: z.number().int().min(0).max(60).default(14),
    requireCardOnTrial: z.boolean().default(false),

    /** Auth */
    oauthProviders: z
      .array(z.enum(["google", "github", "apple", "microsoft"]))
      .max(4)
      .default(["google"]),
    ssoEnabled: z.boolean().default(false),

    /** Localization */
    defaultLocale: z.enum(["en", "es", "fr", "de", "ja"]).default("en"),
    additionalLocales: z
      .array(z.enum(["es", "fr", "de", "ja", "pt", "it"]))
      .max(10)
      .default([]),

    /** Compliance + ops */
    auditRetentionYears: z.number().int().min(1).max(10).default(7),

    /** AI / LLM (opt-in per cost discipline) */
    llmEnabled: z.boolean().default(false),
  })
  .strict();

export type SaasMultitenantBaselineInputs = z.infer<typeof SaasMultitenantBaselineInputs>;
