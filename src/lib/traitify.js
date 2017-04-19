
/*global __VERSION__ */
import TraitifyLib from "traitify-client";
require("polyfills");
import ui from "traitify-ui";
function Init(){
  class Traitify extends TraitifyLib{};
  Traitify.ui = ui;
  Traitify.ui.client = Traitify;
  Traitify.__version__ = __VERSION__;
  Traitify.Init = Init;
  return Traitify; 
}
export default Init();