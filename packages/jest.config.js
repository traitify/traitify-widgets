module.exports = function createConfig({name}) {
  return {
    collectCoverageFrom: [
      "<rootDir>/src/**/*.js"
    ],
    globals: {
      VERSION: "0.0.0-test"
    },
    moduleFileExtensions: [
      "js"
    ],
    moduleNameMapper: {
      "traitify/(.*)": "<rootDir>/../../src/$1"
    },
    modulePaths: [
      "<rootDir>/src/",
      "<rootDir>/test/",
      "<rootDir>/../../src/",
      "<rootDir>/../../test/"
    ],
    rootDir: require("path").resolve(__dirname, name),
    testEnvironmentOptions: {url: "https://www.example.com"},
    testMatch: ["<rootDir>/test/**/*.test.js"],
    transform: {
      "^.+\\.jsx?$": "babel-jest"
    }
  };
};
