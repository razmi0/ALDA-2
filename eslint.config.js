import js from "@eslint/js";
import typescriptParser from "@typescript-eslint/parser";
import astroEslintParser from "astro-eslint-parser";
import eslintPluginAstro from "eslint-plugin-astro";
import a11y from "eslint-plugin-jsx-a11y";
import globals from "globals";
import tseslint from "typescript-eslint";
import tailwind from "eslint-plugin-tailwindcss";

/**
 * Patching the globals object to replace the globals.browser.'AudioWorkletGlobalScope  ' key by a trimmed version
 * @see https://stackoverflow.com/questions/75524079/eslint-flat-config-eslint-config-js-throwing-parsing-error-the-keyword-imp
 */
// let patchedGlobals = {};
// let patchedBrowser = {};
// for (const key in globals) {
//   if (key === "browser") {
//     for (const browserKey in globals.browser) {
//       if (browserKey === "AudioWorkletGlobalScope ") {
//         patchedBrowser["AudioWorkletGlobalScope"] = false;
//         continue;
//       }
//       patchedBrowser[browserKey] = globals.browser[browserKey];
//     }
//     patchedGlobals[key] = patchedBrowser;
//     continue;
//   }
//   patchedGlobals[key] = globals[key];
// }
export default [
  ...tailwind.configs["flat/recommended"],
  js.configs.recommended,
  ...eslintPluginAstro.configs["flat/recommended"],
  ...tseslint.configs.recommended,

  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  {
    files: ["**/*.{js,jsx,astro}"],
    plugins: { "jsx-a11y": a11y },
    rules: {
      ...a11y.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: astroEslintParser,
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"],
      },
    },
  },
  {
    files: ["**/*.{js,jsx,astro}"],
    rules: {
      "no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
    },
  },
  {
    // Define the configuration for `<script>` tag.
    // Script in `<script>` is assigned a virtual file name with the `.js` extension.
    files: ["**/*.{ts,tsx}", "**/*.astro/*.js"],
    languageOptions: {
      parser: typescriptParser,
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
  {
    ignores: ["dist", "node_modules", ".github", "types.generated.d.ts"],
  },
];
