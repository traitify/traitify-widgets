import TraitifyLib from "traitify-js-browser-client";

class Traitify{
  constructor(){
    this.oldIE = TraitifyLib.oldIE;
    this.version = "v1";
    this.host =  "https://api.traitify.com";

    return this;
  }
  setImagePack (pack){
    this.imagePack = pack;
    return this;
  }

  setVersion (version){
    this.version = version;
  }

  request (method, path, params){
    let url = path;
    url += (url.indexOf("?") == -1) ? "?" : "&";
    url += `authorization=${this.publicKey}`;
    if (this.imagePack) url += `&image_pack=${this.imagePack}`;
    TraitifyLib.host = this.host;
    TraitifyLib.version = this.version;
    return TraitifyLib.ajax(method, url, ()=>{}, params);
  }

  get (path) {
    return this.request("GET", path);
  }

  post (path, params){
    return this.request("POST", path, params);
  }

  put (path, params) {
    let method = this.oldIE ? 'POST' : 'PUT';
    return this.request(method, path, params);
  }

  setPublicKey(key){
    this.publicKey = key;
    TraitifyLib.setPublicKey(key);
  }
  setHost (host){
    this.host = host;
  }
}
TraitifyLib.host = "";

export default Traitify;
