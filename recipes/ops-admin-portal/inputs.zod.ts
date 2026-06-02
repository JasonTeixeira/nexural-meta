import { z } from "zod";
import { InternalToolDashboardInputs } from "../internal-tool-dashboard/inputs.zod.js";

export const OpsAdminPortalInputs = InternalToolDashboardInputs.extend({
  queueSlaMinutes: z.number().int().min(1).max(10080).default(240),
  incidentSeverityLevels: z
    .array(z.enum(["sev1", "sev2", "sev3", "sev4"]))
    .default(["sev1", "sev2", "sev3"]),
  approvalMode: z.enum(["single", "dual-control"]).default("dual-control"),
}).strict();

export type OpsAdminPortalInputs = z.infer<typeof OpsAdminPortalInputs>;
