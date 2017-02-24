require("es6-promise").polyfill();
require("fetch-ie8");

export default class Traitify {
  static setHost(host) {
    this.options.host = host;
    return this;
  }
  static setImagePack(pack) {
    this.options.imagePack = pack;
    return this;
  }
  static setPublicKey(key) {
    this.options.publicKey = key;
    return this;
  }
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
  static get(path) {
    return this.request("GET", path);
  }
  static post(path, params) {
    return this.request("POST", path, params);
  }
  static put(path, params) {
    return this.request("PUT", path, params);
  }
}

Traitify.options = { host: "http://api.traitify.com" };
