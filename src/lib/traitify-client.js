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
  // DEPRECATION: imagePack will no longer be stored in the client
  setImagePack = (pack)=>{
    this.imagePack = pack;
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
  // DEPRECATION: Passing callback
  ajax = (method, path, callback, params)=>{
    let url = this.host + "/" + this.version + path;
    let xhr;
    if(this.oldIE){
      url += url.indexOf("?") === -1 ? "?" : "&";
      url += `authorization=${this.publicKey}&reset_cache=${(new Date).getTime()}`;
      xhr = new XDomainRequest();
      xhr.open(method, url);
    }else{
      xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.setRequestHeader("Authorization", "Basic " + btoa(this.publicKey + ":x"));
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.setRequestHeader("Accept", "application/json");
    }
    return new Promise((resolve, reject)=>{
      if(!this.online()){ return reject(); }
      try{
        xhr.onload = ()=>{
          if(xhr.status === 404){
            return reject(xhr.response);
          }else{
            const data = JSON.parse(this.oldIE ? xhr.responseText : xhr.response);
            if(callback){ callback(data); }
            return resolve(data);
          }
        };
        xhr.onprogress = function(){};
        xhr.ontimeout = function(){};
        xhr.onerror = function(){};
        window.setTimeout(()=>{
          try{
            return xhr.send(JSON.stringify(params));
          }catch(error){ return reject(error); }
        }, 0);
        return xhr;
      }catch(error){ return reject(error); }
    });
  }
  // DEPRECATION: Request method will be removed
  request = (method, path, params)=>{
    let url = path;
    url += (url.indexOf("?") === -1) ? "?" : "&";
    if(this.imagePack) url += `image_pack=${this.imagePack}`;

    return this.ajax(method, url, null, params);
  }
  // DEPRECATION: Passing callback
  get = (path, callback)=>(this.ajax("GET", path, callback))
  put = (path, params)=>(this.request(this.oldIE ? "POST" : "PUT", path, params))
  post = (path, params)=>(this.request("POST", path, params))
}
