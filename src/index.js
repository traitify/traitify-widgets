import "polyfills";

import Traitify from "traitify";
window.Traitify = Traitify;
import StepTestLib from "step-test";
import Tests from "./embed";
import ErrorHandler from "./error-handler";
class StepTest extends StepTestLib {
  constructor(name, cb){
    super(name, cb);
    this.on("play", function(){
      this.timeout = setTimeout(function(){
        let err = new ErrorHandler();
        err.type = "Test Timeout";
        err.message = `test '${name}' timed out at 300ms`;
        err.notify();
        console.warn(err.message);
      }, 300)
    })
    this.on("finished", function(){
      clearTimeout(this.timeout);
    })
    return this;
  }
}
StepTest.prototype.logs = [];
StepTest.prototype.log = function(){
}
StepTest.log = function(){

}

StepTest.on("finished", function(){
  clearTimeout(this.timeout);
})

StepTest.on("error", function(error){
  let err = new ErrorHandler();
  err.type = `Test ${error.name}`;
  err.message = error.message;
  err.notify();
})

Traitify.StepTest = StepTest;
Traitify.Test = function(){
  this.StepTest.Traitify = Traitify;
  Tests.apply(this.StepTest);

  this.StepTest.play();
}
export default Traitify;
