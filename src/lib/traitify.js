/* global VERSION */
import TraitifyClient from "traitify-client";
import TraitifyUI from "traitify-ui";

export default class Traitify extends TraitifyClient{
  constructor(){
    super();
    this.__version__ = VERSION;
    this.ui = new TraitifyUI();
    this.ui.client = this;
  }
}
