import {dig, except, mutable, remap, slice} from "lib/helpers/object";

describe("Object", () => {
  describe("dig", () => {
    it("returns nested object", () => {
      const object = {what: {does: {this: "do"}}};
      const value = dig(object, "what", "does");

      expect(value).toEqual({this: "do"});
    });

    it("returns nested string", () => {
      const object = {what: {does: "this"}};
      const value = dig(object, "what", "does");

      expect(value).toBe("this");
    });

    it("returns shallow object", () => {
      const object = {what: {does: "this"}};
      const value = dig(object, "what");

      expect(value).toEqual({does: "this"});
    });

    it("returns shallow value", () => {
      const object = {what: "does"};
      const value = dig(object, "what");

      expect(value).toBe("does");
    });

    it("gives up", () => {
      const object = {};
      const value = dig(object, "what", "does", "this", "do");

      expect(value).toBeNull();
    });

    it("gives up quickly", () => {
      const object = null;
      const value = dig(object, "what", "does", "this", "do");

      expect(value).toBeNull();
    });
  });

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
