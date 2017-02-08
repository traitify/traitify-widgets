// import "promise-polyfill";
// import "isomorphic-fetch";
import { h, render } from "preact";
import "./style";
import Qwest from "qwest";
Qwest.setDefaultOptions({dataType: 'json', responseType: 'json', cache:true});

let Main = require("./components/main").default;
class Traitify {
  static setPublicKey(key){
    this.options.publicKey = key;
    return this;
  }
  static setImagePack(pack){
    this.options.imagePack = pack;
    return this;
  }
  static get(url) {
    url += (url.indexOf("?") == -1) ? "?" : "&"
    url += `authorization=${this.options.publicKey}`
    if(this.options.imagePack) url += `&image_pack=${this.options.imagePack}`

    return Qwest.get(`${this.host}/v1${url}`)
  }
}
Traitify.options = {}
// Traitify.host = "https://api.traitify.com"
Traitify.host = "http://api.stag.awse.traitify.com"

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

  // require("preact/devtools");   // turn this on if you want to enable React DevTools!
  // set up HMR:
  if(typeof module != "undefined" && module.hot){
    module.hot.accept("./components/main", () => requestAnimationFrame(window.developmentLoad.refresh()) );
  }
  InitJS()
}
