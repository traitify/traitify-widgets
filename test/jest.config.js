module.exports = {
  collectCoverageFrom: [
    "<rootDir>/src/**/*.js"
  ],
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
    "<rootDir>/test/support/setup/extend.js"
  ],
  testURL: "https://www.example.com",
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  }
};
