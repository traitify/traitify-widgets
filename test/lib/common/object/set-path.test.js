import setPath from "lib/common/object/set-path";

describe("Object", () => {
  describe("setPath", () => {
    it("creates intermediate objects for missing keys", () => {
      const object = {};
      setPath(object, "a.b.c", "value");

      expect(object).toEqual({a: {b: {c: "value"}}});
    });

    it("mutates the object", () => {
      const object = {};
      setPath(object, "key", "value");

      expect(object.key).toBe("value");
    });

    it("overwrites a non-object intermediate with an object", () => {
      const object = {a: "string"};
      setPath(object, "a.b", "value");

      expect(object).toEqual({a: {b: "value"}});
    });

    it("preserves existing keys when setting a nested value", () => {
      const object = {a: {sibling: "keep", target: "old"}};
      setPath(object, "a.target", "new");

      expect(object).toEqual({a: {sibling: "keep", target: "new"}});
    });

    it("sets a nested value", () => {
      const object = {a: {b: "old"}};
      setPath(object, "a.b", "new");

      expect(object).toEqual({a: {b: "new"}});
    });

    it("sets a shallow value", () => {
      const object = {};
      setPath(object, "key", "value");

      expect(object).toEqual({key: "value"});
    });
  });
});
