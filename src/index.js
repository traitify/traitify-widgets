import { h, render } from "preact";
import "./style";
require("es6-promise").polyfill()
require("fetch-ie8")

let Main = require("./components/main").default;
class Traitify {
  static request(method, path, params) {
    return new Promise((resolve, reject)=>{
      var url = `${this.options.host}/v1${path}`;
      url += (url.indexOf("?") == -1) ? "?" : "&";
      url += `authorization=${this.options.publicKey}`;
      if(this.options.imagePack) url += `&image_pack=${this.options.imagePack}`;

      let headers = new Headers({
        "Content-Type": "application/json"
      });

      var options = {
        method: method,
        headers: headers,
        mode: "cors",
        cache: "default"
      };

      if(params) options.body = JSON.stringify(params);

      var request = new Request(url, options);

      fetch(request).then((response)=>{
        response.json().then((data)=>{
          resolve(data);
        })
      })
    })
  }
  static setHost(host){
    this.options.host = host;
    return this;
  }
  static setImagePack(pack){
    this.options.imagePack = pack;
    return this;
  }
  static setPublicKey(key){
    this.options.publicKey = key;
    return this;
  }
  static get(path){
    return this.request("GET", path);
  }
  static post(path, params){
    return this.request("POST", path, params);
  }
  static put(path, params){
    return this.request("PUT", path, params);
  }
}
Traitify.options = { host: "http://api.traitify.com" };

let root;
Traitify.ui = class UI {
  constructor (options){
    this.options = options || {};
    this.options.callbacks = this.options.callbacks || {};
  }
  static component(options){
    return new this(options);
  }
  static on(key, callback){
    var widgets = this.component();
    widgets.on(key, callback);
    return widgets;
  }
  static render(options){
    return this.component(options).render();
  }
  on(key, callback){
    var key = key.toLowerCase();
    this.options.callbacks[key] = this.options.callbacks[key] || [];
    this.options.callbacks[key].push(callback);
    return this;
  }
  refresh(){
    this.render();
    return this;
  }
  render(componentName){
    let Main = require("./components/main").default;

    // If target is not a node use query selector to find the target node
    if(typeof this.options.target == "string"){
      this.options.target = document.querySelector(this.options.target || ".tf-widgets");
    }else{
      throw "Traitify.ui.target('#example-target') not set!";
    }

    this.options.componentName = componentName;

    root = render(<Main {...this.options} />, this.options.target, root);
    return this;
  }
}

var defaultOptions = ["allowFullScreen", "assessmentId", "target", "locale"];
defaultOptions.forEach(function(option) {
  Traitify.ui[option] = function(value) {
    var options = {};
    options[option] = value;
    return this.component(options);
  };
  Traitify.ui.prototype[option] = function(value) {
    this.options[option] = value;
    return this;
  };
});

// Export Traitify
window.Traitify = Traitify;
