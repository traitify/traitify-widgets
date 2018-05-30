import Traitify from "traitify";
import Mocks from "./mocks";
import Steps from "../steps";

function Setup(stepTest){
  stepTest.Traitify = new Traitify();
  stepTest.Traitify.testing = true;
  stepTest.parallel = true;
  Mocks(stepTest.Traitify);
  Steps(stepTest);
}

export default Setup;
