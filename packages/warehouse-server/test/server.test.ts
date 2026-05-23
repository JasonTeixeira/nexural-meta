import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { buildWarehouseServer } from "../src/server.js";
import type { LoadedWarehouse } from "@nexural/warehouse-base";

let workDir: string;

beforeEach(() => {
  workDir = mkdtempSync(join(tmpdir(), "wh-server-"));
});
afterEach(() => {
  rmSync(workDir, { recursive: true, force: true });
});

function writeWarehouse(): void {
  mkdirSync(join(workDir, "templates"), { recursive: true });
  mkdirSync(join(workDir, "documents"), { recursive: true });
  writeFileSync(
    join(workDir, "manifest.yaml"),
    `schema_version: 1
warehouse: test-wh
version: 0.1.0
description: A test warehouse used by the MCP server unit tests.
documents:
  - id: greeting
    path: documents/greeting.md
    title: Hello
    audience: [agents]
    tags: [test]
templates:
  - id: hello
    source: templates/hello.txt.template
    target_path: hello.txt
    consumers: ["*"]
`,
  );
  writeFileSync(join(workDir, "templates/hello.txt.template"), "Hello {{ slug }}");
  writeFileSync(join(workDir, "documents/greeting.md"), "# Hello\n\nbody text");
}

async function connectClient(): Promise<{ client: Client; warehouse: LoadedWarehouse }> {
  writeWarehouse();
  const { server, warehouse } = buildWarehouseServer({ warehouseRoot: workDir });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "test-client", version: "1.0.0" }, { capabilities: {} });
  await Promise.all([client.connect(clientTransport), server.connect(serverTransport)]);
  return { client, warehouse };
}

describe("warehouse MCP server", () => {
  it("lists 5 tools", async () => {
    const { client } = await connectClient();
    const res = await client.listTools();
    const names = res.tools.map((t) => t.name).sort();
    expect(names).toEqual(
      [
        "warehouse_manifest",
        "warehouse_list_documents",
        "warehouse_read_document",
        "warehouse_list_templates",
        "warehouse_read_template",
      ].sort(),
    );
  });

  it("returns the manifest as JSON", async () => {
    const { client } = await connectClient();
    const res = await client.callTool({ name: "warehouse_manifest", arguments: {} });
    const text = (res.content as Array<{ type: string; text: string }>)[0]!.text;
    const parsed = JSON.parse(text);
    expect(parsed.warehouse).toBe("test-wh");
    expect(parsed.version).toBe("0.1.0");
  });

  it("wraps document bodies in <warehouse_content> envelopes", async () => {
    const { client } = await connectClient();
    const res = await client.callTool({
      name: "warehouse_read_document",
      arguments: { id: "greeting" },
    });
    const text = (res.content as Array<{ type: string; text: string }>)[0]!.text;
    expect(text).toMatch(/<warehouse_content warehouse="test-wh"/);
    expect(text).toContain("# Hello");
    expect(text).toMatch(/<\/warehouse_content>$/);
  });

  it("errors on unknown document id", async () => {
    const { client } = await connectClient();
    const res = await client.callTool({
      name: "warehouse_read_document",
      arguments: { id: "never-existed" },
    });
    expect(res.isError).toBe(true);
  });

  it("lists templates filtered by recipe", async () => {
    const { client } = await connectClient();
    const all = await client.callTool({ name: "warehouse_list_templates", arguments: {} });
    const allText = (all.content as Array<{ type: string; text: string }>)[0]!.text;
    expect(JSON.parse(allText)).toHaveLength(1);

    const forSlug = await client.callTool({
      name: "warehouse_list_templates",
      arguments: { recipe: "saas-multitenant-baseline" },
    });
    expect(JSON.parse((forSlug.content as Array<{ text: string }>)[0]!.text)).toHaveLength(1);
  });

  it("returns raw template body via warehouse_read_template", async () => {
    const { client } = await connectClient();
    const res = await client.callTool({
      name: "warehouse_read_template",
      arguments: { id: "hello" },
    });
    const text = (res.content as Array<{ type: string; text: string }>)[0]!.text;
    expect(text).toBe("Hello {{ slug }}");
  });

  it("errors on unknown template id", async () => {
    const { client } = await connectClient();
    const res = await client.callTool({
      name: "warehouse_read_template",
      arguments: { id: "nope" },
    });
    expect(res.isError).toBe(true);
  });
});
