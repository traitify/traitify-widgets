import StepTest from "step-test";
import ErrorHandler from "./error-handler";
import Setup from "../test/support/setup";
import Results from "../test/tests/results";
import SlideDeck from "../test/tests/slide-deck";

class EmbeddedTest extends StepTest {
  constructor(name, cb){
    super(name, cb);
    this.on("play", function(){
      this.timeout = setTimeout(function(){
        let err = new ErrorHandler();
        err.type = "Test Timeout";
        err.message = `test '${name}' timed out at 300ms`;
        err.notify();
        console.warn(err.message);
      }, 300);
    });
    this.on("finished", function(){
      clearTimeout(this.timeout);
    });
    return this;
  }
}

EmbeddedTest.prototype.logs = [];
EmbeddedTest.prototype.log = function(){};
EmbeddedTest.log = function(){};

EmbeddedTest.on("finished", function(){
  clearTimeout(this.timeout);
});

EmbeddedTest.on("error", function(error){
  let err = new ErrorHandler();
  err.type = `Test ${error.name}`;
  err.message = error.message;
  err.notify();
});

EmbeddedTest.load = function(){
  if(!this.loaded){
    this.loaded = true;

    Setup(this);
  }

  Results(this);
  SlideDeck(this);
};

export default EmbeddedTest;
