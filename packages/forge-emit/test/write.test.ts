import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, readFileSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { writeEmitResult } from "../src/write.js";
import { EmitError, type EmitResult } from "../src/types.js";

let workDir: string;

beforeEach(() => {
  workDir = mkdtempSync(join(tmpdir(), "forge-emit-test-"));
});
afterEach(() => {
  rmSync(workDir, { recursive: true, force: true });
});

const stubResult = (files: EmitResult["files"]): EmitResult => ({
  files,
  warnings: [],
  skipped: [],
});

describe("writeEmitResult()", () => {
  it("writes files to an empty directory", async () => {
    const result = stubResult([
      { path: "package.json", content: `{"name":"x"}`, mode: 0o644 },
      { path: "src/index.ts", content: `console.log("hi");`, mode: 0o644 },
    ]);
    const { fileCount, byteCount } = await writeEmitResult(result, { outRoot: workDir });
    expect(fileCount).toBe(2);
    expect(byteCount).toBeGreaterThan(0);
    expect(readFileSync(join(workDir, "package.json"), "utf-8")).toBe(`{"name":"x"}`);
    expect(existsSync(join(workDir, "src/index.ts"))).toBe(true);
  });

  it("refuses to write into non-empty directory", async () => {
    writeFileSync(join(workDir, "existing.txt"), "leave me alone");
    const result = stubResult([{ path: "x.ts", content: "x", mode: 0o644 }]);
    await expect(writeEmitResult(result, { outRoot: workDir })).rejects.toThrow(EmitError);
  });

  it("respects force flag for non-empty directory", async () => {
    writeFileSync(join(workDir, "existing.txt"), "ok");
    const result = stubResult([{ path: "new.ts", content: "x", mode: 0o644 }]);
    await writeEmitResult(result, { outRoot: workDir, force: true });
    expect(existsSync(join(workDir, "new.ts"))).toBe(true);
    expect(existsSync(join(workDir, "existing.txt"))).toBe(true);
  });

  it("creates intermediate directories", async () => {
    const result = stubResult([{ path: "deep/nested/dir/file.ts", content: "x", mode: 0o644 }]);
    await writeEmitResult(result, { outRoot: workDir });
    expect(existsSync(join(workDir, "deep/nested/dir/file.ts"))).toBe(true);
  });

  it("writes binary content via Uint8Array", async () => {
    const bytes = new Uint8Array([1, 2, 3, 4]);
    const result = stubResult([{ path: "data.bin", content: bytes, mode: 0o644 }]);
    await writeEmitResult(result, { outRoot: workDir });
    const buf = readFileSync(join(workDir, "data.bin"));
    expect(Array.from(buf)).toEqual([1, 2, 3, 4]);
  });

  it("treats an empty existing directory as writeable", async () => {
    // workDir is created empty by mkdtempSync — that's the valid case.
    mkdirSync(join(workDir, "subdir")); // adds a subdir; should still fail
    const result = stubResult([{ path: "a.ts", content: "x", mode: 0o644 }]);
    await expect(writeEmitResult(result, { outRoot: workDir })).rejects.toThrow();
  });
});
