import Http from "lib/http";
import flushAsync from "support/flush-async";
import useGlobalMock from "support/hooks/use-global-mock";

describe("Http", () => {
  let http;

  beforeEach(() => {
    http = new Http({authKey: "xyz"});
  });

  describe("constructor", () => {
    describe("minimum", () => {
      beforeEach(() => {
        http = new Http();
      });

      it("has no authKey", () => {
        expect(http.authKey).toBeUndefined();
      });

      it("has default host", () => {
        expect(http.host).toBe("https://api.traitify.com");
      });

      it("has default version", () => {
        expect(http.version).toBe("v1");
      });
    });

    describe("options", () => {
      let options;

      beforeEach(() => {
        options = {
          authKey: "abc",
          autoRetry: true,
          host: "http://api.example.com",
          retryOptions: {statuses: [503]},
          version: "v2"
        };
        http = new Http(options);
      });

      it("has authKey", () => {
        expect(http.authKey).toBe(options.authKey);
      });

      it("has autoRetry", () => {
        expect(http.autoRetry).toBe(options.autoRetry);
      });

      it("has host", () => {
        expect(http.host).toBe(options.host);
      });

      it("has retryOptions", () => {
        expect(http.retryOptions).toEqual(options.retryOptions);
      });

      it("has version", () => {
        expect(http.version).toBe(options.version);
      });
    });
  });

  describe("request", () => {
    useGlobalMock(global, "fetch");

    const lastFetch = () => fetch.mock.lastCall;
    const lastHeaders = () => lastFetch()[1].headers;

    beforeEach(() => {
      fetch.mockImplementation(() => Promise.resolve({json: jest.fn().mockName("json")}));
    });

    describe("graphql", () => {
      let params;

      beforeEach(() => {
        params = `{ guide(localeKey:"en-US",assessmentId:"xyz") { name competencies { id name } }}`;

        http.post("/interview_guides/graphql", params);
      });

      it("includes headers", () => {
        expect(lastHeaders()).toEqual(
          expect.objectContaining({
            "Accept": "application/json",
            "Authorization": `Basic ${btoa("xyz:x")}`,
            "Content-Type": "application/graphql"
          })
        );
      });

      it("passes params", () => {
        const [url, options] = lastFetch();

        expect(options.body).toEqual(JSON.stringify(params));
        expect(url).toEqual("https://api.traitify.com/v1/interview_guides/graphql");
      });
    });

    it("includes headers", () => {
      http.request({method: "GET", path: "/profiles", params: {locale_key: "en-us"}});

      expect(lastHeaders()).toEqual(
        expect.objectContaining({
          "Accept": "application/json",
          "Authorization": `Basic ${btoa("xyz:x")}`,
          "Content-Type": "application/json"
        })
      );
    });

    it("triggers request listeners with the built request", () => {
      const onRequest = jest.fn().mockName("onRequest");
      http.listener.on("Http.request", onRequest);
      http.request({method: "GET", path: "/profiles"});

      expect(onRequest).toHaveBeenCalledWith({
        options: expect.objectContaining({method: "GET"}),
        url: "https://api.traitify.com/v1/profiles"
      });
    });

    it("fetches with mutations made by request listeners", () => {
      http.listener.on("Http.request", (request) => { request.options.headers["X-Request-Id"] = "widget-abc.aaaaaa"; });
      http.request({method: "GET", path: "/profiles"});

      expect(lastHeaders()["X-Request-Id"]).toBe("widget-abc.aaaaaa");
    });

    it("applies multiple request listeners", () => {
      http.listener.on("Http.request", (request) => { request.options.headers["X-A"] = "a"; });
      http.listener.on("Http.request", (request) => { request.options.headers["X-B"] = "b"; });
      http.request({method: "GET", path: "/profiles"});

      expect(lastHeaders()).toEqual(expect.objectContaining({"X-A": "a", "X-B": "b"}));
    });

    it("stops invoking a listener after it is unregistered", () => {
      const onRequest = jest.fn().mockName("onRequest");
      const off = http.listener.on("Http.request", onRequest);
      off();
      http.request({method: "GET", path: "/profiles"});

      expect(onRequest).not.toHaveBeenCalled();
    });

    it("fetches unchanged when no request listeners are registered", () => {
      http.request({method: "GET", path: "/profiles"});

      expect(lastHeaders()).not.toHaveProperty("X-Request-Id");
    });

    it("passes query params", () => {
      http.request({method: "GET", path: "/profiles", params: {locale_key: "en-us"}});

      const [url] = lastFetch();

      expect(url).toEqual("https://api.traitify.com/v1/profiles?locale_key=en-us");
    });

    it("combines query params", () => {
      http.request({method: "GET", path: "/profiles?per_page=10", params: {locale_key: "en-us"}});

      const [url] = lastFetch();

      expect(url).toEqual("https://api.traitify.com/v1/profiles?per_page=10&locale_key=en-us");
    });

    it("passes body params", () => {
      http.request({method: "POST", path: "/profiles", params: {locale_key: "en-us"}});

      const [url, options] = lastFetch();

      expect(url).toEqual("https://api.traitify.com/v1/profiles");
      expect(options.body).toEqual(JSON.stringify({locale_key: "en-us"}));
    });

    it("returns parsed json", () => {
      const json = JSON.parse(`[{"name": "Neo"}]`);
      fetch.mockImplementationOnce(() => Promise.resolve({json: () => json}));

      const response = http.request({method: "GET", path: "/profiles"});

      return expect(response).resolves.toEqual([{name: "Neo"}]);
    });

    describe("retry", () => {
      const jsonResponse = (status, json = {}) => ({json: () => json, ok: status < 400, status});

      it("retries when autoRetry is enabled", async() => {
        http = new Http({authKey: "xyz", autoRetry: true, retryOptions: {statuses: [503]}});
        fetch
          .mockResolvedValueOnce(jsonResponse(503))
          .mockResolvedValueOnce(jsonResponse(200, {name: "Neo"}));
        const result = http.request({method: "GET", path: "/profiles"});

        await flushAsync(Infinity);

        await expect(result).resolves.toEqual({name: "Neo"});
        expect(fetch).toHaveBeenCalledTimes(2);
      });

      it("does not retry when autoRetry is disabled", async() => {
        fetch.mockResolvedValue(jsonResponse(503));
        const result = http.request({method: "GET", path: "/profiles"});

        await flushAsync(Infinity);

        await result;
        expect(fetch).toHaveBeenCalledTimes(1);
      });

      it("enables retry via per-request retryOptions", async() => {
        fetch
          .mockResolvedValueOnce(jsonResponse(503))
          .mockResolvedValueOnce(jsonResponse(200, {name: "Neo"}));
        const result = http.request({
          method: "GET",
          path: "/profiles",
          retryOptions: {statuses: [503]}
        });

        await flushAsync(Infinity);

        await expect(result).resolves.toEqual({name: "Neo"});
        expect(fetch).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("get", () => {
    it("makes request", () => {
      http.request = jest.fn().mockName("request");
      http.get("/profiles", {locale_key: "en-us"});

      expect(http.request).toHaveBeenCalledWith({method: "GET", path: "/profiles", params: {locale_key: "en-us"}});
    });
  });

  describe("put", () => {
    it("makes request", () => {
      http.request = jest.fn().mockName("request");
      http.put("/profiles", {locale_key: "en-us"});

      expect(http.request).toHaveBeenCalledWith({method: "PUT", path: "/profiles", params: {locale_key: "en-us"}});
    });
  });

  describe("post", () => {
    it("makes request", () => {
      http.request = jest.fn().mockName("request");
      http.post("/profiles", {locale_key: "en-us"});

      expect(http.request).toHaveBeenCalledWith({method: "POST", path: "/profiles", params: {locale_key: "en-us"}});
    });
  });

  describe("delete", () => {
    it("makes request", () => {
      http.request = jest.fn().mockName("request");
      http.delete("/profiles", {locale_key: "en-us"});

      expect(http.request).toHaveBeenCalledWith({method: "DELETE", path: "/profiles", params: {locale_key: "en-us"}});
    });
  });
});
