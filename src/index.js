import Http from "lib/http";
import Listener from "lib/listener";
import Traitify from "lib/traitify";

// TODO: Instead of exporting components, http, etc. - open up importing specific files
export {Traitify};

const traitify = new Traitify();
traitify.http = new Http();
traitify.listener = new Listener();

export default traitify;
