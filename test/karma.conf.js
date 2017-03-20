require("babel-register");
var webpack = require("../webpack.config.babel.js");
var path = require("path");

webpack.module.loaders.push({
  test: /\.jsx?$/,
  loader: "isparta",
  include: path.resolve(__dirname, "../src")
});

module.exports = function(config) {
  config.set({
    basePath: "../",
    frameworks: ["step-test", "chai-sinon"],
    //reporters: ["coverage"],
    coverageReporter: {
      reporters: [
        {
          type: "text-summary"
        },
        {
          type: "html",
          dir: "coverage",
          subdir: "."
        }
      ]
    },

    singleRun: true,

    browsers: ["PhantomJS"],

    files: [
      "test/support/prerun.js",
      "test/browser/**/*.js"
    ],

    preprocessors: {
      "test/**/*.js": ["webpack", "coverage"],
      "src/**/*.js": ["webpack"],
      "**/*.js": ["sourcemap"]
    },

    webpack: webpack,
    webpackMiddleware: { noInfo: true }
  });
};
