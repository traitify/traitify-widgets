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

    singleRun: false,

    browsers: ["Chrome"],

    files: [
      "test/support/prerun.js",
      "test/browser/**/*.js"
    ],

    preprocessors: {
      "test/browser/**/*.js": ["webpack"],
      "test/steps/**/*.js": ["webpack"],
      "test/support/**/*.js": ["webpack"],
      "test/tests/**/*.js": ["webpack"],
      "src/lib/*.js": ["webpack"],
      "**/*.js": ["sourcemap"]
    },

    webpack: webpack,
    webpackMiddleware: { noInfo: true }
  });
};
