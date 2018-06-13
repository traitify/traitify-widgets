/* global VERSION */
import TraitifyClient from "traitify-client";
import TraitifyUI from "traitify-ui";

export default class Traitify extends TraitifyClient{
  constructor(){
    super();
    this.ui = new TraitifyUI();
    this.ui.client = this;
    this.version = VERSION;
  }
}
