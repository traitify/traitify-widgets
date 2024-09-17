const createConfig = require("../package.config");

module.exports = (env) => createConfig({env: env || {}, name: "realistic-job-preview"});
