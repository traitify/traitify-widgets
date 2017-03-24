/*global sinon,expect,StepTest,Mocks,Traitify*/
/*eslint-disable prefer-arrow-callback*/
import simulateEvent from "simulate-event";

StepTest.addStep("Mock Slides", function(){
  Mocks.mock("slides");
});

StepTest.addStep("Render and Wait for SlideDeck to Initialize", function(){
  let s = this.defer();
  this.widget.on("slidedeck.initialized", function(){
    s.resolve();
  }).render();
});

StepTest.addStep("Initialize SlideDeck", [
  "Setup Scratch",
  "Load Traitify UI with SlideDeck assessment id",
  "Mock Slides",
  "Set scratch as Target",
  "Render and Wait for SlideDeck to Initialize"
]);


StepTest.addStep("Load Traitify UI with SlideDeck assessment id", function(){
  this.widget = Traitify.ui.assessmentId("slidedeck");
});

/*eslint-enable prefer-arrow-callback*/