module.exports = {
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
    "<rootDir>/test/support/test-helper.js"
  ],
  testURL: "https://www.example.com",
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  }
};
