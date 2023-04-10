import mutable from "lib/common/object/mutable";

describe("Object", () => {
  describe("mutable", () => {
    it("copies nested arrays", () => {
      const object = {what: ["does", "this", "do"]};
      const value = mutable(object);

      expect(value).toEqual(object);
      expect(value).not.toBe(object);
      expect(value.what).not.toBe(object.what);
    });

    it("copies nested objects", () => {
      const object = {what: {does: {this: "do"}}};
      const value = mutable(object);

      expect(value).toEqual(object);
      expect(value).not.toBe(object);
      expect(value.what).not.toBe(object.what);
    });

    it("copies nested strings", () => {
      const object = {what: {does: {this: "do"}}};
      const value = mutable(object);

      object.what.does.this = "mean";

      expect(value).not.toEqual(object);
      expect(value.what.does.this).not.toBe(object.what.does.this);
    });
  });
});
