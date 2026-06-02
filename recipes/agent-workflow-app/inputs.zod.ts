import { z } from "zod";
import { SaasMultitenantBaselineInputs } from "../saas-multitenant-baseline/inputs.zod.js";

export const AgentWorkflowAppInputs = SaasMultitenantBaselineInputs.extend({
  maxWorkflowSteps: z.number().int().min(1).max(100).default(25),
  humanApprovalRequired: z.boolean().default(true),
  toolTimeoutSeconds: z.number().int().min(1).max(600).default(60),
  evalStrictness: z.enum(["smoke", "standard", "adversarial"]).default("standard"),
}).strict();

export type AgentWorkflowAppInputs = z.infer<typeof AgentWorkflowAppInputs>;
