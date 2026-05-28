import withRetry from "./retry";
import toQueryString from "../common/object/to-query-string";

const formatArgs = ({method, options, params}) => {
  if(typeof options === "object") { return {method, ...options}; }

  return {method, path: options, params};
};

// NOTE: Deprecates arguments passed individually
const formatRequestArgs = (options, path, params) => {
  if(typeof options === "object") { return options; }

  console.warn("http", "request using deprecated argument format"); // eslint-disable-line no-console

  return {method: options, path, params};
};

export default class Http {
  constructor({authKey, autoRetry, host, retryOptions, version} = {}) {
    this.authKey = authKey;
    this.autoRetry = autoRetry || false;
    this.host = host || "https://api.traitify.com";
    this.retryOptions = retryOptions || {};
    this.version = version || "v1";
  }
  delete = (options, params) => this.request(formatArgs({method: "DELETE", options, params}));
  fetch = (...options) => fetch(...options);
  get = (options, params) => this.request(formatArgs({method: "GET", options, params}));
  post = (options, params) => this.request(formatArgs({method: "POST", options, params}));
  put = (options, params) => this.request(formatArgs({method: "PUT", options, params}));
  request = (_options, ...deprecatedArgs) => {
    const {
      method,
      path,
      params,
      retryOptions,
      version
    } = formatRequestArgs(_options, ...deprecatedArgs);
    const graphql = typeof params === "string";
    const headers = {
      "Accept": "application/json",
      "Authorization": `Basic ${btoa(`${this.authKey}:x`)}`,
      "Content-Type": graphql ? "application/graphql" : "application/json"
    };
    const options = {headers, method};
    let url = [this.host, version === undefined ? this.version : version].filter(Boolean).join("/");
    url = `${url}${path}`;

    if(params && ["get", "delete"].includes(method.toLowerCase())) {
      url += url.includes("?") ? "&" : "?";
      url += toQueryString(params);
    } else {
      options.body = JSON.stringify(params);
    }

    const retryEnabled = this.autoRetry || retryOptions != null;
    const fetchFn = () => this.fetch(url, options);
    const responsePromise = retryEnabled
      ? withRetry({fetch: fetchFn, method, options: {...this.retryOptions, ...retryOptions}})
      : fetchFn();

    return responsePromise.then((response) => response.json());
  };
}
