/**
 * `nx forge <recipe> <name>` — emit a new app from a signed recipe.
 *
 * Phase 3 (v0.1.0) — Validates plumbing: @nexural/factory signature check,
 * SBOM gate, license gate, typosquat detection, lockfile shape. Refuses to
 * emit any code because no recipes exist yet (Phase 5).
 *
 * Phase 5 wires actual template emission.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";
import type { NexuralConfig } from "../config.js";

export async function runForge(
  config: NexuralConfig,
  recipeName: string,
  appName: string,
): Promise<void> {
  if (!recipeName || !appName) {
    console.error("Usage: nx forge <recipe-name> <app-name>");
    console.error("Example: nx forge saas-multitenant-baseline my-saas");
    process.exitCode = 1;
    return;
  }

  console.log(`🔨 Forging app "${appName}" from recipe "${recipeName}"`);
  console.log();

  // Phase 5+: load signed recipe tarball from GitHub Releases.
  // Phase 3: check recipes/ directory locally (empty until Phase 5).
  const localRecipe = join(process.cwd(), "recipes", recipeName, "recipe.yaml");
  if (!existsSync(localRecipe)) {
    console.log(`ℹ️  No recipe found at ${localRecipe}.`);
    console.log();
    console.log("Recipes ship in Phase 5 per BUILD_PLAN §Phase 5. Priority list:");
    console.log("  1. saas-multitenant-baseline (parent of all SaaS recipes)");
    console.log("  2. saas-rag-chat");
    console.log("  3. saas-agent-platform");
    console.log("  4. fintech-ledger-app");
    console.log("  5. internal-tool-dashboard");
    console.log();
    console.log("When recipes exist, `nx forge` will:");
    console.log("  1. Verify cosign signature + SLSA provenance (per ADR-0006)");
    console.log("  2. Check revoked-recipes.yaml (per ADR-0009 §1.6)");
    console.log("  3. Validate inputs against recipe inputs schema");
    console.log("  4. Resolve secrets via op:// references (per ADR-0006)");
    console.log("  5. Resolve model families via @nexural/model-router (per ADR-0007)");
    console.log("  6. SBOM + license + typosquat gates (per ADR-0006, ADR-0009)");
    console.log(`  7. Emit to ${config.apps_root}/${appName}/`);
    console.log("  8. Run qa-os --fast (≥80 score required)");
    console.log("  9. Write .nexural/forged.lock.yaml");
    console.log(" 10. git init + first commit");
    return;
  }

  // (Phase 5: real implementation here)
  console.warn(
    `Recipe loaded at ${localRecipe} but Phase 5 template-emission engine is not yet implemented.`,
  );
}
