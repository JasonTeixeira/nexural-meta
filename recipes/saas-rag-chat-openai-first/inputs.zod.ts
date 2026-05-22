import { z } from "zod";
import { SaasRagChatInputs } from "../saas-rag-chat/inputs.zod.js";

export const SaasRagChatOpenAiFirstInputs = SaasRagChatInputs.extend({
  /** OpenAI org id for enterprise customers (optional). */
  openaiOrgId: z.string().optional(),
}).strict();

export type SaasRagChatOpenAiFirstInputs = z.infer<typeof SaasRagChatOpenAiFirstInputs>;
