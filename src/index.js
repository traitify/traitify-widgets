import Traitify from "traitify";
window.Traitify = Traitify;
import StepTest from "step-test";
import Tests from "./embed";
import Error from "./error-handler";

StepTest.prototype.logs = [];

StepTest.log = function(){

}

StepTest.on("finished", function(){
  clearTimeout(this.timeout);
})

StepTest.on("error", function(error){
  let err = new Error();
  err.type = `Test ${error.name}`;
  err.message = error.message;
  err.notify();
})

Traitify.StepTest = StepTest;
Traitify.Test = function(){
  this.StepTest.Traitify = Traitify;
  Tests.apply(this.StepTest);

  this.StepTest.timeout = setTimeout(function(){
      let err = new Error();
      err.type = "Test Timeout";
      err.message = "tests timed out at 4 seconds";
      err.notify();
  }, 4000)

  this.StepTest.play();
  this.StepTest.on("error", function(error){
    console.log(error);
  })
}
export default Traitify;