import {h, render} from "preact";
import Error from "../error-handler";
import I18n from "./i18n";
import Main from "../components/main";
import TraitifyState from "./traitify-state";

export default class TraitifyUI{
  constructor(options){
    this.options = Object.assign({}, this.constructor.options, options);
    this.options.callbacks = Object.assign({}, this.options.callbacks);
    this.options.targets = Object.assign({}, this.options.targets);
    if(!this.options.testsDisabled){ this.constructor.startTests(); }
  }
  static component(options){
    return new this(options);
  }
  static disableTests(){
    this.options.testsDisabled = true;
  }
  static locale(value){
    let options = {};
    options.locale = value;
    return this.component(options);
  }
  static on(key, callback){
    let widgets = this.component();
    widgets.on(key, callback);
    return widgets;
  }
  static render(options){
    return this.component(options).render();
  }
  static startTests(){
    if(this.client.testMode){ return; }
    this.client.testMode = true;
    setTimeout(::this.client.Test, 0);
  }
  locale(locale = ""){
    let i18n = new I18n();

    if(i18n[locale.toLowerCase()]){
      this.options.locale = locale.toLowerCase();
    }else{
      this.options.locale = "en-us";
    }

    return this;
  }
  on(key, callback){
    key = key.toLowerCase();
    this.options.callbacks[key] = this.options.callbacks[key] || [];
    this.options.callbacks[key].push(callback);
    return this;
  }
  refresh(){
    this.render();
    return this;
  }
  render(componentName){
    let shared = new TraitifyState(this.constructor.client);
    shared.setup(this.options);

    return new Promise((resolve, reject)=>{
      try{
        if(this.options.target){
          this.options.targets[componentName || "Default"] = this.options.target;
        }

        if(Object.keys(this.options.targets).length === 0){
          return reject("Your target element could either not be selected or was not provided");
        }

        let promise = {resolve, reject};

        Object.keys(this.options.targets).forEach(name=>{
          if(typeof this.options.targets[name] == "string"){
            this.options.targets[name] = document.querySelector(this.options.targets[name]);
          }

          let target = this.options.targets[name];
          while(target.firstChild) target.removeChild(target.firstChild);
          render(<Main componentName={name} shared={shared} promise={promise} />, target);
        });
      }catch(error){
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

TraitifyUI.options = {};
