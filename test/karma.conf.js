require("babel-register");
var webpack = require("../webpack.config.babel.js");
var path = require("path");

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

    singleRun: true,

    browsers: ["Chrome"],

    files: [
      "test/browser/**/*.js"
    ],

    preprocessors: {
      "test/**/*.js": ["webpack", "coverage"],
      "**/*.js": ["sourcemap"]
    },

    webpack: webpack
  });
};
