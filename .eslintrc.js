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
  }
};
