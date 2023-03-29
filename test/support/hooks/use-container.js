import Cache from "lib/cache";
import Http from "lib/http";
import Listener from "lib/listener";

const cacheMethods = ["get", "set"];
const httpMethods = ["delete", "fetch", "get", "post", "put", "request"];
const listenerMethods = ["clear", "off", "on", "trigger", "value"];

export default function useContainer(props) {
  const container = {...props};

  if(!container.cache) { container.cache = new Cache(); }
  if(!container.http) { container.http = new Http(); }
  if(!container.listener) { container.listener = new Listener(); }
  if(!container.options) { container.options = {}; }

  global.container = container;

  beforeEach(() => {
    container.http.mocks = {fetch: []};
    container.options = {};

    cacheMethods.forEach((method) => {
      jest.spyOn(container.cache, method);
    });

    httpMethods.forEach((method) => {
      jest.spyOn(container.http, method);
    });

    listenerMethods.forEach((method) => {
      jest.spyOn(container.listener, method);
    });

    container.http.fetch.mockImplementation((url, options) => {
      console.error("Unmocked Fetch", url, options); // eslint-disable-line no-console
      throw new Error("Unmocked Fetch");
    });
  });

  afterEach(() => {
    container.cache.clear();

    cacheMethods.forEach((method) => {
      container.cache[method].mockReset();
    });

    // NOTE: mockClear won't clear out mocked return values but mockReset breaks recoil
    httpMethods.forEach((method) => {
      container.http[method].mockClear();
    });

    listenerMethods.forEach((method) => {
      container.listener[method].mockReset();
    });
  });

  return container;
}
