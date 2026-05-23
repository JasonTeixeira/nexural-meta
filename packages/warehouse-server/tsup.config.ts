import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/bin/nexural-warehouse-server.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  target: "node22",
  splitting: false,
  treeshake: true,
});
