/* global VERSION */
import I18n from "lib/i18n";
import Client from "lib/traitify-client";
import UI from "lib/traitify-ui";

export default class Traitify extends Client {
  constructor() {
    super();
    this.__version__ = VERSION;
    this.i18n = new I18n();
    this.ui = new UI(this);
  }
}
