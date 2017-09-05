import "polyfills";
import Traitify from "traitify";
import EmbeddedTests from "./embedded-tests";

window.Traitify = Traitify;

Traitify.StepTest = EmbeddedTests;
Traitify.Test = function(){
  this.StepTest.Traitify = Traitify;
  this.StepTest.load();
  this.StepTest.play();
}

export default Traitify;
