import { z } from "zod";
import { SaasMultitenantBaselineInputs } from "../saas-multitenant-baseline/inputs.zod.js";

export const AnalyticsWorkbenchInputs = SaasMultitenantBaselineInputs.extend({
  eventRetentionDays: z.number().int().min(7).max(2557).default(365),
  dashboardRefreshMinutes: z.number().int().min(1).max(1440).default(15),
  exportFormats: z.array(z.enum(["csv", "json", "parquet"])).default(["csv", "json"]),
  metricApprovalRequired: z.boolean().default(true),
}).strict();

export type AnalyticsWorkbenchInputs = z.infer<typeof AnalyticsWorkbenchInputs>;
