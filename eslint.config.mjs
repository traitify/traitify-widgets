import {defineConfig, globalIgnores} from "eslint/config";
import traitifyBabel from "eslint-config-traitify/babel";
import traitifyJest from "eslint-config-traitify/jest";
import traitifyReact from "eslint-config-traitify/react";
import traitifyWebpack from "eslint-config-traitify/webpack";
import _import from "eslint-plugin-import";

const configFiles = ["**/*.config.js", "**/*.config.mjs"];
const defaultConfig = {
  extends: [
    traitifyReact,
    traitifyBabel,
    traitifyWebpack
  ],
  plugins: {import: _import},
  rules: {
    "import/order": [
      "error",
      {
        "groups": [
          "external",
          "internal",
          "sibling",
          "parent"
        ],
        "newlines-between": "never",
        "alphabetize": {
          order: "asc",
          caseInsensitive: true
        }
      }
    ]
  },
  settings: {
    "import/resolver": {
      node: true,
      webpack: {config: "webpack.config.js"}
    }
  }
};

export default defineConfig([
  globalIgnores(["build/*", "packages/*", "public/*"]),
  {
    ...defaultConfig,
    ignores: [...configFiles, "test/**"]
  },
  {
    ...defaultConfig,
    files: configFiles,
    rules: {
      ...defaultConfig.rules,
      "global-require": "off",
      "import/no-extraneous-dependencies": "off"
    }
  },
  {
    ...defaultConfig,
    extends: [
      ...defaultConfig.extends,
      traitifyJest
    ],
    files: ["test/**"],
    ignores: configFiles,
    rules: {
      ...defaultConfig.rules
    },
    settings: {
      ...defaultConfig.settings,
      "import/resolver": {
        jest: {jestConfigFile: "test/jest.config.js"}
      }
    }
  }
]);
