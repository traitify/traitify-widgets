/*global sinon,expect,StepTest,Mocks,Traitify*/
/*eslint-disable prefer-arrow-callback*/

StepTest.addStep("Mock Results", function(){
  Mocks.mock("results");
});

StepTest.addStep("Render and Wait for Results to Initialize", function(){
  let s = this.defer();
  this.widget.on("results.initialized", function(){
    s.resolve();
  }).render();
});

StepTest.addStep("Initialize Results", [
  "Setup Scratch",
  "Load Traitify UI with Results assessment id",
  "Mock Results",
  "Set scratch as Target",
  "Render and Wait for Results to Initialize"
]);


StepTest.addStep("Load Traitify UI with Results assessment id", function(){
  this.widget = Traitify.ui.assessmentId("results");
});

/*eslint-enable prefer-arrow-callback*/