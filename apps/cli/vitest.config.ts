import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "html"],
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: [
        "src/index.ts",
        "src/bin/**",
        "src/ui/**.tsx", // Ink UI components — tested via snapshots later
        "src/**/*.d.ts",
      ],
      // CLI coverage is intentionally permissive — most commands shell out to
      // git/$EDITOR or render Ink (covered by integration tests in Phase 4).
      // Unit tests target the testable surface: config, telemetry, new scaffolder.
      thresholds: {
        lines: 40,
        branches: 40,
        functions: 50,
        statements: 40,
      },
    },
  },
});
