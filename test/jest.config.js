module.exports = {
  collectCoverageFrom: [
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
    "<rootDir>/src/",
    "<rootDir>/test/"
  ],
  rootDir: "..",
  setupFiles: [
    "<rootDir>/test/support/setup/babel.js",
    "<rootDir>/test/support/setup/react.js"
  ],
  setupFilesAfterEnv: [
    "<rootDir>/test/support/setup/extend.js",
    "<rootDir>/test/support/setup/recoil.js"
  ],
  testEnvironmentOptions: {url: "https://www.example.com"},
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  }
};
