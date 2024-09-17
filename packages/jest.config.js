module.exports = function createConfig({name, script = false}) {
  return {
    collectCoverageFrom: [
      "<rootDir>/src/**/*.js"
    ],
    fakeTimers: {enableGlobally: true},
    globals: {
      VERSION: "0.0.0-test"
    },
    moduleFileExtensions: [
      !script && "scss",
      "js"
    ].filter(Boolean),
    moduleNameMapper: {
      "traitify/(.*)": "<rootDir>/../../src/$1",
      ...(script ? {} : {
        "^.+\\.(css|less|scss|sass)$": "identity-obj-proxy"
      })
    },
    moduleDirectories: ["<rootDir>/node_modules"],
    modulePaths: [
      "<rootDir>/src/",
      "<rootDir>/test/",
      "<rootDir>/../../test/"
    ],
    rootDir: require("path").resolve(__dirname, name),
    setupFiles: [
      !script && "<rootDir>/../_jest/setup/babel.js",
      !script && "<rootDir>/../_jest/setup/react.js"
    ].filter(Boolean),
    testEnvironmentOptions: {url: "https://www.example.com"},
    testMatch: ["<rootDir>/test/**/*.test.js"],
    transform: {
      "^.+\\.jsx?$": "babel-jest"
    }
  };
};
