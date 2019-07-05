import queryString from "query-string";

export default class TraitifyClient {
  constructor() {
    this.host = "https://api.traitify.com";
    this.version = "v1";
    this.oldIE = typeof XDomainRequest !== "undefined";
  }
  online() { return navigator.onLine; }
  setHost = (host) => {
    this.host = host;
    if(this.oldIE) {
      this.host = this.host.replace("https://", "").replace("http://", "");
      this.host = `${window.location.protocol}//${this.host}`;
    }
    return this;
  }
  setPublicKey = (key) => {
    this.publicKey = key;
    return this;
  }
  setVersion = (version) => {
    this.version = version;
    return this;
  }
  handlePromise = (requestType, xhr, params) => {
    const async = xhr;
    const promise = new Promise((resolve, reject) => {
      if(!this.online()) { return reject(); }
      try {
        async.onload = () => {
          if(async.status === 404) {
            reject(async.response || async.responseText);
          } else {
            resolve(JSON.parse(async.response || async.responseText));
          }
        };
        async.onerror = () => { reject(async.response || async.responseText); };
        async.ontimeout = () => { reject(async.response || async.responseText); };
        const send = requestType === "graphql" ? () => { async.send(params); } : () => { xhr.send(JSON.stringify(params)); };

        this.oldIE ? window.setTimeout(send, 0) : send();
      } catch(error) { reject(error); }
    });

    promise.xhr = xhr;
    return promise;
  }
  ajax = (method, path, _params) => {
    let params;
    let url = `${this.host}/${this.version}${path}`;
    let xhr;
    if(_params && ["get", "delete"].includes(method.toLowerCase())) {
      url += url.indexOf("?") === -1 ? "?" : "&";
      url += queryString.stringify(_params);
      params = null;
    } else {
      params = _params;
    }
    if(this.oldIE) {
      url += url.indexOf("?") === -1 ? "?" : "&";
      url += queryString.stringify({
        authorization: this.publicKey,
        reset_cache: (new Date()).getTime()
      });
      xhr = new XDomainRequest();
      xhr.open(method, url);
    } else {
      xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.setRequestHeader("Authorization", `Basic ${btoa(`${this.publicKey}:x`)}`);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.setRequestHeader("Accept", "application/json");
    }
    return this.handlePromise("rest", xhr, params);
  }
  graphqlQuery = (path, params) => {
    // TODO move to this.host when service deployed
    const url = `https://api.stag.awse.traitify.com/${this.version}${path}`;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Authorization", `Basic ${btoa(`${this.publicKey}:x`)}`);
    xhr.setRequestHeader("Content-type", "application/graphql");
    xhr.setRequestHeader("Accept-language", "en-US");
    xhr.setRequestHeader("Accept", "*/*");

    return this.handlePromise("graphql", xhr, params);
  }
  get = (path, params) => (this.ajax("GET", path, params))
  put = (path, params) => (this.ajax(this.oldIE ? "POST" : "PUT", path, params))
  post = (path, params) => (this.ajax("POST", path, params))
  delete = (path, params) => (this.ajax("DELETE", path, params))
}
