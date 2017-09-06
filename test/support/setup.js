import Mocks from "./mocks";
import Steps from "../steps";

function Setup(client){
  let ui = client.Traitify.ui;
  let oldIE = client.Traitify.oldIE;
  class UI extends ui{}
  client.Traitify = {testMode: true, oldIE, ui: UI};
  client.Traitify.ui.client = client.Traitify;
  client.parallel = true;
  Mocks(client.Traitify);
  Steps(client);
}

export default Setup;
