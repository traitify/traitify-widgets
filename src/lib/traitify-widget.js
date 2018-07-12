import {render} from "preact";
import {guessComponent} from "lib/helpers";

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
        const Component = guessComponent(name);
        if(!Component){ return reject(`Could not find component for ${name}`); }

        if(typeof this.options.targets[name] == "string"){
          this.options.targets[name] = document.querySelector(this.options.targets[name]);
        }

        const target = this.options.targets[name];
        if(!target){ return reject(`Could not select target for ${name}`); }

        while(target.firstChild){ target.removeChild(target.firstChild); }

        resolve(render(<Component options={this.options} traitify={this.ui.traitify} />, target));
      }));
    });

    return Promise.all(promises);
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
