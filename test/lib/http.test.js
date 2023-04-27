import Http from "lib/http";
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
        options = {authKey: "abc", host: "http://api.example.com", version: "v2"};
        http = new Http(options);
      });

      it("has authKey", () => {
        expect(http.authKey).toBe(options.authKey);
      });

      it("has host", () => {
        expect(http.host).toBe(options.host);
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
      http.request("GET", "/profiles", {locale_key: "en-us"});

      expect(lastHeaders()).toEqual(
        expect.objectContaining({
          "Accept": "application/json",
          "Authorization": `Basic ${btoa("xyz:x")}`,
          "Content-Type": "application/json"
        })
      );
    });

    it("passes query params", () => {
      http.request("GET", "/profiles", {locale_key: "en-us"});

      const [url] = lastFetch();

      expect(url).toEqual("https://api.traitify.com/v1/profiles?locale_key=en-us");
    });

    it("combines query params", () => {
      http.request("GET", "/profiles?per_page=10", {locale_key: "en-us"});

      const [url] = lastFetch();

      expect(url).toEqual("https://api.traitify.com/v1/profiles?per_page=10&locale_key=en-us");
    });

    it("passes body params", () => {
      http.request("POST", "/profiles", {locale_key: "en-us"});

      const [url, options] = lastFetch();

      expect(url).toEqual("https://api.traitify.com/v1/profiles");
      expect(options.body).toEqual(JSON.stringify({locale_key: "en-us"}));
    });

    it("returns parsed json", () => {
      const json = JSON.parse(`[{"name": "Neo"}]`);
      fetch.mockImplementationOnce(() => Promise.resolve({json: () => json}));

      const response = http.request("GET", "/profiles");

      return expect(response).resolves.toEqual([{name: "Neo"}]);
    });
  });

  describe("get", () => {
    it("makes request", () => {
      http.request = jest.fn().mockName("request");
      http.get("/profiles", {locale_key: "en-us"});

      expect(http.request).toHaveBeenCalledWith("GET", "/profiles", {locale_key: "en-us"});
    });
  });

  describe("put", () => {
    it("makes request", () => {
      http.request = jest.fn().mockName("request");
      http.put("/profiles", {locale_key: "en-us"});

      expect(http.request).toHaveBeenCalledWith("PUT", "/profiles", {locale_key: "en-us"});
    });
  });

  describe("post", () => {
    it("makes request", () => {
      http.request = jest.fn().mockName("request");
      http.post("/profiles", {locale_key: "en-us"});

      expect(http.request).toHaveBeenCalledWith("POST", "/profiles", {locale_key: "en-us"});
    });
  });

  describe("delete", () => {
    it("makes request", () => {
      http.request = jest.fn().mockName("request");
      http.delete("/profiles", {locale_key: "en-us"});

      expect(http.request).toHaveBeenCalledWith("DELETE", "/profiles", {locale_key: "en-us"});
    });
  });
});
