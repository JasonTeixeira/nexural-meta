import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "html"],
      include: ["src/**/*.ts"],
      exclude: ["src/index.ts", "src/bin/**/*.ts", "src/**/*.d.ts"],
      thresholds: {
        lines: 75,
        branches: 70,
        functions: 80,
        statements: 75,
      },
    },
  },
});
