import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  // Never lint build output or deps
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "coverage/**",
      "playwright-report/**",
      ".vite/**",
    ],
  },

  // TypeScript: enable TS parser so ESLint can parse TS syntax
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      // browser globals handled by TS; avoid noisy failures
      "no-undef": "off",
    },
  },

  // JS configs/scripts
  {
    files: ["**/*.{js,jsx}"],
    rules: {
      "no-undef": "off",
    },
  },
];
