/*global sinon,expect,StepTest,Mocks,Traitify*/
/*eslint-disable prefer-arrow-callback*/
function Init(){
  this.step("Render and Wait for SlideDeck to Initialize", function(){
    let s = this.defer();
    this.widget.on("slidedeck.initialized", function(){
      s.resolve();
    }).render();
  });

  this.step("Initialize SlideDeck", [
    "Setup Scratch",
    "Load Traitify UI with SlideDeck assessment id",
    "Set scratch as Target",
    "Render and Wait for SlideDeck to Initialize"
  ]);

  this.step("Load Traitify UI with SlideDeck assessment id", function(){
    this.widget = this.constructor.Traitify.ui.assessmentId("slidedeck");
  });
}
export default Init;
/*eslint-enable prefer-arrow-callback*/