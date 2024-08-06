import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      ecmaVersion: "latest",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "no-console": "off",
      "indent": ["error", 2],
      "quotes": ["error", "single"],
      "semi": ["error", "always"],
    },
  },
  pluginJs.configs.recommended,
];
