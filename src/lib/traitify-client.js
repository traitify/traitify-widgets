import TraitifyLib from "traitify-js-browser-client";

class Traitify{
  static setImagePack (pack){
    this.imagePack = pack;
    return this;
  }

  static request (method, path, params){
    let url = path;
    url += (url.indexOf("?") == -1) ? "?" : "&";
    url += `authorization=${this.publicKey}`;
    if (this.imagePack) url += `&image_pack=${this.imagePack}`;
    return TraitifyLib.ajax(method, url, ()=>{}, params);
  }

  static get (path) {
    return this.request("GET", path);
  }

  static post (path, params){
    return this.request("POST", path, params);
  }

  static put (path, params) {
    let method = this.oldIE ? 'POST' : 'PUT';
    return this.request(method, path, params);
  }

  static setPublicKey(key){
    this.publicKey = key;
    TraitifyLib.setPublicKey(key);
  }
  static setHost (host){
    TraitifyLib.host = host;
  }
}
TraitifyLib.host =  "http://api.traitify.com";

export default Traitify;
