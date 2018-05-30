function Init(stepTest){
  stepTest.step("Render and Wait for SlideDeck to be Ready", function(){
    let step = this.defer();
    let resolved = false;
    this.widget.on("SlideDeck.isReady", (state, ready)=>{
      if(resolved || !ready){ return; }
      resolved = true;
      step.resolve();
    }).render();
  });

  stepTest.step("Setup SlideDeck", [
    "Setup Scratch",
    "Load Traitify UI with SlideDeck assessment ID",
    "Set scratch as Target"
  ]);

  stepTest.step("Load Traitify UI with SlideDeck assessment ID", function(){
    this.widget = this.constructor.Traitify.ui.component().assessmentID("slidedeck");
  });
}

export default Init;
