import Cache from "lib/cache";
import Http from "lib/http";
import Listener from "lib/listener";
import {useTranslations} from "../container/http";

const cacheMethods = ["get", "remove", "set"];
const httpMethods = ["delete", "fetch", "get", "post", "put", "request"];
const listenerMethods = ["clear", "off", "on", "trigger", "value"];

export default function useContainer(props) {
  const container = {...props};

  if(!container.cache) { container.cache = new Cache({namespace: "test"}); }
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
      console.error([ // eslint-disable-line no-console
        `Test: ${expect.getState().currentTestName}\n`,
        "Error: Unmocked Fetch\n\n"
      ].join(""), options);
      throw new Error("Unmocked Fetch");
    });
  });

  useTranslations();

  afterEach(() => {
    delete container.assessmentID;
    delete container.benchmarkID;
    delete container.orderID;

    container.cache.clear();

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
