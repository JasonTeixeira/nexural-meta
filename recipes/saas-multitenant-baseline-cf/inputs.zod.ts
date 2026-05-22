/**
 * Inputs schema for `saas-multitenant-baseline-cf`.
 * Mirrors the parent's inputs with Cloudflare-specific knobs.
 */

import { z } from "zod";

export const SaasMultitenantBaselineCfInputs = z
  .object({
    appName: z
      .string()
      .min(2)
      .max(50)
      .regex(/^[a-z0-9-]+$/),
    displayName: z.string().min(2).max(100),
    primaryColor: z
      .string()
      .regex(/^#[0-9a-fA-F]{6}$/)
      .default("#f97316"),
    tenantRouting: z.enum(["subdomain", "path"]).default("subdomain"),
    rootDomain: z.string().regex(/^[a-z0-9-]+\.[a-z]{2,}$/i),
    billingModel: z.enum(["seat", "metered", "seat+metered"]).default("seat+metered"),
    trialDays: z.number().int().min(0).max(60).default(14),
    requireCardOnTrial: z.boolean().default(false),
    oauthProviders: z
      .array(z.enum(["google", "github", "apple", "microsoft"]))
      .max(4)
      .default(["google"]),
    ssoEnabled: z.boolean().default(false),
    defaultLocale: z.enum(["en", "es", "fr", "de", "ja"]).default("en"),
    additionalLocales: z
      .array(z.enum(["es", "fr", "de", "ja", "pt", "it"]))
      .max(10)
      .default([]),
    auditRetentionYears: z.number().int().min(1).max(10).default(7),
    llmEnabled: z.boolean().default(false),

    /** Cloudflare-specific knobs */
    cloudflareAccountId: z.string().regex(/^[a-f0-9]{32}$/, "32-char hex"),
    d1DatabaseName: z
      .string()
      .min(3)
      .max(40)
      .regex(/^[a-z0-9-]+$/)
      .default("app"),
    workersCustomDomain: z.string().optional(),
  })
  .strict();

export type SaasMultitenantBaselineCfInputs = z.infer<typeof SaasMultitenantBaselineCfInputs>;
