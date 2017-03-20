import Traitify from "traitify-js-browser-client";
if (!window.console || !window.console.log){
  window.console = {
    log: ()=>{},
    warn: ()=>{}
  };
}
Traitify.setImagePack = function(pack){
  this.imagePack = pack;
  return this;
};

Traitify.request = function(method, path, params){
  let url = path;
  url += (url.indexOf("?") == -1) ? "?" : "&";
  url += `authorization=${this.publicKey}`;
  if (this.imagePack) url += `&image_pack=${this.imagePack}`;
  return Traitify.ajax(method, url, ()=>{}, params);
};

Traitify.get = function(path) {
  return this.request("GET", path);
};

Traitify.post = function(path, params){
  return this.request("POST", path, params);
};

Traitify.put = function(path, params) {
  let method = this.oldIE ? 'POST' : 'PUT';
  return this.request(method, path, params);
};

Traitify.host =  "http://api.traitify.com";

export default Traitify;
