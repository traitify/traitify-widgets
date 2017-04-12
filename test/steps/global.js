import Traitify from "../../src/lib/traitify";
import simulateEvent from "simulate-event";


/*global sinon,expect,StepTest,Traitify*/

/*eslint-disable prefer-arrow-callback*/
StepTest.step("Setup Scratch", function(){
  this.scratch = document.createElement("div");
  document.body.appendChild(this.scratch);
});


StepTest.step("Set scratch as Target", function(){
  this.widget.target(this.scratch);
});

StepTest.step("Click", function(target){
  let item = this.scratch.querySelector(target);
  simulateEvent.simulate(item, "click");
});

StepTest.step("Listen for", function(target){
  let s = this;
  this.widget.on(target, function(){
    s[target] = true;
  });
});

/*eslint-enable prefer-arrow-callback*/