import { h, render } from "preact";
import Main from "../components/main";
import Promise from 'promise-polyfill';

export default class TraitifyUI {
  constructor (options) {
    this.options = options || {};
    this.options.callbacks = this.options.callbacks || {};
  }
  static component(options) {
    return new this(options);
  }
  static on(key, callback) {
    let widgets = this.component();
    widgets.on(key, callback);
    return widgets;
  }
  static render(options) {
    return this.component(options).render();
  }
  on(key, callback) {
    key = key.toLowerCase();
    this.options.callbacks[key] = this.options.callbacks[key] || [];
    this.options.callbacks[key].push(callback);
    return this;
  }
  refresh() {
    this.render();
    return this;
  }
  render(componentName) {
    let lib = this;
    lib.options.client = this.constructor.client;
    return new Promise((resolve, reject)=>{
      try {
        // If target is not a node use query selector to find the target node
        if (typeof lib.options.target == "string"){
          lib.options.target = document.querySelector(lib.options.target || ".tf-widgets");
        }

        lib.options.componentName = componentName;
        lib.options.renderPromise = {
          resolve,
          reject
        };

        if (lib.options.target){
          let target = lib.target;
          while (target.firstChild) target.removeChild(target.firstChild);
          render(<Main {...lib.options} />, lib.options.target);
        } else {
          reject("Your target element could either not be selected or was not provided");
        }
      } catch (error){
        reject(error);
      }
    });
  }
}

let defaultOptions = ["allowFullScreen", "assessmentId", "perspective", "target", "locale"];
defaultOptions.forEach((option)=>{
  TraitifyUI[option] = function(value){
    let options = {};
    options[option] = value;
    return this.component(options);
  };
  TraitifyUI.prototype[option] = function(value){
    this.options[option] = value;
    return this;
  };
});