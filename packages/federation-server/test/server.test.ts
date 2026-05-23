import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { buildFederationServer } from "../src/server.js";

let root: string;

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "fed-server-"));
  mkdirSync(join(root, "docs/adr"), { recursive: true });
  mkdirSync(join(root, "warehouses/auth/documents"), { recursive: true });
  mkdirSync(join(root, "recipes/sample"), { recursive: true });
  writeFileSync(
    join(root, "docs/ARCHITECTURE.md"),
    "# Architecture\n\nLayered model. Cost discipline locked.",
  );
  writeFileSync(
    join(root, "docs/adr/0007-cost.md"),
    "# ADR-0007: Cost guardrails\n\nStreaming abort mandatory. LLM cost caps via llmClient.",
  );
  writeFileSync(
    join(root, "warehouses/auth/documents/supabase-ssr.md"),
    "# Supabase SSR\n\nCookie-based session management with middleware refresh.",
  );
  writeFileSync(
    join(root, "recipes/sample/THREAT_MODEL.md"),
    "# Threat model\n\nTenant isolation via Postgres RLS.",
  );
});

afterEach(() => {
  rmSync(root, { recursive: true, force: true });
});

async function connect(): Promise<{ client: Client; docCount: number }> {
  const { server, docCount } = buildFederationServer({ metaRoot: root });
  const [c, s] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "test", version: "1.0.0" }, { capabilities: {} });
  await Promise.all([client.connect(c), server.connect(s)]);
  return { client, docCount };
}

describe("federation-server MCP", () => {
  it("indexes docs from a federation root", async () => {
    const { docCount } = await connect();
    expect(docCount).toBeGreaterThanOrEqual(4);
  });

  it("exposes federation_ask + federation_list_sources tools", async () => {
    const { client } = await connect();
    const res = await client.listTools();
    const names = res.tools.map((t) => t.name).sort();
    expect(names).toEqual(["federation_ask", "federation_list_sources"]);
  });

  it("federation_ask returns ranked hits with source labels", async () => {
    const { client } = await connect();
    const res = await client.callTool({
      name: "federation_ask",
      arguments: { query: "cost guardrails LLM streaming" },
    });
    const text = (res.content as Array<{ type: string; text: string }>)[0]!.text;
    const parsed = JSON.parse(text) as { hits: Array<{ source: string }> };
    expect(parsed.hits.length).toBeGreaterThan(0);
    expect(parsed.hits[0]?.source).toContain("adr");
  });

  it("federation_ask respects kinds filter", async () => {
    const { client } = await connect();
    const res = await client.callTool({
      name: "federation_ask",
      arguments: { query: "tenant", kinds: ["recipe-doc"] },
    });
    const text = (res.content as Array<{ type: string; text: string }>)[0]!.text;
    const parsed = JSON.parse(text) as { hits: Array<{ kind: string }> };
    expect(parsed.hits.every((h) => h.kind === "recipe-doc")).toBe(true);
  });

  it("federation_ask rejects empty query", async () => {
    const { client } = await connect();
    const res = await client.callTool({
      name: "federation_ask",
      arguments: { query: "" },
    });
    expect(res.isError).toBe(true);
  });

  it("federation_list_sources returns all sources unfiltered", async () => {
    const { client } = await connect();
    const res = await client.callTool({
      name: "federation_list_sources",
      arguments: {},
    });
    const text = (res.content as Array<{ type: string; text: string }>)[0]!.text;
    const parsed = JSON.parse(text) as { count: number; sources: ReadonlyArray<unknown> };
    expect(parsed.count).toBeGreaterThanOrEqual(4);
    expect(parsed.sources.length).toBe(parsed.count);
  });

  it("federation_list_sources filters by kind", async () => {
    const { client } = await connect();
    const res = await client.callTool({
      name: "federation_list_sources",
      arguments: { kind: "adr" },
    });
    const text = (res.content as Array<{ type: string; text: string }>)[0]!.text;
    const parsed = JSON.parse(text) as { sources: Array<{ kind: string }> };
    expect(parsed.sources.every((s) => s.kind === "adr")).toBe(true);
  });
});
