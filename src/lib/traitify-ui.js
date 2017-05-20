import { h, render } from "preact";
import Main from "../components/main";
import Promise from 'promise-polyfill';
import I18n from './i18n';
import Error from "../error-handler";

export default class TraitifyUI {
  constructor (options) {
    this.options = options || {};
    this.options.targets = {};
    this.options.callbacks = this.options.callbacks || {};
  }
  static component(options) {
    if(!this.client.testMode){
      let com = this;
      this.client.testMode = true;
      setTimeout(()=>{
        com.client.Test();
      }, 0)
    }
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
  locale(locale = ""){
    let l = new I18n();

    if(l[locale.toLowerCase()]){
      this.options.locale = locale.toLowerCase();
    } else {
      this.options.locale = "en-us";
    }

    return this;
  }
  static locale(value){
    let options = {};
    options.locale = value;
    return this.component(options);
  }
  render(componentName) {
    let lib = this;
    lib.options.client = this.constructor.client;
    return new Promise((resolve, reject)=>{
      try {
        if (lib.options.target){
          lib.options.targets[componentName || "Default"] = lib.options.target;
        }

        if (Object.keys(lib.options.targets).length == 0){
          return reject("Your target element could either not be selected or was not provided");
        }

        lib.options.renderPromise = { resolve, reject };

        Object.keys(lib.options.targets).forEach(function(name){
          if (typeof lib.options.targets[name] == "string"){
            lib.options.targets[name] = document.querySelector(lib.options.targets[name]);
          }

          let target = lib.options.targets[name];
          while (target.firstChild) target.removeChild(target.firstChild);
          render(<Main componentName={name} {...lib.options} />, target);
        });
      } catch (error){
        let err = new Error();
        err.type = error.name;
        err.message = error.message;
        err.notify();
        reject(error);
      }
    });
  }
}

let defaultOptions = ["allowBack", "allowFullScreen", "assessmentId", "perspective", "target", "targets"];
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
