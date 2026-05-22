/**
 * Inputs schema for `saas-agent-platform`. Extends the parent's inputs.
 */

import { z } from "zod";
import { SaasMultitenantBaselineInputs } from "../saas-multitenant-baseline/inputs.zod.js";

const ToolName = z.enum([
  "search-knowledge-base",
  "fetch-url",
  "send-email",
  "query-database",
  "update-record",
  "schedule-task",
]);

export const SaasAgentPlatformInputs = SaasMultitenantBaselineInputs.extend({
  /** Default tools enabled for new tenants. */
  defaultTools: z.array(ToolName).max(20).default(["search-knowledge-base", "query-database"]),

  /** Max steps per agent invocation. Hard cap 50. */
  maxSteps: z.number().int().min(1).max(50).default(20),

  /** Observation retention (days). 7 years (2557 days) for fintech. */
  observationRetentionDays: z.number().int().min(7).max(2557).default(30),

  /** Adversarial eval strict mode (forge fails if <100% rejection at emit time). */
  adversarialEvalStrict: z.boolean().default(true),
}).strict();

export type SaasAgentPlatformInputs = z.infer<typeof SaasAgentPlatformInputs>;
