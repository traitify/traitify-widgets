/*global Traitify*/
class Client{
  ajax(options){
    return new Promise((resolve, reject)=>{
      let {method, url} = options;
      let xhr = new XMLHttpRequest();

      if(typeof xhr.withCredentials != "undefined" && !Traitify.oldIE){
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open(method, url, true);
      }else if(typeof XDomainRequest !== "undefined"){
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open(method, url, true);
      }else{
        reject("CORS is Not Supported By This Browser");
      }

      if(xhr.setRequestHeader){
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Accept", "application/json");
      }
      xhr.onload = ()=>{
        if(xhr.status === 404){
          reject(xhr.responsText || xhr.response);
        }else{
          let data = JSON.parse(xhr.responseText || xhr.response);
          resolve(data);
        }
      };
      xhr.onprogress = ()=>{};
      xhr.ontimeout = ()=>{};
      xhr.onerror = ()=>{};

      window.setTimeout(()=>{
        try{
          let params = JSON.stringify(options.params);
          xhr.send(params);
        }catch(error){
          reject(error);
        }
      }, 0);
    });
  }
  get(path){
    return this.ajax({method: "GET", url: path});
  }
  post(path, params){
    return this.ajax({method: "POST", url: path, params});
  }
}

export default Client;
