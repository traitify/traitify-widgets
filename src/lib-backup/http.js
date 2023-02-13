import {toQueryString} from "lib/helpers/object";

export default class Http {
  constructor() {
    this.host = "https://api.traitify.com";
    this.version = "v1";
  }
  online() { return navigator.onLine; }
  setHost = (host) => {
    this.host = host;
    return this;
  };
  setPublicKey = (key) => {
    this.publicKey = key;
    return this;
  };
  setVersion = (version) => {
    this.version = version;
    return this;
  };
  handlePromise = (requestType, _xhr, _params) => {
    const params = typeof _params === "string" ? _params : JSON.stringify(_params);
    const xhr = _xhr;
    const promise = new Promise((resolve, reject) => {
      if(!this.online()) { return reject(); }
      try {
        xhr.onload = () => {
          if(xhr.status >= 400) {
            reject(xhr.response || xhr.responseText);
          } else {
            resolve(JSON.parse(xhr.response || xhr.responseText));
          }
        };
        xhr.onerror = () => { reject(xhr.response || xhr.responseText); };
        xhr.ontimeout = () => { reject(xhr.response || xhr.responseText); };
        xhr.send(params);
      } catch(error) { reject(error); }
    });

    promise.xhr = xhr;
    return promise;
  };
  ajax = (method, path, _params) => {
    let params;
    let url = `${this.host}/${this.version}${path}`;
    let xhr;
    if(_params && ["get", "delete"].includes(method.toLowerCase())) {
      url += url.includes("?") ? "&" : "?";
      url += toQueryString(_params);
      params = null;
    } else {
      params = _params;
    }

    xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader("Authorization", `Basic ${btoa(`${this.publicKey}:x`)}`);
    xhr.setRequestHeader("Content-type", typeof params === "string" ? "application/graphql" : "application/json");
    xhr.setRequestHeader("Accept", "application/json");

    return this.handlePromise("rest", xhr, params);
  };
  get = (path, params) => (this.ajax("GET", path, params));
  put = (path, params) => (this.ajax("PUT", path, params));
  post = (path, params) => (this.ajax("POST", path, params));
  delete = (path, params) => (this.ajax("DELETE", path, params));
}
