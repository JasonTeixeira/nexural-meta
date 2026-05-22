/**
 * `nx play <playbook>` — execute a playbook with confirmations.
 *
 * Playbooks are markdown files in warehouses' `playbooks/` dirs.
 *
 * Phase 3 (v0.1.0): finds + previews the playbook. Actual execution-with-confirmation
 * lands in Phase 5 alongside the warehouse content that needs it.
 */

import { existsSync, readdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { NexuralConfig } from "../config.js";

export async function runPlay(config: NexuralConfig, playbookName: string): Promise<void> {
  if (!playbookName) {
    console.error("Usage: nx play <playbook-name>");
    console.error("Example: nx play add-stripe-checkout");
    process.exitCode = 1;
    return;
  }

  // Search every warehouse's playbooks/ for a matching file
  if (!existsSync(config.warehouses_root)) {
    console.error(
      `❌ warehouses root ${config.warehouses_root} not present — run \`nx sync\` first`,
    );
    process.exitCode = 1;
    return;
  }

  const candidates: string[] = [];
  for (const wh of readdirSync(config.warehouses_root)) {
    const playbooksDir = join(config.warehouses_root, wh, "playbooks");
    if (!existsSync(playbooksDir)) continue;
    const matches = readdirSync(playbooksDir).filter(
      (f) => f.startsWith(playbookName) && f.endsWith(".md"),
    );
    for (const m of matches) candidates.push(join(playbooksDir, m));
  }

  if (candidates.length === 0) {
    console.log(`ℹ️  No playbook matching "${playbookName}" found in any warehouse.`);
    console.log();
    console.log("Phase 3 (v0.1.0) — playbook execution is preview-only.");
    console.log("Phase 5 lands the runbook-warehouse + the actual execution engine");
    console.log("(per ADR-0002 four-layer model § Layer 3 — Pipeline).");
    return;
  }

  if (candidates.length > 1) {
    console.log(`Multiple playbooks matched. Pick one:`);
    candidates.forEach((c, i) => console.log(`  ${i + 1}. ${c}`));
    process.exitCode = 1;
    return;
  }

  const playbook = candidates[0]!;
  const content = await readFile(playbook, "utf8");
  console.log(`📖 ${playbook}`);
  console.log("─".repeat(60));
  console.log(content);
  console.log("─".repeat(60));
  console.log("\nℹ️  Phase 3: preview-only. Phase 5 wires interactive step execution.");
}
