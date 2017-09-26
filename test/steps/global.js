import simulateEvent from "simulate-event";

function Init(client){
  client.step("Setup Scratch", function(){
    this.scratch = document.createElement("div");
    if(this.constructor.display){
      document.body.appendChild(this.scratch);
    }
  });

  client.step("Set scratch as Target", function(){
    this.widget.target(this.scratch);
  });

  client.step("Click", function(target){
    this.logs[this.logs.length - 1] += ` ${target}`;
    let item = this.scratch.querySelector(target);
    simulateEvent.simulate(item, "click");
  });

  client.step("Listen for all", function(){
    let step = this;
    this.widget.on("all", (klass, action)=>{
      step[`${klass}.${action}`] = true;
    });
  });

  client.step("Listen for", function(target){
    let step = this;
    this.logs[this.logs.length - 1] += ` ${target}`;
    this.widget.on(target, ()=>{
      step[target] = true;
    });
  });
}

export default Init;
