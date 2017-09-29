import Mocks from "./mocks";
import Steps from "../steps";

function Setup(stepTest){
  let ui = stepTest.Traitify.ui;
  let oldIE = stepTest.Traitify.oldIE;
  class UI extends ui{}
  stepTest.Traitify = {testMode: true, oldIE, ui: UI};
  stepTest.Traitify.ui.client = stepTest.Traitify;
  stepTest.parallel = true;
  Mocks(stepTest.Traitify);
  Steps(stepTest);
}

export default Setup;
