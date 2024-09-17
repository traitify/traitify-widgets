module.exports = {
  extends: ["traitify/jest"],
  globals: {
    container: "writable"
  },
  rules: {
    "import/no-extraneous-dependencies": "off"
  },
  settings: {
    "import/resolver": {
      jest: {
        jestConfigFile: "./test/jest.config.js"
      }
    }
  }
};
