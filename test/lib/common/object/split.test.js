import split from "lib/common/object/split";

describe("Object", () => {
  describe("split", () => {
    it("removes keys", () => {
      const object = {a: "aye", b: "bee", c: "sea"};
      const [value, excluded] = split(object, ["a", "c"]);

      expect(excluded).toEqual({b: "bee"});
      expect(value).toEqual({a: "aye", c: "sea"});
    });

    it("returns new object", () => {
      const object = {a: "aye", b: "bee", c: "sea"};
      const [value, excluded] = split(object, ["d", "c"]);

      expect(excluded).toEqual({a: "aye", b: "bee"});
      expect(excluded).not.toBe(object);
      expect(value).toEqual({c: "sea"});
      expect(value).not.toBe(object);
    });
  });
});
