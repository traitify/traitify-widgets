function Init(client){
  client.step("Render and Wait for SlideDeck to be Ready", function(){
    let step = this.defer();
    let resolved = false;
    this.widget.on("SlideDeck.isReady", (state, ready)=>{
      if(resolved || !ready){ return; }
      resolved = true;
      step.resolve();
    }).render();
  });

  client.step("Setup SlideDeck", [
    "Setup Scratch",
    "Load Traitify UI with SlideDeck assessment ID",
    "Set scratch as Target"
  ]);

  client.step("Load Traitify UI with SlideDeck assessment ID", function(){
    this.widget = this.constructor.Traitify.ui.assessmentId("slidedeck");
  });
}

export default Init;
