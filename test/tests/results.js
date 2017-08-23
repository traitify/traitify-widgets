/*global sinon,expect,StepTest*/
/*eslint-disable prefer-arrow-callback*/
function Init(){

  this.test("Results Should Initialize")
      .tag("results")
      .step("Setup Scratch")
      .step("Load Traitify UI with Results assessment id")
      .step("Set scratch as Target")
      .step("Render and Wait for Results to Initialize")
      .expect("Results should be Ready", function(){
        this.ok(this.scratch.innerHTML.indexOf("traitify--personality-badge--image") != 0);
      });
}
export default Init;
/*eslint-enable prefer-arrow-callback*/
