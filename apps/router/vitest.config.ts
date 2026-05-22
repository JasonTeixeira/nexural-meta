import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "html"],
      include: ["src/**/*.ts"],
      exclude: ["src/index.ts", "src/bin/**", "src/**/*.d.ts"],
      thresholds: {
        lines: 45,
        branches: 45,
        functions: 55,
        statements: 45,
      },
    },
  },
});
