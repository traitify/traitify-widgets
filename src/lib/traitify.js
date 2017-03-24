import Traitify from "traitify-client";
Traitify.ui = require("traitify-ui").default;
Traitify.ui.client = Traitify;
require("polyfills");
export default Traitify;