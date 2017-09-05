function Init(client){
  client.step("Render and Wait for Results to Initialize", function(){
    let s = this.defer();
    this.widget.on("results.initialized", function(){
      s.resolve();
    }).render();
  });

  client.step("Initialize Results", [
    "Setup Scratch",
    "Load Traitify UI with Results assessment id",
    "Set scratch as Target",
    "Render and Wait for Results to Initialize"
  ]);

  client.step("Load Traitify UI with Results assessment id", function(){
    this.widget = this.constructor.Traitify.ui.assessmentId("results");
  });
}

export default Init;
