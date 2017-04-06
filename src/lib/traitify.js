import Traitify from "traitify-client";
Traitify.ui = require("traitify-ui").default;
Traitify.ui.client = Traitify;
Traitify.__version__ = __VERSION__;
require("polyfills");
export default Traitify;