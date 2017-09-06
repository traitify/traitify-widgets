function Init(client){
  client.step("Render and Wait for SlideDeck to Initialize", function(){
    let s = this.defer();
    this.widget.on("slidedeck.initialized", ()=>{
      s.resolve();
    }).render();
  });

  client.step("Initialize SlideDeck", [
    "Setup Scratch",
    "Load Traitify UI with SlideDeck assessment id",
    "Set scratch as Target",
    "Render and Wait for SlideDeck to Initialize"
  ]);

  client.step("Load Traitify UI with SlideDeck assessment id", function(){
    this.widget = this.constructor.Traitify.ui.assessmentId("slidedeck");
  });
}

export default Init;
