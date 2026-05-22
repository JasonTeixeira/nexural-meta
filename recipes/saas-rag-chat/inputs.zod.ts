/**
 * Inputs schema for `saas-rag-chat`. Extends the parent's inputs.
 */

import { z } from "zod";
import { SaasMultitenantBaselineInputs } from "../saas-multitenant-baseline/inputs.zod.js";

export const SaasRagChatInputs = SaasMultitenantBaselineInputs.extend({
  /** Embeddings dimension. Anchored to OpenAI text-embedding-3-large. */
  embeddingDimensions: z.literal(3072).default(3072),

  /** Vector store flavor. Switching requires recipe variant. */
  vectorStore: z.enum(["pgvector"]).default("pgvector"),

  /** Hybrid search weighting in RRF fusion (BM25 weight vs dense weight). */
  hybridSearchBm25Weight: z.number().min(0).max(1).default(0.4),

  /** Top-k retrieved before rerank. */
  topK: z.number().int().min(1).max(100).default(20),

  /** Final chunks shown after rerank. */
  rerankK: z.number().int().min(1).max(20).default(5),

  /** Enable Cohere rerank when key present; fallback to RRF if not. */
  rerankEnabled: z.boolean().default(true),

  /** Max document size in MB. */
  maxDocSizeMb: z.number().int().min(1).max(500).default(50),

  /** Max docs per tenant on paid plans. */
  maxDocsPerTenantPaid: z.number().int().min(10).max(1_000_000).default(10_000),

  /** Eval golden set strict mode (forge fails if <80% pass rate at emit time). */
  goldenSetStrict: z.boolean().default(true),
}).strict();

export type SaasRagChatInputs = z.infer<typeof SaasRagChatInputs>;
