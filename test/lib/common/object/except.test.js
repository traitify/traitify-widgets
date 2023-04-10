import except from "lib/common/object/except";

describe("Object", () => {
  describe("except", () => {
    it("removes keys", () => {
      const object = {a: "aye", b: "bee", c: "sea"};
      const value = except(object, ["a", "c"]);

      expect(value).toEqual({b: "bee"});
    });

    it("returns new object", () => {
      const object = {a: "aye", b: "bee", c: "sea"};
      const value = except(object, ["d", "c"]);

      expect(value).toEqual({a: "aye", b: "bee"});
      expect(value).not.toBe(object);
    });
  });
});
