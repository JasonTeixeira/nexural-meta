/**
 * Recipe manifest loader per ADRs 0002, 0006.
 *
 * Parses `recipe.yaml` against RecipeManifest schema.
 * Verifies the recipe is NOT in the revocation list.
 * (Signature verification happens via `cosign` shell-out — that is the
 *  responsibility of the `nx forge` command, not this library.)
 */

import type { RecipeManifest, RevokedRecipesList } from "@nexural/schema";
import { RecipeManifest as RecipeManifestSchema } from "@nexural/schema";
import { checkRevocation, type RevocationCheckResult } from "./revocation.js";

export interface LoadResult {
  readonly recipe: RecipeManifest;
  readonly revocation: RevocationCheckResult;
}

export type LoadError =
  | { readonly code: "parse_error"; readonly message: string }
  | { readonly code: "revoked"; readonly revocation: RevocationCheckResult };

/**
 * Parse + check revocation. Throws on parse error or revocation.
 *
 * Pass `{ allowRevoked: true }` to bypass revocation check (audit-only consumers).
 */
export function loadRecipe(
  rawManifest: unknown,
  revocationList: RevokedRecipesList,
  options: { allowRevoked?: boolean } = {},
): LoadResult {
  let recipe: RecipeManifest;
  try {
    recipe = RecipeManifestSchema.parse(rawManifest);
  } catch (e) {
    const message = e instanceof Error ? e.message : "invalid recipe manifest";
    const err: LoadError = { code: "parse_error", message };
    throw Object.assign(new Error(message), { cause: err });
  }

  const revocation = checkRevocation(recipe.name, recipe.version, revocationList);
  if (revocation.revoked && !options.allowRevoked) {
    const message = `Recipe ${recipe.name}@${recipe.version} is revoked: ${revocation.reason ?? "unknown reason"}`;
    const err: LoadError = { code: "revoked", revocation };
    throw Object.assign(new Error(message), { cause: err });
  }
  return { recipe, revocation };
}
