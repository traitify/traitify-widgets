module.exports = {
  env: {
    node: true
  },
  extends: ["traitify"],
  ignorePatterns: ["build/*", "public/*"],
  rules: {
    "import/no-extraneous-dependencies": "off"
  },
  settings: {
    "import/resolver": {
      webpack: "./webpack.config.js"
    }
  }
};
