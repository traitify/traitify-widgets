module.exports = {
  env: {
    node: true
  },
  extends: ["traitify"],
  globals: {
    XDomainRequest: true
  },
  settings: {
    "import/resolver": {
      webpack: {config: "webpack.config.js"}
    }
  },
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
    ],
    "react/require-default-props": ["error", {functions: "defaultArguments"}]
  }
};
