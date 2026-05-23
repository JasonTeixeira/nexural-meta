/**
 * Build the federation MCP server.
 *
 * Exposes a single tool — `federation_ask` — that runs a federation-wide
 * FTS search over the meta-repo at `metaRoot` and returns ranked excerpts
 * with source citations.
 *
 * Each result includes:
 *   - source label (e.g. adr:0007-cost-guardrails)
 *   - path (e.g. docs/adr/0007-cost-guardrails-model-deprecation.md)
 *   - title
 *   - snippet with terms highlighted as [[term]]
 *   - score (higher = more relevant)
 *
 * Editor agents wire this into their MCP config once + can then query the
 * federation as a single tool call.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { AskIndex, collectDocs, type CollectedDoc, type DocKind } from "@nexural/ask-engine";
import { z } from "zod";

const AskArgs = z.object({
  query: z.string().min(1, "query required"),
  kinds: z.array(z.enum(["constitution", "adr", "warehouse-doc", "recipe-doc", "eval"])).optional(),
  limit: z.number().int().min(1).max(20).optional(),
});

export interface BuildServerOptions {
  /** Absolute path to nexural-meta root. */
  readonly metaRoot: string;
  /** Optional server name + version. */
  readonly serverName?: string;
  readonly serverVersion?: string;
}

export interface BuildResult {
  readonly server: Server;
  readonly docCount: number;
}

export function buildFederationServer(opts: BuildServerOptions): BuildResult {
  // Collect docs once at boot — federation docs change on commit, not at
  // request time. For live reload, a future patch can add a fs.watch loop.
  const docs: CollectedDoc[] = collectDocs({ root: opts.metaRoot });
  const index = new AskIndex(docs);

  const name = opts.serverName ?? "nexural-federation";
  const version = opts.serverVersion ?? "1.0.0";
  const server = new Server({ name, version }, { capabilities: { tools: {} } });

  server.setRequestHandler(ListToolsRequestSchema, () =>
    Promise.resolve({
      tools: [
        {
          name: "federation_ask",
          description: `Search the Nexural Federation knowledge base. Returns ranked excerpts from constitution, ADRs, warehouse documents, recipe THREAT_MODEL/DECISIONS/README, and eval golden sets. Use this whenever you need to know what the federation has already decided about a pattern, a security control, or a design question. Currently indexed: ${docs.length} documents.`,
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Question or keywords to search for",
              },
              kinds: {
                type: "array",
                items: {
                  type: "string",
                  enum: ["constitution", "adr", "warehouse-doc", "recipe-doc", "eval"],
                },
                description: "Filter by source kind",
              },
              limit: {
                type: "integer",
                minimum: 1,
                maximum: 20,
                description: "Max results (default 5)",
              },
            },
            required: ["query"],
            additionalProperties: false,
          },
        },
        {
          name: "federation_list_sources",
          description:
            "List all sources indexed in the federation (constitution docs, ADRs, warehouse docs, recipe docs, eval sets). Useful for browsing or filtering subsequent ask queries by kind.",
          inputSchema: {
            type: "object",
            properties: {
              kind: {
                type: "string",
                enum: ["constitution", "adr", "warehouse-doc", "recipe-doc", "eval"],
                description: "Optional filter to one kind",
              },
            },
            additionalProperties: false,
          },
        },
      ],
    }),
  );

  server.setRequestHandler(CallToolRequestSchema, (request) => {
    const tool = request.params.name;
    if (tool === "federation_ask") {
      const parsed = AskArgs.safeParse(request.params.arguments);
      if (!parsed.success) {
        return Promise.resolve({
          isError: true,
          content: [{ type: "text", text: `invalid args: ${parsed.error.message}` }],
        });
      }
      const hits = index.search(parsed.data.query, {
        limit: parsed.data.limit ?? 5,
        ...(parsed.data.kinds !== undefined ? { kinds: parsed.data.kinds } : {}),
      });
      return Promise.resolve({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                query: parsed.data.query,
                indexed: docs.length,
                hits: hits.map((h) => ({
                  source: h.source,
                  kind: h.kind,
                  title: h.title,
                  path: h.path,
                  score: h.score,
                  snippet: h.snippet,
                })),
              },
              null,
              2,
            ),
          },
        ],
      });
    }

    if (tool === "federation_list_sources") {
      const args = request.params.arguments as { kind?: DocKind } | undefined;
      const filtered = args?.kind ? docs.filter((d) => d.kind === args.kind) : docs;
      return Promise.resolve({
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                count: filtered.length,
                sources: filtered.map((d) => ({
                  source: d.source,
                  kind: d.kind,
                  title: d.title,
                  path: d.path,
                })),
              },
              null,
              2,
            ),
          },
        ],
      });
    }

    return Promise.resolve({
      isError: true,
      content: [{ type: "text", text: `unknown tool: ${tool}` }],
    });
  });

  return { server, docCount: docs.length };
}
