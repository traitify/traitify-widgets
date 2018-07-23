/* global VERSION */
import TraitifyClient from "lib/traitify-client";
import TraitifyUI from "lib/traitify-ui";

export default class Traitify extends TraitifyClient{
  constructor(){
    super();
    this.__version__ = VERSION;
    this.ui = new TraitifyUI({traitify: this});
  }
}
