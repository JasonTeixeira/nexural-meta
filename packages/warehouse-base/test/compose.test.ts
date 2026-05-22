import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { composeForRecipe, ComposeError } from "../src/compose.js";

let workDir: string;

beforeEach(() => {
  workDir = mkdtempSync(join(tmpdir(), "warehouse-compose-"));
});
afterEach(() => {
  rmSync(workDir, { recursive: true, force: true });
});

function makeWarehouse(
  name: string,
  templates: Array<{ id: string; target: string; consumers: string[]; body: string }>,
): string {
  const root = join(workDir, name);
  mkdirSync(root, { recursive: true });
  mkdirSync(join(root, "templates"), { recursive: true });
  const tplYaml = templates
    .map(
      (t) =>
        `  - id: ${t.id}\n    source: templates/${t.id}.template\n    target_path: ${t.target}\n    consumers: [${t.consumers.map((c) => (c === "*" ? '"*"' : c)).join(", ")}]`,
    )
    .join("\n");
  const manifest = `
schema_version: 1
warehouse: ${name}
version: 0.1.0
description: Test warehouse contributing templates for composition tests.
documents: []
templates:
${tplYaml}
`.trim();
  writeFileSync(join(root, "manifest.yaml"), manifest);
  for (const t of templates) {
    writeFileSync(join(root, "templates", `${t.id}.template`), t.body);
  }
  return root;
}

describe("composeForRecipe", () => {
  it("composes templates from multiple warehouses", () => {
    const arch = makeWarehouse("architecture", [
      { id: "tsconfig", target: "tsconfig.json", consumers: ["*"], body: `{}` },
    ]);
    const auth = makeWarehouse("auth", [
      { id: "middleware", target: "middleware.ts", consumers: ["my-recipe"], body: `// auth` },
    ]);
    const result = composeForRecipe({
      warehouseRoots: [arch, auth],
      recipeName: "my-recipe",
    });
    expect(result.templates).toHaveLength(2);
    expect(Object.keys(result.provenance).sort()).toEqual(["middleware.ts", "tsconfig.json"]);
  });

  it("hard-errors on duplicate target path across warehouses", () => {
    const a = makeWarehouse("alpha", [
      { id: "x", target: "shared.ts", consumers: ["*"], body: "// a" },
    ]);
    const b = makeWarehouse("beta", [
      { id: "x", target: "shared.ts", consumers: ["*"], body: "// b" },
    ]);
    expect(() => composeForRecipe({ warehouseRoots: [a, b], recipeName: "anything" })).toThrow(
      /duplicate_path_across_warehouses/,
    );
  });

  it("hard-errors when a warehouse fails to load", () => {
    expect(() =>
      composeForRecipe({
        warehouseRoots: [join(workDir, "nope")],
        recipeName: "x",
      }),
    ).toThrow(ComposeError);
  });

  it("includes additionalTemplates after warehouse templates", () => {
    const arch = makeWarehouse("architecture", [
      { id: "tsconfig", target: "tsconfig.json", consumers: ["*"], body: `{}` },
    ]);
    const result = composeForRecipe({
      warehouseRoots: [arch],
      recipeName: "x",
      additionalTemplates: [
        { sourcePath: "recipe-local", targetPath: "package.json", body: `{"name":"x"}` },
      ],
    });
    expect(result.templates).toHaveLength(2);
    expect(result.provenance["package.json"]).toBe("<recipe>");
  });

  it("hard-errors when an additional template collides with a warehouse one", () => {
    const arch = makeWarehouse("architecture", [
      { id: "x", target: "tsconfig.json", consumers: ["*"], body: `{}` },
    ]);
    expect(() =>
      composeForRecipe({
        warehouseRoots: [arch],
        recipeName: "x",
        additionalTemplates: [{ sourcePath: "local", targetPath: "tsconfig.json", body: `{}` }],
      }),
    ).toThrow(/duplicate_path_across_warehouses/);
  });

  it("filters out templates not declared for the recipe", () => {
    const arch = makeWarehouse("architecture", [
      { id: "tsconfig", target: "tsconfig.json", consumers: ["other-recipe"], body: `{}` },
      { id: "gitignore", target: ".gitignore", consumers: ["*"], body: "node_modules\n" },
    ]);
    const result = composeForRecipe({
      warehouseRoots: [arch],
      recipeName: "my-recipe",
    });
    expect(result.templates).toHaveLength(1);
    expect(result.templates[0]?.targetPath).toBe(".gitignore");
  });
});
