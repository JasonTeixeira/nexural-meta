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
import { runAudit } from "../commands/audit.js";
import { runForge } from "../commands/forge.js";
import { runHealth } from "../commands/health.js";
import { runNew } from "../commands/new.js";
import { runOpen } from "../commands/open.js";
import { runPlay } from "../commands/play.js";
import { runServe } from "../commands/serve.js";
import { runSessionSave } from "../commands/session.js";
import { runSync } from "../commands/sync.js";
import { runVerify } from "../commands/verify.js";

const program = new Command();
const config = loadConfig();

program
  .name("nx")
  .description("Nexural Federation CLI — single human-facing command")
  .version("0.1.0");

program
  .command("ask <query>")
  .description("Federation-wide search across constitution, ADRs, warehouses, recipes")
  .option("--kinds <list>", "comma-separated kinds: constitution,adr,warehouse-doc,recipe-doc,eval")
  .option("--limit <n>", "max results", "5")
  .option("--json", "machine-readable JSON output")
  .action(async (query: string, opts: { kinds?: string; limit?: string; json?: boolean }) => {
    await withTelemetry(config, "ask", [query], () =>
      runAsk(config, query, {
        ...(opts.kinds !== undefined ? { kinds: opts.kinds } : {}),
        ...(opts.limit !== undefined ? { limit: parseInt(opts.limit, 10) } : {}),
        ...(opts.json !== undefined ? { json: opts.json } : {}),
      }),
    );
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
  .command("audit")
  .description("Federation-wide stress check: runners + adversarial (forge dry-runs opt-in)")
  .option("--skip-adversarial", "skip adversarial harness")
  .option("--with-forge", "ALSO run forge dry-runs (slow first time, ~10s+)")
  .option("--json", "JSON-only output")
  .action(async (opts: { skipAdversarial?: boolean; withForge?: boolean; json?: boolean }) => {
    await withTelemetry(config, "audit", [], () =>
      runAudit(config, {
        ...(opts.skipAdversarial !== undefined ? { skipAdversarial: opts.skipAdversarial } : {}),
        ...(opts.withForge !== undefined ? { withForge: opts.withForge } : {}),
        ...(opts.json !== undefined ? { json: opts.json } : {}),
      }),
    );
  });

program
  .command("forge <recipe> <slug>")
  .description("Emit a new app from a recipe (per ADR-0011)")
  .option("--inputs <file>", "JSON file with recipe inputs")
  .option("--dry-run", "render + validate without writing to disk")
  .option("--force", "allow writing into a non-empty target directory")
  .option("--out-dir <dir>", "override apps_root for this invocation (testing)")
  .option("--mock-secrets", "skip op:// resolution; emit placeholder secrets (slice testing only)")
  .action(
    async (
      recipe: string,
      slug: string,
      opts: {
        inputs?: string;
        dryRun?: boolean;
        force?: boolean;
        outDir?: string;
        mockSecrets?: boolean;
      },
    ) => {
      const flags = [
        recipe,
        slug,
        opts.dryRun ? "--dry-run" : "",
        opts.mockSecrets ? "--mock-secrets" : "",
        opts.inputs ? `--inputs=${opts.inputs}` : "",
      ].filter(Boolean);
      await withTelemetry(config, "forge", flags, () =>
        runForge(config, recipe, slug, {
          ...(opts.inputs !== undefined ? { inputsFile: opts.inputs } : {}),
          ...(opts.dryRun !== undefined ? { dryRun: opts.dryRun } : {}),
          ...(opts.force !== undefined ? { force: opts.force } : {}),
          ...(opts.outDir !== undefined ? { outDir: opts.outDir } : {}),
          ...(opts.mockSecrets !== undefined ? { mockSecrets: opts.mockSecrets } : {}),
        }),
      );
    },
  );

program
  .command("verify <url>")
  .description("Smoke-check a deployed app (ADR-0011 gate 5)")
  .option("--evidence-slug <slug>", "write JSON report to evidence/gate-5/<slug>/")
  .option("--skip-health", "skip /api/health check")
  .option("--timeout <ms>", "per-request timeout in milliseconds", "10000")
  .action(
    async (
      url: string,
      opts: { evidenceSlug?: string; skipHealth?: boolean; timeout?: string },
    ) => {
      await withTelemetry(config, "verify", [url, opts.evidenceSlug ?? ""], () =>
        runVerify(config, url, {
          ...(opts.evidenceSlug !== undefined ? { evidenceSlug: opts.evidenceSlug } : {}),
          ...(opts.skipHealth !== undefined ? { skipHealth: opts.skipHealth } : {}),
          ...(opts.timeout !== undefined ? { timeoutMs: parseInt(opts.timeout, 10) } : {}),
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

program
  .command("serve")
  .description("Run the federation as a long-running HTTP daemon (localhost:7345)")
  .option("--port <n>", "HTTP port (default 7345)")
  .option("--host <host>", "bind host (default 127.0.0.1)")
  .option("--root <path>", "federation root override")
  .action(async (opts: { port?: string; host?: string; root?: string }) => {
    await withTelemetry(config, "serve", [opts.port ?? "7345"], () =>
      runServe(config, {
        ...(opts.port !== undefined ? { port: parseInt(opts.port, 10) } : {}),
        ...(opts.host !== undefined ? { host: opts.host } : {}),
        ...(opts.root !== undefined ? { root: opts.root } : {}),
      }),
    );
  });

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
