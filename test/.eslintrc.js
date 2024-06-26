module.exports = {
  extends: ["traitify/jest"],
  globals: {
    container: "writable"
  },
  rules: {},
  settings: {
    "import/resolver": {
      jest: {
        jestConfigFile: "./test/jest.config.js"
      }
    }
  }
};
