/* global VERSION */
import Components from "components";
import slice from "./common/object/slice";
import split from "./common/object/split";
import Http from "./http";
import I18n from "./i18n";
import Listener from "./listener";
import Renderer from "./renderer";

export default class Traitify {
  constructor(options) {
    this.__version__ = VERSION;
    this.http = new Http();
    this.i18n = new I18n();
    this.listener = new Listener();
    this.options = options || {};
    this.renderer = new Renderer({components: Components});
  }
  get props() {
    const objects = slice(this, [
      "http",
      "i18n",
      "listener"
    ]);
    const [props, options] = split(this.options, [
      "assessmentID",
      "benchmarkID",
      "graphql",
      "locale",
      "orderID",
      "packageID",
      "profileID"
    ]);

    return {...objects, ...props, options};
  }
  destroy(targets) {
    this.renderer.destroy({targets});

    return this;
  }
  render(targets = {}) {
    return this.renderer.render({props: this.props, targets});
  }
  updateLocale(value) {
    this.listener.trigger("updateLocale", value);
    this.options.locale = value;
  }
}
