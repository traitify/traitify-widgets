import {h, render} from "preact";
import Error from "../error-handler";
import I18n from "./i18n";
import Main from "../components/main";
import TraitifyState from "./traitify-state";

class TraitifyWidget{
  constructor(ui, options){
    this.ui = ui;
    this.options = options || {};
    this.options.callbacks = Object.assign({}, this.options.callbacks);
    this.options.targets = Object.assign({}, this.options.targets);
    if(!this.ui.testsDisabled){ this.ui.startTests(); }
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
    let shared = new TraitifyState(this.ui.client);
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

[
  "allowBack",
  "allowFullScreen",
  "assessmentId",
  "perspective",
  "target",
  "targets"
].forEach((option)=>{
  TraitifyWidget.prototype[option] = function(value){
    this.options[option] = value;
    return this;
  };
});

export default TraitifyWidget;
