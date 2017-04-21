import TraitifyLib from "traitify-js-browser-client";

TraitifyLib.setImagePack = function(pack){
  this.imagePack = pack;
  return this;
}

TraitifyLib.request = function(method, path, params){
  let url = path;
  url += (url.indexOf("?") == -1) ? "?" : "&";
  url += `authorization=${this.publicKey}`;
  if (this.imagePack) url += `&image_pack=${this.imagePack}`;

  return this.ajax(method, url, null, params);
}


TraitifyLib.put = function(path, params) {
  let method = this.oldIE ? 'POST' : 'PUT';
  return this.request(method, path, params);
}

TraitifyLib.post = function(path, params) {
  return this.request("POST", path, params);
}

export default TraitifyLib;
