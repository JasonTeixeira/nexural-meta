import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { loadWarehouseViaMcp, extractRootArg } from "../src/mcp-client.js";

const SERVER_DIST = resolve(
  __dirname,
  "../../warehouse-server/dist/bin/nexural-warehouse-server.js",
);

let workDir: string;

beforeEach(() => {
  workDir = mkdtempSync(join(tmpdir(), "wh-mcp-client-"));
});
afterEach(() => {
  rmSync(workDir, { recursive: true, force: true });
});

function writeFixture(): void {
  mkdirSync(join(workDir, "templates"), { recursive: true });
  mkdirSync(join(workDir, "documents"), { recursive: true });
  writeFileSync(
    join(workDir, "manifest.yaml"),
    `schema_version: 1
warehouse: fixture-wh
version: 0.1.0
description: A test fixture exercised through the MCP client transport layer.
documents:
  - id: doc1
    path: documents/doc1.md
    title: Doc 1
    audience: [agents, human]
    tags: [t]
templates:
  - id: tpl1
    source: templates/tpl1.txt.template
    target_path: tpl1.txt
    consumers: ["*"]
`,
  );
  writeFileSync(join(workDir, "templates/tpl1.txt.template"), "tpl content");
  writeFileSync(join(workDir, "documents/doc1.md"), "doc1 body");
}

const skipMcp = !existsSync(SERVER_DIST);

describe.skipIf(skipMcp)("loadWarehouseViaMcp (spawns the real binary)", () => {
  it("returns a warehouse handle with manifest + templates materialized", async () => {
    writeFixture();
    const handle = await loadWarehouseViaMcp({
      command: process.execPath,
      args: [SERVER_DIST, "--root", workDir],
    });
    try {
      expect(handle.warehouse.manifest.warehouse).toBe("fixture-wh");
      expect(handle.warehouse.templates).toHaveLength(1);
      expect(handle.warehouse.templates[0]?.targetPath).toBe("tpl1.txt");
      expect(handle.warehouse.templates[0]?.body).toBe("tpl content");
    } finally {
      await handle.close();
    }
  });

  it("readDocument returns body wrapped in envelope", async () => {
    writeFixture();
    const handle = await loadWarehouseViaMcp({
      command: process.execPath,
      args: [SERVER_DIST, "--root", workDir],
    });
    try {
      const doc = await handle.readDocument("doc1");
      expect(doc.meta.id).toBe("doc1");
      expect(doc.body).toMatch(/<warehouse_content warehouse="fixture-wh"/);
      expect(doc.body).toContain("doc1 body");
    } finally {
      await handle.close();
    }
  });

  it("readDocument throws for unknown id", async () => {
    writeFixture();
    const handle = await loadWarehouseViaMcp({
      command: process.execPath,
      args: [SERVER_DIST, "--root", workDir],
    });
    try {
      await expect(handle.readDocument("ghost")).rejects.toThrow();
    } finally {
      await handle.close();
    }
  });
});

describe("extractRootArg", () => {
  it("extracts --root <path>", () => {
    expect(extractRootArg(["--root", "/x", "--other"])).toBe("/x");
  });
  it("extracts -r <path>", () => {
    expect(extractRootArg(["-r", "/y"])).toBe("/y");
  });
  it("extracts --root=<path>", () => {
    expect(extractRootArg(["--root=/z"])).toBe("/z");
  });
  it("returns undefined when absent", () => {
    expect(extractRootArg(["--something-else"])).toBeUndefined();
  });
});
