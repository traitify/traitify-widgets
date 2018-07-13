/* eslint-disable */
var babelJest = require("babel-jest");

module.exports = {
  process: function (src, ...rest){
    return babelJest.process("module.exports = {}", ...rest);
  }
};
