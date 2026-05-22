/**
 * Inputs schema for `internal-tool-dashboard`.
 *
 * Extends saas-multitenant-baseline. Removes some marketing-oriented knobs
 * (billing, oauth providers for end-users) and adds admin/RBAC ones.
 */

import { z } from "zod";
import { SaasMultitenantBaselineInputs } from "../saas-multitenant-baseline/inputs.zod.js";

const AdminRole = z.enum(["super_admin", "admin", "viewer"]);

export const InternalToolDashboardInputs = SaasMultitenantBaselineInputs.extend({
  /**
   * Admin role hierarchy declared at forge time.
   * super_admin > admin > viewer.
   */
  adminRoles: z.array(AdminRole).min(2).max(5).default(["super_admin", "admin", "viewer"]),

  /**
   * Email domain allowlist for sign-up. Empty = no restriction (the admin
   * UI then becomes the gate). Always restrict in production.
   */
  signupEmailDomains: z.array(z.string().min(3)).max(20).default([]),

  /**
   * Bulk-action confirmation threshold. Any action affecting > this many rows
   * requires a typed-confirmation gesture in the UI.
   */
  bulkConfirmThreshold: z.number().int().min(1).max(10000).default(10),

  /** Sentry profile sampling — admin tools default to higher sampling for forensics. */
  sentryTracesSampleRate: z.number().min(0).max(1).default(0.5),
});
