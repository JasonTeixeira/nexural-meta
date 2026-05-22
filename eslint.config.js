// @ts-check
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    files: ["packages/*/src/**/*.ts", "apps/*/src/**/*.ts", "scripts/**/*.mjs"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        project: false,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // SCHEMA_CHARTER §1: no `any`, no `unknown` in public schemas
      "@typescript-eslint/no-explicit-any": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // AI_HANDOFF "no TODO: fix later" — enforce via lint
      "no-warning-comments": ["warn", { terms: ["TODO", "FIXME", "XXX"], location: "start" }],
    },
  },
  prettierConfig,
];
