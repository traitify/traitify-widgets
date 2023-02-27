import last from "lib/common/array/last";
import Http from "lib/http";
import useGlobalMock from "support/hooks/use-global-mock";

describe("Http", () => {
  let http;

  beforeEach(() => {
    http = new Http({authKey: "xyz"});
  });

  describe("constructor", () => {
    describe("minimum", () => {
      it("has authKey", () => {
        expect(http.authKey).toBe("xyz");
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

  describe("ajax", () => {
    useGlobalMock(global, "fetch");

    const lastFetch = () => last(fetch.mock.calls);
    const lastHeaders = () => {
      console.log(lastFetch()[1].headers);
    };

    describe("graphql", () => {
      let params;

      beforeEach(() => {
        params = `{ guide(localeKey:"en-US",assessmentId:"xyz") { name competencies { id name } }}`;

        http.post("/interview_guides/graphql", params);
      });

      it("includes headers", () => {
        expect(lastHeaders()).toBe(
          expect.objectContaining({
            "Accept": "application/json",
            "Authorization": `Basic ${btoa("xyz:x")}`,
            "Content-type": "application/graphql"
          })
        );
      });

      it("passes params", () => {
        const url = fetch.mock.calls[0][1];

        expect(url).toEqual("https://api.traitify.com/v1/interview_guides/graphql");
        expect(fetch).toHaveBeenCalledWith(params);
      });
    });

    it("includes authorization through headers", () => {
      http.ajax("GET", "/profiles", {locale_key: "en-us"});

      expect(lastHeaders()).toBe(expect.objectContaining({Authorization: `Basic ${btoa("xyz:x")}`}));
    });

    it("includes authorization through query string", () => {
      http.ajax("GET", "/assessments", {locale_key: "en-us"});

      const url = lastFetch()[0];

      expect(url).toContain("authorization=xyz");
    });

    it("includes headers", () => {
      http.ajax("GET", "/profiles", {locale_key: "en-us"});

      expect(lastHeaders()).toBe(
        expect.objectContaining({
          "Accept": "application/json",
          "Content-type": "application/json"
        })
      );
    });

    it("passes query params", () => {
      http.ajax("GET", "/profiles", {locale_key: "en-us"});

      const url = lastFetch()[0];

      expect(url).toEqual("https://api.traitify.com/v1/profiles?locale_key=en-us");
    });

    it("combines query params", () => {
      http.ajax("GET", "/profiles?per_page=10", {locale_key: "en-us"});

      const url = lastFetch()[0];

      expect(url).toEqual("https://api.traitify.com/v1/profiles?per_page=10&locale_key=en-us");
    });

    it("passes body params", () => {
      http.ajax("POST", "/profiles", {locale_key: "en-us"});

      const [url, options] = lastFetch();

      expect(url).toEqual("https://api.traitify.com/v1/profiles");
      expect(options.body).toEqual(JSON.stringify({locale_key: "en-us"}));
    });

    /*
    it("returns parsed responseText", () => {
      const response = http.ajax("GET", "/profiles");
      const xhr = XMLHttpRequest.mock.results[0].value;

      xhr.status = 200;
      xhr.response = `[{"name": "Neo"}]`;
      xhr.onload();

      return expect(response).resolves.toEqual([{name: "Neo"}]);
    });
    */
  });

  describe("get", () => {
    it("makes ajax request", () => {
      http.ajax = jest.fn().mockName("ajax");
      http.get("/profiles", {locale_key: "en-us"});

      expect(http.ajax).toHaveBeenCalledWith("GET", "/profiles", {locale_key: "en-us"});
    });
  });

  describe("put", () => {
    it("makes ajax request", () => {
      http.ajax = jest.fn().mockName("ajax");
      http.put("/profiles", {locale_key: "en-us"});

      expect(http.ajax).toHaveBeenCalledWith("PUT", "/profiles", {locale_key: "en-us"});
    });
  });

  describe("post", () => {
    it("makes ajax request", () => {
      http.ajax = jest.fn().mockName("ajax");
      http.post("/profiles", {locale_key: "en-us"});

      expect(http.ajax).toHaveBeenCalledWith("POST", "/profiles", {locale_key: "en-us"});
    });
  });

  describe("delete", () => {
    it("makes ajax request", () => {
      http.ajax = jest.fn().mockName("ajax");
      http.delete("/profiles", {locale_key: "en-us"});

      expect(http.ajax).toHaveBeenCalledWith("DELETE", "/profiles", {locale_key: "en-us"});
    });
  });
});
