import Traitify from "traitify";
window.Traitify = Traitify;
import StepTest from "step-test";
import Tests from "./embed";
import Error from "./error-handler";

StepTest.prototype.logs = [];
StepTest.prototype.log = function(error){
  let err = new Error();
  err.type = "Test";
  err.message = error;
  err.notify();
}
StepTest.log = function(){

}
StepTest.on("error", function(error){
  console.log(error)
})
Traitify.StepTest = StepTest;
Traitify.Test = function(){
  this.StepTest.Traitify = Traitify;
  Tests.apply(this.StepTest);
  this.StepTest.play();
  this.StepTest.on("error", function(error){
    console.log(error);
  })
}
export default Traitify;