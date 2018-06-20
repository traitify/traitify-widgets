import {h, render} from "preact";
import Error from "../error-handler";
import Main from "../components/main";
import TraitifyState from "./traitify-state";

class TraitifyWidget{
  constructor(ui, options){
    this.ui = ui;
    this.options = options || {};
    this.options.callbacks = Object.assign({}, this.options.callbacks);
    this.options.targets = Object.assign({}, this.options.targets);
  }
  allowBack(){
    this.options.allowBack = true;
    return this;
  }
  allowFullscreen(){
    this.options.allowFullscreen = true;
    return this;
  }
  disableBack(){
    this.options.allowBack = false;
    return this;
  }
  disableFullscreen(){
    this.options.allowFullscreen = false;
    return this;
  }
  locale(locale){
    this.options.locale = locale.toLowerCase();
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
    let shared = new TraitifyState(this.ui, this.options);

    if(this.options.target){
      this.options.targets[componentName || "Default"] = this.options.target;
    }

    let promises = [];

    if(Object.keys(this.options.targets).length === 0){
      promises.push(new Promise((resolve, reject)=>{
        reject("You did not specify a target");
      }));
    }

    Object.keys(this.options.targets).forEach(name=>{
      promises.push(new Promise((resolve, reject)=>{
        shared.on("Main.Ready", (context, options)=>{
          if(options.name === name){ resolve(options.name); }
        });
        shared.on("Main.Error", (context, options)=>{
          if(options.name === name){ reject(options.error); }
        });

        if(typeof this.options.targets[name] == "string"){
          this.options.targets[name] = document.querySelector(this.options.targets[name]);
        }

        const target = this.options.targets[name];
        if(target){
          while(target.firstChild){ target.removeChild(target.firstChild); }
          render(<Main componentName={name} shared={shared} />, target);
        }else{
          reject("Your target element could not be selected");
        }
      }));
    });

    return Promise.all(promises).catch(error=>{
      let err = new Error(this.ui.client);
      err.type = error.name;
      err.message = error.message;
      err.notify();
      throw error;
    });
  }
}

[
  "assessmentID",
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
