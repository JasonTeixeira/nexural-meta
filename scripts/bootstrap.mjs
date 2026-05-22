#!/usr/bin/env node
/**
 * bootstrap.mjs — cold-start a laptop from scratch.
 *
 * Verifies tool versions, clones all federation warehouses, sets up ~/.nexural/.
 *
 * VERIFICATION.md §2 mandates ≤ 30 min RTO; this script is the operational
 * implementation of that target.
 *
 * Usage:
 *   node scripts/bootstrap.mjs                   # default: ~/code/nexural/warehouses/
 *   node scripts/bootstrap.mjs --root=/path
 *   node scripts/bootstrap.mjs --check-only      # only verify env, don't clone
 */

import { execFile } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";
import { readFile } from "node:fs/promises";

const exec = promisify(execFile);

const REQUIRED = {
  node: { cmd: "node --version", min: "v22" },
  pnpm: { cmd: "pnpm --version", min: "10" },
  gh: { cmd: "gh --version", min: "2." },
  git: { cmd: "git --version", min: "2." },
  age: { cmd: "age --version", min: "v1." },
  sops: { cmd: "sops --version", min: "3." },
  rclone: { cmd: "rclone --version", min: "v1." },
  cosign: { cmd: "cosign version", min: "v3." },
  op: { cmd: "op --version", min: "2." },
  terraform: { cmd: "terraform --version", min: "v1." },
  jq: { cmd: "jq --version", min: "jq-1." },
};

const ARGS = parseArgs(process.argv.slice(2));
const ROOT = resolve(ARGS.root.replace(/^~/, homedir()));

async function main() {
  const t0 = Date.now();
  console.log("🚀 Nexural bootstrap — verifying environment...\n");

  // 1. Verify tools
  const missing = await checkTools();
  if (missing.length > 0) {
    console.error("\n❌ Required tools missing:");
    for (const m of missing) console.error(`   - ${m}`);
    console.error(
      "\nInstall via Homebrew:\n   brew install age sops rclone cosign 1password-cli terraform jq\n",
    );
    process.exit(1);
  }
  console.log("✓ all required tools present\n");

  if (ARGS.checkOnly) {
    console.log("(--check-only) Skipping clone phase.");
    return;
  }

  // 2. Make ~/.nexural/
  const nexuralDir = join(homedir(), ".nexural");
  if (!existsSync(nexuralDir)) {
    mkdirSync(nexuralDir, { recursive: true });
    console.log(`✓ created ${nexuralDir}`);
  }

  // 3. Make warehouses root
  if (!existsSync(ROOT)) {
    mkdirSync(ROOT, { recursive: true });
    console.log(`✓ created ${ROOT}`);
  }

  // 4. Clone discovered warehouses
  await cloneFromRegistry("registry-factory.yaml", ROOT);
  await cloneFromRegistry("registry-lifeops.yaml", ROOT);

  // 5. Print next steps
  const seconds = Math.round((Date.now() - t0) / 1000);
  console.log(`\n✓ bootstrap complete in ${seconds}s (target ≤ 1800s per VERIFICATION §2)\n`);
  console.log("Next steps:");
  console.log("  1. Configure ~/.nexural/config.toml (see docs/SCHEMA_CHARTER §4 — nx config)");
  console.log("  2. Configure 1Password CLI: op signin");
  console.log("  3. (Phase 5) Enroll YubiKey for private-tier warehouses");
  console.log("  4. Subscribe to OPS_CALENDAR via: pnpm ops-calendar > ~/nexural-ops.ics\n");
}

function parseArgs(argv) {
  const args = { root: "~/code/nexural/warehouses", checkOnly: false };
  for (const a of argv) {
    if (a.startsWith("--root=")) args.root = a.split("=")[1];
    else if (a === "--check-only") args.checkOnly = true;
  }
  return args;
}

async function checkTools() {
  const missing = [];
  for (const [name, { cmd, min }] of Object.entries(REQUIRED)) {
    try {
      const [bin, ...flags] = cmd.split(" ");
      const { stdout } = await exec(bin, flags);
      const ver = stdout.split("\n")[0].trim();
      if (!ver.includes(min) && !ver.startsWith(min)) {
        console.warn(`⚠ ${name}: found "${ver}" but expected ${min}+`);
      } else {
        console.log(`  ✓ ${name}: ${ver}`);
      }
    } catch (e) {
      missing.push(`${name} (run: ${REQUIRED[name].cmd})`);
    }
  }
  return missing;
}

async function cloneFromRegistry(registry, root) {
  if (!existsSync(registry)) {
    console.log(`  (skip) ${registry} not present — discovery hasn't run yet`);
    return;
  }
  const content = await readFile(registry, "utf8");
  const repos = [...content.matchAll(/repo:\s*(\S+)/g)].map((m) => m[1]);
  console.log(`\n→ Cloning ${repos.length} repos from ${registry}...`);
  for (const repo of repos) {
    const name = repo
      .split("/")
      .pop()
      .replace(/\.git$/, "");
    const dest = join(root, name);
    if (existsSync(dest)) {
      try {
        await exec("git", ["-C", dest, "pull", "--ff-only", "--quiet"]);
        console.log(`  ✓ ${name} (pulled)`);
      } catch (e) {
        console.warn(`  ⚠ ${name}: pull failed — ${e.message.split("\n")[0]}`);
      }
    } else {
      try {
        await exec("git", ["clone", "--quiet", repo, dest]);
        console.log(`  ✓ ${name} (cloned)`);
      } catch (e) {
        console.warn(`  ⚠ ${name}: clone failed — ${e.message.split("\n")[0]}`);
      }
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
