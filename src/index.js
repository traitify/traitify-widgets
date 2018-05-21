import Traitify from "traitify";
import EmbeddedTests from "./embedded-tests";

const traitify = new Traitify();
traitify.StepTest = EmbeddedTests;
traitify.Test = function(){
  this.StepTest.load();
  this.StepTest.play();
};

window.Traitify = traitify;

export default traitify;
