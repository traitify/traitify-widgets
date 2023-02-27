import Http from "lib/http";
import Listener from "lib/listener";

const httpMethods = ["delete", "fetch", "get", "post", "put", "request"];
const listenerMethods = ["clear", "off", "on", "trigger", "value"];

const cleanupHttp = () => {
  container.http.mocks = {fetch: []};

  httpMethods.forEach((method) => {
    container.http[method].mockClear();
  });
};
const cleanupListener = () => {
  listenerMethods.forEach((method) => {
    container.listener[method].mockClear();
  });
};
const cleanupOptions = () => {
  container.options = {};
};

const createHttp = () => {
  const http = new Http();

  httpMethods.forEach((method) => {
    jest.spyOn(http, method);
  });

  http.fetch.mockImplementation((url, options) => {
    console.error("Unmocked Fetch", url, options); // eslint-disable-line no-console
    throw new Error("Unmocked Fetch");
  });

  http.mocks = {fetch: []};

  return http;
};
const createListener = () => {
  const listener = new Listener();

  listenerMethods.forEach((method) => {
    jest.spyOn(listener, method);
  });

  return listener;
};

export default function useContainer(props) {
  const container = {...props};

  if(!container.http) { container.http = createHttp(); }
  if(!container.listener) { container.listener = createListener(); }
  if(!container.options) { container.options = {}; }

  global.container = container;

  afterEach(() => {
    cleanupHttp();
    cleanupListener();
    cleanupOptions();
  });

  return container;
}
