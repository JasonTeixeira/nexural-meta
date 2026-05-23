import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "html"],
      include: ["src/**/*.ts", "src/**/*.tsx"],
      // CLI commands that shell out / spawn / serve HTTP / render Ink are
      // covered by integration + manual smoke tests, not vitest units.
      // Coverage applies to the testable surface (config, telemetry, ask,
      // new, verify) — the load-bearing logic.
      exclude: [
        "src/index.ts",
        "src/bin/**",
        "src/ui/**.tsx",
        "src/commands/audit.ts", // spawns child processes (adversarial harness + forge)
        "src/commands/serve.ts", // long-running HTTP server; manual smoke test
        "src/commands/forge.ts", // shells out to op + git + spawns processes
        "src/commands/health.tsx", // Ink UI
        "src/commands/open.ts", // shells out to $EDITOR
        "src/commands/play.ts", // shells out per playbook
        "src/commands/session.ts", // edits STATE.md
        "src/commands/sync.ts", // shells out to git per warehouse
        "src/**/*.d.ts",
      ],
      thresholds: {
        lines: 75,
        branches: 70,
        functions: 80,
        statements: 75,
      },
    },
  },
});
