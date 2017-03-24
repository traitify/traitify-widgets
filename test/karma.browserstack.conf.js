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
    //reporters: ["step-test", "coverage"],
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

    browserNoActivityTimeout: 100000,
    browserDisconnectTolerance: 2,
    singleRun: true,

    browserStack: {
      username: 'carsonwright2',
      accessKey: 'YdRd348p6T4FZxpQaiEU'
    },

    // define browsers
    customLaunchers: {
      bs_firefox_mac: {
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: '21.0',
        os: 'OS X',
        os_version: 'Mountain Lion'
      },
      bs_safari_mac: {
        base: 'BrowserStack',
        browser: 'safari',
        browser_version: '6.2',
        os: 'OS X',
        os_version: 'Mountain Lion'
      },
      bs_ie9_windows: {
        base: 'BrowserStack',
        browser: 'ie',
        browser_version: '9.0',
        os: 'Windows',
        os_version: '7'
      },
      bs_edge_windows: {
        base: 'BrowserStack',
        browser: 'edge',
        browser_version: '13.0',
        os: 'Windows',
        os_version: '10'
      },
      bs_ie10_windows: {
        base: 'BrowserStack',
        browser: 'ie',
        browser_version: '10.0',
        os: 'Windows',
        os_version: '7'
      },
      bs_ie11_windows: {
        base: 'BrowserStack',
        browser: 'ie',
        browser_version: '11.0',
        os: 'Windows',
        os_version: '7'
      },
      bs_iphone5: {
        base: 'BrowserStack',
        device: 'iPhone 5',
        os: 'ios',
        os_version: '6.0'
      }
    },

    browsers: [
      'bs_firefox_mac', 
      'bs_safari_mac', 
      'bs_ie9_windows', 
      'bs_ie10_windows', 
      'bs_ie11_windows', 
      'bs_edge_windows', 
      'bs_iphone5'
    ],

    files: [
      "test/support/prerun.js",
      "test/browser/**/*.js"
    ],

    preprocessors: {
      "test/**/*.js": ["webpack"],
      "src/**/*.js": ["webpack"],
      "**/*.js": ["sourcemap"]
    },

    webpack: webpack,
    webpackMiddleware: { noInfo: true }
  });
};
