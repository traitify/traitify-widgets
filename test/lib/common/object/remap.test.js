import remap from "lib/common/object/remap";

describe("Object", () => {
  describe("remap", () => {
    it("remaps keys", () => {
      const object = {a: "aye", b: "bee", c: "sea"};
      const value = remap(object, {a: "eh", c: "see"});

      expect(value).toEqual({b: "bee", eh: "aye", see: "sea"});
    });

    it("returns new object", () => {
      const object = {a: "aye", b: "bee", c: "sea"};
      const value = remap(object, {a: "eh", f: "ef"});

      expect(value).toEqual({b: "bee", c: "sea", eh: "aye"});
      expect(value).not.toBe(object);
    });
  });
});
