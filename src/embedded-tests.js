import StepTest from "step-test";
import Error from "./error-handler";
import Setup from "../test/support/setup";
import Results from "../test/tests/results";
import SlideDeck from "../test/tests/slide-deck";

class EmbeddedTest extends StepTest{
  constructor(name, cb){
    super(name, cb);
    this.on("play", function(){
      this.timeout = setTimeout(()=>{
        let err = new Error(EmbeddedTest.traitify);
        err.type = "Test Timeout";
        err.message = `test '${name}' timed out at 300ms`;
        err.notify();
        this.log(err.message);
      }, 300);
    });
    this.on("finished", function(){
      clearTimeout(this.timeout);
    });
  }
  static load(){
    if(this.loaded){ return; }
    this.loaded = true;

    Setup(this);
    Results(this);
    SlideDeck(this);
  }
}

EmbeddedTest.log = function(){};
EmbeddedTest.simpleLog = function(){}; // console.log;

EmbeddedTest.on("test.assertion.passed", ({name, message})=>{
  EmbeddedTest.simpleLog(name, message);
});

EmbeddedTest.on("test.assertion.failed", ({name, message})=>{
  EmbeddedTest.simpleLog(name, message);
});

EmbeddedTest.on("error", (error)=>{
  let err = new Error(EmbeddedTest.traitify);
  err.type = `Test ${error.name}`;
  err.message = error.message;
  err.notify();
});

export default EmbeddedTest;
