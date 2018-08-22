import queryString from "query-string";

export default class TraitifyClient{
  constructor(){
    this.host = "https://api.traitify.com";
    this.version = "v1";
    this.oldIE = typeof XDomainRequest != "undefined";
  }
  online(){ return navigator.onLine; }
  setHost = (host)=>{
    if(this.oldIE){
      host = host.replace("https://", "").replace("http://", "");
      host = `${location.protocol}//${host}`;
    }
    this.host = host;
    return this;
  }
  setPublicKey = (key)=>{
    this.publicKey = key;
    return this;
  }
  setVersion = (version)=>{
    this.version = version;
    return this;
  }
  ajax = (method, path, params)=>{
    let url = `${this.host}/${this.version}${path}`;
    let xhr;
    if(params && ["get", "delete"].includes(method.toLowerCase())){
      url += url.indexOf("?") === -1 ? "?" : "&";
      url += queryString.stringify(params);
      params = null;
    }
    if(this.oldIE){
      url += url.indexOf("?") === -1 ? "?" : "&";
      url += queryString.stringify({authorization: this.publicKey, reset_cache: (new Date()).getTime()});
      xhr = new XDomainRequest();
      xhr.open(method, url);
    }else{
      xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.setRequestHeader("Authorization", `Basic ${btoa(`${this.publicKey}:x`)}`);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.setRequestHeader("Accept", "application/json");
    }
    return new Promise((resolve, reject)=>{
      if(!this.online()){ return reject(); }
      try{
        xhr.onload = ()=>{
          if(xhr.status === 404){
            reject(xhr.response || xhr.responseText);
          }else{
            resolve(JSON.parse(xhr.response || xhr.responseText));
          }
        };
        xhr.onerror = ()=>{ reject(xhr.response || xhr.responseText); };
        xhr.ontimeout = ()=>{ reject(xhr.response || xhr.responseText); };

        const send = ()=>{ xhr.send(JSON.stringify(params)); };

        this.oldIE ? window.setTimeout(send, 0) : send();
      }catch(error){ reject(error); }
    });
  }
  get = (path, params)=>(this.ajax("GET", path, params))
  put = (path, params)=>(this.ajax(this.oldIE ? "POST" : "PUT", path, params))
  post = (path, params)=>(this.ajax("POST", path, params))
  delete = (path, params)=>(this.ajax("DELETE", path, params))
}
