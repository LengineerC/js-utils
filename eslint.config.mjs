import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier";
import globals from 'globals';

const baseConfig = {
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      project: "./tsconfig.json",
      tsconfigRootDir: process.cwd(),
      EXPERIMENTAL_useProjectService: true,
    },
  },
  plugins: {
    "@typescript-eslint": tseslint.plugin,
    prettier: eslintPluginPrettier,
  },
  rules: {
    ...eslint.configs.recommended.rules,
    ...tseslint.configs.recommended.rules,
    ...prettier.rules,
    "prettier/prettier": ["error", { endOfLine: "auto" }],
    'no-unused-vars': 'off',
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", 'varsIgnorePattern': '^_' }],
    "no-console": "off",
  },
};

// const nodeBrowserGlobals = {
//   window: "readonly",
//   document: "readonly",
//   console: "readonly",
//   process: "readonly",
//   setTimeout: "readonly",
//   clearTimeout: "readonly",
//   setInterval: "readonly",
//   clearInterval: "readonly",
//   global: "readonly",
// };

// const jestGlobals = {
//   describe: "readonly",
//   it: "readonly",
//   test: "readonly",
//   expect: "readonly",
//   beforeAll: "readonly",
//   afterAll: "readonly",
//   beforeEach: "readonly",
//   afterEach: "readonly",
// };

export default [
  {
    ignores: ["dist", "node_modules", 'docs', '__test__', 'scripts', 'coverage', '.husky', '.idea', '.vscode']
  },

  {
    files: ["src/**/*.ts"],
    ...baseConfig,
    languageOptions: {
      ...baseConfig.languageOptions,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["*.ts"],
    ...baseConfig,
    languageOptions: {
      ...baseConfig.languageOptions,
      globals: {
        console: "readonly",
        process: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
      },
    },
  },
];
