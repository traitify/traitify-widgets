import traitify from "./index";
import deprecations from "./deprecations";
import EmbeddedTests from "./embedded-tests";

traitify.StepTest = EmbeddedTests;
traitify.StepTest.traitify = traitify;
traitify.Test = function(){
  traitify.StepTest.load();
  traitify.StepTest.play();
};
traitify.ui.on("Main.Ready", ()=>{
  if(traitify.testing){ return; }
  setTimeout(traitify.Test, 0);
});
deprecations(traitify);

export default traitify;
