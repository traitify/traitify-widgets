import Traitify from "traitify";
import EmbeddedTests from "./embedded-tests";

window.Traitify = Traitify;

Traitify.StepTest = EmbeddedTests;
Traitify.StepTest.Traitify = Traitify.Init();
Traitify.Test = function(){
  this.StepTest.load();
  this.StepTest.play();
};

export default Traitify;
