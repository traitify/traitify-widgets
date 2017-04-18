import Traitify from "traitify";
window.Traitify = Traitify;
import StepTest from "step-test";
import Tests from "./embed";
Traitify.StepTest = StepTest;
Traitify.Test = function(){
  this.StepTest.Traitify = Traitify;
  Tests.apply(this.StepTest);
  this.StepTest.play();
}
export default Traitify;