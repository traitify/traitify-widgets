import {defineConfig, globalIgnores} from "eslint/config";
import traitifyBabel from "eslint-config-traitify/babel";
import traitifyJest from "eslint-config-traitify/jest";
import traitifyReact from "eslint-config-traitify/react";
import traitifyWebpack from "eslint-config-traitify/webpack";
import _import from "eslint-plugin-import";

export default defineConfig([
  globalIgnores(["build/*", "packages/*", "public/*"]),
  {
    extends: [
      traitifyReact,
      traitifyBabel,
      traitifyWebpack,
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
  },
  {
    extends: [traitifyJest],
    files: ["test/**/*.js"],
    languageOptions: {
      globals: {
        container: "writable",
      },
    },
    rules: {
      "react/prop-types": "off"
    },
    settings: {
      "import/resolver": {
        jest: {jestConfigFile: "test/jest.config.js"},
      }
    }
  }
]);
