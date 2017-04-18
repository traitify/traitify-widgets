import global from "./global";
import results from "./results";
import slidedeck from "./slidedeck";

function Init(){
  global.apply(this)
  results.apply(this)
  slidedeck.apply(this)
}

export default Init;