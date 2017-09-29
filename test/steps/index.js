import global from "./global";
import results from "./results";
import slideDeck from "./slide-deck";

function Init(stepTest){
  global(stepTest);
  results(stepTest);
  slideDeck(stepTest);
}

export default Init;
