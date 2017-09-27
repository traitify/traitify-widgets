function Init(stepTest){
  stepTest.step("Render and Wait for Results to Initialize", function(){
    let step = this.defer();
    this.widget.on("results.initialized", ()=>{
      step.resolve();
    }).render();
  });

  stepTest.step("Initialize Results", [
    "Setup Scratch",
    "Load Traitify UI with Results assessment id",
    "Set scratch as Target",
    "Render and Wait for Results to Initialize"
  ]);

  stepTest.step("Load Traitify UI with Results assessment id", function(){
    this.widget = this.constructor.Traitify.ui.assessmentId("results");
  });
}

export default Init;
