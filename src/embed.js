import PreRun from "../test/support/prerun";
import Results from "../test/tests/results";
import SlideDeck from "../test/tests/slidedeck";
function Init(){
  if (!this.stepsSetup){
    this.stepsSetup = true;
    PreRun.apply(this);
  }
  Results.apply(this);
  SlideDeck.apply(this);
}
export default Init;