/*global StepTest*/
import Factories from "../support/factories";
import steps from "../steps";
import Mocks from "../support/mocks";
import ErrorHandler from "../../src/error-handler";

function Init(){
  let ui = this.Traitify.ui;
  let oldIE = this.Traitify.oldIE;
  class UI extends ui {};
  this.Traitify = {
    testMode: true,
    oldIE,
    ui: UI
  };
  this.Traitify.ui.client = this.Traitify;
  Mocks(this.Traitify);
  steps.apply(this)

  /* IMPORTANT
  * No matter the size of the suite top time should be under 200ms
  */
  this.parallel = true;
}
export default Init;