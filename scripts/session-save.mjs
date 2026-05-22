#!/usr/bin/env node
/**
 * session-save.mjs — update STATE.md at end of every session per ADR-0008 §5.
 *
 * Reads the current git state + appends a history entry.
 *
 * Usage:
 *   node scripts/session-save.mjs --note "What changed this session"
 *   node scripts/session-save.mjs --note "..." --phase=2
 */

import { execFile } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { promisify } from "node:util";

const exec = promisify(execFile);

const ARGS = parseArgs(process.argv.slice(2));

async function main() {
  if (!ARGS.note) {
    console.error('Usage: node scripts/session-save.mjs --note "What changed"');
    process.exit(1);
  }

  const { stdout: shaOut } = await exec("git", ["rev-parse", "--short", "HEAD"]);
  const sha = shaOut.trim();
  const { stdout: msgOut } = await exec("git", ["log", "-1", "--pretty=%s"]);
  const subject = msgOut.trim();
  const dateIso = new Date().toISOString().slice(0, 10);

  const state = await readFile("STATE.md", "utf8");
  const newEntry = `- **${dateIso}:** ${ARGS.note} (commit \`${sha}\` — ${subject})`;

  const historyMarker = "## History";
  if (!state.includes(historyMarker)) {
    console.error(`STATE.md missing "${historyMarker}" section.`);
    process.exit(1);
  }

  const lines = state.split("\n");
  const idx = lines.findIndex((l) => l.startsWith(historyMarker));
  // Find next non-blank line after the header / preamble:
  let inserted = false;
  for (let i = idx + 1; i < lines.length; i++) {
    if (lines[i].startsWith("- **")) {
      // Insert above the first existing entry
      lines.splice(i, 0, newEntry);
      inserted = true;
      break;
    }
    if (lines[i].startsWith("## ")) {
      // Next section started without any entries — insert before it
      lines.splice(i, 0, newEntry, "");
      inserted = true;
      break;
    }
  }
  if (!inserted) {
    // Append at end
    lines.push(newEntry);
  }

  // Also update Last commit + Last touched lines if present
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("- **Last commit:**")) {
      lines[i] = `- **Last commit:** \`${sha}\` — "${subject}"`;
    } else if (lines[i].startsWith("- **Last touched:**")) {
      lines[i] = `- **Last touched:** ${dateIso}`;
    }
  }

  await writeFile("STATE.md", lines.join("\n"), "utf8");
  console.log(`✓ STATE.md updated — appended history entry for ${sha}`);
}

function parseArgs(argv) {
  const args = { note: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--note") args.note = argv[++i];
    else if (argv[i].startsWith("--note=")) args.note = argv[i].split("=").slice(1).join("=");
  }
  return args;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
