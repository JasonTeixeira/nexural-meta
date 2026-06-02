import { z } from "zod";
import { SaasMultitenantBaselineInputs } from "../saas-multitenant-baseline/inputs.zod.js";

export const MarketplaceStarterInputs = SaasMultitenantBaselineInputs.extend({
  listingModeration: z.enum(["pre-publish", "post-publish"]).default("pre-publish"),
  commissionBps: z.number().int().min(0).max(5000).default(1000),
  disputeSlaHours: z.number().int().min(1).max(720).default(72),
  payoutProvider: z.enum(["stripe-connect"]).default("stripe-connect"),
}).strict();

export type MarketplaceStarterInputs = z.infer<typeof MarketplaceStarterInputs>;
