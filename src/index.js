// import "promise-polyfill";
// import "isomorphic-fetch";
import { h, render } from "preact";
import "./style";
require('es6-promise').polyfill()
require('fetch-ie8')

let Main = require("./components/main").default;
class Traitify {
  static setPublicKey(key){
    this.options.publicKey = key;
    return this;
  }
  static request(method, url, params) {
    return new Promise((resolve, reject)=>{
      url += (url.indexOf("?") == -1) ? "?" : "&"
      url += `authorization=${this.options.publicKey}`
      if(this.options.imagePack) url += `&image_pack=${this.options.imagePack}`

      var myInit = {
        method: method,
        mode: 'cors',
        cache: 'default'
      };

      if(params){
        myInit.body = JSON.stringify(params);
      }

      var myRequest = new Request(`${this.host}/v1${url}`, myInit);

      fetch(myRequest).then((response)=>{
        response.json().then((data)=>{
          resolve(data);
        })
      })
    })
  }
  static setImagePack(pack){
    this.options.imagePack = pack;
    return this;
  }
  static get(url) {
    return this.request('GET', url)
  }
  static post(url, params) {
    return this.request('POST', url, params)
  }
  static put(url, params) {
    return this.request('PUT', url, params)
  }
}
Traitify.options = {}
// Traitify.host = "https://api.traitify.com"
Traitify.host = "http://api.traitify.com"

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

if(window.TraitifyDevInitialize == true){

  InitJS()
}
