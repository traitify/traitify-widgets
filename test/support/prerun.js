import Traitify from "traitify";
import ui from "traitify-ui";
import Factories from "../support/factories";
import steps from "../steps";
import Mocks from "../support/mocks";
StepTest.Traitify = Traitify;
StepTest.Mocks = Mocks;
StepTest.Mocks.Traitify = StepTest.Traitify;
StepTest.Mocks.setup();