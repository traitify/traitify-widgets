import simulateEvent from "simulate-event";

/*global sinon,expect,StepTest,Traitify*/

function Init(){
  /*eslint-disable prefer-arrow-callback*/
  this.step("Setup Scratch", function(){
    this.scratch = document.createElement("div");
    if (this.constructor.display){
      document.body.appendChild(this.scratch);
    }
  });


  this.step("Set scratch as Target", function(){
    this.widget.target(this.scratch);
  });

  this.step("Click", function(target){
    this.logs[this.logs.length - 1] += ` ${target}`
    let item = this.scratch.querySelector(target);
    simulateEvent.simulate(item, "click");
  });

  this.step("Listen for", function(target){
    let s = this;
    this.logs[this.logs.length - 1] += ` ${target}`
    this.widget.on(target, function(){
      s[target] = true;
    });
  });
}
export default Init;
/*eslint-enable prefer-arrow-callback*/