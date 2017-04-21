
/*global __VERSION__ */
import Traitify from "traitify-client";
import ui from "traitify-ui";
function Init(){
  Traitify.ui = ui;
  Traitify.ui.client = Traitify;
  Traitify.__version__ = __VERSION__;
  Traitify.Init = Init;
  return Traitify; 
}
export default Init();