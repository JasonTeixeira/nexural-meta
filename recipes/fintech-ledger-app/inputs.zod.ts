/**
 * Inputs schema for `fintech-ledger-app`.
 *
 * Extends `saas-multitenant-baseline` inputs with finance-specific knobs.
 */

import { z } from "zod";
import { SaasMultitenantBaselineInputs } from "../saas-multitenant-baseline/inputs.zod.js";

export const FintechLedgerAppInputs = SaasMultitenantBaselineInputs.extend({
  /** ISO 4217 currency code for the primary ledger (USD, EUR, GBP, etc). */
  baseCurrency: z
    .string()
    .regex(/^[A-Z]{3}$/, "ISO 4217 three-letter code")
    .default("USD"),

  /**
   * Decimal precision for monetary amounts. 4 = ten-thousandths of a cent.
   * Higher precision needed for rate-card products with sub-cent line items.
   */
  decimalPrecision: z.number().int().min(2).max(8).default(4),

  /**
   * Retention years for ledger entries + audit_events.
   * Fintech baseline = 7 years (SOX / IRS / typical reg requirement).
   * Override only with compliance signoff documented in DECISIONS.md.
   */
  ledgerRetentionYears: z.number().int().min(7).max(20).default(7),

  /**
   * Past-due grace period in days. Fintech default is 1 (hard cutoff);
   * baseline saas-multitenant-baseline uses 7.
   */
  pastDueGraceDays: z.number().int().min(0).max(30).default(1),

  /** Enable the daily reconciliation job (cron @ 03:00 UTC). */
  reconciliationEnabled: z.boolean().default(true),
});
