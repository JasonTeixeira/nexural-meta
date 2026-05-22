/**
 * `nx new <warehouse-name>` — scaffold a new warehouse.
 *
 * Per ADR-0009 §1.5 (`nx new` moved from v1.1 → Phase 5; Phase 3 has the
 * basic functionality, Phase 5 enriches with all 4 templates).
 *
 * Phase 3: emits a single minimal warehouse template (public tier).
 * Phase 5: adds public/internal/private/mcp-only template selection.
 */

import { execFile } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";
import type { NexuralConfig } from "../config.js";

const exec = promisify(execFile);

const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface NewOptions {
  readonly federation: "factory" | "lifeops";
  readonly tier: "public" | "internal" | "private-encrypted";
  readonly dryRun?: boolean;
}

export async function runNew(
  config: NexuralConfig,
  rawName: string,
  opts: NewOptions,
): Promise<void> {
  // Normalize to `<topic>-warehouse` per NAMING.md §2.1.
  let topic = rawName;
  if (topic.endsWith("-warehouse")) topic = topic.replace(/-warehouse$/, "");
  if (!KEBAB.test(topic)) {
    console.error(`❌ "${topic}" is not kebab-case (lowercase, hyphens, no underscores).`);
    process.exitCode = 1;
    return;
  }
  if (topic === "meta" || topic === "core" || topic === "main") {
    console.error(`❌ "${topic}" is a reserved name (per NAMING.md §13).`);
    process.exitCode = 1;
    return;
  }
  if (opts.federation === "lifeops" && opts.tier === "public") {
    console.error(`❌ lifeops federation is non-public. Use --tier=internal or private-encrypted.`);
    process.exitCode = 1;
    return;
  }

  const warehouseDir = `${topic}-warehouse`;
  const target = join(config.warehouses_root, warehouseDir);

  if (existsSync(target)) {
    console.error(`❌ ${target} already exists`);
    process.exitCode = 1;
    return;
  }

  console.log(`📦 Scaffolding ${warehouseDir} in ${target}`);
  if (opts.dryRun) {
    console.log("(--dry-run) skipping file creation");
    return;
  }

  // Create dir tree
  mkdirSync(target, { recursive: true });
  mkdirSync(join(target, "content"), { recursive: true });
  mkdirSync(join(target, "playbooks"), { recursive: true });
  mkdirSync(join(target, "templates"), { recursive: true });
  mkdirSync(join(target, "mcp-server", "src"), { recursive: true });
  mkdirSync(join(target, "scripts"), { recursive: true });
  mkdirSync(join(target, ".nexural"), { recursive: true });
  mkdirSync(join(target, ".github", "workflows"), { recursive: true });

  // Emit baseline files
  const today = new Date().toISOString().slice(0, 10);
  writeFileSync(join(target, "meta.yaml"), renderMeta(topic, today, opts), "utf8");
  writeFileSync(join(target, "README.md"), renderReadme(topic, opts), "utf8");
  writeFileSync(
    join(target, "LICENSE"),
    opts.tier === "public" ? MIT_LICENSE : PROPRIETARY_LICENSE,
    "utf8",
  );
  writeFileSync(
    join(target, "CHANGELOG.md"),
    `# ${warehouseDir}\n\n## 0.0.0\n\nSeeded ${today}.\n`,
    "utf8",
  );
  writeFileSync(
    join(target, ".gitignore"),
    "node_modules\ndist\n.turbo\ncoverage\n.DS_Store\nindex.json\n",
    "utf8",
  );
  writeFileSync(
    join(target, "index.json"),
    JSON.stringify(
      {
        schema_version: 1,
        warehouse: topic,
        generated_at: new Date().toISOString(),
        generator_version: "0.0.0",
        count: 0,
        entries: [],
        health: { decayed_entries: 0, draft_entries: 0 },
      },
      null,
      2,
    ),
    "utf8",
  );

  // git init
  try {
    await exec("git", ["-C", target, "init", "-b", "main", "--quiet"]);
    await exec("git", ["-C", target, "add", "-A"]);
  } catch (e) {
    console.warn(`  ⚠ git init: ${(e as Error).message.split("\n")[0]}`);
  }

  console.log(`\n✓ Scaffolded ${warehouseDir}`);
  console.log();
  console.log("Next steps:");
  console.log(`  cd ${target}`);
  console.log(`  git commit -m "feat: seed ${warehouseDir}"`);
  console.log(
    `  gh repo create JasonTeixeira/${warehouseDir} --${opts.tier === "public" ? "public" : "private"} --source=. --remote=origin --push`,
  );
  console.log(
    `  gh repo edit JasonTeixeira/${warehouseDir} --add-topic nexural-${opts.federation}`,
  );
  console.log(`  nx sync  # picks up the new warehouse via discovery`);
}

function renderMeta(topic: string, today: string, opts: NewOptions): string {
  const isPrivate = opts.tier === "private-encrypted";
  return `schema_version: 1
name: ${topic}
tier: ${opts.tier}
description: TODO — describe this warehouse (20-500 chars).
owner: sage@nexural
created: ${today}
last_reviewed: ${today}
decay_rate_days: ${opts.federation === "factory" ? 90 : 365}
status: seeded
federation: ${opts.federation}
trust:
  encryption: ${isPrivate ? "age+sops" : "none"}
${
  isPrivate
    ? `  key_source: yubikey-primary
  recovery: 1password-emergency
  filename_strategy: ulid
`
    : ""
}backup:
  destination: b2://nexural-${opts.tier === "public" ? "public" : "private"}-backup/${topic}/
  cadence: nightly
  retention_days: 365
mcp:
  tool_prefix: ${topic}
  exposes:
    - search
cross_refs:
  consumes_from: []
  exposed_to:
    public: ${opts.tier === "public"}
    agents: true
    human: true
links:
  repo: https://github.com/JasonTeixeira/${topic}-warehouse
`;
}

function renderReadme(topic: string, opts: NewOptions): string {
  return `# ${topic}-warehouse

> TODO — describe this warehouse (≥ 20 chars).

Part of the **nexural-${opts.federation}** federation.

## Tier

\`${opts.tier}\`

## Scorecard

![scorecard](https://nexural.dev/badges/${topic}.svg)

## Local development

\`\`\`bash
pnpm install
pnpm test
\`\`\`

## Authoring

See \`docs/SCHEMA_CHARTER.md\` for frontmatter schema.

## License

${opts.tier === "public" ? "MIT" : "Proprietary — internal use only"}
`;
}

const MIT_LICENSE = `MIT License

Copyright (c) ${new Date().getFullYear()} Sage Ideas LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;

const PROPRIETARY_LICENSE = `All Rights Reserved

Copyright (c) ${new Date().getFullYear()} Sage Ideas LLC

This is proprietary content. No part of this repository may be reproduced,
distributed, or transmitted in any form or by any means without the prior
written permission of the copyright holder.
`;
