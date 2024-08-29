module.exports = {
  env: {
    node: true
  },
  extends: ["traitify"],
  globals: {
    XDomainRequest: true
  },
  overrides: [
    {
      files: "*.config.js",
      rules: {
        "global-require": "off"
      }
    }
  ],
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
      webpack: {config: "webpack.config.js"}
    }
  }
};
