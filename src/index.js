import Components from "components";
import Http from "lib/http";
import Listener from "lib/listener";
import Traitify from "lib/traitify";

export {Components, Http, Listener, Traitify};

const traitify = new Traitify();

traitify.Components = Components;
traitify.http = new Http();
traitify.listener = new Listener();

export default traitify;
