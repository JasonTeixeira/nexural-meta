/**
 * Disk write helper. Kept separate from emit() so the pure render path
 * stays I/O-free + trivially mockable.
 *
 * Refuses to write into a non-empty existing directory unless `force`.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import type { EmitResult } from "./types.js";
import { EmitError } from "./types.js";

export interface WriteOptions {
  /** Absolute or relative root directory to write into. */
  readonly outRoot: string;
  /**
   * Allow writing into a non-empty directory. Forge generally forbids this:
   * a clean tree per app makes `git init` semantics unambiguous.
   */
  readonly force?: boolean;
}

export interface WriteResult {
  readonly outRoot: string;
  readonly fileCount: number;
  readonly byteCount: number;
}

export async function writeEmitResult(
  result: EmitResult,
  opts: WriteOptions,
): Promise<WriteResult> {
  const outRoot = resolve(opts.outRoot);

  if (existsSync(outRoot)) {
    const entries = readdirSync(outRoot);
    if (entries.length > 0 && !opts.force) {
      throw new EmitError(
        "invalid_path",
        `Output directory "${outRoot}" is not empty (${entries.length} entries). Pass force:true to override.`,
        { detail: { outRoot, entries } },
      );
    }
  }

  let byteCount = 0;

  for (const file of result.files) {
    const fullPath = join(outRoot, file.path);
    await mkdir(dirname(fullPath), { recursive: true });
    const buf = typeof file.content === "string" ? file.content : Buffer.from(file.content);
    await writeFile(fullPath, buf, { mode: file.mode });
    byteCount += typeof buf === "string" ? Buffer.byteLength(buf, "utf8") : buf.byteLength;
  }

  return { outRoot, fileCount: result.files.length, byteCount };
}
