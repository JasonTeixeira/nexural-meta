import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  loadWarehouse,
  readDocument,
  templatesForRecipe,
  WarehouseLoadError,
} from "../src/loader.js";

let workDir: string;

beforeEach(() => {
  workDir = mkdtempSync(join(tmpdir(), "warehouse-loader-"));
});
afterEach(() => {
  rmSync(workDir, { recursive: true, force: true });
});

function writeFile(rel: string, content: string): void {
  const full = join(workDir, rel);
  mkdirSync(join(full, ".."), { recursive: true });
  writeFileSync(full, content);
}

const manifestYaml = (overrides = ""): string =>
  `
schema_version: 1
warehouse: architecture
version: 0.1.0
description: A test warehouse exposing one document and one template.
documents:
  - id: nextjs-baseline
    path: documents/nextjs-baseline.md
    title: Next.js baseline
    audience: [agents, human]
    tags: [nextjs]
templates:
  - id: tsconfig
    source: templates/tsconfig.json.template
    target_path: tsconfig.json
    consumers: [saas-multitenant-baseline]
${overrides}
`.trim();

describe("loadWarehouse", () => {
  it("loads a warehouse with manifest + template", () => {
    writeFile("manifest.yaml", manifestYaml());
    writeFile("templates/tsconfig.json.template", `{"target": "es2022"}`);
    writeFile("documents/nextjs-baseline.md", "# Hello");

    const wh = loadWarehouse(workDir);
    expect(wh.manifest.warehouse).toBe("architecture");
    expect(wh.templates).toHaveLength(1);
    expect(wh.templates[0]?.targetPath).toBe("tsconfig.json");
    expect(wh.templates[0]?.body).toContain("es2022");
  });

  it("throws when root is not a directory", () => {
    expect(() => loadWarehouse(join(workDir, "ghost"))).toThrow(WarehouseLoadError);
  });

  it("throws when manifest.yaml is missing", () => {
    expect(() => loadWarehouse(workDir)).toThrow(/missing manifest/);
  });

  it("throws when manifest fails schema validation", () => {
    writeFile("manifest.yaml", "schema_version: 1\nwarehouse: notvalid-because-no-version: x");
    expect(() => loadWarehouse(workDir)).toThrow();
  });

  it("throws when a declared template source is missing", () => {
    writeFile("manifest.yaml", manifestYaml());
    // Don't create templates/tsconfig.json.template
    expect(() => loadWarehouse(workDir)).toThrow(/source.*does not exist/);
  });

  it("treats binary templates as binary (empty body, copied bytes downstream)", () => {
    const binManifest = `
schema_version: 1
warehouse: design
version: 0.1.0
description: Tests a binary asset declaration end-to-end with mode bits set.
templates:
  - id: favicon
    source: templates/favicon.ico
    target_path: public/favicon.ico
    consumers: ["*"]
    binary: true
`.trim();
    writeFile("manifest.yaml", binManifest);
    writeFile("templates/favicon.ico", "FAKE_BINARY_BYTES");
    const wh = loadWarehouse(workDir);
    expect(wh.templates[0]?.binary).toBe(true);
    expect(wh.templates[0]?.body).toBe("");
  });
});

describe("readDocument", () => {
  it("reads an existing document body", () => {
    writeFile("manifest.yaml", manifestYaml());
    writeFile("templates/tsconfig.json.template", `{}`);
    writeFile("documents/nextjs-baseline.md", "# Title\nbody");
    const wh = loadWarehouse(workDir);
    const doc = readDocument(wh, "nextjs-baseline");
    expect(doc.body).toMatch(/Title/);
  });

  it("throws on unknown document id", () => {
    writeFile("manifest.yaml", manifestYaml());
    writeFile("templates/tsconfig.json.template", `{}`);
    const wh = loadWarehouse(workDir);
    expect(() => readDocument(wh, "nonexistent")).toThrow(WarehouseLoadError);
  });

  it("throws when declared doc file missing", () => {
    writeFile("manifest.yaml", manifestYaml());
    writeFile("templates/tsconfig.json.template", `{}`);
    // documents/nextjs-baseline.md NOT created
    const wh = loadWarehouse(workDir);
    expect(() => readDocument(wh, "nextjs-baseline")).toThrow(/file missing/);
  });
});

describe("templatesForRecipe", () => {
  it("filters by named consumer", () => {
    writeFile("manifest.yaml", manifestYaml());
    writeFile("templates/tsconfig.json.template", `{}`);
    const wh = loadWarehouse(workDir);
    expect(templatesForRecipe(wh, "saas-multitenant-baseline")).toHaveLength(1);
    expect(templatesForRecipe(wh, "fintech-ledger-app")).toHaveLength(0);
  });

  it("respects wildcard consumers", () => {
    const m = manifestYaml().replace("consumers: [saas-multitenant-baseline]", 'consumers: ["*"]');
    writeFile("manifest.yaml", m);
    writeFile("templates/tsconfig.json.template", `{}`);
    const wh = loadWarehouse(workDir);
    expect(templatesForRecipe(wh, "anything")).toHaveLength(1);
  });
});
