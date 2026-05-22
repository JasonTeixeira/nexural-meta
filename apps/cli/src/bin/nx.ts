/**
 * `nx` CLI entry point. Per ARCHITECTURE.md §4.1.
 *
 * Commander assembles the command tree. Every command runs through
 * `withTelemetry` so usage is captured per SCHEMA_CHARTER §4.5.
 */

import { Command } from "commander";
import { loadConfig } from "../config.js";
import { withTelemetry, closeTelemetry } from "../telemetry.js";
import { runAsk } from "../commands/ask.js";
import { runForge } from "../commands/forge.js";
import { runHealth } from "../commands/health.js";
import { runNew } from "../commands/new.js";
import { runOpen } from "../commands/open.js";
import { runPlay } from "../commands/play.js";
import { runSessionSave } from "../commands/session.js";
import { runSync } from "../commands/sync.js";

const program = new Command();
const config = loadConfig();

program
  .name("nx")
  .description("Nexural Federation CLI — single human-facing command")
  .version("0.1.0");

program
  .command("ask <query>")
  .description("Synthesize an answer from federation warehouses with citations")
  .action(async (query: string) => {
    await withTelemetry(config, "ask", [query], () => runAsk(config, query));
  });

program
  .command("sync")
  .description("Pull all federation warehouses to local cache")
  .option("--factory", "only factory federation")
  .option("--lifeops", "only lifeops federation")
  .option("--force", "skip auto-stash on local changes (per ADR-0010 §2.3)")
  .action(async (opts: { factory?: boolean; lifeops?: boolean; force?: boolean }) => {
    const federation: "factory" | "lifeops" | "both" = opts.factory
      ? "factory"
      : opts.lifeops
        ? "lifeops"
        : "both";
    await withTelemetry(config, "sync", [federation, opts.force ? "--force" : ""], () =>
      runSync(config, { federation, force: opts.force ?? false }),
    );
  });

program
  .command("health")
  .description("Terminal dashboard — federations, scorecard, decay")
  .action(async () => {
    await withTelemetry(config, "health", [], () => runHealth(config));
  });

program
  .command("open <warehouse>")
  .description("cd into a warehouse + launch $EDITOR")
  .action(async (warehouse: string) => {
    await withTelemetry(config, "open", [warehouse], () => runOpen(config, warehouse));
  });

program
  .command("forge <recipe> <slug>")
  .description("Emit a new app from a recipe (per ADR-0011)")
  .option("--inputs <file>", "JSON file with recipe inputs")
  .option("--dry-run", "render + validate without writing to disk")
  .option("--force", "allow writing into a non-empty target directory")
  .option("--out-dir <dir>", "override apps_root for this invocation (testing)")
  .action(
    async (
      recipe: string,
      slug: string,
      opts: { inputs?: string; dryRun?: boolean; force?: boolean; outDir?: string },
    ) => {
      const flags = [
        recipe,
        slug,
        opts.dryRun ? "--dry-run" : "",
        opts.inputs ? `--inputs=${opts.inputs}` : "",
      ].filter(Boolean);
      await withTelemetry(config, "forge", flags, () =>
        runForge(config, recipe, slug, {
          ...(opts.inputs !== undefined ? { inputsFile: opts.inputs } : {}),
          ...(opts.dryRun !== undefined ? { dryRun: opts.dryRun } : {}),
          ...(opts.force !== undefined ? { force: opts.force } : {}),
          ...(opts.outDir !== undefined ? { outDir: opts.outDir } : {}),
        }),
      );
    },
  );

program
  .command("play <playbook>")
  .description("Execute a playbook with step-by-step confirmation")
  .action(async (playbook: string) => {
    await withTelemetry(config, "play", [playbook], () => runPlay(config, playbook));
  });

program
  .command("new <warehouse-name>")
  .description("Scaffold a new warehouse (per ADR-0009 §1.5)")
  .option("--federation <fed>", "factory | lifeops", "factory")
  .option("--tier <tier>", "public | internal | private-encrypted", "public")
  .option("--dry-run", "preview without writing files")
  .action(
    async (
      name: string,
      opts: {
        federation?: "factory" | "lifeops";
        tier?: "public" | "internal" | "private-encrypted";
        dryRun?: boolean;
      },
    ) => {
      await withTelemetry(config, "new", [name, opts.federation ?? "factory"], () =>
        runNew(config, name, {
          federation: opts.federation ?? "factory",
          tier: opts.tier ?? "public",
          dryRun: opts.dryRun ?? false,
        }),
      );
    },
  );

const sessionCmd = program.command("session").description("STATE.md continuity helpers");
sessionCmd
  .command("save")
  .description("Append a session entry to STATE.md (per ADR-0008)")
  .requiredOption("--note <note>", "What changed this session")
  .action(async (opts: { note: string }) => {
    await withTelemetry(config, "session-save", [opts.note], () => runSessionSave(opts.note));
  });

process.on("exit", () => closeTelemetry());

program.parseAsync(process.argv).catch((e: unknown) => {
  console.error(e instanceof Error ? e.message : String(e));
  process.exit(1);
});
