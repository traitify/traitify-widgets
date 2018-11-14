module.exports = {
  globals: {
    VERSION: "0.0.0-test"
  },
  moduleFileExtensions: [
    "scss",
    "js"
  ],
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
    "^.+\\.(css|less|scss|sass)$": "<rootDir>/test/support/css-transformer",
    "^.+\\.jsx?$": "babel-jest"
  }
};
