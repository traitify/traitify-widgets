module.exports = {
  extends: ["plugin:jest/recommended"],
  globals: {
    container: "writable"
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
    "no-new": "off",
    "prefer-promise-reject-errors": "off",
    "react/prop-types": "off"
  },
  settings: {
    "import/resolver": {
      jest: {
        jestConfigFile: "./test/jest.config.js"
      }
    }
  }
};
