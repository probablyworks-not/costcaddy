import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Design sources: reference-only .dc.html markup + logic classes, and the
    // docs tree. Never linted, never shipped — see CLAUDE.md "Design source files".
    "F&B Controller audit platform/**",
    "fnb-controller-docs/**",
  ]),
]);

export default eslintConfig;
