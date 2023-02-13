/* global VERSION */
import I18n from "lib/i18n";
import UI from "lib/traitify-ui";

export default class Traitify extends Client {
  constructor() {
    super();
    this.__version__ = VERSION;
    this.graphql = graphql;
    this.i18n = new I18n();
  }
}
