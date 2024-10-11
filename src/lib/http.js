import toQueryString from "./common/object/to-query-string";

export default class Http {
  constructor({authKey, host, version} = {}) {
    this.authKey = authKey;
    this.host = host || "https://api.traitify.com";
    this.version = version || "v1";
  }
  delete = (path, params) => this.request("DELETE", path, params);
  fetch = (...options) => fetch(...options);
  get = (path, params) => this.request("GET", path, params);
  post = (path, params) => this.request("POST", path, params);
  put = (path, params) => this.request("PUT", path, params);
  request = (method, path, params) => {
    const graphql = typeof params === "string";
    const headers = {
      "Accept": "application/json",
      "Authorization": `Basic ${btoa(`${this.authKey}:x`)}`,
      "Content-Type": graphql ? "application/graphql" : "application/json"
    };
    const options = {headers, method};
    let url = [this.host, this.version].filter(Boolean).join("/");
    url = `${url}${path}`;

    if(params && ["get", "delete"].includes(method.toLowerCase())) {
      url += url.includes("?") ? "&" : "?";
      url += toQueryString(params);
    } else {
      options.body = JSON.stringify(params);
    }

    return this.fetch(url, options).then((response) => response.json());
  };
}
