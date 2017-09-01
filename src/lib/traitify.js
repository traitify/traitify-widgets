/*global __VERSION__ */
import TraitifyLib from "traitify-client";
import ui from "traitify-ui";
function Init(){
  let Traitify = TraitifyLib;
  Traitify.ui = ui;
  Traitify.ui.client = Traitify;
  Traitify.__version__ = __VERSION__;
  Traitify.Init = Init;
  return Traitify;
}
export default Init();
