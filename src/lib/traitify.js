/*global __VERSION__*/
import TraitifyClient from "traitify-client";
import TraitifyUI from "traitify-ui";

export default class Traitify extends TraitifyClient{
  constructor(){
    super();
    this.__version__ = __VERSION__;
    this.ui = new TraitifyUI();
    this.ui.client = this;
  }
}
