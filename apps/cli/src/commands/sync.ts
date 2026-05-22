/**
 * `nx sync [--factory|--lifeops]` — git pull all warehouses per registry.
 *
 * Per ADR-0010 §2.3: auto-stash on local changes, alert user.
 */

import { execFile } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";
import type { NexuralConfig } from "../config.js";

const exec = promisify(execFile);

export interface SyncOptions {
  readonly federation: "factory" | "lifeops" | "both";
  readonly force?: boolean;
}

export async function runSync(config: NexuralConfig, opts: SyncOptions): Promise<void> {
  const registries =
    opts.federation === "both"
      ? ["registry-factory.yaml", "registry-lifeops.yaml"]
      : [`registry-${opts.federation}.yaml`];

  let totalPulled = 0;
  let totalSkipped = 0;
  let totalConflicts = 0;

  for (const reg of registries) {
    if (!existsSync(reg)) {
      console.warn(`  ⚠ ${reg} not present — run \`pnpm discover\` first`);
      continue;
    }
    const repos = extractRepos(readFileSync(reg, "utf8"));
    console.log(`→ Syncing ${repos.length} repos from ${reg}...`);

    for (const repo of repos) {
      const name = repoName(repo);
      const dest = join(config.warehouses_root, name);
      const result = await syncOne(repo, dest, opts.force ?? false);
      if (result === "pulled") totalPulled++;
      else if (result === "conflict") totalConflicts++;
      else totalSkipped++;
    }
  }

  console.log(
    `\n✓ sync complete — ${totalPulled} pulled, ${totalSkipped} clean, ${totalConflicts} conflicts`,
  );
  if (totalConflicts > 0) {
    console.warn(
      `\n  ${totalConflicts} conflict(s) — review stashes with: cd <repo>; git stash list`,
    );
  }
}

async function syncOne(
  repo: string,
  dest: string,
  force: boolean,
): Promise<"pulled" | "clean" | "conflict"> {
  const name = repoName(repo);

  if (!existsSync(dest)) {
    try {
      await exec("git", ["clone", "--quiet", repo, dest]);
      console.log(`  ✓ ${name} cloned`);
      return "pulled";
    } catch (e) {
      console.warn(`  ⚠ ${name}: clone failed — ${truncate(asMessage(e))}`);
      return "clean";
    }
  }

  // Check for local changes
  const { stdout: status } = await exec("git", ["-C", dest, "status", "--porcelain"]);
  const hasLocal = status.trim().length > 0;

  if (hasLocal && !force) {
    const stashName = `nexural-sync-${new Date().toISOString()}`;
    try {
      await exec("git", ["-C", dest, "stash", "push", "-u", "-m", stashName]);
      console.log(`  ⚠ ${name} had local changes — stashed as "${stashName}"`);
    } catch (e) {
      console.warn(`  ⚠ ${name}: could not stash — ${truncate(asMessage(e))}`);
      return "conflict";
    }
  }

  try {
    await exec("git", ["-C", dest, "pull", "--ff-only", "--quiet"]);
    console.log(`  ✓ ${name}`);
    return "pulled";
  } catch (e) {
    console.warn(`  ⚠ ${name}: pull failed — ${truncate(asMessage(e))}`);
    return "conflict";
  }
}

function extractRepos(yamlContent: string): string[] {
  return [...yamlContent.matchAll(/repo:\s*(\S+)/g)].map((m) => m[1]!);
}

function repoName(repoUrl: string): string {
  return (
    repoUrl
      .split("/")
      .pop()
      ?.replace(/\.git$/, "") ?? "unknown"
  );
}

function asMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  return String(e);
}

function truncate(s: string, max = 120): string {
  const oneLine = s.split("\n")[0] ?? "";
  return oneLine.length > max ? oneLine.slice(0, max) + "..." : oneLine;
}
