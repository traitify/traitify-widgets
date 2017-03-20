import Traitify from "../../src/lib/traitify";
import Mocks from "../support/mocks";
import simulateEvent from "simulate-event";
window.Traitify = Traitify;
window.Mocks = Mocks;
window.Mocks.Traitify = Traitify;
window.Mocks.setup();

/*global sinon,expect,StepTest,Traitify*/

/*eslint-disable prefer-arrow-callback*/
StepTest.addStep("Setup Scratch", function(){
  this.scratch = document.createElement("div");
  document.body.appendChild(this.scratch);
});


StepTest.addStep("Set scratch as Target", function(){
  this.widget.target(this.scratch);
});

StepTest.addStep("Click", function(target){
  let item = this.scratch.querySelector(target);
  simulateEvent.simulate(item, "click");
});

StepTest.addStep("Listen for", function(target){
  let s = this;
  this.widget.on(target, function(){
    s[target] = true;
  });
});

/*eslint-enable prefer-arrow-callback*/