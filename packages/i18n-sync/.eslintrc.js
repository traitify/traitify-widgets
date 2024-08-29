module.exports = {
  env: {
    node: true
  },
  extends: ["traitify"],
  rules: {
    "import/no-extraneous-dependencies": "off"
  },
  settings: {
    "import/resolver": {
      webpack: "./webpack.config.js"
    }
  }
};
