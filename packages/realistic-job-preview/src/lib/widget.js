/* global VERSION */
import slice from "traitify/lib/common/object/slice";
import split from "traitify/lib/common/object/split";
import Cache from "traitify/lib/cache";
import Http from "traitify/lib/http";
import I18n from "traitify/lib/i18n";
import Listener from "traitify/lib/listener";
import Renderer from "traitify/lib/renderer";
import Components from "../components";

export default class Widget {
  constructor(options) {
    this.__version__ = VERSION;
    this.cache = new Cache({namespace: "rjp"});
    this.http = new Http();
    this.i18n = new I18n();
    this.listener = new Listener();
    this.options = options || {};
    this.renderer = new Renderer({components: Components});
  }
  get props() {
    const objects = slice(this, [
      "cache",
      "http",
      "i18n",
      "listener"
    ]);
    const [props, options] = split(this.options, [
      "assessmentID",
      "locale"
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
