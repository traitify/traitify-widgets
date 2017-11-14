function Init(stepTest){
  stepTest.test("Results Should Initialize")
    .tag("results")
    .step("Setup Scratch")
    .step("Load Traitify UI with Results assessment id")
    .step("Set scratch as Target")
    .step("Render and Wait for Results to Initialize")
    .expect("Results should be Ready", function(){
      this.ok(this.scratch.innerHTML.indexOf("traitify--components-results-type-based-results-personality-badge---image") !== 0);
    });
}

export default Init;
