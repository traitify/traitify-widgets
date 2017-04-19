import StepTest from "step-test";
import PreRun from "./test/support/prerun";
import Results from "./test/tests/results";
import SlideDeck from "./test/tests/slidedeck";
StepTest.PreRun = PreRun;
StepTest.Results = Results;
StepTest.SlideDeck = SlideDeck;
export default StepTest;