import get from "lib/common/object/get";

describe("Object", () => {
  describe("get", () => {
    it("returns value", () => {
      const object = {what: {is: "up"}};
      const value = get(object, "what", "fall");

      expect(value).toEqual({is: "up"});
    });

    it("returns fallback", () => {
      const object = {what: {is: "up"}};
      const value = get(object, "where", "fall");

      expect(value).toEqual("fall");
    });

    it("returns fallback if object is blank", () => {
      const object = null;
      const value = get(object, "what", "fall");

      expect(value).toEqual("fall");
    });
  });
});
