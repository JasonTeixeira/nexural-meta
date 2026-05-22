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
  .command("forge <recipe> <name>")
  .description("Emit a new app from a signed recipe (Phase 5)")
  .action(async (recipe: string, name: string) => {
    await withTelemetry(config, "forge", [recipe, name], () => runForge(config, recipe, name));
  });

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
