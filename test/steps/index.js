import global from "./global";
import results from "./results";
import slideDeck from "./slide-deck";

function Init(client){
  global(client);
  results(client);
  slideDeck(client);
}

export default Init;
