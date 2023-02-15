import toQueryString from "lib/common/object/to-query-string";

export default class Http {
  constructor({authKey, host, version} = {}) {
    this.authKey = authKey;
    this.host = host || "https://api.traitify.com";
    this.version = version || "v1";
  }
  ajax = (method, path, params) => {
    const graphql = typeof params === "string";
    const headers = {
      "Accept": "application/json",
      "Authorization": `Basic ${btoa(`${this.authKey}:x`)}`,
      "Content-Type": graphql ? "application/graphql" : "application/json"
    };
    const options = {headers, method};
    let url = `${this.host}/${this.version}${path}`;

    if(params && ["get", "delete"].includes(method.toLowerCase())) {
      url += url.includes("?") ? "&" : "?";
      url += toQueryString(params);
    } else {
      options.body = JSON.stringify(params);
    }

    return fetch(url, options).then((response) => response.json());
  };
  get = (path, params) => (this.ajax("GET", path, params));
  put = (path, params) => (this.ajax("PUT", path, params));
  post = (path, params) => (this.ajax("POST", path, params));
  delete = (path, params) => (this.ajax("DELETE", path, params));
}
