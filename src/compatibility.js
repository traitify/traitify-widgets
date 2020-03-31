import Traitify from "lib/traitify";
import deprecations from "./deprecations";

const traitify = new Traitify();

deprecations(traitify);
traitify.components = Components;

export default traitify;
