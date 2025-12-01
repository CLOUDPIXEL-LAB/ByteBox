import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    "node_modules/**",
    "bower_components/**",
    "dist/**",
    "coverage/**",
    "public/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "DEV/**",
    // Additional ignores:
    "scripts/**",
    "eslint.config.mjs",
  ]),
]);

export default eslintConfig;
