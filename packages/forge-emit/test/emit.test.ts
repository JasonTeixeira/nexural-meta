import { describe, it, expect } from "vitest";
import { emit } from "../src/emit.js";
import { EmitError, type EmitContext, type TemplateFile } from "../src/types.js";

function ctx(
  inputs: Record<string, unknown> = {},
  secrets: Record<string, string> = {},
): EmitContext {
  return {
    inputs: { slug: "slice-test", ...inputs },
    recipe: { name: "saas-multitenant-baseline", version: "0.1.0" },
    secrets,
    forge: { slug: "slice-test", timestamp: "2026-05-22T00:00:00Z", nexuralVersion: "0.1.0" },
  };
}

const tmpl = (
  overrides: Partial<TemplateFile> & Pick<TemplateFile, "sourcePath" | "targetPath" | "body">,
): TemplateFile => ({
  ...overrides,
});

describe("emit()", () => {
  it("renders body + path", () => {
    const result = emit(
      [tmpl({ sourcePath: "a", targetPath: "app/{{ slug }}/page.tsx", body: "// {{ slug }}" })],
      ctx({ slug: "x" }),
    );
    expect(result.files).toHaveLength(1);
    expect(result.files[0]?.path).toBe("app/x/page.tsx");
    expect(result.files[0]?.content).toBe("// x");
  });

  it("skips conditional templates when falsy", () => {
    const result = emit(
      [
        tmpl({
          sourcePath: "stripe.ts",
          targetPath: "stripe.ts",
          body: "// stripe",
          conditionalOn: "inputs.enableBilling",
        }),
      ],
      ctx({ enableBilling: false }),
    );
    expect(result.files).toHaveLength(0);
    expect(result.skipped).toHaveLength(1);
  });

  it("emits conditional templates when truthy", () => {
    const result = emit(
      [
        tmpl({
          sourcePath: "stripe.ts",
          targetPath: "stripe.ts",
          body: "// stripe",
          conditionalOn: "inputs.enableBilling",
        }),
      ],
      ctx({ enableBilling: true }),
    );
    expect(result.files).toHaveLength(1);
  });

  it("rejects unresolved variable in target path", () => {
    expect(() =>
      emit([tmpl({ sourcePath: "a", targetPath: "app/{{ undef }}/x.ts", body: "x" })], ctx()),
    ).toThrow(/unresolved_variable|unresolved/);
  });

  it("rejects path traversal in target path", () => {
    expect(() =>
      emit([tmpl({ sourcePath: "a", targetPath: "../escape.ts", body: "x" })], ctx()),
    ).toThrow(EmitError);
  });

  it("rejects absolute target path", () => {
    expect(() =>
      emit([tmpl({ sourcePath: "a", targetPath: "/etc/passwd", body: "x" })], ctx()),
    ).toThrow(EmitError);
  });

  it("rejects duplicate target paths", () => {
    expect(() =>
      emit(
        [
          tmpl({ sourcePath: "a", targetPath: "x.ts", body: "1" }),
          tmpl({ sourcePath: "b", targetPath: "x.ts", body: "2" }),
        ],
        ctx(),
      ),
    ).toThrow(/duplicate_path/);
  });

  it("detects secret leak in emitted body", () => {
    expect(() =>
      emit(
        [
          tmpl({
            sourcePath: "leak.ts",
            targetPath: "leak.ts",
            body: `const k = "${"a".repeat(40)}";`,
          }),
        ],
        ctx({}, { TEST_KEY: "a".repeat(40) }),
      ),
    ).toThrow(/secret_leak/);
  });

  it("ignores short secrets (avoid false positives)", () => {
    const result = emit(
      [tmpl({ sourcePath: "a", targetPath: "a.ts", body: "ab" })],
      ctx({}, { TOO_SHORT: "ab" }),
    );
    expect(result.files).toHaveLength(1);
  });

  it("copies binary templates as bytes", () => {
    const result = emit(
      [
        tmpl({
          sourcePath: "favicon.ico",
          targetPath: "public/favicon.ico",
          body: "BINARYDATA",
          binary: true,
        }),
      ],
      ctx(),
    );
    expect(result.files[0]?.content).toBeInstanceOf(Uint8Array);
    expect(result.warnings.some((w) => w.code === "binary_copied")).toBe(true);
  });

  it("rejects binary template that contains markers", () => {
    expect(() =>
      emit(
        [
          tmpl({
            sourcePath: "weird.bin",
            targetPath: "weird.bin",
            body: "x{{ slug }}y",
            binary: true,
          }),
        ],
        ctx(),
      ),
    ).toThrow(/binary_with_template_marker/);
  });

  it("warns on unused input keys", () => {
    const result = emit(
      [tmpl({ sourcePath: "a", targetPath: "a.ts", body: "// {{ slug }}" })],
      ctx({ slug: "x", unusedKnob: "never-referenced" }),
    );
    expect(
      result.warnings.some((w) => w.code === "unused_input" && /unusedKnob/.test(w.message)),
    ).toBe(true);
  });

  it("default mode is 0o644", () => {
    const result = emit([tmpl({ sourcePath: "a", targetPath: "a.ts", body: "x" })], ctx());
    expect(result.files[0]?.mode).toBe(0o644);
  });

  it("preserves explicit mode for executables", () => {
    const result = emit(
      [tmpl({ sourcePath: "a", targetPath: "bin/run.sh", body: "#!/bin/sh", mode: 0o755 })],
      ctx(),
    );
    expect(result.files[0]?.mode).toBe(0o755);
  });
});
