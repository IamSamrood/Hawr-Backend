// import globals from "globals";
// import pluginJs from "@eslint/js";


// /** @type {import('eslint').Linter.Config[]} */
// export default [
//   {languageOptions: { globals: globals.browser }},
//   pluginJs.configs.recommended,
// ];

import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config} */
const config = {
  languageOptions: {
    globals: globals.browser,
  },
  ...pluginJs.configs.recommended,
  rules: {
    "no-unused-vars": "warn",
    "unused-imports/no-unused-imports": "warn",
  },
  plugins: ["unused-imports"],
};

export default config;
