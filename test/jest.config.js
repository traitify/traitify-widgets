module.exports = {
  collectCoverageFrom: [
    "<rootDir>/scripts/**/*.js",
    "<rootDir>/src/**/*.js"
  ],
  fakeTimers: {enableGlobally: true},
  globals: {
    VERSION: "0.0.0-test"
  },
  moduleFileExtensions: [
    "scss",
    "js"
  ],
  moduleNameMapper: {
    "^.+\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
  modulePaths: [
    "<rootDir>/scripts/",
    "<rootDir>/src/",
    "<rootDir>/test/"
  ],
  rootDir: require("path").resolve(__dirname, ".."),
  setupFiles: [
    "<rootDir>/test/support/setup/babel.js",
    "<rootDir>/test/support/setup/react.js"
  ],
  setupFilesAfterEnv: [
    "<rootDir>/test/support/setup/container.js",
    "<rootDir>/test/support/setup/extend.js",
    "<rootDir>/test/support/setup/recoil.js"
  ],
  testEnvironmentOptions: {url: "https://www.example.com"},
  testMatch: ["<rootDir>/test/**/*.test.js"],
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  }
};
