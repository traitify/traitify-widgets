module.exports = {
  extends: ["plugin:jest/recommended"],
  rules: {
    "import/no-named-as-default": "off", // Doesn't like HOC export
    "import/no-unresolved": "off", // TODO: Fix when jest import/resolver is fixed
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
