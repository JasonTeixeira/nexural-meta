/**
 * `nx session save --note "..."` — updates STATE.md per ADR-0008.
 *
 * Thin wrapper around scripts/session-save.mjs that lives in nexural-meta.
 * For other repos (e.g., when nx is run from a forged app), reads NEXURAL_META_PATH.
 */

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

export async function runSessionSave(note: string): Promise<void> {
  if (!note || note.trim().length === 0) {
    console.error('❌ session save requires --note "What changed"');
    process.exitCode = 1;
    return;
  }

  const metaPath = process.env.NEXURAL_META_PATH ?? process.cwd();
  const script = join(metaPath, "scripts/session-save.mjs");

  if (!existsSync(script)) {
    console.error(`❌ scripts/session-save.mjs not found at ${script}`);
    console.error(`   Set NEXURAL_META_PATH or run from inside nexural-meta.`);
    process.exitCode = 1;
    return;
  }

  const child = spawn("node", [script, "--note", note], {
    stdio: "inherit",
    cwd: metaPath,
  });
  await new Promise<void>((resolve, reject) => {
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`session-save.mjs exited ${code}`));
    });
  });
}
