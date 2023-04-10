import toQueryString from "lib/common/object/to-query-string";

describe("Object", () => {
  describe("toQueryString", () => {
    it("returns string", () => {
      const object = {a: "aye", b: "bee", c: "sea"};
      const value = toQueryString(object);

      expect(value).toBe("a=aye&b=bee&c=sea");
    });
  });
});
