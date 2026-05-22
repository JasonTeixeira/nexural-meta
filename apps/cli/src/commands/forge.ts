/**
 * `nx forge <recipe> <slug>` — emit a new app from a recipe.
 *
 * Phase 6.5 (v0.2.0) per ADR-0011 — real emit pipeline:
 *
 *   1. Load + revocation-check recipe.yaml via @nexural/factory.loadRecipe
 *   2. Validate `--inputs <file>` JSON against recipe's inputs.zod.ts (when
 *      the inputs file is provided; for v0.2.0 we accept either a JSON file
 *      or run with empty inputs + the recipe's schema defaults)
 *   3. Resolve `op://` secret references via the 1Password CLI (`op read`).
 *      Skipped on --dry-run.
 *   4. Load template files from `recipes/<name>/templates/` (warehouse MCP
 *      fetching arrives later in Phase 6.5 as those servers come online)
 *   5. emit() via @nexural/forge-emit
 *   6. Either dry-run (print tree summary) or write to <apps_root>/<slug>/,
 *      git init, first commit, write `.nexural/forged.lock.yaml`
 *
 * Deferred for later (Phase 6.5 task #45-#48):
 *   - cosign signature verification (recipe tarball from GH Releases)
 *   - SBOM generation (cyclonedx-npm shell-out)
 *   - Warehouse MCP fetch (currently uses local recipes/<name>/templates/)
 *   - Pre/post-emit hooks
 *   - qa-os --fast post-emit gate
 */

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import { emit, writeEmitResult, type EmitContext, type TemplateFile } from "@nexural/forge-emit";
import { loadRecipe } from "@nexural/factory";
import { RevokedRecipesList } from "@nexural/schema";
import { composeForRecipe } from "@nexural/warehouse-base";
import type { NexuralConfig } from "../config.js";

const FORGE_EMIT_VERSION = "0.1.0";
const BINARY_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".ico",
  ".pdf",
  ".zip",
  ".woff",
  ".woff2",
  ".ttf",
  ".otf",
]);

export interface ForgeOptions {
  /** Path to a JSON file containing recipe inputs. */
  readonly inputsFile?: string;
  /** Print plan + tree; do not write anything. */
  readonly dryRun?: boolean;
  /** Allow writing into a non-empty output directory. */
  readonly force?: boolean;
  /** Override apps_root for this invocation (testing). */
  readonly outDir?: string;
  /**
   * Skip op:// secret resolution and use placeholder values. ONLY for slice
   * testing and conformance checks — emitted .env.local will contain
   * non-functional values. Per ADR-0011 §5 (vertical slice gate).
   */
  readonly mockSecrets?: boolean;
}

export async function runForge(
  config: NexuralConfig,
  recipeName: string,
  appSlug: string,
  opts: ForgeOptions = {},
): Promise<void> {
  if (!recipeName || !appSlug) {
    console.error("Usage: nx forge <recipe-name> <app-slug> [--inputs <file>] [--dry-run]");
    console.error("Example: nx forge saas-multitenant-baseline nexural-slice-test --dry-run");
    process.exitCode = 1;
    return;
  }

  if (!/^[a-z][a-z0-9-]{1,62}[a-z0-9]$/.test(appSlug)) {
    console.error(`✖ app slug "${appSlug}" must be kebab-case, 3-64 chars, [a-z0-9-]`);
    process.exitCode = 1;
    return;
  }

  const recipeDir = resolve(process.cwd(), "recipes", recipeName);
  const recipePath = join(recipeDir, "recipe.yaml");
  if (!existsSync(recipePath)) {
    console.error(`✖ recipe not found: ${recipePath}`);
    process.exitCode = 1;
    return;
  }

  console.log(`🔨 Forging "${appSlug}" from recipe "${recipeName}"`);
  console.log(`   recipe : ${recipePath}`);

  // 1. Load + revocation-check recipe
  const rawRecipe = parseYaml(readFileSync(recipePath, "utf8"));
  const revocationList = loadRevocationList();
  const { recipe } = loadRecipe(rawRecipe, revocationList);
  console.log(`   schema : ok (revocation: clean)`);

  // 2. Validate inputs
  const inputs = await loadAndValidateInputs(recipeDir, recipe.inputs_schema, opts.inputsFile);
  console.log(`   inputs : ok (${Object.keys(inputs).length} keys)`);

  // 3. Resolve secrets
  const useMockSecrets = opts.dryRun === true || opts.mockSecrets === true;
  const secrets = useMockSecrets
    ? mockSecretsForDryRun(recipe.secrets_required)
    : await resolveSecrets(recipe.secrets_required);
  if (useMockSecrets) {
    const tag = opts.dryRun ? "dry-run" : "slice-test";
    console.log(`   secrets: MOCK (${tag}) — emitted .env.local values are non-functional`);
  } else {
    console.log(
      `   secrets: resolved ${Object.keys(secrets).length}/${recipe.secrets_required.length}`,
    );
  }

  // 4. Load templates: warehouse contributions + recipe-local additions.
  // Each warehouse listed in recipe.warehouses[] resolves to a path under
  // <cwd>/warehouses/<name>/. Phase 7+ will swap this for MCP fetch.
  const warehousesRoot = resolve(process.cwd(), "warehouses");
  const warehouseRoots = recipe.warehouses
    .map((name) => join(warehousesRoot, name))
    .filter((p) => existsSync(p));
  const missingWarehouses = recipe.warehouses.filter((n) => !existsSync(join(warehousesRoot, n)));
  if (missingWarehouses.length > 0) {
    console.warn(`   ⚠ missing warehouses (skipped): ${missingWarehouses.join(", ")}`);
  }

  const templatesRoot = join(recipeDir, recipe.emit.template_path);
  const recipeLocalTemplates = existsSync(templatesRoot) ? await loadTemplates(templatesRoot) : [];

  // Recipe inherits its parent's eligible templates. Walk the `extends`
  // chain so a fintech recipe pulls templates declared for the SaaS baseline.
  const recipeChain = walkExtendsChain(recipe.name, recipe.extends);
  const composed = composeForRecipe({
    warehouseRoots,
    recipeName: recipeChain,
    additionalTemplates: recipeLocalTemplates,
  });
  const templates = composed.templates;
  console.log(
    `   templates: ${templates.length} (${Object.entries(composed.templateCountByWarehouse)
      .map(([wh, n]) => `${wh}=${n}`)
      .join(", ")}, recipe=${recipeLocalTemplates.length})`,
  );

  // 5. Build context + emit
  // Template authors write bare names (e.g. {{ appName }}) which resolve
  // against `inputs.*`. We merge a handful of derived aliases into inputs
  // so templates can also reference `forgedAt`, `outputLicense`, etc.
  // without reaching across namespaces.
  const forgeTimestamp = new Date().toISOString();
  const slugInputs: Record<string, unknown> = {
    ...inputs,
    slug: appSlug,
    forgedAt: forgeTimestamp,
    outputLicense: recipe.output_license,
    nexuralVersion: FORGE_EMIT_VERSION,
    recipeName: recipe.name,
    recipeVersion: recipe.version,
  };
  const ctx: EmitContext = {
    inputs: slugInputs,
    recipe: {
      name: recipe.name,
      version: recipe.version,
      description: recipe.description,
    },
    secrets,
    forge: {
      slug: appSlug,
      timestamp: forgeTimestamp,
      nexuralVersion: FORGE_EMIT_VERSION,
    },
  };

  const result = emit(templates, ctx);
  console.log(
    `   emit   : ${result.files.length} files, ${result.warnings.length} warnings, ${result.skipped.length} skipped`,
  );

  if (opts.dryRun) {
    console.log();
    console.log("Dry-run tree (would emit):");
    if (result.files.length === 0) {
      console.log("  (empty — recipe has no templates yet)");
    } else {
      for (const f of result.files.slice(0, 40)) {
        console.log(`  ${f.path}`);
      }
      if (result.files.length > 40) console.log(`  … and ${result.files.length - 40} more`);
    }
    if (result.warnings.length > 0) {
      console.log();
      console.log("Warnings:");
      for (const w of result.warnings.slice(0, 20)) {
        console.log(`  [${w.code}] ${w.message}`);
      }
    }
    return;
  }

  // 6. Write to disk + lockfile + git init
  const outRoot = opts.outDir ?? join(config.apps_root, appSlug);
  console.log(`   target : ${outRoot}`);

  if (result.files.length === 0) {
    console.warn("⚠ recipe has no templates to emit — refusing to create an empty app");
    process.exitCode = 1;
    return;
  }

  await mkdir(outRoot, { recursive: true });
  await writeEmitResult(result, { outRoot, force: opts.force ?? false });

  await writeLockfile(outRoot, {
    recipe: { name: recipe.name, version: recipe.version },
    inputs: slugInputs,
    forge: ctx.forge,
    fileCount: result.files.length,
  });

  initGitRepo(outRoot, appSlug, recipe.name);

  console.log();
  console.log(`✅ Forged "${appSlug}" → ${outRoot}`);
  console.log(`   ${result.files.length} files written.`);
  console.log(`   Lockfile: ${join(outRoot, ".nexural/forged.lock.yaml")}`);
  console.log();
  console.log("Next:");
  console.log(`  cd ${outRoot}`);
  console.log("  pnpm install");
  console.log("  pnpm dev");
}

// ── helpers ─────────────────────────────────────────────────────────────────

function walkExtendsChain(name: string, parent: string | undefined): string[] {
  // Phase 7: recipes declare a single `extends` parent. Phase 7.5+ would
  // load the parent recipe and recurse; here we stop at depth-2 because
  // baselines are top-level.
  return parent !== undefined ? [name, parent] : [name];
}

function loadRevocationList(): import("@nexural/schema").RevokedRecipesList {
  const path = resolve(process.cwd(), "security/revoked-recipes.yaml");
  const empty = {
    schema_version: 1 as const,
    generated_at: new Date().toISOString(),
    entries: [],
  };
  if (!existsSync(path)) return empty;
  const raw = parseYaml(readFileSync(path, "utf8"));
  if (raw === null || raw === undefined) return empty;
  // Tolerate the schema-strict parse failing (yaml has comments-only files
  // during early bootstrap); fall back to empty list.
  const parsed = RevokedRecipesList.safeParse(raw);
  return parsed.success ? parsed.data : empty;
}

async function loadAndValidateInputs(
  recipeDir: string,
  inputsSchemaFile: string,
  inputsFile: string | undefined,
): Promise<Record<string, unknown>> {
  const schemaPath = join(recipeDir, inputsSchemaFile);
  if (!existsSync(schemaPath)) {
    throw new Error(`inputs schema file not found: ${schemaPath}`);
  }

  // Dynamic import — try the declared file first; if it's `.ts` and not
  // resolvable (running under plain node without tsx), fall back to the
  // sibling `.js` (recipes can ship compiled inputs.zod.js for prod-CLI use).
  type ZodLike = { parse: (v: unknown) => Record<string, unknown> };
  const candidates = [schemaPath];
  if (schemaPath.endsWith(".ts")) candidates.push(schemaPath.replace(/\.ts$/, ".js"));
  let schemaModule: Record<string, unknown> | undefined;
  let lastErr: unknown;
  for (const candidate of candidates) {
    if (!existsSync(candidate)) continue;
    try {
      schemaModule = (await import(pathToFileURL(candidate).href)) as Record<string, unknown>;
      break;
    } catch (err) {
      lastErr = err;
    }
  }
  if (!schemaModule) {
    throw new Error(
      `unable to load recipe inputs schema (${candidates.join(" or ")}). Run via tsx for .ts files, or ship a compiled .js alongside. Last error: ${lastErr instanceof Error ? lastErr.message : String(lastErr)}`,
    );
  }
  const schemaCandidate = findZodSchema(schemaModule);
  if (!schemaCandidate) {
    throw new Error(
      `recipe inputs schema at ${schemaPath} does not export a Zod schema. Expected named export ending in "Inputs".`,
    );
  }

  let raw: unknown = {};
  if (inputsFile !== undefined) {
    const inputsPath = resolve(process.cwd(), inputsFile);
    if (!existsSync(inputsPath)) {
      throw new Error(`inputs file not found: ${inputsPath}`);
    }
    raw = JSON.parse(readFileSync(inputsPath, "utf8"));
  }
  return (schemaCandidate as ZodLike).parse(raw);
}

function findZodSchema(mod: Record<string, unknown>): unknown {
  for (const [key, value] of Object.entries(mod)) {
    if (/Inputs$/.test(key) && value && typeof value === "object" && "parse" in value) {
      return value;
    }
  }
  for (const value of Object.values(mod)) {
    if (value && typeof value === "object" && "parse" in value && "safeParse" in value) {
      return value;
    }
  }
  return undefined;
}

async function loadTemplates(root: string): Promise<TemplateFile[]> {
  const files: TemplateFile[] = [];
  async function walk(dir: string): Promise<void> {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
        continue;
      }
      if (!entry.isFile()) continue;
      const sourcePath = relative(root, full);
      // Strip `.template` suffix to get target path.
      const targetPath = sourcePath.replace(/\.template$/, "");
      const isBinary = (() => {
        const dot = targetPath.lastIndexOf(".");
        if (dot < 0) return false;
        return BINARY_EXTENSIONS.has(targetPath.slice(dot).toLowerCase());
      })();
      const body = isBinary ? "" : await readFile(full, "utf8");
      files.push({
        sourcePath,
        targetPath,
        body,
        binary: isBinary,
        mode: statSync(full).mode & 0o777,
      });
    }
  }
  await walk(root);
  return files;
}

async function resolveSecrets(
  declared: ReadonlyArray<{ logical_name: string; op_path: string; target_var: string }>,
): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  for (const sec of declared) {
    try {
      const value = execFileSync("op", ["read", sec.op_path], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      }).trim();
      out[sec.target_var] = value;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(
        `failed to resolve secret "${sec.logical_name}" via "op read ${sec.op_path}": ${msg}\n` +
          `Hint: run \`op signin\` and ensure the 1Password vault entry exists. To dry-run without secrets, pass --dry-run.`,
      );
    }
  }
  return out;
}

function mockSecretsForDryRun(
  declared: ReadonlyArray<{ target_var: string }>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const s of declared) {
    out[s.target_var] = `MOCK_VALUE_FOR_${s.target_var}_dry_run_only`;
  }
  return out;
}

async function writeLockfile(
  outRoot: string,
  payload: {
    recipe: { name: string; version: string };
    inputs: Record<string, unknown>;
    forge: { slug: string; timestamp: string; nexuralVersion: string };
    fileCount: number;
  },
): Promise<void> {
  const dir = join(outRoot, ".nexural");
  await mkdir(dir, { recursive: true });
  const lockfile = {
    schema_version: 1,
    forged_at: payload.forge.timestamp,
    forge_version: payload.forge.nexuralVersion,
    recipe: payload.recipe,
    inputs: payload.inputs,
    file_count: payload.fileCount,
    // Phase 6.5 stops here. Phase 7+ adds: warehouses_consumed[], sbom_sha,
    // signature, provenance_url per ADR-0006.
  };
  await writeFile(join(dir, "forged.lock.yaml"), stringifyYaml(lockfile), "utf8");
}

function initGitRepo(outRoot: string, slug: string, recipeName: string): void {
  try {
    execFileSync("git", ["init", "--quiet", "--initial-branch=main"], {
      cwd: outRoot,
      stdio: ["ignore", "ignore", "pipe"],
    });
    execFileSync("git", ["add", "-A"], { cwd: outRoot, stdio: ["ignore", "ignore", "pipe"] });
    execFileSync(
      "git",
      [
        "commit",
        "-q",
        "--no-verify",
        "-m",
        `chore: initial forge from ${recipeName}\n\n[forge] ${slug}`,
      ],
      { cwd: outRoot, stdio: ["ignore", "ignore", "pipe"] },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`⚠ git init/commit skipped: ${msg}`);
  }
}
