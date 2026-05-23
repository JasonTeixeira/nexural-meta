import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "html"],
      include: ["src/**/*.ts"],
      // mcp-client.ts is integration-tested by spawning the real
      // @nexural/warehouse-server binary (test/mcp-client.test.ts skips in
      // environments where the binary isn't built). It's covered in dev
      // + on tag-publish runs, just not at the per-package unit level.
      exclude: ["src/index.ts", "src/mcp-client.ts", "src/**/*.d.ts"],
      thresholds: {
        lines: 80,
        branches: 75,
        functions: 85,
        statements: 80,
      },
    },
  },
});
