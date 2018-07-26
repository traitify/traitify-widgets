/* global VERSION */
import Client from "lib/traitify-client";
import UI from "lib/traitify-ui";

export default class Traitify extends Client{
  constructor(){
    super();
    this.__version__ = VERSION;
    this.ui = new UI(this);
  }
}
