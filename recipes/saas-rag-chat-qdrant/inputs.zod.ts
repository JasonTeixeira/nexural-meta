import { z } from "zod";
import { SaasRagChatInputs } from "../saas-rag-chat/inputs.zod.js";

export const SaasRagChatQdrantInputs = SaasRagChatInputs.extend({
  qdrantUrl: z.string().url(),
  qdrantTenantIsolation: z
    .enum(["collection-per-tenant", "filter-by-payload"])
    .default("collection-per-tenant"),
  qdrantBackupS3Bucket: z.string().optional(),
}).strict();

export type SaasRagChatQdrantInputs = z.infer<typeof SaasRagChatQdrantInputs>;
