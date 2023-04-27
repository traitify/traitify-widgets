import slice from "lib/common/object/slice";

describe("Object", () => {
  describe("slice", () => {
    it("removes keys", () => {
      const object = {a: "aye", b: "bee", c: "sea"};
      const value = slice(object, ["a", "c"]);

      expect(value).toEqual({a: "aye", c: "sea"});
    });

    it("returns new object", () => {
      const object = {a: "aye", b: "bee", c: "sea"};
      const value = slice(object, ["d", "c"]);

      expect(value).toEqual({c: "sea"});
      expect(value).not.toBe(object);
    });
  });
});
