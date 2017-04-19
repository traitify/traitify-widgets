/*global StepTest*/
import Promise from 'promise-polyfill';
import Factories from "../support/factories";
import steps from "../steps";
import Mocks from "../support/mocks";
function Init(){
  if (typeof window.Promise == "undefined"){
    window.Promise = Promise;
  }
  let ui = this.Traitify.ui;
  this.Traitify = {};
  this.Traitify.testMode = true;
  this.Traitify.ui = class UI extends ui {};
  this.Traitify.ui.client = this.Traitify;
  Mocks(this.Traitify);
  steps.apply(this)
  /* IMPORTANT
  * No matter the size of the suite top time should be under 200ms
  */
  this.parallel = true;
}
export default Init;