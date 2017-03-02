import { h, render } from "preact";
import Main from "../components/main";

export default class TraitifyUI {
  constructor (options) {
    this.options = options || {};
    this.options.callbacks = this.options.callbacks || {};
  }
  static component(options) {
    return new this(options);
  }
  static on(key, callback) {
    var widgets = this.component();
    widgets.on(key, callback);
    return widgets;
  }
  static render(options) {
    return this.component(options).render();
  }
  on(key, callback) {
    var key = key.toLowerCase();
    this.options.callbacks[key] = this.options.callbacks[key] || [];
    this.options.callbacks[key].push(callback);
    return this;
  }
  refresh() {
    this.render();
    return this;
  }
  render(componentName) {
    // If target is not a node use query selector to find the target node
    if(typeof this.options.target == "string") {
      this.options.target = document.querySelector(this.options.target || ".tf-widgets");
    }

    this.options.componentName = componentName;

    render(<Main {...this.options} />, this.options.target);
    return this;
  }
}

var defaultOptions = ["allowFullScreen", "assessmentId", "target", "locale"];
defaultOptions.forEach(function(option) {
  TraitifyUI[option] = function(value) {
    var options = {};
    options[option] = value;
    return this.component(options);
  };
  TraitifyUI.prototype[option] = function(value) {
    this.options[option] = value;
    return this;
  };
});
