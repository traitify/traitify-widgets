module.exports = {
  env: {
    node: true
  },
  extends: ["traitify"],
  settings: {
    "import/resolver": {
      webpack: {
        "config": "webpack.config.js",
        "config-index": 1
      }
    }
  }
};
