/**
 * Forged-app lockfile writer per ADR-0006 §1.
 *
 * Every `nx forge` writes `.nexural/forged.lock.yaml` in the emitted app.
 * The lockfile pins recipe + warehouse SHAs, inputs, and SBOM hash.
 * `nx upgrade` reads this file to compute clean diffs.
 */

import type { ForgedLockfile } from "@nexural/schema";
import { ForgedLockfile as ForgedLockfileSchema } from "@nexural/schema";

/**
 * Build (but don't write to disk) a forged lockfile.
 * Validates the result against the schema.
 */
export function buildLockfile(input: {
  forgedByNxVersion: string;
  recipe: ForgedLockfile["recipe"];
  warehousesConsumed: ForgedLockfile["warehouses_consumed"];
  inputs: Record<string, unknown>;
  modelFamiliesUsed: ReadonlyArray<string>;
  sbomHash: string;
  forgedAtMs?: number;
}): ForgedLockfile {
  const forgedAt = new Date(input.forgedAtMs ?? Date.now()).toISOString();
  const lockfile: ForgedLockfile = {
    schema_version: 1,
    forged_at: forgedAt,
    forged_by_nx_version: input.forgedByNxVersion,
    recipe: input.recipe,
    warehouses_consumed: [...input.warehousesConsumed],
    inputs: input.inputs,
    model_families_used: [...input.modelFamiliesUsed],
    sbom_hash: input.sbomHash,
  };
  // Re-parse to enforce schema invariants (and throw on misuse).
  return ForgedLockfileSchema.parse(lockfile);
}
