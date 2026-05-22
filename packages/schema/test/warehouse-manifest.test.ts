import { describe, it, expect } from "vitest";
import { WarehouseManifest } from "../src/warehouse-manifest.js";

const validManifest = {
  schema_version: 1,
  warehouse: "architecture",
  version: "0.1.0",
  description: "Baseline TypeScript + Next.js architecture conventions and templates.",
  documents: [
    {
      id: "nextjs-15-baseline",
      path: "documents/nextjs-15-baseline.md",
      title: "Next.js 15 baseline conventions",
      audience: ["agents", "human"],
      tags: ["nextjs", "baseline"],
    },
  ],
  templates: [
    {
      id: "tsconfig",
      source: "templates/tsconfig.json.template",
      target_path: "tsconfig.json",
      consumers: ["saas-multitenant-baseline"],
      binary: false,
    },
  ],
};

describe("WarehouseManifest", () => {
  it("accepts a valid manifest", () => {
    expect(() => WarehouseManifest.parse(validManifest)).not.toThrow();
  });

  it("requires schema_version, warehouse, version", () => {
    expect(() => WarehouseManifest.parse({})).toThrow();
  });

  it("rejects duplicate document ids", () => {
    const m = {
      ...validManifest,
      documents: [
        validManifest.documents[0],
        { ...validManifest.documents[0], path: "documents/other.md" },
      ],
    };
    expect(() => WarehouseManifest.parse(m)).toThrow(/document ids must be unique/);
  });

  it("rejects duplicate template ids", () => {
    const m = {
      ...validManifest,
      templates: [
        validManifest.templates[0],
        { ...validManifest.templates[0], source: "templates/elsewhere.template" },
      ],
    };
    expect(() => WarehouseManifest.parse(m)).toThrow(/template ids must be unique/);
  });

  it("permits empty documents and templates", () => {
    const m = { ...validManifest, documents: [], templates: [] };
    expect(() => WarehouseManifest.parse(m)).not.toThrow();
  });

  it("permits wildcard consumers", () => {
    const m = {
      ...validManifest,
      templates: [{ ...validManifest.templates[0], consumers: ["*"] }],
    };
    expect(() => WarehouseManifest.parse(m)).not.toThrow();
  });

  it("rejects malformed semver version", () => {
    const m = { ...validManifest, version: "0.1" };
    expect(() => WarehouseManifest.parse(m)).toThrow();
  });

  it("rejects documents with no audience", () => {
    const m = {
      ...validManifest,
      documents: [{ ...validManifest.documents[0], audience: [] }],
    };
    expect(() => WarehouseManifest.parse(m)).toThrow();
  });

  it("rejects templates with empty source path", () => {
    const m = {
      ...validManifest,
      templates: [{ ...validManifest.templates[0], source: "" }],
    };
    expect(() => WarehouseManifest.parse(m)).toThrow();
  });

  it("rejects unknown top-level keys (strict)", () => {
    expect(() => WarehouseManifest.parse({ ...validManifest, future_field: "nope" })).toThrow();
  });
});
