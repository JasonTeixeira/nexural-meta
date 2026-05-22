/**
 * `nx open <warehouse>` — cd + $EDITOR.
 *
 * Simply spawns $EDITOR pointed at the warehouse clone path.
 */

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import type { NexuralConfig } from "../config.js";

export async function runOpen(config: NexuralConfig, warehouseName: string): Promise<void> {
  const candidates = [
    join(config.warehouses_root, warehouseName),
    join(config.warehouses_root, `${warehouseName}-warehouse`),
  ];

  const path = candidates.find(existsSync);
  if (!path) {
    console.error(`❌ Warehouse not found locally. Tried:`);
    for (const c of candidates) console.error(`   - ${c}`);
    console.error(
      `\nRun \`nx sync\` first, or check that the warehouse exists in a federation registry.`,
    );
    process.exitCode = 1;
    return;
  }

  const editor = config.editor;
  const [cmd, ...editorArgs] = editor.split(" ");
  if (!cmd) {
    console.error("❌ EDITOR not configured. Set in ~/.nexural/config.toml or $EDITOR env var.");
    process.exitCode = 1;
    return;
  }

  const child = spawn(cmd, [...editorArgs, path], {
    stdio: "inherit",
    detached: false,
  });

  await new Promise<void>((resolve) => {
    child.on("close", () => resolve());
  });

  console.log(`✓ closed editor for ${path}`);
}
