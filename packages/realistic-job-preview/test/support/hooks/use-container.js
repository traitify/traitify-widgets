import Cache from "traitify/lib/cache";
import Http from "traitify/lib/http";
import Listener from "traitify/lib/listener";
import useStorage from "support/hooks/use-storage";

const cacheMethods = ["get", "remove", "set"];
const httpMethods = ["delete", "fetch", "get", "post", "put", "request"];
const listenerMethods = ["clear", "off", "on", "trigger", "value"];

export default function useContainer(props) {
  const container = {...props};

  if(!container.cache) { container.cache = new Cache(); }
  if(!container.http) { container.http = new Http(); }
  if(!container.listener) { container.listener = new Listener(); }
  if(!container.locale) { container.locale = "en-us"; }
  if(!container.options) { container.options = {}; }

  global.container = container;

  useStorage();

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
      console.error([ // eslint-disable-line no-console
        `Test: ${expect.getState().currentTestName}\n`,
        "Error: Unmocked Fetch\n\n"
      ].join(""), options);
      throw new Error("Unmocked Fetch");
    });
  });

  afterEach(() => {
    delete container.assessmentID;

    container.cache.clear();
    container.listener.clear();

    cacheMethods.forEach((method) => {
      container.cache[method].mockRestore();
    });

    httpMethods.forEach((method) => {
      container.http[method].mockRestore();
    });

    listenerMethods.forEach((method) => {
      container.listener[method].mockRestore();
    });
  });

  return container;
}
