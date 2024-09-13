import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    files: ["src/**/*.{js,mjs,cjs,ts}"],
    rules: {
      "semi": ["error", "always"],
      "object-curly-spacing": ["error", "always"],
      "max-len": ["error", { "code": 120, "tabWidth": 4 }],
      "indent": ["error", 4, { "SwitchCase": 1 }]
    },
  },
  { files: ["**/*.js"], languageOptions: { sourceType: "script" } },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];