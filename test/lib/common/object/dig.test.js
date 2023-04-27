import dig from "lib/common/object/dig";

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
});
