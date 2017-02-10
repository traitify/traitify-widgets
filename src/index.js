import { h, render } from "preact";
import "./style";
require("es6-promise").polyfill()
require("fetch-ie8")

let Main = require("./components/main").default;
class Traitify {
  static request(method, path, params) {
    return new Promise((resolve, reject)=>{
      var url = `${options.host}/v1${path}`
      url += (url.indexOf("?") == -1) ? "?" : "&"
      url += `authorization=${this.options.publicKey}`
      if(this.options.imagePack) url += `&image_pack=${this.options.imagePack}`

      var options = {
        method: method,
        mode: "cors",
        cache: "default"
      };

      if(params) { options.body = JSON.stringify(params); }

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
  static get(path) {
    return this.request("GET", path)
  }
  static post(path, params) {
    return this.request("POST", path, params)
  }
  static put(path, params) {
    return this.request("PUT", path, params)
  }
}
Traitify.options = { host: "http://api.traitify.com" }

let root;
Traitify.ui = class UI {
  constructor (){
    this.options = {};
    return this;
  }

  static component (){
    return new this();
  }

  static startChain(options){
    let widgets = this.component();
    Object.keys(options || {}).forEach((key)=>{
      widgets.options[key] = options[key]
    })
    return widgets;
  }

  static render (options){
    return this.startChain(options).render()
  }

  static assessmentId (assessmentId){
    return this.startChain({assessmentId: assessmentId})
  }

  static target (target){
    return this.startChain({target: target})
  }

  assessmentId (assessmentId){
    this.options.assessmentId = assessmentId;
    return this;
  }

  allowFullScreen (value){
    this.options.allowFullScreen = value;
    return this;
  }

  target (target){
    this.options.target = target;
    return this;
  }

  render (componentName){
    let Main = require("./components/main").default;

    // If target is not a node use query selector to find the target node
    if(typeof this.options.target == "string"){
      this.options.target = document.querySelector(this.options.target || ".tf-widgets")
    }

    this.options.componentName = componentName

    root = render(<Main {...this.options} />, this.options.target, root);
    return this;
  }

  refresh () {
    this.render()
    return this;
  }
}

// Export Traitify
window.Traitify = Traitify;
